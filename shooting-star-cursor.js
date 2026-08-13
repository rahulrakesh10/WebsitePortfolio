/**
 * Shooting Star Cursor Effect — Canvas Line Edition
 * Draws a smooth, tapering comet-tail streak behind the cursor.
 */
(function () {
  'use strict';

  // ─── Config ───────────────────────────────────────────────────────────────
  const TRAIL_LENGTH   = 28;    // number of positions stored in history
  const LINE_WIDTH_TIP = 2.5;   // width at the cursor end (brightest point)
  const LINE_WIDTH_END = 0.2;   // width at the tail end (fades out)
  const LERP_SPEED     = 0.18;  // how smoothly the trail follows (lower = more lag = longer looking tail)

  // Comet colours — tip → tail
  const COLOR_TIP  = 'rgba(255, 255, 255, 1)';
  const COLOR_MID  = 'rgba(255, 255, 255, 0.55)';
  const COLOR_TAIL = 'rgba(255, 255, 255, 0)';

  // Glow layer (drawn as a second wider, blurred pass)
  const GLOW_WIDTH_TIP = 6;
  const GLOW_COLOR_TIP = 'rgba(255, 255, 255, 0.35)';
  const GLOW_COLOR_END = 'rgba(255, 255, 255, 0)';

  // Star-head dot
  const HEAD_RADIUS = 3.5;

  // ─── State ────────────────────────────────────────────────────────────────
  let targetX = -200, targetY = -200;  // raw mouse position
  let smoothX = -200, smoothY = -200;  // lerped position (the "head")
  let trail   = [];                     // circular buffer of {x, y}
  let canvas, ctx;

  // ─── Setup canvas ─────────────────────────────────────────────────────────
  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'shooting-star-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 999999;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(canvas);
    resize();
    window.addEventListener('resize', resize, { passive: true });
    ctx = canvas.getContext('2d');
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // ─── CSS: hide system cursor ───────────────────────────────────────────────
  function injectCSS() {
    const s = document.createElement('style');
    s.id = 'shooting-star-cursor-styles';
    s.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(s);
  }

  // ─── Draw one frame ───────────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const len = trail.length;
    if (len < 2) return;

    // ── Glow pass (wide, soft) ──────────────────────────────────────────────
    for (let i = 1; i < len; i++) {
      const t0 = (i - 1) / (len - 1);   // 0 = tip, 1 = tail
      const t1 = i       / (len - 1);
      const a  = i / len;               // alpha fraction

      const p0 = trail[len - 1 - (i - 1)]; // newest first
      const p1 = trail[len - 1 - i];

      const w0 = GLOW_WIDTH_TIP * (1 - t0);
      const w1 = GLOW_WIDTH_TIP * (1 - t1);

      const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
      grad.addColorStop(0, alphaScale(GLOW_COLOR_TIP, 1 - t0));
      grad.addColorStop(1, alphaScale(GLOW_COLOR_END, 1 - t1));

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineWidth  = Math.max(w0, 0.5);
      ctx.strokeStyle = grad;
      ctx.lineCap = 'round';
      ctx.filter = 'blur(2px)';
      ctx.stroke();
    }

    ctx.filter = 'none';

    // ── Core streak (sharp, thin) ───────────────────────────────────────────
    for (let i = 1; i < len; i++) {
      const t0 = (i - 1) / (len - 1);
      const t1 = i       / (len - 1);

      const p0 = trail[len - 1 - (i - 1)];
      const p1 = trail[len - 1 - i];

      const w = LINE_WIDTH_TIP * (1 - t0) + LINE_WIDTH_END * t0;

      const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
      grad.addColorStop(0, alphaScale(COLOR_TIP, 1 - t0 * 0.4));
      grad.addColorStop(0.5, alphaScale(COLOR_MID, 1 - t0 * 0.7));
      grad.addColorStop(1, COLOR_TAIL);

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineWidth   = Math.max(w, 0.3);
      ctx.strokeStyle = grad;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // ── Star head dot ───────────────────────────────────────────────────────
    if (smoothX > -100) {
      // Outer glow
      const radGlow = ctx.createRadialGradient(
        smoothX, smoothY, 0,
        smoothX, smoothY, HEAD_RADIUS * 4
      );
      radGlow.addColorStop(0,   'rgba(255, 255, 255, 0.6)');
      radGlow.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)');
      radGlow.addColorStop(1,   'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(smoothX, smoothY, HEAD_RADIUS * 4, 0, Math.PI * 2);
      ctx.fillStyle = radGlow;
      ctx.fill();

      // Bright core
      const radCore = ctx.createRadialGradient(
        smoothX, smoothY, 0,
        smoothX, smoothY, HEAD_RADIUS
      );
      radCore.addColorStop(0,   'rgba(255, 255, 255, 1)');
      radCore.addColorStop(0.6, 'rgba(255, 255, 255, 0.9)');
      radCore.addColorStop(1,   'rgba(255, 255, 255, 0)');
      ctx.beginPath();
      ctx.arc(smoothX, smoothY, HEAD_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = radCore;
      ctx.fill();
    }
  }

  // Helper: adjust alpha of an existing rgba() string
  function alphaScale(rgba, alpha) {
    return rgba.replace(/[\d.]+\)$/, (alpha.toFixed(3)) + ')');
  }

  // ─── Animation loop ───────────────────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);

    // Lerp smooth position toward mouse
    smoothX += (targetX - smoothX) * LERP_SPEED;
    smoothY += (targetY - smoothY) * LERP_SPEED;

    // Push to trail history
    trail.push({ x: smoothX, y: smoothY });
    if (trail.length > TRAIL_LENGTH) trail.shift();

    draw();
  }

  // ─── Events ───────────────────────────────────────────────────────────────
  function onMouseMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  function init() {
    if (window.matchMedia('(hover: none)').matches) return;
    injectCSS();
    createCanvas();
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
