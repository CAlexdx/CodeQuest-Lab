// =========================================================
// UI-UTILS.JS
// Utilitários de interface
// =========================================================


// =========================================================
// NOTIFICAÇÃO
// =========================================================

function mostrarNotificacao(
    texto,
    tipo = "sucesso"
) {

    let toast =
        document.getElementById(
            "toast-notification"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "toast-notification";

        toast.className =
            "toast-container";

        document.body.appendChild(
            toast
        );
    }


    let corFundo;


    if (tipo === "sucesso") {

        corFundo =
            "#22c55e";

    } else if (tipo === "alerta") {

        corFundo =
            "#f97316";

    } else {

        corFundo =
            "#ef4444";
    }


    toast.innerHTML =
        `<div
            class="toast-body"
            style="background-color: ${corFundo};"
        >
            ${texto}
        </div>`;


    toast.classList.add(
        "toast-show"
    );


    clearTimeout(
        toast._timeout
    );


    toast._timeout =
        setTimeout(() => {

            toast.classList.remove(
                "toast-show"
            );

        }, 2500);
}


// =========================================================
// DESATIVAR BOTÕES
// =========================================================

function desativarBotoes(
    containerSelector = "body"
) {

    document
        .querySelectorAll(
            `${containerSelector} button`
        )
        .forEach((el) => {

            el.disabled = true;

            el.dataset.originalOpacity =
                el.style.opacity;

            el.style.opacity =
                "0.6";

            el.style.cursor =
                "not-allowed";
        });
}


// =========================================================
// REATIVAR BOTÕES
// =========================================================

function reativarBotoes(
    containerSelector = "body"
) {

    document
        .querySelectorAll(
            `${containerSelector} button`
        )
        .forEach((el) => {

            el.disabled = false;

            el.style.opacity =
                el.dataset.originalOpacity ||
                "1";

            el.style.cursor =
                "pointer";
        });
}