// ==============================================
// FRONTEND: безопасная отправка формы через /api/sendTelegram
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Frontend form script loaded');

  // ===== ОТПРАВКА ФОРМЫ =====
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
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
    });
  }

  // ===== АККОРДЕОН ДЛЯ МОБИЛЬНЫХ =====
  if (window.innerWidth <= 768) {
    const expandBtn = document.createElement('button');
    expandBtn.className = 'problem-expand-btn';
    expandBtn.textContent = 'Показать ещё 2 проблемы';
    
    const problemGrid = document.querySelector('.problem-grid');
    if (problemGrid) {
      problemGrid.parentNode.insertBefore(expandBtn, problemGrid.nextSibling);
      
      expandBtn.addEventListener('click', function() {
        const hiddenCards = document.querySelectorAll('.problem-card:not(:first-child)');
        hiddenCards.forEach(card => card.classList.toggle('expanded'));
        
        this.textContent = this.textContent.includes('Показать') 
          ? 'Свернуть' 
          : 'Показать ещё 2 проблемы';
      });
    }
  }

  // ===== ПЛАВНЫЙ СКРОЛЛ ДЛЯ МОБИЛЬНЫХ =====
  if (window.innerWidth <= 768) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#top') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
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

// ===== ОСНОВНОЙ КОД =====
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== ПЛАВНЫЙ СКРОЛЛ ДЛЯ ДЕСКТОПА =====
  if (window.innerWidth > 768) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#top') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 100;
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
  
  // Фикс высоты шапки на мобильных
  function fixMobileHeader() {
    if (window.innerWidth <= 768) {
      const header = document.querySelector('.header');
      const body = document.body;
      
      if (header) {
        // Вычисляем реальную высоту шапки
        const headerHeight = header.offsetHeight;
        console.log('Высота шапки:', headerHeight);
        
        // Устанавливаем точный отступ для body
        body.style.paddingTop = headerHeight + 'px';
        
        // Убираем лишние отступы у hero
        const hero = document.querySelector('.hero');
        if (hero) {
          hero.style.marginTop = '-' + (headerHeight / 4) + 'px';
          hero.style.paddingTop = '0';
        }
      }
    } else {
      // На десктопе сбрасываем отступы
      document.body.style.paddingTop = '0';
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.style.marginTop = '';
        hero.style.paddingTop = '';
      }
    }
  }
  
  // Запускаем при загрузке и ресайзе
  window.addEventListener('load', fixMobileHeader);
  window.addEventListener('resize', fixMobileHeader);
  
  // Запускаем сразу
  fixMobileHeader();
  
}); // <-- Закрывающая скобка DOMContentLoaded