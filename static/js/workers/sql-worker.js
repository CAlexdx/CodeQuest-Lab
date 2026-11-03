/* CodeQuest LAB - SQL (sql.js / SQLite) em Web Worker.
 * O banco de exemplo é recriado a cada execução: o resultado depende só do que está no editor. */
"use strict";

var SQL = null;

var SEED = [
  "CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, xp INTEGER DEFAULT 0, created_at TEXT);",
  "CREATE TABLE trails (id INTEGER PRIMARY KEY, name TEXT NOT NULL, icon TEXT);",
  "CREATE TABLE units (id INTEGER PRIMARY KEY, trail_id INTEGER, unit_order INTEGER, title TEXT);",
  "CREATE TABLE unit_progress (user_id INTEGER, unit_id INTEGER, completed INTEGER DEFAULT 0);",
  "INSERT INTO users VALUES (1,'ana',120,'2026-03-02'),(2,'bruno',80,'2026-03-03'),(3,'carla',250,'2026-03-03'),(4,'diego',30,'2026-03-05'),(5,'elisa',0,'2026-03-09');",
  "INSERT INTO trails VALUES (1,'Banco de Dados','🗄️'),(2,'Back-end','⚙️'),(3,'Front-end','🎨'),(4,'Mobile','📱');",
  "INSERT INTO units VALUES (1,1,1,'Tabelas e chaves'),(2,1,2,'SELECT básico'),(3,1,3,'JOIN'),(4,2,1,'Rotas Flask'),(5,2,2,'Requisições'),(6,3,1,'HTML e CSS'),(7,3,2,'JavaScript'),(8,4,1,'Componentes');",
  "INSERT INTO unit_progress VALUES (1,1,1),(1,2,1),(1,3,0),(2,1,1),(3,1,1),(3,2,1),(3,3,1),(3,4,1),(4,1,0);"
].join("\n");

self.onmessage = async function (e) {
  var m = e.data;
  try {
    if (m.type === "init") {
      importScripts(m.base + "sql-wasm.js");
      SQL = await initSqlJs({ locateFile: function (f) { return m.base + f; } });
      self.postMessage({ type: "ready" });
      return;
    }
    if (!SQL) throw new Error("O SQLite ainda não carregou.");
    if (m.type === "run") {
      var db = new SQL.Database();
      try {
        db.run(SEED);
        var payload;
        try {
          var res = db.exec(m.code);
          var changed = db.getRowsModified();
          payload = { tables: res.map(function (r) { return { columns: r.columns, rows: r.values.slice(0, 500), truncated: r.values.length > 500, total: r.values.length }; }), changed: changed, error: null };
        } catch (err) {
          payload = { tables: [], changed: 0, error: "Erro de SQL: " + (err && err.message || err) };
        }
        self.postMessage({ type: "result", id: m.id, payload: payload });
      } finally { db.close(); }
    }
  } catch (err2) {
    self.postMessage({ type: "fatal", id: m.id, error: String(err2 && err2.message || err2) });
  }
};
