let pyodide = null;

async function initPyodide() {
  document.getElementById("free-python-output").textContent = "Carregando Python...";
  document.getElementById("challenge-python-output").textContent = "Carregando Python...";
  
  pyodide = await loadPyodide();
  
  document.getElementById("free-python-output").textContent = "Python 3.11 Pronto.";
  document.getElementById("challenge-python-output").textContent = "Python 3.11 Pronto.";
}

async function runCode(codeId, outputId, mockInput = null) {
  if (!pyodide) return alert("Aguarde o carregamento do ambiente Python.");
  
  const code = document.getElementById(codeId).value;
  const output = document.getElementById(outputId);
  output.textContent = "Executando...\n";

  try {
    pyodide.runPython(`
      import sys, io
      sys.stdout = io.StringIO()
    `);

    if (mockInput !== null) {
      pyodide.runPython(`
        import builtins
        inputs = ["${mockInput}"]
        builtins.input = lambda: inputs.pop(0) if inputs else ""
      `);
    }

    await pyodide.runPythonAsync(code);
    let stdout = pyodide.runPython("sys.stdout.getvalue()");
    output.textContent = stdout || "Codigo executado com sucesso (sem retorno de texto).";
  } catch (err) {
    output.textContent = "Erro de Execucao:\n" + err.message;
  }
}

function runFreePython() {
  runCode("free-python-code", "free-python-output");
}

function runChallengePython() {
  runCode("challenge-python-code", "challenge-python-output", "4");
}

function clearFreeEditor() {
  document.getElementById("free-python-code").value = "";
  document.getElementById("free-python-output").textContent = "Terminal limpo.";
}

initPyodide();