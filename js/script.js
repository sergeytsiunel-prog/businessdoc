// Плавный скролл для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Анимация появления элементов при скролле
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-up');
    }
  });
}, observerOptions);

// Наблюдаем за всеми элементами с классом .fade-up
document.addEventListener('DOMContentLoaded', () => {
  const fadeElements = document.querySelectorAll('.fade-up');
  fadeElements.forEach(el => observer.observe(el));
});

// Обработка формы
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Имитация отправки
    setTimeout(() => {
      alert('Спасибо! Ваш запрос отправлен. Я свяжусь с вами в ближайшее время.');
      contactForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

// Фикс для мобильного меню
function handleMobileMenu() {
  const nav = document.querySelector('.nav');
  if (window.innerWidth < 768) {
    nav.style.flexWrap = 'wrap';
    nav.style.justifyContent = 'center';
  } else {
    nav.style.flexWrap = 'nowrap';
    nav.style.justifyContent = 'flex-end';
  }
}

window.addEventListener('resize', handleMobileMenu);
window.addEventListener('load', handleMobileMenu);