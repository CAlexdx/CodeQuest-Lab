/* CodeQuest LAB - Studio CSS
 * A prévia é desenhada assim que a página abre (e a cada mudança), sem precisar trocar de componente. */
(function (w, d) {
  "use strict";

  var $ = function (id) { return d.getElementById(id); };

  var PRESETS = {
    botao:  { cls: "meu-botao",   text: "Clique Aqui",              bg: "#2563eb", fg: "#ffffff", bd: "#3b82f6", fs: 16, fw: 600, pv: 12, ph: 24, r: 8,  bw: 2, sh: 10, bs: "solid" },
    card:   { cls: "meu-card",    text: "Título do Card",           bg: "#1e293b", fg: "#f1f5f9", bd: "#334155", fs: 16, fw: 600, pv: 20, ph: 24, r: 12, bw: 1, sh: 15, bs: "solid" },
    input:  { cls: "meu-input",   text: "Digite aqui...",           bg: "#0f172a", fg: "#f1f5f9", bd: "#334155", fs: 14, fw: 400, pv: 10, ph: 14, r: 8,  bw: 1, sh: 0,  bs: "solid" },
    badge:  { cls: "meu-badge",   text: "NOVO",                     bg: "#16a34a", fg: "#ffffff", bd: "#16a34a", fs: 12, fw: 800, pv: 4,  ph: 12, r: 40, bw: 0, sh: 0,  bs: "solid" },
    navbar: { cls: "minha-navbar", text: "CodeQuest",               bg: "#0f172a", fg: "#ffffff", bd: "#38bdf8", fs: 18, fw: 700, pv: 14, ph: 24, r: 0,  bw: 1, sh: 10, bs: "solid" },
    alerta: { cls: "meu-alerta",  text: "Atenção: revise o código!", bg: "#fef3c7", fg: "#92400e", bd: "#f59e0b", fs: 14, fw: 600, pv: 12, ph: 16, r: 8,  bw: 1, sh: 0,  bs: "solid" }
  };

  var EXTRAS = {
    botao: ["cursor: pointer;"],
    card: ["max-width: 280px;"],
    input: ["width: 260px;", "max-width: 100%;"],
    badge: ["display: inline-block;"],
    navbar: ["display: flex;", "align-items: center;", "gap: 16px;", "width: 100%;"],
    alerta: ["max-width: 360px;"]
  };

  var MAXES = { "css-font-size": 32, "css-font-weight": 900, "css-padding-v": 40, "css-padding-h": 60, "css-radius": 40, "css-border-width": 10, "css-shadow": 30 };

  var comp = $("css-component-select");
  var el = {
    text: $("css-text-input"), bg: $("css-bg-color"), fg: $("css-text-color"), bd: $("css-border-color"),
    fs: $("css-font-size"), fw: $("css-font-weight"), pv: $("css-padding-v"), ph: $("css-padding-h"),
    r: $("css-radius"), bw: $("css-border-width"), sh: $("css-shadow"), bs: $("css-border-style"), hover: $("css-include-hover")
  };
  var preview = $("css-preview-container");
  var output = $("generated-css-code");
  var liveStyle = null;
  var secretSent = false;

  function values() {
    return {
      cls: PRESETS[comp.value].cls,
      text: el.text.value || PRESETS[comp.value].text,
      bg: el.bg.value, fg: el.fg.value, bd: el.bd.value,
      fs: +el.fs.value, fw: +el.fw.value, pv: +el.pv.value, ph: +el.ph.value,
      r: +el.r.value, bw: +el.bw.value, sh: +el.sh.value, bs: el.bs.value, hover: el.hover.checked
    };
  }

  function buildCss(v) {
    var lines = [
      "  background-color: " + v.bg + ";",
      "  color: " + v.fg + ";",
      "  font-size: " + v.fs + "px;",
      "  font-weight: " + v.fw + ";",
      "  padding: " + v.pv + "px " + v.ph + "px;",
      "  border: " + (v.bw ? v.bw + "px " + v.bs + " " + v.bd : "none") + ";",
      "  border-radius: " + v.r + "px;",
      "  box-shadow: " + (v.sh ? "0 " + Math.round(v.sh * 0.4) + "px " + v.sh + "px rgba(0, 0, 0, 0.35)" : "none") + ";"
    ];
    EXTRAS[comp.value].forEach(function (x) { lines.push("  " + x); });
    if (v.hover) lines.push("  transition: transform 0.15s, filter 0.15s;");
    var css = "." + v.cls + " {\n" + lines.join("\n") + "\n}";
    if (v.hover) css += "\n\n." + v.cls + ":hover {\n  filter: brightness(1.1);\n  transform: translateY(-2px);\n}";
    return css;
  }

  function buildPreview(v) {
    var node;
    switch (comp.value) {
      case "botao":
        node = d.createElement("button"); node.type = "button"; node.textContent = v.text; break;
      case "card":
        node = d.createElement("div");
        var h = d.createElement("h4"); h.textContent = v.text;
        var p = d.createElement("p"); p.textContent = "Este é um exemplo de card. Ajuste os controles ao lado e veja o resultado.";
        node.appendChild(h); node.appendChild(p); break;
      case "input":
        node = d.createElement("input"); node.type = "text"; node.placeholder = v.text; node.setAttribute("aria-label", "Prévia do campo"); break;
      case "badge":
        node = d.createElement("span"); node.textContent = v.text; break;
      case "navbar":
        node = d.createElement("nav");
        var brand = d.createElement("strong"); brand.textContent = v.text; node.appendChild(brand);
        ["Início", "Trilhas", "Perfil"].forEach(function (t) { var s = d.createElement("span"); s.textContent = t; s.style.opacity = "0.85"; s.style.fontSize = "0.85em"; node.appendChild(s); });
        break;
      default:
        node = d.createElement("div"); node.setAttribute("role", "alert"); node.textContent = v.text;
    }
    node.className = v.cls;
    return node;
  }

  function labels() {
    $("lbl-font-size").textContent = el.fs.value + "px";
    $("lbl-font-weight").textContent = el.fw.value;
    $("lbl-padding-v").textContent = el.pv.value + "px";
    $("lbl-padding-h").textContent = el.ph.value + "px";
    $("lbl-radius").textContent = el.r.value + "px";
    $("lbl-border-width").textContent = el.bw.value + "px";
    $("lbl-shadow").textContent = el.sh.value + "px";
  }

  function render() {
    var v = values();
    var css = buildCss(v);
    output.value = css;
    labels();
    if (!liveStyle) { liveStyle = d.createElement("style"); liveStyle.id = "studio-live-css"; d.head.appendChild(liveStyle); }
    liveStyle.textContent = css;   // só contém valores de controles validados (cores hex e números)
    preview.textContent = "";
    var wrap = d.createElement("div");
    wrap.className = "element-preview";
    wrap.style.display = "flex"; wrap.style.justifyContent = "center"; wrap.style.width = "100%";
    wrap.appendChild(buildPreview(v));
    preview.appendChild(wrap);
    checkMaxed();
  }

  function applyPreset() {
    var p = PRESETS[comp.value];
    el.text.value = p.text; el.bg.value = p.bg; el.fg.value = p.fg; el.bd.value = p.bd;
    el.fs.value = p.fs; el.fw.value = p.fw; el.pv.value = p.pv; el.ph.value = p.ph;
    el.r.value = p.r; el.bw.value = p.bw; el.sh.value = p.sh; el.bs.value = p.bs;
    render();
  }

  // Conquista secreta: todos os controles deslizantes no máximo ao mesmo tempo
  function checkMaxed() {
    if (secretSent) return;
    var all = Object.keys(MAXES).every(function (id) { return +$(id).value === MAXES[id]; });
    if (!all) return;
    secretSent = true;
    var msg = $("copy-msg");
    w.CQ.api("/api/lab/secret", { code: "estilista_extremo" }).then(function (data) {
      if (!data._ok) { secretSent = false; return; }
      if (data.guest_mode && msg) msg.textContent = "🎨 Todos os controles no máximo! Entre pelo CodeQuest para registrar a conquista secreta.";
    });
  }

  function copy() {
    var msg = $("copy-msg");
    var text = output.value;
    function ok() { msg.textContent = "✔ CSS copiado! Cole no seu arquivo .css."; setTimeout(function () { msg.textContent = ""; }, 3500); }
    function fallback() {
      output.focus(); output.select();
      try { d.execCommand("copy") ? ok() : (msg.textContent = "Selecione o texto e copie manualmente (Ctrl+C)."); }
      catch (e) { msg.textContent = "Selecione o texto e copie manualmente (Ctrl+C)."; }
    }
    if (w.navigator.clipboard && w.isSecureContext) w.navigator.clipboard.writeText(text).then(ok, fallback);
    else fallback();
  }

  function init() {
    comp.addEventListener("change", applyPreset);
    Object.keys(el).forEach(function (k) {
      if (el[k] === comp) return;
      el[k].addEventListener("input", render);
      el[k].addEventListener("change", render);
    });
    $("btn-copy").addEventListener("click", copy);
    applyPreset();   // desenha a prévia logo ao abrir
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init); else init();
})(window, document);
