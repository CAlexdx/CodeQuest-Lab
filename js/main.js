let pyodideInstance = null;

// --- DADOS DOS DESAFIOS (BUG HUNT) ---
const desafiosBugHunt = [
    {
        id: "bug_001",
        titulo: "O Loop Infinito (ou quase)",
        descricao: "Este código deveria imprimir os números de 1 a 5, mas está imprimindo de 1 a 4. Corrija o limite do loop.",
        codigoInicial: "for i in range(1, 5):\n    print(i)",
        entradaTeste: "",
        saidaEsperada: "1\n2\n3\n4\n5"
    }
];

let desafioAtual = desafiosBugHunt[0];

// --- INICIALIZAÇÃO E SESSÃO ---
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Gerenciamento de Sessão (Modo Convidado vs Logado)
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('user_id');
    
    if (userIdFromUrl) {
        localStorage.setItem("codequest_user_id", userIdFromUrl);
        window.history.replaceState({}, document.title, "/"); // Limpa a URL
    }

    const userId = localStorage.getItem("codequest_user_id");
    const guestBanner = document.getElementById("guest-banner");
    
    if (!userId && guestBanner) {
        guestBanner.style.display = "block";
    }

    // 2. Carrega Pyodide no background
    try {
        document.getElementById("sandbox-output").textContent = "Carregando motor Python...";
        pyodideInstance = await loadPyodide();
        document.getElementById("sandbox-output").textContent = "Python 3.11 pronto! Digite seu código acima.";
    } catch (err) {
        document.getElementById("sandbox-output").textContent = "Erro ao carregar Python: " + err;
    }

    // 3. Inicializa UI
    alterarComponenteCSS("botao");
    carregarDesafioBugHunt();
});

// --- MOTOR PYTHON (PYODIDE) ---
async function executePythonCode(code, input = "") {
    if (!pyodideInstance) return { success: false, output: "Motor Python ainda não carregou." };
    
    try {
        // Redireciona o stdout padrão do Python para capturarmos os 'prints'
        pyodideInstance.runPython(`
            import sys
            import io
            sys.stdout = io.StringIO()
        `);
        
        await pyodideInstance.runPythonAsync(code);
        
        // Puxa a saída do buffer
        const stdout = pyodideInstance.runPython("sys.stdout.getvalue()");
        return { success: true, output: stdout };
    } catch (error) {
        return { success: false, output: error.toString() };
    }
}

// --- STUDIO CSS ---
function alterarComponenteCSS(valor) {
    const previewArea = document.getElementById("css-preview-element");
    if (!previewArea) return;
    
    previewArea.className = ""; // Limpa classes antigas
    
    if (valor === "botao") {
        previewArea.className = "btn-primario";
        previewArea.textContent = "Hover me!";
    } else if (valor === "card") {
        previewArea.className = "card-perfil";
        previewArea.textContent = "Perfil do Usuário";
    }
}

// --- SANDBOX LIVRE ---
async function runSandbox() {
    const code = document.getElementById("sandbox-code").value;
    const outputElem = document.getElementById("sandbox-output");
    
    if (!code.trim()) {
        outputElem.textContent = "Por favor, insira algum código para executar.";
        return;
    }

    outputElem.textContent = "Executando...";
    outputElem.className = "terminal-text"; // Reseta cor

    const res = await executePythonCode(code);
    
    outputElem.textContent = res.output;
    if (!res.success) {
        outputElem.classList.add("error");
    }
}

// --- BUG HUNT (Com API REST) ---
function carregarDesafioBugHunt() {
    document.getElementById("challenge-title").textContent = desafioAtual.titulo;
    document.getElementById("challenge-desc").textContent = desafioAtual.descricao;
    document.getElementById("challenge-python-code").value = desafioAtual.codigoInicial;
    document.getElementById("challenge-python-output").textContent = "Pronto para testar.";
    document.getElementById("challenge-python-output").className = "terminal-text";
}

async function submitChallenge() {
    const code = document.getElementById("challenge-python-code").value;
    const outputElem = document.getElementById("challenge-python-output");
    
    if (!code) return;

    outputElem.textContent = "Avaliando submissão...";
    outputElem.className = "terminal-text";

    try {
        const res = await executePythonCode(code, desafioAtual.entradaTeste);

        if (!res.success) {
            outputElem.textContent = res.output;
            outputElem.classList.add("error");
            return;
        }

        const saidaObtida = res.output.trim();
        const saidaEsperada = desafioAtual.saidaEsperada.trim();

        if (saidaObtida === saidaEsperada) {
            // SUCESSO LÓGICO -> Envia para o Banco via Flask API
            const userId = localStorage.getItem("codequest_user_id");
            
            const apiResponse = await fetch('/api/bughunt/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    challenge_id: desafioAtual.id,
                    passed: true
                })
            });
            
            const dbResult = await apiResponse.json();

            outputElem.textContent = `SUCESSO!\nSaída Obtida: ${saidaObtida}\n\n[SISTEMA]: ${dbResult.message}`;
            outputElem.classList.add("success");

        } else {
            outputElem.textContent = `RESPOSTA INCORRETA!\n\nSaída Obtida:\n"${saidaObtida}"\n\nSaída Esperada:\n"${saidaEsperada}"\n\nTente novamente!`;
            outputElem.classList.add("error");
        }
    } catch (error) {
        outputElem.textContent = "Erro inesperado:\n\n" + error.message;
        outputElem.classList.add("error");
    }
}