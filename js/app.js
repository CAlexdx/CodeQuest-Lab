// =========================================================
// APP.JS
// Sandbox Geral + Bug Hunt
// =========================================================


// =========================================================
// DESAFIOS
// =========================================================

const DESAFIOS = [

    {
        id: "par_impar",

        titulo: "Desafio 1: Corrija o Par ou Ímpar",

        nivel: "Nível Básico",

        descricao:
            "O código ao lado deveria ler um número inteiro e imprimir se ele é <strong>Par</strong> ou <strong>Ímpar</strong>. Entretanto, o código contém um erro no tipo de dado de entrada e no operador matemático.",

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

        descricao:
            "O código deveria calcular o fatorial de um número lido. Exemplo: 5! = 120. Porém, o laço de repetição está com limite incorreto.",

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

        descricao:
            "O código recebe dois números separados por linha e deve imprimir o maior entre eles. Corrija os operadores lógicos.",

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


// =========================================================
// EXEMPLOS DO SANDBOX
// =========================================================

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

linguagens = [
    "Python",
    "JavaScript",
    "HTML",
    "CSS"
]

for linguagem in linguagens:
    print("Estudando:", linguagem)`
        },


        {
            id: "python-calculadora",
            nome: "Python: Calculadora",

            codigo:
`# Calculadora simples

a = 10
b = 5

print("Soma:", a + b)
print("Subtração:", a - b)
print("Multiplicação:", a * b)
print("Divisão:", a / b)`
        },


        {
            id: "python-condicional",
            nome: "Python: Condicional",

            codigo:
`# Estrutura condicional

idade = 18

if idade >= 18:
    print("Maior de idade")
else:
    print("Menor de idade")`
        }

    ],


    web: [

        {
            id: "web-navbar",
            nome: "Web: Navbar",

            codigo:
`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #0f172a;
    color: white;
}

.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 15px 25px;

    background: #111827;
    border-bottom: 1px solid #334155;
}

.logo {
    font-size: 20px;
    font-weight: bold;
}

.logo span {
    color: #38bdf8;
}

.links {
    display: flex;
    gap: 20px;
}

.links a {
    color: #cbd5e1;
    text-decoration: none;
}

.links a:hover {
    color: white;
}

@media (max-width: 600px) {

    .navbar {
        flex-direction: column;
        gap: 15px;
    }

    .links {
        flex-wrap: wrap;
        justify-content: center;
    }
}

</style>
</head>

<body>

<nav class="navbar">

    <div class="logo">
        CodeQuest <span>LAB</span>
    </div>

    <div class="links">
        <a href="#">Início</a>
        <a href="#">Projetos</a>
        <a href="#">Cursos</a>
        <a href="#">Contato</a>
    </div>

</nav>

</body>
</html>`
        },


        {
            id: "web-card",
            nome: "Web: Card",

            codigo:
`<!DOCTYPE html>
<html lang="pt-BR">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>

body {
    margin: 0;

    min-height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #060a12;

    font-family: Arial, sans-serif;
}

.card {
    width: min(90%, 360px);

    padding: 25px;

    background: #131c2e;

    border: 1px solid #334155;

    border-radius: 12px;

    color: white;

    box-shadow: 0 10px 30px rgba(0,0,0,.3);
}

.card h2 {
    margin-top: 0;

    color: #38bdf8;
}

.card p {
    color: #94a3b8;

    line-height: 1.5;
}

.card button {
    border: 0;

    padding: 10px 18px;

    border-radius: 6px;

    background: #2563eb;

    color: white;

    cursor: pointer;
}

</style>

</head>

<body>

<div class="card">

    <h2>CodeQuest LAB</h2>

    <p>
        Este é um card criado diretamente
        no Sandbox.
    </p>

    <button>
        Testar
    </button>

</div>

</body>
</html>`
        },


        {
            id: "web-form",
            nome: "Web: Formulário",

            codigo:
`<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<style>

body {
    margin: 0;

    min-height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    background: #0f172a;

    font-family: Arial;
}

form {
    width: min(90%, 400px);

    padding: 25px;

    background: #131c2e;

    border-radius: 10px;

    border: 1px solid #334155;
}

h2 {
    color: white;
}

label {
    display: block;

    margin-top: 15px;

    color: #94a3b8;
}

input {
    width: 100%;

    margin-top: 6px;

    padding: 10px;

    border-radius: 6px;

    border: 1px solid #334155;

    background: #080d1a;

    color: white;
}

button {
    width: 100%;

    margin-top: 20px;

    padding: 11px;

    border: 0;

    border-radius: 6px;

    background: #2563eb;

    color: white;
}

</style>

</head>

<body>

<form>

    <h2>Cadastro</h2>

    <label>Nome</label>
    <input type="text"
           placeholder="Digite seu nome">

    <label>E-mail</label>
    <input type="email"
           placeholder="Digite seu e-mail">

    <button>
        Cadastrar
    </button>

</form>

</body>
</html>`
        },


        {
            id: "web-button",
            nome: "Web: Botões",

            codigo:
`<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<style>

body {
    margin: 0;

    min-height: 100vh;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 10px;

    flex-wrap: wrap;

    background: #060a12;

    font-family: Arial;
}

button {
    padding: 12px 20px;

    border-radius: 7px;

    border: 1px solid;

    cursor: pointer;

    font-weight: bold;
}

.primary {
    background: #2563eb;
    color: white;
    border-color: #3b82f6;
}

.success {
    background: #16a34a;
    color: white;
    border-color: #22c55e;
}

.dark {
    background: #1e293b;
    color: white;
    border-color: #475569;
}

</style>

</head>

<body>

<button class="primary">
    Primário
</button>

<button class="success">
    Sucesso
</button>

<button class="dark">
    Secundário
</button>

</body>
</html>`
        },


        {
            id: "web-javascript",
            nome: "Web: JavaScript Interativo",

            codigo:
`<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<style>

body {
    margin: 0;

    min-height: 100vh;

    display: flex;

    align-items: center;

    justify-content: center;

    background: #060a12;

    color: white;

    font-family: Arial;
}

.box {
    text-align: center;
}

button {
    padding: 12px 20px;

    border: 0;

    border-radius: 7px;

    background: #2563eb;

    color: white;

    cursor: pointer;
}

#contador {
    font-size: 40px;

    margin: 20px;
}

</style>

</head>

<body>

<div class="box">

    <h2>JavaScript</h2>

    <div id="contador">0</div>

    <button onclick="aumentar()">
        Aumentar
    </button>

</div>

<script>

let numero = 0;

function aumentar() {

    numero++;

    document.getElementById("contador")
        .innerText = numero;
}

</script>

</body>
</html>`
        },


        {
            id: "web-table",
            nome: "Web: Tabela",

            codigo:
`<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<style>

body {
    margin: 0;

    padding: 30px;

    background: #060a12;

    color: white;

    font-family: Arial;
}

.table-container {
    width: 100%;

    overflow-x: auto;
}

table {
    width: 100%;

    min-width: 500px;

    border-collapse: collapse;
}

th,
td {
    padding: 12px;

    border: 1px solid #334155;

    text-align: left;
}

th {
    background: #1e293b;

    color: #38bdf8;
}

td {
    background: #0f172a;
}

</style>

</head>

<body>

<h2>Alunos</h2>

<div class="table-container">

<table>

<thead>

<tr>
    <th>Nome</th>
    <th>Curso</th>
    <th>Status</th>
</tr>

</thead>

<tbody>

<tr>
    <td>Aluno 1</td>
    <td>Desenvolvimento de Sistemas</td>
    <td>Ativo</td>
</tr>

<tr>
    <td>Aluno 2</td>
    <td>Desenvolvimento de Sistemas</td>
    <td>Ativo</td>
</tr>

</tbody>

</table>

</div>

</body>
</html>`
        }

    ]

};


// =========================================================
// CONFIGURAÇÃO DO SANDBOX
// =========================================================

let modoSandboxAtual = "python";


// =========================================================
// PREENCHER SELECT DE EXEMPLOS
// =========================================================

function atualizarListaExemplosSandbox() {

    const select =
        document.getElementById("sandbox-example");

    if (!select) return;

    const exemplos =
        EXEMPLOS_SANDBOX[modoSandboxAtual] || [];

    select.innerHTML = "";

    exemplos.forEach((exemplo) => {

        const option =
            document.createElement("option");

        option.value = exemplo.id;

        option.textContent = exemplo.nome;

        select.appendChild(option);
    });
}


// =========================================================
// ALTERAR MODO DO SANDBOX
// =========================================================

function alterarModoSandbox(modo) {

    modoSandboxAtual = modo;

    const editor =
        document.getElementById("free-python-code");

    const editorTitle =
        document.getElementById("sandbox-editor-title");

    const terminal =
        document.getElementById("sandbox-python-terminal");

    const preview =
        document.getElementById("sandbox-web-preview-pane");

    const status =
        document.getElementById("sandbox-status");

    if (!editor) return;


    atualizarListaExemplosSandbox();


    if (modo === "python") {

        editorTitle.textContent =
            "Editor Python";

        terminal.classList.remove("hidden");

        preview.classList.add("hidden");

        editor.placeholder =
            "Digite seu código Python aqui...";

        const saved =
            localStorage.getItem(
                "codequest_sandbox_python"
            );

        if (saved !== null) {

            editor.value = saved;

        } else {

            carregarExemploSandbox(
                "python-basico"
            );
        }

    } else {

        editorTitle.textContent =
            "Editor Web — HTML + CSS + JavaScript";

        terminal.classList.add("hidden");

        preview.classList.remove("hidden");

        editor.placeholder =
            "Digite HTML, CSS e JavaScript aqui...";

        const saved =
            localStorage.getItem(
                "codequest_sandbox_web"
            );

        if (saved !== null) {

            editor.value = saved;

            atualizarPreviewWeb();

        } else {

            carregarExemploSandbox(
                "web-navbar"
            );
        }
    }


    if (status) {
        status.textContent = "Pronto";
    }
}


// =========================================================
// CARREGAR EXEMPLO
// =========================================================

function carregarExemploSandbox(id) {

    const editor =
        document.getElementById("free-python-code");

    if (!editor) return;

    const exemplos =
        EXEMPLOS_SANDBOX[modoSandboxAtual] || [];

    const exemplo =
        exemplos.find(item => item.id === id);

    if (!exemplo) return;

    editor.value = exemplo.codigo;

    if (modoSandboxAtual === "python") {

        localStorage.setItem(
            "codequest_sandbox_python",
            exemplo.codigo
        );

        const output =
            document.getElementById(
                "free-python-output"
            );

        if (output) {
            output.textContent =
                "Aguardando execução...";
        }

    } else {

        localStorage.setItem(
            "codequest_sandbox_web",
            exemplo.codigo
        );

        atualizarPreviewWeb();
    }


    const status =
        document.getElementById("sandbox-status");

    if (status) {
        status.textContent =
            `Exemplo: ${exemplo.nome}`;
    }
}


// =========================================================
// EXECUTAR SANDBOX
// =========================================================

function executarSandbox() {

    if (modoSandboxAtual === "python") {

        runFreePython();

    } else {

        atualizarPreviewWeb();
    }
}


// =========================================================
// SANDBOX PYTHON
// =========================================================

async function runFreePython() {

    const editor =
        document.getElementById(
            "free-python-code"
        );

    const outputElem =
        document.getElementById(
            "free-python-output"
        );

    const status =
        document.getElementById(
            "sandbox-status"
        );

    if (!editor || !outputElem) return;

    const code = editor.value;

    localStorage.setItem(
        "codequest_sandbox_python",
        code
    );

    outputElem.className =
        "terminal-text muted";

    outputElem.textContent =
        "Carregando Python e executando...";

    if (status) {
        status.textContent =
            "Executando...";
    }


    try {

        const res =
            await executePythonCode(code);

        outputElem.textContent =
            res.output;

        outputElem.className =
            res.success
                ? "terminal-text success"
                : "terminal-text error";

        if (status) {

            status.textContent =
                res.success
                    ? "Executado"
                    : "Erro";
        }

    } catch (error) {

        outputElem.textContent =
            "Erro inesperado:\n\n" +
            error.message;

        outputElem.className =
            "terminal-text error";

        if (status) {
            status.textContent = "Erro";
        }
    }
}


// =========================================================
// PREVIEW WEB
// =========================================================

function atualizarPreviewWeb() {

    const editor =
        document.getElementById(
            "free-python-code"
        );

    const iframe =
        document.getElementById(
            "sandbox-web-preview"
        );

    const status =
        document.getElementById(
            "sandbox-status"
        );

    if (!editor || !iframe) return;

    const code = editor.value;

    localStorage.setItem(
        "codequest_sandbox_web",
        code
    );

    iframe.srcdoc = code;

    if (status) {
        status.textContent = "Preview atualizado";
    }
}


// =========================================================
// LIMPAR SANDBOX
// =========================================================

function clearSandbox() {

    const editor =
        document.getElementById(
            "free-python-code"
        );

    if (!editor) return;


    editor.value = "";


    if (modoSandboxAtual === "python") {

        localStorage.removeItem(
            "codequest_sandbox_python"
        );

        const output =
            document.getElementById(
                "free-python-output"
            );

        if (output) {

            output.textContent =
                "Editor limpo.";

            output.className =
                "terminal-text muted";
        }

    } else {

        localStorage.removeItem(
            "codequest_sandbox_web"
        );

        const iframe =
            document.getElementById(
                "sandbox-web-preview"
            );

        if (iframe) {
            iframe.srcdoc = "";
        }
    }


    const status =
        document.getElementById(
            "sandbox-status"
        );

    if (status) {
        status.textContent = "Editor limpo";
    }
}


// =========================================================
// COMPATIBILIDADE COM O NOME ANTIGO
// =========================================================

function clearFreeEditor() {
    clearSandbox();
}


// =========================================================
// BUG HUNT
// =========================================================

function carregarDesafio(index) {

    const desafio =
        DESAFIOS[Number(index)];

    if (!desafio) return;

    desafioAtual = desafio;


    const title =
        document.getElementById(
            "challenge-title"
        );

    const badge =
        document.getElementById(
            "challenge-badge"
        );

    const desc =
        document.getElementById(
            "challenge-desc"
        );

    const input =
        document.getElementById(
            "challenge-input"
        );

    const expected =
        document.getElementById(
            "challenge-expected"
        );

    const code =
        document.getElementById(
            "challenge-python-code"
        );

    const output =
        document.getElementById(
            "challenge-python-output"
        );


    if (title) {
        title.textContent =
            desafio.titulo;
    }

    if (badge) {
        badge.textContent =
            desafio.nivel;
    }

    if (desc) {
        desc.innerHTML =
            desafio.descricao;
    }

    if (input) {
        input.textContent =
            desafio.entradaTeste;
    }

    if (expected) {
        expected.textContent =
            desafio.saidaEsperada;
    }

    if (code) {
        code.value =
            desafio.codigoInicial;
    }

    if (output) {

        output.textContent =
            "Aguardando execução...";

        output.className =
            "terminal-text muted";
    }
}


// =========================================================
// EXECUTAR BUG HUNT
// =========================================================

async function runChallengePython() {

    const code =
        document.getElementById(
            "challenge-python-code"
        );

    const outputElem =
        document.getElementById(
            "challenge-python-output"
        );

    if (!code || !outputElem) return;

    outputElem.textContent =
        "Executando e testando entrada...";

    outputElem.className =
        "terminal-text muted";


    try {

        const res =
            await executePythonCode(
                code.value,
                desafioAtual.entradaTeste
            );

        outputElem.textContent =
            res.output;

        outputElem.className =
            res.success
                ? "terminal-text success"
                : "terminal-text error";

    } catch (error) {

        outputElem.textContent =
            "Erro inesperado:\n\n" +
            error.message;

        outputElem.className =
            "terminal-text error";
    }
}


// =========================================================
// SUBMETER DESAFIO
// =========================================================

async function submitChallenge() {

    const code =
        document.getElementById(
            "challenge-python-code"
        );

    const outputElem =
        document.getElementById(
            "challenge-python-output"
        );

    if (!code || !outputElem) return;


    outputElem.textContent =
        "Avaliando submissão...";


    try {

        const res =
            await executePythonCode(
                code.value,
                desafioAtual.entradaTeste
            );


        if (!res.success) {

            outputElem.textContent =
                res.output;

            outputElem.className =
                "terminal-text error";

            return;
        }


        const saidaObtida =
            res.output.trim();

        const saidaEsperada =
            desafioAtual.saidaEsperada.trim();


        if (saidaObtida === saidaEsperada) {

            outputElem.textContent =
`SUCESSO! Parabéns!

Saída Obtida: ${saidaObtida}

Saída Esperada: ${saidaEsperada}`;

            outputElem.className =
                "terminal-text success";


            if (
                typeof mostrarNotificacao ===
                "function"
            ) {

                mostrarNotificacao(
                    "Desafio concluído com sucesso!",
                    "sucesso"
                );

            } else {

                alert(
                    "Desafio concluído com sucesso!"
                );
            }

        } else {

            outputElem.textContent =
`RESPOSTA INCORRETA!

Saída do seu Código:
"${saidaObtida}"

Saída Esperada:
"${saidaEsperada}"

Ajuste a lógica e tente novamente!`;

            outputElem.className =
                "terminal-text error";
        }

    } catch (error) {

        outputElem.textContent =
            "Erro inesperado:\n\n" +
            error.message;

        outputElem.className =
            "terminal-text error";
    }
}


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        atualizarListaExemplosSandbox();

        carregarDesafio(0);

        alterarModoSandbox("python");

    }
);