// =========================================================
// MAIN.JS - Controle Geral de Abas e Inicialização
// =========================================================

function trocarAba(idAba, botao) {
    const abas = document.querySelectorAll('.tab-content');
    abas.forEach(aba => aba.classList.remove('active'));

    const botoes = document.querySelectorAll('.nav-btn');
    botoes.forEach(btn => btn.classList.remove('active'));

    const abaAlvo = document.getElementById(idAba);
    if (abaAlvo) {
        abaAlvo.classList.add('active');
    }

    if (botao) {
        botao.classList.add('active');
    }

    if (idAba === 'tab-studiocss' && typeof alterarComponenteCSS === 'function') {
        const select = document.getElementById('css-component-select');
        const tipo = select ? select.value : 'botao';
        alterarComponenteCSS(tipo);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("css-component-select")) {
        alterarComponenteCSS("botao");
    }
});