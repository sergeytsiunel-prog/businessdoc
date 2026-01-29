// Минимальный JS: эффект для шапки + плавный скролл
document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.header');

  // Класс при прокрутке
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Плавный скролл с учётом высоты шапки
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href === '#top') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const isMobile = window.innerWidth <= 768;
      const headerHeight = isMobile ? 60 : 100;

      const targetTop = target.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: targetTop - headerHeight,
        behavior: 'smooth'
      });
    });
  });
});
