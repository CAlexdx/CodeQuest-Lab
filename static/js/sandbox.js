/* CodeQuest LAB - página Sandbox (Python, JavaScript e SQL) */
(function (w, d) {
  "use strict";

  var core = w.CQLab, engines = w.CQEngines;
  var $ = function (id) { return d.getElementById(id); };

  var langSel = $("sandbox-language"), exSel = $("sandbox-example"), code = $("code");
  var btnRun = $("btn-run"), btnStop = $("btn-stop"), btnClear = $("btn-clear");
  var statusEl = $("status"), titleEl = $("editor-title");
  var outText = $("out-text"), outSql = $("out-sql"), sqlHelp = $("sql-help");
  var stdinWrap = $("stdin-wrap"), stdin = $("stdin");

  var TITLES = { python: "Editor Python 3.11", javascript: "Editor JavaScript", sql: "Editor SQL (SQLite)" };
  var ALIAS = { js: "javascript", py: "python", sqlite: "sql" };

  var EXAMPLES = {
    python: [
      { name: "Olá, mundo", code: 'nome = "CodeQuest"\nprint("Olá,", nome + "!")\nprint("2 + 3 =", 2 + 3)\n' },
      { name: "Par ou ímpar", code: 'def par_ou_impar(n):\n    if n % 2 == 0:\n        return "par"\n    return "ímpar"\n\nfor numero in range(1, 6):\n    print(numero, "é", par_ou_impar(numero))\n' },
      { name: "Fatorial (loop)", code: 'def fatorial(n):\n    resultado = 1\n    for i in range(2, n + 1):\n        resultado *= i\n    return resultado\n\nprint("5! =", fatorial(5))\nprint("10! =", fatorial(10))\n' },
      { name: "Listas e média", code: 'notas = [7.5, 8, 6.5, 9, 10]\nmedia = sum(notas) / len(notas)\nprint("Notas:", notas)\nprint("Média:", round(media, 2))\nprint("Maior:", max(notas), "| Menor:", min(notas))\n' },
      { name: "Usando input()", code: 'nome = input("Qual é o seu nome? ")\nidade = int(input("Qual é a sua idade? "))\nprint("Olá,", nome, "- ano que vem você terá", idade + 1)\n' },
      { name: "Dicionário", code: 'aluno = {"nome": "Ana", "xp": 120}\naluno["xp"] += 20\nfor chave, valor in aluno.items():\n    print(chave, "=", valor)\n' }
    ],
    javascript: [
      { name: "Olá, mundo", code: 'const nome = "CodeQuest";\nconsole.log(`Olá, ${nome}!`);\nconsole.log("2 + 3 =", 2 + 3);\n' },
      { name: "Funções e arrays", code: 'const numeros = [1, 2, 3, 4, 5, 6];\nconst pares = numeros.filter(n => n % 2 === 0);\nconst dobro = numeros.map(n => n * 2);\nconsole.log("Pares:", pares);\nconsole.log("Dobro:", dobro);\nconsole.log("Soma:", numeros.reduce((a, b) => a + b, 0));\n' },
      { name: "Objetos", code: 'const aluno = { nome: "Bruno", xp: 80, trilhas: ["SQL", "Flask"] };\naluno.xp += 10;\nconsole.log(aluno);\nconsole.log(`${aluno.nome} tem ${aluno.xp} XP`);\n' },
      { name: "Assíncrono", code: 'const esperar = (ms) => new Promise(r => setTimeout(r, ms));\nconsole.log("Começou");\nawait esperar(500);\nconsole.log("Passou meio segundo");\n' }
    ],
    sql: [
      { name: "Listar usuários", code: "SELECT id, username, xp\nFROM users\nORDER BY xp DESC;\n" },
      { name: "Filtrar com WHERE", code: "SELECT username, xp\nFROM users\nWHERE xp >= 80;\n" },
      { name: "Contar e agrupar", code: "SELECT t.name AS trilha, COUNT(u.id) AS unidades\nFROM trails t\nLEFT JOIN units u ON u.trail_id = t.id\nGROUP BY t.id\nORDER BY unidades DESC;\n" },
      { name: "JOIN: progresso", code: "SELECT us.username, un.title, p.completed\nFROM unit_progress p\nJOIN users us ON us.id = p.user_id\nJOIN units un ON un.id = p.unit_id\nORDER BY us.username;\n" },
      { name: "INSERT + SELECT", code: "INSERT INTO users (username, xp, created_at)\nVALUES ('felipe', 40, '2026-03-10');\n\nSELECT * FROM users WHERE username = 'felipe';\n" },
      { name: "Média de XP", code: "SELECT COUNT(*) AS alunos, AVG(xp) AS media_xp, MAX(xp) AS maior_xp\nFROM users;\n" }
    ]
  };

  var lang = "python";

  function setOut(text, kind) {
    outSql.hidden = true;
    outText.hidden = false;
    outText.className = kind || "";
    outText.textContent = text;
  }

  function renderTables(res) {
    outText.hidden = true;
    outSql.hidden = false;
    outSql.textContent = "";
    if (!res.tables.length) {
      var note = d.createElement("p");
      note.className = "sql-note";
      note.textContent = res.changed ? "Comando executado: " + res.changed + " linha(s) afetada(s)." : "Comando executado sem resultados para mostrar.";
      outSql.appendChild(note);
      return;
    }
    res.tables.forEach(function (t) {
      var wrap = d.createElement("div");
      wrap.className = "table-scroll";
      var table = d.createElement("table");
      table.className = "sql-table";
      var thead = d.createElement("thead"), hr = d.createElement("tr");
      t.columns.forEach(function (c) { var th = d.createElement("th"); th.textContent = c; hr.appendChild(th); });
      thead.appendChild(hr);
      table.appendChild(thead);
      var tbody = d.createElement("tbody");
      t.rows.forEach(function (row) {
        var tr = d.createElement("tr");
        row.forEach(function (cell) { var td = d.createElement("td"); td.textContent = cell === null ? "NULL" : String(cell); tr.appendChild(td); });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      outSql.appendChild(wrap);
      var info = d.createElement("p");
      info.className = "sql-note";
      info.textContent = t.total + " linha(s)" + (t.truncated ? " (mostrando as primeiras 500)" : "");
      outSql.appendChild(info);
    });
  }

  function fillExamples() {
    exSel.textContent = "";
    EXAMPLES[lang].forEach(function (ex, i) {
      var o = d.createElement("option");
      o.value = String(i);
      o.textContent = ex.name;
      exSel.appendChild(o);
    });
  }

  function applyLanguage(next, keepCode) {
    if (keepCode !== true && code.value) core.store.set("code:" + lang, code.value);
    lang = next;
    langSel.value = lang;
    core.store.set("lang", lang);
    titleEl.textContent = TITLES[lang];
    sqlHelp.hidden = lang !== "sql";
    stdinWrap.hidden = lang !== "python";
    fillExamples();
    var saved = core.store.get("code:" + lang, null);
    code.value = saved ? saved : EXAMPLES[lang][0].code;
    renderKeys();
    setOut("Aguardando execução...", "muted");
    core.setStatus(statusEl, "Pronto", "ok");
    engines.warm(lang);
  }

  function renderKeys() {
    var bar = $("quickkeys");
    bar.textContent = "";
    core.keys[lang].forEach(function (k) {
      var b = d.createElement("button");
      var isTab = k === "\t";
      b.type = "button";
      b.textContent = isTab ? "Tab" : k;
      b.setAttribute("aria-label", isTab ? "Inserir recuo" : "Inserir " + k);
      b.addEventListener("mousedown", function (ev) { ev.preventDefault(); });
      b.addEventListener("click", function () {
        var a = code.selectionStart, z = code.selectionEnd;
        var text = isTab ? "    " : k;
        code.focus();
        code.setRangeText(text, a, z, "end");
        if (text.length === 2 && "()[]{}\"\"''".indexOf(text) !== -1) code.setSelectionRange(a + 1, a + 1);
        code.dispatchEvent(new Event("input", { bubbles: true }));
      });
      bar.appendChild(b);
    });
  }

  function setBusy(busy) {
    btnRun.disabled = busy;
    btnStop.hidden = !busy;
    langSel.disabled = busy;
  }

  function run() {
    if (btnRun.disabled) return;
    var src = code.value;
    if (!src.trim()) { setOut("Escreva algum código antes de executar.", "muted"); return; }
    setBusy(true);
    core.setStatus(statusEl, "Executando...", "busy");
    var current = lang;

    engines.run(current, src, {
      stdin: current === "python" ? stdin.value : "",
      onStatus: function (t) { core.setStatus(statusEl, t, "busy"); }
    }).then(function (res) {
      if (current === "sql" && !res.loadFailed && !res.stopped && !res.timeout && res.tables) {
        if (res.error) { setOut(res.error, "error"); core.setStatus(statusEl, "Erro", "err"); }
        else { renderTables(res); core.setStatus(statusEl, "Concluído", "ok"); }
        return;
      }
      var text = res.output || "";
      if (res.error) {
        text = (text ? text.replace(/\n?$/, "\n") : "") + res.error;
        setOut(text, "error");
        core.setStatus(statusEl, "Erro", "err");
      } else {
        setOut(text || "(o código rodou sem mostrar nada — use " + (current === "python" ? "print()" : "console.log()") + " para ver resultados)", text ? "success" : "muted");
        core.setStatus(statusEl, "Concluído", "ok");
      }
    }).then(function () { setBusy(false); }, function () { setBusy(false); });
  }

  function init() {
    core.enhanceEditor(code, { onRun: run });

    var params = new URLSearchParams(location.search);
    var wanted = (params.get("lang") || "").toLowerCase();
    wanted = ALIAS[wanted] || wanted;
    var start = EXAMPLES[wanted] ? wanted : core.store.get("lang", "python");
    if (!EXAMPLES[start]) start = "python";
    applyLanguage(start, true);

    langSel.addEventListener("change", function () { applyLanguage(langSel.value); });
    exSel.addEventListener("change", function () {
      var ex = EXAMPLES[lang][parseInt(exSel.value, 10)];
      if (ex) { code.value = ex.code; core.store.set("code:" + lang, code.value); }
    });
    code.addEventListener("input", function () { core.store.set("code:" + lang, code.value); });
    btnRun.addEventListener("click", run);
    btnStop.addEventListener("click", function () { engines.stop(lang); });
    btnClear.addEventListener("click", function () {
      code.value = "";
      core.store.set("code:" + lang, "");
      setOut("Aguardando execução...", "muted");
      code.focus();
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init); else init();
})(window, document);
