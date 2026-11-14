# </> Career Dreamer

Aplicação web de **mapeamento vocacional em tecnologia** que transforma os hobbies e áreas de interesse do usuário em recomendações personalizadas de carreira, com percentual de compatibilidade, competências-chave e roteiro inicial de estudos.

---

## Visão Geral

O **Career Dreamer** foi desenvolvido como projeto acadêmico do curso de **Análise e Desenvolvimento de Sistemas** com foco em experiência do usuário (UI/UX), semântica HTML5, acessibilidade (WCAG AA) e integração com APIs REST.

### Principais Funcionalidades

* **Formulário de Perfil:** Coleta nome, hobbies e áreas de interesse separados por vírgula, com validação inline e feedback acessível (`aria-invalid` e `role="alert"`).


* **Análise Vocacional via API:** Envia os dados estruturados em JSON (`POST`) para o endpoint configurado e processa o retorno com timeout controlado.


* **Mapa de Carreiras (`resultado.html`):** Exibe a síntese do perfil e ordena as carreiras recomendadas pela maior compatibilidade (`match_score`), destacando a melhor combinação, competências-chave e passos de estudo.


* **Modo Demonstração (`?exemplo`):** Permite visualizar um mapa de carreira completo mesmo antes de configurar o backend ou preencher o formulário.


* **Tratamento de Indisponibilidade:** Caso a API não esteja configurada ou ocorra falha de comunicação, exibe um aviso amigável por meio de `<dialog>` nativo preservando os dados digitados.



---

## Estrutura de Arquivos

```text
career-dreamer/
├── index.html           # Página inicial com apresentação, formulário e seção "Como funciona"
├── resultado.html       # Página de exibição do mapa de carreiras e roteiro de estudos
├── css/
│   └── style.css        # Estilos responsivos, variáveis de tema e regras de acessibilidade
└── js/
    ├── config.js        # Configuração centralizada da URL da API
    ├── app.js           # Validação do formulário, envio à API e controle do modal de aviso
    ├── resultado.js     # Leitura do sessionStorage / modo exemplo e renderização dos cards
    └── dados-exemplo.js # Mock de dados utilizado no modo de demonstração (?exemplo)

```

---

## Tecnologias Utilizadas

* **HTML5 Semântico:** Uso de `<header>`, `<main>`, `<section>`, `<article>`, `<template>`, `<dialog>` e `<footer>`.


* **CSS3 Moderno:** Custom Properties (`:root`), CSS Grid, Flexbox, `clamp()` para tipografia fluida, suporte a `prefers-reduced-motion` e foco visível via teclado (`:focus-visible`).


* **JavaScript (ES6+):** Fetch API com `AbortController`, manipulação segura do DOM via `textContent` e armazenamento temporário com `sessionStorage`.


* **Tipografia:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (títulos) e [DM Sans](https://fonts.google.com/specimen/DM+Sans) (corpo de texto).



---

## Como Executar o Projeto

1. **Clone ou extraia** os arquivos do projeto em seu computador.
2. *(Opcional)* **Configure a URL da API** abrindo o arquivo `js/config.js` e preenchendo o campo `API_URL`:


```javascript
const CONFIG = Object.freeze({
  API_URL: "https://sua-api.com/analisar-perfil"
});

```


> **Nota:** Se `API_URL` permanecer vazio (`""`), o formulário validará os campos normalmente e exibirá o modal informativo *"Tente mais tarde"*, enquanto o botão **"Ver resultado de exemplo"** funcionará de forma offline.
> 
> 


3. **Abra no navegador:** Basta abrir o arquivo `index.html` diretamente ou utilizar uma extensão como o **Live Server** (VS Code).

---

## Contrato Esperado da API

### Requisição (`POST`)

```json
{
  "name": "Ana Maria Clara",
  "hobbies": ["desenhar", "jogar videogame", "organizar eventos"],
  "interests": ["design de interfaces", "desenvolvimento web"]
}

```

### Resposta (`200 OK`)

```json
{
  "user_name": "Ana Maria Clara",
  "career_identity_statement": "Síntese personalizada do perfil profissional...",
  "recommended_careers": [
    {
      "id": "ux-ui-designer",
      "title": "Designer de UX/UI",
      "match_score": 94,
      "summary": "Descrição resumida da atuação profissional.",
      "key_skills": ["Figma", "Prototipagem", "Pesquisa com usuários"],
      "learning_path": [
        "Passo 1 do roteiro de estudos",
        "Passo 2 do roteiro de estudos"
      ]
    }
  ]
}

```

---

## Licença

Projeto desenvolvido para fins educacionais no curso de **Análise e Desenvolvimento de Sistemas**.

## Desenvolvedores

Erik Coutinho Canguçu;
Luis Henrique dos Santos Oliveira;
Kelvin Telis da Silva;
Vitória Tiemmy Carvalho Oda;
Jonatas Ferreira Dias Vieira;
Lucas Vinicius Bento Silva;
