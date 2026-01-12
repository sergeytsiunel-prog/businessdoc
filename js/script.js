// ==============================================
// TELEGRAM CONFIGURATION - ВАШИ ТОКЕНЫ
// ==============================================

const TELEGRAM_TOKEN = '8248183891:AAFViXPq1XQJaZYJtiZd3EEl_h4n2JbV_eA';
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
    // Показываем ошибку только в консоли для разработчика
    console.warn('⚠️ ВНИМАНИЕ: Telegram бот не настроен!');
    console.log('📝 Инструкция по настройке:');
    console.log('1. Получите токен у @BotFather');
    console.log('2. Получите CHAT_ID у @userinfobot');
    console.log('3. Обновите константы в начале файла main.js');
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
            disable: window.innerWidth < 768 ? true : false
        });
    } else {
        console.warn('⚠️ Библиотека AOS не загружена');
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
    
    // Обрабатываем отправку формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateFormBeforeSubmit(form)) {
            return;
        }
        
        const formData = collectFormData(form);
        
        // Показываем состояние загрузки
        setButtonLoading(submitBtn, true);
        
        try {
            console.log('📤 Отправка данных в Telegram...');
            const success = await sendToTelegram(formData);
            
            if (success) {
                showSuccessMessage(form, submitBtn, consentCheckbox);
            } else {
                showErrorMessage();
            }
        } catch (error) {
            console.error('❌ Ошибка отправки формы:', error);
            showNetworkError();
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
}

function setupFormValidation(form) {
    const emailInput = form.querySelector('#email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                showInputError(this, 'Введите корректный email');
            } else {
                clearInputError(this);
            }
        });
    }
}

function updateSubmitButtonState(button, checkbox) {
    button.disabled = !checkbox.checked;
    button.style.opacity = checkbox.checked ? '1' : '0.5';
    button.style.cursor = checkbox.checked ? 'pointer' : 'not-allowed';
}

function validateFormBeforeSubmit(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showInputError(field, 'Это поле обязательно для заполнения');
            isValid = false;
        } else {
            clearInputError(field);
        }
        
        if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value)) {
            showInputError(field, 'Введите корректный email');
            isValid = false;
        }
    });
    
    return isValid;
}

function collectFormData(form) {
    return {
        name: form.querySelector('#name').value.trim(),
        role: form.querySelector('#role').value.trim(),
        email: form.querySelector('#email').value.trim(),
        company: form.querySelector('#company').value.trim() || 'не указана',
        revenue: form.querySelector('#revenue').value,
        message: form.querySelector('#message').value.trim(),
        date: new Date().toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        page: 'Business Doctor Landing Page',
        timestamp: new Date().toISOString()
    };
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = 'Отправка...';
        button.disabled = true;
        button.style.opacity = '0.7';
        button.classList.add('btn-loading');
    } else {
        button.textContent = button.dataset.originalText || 'Отправить заявку на диагностику';
        button.disabled = false;
        button.style.opacity = button.previousOpacity || '1';
        button.classList.remove('btn-loading');
    }
}

// ==============================================
// TELEGRAM API
// ==============================================

async function sendToTelegram(data) {
    console.log('📡 Отправка в Telegram:', { token: TELEGRAM_TOKEN?.substring(0, 10) + '...', chatId: CHAT_ID });
    
    // Формируем сообщение для Telegram
    const message = `📋 НОВАЯ ЗАЯВКА С BUSINESS DOCTOR\n\n` +
                   `👤 Имя: ${data.name}\n` +
                   `💼 Роль: ${data.role}\n` +
                   `📧 Email: ${data.email}\n` +
                   `🏢 Компания: ${data.company}\n` +
                   `💰 Выручка: ${data.revenue}\n\n` +
                   `📝 Сообщение:\n${data.message}\n\n` +
                   `🕐 Дата: ${data.date}\n` +
                   `🌐 Источник: ${data.page}`;
    
    try {
        console.log('🌐 Отправка запроса к Telegram API...');
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        console.log('📨 Ответ от Telegram API:', result);
        
        if (result.ok) {
            console.log('✅ Сообщение успешно отправлено в Telegram');
            return true;
        } else {
            console.error('❌ Ошибка Telegram API:', result);
            
            // Если ошибка "chat not found" - проверяем Chat ID
            if (result.description && result.description.includes('chat not found')) {
                console.error('❌ Chat ID не найден! Проверьте правильность CHAT_ID');
                alert('❌ Ошибка настройки бота. Свяжитесь с администратором.');
            }
            
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка сети при отправке в Telegram:', error);
        return false;
    }
}

// ==============================================
// UI NOTIFICATIONS
// ==============================================

function showSuccessMessage(form, button, checkbox) {
    // Показываем уведомление
    const notification = document.createElement('div');
    notification.className = 'form-notification success';
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 16px 24px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: 'Inter', sans-serif;">
            ✅ Заявка отправлена! Я свяжусь с вами в течение 1 рабочего дня.
        </div>
    `;
    document.body.appendChild(notification);
    
    // Сбрасываем форму
    setTimeout(() => {
        form.reset();
        checkbox.checked = false;
        button.disabled = true;
        button.style.opacity = '0.5';
        
        // Убираем уведомление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }, 100);
}

function showErrorMessage() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #EF4444; color: white; padding: 16px 24px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: 'Inter', sans-serif;">
            ❌ Ошибка отправки. Пожалуйста, попробуйте позже или свяжитесь напрямую в Telegram.
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function showNetworkError() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #F59E0B; color: white; padding: 16px 24px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: 'Inter', sans-serif;">
            ⚠️ Ошибка сети. Проверьте подключение к интернету и попробуйте снова.
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function showInputError(input, message) {
    clearInputError(input);
    
    input.style.borderColor = '#EF4444';
    input.style.boxShadow = '0 0 0 1px rgba(239, 68, 68, 0.2)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.style.color = '#EF4444';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    errorDiv.style.fontFamily = "'Inter', sans-serif";
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

function clearInputError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    
    const existingError = input.parentNode.querySelector('.input-error');
    if (existingError) {
        existingError.remove();
    }
}

// ==============================================
// UTILITIES
// ==============================================

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function setupMobileNav() {
    // Для будущего мобильного меню (гамбургер)
    if (window.innerWidth <= 768) {
        // Можно добавить гамбургер-меню здесь при необходимости
    }
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки страницы
                history.pushState(null, null, href);
            }
        });
    });
}

// ==============================================
// TEST FUNCTION (для отладки)
// ==============================================

// Экспортируем функцию для тестирования (можно вызвать из консоли браузера)
window.testTelegramBot = async function() {
    console.log('🧪 Тестирование Telegram бота...');
    
    const testData = {
        name: 'Тестовый пользователь',
        role: 'Собственник',
        email: 'test@example.com',
        company: 'Тестовая компания',
        revenue: '20-50',
        message: 'Это тестовое сообщение для проверки работы Telegram бота.',
        date: new Date().toLocaleString('ru-RU'),
        page: 'Business Doctor Test',
        timestamp: new Date().toISOString()
    };
    
    console.log('📋 Тестовые данные:', testData);
    
    try {
        const success = await sendToTelegram(testData);
        if (success) {
            console.log('✅ Тест пройден успешно! Проверьте Telegram.');
            alert('✅ Тест пройден! Проверьте Telegram бота.');
        } else {
            console.error('❌ Тест не пройден');
            alert('❌ Тест не пройден. Проверьте консоль для ошибок.');
        }
    } catch (error) {
        console.error('❌ Ошибка при тестировании:', error);
        alert('❌ Ошибка при тестировании.');
    }
};

// ==============================================
// PAGE ANALYTICS (опционально)
// ==============================================

// Отслеживаем клики по CTA
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary, .btn-primary *')) {
        console.log('🎯 Клик по CTA:', e.target.textContent.trim());
        
        // Можно добавить отправку в Google Analytics или другую аналитику
        // ga('send', 'event', 'CTA', 'click', e.target.textContent.trim());
    }
});

// Отслеживаем скролл до секций
let sectionsViewed = new Set();
window.addEventListener('scroll', function() {
    document.querySelectorAll('section[id]').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
            if (!sectionsViewed.has(section.id)) {
                sectionsViewed.add(section.id);
                console.log('👁️ Просмотрена секция:', section.id);
                
                // Можно добавить аналитику просмотра секций
                // ga('send', 'event', 'Section', 'view', section.id);
            }
        }
    });
});

// ==============================================
// DEBUG MODE (для разработки)
// ==============================================

// Показываем информацию о загрузке
console.log('🎯 Business Doctor - Антикризисный консультант');
console.log('📧 Telegram бот настроен:', TELEGRAM_TOKEN ? 'Да' : 'Нет');
console.log('👤 Chat ID:', CHAT_ID);
console.log('📅 Загружено:', new Date().toLocaleString('ru-RU'));

// Добавляем команды для отладки в консоли
if (typeof window !== 'undefined') {
    window.businessDoctorDebug = {
        testForm: function() {
            const form = document.getElementById('contactForm');
            if (form) {
                form.querySelector('#name').value = 'Тест Имя';
                form.querySelector('#role').value = 'Собственник';
                form.querySelector('#email').value = 'test@example.com';
                form.querySelector('#company').value = 'Тестовая компания';
                form.querySelector('#revenue').value = '20-50';
                form.querySelector('#message').value = 'Тестовое сообщение';
                form.querySelector('#consent').checked = true;
                
                console.log('✅ Форма заполнена тестовыми данными');
                alert('Форма заполнена тестовыми данными');
            }
        },
        resetForm: function() {
            const form = document.getElementById('contactForm');
            if (form) {
                form.reset();
                console.log('✅ Форма сброшена');
            }
        },
        getConfig: function() {
            return {
                telegramToken: TELEGRAM_TOKEN,
                chatId: CHAT_ID,
                timestamp: new Date().toISOString()
            };
        }
    };
    
    console.log('🔧 Доступные команды отладки:');
    console.log('- businessDoctorDebug.testForm() - заполнить форму тестовыми данными');
    console.log('- businessDoctorDebug.resetForm() - сбросить форму');
    console.log('- businessDoctorDebug.getConfig() - получить конфигурацию');
    console.log('- testTelegramBot() - протестировать Telegram бота');
}