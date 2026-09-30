// The 2.5D styles of বিচিত্র বিজ্ঞান (depth.js places things; a style paints them). F.style25(id, W, H):
//   'depth'    ঘ · cinematic depth: dark teal, glowing lines, bokeh, god rays, fog
//   'vector'   ঙ · vivid flat vector (Kurzgesagt-like): saturated gradients, two-tone shapes, sunbursts, soft shadows
//   'papercut' চ · layered paper diorama: cut paper at depth, every layer casting a soft shadow
// Plane painters (text, sheet, brain) draw around the origin in world units; point painters (node, spark, dust,
// light, rays) and the HUD draw in screen pixels.
(function () {
  'use strict';
  const F = FILM, D = F.depth, { TAU, canvas, rng, hex, rgba, clamp, vignette } = F;
  const col = (c, a = 1) => rgba(hex(c), a);

  const DEF = {
    depth: { name: 'ঘ · সিনেমাটিক ডেপথ', font: 'Hind Siliguri', add: true, vig: .55, end: '#000000', flash: '#fff1d8',
      col: { text: '#eefaff', line: '#a6e1ff', signal: '#5fe3ff', amber: '#ffb24d', dim: '#2f6a82' } },
    vector: { name: 'ঙ · রঙিন ভেক্টর', font: 'Hind Siliguri', add: false, vig: .28, end: '#1a1147', flash: '#fff3c4',
      col: { text: '#ffffff', line: '#ffffff', signal: '#3ff0d0', amber: '#ffc93c', dim: '#8f7cf0' }, nodes: ['#3ff0d0', '#ff5fa2', '#ffc93c', '#7aa7ff'] },
    papercut: { name: 'চ · কাগজের স্তর', font: 'Noto Serif Bengali', add: false, vig: .45, end: '#16222c', flash: '#ffe2a8',
      col: { text: '#f6ecd9', line: '#efe3cc', signal: '#9fe0d4', amber: '#f4a259', dim: '#7d98a3' } },
  };

  function style25(id, W, H) {
    const S = { id, ...DEF[id], W, H }, C = S.col, U = Math.min(W, H) / 1080, R0 = rng(31);

    // ─── background, baked a little larger than the frame so it can drift with the camera ───
    const M = .06, BW = Math.ceil(W * (1 + 2 * M)), BH = Math.ceil(H * (1 + 2 * M)), [bgc, bx] = canvas(BW, BH);
    const blob = (x, y, r, c, a) => { const g = bx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col(c, a)); g.addColorStop(1, col(c, 0)); bx.fillStyle = g; bx.fillRect(0, 0, BW, BH); };
    const lin = (stops) => { const g = bx.createLinearGradient(0, 0, 0, BH); stops.forEach(([o, c]) => g.addColorStop(o, c)); bx.fillStyle = g; bx.fillRect(0, 0, BW, BH); };
    if (id === 'depth') {
      lin([[0, '#061822'], [.55, '#0a2331'], [1, '#040f18']]);
      blob(BW * .5, BH * .45, BH * .7, '#1d5a70', .28); blob(BW * .2, BH * .2, BH * .5, '#16384f', .25); blob(BW * .85, BH * .75, BH * .5, '#20304f', .25);
    } else if (id === 'vector') {
      lin([[0, '#1b1150'], [.6, '#2c1760'], [1, '#431c6c']]);
      blob(BW * .15, BH * .85, BH * .6, '#ff5fa2', .2); blob(BW * .85, BH * .2, BH * .55, '#3ff0d0', .12); blob(BW * .6, BH * .6, BH * .5, '#7aa7ff', .14);
      for (let i = 0; i < 260; i++) { bx.fillStyle = `rgba(255,255,255,${.15 + R0() * .45})`; bx.beginPath(); bx.arc(R0() * BW, R0() * BH, (.6 + R0() * 1.6) * U, 0, TAU); bx.fill(); }
    } else {
      lin([[0, '#4f7890'], [1, '#3b6178']]);
      // concentric paper rings, lighter outside and darker inward, each casting a shadow on the next: a paper tunnel
      const cx = BW / 2, cy = BH / 2, shades = ['#44697f', '#355569', '#284455', '#1d3444', '#142632', '#0d1b24'];
      shades.forEach((c, i) => {
        const r = Math.hypot(BW, BH) * (.6 - i * .085), pts = [];
        for (let k = 0; k < 90; k++) { const a = k / 90 * TAU, n = F.noise1(k * .35 + i * 7, 5 + i) * .05; pts.push([cx + Math.cos(a) * r * (1 + n), cy + Math.sin(a) * r * .82 * (1 + n)]); }
        bx.save(); bx.shadowColor = 'rgba(0,0,0,.45)'; bx.shadowBlur = 28 * U; bx.shadowOffsetY = 10 * U;
        bx.fillStyle = c; bx.beginPath(); pts.forEach(([x, y], k) => k ? bx.lineTo(x, y) : bx.moveTo(x, y)); bx.closePath(); bx.fill(); bx.restore();
      });
      blob(cx, cy, BH * .45, '#ffcf7a', .07);   // a faint warmth at the far end
      for (let i = 0; i < 70; i++) {   // paper stars, cut and pinned at the back
        const x = R0() * BW, y = R0() * BH, r = (1.5 + R0() * 3) * U;
        bx.save(); bx.shadowColor = 'rgba(0,0,0,.5)'; bx.shadowBlur = 4 * U; bx.shadowOffsetY = 2 * U; bx.fillStyle = `rgba(246,236,217,${.35 + R0() * .45})`; bx.beginPath(); bx.arc(x, y, r, 0, TAU); bx.fill(); bx.restore();
      }
      const fib = bx.createPattern(F.fibreTile(17), 'repeat'); bx.globalAlpha = .35; bx.fillStyle = fib; bx.fillRect(0, 0, BW, BH); bx.globalAlpha = 1;
    }
    S.bg = (ctx, v) => {   // drifts a few pixels against the camera: the farthest layer of all
      const ox = clamp(-(v.x || 0) * .02 * U, -W * M, W * M), oy = clamp(-(v.y || 0) * .012 * U, -H * M, H * M);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(bgc, -W * M + ox, -H * M + oy); ctx.restore();
    };

    // ─── sprites for points: neurons, sparks, dust ───
    const glowDisc = (c, core = '#ffffff') => (x, r) => { const g = x.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, core); g.addColorStop(.18, col(c, .95)); g.addColorStop(.45, col(c, .35)); g.addColorStop(1, col(c, 0)); x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill(); };
    const flatDisc = c => (x, r) => {
      const g = x.createRadialGradient(0, 0, r * .4, 0, 0, r * 1.15); g.addColorStop(0, col(c, .28)); g.addColorStop(1, col(c, 0)); x.fillStyle = g; x.beginPath(); x.arc(0, 0, r * 1.15, 0, TAU); x.fill();   // soft halo
      x.fillStyle = c; x.beginPath(); x.arc(0, 0, r * .55, 0, TAU); x.fill();
      x.save(); x.beginPath(); x.arc(0, 0, r * .55, 0, TAU); x.clip(); x.fillStyle = 'rgba(255,255,255,.38)'; x.beginPath(); x.arc(-r * .2, -r * .2, r * .42, 0, TAU); x.fill(); x.restore();   // lit side
    };
    const paperDisc = (c, sh = .5) => (x, r) => { x.shadowColor = `rgba(0,0,0,${sh})`; x.shadowBlur = r * .35; x.shadowOffsetX = r * .12; x.shadowOffsetY = r * .2; x.fillStyle = c; x.beginPath(); x.arc(0, 0, r * .6, 0, TAU); x.fill(); };
    const NODE = id === 'depth' ? [D.sprites(glowDisc('#6fd8ff'))]
      : id === 'vector' ? S.nodes.map(c => D.sprites(flatDisc(c)))
        : [D.sprites(paperDisc('#efe3cc')), D.sprites(paperDisc('#9fe0d4'))];
    const SPARK = D.sprites(id === 'depth' ? glowDisc('#8ff0ff') : id === 'vector' ? glowDisc('#3ff0d0', '#eafffb') : paperDisc('#ffd166', .4));
    const DUST = D.sprites(id === 'depth' ? glowDisc('#ffdcae', '#fff6ea') : id === 'vector' ? flatDisc('#ffffff') : paperDisc('#f6ecd9', .35));
    const add = (ctx, f) => { ctx.save(); if (S.add) ctx.globalCompositeOperation = 'lighter'; f(); ctx.restore(); };
    S.node = (ctx, i, sx, sy, rr, b, a) => add(ctx, () => D.bokeh(ctx, NODE[i % NODE.length], sx, sy, rr * (id === 'depth' ? 3.2 : 1.9), b, a));
    S.spark = (ctx, sx, sy, rr, b, a) => add(ctx, () => D.bokeh(ctx, SPARK, sx, sy, rr * (id === 'papercut' ? 1.6 : 3), b, a));
    S.dust = (ctx, sx, sy, rr, b, a) => add(ctx, () => D.bokeh(ctx, DUST, sx, sy, rr, b, a));

    // links between neurons, batched: list of [x1, y1, cx, cy, x2, y2, alpha] in screen px; w px
    S.edges = (ctx, list, w) => {
      const buckets = new Map(); for (const e of list) { const q = Math.min(6, Math.round(e[6] * 6)); if (q < 1) continue; if (!buckets.has(q)) buckets.set(q, []); buckets.get(q).push(e); }
      const path = (es, dx = 0, dy = 0) => { ctx.beginPath(); for (const e of es) { ctx.moveTo(e[0] + dx, e[1] + dy); ctx.quadraticCurveTo(e[2] + dx, e[3] + dy, e[4] + dx, e[5] + dy); } };
      ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = w;
      for (const [q, es] of buckets) {
        const a = q / 6;
        if (id === 'depth') { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = col('#4fb8e0', .5 * a); path(es); ctx.stroke(); }
        else if (id === 'vector') { ctx.strokeStyle = col('#9d8cff', .5 * a); path(es); ctx.stroke(); }
        else { ctx.strokeStyle = `rgba(0,0,0,${.35 * a})`; path(es, 1.5 * U, 2.2 * U); ctx.stroke(); ctx.strokeStyle = col('#e9dcc4', .75 * a); path(es); ctx.stroke(); }
      }
      ctx.restore();
    };

    // the light of consciousness: r = on-screen core radius (px), k = intensity (1 normal, more blooms)
    S.light = (ctx, sx, sy, r, k) => {
      if (k <= .003) return;
      const kk = Math.min(1, k), grow = .7 + .3 * kk + .5 * Math.max(0, k - 1);
      ctx.save();
      if (id === 'depth') {
        ctx.globalCompositeOperation = 'lighter';
        for (const [m, a] of [[22, .14], [9, .3], [3.5, .65]]) { const rr = r * m * grow, g = ctx.createRadialGradient(sx, sy, 0, sx, sy, rr); g.addColorStop(0, col('#ffb24d', a * kk)); g.addColorStop(1, col('#ffb24d', 0)); ctx.fillStyle = g; ctx.fillRect(sx - rr, sy - rr, 2 * rr, 2 * rr); }
        ctx.fillStyle = col('#fff6e2', kk); ctx.beginPath(); ctx.arc(sx, sy, r * .8, 0, TAU); ctx.fill();
      } else if (id === 'vector') {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 14 * grow); g.addColorStop(0, col('#ffc93c', .35 * kk)); g.addColorStop(1, col('#ff5fa2', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, r * 14 * grow, 0, TAU); ctx.fill();
        for (const [m, c, a] of [[6.5, '#ff6b6b', .22], [4.4, '#ff9f43', .45], [2.8, '#ffc93c', .95], [1.5, '#fff3c4', 1]]) { ctx.fillStyle = col(c, a * kk); ctx.beginPath(); ctx.arc(sx, sy, r * m * grow, 0, TAU); ctx.fill(); }
      } else {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 12 * grow); g.addColorStop(0, col('#ffcf7a', .3 * kk)); g.addColorStop(1, col('#ffcf7a', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, r * 12 * grow, 0, TAU); ctx.fill();
        ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = r * .9; ctx.shadowOffsetX = r * .2; ctx.shadowOffsetY = r * .35;
        for (const [m, c] of [[5.6, '#e76f51'], [4, '#f4a259'], [2.6, '#ffd166'], [1.3, '#fff1c9']]) { ctx.fillStyle = col(c, kk); ctx.beginPath(); ctx.arc(sx, sy, r * m * grow, 0, TAU); ctx.fill(); }
      }
      ctx.restore();
    };
    // rays from the light: god rays (depth), a sunburst (vector), paper rays (papercut); t turns them slowly
    S.rays = (ctx, sx, sy, r, k, t) => {
      if (k <= .003) return;
      const L = Math.hypot(W, H), n = id === 'vector' ? 12 : id === 'depth' ? 22 : 14;
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(t * (id === 'vector' ? .05 : .025));
      if (id === 'papercut') { ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = r * .8; ctx.shadowOffsetY = r * .3; }
      for (let i = 0; i < n; i++) {
        const a = i / n * TAU, h = F.hash(i, 77), len = id === 'papercut' ? r * (9 + 5 * h) : L * (.35 + .5 * h), wd = (id === 'depth' ? .018 + .03 * h : id === 'vector' ? TAU / n / 2 : .07) ;
        ctx.beginPath(); ctx.moveTo(Math.cos(a - wd) * r * 2, Math.sin(a - wd) * r * 2); ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len); ctx.lineTo(Math.cos(a + wd) * r * 2, Math.sin(a + wd) * r * 2); ctx.closePath();
        if (id === 'depth') { const g = ctx.createRadialGradient(0, 0, r, 0, 0, len); g.addColorStop(0, col('#ffcf8a', .16 * k * (.5 + h))); g.addColorStop(1, col('#ffcf8a', 0)); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; }
        else if (id === 'vector') { const g = ctx.createRadialGradient(0, 0, r, 0, 0, len); g.addColorStop(0, col('#ffc93c', (i % 2 ? .05 : .11) * k)); g.addColorStop(1, col('#ffc93c', 0)); ctx.fillStyle = g; }
        else ctx.fillStyle = col(i % 2 ? '#ffd166' : '#f4a259', .9 * Math.min(1, k));
        ctx.fill();
      }
      ctx.restore();
    };

    // ─── plane painters (world units around the origin; shadows scaled by the current transform) ───
    const scaleOf = ctx => { const m = ctx.getTransform(); return Math.hypot(m.a, m.b); };
    const shadow = (ctx, blur, ox, oy, c) => { const k = scaleOf(ctx); ctx.shadowColor = c; ctx.shadowBlur = blur * k; ctx.shadowOffsetX = ox * k; ctx.shadowOffsetY = oy * k; };
    S.fontOf = (size, weight = 700) => `${weight} ${size}px "${S.font}", "Nirmala UI", sans-serif`;
    S.measure = (ctx, s, size, weight = 700) => { ctx.save(); ctx.font = S.fontOf(size, weight); const w = ctx.measureText(s).width; ctx.restore(); return w; };
    S.text = (ctx, s, size, a = 1, opt = {}) => {
      if (a <= .004) return;
      ctx.save(); ctx.font = S.fontOf(size, opt.weight || 700); ctx.textAlign = opt.align || 'center'; ctx.textBaseline = 'middle';
      const gl = opt.glow ?? 1;   // how much halo: 1 the style's own, less for quiet captions
      if (id === 'depth') shadow(ctx, size * .5 * gl, 0, 0, col('#5fc8ff', .6 * a * Math.min(1, gl + .2)));
      else if (id === 'vector') shadow(ctx, size * .22 * gl, 0, size * .07 * gl, 'rgba(20,0,60,.5)');
      else shadow(ctx, size * .16 * gl, size * .05 * gl, size * .09 * gl, 'rgba(0,0,0,.6)');
      // opt.body: centre the letters' body (the headline to the baseline) on y = 0. 'middle' centres the font's em box,
      // and a Bengali font's tall descent leaves the letters sitting high in a pill (director, 2026-09-29)
      let y = 0; if (opt.body) { ctx.textBaseline = 'alphabetic'; const m = ctx.measureText('কম'); y = (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2; }
      ctx.fillStyle = col(C[opt.role || 'text'], a); ctx.fillText(s, 0, y); ctx.restore();
    };

    // a tag behind a label (w × h world units), so it reads over anything behind it
    S.tag = (ctx, w, h, a = 1) => {
      if (a <= .004) return;
      ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-w / 2, -h / 2, w, h, h / 2) : ctx.rect(-w / 2, -h / 2, w, h);
      if (id === 'depth') { ctx.fillStyle = 'rgba(4,22,32,.6)'; ctx.fill(); ctx.strokeStyle = 'rgba(120,220,255,.35)'; ctx.lineWidth = 1.5; ctx.stroke(); }
      else if (id === 'vector') { shadow(ctx, 18, 0, 8, 'rgba(15,0,50,.4)'); ctx.fillStyle = '#2a1668'; ctx.fill(); }
      else { shadow(ctx, 10, 4, 6, 'rgba(0,0,0,.5)'); ctx.fillStyle = '#1d3444'; ctx.fill(); }
      ctx.restore();
    };

    // an old page, baked once per seed at twice its size: w × h world units, lines = scribbles around its centre
    const SHEETS = {};
    function bakeSheet(w, h, lines, seed) {
      const pad = 40, k = 2, [c, x] = canvas((w + 2 * pad) * k, (h + 2 * pad) * k);
      x.scale(k, k); x.translate(pad + w / 2, pad + h / 2);
      const rect = () => { x.beginPath(); x.roundRect ? x.roundRect(-w / 2, -h / 2, w, h, id === 'vector' ? 10 : 2) : x.rect(-w / 2, -h / 2, w, h); };
      if (id === 'depth') {
        rect(); x.fillStyle = 'rgba(150,220,255,.08)'; x.fill();
        x.shadowColor = 'rgba(95,227,255,.8)'; x.shadowBlur = 14; x.strokeStyle = 'rgba(170,232,255,.75)'; x.lineWidth = 1.6; rect(); x.stroke(); x.shadowBlur = 0;
        x.strokeStyle = 'rgba(190,235,255,.5)';
      } else if (id === 'vector') {
        x.shadowColor = 'rgba(15,0,50,.45)'; x.shadowBlur = 30; x.shadowOffsetY = 14; rect(); x.fillStyle = '#fff4e0'; x.fill();
        x.shadowColor = 'transparent'; x.save(); rect(); x.clip(); x.fillStyle = ['#ff5fa2', '#3ff0d0', '#ffc93c', '#7aa7ff'][seed % 4]; x.fillRect(-w / 2, -h / 2, w, h * .1); x.restore();
        x.strokeStyle = '#9a8266';
      } else {
        x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 22; x.shadowOffsetX = 8; x.shadowOffsetY = 12; rect(); x.fillStyle = '#f1e3ca'; x.fill();
        x.shadowColor = 'transparent'; x.save(); rect(); x.clip(); x.globalAlpha = .35; x.fillStyle = x.createPattern(F.fibreTile(23), 'repeat'); x.fillRect(-w / 2, -h / 2, w, h); x.restore();
        x.strokeStyle = '#9c8f7a';
      }
      x.lineWidth = 1.7; x.lineCap = 'round';
      for (const pl of lines) { x.beginPath(); pl.forEach(([px, py], i) => i ? x.lineTo(px, py) : x.moveTo(px, py)); x.stroke(); }
      return { c, pad, w, h };
    }
    S.sheet = (ctx, w, h, lines, seed) => {
      const s = SHEETS[seed] || (SHEETS[seed] = bakeSheet(w, h, lines, seed));
      ctx.drawImage(s.c, -w / 2 - s.pad, -h / 2 - s.pad, w + 2 * s.pad, h + 2 * s.pad);
    };

    // the brain in 2.5D layers (B = FILM.sci.brain(s, 0, 0)): 'back', 'under' (cerebellum and brainstem), 'cerebrum',
    // 'sulci'. k: how much is drawn (0..1), or for 'sulci' a function of the sulcus index.
    const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
    const line = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); };
    const stemPoly = B => [...B.stem[0].pts, ...B.stem[1].pts.slice().reverse()];
    const glowLine = (ctx, pts, c, w, a) => { if (pts.length < 2 || a <= .004) return; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'lighter'; line(ctx, pts); ctx.strokeStyle = col(c, .12 * a); ctx.lineWidth = w * 6; ctx.stroke(); ctx.strokeStyle = col(c, .25 * a); ctx.lineWidth = w * 2.6; ctx.stroke(); ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = col(c, a); ctx.lineWidth = w; ctx.stroke(); ctx.restore(); };
    S.brain = (ctx, part, B, k, a = 1) => {
      const P = F.sci.part, kk = typeof k === 'function' ? k : () => k;
      ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (part === 'back') {
        if (id === 'depth') { const g = ctx.createRadialGradient(0, -40, 0, 0, -40, 620); g.addColorStop(0, col('#1f7a96', .38 * kk())); g.addColorStop(1, col('#1f7a96', 0)); ctx.fillStyle = g; ctx.fillRect(-620, -660, 1240, 1240); }
        else if (id === 'vector') { ctx.globalAlpha *= kk(); ctx.fillStyle = col('#ff5fa2', .2); ctx.beginPath(); ctx.arc(-40, -30, 520, 0, TAU); ctx.fill(); ctx.fillStyle = col('#7aa7ff', .16); ctx.beginPath(); ctx.arc(90, 40, 430, 0, TAU); ctx.fill(); }
        else { ctx.globalAlpha *= kk(); shadow(ctx, 30, 10, 16, 'rgba(0,0,0,.5)'); ctx.fillStyle = '#2b4556'; ctx.beginPath(); ctx.ellipse(0, 0, 560, 470, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#335468'; ctx.beginPath(); ctx.ellipse(0, 0, 470, 395, 0, 0, TAU); ctx.fill(); }
      } else if (part === 'under') {
        if (id === 'depth') { glowLine(ctx, P(B.cerebellum, kk()), '#a6e1ff', 2.6, 1); B.stem.forEach(p => glowLine(ctx, P(p, kk()), '#a6e1ff', 2.6, 1)); B.folia.forEach(p => glowLine(ctx, P(p, kk()), '#a6e1ff', 1.6, .8)); }
        else {
          ctx.globalAlpha *= kk(); const pap = id === 'papercut';
          if (pap) shadow(ctx, 16, 6, 10, 'rgba(0,0,0,.45)');
          ctx.fillStyle = pap ? '#c99a94' : '#b23c72'; poly(ctx, stemPoly(B)); ctx.fill();
          ctx.fillStyle = pap ? '#e2aba5' : '#d94c86'; poly(ctx, B.cerebellum.pts); ctx.fill();
          ctx.shadowColor = 'transparent'; ctx.strokeStyle = pap ? '#9b6a6c' : '#9e2f63'; ctx.lineWidth = pap ? 3 : 5; B.folia.forEach(p => { line(ctx, p.pts); ctx.stroke(); });
        }
      } else if (part === 'cerebrum') {
        if (id === 'depth') glowLine(ctx, P(B.outline, kk()), '#a6e1ff', 3.4, 1);
        else {
          const o = B.outline.pts, bx = F.bounds(o), pap = id === 'papercut', v = kk();
          ctx.save(); ctx.globalAlpha *= v; ctx.translate(0, 0); ctx.scale(.94 + .06 * v, .94 + .06 * v);
          if (pap) shadow(ctx, 22, 9, 14, 'rgba(0,0,0,.5)'); else shadow(ctx, 30, 0, 16, 'rgba(25,0,60,.45)');
          const g = ctx.createLinearGradient(0, bx.y0, 0, bx.y1);
          if (pap) { g.addColorStop(0, '#f6d8d2'); g.addColorStop(1, '#e8bcb4'); } else { g.addColorStop(0, '#ffa3cb'); g.addColorStop(1, '#e0588f'); }
          ctx.fillStyle = g; poly(ctx, o); ctx.fill(); ctx.shadowColor = 'transparent';
          if (!pap) { ctx.strokeStyle = 'rgba(255,215,232,.9)'; ctx.lineWidth = 6; line(ctx, P(B.outline, .42)); ctx.stroke(); }   // the rim light along the top
          ctx.restore();
        }
      } else if (part === 'sulci') {
        B.sulci.forEach((p, i) => {
          const pts = P(p, kk(i)); if (pts.length < 2) return;
          if (id === 'depth') glowLine(ctx, pts, '#a6e1ff', 2, .85);
          else if (id === 'vector') { ctx.strokeStyle = '#b8436e'; ctx.lineWidth = 7; line(ctx, pts); ctx.stroke(); }
          else { ctx.strokeStyle = '#a36f73'; ctx.lineWidth = 4.5; line(ctx, pts); ctx.stroke(); ctx.strokeStyle = 'rgba(255,240,236,.9)'; ctx.lineWidth = 1.6; ctx.save(); ctx.translate(-1.6, -1.6); line(ctx, pts); ctx.stroke(); ctx.restore(); }
        });
      }
      ctx.restore();
    };
    // a scan slice at x (plane units) from y0 to y1
    // (both ends fade into the background: a hard-cut end read as a mistake, director 2026-09-29)
    S.scan = (ctx, x, y0, y1, a) => {
      if (a <= .004) return;
      const cy = (y0 + y1) / 2, hh = (y1 - y0) / 2;
      ctx.save(); if (S.add) ctx.globalCompositeOperation = 'lighter';
      ctx.save(); ctx.translate(x, cy); ctx.scale(90 / hh, 1);   // the band: an elliptical glow, soft on every side
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, hh); g.addColorStop(0, col(C.signal, .24 * a)); g.addColorStop(.6, col(C.signal, .12 * a)); g.addColorStop(1, col(C.signal, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, hh, 0, TAU); ctx.fill(); ctx.restore();
      const l = ctx.createLinearGradient(0, y0, 0, y1); l.addColorStop(0, col(C.signal, 0)); l.addColorStop(.22, col(C.signal, .95 * a)); l.addColorStop(.78, col(C.signal, .95 * a)); l.addColorStop(1, col(C.signal, 0));
      ctx.strokeStyle = l; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore();
    };
    // a dashed ring (the unknown) of radius r, drawn to fraction k
    S.ring = (ctx, r, k, a) => {
      if (a <= .004 || k <= 0) return;
      ctx.save(); ctx.setLineDash([9, 9]); ctx.lineWidth = 3; ctx.strokeStyle = col(C.amber, a); if (id === 'papercut') shadow(ctx, 6, 2, 3, 'rgba(0,0,0,.5)');
      ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + k * TAU); ctx.stroke(); ctx.restore();
    };

    // ─── screen space: the HUD (heart trace, timeline), fills, grade ───
    S.hud = (ctx, pts, w, a, role = 'signal') => {
      if (pts.length < 2 || a <= .004) return;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const c = C[role] || role;
      if (id === 'depth') { glowLine(ctx, pts, c, w, a); ctx.restore(); return; }
      if (id === 'papercut') { ctx.strokeStyle = `rgba(0,0,0,${.4 * a})`; ctx.lineWidth = w; ctx.save(); ctx.translate(2 * U, 3 * U); line(ctx, pts); ctx.stroke(); ctx.restore(); }
      else { ctx.shadowColor = col(c, .6 * a); ctx.shadowBlur = 10 * U; }
      ctx.strokeStyle = col(c, a); ctx.lineWidth = w; line(ctx, pts); ctx.stroke(); ctx.restore();
    };
    S.hudText = (ctx, s, x, y, size, a, role = 'text', weight = 600) => {
      if (a <= .004) return;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, x, y); S.text(ctx, s, size, a, { role, weight }); ctx.restore();
    };
    S.fill = (ctx, which, a) => { if (a <= .003) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = S[which] || which; ctx.fillRect(0, 0, W, H); ctx.restore(); };
    const VIG = vignette(W, H, S.vig);
    const FIB = id === 'papercut' ? (() => { const [c, x] = canvas(W, H); x.fillStyle = x.createPattern(F.fibreTile(29), 'repeat'); x.fillRect(0, 0, W, H); return c; })() : null;
    // bloom: the bright parts of the frame, picked out by a steep contrast, blurred at quarter size and added back
    const BLOOM = { depth: .55, vector: .22, papercut: 0 }[id], BL = BLOOM ? canvas(Math.ceil(W / 4), Math.ceil(H / 4)) : null;
    S.post = ctx => {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (BL) {
        const [bc, bb] = BL; bb.globalCompositeOperation = 'copy'; bb.filter = `brightness(1.05) contrast(3.2) blur(${(3 * U).toFixed(1)}px)`;
        bb.drawImage(ctx.canvas, 0, 0, bc.width, bc.height); bb.filter = 'none';
        ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = BLOOM; ctx.drawImage(bc, 0, 0, W, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      }
      ctx.drawImage(VIG, 0, 0);
      if (FIB) { ctx.globalAlpha = .22; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(FIB, 0, 0); }
      ctx.restore();
    };
    return S;
  }
  F.style25 = style25;
  F.STYLES25 = Object.keys(DEF).map(id => ({ id, name: DEF[id].name }));
})();
