// =========================================================
// APP.JS - Sandbox Lógico + Bug Hunt
// =========================================================

const DESAFIOS = [
    {
        id: "par_impar",
        titulo: "Desafio 1: Corrija o Par ou Ímpar",
        nivel: "Nível Básico",
        descricao: "O código ao lado deveria ler um número inteiro e imprimir se ele é <strong>Par</strong> ou <strong>Ímpar</strong>. Entretanto, contém um erro no tipo de dado de entrada e no operador matemático.",
        entradaTeste: "4",
        saidaEsperada: "Par",
        codigoInicial:
`# Corrija os erros neste código
numero = input()

if numero / 2 == 0:
    print("Par")
else:
    print("Impar")`
    },
    {
        id: "fatorial",
        titulo: "Desafio 2: Cálculo de Fatorial",
        nivel: "Nível Intermediário",
        descricao: "O código deveria calcular o fatorial de um número lido. Exemplo: 5! = 120. Porém, o laço de repetição está com limite incorreto.",
        entradaTeste: "5",
        saidaEsperada: "120",
        codigoInicial:
`# Corrija o calculo do fatorial
n = int(input())
fatorial = 1

for i in range(1, n):
    fatorial = fatorial * i

print(fatorial)`
    },
    {
        id: "maior_numero",
        titulo: "Desafio 3: Encontrar o Maior Número",
        nivel: "Nível Básico",
        descricao: "O código recebe dois números e deve imprimir o maior entre eles. Corrija os operadores lógicos.",
        entradaTeste:
`15
8`,
        saidaEsperada: "15",
        codigoInicial:
`# Corrija a condicional do maior numero
a = int(input())
b = int(input())

if a < b:
    print(a)
else:
    print(b)`
    }
];

let desafioAtual = DESAFIOS[0];

// EXEMPLOS LÓGICOS DO SANDBOX (Python, SQL, JavaScript)
const EXEMPLOS_SANDBOX = {
    python: [
        {
            id: "python-basico",
            nome: "Python: Básico",
            codigo:
`# Exemplo básico de Python
nome = "CodeQuest"

for i in range(3):
    print(f"Bem-vindo ao {nome}!")`
        },
        {
            id: "python-lista",
            nome: "Python: Lista e Loop",
            codigo:
`# Trabalhando com listas
linguagens = ["Python", "SQL", "JavaScript"]

for linguagem in linguagens:
    print("Estudando:", linguagem)`
        },
        {
            id: "python-calculadora",
            nome: "Python: Calculadora",
            codigo:
`a = 10
b = 5

print("Soma:", a + b)
print("Subtração:", a - b)
print("Multiplicação:", a * b)
print("Divisão:", a / b)`
        }
    ],

    sql: [
        {
            id: "sql-select",
            nome: "SQL: Consulta Simples",
            codigo:
`-- Exemplo de Consulta SQL
SELECT id, username, xp, level
FROM users
WHERE xp >= 100
ORDER BY xp DESC;`
        },
        {
            id: "sql-join",
            nome: "SQL: Junção com Unidades",
            codigo:
`-- Consulta de progresso por usuário
SELECT u.username, t.name AS trilha, p.completed
FROM users u
JOIN unit_progress p ON u.id = p.user_id
JOIN trails t ON p.trail_id = t.id;`
        }
    ],

    javascript: [
        {
            id: "js-logica",
            nome: "JS: Lógica e Funções",
            codigo:
`// Lógica em JavaScript puro
function calcularMedia(notas) {
    const soma = notas.reduce((acc, curr) => acc + curr, 0);
    return soma / notas.length;
}

const notasAluno = [8.5, 7.0, 9.0];
console.log("Média:", calcularMedia(notasAluno));`
        }
    ]
};

let modoSandboxAtual = "python";

function atualizarListaExemplosSandbox() {
    const select = document.getElementById("sandbox-example");
    if (!select) return;

    const exemplos = EXEMPLOS_SANDBOX[modoSandboxAtual] || [];
    select.innerHTML = "";

    exemplos.forEach((exemplo) => {
        const option = document.createElement("option");
        option.value = exemplo.id;
        option.textContent = exemplo.nome;
        select.appendChild(option);
    });
}

function alterarModoSandbox(modo) {
    modoSandboxAtual = modo;
    const editor = document.getElementById("free-python-code");
    const editorTitle = document.getElementById("sandbox-editor-title");
    const status = document.getElementById("sandbox-status");

    if (!editor) return;

    atualizarListaExemplosSandbox();

    if (modo === "python") {
        if (editorTitle) editorTitle.textContent = "Editor Python 3.11";
        editor.placeholder = "Digite seu código Python aqui...";
        carregarExemploSandbox("python-basico");
    } else if (modo === "sql") {
        if (editorTitle) editorTitle.textContent = "Editor SQL (Consultas)";
        editor.placeholder = "Digite suas instruções SQL aqui...";
        carregarExemploSandbox("sql-select");
    } else if (modo === "javascript") {
        if (editorTitle) editorTitle.textContent = "Editor JavaScript (Lógica)";
        editor.placeholder = "Digite seu código JavaScript aqui...";
        carregarExemploSandbox("js-logica");
    }

    if (status) status.textContent = "Pronto";
}

function carregarExemploSandbox(id) {
    const editor = document.getElementById("free-python-code");
    if (!editor) return;

    const exemplos = EXEMPLOS_SANDBOX[modoSandboxAtual] || [];
    const exemplo = exemplos.find(item => item.id === id);

    if (!exemplo) return;

    editor.value = exemplo.codigo;
    const output = document.getElementById("free-python-output");
    if (output) {
        output.textContent = "Aguardando execução...";
        output.className = "terminal-text muted";
    }
}

function executarSandbox() {
    if (modoSandboxAtual === "python") {
        runFreePython();
    } else {
        const outputElem = document.getElementById("free-python-output");
        if (outputElem) {
            outputElem.textContent = "Sintaxe validada com sucesso! (Modo de Demonstração)";
            outputElem.className = "terminal-text success";
        }
    }
}

async function runFreePython() {
    const editor = document.getElementById("free-python-code");
    const outputElem = document.getElementById("free-python-output");
    const status = document.getElementById("sandbox-status");

    if (!editor || !outputElem) return;

    outputElem.className = "terminal-text muted";
    outputElem.textContent = "Executando no motor Python...";
    if (status) status.textContent = "Executando...";

    try {
        const res = await executePythonCode(editor.value);
        outputElem.textContent = res.output;
        outputElem.className = res.success ? "terminal-text success" : "terminal-text error";
        if (status) status.textContent = res.success ? "Executado" : "Erro";
    } catch (error) {
        outputElem.textContent = "Erro inesperado:\n\n" + error.message;
        outputElem.className = "terminal-text error";
        if (status) status.textContent = "Erro";
    }
}

function clearSandbox() {
    const editor = document.getElementById("free-python-code");
    if (!editor) return;
    editor.value = "";
    const output = document.getElementById("free-python-output");
    if (output) {
        output.textContent = "Editor limpo.";
        output.className = "terminal-text muted";
    }
}

function carregarDesafio(index) {
    const desafio = DESAFIOS[Number(index)];
    if (!desafio) return;
    desafioAtual = desafio;

    document.getElementById("challenge-title").textContent = desafio.titulo;
    document.getElementById("challenge-badge").textContent = desafio.nivel;
    document.getElementById("challenge-desc").innerHTML = desafio.descricao;
    document.getElementById("challenge-input").textContent = desafio.entradaTeste;
    document.getElementById("challenge-expected").textContent = desafio.saidaEsperada;
    document.getElementById("challenge-python-code").value = desafio.codigoInicial;
    
    const output = document.getElementById("challenge-python-output");
    if (output) {
        output.textContent = "Aguardando execução...";
        output.className = "terminal-text muted";
    }
}

async function runChallengePython() {
    const code = document.getElementById("challenge-python-code");
    const outputElem = document.getElementById("challenge-python-output");
    if (!code || !outputElem) return;

    outputElem.textContent = "Executando e testando entrada...";
    outputElem.className = "terminal-text muted";

    try {
        const res = await executePythonCode(code.value, desafioAtual.entradaTeste);
        outputElem.textContent = res.output;
        outputElem.className = res.success ? "terminal-text success" : "terminal-text error";
    } catch (error) {
        outputElem.textContent = "Erro inesperado:\n\n" + error.message;
        outputElem.className = "terminal-text error";
    }
}

async function submitChallenge() {
    const code = document.getElementById("challenge-python-code");
    const outputElem = document.getElementById("challenge-python-output");
    if (!code || !outputElem) return;

    outputElem.textContent = "Avaliando submissão...";

    try {
        const res = await executePythonCode(code.value, desafioAtual.entradaTeste);

        if (!res.success) {
            outputElem.textContent = res.output;
            outputElem.className = "terminal-text error";
            return;
        }

        const saidaObtida = res.output.trim();
        const saidaEsperada = desafioAtual.saidaEsperada.trim();

        if (saidaObtida === saidaEsperada) {
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

            outputElem.textContent = `SUCESSO! Parabéns!\n\nSaída Obtida: ${saidaObtida}\nSaída Esperada: ${saidaEsperada}\n\n[SISTEMA]: ${dbResult.message}`;
            outputElem.className = "terminal-text success";

            if (typeof mostrarNotificacao === "function") {
                mostrarNotificacao(dbResult.guest_mode ? "Sucesso! Modo Convidado (XP não salvo)" : "Desafio Concluído +XP!", "sucesso");
            }
        } else {
            outputElem.textContent = `RESPOSTA INCORRETA!\n\nSaída do seu Código:\n"${saidaObtida}"\n\nSaída Esperada:\n"${saidaEsperada}"`;
            outputElem.className = "terminal-text error";
        }
    } catch (error) {
        outputElem.textContent = "Erro inesperado:\n\n" + error.message;
        outputElem.className = "terminal-text error";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarListaExemplosSandbox();
    carregarDesafio(0);
    alterarModoSandbox("python");
});