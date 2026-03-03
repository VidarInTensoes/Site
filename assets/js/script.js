/**
 * =========================================================
 * VIDAR EM IN-TENSÕES - SCRIPT.JS (REFATORADO E SEGURO)
 * - Mesma funcionalidade do seu JS atual
 * - Inicialização por página (só roda o que existir)
 * - Um único DOMContentLoaded (evita duplicidades)
 * - Mantém seu comportamento atual (sem mudar layout)
 * =========================================================
 */


/* =========================================================
   10) ONDAS INTERATIVAS NO HERO (INDEX)
========================================================= */
function initOndasHeroMouse() {
  const hero = document.querySelector(".hero-vidar-anim");
  const canvas = document.querySelector(".hero-vidar-ondas");
  if (!hero || !canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  let width = 0;
  let height = 0;
  let lastSpawn = 0;

  const ripples = [];
  const pointer = { x: 0, y: 0, active: false };

  function resizeCanvas() {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function addRipple(x, y, baseRadius = 8) {
    ripples.push({
      x,
      y,
      radius: baseRadius,
      alpha: 0.36,
      speed: 2.6 + Math.random() * 0.8,
    });
  }

  function drawRipples() {
    for (let index = ripples.length - 1; index >= 0; index--) {
      const ripple = ripples[index];
      ripple.radius += ripple.speed;
      ripple.alpha *= 0.972;

      if (ripple.alpha < 0.02) {
        ripples.splice(index, 1);
        continue;
      }

      const gradient = context.createRadialGradient(
        ripple.x,
        ripple.y,
        0,
        ripple.x,
        ripple.y,
        ripple.radius
      );

      gradient.addColorStop(0, `rgba(243, 231, 205, ${ripple.alpha * 0.24})`);
      gradient.addColorStop(1, "rgba(243, 231, 205, 0)");

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      context.fill();

      context.lineWidth = 1.6;
      context.strokeStyle = `rgba(243, 231, 205, ${ripple.alpha * 0.6})`;
      context.beginPath();
      context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      context.stroke();
    }
  }

  function drawWaveBands(time) {
    const normalizedX = pointer.active ? pointer.x / width : 0.5;
    const amplitudeBase = 8 + normalizedX * 8;
    const lines = 4;

    for (let line = 0; line < lines; line++) {
      const yBase = height * (0.24 + line * 0.17);
      const amplitude = amplitudeBase + line * 1.8;
      const frequency = 0.008 + line * 0.0013;
      const phase = time * (0.0014 + line * 0.0004);

      context.lineWidth = 1.1 + line * 0.25;
      context.strokeStyle = `rgba(243, 231, 205, ${0.07 + line * 0.03})`;
      context.beginPath();

      for (let x = 0; x <= width; x += 8) {
        const influence = pointer.active
          ? Math.max(0, 1 - Math.abs(x - pointer.x) / 360)
          : 0.2;
        const y =
          yBase +
          Math.sin(x * frequency + phase) * amplitude * (0.55 + influence);
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }
  }

  function render(time) {
    context.clearRect(0, 0, width, height);
    drawWaveBands(time || 0);
    drawRipples();
    requestAnimationFrame(render);
  }

  function handlePointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;

    const now = performance.now();
    if (now - lastSpawn > 28) {
      addRipple(pointer.x, pointer.y, 9);
      lastSpawn = now;
    }
  }

  function handlePointerLeave() {
    pointer.active = false;
  }

  resizeCanvas();
  requestAnimationFrame(render);

  window.addEventListener("resize", resizeCanvas);
  hero.addEventListener("mousemove", handlePointerMove);
  hero.addEventListener("mouseleave", handlePointerLeave);
}

/* =========================================================
   1) MENU RESPONSIVO (GLOBAL)
========================================================= */
function initMenuResponsivo() {
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  if (!menuToggle || !menu) return;

  function resetHamburger() {
    const spans = menuToggle.querySelectorAll("span");
    if (spans.length < 3) return;
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[1].style.transform = "none";
    spans[2].style.transform = "none";
  }

  function setHamburgerAsX() {
    const spans = menuToggle.querySelectorAll("span");
    if (spans.length < 3) return;
    spans[0].style.transform = "rotate(45deg) translate(6px, 6px)";
    spans[1].style.opacity = "0";
    spans[1].style.transform = "scale(0)";
    spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
  }

  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("show");

    if (menu.classList.contains("show")) {
      setHamburgerAsX();
    } else {
      resetHamburger();
    }
  });

  // Fechar menu ao clicar em um item (mobile)
  document.querySelectorAll("#menu a").forEach((item) => {
    item.addEventListener("click", () => {
      menu.classList.remove("show");
      resetHamburger();
    });
  });

  // Fechar menu ao clicar fora (mobile)
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
      menu.classList.remove("show");
      resetHamburger();
    }
  });
}

/* =========================================================
   2) NEWSLETTER (GLOBAL)
========================================================= */
function initNewsletter() {
  const formNewsletter = document.getElementById("newsletterForm");
  if (!formNewsletter) return;

  formNewsletter.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = formNewsletter.querySelector("input");
    if (!emailInput) return;

    const email = emailInput.value;

    if (validateEmail(email)) {
      alert(`Obrigado por se inscrever com o e-mail: ${email}`);
      formNewsletter.reset();
    } else {
      alert("Por favor, insira um e-mail válido.");
      emailInput.focus();
    }
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/* =========================================================
   3) DESTAQUE NOS CARDS DE NOTCIAS (INDEX)
========================================================= */
function initHoverCardsNoticias() {
  const cards = document.querySelectorAll(".card-noticia");
  if (cards.length === 0) return;

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
    });
  });
}

/* =========================================================
   4) ATUALIZAR ANO DO RODAP (GLOBAL)
========================================================= */
function initAnoRodape() {
  const yearElement = document.querySelector("footer p:last-child");
  if (!yearElement) return;

  const currentYear = new Date().getFullYear();
  yearElement.textContent = yearElement.textContent.replace(
    /\d{4}/,
    currentYear
  );
}

/* =========================================================
   5) SLIDESHOW AUTOMTICO (INDEX)
========================================================= */
function initSlideshowDestaque() {
  const slides = document.querySelectorAll(".slide-bg");
  if (slides.length === 0) return;

  let currentSlide = 0;

  function mudarSlide() {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  setInterval(mudarSlide, 4000);
}

/* =========================================================
   6) ANIMAÇÕES DA PÁGINA SOBRE
========================================================= */
function initAnimacoesSobre() {
  const elementos = document.querySelectorAll(
    ".timeline-item, .linha-card, .pilar-card, .parceiro-logo"
  );

  if (elementos.length === 0) return;

  const observador = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // Delay individual para os itens da timeline (mantido)
          if (entry.target.classList.contains("timeline-item")) {
            const index = Array.from(
              entry.target.parentElement.children
            ).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.2}s`;
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  elementos.forEach((elemento) => {
    observador.observe(elemento);
  });
}

/* =========================================================
   7) GARANTIR VISIBILIDADE NO MOBILE (GLOBAL AUXILIAR)
========================================================= */
function garantirVisibilidadeMobile() {
  if (window.innerWidth <= 768) {
    const elementosCriticos = [
      "main",
      "section",
      ".container",
      ".grid-noticias",
    ];

    elementosCriticos.forEach((seletor) => {
      const elementos = document.querySelectorAll(seletor);
      elementos.forEach((el) => {
        el.style.display = "block";
        el.style.visibility = "visible";
        el.style.opacity = "1";
      });
    });
  }
}

/* =========================================================
   8) SISTEMA DE BUSCA EM TEMPO REAL (PUBLICAÇÕES)
   - Mesma lógica do seu código atual
   - Só inicializa se existir barra/campo/itens
========================================================= */
function initBuscaPublicacoes() {
  const campoBusca = document.getElementById("campoBusca");
  const btnLimpar = document.getElementById("limparBusca");
  const contador = document.getElementById("contador");
  const publicacoes = document.querySelectorAll(".publicacao-item");
  const barraBuscaContainer = document.querySelector(".barra-busca-container");

  // Se não for a página de publicações, não roda
  if (
    !campoBusca ||
    !btnLimpar ||
    !contador ||
    !barraBuscaContainer ||
    publicacoes.length === 0
  )
    return;

  // Armazenar os títulos originais para restaurar depois
  const titulosOriginais = new Map();
  publicacoes.forEach((pub) => {
    const titulo = pub.querySelector(".publicacao-titulo");
    if (titulo) titulosOriginais.set(pub, titulo.innerHTML);
  });

  // Criar elemento para "sem resultados"
  const semResultados = document.createElement("div");
  semResultados.className = "sem-resultados";
  semResultados.innerHTML = `
    <i class="fas fa-search"></i>
    <h3>Nenhuma publicação encontrada</h3>
    <p>Tente usar outros termos ou verificar a ortografia.</p>
  `;

  // Inserir após a barra de busca (somente se ainda não existe)
  // Evita duplicar caso o script seja reexecutado por algum motivo.
  const jaExisteSemResultados = document.querySelector(".sem-resultados");
  if (!jaExisteSemResultados) {
    barraBuscaContainer.parentNode.insertBefore(
      semResultados,
      barraBuscaContainer.nextSibling
    );
  } else {
    // Se já existe, usa o existente
    semResultados.remove();
  }
  const semResultadosEl = document.querySelector(".sem-resultados");

  function restaurarTituloOriginal(publicacao) {
    const tituloOriginal = titulosOriginais.get(publicacao);
    const tituloElemento = publicacao.querySelector(".publicacao-titulo");
    if (
      tituloOriginal &&
      tituloElemento &&
      tituloElemento.innerHTML !== tituloOriginal
    ) {
      tituloElemento.innerHTML = tituloOriginal;
    }
  }

  function destacarTexto(elemento, termo) {
    if (!elemento) return;
    const textoOriginal = elemento.textContent;
    const regex = new RegExp(
      `(${termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const novoTexto = textoOriginal.replace(
      regex,
      '<span class="destaque-busca">$1</span>'
    );

    if (elemento.innerHTML !== novoTexto) {
      elemento.innerHTML = novoTexto;
    }
  }

  function atualizarContador(resultados, termo) {
    if (!termo) {
      contador.textContent = `Mostrando todas as ${publicacoes.length} publicações`;
    } else if (resultados === 0) {
      contador.textContent = `Nenhum resultado para "${termo}"`;
    } else if (resultados === 1) {
      contador.textContent = `1 publicação encontrada para "${termo}"`;
    } else {
      contador.textContent = `${resultados} publicações encontradas para "${termo}"`;
    }
  }

  function buscarPublicacoes(termo) {
    termo = (termo || "").toLowerCase().trim();
    let resultados = 0;

    publicacoes.forEach((publicacao) => {
      const tituloElemento = publicacao.querySelector(".publicacao-titulo");
      if (!tituloElemento) return;

      const tituloTexto = tituloElemento.textContent.toLowerCase();
      const corresponde = tituloTexto.includes(termo);

      if (corresponde) {
        publicacao.classList.add("resultado-correspondente");
        publicacao.classList.remove("oculto");
        resultados++;

        if (termo) {
          destacarTexto(tituloElemento, termo);
        } else {
          restaurarTituloOriginal(publicacao);
        }
      } else {
        publicacao.classList.remove("resultado-correspondente");
        publicacao.classList.add("oculto");
        restaurarTituloOriginal(publicacao);
      }
    });

    if (!termo) {
      publicacoes.forEach((publicacao) => {
        restaurarTituloOriginal(publicacao);
        publicacao.classList.remove("oculto");
        publicacao.classList.remove("resultado-correspondente");
      });
      resultados = publicacoes.length;
    }

    atualizarContador(resultados, termo);

    if (semResultadosEl) {
      if (termo && resultados === 0) {
        semResultadosEl.classList.add("mostrar");
      } else {
        semResultadosEl.classList.remove("mostrar");
      }
    }

    if (termo) {
      btnLimpar.classList.add("visivel");
    } else {
      btnLimpar.classList.remove("visivel");
    }
  }

  function limparBusca() {
    campoBusca.value = "";

    publicacoes.forEach((publicacao) => {
      restaurarTituloOriginal(publicacao);
      publicacao.classList.remove("oculto");
      publicacao.classList.remove("resultado-correspondente");
    });

    atualizarContador(publicacoes.length, "");

    btnLimpar.classList.remove("visivel");
    if (semResultadosEl) semResultadosEl.classList.remove("mostrar");

    campoBusca.focus();
  }

  // Event listeners
  campoBusca.addEventListener("input", (e) =>
    buscarPublicacoes(e.target.value)
  );
  btnLimpar.addEventListener("click", limparBusca);

  campoBusca.addEventListener("keydown", (e) => {
    if (e.key === "Escape") limparBusca();
  });

  // Estado inicial
  buscarPublicacoes("");
}

/* =========================================================
   9) MODAL DE PROJETOS (PROJETOS)
   - Mesma funcionalidade do seu código atual
   - Só roda se existir modal + cards
   - Proteções para evitar erro se faltar algum elemento
========================================================= */
function initModalProjetos() {
  const cardsProjetos = document.querySelectorAll(".card-projeto-modal");
  const modal = document.getElementById("modalProjeto");
  if (cardsProjetos.length === 0 || !modal) return;

  const modalClose = modal.querySelector(".modal-close");
  const modalOverlay = modal.querySelector(".modal-overlay");
  if (!modalClose || !modalOverlay) return;

  const btnRelatorio = document.getElementById("modalBtnRelatorio");
  const btnProjetoCompleto = document.getElementById("modalBtnProjetoCompleto");

  // Dados dos projetos
  const projetosData = {
    1: {
      titulo:
        "Floresta em pé pelas mãos de mulheres agricultoras do Careiro Castanho (AM)",
      subtitulo:
        "Currículos vivos amazônicos em narrativas ecofeministas",
      descricao:
        "O projeto investiga práticas de mulheres agricultoras da região do Careiro Castanho (AM), articulando emergência climática, educação e ecofeminismos. A proposta busca valorizar saberes territoriais e modos de existência que sustentam currículos vivos amazônicos.",
      objetivos: [
        "Mapear narrativas e práticas das mulheres agricultoras em seus territórios",
        "Fortalecer currículos vivos amazônicos em perspectiva ecofeminista",
        "Produzir materiais formativos para educação e pesquisa na Amazônia",
        "Contribuir com ações de cuidado ambiental e justiça socioecológica",
      ],
      duracao: "36 meses",
      coordenacao: "Prof. Fabiane Andrade",
      financiamento: "CNPq - Edital Universal",
      orcamento: "R$ 180.000,00",
      links: {
        relatorio: "",
        projetoCompleto:
          "./assets/Arquivos/Projetos/EBOOK_Invencionices-floresteiras.pdf",
      },
      equipe: [
        { nome: "Fabiane Andrade", funcao: "Coordenadora" },
        { nome: "Hívina Dorzane", funcao: "Pesquisadora" },
        { nome: "Mônica Costa", funcao: "Pesquisadora" },
      ],
    },
    2: {
      titulo:
        "Currículos vivos cultivados por mulheres camponesas amazônidas colombianas",
      subtitulo:
        "Educações ecofeministas, cultura e saberes tradicionais",
      descricao:
        "A proposta se vincula à área prioritária de educação, cultura, povos e saberes tradicionais. O estudo investiga currículos vivos cultivados por mulheres amazônidas de coletivos camponeses, articulando experiências de formação, território e práticas ecofeministas.",
      objetivos: [
        "Analisar práticas educativas de mulheres camponesas amazônidas",
        "Valorizar saberes tradicionais e modos de vida territoriais",
        "Produzir referências para formações ecofeministas em contexto amazônico",
        "Fortalecer redes de pesquisa e colaboração entre coletivos",
      ],
      duracao: "24 meses",
      coordenacao: "Prof. Mônica de Oliveira Costa",
      financiamento: "CNPq - Edital Universal",
      orcamento: "Em execução",
      links: {
        relatorio: "",
        projetoCompleto:
          "./assets/Arquivos/Projetos/Em andamento/projeto curriculos vivos camponesas.pdf",
      },
      equipe: [
        { nome: "Mônica de Oliveira Costa", funcao: "Coordenadora" },
        { nome: "Caroline Barroncas de Oliveira", funcao: "Pesquisadora" },
        { nome: "Daniela Franco Carvalho", funcao: "Pesquisadora" },
        { nome: "Fernanda Helena Nogueira Ferreira", funcao: "Pesquisadora" },
      ],
    },
  };

  // Abrir modal ao clicar no card
  cardsProjetos.forEach((card) => {
    card.addEventListener("click", function () {
      const projetoId = this.dataset.projeto;
      abrirModal(projetoId);
    });
  });

  // Fechar modal
  modalClose.addEventListener("click", fecharModal);
  modalOverlay.addEventListener("click", fecharModal);

  // Fechar com ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("ativo")) {
      fecharModal();
    }
  });

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "";
  }

  function configurarBotaoAcao(botao, href, opcoes = {}) {
    if (!botao) return;

    const { download = false, tituloIndisponivel = "Documento indisponível no momento." } =
      opcoes;

    if (href) {
      botao.setAttribute("href", href);
      botao.removeAttribute("aria-disabled");
      botao.classList.remove("btn-indisponivel");
      botao.removeAttribute("title");
      botao.tabIndex = 0;

      if (download) {
        botao.setAttribute("download", "");
      } else {
        botao.removeAttribute("download");
      }
      return;
    }

    botao.removeAttribute("href");
    botao.removeAttribute("download");
    botao.setAttribute("aria-disabled", "true");
    botao.classList.add("btn-indisponivel");
    botao.setAttribute("title", tituloIndisponivel);
    botao.tabIndex = -1;
  }

  function abrirModal(projetoId) {
    const projeto = projetosData[projetoId];
    if (!projeto) return;

    setText("modalTitulo", projeto.titulo);
    setText("modalSubtitulo", projeto.subtitulo);
    setText("modalDescricao", projeto.descricao);
    setText("modalDuracao", projeto.duracao);
    setText("modalCoordenacao", projeto.coordenacao);
    setText("modalFinanciamento", projeto.financiamento);
    setText("modalOrcamento", projeto.orcamento);

    configurarBotaoAcao(btnRelatorio, projeto.links?.relatorio, {
      download: true,
      tituloIndisponivel: "Relatório ainda não disponível para este projeto.",
    });

    configurarBotaoAcao(btnProjetoCompleto, projeto.links?.projetoCompleto, {
      download: false,
      tituloIndisponivel: "Documento completo ainda não disponível para este projeto.",
    });

    // Objetivos
    const objetivosList = document.getElementById("modalObjetivos");
    if (objetivosList) {
      objetivosList.innerHTML = "";
      projeto.objetivos.forEach((objetivo) => {
        const li = document.createElement("li");
        li.textContent = objetivo;
        objetivosList.appendChild(li);
      });
    }

    // Equipe
    const equipeList = document.getElementById("modalEquipe");
    if (equipeList) {
      equipeList.innerHTML = "";
      projeto.equipe.forEach((membro) => {
        const div = document.createElement("div");
        div.className = "membro-equipe";
        div.innerHTML = `
          <span class="membro-nome">${membro.nome}</span>
          <span class="membro-funcao">${membro.funcao}</span>
        `;
        equipeList.appendChild(div);
      });
    }

    // Mostrar modal
    modal.classList.add("ativo");
    document.body.style.overflow = "hidden";
  }

  function fecharModal() {
    modal.classList.remove("ativo");
    document.body.style.overflow = "auto";
  }
}

/* =========================================================
   10) INICIALIZAÇÃO GERAL (UM ÚNICO DOMContentLoaded)
========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  initMenuResponsivo();
  initNewsletter();
  initHoverCardsNoticias();
  initAnoRodape();

  initSlideshowDestaque();
  initAnimacoesSobre();

  garantirVisibilidadeMobile();
  initBuscaPublicacoes();
  initModalProjetos();
  initOndasHeroMouse();
});

// Reforçar visibilidade ao redimensionar (mantido)
window.addEventListener("resize", garantirVisibilidadeMobile);

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-vidar-anim");
  const header = document.querySelector("header");

  if (!hero || !header) return;

  // Começa com header oculto
  document.body.classList.add("header-oculto");
  document.body.classList.remove("header-visivel");

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (entry.isIntersecting) {
        // Ainda está no hero  header some
        document.body.classList.add("header-oculto");
        document.body.classList.remove("header-visivel");
      } else {
        // Saiu do hero  header aparece
        document.body.classList.remove("header-oculto");
        document.body.classList.add("header-visivel");
      }
    },
    {
      threshold: 0,
    }
  );

  observer.observe(hero);
});

// =========================================================
// HEADER SOME ENQUANTO O HERO ESTIVER VISVEL (HOME)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-vidar-anim");
  const header = document.querySelector("header");
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  // Só aplica na página que tem o hero
  if (!hero || !header) return;

  // Marca o body para ativar os estilos específicos (header fix + compensação)
  document.body.classList.add("tem-hero");

  // Helper: fechar menu se estiver aberto
  function fecharMenuMobile() {
    if (menu && menu.classList.contains("show")) {
      menu.classList.remove("show");

      // reset do ícone hambúrguer (mantém sua lógica atual)
      if (menuToggle) {
        const spans = menuToggle.querySelectorAll("span");
        if (spans.length >= 3) {
          spans[0].style.transform = "none";
          spans[1].style.opacity = "1";
          spans[1].style.transform = "none";
          spans[2].style.transform = "none";
        }
      }
    }
  }

  // Observer: se o hero estiver na tela => header some
  const obs = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (entry.isIntersecting) {
        header.classList.add("header--hidden");
        fecharMenuMobile(); // evita menu bugado enquanto header some
      } else {
        header.classList.remove("header--hidden");
      }
    },
    {
      // Quando ~60% do hero estiver visível, mantém header escondido
      threshold: 0.6,
    }
  );

  obs.observe(hero);
});
