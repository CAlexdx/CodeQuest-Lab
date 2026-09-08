// Motor de Execução do Pyodide (Python WebAssembly)
let pyodideInstance = null;
let isPyodideLoading = false;

// Função para inicializar o Pyodide
async function getPyodide() {
    if (pyodideInstance) return pyodideInstance;
    
    if (isPyodideLoading) {
        while (!pyodideInstance) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return pyodideInstance;
    }

    isPyodideLoading = true;
    try {
        pyodideInstance = await loadPyodide();
        console.log("Pyodide 3.11 carregado com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar o Pyodide:", error);
    } finally {
        isPyodideLoading = false;
    }
    return pyodideInstance;
}

// Função genérica para executar código Python capturando a saída e injetando entrada (sys.stdin)
async function executePythonCode(code, testInput = "") {
    const pyodide = await getPyodide();
    if (!pyodide) {
        return { success: false, output: "Erro: O motor Python ainda não foi carregado." };
    }

    // Script Python para capturar stdout, injetar stdin e executar o código isoladamente
    const runnerScript = `
import sys, io

# Injeta a entrada simulada no stdin
sys.stdin = io.StringIO("""${testInput.replace(/"/g, '\\"')}""")

# Redireciona a saída padrao (print)
sys.stdout = io.StringIO()

error_msg = None
try:
    exec("""${code.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}""")
except Exception as e:
    import traceback
    error_msg = traceback.format_exc()

output_val = sys.stdout.getvalue()
(output_val, error_msg)
`;

    try {
        const [output, error] = await pyodide.runPythonAsync(runnerScript);
        if (error) {
            return { success: false, output: `Erro de Execução:\n${error}` };
        }
        return { success: true, output: output || "Código executado com sucesso (sem saída de texto)." };
    } catch (err) {
        return { success: false, output: `Erro do Sistema:\n${err.message}` };
    }
}