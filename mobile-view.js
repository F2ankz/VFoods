/* ══════════════════════════════════════════════════════════════
   VFoods — Lite view for phones and tablets
   ──────────────────────────────────────────────────────────────
   On a phone or an iPad the site drops to a plain, static build:
     • every looping clip becomes a still image
     • scroll-scrubbed and pointer-driven motion is switched off
     • the page is ordinary top-to-bottom scrolling
   A desktop/laptop is left exactly as it was.

   This file must load in <head>, BEFORE any other script, so that
   page scripts can read window.VF_LITE and bail out of their heavy
   paths, and so a hero clip's download is cancelled before it runs.

   Marking a clip up for the swap:
     <video data-lite-img="img/posters/hero.webp" data-lite-alt="…" …>
   Add data-lite-eager to skip lazy-loading (above-the-fold images).

   Forcing a view for testing, from the console:
     VFView.set('lite') · VFView.set('full') · VFView.set('auto')
   ══════════════════════════════════════════════════════════════ */
(function (w, d) {
  'use strict';

  var KEY = 'vf-view';

  /* ── 1. is this a phone or a tablet? ───────────────────────────
     Device, not window width: a desktop browser resized narrow is
     still a desktop and keeps the full experience.               */
  function detect() {
    var ua = navigator.userAgent || '';
    // iPadOS 13+ reports itself as a Mac; the touch-point count gives it away
    var iPadOS = /Mac/.test(ua) && navigator.maxTouchPoints > 1;
    var uaMobile = /Android|iPhone|iPod|iPad|Windows Phone|IEMobile|Opera Mini|Mobile|Tablet|Silk|Kindle|PlayBook|BB10|webOS/i.test(ua);
    var coarse = !!(w.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches);
    return iPadOS || uaMobile || coarse;
  }

  var forced = null;
  try {
    var saved = w.localStorage && localStorage.getItem(KEY);
    if (saved === 'lite' || saved === 'full') forced = saved;
  } catch (e) { /* private mode */ }

  var lite = forced ? forced === 'lite' : detect();

  w.VF_LITE = lite;
  d.documentElement.setAttribute('data-view', lite ? 'mobile' : 'desktop');

  w.VFView = {
    get lite() { return lite; },
    /* 'lite' | 'full' | 'auto' — reloads so the swap runs from the top */
    set: function (mode) {
      try {
        if (mode === 'auto') localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, mode === 'lite' ? 'lite' : 'full');
      } catch (e) { /* ignore */ }
      location.reload();
    }
  };

  if (!lite) return;

  /* ── 2. clips → stills ─────────────────────────────────────────
     Two passes on purpose. The observer fires while the document is
     still parsing, early enough to cancel a clip the parser has just
     started fetching; the actual element swap waits until parsing is
     done so we never rip a <video> out from under the parser.     */
  var pending = [];

  function cancelLoad(v) {
    if (v.hasAttribute('data-lite-off')) return;
    v.setAttribute('data-lite-off', '');
    v.autoplay = false;
    v.removeAttribute('autoplay');
    v.removeAttribute('src');
    var srcs = v.getElementsByTagName('source');
    for (var i = srcs.length - 1; i >= 0; i--) srcs[i].removeAttribute('src');
    try { v.pause(); v.load(); } catch (e) { /* nothing buffered yet */ }
    pending.push(v);
  }

  function collect(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.tagName === 'VIDEO' && node.hasAttribute('data-lite-img')) { cancelLoad(node); return; }
    if (!node.querySelectorAll) return;
    var vs = node.querySelectorAll('video[data-lite-img]');
    for (var i = 0; i < vs.length; i++) cancelLoad(vs[i]);
  }

  function swap(v) {
    if (!v.parentNode) return;
    var img = d.createElement('img');
    img.src = v.getAttribute('data-lite-img');
    img.alt = v.getAttribute('data-lite-alt') || '';
    img.decoding = 'async';
    if (!v.hasAttribute('data-lite-eager')) img.loading = 'lazy';
    if (v.id) img.id = v.id;
    if (v.className) img.className = v.className;
    if (v.hasAttribute('width')) img.setAttribute('width', v.getAttribute('width'));
    if (v.hasAttribute('height')) img.setAttribute('height', v.getAttribute('height'));
    img.setAttribute('data-lite-still', '');
    v.parentNode.replaceChild(img, v);
  }

  var observer = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var added = records[i].addedNodes;
      for (var j = 0; j < added.length; j++) collect(added[j]);
    }
  });
  observer.observe(d.documentElement, { childList: true, subtree: true });

  function finish() {
    observer.disconnect();
    collect(d.body);              // anything the observer was too late for
    for (var i = 0; i < pending.length; i++) swap(pending[i]);
    pending.length = 0;
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', finish);
  else finish();
})(window, document);
