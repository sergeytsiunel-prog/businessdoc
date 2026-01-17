// ==============================================
// TELEGRAM BOT CONFIGURATION
// ==============================================

const TELEGRAM_TOKEN = '8248183891:AAHcc4dEgL8VcJ1Wgh8igUM0XJkIO_G6u-U';
const CHAT_ID = '1927712177';

console.log('🚀 Business Doctor — script.js загружен');

// ==============================================
// Форма отправки в Telegram
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM загружен');

  const form = document.querySelector('.contact-form');

  if (!form) {
    console.error('❌ Форма .contact-form не найдена');
    return;
  }

  console.log('✅ Форма найдена');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      alert('⚠️ Заполните все поля');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    const telegramMessage = `
<b>🎯 Новая заявка — Business Doctor</b>

👤 <b>Имя:</b> ${name}
📧 <b>Email:</b> ${email}

💬 <b>Сообщение:</b>
${message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
    `;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: telegramMessage,
            parse_mode: 'HTML'
          })
        }
      );

      const result = await response.json();
      console.log('📩 Ответ Telegram:', result);

      if (!result.ok) {
        throw new Error(result.description || 'Telegram error');
      }

      alert('✅ Заявка отправлена. Я свяжусь с вами.');
      form.reset();

    } catch (err) {
      console.error('❌ Ошибка отправки:', err);
      alert('❌ Ошибка отправки. Напишите напрямую в Telegram.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});

