// =========================================================
// CSS-STUDIO.JS - Studio CSS Component Builder
// =========================================================

let componenteAtual = "botao";

const CONFIGS_COMPONENTES = {
    botao: {
        texto: "Clique Aqui",
        bgColor: "#2563eb",
        textColor: "#ffffff",
        borderColor: "#3b82f6",
        fontSize: 16,
        fontWeight: "600",
        paddingV: 12,
        paddingH: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: "solid",
        boxShadow: 10
    },
    card: {
        texto: "Título do Card",
        bgColor: "#1e293b",
        textColor: "#f8fafc",
        borderColor: "#475569",
        fontSize: 18,
        fontWeight: "700",
        paddingV: 20,
        paddingH: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: "solid",
        boxShadow: 15
    },
    input: {
        texto: "Digite seu texto...",
        bgColor: "#0f172a",
        textColor: "#e2e8f0",
        borderColor: "#3b82f6",
        fontSize: 14,
        fontWeight: "400",
        paddingV: 10,
        paddingH: 16,
        borderRadius: 6,
        borderWidth: 2,
        borderStyle: "solid",
        boxShadow: 0
    },
    badge: {
        texto: "Em Destaque",
        bgColor: "#16a34a",
        textColor: "#ffffff",
        borderColor: "#22c55e",
        fontSize: 12,
        fontWeight: "600",
        paddingV: 6,
        paddingH: 12,
        borderRadius: 20,
        borderWidth: 0,
        borderStyle: "solid",
        boxShadow: 5
    }
};

function alterarComponenteCSS(tipo) {
    componenteAtual = tipo;
    const config = CONFIGS_COMPONENTES[tipo];
    if (!config) return;

    const elText = document.getElementById("css-text-input");
    const elBg = document.getElementById("css-bg-color");
    const elTextCol = document.getElementById("css-text-color");
    const elBorderCol = document.getElementById("css-border-color");
    const elFont = document.getElementById("css-font-size");
    const elFontW = document.getElementById("css-font-weight");
    const elPadV = document.getElementById("css-padding-v");
    const elPadH = document.getElementById("css-padding-h");
    const elRadius = document.getElementById("css-radius");
    const elBorderW = document.getElementById("css-border-width");
    const elBorderS = document.getElementById("css-border-style");
    const elShadow = document.getElementById("css-shadow");

    if (elText) elText.value = config.texto;
    if (elBg) elBg.value = config.bgColor;
    if (elTextCol) elTextCol.value = config.textColor;
    if (elBorderCol) elBorderCol.value = config.borderColor;
    if (elFont) elFont.value = config.fontSize;
    if (elFontW) elFontW.value = config.fontWeight;
    if (elPadV) elPadV.value = config.paddingV;
    if (elPadH) elPadH.value = config.paddingH;
    if (elRadius) elRadius.value = config.borderRadius;
    if (elBorderW) elBorderW.value = config.borderWidth;
    if (elBorderS) elBorderS.value = config.borderStyle;
    if (elShadow) elShadow.value = config.boxShadow;

    atualizarPreviewCSS();
}

function atualizarPreviewCSS() {
    const elText = document.getElementById("css-text-input");
    const elBg = document.getElementById("css-bg-color");
    const elTextCol = document.getElementById("css-text-color");
    const elBorderCol = document.getElementById("css-border-color");
    const elFont = document.getElementById("css-font-size");
    const elFontW = document.getElementById("css-font-weight");
    const elPadV = document.getElementById("css-padding-v");
    const elPadH = document.getElementById("css-padding-h");
    const elRadius = document.getElementById("css-radius");
    const elBorderW = document.getElementById("css-border-width");
    const elBorderS = document.getElementById("css-border-style");
    const elShadow = document.getElementById("css-shadow");
    const elHover = document.getElementById("css-include-hover");

    if (!elText) return;

    const texto = elText.value;
    const bgColor = elBg ? elBg.value : "#2563eb";
    const textColor = elTextCol ? elTextCol.value : "#ffffff";
    const borderColor = elBorderCol ? elBorderCol.value : "#3b82f6";
    const fontSize = elFont ? elFont.value : "16";
    const fontWeight = elFontW ? elFontW.value : "600";
    const paddingV = elPadV ? elPadV.value : "12";
    const paddingH = elPadH ? elPadH.value : "24";
    const radius = elRadius ? elRadius.value : "8";
    const borderWidth = elBorderW ? elBorderW.value : "2";
    const borderStyle = elBorderS ? elBorderS.value : "solid";
    const shadow = elShadow ? elShadow.value : "10";
    const incluirHover = elHover ? elHover.checked : true;

    const setLbl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setLbl("lbl-font-size", `${fontSize}px`);
    setLbl("lbl-padding-v", `${paddingV}px`);
    setLbl("lbl-padding-h", `${paddingH}px`);
    setLbl("lbl-radius", `${radius}px`);
    setLbl("lbl-border-width", `${borderWidth}px`);
    setLbl("lbl-shadow", `${shadow}px`);

    const areaVisual = document.getElementById("css-preview-container");
    if (!areaVisual) return;

    let seletorCSS = ".meu-componente";
    let htmlElemento = "";

    if (componenteAtual === "botao") {
        seletorCSS = ".meu-botao";
        htmlElemento = `<button class="element-preview" id="rendered-element">${texto}</button>`;
    } else if (componenteAtual === "card") {
        seletorCSS = ".meu-card";
        htmlElemento = `<div class="element-preview" id="rendered-element">
            <h4 style="margin: 0 0 8px 0; color: inherit;">${texto}</h4>
            <p style="margin: 0; opacity: 0.8; font-size: 0.85em;">Este é um container estilizado dinamicamente.</p>
        </div>`;
    } else if (componenteAtual === "input") {
        seletorCSS = ".meu-input";
        htmlElemento = `<input type="text" class="element-preview" id="rendered-element" value="${texto}" readonly />`;
    } else if (componenteAtual === "badge") {
        seletorCSS = ".minha-tag";
        htmlElemento = `<span class="element-preview" id="rendered-element">${texto}</span>`;
    }

    areaVisual.innerHTML = htmlElemento;
    const el = document.getElementById("rendered-element");

    if (el) {
        el.style.backgroundColor = bgColor;
        el.style.color = textColor;
        el.style.fontSize = `${fontSize}px`;
        el.style.fontWeight = fontWeight;
        el.style.padding = `${paddingV}px ${paddingH}px`;
        el.style.borderRadius = `${radius}px`;
        el.style.border = borderWidth > 0 && borderStyle !== "none" ? `${borderWidth}px ${borderStyle} ${borderColor}` : "none";
        el.style.boxShadow = shadow > 0 ? `0px 4px ${shadow}px rgba(0, 0, 0, 0.4)` : "none";
        el.style.cursor = componenteAtual === "botao" ? "pointer" : "default";
        el.style.transition = "all 0.2s ease-in-out";
    }

    let codigoCSS = `${seletorCSS} {
  background-color: ${bgColor};
  color: ${textColor};
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  padding: ${paddingV}px ${paddingH}px;
  border-radius: ${radius}px;
  border: ${borderWidth > 0 && borderStyle !== 'none' ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none'};
  box-shadow: ${shadow > 0 ? `0px 4px ${shadow}px rgba(0, 0, 0, 0.4)` : 'none'};
  transition: all 0.2s ease-in-out;
}`;

    if (incluirHover) {
        codigoCSS += `\n\n${seletorCSS}:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}`;
    }

    const codeArea = document.getElementById("generated-css-code");
    if (codeArea) {
        codeArea.value = codigoCSS;
    }
}

function copiarCSS() {
    const textarea = document.getElementById("generated-css-code");
    if (!textarea) return;
    textarea.select();
    navigator.clipboard.writeText(textarea.value);

    if (typeof mostrarNotificacao === "function") {
        mostrarNotificacao("📋 Código CSS copiado com sucesso!", "sucesso");
    } else {
        alert("📋 Código CSS copiado com sucesso!");
    }
}