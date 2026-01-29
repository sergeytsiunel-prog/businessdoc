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
  
  // ===== ПРОСТОЙ ФИКС ШАПКИ =====
  // Только для десктопа, на мобильных все делает CSS
  function fixHeaderDesktop() {
    if (window.innerWidth > 768) {
      const header = document.querySelector('.header');
      if (header) {
        header.style.position = 'fixed';
        header.style.top = '0';
      }
    }
  }
  
  // Запускаем при загрузке
  fixHeaderDesktop();
  window.addEventListener('resize', fixHeaderDesktop);
  
});