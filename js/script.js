document.addEventListener('DOMContentLoaded', () => {
  /* =========================
     1. СЕЛЕКТОРЫ
  ========================== */

  const selectors = {
    body: document.body,

    menuToggle: document.querySelector('[data-menu-toggle]'),
    menu: document.querySelector('[data-menu]'),

    sections: document.querySelectorAll('[data-section]'),
    navLinks: document.querySelectorAll('[data-nav-link]'),
  };

  /* =========================
     2. STATE
  ========================== */

  const state = {
    isMenuOpen: false,
    activeSection: null,
  };

  /* =========================
     3. INIT
  ========================== */

  init();

  function init() {
    bindEvents();
    detectInitialSection();
    render();
  }

  /* =========================
     4. EVENTS
  ========================== */

  function bindEvents() {
    if (selectors.menuToggle) {
      selectors.menuToggle.addEventListener('click', toggleMenu);
    }

    selectors.navLinks.forEach(link => {
      link.addEventListener('click', e => {
        const sectionId = link.getAttribute('data-nav-link');
        if (!sectionId) return;

        setActiveSection(sectionId);
        closeMenu();
      });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* =========================
     5. LOGIC
  ========================== */

  function toggleMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    renderMenu();
  }

  function openMenu() {
    state.isMenuOpen = true;
    renderMenu();
  }

  function closeMenu() {
    state.isMenuOpen = false;
    renderMenu();
  }

  function setActiveSection(id) {
    if (state.activeSection === id) return;
    state.activeSection = id;
    renderActiveSection();
  }

  function detectInitialSection() {
    if (!selectors.sections.length) return;
    state.activeSection = selectors.sections[0].getAttribute('data-section');
  }

  function onScroll() {
    const scrollY = window.scrollY;

    selectors.sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('data-section');

      if (scrollY >= top && scrollY < bottom) {
        setActiveSection(id);
      }
    });
  }

  /* =========================
     6. RENDER
  ========================== */

  function render() {
    renderMenu();
    renderActiveSection();
  }

  function renderMenu() {
    if (!selectors.menu) return;

    selectors.menu.classList.toggle('is-open', state.isMenuOpen);
    selectors.body.classList.toggle('menu-open', state.isMenuOpen);
  }

  function renderActiveSection() {
    selectors.navLinks.forEach(link => {
      const id = link.getAttribute('data-nav-link');
      link.classList.toggle('is-active', id === state.activeSection);
    });

    selectors.sections.forEach(section => {
      const id = section.getAttribute('data-section');
      section.classList.toggle('is-active', id === state.activeSection);
    });
  }
});
