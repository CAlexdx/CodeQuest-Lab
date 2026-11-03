/*!
 * CodeQuest LAB - motores de execução (Python, JavaScript e SQL)
 *
 * Cada linguagem roda em um Web Worker: se o código travar, o tempo limite (ou o botão "Parar")
 * encerra o worker e o próximo "Executar" cria um novo. A página nunca congela.
 *
 *   CQEngines.run("python", codigo, { stdin, onStatus })        -> { ok, output, error, line }
 *   CQEngines.test("python", codigo, "nome_funcao", testes)     -> { ok, output, error, results:[{ok,got,error}] }
 *   CQEngines.run("sql", consulta)                              -> { ok, tables, changed, error }
 *   CQEngines.stop("python")                                    -> encerra a execução atual
 *   CQEngines.warm("python")                                    -> começa a carregar em segundo plano
 */
(function (w) {
  "use strict";

  var CFG = w.CQ_CONFIG || {};
  var WORKERS = {
    python: { url: "/static/js/workers/py-worker.js", base: CFG.pyodideBase, load: 90000, run: 10000, label: "Python" },
    javascript: { url: "/static/js/workers/js-worker.js", base: "", load: 10000, run: 5000, label: "JavaScript" },
    sql: { url: "/static/js/workers/sql-worker.js", base: CFG.sqljsBase, load: 40000, run: 5000, label: "SQL" }
  };
  var VERSION = (document.querySelector('script[src*="engines.js"]') || {}).src || "";
  var V = (VERSION.split("?v=")[1] || "1");

  function Runner(lang) {
    this.lang = lang;
    this.cfg = WORKERS[lang];
    this.worker = null;
    this.readyPromise = null;
    this.pending = null;   // { id, resolve, timer }
    this.seq = 0;
  }

  Runner.prototype.kill = function (reason) {
    if (this.worker) { try { this.worker.terminate(); } catch (e) { /* ignora */ } }
    this.worker = null;
    this.readyPromise = null;
    if (this.pending) {
      clearTimeout(this.pending.timer);
      this.pending.resolve({ ok: false, stopped: reason !== "timeout", timeout: reason === "timeout", output: "", error: null });
      this.pending = null;
    }
  };

  Runner.prototype.ensure = function (onStatus) {
    var self = this;
    if (this.readyPromise) return this.readyPromise;
    var cfg = this.cfg;
    if (onStatus && this.lang !== "javascript") onStatus("Carregando " + cfg.label + "... (só na primeira vez)");

    this.readyPromise = new Promise(function (resolve, reject) {
      var wk;
      try { wk = new Worker(cfg.url + "?v=" + V); }
      catch (e) { reject(new Error("Seu navegador não conseguiu iniciar o " + cfg.label + ".")); return; }
      self.worker = wk;
      var done = false;
      var timer = setTimeout(function () {
        if (done) return;
        done = true;
        self.kill("load");
        reject(new Error("O " + cfg.label + " demorou demais para carregar. Verifique a internet e tente de novo."));
      }, cfg.load);

      wk.onmessage = function (ev) {
        var msg = ev.data || {};
        if (msg.type === "ready" && !done) { done = true; clearTimeout(timer); wk.onmessage = function (e2) { self.onMessage(e2.data); }; resolve(); }
        else if (msg.type === "fatal" && !done) { done = true; clearTimeout(timer); self.kill("load"); reject(new Error(msg.error || "Falha ao iniciar.")); }
      };
      wk.onerror = function (ev) {
        if (done) { self.kill("crash"); return; }
        done = true; clearTimeout(timer); self.kill("load");
        reject(new Error("Não foi possível carregar o " + cfg.label + " (" + (ev && ev.message || "erro de rede") + ")."));
      };
      wk.postMessage({ type: "init", base: cfg.base || "" });
    });
    // se falhar, permite tentar de novo no próximo clique
    this.readyPromise.catch(function () { self.readyPromise = null; });
    return this.readyPromise;
  };

  Runner.prototype.onMessage = function (msg) {
    var p = this.pending;
    if (!p || msg.id !== p.id) return;
    clearTimeout(p.timer);
    this.pending = null;
    if (msg.type === "result") p.resolve(Object.assign({ ok: !(msg.payload && msg.payload.error) }, msg.payload));
    else p.resolve({ ok: false, output: "", error: "Erro interno do " + this.cfg.label + ": " + msg.error });
  };

  Runner.prototype.call = function (message, opts) {
    var self = this;
    opts = opts || {};
    return this.ensure(opts.onStatus).then(function () {
      return new Promise(function (resolve) {
        if (self.pending || !self.worker) { resolve({ ok: false, output: "", error: "Já existe uma execução em andamento. Aguarde ou clique em Parar." }); return; }
        var id = ++self.seq;
        var limit = opts.timeout || self.cfg.run;
        var timer = setTimeout(function () { self.kill("timeout"); }, limit);
        self.pending = { id: id, resolve: resolve, timer: timer };
        if (opts.onStatus) opts.onStatus("Executando...");
        message.id = id;
        self.worker.postMessage(message);
      });
    }).then(function (res) {
      if (res.timeout) {
        res.error = "⏱ O código demorou mais de " + Math.round((opts.timeout || self.cfg.run) / 1000) +
          " segundos e foi interrompido. Verifique se há um loop infinito (while sem fim, recursão sem parada).";
      } else if (res.stopped) {
        res.error = "Execução interrompida.";
      }
      return res;
    }, function (err) {
      return { ok: false, output: "", error: err.message || String(err), loadFailed: true };
    });
  };

  var runners = {};
  function get(lang) {
    if (!WORKERS[lang]) throw new Error("Linguagem não suportada: " + lang);
    return runners[lang] || (runners[lang] = new Runner(lang));
  }

  w.CQEngines = {
    run: function (lang, code, opts) {
      opts = opts || {};
      return get(lang).call({ type: "run", code: code, stdin: opts.stdin || "" }, opts);
    },
    test: function (lang, code, fn, tests, opts) {
      return get(lang).call({ type: "test", code: code, fn: fn, tests: tests }, opts || {});
    },
    stop: function (lang) { if (runners[lang]) runners[lang].kill("stop"); },
    warm: function (lang) { try { get(lang).ensure().catch(function () {}); } catch (e) { /* ignora */ } },
    isBusy: function (lang) { return !!(runners[lang] && runners[lang].pending); }
  };
})(window);
