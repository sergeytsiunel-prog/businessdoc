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
// TELEGRAM FORM HANDLING
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.contact-form');
  
  if (!contactForm) {
    console.error('Форма .contact-form не найдена!');
    return;
  }
  
  console.log('Форма найдена, настраиваем обработчик...');
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Форма отправляется...');

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    try {
      // Собираем данные формы
      const formData = new FormData(this);
      
      // Для отладки
      console.log('=== ДАННЫЕ ФОРМЫ ===');
      for (let [key, value] of formData.entries()) {
        console.log(key + ':', value);
      }
      
      // Конфигурация Telegram
      const TELEGRAM_TOKEN = '8248183891:AAFViXPq1XQJaZYJtiZd3EEl_h4n2JbV_eA';
      const CHAT_ID = '1927712177';
      
      // Маппинг значений
      const roleMap = {
        'owner': 'Собственник',
        'ceo': 'CEO / Генеральный директор', 
        'finance': 'Финансовый директор',
        'other': 'Другое'
      };
      
      const taskMap = {
        'stop_loss': 'Остановить падение прибыли',
        'increase_control': 'Повысить управляемость и контроль',
        'scale': 'Подготовить компанию к масштабированию',
        'crisis': 'Выйти из кризиса / сохранить бизнес',
        'other_task': 'Другое'
      };
      
      // Получаем данные
      const name = formData.get('name') || 'Не указано';
      const roleValue = formData.get('role');
      const role = roleMap[roleValue] || roleValue || 'Не указано';
      const taskValue = formData.get('primary_task');
      const task = taskMap[taskValue] || taskValue || 'Не указано';
      const context = formData.get('context') || 'Не указано';
      const email = formData.get('email') || 'Не указано';
      
      // Формируем сообщение
      const message = `
📞 <b>Новая заявка с сайта Business Doctor</b>

👤 <b>Имя:</b> ${name}
🎯 <b>Роль:</b> ${role}
🎯 <b>Основная задача:</b> ${task}
📧 <b>Email:</b> ${email}

💬 <b>Описание ситуации:</b>
${context}

⏰ ${new Date().toLocaleString('ru-RU')}
      `.trim();
      
      console.log('Отправляем в Telegram:', message);
      
      // Отправляем запрос
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
      
      const result = await response.json();
      console.log('Ответ Telegram:', result);
      
      if (result.ok) {
        alert('✅ Сообщение отправлено! Я свяжусь с вами в ближайшее время.');
        contactForm.reset();
      } else {
        console.error('Telegram error:', result);
        alert('❌ Ошибка отправки: ' + (result.description || 'Попробуйте позже'));
      }
      
    } catch (error) {
      console.error('Ошибка сети:', error);
      alert('❌ Ошибка соединения. Проверьте интернет.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
  
  console.log('Обработчик формы настроен');
});

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
