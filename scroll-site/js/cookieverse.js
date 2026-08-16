/* ═══════════════════════════════════════════════════════════
   VFOODS — Lenis Smooth Scroll + 3D Model Horizontal Walk
   ═══════════════════════════════════════════════════════════ */
(function () {
  /* Phones and iPads get the plain build: native scrolling, no WebGL
     mascot, no horizontal scrub. mobile-view.js sets the flag in <head>. */
  const lite = !!window.VF_LITE;
  const reduce = lite || matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. LENIS SMOOTH SCROLL INIT */
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !reduce) {
    lenis = new Lenis({
      // ปิด smooth ของล้อเมาส์ → scroll แบบ native ทันที ไวเป๊ะเท่าลากแถบ scrollbar เอง
      smoothWheel: false,
      lerp: 0.35,             // ใช้กับจอสัมผัส/scrollTo เท่านั้น (ไม่มีผลกับล้อแล้ว)
      easing: (t) => 1 - Math.pow(1 - t, 3),
      syncTouch: true,        // มือถือ/แทร็คแพดยังลื่น
      touchMultiplier: 1.8
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* 2. ABOUT VIDEOS LAZY PLAY */
  const vids = document.querySelectorAll(".about-media video");
  if (vids.length) {
    vids.forEach((v) => { v.muted = true; v.playsInline = true; });
    if (!reduce) {
      const vio = new IntersectionObserver((ents) => {
        ents.forEach((e) => {
          const v = e.target;
          if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
          else v.pause();
        });
      }, { threshold: 0.2 });
      vids.forEach((v) => vio.observe(v));
    }
  }

  /* 3. 3D WALKING MASCOT — lives in the shared mascot3d.js so the home
        page and the OEM guide run the identical model */
  const mascot3d = (window.VFMascot3D && !reduce) ? window.VFMascot3D.init({
    canvas:   document.getElementById('cookie-3d-canvas'),
    fallback: document.getElementById('svgMascotFallback'),
    section:  document.getElementById('steps') || document.getElementById('journeyScroll')
  }) : null;
  /* 4. OEM JOURNEY · HORIZONTAL SCROLL-SCRUB & MASCOT ADVANCE (OPTIMIZED) */
  const scroll = document.getElementById('journeyScroll');
  const track = document.getElementById('journeyTrack');
  const mascot = document.getElementById('cookieChar');
  if (!scroll || !track) return;

  const stages = [...track.querySelectorAll('.jp')];
  const dots = [...document.querySelectorAll('#journeyDots .jdot')];
  const prog = document.getElementById('groundProgress');
  const hint = document.getElementById('scrollHint');
  const lineSpan = 90; // ground line 5vw..95vw
  // lite view stacks the steps vertically at any width, same as narrow phones
  const mobile = () => lite || window.matchMedia('(max-width:760px)').matches;
  let ticking = false;

  // Cache scroll metrics
  let totalScrollHeight = 0;
  let totalTrackShift = 0;

  function updateMetrics() {
    totalScrollHeight = scroll.offsetHeight - window.innerHeight;
    totalTrackShift = Math.max(0, track.scrollWidth - window.innerWidth);
  }
  updateMetrics();

  function apply() {
    ticking = false;
    if (mobile()) {
      track.style.transform = '';
      stages.forEach(s => s.classList.add('in'));
      return;
    }

    if (totalScrollHeight <= 0) return;
    let p = (-scroll.getBoundingClientRect().top) / totalScrollHeight;
    p = Math.max(0, Math.min(1, p));

    // เลื่อนเนื้อหาไปทางซ้าย (ทำให้ visual เดินทางขวา)
    track.style.transform = 'translateX(-' + (p * totalTrackShift) + 'px)';

    // ให้ตัวละครขยับตำแหน่งไปทางขวาตาม ground line (5vw -> 95vw)
    if (mascot) {
      const leftPos = 5 + (p * (lineSpan - 10));
      mascot.style.left = leftPos + 'vw';
    }

    // แถบความคืบหน้า ground progress
    if (prog) prog.style.width = (p * lineSpan) + 'vw';
    if (hint) hint.style.opacity = p > 0.02 ? '0' : '1';

    // Active dots & Cards reveal
    const mid = window.innerWidth / 2;
    let best = 0, bestD = 1e9;
    stages.forEach((s, i) => {
      const r = s.getBoundingClientRect(), cx = r.left + r.width / 2;
      if (cx < window.innerWidth * 1.08 && cx > -r.width * 0.08) s.classList.add('in');
      const d = Math.abs(cx - mid);
      if (d < bestD) { bestD = d; best = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('on', i === best));
  }

  function handleScroll() {
    if (mascot3d) mascot3d.notifyScroll();

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(apply);
    }
  }

  if (lenis) {
    lenis.on('scroll', handleScroll);
  } else {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  window.addEventListener('resize', () => {
    updateMetrics();
    apply();
  });
  apply();
})();

