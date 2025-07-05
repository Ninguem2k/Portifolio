/**
 * Sistema de Gerenciamento de Projetos
 * Versão refatorada - Código limpo e organizado
 */

// ========================================
// CONFIGURAÇÕES E DADOS
// ========================================

// Dados dos projetos
const PROJECTS_DATA = [
    {
        id: 1,
        title: "Sistema de Ordem de Serviço (OS) - 7System",
        description: "Este é um dos projetos que mais me encantou e me fez evoluir no campo da programação. Trata-se de uma Ordem de Serviço eletrônica, desenvolvida a partir da percepção de que a empresa em que trabalho não oferecia esse tipo de serviço, resultando na perda de inúmeros clientes em potencial.",
        image: "./assets/img/projects/OS.png",
        technologies: ["HTML", "CSS", "JavaScript", "AJAX", "PHP", "Bootstrap"],
        github: "https://github.com/Ninguem2k/7System_OS.git",
        featured: true
    },
    {
        id: 2,
        title: "1º E-commerce",
        description: "Este projeto representa uma oportunidade valiosa para aplicar e consolidar o conhecimento adquirido durante minha formação como Técnico em Informática. Embora tenha sido desenvolvido sem um critério específico ou um padrão de projeto definido, sua finalidade principal foi educacional, visando aprimorar minhas habilidades técnicas.",
        image: "./assets/img/projects/1Ecommerce.png",
        technologies: ["HTML", "CSS", "JavaScript", "PHP", "Bootstrap"],
        github: "https://github.com/Ninguem2k/1Primeiro-Ecommerce-2018"
    },
    {
        id: 3,
        title: "2º E-commerce",
        description: "Durante o desenvolvimento de um projeto para uma empresa de eletrônicos, infelizmente ocorreram contratempos que resultaram no cancelamento do projeto. No entanto, essa experiência me permitiu aprimorar significativamente o design, especialmente com o auxílio do Figma.",
        image: "./assets/img/projects/2Ecommerce.png",
        technologies: ["HTML", "CSS", "JavaScript", "PHP", "Laravel", "Bootstrap"],
        github: "https://github.com/Ninguem2k/MS-ecommerce-laravel.git"
    },
    {
        id: 4,
        title: "Sistema de Biblioteca - Java",
        description: "Este projeto foi desenvolvido como parte da disciplina de Linguagem de Programação II (LTP2) e contou com a colaboração de mim e mais dois colegas de grupo. É importante ressaltar que esta versão que temos em mãos é uma versão não finalizada, pois infelizmente não conseguimos encontrar a versão completa e atualizada.",
        image: "./assets/img/projects/Biblioteca.png",
        technologies: ["Java"],
        github: "https://github.com/Ninguem2k/Biblioteca-JAVA"
    },
    {
        id: 5,
        title: "Sistema de Confeção",
        description: "Este projeto tem um significado especial para mim, pois é o meu favorito até o momento. Estou trabalhando nele em um grupo composto por seis integrantes, desempenhando os papéis de gerente de projeto, Scrum Master e Desenvolvedor. Uma das coisas que mais me encanta nesse projeto é o fato de estarmos desenvolvendo para uma empresa real, o que nos proporciona uma experiência prática valiosa e nos prepara para o mercado de trabalho.",
        image: "./assets/img/projects/jetmak.jpeg",
        technologies: ["React", "PHP", "Laravel", "Scrum"],
        github: "https://github.com/Ninguem2k/code-makers-aps-ii",
        featured: true
    },
    {
        id: 6,
        title: "Portfólio",
        description: "Neste projeto, utilizei o portfólio do meu amigo Gabriel Marques como base. No entanto, em vez de simplesmente clonar o repositório, decidi recriá-lo, aplicando algumas alterações significativas. Uma das principais modificações foi a utilização do framework Bootstrap. Aproveitei os recursos e componentes do Bootstrap para melhorar a estrutura e o design do portfólio, criando um layout responsivo e adaptável para diferentes dispositivos.",
        image: "./assets/img/projects/Portfolio.png",
        technologies: ["HTML", "CSS", "JavaScript", "Bootstrap"],
        github: "https://github.com/Ninguem2k/Portifolio"
    }
];

// Configurações do sistema
const PROJECTS_CONFIG = {
    ITEMS_PER_PAGE: 3,
    MAX_DESCRIPTION_LENGTH: 200,
    ANIMATION_DELAY: 100
};

// Estado da aplicação
const STATE = {
    currentPage: 1,
    totalPages: Math.ceil(PROJECTS_DATA.length / PROJECTS_CONFIG.ITEMS_PER_PAGE),
    filteredProjects: PROJECTS_DATA
};

// ========================================
// UTILITÁRIOS
// ========================================

/**
 * Utilitário para logging
 */
const ProjectsLogger = {
    info: (message, data = null) => {
        console.log(`[PROJECTS] ${message}`, data || '');
    },
    error: (message, error = null) => {
        console.error(`[PROJECTS] ERRO: ${message}`, error || '');
    }
};

/**
 * Utilitário para manipulação de DOM
 */
const ProjectsDOMUtils = {
    /**
     * Busca elemento de forma segura
     */
    getElement: (selector) => {
        const element = document.querySelector(selector);
        if (!element) {
            ProjectsLogger.error(`Elemento não encontrado: ${selector}`);
        }
        return element;
    },

    /**
     * Cria elemento com classes
     */
    createElement: (tag, className = '') => {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        return element;
    }
};

/**
 * Utilitário para formatação de texto
 */
const TextUtils = {
    /**
     * Trunca texto com reticências
     */
    truncate: (text, maxLength = PROJECTS_CONFIG.MAX_DESCRIPTION_LENGTH) => {
        return text.length > maxLength 
            ? `${text.substring(0, maxLength)}...` 
            : text;
    },

    /**
     * Formata tecnologias como badges
     */
    formatTechnologies: (technologies) => {
        return technologies.map(tech => `
            <span class="tech-badge" style="background: linear-gradient(135deg, var(--blue), var(--steel)); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; margin-right: 0.5rem; margin-bottom: 0.5rem; display: inline-block;">
                ${tech}
            </span>
        `).join('');
    }
};

// ========================================
// COMPONENTES
// ========================================

/**
 * Componente de Card de Projeto
 */
class ProjectCard {
    constructor(project) {
        this.project = project;
    }

    /**
     * Cria o HTML do card
     */
    createHTML() {
        return `
            <div class="card card-project-main" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; overflow: hidden; transition: all 0.4s ease; margin-bottom: 2rem; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
                <img src="${this.project.image}" class="card-img-top" alt="${this.project.title}" style="height: 200px; object-fit: cover; width: 100%;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzQzYTQwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+PC9zdmc+'; this.onerror=null;">
                <div class="card-body" style="padding: 2rem;">
                    <h5 class="card-title" style="color: var(--blue); font-size: 1.3rem; margin-bottom: 1rem; font-weight: bold;">
                        ${this.project.title}
                        ${this.getFeaturedBadge()}
                    </h5>
                    <p class="card-text" style="color: var(--white); margin-bottom: 1.5rem; line-height: 1.6;">
                        ${TextUtils.truncate(this.project.description)}
                    </p>
                    <div class="tech-stack" style="margin-bottom: 1.5rem;">
                        ${TextUtils.formatTechnologies(this.project.technologies)}
                    </div>
                    ${this.getGitHubButton()}
                </div>
            </div>
        `;
    }

    /**
     * Retorna badge de destaque se aplicável
     */
    getFeaturedBadge() {
        return this.project.featured 
            ? '<span class="featured-badge" style="background: linear-gradient(135deg, #ffd700, #ffed4e); color: #000; padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.7rem; margin-left: 0.5rem; font-weight: bold;">⭐ Destaque</span>' 
            : '';
    }

    /**
     * Retorna botão do GitHub
     */
    getGitHubButton() {
        return `
            <a href="${this.project.github}" 
               target="_blank" 
               class="github-link"
               style="display: inline-block; background: linear-gradient(135deg, var(--blue), var(--steel)); color: white; padding: 0.8rem 1.5rem; border-radius: 25px; text-decoration: none; font-weight: bold; transition: all 0.3s ease;"
               onmouseover="this.style.transform='translateY(-2px)'"
               onmouseout="this.style.transform='translateY(0)'"
            >
                <i class="fab fa-github"></i> Ver no GitHub
            </a>
        `;
    }
}

/**
 * Componente de Paginação
 */
class ProjectsPagination {
    constructor(container) {
        this.container = container;
    }

    /**
     * Renderiza a paginação
     */
    render(currentPage, totalPages, totalItems) {
        this.container.innerHTML = `
            <nav  aria-label="Navegação de projetos" style="margin-top: 2rem; margin-bottom: 2rem; mb-12">
                <ul class="pagination justify-content-center">
                    ${this.createPageButtons(currentPage, totalPages)}
                </ul>
                <div class="text-center mb-3 ">
                    <small class="text-muted">
                        Página ${currentPage} de ${totalPages} (${totalItems} projetos no total)
                    </small>
                </div>
            </nav>
        `;
    }

    /**
     * Cria botões das páginas
     */
    createPageButtons(currentPage, totalPages) {
        let buttons = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === currentPage;
            const buttonStyle = isActive 
                ? 'background: linear-gradient(135deg, var(--blue), var(--steel)); border-color: var(--blue); color: white;'
                : 'background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: var(--white);';
            
            buttons += `
                <li class="page-item ${isActive ? 'active' : ''}">
                    <button class="page-link" 
                            onclick="ProjectsManager.goToPage(${i})" 
                            style="${buttonStyle}">
                        ${i}
                    </button>
                </li>
            `;
        }
        
        return buttons;
    }
}

// ========================================
// GERENCIADOR PRINCIPAL
// ========================================

/**
 * Gerenciador principal dos projetos
 */
class ProjectsManager {
    constructor() {
        this.projectsGrid = null;
        this.pagination = null;
        this.isInitialized = false;
    }

    /**
     * Inicializa o sistema
     */
    init() {
        if (this.isInitialized) {
            ProjectsLogger.info('Sistema já inicializado');
            return;
        }

        ProjectsLogger.info('Inicializando sistema de projetos...');

        // Buscar elementos do DOM
        this.projectsGrid = ProjectsDOMUtils.getElement('.projects-grid');
        const paginationContainer = ProjectsDOMUtils.getElement('.pagination-container');

        if (!this.projectsGrid || !paginationContainer) {
            ProjectsLogger.error('Elementos essenciais não encontrados');
            return;
        }

        // Inicializar componentes
        this.pagination = new ProjectsPagination(paginationContainer);
        
        // Renderizar página inicial
        this.goToPage(1);
        
        // Adicionar estilos
        this.addStyles();
        
        this.isInitialized = true;
        ProjectsLogger.info('Sistema inicializado com sucesso');
    }

    /**
     * Vai para uma página específica
     */
    goToPage(page) {
        if (page < 1 || page > STATE.totalPages) {
            ProjectsLogger.error(`Página inválida: ${page}`);
            return;
        }

        ProjectsLogger.info(`Navegando para página ${page}`);
        
        STATE.currentPage = page;
        this.renderCurrentPage();
    }

    /**
     * Renderiza a página atual
     */
    renderCurrentPage() {
        const startIndex = (STATE.currentPage - 1) * PROJECTS_CONFIG.ITEMS_PER_PAGE;
        const endIndex = startIndex + PROJECTS_CONFIG.ITEMS_PER_PAGE;
        const projectsToShow = STATE.filteredProjects.slice(startIndex, endIndex);

        ProjectsLogger.info(`Renderizando ${projectsToShow.length} projetos da página ${STATE.currentPage}`);

        // Limpar grid
        this.projectsGrid.innerHTML = '';

        // Renderizar projetos
        projectsToShow.forEach((project, index) => {
            const card = new ProjectCard(project);
            const cardElement = ProjectsDOMUtils.createElement('div');
            cardElement.innerHTML = card.createHTML();
            
            // Adicionar animação
            cardElement.style.animationDelay = `${index * PROJECTS_CONFIG.ANIMATION_DELAY}ms`;
            cardElement.classList.add('fade-in-up');
            
            const firstChild = cardElement.firstElementChild;
            
            if (firstChild) {
                this.projectsGrid.appendChild(firstChild);
            }
        });

        // Atualizar paginação
        this.pagination.render(STATE.currentPage, STATE.totalPages, STATE.filteredProjects.length);
    }

    /**
     * Adiciona estilos CSS dinamicamente
     */
    addStyles() {
        const styles = `
            .projects-grid {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)) !important;
                gap: 2rem !important;
                margin: 2rem 0 !important;
                min-height: 600px !important;
            }
            
            .card-project-main {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) !important;
                backdrop-filter: blur(15px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 20px !important;
                overflow: hidden !important;
                transition: all 0.4s ease !important;
                margin-bottom: 2rem !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
            }
            
            .card-project-main:hover {
                transform: translateY(-5px) !important;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2) !important;
            }
            
            .pagination .page-link {
                background: rgba(255, 255, 255, 0.1) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                color: var(--white) !important;
                margin: 0 0.2rem !important;
                border-radius: 10px !important;
                transition: all 0.3s ease !important;
                cursor: pointer !important;
            }
            
            .pagination .page-link:hover {
                background: linear-gradient(135deg, var(--blue), var(--steel)) !important;
                border-color: var(--blue) !important;
                transform: translateY(-2px) !important;
            }
            
            .pagination .page-item.active .page-link {
                background: linear-gradient(135deg, var(--blue), var(--steel)) !important;
                border-color: var(--blue) !important;
                color: white !important;
            }
            
            .fade-in-up {
                animation: fadeInUp 0.6s ease forwards;
                opacity: 0;
                transform: translateY(30px);
            }
            
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    /**
     * Métodos estáticos para compatibilidade
     */
    static goToPage(page) {
        if (window.projectsManager) {
            window.projectsManager.goToPage(page);
        }
    }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Instância global
window.projectsManager = new ProjectsManager();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    ProjectsLogger.info('DOM carregado - Iniciando sistema de projetos');
    window.projectsManager.init();
});

// Log inicial
ProjectsLogger.info(`Sistema de projetos carregado com ${PROJECTS_DATA.length} projetos`);
