// ========================================
// MAIN.JS - v2.0
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initSimulator();
  initFAQ();
});

// Мобильное меню
function initMobileMenu() {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const body = document.body;

  if (!menuToggle || !menu) return;

  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpening = !menu.classList.contains('active');
    menu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    body.style.overflow = isOpening ? 'hidden' : '';
    this.setAttribute('aria-expanded', isOpening);
  });

  const navLinksInMenu = menu.querySelectorAll('a');
  navLinksInMenu.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      menuToggle.classList.remove('active');
      body.style.overflow = '';
    });
  });

  document.addEventListener('click', function(e) {
    if (menu.classList.contains('active') && !menu.contains(e.target) && !menuToggle.contains(e.target)) {
      menu.classList.remove('active');
      menuToggle.classList.remove('active');
      body.style.overflow = '';
    }
  });
}

// Плавная прокрутка
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (!targetElement) return;
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });
}

// Анимация появления
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-up');
  if (!animatedElements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });
}

// Симулятор
function initSimulator() {
  const sliders = {
    discount: document.getElementById('sliderDiscount'),
    inventory: document.getElementById('sliderInventory'),
    price: document.getElementById('sliderPrice'),
    turnover: document.getElementById('sliderTurnover'),      // НОВОЕ
    logistics: document.getElementById('sliderLogistics')     // НОВОЕ
  };
  
  if (!sliders.discount) return;
  
  const displays = {
    discount: document.getElementById('valDiscount'),
    inventory: document.getElementById('valInventory'),
    price: document.getElementById('valPrice'),
    turnover: document.getElementById('valTurnover'),         // НОВОЕ
    logistics: document.getElementById('valLogistics')        // НОВОЕ
  };
  
  const results = {
    profit: document.getElementById('resultProfit'),
    change: document.getElementById('resultChange'),
    insight: document.getElementById('resultInsight'),
    mobileProfit: document.getElementById('mobileProfit'),
    mobileChange: document.getElementById('mobileChange')
  };
  
  const chart = {
    path: document.getElementById('chartProfit'),
    point: document.getElementById('chartPoint')
  };
  
  const baseProfit = 12.5;
  
  function calculate() {
    const discount = parseInt(sliders.discount.value);
    const inventory = parseInt(sliders.inventory.value);
    const price = parseInt(sliders.price.value);
    const turnover = parseInt(sliders.turnover.value);        // НОВОЕ
    const logistics = parseInt(sliders.logistics.value);      // НОВОЕ
    
    // Обновляем отображение значений
    displays.discount.textContent = `${discount}%`;
    displays.inventory.textContent = `${inventory >= 0 ? '+' : ''}${inventory}%`;
    displays.price.textContent = `${price >= 0 ? '+' : ''}${price}%`;
    displays.turnover.textContent = `${turnover} дней`;       // НОВОЕ
    displays.logistics.textContent = `${logistics}%`;         // НОВОЕ
    
    // Влияние скидок (старая логика)
    let discountImpact = discount <= 20 ? (discount - 15) * 0.05 : (20 - 15) * 0.05 - (discount - 20) * 0.15;
    
    // Влияние запасов (старая логика)
    let inventoryImpact = (inventory >= 10 && inventory <= 30) ? 0 : (inventory > 30 ? -(inventory - 30) * 0.08 : (10 - inventory) * 0.1);
    
    // 🆕 Влияние цены: рост цены = рост маржи, но после +10% спрос падает
    // +1-10% цены = +0.15% прибыли за 1%, далее эффект снижается
    let priceImpact = price <= 10 
      ? price * 0.015 
      : 10 * 0.015 - (price - 10) * 0.03;
    
    // 🆕 Влияние оборачиваемости: +10% оборачиваемости = +5-15% прибыли
    // Норма: 50 дней. Меньше = лучше (меньше денег в запасах)
    const turnoverImpact = (50 - turnover) / 50 * 0.15;  // от -0.12 до +0.12
    
    // 🆕 Влияние логистики: -1% логистики = +10-30% прибыли (асимметрично)
    // Норма: 15%. Меньше = лучше (меньше расходов)
    const logisticsImpact = (15 - logistics) / 15 * 0.25;  // от -0.25 до +0.33
    
    // Суммарное влияние
    const totalImpact = discountImpact + inventoryImpact + priceImpact + turnoverImpact + logisticsImpact;
    const newProfit = baseProfit * (1 + totalImpact);
    const changePercent = totalImpact * 100;
    
    // Ограничиваем прибыль (не меньше 1 млн ₽)
    const finalProfit = Math.max(1, newProfit);
    
    // Обновляем результат
    results.profit.textContent = `${finalProfit.toFixed(1)} млн ₽`;
    results.mobileProfit.textContent = `${finalProfit.toFixed(1)} млн ₽`;
    
    // Обновляем статус и график
    if (changePercent > 5) {
      results.change.textContent = `+${changePercent.toFixed(1)}%`;
      results.change.className = 'result-change text-success';
      results.mobileChange.textContent = `+${changePercent.toFixed(1)}%`;
      results.mobileChange.className = 'metric-value text-success';
      results.insight.textContent = 'Отлично! Оптимизация даёт значительный рост прибыли.';
      updateChart(130 - (changePercent * 2.5), '#10b981');
    } else if (changePercent < -5) {
      results.change.textContent = `${changePercent.toFixed(1)}%`;
      results.change.className = 'result-change text-danger';
      results.mobileChange.textContent = `${changePercent.toFixed(1)}%`;
      results.mobileChange.className = 'metric-value text-danger';
      results.insight.textContent = 'Внимание: есть риск снижения прибыли. Давайте разберем вашу ситуацию детально.';
      updateChart(130 - (changePercent * 2.5), '#ef4444');
    } else {
      results.change.textContent = 'Базовый сценарий';
      results.change.className = 'result-change neutral';
      results.mobileChange.textContent = '0%';
      results.mobileChange.className = 'metric-value neutral';
      results.insight.textContent = 'Текущие параметры соответствуют устойчивой модели роста.';
      updateChart(130, '#2563eb');
    }
  }
  function updateChart(cy, color) {
    const newPath = `M 0 150 Q 200 ${cy - 10} 400 ${cy}`;
    chart.path.setAttribute('d', newPath);
    chart.point.setAttribute('cy', cy);
    chart.point.setAttribute('fill', color);
  }
  
  // Подключаем все слайдеры (включая новые)
  Object.values(sliders).forEach(slider => {
    if (slider) {
      slider.addEventListener('input', calculate);
    }
  });
  
  // Инициализация
  calculate();
}

// FAQ аккордеон
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}
// ========================================
// КАЛЬКУЛЯТОР КОМПРОМИССОВ v3
// Реальная математическая модель
// ========================================

function initSimulator() {
  const sliders = {
    discount: document.getElementById('sliderDiscount'),
    inventory: document.getElementById('sliderInventory'),
    price: document.getElementById('sliderPrice')
  };
  
  if (!sliders.discount) return;
  
  const displays = {
    discount: document.getElementById('valDiscount'),
    inventory: document.getElementById('valInventory'),
    price: document.getElementById('valPrice')
  };
  
  // Элементы виталсигнс
  const vitals = {
    cashflow: {
      fill: document.getElementById('fillCashflow'),
      status: document.getElementById('statusCashflow'),
      prob: document.getElementById('probCashflow'),
      card: document.querySelector('[data-metric="cashflow"]')
    },
    inventory: {
      fill: document.getElementById('fillInventory'),
      status: document.getElementById('statusInventory'),
      prob: document.getElementById('probInventory'),
      card: document.querySelector('[data-metric="inventory"]')
    },
    margin: {
      fill: document.getElementById('fillMargin'),
      status: document.getElementById('statusMargin'),
      prob: document.getElementById('probMargin'),
      card: document.querySelector('[data-metric="margin"]')
    },
    demand: {
      fill: document.getElementById('fillDemand'),
      status: document.getElementById('statusDemand'),
      prob: document.getElementById('probDemand'),
      card: document.querySelector('[data-metric="demand"]')
    },
    suppliers: {
      fill: document.getElementById('fillSuppliers'),
      status: document.getElementById('statusSuppliers'),
      prob: document.getElementById('probSuppliers'),
      card: document.querySelector('[data-metric="suppliers"]')
    }
  };
  
  const tradeoff = {
    upside: document.getElementById('tradeoffUpside'),
    downside: document.getElementById('tradeoffDownside'),
    confidence: document.getElementById('tradeoffConfidence')
  };
  
  const recommendation = document.getElementById('recommendationText');
  
  // ========== РЕАЛЬНАЯ МАТЕМАТИЧЕСКАЯ МОДЕЛЬ ==========
  
  function calculateDemand(discount, price) {
    // Эластичность спроса по цене: -1.2 (реалистично для B2B)
    // Эластичность по скидке: 0.8
    const priceEffect = (price / 100) * -1.2;
    const discountEffect = (discount / 30) * 0.8;
    let demandChange = (priceEffect + discountEffect) * 100;
    demandChange = Math.min(Math.max(demandChange, -15), 45);
    return Math.round(demandChange);
  }
  
  function calculateMargin(discount, price, baseMargin = 32) {
    // Маржинальность падает от скидки, растёт от цены
    let margin = baseMargin - discount * 0.8 + price * 0.6;
    margin = Math.min(Math.max(margin, 15), 55);
    return Math.round(margin);
  }
  
  function calculateCashflow(demand, margin, inventoryLevel) {
    // Кассовый поток зависит от роста спроса, маржи и запасов
    let cashflowScore = 100;
    cashflowScore -= demand * 0.8; // рост спроса требует денег
    cashflowScore += margin * 0.5; // высокая маржа даёт деньги
    cashflowScore -= inventoryLevel * 0.3; // запасы замораживают деньги
    cashflowScore = Math.min(Math.max(cashflowScore, 20), 95);
    return Math.round(cashflowScore);
  }
  
  function calculateInventory(demand, inventorySlider) {
    // Запасы: базовое значение 65% + влияние слайдера - спрос
    let inventory = 65 + inventorySlider * 0.5 - demand * 0.6;
    inventory = Math.min(Math.max(inventory, 15), 90);
    return Math.round(inventory);
  }
  
  function calculateSuppliersRisk(inventory, cashflow) {
    // Риск по поставщикам: низкие запасы + плохой кэшфлоу
    let risk = 100;
    risk -= inventory * 0.8;
    risk -= cashflow * 0.5;
    risk = Math.min(Math.max(risk, 8), 75);
    return Math.round(risk);
  }
  
  function calculateDaysToCashGap(cashflow, demand) {
    // Дни до кассового разрыва
    let days = 45;
    days -= (100 - cashflow) * 0.6;
    days -= demand * 0.4;
    days = Math.min(Math.max(Math.round(days), 5), 45);
    return days;
  }
  
  function calculateConfidence(discount, price, inventory) {
    // Уверенность прогноза (выше при умеренных значениях)
    let confidence = 92;
    confidence -= Math.abs(discount - 12) * 0.5;
    confidence -= Math.abs(price) * 0.3;
    confidence -= Math.abs(inventory) * 0.2;
    confidence = Math.min(Math.max(Math.round(confidence), 72), 96);
    return confidence;
  }
  
  function getStatusAndColor(value, thresholds = { good: 70, warning: 40 }) {
    if (value >= thresholds.good) return { status: '🟢 Норма', color: '#10b981' };
    if (value >= thresholds.warning) return { status: '🟡 Внимание', color: '#f59e0b' };
    return { status: '🔴 Критично', color: '#ef4444' };
  }
  
  function addLoadingState() {
    Object.values(vitals).forEach(v => {
      if (v.card) v.card.classList.add('loading');
    });
  }
  
  function removeLoadingState() {
    Object.values(vitals).forEach(v => {
      if (v.card) v.card.classList.remove('loading');
    });
  }
  
  function calculate() {
    // Считываем значения
    const discount = parseInt(sliders.discount.value);
    const inventorySlider = parseInt(sliders.inventory.value);
    const price = parseInt(sliders.price.value);
    
    // Обновляем отображение
    displays.discount.textContent = `${discount}%`;
    displays.inventory.textContent = `${inventorySlider >= 0 ? '+' : ''}${inventorySlider}%`;
    displays.price.textContent = `${price >= 0 ? '+' : ''}${price}%`;
    
    // Включаем состояние загрузки
    addLoadingState();
    
    // Расчёты
    const demand = calculateDemand(discount, price);
    const margin = calculateMargin(discount, price);
    const inventory = calculateInventory(demand, inventorySlider);
    const cashflow = calculateCashflow(demand, margin, inventory);
    const suppliersRisk = calculateSuppliersRisk(inventory, cashflow);
    const daysToGap = calculateDaysToCashGap(cashflow, demand);
    const confidence = calculateConfidence(discount, price, inventorySlider);
    
    // Получаем статусы
    const cashflowStatus = getStatusAndColor(cashflow, { good: 70, warning: 45 });
    const inventoryStatus = getStatusAndColor(inventory, { good: 60, warning: 35 });
    const marginStatus = margin >= 30 ? { status: `🟢 ${margin}%`, color: '#10b981' } : 
                         (margin >= 22 ? { status: `🟡 ${margin}%`, color: '#f59e0b' } : 
                         { status: `🔴 ${margin}%`, color: '#ef4444' });
    const demandStatus = demand >= 15 ? { status: `🟢 +${demand}%`, color: '#10b981' } :
                         (demand >= 0 ? { status: `🟡 +${demand}%`, color: '#f59e0b' } :
                         { status: `🔴 ${demand}%`, color: '#ef4444' });
    const suppliersStatus = getStatusAndColor(100 - suppliersRisk, { good: 70, warning: 45 });
    
    // Формируем текст компромисса
    const upside = demand >= 0 ? `+${demand}% выручка сейчас` : `${demand}% выручка сейчас`;
    const downside = cashflow < 50 ? `⚠️ Кассовый разрыв через ${daysToGap} дней (вероятность ${suppliersRisk}%)` :
                    (cashflow < 70 ? `⚠️ Риск кассового разрыва через ${daysToGap} дней` :
                    `✅ Кассовый поток стабилен`);
    
    // Рекомендация
    let recommendationText = '';
    if (cashflow < 50) {
      recommendationText = `Снизьте скидку до ${Math.max(5, discount - 5)}% или привлеките финансирование на ${Math.round((100 - cashflow) * 0.5)} млн ₽.`;
    } else if (margin < 25) {
      recommendationText = `Повысьте цену на ${Math.min(15, 10 + (25 - margin))}% или пересмотрите закупочные цены.`;
    } else if (inventory < 35) {
      recommendationText = `Срочно пополните склад. Рекомендуемый объём: +${Math.round((50 - inventory) * 0.8)}% к текущим запасам.`;
    } else if (demand > 30 && cashflow < 70) {
      recommendationText = `Рост спроса требует финансирования. Рассмотрите факторинг или отсрочку по налогам.`;
    } else if (discount > 20 && margin < 28) {
      recommendationText = `Скидка ${discount}% слишком агрессивна. Оптимальный диапазон: 10-15%.`;
    } else {
      recommendationText = `Текущие параметры сбалансированы. Для роста рассмотрите увеличение цены на 3-5%.`;
    }
    
    // Обновляем карточки с задержками (имитация сложных вычислений)
    const updates = [
      { fn: () => updateVital('cashflow', cashflow, cashflowStatus, `${suppliersRisk}% риск`, daysToGap, 'cashflow'), delay: 300 },
      { fn: () => updateVital('inventory', inventory, inventoryStatus, `Истощение: ${Math.round(inventory * 0.4)} дн`, null, 'inventory'), delay: 600 },
      { fn: () => updateVital('margin', margin, marginStatus, `КМД: ${margin}%`, null, 'margin'), delay: 900 },
      { fn: () => updateVital('demand', demand, demandStatus, `Эластичность: -1.2`, null, 'demand'), delay: 1200 },
      { fn: () => updateVital('suppliers', 100 - suppliersRisk, suppliersStatus, `Риск срыва: ${suppliersRisk}%`, null, 'suppliers'), delay: 1500 }
    ];
    
    updates.forEach(update => {
      setTimeout(() => {
        update.fn();
      }, update.delay);
    });
    
    // Обновляем панель компромисса
    setTimeout(() => {
      tradeoff.upside.textContent = upside;
      tradeoff.downside.innerHTML = downside;
      tradeoff.confidence.textContent = `✅ Уверенность прогноза: ${confidence}%`;
      recommendation.textContent = recommendationText;
      removeLoadingState();
    }, 1800);
  }
  
  function updateVital(metric, value, statusObj, probText, daysToGap, type) {
    const vital = vitals[metric];
    if (!vital) return;
    
    if (vital.fill) {
      vital.fill.style.width = `${Math.min(Math.max(value, 5), 98)}%`;
      vital.fill.style.background = statusObj.color;
    }
    if (vital.status) {
      vital.status.textContent = typeof statusObj === 'object' ? statusObj.status : statusObj;
      vital.status.style.color = statusObj.color;
    }
    if (vital.prob) {
      if (type === 'cashflow' && daysToGap) {
        vital.prob.textContent = probText;
      } else {
        vital.prob.textContent = probText;
      }
    }
  }
  
  // Добавляем тултипы
  function addTooltips() {
    const tooltips = {
      cashflow: '💰 Кассовый поток — объём свободных денег. Влияет: маржинальность, скорость оборота, дебиторка.',
      inventory: '📦 Запасы — товары на складе. Слишком много = замороженные деньги. Слишком мало = риск дефицита.',
      margin: '📈 Маржинальность — сколько остаётся после переменных расходов. Ключевой драйвер прибыли.',
      demand: '🛒 Спрос — изменение продаж при изменении цены/скидки. Зависит от эластичности.',
      suppliers: '🚚 Поставщики — риск срыва поставок. Влияет: остатки, кассовый поток, сезонность.'
    };
    
    Object.entries(vitals).forEach(([key, vital]) => {
      if (vital.card) {
        vital.card.addEventListener('click', (e) => {
          e.stopPropagation();
          const existing = document.querySelector('.vital-tooltip');
          if (existing) existing.remove();
          
          const tooltip = document.createElement('div');
          tooltip.className = 'vital-tooltip';
          tooltip.textContent = tooltips[key] || 'Аналитический показатель';
          tooltip.style.left = `${e.clientX + 15}px`;
          tooltip.style.top = `${e.clientY - 10}px`;
          document.body.appendChild(tooltip);
          
          setTimeout(() => tooltip.remove(), 3000);
        });
      }
    });
    
    // Закрытие тултипа при клике вне
    document.addEventListener('click', () => {
      const existing = document.querySelector('.vital-tooltip');
      if (existing) existing.remove();
    });
  }
  
  // Подключаем слайдеры
  Object.values(sliders).forEach(slider => {
    if (slider) {
      slider.addEventListener('input', calculate);
    }
  });
  
  // Инициализация
  calculate();
  addTooltips();
}

// Запускаем после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSimulator);
} else {
  initSimulator();
}