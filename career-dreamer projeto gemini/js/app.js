document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-perfil");
  const modal = document.getElementById("modal-aviso");
  const btnEnviar = document.getElementById("btn-enviar");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    ocultarErros();

    const nomeInput = document.getElementById("nome");
    const hobbiesInput = document.getElementById("hobbies");
    const interessesInput = document.getElementById("interesses");

    const nome = nomeInput.value.trim();
    
    const hobbies = hobbiesInput.value
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const interesses = interessesInput.value
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    let temErro = false;

    if (!nome || nome.length < 2) {
      exibirErro("erro-nome", "Por favor, informe seu nome (mínimo 2 caracteres).");
      temErro = true;
    }

    if (hobbies.length === 0) {
      exibirErro("erro-hobbies", "Por favor, informe pelo menos um hobby válido.");
      temErro = true;
    }

    if (interesses.length === 0) {
      exibirErro("erro-interesses", "Por favor, informe pelo menos uma área de interesse válida.");
      temErro = true;
    }

    if (temErro) return;

    const apiUrl = typeof API_URL !== "undefined" ? API_URL : "";

    if (!apiUrl || apiUrl.trim() === "") {
      exibirModal("Tente mais tarde", "O serviço ainda não está disponível.");
      return;
    }

    btnEnviar.disabled = true;
    const textoOriginalBotao = btnEnviar.textContent;
    btnEnviar.textContent = "Analisando perfil...";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, hobbies, interesses }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Erro na comunicação com a API");
      }

      const dados = await response.json();
      sessionStorage.setItem("resultadoPerfil", JSON.stringify(dados));
      window.location.href = "resultado.html";

    } catch (error) {
      clearTimeout(timeoutId);
      exibirModal("Tente mais tarde", "Não foi possível conectar ao serviço de análise. Tente novamente.");
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = textoOriginalBotao;
    }
  });

  function exibirErro(idElemento, mensagem) {
    const el = document.getElementById(idElemento);
    if (el) {
      el.textContent = mensagem;
      el.hidden = false;
    }
  }

  function ocultarErros() {
    const erros = document.querySelectorAll(".mensagem-erro");
    erros.forEach(el => {
      el.textContent = "";
      el.hidden = true;
    });
  }

  function exibirModal(titulo, mensagem) {
    const modalTitulo = document.getElementById("modal-titulo");
    const modalMensagem = document.getElementById("modal-mensagem");
    if (modalTitulo) modalTitulo.textContent = titulo;
    if (modalMensagem) modalMensagem.textContent = mensagem;
    if (modal && typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      alert(`${titulo}: ${mensagem}`);
    }
  }
});
