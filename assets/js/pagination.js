console.log('Arquivo pagination.js carregado');

class PaginationComponent {
    constructor(container, items, itemsPerPage = 3) {
        this.container = container;
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(items.length / itemsPerPage);
        this.renderCallback = null;
        
        this.init();
    }
    
    init() {
        this.createPaginationContainer();
        this.render();
    }
    
    createPaginationContainer() {
        // Usar o container existente ou criar um novo
        if (this.container.classList.contains('pagination-container')) {
            this.paginationContainer = this.container;
        } else {
            this.paginationContainer = document.createElement('div');
            this.paginationContainer.className = 'pagination-container';
            this.container.appendChild(this.paginationContainer);
        }
    }
    
    setRenderCallback(callback) {
        this.renderCallback = callback;
    }
    
    getCurrentPageItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.items.slice(startIndex, endIndex);
    }
    
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.render();
            this.updatePaginationUI();
            
            // Chamar callback de renderização
            if (this.renderCallback) {
                this.renderCallback(this.getCurrentPageItems());
            }
        }
    }
    
    nextPage() {
        this.goToPage(this.currentPage + 1);
    }
    
    prevPage() {
        this.goToPage(this.currentPage - 1);
    }
    
    updatePaginationUI() {
        const pagination = this.paginationContainer.querySelector('.pagination');
        if (!pagination) return;
        
        // Atualizar botões de navegação
        const prevBtn = pagination.querySelector('.page-item:first-child .page-link');
        const nextBtn = pagination.querySelector('.page-item:last-child .page-link');
        
        if (prevBtn) {
            prevBtn.classList.toggle('disabled', this.currentPage === 1);
        }
        if (nextBtn) {
            nextBtn.classList.toggle('disabled', this.currentPage === this.totalPages);
        }
        
        // Atualizar página ativa
        const pageLinks = pagination.querySelectorAll('.page-link:not(.prev-link):not(.next-link)');
        pageLinks.forEach((link, index) => {
            link.classList.toggle('active', index + 1 === this.currentPage);
        });
    }
    
    render() {
        if (this.totalPages <= 1) {
            this.paginationContainer.style.display = 'none';
            return;
        }
        
        this.paginationContainer.style.display = 'block';
        this.paginationContainer.innerHTML = this.createPaginationHTML();
        this.bindEvents();
    }
    
    createPaginationHTML() {
        let html = '<nav aria-label="Navegação de páginas"><ul class="pagination justify-content-center">';
        
        // Botão Anterior
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <button class="page-link prev-link" data-page="${this.currentPage - 1}" ${this.currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Anterior
                </button>
            </li>
        `;
        
        // Páginas numeradas
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // Primeira página se não estiver visível
        if (startPage > 1) {
            html += '<li class="page-item"><button class="page-link" data-page="1">1</button></li>';
            if (startPage > 2) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }
        
        // Páginas visíveis
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <button class="page-link" data-page="${i}">${i}</button>
                </li>
            `;
        }
        
        // Última página se não estiver visível
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            html += `<li class="page-item"><button class="page-link" data-page="${this.totalPages}">${this.totalPages}</button></li>`;
        }
        
        // Botão Próximo
        html += `
            <li class="page-item ${this.currentPage === this.totalPages ? 'disabled' : ''}">
                <button class="page-link next-link" data-page="${this.currentPage + 1}" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
                    Próximo <i class="fas fa-chevron-right"></i>
                </button>
            </li>
        `;
        
        html += '</ul></nav>';
        
        // Adicionar informações da página
        html += `
            <div class="pagination-info text-center mt-3">
                <small class="text-muted">
                    Página ${this.currentPage} de ${this.totalPages} 
                    (${this.items.length} itens no total)
                </small>
            </div>
        `;
        
        return html;
    }
    
    bindEvents() {
        const pageLinks = this.paginationContainer.querySelectorAll('.page-link[data-page]');
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.dataset.page);
                this.goToPage(page);
            });
        });
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.pagination-container')) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.prevPage();
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.nextPage();
                }
            }
        });
    }
    
    // Métodos para atualizar dados
    updateItems(newItems) {
        this.items = newItems;
        this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
        this.currentPage = 1;
        this.render();
    }
    
    setItemsPerPage(itemsPerPage) {
        this.itemsPerPage = itemsPerPage;
        this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
        this.currentPage = 1;
        this.render();
    }
    
    // Métodos para estatísticas
    getStats() {
        return {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            totalItems: this.items.length,
            itemsPerPage: this.itemsPerPage,
            startIndex: (this.currentPage - 1) * this.itemsPerPage + 1,
            endIndex: Math.min(this.currentPage * this.itemsPerPage, this.items.length)
        };
    }
}

// Componente de filtro
class FilterComponent {
    constructor(container, filters, onFilterChange) {
        this.container = container;
        this.filters = filters;
        this.onFilterChange = onFilterChange;
        this.activeFilters = new Set();
        
        this.init();
    }
    
    init() {
        this.createFilterContainer();
        this.bindEvents();
    }
    
    createFilterContainer() {
        this.container.innerHTML = `
            <div class="filter-section mb-4">
                <h5 class="filter-title mb-3">
                    <i class="fas fa-filter"></i> Filtrar por Tecnologia
                </h5>
                <div class="filter-buttons">
                    ${this.filters.map(filter => `
                        <button class="filter-btn" data-filter="${filter.value}">
                            <i class="${filter.icon}"></i> ${filter.label}
                        </button>
                    `).join('')}
                </div>
                <div class="filter-actions mt-3">
                    <button class="btn btn-outline-secondary btn-sm" id="clear-filters">
                        <i class="fas fa-times"></i> Limpar Filtros
                    </button>
                    <span class="filter-count ms-3">
                        <small class="text-muted">
                            <span id="active-filters-count">0</span> filtro(s) ativo(s)
                        </small>
                    </span>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        const filterButtons = this.container.querySelectorAll('.filter-btn');
        const clearButton = this.container.querySelector('#clear-filters');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.toggleFilter(filter);
            });
        });
        
        clearButton.addEventListener('click', () => {
            this.clearFilters();
        });
    }
    
    toggleFilter(filter) {
        const button = this.container.querySelector(`[data-filter="${filter}"]`);
        
        if (this.activeFilters.has(filter)) {
            this.activeFilters.delete(filter);
            button.classList.remove('active');
        } else {
            this.activeFilters.add(filter);
            button.classList.add('active');
        }
        
        this.updateFilterCount();
        this.onFilterChange(Array.from(this.activeFilters));
    }
    
    clearFilters() {
        this.activeFilters.clear();
        this.container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.updateFilterCount();
        this.onFilterChange([]);
    }
    
    updateFilterCount() {
        const countElement = this.container.querySelector('#active-filters-count');
        if (countElement) {
            countElement.textContent = this.activeFilters.size;
        }
    }
    
    getActiveFilters() {
        return Array.from(this.activeFilters);
    }
}

// Componente de busca
class SearchComponent {
    constructor(container, onSearch) {
        this.container = container;
        this.onSearch = onSearch;
        this.searchTerm = '';
        
        this.init();
    }
    
    init() {
        this.createSearchContainer();
        this.bindEvents();
    }
    
    createSearchContainer() {
        this.container.innerHTML = `
            <div class="search-section mb-4">
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="fas fa-search"></i>
                    </span>
                    <input type="text" 
                           class="form-control" 
                           id="search-input" 
                           placeholder="Buscar projetos por nome, descrição ou tecnologia..."
                           aria-label="Buscar projetos">
                    <button class="btn btn-outline-secondary" type="button" id="clear-search">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="search-info mt-2">
                    <small class="text-muted">
                        <span id="search-results-count">0</span> resultado(s) encontrado(s)
                    </small>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        const searchInput = this.container.querySelector('#search-input');
        const clearButton = this.container.querySelector('#clear-search');
        
        // Busca em tempo real
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchTerm = e.target.value.trim();
                this.onSearch(this.searchTerm);
            }, 300);
        });
        
        // Busca ao pressionar Enter
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.searchTerm = e.target.value.trim();
                this.onSearch(this.searchTerm);
            }
        });
        
        // Limpar busca
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            this.searchTerm = '';
            this.onSearch('');
        });
    }
    
    updateResultsCount(count) {
        const countElement = this.container.querySelector('#search-results-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }
    
    getSearchTerm() {
        return this.searchTerm;
    }
}

// Exportar componentes para uso global
window.PaginationComponent = PaginationComponent;
window.FilterComponent = FilterComponent;
window.SearchComponent = SearchComponent; 