// ==============================================
// FRONTEND: безопасная отправка формы через /api/sendTelegram
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Frontend form script loaded');

  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(this);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const message = formData.get('message') || '';

      if (!name.trim() || !email.trim() || !message.trim()) {
        alert('⚠️ Пожалуйста, заполните все обязательные поля');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }

      console.log('📋 Sending data to serverless function:', { name, email, message });

      const response = await fetch('/api/sendTelegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Спасибо! Я свяжусь с вами в течение 24 часов.');
        contactForm.reset();
      } else {
        console.error('Ошибка отправки:', result.error);
        alert('❌ Ошибка отправки. Пожалуйста, попробуйте позже.');
      }

    } catch (error) {
      console.error('🌐 Ошибка сети:', error);
      alert('❌ Ошибка соединения. Проверьте интернет и попробуйте еще раз.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
    // Экстренный фикс скролла на мобильных
if (window.innerWidth <= 768) {
  // Переопределяем плавный скролл для всех якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#top') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        // Высота шапки на мобильных
        const headerOffset = 140;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

