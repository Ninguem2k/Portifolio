/**
 * Sistema Principal do Portfólio
 * Versão refatorada - Código limpo e organizado
 */

// ========================================
// CONFIGURAÇÕES
// ========================================

const CONFIG = {
    ANIMATION_DURATION: 600,
    SCROLL_OFFSET: 100,
    LAZY_LOAD_THRESHOLD: 0.1
};

// ========================================
// UTILITÁRIOS
// ========================================

/**
 * Utilitário para logging
 */
const Logger = {
    info: (message, data = null) => {
        console.log(`[INDEX] ${message}`, data || '');
    },
    error: (message, error = null) => {
        console.error(`[INDEX] ERRO: ${message}`, error || '');
    }
};

/**
 * Utilitário para manipulação de DOM
 */
const DOMUtils = {
    /**
     * Busca elemento de forma segura
     */
    getElement: (selector) => {
        const element = document.querySelector(selector);
        if (!element) {
            Logger.error(`Elemento não encontrado: ${selector}`);
        }
        return element;
    },

    /**
     * Busca múltiplos elementos
     */
    getElements: (selector) => {
        return document.querySelectorAll(selector);
    },

    /**
     * Verifica se elemento está visível
     */
    isElementVisible: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Adiciona classe com delay
     */
    addClassWithDelay: (element, className, delay = 0) => {
        setTimeout(() => {
            element.classList.add(className);
        }, delay);
    }
};

/**
 * Utilitário para animações
 */
const AnimationUtils = {
    /**
     * Anima elementos ao fazer scroll
     */
    animateOnScroll: () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.LAZY_LOAD_THRESHOLD,
            rootMargin: `${CONFIG.SCROLL_OFFSET}px`
        });

        // Observar elementos com animação
        DOMUtils.getElements('.fade-in-up, .stagger-animation, .animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    },

    /**
     * Anima elementos com delay escalonado
     */
    staggerAnimation: (elements, className = 'animate-in', delay = 100) => {
        elements.forEach((element, index) => {
            DOMUtils.addClassWithDelay(element, className, index * delay);
        });
    }
};

/**
 * Utilitário para navegação
 */
const NavigationUtils = {
    /**
     * Navegação suave para âncoras
     */
    smoothScroll: () => {
        DOMUtils.getElements('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    /**
     * Atualiza navegação ativa baseada no scroll
     */
    updateActiveNavigation: () => {
        const sections = DOMUtils.getElements('section[id]');
        const navLinks = DOMUtils.getElements('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
};

// ========================================
// COMPONENTES
// ========================================

/**
 * Componente de Loading
 */
class LoadingManager {
    constructor() {
        this.isLoading = true;
    }

    /**
     * Mostra loading
     */
    show() {
        this.isLoading = true;
        document.body.classList.add('loading');
    }

    /**
     * Esconde loading
     */
    hide() {
        this.isLoading = false;
        document.body.classList.remove('loading');
        this.animatePageLoad();
    }

    /**
     * Anima carregamento da página
     */
    animatePageLoad() {
        const elements = DOMUtils.getElements('.fade-in-up');
        AnimationUtils.staggerAnimation(elements, 'animate-in', 150);
    }
}

/**
 * Componente de Performance
 */
class PerformanceManager {
    constructor() {
        this.observers = [];
    }

    /**
     * Inicializa otimizações de performance
     */
    init() {
        this.setupLazyLoading();
        this.setupIntersectionObserver();
        this.optimizeImages();
    }

    /**
     * Configura lazy loading
     */
    setupLazyLoading() {
        const images = DOMUtils.getElements('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Configura observador de interseção
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        DOMUtils.getElements('.observe-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Otimiza imagens
     */
    optimizeImages() {
        DOMUtils.getElements('img').forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            } else {
                img.classList.add('loaded');
            }
        });
    }
}

// ========================================
// GERENCIADOR PRINCIPAL
// ========================================

/**
 * Gerenciador principal da aplicação
 */
class AppManager {
    constructor() {
        this.loading = new LoadingManager();
        this.performance = new PerformanceManager();
        this.isInitialized = false;
    }

    /**
     * Inicializa a aplicação
     */
    init() {
        if (this.isInitialized) {
            Logger.info('Aplicação já inicializada');
            return;
        }

        Logger.info('Inicializando aplicação...');

        try {
            // Mostrar loading
            this.loading.show();

            // Inicializar componentes
            this.initializeComponents();

            // Configurar eventos
            this.setupEventListeners();

            // Otimizações de performance
            this.performance.init();

            // Esconder loading após um delay
            setTimeout(() => {
                this.loading.hide();
            }, 1000);

            this.isInitialized = true;
            Logger.info('Aplicação inicializada com sucesso');

        } catch (error) {
            Logger.error('Erro ao inicializar aplicação', error);
            this.loading.hide();
        }
    }

    /**
     * Inicializa componentes
     */
    initializeComponents() {
        // Inicializar animações
        AnimationUtils.animateOnScroll();

        // Configurar navegação
        NavigationUtils.smoothScroll();
        NavigationUtils.updateActiveNavigation();

        // Adicionar estilos dinâmicos
        this.addDynamicStyles();
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Evento de scroll
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Evento de resize
        window.addEventListener('resize', this.handleResize.bind(this));

        // Evento de carregamento
        window.addEventListener('load', this.handleLoad.bind(this));

        // Eventos de teclado
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    /**
     * Manipula evento de scroll
     */
    handleScroll() {
        // Throttle para performance
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(() => {
            this.updateScrollEffects();
        }, 16);
    }

    /**
     * Manipula evento de resize
     */
    handleResize() {
        // Debounce para performance
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = setTimeout(() => {
            this.updateLayout();
        }, 250);
    }

    /**
     * Manipula evento de carregamento
     */
    handleLoad() {
        Logger.info('Página carregada completamente');
        this.updateLayout();
    }

    /**
     * Manipula eventos de teclado
     */
    handleKeydown(event) {
        // Navegação por teclado
        if (event.key === 'Escape') {
            this.closeModals();
        }
    }

    /**
     * Atualiza efeitos de scroll
     */
    updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = DOMUtils.getElements('.parallax');

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    /**
     * Atualiza layout
     */
    updateLayout() {
        // Recalcular posições se necessário
        this.updateScrollEffects();
    }

    /**
     * Fecha modais
     */
    closeModals() {
        DOMUtils.getElements('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    /**
     * Adiciona estilos dinâmicos
     */
    addDynamicStyles() {
        const styles = `
            .loading {
                overflow: hidden;
            }
            
            .fade-in-up {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .fade-in-up.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .stagger-animation {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.4s ease;
            }
            
            .stagger-animation.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .observe-on-scroll {
                opacity: 0;
                transform: scale(0.9);
                transition: all 0.5s ease;
            }
            
            .observe-on-scroll.visible {
                opacity: 1;
                transform: scale(1);
            }
            
            .parallax {
                will-change: transform;
            }
            
            .nav-link.active {
                color: var(--blue) !important;
                font-weight: bold;
            }
            
            img.lazy {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            img.loaded {
                opacity: 1;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Instância global
window.appManager = new AppManager();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    Logger.info('DOM carregado - Iniciando aplicação');
    window.appManager.init();
});

// Log inicial
Logger.info('Sistema principal carregado');
