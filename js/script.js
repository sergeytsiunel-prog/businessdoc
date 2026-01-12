// ==============================================
// TELEGRAM CONFIGURATION
// ==============================================
const TELEGRAM_TOKEN = '8248183891:AAGqQI1HF50voqYMP-GL0qwuJNJnTCCegOE';
const CHAT_ID = '1927712177';

// ==============================================
// INITIALIZATION
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Business Doctor website loaded');
    
    // Проверяем конфигурацию Telegram
    checkTelegramConfig();
    
    // Инициализируем анимации
    initAnimations();
    
    // Настраиваем форму
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        setupForm(contactForm);
    }
    
    // Настраиваем мобильную навигацию
    setupMobileNav();
    
    // Настраиваем плавную прокрутку
    setupSmoothScroll();
});

// ==============================================
// TELEGRAM CONFIG CHECK
// ==============================================
function checkTelegramConfig() {
    console.log('🔧 Проверка конфигурации Telegram...');
    console.log('✅ Токен установлен:', TELEGRAM_TOKEN ? 'Да' : 'Нет');
    console.log('✅ Chat ID установлен:', CHAT_ID ? 'Да' : 'Нет');
    
    if (!TELEGRAM_TOKEN || !CHAT_ID) {
        console.error('❌ Telegram не настроен! Проверьте TELEGRAM_TOKEN и CHAT_ID');
        showConfigError();
    }
}

function showConfigError() {
    console.warn('⚠️  ВНИМАНИЕ: Telegram бот не настроен!');
    console.log('📋 Инструкция по настройке:');
    console.log('1. Получите токен у @BotFather');
    console.log('2. Получите CHAT_ID у @userinfobot');
    console.log('3. Обновите константы в начале файла script.js');
}

// ==============================================
// ANIMATIONS
// ==============================================
function initAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-out',
            once: true,
            offset: 100,
            disable: window.innerWidth < 768
        });
    } else {
        console.warn('⚠️  Библиотека AOS не загружена');
    }
}

// ==============================================
// FORM HANDLING
// ==============================================
function setupForm(form) {
    const submitBtn = form.querySelector('#submitBtn');
    const consentCheckbox = form.querySelector('#consent');
    
    // Настраиваем валидацию в реальном времени
    setupFormValidation(form);
    
    // Блокируем кнопку без согласия
    if (submitBtn && consentCheckbox) {
        updateSubmitButtonState(submitBtn, consentCheckbox);
        consentCheckbox.addEventListener('change', function() {
            updateSubmitButtonState(submitBtn, consentCheckbox);
        });
    }
    
    // Обрабатываем отправку
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit(this);
    });
}

function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    if (field.checkValidity()) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
    }
}

function updateSubmitButtonState(button, checkbox) {
    button.disabled = !checkbox.checked;
    button.style.opacity = checkbox.checked ? '1' : '0.5';
    button.style.cursor = checkbox.checked ? 'pointer' : 'not-allowed';
}

async function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
        // Показываем состояние загрузки
        const submitBtn = form.querySelector('#submitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Отправляем в Telegram
        await sendToTelegram(data);
        
        // Показываем успех
        showSuccessMessage();
        form.reset();
        
        // Возвращаем кнопку в исходное состояние
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        showErrorMessage();
    }
}

async function sendToTelegram(data) {
    const message = `
📋 Новая заявка с сайта Business Doctor

👤 Имя: ${data.name || 'Не указано'}
📧 Email: ${data.email || 'Не указано'}
🏢 Компания: ${data.company || 'Не указано'}
💰 Выручка: ${data.revenue || 'Не указано'}
💼 Роль: ${data.role || 'Не указано'}

📝 Сообщение:
${data.message || 'Не указано'}

🕒 Время: ${new Date().toLocaleString('ru-RU')}
    `;
    
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
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
    
    if (!response.ok) {
        throw new Error('Ошибка отправки в Telegram');
    }
    
    return await response.json();
}

function showSuccessMessage() {
    alert('✅ Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в течение 24 часов.');
}

function showErrorMessage() {
    alert('❌ Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или напишите нам на info@businessdoc.pro');
}

// ==============================================
// MOBILE NAVIGATION
// ==============================================
function setupMobileNav() {
    if (window.innerWidth < 768) {
        const nav = document.querySelector('.nav ul');
        if (nav) {
            nav.style.flexDirection = 'column';
            nav.style.alignItems = 'center';
        }
    }
}

// ==============================================
// SMOOTH SCROLL
// ==============================================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==============================================
// GOOGLE ANALYTICS
// ==============================================
if (typeof gtag !== 'undefined') {
    console.log('✅ Google Analytics загружен');
    
    // Трекинг отправки формы
    document.addEventListener('formSubmit', function() {
        gtag('event', 'form_submit', {
            'event_category': 'contact',
            'event_label': 'Contact Form'
        });
    });
}

// ==============================================
// PERFORMANCE MONITORING
// ==============================================
window.addEventListener('load', function() {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                     window.performance.timing.navigationStart;
    
    console.log(`⚡ Время загрузки страницы: ${loadTime}ms`);
    
    if (loadTime > 3000) {
        console.warn('⚠️  Страница загружается медленно');
    }
});
