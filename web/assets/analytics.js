/* Public page performance only. The token identifies a site; it is not a secret. */
(() => {
  const state = value => { document.documentElement.dataset.ipeAnalytics = value; };
  const privateRoute = /^\/+(?:equipe|dashboard|acessibilidade|api)(?:\/|$)/;
  if (location.hostname !== 'nasa-missaoipe.alexandrebelo.com' || window.self !== window.top || privateRoute.test(location.pathname)) {
    state('inactive');
    return;
  }
  if (document.querySelector('script[data-cf-beacon]')) return;
  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.dataset.cfBeacon = JSON.stringify({ token: 'a31b0ab2eefb433781b0c28ea2ecd9bc', spa: false });
  beacon.addEventListener('load', () => state('script-loaded'));
  beacon.addEventListener('error', () => {
    state('unavailable');
    console.warn('Métricas públicas indisponíveis. O jogo continua funcionando.');
  });
  state('loading');
  document.body.append(beacon);
})();
