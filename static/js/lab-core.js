/*!
 * CodeQuest LAB - utilidades compartilhadas pelas páginas
 *  - store: localStorage seguro (com prefixo)
 *  - editor: Tab/Shift+Tab, recuo automático, Ctrl/Cmd+Enter e barra de teclas rápidas (celular)
 *  - setStatus / escapeHtml
 * Expõe window.CQLab.
 */
(function (w, d) {
  "use strict";

  var PREFIX = "cqlab:";

  var store = {
    get: function (key, fallback) {
      try {
        var raw = w.localStorage.getItem(PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { w.localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; } catch (e) { return false; }
    },
    del: function (key) { try { w.localStorage.removeItem(PREFIX + key); } catch (e) { /* ignora */ } }
  };

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function setStatus(el, text, kind) {
    if (!el) return;
    el.textContent = text;
    el.className = "status" + (kind ? " " + kind : "");
  }

  function fire(textarea) {
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  var INDENT = "    ";

  /**
   * Melhora um <textarea> usado como editor de código.
   * opts.keys: lista de teclas rápidas (string) para a barra; opts.bar: elemento da barra; opts.onRun: callback.
   */
  function enhanceEditor(textarea, opts) {
    opts = opts || {};
    if (!textarea) return;
    var trapTab = true;

    textarea.addEventListener("blur", function () { trapTab = true; });

    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { trapTab = false; return; }  // permite sair do editor com Tab (acessibilidade)

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (typeof opts.onRun === "function") opts.onRun();
        return;
      }

      if (e.key === "Tab" && trapTab) {
        e.preventDefault();
        var start = textarea.selectionStart, end = textarea.selectionEnd, value = textarea.value;
        if (start !== end && value.slice(start, end).indexOf("\n") !== -1) {
          // várias linhas selecionadas: recua/desfaz recuo em bloco
          var lineStart = value.lastIndexOf("\n", start - 1) + 1;
          var block = value.slice(lineStart, end);
          var lines = block.split("\n");
          var out = lines.map(function (ln) {
            if (e.shiftKey) return ln.indexOf(INDENT) === 0 ? ln.slice(INDENT.length) : ln.replace(/^ {1,3}/, "");
            return INDENT + ln;
          }).join("\n");
          textarea.setRangeText(out, lineStart, end, "select");
        } else if (e.shiftKey) {
          var ls = value.lastIndexOf("\n", start - 1) + 1;
          var m = value.slice(ls, start).match(/^ {1,4}/);
          if (m) textarea.setRangeText("", ls, ls + m[0].length, "preserve");
        } else {
          textarea.setRangeText(INDENT, start, end, "end");
        }
        fire(textarea);
        return;
      }

      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        var s = textarea.selectionStart, v = textarea.value;
        var from = v.lastIndexOf("\n", s - 1) + 1;
        var before = v.slice(from, s);
        var lead = (before.match(/^[ \t]*/) || [""])[0];
        var extra = /[:{(\[]\s*$/.test(before) ? INDENT : "";
        if (lead || extra) {
          e.preventDefault();
          textarea.setRangeText("\n" + lead + extra, s, textarea.selectionEnd, "end");
          fire(textarea);
        }
      }
    });

    // barra de teclas rápidas para o teclado do celular
    if (opts.bar && opts.keys) {
      opts.bar.textContent = "";
      opts.keys.forEach(function (k) {
        var b = d.createElement("button");
        b.type = "button";
        var isTab = k === "\t";
        b.textContent = isTab ? "Tab" : k;
        b.setAttribute("aria-label", isTab ? "Inserir recuo" : "Inserir " + k);
        // mousedown + preventDefault: o editor não perde o foco (o teclado do celular continua aberto)
        b.addEventListener("mousedown", function (ev) { ev.preventDefault(); });
        b.addEventListener("click", function () {
          var a = textarea.selectionStart, z = textarea.selectionEnd;
          var text = isTab ? INDENT : k;
          textarea.focus();
          textarea.setRangeText(text, a, z, "end");
          // pares: coloca o cursor no meio
          var pairs = { "()": 1, "[]": 1, "{}": 1, '""': 1, "''": 1 };
          if (pairs[text]) textarea.setSelectionRange(a + 1, a + 1);
          fire(textarea);
        });
        opts.bar.appendChild(b);
      });
    }
  }

  var KEYS = {
    python: ["\t", ":", "()", "[]", "{}", '""', "'", "=", "#", ".", ",", "_", "+", "-", "*", "/", "%", "<", ">", "!"],
    javascript: ["\t", "()", "{}", "[]", '""', "'", "`", ";", "=", ">", ".", ",", "+", "-", "*", "/", "%", "!", "&", "|"],
    sql: ["\t", "()", "'", "*", ",", ";", "=", "<", ">", ".", "%", "_"]
  };

  w.CQLab = {
    store: store,
    escapeHtml: escapeHtml,
    setStatus: setStatus,
    enhanceEditor: enhanceEditor,
    keys: KEYS
  };
})(window, document);
