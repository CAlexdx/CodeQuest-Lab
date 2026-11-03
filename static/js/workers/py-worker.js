/* CodeQuest LAB - Python (Pyodide) em Web Worker.
 * Roda fora da página: um loop infinito não trava a tela, e o botão "Parar" encerra o worker. */
"use strict";

var py = null;

var HARNESS = [
  "import sys, io, json, builtins, traceback",
  "",
  "_DICAS = {",
  "    'NameError': 'Você usou um nome que ainda não foi criado. Confira a grafia e se a variável/função foi definida antes.',",
  "    'SyntaxError': 'O Python não entendeu a forma como o código foi escrito. Veja parênteses, aspas e dois-pontos (:).',",
  "    'IndentationError': 'O recuo (espaços no começo da linha) está errado. Linhas dentro de if/for/def precisam ficar mais para a direita.',",
  "    'TypeError': 'Você misturou tipos que não combinam (por exemplo, texto com número) ou chamou algo com argumentos errados.',",
  "    'ZeroDivisionError': 'Não dá para dividir por zero.',",
  "    'IndexError': 'Você tentou usar uma posição que não existe na lista/texto.',",
  "    'KeyError': 'Essa chave não existe no dicionário.',",
  "    'ValueError': 'O valor recebido não é válido para essa operação.',",
  "    'AttributeError': 'Esse objeto não tem esse método ou atributo. Confira o nome.',",
  "    'RecursionError': 'A função chamou a si mesma sem parar. Falta uma condição de parada?',",
  "}",
  "",
  "def _cq_err(e):",
  "    kind = type(e).__name__",
  "    line = None",
  "    if isinstance(e, SyntaxError):",
  "        line = e.lineno",
  "        msg = e.msg",
  "    else:",
  "        msg = str(e)",
  "        tb = e.__traceback__",
  "        while tb is not None:",
  "            if tb.tb_frame.f_code.co_filename == '<codigo>':",
  "                line = tb.tb_lineno",
  "            tb = tb.tb_next",
  "    where = ('Erro na linha %d' % line) if line else 'Erro'",
  "    text = '%s: %s: %s' % (where, kind, msg)",
  "    dica = _DICAS.get(kind) or (_DICAS.get('SyntaxError') if isinstance(e, SyntaxError) else None)",
  "    if dica:",
  "        text += '\\nDica: ' + dica",
  "    return text, line",
  "",
  "class _Capture:",
  "    def __enter__(self):",
  "        self.out = io.StringIO()",
  "        self.old = (sys.stdout, sys.stderr, builtins.input)",
  "        sys.stdout = self.out",
  "        sys.stderr = self.out",
  "        return self",
  "    def __exit__(self, *a):",
  "        sys.stdout, sys.stderr, builtins.input = self.old",
  "        return False",
  "",
  "def _make_input(cap, stdin_text):",
  "    lines = stdin_text.split('\\n') if stdin_text else []",
  "    pos = [0]",
  "    def fake_input(prompt=''):",
  "        cap.out.write(str(prompt))",
  "        if pos[0] < len(lines):",
  "            v = lines[pos[0]]",
  "            pos[0] += 1",
  "            cap.out.write(v + '\\n')",
  "            return v",
  "        raise EOFError('O código pediu input(), mas não há mais entradas. Escreva as entradas (uma por linha) no campo de entrada.')",
  "    return fake_input",
  "",
  "def _cq_run(src, stdin_text=''):",
  "    with _Capture() as cap:",
  "        builtins.input = _make_input(cap, stdin_text)",
  "        err = None",
  "        line = None",
  "        try:",
  "            exec(compile(src, '<codigo>', 'exec'), {'__name__': '__main__'})",
  "        except SystemExit:",
  "            pass",
  "        except BaseException as e:",
  "            err, line = _cq_err(e)",
  "    return json.dumps({'output': cap.out.getvalue(), 'error': err, 'line': line})",
  "",
  "def _cq_test(src, fn_name, tests_json):",
  "    tests = json.loads(tests_json)",
  "    results = []",
  "    with _Capture() as cap:",
  "        ns = {'__name__': '__main__'}",
  "        builtins.input = _make_input(cap, '')",
  "        err = None",
  "        line = None",
  "        try:",
  "            exec(compile(src, '<codigo>', 'exec'), ns)",
  "        except BaseException as e:",
  "            err, line = _cq_err(e)",
  "        fn = ns.get(fn_name)",
  "        if err is None and not callable(fn):",
  "            err = 'Erro: a função %s() não foi encontrada. Não apague nem renomeie a função.' % fn_name",
  "        if err is None:",
  "            for t in tests:",
  "                try:",
  "                    got = fn(*t['args'])",
  "                    results.append({'ok': got == t['expected'], 'got': repr(got)})",
  "                except BaseException as e:",
  "                    m, ln = _cq_err(e)",
  "                    results.append({'ok': False, 'got': None, 'error': m})",
  "    return json.dumps({'output': cap.out.getvalue(), 'error': err, 'line': line, 'results': results})",
].join("\n");

self.onmessage = async function (e) {
  var m = e.data;
  try {
    if (m.type === "init") {
      importScripts(m.base + "pyodide.js");
      py = await loadPyodide({ indexURL: m.base });
      py.runPython(HARNESS);
      self.postMessage({ type: "ready" });
      return;
    }
    if (!py) throw new Error("Python ainda não carregou.");
    if (m.type === "run") {
      var run = py.globals.get("_cq_run");
      var raw = run(m.code, m.stdin || "");
      run.destroy();
      self.postMessage({ type: "result", id: m.id, payload: JSON.parse(raw) });
    } else if (m.type === "test") {
      var test = py.globals.get("_cq_test");
      var raw2 = test(m.code, m.fn, JSON.stringify(m.tests));
      test.destroy();
      self.postMessage({ type: "result", id: m.id, payload: JSON.parse(raw2) });
    }
  } catch (err) {
    self.postMessage({ type: "fatal", id: m.id, error: String(err && err.message || err) });
  }
};
