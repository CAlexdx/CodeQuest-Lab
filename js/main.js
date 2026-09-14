// =========================================================
// MAIN.JS
// Controle Geral de Abas e Inicialização
// =========================================================


// =========================================================
// TROCAR ABA
// =========================================================

function trocarAba(idAba, botao) {

    const abas =
        document.querySelectorAll(
            ".tab-content"
        );

    abas.forEach((aba) => {

        aba.classList.remove(
            "active"
        );
    });


    const botoes =
        document.querySelectorAll(
            ".nav-btn"
        );

    botoes.forEach((btn) => {

        btn.classList.remove(
            "active"
        );
    });


    const abaAlvo =
        document.getElementById(
            idAba
        );


    if (abaAlvo) {

        abaAlvo.classList.add(
            "active"
        );
    }


    if (botao) {

        botao.classList.add(
            "active"
        );
    }


    // Inicializa Studio quando abrir
    if (
        idAba === "tab-studiocss" &&
        typeof alterarComponenteCSS ===
            "function"
    ) {

        const select =
            document.getElementById(
                "css-component-select"
            );

        const tipo =
            select
                ? select.value
                : "botao";


        alterarComponenteCSS(
            tipo
        );
    }
}


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Studio CSS
        const cssSelect =
            document.getElementById(
                "css-component-select"
            );

        if (
            cssSelect &&
            typeof alterarComponenteCSS ===
                "function"
        ) {

            alterarComponenteCSS(
                cssSelect.value || "botao"
            );
        }


        // Sandbox
        if (
            typeof alterarModoSandbox ===
                "function"
        ) {

            alterarModoSandbox(
                "python"
            );
        }

    }
);