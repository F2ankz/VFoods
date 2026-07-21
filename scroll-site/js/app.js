/* VFOODS — compact landing
   HERO = scroll-scrub 2 ตอนต่อกัน: Home slide 1 → Home Slide 3
   (frames-a/ = "Home slide1.mp4", frames-b/ = "Home Slide 3.mp4" · 192 เฟรม/ตอน)
   ปุ่มเมนูด่วนลอยขึ้นมาเอง ไม่บังหน้า เลื่อนต่อได้ปกติ */

const SEQS = [
  { dir: "frames-a", count: 192 },   /* Home slide 1 */
  { dir: "frames-b", count: 192 }    /* Home Slide 3 */
];
const SCALE = 0.85;
const TOTAL_FRAMES = SEQS.reduce((s, q) => s + q.count, 0);
/* map global index 0..TOTAL-1 → {dir, local} */
function frameSrc(g) {
  let n = g;
  for (const q of SEQS) { if (n < q.count) return `${q.dir}/frame_${String(n + 1).padStart(4, "0")}.webp`; n -= q.count; }
  return null;
}

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const stage = document.getElementById("hero-stage");
const hero = document.getElementById("hero");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const loader = document.getElementById("loader");
const loaderFill = document.getElementById("loader-fill");
const loaderPercent = document.getElementById("loader-percent");
const quickBar = document.getElementById("quick-bar");

const frames = new Array(TOTAL_FRAMES).fill(null);
let curFrame = 0;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ── canvas sizing (dpr-aware, self-healing when viewport starts at 0) ── */
function sizeCanvas() {
  const w = hero.clientWidth, h = hero.clientHeight;
  if (w < 10 || h < 10) { setTimeout(sizeCanvas, 300); return; }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  draw();
}
addEventListener("resize", sizeCanvas);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && canvas.width < 10) sizeCanvas();
});

function draw() {
  const img = frames[curFrame];
  if (!img || canvas.width < 10) return;
  const cw = canvas.width, ch = canvas.height;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih) * SCALE;
  const dw = iw * scale, dh = ih * scale;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
}

/* ── scroll-scrub: ตำแหน่งสกรอลล์ใน #hero-stage → เฟรม ── */
function scrubProgress() {
  const total = stage.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  const top = stage.getBoundingClientRect().top;   /* 0 ที่บนสุด, ลบเมื่อเลื่อนผ่าน */
  return clamp(-top / total, 0, 1);
}
let ticking = false;
function onScrollScrub() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const p = scrubProgress();
    const idx = Math.round(p * (TOTAL_FRAMES - 1));
    if (idx !== curFrame) { curFrame = idx; draw(); }
  });
}

/* ── preload ── */
let loadedCount = 0;
function bump() {
  loadedCount++;
  const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
  loaderFill.style.width = pct + "%";
  loaderPercent.textContent = pct + "%";
}
function loadFrame(i) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { frames[i] = img; resolve(img); };
    img.onerror = () => resolve(null);
    img.src = frameSrc(i);
  });
}
async function preload() {
  const BATCH = 32;
  for (let start = 0; start < TOTAL_FRAMES; start += BATCH) {
    const jobs = [];
    for (let i = start; i < Math.min(start + BATCH, TOTAL_FRAMES); i++) {
      jobs.push(loadFrame(i).then(bump));
      /* วาดเฟรมแรกทันทีที่โหลดเสร็จ เพื่อโชว์ hero ระหว่างโหลด */
      if (i === 0) jobs[jobs.length - 1].then(() => { sizeCanvas(); });
    }
    await Promise.all(jobs);
  }
  loader.classList.add("done");
  sizeCanvas();
  if (reduceMotion) { curFrame = 0; draw(); }
  else { onScrollScrub(); }
  revealBar();
}

/* ── quick bar: โผล่เมื่อเริ่มเลื่อน / ซ่อนเมื่อถึง "เกี่ยวกับเรา" ── */
let barShown = false;
const aboutSection = document.getElementById("about-us");

function updateBar() {
  if (!barShown) return;
  const aboutTop = aboutSection.getBoundingClientRect().top;
  quickBar.classList.toggle("show", aboutTop > innerHeight * 0.85);
}
function revealBar() {
  if (barShown) return;
  barShown = true;
  updateBar();
}
addEventListener("scroll", () => {
  onScrollScrub();
  if (scrollY > 60) revealBar();
  updateBar();
}, { passive: true });
setTimeout(revealBar, 12000);   /* กันเหนียว: ไม่เกิน 12 วิ ปุ่มต้องมา */

/* ── reveals ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) en.target.classList.add("in"); });
}, { threshold: .16, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

/* ── counters ── */
const cio = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, target = +el.dataset.count, t0 = performance.now();
    (function tick(now) {
      const p = clamp((now - t0) / 1400, 0, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
    cio.unobserve(el);
  });
}, { threshold: .6 });
document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

/* ── boot ── */
sizeCanvas();
preload();
