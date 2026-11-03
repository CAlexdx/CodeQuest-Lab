/* CodeQuest LAB - Bug Hunt: encontre o erro, passe nos testes, ganhe XP.
 * Os ids dos desafios precisam ser iguais a BUGHUNT_IDS em app.py. */
(function (w, d) {
  "use strict";

  var core = w.CQLab, engines = w.CQEngines;
  var $ = function (id) { return d.getElementById(id); };

  var LEVELS = { 1: ["Básico", ""], 2: ["Intermediário", "l2"], 3: ["Avançado", "l3"] };

  var CHALLENGES = [
    {
      id: "par_impar", level: 1, language: "python", fn: "eh_par",
      title: "Par ou ímpar",
      desc: "A função eh_par(n) deve devolver True quando o número é par e False quando é ímpar. Ela está dizendo o contrário!",
      code: 'def eh_par(n):\n    if n % 2 == 1:\n        return True\n    return False\n',
      tests: [{ args: [4], expected: true }, { args: [7], expected: false }, { args: [0], expected: true }, { args: [-2], expected: true }],
      hints: ["Teste na cabeça: eh_par(4) devolve True ou False? O que deveria devolver?", "O resto da divisão por 2 (n % 2) vale 0 para números pares.", "Troque a comparação: n % 2 == 0."]
    },
    {
      id: "fatorial", level: 1, language: "python", fn: "fatorial",
      title: "Fatorial",
      desc: "fatorial(n) multiplica todos os números de 1 até n (5! = 1×2×3×4×5 = 120). O resultado está sempre pequeno demais.",
      code: 'def fatorial(n):\n    resultado = 1\n    for i in range(1, n):\n        resultado = resultado * i\n    return resultado\n',
      tests: [{ args: [5], expected: 120 }, { args: [1], expected: 1 }, { args: [0], expected: 1 }, { args: [3], expected: 6 }],
      hints: ["Faça fatorial(3) no papel: quais números o loop percorre?", "range(1, n) vai de 1 até n-1: o último número nunca entra na conta.", "Use range(1, n + 1) para incluir o n."]
    },
    {
      id: "maior_numero", level: 1, language: "python", fn: "maior",
      title: "Maior número da lista",
      desc: "maior(lista) deve devolver o maior valor da lista. Funciona com números positivos, mas falha com listas só de negativos.",
      code: 'def maior(lista):\n    resultado = 0\n    for n in lista:\n        if n > resultado:\n            resultado = n\n    return resultado\n',
      tests: [{ args: [[3, 9, 2]], expected: 9 }, { args: [[-5, -2, -9]], expected: -2 }, { args: [[7]], expected: 7 }, { args: [[0, -1]], expected: 0 }],
      hints: ["Qual é o maior número de [-5, -2, -9]? E o que a função devolve?", "O valor inicial (0) é maior que todos os números negativos.", "Comece com o primeiro item da lista: resultado = lista[0]."]
    },
    {
      id: "contagem", level: 2, language: "javascript", fn: "contarPalavras",
      title: "Contar palavras",
      desc: "contarPalavras(texto) deve devolver quantas palavras existem. Espaços sobrando no começo, no fim ou entre as palavras estão confundindo a contagem, e um texto vazio deveria dar 0.",
      code: 'function contarPalavras(texto) {\n  return texto.split(" ").length;\n}\n',
      tests: [{ args: ["olá mundo"], expected: 2 }, { args: ["  a  b  c "], expected: 3 }, { args: [""], expected: 0 }, { args: ["codequest"], expected: 1 }],
      hints: ['Teste mentalmente "  a  b  c ": quantos pedaços o split(" ") cria?', "Use trim() para tirar os espaços das pontas e separe por /\\s+/ (um ou mais espaços).", "Cuidado com o texto vazio: depois do trim, se ele for \"\", devolva 0."]
    },
    {
      id: "inverter_texto", level: 2, language: "python", fn: "inverter",
      title: "Inverter texto",
      desc: 'inverter("abc") deve devolver "cba". Mas a primeira letra do texto sempre some do resultado.',
      code: 'def inverter(texto):\n    resultado = ""\n    for i in range(len(texto) - 1, 0, -1):\n        resultado += texto[i]\n    return resultado\n',
      tests: [{ args: ["abc"], expected: "cba" }, { args: ["a"], expected: "a" }, { args: [""], expected: "" }, { args: ["CodeQuest"], expected: "tseuQedoC" }],
      hints: ["Qual letra está faltando em inverter(\"abc\")? Em qual posição ela fica?", "O range(início, fim, passo) NÃO inclui o valor de 'fim'. Aqui o fim é 0, então o índice 0 fica de fora.", "Troque o fim para -1: range(len(texto) - 1, -1, -1)."]
    },
    {
      id: "soma_pares", level: 2, language: "python", fn: "soma_pares",
      title: "Soma dos pares",
      desc: "soma_pares(lista) deve somar apenas os números pares. Em vez de somar, ela guarda só o último par encontrado.",
      code: 'def soma_pares(lista):\n    soma = 0\n    for n in lista:\n        if n % 2 == 0:\n            soma = n\n    return soma\n',
      tests: [{ args: [[1, 2, 3, 4]], expected: 6 }, { args: [[]], expected: 0 }, { args: [[1, 3]], expected: 0 }, { args: [[2, 4, 6]], expected: 12 }],
      hints: ["Para [1, 2, 3, 4] a resposta certa é 6, mas a função devolve 4. Por quê?", "A linha 'soma = n' troca o valor da soma em vez de acumular.", "Acumule: soma += n (ou soma = soma + n)."]
    },
    {
      id: "vogais", level: 3, language: "javascript", fn: "contarVogais",
      title: "Contar vogais",
      desc: 'contarVogais(texto) deve contar todas as vogais, maiúsculas ou minúsculas, com ou sem acento ("Programação" tem 5).',
      code: 'function contarVogais(texto) {\n  let total = 0;\n  for (const letra of texto) {\n    if ("aeiou".includes(letra)) {\n      total++;\n    }\n  }\n  return total;\n}\n',
      tests: [{ args: ["Banana"], expected: 3 }, { args: ["AEIOU"], expected: 5 }, { args: ["Programação"], expected: 5 }, { args: ["xyz"], expected: 0 }],
      hints: ['Teste "AEIOU": a letra "A" está dentro de "aeiou"?', "Converta para minúsculas antes de comparar: texto.toLowerCase().", 'Para acentos, normalize: texto.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "") separa a letra do acento e remove o acento.']
    },
    {
      id: "fizzbuzz", level: 3, language: "python", fn: "fizzbuzz",
      title: "FizzBuzz",
      desc: 'fizzbuzz(n) devolve "Fizz" se n é múltiplo de 3, "Buzz" se é múltiplo de 5, "FizzBuzz" se é múltiplo de 3 e 5, ou o próprio número como texto. Para 15 ela devolve "Fizz".',
      code: 'def fizzbuzz(n):\n    if n % 3 == 0:\n        return "Fizz"\n    if n % 5 == 0:\n        return "Buzz"\n    if n % 15 == 0:\n        return "FizzBuzz"\n    return str(n)\n',
      tests: [{ args: [15], expected: "FizzBuzz" }, { args: [9], expected: "Fizz" }, { args: [10], expected: "Buzz" }, { args: [7], expected: "7" }],
      hints: ["O 15 é múltiplo de 3? Qual 'if' responde primeiro?", "O Python executa os 'if' de cima para baixo e para no primeiro verdadeiro.", "Coloque a verificação do 15 antes das de 3 e de 5."]
    }
  ];

  var byId = {};
  CHALLENGES.forEach(function (c) { byId[c.id] = c; });

  var sel = $("challenge-select"), code = $("code"), statusEl = $("status"), out = $("out-text");
  var testsEl = $("tests"), hintList = $("hint-list"), hintBtn = $("btn-hint");
  var btnTest = $("btn-test"), btnSubmit = $("btn-submit"), btnReset = $("btn-reset");

  var current = null;
  var session = { hints: 0, hadError: false };   // controla a conquista "Bug Hunter Pro"
  var solvedServer = [];
  var guestSolved = core.store.get("guest-solved", []);
  var busy = false;

  function pyRepr(v) {
    if (v === true) return "True";
    if (v === false) return "False";
    if (v === null) return "None";
    if (Array.isArray(v)) return "[" + v.map(pyRepr).join(", ") + "]";
    if (typeof v === "string") return JSON.stringify(v);
    return String(v);
  }
  function jsRepr(v) { return JSON.stringify(v); }
  function callText(c, t) {
    var rep = c.language === "python" ? pyRepr : jsRepr;
    return c.fn + "(" + t.args.map(rep).join(", ") + ")";
  }
  function expText(c, t) { return (c.language === "python" ? pyRepr : jsRepr)(t.expected); }

  function isSolved(id) { return solvedServer.indexOf(id) !== -1 || (!hasSession() && guestSolved.indexOf(id) !== -1); }
  function hasSession() { return w.CQ && w.CQ.session && w.CQ.session.state === "ok"; }

  function renderSelect() {
    var keep = current ? current.id : null;
    sel.textContent = "";
    var count = 0;
    CHALLENGES.forEach(function (c, i) {
      var o = d.createElement("option");
      var done = isSolved(c.id);
      if (done) count++;
      o.value = c.id;
      o.textContent = (done ? "✅ " : "") + (i + 1) + ". " + c.title;
      sel.appendChild(o);
    });
    if (keep) sel.value = keep;
    $("solved-count").textContent = "(" + count + "/" + CHALLENGES.length + " resolvidos)";
    if (current) renderChip();
  }

  function renderChip() {
    var chip = $("challenge-badge");
    var lv = LEVELS[current.level];
    if (isSolved(current.id)) { chip.className = "chip done"; chip.textContent = "✅ Concluído"; }
    else { chip.className = "chip" + (lv[1] ? " " + lv[1] : ""); chip.textContent = "Nível " + lv[0] + " · " + (current.language === "python" ? "Python" : "JavaScript"); }
  }

  function renderTests(results) {
    testsEl.textContent = "";
    current.tests.forEach(function (t, i) {
      var li = d.createElement("li");
      var k = d.createElement("span"); k.className = "k"; k.textContent = "Teste " + (i + 1);
      var call = d.createElement("code"); call.textContent = callText(current, t);
      var arrow = d.createElement("span"); arrow.textContent = "deve dar";
      var exp = d.createElement("code"); exp.textContent = expText(current, t);
      li.appendChild(k); li.appendChild(call); li.appendChild(arrow); li.appendChild(exp);
      var r = results && results[i];
      if (r) {
        li.className = r.ok ? "pass" : "fail";
        var res = d.createElement("span");
        if (r.ok) res.textContent = "✔";
        else res.textContent = r.error ? "✘ " + r.error.split("\n")[0] : "✘ obteve " + r.got;
        li.appendChild(res);
      }
      testsEl.appendChild(li);
    });
  }

  function renderHints() {
    hintList.textContent = "";
    for (var i = 0; i < session.hints; i++) {
      var box = d.createElement("div");
      box.className = "hint-box";
      box.textContent = "💡 Dica " + (i + 1) + ": " + current.hints[i];
      hintList.appendChild(box);
    }
    var left = current.hints.length - session.hints;
    hintBtn.disabled = left <= 0;
    hintBtn.textContent = left > 0 ? "💡 Pedir uma dica (" + left + " restante" + (left > 1 ? "s" : "") + ")" : "Sem mais dicas";
  }

  function setOut(text, kind) { out.className = kind || ""; out.textContent = text; }

  function load(id, fresh) {
    current = byId[id] || CHALLENGES[0];
    session = { hints: 0, hadError: false };
    var saved = fresh ? null : core.store.get("bh:" + current.id, null);
    code.value = saved ? saved : current.code;
    $("challenge-title").textContent = current.title;
    $("challenge-desc").textContent = current.desc;
    core.setStatus(statusEl, current.language === "python" ? "Python 3.11" : "JavaScript", "");
    renderChip();
    renderTests(null);
    renderHints();
    setOut('Clique em "Testar código" para rodar os testes.', "muted");
    sel.value = current.id;
    try { history.replaceState(null, "", location.pathname + "?c=" + encodeURIComponent(current.id) + location.hash); } catch (e) { /* ignora */ }
    engines.warm(current.language);
  }

  function setBusy(b) {
    busy = b;
    btnTest.disabled = b; btnSubmit.disabled = b; btnReset.disabled = b; sel.disabled = b;
    core.setStatus(statusEl, b ? "Executando..." : (current.language === "python" ? "Python 3.11" : "JavaScript"), b ? "busy" : "");
  }

  function runTests() {
    var c = current;
    return engines.test(c.language, code.value, c.fn, c.tests, {
      onStatus: function (t) { core.setStatus(statusEl, t, "busy"); }
    }).then(function (res) {
      var results = res.results || [];
      var all = !res.error && results.length === c.tests.length && results.every(function (r) { return r.ok; });
      if (res.error) session.hadError = true;
      renderTests(res.error ? null : results);
      var okCount = results.filter(function (r) { return r.ok; }).length;
      var text;
      if (res.error) text = res.error;
      else if (all) text = "✅ Todos os " + c.tests.length + " testes passaram! Bom trabalho!";
      else text = "❌ " + okCount + " de " + c.tests.length + " testes passaram. Veja abaixo qual falhou e tente de novo.";
      if (res.output && !res.error) text += "\n\nSaída do seu código:\n" + res.output;
      setOut(text, all ? "success" : "error");
      return { all: all, res: res };
    });
  }

  function onTest() {
    if (busy) return;
    setBusy(true);
    runTests().then(function () { setBusy(false); }, function () { setBusy(false); });
  }

  function onSubmit() {
    if (busy) return;
    setBusy(true);
    var c = current;
    runTests().then(function (r) {
      if (r.res.loadFailed) { setBusy(false); return; }   // sem motor de execução: não conta como tentativa
      var payload = {
        challenge_id: c.id, passed: r.all, language: c.language,
        hints_used: session.hints, clean: session.hints === 0 && !session.hadError
      };
      return w.CQ.api("/api/bughunt/submit", payload).then(function (data) {
        setBusy(false);
        if (!data._ok) { setOut((r.all ? "✅ Testes ok, mas " : "") + (data.error || "não foi possível enviar agora."), "error"); return; }
        var msg = (r.all ? "✅ " : "❌ ") + (data.message || "");
        if (r.all && data.guest_mode) {
          if (guestSolved.indexOf(c.id) === -1) { guestSolved.push(c.id); core.store.set("guest-solved", guestSolved); }
        }
        if (data.solved) solvedServer = data.solved;
        w.CQ.update(data);
        if (!r.all) { setOut(msg + "\n\n(Os testes que falharam estão marcados em vermelho.)", "error"); }
        else setOut(msg, "success");
        renderSelect();
        if (r.all && !data.guest_mode) nextHint(c);
      });
    }).catch(function () { setBusy(false); });
  }

  // depois de acertar, sugere o próximo desafio ainda não resolvido
  function nextHint(c) {
    var idx = CHALLENGES.indexOf(c);
    for (var k = 1; k <= CHALLENGES.length; k++) {
      var n = CHALLENGES[(idx + k) % CHALLENGES.length];
      if (!isSolved(n.id)) { out.textContent += "\n\n➡ Próximo desafio: " + n.title + " (escolha na lista acima)."; return; }
    }
    out.textContent += "\n\n🏆 Você resolveu todos os desafios do Bug Hunt!";
  }

  function init() {
    core.enhanceEditor(code, { onRun: onTest });
    var bar = $("quickkeys");
    function keysFor(lang) {
      bar.textContent = "";
      core.keys[lang].forEach(function (k) {
        var b = d.createElement("button"), isTab = k === "\t";
        b.type = "button"; b.textContent = isTab ? "Tab" : k;
        b.setAttribute("aria-label", isTab ? "Inserir recuo" : "Inserir " + k);
        b.addEventListener("mousedown", function (ev) { ev.preventDefault(); });
        b.addEventListener("click", function () {
          var a = code.selectionStart, z = code.selectionEnd, text = isTab ? "    " : k;
          code.focus(); code.setRangeText(text, a, z, "end");
          if (text.length === 2 && "()[]{}\"\"''".indexOf(text) !== -1) code.setSelectionRange(a + 1, a + 1);
          code.dispatchEvent(new Event("input", { bubbles: true }));
        });
        bar.appendChild(b);
      });
    }

    var wanted = new URLSearchParams(location.search).get("c");
    var first = byId[wanted] ? wanted : core.store.get("bh:last", CHALLENGES[0].id);
    renderSelect();
    load(byId[first] ? first : CHALLENGES[0].id, false);
    keysFor(current.language);

    sel.addEventListener("change", function () {
      core.store.set("bh:last", sel.value);
      load(sel.value, false);
      keysFor(current.language);
    });
    code.addEventListener("input", function () { core.store.set("bh:" + current.id, code.value); });
    btnTest.addEventListener("click", onTest);
    btnSubmit.addEventListener("click", onSubmit);
    btnReset.addEventListener("click", function () {
      if (code.value !== current.code && !w.confirm("Voltar ao código original do desafio? Suas mudanças serão perdidas.")) return;
      core.store.del("bh:" + current.id);
      load(current.id, true);
    });
    hintBtn.addEventListener("click", function () {
      if (session.hints < current.hints.length) { session.hints += 1; renderHints(); }
    });

    // marca os já resolvidos quando a sessão chegar
    function applySession() {
      solvedServer = hasSession() ? (w.CQ.session.solved || []) : [];
      renderSelect();
    }
    if (w.CQ && w.CQ.ready) w.CQ.ready.then(applySession);
    d.addEventListener("cq:lab-session", applySession);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init); else init();
})(window, document);
