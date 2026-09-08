// =========================================================
// APP.JS - Lógica dos Desafios e Sandbox Python
// =========================================================

const DESAFIOS = [
    {
        id: "par_impar",
        titulo: "Desafio 1: Corrija o Par ou Ímpar",
        nivel: "Nível Básico",
        descricao: "O código ao lado deveria ler um número inteiro e imprimir se ele é <strong>Par</strong> ou <strong>Ímpar</strong>. Entretanto, o código contém um erro no tipo de dado de entrada e no operador matemático.",
        entradaTeste: "4",
        saidaEsperada: "Par",
        codigoInicial: `# Corrija os erros neste código\nnumero = input()\n\nif numero / 2 == 0:\n    print("Par")\nelse:\n    print("Impar")`
    },
    {
        id: "fatorial",
        titulo: "Desafio 2: Cálculo de Fatorial",
        nivel: "Nível Intermediário",
        descricao: "O código deveria calcular o fatorial de um número lido. Exemplo: 5! = 120. Porém, o laço de repetição está com limite incorreto e causa erro de valor.",
        entradaTeste: "5",
        saidaEsperada: "120",
        codigoInicial: `# Corrija o calculo do fatorial\nn = int(input())\nfatorial = 1\n\nfor i in range(1, n):\n    fatorial = fatorial * i\n\nprint(fatorial)`
    },
    {
        id: "maior_numero",
        titulo: "Desafio 3: Encontrar o Maior Número",
        nivel: "Nível Básico",
        descricao: "O código recebe dois números separados por linha e deve imprimir o maior entre eles. Corrija os operadores lógicos.",
        entradaTeste: "15\n8",
        saidaEsperada: "15",
        codigoInicial: `# Corrija a condicional do maior numero\na = int(input())\nb = int(input())\n\nif a < b:\n    print(a)\nelse:\n    print(b)`
    }
];

let desafioAtual = DESAFIOS[0];

function carregarDesafio(index) {
    desafioAtual = DESAFIOS[index];
    document.getElementById('challenge-title').innerText = desafioAtual.titulo;
    document.getElementById('challenge-badge').innerText = desafioAtual.nivel;
    document.getElementById('challenge-desc').innerHTML = desafioAtual.descricao;
    document.getElementById('challenge-input').innerText = desafioAtual.entradaTeste;
    document.getElementById('challenge-expected').innerText = desafioAtual.saidaEsperada;
    document.getElementById('challenge-python-code').value = desafioAtual.codigoInicial;
    document.getElementById('challenge-python-output').innerText = "Aguardando execução...";
}

async function runFreePython() {
    const code = document.getElementById('free-python-code').value;
    const outputElem = document.getElementById('free-python-output');
    outputElem.innerText = "Executando no Python...";
    
    localStorage.setItem('codequest_sandbox_code', code);
    
    const res = await executePythonCode(code);
    outputElem.innerText = res.output;
}

function clearFreeEditor() {
    document.getElementById('free-python-code').value = "";
    document.getElementById('free-python-output').innerText = "Editor limpo.";
    localStorage.removeItem('codequest_sandbox_code');
}

async function runChallengePython() {
    const code = document.getElementById('challenge-python-code').value;
    const outputElem = document.getElementById('challenge-python-output');
    outputElem.innerText = "Executando e testando entrada...";
    
    const res = await executePythonCode(code, desafioAtual.entradaTeste);
    outputElem.innerText = res.output;
}

async function submitChallenge() {
    const code = document.getElementById('challenge-python-code').value;
    const outputElem = document.getElementById('challenge-python-output');
    outputElem.innerText = "Avaliando submissão...";
    
    const res = await executePythonCode(code, desafioAtual.entradaTeste);
    
    if (res.success) {
        const saidaObtida = res.output.trim();
        const saidaEsperada = desafioAtual.saidaEsperada.trim();
        
        if (saidaObtida === saidaEsperada) {
            outputElem.innerText = `SUCESSO! Parabéns!\n\nSaída Obtida: ${saidaObtida}\nSaída Esperada: ${saidaEsperada}`;
            if (typeof mostrarNotificacao === 'function') {
                mostrarNotificacao("🎉 Desafio Concluído com Sucesso!", "sucesso");
            } else {
                alert("🎉 Desafio Concluído com Sucesso!");
            }
        } else {
            outputElem.innerText = `RESPOSTA INCORRETA!\n\nSaída do seu Código: "${saidaObtida}"\nSaída Esperada: "${saidaEsperada}"\n\nAjuste a lógica e tente novamente!`;
        }
    } else {
        outputElem.innerText = res.output;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedCode = localStorage.getItem('codequest_sandbox_code');
    if (savedCode) {
        document.getElementById('free-python-code').value = savedCode;
    }
    carregarDesafio(0);
});