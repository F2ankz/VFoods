/* ═══════════════════════════════════════════════════════════
   VFOODS homepage — lightweight enhancements (ULTRA-SMOOTH build)
   Removed for performance: Lenis smooth-scroll, cookie cursor +
   magnetic, GSAP/ScrollTrigger scrub parallax, particle canvas,
   floating objects, blur effects. Native scroll only.
   Kept: hero heading entrance (CSS) + lazy/paused about videos.
   ═══════════════════════════════════════════════════════════ */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* hero heading entrance is pure CSS now (no JS needed). */

  /* about videos — decode/play only while on screen (3 clips were
     looping off-screen and hogging the main thread) */
  const vids = document.querySelectorAll(".about-media video");
  if (vids.length) {
    vids.forEach((v) => { v.muted = true; v.playsInline = true; });
    if (reduce) return;
    const vio = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
        else v.pause();
      });
    }, { threshold: 0.2 });
    vids.forEach((v) => vio.observe(v));
  }
})();
