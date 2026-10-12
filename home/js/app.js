/* VFOODS — compact landing
   HERO = คลิป Home Slide 3 คลิปเดียว เล่นวนลูปเต็มจอ (ไม่มี scroll-scrub = ลื่น)
   ปุ่มเมนูด่วนลอยขึ้นมาเอง ไม่บังหน้า เลื่อนต่อได้ปกติ */

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const loader = document.getElementById("loader");
const loaderFill = document.getElementById("loader-fill");
const loaderPercent = document.getElementById("loader-percent");
const quickBar = document.getElementById("quick-bar");

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ── HERO VIDEO: คลิปเดียว เล่นวนลูปเต็มจอ ── */
const vids = [document.getElementById("hero-v0")];

function initHeroVideo() {
  const v = vids[0];
  // on a phone/iPad mobile-view.js has already turned this into an <img>
  if (!v || v.tagName !== "VIDEO") return;
  v.muted = true; v.playsInline = true; v.loop = true;
  v.classList.add("show");
  if (reduceMotion) { v.pause(); return; }
  const play = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  play();
  /* หยุดถอดรหัสวิดีโอเมื่อเลื่อนพ้นจอ → ลดภาระ CPU/GPU ตอน scroll (ลดอาการหน่วง) */
  const heroSection = document.getElementById("hero");
  if (heroSection && "IntersectionObserver" in window) {
    new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) play(); else v.pause(); });
    }, { threshold: 0.05 }).observe(heroSection);
  }
}

/* ── loader: แสดงเนื้อหาทันทีที่หน้าเรนเดอร์ — ไม่รอวิดีโอ (แก้อาการข้อมูลขึ้นช้า) ── */
function hideLoader() {
  if (loader.classList.contains("done")) return;
  loader.classList.add("done");
  revealBar();
}
if (loaderFill) loaderFill.style.width = "100%";
if (loaderPercent) loaderPercent.textContent = "100%";
/* พอ DOM/CSS พร้อมก็เปิดหน้าเลย ไม่ผูกกับการโหลดวิดีโอ/สคริปต์หนัก */
requestAnimationFrame(() => setTimeout(hideLoader, 120));
addEventListener("load", hideLoader);
setTimeout(hideLoader, 1600);   /* กันเหนียว */

/* ── quick bar: โผล่เมื่อเริ่มเลื่อน / ซ่อนเมื่อถึง "เกี่ยวกับเรา" ── */
let barShown = false;
const aboutSection = document.getElementById("about-us");

function updateBar() {
  if (!barShown || !aboutSection) return;
  const aboutTop = aboutSection.getBoundingClientRect().top;
  quickBar.classList.toggle("show", aboutTop > innerHeight * 0.85);
}
function revealBar() {
  if (barShown) return;
  barShown = true;
  updateBar();
}
addEventListener("scroll", () => {
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
initHeroVideo();
