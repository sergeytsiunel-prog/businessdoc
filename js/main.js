// ========================================
// MAIN.JS - v3.0 (clean)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initFAQ();
});

// Мобильное меню
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
  const navLinksInMenu = menu.querySelectorAll('a');
  navLinksInMenu.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      menuToggle.classList.remove('active');
      body.style.overflow = '';
    });
  });
  document.addEventListener('click', function(e) {
    if (menu.classList.contains('active') && !menu.contains(e.target) && !menuToggle.contains(e.target)) {
      menu.classList.remove('active');
      menuToggle.classList.remove('active');
      body.style.overflow = '';
    }
  });
}

// Плавная прокрутка
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (!targetElement) return;
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });
}

// Анимация появления при скролле
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
  }, { threshold: 0.1 });
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });
}

// FAQ аккордеон
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

// ========================================
// ОТПРАВКА ФОРМЫ + ЯНДЕКС.МЕТРИКА
// ========================================

const callbackForm = document.getElementById('callbackForm');
if (callbackForm) {
  callbackForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formStatus = document.getElementById('formStatus');
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    const formData = new FormData(callbackForm);
    formData.append('date', new Date().toLocaleString('ru-RU'));
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    if (formStatus) {
      formStatus.style.display = 'block';
      formStatus.textContent = 'Отправляем...';
      formStatus.style.color = '#64748b';
    }
    try {
      const response = await fetch('https://formspree.io/f/mnjoyzyy', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      if (response.ok) {
        if (typeof ym !== 'undefined') {
          ym(108463875, 'reachGoal', 'ZayavkaForma');
          ym(108463875, 'reachGoal', 'form_submit');
        }
        if (formStatus) {
          formStatus.textContent = '✅ Заявка отправлена! Свяжусь в течение 2 часов в рабочее время.';
          formStatus.style.color = '#10b981';
        }
        callbackForm.reset();
      } else {
        throw new Error('HTTP ' + response.status);
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = '❌ Ошибка отправки. Напишите на sergey.tsiunel@gmail.com';
        formStatus.style.color = '#ef4444';
      }
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      if (formStatus) {
        setTimeout(() => { formStatus.style.display = 'none'; }, 6000);
      }
    }
  });
}

// Лид-магнит
function sendLeadMagnet() {
  const emailEl = document.getElementById('leadEmail');
  const statusEl = document.getElementById('leadStatus');
  if (!emailEl || !statusEl) return;
  const email = emailEl.value.trim();
  if (!email || !email.includes('@')) {
    statusEl.style.display = 'block';
    statusEl.textContent = 'Введите корректный email';
    statusEl.style.color = '#ef4444';
    return;
  }
  statusEl.style.display = 'block';
  statusEl.textContent = 'Отправляем...';
  statusEl.style.color = '#64748b';
  fetch('https://formspree.io/f/mnjoyzyy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email, type: 'lead_magnet', date: new Date().toLocaleString('ru-RU') })
  }).then(r => {
    if (r.ok) {
      statusEl.textContent = '✅ Отправлено на ваш email!';
      statusEl.style.color = '#10b981';
      emailEl.value = '';
      if (typeof ym !== 'undefined') ym(108463875, 'reachGoal', 'LidMagnet');
    } else throw new Error();
  }).catch(() => {
    statusEl.textContent = '❌ Ошибка. Напишите: sergey.tsiunel@gmail.com';
    statusEl.style.color = '#ef4444';
  });
}