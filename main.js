/* ══════════════════════════════════════════════
   VFoods Global JavaScript
   ══════════════════════════════════════════════ */

// ── NAV SCROLL + ACTIVE ──
(function(){
  const nav = document.getElementById('g-nav');
  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('nav-mobile');
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  // Mark active link
  document.querySelectorAll('.nav-links a, #nav-mobile a').forEach(a => {
    if(a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  // Scroll tint
  if(nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // Hamburger
  if(burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
})();

// ── NAV SEARCH ──
// พิมพ์คำค้น แล้ว Enter → ไปหน้าสินค้าพร้อมกรองตามชื่อ/แบรนด์
window.navSearch = function(e){
  e.preventDefault();
  const form = e.currentTarget;
  const inp = form.querySelector('input');
  const q = (inp.value || '').trim();
  if(!q){ inp.focus(); return false; }
  const onProducts = (location.pathname.split('/').pop() || '') === 'products.html';
  if(onProducts) { applyProductSearch(q); history.replaceState(null,'','products.html?q='+encodeURIComponent(q)); }
  else location.href = 'products.html?q=' + encodeURIComponent(q);
  return false;
};

// กรองการ์ดสินค้าในหน้า products ตามคำค้น
function applyProductSearch(q){
  const cards = document.querySelectorAll('.prod-card');
  if(!cards.length) return;
  const term = q.toLowerCase();
  let total = 0;
  document.querySelectorAll('.cat-section').forEach(sec => {
    let shown = 0;
    sec.querySelectorAll('.prod-card').forEach(c => {
      const name  = (c.querySelector('.prod-card-name')?.textContent  || '').toLowerCase();
      const brand = (c.querySelector('.prod-card-brand')?.textContent || '').toLowerCase();
      const match = !term || name.includes(term) || brand.includes(term);
      c.style.display = match ? '' : 'none';
      if(match){ shown++; total++; }
    });
    sec.style.display = shown ? '' : 'none';
  });
  // เติมคำค้นในช่อง search ทุกช่อง + แจ้งผล
  document.querySelectorAll('.nav-search input').forEach(i => { i.value = q; });
  const banner = document.getElementById('searchBanner');
  if(banner){
    banner.innerHTML = total
      ? `ผลการค้นหา "<strong>${q}</strong>" — พบ <strong>${total}</strong> รายการ · <a href="products.html">ล้างการค้นหา</a>`
      : `ไม่พบสินค้าที่ตรงกับ "<strong>${q}</strong>" · <a href="products.html">ดูสินค้าทั้งหมด</a>`;
    banner.style.display = 'block';
  }
}

// เปิดหน้า products ด้วย ?q= → กรองอัตโนมัติ
(function(){
  if((location.pathname.split('/').pop() || '') !== 'products.html') return;
  const q = new URLSearchParams(location.search).get('q');
  if(!q) return;
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => applyProductSearch(q));
  else applyProductSearch(q);
})();

// ── SCROLL REVEAL ──
(function(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        e.target.classList.add('visible');
        // stagger children with data-stagger
        e.target.querySelectorAll('[data-stagger]').forEach((child, i) => {
          child.style.transitionDelay = (i * 0.08) + 's';
          child.classList.add('visible');
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
})();

// ── PARALLAX CRUMBS (shared) ──
function initCrumbs(count = 14) {
  const crumbs = [];
  const shapes = ['50% 40%','40% 60%','60% 40%'];
  for(let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const sz = 7 + Math.random() * 9;
    el.style.cssText = `position:fixed;pointer-events:none;z-index:400;width:${sz}px;height:${sz*.82}px;
      border-radius:${shapes[i%3]};opacity:${.35+Math.random()*.45};left:-200px;top:-200px;
      background:linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,200,100,.6));`;
    document.body.appendChild(el);
    crumbs.push({ el, dist: 44 + Math.random()*110, ang: Math.random()*Math.PI*2, speed: .04+Math.random()*.07, cx:-200, cy:-200 });
  }
  let mx = innerWidth/2, my = innerHeight/2;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function loop(){
    crumbs.forEach((c,i) => {
      const a = c.ang + Date.now()*.00045*(i%2?1:-1);
      const tx = mx + Math.cos(a)*c.dist, ty = my + Math.sin(a)*c.dist;
      c.cx += (tx-c.cx)*c.speed; c.cy += (ty-c.cy)*c.speed;
      c.el.style.left = c.cx+'px'; c.el.style.top = c.cy+'px';
    });
    requestAnimationFrame(loop);
  })();
}

// ── HERO LETTER ANIMATION ──
function animateHeroTitle(selector, word) {
  const el = document.querySelector(selector);
  if(!el) return;
  const text = word || el.textContent;
  el.innerHTML = '';
  el.setAttribute('aria-label', text);
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? ' ' : ch;
    span.className = 'hero-letter';
    const angle = i * 57.3 % 360;
    const dist = 100 + Math.random() * 180;
    span.style.setProperty('--tx', Math.cos(angle)*dist + 'px');
    span.style.setProperty('--ty', Math.sin(angle)*dist + 'px');
    span.style.setProperty('--r', ((Math.random()-.5)*30) + 'deg');
    span.style.setProperty('--d', (i * 0.07 + .2) + 's');
    el.appendChild(span);
  });
}

// ── 3D CARD TILT ──
function initTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left)/r.width  - .5;
      const y = (e.clientY - r.top) /r.height - .5;
      card.style.transform = `translateY(-6px) rotateX(${-y*8}deg) rotateY(${x*8}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ── DRAG-ROTATE 3D OBJECTS ──
function makeDraggable(el) {
  let drag=false, sx=0, ry=0;
  const start = e => { drag=true; sx=e.clientX||e.touches?.[0]?.clientX||0; el.style.animation='none'; e.preventDefault?.(); };
  const move  = e => { if(!drag)return; const cx=e.clientX||e.touches?.[0]?.clientX||sx; ry+=(cx-sx)*.65; sx=cx; el.style.transform=`rotateY(${ry}deg) rotateX(10deg)`; };
  const end   = () => { if(!drag)return; drag=false; el.style.animation=''; el.style.transform=''; };
  el.addEventListener('mousedown', start); el.addEventListener('touchstart', start, {passive:false});
  document.addEventListener('mousemove', move); document.addEventListener('touchmove', move, {passive:true});
  document.addEventListener('mouseup',   end);  document.addEventListener('touchend',   end);
}

// ── COUNTER ANIMATION ──
function animateCounter(el, target, duration=2000) {
  const start = performance.now();
  const update = now => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if(t < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(update);
}

// Init counters on intersection
(function(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        const target = parseInt(e.target.dataset.count);
        if(!isNaN(target)) animateCounter(e.target, target);
        io.unobserve(e.target);
      }
    });
  }, {threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
})();
