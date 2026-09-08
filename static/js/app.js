function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  event.currentTarget.classList.add('active');
}

function submitChallenge() {
  const code = document.getElementById("challenge-python-code").value;

  const hasIntConversion = code.includes("int(input())") || code.includes("int(");
  const hasModOperator = code.includes("% 2");

  if (hasIntConversion && hasModOperator) {
    alert("PARABENS! Voce corrigiu a verificacao do Par ou Impar com sucesso!");
  } else {
    alert("RESPOSTA INCORRETA: Certifique-se de converter a entrada para inteiro com int() e usar o operador % para resto da divisao.");
  }
}