// ---------------------------------------------------------------------------
// Auth state — persisted to localStorage. Demo only: any password (even blank)
// is accepted as long as the username matches one of the three demo accounts.
// Each user has a category preference used by Adobe Target audience tests.
// ---------------------------------------------------------------------------
var AUTH_KEY = 'gu_user';
var PREF_KEY = 'gu_pref';
var DEMO_USERS = {
  runner:     { preference: 'Running' },
  trainer:    { preference: 'Training' },
  footballer: { preference: 'Football' },
};

function loadUser() {
  try { return localStorage.getItem(AUTH_KEY) || null; } catch (e) { return null; }
}

function loadPref() {
  try { return localStorage.getItem(PREF_KEY) || null; } catch (e) { return null; }
}

function saveUser(username) {
  try {
    if (username) {
      localStorage.setItem(AUTH_KEY, username);
      localStorage.setItem(PREF_KEY, DEMO_USERS[username].preference);
    } else {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(PREF_KEY);
    }
  } catch (e) {}
}

var currentUser = loadUser();
var currentPref = loadPref();

function signIn(username) {
  var clean = (username || '').trim().toLowerCase();
  if (!DEMO_USERS[clean]) {
    return { ok: false, error: 'Unknown user. Try: runner, trainer, or footballer.' };
  }
  currentUser = clean;
  currentPref = DEMO_USERS[clean].preference;
  saveUser(clean);
  return { ok: true };
}

function signOut() {
  var prev = currentUser;
  currentUser = null;
  currentPref = null;
  saveUser(null);
  refreshNavbar();
  showToast('Signed out');
  // User state must update before the page event so the next pageView reflects
  // guest context.
  DL.pushUser();
  DL.pushEvent('userLoggedOut', { username: prev });
  Router.navigate('/');
}

// ---------------------------------------------------------------------------
// Cart state — persisted to localStorage so it survives page reloads
// ---------------------------------------------------------------------------
var CART_KEY = 'gu_cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {}
}

var cart = loadCart();

function getCartCount() {
  return cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
}

function getCartTotal() {
  return cart.reduce(function (sum, item) {
    var product = GU_PRODUCTS.find(function (p) { return p.id === item.productId; });
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

function addToCart(productId) {
  var existing = cart.find(function (i) { return i.productId === productId; });
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ productId: productId, quantity: 1 });
  }
  saveCart();
  refreshNavbar();
  showToast('Item added to cart!');
  DL.pushCart();
  DL.pushEvent('cartAdd', { productId: productId });
}

function removeFromCart(productId) {
  cart = cart.filter(function (i) { return i.productId !== productId; });
  saveCart();
  refreshNavbar();
  if (window.location.pathname === '/cart') renderCartPage('');
  DL.pushCart();
  DL.pushEvent('cartUpdate', { removed: productId });
}

function updateCartQty(productId, delta) {
  var item = cart.find(function (i) { return i.productId === productId; });
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart();
  refreshNavbar();
  if (window.location.pathname === '/cart') renderCartPage('');
  DL.pushCart();
  DL.pushEvent('cartUpdate', { productId: productId, quantity: item.quantity });
}

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------
function refreshNavbar() {
  document.getElementById('navbar-container').innerHTML = renderNavbar(getCartCount(), currentUser);
  setActivePage();
}

function setActivePage() {
  var path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.classList.toggle('active', link.getAttribute('href') === path);
  });
}

function showToast(message) {
  var existing = document.getElementById('gu-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id = 'gu-toast';
  toast.className = 'gu-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(function () { toast.classList.add('show'); });
  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () { toast.remove(); }, 300);
  }, 2500);
}

// ---------------------------------------------------------------------------
// Page: Home
// ---------------------------------------------------------------------------
function renderHomePage() {
  var featured = GU_PRODUCTS.filter(function (p) { return p.featured; });
  var trending  = GU_PRODUCTS.slice(0, 6);
  var newItems  = GU_PRODUCTS.slice(-6);

  var featuredGrid = [
    '<section class="section">',
    '  <div class="container">',
    '    <h2 class="section-heading">Featured Products</h2>',
    '    <div class="product-grid">',
    featured.map(renderProductCard).join(''),
    '    </div>',
    '  </div>',
    '</section>',
  ].join('\n');

  document.getElementById('main-content').innerHTML = [
    renderHeroBanner(
      'Gear Up.<br>Go Faster.<br>Win More.',
      'Premium sports equipment and apparel engineered for every level of athlete.',
      'Shop Now',
      '/shop'
    ),
    renderCategoryGrid(),
    featuredGrid,
    renderRecommendationCarousel('rec-home-trending',  'trending',      trending, 'Trending Right Now'),
    renderRecommendationCarousel('rec-home-new',       'new-arrivals',  newItems, 'New Arrivals'),
  ].join('\n');

  setActivePage();
}

// ---------------------------------------------------------------------------
// Page: Shop / Catalog
// ---------------------------------------------------------------------------
function renderShopPage(search) {
  var params = new URLSearchParams(search);
  var initialCat = params.get('cat') || 'all';
  renderShopView(initialCat);
}

function renderShopView(activeFilter) {
  var categories = ['all', 'Running', 'Training', 'Football', 'Accessories'];

  var filtered = activeFilter === 'all'
    ? GU_PRODUCTS
    : GU_PRODUCTS.filter(function (p) { return p.category === activeFilter; });

  var filterButtons = categories.map(function (cat) {
    var label = cat === 'all' ? 'All Products' : cat;
    var cls   = cat === activeFilter ? 'filter-btn active' : 'filter-btn';
    return '<button class="' + cls + '" onclick="App.filterShop(\'' + cat + '\')">' + label + '</button>';
  }).join('');

  var grid = filtered.length
    ? '<div class="product-grid" id="shop-grid">' + filtered.map(renderProductCard).join('') + '</div>'
    : '<div class="empty-state"><p>No products in this category yet.</p></div>';

  document.getElementById('main-content').innerHTML = [
    '<div class="page-header">',
    '  <div class="container">',
    '    <h1 class="page-title">Shop All Gear</h1>',
    '    <p class="page-subtitle">Explore ' + GU_PRODUCTS.length + ' products across all categories</p>',
    '  </div>',
    '</div>',
    '<section class="section">',
    '  <div class="container">',
    '    <div class="filter-bar">' + filterButtons + '</div>',
    '    ' + grid,
    '  </div>',
    '</section>',
  ].join('\n');

  setActivePage();
}

// ---------------------------------------------------------------------------
// Page: Product Detail
// ---------------------------------------------------------------------------
function renderProductPage(search) {
  var params  = new URLSearchParams(search);
  var id      = parseInt(params.get('id'), 10);
  var product = GU_PRODUCTS.find(function (p) { return p.id === id; });

  if (!product) {
    document.getElementById('main-content').innerHTML = [
      '<div class="container section">',
      '  <div class="empty-state">',
      '    <h2>Product not found</h2>',
      '    <p>We couldn\'t find that product. It may have been removed.</p>',
      '    <a href="/shop" class="btn btn-accent" data-link>Back to Shop</a>',
      '  </div>',
      '</div>',
    ].join('\n');
    setActivePage();
    return;
  }

  var related = GU_PRODUCTS.filter(function (p) { return p.category === product.category && p.id !== product.id; });
  if (related.length < 4) {
    var others = GU_PRODUCTS.filter(function (p) { return p.id !== product.id && related.indexOf(p) === -1; });
    related = related.concat(others.slice(0, 6 - related.length));
  }

  document.getElementById('main-content').innerHTML = [
    '<section class="section">',
    '  <div class="container">',
    '    <div class="product-detail">',
    '      <div class="product-detail-image">',
    '        <img src="' + product.image + '" alt="' + product.name + '" onerror="this.onerror=null;this.src=\'https://placehold.co/600x600/0d1b2a/ffffff?text=GearUp\'" />',
    '      </div>',
    '      <div class="product-detail-info">',
    '        <span class="product-detail-cat">' + product.category + '</span>',
    '        <h1 class="product-detail-name">' + product.name + '</h1>',
    '        <p class="product-detail-price">$' + product.price.toFixed(2) + '</p>',
    '        <p class="product-detail-desc">' + product.description + '</p>',
    '        <div class="product-detail-actions">',
    '          <button class="btn btn-lg btn-accent" onclick="App.addToCart(' + product.id + ')">Add to Cart</button>',
    '          <a href="/shop" class="btn btn-lg btn-outline" data-link>Continue Shopping</a>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>',
    renderRecsPlaceholder('rec-pdp-related', 'related', 'You May Also Like'),
  ].join('\n');

  setActivePage();
}

// ---------------------------------------------------------------------------
// Page: Cart
// ---------------------------------------------------------------------------
function renderCartPage() {
  var content = document.getElementById('main-content');

  if (cart.length === 0) {
    content.innerHTML = [
      '<div class="container section">',
      '  <div class="empty-state">',
      '    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:.25">',
      '      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>',
      '      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
      '    </svg>',
      '    <h2>Your cart is empty</h2>',
      '    <p>You haven\'t added anything yet. Browse the store and find your next edge.</p>',
      '    <a href="/shop" class="btn btn-accent" data-link>Start Shopping</a>',
      '  </div>',
      '</div>',
    ].join('\n');
    setActivePage();
    return;
  }

  var rows = cart.map(function (item) {
    var product = GU_PRODUCTS.find(function (p) { return p.id === item.productId; });
    if (!product) return '';
    return [
      '<tr class="cart-row">',
      '  <td>',
      '    <div class="cart-product-cell">',
      '      <img src="' + product.image + '" alt="' + product.name + '" class="cart-item-img" onerror="this.onerror=null;this.src=\'https://placehold.co/150x150/0d1b2a/ffffff?text=GearUp\'" />',
      '      <div class="cart-item-info">',
      '        <a href="/product?id=' + product.id + '" class="cart-item-name" data-link>' + product.name + '</a>',
      '        <span class="cart-item-cat">' + product.category + '</span>',
      '      </div>',
      '    </div>',
      '  </td>',
      '  <td class="cart-price-cell">$' + product.price.toFixed(2) + '</td>',
      '  <td class="cart-qty-cell">',
      '    <div class="qty-control">',
      '      <button onclick="App.updateCartQty(' + product.id + ', -1)" aria-label="Decrease quantity">&minus;</button>',
      '      <span>' + item.quantity + '</span>',
      '      <button onclick="App.updateCartQty(' + product.id + ', 1)" aria-label="Increase quantity">+</button>',
      '    </div>',
      '  </td>',
      '  <td class="cart-subtotal-cell">$' + (product.price * item.quantity).toFixed(2) + '</td>',
      '  <td class="cart-remove-cell">',
      '    <button class="cart-remove-btn" onclick="App.removeFromCart(' + product.id + ')" aria-label="Remove item">&times;</button>',
      '  </td>',
      '</tr>',
    ].join('\n');
  }).join('');

  var total    = getCartTotal();
  var shipping = total >= 75 ? 0 : 9.99;
  var orderTotal = total + shipping;

  var shippingDisplay = shipping === 0
    ? '<span class="free-ship">Free</span>'
    : '$9.99';

  var freeShipNudge = shipping > 0
    ? '<p class="free-ship-nudge">Add $' + (75 - total).toFixed(2) + ' more for free shipping!</p>'
    : '';


  content.innerHTML = [
    '<div class="page-header">',
    '  <div class="container">',
    '    <h1 class="page-title">Your Cart</h1>',
    '    <p class="page-subtitle">' + getCartCount() + ' item' + (getCartCount() !== 1 ? 's' : '') + '</p>',
    '  </div>',
    '</div>',
    '<section class="section">',
    '  <div class="container">',
    '    <div class="cart-layout">',
    '      <div class="cart-table-wrap">',
    '        <table class="cart-table">',
    '          <thead><tr>',
    '            <th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th>',
    '          </tr></thead>',
    '          <tbody>' + rows + '</tbody>',
    '        </table>',
    '      </div>',
    '      <div class="cart-summary">',
    '        <h3>Order Summary</h3>',
    '        <div class="cart-summary-row"><span>Subtotal</span><span>$' + total.toFixed(2) + '</span></div>',
    '        <div class="cart-summary-row"><span>Shipping</span><span>' + shippingDisplay + '</span></div>',
    '        <div class="cart-summary-row cart-summary-total"><span>Total</span><span>$' + orderTotal.toFixed(2) + '</span></div>',
    '        ' + freeShipNudge,
    '        <button class="btn btn-lg btn-accent" style="width:100%;margin-top:16px" onclick="App.showCheckoutMsg()">',
    '          Proceed to Checkout',
    '        </button>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>',
    renderRecsPlaceholder('rec-cart-bundle', 'frequently-bought-together', 'Frequently Bought Together'),
  ].join('\n');

  setActivePage();
}

// ---------------------------------------------------------------------------
// Page: About
// ---------------------------------------------------------------------------
function renderAboutPage() {
  document.getElementById('main-content').innerHTML = [
    '<div class="page-header">',
    '  <div class="container">',
    '    <h1 class="page-title">Our Story</h1>',
    '  </div>',
    '</div>',
    '<section class="section">',
    '  <div class="container">',
    '    <div class="about-content">',
    '      <div class="about-text">',
    '        <h2>Built for athletes. Designed to win.</h2>',
    '        <p>GearUp Velocity was founded in 2018 by a team of competitive athletes frustrated by gear that looked great but let them down when it counted. We set out to build a brand that bridges professional-grade performance and everyday accessibility.</p>',
    '        <p>Every product in our catalog is tested in the field by real athletes — from weekend 5K runners to high school football programs. We don\'t make gear for the catalog shoot. We make gear for the last mile, the final rep, the fourth quarter.</p>',
    '        <h3>Our Values</h3>',
    '        <ul class="about-values">',
    '          <li><strong>Performance First</strong> &mdash; If it doesn\'t improve your game, it doesn\'t make the cut.</li>',
    '          <li><strong>Built to Last</strong> &mdash; Materials and construction standards used by professional equipment manufacturers.</li>',
    '          <li><strong>Accessible Pricing</strong> &mdash; Elite performance shouldn\'t require a professional salary.</li>',
    '          <li><strong>Community Driven</strong> &mdash; 1% of every sale goes to youth sports programs.</li>',
    '        </ul>',
    '      </div>',
    '      <div class="about-stats">',
    '        <div class="stat-card"><span class="stat-number">50K+</span><span class="stat-label">Athletes Equipped</span></div>',
    '        <div class="stat-card"><span class="stat-number">16</span><span class="stat-label">Product Lines</span></div>',
    '        <div class="stat-card"><span class="stat-number">4.8&#9733;</span><span class="stat-label">Avg Rating</span></div>',
    '        <div class="stat-card"><span class="stat-number">2018</span><span class="stat-label">Founded</span></div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>',
  ].join('\n');

  setActivePage();
}

// ---------------------------------------------------------------------------
// Page: Login
// ---------------------------------------------------------------------------
function renderLoginPage() {
  document.getElementById('main-content').innerHTML = [
    '<div class="page-header">',
    '  <div class="container">',
    '    <h1 class="page-title">Sign In</h1>',
    '    <p class="page-subtitle">Demo login — any password (even blank) works.</p>',
    '  </div>',
    '</div>',
    '<section class="section">',
    '  <div class="container">',
    '    <div class="login-wrap">',
    '      <form class="login-form" onsubmit="return App.handleLogin(event)">',
    '        <label class="login-label">Username',
    '          <input type="text" id="login-username" class="login-input" placeholder="runner, trainer, or footballer" autocomplete="username" />',
    '        </label>',
    '        <label class="login-label">Password',
    '          <input type="password" id="login-password" class="login-input" placeholder="anything (or leave blank)" autocomplete="current-password" />',
    '        </label>',
    '        <p id="login-error" class="login-error" style="display:none"></p>',
    '        <button type="submit" class="btn btn-lg btn-accent" style="width:100%;margin-top:8px">Sign In</button>',
    '      </form>',
    '      <div class="login-hint">',
    '        <h4>Demo accounts</h4>',
    '        <ul>',
    '          <li><button type="button" class="login-chip" onclick="App.fillLogin(\'runner\')">runner</button> &mdash; prefers <strong>Running</strong></li>',
    '          <li><button type="button" class="login-chip" onclick="App.fillLogin(\'trainer\')">trainer</button> &mdash; prefers <strong>Training</strong></li>',
    '          <li><button type="button" class="login-chip" onclick="App.fillLogin(\'footballer\')">footballer</button> &mdash; prefers <strong>Football</strong></li>',
    '        </ul>',
    '        <p class="login-hint-note">Password is not validated &mdash; this is a demo for Adobe Target audience testing.</p>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>',
  ].join('\n');

  setActivePage();
}

// ---------------------------------------------------------------------------
// Global App namespace — called by inline onclick handlers in component HTML
// ---------------------------------------------------------------------------
var App = {
  addToCart:       function (id)            { addToCart(id); },
  removeFromCart:  function (id)            { removeFromCart(id); },
  updateCartQty:   function (id, delta)     { updateCartQty(id, delta); },
  filterShop:      function (category)      { renderShopView(category); },
  showCheckoutMsg: function ()              {
    DL.pushEvent('checkoutIntent', { value: getCartTotal(), itemCount: getCartCount() });
    showToast('Checkout coming soon! This is a demo site.');
  },
  signOut:         function ()              { signOut(); },
  fillLogin: function (username) {
    var u = document.getElementById('login-username');
    if (u) { u.value = username; u.focus(); }
  },
  handleLogin: function (e) {
    if (e && e.preventDefault) e.preventDefault();
    var username = (document.getElementById('login-username') || {}).value || '';
    var result = signIn(username);
    var err = document.getElementById('login-error');
    if (!result.ok) {
      if (err) { err.textContent = result.error; err.style.display = 'block'; }
      return false;
    }
    if (err) err.style.display = 'none';
    refreshNavbar();
    showToast('Welcome, ' + currentUser + '!');
    // User state first; then the userLoggedIn event; then a fresh pageView so
    // personalization re-evaluates with the new preference.
    DL.pushUser();
    DL.pushEvent('userLoggedIn', { username: currentUser, preference: currentPref });
    Router.navigate('/');
    return false;
  },
  toggleMenu: function () {
    var menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('open');
  },
};

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
function init() {
  document.getElementById('navbar-container').innerHTML = renderNavbar(getCartCount(), currentUser);
  document.getElementById('target-promo').innerHTML     = renderPromoStrip();
  document.getElementById('footer-container').innerHTML = renderFooter();

  Router.register('/',        renderHomePage);
  Router.register('/shop',    renderShopPage);
  Router.register('/product', renderProductPage);
  Router.register('/cart',    renderCartPage);
  Router.register('/about',   renderAboutPage);
  Router.register('/login',   renderLoginPage);

  // Seed user + cart context BEFORE Router.init() fires the first pageView so
  // the first personalization request carries login/preference state.
  DL.pushUser();
  DL.pushCart();
  Router.init();
}

document.addEventListener('DOMContentLoaded', init);
