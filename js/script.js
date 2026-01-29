// ===== ДИНАМИЧЕСКАЯ ВЫСОТА ШАПКИ =====
function updateHeaderHeight() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  // Получаем реальную высоту шапки
  const headerHeight = header.offsetHeight;
  const root = document.documentElement;
  
  // Обновляем CSS переменную
  root.style.setProperty('--header-height', `${headerHeight}px`);
  
  console.log('Header height updated:', headerHeight + 'px');
}

// ===== ПЛАВНЫЙ СКРОЛЛ =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const header = document.querySelector('.header');
  
  function checkScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Обновляем высоту при скролле (на случай анимаций)
    updateHeaderHeight();
  }
  
  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  // Вызываем при загрузке
  updateHeaderHeight();
  initSmoothScroll();
  initScrollAnimations();
  
  // При изменении размера окна
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateHeaderHeight, 250);
  });
  
  // Дебаг информация
  console.log('Business Doctor — G-Class Premium initialized');
});