// =========================================================
// UTILITÁRIOS DE UI & ESTADO (REAPROVEITADO DO CODEQUEST)
// =========================================================

// Exibe mensagens de feedback visual (Toasts) na tela
function mostrarNotificacao(texto, tipo = "sucesso") {
    let toast = document.getElementById("toast-notification");
    
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-notification";
        toast.className = "toast-container";
        document.body.appendChild(toast);
    }

    const corFundo = tipo === "sucesso" ? "#22c55e" : (tipo === "alerta" ? "#f97316" : "#ef4444");
    
    toast.innerHTML = `<div class="toast-body" style="background-color: ${corFundo};">${texto}</div>`;
    toast.classList.add("toast-show");

    setTimeout(() => {
        toast.classList.remove("toast-show");
    }, 2500);
}

// Desativa botões durante processamento
function desativarBotoes(containerSelector = "body") {
    document.querySelectorAll(`${containerSelector} button`).forEach(el => {
        el.disabled = true;
        el.style.opacity = "0.6";
        el.style.cursor = "not-allowed";
    });
}

// Reativa botões após conclusão
function reativarBotoes(containerSelector = "body") {
    document.querySelectorAll(`${containerSelector} button`).forEach(el => {
        el.disabled = false;
        el.style.opacity = "1";
        el.style.cursor = "pointer";
    });
}