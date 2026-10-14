/*!
 * CodeQuest LAB - ponte com o CodeQuest (login por token, tema e conquistas)
 *
 * Carregue DEPOIS de achievements.js, com defer:
 *   <script src="js/achievements.js" defer></script>
 *   <script src="js/lab-bridge.js" defer data-main-origin="https://SEU-CODEQUEST.vercel.app"></script>
 *
 * O que faz:
 *  1) Token: o CodeQuest abre o LAB com ?user_id=<token assinado>. Guardamos o token
 *     (sessionStorage) e o enviamos em todo fetch("/api/...") no header X-CQ-Token.
 *     Assim o servidor identifica o aluno mesmo que o JS antigo mande um user_id vazio.
 *  2) Registra a visita (POST /api/lab/session) -> conquista "Explorador do LAB".
 *     O toast aparece sozinho (achievements.js lê o new_badges da resposta).
 *  3) Tema: window.CQTheme.get()/apply()/toggle(). Usa a mesma chave 'codequest_theme'
 *     do CodeQuest. localStorage NÃO é compartilhado entre domínios, então o tema
 *     viaja por ?theme= (entrada) e é anexado aos links de volta ao CodeQuest (saída).
 *  Evento disponível: document.addEventListener("cq:lab-session", e => e.detail)
 */
(function (global) {
  "use strict";

  var TOKEN_KEY = "cq_lab_token";
  var THEME_KEY = "codequest_theme";
  var script = document.currentScript;
  var mainOrigin = (script && script.getAttribute("data-main-origin")) || global.CQ_MAIN_ORIGIN || "";
  try { if (mainOrigin) mainOrigin = new URL(mainOrigin).origin; } catch (e) { mainOrigin = ""; }

  function storageGet(store, key) {
    try { return global[store].getItem(key); } catch (e) { return null; }
  }
  function storageSet(store, key, value) {
    try { global[store].setItem(key, value); } catch (e) { /* armazenamento bloqueado */ }
  }

  /* ------------------------------ Token ------------------------------ */
  function readToken() {
    var token = null;
    try {
      var params = new URLSearchParams(global.location.search);
      token = params.get("user_id") || params.get("token");
    } catch (e) { /* ignora */ }
    if (token && token.length < 2000) {
      storageSet("sessionStorage", TOKEN_KEY, token);
      return token;
    }
    return storageGet("sessionStorage", TOKEN_KEY);
  }
  var token = readToken();

  var originalFetch = global.fetch;
  if (typeof originalFetch === "function") {
    global.fetch = function (input, init) {
      try {
        if (token) {
          var url = typeof input === "string" ? input : (input && input.url) || "";
          var parsed = new URL(url, global.location.href);
          if (parsed.origin === global.location.origin && parsed.pathname.indexOf("/api/") === 0) {
            var base = (init && init.headers) || (typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined);
            var headers = new Headers(base);
            headers.set("X-CQ-Token", token);
            init = Object.assign({}, init, { headers: headers });
          }
        }
      } catch (e) { /* nunca quebrar a requisição original */ }
      return originalFetch.call(this, input, init);
    };
  }

  function registerSession() {
    if (!token || typeof global.fetch !== "function") return;
    global.fetch("/api/lab/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}"
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        global.CQ_LAB_SESSION = data;
        document.dispatchEvent(new CustomEvent("cq:lab-session", { detail: data }));
      })
      .catch(function () { /* modo convidado: segue sem salvar */ });
  }

  /* ------------------------------ Tema ------------------------------ */
  function validTheme(t) { return t === "light" || t === "dark" ? t : null; }

  function getTheme() {
    return validTheme(document.documentElement.getAttribute("data-theme")) ||
      validTheme(storageGet("localStorage", THEME_KEY)) || "dark";
  }

  function applyTheme(theme) {
    theme = validTheme(theme) || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    storageSet("localStorage", THEME_KEY, theme);
    document.dispatchEvent(new CustomEvent("cq:theme", { detail: theme }));
    return theme;
  }

  global.CQTheme = {
    get: getTheme,
    apply: applyTheme,
    toggle: function () { return applyTheme(getTheme() === "dark" ? "light" : "dark"); }
  };

  // sincroniza abas do próprio LAB
  global.addEventListener("storage", function (ev) {
    if (ev.key === THEME_KEY && validTheme(ev.newValue)) {
      document.documentElement.setAttribute("data-theme", ev.newValue);
      document.dispatchEvent(new CustomEvent("cq:theme", { detail: ev.newValue }));
    }
  });

  // links de volta ao CodeQuest levam o tema atual (?theme=)
  if (mainOrigin) {
    document.addEventListener("click", function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest("a[href]") : null;
      if (!a) return;
      try {
        var u = new URL(a.href, global.location.href);
        if (u.origin === mainOrigin) {
          u.searchParams.set("theme", getTheme());
          a.href = u.toString();
        }
      } catch (e) { /* ignora */ }
    }, true);
  }

  // garante data-theme coerente mesmo se o snippet do <head> não foi colocado
  if (!validTheme(document.documentElement.getAttribute("data-theme"))) {
    var fromUrl = null;
    try { fromUrl = new URLSearchParams(global.location.search).get("theme"); } catch (e) { /* ignora */ }
    applyTheme(validTheme(fromUrl) || storageGet("localStorage", THEME_KEY) || "dark");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registerSession, { once: true });
  } else {
    registerSession();
  }
})(window);
