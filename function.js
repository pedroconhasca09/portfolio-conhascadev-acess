document.addEventListener('DOMContentLoaded', () => {
    // --- Inicialização de Acessibilidade ---
    injectVLibras();
    injectAccessibilityToolbar();

    // Funcionalidade do botão "Voltar ao Topo"
    const backToTopButton = document.getElementById("back-to-top");

    if (backToTopButton) {
        window.onscroll = function() {
            // Mostra o botão se rolar mais de 200px
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                backToTopButton.style.display = "flex";
            } else {
                backToTopButton.style.display = "none";
            }
        };

        backToTopButton.addEventListener("click", function() {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }

    // Funcionalidade de destaque (hover) na seção "Sobre Mim" e outras caixas de texto
    const bioTexts = document.querySelectorAll('.bio-text');

    bioTexts.forEach(section => {
        // Define a transição suave para garantir a fluidez da animação
        section.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";

        section.addEventListener('mouseenter', () => {
            section.style.transform = "scale(1.05)"; // Aumenta levemente
            section.style.boxShadow = "0 0 25px rgba(0, 243, 255, 0.4)"; // Sombra Neon Ciano intensa
            section.style.zIndex = "10"; // Traz para frente
            section.style.position = "relative"; // Garante que o z-index funcione
        });

        section.addEventListener('mouseleave', () => {
            // Remove os estilos inline para voltar ao padrão definido no CSS
            section.style.transform = "";
            section.style.boxShadow = "";
            section.style.zIndex = "";
            section.style.position = "";
        });
    });
});

// --- Funções de Acessibilidade ---

// Injeta o Widget VLibras automaticamente
function injectVLibras() {
    if (document.querySelector('[vw]')) return; // Evita duplicação

    const vwDiv = document.createElement('div');
    vwDiv.setAttribute('vw', '');
    vwDiv.className = 'enabled';
    vwDiv.innerHTML = `
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
        </div>
    `;
    document.body.appendChild(vwDiv);

    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.onload = function() {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    };
    document.body.appendChild(script);
}

// Cria a Barra de Ferramentas de Acessibilidade
function injectAccessibilityToolbar() {
    // Cria o container da toolbar
    const toolbar = document.createElement('div');
    toolbar.id = 'accessibility-toolbar';
    toolbar.setAttribute('role', 'region');
    toolbar.setAttribute('aria-label', 'Ferramentas de Acessibilidade');
    
    // Botão de alternância (Toggle)
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'access-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-universal-access"></i>';
    toggleBtn.title = 'Menu de Acessibilidade';
    toggleBtn.setAttribute('aria-label', 'Abrir menu de acessibilidade');
    toggleBtn.setAttribute('aria-expanded', 'false');
    
    // Menu de opções
    const menu = document.createElement('div');
    menu.id = 'access-menu';
    menu.setAttribute('aria-hidden', 'true');
    
    // Opções do menu
    const options = [
        { id: 'contrast', icon: 'fas fa-adjust', text: 'Alto Contraste', action: () => document.body.classList.toggle('high-contrast') },
        { id: 'font-size', icon: 'fas fa-text-height', text: 'Aumentar Texto', action: () => document.body.classList.toggle('large-font') },
        { id: 'dyslexia', icon: 'fas fa-font', text: 'Fonte Legível', action: () => document.body.classList.toggle('dyslexic-font') },
        { id: 'cursor', icon: 'fas fa-mouse-pointer', text: 'Guia de Leitura', action: toggleReadingGuide }
    ];

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerHTML = `<i class="${opt.icon}"></i> ${opt.text}`;
        btn.onclick = opt.action;
        menu.appendChild(btn);
    });

    toolbar.appendChild(toggleBtn);
    toolbar.appendChild(menu);
    document.body.appendChild(toolbar);

    // Lógica de abrir/fechar menu
    toggleBtn.addEventListener('click', () => {
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !expanded);
        menu.setAttribute('aria-hidden', expanded);
        menu.classList.toggle('visible');
    });
}

// Função para a Guia de Leitura (Linha horizontal)
function toggleReadingGuide() {
    let guide = document.getElementById('reading-guide');
    if (!guide) {
        guide = document.createElement('div');
        guide.id = 'reading-guide';
        document.body.appendChild(guide);
        document.addEventListener('mousemove', (e) => {
            if (guide.classList.contains('active')) {
                guide.style.top = e.clientY + 'px';
            }
        });
    }
    guide.classList.toggle('active');
}