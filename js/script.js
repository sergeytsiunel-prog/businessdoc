// ===== ОСНОВНОЙ КОД =====
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== ПЛАВНЫЙ СКРОЛЛ ДЛЯ ДЕСКТОПА =====
  if (window.innerWidth > 768) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#top') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // ===== ПРОСТОЙ ФИКС ШАПКИ НА МОБИЛЬНЫХ =====
  function fixMobileHeader() {
    if (window.innerWidth <= 768) {
      const header = document.querySelector('.header');
      if (header) {
        // ТОЛЬКО убеждаемся, что шапка фиксированная
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.left = '0';
        header.style.right = '0';
        header.style.zIndex = '1000';
        
        // НЕ ТРОГАЕМ body padding/margin - это делается в CSS!
      }
    }
  }
  
  // Запускаем один раз при загрузке
  fixMobileHeader();
  
  // Пересчитываем при изменении размера окна
  window.addEventListener('resize', fixMobileHeader);
  
});