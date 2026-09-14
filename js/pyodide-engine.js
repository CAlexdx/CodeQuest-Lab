// =========================================================
// PYODIDE-ENGINE.JS
// Motor Python WebAssembly
// =========================================================

let pyodideInstance = null;

let isPyodideLoading = false;

let pyodideLoadingPromise = null;


// =========================================================
// CARREGAR PYODIDE
// =========================================================

async function getPyodide() {

    if (pyodideInstance) {
        return pyodideInstance;
    }


    if (pyodideLoadingPromise) {
        return pyodideLoadingPromise;
    }


    isPyodideLoading = true;


    pyodideLoadingPromise =
        (async () => {

            try {

                if (
                    typeof loadPyodide !==
                    "function"
                ) {

                    throw new Error(
                        "A biblioteca Pyodide não foi carregada."
                    );
                }


                pyodideInstance =
                    await loadPyodide();


                console.log(
                    "Pyodide carregado com sucesso!"
                );


                return pyodideInstance;

            } catch (error) {

                console.error(
                    "Erro ao carregar Pyodide:",
                    error
                );

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

async function executePythonCode(
    code,
    testInput = ""
) {

    if (
        typeof code !== "string"
    ) {

        return {
            success: false,
            output:
                "Erro: o código informado não é válido."
        };
    }


    let pyodide;


    try {

        pyodide =
            await getPyodide();

    } catch (error) {

        return {

            success: false,

            output:
                "Erro ao carregar o Python no navegador:\n\n" +
                error.message
        };
    }


    if (!pyodide) {

        return {

            success: false,

            output:
                "Erro: o motor Python não está disponível."
        };
    }


    try {

        /*
         * Em vez de montar uma string Python
         * contendo o código do usuário, enviamos
         * o código diretamente para o ambiente
         * Pyodide.
         *
         * Isso evita problemas com:
         *
         * - aspas
         * - barras
         * - quebras de linha
         * - f-strings
         * - códigos maiores
         */

        pyodide.globals.set(
            "__cq_user_code",
            code
        );

        pyodide.globals.set(
            "__cq_user_input",
            String(testInput)
        );


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

    __cq_namespace = {
        "__name__": "__main__"
    }

    exec(
        __cq_user_code,
        __cq_namespace
    )

except Exception:

    __cq_error = traceback.format_exc()

finally:

    sys.stdin = __cq_old_stdin
    sys.stdout = __cq_old_stdout

__cq_output = __cq_output_stream.getvalue()

(__cq_output, __cq_error)
`;


        const result =
            await pyodide.runPythonAsync(
                runnerScript
            );


        const output =
            result.get
                ? result.get(0)
                : result[0];

        const error =
            result.get
                ? result.get(1)
                : result[1];


        if (error) {

            return {

                success: false,

                output:
                    "Erro de Execução:\n\n" +
                    error
            };
        }


        return {

            success: true,

            output:
                output ||
                "Código executado com sucesso (sem saída de texto)."
        };


    } catch (error) {

        console.error(
            "Erro do motor Python:",
            error
        );


        return {

            success: false,

            output:
                "Erro do Sistema:\n\n" +
                error.message
        };
    }
}