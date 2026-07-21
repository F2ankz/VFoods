/* ═══════════════════════════════════════════════════════════
   COOKIEVERSE — Engine layer (Phase 1)
   Smooth scroll (Lenis) · Cookie cursor + magnetic · Floating
   ingredients · GSAP/ScrollTrigger parallax · char-split hero
   Loads AFTER app.js — non-destructive enhancement.
   ═══════════════════════════════════════════════════════════ */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch  = matchMedia("(hover: none)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";

  /* ── 1. LENIS smooth scroll ──────────────────────────────── */
  let lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduce) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1, lerp: 0.1 });
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    window.__lenis = lenis;
  }

  /* ── 2. FLOATING INGREDIENTS ─────────────────────────────── */
  if (!touch && !reduce) {
    const layer = document.createElement("div");
    layer.id = "cv-float";
    const bits = ["🍪", "🍫", "🥛", "🌰", "🍩", "✨"];
    const N = 16;
    let html = "";
    for (let i = 0; i < N; i++) {
      const left  = Math.round((i / N) * 100 + (i % 3) * 4);
      const size  = 16 + (i % 5) * 8;
      const dur   = 18 + (i % 6) * 4;
      const delay = -(i * 1.7).toFixed(1);
      const drift = (i % 2 ? 1 : -1) * (14 + (i % 4) * 10);
      const g     = bits[i % bits.length];
      html += `<span class="cv-chip" style="left:${left}%;--s:${size}px;--dur:${dur}s;--delay:${delay}s;--drift:${drift}px">${g}</span>`;
    }
    layer.innerHTML = html;
    document.body.appendChild(layer);
  }

  /* ── 3. COOKIE CURSOR + MAGNETIC ─────────────────────────── */
  if (!touch) {
    const ring = document.createElement("div"); ring.id = "cv-cursor-ring";
    const cur  = document.createElement("div"); cur.id = "cv-cursor";
    cur.innerHTML =
      '<svg class="cv-arrow" width="34" height="36" viewBox="0 0 34 36">' +
        '<defs>' +
          '<radialGradient id="cvChocA" cx="32%" cy="24%" r="92%">' +
            '<stop offset="0" stop-color="#F0BA80"/><stop offset=".34" stop-color="#BE7A40"/><stop offset=".70" stop-color="#7A421F"/><stop offset="1" stop-color="#43200E"/>' +
          '</radialGradient>' +
          '<radialGradient id="cvSpecA" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0" stop-color="#FFF1DE" stop-opacity=".92"/><stop offset="1" stop-color="#FFF1DE" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="M3 2 L3 25 L9.5 19.5 L13.6 29 L17.4 27.3 L13.4 18.2 L21 17.6 Z" fill="url(#cvChocA)" stroke="#2A1204" stroke-width="1.4" stroke-linejoin="round"/>' +
        '<path d="M4.5 4.4 L4.5 21" stroke="#F6D9AE" stroke-width="1.1" stroke-linecap="round" opacity=".5"/>' +
        '<ellipse cx="6.8" cy="8.6" rx="3.2" ry="4.8" fill="url(#cvSpecA)"/>' +
      '</svg>' +
      '<svg class="cv-hand" width="34" height="36" viewBox="0 0 34 36">' +
        '<defs>' +
          '<radialGradient id="cvChocH" cx="34%" cy="22%" r="92%">' +
            '<stop offset="0" stop-color="#F0BA80"/><stop offset=".34" stop-color="#BE7A40"/><stop offset=".70" stop-color="#7A421F"/><stop offset="1" stop-color="#43200E"/>' +
          '</radialGradient>' +
          '<radialGradient id="cvSpecH" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0" stop-color="#FFF1DE" stop-opacity=".9"/><stop offset="1" stop-color="#FFF1DE" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="M9 4 C9 2.4 13 2.4 13 4 L13 15.4 C13.9 15 15 15.2 15.4 16.2 C16.1 15.6 17.5 15.8 17.9 16.7 C18.6 16.2 19.9 16.5 20.3 17.4 C21.5 17.6 22.2 18.6 22.2 20 L22.2 24.2 C22.2 27.7 20 29.8 16.6 29.8 L13 29.8 C10.8 29.8 9.4 29 8.1 27.1 L5.2 22.9 C4.3 21.6 5.7 20.1 7.1 20.8 L8.6 21.7 L8.6 4.3 Z" fill="url(#cvChocH)" stroke="#2A1204" stroke-width="1.3" stroke-linejoin="round"/>' +
        '<path d="M10.2 6 L10.2 14" stroke="#F6D9AE" stroke-width="1" stroke-linecap="round" opacity=".5"/>' +
        '<ellipse cx="11" cy="8" rx="1.6" ry="3.4" fill="url(#cvSpecH)"/>' +
      '</svg>';
    document.body.append(ring, cur);

    let mx = innerWidth / 2, my = innerHeight / 2;   // target
    let rx = mx, ry = my;                            // ring (lag)
    let cx = mx, cy = my;                            // cursor
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      cur.style.opacity = "1";
    }, { passive: true });
    addEventListener("mousedown", () => cur.classList.add("click"));
    addEventListener("mouseup",   () => cur.classList.remove("click"));
    document.addEventListener("mouseleave", () => { cur.style.opacity = "0"; ring.style.opacity = "0"; });

    (function loop() {
      cx += (mx - cx) * 0.35; cy += (my - cy) * 0.35;
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      cur.style.left = cx + "px"; cur.style.top = cy + "px";
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    })();

    // hot state + magnetic pull on interactive elements
    /* .gate excluded — Flavor Tunnel drives its transform per-frame */
    const magnetic = document.querySelectorAll("a:not(.gate), button, .prod, .oem-box, .cert-badge, .qb-btn, .news-card, .about-card");
    magnetic.forEach((el) => {
      el.addEventListener("mouseenter", () => { cur.classList.add("hot"); ring.style.opacity = "1"; });
      el.addEventListener("mouseleave", () => { cur.classList.remove("hot"); ring.style.opacity = "0"; el.style.transform = ""; });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.top + r.height / 2);
        const pull = el.classList.contains("qb-btn") || el.tagName === "BUTTON" ? 0.28 : 0.14;
        el.style.transform = `translate(${relX * pull}px, ${relY * pull}px)`;
      });
    });
  }

  /* ── 4. CHAR-SPLIT HERO HEADING (letters settle in) ──────── */
  const heading = document.querySelector(".hero-heading");
  if (heading && !reduce) {
    const wrap = (node) => {
      const frag = document.createDocumentFragment();
      node.textContent.split("").forEach((ch) => {
        const s = document.createElement("span");
        s.className = "cv-ch";
        s.textContent = ch === " " ? " " : ch;
        frag.appendChild(s);
      });
      node.replaceChildren(frag);
    };
    // wrap top-level text nodes + the .accent span, preserving color
    heading.childNodes.forEach((n) => {
      if (n.nodeType === 3) { const w = document.createElement("span"); w.textContent = n.textContent; n.replaceWith(w); wrap(w); }
      else if (n.classList && n.classList.contains("accent")) wrap(n);
    });
    const chars = heading.querySelectorAll(".cv-ch");
    if (hasGSAP) {
      gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -80 });
      gsap.to(chars, {
        yPercent: 0, opacity: 1, rotateX: 0, ease: "back.out(1.7)",
        duration: 0.9, stagger: 0.035, delay: 0.35
      });
    }
  }

  /* ── 5. GSAP PARALLAX / CINEMATIC SCROLL ─────────────────── */
  if (hasGSAP && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);

    // hero copy drifts up + fades as you leave (camera-move feel)
    const copy = document.querySelector(".hero-copy");
    if (copy) gsap.to(copy, {
      yPercent: -38, opacity: 0, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    // about videos gentle parallax
    gsap.utils.toArray(".about-media").forEach((el) => {
      gsap.fromTo(el, { y: 46 }, {
        y: -46, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    // section headings scrub-fade in (adds to existing IO reveal, no conflict)
    // NOTE: .certs-head is excluded — it's the last section before the footer, so
    // the page can't scroll far enough to complete a "top 55%" scrub and the heading
    // would freeze at ~0.2 opacity (invisible). Its .rv IntersectionObserver reveal
    // in app.js handles it reliably instead.
    gsap.utils.toArray(".sec-head, .about-head").forEach((el) => {
      gsap.from(el, {
        yPercent: 14, opacity: 0.2, ease: "none",
        scrollTrigger: { trigger: el, start: "top 92%", end: "top 55%", scrub: true }
      });
    });

    // product tiles rise in a staggered wave
    ScrollTrigger.batch(".prod", {
      start: "top 88%",
      onEnter: (els) => gsap.from(els, { y: 40, opacity: 0, stagger: 0.06, duration: 0.7, ease: "power3.out", overwrite: true })
    });
  }
})();

/* ═══════════════════════════════════════════════════════════
   PHASE 2 — HERO CINEMATIC
   particles (crumbs · sparkles · volumetric orbs) · floating
   product objects · mouse-depth parallax · camera zoom ·
   chocolate drip melt
   ═══════════════════════════════════════════════════════════ */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch  = matchMedia("(hover: none)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const hero = document.getElementById("hero");
  if (!hero || reduce) return;

  /* ── 1. CHOCOLATE DRIP (melting top edge) ────────────────── */
  (function drip() {
    const W = 1440, TOP = 26;
    // deterministic pseudo-random so the melt looks organic but stable
    const rnd = (i) => (Math.sin(i * 127.1) * 43758.5453) % 1 * 0.5 + 0.5;
    let d = `M0,0 H${W} V${TOP}`;
    const STEP = 96;
    for (let x = W - STEP / 2; x > 0; x -= STEP) {
      const depth = 22 + rnd(x) * 58;               // drip length 22–80
      const w = STEP * (0.36 + rnd(x + 7) * 0.2);   // drip width
      d += ` L${x + w / 2},${TOP}`
         + ` C${x + w / 2},${TOP + depth * 0.55} ${x + w * 0.18},${TOP + depth} ${x},${TOP + depth}`
         + ` C${x - w * 0.18},${TOP + depth} ${x - w / 2},${TOP + depth * 0.55} ${x - w / 2},${TOP}`;
    }
    d += ` L0,${TOP} Z`;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "cv-drip");
    svg.setAttribute("viewBox", `0 0 ${W} 120`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.innerHTML =
      `<defs><linearGradient id="cvDripG" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="#31190C"/><stop offset=".6" stop-color="#20100A"/><stop offset="1" stop-color="#150A05"/>
       </linearGradient></defs>
       <path d="${d}" fill="url(#cvDripG)"/>`;
    hero.appendChild(svg);
    if (hasGSAP) gsap.from(svg, { scaleY: 0, duration: 1.6, ease: "elastic.out(1, .55)", delay: .5 });
  })();

  /* ── 2. FLOATING PRODUCT OBJECTS ─────────────────────────── */
  const OBJS = [
    { src: "img/hero/cookie-1.png", style: "left:5%;  top:16%;    width:140px", depth: 1.4, bob: "7s",  rot: "-10deg", sway: "6deg"  },
    { src: "img/hero/cookie-2.png", style: "right:5%; top:20%;    width:132px", depth: 2.0, bob: "6s",  rot: "9deg",   sway: "-5deg" },
    { src: "img/hero/cookie-3.png", style: "left:10%; bottom:12%; width:118px", depth: 2.6, bob: "8s",  rot: "7deg",   sway: "5deg"  },
    { src: "img/hero/cookie-4.png", style: "right:10%;bottom:16%; width:150px", depth: 1.1, bob: "9s",  rot: "-6deg",  sway: "4deg"  },
    { src: "img/hero/cookie-5.png", style: "right:26%;top:11%;    width:98px",  depth: 3.0, bob: "5s",  rot: "0deg",   sway: "10deg" },
  ];
  const objEls = [];
  if (!touch) OBJS.forEach((o, i) => {
    const div = document.createElement("div");
    div.className = "cv-obj";
    div.style.cssText = o.style;
    div.innerHTML = `<img src="${o.src}" alt="" style="--bob:${o.bob};--rot:${o.rot};--sway:${o.sway}">`;
    hero.appendChild(div);
    objEls.push({ el: div, depth: o.depth });
    if (hasGSAP) gsap.from(div, { scale: 0, duration: 1.1, ease: "back.out(2.2)", delay: .8 + i * .12 });
  });

  /* ── 3. MOUSE-DEPTH PARALLAX + CAMERA ZOOM ───────────────── */
  if (hasGSAP && window.ScrollTrigger) {
    // camera push-in: clip zooms while scrolling out of the hero
    gsap.to("#canvas", {
      scale: 1.14, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
    });
    // objects fly apart at different speeds → depth
    objEls.forEach(({ el, depth }) => {
      gsap.to(el, {
        yPercent: -34 * depth, ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
      });
    });
    // mouse parallax (objects + heading/tagline at shallow depth)
    if (!touch) {
      const layers = objEls.map(({ el, depth }) => ({ el, depth }))
        .concat([
          { el: document.querySelector(".hero-heading"), depth: 0.5 },
          { el: document.querySelector(".hero-tagline"), depth: 0.8 },
        ].filter(l => l.el));
      const toX = layers.map(l => gsap.quickTo(l.el, "x", { duration: .9, ease: "power2.out" }));
      const toY = layers.map(l => gsap.quickTo(l.el, "y", { duration: .9, ease: "power2.out" }));
      hero.addEventListener("mousemove", (e) => {
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width  * 2 - 1;
        const ny = (e.clientY - r.top)  / r.height * 2 - 1;
        layers.forEach((l, i) => { toX[i](nx * 9 * l.depth); toY[i](ny * 7 * l.depth); });
      });
    }
  }

  /* ── 4. PARTICLES: crumbs · sparkles · volumetric orbs ───── */
  const pc = document.createElement("canvas");
  pc.id = "cv-particles";
  hero.appendChild(pc);
  const ctx = pc.getContext("2d");
  const DPR = Math.min(devicePixelRatio || 1, 1.5);

  function sprite(size, draw) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    draw(c.getContext("2d"), size);
    return c;
  }
  const crumbSprites = ["#8B5A2B", "#6E4320", "#5C3317"].map(col =>
    sprite(16, (g, s) => {
      g.fillStyle = col;
      [[5,6,4],[10,8,3.4],[8,11,2.6]].forEach(([x,y,r]) => { g.beginPath(); g.arc(x,y,r,0,7); g.fill(); });
    }));
  const sparkleSprite = sprite(32, (g, s) => {
    const m = s/2, grd = g.createRadialGradient(m,m,0,m,m,m);
    grd.addColorStop(0,"rgba(255,236,180,1)"); grd.addColorStop(.35,"rgba(245,185,66,.85)"); grd.addColorStop(1,"rgba(245,185,66,0)");
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(m,1); g.quadraticCurveTo(m+3,m-3,s-1,m); g.quadraticCurveTo(m+3,m+3,m,s-1); g.quadraticCurveTo(m-3,m+3,1,m); g.quadraticCurveTo(m-3,m-3,m,1);
    g.fill();
  });
  const orbSprite = sprite(160, (g, s) => {
    const m = s/2, grd = g.createRadialGradient(m,m,0,m,m,m);
    grd.addColorStop(0,"rgba(255,224,140,.55)"); grd.addColorStop(1,"rgba(255,224,140,0)");
    g.fillStyle = grd; g.fillRect(0,0,s,s);
  });

  let W = 0, H = 0, parts = [];
  const R = Math.random;
  function build() {
    parts = [];
    for (let i = 0; i < 26; i++) parts.push({ t:"crumb", x:R()*W, y:R()*H, vy:14+R()*34, vx:(R()-.5)*10, s:5+R()*8, a:R()*6.28, va:(R()-.5)*1.6, sp:crumbSprites[i%3], o:.35+R()*.4 });
    for (let i = 0; i < 22; i++) parts.push({ t:"spark", x:R()*W, y:R()*H, s:5+R()*11, ph:R()*6.28, tw:.6+R()*1.4 });
    for (let i = 0; i < 6;  i++) parts.push({ t:"orb",   x:R()*W, y:R()*H, vx:(R()-.5)*7, vy:(R()-.5)*5, s:70+R()*120, o:.05+R()*.08 });
  }
  function size() {
    W = hero.clientWidth; H = hero.clientHeight;
    if (W < 10 || H < 10) { setTimeout(size, 300); return; }   // self-heal: layout not ready yet
    pc.width = W * DPR; pc.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (!parts.length) build();
  }
  size(); addEventListener("resize", size);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && pc.width < 10) size(); });

  let running = true, last = performance.now();
  new IntersectionObserver((en) => { running = en[0].isIntersecting; }).observe(hero);

  (function tick(now) {
    requestAnimationFrame(tick);
    if (!running || document.hidden || W < 10) { last = now; return; }
    const dt = Math.min((now - last) / 1000, .05); last = now;
    ctx.clearRect(0, 0, W, H);
    const t = now / 1000;
    for (const p of parts) {
      if (p.t === "crumb") {
        p.y += p.vy * dt; p.x += p.vx * dt; p.a += p.va * dt;
        if (p.y > H + 20) { p.y = -20; p.x = R() * W; }
        ctx.save(); ctx.globalAlpha = p.o; ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.drawImage(p.sp, -p.s/2, -p.s/2, p.s, p.s); ctx.restore();
      } else if (p.t === "spark") {
        const a = Math.max(0, Math.sin(t * p.tw + p.ph));
        if (a > .02) { ctx.globalAlpha = a * .9; ctx.drawImage(sparkleSprite, p.x - p.s/2, p.y - p.s/2, p.s, p.s); }
      } else {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < -p.s) p.x = W + p.s; if (p.x > W + p.s) p.x = -p.s;
        if (p.y < -p.s) p.y = H + p.s; if (p.y > H + p.s) p.y = -p.s;
        ctx.globalAlpha = p.o * (0.75 + 0.25 * Math.sin(t * .6 + p.s));
        ctx.drawImage(orbSprite, p.x - p.s/2, p.y - p.s/2, p.s, p.s);
      }
    }
    ctx.globalAlpha = 1;
  })(last);
})();

/* ═══════════════════════════════════════════════════════════
   PHASE 3 — FLAVOR TUNNEL
   pinned camera flight through 10 flavor gates
   scroll = depth · flavor atmosphere crossfade · snap per gate
   fallback (touch / narrow / reduced-motion): horizontal snap strip
   ═══════════════════════════════════════════════════════════ */
(function () {
  const tunnel = document.getElementById("tunnel");
  if (!tunnel) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch  = matchMedia("(hover: none)").matches;
  const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  const viewport = tunnel.querySelector(".tunnel-viewport");
  const scene    = tunnel.querySelector(".tunnel-scene");
  const gates    = Array.from(tunnel.querySelectorAll(".gate"));
  const bgA      = tunnel.querySelector(".tunnel-bg .ta");
  const bgB      = tunnel.querySelector(".tunnel-bg .tb");
  const nameEl   = document.getElementById("tunnel-name");
  const countEl  = document.getElementById("tunnel-count");
  const fillEl   = document.getElementById("tunnel-fill");
  const N = gates.length;
  if (!N) return;

  function useFallback() {
    tunnel.classList.add("tunnel-fallback");
    const ui = tunnel.querySelector(".tunnel-ui");
    if (ui) ui.style.display = "none";
  }

  /* wait for real layout (headless/hidden tabs report 0) then decide mode */
  (function init() {
    if (innerWidth < 10) { setTimeout(init, 300); return; }
    if (reduce || touch || innerWidth < 820 || !hasGSAP) { useFallback(); return; }
    build3D();
  })();

  function build3D() {
    const SP = 950;                 // px depth between gates
    const OFFS = [[-11,-4],[11,4],[-9,5],[10,-5],[-12,3],[11,5],[-8,-5],[9,4],[-11,-3],[10,-4]];
    gates.forEach((g, i) => {
      g._z = -i * SP;
      g._x = OFFS[i % OFFS.length][0];
      g._y = OFFS[i % OFFS.length][1];
      // cookie-cursor hot state (gates are excluded from the magnetic set)
      const cur = document.getElementById("cv-cursor");
      if (cur) {
        g.addEventListener("mouseenter", () => cur.classList.add("hot"));
        g.addEventListener("mouseleave", () => cur.classList.remove("hot"));
      }
    });

    let cam = 0, curIdx = -1, flip = false;

    function render() {
      for (const g of gates) {
        const z = g._z + cam;
        let o;
        if      (z <= -1800) o = 0;
        else if (z <  -900)  o = (z + 1800) / 900;
        else if (z <=  120)  o = 1;
        else if (z <   520)  o = 1 - (z - 120) / 400;
        else                 o = 0;
        g.style.opacity = o.toFixed(3);
        g.style.visibility = o <= 0 ? "hidden" : "visible";
        g.style.transform = `translate(-50%,-50%) translate3d(${g._x}vw, ${g._y}vh, ${z}px)`;
        g.style.pointerEvents = (o > .85 && z > -500 && z < 200) ? "auto" : "none";
      }
    }

    function setStation(idx) {
      if (idx === curIdx) return;
      curIdx = idx;
      const g = gates[idx];
      const fc = g.dataset.fc || "#FFC94D";
      nameEl.textContent = g.dataset.name || "";
      countEl.textContent = String(idx + 1).padStart(2, "0") + " / " + String(N).padStart(2, "0");
      viewport.style.color = fc;                       // rings + bar recolor (CSS transition)
      const show = flip ? bgB : bgA, hide = flip ? bgA : bgB;
      show.style.setProperty("--fc", fc);
      show.classList.add("on"); hide.classList.remove("on");
      flip = !flip;
    }

    ScrollTrigger.create({
      trigger: tunnel, start: "top top",
      end: "+=" + (N * 620),
      pin: true, scrub: 0.6, anticipatePin: 1,
      snap: { snapTo: 1 / (N - 1), duration: { min: .15, max: .5 }, ease: "power1.inOut" },
      onUpdate(self) {
        cam = self.progress * SP * (N - 1);
        render();
        fillEl.style.width = (self.progress * 100).toFixed(1) + "%";
        setStation(Math.round(self.progress * (N - 1)));
      }
    });

    /* mouse tilt — camera looks around inside the tunnel */
    const toRY = gsap.quickTo(scene, "rotationY", { duration: .9, ease: "power2.out" });
    const toRX = gsap.quickTo(scene, "rotationX", { duration: .9, ease: "power2.out" });
    tunnel.addEventListener("mousemove", (e) => {
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      toRY(nx * 5); toRX(-ny * 3.5);
    });

    render();
    setStation(0);
    addEventListener("resize", render);
  }
})();
