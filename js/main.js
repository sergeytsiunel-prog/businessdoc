// ========================================
// MAIN.JS - Основной функционал сайта
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Мобильное меню
  initMobileMenu();
  
  // Плавная прокрутка
  initSmoothScroll();
  
  // Анимация появления элементов
  initScrollAnimations();
});

// --- Мобильное меню ---
function initMobileMenu() {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const body = document.body;

  if (!menuToggle || !menu) return;

  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpening = !menu.classList.contains('active');

    menu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    body.style.overflow = isOpening ? 'hidden' : '';
    this.setAttribute('aria-expanded', isOpening);
  });

  // Закрытие при клике на ссылку
  const navLinksInMenu = menu.querySelectorAll('a');
  navLinksInMenu.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Закрытие по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Закрытие при клике вне меню
  document.addEventListener('click', function(e) {
    if (menu.classList.contains('active') && 
        !menu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  function closeMenu() {
    menu.classList.remove('active');
    menuToggle.classList.remove('active');
    body.style.overflow = '';
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

// --- Плавная прокрутка ---
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('[data-nav-link], .nav-cta-desktop');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (!href || !href.startsWith('#')) return;
      
      e.preventDefault();
      const targetElement = document.querySelector(href);
      
      if (!targetElement) return;

      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Обновляем URL без перезагрузки
      history.pushState(null, null, href);
    });
  });
}

// --- Анимация появления при скролле ---
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-up');
  
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });
}

// --- Утилиты ---

// Дебаунс для производительности
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

// Проверка видимости элемента
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
