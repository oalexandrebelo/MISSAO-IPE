/* MISSAO IPE — camada de atmosfera (canvas) */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initStars(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2);
    let stars = [], comets = [], t = 0;

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 9000);
      stars = Array.from({ length: n }, () => {
        const layer = Math.random();
        return {
          x: Math.random() * w, y: Math.random() * h,
          r: 0.3 + layer * 1.2, z: 0.2 + layer,
          a: 0.25 + Math.random() * 0.6, p: Math.random() * Math.PI * 2,
        };
      });
    }

    function shooting() {
      if (reduced) return;
      if (Math.random() < 0.004 && comets.length < 2) {
        comets.push({ x: Math.random() * w, y: Math.random() * h * 0.5, vx: 3 + Math.random() * 3, vy: 1 + Math.random() * 1.4, life: 1 });
      }
    }

    function frame() {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = reduced ? 1 : 0.65 + 0.35 * Math.sin(t * 2 + s.p);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.z > 0.85 ? '#cfe6ff' : '#9fb4d8';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
        if (!reduced) { s.y -= s.z * 0.04; if (s.y < -2) s.y = h + 2; }
      }
      shooting();
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx; c.y += c.vy; c.life -= 0.012;
        const g = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 14, c.y - c.vy * 14);
        g.addColorStop(0, `rgba(200,235,255,${Math.max(0, c.life)})`);
        g.addColorStop(1, 'rgba(200,235,255,0)');
        ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x - c.vx * 14, c.y - c.vy * 14); ctx.stroke();
        if (c.life <= 0) comets.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }

    addEventListener('resize', resize);
    resize(); frame();
  }

  function launch(canvas, onDone) {
    const ctx = canvas.getContext('2d');
    let w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const parts = [];
    const t0 = performance.now();
    const DUR = 3400;

    function frame(now) {
      const p = Math.min(1, (now - t0) / DUR);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const noseY = h * (0.78 - p * 0.62);
      // trail
      for (let i = 0; i < 26; i++) {
        const q = i / 26;
        const y = noseY + q * (h * 0.42) * (0.4 + p);
        const r = (1 - q) * (7 + p * 22);
        ctx.globalAlpha = (1 - q) * 0.55 * (0.4 + p * 0.6);
        const g = ctx.createRadialGradient(cx, y, 0, cx, y, r * 2.4);
        g.addColorStop(0, 'rgba(255,240,210,.95)');
        g.addColorStop(0.35, 'rgba(245,184,65,.55)');
        g.addColorStop(1, 'rgba(255,92,138,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx + Math.sin(q * 9 + p * 8) * q * 14, y, r * 2.4, 0, 7); ctx.fill();
      }
      // rocket
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#e9eefc';
      ctx.beginPath();
      ctx.moveTo(cx, noseY - 26);
      ctx.lineTo(cx + 6, noseY + 16);
      ctx.lineTo(cx - 6, noseY + 16);
      ctx.closePath(); ctx.fill();
      // flash
      if (p > 0.72) {
        const a = (p - 0.72) / 0.28;
        ctx.globalAlpha = Math.min(0.55, a * 0.8);
        ctx.fillStyle = '#dff4ff'; ctx.fillRect(0, 0, w, h);
      }
      ctx.globalAlpha = 1;
      if (p < 1) requestAnimationFrame(frame); else onDone && onDone();
    }
    requestAnimationFrame(frame);
  }

  window.FX = { initStars, launch };
})();
