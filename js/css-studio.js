// =========================================================
// STUDIO CSS MULTI-COMPONENTE
// =========================================================

let componenteAtual = "botao";

// Configurações padrão dos componentes
const CONFIGS_COMPONENTES = {
    botao: {
        texto: "Clique Aqui",
        bgColor: "#2563eb",
        textColor: "#ffffff",
        paddingV: 12,
        paddingH: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#3b82f6",
        boxShadow: 10,
        fontSize: 16
    },
    card: {
        texto: "<h3>Título do Card</h3><p>Este é um card customizável criado no Studio CSS.</p>",
        bgColor: "#1e293b",
        textColor: "#f8fafc",
        paddingV: 20,
        paddingH: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#475569",
        boxShadow: 15,
        fontSize: 14
    },
    input: {
        texto: "Digite seu texto...",
        bgColor: "#0f172a",
        textColor: "#e2e8f0",
        paddingV: 10,
        paddingH: 16,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#3b82f6",
        boxShadow: 0,
        fontSize: 14
    },
    badge: {
        texto: "Em Destaque",
        bgColor: "#16a34a",
        textColor: "#ffffff",
        paddingV: 6,
        paddingH: 12,
        borderRadius: 20,
        borderWidth: 0,
        borderColor: "#transparent",
        boxShadow: 5,
        fontSize: 12
    }
};

// Trocar tipo de componente no seletor
function alterarComponenteCSS(tipo) {
    componenteAtual = tipo;
    const config = CONFIGS_COMPONENTES[tipo];

    // Atualiza controles na tela com os valores do componente escolhido
    document.getElementById("css-text-input").value = config.texto.replace(/<[^>]*>?/gm, '');
    document.getElementById("css-bg-color").value = config.bgColor;
    document.getElementById("css-text-color").value = config.textColor;
    document.getElementById("css-padding-v").value = config.paddingV;
    document.getElementById("css-padding-h").value = config.paddingH;
    document.getElementById("css-radius").value = config.borderRadius;
    document.getElementById("css-border-width").value = config.borderWidth;
    document.getElementById("css-border-color").value = config.borderColor;
    document.getElementById("css-shadow").value = config.boxShadow;

    atualizarPreviewCSS();
}

// Atualizar a interface do elemento visual e o código gerado
function atualizarPreviewCSS() {
    const texto = document.getElementById("css-text-input").value;
    const bgColor = document.getElementById("css-bg-color").value;
    const textColor = document.getElementById("css-text-color").value;
    const paddingV = document.getElementById("css-padding-v").value;
    const paddingH = document.getElementById("css-padding-h").value;
    const radius = document.getElementById("css-radius").value;
    const borderWidth = document.getElementById("css-border-width").value;
    const borderColor = document.getElementById("css-border-color").value;
    const shadow = document.getElementById("css-shadow").value;

    // Atualizar legendas dos sliders
    document.getElementById("lbl-padding-v").innerText = `${paddingV}px`;
    document.getElementById("lbl-padding-h").innerText = `${paddingH}px`;
    document.getElementById("lbl-radius").innerText = `${radius}px`;
    document.getElementById("lbl-border-width").innerText = `${borderWidth}px`;
    document.getElementById("lbl-shadow").innerText = `${shadow}px`;

    const areaVisual = document.getElementById("css-preview-container");
    let seletorCSS = ".meu-componente";
    let htmlElemento = "";

    // Renderiza o HTML correto baseado no componente escolhido
    if (componenteAtual === "botao") {
        seletorCSS = ".meu-botao";
        htmlElemento = `<button class="element-preview" id="rendered-element">${texto}</button>`;
    } else if (componenteAtual === "card") {
        seletorCSS = ".meu-card";
        htmlElemento = `<div class="element-preview" id="rendered-element">
            <h3 style="margin-bottom: 8px;">${texto}</h3>
            <p style="opacity: 0.8;">Este é um container de conteúdo estilizado.</p>
        </div>`;
    } else if (componenteAtual === "input") {
        seletorCSS = ".meu-input";
        htmlElemento = `<input type="text" class="element-preview" id="rendered-element" placeholder="${texto}" readonly />`;
    } else if (componenteAtual === "badge") {
        seletorCSS = ".minha-tag";
        htmlElemento = `<span class="element-preview" id="rendered-element">${texto}</span>`;
    }

    areaVisual.innerHTML = htmlElemento;
    const el = document.getElementById("rendered-element");

    // Aplicar estilos ao vivo no elemento
    el.style.backgroundColor = bgColor;
    el.style.color = textColor;
    el.style.padding = `${paddingV}px ${paddingH}px`;
    el.style.borderRadius = `${radius}px`;
    el.style.border = `${borderWidth}px solid ${borderColor}`;
    el.style.boxShadow = shadow > 0 ? `0px 4px ${shadow}px rgba(0, 0, 0, 0.4)` : "none";
    el.style.display = "inline-block";
    el.style.transition = "all 0.2s ease";

    // Gerar o bloco de código CSS
    const codigoCSS = `${seletorCSS} {
    background-color: ${bgColor};
    color: ${textColor};
    padding: ${paddingV}px ${paddingH}px;
    border-radius: ${radius}px;
    border: ${borderWidth}px solid ${borderColor};
    box-shadow: ${shadow > 0 ? `0px 4px ${shadow}px rgba(0, 0, 0, 0.4)` : "none"};
}`;

    document.getElementById("generated-css-code").value = codigoCSS;
}

// Copiar código com notificação Toast (Reaproveitando estilo de alerta)
function copiarCSS() {
    const textarea = document.getElementById("generated-css-code");
    textarea.select();
    navigator.clipboard.writeText(textarea.value);
    
    mostrarNotificacao("📋 Código CSS copiado com sucesso!", "sucesso");
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("css-component-select")) {
        alterarComponenteCSS("botao");
    }
});