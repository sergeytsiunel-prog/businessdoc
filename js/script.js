// ==============================================
// TELEGRAM BOT CONFIGURATION
// ==============================================

const TELEGRAM_TOKEN = '8248183891:AAFViXPq1XQJaZYJtiZd3EEl_h4n2JbV_eA';
const CHAT_ID = '1927712177';

// ==============================================
// Обработка УПРОЩЕННОЙ формы (3 поля)
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Business Doctor - упрощенная форма загружена');
  
  const contactForm = document.querySelector('.contact-form');
  
  if (!contactForm) {
    console.error('❌ Форма .contact-form не найдена!');
    return;
  }
  
  console.log('✅ Форма найдена, настраиваем обработчик...');
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('📤 Начало отправки формы...');

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    try {
      // Собираем данные (только 3 поля)
      const formData = new FormData(this);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const message = formData.get('message') || '';
      
      // Валидация
      if (!name.trim() || !email.trim() || !message.trim()) {
        alert('⚠️ Пожалуйста, заполните все обязательные поля');
        return;
      }
      
      console.log('📋 Данные формы:', { name, email, message });
      
      // Формируем сообщение для Telegram
      const telegramMessage = `
🎯 <b>НОВАЯ ЗАЯВКА с BusinessDoc.pro</b>

👤 <b>Имя:</b> ${name.trim()}
📧 <b>Email:</b> ${email.trim()}

💬 <b>Задача/проблема:</b>
${message.trim()}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
      `.trim();
      
      console.log('📨 Отправляем в Telegram...');
      
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
      console.log('📩 Ответ Telegram:', result.ok ? '✅ Успех' : '❌ Ошибка', result);
      
      if (result.ok) {
        alert('✅ Спасибо! Я свяжусь с вами в течение 24 часов.');
        contactForm.reset();
      } else {
        console.error('Ошибка Telegram:', result);
        alert('❌ Ошибка отправки. Пожалуйста, напишите мне напрямую в Telegram: @sergeytsiunel');
      }
      
    } catch (error) {
      console.error('🌐 Ошибка сети:', error);
      alert('❌ Ошибка соединения. Проверьте интернет и попробуйте еще раз.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      console.log('🔄 Форма восстановлена');
    }
  });
  
  console.log('✅ Обработчик формы настроен');
});

// ==============================================
// Плавный скролл для якорных ссылок
// ==============================================

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

// ==============================================
// Анимация появления элементов при скролле
// ==============================================

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

document.addEventListener('DOMContentLoaded', () => {
  const fadeElements = document.querySelectorAll('.fade-up');
  fadeElements.forEach(el => observer.observe(el));
});

// ==============================================
// Фикс для мобильного меню
// ==============================================

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
