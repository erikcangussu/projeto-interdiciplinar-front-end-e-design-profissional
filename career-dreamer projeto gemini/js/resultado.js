document.addEventListener("DOMContentLoaded", () => {
  const sectionResultado = document.getElementById("resultado");
  const sectionSemResultado = document.getElementById("sem-resultado");
  const elNome = document.getElementById("nome-usuario");
  const elSintese = document.getElementById("sintese");
  const listaCarreiras = document.getElementById("lista-carreiras");
  const modeloTemplate = document.getElementById("modelo-carreira");

  const urlParams = new URLSearchParams(window.location.search);
  const isExemplo = urlParams.has("exemplo");

  let dados = null;

  if (isExemplo && typeof DADOS_EXEMPLO !== "undefined") {
    dados = DADOS_EXEMPLO;
  } else {
    const dadosSalvos = sessionStorage.getItem("resultadoPerfil");
    if (dadosSalvos) {
      try {
        dados = JSON.parse(dadosSalvos);
      } catch (e) {
        dados = null;
      }
    }
  }

  if (!dados || !dados.carreiras || dados.carreiras.length === 0) {
    if (sectionSemResultado) sectionSemResultado.hidden = false;
    if (sectionResultado) sectionResultado.hidden = true;
    return;
  }

  if (sectionResultado) sectionResultado.hidden = false;
  if (sectionSemResultado) sectionSemResultado.hidden = true;

  if (elNome) elNome.textContent = dados.nome || "Visitante";
  if (elSintese) elSintese.textContent = dados.sintese || "";

  const carreirasOrdenadas = [...dados.carreiras].sort((a, b) => b.compatibilidade - a.compatibilidade);

  carreirasOrdenadas.forEach((carreira, index) => {
    const clone = modeloTemplate.content.cloneNode(true);
    const li = clone.querySelector("li");

    if (index === 0) {
      li.classList.add("carreira--principal");
      const selo = clone.querySelector(".carreira__selo");
      if (selo) selo.hidden = false;
    }

    clone.querySelector(".carreira__titulo").textContent = carreira.titulo;
    clone.querySelector(".carreira__percentual").textContent = `${carreira.compatibilidade}%`;
    clone.querySelector(".carreira__resumo").textContent = carreira.resumo;

    const barraNivel = clone.querySelector(".barra__nivel");
    if (barraNivel) {
      barraNivel.style.setProperty("--nivel", `${carreira.compatibilidade}%`);
    }

    const ulChips = clone.querySelector(".chips");
    if (carreira.competencias && Array.isArray(carreira.competencias)) {
      carreira.competencias.forEach(comp => {
        const chip = document.createElement("li");
        chip.textContent = comp;
        ulChips.appendChild(chip);
      });
    }

    const olRoteiro = clone.querySelector(".roteiro");
    if (carreira.roteiro && Array.isArray(carreira.roteiro)) {
      carreira.roteiro.forEach(passo => {
        const itemRoteiro = document.createElement("li");
        itemRoteiro.textContent = passo;
        olRoteiro.appendChild(itemRoteiro);
      });
    }

    listaCarreiras.appendChild(clone);
  });
});
