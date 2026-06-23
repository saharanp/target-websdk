// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
function renderNavbar(cartCount) {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
  ].map(function (l) {
    return '<a href="' + l.href + '" class="nav-link" data-link>' + l.label + '</a>';
  }).join('');

  const badge = cartCount > 0
    ? '<span class="cart-badge">' + cartCount + '</span>'
    : '';

  const mobileCartLabel = cartCount > 0 ? 'Cart (' + cartCount + ')' : 'Cart';

  return [
    '<nav class="navbar">',
    '  <div class="navbar-inner container">',
    '    <a href="/" class="nav-brand" data-link>',
    '      <span class="brand-icon">&#9889;</span>',
    '      GearUp <span class="brand-accent">Velocity</span>',
    '    </a>',
    '    <div class="nav-links">' + navLinks + '</div>',
    '    <a href="/cart" class="nav-cart" data-link aria-label="View cart">',
    '      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    '        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>',
    '        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    '      </svg>',
    '      ' + badge,
    '    </a>',
    '    <button class="nav-hamburger" aria-label="Toggle menu" onclick="App.toggleMenu()">',
    '      <span></span><span></span><span></span>',
    '    </button>',
    '  </div>',
    '  <div class="nav-mobile-menu" id="mobile-menu">',
    '    ' + navLinks,
    '    <a href="/cart" class="nav-link" data-link>' + mobileCartLabel + '</a>',
    '  </div>',
    '</nav>',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
function renderFooter() {
  return [
    '<div class="footer-inner container">',
    '  <div class="footer-brand">',
    '    <a href="/" class="nav-brand" data-link>',
    '      <span class="brand-icon">&#9889;</span>',
    '      GearUp <span class="brand-accent">Velocity</span>',
    '    </a>',
    '    <p class="footer-tagline">Built for athletes. Designed to win.</p>',
    '  </div>',
    '  <div class="footer-links">',
    '    <div class="footer-col">',
    '      <h4>Shop</h4>',
    '      <a href="/shop" data-link>All Products</a>',
    '      <a href="/shop?cat=Running" data-link>Running</a>',
    '      <a href="/shop?cat=Training" data-link>Training</a>',
    '      <a href="/shop?cat=Football" data-link>Football</a>',
    '      <a href="/shop?cat=Accessories" data-link>Accessories</a>',
    '    </div>',
    '    <div class="footer-col">',
    '      <h4>Company</h4>',
    '      <a href="/about" data-link>About Us</a>',
    '      <a href="/about" data-link>Careers</a>',
    '      <a href="/about" data-link>Press</a>',
    '    </div>',
    '    <div class="footer-col">',
    '      <h4>Support</h4>',
    '      <a href="/about" data-link>Contact</a>',
    '      <a href="/about" data-link>Returns</a>',
    '      <a href="/about" data-link>Sizing Guide</a>',
    '    </div>',
    '  </div>',
    '</div>',
    '<div class="footer-bottom">',
    '  <div class="container">',
    '    <p>&copy; 2024 GearUp Velocity. Demo site for Adobe Target Web SDK capstone.</p>',
    '  </div>',
    '</div>',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// PromoStrip  — id="target-promo" used for Adobe Target audience personalization
// ---------------------------------------------------------------------------
function renderPromoStrip(message) {
  var msg = message || 'Free shipping on orders over $75 &mdash; Use code <strong>GEARUP25</strong> for 25% off your first order';
  return '<div class="promo-strip"><p>' + msg + '</p></div>';
}

// ---------------------------------------------------------------------------
// ProductCard
// ---------------------------------------------------------------------------
function renderProductCard(product) {
  return [
    '<article class="product-card" data-product-id="' + product.id + '">',
    '  <a href="/product?id=' + product.id + '" class="product-card-img-wrap" data-link>',
    '    <img src="' + product.image + '" alt="' + product.name + '" loading="lazy" onerror="this.onerror=null;this.src=\'https://placehold.co/600x600/0d1b2a/ffffff?text=GearUp\'" />',
    '    <span class="product-card-category">' + product.category + '</span>',
    '  </a>',
    '  <div class="product-card-body">',
    '    <h3 class="product-card-name">',
    '      <a href="/product?id=' + product.id + '" data-link>' + product.name + '</a>',
    '    </h3>',
    '    <div class="product-card-footer">',
    '      <span class="product-price">$' + product.price.toFixed(2) + '</span>',
    '      <button class="btn btn-sm btn-accent" onclick="App.addToCart(' + product.id + ')">Add to Cart</button>',
    '    </div>',
    '  </div>',
    '</article>',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// RecsPlaceholder — empty slot for Adobe Target Recs activities to populate
// ---------------------------------------------------------------------------
function renderRecsPlaceholder(id, criteria, heading) {
  return [
    '<section class="rec-carousel-section">',
    '  <div class="container">',
    '    <h2 class="section-heading">' + heading + '</h2>',
    '    <div class="rec-carousel" id="' + id + '" data-criteria="' + criteria + '" role="list">',
    '      <div class="recs-placeholder-card">',
    '        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">',
    '          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    '        </svg>',
    '        <p>Recommendations powered by Adobe Target</p>',
    '        <span>' + criteria + '</span>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// RecommendationCarousel — stable id + data-criteria for Adobe Target Recs
// ---------------------------------------------------------------------------
function renderRecommendationCarousel(id, criteria, products, heading) {
  var items = products.map(function (p) {
    return '<div class="carousel-item" role="listitem">' + renderProductCard(p) + '</div>';
  }).join('');

  return [
    '<section class="rec-carousel-section">',
    '  <div class="container">',
    '    <h2 class="section-heading">' + heading + '</h2>',
    '    <div class="rec-carousel" id="' + id + '" data-criteria="' + criteria + '" role="list">',
    '      ' + items,
    '    </div>',
    '  </div>',
    '</section>',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// HeroBanner — wrapped in id="target-hero" for A/B testing
// ---------------------------------------------------------------------------
function renderHeroBanner(headline, subline, ctaText, ctaHref) {
  return [
    '<div id="target-hero" class="hero-banner">',
    '  <div class="hero-content container">',
    '    <div class="hero-text">',
    '      <p class="hero-eyebrow">New Season Collection</p>',
    '      <h1 class="hero-headline">' + headline + '</h1>',
    '      <p class="hero-subline">' + subline + '</p>',
    '      <div class="hero-cta-group">',
    '        <a href="' + ctaHref + '" class="btn btn-lg btn-accent" data-link>' + ctaText + '</a>',
    '        <a href="/about" class="btn btn-lg btn-outline-light" data-link>Our Story</a>',
    '      </div>',
    '    </div>',
    '    <div class="hero-image">',
    '      <svg viewBox="0 0 520 420" xmlns="http://www.w3.org/2000/svg" aria-label="Athlete silhouette" style="width:100%;max-height:480px;border-radius:var(--radius-lg);">',
    '        <defs>',
    '          <linearGradient id="hbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0d2137"/><stop offset="100%" stop-color="#1a4a7a"/></linearGradient>',
    '          <linearGradient id="hacc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e03c31"/><stop offset="100%" stop-color="#ff6b5b"/></linearGradient>',
    '          <radialGradient id="hglow" cx="55%" cy="45%"><stop offset="0%" stop-color="#e03c31" stop-opacity="0.18"/><stop offset="100%" stop-color="transparent"/></radialGradient>',
    '        </defs>',
    '        <!-- Background -->',
    '        <rect width="520" height="420" fill="url(#hbg)"/>',
    '        <ellipse cx="290" cy="210" rx="200" ry="200" fill="url(#hglow)"/>',
    '        <!-- Track lines -->',
    '        <ellipse cx="260" cy="370" rx="210" ry="28" fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="2"/>',
    '        <ellipse cx="260" cy="370" rx="170" ry="22" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1.5"/>',
    '        <!-- Runner silhouette -->',
    '        <!-- Head -->',
    '        <circle cx="270" cy="82" r="28" fill="#e8c9a0"/>',
    '        <!-- Hair/cap -->',
    '        <path d="M243 75 Q255 48 297 62 Q300 75 270 80Z" fill="#1a1a2e"/>',
    '        <!-- Body torso -->',
    '        <path d="M248 110 Q230 165 235 220 L305 220 Q310 165 292 110Z" fill="#e03c31"/>',
    '        <!-- Number on jersey -->',
    '        <text x="268" y="175" font-family="Arial" font-weight="900" font-size="26" fill="#ffffff" text-anchor="middle">7</text>',
    '        <!-- Left arm (back, swinging forward) -->',
    '        <path d="M248 120 Q218 155 208 195" stroke="#e8c9a0" stroke-width="16" stroke-linecap="round" fill="none"/>',
    '        <!-- Right arm (swinging back) -->',
    '        <path d="M292 118 Q328 148 340 185" stroke="#e8c9a0" stroke-width="16" stroke-linecap="round" fill="none"/>',
    '        <!-- Left shorts/thigh -->',
    '        <path d="M248 218 Q238 265 232 300" stroke="#1a1a2e" stroke-width="20" stroke-linecap="round" fill="none"/>',
    '        <!-- Right shorts/thigh (forward stride) -->',
    '        <path d="M298 218 Q310 255 305 290" stroke="#1a1a2e" stroke-width="20" stroke-linecap="round" fill="none"/>',
    '        <!-- Left shin (bent back) -->',
    '        <path d="M232 300 Q218 330 222 355" stroke="#e8c9a0" stroke-width="14" stroke-linecap="round" fill="none"/>',
    '        <!-- Right shin (extended forward) -->',
    '        <path d="M305 290 Q315 330 330 355" stroke="#e8c9a0" stroke-width="14" stroke-linecap="round" fill="none"/>',
    '        <!-- Left shoe -->',
    '        <path d="M218 353 Q210 368 230 370 Q248 372 255 362" fill="#e03c31"/>',
    '        <!-- Right shoe -->',
    '        <path d="M328 353 Q348 368 362 362 Q368 352 350 352" fill="#e03c31"/>',
    '        <!-- Motion lines -->',
    '        <line x1="155" y1="160" x2="195" y2="160" stroke="url(#hacc)" stroke-width="3" stroke-linecap="round" opacity="0.7"/>',
    '        <line x1="140" y1="185" x2="190" y2="185" stroke="url(#hacc)" stroke-width="2" stroke-linecap="round" opacity="0.5"/>',
    '        <line x1="150" y1="210" x2="192" y2="210" stroke="url(#hacc)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>',
    '        <!-- Stars / accent dots -->',
    '        <circle cx="420" cy="70" r="3" fill="#e03c31" opacity="0.6"/>',
    '        <circle cx="450" cy="110" r="2" fill="#ffffff" opacity="0.4"/>',
    '        <circle cx="390" cy="50" r="1.5" fill="#ffffff" opacity="0.5"/>',
    '        <circle cx="110" cy="300" r="2" fill="#e03c31" opacity="0.4"/>',
    '        <circle cx="90" cy="260" r="1.5" fill="#ffffff" opacity="0.3"/>',
    '      </svg>',
    '    </div>',
    '  </div>',
    '</div>',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Category grid (home page)
// ---------------------------------------------------------------------------
function renderCategoryGrid() {
  var categories = [
    { name: 'Running',     icon: '&#127939;', color: '#1a237e', href: '/shop?cat=Running' },
    { name: 'Training',    icon: '&#127947;', color: '#1b5e20', href: '/shop?cat=Training' },
    { name: 'Football',    icon: '&#127944;', color: '#b71c1c', href: '/shop?cat=Football' },
    { name: 'Accessories', icon: '&#127890;', color: '#37474f', href: '/shop?cat=Accessories' },
  ];

  var cards = categories.map(function (cat) {
    return [
      '<a href="' + cat.href + '" class="category-card" data-link style="--cat-color:' + cat.color + '">',
      '  <span class="category-icon">' + cat.icon + '</span>',
      '  <span class="category-name">' + cat.name + '</span>',
      '</a>',
    ].join('\n');
  }).join('');

  return [
    '<section class="categories-section">',
    '  <div class="container">',
    '    <h2 class="section-heading">Shop by Category</h2>',
    '    <div class="category-grid">' + cards + '</div>',
    '  </div>',
    '</section>',
  ].join('\n');
}
