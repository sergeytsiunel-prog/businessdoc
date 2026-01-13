// ==============================================
// TELEGRAM CONFIGURATION
// ==============================================

const TELEGRAM_TOKEN = '8248183891:AAFViXPq1XQJaZYJtiZd3EEl_h4n2JbV_eA';
const CHAT_ID = 1927712177;

// ==============================================
// INITIALIZATION
// ==============================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Business Doctor website loaded');
    console.log('📅 Загружено:', new Date().toLocaleString('ru-RU'));
    
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
    
    // Настраиваем header эффект при скролле
    setupHeaderScroll();
    
    // Инициализируем анимацию слотов
    initSlotsAnimation();
    
    // Добавляем информацию в консоль для разработчика
    console.log('🔧 Доступные команды отладки:');
    console.log('- window.testTelegramBot() - протестировать Telegram бота');
    console.log('- window.businessDoctorDebug.testForm() - заполнить форму тестовыми данными');
    
    // Проверяем бота в фоновом режиме (без блокировки загрузки)
    setTimeout(() => {
        checkTelegramConfig().then(botAvailable => {
            if (!botAvailable) {
                console.warn('⚠️ Telegram бот недоступен. Проверьте настройки.');
            }
        });
    }, 1000);
});

// ==============================================
// TELEGRAM CONFIG CHECK
// ==============================================

async function checkTelegramConfig() {
    console.log('🔧 Проверка конфигурации Telegram...');
    console.log('✅ Токен установлен:', TELEGRAM_TOKEN ? 'Да' : 'Нет');
    console.log('✅ Chat ID установлен:', CHAT_ID ? 'Да' : 'Нет');
    
    if (!TELEGRAM_TOKEN || !CHAT_ID) {
        console.error('❌ Telegram не настроен! Проверьте TELEGRAM_TOKEN и CHAT_ID');
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
            console.log('✅ Бот доступен:', result.result.first_name);
            return true;
        } else {
            console.error('❌ Бот недоступен:', result);
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка при проверке бота:', error);
        return false;
    }
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
// FORM HANDLING (ОБНОВЛЕННЫЙ)
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
                showSuccessMessage(form);
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
    
    // Настройка кнопки "Новая заявка"
    const newRequestBtn = document.getElementById('newRequestBtn');
    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', function() {
            document.getElementById('successMessage').style.display = 'none';
            form.style.display = 'block';
            form.reset();
            consentCheckbox.checked = false;
            updateSubmitButtonState(submitBtn, consentCheckbox);
        });
    }
    
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
    const btnText = button.querySelector('.btn-text');
    
    if (btnText) {
        button.disabled = !isChecked;
        button.style.opacity = isChecked ? '1' : '0.5';
        button.style.cursor = isChecked ? 'pointer' : 'not-allowed';
    } else {
        // Fallback для старой структуры
        button.disabled = !isChecked;
        button.style.opacity = isChecked ? '1' : '0.5';
        button.style.cursor = isChecked ? 'pointer' : 'not-allowed';
    }
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
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    
    if (btnText && btnLoading) {
        if (isLoading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            button.disabled = true;
            button.style.cursor = 'wait';
        } else {
            btnText.style.display = 'flex';
            btnLoading.style.display = 'none';
            button.disabled = false;
            button.style.cursor = 'pointer';
        }
    } else {
        // Fallback для старой структуры
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
}

// ==============================================
// TELEGRAM API FUNCTION
// ==============================================

async function sendToTelegram(data) {
    console.log('📡 Отправка в Telegram...');
    
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
    
    console.log('📨 Текст сообщения для Telegram:', message.substring(0, 100) + '...');
    
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
        
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Сообщение успешно отправлено в Telegram!');
            console.log('📊 Message ID:', result.result.message_id);
            return true;
        } else {
            console.error('❌ Ошибка Telegram API:', result.description);
            
            // Только логируем ошибку, не показываем alert
            if (result.description && result.description.includes('chat not found')) {
                console.error('❌ Chat ID не найден! Проверьте правильность CHAT_ID');
            } else if (result.description && result.description.includes('bot was blocked')) {
                console.error('❌ Бот заблокирован пользователем!');
            }
            
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка сети при отправке в Telegram:', error);
        return false;
    }
}

// ==============================================
// UI NOTIFICATIONS (ОБНОВЛЕННЫЕ)
// ==============================================

function showSuccessMessage(form) {
    // Скрываем форму, показываем сообщение об успехе
    form.style.display = 'none';
    
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        // Fallback: показываем уведомление
        showNotification('✅ Заявка отправлена! Я свяжусь с вами в течение 1 рабочего дня.', 'success');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'form-notification';
    
    const backgroundColor = type === 'success' ? '#10B981' : 
                          type === 'error' ? '#EF4444' : '#F59E0B';
    
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: 'Inter', sans-serif;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 20px;">${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}</div>
                <div style="font-weight: 600;">${message}</div>
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

function showErrorMessage() {
    showNotification('Ошибка отправки. Пожалуйста, попробуйте позже или свяжитесь напрямую в Telegram.', 'error');
}

function showNetworkError() {
    showNotification('Ошибка сети. Проверьте подключение к интернету и попробуйте снова.', 'error');
}

function showInputError(input, message) {
    clearInputError(input);
    
    // Добавляем класс ошибки к родительскому контейнеру
    const inputContainer = input.closest('.input-with-icon, .textarea-with-icon');
    if (inputContainer) {
        inputContainer.classList.add('error');
    } else {
        input.style.borderColor = '#EF4444';
        input.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

function clearInputError(input) {
    const inputContainer = input.closest('.input-with-icon, .textarea-with-icon');
    if (inputContainer) {
        inputContainer.classList.remove('error');
    } else {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }
    
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
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function setupMobileNav() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Блокируем скролл страницы при открытом меню
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
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
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

function setupHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
            
            if (currentScroll > lastScroll && currentScroll > 200) {
                // Прокрутка вниз
                header.style.transform = 'translateY(-100%)';
            } else {
                // Прокрутка вверх
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

function initSlotsAnimation() {
    const slotsElements = document.querySelectorAll('#slots-count, #available-slots, #contact-slots');
    const timerElement = document.querySelector('#timer-hours');
    
    if (!slotsElements.length) return;
    
    // Функция обновления слотов
    function updateSlots() {
        const now = new Date();
        const hoursPassed = now.getHours() + now.getMinutes() / 60;
        
        // Симуляция: каждый час уменьшаем шанс на доступный слот
        const baseSlots = 3;
        const slotsTaken = Math.floor(hoursPassed / 8); // Каждые 8 часов "занимается" слот
        const currentSlots = Math.max(1, baseSlots - slotsTaken); // Минимум 1 слот
        
        slotsElements.forEach(el => {
            el.textContent = currentSlots;
        });
        
        if (timerElement) {
            const nextSlotHours = 48 - (hoursPassed % 48);
            timerElement.textContent = Math.floor(nextSlotHours);
        }
    }
    
    // Обновляем при загрузке и каждые 5 минут
    updateSlots();
    setInterval(updateSlots, 5 * 60 * 1000);
}

// ==============================================
// TEST FUNCTION
// ==============================================

window.testTelegramBot = async function() {
    console.log('🧪 Запуск теста Telegram бота...');
    
    const testData = {
        name: 'Тестовый пользователь',
        role: 'Собственник бизнеса',
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
        const botAvailable = await testBotConnection();
        
        if (!botAvailable) {
            alert('❌ Тест не пройден: Бот недоступен. Проверьте консоль.');
            return;
        }
        
        console.log('📤 Отправка тестового сообщения...');
        const success = await sendToTelegram(testData);
        
        if (success) {
            console.log('✅ Тест пройден успешно!');
            showNotification('✅ Тест пройден! Проверьте Telegram бота.', 'success');
        } else {
            console.error('❌ Тест не пройден');
            showNotification('❌ Тест не пройден. Проверьте консоль для ошибок.', 'error');
        }
    } catch (error) {
        console.error('❌ Ошибка при тестировании:', error);
        showNotification('❌ Критическая ошибка при тестировании.', 'error');
    }
};

// ==============================================
// DEBUG UTILITIES
// ==============================================

window.businessDoctorDebug = {
    testForm: function() {
        const form = document.getElementById('contactForm');
        if (form) {
            // Временно показываем форму, если она скрыта
            form.style.display = 'block';
            document.getElementById('successMessage').style.display = 'none';
            
            form.querySelector('#name').value = 'Иван Иванов';
            form.querySelector('#role').value = 'Собственник бизнеса';
            form.querySelector('#email').value = 'ivan@example.com';
            form.querySelector('#phone').value = '+7 (999) 999-99-99';
            form.querySelector('#company').value = 'ООО "Рога и копыта"';
            form.querySelector('#revenue').value = '20-50';
            form.querySelector('#message').value = 'Нужна помощь в оптимизации бизнес-процессов. Хочу увеличить прибыль на 30% за 6 месяцев.';
            
            const consentCheckbox = form.querySelector('#consent');
            if (consentCheckbox) {
                consentCheckbox.checked = true;
            }
            
            // Обновляем состояние кнопки
            const submitBtn = form.querySelector('#submitBtn');
            if (submitBtn && consentCheckbox) {
                updateSubmitButtonState(submitBtn, consentCheckbox);
            }
            
            console.log('✅ Форма заполнена тестовыми данными');
            showNotification('✅ Форма заполнена тестовыми данными', 'success');
        } else {
            console.error('❌ Форма не найдена');
        }
    },
    
    resetForm: function() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.reset();
            form.style.display = 'block';
            
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.style.display = 'none';
            }
            
            // Обновляем состояние кнопки
            const submitBtn = form.querySelector('#submitBtn');
            const consentCheckbox = form.querySelector('#consent');
            if (submitBtn && consentCheckbox) {
                updateSubmitButtonState(submitBtn, consentCheckbox);
            }
            
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
    const ctaButton = e.target.closest('.btn-primary, .floating-cta .btn, [data-cta]');
    
    if (ctaButton) {
        const buttonText = ctaButton.textContent.trim() || ctaButton.querySelector('span')?.textContent.trim();
        console.log('🎯 Клик по CTA:', buttonText);
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
        }
    });
});

// ==============================================
// ERROR HANDLING
// ==============================================

window.addEventListener('error', function(e) {
    console.error('🚨 Глобальная ошибка:', e.message);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 Необработанная ошибка Promise:', e.reason);
});

// ==============================================
// PERFORMANCE MONITORING
// ==============================================

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
// Если у вас есть отдельный main.js, добавьте туда:

// 1. Анимация для иконок математики
function animateMathIcons() {
    const mathIcons = document.querySelectorAll('.fa-calculator, .fa-brain, .fa-project-diagram');
    mathIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// 2. Плавное появление секции УТП при скролле
function initUTPAnimation() {
    const utpSection = document.querySelector('.utp-section');
    if (utpSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(utpSection);
        utpSection.style.opacity = '0';
        utpSection.style.transform = 'translateY(20px)';
        utpSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
}

// 3. Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    animateMathIcons();
    initUTPAnimation();
    
    // Обновляем текст в плавающей кнопке в зависимости от скролла
    const floatingCta = document.querySelector('.floating-cta span');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500 && floatingCta) {
            floatingCta.textContent = 'Рассчитать путь';
        } else if (floatingCta) {
            floatingCta.textContent = 'Рассчитать мой путь';
        }
    });
});

// 4. Консольное сообщение для отладки
console.log('%c🧮 Business Doctor: Математика стратегий активна', 
    'color: #C8A951; font-size: 14px; font-weight: bold;');

console.log('🎯 Business Doctor скрипт загружен и готов к работе!');