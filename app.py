import hashlib
import logging
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, g, jsonify, render_template, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.exceptions import HTTPException
from werkzeug.middleware.proxy_fix import ProxyFix

# ==========================
# CONFIGURAÇÃO
# ==========================

BASE_DIR = Path(__file__).resolve().parent
SQLITE_PATH = str(BASE_DIR / "database.db")

DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
IS_PG = bool(DATABASE_URL)
IS_VERCEL = bool(os.environ.get("VERCEL"))

MAIN_URL = os.environ.get("MAIN_URL", "https://code-quest-bice.vercel.app").strip().rstrip("/")
XP_PER_LEVEL = 50
LAB_TOKEN_SALT = "codequest-lab-v1"  # precisa ser igual ao do CodeQuest
LAB_TOKEN_MAX_AGE = int(os.environ.get("LAB_TOKEN_MAX_AGE", "86400"))
BUGHUNT_XP = int(os.environ.get("BUGHUNT_XP", "20"))
BUGHUNT_BADGE_AT = max(1, int(os.environ.get("BUGHUNT_BADGE_AT", "3")))
VERCEL_ANALYTICS = os.environ.get("VERCEL_ANALYTICS", "0") == "1"
PYODIDE_BASE = os.environ.get("PYODIDE_BASE", "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/")
SQLJS_BASE = os.environ.get("SQLJS_BASE", "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/")
ASSET_VERSION = os.environ.get("ASSET_VERSION") or os.environ.get("VERCEL_GIT_COMMIT_SHA", "")[:7] or "1"

LANGUAGES = {"python", "sql", "javascript", "css", "html"}

# Mesmos ids de static/js/bughunt.js (o total aparece como "x/8" no CodeQuest)
BUGHUNT_IDS = [
    "par_impar", "fatorial", "maior_numero", "contagem",
    "inverter_texto", "soma_pares", "vogais", "fizzbuzz",
]

# Conquistas que o navegador pode pedir (puramente de exploração/estética, sem XP)
CLIENT_BADGES = {"estilista_extremo"}

BADGE_DEFAULTS = {
    "lab_explorador": ("Explorador do LAB", "Visitou o CodeQuest LAB pela primeira vez.", "🧪", False),
    "mestre_bugs": ("Mestre dos Bugs", "Corrigiu vários desafios do Bug Hunt no CodeQuest LAB.", "🐛", False),
    "estilista_extremo": ("Estilista Extremo", "Levou todos os controles do Studio CSS ao máximo.", "🎨", True),
    "bug_hunter_pro": ("Bug Hunter Pro", "Resolveu um desafio do Bug Hunt de primeira, sem dicas e sem erros.", "🎯", True),
}


def _derive_secret(label):
    # IDÊNTICO ao do CodeQuest: se os dois projetos usam a mesma DATABASE_URL,
    # os segredos coincidem sem configuração extra.
    base = DATABASE_URL or "codequest-local-dev"
    return hashlib.sha256(f"codequest:{label}:{base}".encode("utf-8")).hexdigest()


LAB_SECRET = os.environ.get("LAB_SHARED_SECRET") or _derive_secret("lab")

logging.basicConfig(level=logging.INFO)

app = Flask(
    __name__,
    static_folder=str(BASE_DIR / "static"),
    static_url_path="/static",
    template_folder=str(BASE_DIR / "templates"),
)
app.config["JSON_AS_ASCII"] = False
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

# ==========================
# BANCO DE DADOS
# ==========================

if IS_PG:
    import psycopg2

    DB_ERRORS = (psycopg2.Error,)
else:
    DB_ERRORS = (sqlite3.Error,)


class Database:
    def __init__(self, conn):
        self.conn = conn

    def execute(self, sql, params=()):
        cur = self.conn.cursor()
        cur.execute(sql if IS_PG else sql.replace("%s", "?"), tuple(params))
        return cur

    def fetchone(self, sql, params=()):
        cur = self.execute(sql, params)
        try:
            return cur.fetchone()
        finally:
            cur.close()

    def fetchall(self, sql, params=()):
        cur = self.execute(sql, params)
        try:
            return cur.fetchall()
        finally:
            cur.close()

    def commit(self):
        self.conn.commit()

    def rollback(self):
        self.conn.rollback()

    def close(self):
        self.conn.close()


def open_db():
    if IS_PG:
        kwargs = {"connect_timeout": 10}
        if "sslmode" not in DATABASE_URL:
            kwargs["sslmode"] = os.environ.get("DB_SSLMODE", "require" if "supabase" in DATABASE_URL else "prefer")
        return Database(psycopg2.connect(DATABASE_URL, **kwargs))
    if IS_VERCEL:
        raise RuntimeError("DATABASE_URL não está configurada no projeto do LAB na Vercel.")
    return Database(sqlite3.connect(SQLITE_PATH, timeout=10))


def get_db():
    if "db" not in g:
        g.db = open_db()
    return g.db


@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db is not None:
        try:
            db.rollback()
            db.close()
        except Exception:  # noqa: BLE001
            pass


# ==========================
# IDENTIFICAÇÃO (token assinado)
# ==========================

def _serializer():
    return URLSafeTimedSerializer(LAB_SECRET, salt=LAB_TOKEN_SALT)


def resolve_user_id(data=None):
    """
    Descobre o aluno a partir do token assinado. Aceita (nesta ordem):
    header X-CQ-Token, campo "token" e campo "user_id" do JSON (compatibilidade com o front antigo).

    Retorna (user_id | None, motivo) com motivo em {"ok", "missing", "expired", "invalid"}.
    Um id numérico "puro" NUNCA é aceito: seria falsificável.
    """
    data = data if isinstance(data, dict) else {}
    candidates = [request.headers.get("X-CQ-Token"), data.get("token"), data.get("user_id")]
    reason = "missing"
    for cand in candidates:
        if not isinstance(cand, str) or not cand.strip():
            continue
        try:
            payload = _serializer().loads(cand.strip(), max_age=LAB_TOKEN_MAX_AGE)
            return int(payload["uid"]), "ok"
        except SignatureExpired:
            reason = "expired"
        except (BadSignature, KeyError, TypeError, ValueError):
            if reason == "missing":
                reason = "invalid"
    return None, reason


def get_level(xp):
    return (xp or 0) // XP_PER_LEVEL


def touch_last_seen(db, user_id):
    """Marca 'visto por último' (o painel admin do CodeQuest usa isso para o 'online agora')."""
    try:
        db.execute("UPDATE users SET last_seen=%s WHERE id=%s",
                   (datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"), user_id)).close()
    except DB_ERRORS:
        db.rollback()  # coluna ainda não existe (init_db.py não rodou): segue sem


def award_badge(db, user_id, code):
    """Concede a conquista se ainda não existir. Retorna dict se foi NOVA, senão None. Não faz commit."""
    row = db.fetchone("SELECT id, name, description, icon, secret FROM badges WHERE code=%s", (code,))
    if not row and code in BADGE_DEFAULTS:
        name, desc, icon, secret = BADGE_DEFAULTS[code]
        db.execute(
            "INSERT INTO badges (code, name, description, icon, secret) VALUES (%s, %s, %s, %s, %s) "
            "ON CONFLICT (code) DO NOTHING",
            (code, name, desc, icon, secret),
        ).close()
        row = db.fetchone("SELECT id, name, description, icon, secret FROM badges WHERE code=%s", (code,))
    if not row:
        return None

    cur = db.execute(
        "INSERT INTO user_badges (user_id, badge_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
        (user_id, row[0]),
    )
    is_new = cur.rowcount == 1
    cur.close()
    if not is_new:
        return None
    return {"code": code, "name": row[1], "description": row[2], "icon": row[3], "secret": bool(row[4])}


def solved_challenges(db, user_id):
    rows = db.fetchall(
        "SELECT DISTINCT CAST(challenge_id AS TEXT) FROM lab_submissions "
        "WHERE CAST(user_id AS TEXT)=%s AND passed=%s",
        (str(user_id), True),
    )
    return [r[0] for r in rows if r[0] in BUGHUNT_IDS]


def _truthy(value):
    if isinstance(value, str):
        return value.strip().lower() in ("1", "true", "yes", "sim")
    return bool(value)


def _guest(message, **extra):
    payload = {"success": True, "guest_mode": True, "message": message}
    payload.update(extra)
    return jsonify(payload)


# ==========================
# PÁGINAS
# ==========================

def _page(template, **ctx):
    resp = app.make_response(render_template(
        template,
        main_url=MAIN_URL,
        asset_v=ASSET_VERSION,
        analytics=VERCEL_ANALYTICS,
        pyodide_base=PYODIDE_BASE,
        sqljs_base=SQLJS_BASE,
        bughunt_total=len(BUGHUNT_IDS),
        **ctx,
    ))
    resp.headers["Cache-Control"] = "no-cache"
    return resp


@app.route("/")
def index():
    return _page("index.html", page="home", lab_to="lab")


@app.route("/sandbox")
def sandbox():
    return _page("sandbox.html", page="sandbox", lab_to="python")


@app.route("/bug-hunt")
def bughunt():
    return _page("bughunt.html", page="bughunt", lab_to="bughunt")


@app.route("/studio-css")
def studio():
    return _page("studio.html", page="studio", lab_to="css")


@app.route("/health")
def health():
    try:
        get_db().fetchone("SELECT 1")
    except Exception:  # noqa: BLE001
        app.logger.exception("Health check falhou")
        return jsonify({"status": "error", "database": False}), 503
    return jsonify({"status": "ok", "database": "postgres" if IS_PG else "sqlite"})


# ==========================
# API
# ==========================

@app.route("/api/lab/session", methods=["POST"])
def lab_session():
    """Chamado ao abrir qualquer página do LAB: valida o token, marca 'online' e concede 'Explorador do LAB'."""
    data = request.get_json(silent=True) or {}
    uid, reason = resolve_user_id(data)
    if not uid:
        return jsonify({"authenticated": False, "guest_mode": True, "reason": reason})

    db = get_db()
    try:
        user = db.fetchone("SELECT id, username, xp FROM users WHERE id=%s", (uid,))
        if not user:
            return jsonify({"authenticated": False, "guest_mode": True, "reason": "unknown_user"})
        touch_last_seen(db, uid)
        new_badges = [b for b in (award_badge(db, uid, "lab_explorador"),) if b]
        db.commit()
        solved = solved_challenges(db, uid)
    except DB_ERRORS:
        db.rollback()
        app.logger.exception("Erro ao registrar sessão do LAB")
        return jsonify({"authenticated": False, "guest_mode": True, "reason": "db_error"}), 503

    return jsonify({
        "authenticated": True,
        "guest_mode": False,
        "username": user[1],
        "xp": user[2] or 0,
        "level": get_level(user[2]),
        "solved": solved,
        "bughunt_total": len(BUGHUNT_IDS),
        "new_badges": new_badges,
    })


@app.route("/api/lab/secret", methods=["POST"])
def lab_secret():
    """Conquistas secretas de exploração pedidas pelo navegador (lista fechada, sem XP)."""
    data = request.get_json(silent=True) or {}
    code = str(data.get("code") or "")
    if code not in CLIENT_BADGES:
        return jsonify({"success": False, "error": "Conquista inválida."}), 400
    uid, _reason = resolve_user_id(data)
    if not uid:
        return jsonify({"success": True, "guest_mode": True, "new_badges": []})

    db = get_db()
    try:
        badge = award_badge(db, uid, code)
        db.commit()
    except DB_ERRORS:
        db.rollback()
        app.logger.exception("Erro ao conceder conquista secreta")
        return jsonify({"success": False, "error": "Tente novamente em instantes."}), 500
    return jsonify({"success": True, "guest_mode": False, "new_badges": [badge] if badge else []})


@app.route("/api/bughunt/progress")
def bughunt_progress():
    uid, reason = resolve_user_id()
    if not uid:
        return jsonify({"authenticated": False, "solved": [], "total": len(BUGHUNT_IDS), "reason": reason})
    db = get_db()
    try:
        solved = solved_challenges(db, uid)
    except DB_ERRORS:
        db.rollback()
        return jsonify({"authenticated": True, "solved": [], "total": len(BUGHUNT_IDS), "reason": "db_error"}), 503
    return jsonify({"authenticated": True, "solved": solved, "total": len(BUGHUNT_IDS)})


@app.route("/api/bughunt/submit", methods=["POST"])
def submit_bughunt():
    data = request.get_json(silent=True) or {}
    passed = _truthy(data.get("passed"))
    challenge_id = str(data.get("challenge_id") if data.get("challenge_id") is not None else "").strip()[:64]
    language = str(data.get("language") or "python").strip().lower()
    if language not in LANGUAGES:
        language = "python"
    hints_used = data.get("hints_used")
    clean = _truthy(data.get("clean")) and (hints_used in (0, "0", None))

    uid, reason = resolve_user_id(data)

    # ---- Modo Convidado (sem login, token inválido ou expirado) ----
    if not uid:
        if reason in ("expired", "invalid"):
            msg = "Sua sessão do LAB expirou. Abra o LAB novamente pelo CodeQuest para salvar progresso e XP."
        elif passed:
            msg = "Código correto! Faça login no CodeQuest para salvar seu progresso e XP."
        else:
            msg = "Ainda não passou nos testes. Continue tentando!"
        return _guest(msg, session_expired=reason in ("expired", "invalid"))

    if challenge_id not in BUGHUNT_IDS:
        return jsonify({"success": False, "error": "Desafio desconhecido."}), 400

    db = get_db()
    try:
        # trava a linha do aluno: envios simultâneos não duplicam XP/conquistas
        user = db.fetchone(
            "SELECT id, xp FROM users WHERE id=%s" + (" FOR UPDATE" if IS_PG else ""), (uid,)
        )
        if not user:
            return _guest("Usuário não encontrado. Abra o LAB novamente pelo CodeQuest.", session_expired=True)

        prior = db.fetchone(
            "SELECT COUNT(*), COALESCE(SUM(CASE WHEN passed=%s THEN 1 ELSE 0 END), 0) FROM lab_submissions "
            "WHERE CAST(user_id AS TEXT)=%s AND CAST(challenge_id AS TEXT)=%s",
            (True, str(uid), challenge_id),
        )
        prior_total, prior_passed = int(prior[0]), int(prior[1])
        already = prior_passed > 0
        db.execute(
            "INSERT INTO lab_submissions (user_id, challenge_id, language, passed) VALUES (%s, %s, %s, %s)",
            (uid, challenge_id, language, passed),
        ).close()

        touch_last_seen(db, uid)
        new_badges = []
        xp_awarded = 0
        explorer = award_badge(db, uid, "lab_explorador")  # usou o LAB logado
        if explorer:
            new_badges.append(explorer)

        if passed and not already:
            xp_awarded = BUGHUNT_XP
            db.execute("UPDATE users SET xp = COALESCE(xp, 0) + %s WHERE id=%s", (xp_awarded, uid)).close()
            solved = db.fetchone(
                "SELECT COUNT(DISTINCT CAST(challenge_id AS TEXT)) FROM lab_submissions "
                "WHERE CAST(user_id AS TEXT)=%s AND passed=%s",
                (str(uid), True),
            )[0]
            if solved >= BUGHUNT_BADGE_AT:
                bug_master = award_badge(db, uid, "mestre_bugs")
                if bug_master:
                    new_badges.append(bug_master)
            # secreta: 1ª tentativa registrada, sem dicas e sem erros no terminal
            if prior_total == 0 and clean:
                pro = award_badge(db, uid, "bug_hunter_pro")
                if pro:
                    new_badges.append(pro)

        xp_total = (db.fetchone("SELECT xp FROM users WHERE id=%s", (uid,))[0]) or 0
        solved_list = solved_challenges(db, uid)
        db.commit()
    except DB_ERRORS:
        db.rollback()
        app.logger.exception("Erro ao salvar envio do Bug Hunt")
        return jsonify({
            "success": False,
            "error": "Não foi possível salvar seu progresso agora. Tente novamente em instantes.",
        }), 500

    bug_badge = next((b for b in new_badges if b["code"] == "mestre_bugs"), None)
    if not passed:
        message = "Tentativa registrada. Revise o código e tente de novo!"
    elif already:
        message = "Você já concluiu este desafio antes. O XP não é duplicado."
    else:
        message = f"Desafio concluído com sucesso! +{xp_awarded} XP salvo."
        if new_badges:
            message += " Conquista desbloqueada!"

    return jsonify({
        "success": True,
        "guest_mode": False,
        "passed": passed,
        "already_completed": bool(passed and already),
        "message": message,
        "badge_earned": f"{bug_badge['icon']} {bug_badge['name']}" if bug_badge else "",
        "new_badges": new_badges,
        "xp_awarded": xp_awarded,
        "xp": xp_total,
        "level": get_level(xp_total),
        "solved": solved_list,
        "bughunt_total": len(BUGHUNT_IDS),
    })


# ==========================
# ERROS E CABEÇALHOS
# ==========================

@app.errorhandler(Exception)
def handle_exception(exc):
    if isinstance(exc, HTTPException):
        if request.path.startswith("/api/"):
            return jsonify({"success": False, "error": exc.description}), exc.code
        if exc.code == 404:
            return ("Página não encontrada. <a href='/'>Voltar ao LAB</a>", 404)
        return exc
    app.logger.exception("Erro não tratado em %s", request.path)
    if request.path.startswith("/api/"):
        return jsonify({"success": False, "error": "Erro interno. Tente novamente em instantes."}), 500
    return "Erro interno. Tente novamente em instantes.", 500


@app.after_request
def after_request(resp):
    resp.headers.setdefault("X-Content-Type-Options", "nosniff")
    resp.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    if request.path.startswith("/api/") or request.path == "/health":
        resp.headers["Cache-Control"] = "no-store"
    return resp


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=os.environ.get("FLASK_DEBUG", "1") == "1",
    )
