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

// ==============================================
// TELEGRAM BOT CONFIGURATION
// ==============================================

const TELEGRAM_TOKEN = '8248183891:AAFViXPq1XQJaZYJtiZd3EEl_h4n2JbV_eA';
const CHAT_ID = '1927712177'; // Важно: строка!

// ==============================================
// Обработка формы
// ==============================================

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    try {
      // Собираем данные формы
      const formData = new FormData(this);
      const name = formData.get('name') || 'Не указано';
      const phone = formData.get('phone') || 'Не указано';
      const email = formData.get('email') || 'Не указано';
      const message = formData.get('message') || 'Не указано';
      
      // Формируем сообщение для Telegram
      const telegramMessage = `
📞 <b>Новая заявка с сайта Business Doctor</b>

👤 <b>Имя:</b> ${name}
📱 <b>Телефон:</b> ${phone}
📧 <b>Email:</b> ${email}
💬 <b>Сообщение:</b> ${message}

⏰ ${new Date().toLocaleString('ru-RU')}
      `.trim();
      
      // Отправляем в Telegram
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML'
        })
      });
      
      const result = await response.json();
      
      if (result.ok) {
        alert('✅ Сообщение отправлено! Я свяжусь с вами в ближайшее время.');
        contactForm.reset();
      } else {
        console.error('Telegram error:', result);
        alert('❌ Ошибка отправки. Пожалуйста, позвоните по телефону.');
      }
      
    } catch (error) {
      console.error('Network error:', error);
      alert('❌ Ошибка соединения. Проверьте интернет и попробуйте снова.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
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

// ==============================================
// Дополнительная проверка при загрузке
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Business Doctor website loaded');
  console.log('📅 Telegram bot configured:', !!TELEGRAM_TOKEN);
  console.log('📱 Chat ID:', CHAT_ID);
});
