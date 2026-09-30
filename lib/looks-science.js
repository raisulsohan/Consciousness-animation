// The looks of বিচিত্র বিজ্ঞান: one film, painted three ways. A scene draws only through its look (strokes, dots,
// sparks, the light of consciousness, text, pages, fills), so the same motion can be seen in every look.
//   F.sciLook(id, W, H) with id 'cosmic' (dark, glowing), 'blueprint' (blue sheet, crisp white lines) or 'ink' (ink on paper)
// Colours come by role: line, dim, signal (brain signals), amber (consciousness), text, script (old handwriting).
(function () {
  'use strict';
  const F = FILM, { TAU, canvas, rng, hex, rgba, mottledBackdrop, vignette } = F;
  const col = (c, a = 1) => rgba(hex(c), a);

  const LOOKS = {
    cosmic: {
      name: 'ক · মহাজাগতিক', font: 'Hind Siliguri', glow: true,
      col: { line: '#a9bde6', dim: '#44557a', signal: '#4fd1e8', amber: '#ffb347', text: '#eef3ff', script: '#b9cdf5' },
      end: '#000000', flash: '#fff0d2', dark: '#000000',
    },
    blueprint: {
      name: 'খ · ব্লুপ্রিন্ট', font: 'Hind Siliguri', glow: false,
      col: { line: '#eaf3ff', dim: '#7f9fc2', signal: '#8fe6ff', amber: '#ffae42', text: '#f4f8ff', script: '#cfe2f7' },
      end: '#07203a', flash: '#ffd79a', dark: '#041528',
    },
    ink: {
      name: 'গ · কাগজ-কালি', font: 'Noto Serif Bengali', glow: false,
      col: { line: '#2b2420', dim: '#8f8170', signal: '#1d5f7a', amber: '#d97a25', text: '#2b2420', script: '#3b322b' },
      end: '#efe6d4', flash: '#f1c58c', dark: '#2a1c12',
    },
  };

  function sciLook(id, W, H) {
    const D = LOOKS[id]; if (!D) throw new Error(`no look ${id}`);
    const L = { id, ...D, W, H };
    const C = role => D.col[role] || role;

    // ── the background, baked once ──
    const [bgc, bx] = canvas(W, H);
    if (id === 'cosmic') {
      const g = bx.createRadialGradient(W / 2, H * .45, 0, W / 2, H / 2, Math.hypot(W, H) * .6);
      g.addColorStop(0, '#0d1633'); g.addColorStop(.5, '#070b1b'); g.addColorStop(1, '#020309');
      bx.fillStyle = g; bx.fillRect(0, 0, W, H);
      const r = rng(21);   // faint deep-blue and violet clouds
      for (let i = 0; i < 9; i++) {
        const x = r() * W, y = r() * H, rad = Math.max(W, H) * (.15 + r() * .25), c = r() < .5 ? [40, 70, 160] : [90, 60, 160];
        const gg = bx.createRadialGradient(x, y, 0, x, y, rad); gg.addColorStop(0, rgba(c, .07)); gg.addColorStop(1, rgba(c, 0));
        bx.fillStyle = gg; bx.fillRect(0, 0, W, H);
      }
    } else if (id === 'blueprint') {
      bx.drawImage(mottledBackdrop(W, H, '#0f3d68', '#0a2b4c', 5, 'rgba(170,215,255,.07)'), 0, 0);
      const u = Math.min(W, H) / 1080;
      for (const [step, a] of [[40 * u, .045], [200 * u, .09]]) {
        bx.strokeStyle = `rgba(220,238,255,${a})`; bx.lineWidth = 1;
        for (let x = W / 2 % step; x < W; x += step) { bx.beginPath(); bx.moveTo(x + .5, 0); bx.lineTo(x + .5, H); bx.stroke(); }
        for (let y = H / 2 % step; y < H; y += step) { bx.beginPath(); bx.moveTo(0, y + .5); bx.lineTo(W, y + .5); bx.stroke(); }
      }
    } else {   // clean paper: a warm gradient, fine fibre and speckle, no blotches (they read as dirt)
      const g = bx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f3ecdd'); g.addColorStop(1, '#ebe1cc');
      bx.fillStyle = g; bx.fillRect(0, 0, W, H);
      const fib = bx.createPattern(F.fibreTile(13), 'repeat'); bx.globalAlpha = .3; bx.fillStyle = fib; bx.fillRect(0, 0, W, H); bx.globalAlpha = 1;
      const r = rng(9);
      for (let i = 0; i < 9000; i++) { bx.fillStyle = r() < .5 ? `rgba(90,70,40,${r() * .08})` : `rgba(255,255,255,${r() * .1})`; bx.fillRect(r() * W, r() * H, 1, 1); }
      const gl = bx.createRadialGradient(W * .45, H * .4, 0, W / 2, H / 2, Math.hypot(W, H) * .6);
      gl.addColorStop(0, 'rgba(255,248,230,.25)'); gl.addColorStop(1, 'rgba(120,90,50,.10)'); bx.fillStyle = gl; bx.fillRect(0, 0, W, H);
    }
    const VIG = vignette(W, H, id === 'ink' ? .22 : .45);

    // ── glow sprites (cosmic): a soft disc per colour, drawn scaled ──
    const SPR = {};
    const sprite = c => SPR[c] || (SPR[c] = (() => {
      const [s, x] = canvas(128, 128), g = x.createRadialGradient(64, 64, 0, 64, 64, 64), h = hex(c);
      g.addColorStop(0, rgba([255, 255, 255], 1)); g.addColorStop(.12, rgba(h, .9)); g.addColorStop(.4, rgba(h, .28)); g.addColorStop(1, rgba(h, 0));
      x.fillStyle = g; x.fillRect(0, 0, 128, 128); return s;
    })());

    L.bg = ctx => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(bgc, 0, 0); ctx.restore(); };

    // a polyline in world units; opt: { dash: [on, off], cap, glow (cosmic: halo strength, default 1 for signal) }
    L.stroke = (ctx, pts, role, w, a = 1, opt = {}) => {
      if (!pts || pts.length < 2 || a <= 0.003) return;
      ctx.save();
      ctx.lineCap = opt.cap || 'round'; ctx.lineJoin = 'round';
      if (opt.dash) ctx.setLineDash(opt.dash);
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      const g = opt.glow ?? (role === 'signal' || role === 'amber' ? 1 : .5);
      if (D.glow && g > 0) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = col(C(role), .10 * a * g); ctx.lineWidth = w * 6; ctx.stroke();
        ctx.strokeStyle = col(C(role), .22 * a * g); ctx.lineWidth = w * 2.6; ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      }
      if (id === 'ink' && !opt.dash) { ctx.strokeStyle = col(C(role), .18 * a); ctx.lineWidth = w * 1.9; ctx.stroke(); }   // the ink's soft bleed
      ctx.strokeStyle = col(C(role), a); ctx.lineWidth = w; ctx.stroke();
      ctx.restore();
    };

    // a node of a network: a glowing star (cosmic), a ringed point (blueprint), an ink dot (ink)
    L.node = (ctx, x, y, r, role, a = 1) => {
      if (a <= 0.003) return;
      if (D.glow) { const s = r * 7; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(sprite(C(role)), x - s, y - s, s * 2, s * 2); ctx.restore(); return; }
      ctx.save(); ctx.globalAlpha = Math.min(1, a);
      if (id === 'blueprint') {
        ctx.strokeStyle = C(role); ctx.lineWidth = r * .45; ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, TAU); ctx.stroke();
        ctx.fillStyle = C(role); ctx.beginPath(); ctx.arc(x, y, r * .55, 0, TAU); ctx.fill();
      } else { ctx.fillStyle = C(role); ctx.beginPath(); ctx.arc(x, y, r * 1.15, 0, TAU); ctx.fill(); }
      ctx.restore();
    };

    // a spark travelling a path: a bright head (cosmic glows; the others draw a short solid dash)
    L.spark = (ctx, x, y, r, role, a = 1) => {
      if (a <= 0.003) return;
      ctx.save(); ctx.globalAlpha = Math.min(1, a);
      if (D.glow) { const s = r * 6; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(sprite(C(role)), x - s, y - s, s * 2, s * 2); }
      else { ctx.fillStyle = C(role); ctx.beginPath(); ctx.arc(x, y, r * .8, 0, TAU); ctx.fill(); }
      ctx.restore();
    };

    // the light of consciousness at (x, y), core radius r (world units), intensity k (0..1, more blooms)
    L.light = (ctx, x, y, r, k) => {
      if (k <= 0.003) return;
      const A = C('amber'); ctx.save();
      if (id === 'cosmic') {
        ctx.globalCompositeOperation = 'lighter';
        for (const [m, a] of [[16, .16], [7, .32], [3, .6]]) { const s = r * m * (.7 + .3 * Math.min(1, k)); ctx.globalAlpha = Math.min(1, a * k); ctx.drawImage(sprite(A), x - s, y - s, s * 2, s * 2); }
        ctx.globalAlpha = Math.min(1, k); ctx.fillStyle = '#fff6e0'; ctx.beginPath(); ctx.arc(x, y, r * .55, 0, TAU); ctx.fill();
      } else if (id === 'blueprint') {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 6); g.addColorStop(0, col(A, .28 * Math.min(1, k))); g.addColorStop(1, col(A, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 6, 0, TAU); ctx.fill();
        ctx.globalAlpha = Math.min(1, k);
        ctx.fillStyle = A; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
        ctx.strokeStyle = A; ctx.lineWidth = r * .18; ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, TAU); ctx.stroke();
        ctx.globalAlpha = Math.min(1, k) * .5; ctx.setLineDash([r * .5, r * .5]); ctx.beginPath(); ctx.arc(x, y, r * 3.6, 0, TAU); ctx.stroke();
      } else {
        ctx.globalCompositeOperation = 'multiply';
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 7); g.addColorStop(0, col(A, .75 * Math.min(1, k))); g.addColorStop(.35, col(A, .35 * Math.min(1, k))); g.addColorStop(1, col(A, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 7, 0, TAU); ctx.fill();
        ctx.strokeStyle = col(A, .25 * Math.min(1, k)); ctx.lineWidth = r * .25; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, TAU); ctx.stroke();   // the wash's dried edge
        ctx.fillStyle = col('#b85a12', .8 * Math.min(1, k)); ctx.beginPath(); ctx.arc(x, y, r * .7, 0, TAU); ctx.fill();
      }
      ctx.restore();
    };

    // text centred on (x, y) by default; size in world units; opt: { align, weight, base, glow }
    L.font = (size, weight = 600) => `${weight} ${size}px "${D.font}", "Nirmala UI", sans-serif`;
    L.text = (ctx, s, x, y, size, role = 'text', a = 1, opt = {}) => {
      if (a <= 0.003) return;
      ctx.save(); ctx.font = L.font(size, opt.weight || (id === 'ink' ? 600 : 600));
      ctx.textAlign = opt.align || 'center'; ctx.textBaseline = opt.base || 'middle';
      ctx.fillStyle = col(C(role), a);
      if (D.glow && opt.glow !== 0) { ctx.shadowColor = col(role === 'amber' ? C('amber') : '#7fa8ff', .55 * a); ctx.shadowBlur = size * .45 * (opt.glow ?? 1); }
      ctx.fillText(s, x, y); ctx.restore();
    };
    L.measure = (ctx, s, size, weight = 600) => { ctx.save(); ctx.font = L.font(size, weight); const w = ctx.measureText(s).width; ctx.restore(); return w; };

    // an old page centred on the origin (the caller translates and rotates), w × h world units
    L.sheet = (ctx, w, h, a = 1) => {
      if (a <= 0.003) return;
      ctx.save(); ctx.globalAlpha = a;
      if (id === 'ink') { ctx.shadowColor = 'rgba(70,45,20,.28)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; ctx.fillStyle = '#f7efde'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent'; ctx.strokeStyle = 'rgba(43,36,32,.35)'; ctx.lineWidth = 1.2; ctx.strokeRect(-w / 2, -h / 2, w, h); }
      else if (id === 'blueprint') {   // no corner ticks: broken marks read as the dashed "claim" line
        ctx.fillStyle = 'rgba(255,255,255,.035)'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.strokeStyle = C('line'); ctx.lineWidth = 1.6; ctx.strokeRect(-w / 2, -h / 2, w, h);
      } else {
        ctx.fillStyle = 'rgba(170,195,255,.055)'; ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(160,190,255,.12)'; ctx.lineWidth = 6; ctx.strokeRect(-w / 2, -h / 2, w, h);
        ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = 'rgba(190,210,255,.45)'; ctx.lineWidth = 1.4; ctx.strokeRect(-w / 2, -h / 2, w, h);
      }
      ctx.restore();
    };

    // a whole-screen fill: 'end' (the look's closing colour), 'flash' (the bloom) or 'dark' (death's darkening)
    L.fill = (ctx, which, a) => {
      if (a <= 0.003) return;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = Math.min(1, a);
      if (which === 'dark' && id === 'ink') {   // on paper, darkness gathers in from the edges
        const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .15, W / 2, H / 2, Math.hypot(W, H) * .6);
        g.addColorStop(0, rgba(hex(D.dark), .15)); g.addColorStop(1, rgba(hex(D.dark), .8)); ctx.fillStyle = g; ctx.globalCompositeOperation = 'multiply';
      } else ctx.fillStyle = D[which];
      ctx.fillRect(0, 0, W, H); ctx.restore();
    };

    L.post = ctx => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (id === 'ink') ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(VIG, 0, 0); ctx.restore(); };
    return L;
  }

  F.sciLook = sciLook;
  F.SCI_LOOKS = Object.keys(LOOKS).map(id => ({ id, name: LOOKS[id].name }));
})();
