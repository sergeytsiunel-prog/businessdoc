/* Цели Яндекс.Метрики для Business Doctor.
   Считаем то, что важно: клики в мессенджеры, звонки, письма, отправку форм.
   Имена целей (создать в Метрике с теми же названиями):
     whatsapp_click, telegram_click, call_click, email_click, form_submit
   Подключается на всех публичных страницах: <script src="js/goals.js" defer></script> */
(function () {
  var ID = 108463875;
  function goal(name, params) {
    if (typeof window.ym !== 'function') { return; }
    try { window.ym(ID, 'reachGoal', name, params || {}); } catch (e) { /* не мешаем переходу */ }
  }

  document.addEventListener('click', function (e) {
    var el = e.target;
    while (el && el.tagName !== 'A') { el = el.parentElement; }
    if (!el) { return; }
    var href = el.getAttribute('href') || '';
    var label = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    if (href.indexOf('wa.me') > -1 || href.indexOf('api.whatsapp') > -1) {
      goal('whatsapp_click', { label: label });
    } else if (href.indexOf('t.me') > -1) {
      goal('telegram_click', { label: label });
    } else if (href.indexOf('tel:') === 0) {
      goal('call_click', { label: label });
    } else if (href.indexOf('mailto:') === 0) {
      goal('email_click', { label: label });
    }
  }, true);

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.tagName !== 'FORM') { return; }
    goal('form_submit', { form: f.id || f.getAttribute('name') || 'без имени', page: location.pathname });
  }, true);
})();
