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

      /* The mascot is a Blender model (models/cookie_walk.glb). Its parts
         came out of Blender as separate meshes, so the walk cycle drives
         them by name — there is no armature in the file. */
      const THIGH_L = ['Cube003'],              FOOT_L = ['Cube012', 'Cube012_1'];
      const THIGH_R = ['Cube'],                 FOOT_R = ['Cube011', 'Cube011_1'];

      const STRIDE   = 0.72;   /* radians the hip swings at full walk */
      const FOOT_LAG = 0.35;   /* ankle counter-rotation, so the shoe stays flatter */
      const TURN     = 38 * Math.PI / 180;   /* three-quarter turn; a head-on mascot hides its own stride */

      function buildMascot(gltf) {
        const group = new THREE.Group();
        const model = gltf.scene;

        /* fit the model to the frame this camera was already set up for:
           2.4 units tall, standing on y = -1.1 */
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const mid = box.getCenter(new THREE.Vector3());
        const fit = 2.4 / size.y;
        model.scale.setScalar(fit);
        model.position.set(-mid.x * fit, -box.min.y * fit - 1.1, -mid.z * fit);

        const body = new THREE.Group();
        body.add(model);
        group.add(body);
        group.updateMatrixWorld(true);

        const meshes = {};
        model.traverse(function (o) { if (o.isMesh) meshes[o.name] = o; });

        function topOf(names) {
          const b = new THREE.Box3();
          names.forEach(function (n) { if (meshes[n]) b.expandByObject(meshes[n]); });
          return b.max.y;
        }

        /* Each joint sits at the TOP of the piece it swings. A point on the
           pivot cannot travel when it rotates, so the cut end of the thigh
           stays buried in the body and the cut end of the foot stays inside
           the ankle, at any stride width. attach() moves a mesh under a new
           parent without shifting it on screen. */
        function limb(thighNames, footNames) {
          const hip = new THREE.Group();
          hip.position.y = topOf(thighNames);
          group.add(hip);
          group.updateMatrixWorld(true);
          thighNames.forEach(function (n) { if (meshes[n]) hip.attach(meshes[n]); });

          const ankle = new THREE.Group();
          ankle.position.y = topOf(footNames) - hip.position.y;
          hip.add(ankle);
          hip.updateMatrixWorld(true);
          footNames.forEach(function (n) { if (meshes[n]) ankle.attach(meshes[n]); });

          return { hip: hip, ankle: ankle };
        }

        const left = limb(THIGH_L, FOOT_L);
        const right = limb(THIGH_R, FOOT_R);

        group.rotation.y = TURN;   /* set last: limb() measures in an untransformed group */
        return {
          group: group, body: body,
          leftLeg: left.hip, leftFoot: left.ankle,
          rightLeg: right.hip, rightFoot: right.ankle
        };
      }

      const clock = new THREE.Clock();
      let animTime = 0;

      /* It keeps walking the whole time it is on screen. Tying the cycle to
         isScrolling meant anyone who simply stopped scrolling was left
         looking at a cookie standing to attention — scrolling now sets the
         pace instead of switching the walk on and off. */
      const PACE_IDLE = 3.4, PACE_SCROLL = 9;
      let pace = PACE_IDLE;

      function renderScene() {
        const delta = clock.getDelta();

        if (mascotObj) {
          /* ease between the two speeds so the change of pace is not a jolt */
          const want = isScrolling ? PACE_SCROLL : PACE_IDLE;
          pace += (want - pace) * Math.min(1, delta * 6);

          animTime += delta * pace;
          const angle = Math.sin(animTime);
          const swing = STRIDE * (0.62 + 0.38 * (pace - PACE_IDLE) / (PACE_SCROLL - PACE_IDLE));

          // Leg swing, with the shoe lagging behind so it lands flatter
          mascotObj.leftLeg.rotation.x = angle * swing;
          mascotObj.rightLeg.rotation.x = -angle * swing;
          mascotObj.leftFoot.rotation.x = -angle * swing * FOOT_LAG;
          mascotObj.rightFoot.rotation.x = angle * swing * FOOT_LAG;

          // Body bobbing up and down. The .glb has the arms welded into
          // the body mesh, so a shoulder sway stands in for an arm swing.
          mascotObj.body.position.y = Math.abs(Math.sin(animTime * 2)) * 0.06;
          mascotObj.body.rotation.z = Math.sin(animTime) * 0.04;
          mascotObj.body.rotation.y = Math.sin(animTime) * 0.05;
        }

        renderer.render(scene, camera);
      }

      function animateLoop() {
        if (!isSectionVisible) {
          animRendering = false;
          return;
        }
        renderScene();

        /* the IntersectionObserver above is what stops this: nothing renders
           once the journey scrolls out of view */
        requestAnimationFrame(animateLoop);
      }

      triggerRender = function () {
        if (!animRendering && isSectionVisible) {
          animRendering = true;
          requestAnimationFrame(animateLoop);
        }
      };

      /* pages inside /scroll-site/ sit one level below the model */
      const MODEL = (/\/scroll-site\//.test(location.pathname) ? '../' : '') + 'models/cookie_walk.glb';

      new THREE.GLTFLoader().load(MODEL, function (gltf) {
        mascotObj = buildMascot(gltf);
        scene.add(mascotObj.group);
        if (svgFallback) svgFallback.style.display = 'none';
        canvas3d.style.display = 'block';
        renderScene();
        if (isSectionVisible) triggerRender();
      }, undefined, function () {
        /* model unreachable — the flat SVG is already on screen, leave it there */
      });
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
    function script(src, onload) {
      const s = document.createElement('script');
      s.src = src;
      s.onload = onload;
      document.head.appendChild(s);
    }

    /* three.js first, then the glTF loader it has to be bolted onto */
    function loadThreeThenMascot() {
      if (typeof THREE !== 'undefined' && THREE.GLTFLoader) { setupMascot3D(); return; }
      if (window.__threeLoading) return;
      window.__threeLoading = true;
      /* cdnjs does not ship three's examples/, so the loader comes from jsdelivr
         — pinned to 0.128.0 to match the r128 core above */
      const LOADER = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
      if (typeof THREE !== 'undefined') { script(LOADER, setupMascot3D); return; }
      script('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', function () {
        script(LOADER, setupMascot3D);
      });
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
