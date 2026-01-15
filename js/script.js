// ==============================================
// TELEGRAM BOT CONFIGURATION (упрощенная форма)
// ==============================================

const TELEGRAM_TOKEN = '8248183891:AAFViXPq1XQJaZYJtiZd3EEl_h4n2JbV_eA';
const CHAT_ID = '1927712177';

// ==============================================
// Обработка УПРОЩЕННОЙ формы (3 поля)
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.contact-form');
  
  if (!contactForm) {
    console.error('Форма не найдена!');
    return;
  }
  
  console.log('✅ Упрощенная форма готова (3 поля)');
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('📤 Отправка формы...');

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    try {
      // Собираем данные (только 3 поля)
      const formData = new FormData(this);
      const name = formData.get('name') || 'Не указано';
      const email = formData.get('email') || 'Не указано';
      const message = formData.get('message') || 'Не указано';
      
      console.log('📋 Данные формы:', { name, email, message });
      
      // Формируем сообщение
      const telegramMessage = `
🎯 <b>НОВАЯ ЗАЯВКА с бизнес-лендинга</b>

👤 <b>Имя:</b> ${name}
📧 <b>Email:</b> ${email}

💬 <b>Задача/проблема:</b>
${message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
      `.trim();
      
      // Отправляем в Telegram
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML'
        })
      });
      
      const result = await response.json();
      console.log('📨 Ответ Telegram:', result.ok ? 'Успех' : 'Ошибка');
      
      if (result.ok) {
        alert('✅ Спасибо! Я свяжусь с вами в течение 24 часов.');
        contactForm.reset();
      } else {
        alert('❌ Ошибка отправки. Пожалуйста, напишите мне в Telegram: @sergeytsiunel');
      }
      
    } catch (error) {
      console.error('Ошибка сети:', error);
      alert('❌ Ошибка соединения. Попробуйте еще раз.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});

// ==============================================
// Плавный скролл и анимации (остается без изменений)
// ==============================================

// [остальной код без изменений...]
