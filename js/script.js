// ==============================================
// TELEGRAM CONFIGURATION - ВАШИ ТОКЕНЫ
// ==============================================

const TELEGRAM_TOKEN = '8248183891:AAFViXPq1XQJaZYJtiZd3EEl_h4n2JbV_eA';
const CHAT_ID = 1927712177; // ЧИСЛО без кавычек!

// ==============================================
// INITIALIZATION
// ==============================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Business Doctor website loaded');
    console.log('📅 Загружено:', new Date().toLocaleString('ru-RU'));
    
    // Проверяем подключение к Telegram боту
    await checkTelegramConfig();
    
    // Инициализируем анимации
    initAnimations();
    
    // Настраиваем форму
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        setupForm(contactForm);
    } else {
        console.warn('⚠️ Форма contactForm не найдена на странице');
    }
    
    // Настраиваем мобильную навигацию
    setupMobileNav();
    
    // Настраиваем плавную прокрутку
    setupSmoothScroll();
    
    // Добавляем информацию в консоль для разработчика
    console.log('🔧 Доступные команды отладки:');
    console.log('- window.testTelegramBot() - протестировать Telegram бота');
    console.log('- window.businessDoctorDebug.testForm() - заполнить форму тестовыми данными');
});

// ==============================================
// TELEGRAM CONFIG CHECK & BOT VERIFICATION
// ==============================================

async function checkTelegramConfig() {
    console.log('🔧 Проверка конфигурации Telegram...');
    console.log('✅ Токен установлен:', TELEGRAM_TOKEN ? 'Да' : 'Нет');
    console.log('✅ Chat ID установлен:', CHAT_ID ? 'Да' : 'Нет');
    console.log('✅ Тип Chat ID:', typeof CHAT_ID);
    
    if (!TELEGRAM_TOKEN || !CHAT_ID) {
        console.error('❌ Telegram не настроен! Проверьте TELEGRAM_TOKEN и CHAT_ID');
        showConfigError();
        return false;
    }
    
    // Проверяем валидность токена
    if (!TELEGRAM_TOKEN.includes(':')) {
        console.error('❌ Неверный формат токена! Токен должен содержать ":"');
        return false;
    }
    
    // Проверяем подключение к боту
    return await testBotConnection();
}

async function testBotConnection() {
    console.log('🔧 Проверка подключения к боту...');
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getMe`);
        
        if (!response.ok) {
            console.error(`❌ Ошибка HTTP: ${response.status} ${response.statusText}`);
            return false;
        }
        
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Бот доступен:');
            console.log('   👤 Имя:', result.result.first_name);
            console.log('   📱 Username:', result.result.username);
            console.log('   🔢 ID:', result.result.id);
            console.log('   ✅ Статус: Активен');
            return true;
        } else {
            console.error('❌ Бот недоступен:', result);
            
            if (result.error_code === 401) {
                console.error('❌ Неверный токен! Проверьте TELEGRAM_TOKEN');
                alert('❌ Ошибка: Неверный токен Telegram бота. Проверьте настройки.');
            }
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка при проверке бота:', error);
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            console.error('❌ Проблема с сетью или CORS. Проверьте:');
            console.error('   1. Подключение к интернету');
            console.error('   2. Доступ к api.telegram.org');
        }
        
        return false;
    }
}

function showConfigError() {
    const errorHtml = `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #EF4444;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: 'Inter', sans-serif;
            max-width: 90%;
            text-align: center;
        ">
            ⚠️ Telegram бот не настроен! Сообщения не будут отправляться.
        </div>
    `;
    
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = errorHtml;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 10000);
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
        console.log('🎨 Анимации AOS инициализированы');
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
    
    if (!submitBtn) {
        console.error('❌ Кнопка submitBtn не найдена в форме');
        return;
    }
    
    if (!consentCheckbox) {
        console.error('❌ Чекбокс согласия не найден в форме');
        return;
    }
    
    console.log('📋 Форма найдена, настройка валидации...');
    
    // Настраиваем валидацию в реальном времени
    setupFormValidation(form);
    
    // Блокируем кнопку без согласия
    updateSubmitButtonState(submitBtn, consentCheckbox);
    
    consentCheckbox.addEventListener('change', function() {
        updateSubmitButtonState(submitBtn, consentCheckbox);
    });
    
    // Обрабатываем отправку формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('📤 Начата обработка отправки формы...');
        
        if (!validateFormBeforeSubmit(form)) {
            console.warn('⚠️ Валидация формы не пройдена');
            return;
        }
        
        const formData = collectFormData(form);
        console.log('📝 Данные формы собраны:', formData);
        
        // Показываем состояние загрузки
        setButtonLoading(submitBtn, true);
        
        try {
            console.log('📤 Отправка данных в Telegram...');
            const success = await sendToTelegram(formData);
            
            if (success) {
                console.log('✅ Форма успешно обработана');
                showSuccessMessage(form, submitBtn, consentCheckbox);
            } else {
                console.error('❌ Ошибка при отправке формы');
                showErrorMessage();
            }
        } catch (error) {
            console.error('❌ Неожиданная ошибка отправки формы:', error);
            showNetworkError();
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
    
    console.log('✅ Форма настроена успешно');
}

function setupFormValidation(form) {
    const emailInput = form.querySelector('#email');
    const phoneInput = form.querySelector('#phone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                showInputError(this, 'Введите корректный email');
            } else {
                clearInputError(this);
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !isValidPhone(this.value)) {
                showInputError(this, 'Введите корректный номер телефона');
            } else {
                clearInputError(this);
            }
        });
    }
}

function updateSubmitButtonState(button, checkbox) {
    const isChecked = checkbox.checked;
    button.disabled = !isChecked;
    button.style.opacity = isChecked ? '1' : '0.5';
    button.style.cursor = isChecked ? 'pointer' : 'not-allowed';
}

function validateFormBeforeSubmit(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        
        if (!value) {
            showInputError(field, 'Это поле обязательно для заполнения');
            isValid = false;
        } else {
            clearInputError(field);
        }
        
        // Валидация email
        if (field.type === 'email' && value && !isValidEmail(value)) {
            showInputError(field, 'Введите корректный email');
            isValid = false;
        }
        
        // Валидация телефона
        if (field.name === 'phone' && value && !isValidPhone(value)) {
            showInputError(field, 'Введите корректный номер телефона');
            isValid = false;
        }
    });
    
    return isValid;
}

function collectFormData(form) {
    const formData = {
        name: getFormValue(form, '#name'),
        role: getFormValue(form, '#role'),
        email: getFormValue(form, '#email'),
        phone: getFormValue(form, '#phone') || 'не указан',
        company: getFormValue(form, '#company') || 'не указана',
        revenue: getFormValue(form, '#revenue'),
        message: getFormValue(form, '#message') || 'нет сообщения',
        date: new Date().toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        page: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    return formData;
}

function getFormValue(form, selector) {
    const element = form.querySelector(selector);
    return element ? element.value.trim() : '';
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = 'Отправка...';
        button.disabled = true;
        button.style.opacity = '0.7';
        button.style.cursor = 'wait';
        button.classList.add('btn-loading');
    } else {
        const originalText = button.dataset.originalText || 'Отправить заявку на диагностику';
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
        button.classList.remove('btn-loading');
    }
}

// ==============================================
// TELEGRAM API FUNCTION
// ==============================================

async function sendToTelegram(data) {
    console.log('📡 Начало отправки в Telegram...');
    console.log('🔑 Токен:', TELEGRAM_TOKEN.substring(0, 10) + '...');
    console.log('👤 Chat ID:', CHAT_ID, `(тип: ${typeof CHAT_ID})`);
    
    // Формируем сообщение для Telegram
    const message = `📋 НОВАЯ ЗАЯВКА С BUSINESS DOCTOR\n\n` +
                   `👤 Имя: ${data.name}\n` +
                   `💼 Роль: ${data.role}\n` +
                   `📧 Email: ${data.email}\n` +
                   `📱 Телефон: ${data.phone}\n` +
                   `🏢 Компания: ${data.company}\n` +
                   `💰 Выручка: ${data.revenue}\n\n` +
                   `📝 Сообщение:\n${data.message}\n\n` +
                   `🕐 Дата: ${data.date}\n` +
                   `🌐 Страница: ${data.page}\n` +
                   `🆔 ID: ${Date.now()}`;
    
    console.log('📨 Текст сообщения для Telegram:', message);
    
    try {
        console.log('🌐 Отправка запроса к Telegram API...');
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            })
        });
        
        console.log('📡 Статус ответа:', response.status, response.statusText);
        
        if (!response.ok) {
            console.error(`❌ HTTP ошибка: ${response.status}`);
            
            if (response.status === 400) {
                console.error('❌ Неверный запрос к Telegram API');
            } else if (response.status === 401) {
                console.error('❌ Неавторизованный доступ (неверный токен)');
            } else if (response.status === 404) {
                console.error('❌ Метод не найден (проверьте токен)');
            }
        }
        
        const result = await response.json();
        console.log('📨 Полный ответ от Telegram API:', result);
        
        if (result.ok) {
            console.log('✅ Сообщение успешно отправлено в Telegram!');
            console.log('📊 Информация:');
            console.log('   📍 Message ID:', result.result.message_id);
            console.log('   👤 Chat ID:', result.result.chat.id);
            console.log('   📝 Текст:', result.result.text.substring(0, 50) + '...');
            console.log('   🕐 Время:', new Date(result.result.date * 1000).toLocaleString());
            return true;
        } else {
            console.error('❌ Ошибка Telegram API:');
            console.error('   🔢 Код ошибки:', result.error_code);
            console.error('   📝 Описание:', result.description);
            
            // Определяем тип ошибки
            let errorMessage = 'Ошибка отправки';
            
            if (result.description) {
                if (result.description.includes('chat not found')) {
                    errorMessage = 'Чат не найден. Проверьте CHAT_ID.';
                    console.error('❌ Chat ID не найден! Проверьте:');
                    console.error('   1. Правильность CHAT_ID');
                    console.error('   2. Бот добавлен в чат');
                    console.error('   3. Для личных сообщений: начните диалог с ботом');
                } else if (result.description.includes('bot was blocked')) {
                    errorMessage = 'Бот заблокирован пользователем.';
                    console.error('❌ Бот заблокирован! Разблокируйте бота в Telegram');
                } else if (result.description.includes('group chat was upgraded')) {
                    errorMessage = 'Чат был преобразован в супергруппу.';
                    console.error('❌ Чат преобразован в супергруппу');
                }
            }
            
            alert(`❌ ${errorMessage}\n\nПроверьте консоль для подробностей.`);
            return false;
        }
    } catch (error) {
        console.error('❌ Критическая ошибка при отправке в Telegram:', error);
        console.error('🔧 Детали ошибки:');
        console.error('   📛 Название:', error.name);
        console.error('   💬 Сообщение:', error.message);
        console.error('   📍 Стек:', error.stack);
        
        if (error.name === 'TypeError') {
            console.error('❌ Возможные причины TypeError:');
            console.error('   1. Проблема с CORS (используйте прокси или бэкенд)');
            console.error('   2. Отсутствует подключение к интернету');
            console.error('   3. Блокировка запроса антивирусом или фаерволом');
            
            alert('❌ Ошибка сети. Проверьте:\n1. Подключение к интернету\n2. Настройки безопасности браузера');
        }
        
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
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: 'Inter', sans-serif;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        ">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <div style="font-size: 20px;">✅</div>
                <div style="font-weight: 600;">Заявка отправлена!</div>
            </div>
            <div style="font-size: 14px; opacity: 0.9;">
                Я свяжусь с вами в течение 1 рабочего дня.
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Сбрасываем форму
    setTimeout(() => {
        form.reset();
        checkbox.checked = false;
        updateSubmitButtonState(button, checkbox);
        
        // Убираем уведомление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 5000);
    }, 100);
}

function showErrorMessage() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #EF4444, #DC2626);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: 'Inter', sans-serif;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        ">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <div style="font-size: 20px;">❌</div>
                <div style="font-weight: 600;">Ошибка отправки</div>
            </div>
            <div style="font-size: 14px; opacity: 0.9;">
                Пожалуйста, попробуйте позже или свяжитесь напрямую в Telegram.
            </div>
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
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #F59E0B, #D97706);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: 'Inter', sans-serif;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        ">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <div style="font-size: 20px;">⚠️</div>
                <div style="font-weight: 600;">Ошибка сети</div>
            </div>
            <div style="font-size: 14px; opacity: 0.9;">
                Проверьте подключение к интернету и попробуйте снова.
            </div>
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
    input.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
    
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

function isValidPhone(phone) {
    // Базовая валидация телефона
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function setupMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
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

window.testTelegramBot = async function() {
    console.log('🧪 Запуск теста Telegram бота...');
    
    const testData = {
        name: 'Тестовый пользователь',
        role: 'Собственник',
        email: 'test@example.com',
        phone: '+7 (999) 123-45-67',
        company: 'Тестовая компания ООО',
        revenue: '20-50 млн',
        message: 'Это тестовое сообщение для проверки работы Telegram бота. Отправлено в ' + new Date().toLocaleTimeString(),
        date: new Date().toLocaleString('ru-RU'),
        page: 'Business Doctor Test Page',
        timestamp: new Date().toISOString(),
        userAgent: 'Test Bot'
    };
    
    console.log('📋 Тестовые данные:', testData);
    
    try {
        // Сначала проверяем подключение к боту
        const botAvailable = await testBotConnection();
        
        if (!botAvailable) {
            alert('❌ Тест не пройден: Бот недоступен. Проверьте консоль.');
            return;
        }
        
        console.log('📤 Отправка тестового сообщения...');
        const success = await sendToTelegram(testData);
        
        if (success) {
            console.log('✅ Тест пройден успешно!');
            alert('✅ Тест пройден! Проверьте Telegram бота - должно прийти тестовое сообщение.');
        } else {
            console.error('❌ Тест не пройден');
            alert('❌ Тест не пройден. Проверьте консоль для ошибок.');
        }
    } catch (error) {
        console.error('❌ Ошибка при тестировании:', error);
        alert('❌ Критическая ошибка при тестировании.');
    }
};

// ==============================================
// DEBUG UTILITIES (для разработки)
// ==============================================

window.businessDoctorDebug = {
    testForm: function() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.querySelector('#name').value = 'Иван Иванов';
            form.querySelector('#role').value = 'Собственник бизнеса';
            form.querySelector('#email').value = 'ivan@example.com';
            form.querySelector('#phone').value = '+7 (999) 999-99-99';
            form.querySelector('#company').value = 'ООО "Рога и копыта"';
            form.querySelector('#revenue').value = '20-50';
            form.querySelector('#message').value = 'Нужна помощь в оптимизации бизнес-процессов. Хочу увеличить прибыль на 30% за 6 месяцев.';
            form.querySelector('#consent').checked = true;
            
            // Обновляем состояние кнопки
            const submitBtn = form.querySelector('#submitBtn');
            const consentCheckbox = form.querySelector('#consent');
            updateSubmitButtonState(submitBtn, consentCheckbox);
            
            console.log('✅ Форма заполнена тестовыми данными');
            alert('✅ Форма заполнена тестовыми данными');
        } else {
            console.error('❌ Форма не найдена');
        }
    },
    
    resetForm: function() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.reset();
            
            // Обновляем состояние кнопки
            const submitBtn = form.querySelector('#submitBtn');
            const consentCheckbox = form.querySelector('#consent');
            updateSubmitButtonState(submitBtn, consentCheckbox);
            
            console.log('✅ Форма сброшена');
        }
    },
    
    getConfig: function() {
        return {
            telegramToken: TELEGRAM_TOKEN ? `${TELEGRAM_TOKEN.substring(0, 10)}...` : 'не установлен',
            chatId: CHAT_ID,
            chatIdType: typeof CHAT_ID,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
    },
    
    checkFormElements: function() {
        const form = document.getElementById('contactForm');
        if (!form) {
            console.error('❌ Форма не найдена');
            return;
        }
        
        const elements = [
            '#name', '#role', '#email', '#phone', '#company', '#revenue', '#message', '#consent', '#submitBtn'
        ];
        
        console.log('🔍 Проверка элементов формы:');
        elements.forEach(selector => {
            const element = form.querySelector(selector);
            console.log(`${selector}:`, element ? '✅ Найден' : '❌ Не найден');
        });
    }
};

// ==============================================
// ANALYTICS & TRACKING
// ==============================================

// Отслеживаем клики по CTA
document.addEventListener('click', function(e) {
    const ctaButton = e.target.closest('.btn-primary, .btn-cta, [data-cta]');
    
    if (ctaButton) {
        console.log('🎯 Клик по CTA:', ctaButton.textContent.trim());
        
        // Можно добавить отправку в аналитику
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', 'cta_click', {
        //         'event_category': 'engagement',
        //         'event_label': ctaButton.textContent.trim()
        //     });
        // }
    }
});

// Отслеживаем скролл до секций
let sectionsViewed = new Set();
window.addEventListener('scroll', function() {
    document.querySelectorAll('section[id]').forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible && !sectionsViewed.has(section.id)) {
            sectionsViewed.add(section.id);
            console.log('👁️ Просмотрена секция:', section.id);
            
            // Аналитика просмотра секций
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'section_view', {
            //         'event_category': 'engagement',
            //         'event_label': section.id
            //     });
            // }
        }
    });
});

// ==============================================
// ERROR HANDLING
// ==============================================

// Глобальный обработчик ошибок
window.addEventListener('error', function(e) {
    console.error('🚨 Глобальная ошибка:', e.message);
    console.error('📍 В файле:', e.filename);
    console.error('🔢 Строка:', e.lineno, 'Колонка:', e.colno);
});

// Обработчик необработанных промисов
window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 Необработанная ошибка Promise:', e.reason);
});

// ==============================================
// PERFORMANCE MONITORING
// ==============================================

// Мониторинг производительности
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('📊 Производительность загрузки:');
                console.log('   ⏱️  DOMContentLoaded:', perfData.domContentLoadedEventEnd.toFixed(0), 'ms');
                console.log('   ⏱️  Load:', perfData.loadEventEnd.toFixed(0), 'ms');
            }
        }, 0);
    });
}

console.log('🎯 Business Doctor скрипт загружен и готов к работе!');