// ===== ОСНОВНОЙ КОД =====
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== ПЛАВНЫЙ СКРОЛЛ ДЛЯ ДЕСКТОПА =====
  if (window.innerWidth > 768) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
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
  
  // На мобильных НИЧЕГО не делаем - все делает CSS
  
});