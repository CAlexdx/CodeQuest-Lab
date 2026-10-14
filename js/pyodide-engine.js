// =========================================================
// PYODIDE-ENGINE.JS & MULTI-LANGUAGE SANDBOX ENGINE
// Suporte a Python (WebAssembly), JavaScript e SQL
// =========================================================

let pyodideInstance = null;
let isPyodideLoading = false;
let pyodideLoadingPromise = null;

// =========================================================
// CARREGAR PYODIDE (PYTHON VIA WEBASSEMBLY)
// =========================================================

async function getPyodide() {
    if (pyodideInstance) {
        return pyodideInstance;
    }

    if (pyodideLoadingPromise) {
        return pyodideLoadingPromise;
    }

    isPyodideLoading = true;

    pyodideLoadingPromise = (async () => {
        try {
            if (typeof loadPyodide !== "function") {
                throw new Error("A biblioteca Pyodide não foi carregada corretamente.");
            }

            pyodideInstance = await loadPyodide();
            console.log("Pyodide carregado com sucesso!");
            return pyodideInstance;
        } catch (error) {
            console.error("Erro ao carregar Pyodide:", error);
            pyodideInstance = null;
            throw error;
        } finally {
            isPyodideLoading = false;
            pyodideLoadingPromise = null;
        }
    })();

    return pyodideLoadingPromise;
}

// =========================================================
// EXECUTAR PYTHON
// =========================================================

async function executePythonCode(code, testInput = "") {
    if (typeof code !== "string") {
        return {
            success: false,
            output: "Erro: o código informado não é válido."
        };
    }

    let pyodide;
    try {
        pyodide = await getPyodide();
    } catch (error) {
        return {
            success: false,
            output: "Erro ao carregar o Python no navegador:\n\n" + error.message
        };
    }

    if (!pyodide) {
        return {
            success: false,
            output: "Erro: o motor Python não está disponível."
        };
    }

    try {
        pyodide.globals.set("__cq_user_code", code);
        pyodide.globals.set("__cq_user_input", String(testInput));

        const runnerScript = `
import sys
import io
import traceback

__cq_old_stdin = sys.stdin
__cq_old_stdout = sys.stdout

__cq_input_stream = io.StringIO(__cq_user_input)
__cq_output_stream = io.StringIO()

sys.stdin = __cq_input_stream
sys.stdout = __cq_output_stream

__cq_error = None

try:
    __cq_namespace = { "__name__": "__main__" }
    exec(__cq_user_code, __cq_namespace)
except Exception:
    __cq_error = traceback.format_exc()
finally:
    sys.stdin = __cq_old_stdin
    sys.stdout = __cq_old_stdout

__cq_output = __cq_output_stream.getvalue()
(__cq_output, __cq_error)
`;

        const result = await pyodide.runPythonAsync(runnerScript);
        const output = result.get ? result.get(0) : result[0];
        const error = result.get ? result.get(1) : result[1];

        if (error) {
            return {
                success: false,
                output: "Erro de Execução:\n\n" + error
            };
        }

        return {
            success: true,
            output: output || "Código executado com sucesso (sem saída de texto)."
        };

    } catch (error) {
        console.error("Erro do motor Python:", error);
        return {
            success: false,
            output: "Erro do Sistema:\n\n" + error.message
        };
    }
}

// =========================================================
// EXECUTAR JAVASCRIPT LÓGICO NO SANDBOX
// =========================================================

function executeJavaScriptCode(code) {
    let logs = [];
    const customConsole = {
        log: (...args) => logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')),
        error: (...args) => logs.push("ERRO: " + args.join(' ')),
        warn: (...args) => logs.push("AVISO: " + args.join(' '))
    };

    try {
        const safeFunction = new Function('console', `
            try {
                ${code}
            } catch (err) {
                console.error(err.message);
            }
        `);
        safeFunction(customConsole);

        return {
            success: true,
            output: logs.length > 0 ? logs.join('\n') : "Código JavaScript executado com sucesso (sem console.log)."
        };
    } catch (err) {
        return {
            success: false,
            output: "Erro de Sintaxe JS:\n\n" + err.message
        };
    }
}

// =========================================================
// EXECUTAR SQL SIMULADO / INTERATIVO
// =========================================================

function executeSQLCode(code) {
    const query = code.trim().toLowerCase();
    
    if (!query) {
        return { success: false, output: "Insira uma consulta SQL válida." };
    }

    if (query.startsWith("select")) {
        return {
            success: true,
            output: `[Consulta SQL Executada com Sucesso]\n-------------------------------------\nid | username | xp | streak\n---------------------\n1  | calebe   | 350| 5\n2  | bruno    | 290| 3\n3  | nilmar   | 210| 2\n---------------------\n(3 linhas retornadas)`
        };
    } else if (query.startsWith("insert") || query.startsWith("update") || query.startsWith("delete")) {
        return {
            success: true,
            output: `[Comando SQL Executado]\n1 linha afetada com sucesso no banco de dados.`
        };
    } else {
        return {
            success: true,
            output: `Comando SQL processado pelo interpretador CodeQuest LAB.`
        };
    }
}

// =========================================================
// CONTROLADOR PRINCIPAL DO SANDBOX
// =========================================================

async function executarSandbox() {
    const langSelect = document.getElementById("sandbox-language");
    const codeEditor = document.getElementById("free-python-code");
    const outputBox = document.getElementById("free-python-output");
    const statusSpan = document.getElementById("sandbox-status");

    if (!langSelect || !codeEditor || !outputBox) return;

    const lang = langSelect.value;
    const code = codeEditor.value;

    outputBox.textContent = "Executando...";
    if (statusSpan) statusSpan.textContent = "Processando...";

    let res;
    if (lang === "python") {
        res = await executePythonCode(code);
    } else if (lang === "javascript") {
        res = executeJavaScriptCode(code);
    } else if (lang === "sql") {
        res = executeSQLCode(code);
    } else {
        res = { success: false, output: "Linguagem não suportada." };
    }

    outputBox.textContent = res.output;
    outputBox.className = "terminal-text " + (res.success ? "success" : "error");
    if (statusSpan) statusSpan.textContent = res.success ? "Pronto" : "Erro";
}

function clearSandbox() {
    const codeEditor = document.getElementById("free-python-code");
    const outputBox = document.getElementById("free-python-output");
    if (codeEditor) codeEditor.value = "";
    if (outputBox) {
        outputBox.textContent = "Aguardando execução...";
        outputBox.className = "terminal-text success";
    }
}

function alterarModoSandbox(lang) {
    const title = document.getElementById("sandbox-editor-title");
    const codeEditor = document.getElementById("free-python-code");
    if (!title || !codeEditor) return;

    if (lang === "python") {
        title.textContent = "Editor Python 3.11";
        codeEditor.value = '# Exemplo em Python\nnome = "CodeQuest"\nfor i in range(3):\n    print(f"Executando Python: {i}")';
    } else if (lang === "javascript") {
        title.textContent = "Editor JavaScript Lógico";
        codeEditor.value = '// Exemplo em JavaScript\nconst alunos = ["Calebe", "Bruno", "Nilmar", "Felipe", "Anderson"];\nalunos.forEach(a => console.log("Aluno tech: " + a));';
    } else if (lang === "sql") {
        title.textContent = "Editor SQL / Banco de Dados";
        codeEditor.value = '-- Exemplo de Consulta SQL\nSELECT username, xp, streak FROM users WHERE xp > 200 ORDER BY xp DESC;';
    }
}

function carregarExemploSandbox() {
    // Função auxiliar para seletor de exemplos
}