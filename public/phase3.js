(() => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const slowConnection = connection && /(^|-)2g$|slow-2g/i.test(connection.effectiveType || '');
  if (connection?.saveData || slowConnection) return;

  const englishPaths = [
    '/contact/',
    '/services/emergency-response/',
    '/services/investigate/',
    '/services/recover/',
    '/services/protect/',
    '/services/monitor/',
    '/services/security-desk/'
  ];
  const allowedPaths = new Set([
    ...englishPaths,
    ...englishPaths.map(path => `/fr${path}`),
    ...englishPaths.map(path => `/es${path}`)
  ]);
  const prefetched = new Set();
  const maxPrefetches = 2;

  const candidate = target => {
    const anchor = target?.closest?.('a[href]');
    if (!anchor || anchor.hasAttribute('download') || anchor.target === '_blank') return null;
    let url;
    try { url = new URL(anchor.href, window.location.href); } catch { return null; }
    if (url.origin !== window.location.origin) return null;
    if (!allowedPaths.has(url.pathname)) return null;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return null;
    return `${url.pathname}${url.search}`;
  };

  const prefetch = target => {
    if (prefetched.size >= maxPrefetches) return;
    const href = candidate(target);
    if (!href || prefetched.has(href)) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.append(link);
    prefetched.add(href);
  };

  document.addEventListener('pointerover', event => prefetch(event.target), { passive: true });
  document.addEventListener('focusin', event => prefetch(event.target));
})();
