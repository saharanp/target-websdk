// ---------------------------------------------------------------------------
// One-time generator: writes 40 on-brand SVG illustrations to /images/.
// Run with: `node tools/gen-product-images.js`
//
// Design system:
//   - Square 400x400 viewBox, rounded #f5f5f7 background
//   - Navy #0d1b2a primary shapes
//   - Accent rotates across red/teal/amber/slate to differentiate products
//   - 4 base illustrations: shoe / dumbbell / football / [bottle|watch|bag]
// ---------------------------------------------------------------------------
var fs   = require('fs');
var path = require('path');

var OUT = path.resolve(__dirname, '..', 'images');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// On-brand palette — first color (red) is the brand accent; the others
// differentiate without breaking the sports-gear vibe.
var PALETTE = ['#e03c31', '#0fa3b1', '#f4b400', '#475569'];

function accentFor(id) { return PALETTE[(id - 1) % PALETTE.length]; }

function wrap(inner) {
  return '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">' +
    '<rect width="400" height="400" rx="24" fill="#f5f5f7"/>' +
    inner +
    '</svg>';
}

function shoe(a) {
  return [
    '<ellipse cx="200" cy="335" rx="155" ry="7" fill="#0d1b2a" opacity="0.10"/>',
    // sole
    '<path d="M 45 295 Q 45 328 90 328 L 330 328 Q 365 328 360 298 Q 358 282 340 280 L 60 282 Z" fill="#0d1b2a"/>',
    // white midsole stripe
    '<rect x="50" y="296" width="312" height="5" fill="#ffffff" opacity="0.9"/>',
    // upper
    '<path d="M 62 282 Q 68 226 102 198 Q 138 168 188 158 L 252 158 Q 302 168 330 210 L 348 282 Z" fill="#0d1b2a"/>',
    // heel counter line
    '<path d="M 75 226 Q 100 210 158 210" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.55"/>',
    // toebox seam
    '<path d="M 278 168 Q 282 218 300 252" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.55"/>',
    // accent swoosh
    '<path d="M 95 252 Q 200 212 308 232" stroke="' + a + '" stroke-width="14" fill="none" stroke-linecap="round"/>',
    // laces
    '<g stroke="#ffffff" stroke-width="3" stroke-linecap="round">',
      '<line x1="160" y1="208" x2="208" y2="188"/>',
      '<line x1="170" y1="224" x2="220" y2="206"/>',
      '<line x1="180" y1="240" x2="232" y2="222"/>',
      '<line x1="190" y1="256" x2="244" y2="238"/>',
    '</g>',
    // lace tip dot (accent)
    '<circle cx="208" cy="188" r="4" fill="' + a + '"/>',
  ].join('');
}

function dumbbell(a) {
  return [
    '<ellipse cx="200" cy="335" rx="160" ry="7" fill="#0d1b2a" opacity="0.10"/>',
    // bar
    '<rect x="92" y="190" width="216" height="20" rx="3" fill="#0d1b2a"/>',
    // grip wraps (accent)
    '<rect x="115" y="184" width="72" height="32" rx="4" fill="' + a + '"/>',
    '<rect x="213" y="184" width="72" height="32" rx="4" fill="' + a + '"/>',
    // grip ridges
    '<g fill="#ffffff" opacity="0.4">',
      '<rect x="123" y="190" width="2" height="20"/>',
      '<rect x="133" y="190" width="2" height="20"/>',
      '<rect x="143" y="190" width="2" height="20"/>',
      '<rect x="153" y="190" width="2" height="20"/>',
      '<rect x="163" y="190" width="2" height="20"/>',
      '<rect x="173" y="190" width="2" height="20"/>',
      '<rect x="221" y="190" width="2" height="20"/>',
      '<rect x="231" y="190" width="2" height="20"/>',
      '<rect x="241" y="190" width="2" height="20"/>',
      '<rect x="251" y="190" width="2" height="20"/>',
      '<rect x="261" y="190" width="2" height="20"/>',
      '<rect x="271" y="190" width="2" height="20"/>',
    '</g>',
    // left plates
    '<rect x="62" y="135" width="48" height="130" rx="10" fill="#0d1b2a"/>',
    '<circle cx="86" cy="200" r="14" fill="' + a + '"/>',
    '<rect x="40" y="155" width="22" height="90" rx="6" fill="#0d1b2a"/>',
    // right plates
    '<rect x="290" y="135" width="48" height="130" rx="10" fill="#0d1b2a"/>',
    '<circle cx="314" cy="200" r="14" fill="' + a + '"/>',
    '<rect x="338" y="155" width="22" height="90" rx="6" fill="#0d1b2a"/>',
  ].join('');
}

function football(a) {
  return [
    '<ellipse cx="200" cy="335" rx="130" ry="7" fill="#0d1b2a" opacity="0.10"/>',
    // ball body
    '<ellipse cx="200" cy="200" rx="140" ry="80" fill="#0d1b2a"/>',
    // top highlight
    '<path d="M 80 180 Q 200 130 320 180" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.18"/>',
    // accent rings near tips
    '<path d="M 75 200 Q 65 175 65 200 Q 65 225 75 200" stroke="' + a + '" stroke-width="6" fill="none"/>',
    '<path d="M 325 200 Q 335 175 335 200 Q 335 225 325 200" stroke="' + a + '" stroke-width="6" fill="none"/>',
    // laces
    '<line x1="178" y1="200" x2="222" y2="200" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>',
    '<line x1="176" y1="188" x2="176" y2="212" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>',
    '<line x1="188" y1="188" x2="188" y2="212" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>',
    '<line x1="200" y1="188" x2="200" y2="212" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>',
    '<line x1="212" y1="188" x2="212" y2="212" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>',
    '<line x1="224" y1="188" x2="224" y2="212" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>',
  ].join('');
}

function bottle(a) {
  return [
    '<ellipse cx="200" cy="345" rx="80" ry="6" fill="#0d1b2a" opacity="0.10"/>',
    // cap
    '<rect x="168" y="60" width="64" height="28" rx="6" fill="#0d1b2a"/>',
    // cap ridges
    '<line x1="174" y1="66" x2="174" y2="82" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>',
    '<line x1="184" y1="66" x2="184" y2="82" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>',
    '<line x1="216" y1="66" x2="216" y2="82" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>',
    '<line x1="226" y1="66" x2="226" y2="82" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>',
    // neck
    '<rect x="180" y="88" width="40" height="16" fill="#0d1b2a"/>',
    // body
    '<rect x="142" y="104" width="116" height="226" rx="20" fill="#0d1b2a"/>',
    // accent label band
    '<rect x="142" y="178" width="116" height="68" fill="' + a + '"/>',
    // bolt accent on label
    '<path d="M 195 195 L 215 195 L 205 215 L 215 215 L 195 235 L 200 220 L 192 220 Z" fill="#ffffff"/>',
    // highlight stripe
    '<rect x="158" y="116" width="6" height="206" rx="3" fill="#ffffff" opacity="0.18"/>',
  ].join('');
}

function watch(a) {
  return [
    '<ellipse cx="200" cy="350" rx="105" ry="6" fill="#0d1b2a" opacity="0.10"/>',
    // top band
    '<rect x="170" y="36" width="60" height="106" rx="10" fill="#0d1b2a"/>',
    // bottom band
    '<rect x="170" y="258" width="60" height="106" rx="10" fill="#0d1b2a"/>',
    // band texture lines
    '<line x1="178" y1="60" x2="222" y2="60" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>',
    '<line x1="178" y1="80" x2="222" y2="80" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>',
    '<line x1="178" y1="100" x2="222" y2="100" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>',
    '<line x1="178" y1="120" x2="222" y2="120" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>',
    '<line x1="178" y1="280" x2="222" y2="280" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>',
    '<line x1="178" y1="300" x2="222" y2="300" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>',
    '<line x1="178" y1="320" x2="222" y2="320" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>',
    '<line x1="178" y1="340" x2="222" y2="340" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>',
    // face
    '<circle cx="200" cy="200" r="82" fill="#0d1b2a"/>',
    '<circle cx="200" cy="200" r="68" fill="#162a40"/>',
    '<circle cx="200" cy="200" r="74" stroke="' + a + '" stroke-width="4" fill="none"/>',
    // crown
    '<rect x="284" y="190" width="10" height="20" rx="2" fill="#0d1b2a"/>',
    // tick marks
    '<line x1="200" y1="132" x2="200" y2="140" stroke="#ffffff" stroke-width="2"/>',
    '<line x1="268" y1="200" x2="260" y2="200" stroke="#ffffff" stroke-width="2"/>',
    '<line x1="200" y1="268" x2="200" y2="260" stroke="#ffffff" stroke-width="2"/>',
    '<line x1="132" y1="200" x2="140" y2="200" stroke="#ffffff" stroke-width="2"/>',
    // hands
    '<line x1="200" y1="200" x2="200" y2="155" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>',
    '<line x1="200" y1="200" x2="238" y2="200" stroke="' + a + '" stroke-width="3" stroke-linecap="round"/>',
    '<circle cx="200" cy="200" r="5" fill="#ffffff"/>',
  ].join('');
}

function bag(a) {
  return [
    '<ellipse cx="200" cy="340" rx="150" ry="7" fill="#0d1b2a" opacity="0.10"/>',
    // top handles
    '<path d="M 145 145 Q 200 110 255 145" stroke="#0d1b2a" stroke-width="10" fill="none" stroke-linecap="round"/>',
    // body
    '<rect x="70" y="145" width="260" height="185" rx="26" fill="#0d1b2a"/>',
    // accent stripe
    '<rect x="70" y="218" width="260" height="38" fill="' + a + '"/>',
    // zipper line
    '<line x1="92" y1="178" x2="308" y2="178" stroke="#ffffff" stroke-width="2" opacity="0.5"/>',
    // zipper pull
    '<circle cx="308" cy="178" r="4" fill="#ffffff" opacity="0.7"/>',
    // side strap
    '<rect x="288" y="244" width="42" height="9" rx="4" fill="' + a + '"/>',
    // logo badge
    '<circle cx="200" cy="290" r="18" fill="' + a + '"/>',
    '<path d="M 195 280 L 205 280 L 200 290 L 207 290 L 197 304 L 200 294 L 192 294 Z" fill="#ffffff"/>',
  ].join('');
}

// Mapping: which template to use for each product id
function renderById(id, category) {
  var a = accentFor(id);
  if (category === 'Running')  return shoe(a);
  if (category === 'Training') return dumbbell(a);
  if (category === 'Football') return football(a);
  // Accessories (ids 31..40): cycle bottle -> watch -> bag
  var idx = (id - 31) % 3;
  if (idx === 0) return bottle(a);
  if (idx === 1) return watch(a);
  return bag(a);
}

// 40 products: 10 Running, 10 Training, 10 Football, 10 Accessories
var SPEC = [];
for (var i = 1;  i <= 10; i++) SPEC.push({ id: i,  category: 'Running' });
for (var i = 11; i <= 20; i++) SPEC.push({ id: i,  category: 'Training' });
for (var i = 21; i <= 30; i++) SPEC.push({ id: i,  category: 'Football' });
for (var i = 31; i <= 40; i++) SPEC.push({ id: i,  category: 'Accessories' });

SPEC.forEach(function (p) {
  var svg  = wrap(renderById(p.id, p.category));
  var file = path.join(OUT, p.category.toLowerCase() + '-' + p.id + '.svg');
  fs.writeFileSync(file, svg);
});

console.log('Wrote ' + SPEC.length + ' SVGs to ' + OUT);
