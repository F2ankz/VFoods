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

/* ── OEM JOURNEY · horizontal ZIGZAG scroll-scrub (ย้ายมาจากหน้า OEM) ── */
(function(){
  const scroll=document.getElementById('journeyScroll');
  const track=document.getElementById('journeyTrack');
  if(!scroll||!track) return;
  const stages=[...track.querySelectorAll('.jp')];
  const dots=[...document.querySelectorAll('#journeyDots .jdot')];
  const prog=document.getElementById('groundProgress');
  const hint=document.getElementById('scrollHint');
  const lineSpan=90;                      // ground line spans 5vw..95vw
  const mobile=()=>window.matchMedia('(max-width:760px)').matches;
  let ticking=false;

  function apply(){
    ticking=false;
    if(mobile()){ track.style.transform=''; stages.forEach(s=>s.classList.add('in')); return; }
    const total=scroll.offsetHeight-window.innerHeight;
    if(total<=0) return;
    let p=(-scroll.getBoundingClientRect().top)/total;
    p=Math.max(0,Math.min(1,p));
    // move the world left by the real overflow width
    const shift=Math.max(0,track.scrollWidth-window.innerWidth);
    track.style.transform='translateX(-'+(p*shift)+'px)';
    // ground progress + hint fade
    if(prog) prog.style.width=(p*lineSpan)+'vw';
    if(hint) hint.style.opacity=p>0.02?'0':'1';
    // reveal each card as it enters view (stays revealed = zigzag trail),
    // active dot = card nearest to screen centre (where the mascot walks)
    const mid=window.innerWidth/2; let best=0, bestD=1e9;
    stages.forEach((s,i)=>{
      const r=s.getBoundingClientRect(), cx=r.left+r.width/2;
      if(cx< window.innerWidth*1.08 && cx> -r.width*0.08) s.classList.add('in');
      const d=Math.abs(cx-mid);
      if(d<bestD){ bestD=d; best=i; }
    });
    dots.forEach((d,i)=>d.classList.toggle('on',i===best));
  }
  function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(apply); } }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',apply);
  apply();
})();
