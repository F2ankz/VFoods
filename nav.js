/* ══════════════════════════════════════════════
   VFoods — Shared Global Navigation
   One source of truth for the menu on EVERY page.
   Include on any page with:
     <link rel="stylesheet" href="[prefix]nav.css">
     <script src="[prefix]nav.js"></script>
   where [prefix] is "" from the site root or "../" from a subfolder.
   The script auto-detects the prefix, so the same tag works anywhere.
   ══════════════════════════════════════════════ */
(function () {
  // Base path: pages inside /scroll-site/ need to climb one level.
  var P = /\/scroll-site\//.test(location.pathname) ? '../' : '';
  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var inScrollSite = /\/scroll-site\//.test(location.pathname);
  // which top-level item is the current page
  var active =
      file === 'products.html'  ? 'products' :
      file === 'brands.html'    ? 'brands'   :
      file === 'news.html'      ? 'news'     :
      file === 'oem-guide.html' ? 'oem'      :
      file === 'contact.html'   ? 'contact'  :
      (inScrollSite && file === 'index.html') ? 'home' : '';

  var A = function (key) { return active === key ? ' vn-active' : ''; };

  var products = [
    ['#sticks', 'ขนมขาไก่'], ['#biscuit', 'บิสกิตและแครกเกอร์'], ['#cream', 'บิสกิตสอดไส้'],
    ['#jam', 'แยมสับปะรด'], ['#wafer-stick', 'เวเฟอร์สติ๊ก'], ['#sandwich', 'คุ้กกี้สอดไส้ครีม'],
    ['#snack', 'ขนมทานเล่น'], ['#wafer', 'เวเฟอร์แผ่น'], ['#fried', 'ตัวทอด']
  ];
  var brands = ['VFOODS','Mix','Dear Teddy','Royal Wafer','Celebrate','Mr. Mee','Bless','Pina','Mr. Teddy','Benjy','Chido'];

  var prodItems = products.map(function (p) {
    return '<a href="' + P + 'products.html' + p[0] + '">' + p[1] + '</a>';
  }).join('');
  var brandItems = brands.map(function (b) {
    return '<a href="' + P + 'brands.html?brand=' + encodeURIComponent(b) + '">' + b + '</a>';
  }).join('');

  // Language switch — two national flags. i18n.js wires up the clicks and
  // marks the active one; data-i18n-skip keeps the labels out of the
  // translation pass.
  var flagTH =
    '<svg class="vf-flag" viewBox="0 0 30 20" aria-hidden="true">' +
      '<rect width="30" height="20" fill="#A51931"/>' +
      '<rect y="3.34" width="30" height="13.32" fill="#F4F5F8"/>' +
      '<rect y="6.67" width="30" height="6.66" fill="#2D2A4A"/>' +
    '</svg>';
  var flagEN =
    '<svg class="vf-flag" viewBox="0 0 30 20" aria-hidden="true">' +
      '<rect width="30" height="20" fill="#012169"/>' +
      '<path d="M0 0 30 20M30 0 0 20" stroke="#fff" stroke-width="4"/>' +
      '<path d="M0 0 30 20M30 0 0 20" stroke="#C8102E" stroke-width="2"/>' +
      '<path d="M15 0V20M0 10H30" stroke="#fff" stroke-width="6.6"/>' +
      '<path d="M15 0V20M0 10H30" stroke="#C8102E" stroke-width="4"/>' +
    '</svg>';
  var langSwitch =
    '<div class="vf-lang" role="group" aria-label="Language / ภาษา" data-i18n-skip>' +
      '<button type="button" class="vf-lang-btn" data-lang="th" title="ภาษาไทย" aria-label="ภาษาไทย">' +
        flagTH + '<span>TH</span></button>' +
      '<button type="button" class="vf-lang-btn" data-lang="en" title="English" aria-label="English">' +
        flagEN + '<span>EN</span></button>' +
    '</div>';

  var nav =
    '<nav class="vn" id="vnav">' +
      '<a class="vn-brand" href="' + P + 'scroll-site/index.html" aria-label="VFOODS หน้าแรก">' +
        '<img class="vn-logo" src="' + P + 'img/vfoods-logo.png" alt="VFOODS วีฟู้ดส์">' +
      '</a>' +
      '<div class="vn-links">' +
        '<a href="' + P + 'scroll-site/index.html"' + (active === 'home' ? ' class="vn-active"' : '') + '>Home</a>' +
        '<a href="' + P + 'news.html"' + (active === 'news' ? ' class="vn-active"' : '') + '>News &amp; Activities</a>' +
        '<div class="vn-item">' +
          '<a href="' + P + 'products.html" class="vn-parent' + A('products') + '">Products <span class="vn-caret">▾</span></a>' +
          '<div class="vn-dd vn-mega">' + prodItems + '</div>' +
        '</div>' +
        '<div class="vn-item">' +
          '<a href="' + P + 'brands.html" class="vn-parent' + A('brands') + '">Our Brands <span class="vn-caret">▾</span></a>' +
          '<div class="vn-dd vn-mega3">' + brandItems + '</div>' +
        '</div>' +
        '<a href="' + P + 'oem-guide.html"' + (active === 'oem' ? ' class="vn-active"' : '') + '>OEM Engagement Guide</a>' +
        '<a href="' + P + 'contact.html"' + (active === 'contact' ? ' class="vn-active"' : '') + '>Contact Us</a>' +
      '</div>' +
      /* ลำดับ: ช่องค้นหาสินค้า มาก่อน แล้วปุ่มเปลี่ยนภาษาอยู่ขวาสุด */
      '<form class="vn-search" role="search">' +
        '<input type="search" placeholder="ค้นหาสินค้า…" aria-label="ค้นหาสินค้า">' +
        '<button type="submit" aria-label="ค้นหา"><svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="8.5" cy="8.5" r="5.5"/><line x1="12.8" y1="12.8" x2="18" y2="18" stroke-linecap="round"/></svg></button>' +
      '</form>' +
      langSwitch +
      '<button class="vn-burger" id="vnBurger" aria-label="เมนู" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '</nav>' +
    '<div class="vn-mobile" id="vnMobile">' +
      '<a href="' + P + 'scroll-site/index.html"' + (active === 'home' ? ' class="vn-active"' : '') + '>Home</a>' +
      '<a href="' + P + 'news.html"' + (active === 'news' ? ' class="vn-active"' : '') + '>News &amp; Activities</a>' +
      '<a href="' + P + 'products.html"' + A('products') + '>Products</a>' +
      '<a href="' + P + 'brands.html"' + A('brands') + '>Our Brands</a>' +
      '<a href="' + P + 'oem-guide.html"' + (active === 'oem' ? ' class="vn-active"' : '') + '>OEM Engagement Guide</a>' +
      '<a href="' + P + 'contact.html"' + (active === 'contact' ? ' class="vn-active"' : '') + '>Contact Us</a>' +
    '</div>';

  function mount() {
    // avoid double-injection
    if (document.getElementById('vnav')) return;
    // remove any legacy per-page nav so there is one source of truth
    ['#g-nav', '#navbar', '.site-header', '#nav-mobile'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) { el.remove(); });
    });
    document.body.insertAdjacentHTML('afterbegin', nav);

    var bar = document.getElementById('vnav');
    var burger = document.getElementById('vnBurger');
    var mobile = document.getElementById('vnMobile');

    window.addEventListener('scroll', function () {
      bar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    if (burger && mobile) {
      burger.addEventListener('click', function () {
        var open = burger.classList.toggle('open');
        mobile.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      mobile.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          burger.classList.remove('open');
          mobile.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // search → products page with ?q=
    var form = bar.querySelector('.vn-search');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input');
        var q = (input.value || '').trim();
        if (!q) { input.focus(); return; }
        location.href = P + 'products.html?q=' + encodeURIComponent(q);
      });
    }
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
