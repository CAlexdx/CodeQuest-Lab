/* CodeQuest LAB - página inicial: saudação e progresso do Bug Hunt */
(function (w, d) {
  "use strict";

  function paint() {
    var s = w.CQ && w.CQ.session;
    var sub = d.getElementById("hub-sub");
    var bh = d.getElementById("hub-bughunt");
    var total = (w.CQ_CONFIG && w.CQ_CONFIG.bughuntTotal) || 8;
    if (!s || s.state !== "ok") return;
    if (sub) sub.textContent = "Olá, " + s.username + "! Pratique o que aprendeu nas trilhas: seu XP e suas conquistas são salvos no CodeQuest.";
    if (bh) bh.textContent = (s.solved || []).length + "/" + total + " resolvidos";
  }

  function init() {
    if (w.CQ && w.CQ.ready) w.CQ.ready.then(paint);
    d.addEventListener("cq:lab-session", paint);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init); else init();
})(window, document);
