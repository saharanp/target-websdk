// ---------------------------------------------------------------------------
// Adobe Client Data Layer (ACDL) — event-driven push helpers.
//
// In MPA mode, each page is a real document. Each page's bootstrap pushes:
//   DL.pushUser()  -> DL.pushCart()  ->  DL.pushPage(name, extra)
// On non-product pages it also pushes { product: null } so the product branch
// is explicitly cleared in the merged ACDL state.
//
// The runtime is provided by the ACDL extension in Launch. This file only
// pushes plain objects onto window.adobeDataLayer. ES5-safe.
// ---------------------------------------------------------------------------
(function () {
  window.adobeDataLayer = window.adobeDataLayer || [];

  function readUser() {
    try { return localStorage.getItem('gu_user') || null; } catch (e) { return null; }
  }
  function readPref() {
    try { return localStorage.getItem('gu_pref') || null; } catch (e) { return null; }
  }
  function readCart() {
    try { return JSON.parse(localStorage.getItem('gu_cart')) || []; } catch (e) { return []; }
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

  function pushCart() {
    window.adobeDataLayer.push({ cart: cartSummary() });
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
    pushUser:  pushUser,
    pushCart:  pushCart,
    pushPage:  pushPage,
    pushEvent: pushEvent
  };
})();
