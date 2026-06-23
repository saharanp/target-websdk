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
      // Single pageView per navigation — fired after the new view's DOM is in
      // place. Filter changes on /shop do NOT pass through here (they call
      // renderShopView directly), so they intentionally do not re-fire pageView.
      if (window.DL) {
        DL.pushPage(DL.nameForPath(pathname), DL.extraForPath(pathname, search));
      }
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

    resolve();
  }

  return { register, navigate, init };
})();
