document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-perfil");
  const modalAviso = document.getElementById("modal-aviso");
  const botaoEnviar = document.getElementById("btn-enviar");

  if (!formulario) return;

  const campoNome = document.getElementById("nome");
  const campoHobbies = document.getElementById("hobbies");
  const campoInteresses = document.getElementById("interesses");

  const extrairItensLista = (texto) => {
    return texto
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const exibirErroCampo = (campo, idErro, mensagem) => {
    const elementoErro = document.getElementById(idErro);
    if (campo) {
      campo.setAttribute("aria-invalid", "true");
    }
    if (elementoErro) {
      elementoErro.textContent = mensagem;
      elementoErro.hidden = false;
    }
  };

  const limparErros = () => {
    [campoNome, campoHobbies, campoInteresses].forEach((campo) => {
      if (campo) campo.removeAttribute("aria-invalid");
    });

    document.querySelectorAll(".mensagem-erro").forEach((el) => {
      el.textContent = "";
      el.hidden = true;
    });
  };

  const exibirModal = (titulo, mensagem) => {
    const modalTitulo = document.getElementById("modal-titulo");
    const modalMensagem = document.getElementById("modal-mensagem");

    if (modalTitulo) modalTitulo.textContent = titulo;
    if (modalMensagem) modalMensagem.textContent = mensagem;

    if (modalAviso && typeof modalAviso.showModal === "function") {
      if (!modalAviso.open) {
        modalAviso.showModal();
      }
    }
  };

  if (modalAviso) {
    modalAviso.addEventListener("click", (evento) => {
      if (evento.target === modalAviso) {
        modalAviso.close();
      }
    });
  }

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (botaoEnviar.disabled) return;

    limparErros();

    const nome = campoNome.value.trim();
    const hobbies = extrairItensLista(campoHobbies.value);
    const interesses = extrairItensLista(campoInteresses.value);

    let formularioValido = true;

    if (nome.length < 2 || nome.length > 60) {
      exibirErroCampo(
        campoNome,
        "erro-nome",
        "Por favor, informe seu nome completo ou apelido (entre 2 e 60 caracteres)."
      );
      formularioValido = false;
    }

    if (hobbies.length === 0) {
      exibirErroCampo(
        campoHobbies,
        "erro-hobbies",
        "Por favor, informe pelo menos um hobby válido."
      );
      formularioValido = false;
    }

    if (interesses.length === 0) {
      exibirErroCampo(
        campoInteresses,
        "erro-interesses",
        "Por favor, informe pelo menos uma área de interesse válida."
      );
      formularioValido = false;
    }

    if (!formularioValido) {
      const primeiroInvalido = formulario.querySelector('[aria-invalid="true"]');
      if (primeiroInvalido) primeiroInvalido.focus();
      return;
    }

    const urlApi = typeof CONFIG !== "undefined" && CONFIG.API_URL ? CONFIG.API_URL.trim() : "";

    if (!urlApi) {
      exibirModal(
        "Tente mais tarde",
        "O serviço de análise ainda não está disponível no momento. Por favor, tente novamente mais tarde."
      );
      return;
    }

    botaoEnviar.disabled = true;
    const spanTextoBotao = botaoEnviar.querySelector("span");
    const textoOriginal = spanTextoBotao ? spanTextoBotao.textContent : botaoEnviar.textContent;
    if (spanTextoBotao) {
      spanTextoBotao.textContent = "Analisando seu perfil...";
    } else {
      botaoEnviar.textContent = "Analisando seu perfil...";
    }

    const controladorAbort = new AbortController();
    const idTimeout = setTimeout(() => controladorAbort.abort(), 70000);

    try {
      const resposta = await fetch(urlApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome,
          hobbies: hobbies,
          interests: interesses
        }),
        signal: controladorAbort.signal
      });

      clearTimeout(idTimeout);

      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }

      const dadosResposta = await resposta.json();
      sessionStorage.setItem("resultadoPerfil", JSON.stringify(dadosResposta));
      window.location.href = "resultado.html";
    } catch (erro) {
      clearTimeout(idTimeout);
      const mensagemErro =
        erro.name === "AbortError"
          ? "A análise demorou mais do que o esperado para responder. Seus dados foram mantidos; por favor, tente novamente."
          : "Não foi possível concluir a análise agora. Seus dados foram mantidos; tente novamente mais tarde.";

      exibirModal("Tente mais tarde", mensagemErro);
    } finally {
      botaoEnviar.disabled = false;
      if (spanTextoBotao) {
        spanTextoBotao.textContent = textoOriginal;
      } else {
        botaoEnviar.textContent = textoOriginal;
      }
    }
  });
});
