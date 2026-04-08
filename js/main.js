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