const Router = (() => {
  const routes = {};

  function register(path, handler) {
    routes[path] = handler;
  }

  function navigate(path, replace) {
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    resolve();
  }

  function resolve() {
    const pathname = window.location.pathname;
    const search = window.location.search;
    const handler = routes[pathname];
    if (handler) {
      handler(search);
    } else {
      navigate('/', true);
    }
  }

  function init() {
    window.addEventListener('popstate', function () {
      window.scrollTo({ top: 0, behavior: 'instant' });
      resolve();
    });

    document.addEventListener('click', function (e) {
      const link = e.target.closest('[data-link]');
      if (!link) return;
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) navigate(href);
    });
  }

  return { register, navigate, init };
})();
