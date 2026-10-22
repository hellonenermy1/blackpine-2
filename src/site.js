(() => {
  const storageKey = 'blackpine-theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(storageKey);
  if (saved === 'dark' || saved === 'light') root.dataset.theme = saved;
  else root.dataset.theme = 'auto';

  const init = () => {
    const themeButton = document.querySelector('[data-theme-toggle]');
    const themeOrder = ['auto', 'dark', 'light'];
    const updateThemeLabel = () => {
      if (!themeButton) return;
      const current = root.dataset.theme || 'auto';
      themeButton.textContent = `Theme: ${current[0].toUpperCase()}${current.slice(1)}`;
      themeButton.setAttribute('aria-label', `Colour theme is ${current}. Activate to change theme.`);
    };
    if (themeButton) {
      updateThemeLabel();
      themeButton.addEventListener('click', () => {
        const current = root.dataset.theme || 'auto';
        const next = themeOrder[(themeOrder.indexOf(current) + 1) % themeOrder.length];
        root.dataset.theme = next;
        if (next === 'auto') localStorage.removeItem(storageKey);
        else localStorage.setItem(storageKey, next);
        updateThemeLabel();
      });
    }

    const navToggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        const open = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!open));
        nav.classList.toggle('is-open', !open);
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.focus();
        }
      });
    }

    const reveal = [...document.querySelectorAll('[data-reveal]')];
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      }, { threshold: .12 });
      reveal.forEach(el => observer.observe(el));
    } else reveal.forEach(el => el.classList.add('is-visible'));

    const typeFilter = document.querySelector('[data-filter-type]');
    const topicFilter = document.querySelector('[data-filter-topic]');
    const cards = [...document.querySelectorAll('[data-research-card]')];
    const filter = () => {
      const type = typeFilter?.value || 'all';
      const topic = topicFilter?.value || 'all';
      cards.forEach(card => {
        const visible = (type === 'all' || card.dataset.type === type) && (topic === 'all' || card.dataset.topic === topic);
        card.hidden = !visible;
      });
    };
    typeFilter?.addEventListener('change', filter);
    topicFilter?.addEventListener('change', filter);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
