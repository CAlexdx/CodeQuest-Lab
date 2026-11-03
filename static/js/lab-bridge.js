/*!
 * CodeQuest LAB - ponte com o CodeQuest
 *
 * Responsabilidades (nesta ordem):
 *  1) Pegar o token de sessão que o CodeQuest manda no fragmento da URL (#cq=...), guardar no
 *     navegador e limpar o endereço (o token não fica visível nem vai para logs de servidor).
 *     Também aceita ?token= / ?user_id= (links antigos).
 *  2) Enviar o token em toda chamada /api/ (cabeçalho X-CQ-Token).
 *  3) Avisar o servidor que o aluno abriu o LAB (POST /api/lab/session): marca "online" e dá a
 *     conquista "Explorador do LAB". Mostra o nome/XP no topo e um aviso se estiver como convidado.
 *  4) Tema claro/escuro sincronizado com o CodeQuest (chave 'codequest_theme' + ?theme=).
 *
 * Tudo que mexe com localStorage fica em try/catch (modo privado e bloqueios não derrubam a página).
 * Expõe window.CQ = { ready, session, api, theme, token }.
 */
(function (w, d) {
  "use strict";

  var CFG = w.CQ_CONFIG || {};
  var script = d.currentScript;
  var MAIN = String((script && script.getAttribute("data-main-origin")) || CFG.mainUrl || "").replace(/\/+$/, "");
  var AUTH_KEY = "cq_lab_auth";
  var THEME_KEY = "codequest_theme";
  var HEARTBEAT_MS = 4 * 60 * 1000;

  /* ---------- armazenamento seguro ---------- */
  function lsGet(key) { try { return w.localStorage.getItem(key); } catch (e) { return null; } }
  function lsSet(key, value) { try { w.localStorage.setItem(key, value); return true; } catch (e) { return false; } }
  function lsDel(key) { try { w.localStorage.removeItem(key); } catch (e) { /* ignora */ } }

  /* ---------- 1) token ---------- */
  var memoryToken = "";

  function readStoredToken() {
    var raw = lsGet(AUTH_KEY);
    if (!raw) return "";
    try {
      var obj = JSON.parse(raw);
      return obj && typeof obj.token === "string" ? obj.token : "";
    } catch (e) { return ""; }
  }

  function captureToken() {
    var found = "";
    var hash = new URLSearchParams((location.hash || "").replace(/^#/, ""));
    var query = new URLSearchParams(location.search || "");
    found = hash.get("cq") || query.get("token") || query.get("user_id") || "";
    found = String(found).trim();

    if (found) {
      memoryToken = found;
      lsSet(AUTH_KEY, JSON.stringify({ token: found, ts: Date.now() }));
      // limpa o endereço: mantém só o que não é segredo (tema, linguagem, etc.)
      hash.delete("cq");
      query.delete("token");
      query.delete("user_id");
      var qs = query.toString();
      var hs = hash.toString();
      try {
        w.history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + (hs ? "#" + hs : ""));
      } catch (e) { /* ignora */ }
    }
    return memoryToken || readStoredToken();
  }

  var token = captureToken();

  function setToken(value) {
    token = value || "";
    memoryToken = token;
    if (!token) lsDel(AUTH_KEY);
  }

  /* ---------- 2) fetch com X-CQ-Token em /api/ ---------- */
  var nativeFetch = w.fetch;
  if (typeof nativeFetch === "function") {
    w.fetch = function (input, init) {
      try {
        var url = typeof input === "string" ? input : (input instanceof URL ? input.href : "");
        if (token && url) {
          var u = new URL(url, location.href);
          if (u.origin === location.origin && u.pathname.indexOf("/api/") === 0) {
            init = init || {};
            var headers = new Headers(init.headers || {});
            if (!headers.has("X-CQ-Token")) headers.set("X-CQ-Token", token);
            init.headers = headers;
          }
        }
      } catch (e) { /* nunca atrapalhar a página */ }
      return nativeFetch.call(w, input, init);
    };
  }

  /* ---------- 4) tema ---------- */
  var theme = {
    get: function () {
      var v = d.documentElement.getAttribute("data-theme");
      return v === "light" ? "light" : "dark";
    },
    apply: function (value) {
      value = value === "light" ? "light" : "dark";
      d.documentElement.setAttribute("data-theme", value);
      lsSet(THEME_KEY, value);
      theme.paint();
      return value;
    },
    toggle: function () { return theme.apply(theme.get() === "dark" ? "light" : "dark"); },
    paint: function () {
      var icon = d.getElementById("theme-icon");
      if (icon) icon.textContent = theme.get() === "dark" ? "🌙" : "☀️";
      // links para o CodeQuest levam o tema junto
      var links = d.querySelectorAll("a[href]");
      for (var i = 0; i < links.length; i++) {
        var a = links[i];
        try {
          var u = new URL(a.getAttribute("href"), location.href);
          if (MAIN && u.origin === new URL(MAIN).origin) {
            u.searchParams.set("theme", theme.get());
            a.setAttribute("href", u.href);
          }
        } catch (e) { /* ignora link inválido */ }
      }
    }
  };

  /* ---------- helpers de rede ---------- */
  function showBadges(list) {
    if (list && list.length && w.CodeQuestAchievements) w.CodeQuestAchievements.show(list);
  }

  // POST JSON com tratamento de erro; mostra conquistas novas. Resolve sempre com um objeto.
  function api(path, body) {
    return fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        data = data || {};
        data._status = res.status;
        data._ok = res.ok;
        showBadges(data.new_badges);
        return data;
      });
    }).catch(function () {
      return { _ok: false, _status: 0, success: false, error: "Sem conexão. Verifique a internet e tente de novo." };
    });
  }

  /* ---------- 3) sessão ---------- */
  var CQ = {
    token: function () { return token; },
    theme: theme,
    api: api,
    session: { state: "loading", username: "", xp: 0, level: 1, solved: [] },
    ready: null
  };

  function mainLink() {
    var to = CFG.labTo || "lab";
    return MAIN + "/lab?to=" + encodeURIComponent(to) + "&theme=" + theme.get();
  }

  function paintSession() {
    var s = CQ.session;
    var chip = d.getElementById("user-chip");
    var banner = d.getElementById("session-banner");
    var bannerText = d.getElementById("session-banner-text");
    var bannerLink = d.getElementById("session-banner-link");

    if (chip) {
      if (s.state === "ok") {
        chip.textContent = "👤 " + s.username + " · Nv " + s.level + " · " + s.xp + " XP";
        chip.hidden = false;
        chip.title = "Conectado ao CodeQuest";
      } else {
        chip.hidden = true;
      }
    }

    if (banner && bannerText && bannerLink) {
      if (s.state === "guest" || s.state === "expired") {
        bannerText.textContent = s.state === "expired"
          ? "Sua sessão do LAB expirou. Entre de novo pelo CodeQuest para salvar XP e conquistas."
          : "Modo convidado: pratique à vontade, mas o XP e as conquistas só são salvos se você entrar pelo CodeQuest.";
        bannerLink.textContent = s.state === "expired" ? "Renovar sessão" : "Entrar com CodeQuest";
        bannerLink.setAttribute("href", mainLink());
        banner.hidden = false;
      } else {
        banner.hidden = true;
      }
    }
  }

  function applySession(data) {
    var s = CQ.session;
    if (data && data.authenticated) {
      s.state = "ok";
      s.username = data.username || "";
      s.xp = data.xp || 0;
      s.level = data.level || 1;
      s.solved = Array.isArray(data.solved) ? data.solved : [];
    } else {
      var reason = data && data.reason;
      var hadToken = !!token;
      s.state = hadToken && (reason === "expired" || reason === "invalid" || reason === "unknown_user") ? "expired" : "guest";
      if (s.state === "expired") setToken("");
      s.username = "";
      s.xp = 0;
      s.level = 1;
      s.solved = [];
    }
    paintSession();
    d.dispatchEvent(new CustomEvent("cq:lab-session", { detail: s }));
    return s;
  }

  function openSession() {
    if (!token) { return Promise.resolve(applySession({ authenticated: false, reason: "missing" })); }
    return api("/api/lab/session", {}).then(function (data) {
      if (data._status === 503 || data._status === 0) {
        // servidor/banco indisponível: não derruba o aluno, só avisa de forma discreta
        var s = applySession({ authenticated: false, reason: "db_error" });
        s.state = "guest";
        paintSession();
        return s;
      }
      return applySession(data);
    });
  }

  // atualiza dados locais depois de um envio (XP e desafios resolvidos) sem pedir tudo de novo
  CQ.update = function (data) {
    if (!data || CQ.session.state !== "ok") return;
    if (typeof data.xp === "number") CQ.session.xp = data.xp;
    if (typeof data.level === "number") CQ.session.level = data.level;
    if (Array.isArray(data.solved)) CQ.session.solved = data.solved;
    paintSession();
  };

  function init() {
    // tema
    var btn = d.getElementById("theme-btn");
    if (btn) btn.addEventListener("click", function () { theme.toggle(); paintSession(); });
    theme.paint();

    // sessão
    CQ.ready = openSession();

    // "online": renova o last_seen enquanto a aba está aberta e visível
    if (token) {
      setInterval(function () {
        if (!d.hidden && CQ.session.state === "ok") api("/api/lab/session", {});
      }, HEARTBEAT_MS);
    }
  }

  CQ.ready = Promise.resolve(CQ.session);
  w.CQ = CQ;

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})(window, document);
