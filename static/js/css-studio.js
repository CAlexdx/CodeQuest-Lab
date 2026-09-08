const btnText = document.getElementById("css-btn-text");
const bgColor = document.getElementById("css-bg-color");
const textColor = document.getElementById("css-text-color");
const padding = document.getElementById("css-padding");
const radius = document.getElementById("css-radius");
const shadow = document.getElementById("css-shadow");
const borderWidth = document.getElementById("css-border-width");
const borderColor = document.getElementById("css-border-color");

const targetBtn = document.getElementById("target-element");
const cssOutput = document.getElementById("css-output");

function updateCSSStudio() {
  const padValue = `${padding.value}px ${padding.value * 2}px`;
  const radValue = `${radius.value}px`;
  const shadowValue = `0px 4px ${shadow.value}px rgba(0, 0, 0, 0.5)`;
  const borderValue = `${borderWidth.value}px solid ${borderColor.value}`;

  document.getElementById("val-padding").textContent = padValue;
  document.getElementById("val-radius").textContent = radValue;
  document.getElementById("val-shadow").textContent = `${shadow.value}px`;
  document.getElementById("val-border").textContent = `${borderWidth.value}px`;

  targetBtn.textContent = btnText.value || "Botao";
  targetBtn.style.backgroundColor = bgColor.value;
  targetBtn.style.color = textColor.value;
  targetBtn.style.padding = padValue;
  targetBtn.style.borderRadius = radValue;
  targetBtn.style.boxShadow = shadowValue;
  targetBtn.style.border = borderValue;

  cssOutput.value = `.meu-botao {\n  background-color: ${bgColor.value};\n  color: ${textColor.value};\n  padding: ${padValue};\n  border-radius: ${radValue};\n  border: ${borderValue};\n  box-shadow: ${shadowValue};\n}`;
}

[btnText, bgColor, textColor, padding, radius, shadow, borderWidth, borderColor].forEach(el => {
  el.addEventListener("input", updateCSSStudio);
});

updateCSSStudio();

function copyCSS() {
  navigator.clipboard.writeText(cssOutput.value);
  alert("Codigo CSS copiado!");
}