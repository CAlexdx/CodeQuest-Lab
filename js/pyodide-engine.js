// =========================================================
// PYODIDE-ENGINE.JS - Motor Python WebAssembly
// =========================================================

let pyodideInstance = null;
let isPyodideLoading = false;

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
        console.log("Pyodide carregado com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar o Pyodide:", error);
    } finally {
        isPyodideLoading = false;
    }
    return pyodideInstance;
}

async function executePythonCode(code, testInput = "") {
    const pyodide = await getPyodide();
    if (!pyodide) {
        return { success: false, output: "Erro: O motor Python ainda não foi carregado." };
    }

    const sanitizedInput = testInput.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const sanitizedCode = code.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

    const runnerScript = `
import sys, io

sys.stdin = io.StringIO("""${sanitizedInput}""")
sys.stdout = io.StringIO()

error_msg = None
try:
    exec("${sanitizedCode}")
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