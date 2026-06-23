// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
function renderNavbar(cartCount, currentUser) {
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

  var authBlock = currentUser
    ? [
        '<span class="nav-user">Hi, <strong>' + currentUser + '</strong></span>',
        '<button class="nav-auth-btn" onclick="App.signOut()">Sign Out</button>',
      ].join('')
    : '<a href="/login" class="nav-auth-btn" data-link>Sign In</a>';

  var mobileAuthBlock = currentUser
    ? '<a href="#" class="nav-link" onclick="App.signOut();return false;">Sign Out (' + currentUser + ')</a>'
    : '<a href="/login" class="nav-link" data-link>Sign In</a>';

  return [
    '<nav class="navbar">',
    '  <div class="navbar-inner container">',
    '    <a href="/" class="nav-brand" data-link>',
    '      <span class="brand-icon">&#9889;</span>',
    '      GearUp <span class="brand-accent">Velocity</span>',
    '    </a>',
    '    <div class="nav-links">' + navLinks + '</div>',
    '    <div class="nav-auth">' + authBlock + '</div>',
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
    '    ' + mobileAuthBlock,
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
    '    <img src="' + product.image + '" alt="' + product.name + '" loading="lazy" />',
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
    '      <img',
    '        id="hero-img"',
    '        src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=720&q=80"',
    '        alt="Athlete in training"',
    '        onerror="(function(el){var srcs=[\'https://images.unsplash.com/photo-1526506118085-60122a109d83?auto=format&fit=crop&w=720&q=80\',\'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=720&q=80\',\'https://picsum.photos/720/480?random=14\'];var i=parseInt(el.dataset.fb||0);if(i<srcs.length){el.dataset.fb=i+1;el.src=srcs[i];}else{el.onerror=null;}})(this)"',
    '      />',
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
