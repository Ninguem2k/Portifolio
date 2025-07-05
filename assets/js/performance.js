// Otimizações de Performance para o Portfólio

// Lazy Loading para imagens
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
  } else {
    // Fallback para navegadores que não suportam IntersectionObserver
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}

// Preload de recursos críticos
function preloadCriticalResources() {
  const criticalResources = [
    './assets/style/style.css',
    './assets/js/skill.js',
    './assets/js/projects.js'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'script';
    document.head.appendChild(link);
  });
}

// Debounce para otimizar eventos de scroll
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Otimização de scroll
const optimizedScroll = debounce(() => {
  // Animações baseadas em scroll
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;
  
  reveals.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('active');
    }
  });
}, 10);

// Cache de elementos DOM frequentemente acessados
const domCache = {
  toolskill: null,
  skillContainer: null,
  projectsContainer: null,
  
  init() {
    this.toolskill = document.getElementById('toolskill');
    this.skillContainer = document.querySelector('.skill-container');
    this.projectsContainer = document.querySelector('.card-group');
  },
  
  get(selector) {
    if (!this[selector]) {
      this[selector] = document.querySelector(selector);
    }
    return this[selector];
  }
};

// Otimização de animações
function optimizeAnimations() {
  // Usa requestAnimationFrame para animações suaves
  const animate = (callback) => {
    requestAnimationFrame(callback);
  };

  // Aplica transform3d para forçar aceleração de hardware
  const elements = document.querySelectorAll('.card, .skill-container, .card-project-main');
  elements.forEach(element => {
    element.style.transform = 'translateZ(0)';
  });
}

// Monitoramento de performance
function monitorPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Tempo de carregamento:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        console.log('Tempo total:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
      }, 0);
    });
  }
}

// Otimização de fontes
function optimizeFonts() {
  // Preload de fontes críticas
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Special+Elite&display=swap';
  fontLink.as = 'style';
  document.head.appendChild(fontLink);
}

// Compressão de dados
function compressData() {
  // Remove espaços em branco desnecessários
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (script.textContent) {
      script.textContent = script.textContent.replace(/\s+/g, ' ').trim();
    }
  });
}

// Otimização de imagens
function optimizeImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Adiciona loading lazy para imagens não críticas
    if (!img.classList.contains('critical')) {
      img.loading = 'lazy';
    }
    
    // Adiciona atributos de acessibilidade
    if (!img.alt) {
      img.alt = 'Imagem';
    }
  });
}

// Cache de dados
const dataCache = new Map();

function cacheData(key, data, ttl = 300000) { // 5 minutos por padrão
  dataCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
}

function getCachedData(key) {
  const cached = dataCache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  dataCache.delete(key);
  return null;
}

// Otimização de eventos
function optimizeEvents() {
  // Usa event delegation para melhor performance
  document.addEventListener('click', (e) => {
    // Cards expansíveis
    if (e.target.closest('.card-header')) {
      const cardBody = e.target.closest('.card').querySelector('.body');
      if (cardBody) {
        cardBody.classList.toggle('collapse');
      }
    }
    
    // Links de paginação
    if (e.target.closest('.page-link')) {
      e.preventDefault();
      const page = parseInt(e.target.textContent);
      if (window.setPage_atual) {
        window.setPage_atual(page);
      }
    }
  });
}

// Inicialização das otimizações
function initPerformanceOptimizations() {
  // Inicializa cache DOM
  domCache.init();
  
  // Preload de recursos críticos
  preloadCriticalResources();
  
  // Otimizações de animação
  optimizeAnimations();
  
  // Otimização de fontes
  optimizeFonts();
  
  // Otimização de imagens
  optimizeImages();
  
  // Otimização de eventos
  optimizeEvents();
  
  // Monitoramento de performance
  monitorPerformance();
  
  // Adiciona listener de scroll otimizado
  window.addEventListener('scroll', optimizedScroll);
  
  // Lazy loading de imagens
  lazyLoadImages();
}

// Executa otimizações quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
} else {
  initPerformanceOptimizations();
}

// Exporta funções para uso global
window.performanceUtils = {
  cacheData,
  getCachedData,
  debounce,
  optimizeAnimations
}; 