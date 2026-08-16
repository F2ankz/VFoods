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

  /* 3. THREE.JS 3D MODEL WALK INIT (VFOODS Mascot matching model2D.png) */
  const canvas3d = document.getElementById('cookie-3d-canvas');
  const svgFallback = document.getElementById('svgMascotFallback');
  let mascotObj = null;
  let isScrolling = false, scrollTimeout = null;
  let isSectionVisible = false;
  let animRendering = false;
  let triggerRender = null;   // จะถูกกำหนดค่าเมื่อ setupMascot3D() ทำงาน (หลัง Three.js โหลด)

  function setupMascot3D() {
    if (!canvas3d || typeof THREE === 'undefined' || mascotObj) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 260 / 320, 0.1, 100);
    camera.position.set(0, 0.25, 4.0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas3d, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(260, 320);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const ambLight = new THREE.AmbientLight(0xffffff, 1.05);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.45);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xffb03b, 0.7);
    backLight.position.set(-3, 2, -2);
    scene.add(backLight);

    // --- สร้าง 3D Model ตัวละคร VFOODS คุกกี้ดอกไม้ (สีส้มสดใส & ใหญ่กว่าเดิม 2 เท่า) ---
    function createVFoodsMascot() {
      const group = new THREE.Group();

      // Materials - โทนคุกกี้อบ น้ำตาล-ส้ม (baked-cookie brown/orange); หมวกคงสีส้มไว้เป็นเอกลักษณ์
      const biscuitMat = new THREE.MeshStandardMaterial({ color: 0xB06828, roughness: 0.78, metalness: 0.02 });
      const chocMat = new THREE.MeshStandardMaterial({ color: 0x4A220B, roughness: 0.5, metalness: 0.1 });
      const capMat = new THREE.MeshStandardMaterial({ color: 0xF2731C, roughness: 0.4 });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 });
      const yellowMat = new THREE.MeshStandardMaterial({ color: 0xB0682A, roughness: 0.72 });
      const armMat = new THREE.MeshStandardMaterial({ color: 0xBB6F2B, roughness: 0.72 });

      // Body Group
      const body = new THREE.Group();

      // Center disc
      const centerGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.22, 20);
      const centerMesh = new THREE.Mesh(centerGeo, biscuitMat);
      centerMesh.rotation.x = Math.PI / 2;
      body.add(centerMesh);

      // Chocolate inner center
      const chocGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.25, 20);
      const chocMesh = new THREE.Mesh(chocGeo, chocMat);
      chocMesh.rotation.x = Math.PI / 2;
      body.add(chocMesh);

      // 8 Petals (กลีบดอกส้ม)
      const petalGeo = new THREE.SphereGeometry(0.23, 14, 14);
      const radius = 0.44;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeo, biscuitMat);
        petal.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        petal.scale.set(1, 1, 0.65);
        body.add(petal);
      }

      // Cap (หมวกส้มสดพร้อมโลโก้ V)
      const cap = new THREE.Group();
      const capDome = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
      cap.add(capDome);

      const visorGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.04, 16, 1, false, -Math.PI / 3, (Math.PI * 2) / 3);
      const visor = new THREE.Mesh(visorGeo, capMat);
      visor.position.set(0, 0.05, 0.2);
      visor.rotation.x = 0.22;
      cap.add(visor);

      // V Logo
      const vShape = new THREE.Shape();
      vShape.moveTo(-0.08, 0.12);
      vShape.lineTo(0, -0.12);
      vShape.lineTo(0.08, 0.12);
      vShape.lineTo(0.04, 0.12);
      vShape.lineTo(0, -0.04);
      vShape.lineTo(-0.04, 0.12);
      vShape.closePath();
      const vGeo = new THREE.ExtrudeGeometry(vShape, { depth: 0.03, bevelEnabled: false });
      const vMesh = new THREE.Mesh(vGeo, whiteMat);
      vMesh.position.set(-0.015, 0.24, 0.52);
      vMesh.rotation.x = -0.3;
      vMesh.scale.set(0.7, 0.7, 0.7);
      cap.add(vMesh);

      cap.position.set(0, 0.38, 0);
      cap.rotation.x = -0.12;
      body.add(cap);

      // Eyes (ตาโตขวา, ตาซ้าย wink)
      const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), whiteMat);
      rightEye.position.set(0.16, 0.1, 0.16);
      body.add(rightEye);

      const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), blackMat);
      rightPupil.position.set(0.19, 0.11, 0.26);
      body.add(rightPupil);

      const pupilHighlight = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 10), whiteMat);
      pupilHighlight.position.set(0.21, 0.14, 0.31);
      body.add(pupilHighlight);

      // Wink Left Eye '>'
      const wink = new THREE.Group();
      const winkMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
      const lineGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.12, 10);
      const topArm = new THREE.Mesh(lineGeo, winkMat);
      topArm.rotation.z = Math.PI / 4;
      topArm.position.y = 0.03;
      const botArm = new THREE.Mesh(lineGeo, winkMat);
      botArm.rotation.z = -Math.PI / 4;
      botArm.position.y = -0.03;
      wink.add(topArm);
      wink.add(botArm);
      wink.position.set(-0.16, 0.1, 0.2);
      wink.rotation.y = -0.2;
      body.add(wink);

      body.position.y = 0.75;
      group.add(body);

      // Legs & Shoes
      const leftLeg = new THREE.Group();
      leftLeg.position.set(-0.18, 0.52, 0);
      const rightLeg = new THREE.Group();
      rightLeg.position.set(0.18, 0.52, 0);

      const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12);
      legGeo.translate(0, -0.25, 0);

      leftLeg.add(new THREE.Mesh(legGeo, yellowMat));
      rightLeg.add(new THREE.Mesh(legGeo, yellowMat));

      const shoeGeo = new THREE.BoxGeometry(0.16, 0.14, 0.28);
      shoeGeo.translate(0, -0.07, 0.05);

      const leftShoe = new THREE.Mesh(shoeGeo, whiteMat);
      leftShoe.position.set(0, -0.48, 0);
      leftLeg.add(leftShoe);

      const rightShoe = new THREE.Mesh(shoeGeo, whiteMat);
      rightShoe.position.set(0, -0.48, 0);
      rightLeg.add(rightShoe);

      group.add(leftLeg);
      group.add(rightLeg);

      // Arms & Gloves
      const leftArm = new THREE.Group();
      leftArm.position.set(-0.48, 0.75, 0);
      const rightArm = new THREE.Group();
      rightArm.position.set(0.48, 0.75, 0);

      const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 12);
      armGeo.translate(0, -0.2, 0);

      const leftArmMesh = new THREE.Mesh(armGeo, armMat);
      leftArmMesh.rotation.z = 0.25;
      leftArm.add(leftArmMesh);

      const rightArmMesh = new THREE.Mesh(armGeo, armMat);
      rightArmMesh.rotation.z = -0.25;
      rightArm.add(rightArmMesh);

      const gloveGeo = new THREE.SphereGeometry(0.09, 12, 12);
      gloveGeo.scale(1, 1.2, 1);

      const leftGlove = new THREE.Mesh(gloveGeo, whiteMat);
      leftGlove.position.set(-0.05, -0.38, 0);
      leftArm.add(leftGlove);

      const rightGlove = new THREE.Mesh(gloveGeo, whiteMat);
      rightGlove.position.set(0.05, -0.38, 0);
      rightArm.add(rightGlove);

      group.add(leftArm);
      group.add(rightArm);

      // ปรับขนาดโมเดล 3D พอเหมาะ เห็นส่วนหัวและลำตัวเต็มๆ ไม่โดนตัด
      group.scale.set(1.22, 1.22, 1.22);
      group.rotation.y = Math.PI / 5;
      group.position.y = -0.48;

      return {
        group,
        body,
        leftLeg,
        rightLeg,
        leftArm,
        rightArm
      };
    }

    mascotObj = createVFoodsMascot();
    scene.add(mascotObj.group);

    // เปิดใช้งาน 3D Canvas
    if (svgFallback) svgFallback.style.display = 'none';
    canvas3d.style.display = 'block';

    const clock = new THREE.Clock();
    let animTime = 0;

    function renderScene() {
      const delta = clock.getDelta();

      if (mascotObj) {
        if (isScrolling) {
          animTime += delta * 9;
          const angle = Math.sin(animTime);

          // Leg swing
          mascotObj.leftLeg.rotation.x = angle * 0.6;
          mascotObj.rightLeg.rotation.x = -angle * 0.6;

          // Arm swing opposite to legs
          mascotObj.leftArm.rotation.x = -angle * 0.5;
          mascotObj.rightArm.rotation.x = angle * 0.5;

          // Body bobbing up and down
          mascotObj.body.position.y = 0.75 + Math.abs(Math.sin(animTime * 2)) * 0.06;
          mascotObj.body.rotation.z = Math.sin(animTime) * 0.04;
        } else {
          // Smooth return to idle pose
          mascotObj.leftLeg.rotation.x *= 0.82;
          mascotObj.rightLeg.rotation.x *= 0.82;
          mascotObj.leftArm.rotation.x *= 0.82;
          mascotObj.rightArm.rotation.x *= 0.82;
          mascotObj.body.position.y = 0.75;
          mascotObj.body.rotation.z *= 0.82;
        }
      }

      renderer.render(scene, camera);
    }

    function animateLoop() {
      if (!isSectionVisible) {
        animRendering = false;
        return;
      }
      renderScene();

      // เรนเดอร์เฉพาะตอนกำลัง scroll หรือตอนกำลังคืนท่ากลับสู่อะเดิล
      const isNeedIdleReturn = mascotObj && Math.abs(mascotObj.leftLeg.rotation.x) > 0.005;
      if (isScrolling || isNeedIdleReturn) {
        requestAnimationFrame(animateLoop);
      } else {
        animRendering = false;
      }
    }

    triggerRender = function () {
      if (!animRendering && isSectionVisible) {
        animRendering = true;
        requestAnimationFrame(animateLoop);
      }
    };

    // วาดเฟรมแรกให้เห็นมาสคอตทันทีหลังเซ็ตอัพ
    renderScene();
    if (isSectionVisible) triggerRender();
  }

  /* 3b. LAZY-LOAD Three.js เฉพาะเมื่อใกล้ถึงส่วน journey (ลดภาระตอนโหลดหน้าแรก) */
  function loadThreeThenMascot() {
    if (typeof THREE !== 'undefined') { setupMascot3D(); return; }
    if (window.__threeLoading) return;
    window.__threeLoading = true;
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = setupMascot3D;
    document.head.appendChild(s);
  }
  if (canvas3d && !reduce) {
    const journeyEl = document.getElementById('steps') || document.getElementById('journeyScroll');
    if (journeyEl && 'IntersectionObserver' in window) {
      const preObs = new IntersectionObserver((es) => {
        if (es.some(e => e.isIntersecting)) { preObs.disconnect(); loadThreeThenMascot(); }
      }, { rootMargin: '600px 0px' });
      preObs.observe(journeyEl);
    } else {
      loadThreeThenMascot();
    }
  }

  /* 4. OEM JOURNEY · HORIZONTAL SCROLL-SCRUB & MASCOT ADVANCE (OPTIMIZED) */
  const scroll = document.getElementById('journeyScroll');
  const track = document.getElementById('journeyTrack');
  const mascot = document.getElementById('cookieChar');
  if (!scroll || !track) return;

  // IntersectionObserver: ทำงาน 3D เมื่อส่วนนี้โผล่ในหน้าจอเท่านั้น
  if (typeof IntersectionObserver !== 'undefined') {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        isSectionVisible = e.isIntersecting;
        if (isSectionVisible && typeof triggerRender === 'function') {
          triggerRender();
        }
      });
    }, { threshold: 0.05 });
    sectionObserver.observe(scroll);
  } else {
    isSectionVisible = true;
  }

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
    isScrolling = true;
    if (typeof triggerRender === 'function') triggerRender();

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 120);

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

