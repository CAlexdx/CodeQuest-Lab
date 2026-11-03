/* CodeQuest LAB - JavaScript em Web Worker (isolado da página, com tempo limite e botão Parar). */
"use strict";

var AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function fmt(v) {
  if (typeof v === "string") return v;
  if (v === undefined) return "undefined";
  if (typeof v === "function") return String(v);
  if (typeof v === "symbol") return v.toString();
  if (typeof v === "bigint") return v + "n";
  try {
    var seen = [];
    var s = JSON.stringify(v, function (k, val) {
      if (typeof val === "bigint") return val + "n";
      if (typeof val === "object" && val !== null) {
        if (seen.indexOf(val) !== -1) return "[Circular]";
        seen.push(val);
      }
      return val;
    });
    return s === undefined ? String(v) : s;
  } catch (e) { return String(v); }
}

function lineOf(err) {
  var m = /<anonymous>:(\d+):(\d+)/.exec(String(err && err.stack || ""));
  if (!m) return null;
  var n = parseInt(m[1], 10) - 2;  // o construtor da função acrescenta 2 linhas de cabeçalho
  return n > 0 ? n : null;
}

function friendly(err) {
  var kind = err && err.name || "Error";
  var msg = err && err.message || String(err);
  var ln = lineOf(err);
  var hints = {
    ReferenceError: "Você usou um nome que ainda não existe. Confira a grafia e se foi declarado com let/const.",
    SyntaxError: "O JavaScript não entendeu o código. Veja chaves, parênteses e aspas.",
    TypeError: "Você usou um valor de um jeito que ele não permite (por exemplo, chamar algo que não é função)."
  };
  var text = (ln ? "Erro na linha " + ln : "Erro") + ": " + kind + ": " + msg;
  if (hints[kind]) text += "\nDica: " + hints[kind];
  return { text: text, line: ln };
}

function sameValue(a, b) {
  try { return JSON.stringify(a) === JSON.stringify(b); } catch (e) { return false; }
}

self.onmessage = async function (e) {
  var m = e.data;
  if (m.type === "init") { self.postMessage({ type: "ready" }); return; }

  var out = [];
  var fakeConsole = {};
  ["log", "info", "warn", "error", "debug"].forEach(function (k) {
    fakeConsole[k] = function () {
      out.push((k === "error" ? "[erro] " : k === "warn" ? "[aviso] " : "") + Array.prototype.map.call(arguments, fmt).join(" "));
    };
  });
  var noInput = function () { return null; };

  try {
    if (m.type === "run") {
      var fn;
      try { fn = new AsyncFunction("console", "prompt", "alert", m.code); }
      catch (err) { var f1 = friendly(err); self.postMessage({ type: "result", id: m.id, payload: { output: "", error: f1.text, line: null } }); return; }
      try {
        var ret = await fn(fakeConsole, noInput, function (x) { out.push(fmt(x)); });
        if (ret !== undefined) out.push("↩ " + fmt(ret));
        self.postMessage({ type: "result", id: m.id, payload: { output: out.join("\n"), error: null, line: null } });
      } catch (err2) {
        var f2 = friendly(err2);
        self.postMessage({ type: "result", id: m.id, payload: { output: out.join("\n"), error: f2.text, line: f2.line } });
      }
    } else if (m.type === "test") {
      var tests = m.tests, results = [], error = null, line = null, target;
      try {
        var maker = new Function("console", "prompt", "alert",
          m.code + "\n;return (typeof " + m.fn + " === 'function') ? " + m.fn + " : undefined;");
        target = maker(fakeConsole, noInput, function () {});
      } catch (err3) { var f3 = friendly(err3); error = f3.text; line = f3.line; }
      if (!error && typeof target !== "function") error = "Erro: a função " + m.fn + "() não foi encontrada. Não apague nem renomeie a função.";
      if (!error) {
        for (var i = 0; i < tests.length; i++) {
          try {
            var got = await target.apply(null, tests[i].args);
            results.push({ ok: sameValue(got, tests[i].expected), got: fmt(got) === undefined ? "undefined" : (typeof got === "string" ? JSON.stringify(got) : fmt(got)) });
          } catch (err4) { results.push({ ok: false, got: null, error: friendly(err4).text }); }
        }
      }
      self.postMessage({ type: "result", id: m.id, payload: { output: out.join("\n"), error: error, line: line, results: results } });
    }
  } catch (fatal) {
    self.postMessage({ type: "fatal", id: m.id, error: String(fatal && fatal.message || fatal) });
  }
};
