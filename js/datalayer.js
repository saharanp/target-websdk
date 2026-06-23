// ---------------------------------------------------------------------------
// Adobe Client Data Layer (ACDL) — event-driven push helpers.
//
// The runtime is provided by the ACDL extension in Launch. This file does NOT
// implement ACDL; it only pushes plain objects onto window.adobeDataLayer.
// ES5-safe: var, function expressions, no template literals.
// ---------------------------------------------------------------------------
(function () {
  window.adobeDataLayer = window.adobeDataLayer || [];

  // Path → canonical page.name (this is the SPA viewName source for Target).
  var ROUTE_NAMES = {
    '/':        'home',
    '/shop':    'shop',
    '/product': 'product',
    '/cart':    'cart',
    '/about':   'about',
    '/login':   'login'
  };

  function readUser() {
    try { return localStorage.getItem('gu_user') || null; } catch (e) { return null; }
  }
  function readPref() {
    try { return localStorage.getItem('gu_pref') || null; } catch (e) { return null; }
  }
  function readCart() {
    try { return JSON.parse(localStorage.getItem('gu_cart')) || []; } catch (e) { return []; }
  }

  function nameForPath(path) {
    return ROUTE_NAMES[path] || 'unknown';
  }

  function extraForPath(path, search) {
    var params = new URLSearchParams(search || '');
    if (path === '/shop') {
      return { page: { category: params.get('cat') || 'All' } };
    }
    if (path === '/product') {
      var id = parseInt(params.get('id'), 10);
      var products = window.GU_PRODUCTS || [];
      var match = null;
      for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) { match = products[i]; break; }
      }
      if (match) {
        return {
          product: { id: match.id, name: match.name, category: match.category, price: match.price },
          page:    { category: match.category }
        };
      }
    }
    return null;
  }

  function cartSummary() {
    var cart = readCart();
    var products = window.GU_PRODUCTS || [];
    var byId = {};
    for (var i = 0; i < products.length; i++) byId[products[i].id] = products[i];
    var count = 0;
    var value = 0;
    for (var j = 0; j < cart.length; j++) {
      count += cart[j].quantity;
      var p = byId[cart[j].productId];
      if (p) value += p.price * cart[j].quantity;
    }
    return { itemCount: count, value: Math.round(value * 100) / 100 };
  }

  function pushUser() {
    var u = readUser();
    window.adobeDataLayer.push({
      user: {
        loginState: u ? 'authenticated' : 'guest',
        username:   u || null,
        preference: u ? readPref() : null
      }
    });
  }

  function pushPage(name, extra) {
    var payload = {
      event: 'pageView',
      page: {
        name: name,
        path: window.location.pathname
      }
    };
    if (extra && extra.page && extra.page.category) {
      payload.page.category = extra.page.category;
    }
    if (extra && extra.product) {
      payload.product = extra.product;
    }
    window.adobeDataLayer.push(payload);
  }

  function pushCart() {
    window.adobeDataLayer.push({ cart: cartSummary() });
  }

  function pushEvent(name, payload) {
    var obj = { event: name };
    if (payload) {
      for (var k in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, k)) obj[k] = payload[k];
      }
    }
    window.adobeDataLayer.push(obj);
  }

  window.DL = {
    pushUser:     pushUser,
    pushPage:     pushPage,
    pushCart:     pushCart,
    pushEvent:    pushEvent,
    nameForPath:  nameForPath,
    extraForPath: extraForPath
  };
})();
