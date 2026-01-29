// ===== ПРОСТОЙ И НАДЕЖНЫЙ ФИКС ШАПКИ =====
document.addEventListener('DOMContentLoaded', function() {
  
  // Функция для обновления отступов
  function fixHeaderSpacing() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    // Ждем пока все стили загрузятся
    setTimeout(() => {
      const headerHeight = header.offsetHeight;
      
      console.log('Calculated header height:', headerHeight + 'px');
      
      // Обновляем все необходимые отступы
      document.body.style.paddingTop = headerHeight + 'px';
      document.documentElement.style.scrollPaddingTop = headerHeight + 'px';
      
      // Обновляем стиль
      const fixStyle = document.getElementById('header-fix');
      if (fixStyle) {
        fixStyle.textContent = `
          .header { height: ${headerHeight}px !important; }
          body { padding-top: ${headerHeight}px !important; }
          html { scroll-padding-top: ${headerHeight}px !important; }
        `;
      }
    }, 100);
  }
  
  // Запускаем несколько раз для надежности
  fixHeaderSpacing();
  
  // Еще раз после полной загрузки страницы
  window.addEventListener('load', function() {
    setTimeout(fixHeaderSpacing, 300);
  });
  
  // При изменении размера окна
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fixHeaderSpacing, 250);
  });
  
  // Плавный скролл
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Анимация шапки при скролле
  function checkScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      // Обновляем высоту после сжатия
      setTimeout(fixHeaderSpacing, 100);
    } else {
      header.classList.remove('scrolled');
      setTimeout(fixHeaderSpacing, 100);
    }
  }
  
  window.addEventListener('scroll', checkScroll);
  
});