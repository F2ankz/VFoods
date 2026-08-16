/* ══════════════════════════════════════════════════════════════
   VFoods — 3D walking mascot (คุกกี้น้อย)
   ──────────────────────────────────────────────────────────────
   The Three.js mascot that walks the OEM journey. Shared by the
   home page and the OEM guide so both run the exact same model —
   edit it here and it changes in both places.

   Three.js is fetched only once the journey comes within 600px of
   the viewport, and the scene renders only while the section is on
   screen and the page is actually scrolling.

     const mascot = VFMascot3D.init({
       canvas:   <canvas> the model draws into,
       fallback: the flat SVG shown until the model is ready,
       section:  the element whose visibility gates all of this
     });
     mascot.notifyScroll();   // call from the page's scroll handler

   Returns null when the browser asks for reduced motion, when the
   lite phone/tablet view is on, or when the canvas is missing — in
   every one of those cases the SVG simply stays put.
   ══════════════════════════════════════════════════════════════ */
(function (w, d) {
  'use strict';

  w.VFMascot3D = {
    init: function (opts) {
      opts = opts || {};
      const canvas3d = opts.canvas;
      const svgFallback = opts.fallback || null;
      const section = opts.section || null;

      const reduce = !!w.VF_LITE || matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!canvas3d || reduce) return null;

      let mascotObj = null;
      let isScrolling = false, scrollTimeout = null;
      let isSectionVisible = false;
      let animRendering = false;
      let triggerRender = null;


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
    /* the scene only renders while the journey is actually on screen */
    if (section && typeof IntersectionObserver !== 'undefined') {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          isSectionVisible = e.isIntersecting;
          if (isSectionVisible && typeof triggerRender === 'function') triggerRender();
        });
      }, { threshold: 0.05 }).observe(section);
    } else {
      isSectionVisible = true;
    }

    /* lazy-load Three.js only as the journey comes into range */
    function loadThreeThenMascot() {
      if (typeof THREE !== 'undefined') { setupMascot3D(); return; }
      if (window.__threeLoading) return;
      window.__threeLoading = true;
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.onload = setupMascot3D;
      document.head.appendChild(s);
    }
    if (canvas3d) {
      const journeyEl = section;
      if (journeyEl && 'IntersectionObserver' in window) {
        const preObs = new IntersectionObserver((es) => {
          if (es.some(e => e.isIntersecting)) { preObs.disconnect(); loadThreeThenMascot(); }
        }, { rootMargin: '600px 0px' });
        preObs.observe(journeyEl);
      } else {
        loadThreeThenMascot();
      }
    }


      return {
        /* the page's scroll handler pumps this; the render loop stops
           itself again once the walk has settled back to idle */
        notifyScroll: function () {
          isScrolling = true;
          if (typeof triggerRender === 'function') triggerRender();
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(function () { isScrolling = false; }, 120);
        }
      };
    }
  };
})(window, document);
