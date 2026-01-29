// ===== МИНИМАЛЬНЫЙ JS =====
document.addEventListener('DOMContentLoaded', function() {
  
  // Только анимация при скролле
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Простой плавный скролл
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        // Фиксированная высота шапки на мобильных
        const isMobile = window.innerWidth <= 768;
        const headerHeight = isMobile ? 60 : 100;
        
        window.scrollTo({
          top: target.offsetTop - headerHeight,
          behavior: 'smooth'
        });
      }
    });
  });
  
});