import os
from flask import Flask, request, jsonify, render_template
from supabase import create_client, Client

app = Flask(__name__, static_folder="static", template_folder=".")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL else None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/<path:path>")
def serve_static(path):
    return app.send_static_file(path)

@app.route("/api/bughunt/submit", methods=["POST"])
def submit_bughunt():
    data = request.json
    user_id = data.get("user_id")
    challenge_id = data.get("challenge_id")
    passed = data.get("passed")

    if not user_id:
        return jsonify({
            "success": True, 
            "guest_mode": True, 
            "message": "Código correto! Faça login no CodeQuest para salvar seu progresso e XP."
        })

    try:
        if supabase:
            supabase.table("lab_submissions").insert({
                "user_id": user_id,
                "challenge_id": challenge_id,
                "language": "python",
                "passed": passed
            }).execute()
            
        return jsonify({
            "success": True, 
            "guest_mode": False, 
            "badge_earned": "🐛 Mestre dos Bugs",
            "message": "Desafio concluído com sucesso! XP salvo e Conquista desbloqueada."
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)