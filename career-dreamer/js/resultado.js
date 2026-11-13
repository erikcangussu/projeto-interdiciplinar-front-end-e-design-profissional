document.addEventListener("DOMContentLoaded", () => {
  const secaoResultado = document.getElementById("resultado");
  const secaoSemResultado = document.getElementById("sem-resultado");
  const elementoNome = document.getElementById("nome-usuario");
  const elementoSintese = document.getElementById("sintese");
  const listaCarreiras = document.getElementById("lista-carreiras");
  const templateCarreira = document.getElementById("modelo-carreira");

  const parametrosUrl = new URLSearchParams(window.location.search);
  const modoExemplo = parametrosUrl.has("exemplo");

  let dadosPerfil = null;

  if (modoExemplo && typeof DADOS_EXEMPLO !== "undefined") {
    dadosPerfil = DADOS_EXEMPLO;
  } else {
    const dadosSalvos = sessionStorage.getItem("resultadoPerfil");
    if (dadosSalvos) {
      try {
        dadosPerfil = JSON.parse(dadosSalvos);
      } catch (erro) {
        dadosPerfil = null;
      }
    }
  }

  const listaBrutaCarreiras =
    dadosPerfil && Array.isArray(dadosPerfil.recommended_careers)
      ? dadosPerfil.recommended_careers
      : dadosPerfil && Array.isArray(dadosPerfil.carreiras)
      ? dadosPerfil.carreiras
      : [];

  if (!dadosPerfil || listaBrutaCarreiras.length === 0) {
    if (secaoSemResultado) secaoSemResultado.hidden = false;
    if (secaoResultado) secaoResultado.hidden = true;
    return;
  }

  if (secaoResultado) secaoResultado.hidden = false;
  if (secaoSemResultado) secaoSemResultado.hidden = true;

  const nomeUsuario = dadosPerfil.user_name || dadosPerfil.nome || "Estudante";
  const sintesePerfil = dadosPerfil.career_identity_statement || dadosPerfil.sintese || "";

  if (elementoNome) elementoNome.textContent = nomeUsuario;
  if (elementoSintese) elementoSintese.textContent = sintesePerfil;

  const carreirasOrdenadas = [...listaBrutaCarreiras].sort((a, b) => {
    const notaA = Number(a.match_score ?? a.compatibilidade ?? 0);
    const notaB = Number(b.match_score ?? b.compatibilidade ?? 0);
    return notaB - notaA;
  });

  carreirasOrdenadas.forEach((carreira, indice) => {
    const clone = templateCarreira.content.cloneNode(true);
    const itemLista = clone.querySelector("li");

    if (indice === 0) {
      itemLista.classList.add("carreira--principal");
      const seloPrincipal = clone.querySelector(".carreira__selo");
      if (seloPrincipal) seloPrincipal.hidden = false;
    }

    const titulo = carreira.title || carreira.titulo || "";
    const compatibilidade = Math.max(
      0,
      Math.min(100, Number(carreira.match_score ?? carreira.compatibilidade ?? 0))
    );
    const resumo = carreira.summary || carreira.resumo || "";
    const competencias = carreira.key_skills || carreira.competencias || [];
    const roteiro = carreira.learning_path || carreira.roteiro || [];

    clone.querySelector(".carreira__titulo").textContent = titulo;
    clone.querySelector(".carreira__percentual").textContent = `${compatibilidade}%`;
    clone.querySelector(".carreira__resumo").textContent = resumo;

    const barraNivel = clone.querySelector(".barra__nivel");
    if (barraNivel) {
      barraNivel.style.setProperty("--nivel", `${compatibilidade}%`);
    }

    const listaChips = clone.querySelector(".chips");
    if (Array.isArray(competencias)) {
      competencias.forEach((competencia) => {
        const itemChip = document.createElement("li");
        itemChip.textContent = competencia;
        listaChips.appendChild(itemChip);
      });
    }

    const listaRoteiro = clone.querySelector(".roteiro");
    if (Array.isArray(roteiro)) {
      roteiro.forEach((passo) => {
        const itemPasso = document.createElement("li");
        itemPasso.textContent = passo;
        listaRoteiro.appendChild(itemPasso);
      });
    }

    listaCarreiras.appendChild(clone);
  });
});
