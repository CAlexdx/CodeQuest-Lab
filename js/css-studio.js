// =========================================================
// CSS-STUDIO.JS
// Studio CSS Component Builder
// =========================================================

let componenteAtual = "botao";


// =========================================================
// CONFIGURAÇÕES
// =========================================================

const CONFIGS_COMPONENTES = {

    botao: {

        texto: "Clique Aqui",

        bgColor: "#2563eb",

        textColor: "#ffffff",

        borderColor: "#3b82f6",

        fontSize: 16,

        fontWeight: 600,

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

        fontWeight: 700,

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

        fontWeight: 400,

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

        fontWeight: 600,

        paddingV: 6,

        paddingH: 12,

        borderRadius: 20,

        borderWidth: 0,

        borderStyle: "solid",

        boxShadow: 5
    },


    navbar: {

        texto: "CodeQuest",

        bgColor: "#111827",

        textColor: "#f8fafc",

        borderColor: "#334155",

        fontSize: 16,

        fontWeight: 700,

        paddingV: 14,

        paddingH: 24,

        borderRadius: 6,

        borderWidth: 1,

        borderStyle: "solid",

        boxShadow: 10
    },


    alerta: {

        texto: "Mensagem de alerta",

        bgColor: "#1e3a8a",

        textColor: "#dbeafe",

        borderColor: "#3b82f6",

        fontSize: 14,

        fontWeight: 600,

        paddingV: 12,

        paddingH: 18,

        borderRadius: 8,

        borderWidth: 1,

        borderStyle: "solid",

        boxShadow: 5
    }

};


// =========================================================
// ALTERAR COMPONENTE
// =========================================================

function alterarComponenteCSS(tipo) {

    componenteAtual = tipo;

    const config =
        CONFIGS_COMPONENTES[tipo];

    if (!config) return;


    const elText =
        document.getElementById(
            "css-text-input"
        );

    const elBg =
        document.getElementById(
            "css-bg-color"
        );

    const elTextCol =
        document.getElementById(
            "css-text-color"
        );

    const elBorderCol =
        document.getElementById(
            "css-border-color"
        );

    const elFont =
        document.getElementById(
            "css-font-size"
        );

    const elFontW =
        document.getElementById(
            "css-font-weight"
        );

    const elPadV =
        document.getElementById(
            "css-padding-v"
        );

    const elPadH =
        document.getElementById(
            "css-padding-h"
        );

    const elRadius =
        document.getElementById(
            "css-radius"
        );

    const elBorderW =
        document.getElementById(
            "css-border-width"
        );

    const elBorderS =
        document.getElementById(
            "css-border-style"
        );

    const elShadow =
        document.getElementById(
            "css-shadow"
        );


    if (elText) {
        elText.value =
            config.texto;
    }

    if (elBg) {
        elBg.value =
            config.bgColor;
    }

    if (elTextCol) {
        elTextCol.value =
            config.textColor;
    }

    if (elBorderCol) {
        elBorderCol.value =
            config.borderColor;
    }

    if (elFont) {
        elFont.value =
            config.fontSize;
    }

    if (elFontW) {
        elFontW.value =
            config.fontWeight;
    }

    if (elPadV) {
        elPadV.value =
            config.paddingV;
    }

    if (elPadH) {
        elPadH.value =
            config.paddingH;
    }

    if (elRadius) {
        elRadius.value =
            config.borderRadius;
    }

    if (elBorderW) {
        elBorderW.value =
            config.borderWidth;
    }

    if (elBorderS) {
        elBorderS.value =
            config.borderStyle;
    }

    if (elShadow) {
        elShadow.value =
            config.boxShadow;
    }


    atualizarPreviewCSS();
}


// =========================================================
// ATUALIZAR PREVIEW
// =========================================================

function atualizarPreviewCSS() {

    const elText =
        document.getElementById(
            "css-text-input"
        );

    const elBg =
        document.getElementById(
            "css-bg-color"
        );

    const elTextCol =
        document.getElementById(
            "css-text-color"
        );

    const elBorderCol =
        document.getElementById(
            "css-border-color"
        );

    const elFont =
        document.getElementById(
            "css-font-size"
        );

    const elFontW =
        document.getElementById(
            "css-font-weight"
        );

    const elPadV =
        document.getElementById(
            "css-padding-v"
        );

    const elPadH =
        document.getElementById(
            "css-padding-h"
        );

    const elRadius =
        document.getElementById(
            "css-radius"
        );

    const elBorderW =
        document.getElementById(
            "css-border-width"
        );

    const elBorderS =
        document.getElementById(
            "css-border-style"
        );

    const elShadow =
        document.getElementById(
            "css-shadow"
        );

    const elHover =
        document.getElementById(
            "css-include-hover"
        );


    if (!elText) return;


    const texto =
        elText.value;

    const bgColor =
        elBg
            ? elBg.value
            : "#2563eb";

    const textColor =
        elTextCol
            ? elTextCol.value
            : "#ffffff";

    const borderColor =
        elBorderCol
            ? elBorderCol.value
            : "#3b82f6";

    const fontSize =
        elFont
            ? elFont.value
            : "16";

    const fontWeight =
        elFontW
            ? elFontW.value
            : "600";

    const paddingV =
        elPadV
            ? elPadV.value
            : "12";

    const paddingH =
        elPadH
            ? elPadH.value
            : "24";

    const radius =
        elRadius
            ? elRadius.value
            : "8";

    const borderWidth =
        elBorderW
            ? elBorderW.value
            : "2";

    const borderStyle =
        elBorderS
            ? elBorderS.value
            : "solid";

    const shadow =
        elShadow
            ? elShadow.value
            : "10";

    const incluirHover =
        elHover
            ? elHover.checked
            : true;


    // =====================================================
    // LABELS
    // =====================================================

    const setLbl =
        (id, value) => {

            const el =
                document.getElementById(id);

            if (el) {
                el.textContent =
                    value;
            }
        };


    setLbl(
        "lbl-font-size",
        `${fontSize}px`
    );

    setLbl(
        "lbl-font-weight",
        fontWeight
    );

    setLbl(
        "lbl-padding-v",
        `${paddingV}px`
    );

    setLbl(
        "lbl-padding-h",
        `${paddingH}px`
    );

    setLbl(
        "lbl-radius",
        `${radius}px`
    );

    setLbl(
        "lbl-border-width",
        `${borderWidth}px`
    );

    setLbl(
        "lbl-shadow",
        `${shadow}px`
    );


    // =====================================================
    // PREVIEW
    // =====================================================

    const areaVisual =
        document.getElementById(
            "css-preview-container"
        );

    if (!areaVisual) return;


    let seletorCSS =
        ".meu-componente";

    let htmlElemento = "";


    // -----------------------------------------------------
    // BOTÃO
    // -----------------------------------------------------

    if (componenteAtual === "botao") {

        seletorCSS =
            ".meu-botao";

        htmlElemento =
            `<button
                class="element-preview"
                id="rendered-element"
            >${escaparHTML(texto)}</button>`;
    }


    // -----------------------------------------------------
    // CARD
    // -----------------------------------------------------

    else if (componenteAtual === "card") {

        seletorCSS =
            ".meu-card";

        htmlElemento =
            `<div
                class="element-preview"
                id="rendered-element"
            >

                <h4>
                    ${escaparHTML(texto)}
                </h4>

                <p>
                    Este é um container
                    estilizado dinamicamente.
                </p>

            </div>`;
    }


    // -----------------------------------------------------
    // INPUT
    // -----------------------------------------------------

    else if (componenteAtual === "input") {

        seletorCSS =
            ".meu-input";

        htmlElemento =
            `<input
                type="text"
                class="element-preview"
                id="rendered-element"
                value="${escaparAtributo(texto)}"
                readonly
            >`;
    }


    // -----------------------------------------------------
    // BADGE
    // -----------------------------------------------------

    else if (componenteAtual === "badge") {

        seletorCSS =
            ".minha-tag";

        htmlElemento =
            `<span
                class="element-preview"
                id="rendered-element"
            >${escaparHTML(texto)}</span>`;
    }


    // -----------------------------------------------------
    // NAVBAR
    // -----------------------------------------------------

    else if (componenteAtual === "navbar") {

        seletorCSS =
            ".minha-navbar";

        htmlElemento =
            `<nav
                class="element-preview"
                id="rendered-element"
            >

                <div class="navbar-brand">
                    ${escaparHTML(texto)}
                </div>

                <div class="navbar-links">

                    <a href="#">
                        Início
                    </a>

                    <a href="#">
                        Projetos
                    </a>

                    <a href="#">
                        Cursos
                    </a>

                    <a href="#">
                        Contato
                    </a>

                </div>

            </nav>`;
    }


    // -----------------------------------------------------
    // ALERTA
    // -----------------------------------------------------

    else if (componenteAtual === "alerta") {

        seletorCSS =
            ".meu-alerta";

        htmlElemento =
            `<div
                class="element-preview"
                id="rendered-element"
            >
                ${escaparHTML(texto)}
            </div>`;
    }


    areaVisual.innerHTML =
        htmlElemento;


    const el =
        document.getElementById(
            "rendered-element"
        );


    if (el) {

        el.style.backgroundColor =
            bgColor;

        el.style.color =
            textColor;

        el.style.fontSize =
            `${fontSize}px`;

        el.style.fontWeight =
            fontWeight;

        el.style.padding =
            `${paddingV}px ${paddingH}px`;

        el.style.borderRadius =
            `${radius}px`;

        el.style.border =
            borderWidth > 0 &&
            borderStyle !== "none"

                ? `${borderWidth}px ${borderStyle} ${borderColor}`

                : "none";

        el.style.boxShadow =
            shadow > 0

                ? `0px 4px ${shadow}px rgba(0, 0, 0, 0.4)`

                : "none";

        el.style.cursor =
            componenteAtual === "botao"
                ? "pointer"
                : "default";

        el.style.transition =
            "all 0.2s ease-in-out";


        // Estilos específicos
        if (componenteAtual === "card") {

            el.style.display =
                "block";

            el.style.width =
                "min(100%, 360px)";

            el.style.textAlign =
                "left";

            const h4 =
                el.querySelector("h4");

            const p =
                el.querySelector("p");

            if (h4) {

                h4.style.margin =
                    "0 0 8px 0";
            }

            if (p) {

                p.style.margin = "0";

                p.style.opacity = "0.8";

                p.style.fontSize =
                    "0.85em";
            }
        }


        if (componenteAtual === "navbar") {

            el.style.width =
                "100%";

            el.style.maxWidth =
                "760px";

            el.style.display =
                "flex";

            el.style.alignItems =
                "center";

            el.style.justifyContent =
                "space-between";

            el.style.gap =
                "20px";

            el.style.flexWrap =
                "wrap";


            const links =
                el.querySelector(
                    ".navbar-links"
                );

            if (links) {

                links.style.display =
                    "flex";

                links.style.flexWrap =
                    "wrap";

                links.style.gap =
                    "15px";
            }


            el.querySelectorAll(
                ".navbar-links a"
            ).forEach((link) => {

                link.style.color =
                    textColor;

                link.style.textDecoration =
                    "none";

                link.style.fontSize =
                    `${Math.max(
                        Number(fontSize) - 2,
                        11
                    )}px`;
            });
        }


        if (componenteAtual === "input") {

            el.style.width =
                "min(100%, 360px)";

            el.style.outline =
                "none";
        }


        if (componenteAtual === "badge") {

            el.style.display =
                "inline-block";
        }
    }


    // =====================================================
    // GERAR CSS
    // =====================================================

    let codigoCSS =
`${seletorCSS} {
  background-color: ${bgColor};
  color: ${textColor};
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  padding: ${paddingV}px ${paddingH}px;
  border-radius: ${radius}px;
  border: ${
    borderWidth > 0 &&
    borderStyle !== "none"

        ? `${borderWidth}px ${borderStyle} ${borderColor}`

        : "none"
  };
  box-shadow: ${
    shadow > 0

        ? `0px 4px ${shadow}px rgba(0, 0, 0, 0.4)`

        : "none"
  };
  transition: all 0.2s ease-in-out;
}`;


    // =====================================================
    // CSS ESPECÍFICO DA NAVBAR
    // =====================================================

    if (componenteAtual === "navbar") {

        codigoCSS +=
`

${seletorCSS} {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%;
}

${seletorCSS} .navbar-links {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

${seletorCSS} .navbar-links a {
  color: ${textColor};
  text-decoration: none;
}

@media (max-width: 600px) {
  ${seletorCSS} {
    justify-content: center;
  }

  ${seletorCSS} .navbar-links {
    justify-content: center;
  }
}`;
    }


    // =====================================================
    // CSS ESPECÍFICO CARD
    // =====================================================

    if (componenteAtual === "card") {

        codigoCSS +=
`

${seletorCSS} h4 {
  margin: 0 0 8px 0;
}

${seletorCSS} p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.85em;
}`;
    }


    // =====================================================
    // HOVER
    // =====================================================

    if (incluirHover) {

        codigoCSS +=
`

${seletorCSS}:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}`;
    }


    // =====================================================
    // OUTPUT
    // =====================================================

    const codeArea =
        document.getElementById(
            "generated-css-code"
        );

    if (codeArea) {

        codeArea.value =
            codigoCSS.trim();
    }
}


// =========================================================
// ESCAPAR HTML
// =========================================================

function escaparHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================================================
// ESCAPAR ATRIBUTO
// =========================================================

function escaparAtributo(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


// =========================================================
// COPIAR CSS
// =========================================================

async function copiarCSS() {

    const textarea =
        document.getElementById(
            "generated-css-code"
        );

    if (!textarea) return;


    const texto =
        textarea.value;


    try {

        await navigator.clipboard.writeText(
            texto
        );

    } catch (error) {

        textarea.select();

        document.execCommand(
            "copy"
        );
    }


    if (
        typeof mostrarNotificacao ===
        "function"
    ) {

        mostrarNotificacao(
            "Código CSS copiado com sucesso!",
            "sucesso"
        );

    } else {

        alert(
            "Código CSS copiado com sucesso!"
        );
    }
}