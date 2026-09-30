// Scene 01 · The question (0:00.000–0:36.033 of voice/Death.mp3), plan v2 (plan/scenes.js): the three 2.5D styles
// mixed by context. ঘ cinematic depth (0–8.0, v2 2026-09-30): a person's last moments in a dark hospital room, the
// heart's trace stopping, the brain's waves running flat and collapsing into the light; (8.0–16.4) the last light with
// its memories. চ papercut (16.4–24.9): a river of time back through 4,000 years to the ancient monuments. ঙ vivid
// vector (24.9–33.8): a lens redraws the paper world, an MRI ring slices the brain into a deck. ঘ again for the dive
// into the light, the flash and the title. v1 (the brain of lights going dark) is film.old-style.js.
(function () {
  'use strict';
  const F = FILM, S = F.sci, D = F.depth, { clamp, smooth, easeIO, easeOut, easeIn, lerp, env, keyed, noise1, hash, rng, TAU } = F;
  const ID = 'scene-01', T = window.TIMING[ID], DUR = T.duration;
  const { W, H, portrait: P } = F.format(), U = Math.min(W, H) / 1080;
  const YD = F.style25('depth', W, H), YV = F.style25('vector', W, H), YP = F.style25('papercut', W, H);

  // when a word starts (its n-th time in the scene); punctuation ignored, NFC folds the two spellings of য়
  const norm = s => s.normalize('NFC').replace(/[।,?!—'"()\s]/g, '');
  const w = (word, n = 1) => { let k = 0; for (const x of T.words) if (norm(x[0]) === norm(word) && ++k === n) return x[1]; throw new Error(`${ID}: no word "${word}" (${n})`); };
  const FREEZE = w('শেষ?'), STOP0 = w('মস্তিষ্কের'), STOP1 = w('যায়', 2) + .45, MEM = w('স্মৃতি'), FEEL = w('অনুভূতি'), SELF = w('নিজের'), DIM0 = w('সম্পূর্ণভাবে');
  const PAPER = w('প্রশ্নটি'), YEARS = w('হাজার'), RELIG = w('ধর্ম'), PHIL = w('দর্শন'), LIT_ = w('সাহিত্যে'), ANSWER = w('উত্তর'), LENS = w('কিন্তু', 2), MODERN = w('আধুনিক');
  const SLICE = w('আরেকভাবে'), LIT = w('চেতনা', 2), ASK = w('কী'), PUSH = w('আর', 2) + .18, MYST = w('রহস্য'), CUT = 35.1;

  const inside = (pts, x, y) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };

  // ═══ A · the brain of lights (ঘ, 0–16.4) ═══════════════════════════════════
  // A human brain (side view, lib/science.js) filled with glowing neurons in depth, rounded like the real thing.
  const BS = 470, BRN = S.brain(BS, 0, 0);
  const CLOUD = (() => {
    const r = rng(5), nodes = [], stemPoly = [...BRN.stem[0].pts, ...BRN.stem[1].pts.slice().reverse()];
    const fill = (poly, n, thick, kind) => {
      const b = F.bounds(poly); let k = 0, guard = 0;
      while (k < n && guard++ < n * 60) {
        const x = b.x0 + r() * b.w, y = b.y0 + r() * b.h; if (!inside(poly, x, y)) continue;
        const nx = (x - b.cx) / (b.w / 2), ny = (y - b.cy) / (b.h / 2), z = (r() * 2 - 1) * thick * Math.sqrt(Math.max(.05, 1 - (nx * nx + ny * ny) * .6));
        nodes.push({ x, y, z, kind, size: .7 + r() * .8, tw: r() * 10 }); k++;
      }
    };
    fill(BRN.outline.pts, 780, 230, 0); fill(BRN.cerebellum.pts, 110, 110, 1); fill(stemPoly, 45, 50, 2);
    // the light of consciousness: the neuron nearest the brain's symbol spot, brought to the front
    let li = 0, best = Infinity; nodes.forEach((n, i) => { const d = Math.hypot(n.x - BRN.centre[0], n.y - BRN.centre[1]); if (n.kind === 0 && d < best) { best = d; li = i; } });
    nodes[li].z = -70;
    const b = F.bounds(nodes.map(n => [n.x, n.y])), stem = [.2 * BS, .42 * BS];
    nodes.forEach((n, i) => {
      // the blackout rolls from the back of the brain to the front, patchy like districts of a city
      const sweep = clamp(.72 * (b.x1 - n.x) / b.w + .28 * (.5 + .5 * noise1(n.y / 140 + n.x / 260, 8)));
      n.off = STOP0 + (STOP1 - STOP0 - .6) * (1 - sweep) + hash(i, 4) * .25;
      n.dStem = Math.hypot(n.x - stem[0], n.y - stem[1], n.z);
    });
    const edges = [];
    nodes.forEach((a, i) => nodes.map((q, j) => [j, Math.hypot(a.x - q.x, a.y - q.y, a.z - q.z)]).filter(([j, d]) => j > i && d < 95).sort((p, q) => p[1] - q[1]).slice(0, 2)
      .forEach(([j]) => edges.push({ a: i, b: j, period: 1.2 + hash(i, j) * 2.2, phase: hash(j, i), spark: hash(i + 7, j) < .35 })));
    return { nodes, edges, li };
  })();
  const LP = CLOUD.nodes[CLOUD.li];

  // the camera: from right up against the light, a pull-back that stops dead on "শেষ?"; a slow drift through the
  // heartbeat and the blackout; then a glide down to the last light and a slow orbit around it (since v2 the hook
  // covers 0–7.2, so only the drift's end, the glide and the orbit are seen)
  const A_END = { x: 0, y: 20, z: P ? -1500 : -960 }, GLIDE0 = STOP1 + .05, GLIDE1 = GLIDE0 + 1.7;   // the narrow 4:5 frame sees the brain from farther
  function camA(t) {
    let x, y, z, focus, ap = 34;
    if (t < FREEZE) {
      const e = easeOut(clamp((t - .05) / (FREEZE - .05)), 3), d0 = 40, d1 = LP.z - A_END.z, dz = d0 * Math.pow(d1 / d0, e);
      x = lerp(LP.x, A_END.x, smooth(e)); y = lerp(LP.y, A_END.y, smooth(e)); z = LP.z - dz; focus = dz;
    } else if (t < GLIDE0) {
      const k = smooth((t - FREEZE) / (GLIDE0 - FREEZE)); x = 40 * Math.sin((t - FREEZE) * .35); y = A_END.y; z = A_END.z + 70 * k; focus = -z;
    } else if (t < GLIDE1) {
      const k = easeIO((t - GLIDE0) / (GLIDE1 - GLIDE0)), x0 = 40 * Math.sin((GLIDE0 - FREEZE) * .35), z0 = A_END.z + 70;
      x = lerp(x0, LP.x, k); y = lerp(A_END.y, LP.y - 60, k); z = lerp(z0, LP.z - 720, k); focus = lerp(-z0, 720, k);
    } else {
      const u = t - GLIDE1; x = LP.x + (P ? 35 : 110) * Math.sin(u * .3); y = LP.y - 60 - 10 * Math.sin(u * .2); z = LP.z - lerp(720, 620, clamp(u / 6.8)); focus = LP.z - z;
    }
    return D.view({ x, y, z, focus: Math.max(30, focus), aperture: ap }, W, H);
  }

  // the light of consciousness itself, through segment A
  function kLight(t) {
    let k = lerp(.75, 1, smooth((t - (STOP1 - .6)) / 1));
    k *= 1 - .6 * smooth((t - DIM0) / 1.6);
    return k * (1 + .35 * noise1(t * 13, 9) * env(t, DIM0 + .7, DIM0 + 1.1, DIM0 + 1.9, PAPER + .3));
  }

  // dust in a box that travels with the camera (wrapped, faded at its edges)
  const MOTES = Array.from({ length: 150 }, (_, i) => ({ x: (hash(i, 1) - .5) * 3600, y: (hash(i, 2) - .5) * 2400, z: hash(i, 3) * 3200, r: 2 + hash(i, 4) * 4, ph: hash(i, 5) * 10 }));
  const wrap = (a, span) => ((a % span) + span * 1.5) % span - span / 2;
  function drawDust(ctx, Y, v, t, a) {
    if (a <= 0) return;
    for (const m of MOTES) {
      const dx = wrap(m.x + 30 * noise1(t * .15 + m.ph, 3) - v.x, 3600), dy = wrap(m.y + 20 * noise1(t * .12 + m.ph, 4) - v.y, 2400), dz = ((m.z - v.z) % 3200 + 3200) % 3200 + 120;
      const p = D.proj(v, v.x + dx, v.y + dy, v.z + dz); if (!p) continue;
      const fade = smooth((dz - 120) / 300) * (1 - smooth((dz - 2800) / 400)) * smooth((1800 - Math.abs(dx)) / 300) * smooth((1200 - Math.abs(dy)) / 250);
      Y.dust(ctx, p.x, p.y, m.r * p.s, D.coc(v, p.d), .55 * a * fade * (1 - .6 * D.fog(v, p.d)));
    }
  }

  // ─── memories: four glowing panes of moments with no people in them, around the last light (10.1–16) ───
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); };
  const lg = (c, y0, y1, stops) => { const g = c.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, s]) => g.addColorStop(o, s)); return g; };
  const glow = (c, x, y, r, col, a) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, F.rgba(F.hex(col), a)); g.addColorStop(1, F.rgba(F.hex(col), 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const PANES = [
    { name: 'rain', dx: -360, dy: -190, dz: 40, draw(c, w, h, t) {   // rain on a window at night, the city blurred behind it
      c.fillStyle = lg(c, -h / 2, h / 2, [[0, '#1c2c3d'], [1, '#0d1620']]); c.fillRect(-w / 2, -h / 2, w, h);
      for (let i = 0; i < 9; i++) glow(c, -w / 2 + hash(i, 1) * w, -h / 4 + hash(i, 2) * h * .7, 14 + hash(i, 3) * 20, i % 3 ? '#ffb86b' : '#7fd3ff', .45);
      c.strokeStyle = 'rgba(200,225,255,.35)'; c.lineWidth = 1.2;
      for (let i = 0; i < 18; i++) { const x = -w / 2 + hash(i, 5) * w, y = ((hash(i, 6) * (h + 40) + t * 240) % (h + 40)) - h / 2 - 20; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 4, y + 16); c.stroke(); }
      for (let i = 0; i < 10; i++) { const x = -w / 2 + hash(i, 8) * w, y = -h / 2 + ((hash(i, 9) * h + t * 8 * (1 + hash(i, 10))) % h), r = 2 + hash(i, 11) * 3; c.fillStyle = 'rgba(210,235,255,.35)'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(x - r * .3, y - r * .3, r * .35, 0, TAU); c.fill(); }
    } },
    { name: 'kite', dx: 330, dy: -230, dz: 120, draw(c, w, h, t) {   // a kite high in an evening sky
      c.fillStyle = lg(c, -h / 2, h / 2, [[0, '#4e4290'], [.6, '#c0607a'], [1, '#d99a62']]); c.fillRect(-w / 2, -h / 2, w, h);
      c.fillStyle = 'rgba(255,255,255,.22)'; for (const [x, y, s] of [[-60, -30, 1], [55, 25, .8]]) { c.beginPath(); c.ellipse(x + 6 * Math.sin(t * .3), y, 38 * s, 10 * s, 0, 0, TAU); c.fill(); }
      const kx = 20 + 8 * Math.sin(t * 1.1), ky = -18 + 5 * Math.cos(t * 1.4), ang = .15 * Math.sin(t * 1.3);
      c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(kx, ky + 22); c.quadraticCurveTo(-30, 40, -w / 2, h / 2); c.stroke();
      c.beginPath(); for (let i = 0; i <= 20; i++) { const u = i / 20, x = kx - 4 - u * 40, y = ky + 22 + u * 55 + 6 * Math.sin(u * 9 - t * 5); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.strokeStyle = '#ffe08a'; c.lineWidth = 1.5; c.stroke();
      c.save(); c.translate(kx, ky); c.rotate(ang);
      c.fillStyle = '#ff5a5a'; c.beginPath(); c.moveTo(0, -24); c.lineTo(16, 0); c.lineTo(0, 24); c.closePath(); c.fill();
      c.fillStyle = '#ffd166'; c.beginPath(); c.moveTo(0, -24); c.lineTo(-16, 0); c.lineTo(0, 24); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(90,40,30,.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, -24); c.lineTo(0, 24); c.moveTo(-16, 0); c.lineTo(16, 0); c.stroke(); c.restore();
    } },
    { name: 'shore', dx: -430, dy: 5, dz: 160, draw(c, w, h, t) {   // a shoreline at dusk, the sun on the horizon
      const hz = 12;
      c.fillStyle = lg(c, -h / 2, hz, [[0, '#2b1c50'], [.7, '#c2567a'], [1, '#ff9a5a']]); c.fillRect(-w / 2, -h / 2, w, hz + h / 2);
      glow(c, 30, hz, 60, '#ffb35a', .5); c.fillStyle = '#ffd27a'; c.beginPath(); c.arc(30, hz, 20, Math.PI, 0); c.fill();
      c.fillStyle = lg(c, hz, h / 2, [[0, '#4a3470'], [1, '#131838']]); c.fillRect(-w / 2, hz, w, h / 2 - hz);
      c.fillStyle = 'rgba(255,210,130,.7)'; for (let i = 0; i < 7; i++) { const y = hz + 5 + i * 8, ww = 26 - i * 2.5 + 6 * noise1(t * 2 + i, 12); c.fillRect(30 - ww / 2 + 3 * noise1(t * 1.5 + i * 3, 13), y, ww, 2); }
      c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 1.5; c.beginPath(); for (let x = -w / 2; x <= w / 2; x += 4) { const y = h / 2 - 16 + 3 * Math.sin(x * .06 + t * 2); x === -w / 2 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
    } },
    { name: 'lantern', dx: 440, dy: 15, dz: -20, draw(c, w, h, t) {   // a lit paper lantern in the dark
      c.fillStyle = lg(c, -h / 2, h / 2, [[0, '#0b1020'], [1, '#161b35']]); c.fillRect(-w / 2, -h / 2, w, h);
      const y = 4 * Math.sin(t * 1.2); glow(c, 0, y, 80, '#ffb347', .55);
      c.fillStyle = '#3a2410'; c.fillRect(-13, y - 30, 26, 6); c.fillRect(-13, y + 24, 26, 6);
      rr(c, -18, y - 25, 36, 50, 12); c.fillStyle = '#ff9a3c'; c.fill();
      c.strokeStyle = 'rgba(160,70,20,.6)'; c.lineWidth = 1.2; for (const x of [-9, 0, 9]) { c.beginPath(); c.moveTo(x, y - 24); c.lineTo(x, y + 24); c.stroke(); }
      glow(c, 0, y, 22, '#fff1c9', .7);
      c.strokeStyle = 'rgba(255,220,160,.4)'; c.beginPath(); c.moveTo(0, y - 30); c.lineTo(0, -h / 2); c.stroke();
      for (let i = 0; i < 5; i++) { const u = ((t * .35 + hash(i, 2)) % 1); c.fillStyle = `rgba(255,200,120,${.8 * (1 - u)})`; c.beginPath(); c.arc(-30 + hash(i, 3) * 60, y - 30 - u * 60, 1.6, 0, TAU); c.fill(); }
    } },
  ].map((p, i) => ({ ...p, i, t0: MEM - .1 + i * .18, t1: DIM0 + .2 + i * .5 }));
  const PW = 230, PH = 150, PSC = P ? .7 : 1, PXS = P ? .5 : 1;
  const paneAt = (p, t) => [LP.x + p.dx * PXS, LP.y + p.dy + 10 * Math.sin(t * .8 + p.i * 2), LP.z + p.dz];
  function drawPane(ctx, v, p, t) {
    const k = easeOut((t - p.t0) / .6), out = smooth((t - p.t1) / .35); if (k <= 0 || out >= 1) return;
    const flare = 1 + .8 * env(t, p.t1 - .15, p.t1, p.t1 + .02, p.t1 + .3);   // a last flare, like a candle, before it goes out
    const [x, y, z] = paneAt(p, t), s = (.6 + .4 * k) * PSC;
    D.plane(ctx, v, x, y, z, PW * .6, PH * .6, c => {
      c.scale(s, s);
      c.save(); rr(c, -PW / 2, -PH / 2, PW, PH, 10); c.clip();
      p.draw(c, PW, PH, t);
      if (out > 0) { c.fillStyle = `rgba(4,10,16,${out})`; c.fillRect(-PW / 2, -PH / 2, PW, PH); }
      const sh = c.createLinearGradient(-PW / 2, -PH / 2, PW / 2, PH / 2); sh.addColorStop(0, 'rgba(255,255,255,.12)'); sh.addColorStop(.4, 'rgba(255,255,255,0)'); c.fillStyle = sh; c.fillRect(-PW / 2, -PH / 2, PW, PH);   // glass sheen
      c.restore();
      c.save(); c.globalCompositeOperation = 'lighter'; rr(c, -PW / 2, -PH / 2, PW, PH, 10);
      c.strokeStyle = `rgba(255,214,170,${.25 * flare * (1 - out)})`; c.lineWidth = 7; c.stroke(); c.strokeStyle = `rgba(255,230,200,${.7 * flare * (1 - out)})`; c.lineWidth = 1.8; c.stroke(); c.restore();
    }, { alpha: k * (1 - out), fog: .2 });
    if (t > p.t1) {   // a wisp of smoke as it goes out
      const u = clamp((t - p.t1) / 1.2), q = D.proj(v, x, y - PH * .5 - 60 * u, z); if (q) { ctx.save(); ctx.globalAlpha = .25 * (1 - u) * Math.min(1, u * 4); glow(ctx, q.x, q.y, 40 * q.s * (1 + u), '#9aa8b8', .6); ctx.restore(); }
    }
  }

  // feeling: warm colour breathing through the dark (10.4–15)
  function drawFeeling(ctx, t) {
    const a = .11 * env(t, FEEL, FEEL + .5, DIM0, DIM0 + 1.2) * (.6 + .4 * Math.sin(TAU * (t - FEEL) / 1.9)); if (a <= .003) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    glow(ctx, W * .3, H * .38, Math.max(W, H) * .5, '#ff9a4d', a); glow(ctx, W * .72, H * .62, Math.max(W, H) * .45, '#ff5f8a', a * .8);
    ctx.restore();
  }


  // the words themselves, in quiet type beside what shows them (director, 2026-09-29): চেতনা under the light, স্মৃতি
  // under the rain on the window, অনুভূতি under the warm lantern, অস্তিত্বের বোধ at the edge of the rings of awareness
  function caption(ctx, v, s, x, y, z, t0, t, out) {
    const k = easeOut(clamp((t - t0 + .05) / .6), 3), a = k * (1 - out); if (a <= .01) return;
    D.plane(ctx, v, x, y + 10 * (1 - k), z, 240, 40, c => {
      YD.text(c, s, P ? 34 : 38, .92 * a, { weight: 500, glow: .35 });
      c.save(); c.globalAlpha *= .45 * a; c.fillStyle = '#ffd9a0'; const hw = 26 * k; c.fillRect(-hw, 30, 2 * hw, 1.5); c.restore();   // a hairline under it
    }, { fog: 0 });
  }
  function drawLabels(ctx, v, t) {
    if (t < w('চেতনা') - .1 || t > PAPER + .2) return;
    const out = i => smooth((t - DIM0 - .3 - i * .15) / .5);
    caption(ctx, v, 'চেতনা', LP.x, LP.y + 92, LP.z - 20, w('চেতনা'), t, out(0));
    const [rain, , , lamp] = PANES, pr = paneAt(rain, t), pl = paneAt(lamp, t);
    caption(ctx, v, 'স্মৃতি', pr[0], pr[1] - PH * PSC * .5 - 40, pr[2], MEM, t, Math.max(out(1), smooth((t - rain.t1) / .35)));
    caption(ctx, v, 'অনুভূতি', pl[0], pl[1] + PH * PSC * .5 + 44, pl[2], FEEL, t, Math.max(out(2), smooth((t - lamp.t1) / .35)));
    caption(ctx, v, 'অস্তিত্বের বোধ', LP.x, LP.y + 232, LP.z - 20, SELF + .3, t, out(3));
    // the sense of self: rings of awareness going out from the light as "অস্তিত্বের বোধ" is said
    const lp = D.proj(v, LP.x, LP.y, LP.z); if (!lp) return;
    for (const d of [0, .55, 1.1]) {
      const u = (t - SELF - d) / 1.6; if (u <= 0 || u >= 1) continue;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `rgba(255,190,90,${.55 * (1 - u)})`; ctx.lineWidth = 3 * U; ctx.beginPath(); ctx.arc(lp.x, lp.y, (30 + 260 * easeOut(u, 2)) * lp.s, 0, TAU); ctx.stroke(); ctx.restore();
    }
  }

  function drawA(ctx, t) {
    const v = camA(t);
    YD.bg(ctx, v);
    YD.fill(ctx, '#000000', .5 * smooth((t - STOP0) / 2.8));
    drawFeeling(ctx, t);
    const panes = t > MEM - .2 ? PANES.map(p => ({ p, z: paneAt(p, t)[2] })).sort((a, b) => b.z - a.z) : [];
    panes.filter(o => o.z > LP.z).forEach(o => drawPane(ctx, v, o.p, t));
    const lp = D.proj(v, LP.x, LP.y, LP.z);
    if (lp) { YD.rays(ctx, lp.x, lp.y, 10 * lp.s, .85 * env(t, STOP1 - .3, STOP1 + .9, DIM0, DIM0 + 1.4), t); YD.light(ctx, lp.x, lp.y, 10 * lp.s, kLight(t)); }
    panes.filter(o => o.z <= LP.z).forEach(o => drawPane(ctx, v, o.p, t));
    drawLabels(ctx, v, t);
    drawDust(ctx, YD, v, t, .8 * smooth(t / 1.5));
    YD.post(ctx);
  }

  // ═══ H · the hook: the last moments (ঘ, 0–8.0) ═══════════════════════════════
  // v3 (the client's note through the director, 2026-09-30, then his blend with v1's brain of lights): "মৃত্যু মানে কি
  // সবকিছুর শেষ, শরীর থেমে যায়" over a person lying in their last moments in a dark hospital room, a figure with no face
  // (the channel's rule for people), rim-lit by the bedside monitor; the head is glass and v1's brain of lights works
  // inside it. The heart's trace slows and stops with the last breath. The camera stays in the room: on "কার্যকলাপ বন্ধ"
  // the monitor's EEG runs flat while the brain's lights go out, the amber light flares on "বন্ধ", and the camera zooms
  // into it, arriving exactly where segment A's light is. The order is the clinical one (the heart stops first, the EEG
  // goes flat some 10–20 s later), shown faster. v2 (a push into the monitor) is film.hook-v2.old-style.js.
  const HB = [[-2.2, 1], [-1.35, 1], [-.5, 1], [.3, 1], [1.15, .95], [2.05, .85], [3.02, .6], [3.98, .28]];   // the heart's last beats, slowing and weakening
  const ZM0 = w('বন্ধ'), XF0 = 7.55, ZM1 = XF0 - .05, TH = w('কিন্তু') + .05;   // the zoom into the light; the handover to segment A
  const breath = t => keyed(t, [[0, .45], [.9, 1], [2.1, .1], [2.9, .62], [4.3, 0]]);   // slow and shallow, then none
  const beatAt = t => HB.reduce((s, [b, a]) => t < b ? s : s + a * Math.exp(-(t - b) * 8), 0);
  // the room, in world units (y down): the bed's plane with the mattress top at y = 0, the monitor on a wall arm behind
  // the head of the bed, the window on the back wall
  const ZB = 1000, MON = { x: -540, y: -330, z: 1080 }, MS = .62, WIN_ = { x: 820, y: -650, z: 2300 };
  const HK = { skin: '#061217', sheet: '#0d2430', fold: '#12303d', pillow: '#0f2733', matt: '#08161d', metal: '#0a1a22' };
  const cyan = a => `rgba(95,227,255,${a})`, moon = a => `rgba(166,225,255,${a})`;
  const curve = (c, pts, close) => { c.moveTo(...pts[0]); for (let i = 1; i < pts.length - 1; i++) { const [x, y] = pts[i], [x2, y2] = pts[i + 1]; c.quadraticCurveTo(x, y, (x + x2) / 2, (y + y2) / 2); } c.lineTo(...pts[pts.length - 1]); if (close) c.closePath(); };
  // the top of the sheet over the body, from the chest to the feet; the chest and belly rise with the breath
  const SHEET = [[-300, -116], [-235, -128], [-170, -117], [-110, -100], [-40, -95], [40, -88], [120, -84], [165, -88], [220, -74], [300, -63], [352, -64], [380, -92], [398, -122], [418, -121], [432, -88], [446, -40], [452, 0]];
  const sheetTop = b => SHEET.map(([x, y]) => [x, y - b * 9 * (x < -150 ? 1 : 1 - smooth((x + 150) / 120))]);

  function paintBed(c, t) {
    const b = breath(t), fl = .75 + .25 * Math.min(1, beatAt(t));
    // lit from behind: the monitor at the head (upper left), strongest near it; the window's moonlight (upper right) toward the feet
    const ramp = stops => { const g = c.createLinearGradient(-560, 0, 500, 0); stops.forEach(([o, s]) => g.addColorStop(o, s)); return g; };
    const rims = [[-3.8, -3.6, ramp([[0, cyan(.95 * fl)], [.35, cyan(.6 * fl)], [1, cyan(.14 * fl)]])], [2.8, -2.4, ramp([[0, moon(.06)], [.5, moon(.2)], [1, moon(.42)]])]];
    const lit = (f, col) => { for (const [dx, dy, rc] of rims) { c.save(); c.translate(dx, dy); f(rc); c.restore(); } f(col); };
    const shape = build => col => { c.beginPath(); build(); c.fillStyle = col; c.fill(); };
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.save(); c.translate(-20, 384); c.scale(1, .08); const g = c.createRadialGradient(0, 0, 0, 0, 0, 600); g.addColorStop(0, 'rgba(0,0,0,.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(-600, -600, 1200, 1200); c.restore();   // its shadow on the floor
    // the frame: legs on wheels, the base, the head and foot boards
    lit(col => { c.fillStyle = col; for (const x of [-455, 405]) { c.fillRect(x - 11, 95, 22, 250); c.beginPath(); c.arc(x, 352, 24, 0, TAU); c.fill(); } rr(c, -505, 70, 975, 30, 8); c.fill(); }, HK.metal);
    lit(shape(() => rr(c, -548, -178, 32, 280, 14)), HK.metal);
    lit(shape(() => rr(c, 470, -70, 30, 172, 12)), HK.metal);
    // the mattress and the pillow
    lit(shape(() => rr(c, -512, -2, 986, 74, 16)), HK.matt);
    lit(shape(() => curve(c, [[-508, 2], [-514, -34], [-486, -60], [-400, -56], [-330, -60], [-296, -34], [-300, 2]], true)), HK.pillow);
    // the person: a head with no face on the pillow, one egg (the round skull on the pillow, narrowing to the chin, tipped
    // up a little), the neck going down under the sheet. The head is glass (director, 2026-09-30), so the brain of lights
    // drawn over it (drawHeadBrain) reads as inside it: a faint tint with the pillow showing through, its edge catching
    // the monitor's light like the rest of the figure (the rims are clipped to outside the head), a glint on the crown
    const hy = .8 * b;
    const egg = () => { for (let i = 0; i <= 48; i++) { const th = i / 48 * TAU, x = 58 * Math.cos(th), y = 50 * Math.sin(th) * (1 - .2 * Math.cos(th)), r = HROT; c.lineTo(-410 + x * Math.cos(r) - y * Math.sin(r), -98 + hy + x * Math.sin(r) + y * Math.cos(r)); } c.closePath(); };
    const neck = () => { c.moveTo(-392, -52 + hy); c.lineTo(-366, -90 + hy); c.lineTo(-326, -102); c.lineTo(-340, -40); c.closePath(); };
    const outside = f => { c.beginPath(); c.rect(-800, -600, 1600, 1200); f(); c.clip('evenodd'); };
    c.save(); outside(egg); outside(neck);
    for (const [dx, dy, rc] of rims) { c.save(); c.translate(dx, dy); c.beginPath(); egg(); neck(); c.fillStyle = rc; c.fill(); c.restore(); }
    c.restore();
    c.beginPath(); egg(); neck(); c.fillStyle = 'rgba(10,40,54,.42)'; c.fill();
    c.save(); c.beginPath(); egg(); c.clip(); c.strokeStyle = 'rgba(190,240,255,.22)'; c.lineWidth = 3; c.beginPath(); c.arc(-418, -94 + hy, 44, Math.PI * 1.02, Math.PI * 1.5); c.stroke(); c.restore();
    // the sheet pulled up to the chin: it rises from the pillow over the near shoulder to the chest, and moves with the
    // breath; its turned-down edge, folds, and the moonlight through the blinds
    const sheet = () => { c.beginPath(); curve(c, [[-386, 56], [-390, -8], [-374, -44], [-348, -80 - 3 * b], [-322, -104 - 6 * b], ...sheetTop(b), [476, 26], [470, 58]], true); };
    lit(col => { sheet(); c.fillStyle = col; c.fill(); }, HK.sheet);
    c.save(); sheet(); c.clip();
    c.strokeStyle = HK.fold; c.lineWidth = 5;
    c.beginPath(); c.moveTo(-364, -58 - 2 * b); c.quadraticCurveTo(-322, -106 - 7 * b, -236, -116 - 9 * b); c.stroke();
    for (const [x0, y0, cx, cy, x1, y1] of [[-200, 50, -150, -20, -60, -70], [60, 52, 120, 10, 200, -60], [260, 50, 300, 20, 330, -40]]) { c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(cx, cy, x1, y1); c.stroke(); }
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) { const x = -60 + i * 95; c.fillStyle = moon(.05 + .02 * (i % 2)); c.beginPath(); c.moveTo(x, -140); c.lineTo(x + 46, -140); c.lineTo(x - 64, 70); c.lineTo(x - 110, 70); c.closePath(); c.fill(); }
    c.restore();
    c.strokeStyle = HK.fold; c.lineWidth = 3; c.beginPath(); c.moveTo(-384, 50); c.lineTo(472, 50); c.stroke();   // the hem
    // the monitor's glow falling on the pillow and the head
    c.save(); c.globalCompositeOperation = 'lighter'; glow(c, -430, -150, 260, '#5fe3ff', .07 * fl); c.restore();
  }

  // the monitor, around its screen's centre and scaled by MS: an arm from the wall, the housing, the dark glass, its grid,
  // the heart symbol beating with the trace; the traces themselves are drawn on screen by monitorTraces
  function paintMonitor(c, t) {
    const beat = Math.min(1, beatAt(t));
    c.scale(MS, MS);
    c.fillStyle = HK.metal; rr(c, -300, -46, 22, 92, 5); c.fill(); c.fillRect(-282, -9, 110, 18); c.fillStyle = cyan(.22); c.fillRect(-282, -9, 110, 3);   // the arm from the wall
    rr(c, -174, -130, 348, 262, 18); c.fillStyle = '#0b1b23'; c.fill(); c.strokeStyle = cyan(.35); c.lineWidth = 2; c.stroke();
    rr(c, -152, -107, 304, 214, 6); c.fillStyle = '#02101a'; c.fill();
    c.save(); rr(c, -152, -107, 304, 214, 6); c.clip();
    c.strokeStyle = cyan(.06); c.lineWidth = 1;
    for (let x = -150; x <= 150; x += 25) { c.beginPath(); c.moveTo(x, -107); c.lineTo(x, 107); c.stroke(); }
    for (let y = -100; y <= 100; y += 25) { c.beginPath(); c.moveTo(-152, y); c.lineTo(152, y); c.stroke(); }
    c.strokeStyle = cyan(.18); c.beginPath(); c.moveTo(-146, -33); c.lineTo(146, -33); c.stroke();   // the heart above, the brain below
    const g = c.createRadialGradient(0, -20, 0, 0, -20, 220); g.addColorStop(0, cyan(.06)); g.addColorStop(1, cyan(0)); c.fillStyle = g; c.fillRect(-152, -107, 304, 214);
    c.restore();
    c.save(); c.translate(-134, -90); const s = 5.5 * (1 + .3 * beat); c.fillStyle = cyan(.45 + .5 * beat);
    c.beginPath(); c.moveTo(0, s * .9); c.bezierCurveTo(-s * 1.6, -s * .1, -s * .7, -s * 1.3, 0, -s * .45); c.bezierCurveTo(s * .7, -s * 1.3, s * 1.6, -s * .1, 0, s * .9); c.fill(); c.restore();
    c.fillStyle = 'rgba(120,255,170,.85)'; c.beginPath(); c.arc(150, 118, 3, 0, TAU); c.fill();   // the power light
  }

  // the window on the back wall: the night outside, far city lights, the moon's haze, half-open blinds catching it
  function paintWindow(c) {
    const w = 360, h = 470;
    rr(c, -w - 18, -h - 18, 2 * w + 36, 2 * h + 36, 6); c.fillStyle = '#0a1a22'; c.fill(); c.strokeStyle = moon(.25); c.lineWidth = 3; c.stroke();
    c.save(); c.beginPath(); c.rect(-w, -h, 2 * w, 2 * h); c.clip();
    c.fillStyle = lg(c, -h, h, [[0, '#0b2436'], [1, '#16415a']]); c.fillRect(-w, -h, 2 * w, 2 * h);
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) glow(c, -w + hash(i, 31) * 2 * w, h * .1 + hash(i, 32) * h * .8, 16 + hash(i, 33) * 22, i % 3 ? '#ffb86b' : '#7fd3ff', .35);
    glow(c, w * .45, -h * .55, 150, '#cfeaff', .22);
    c.globalCompositeOperation = 'source-over';
    for (let y = -h; y < h; y += 34) { c.fillStyle = 'rgba(8,24,32,.92)'; c.fillRect(-w, y, 2 * w, 20); c.fillStyle = moon(.22); c.fillRect(-w, y, 2 * w, 2.5); }
    c.restore();
  }


  // the EEG: four channels scrolling from right to left, written at XH; each slows and runs down to a flat line, one
  // after another (its waves slow as they fade), leaving only the instrument's faint noise
  const EEG_Y = [0, 28, 56, 84], EEG_MID = 42, AMP = 10, XL = -140, XH = 118, WIN = .9;
  const EEGC = [0, 1, 2, 3].map(i => ({ a: 5.1 + .22 * i, d: .75, f: [8.6, 9.4, 7.9, 10.1][i], p: hash(i, 21) * TAU, q: hash(i, 22) * TAU, s: hash(i, 23) * TAU }));
  function eeg(i, tau) {
    const c = EEGC[i], u = clamp((tau - c.a) / c.d), k = smooth(u);
    const ph = tau - .55 * (tau < c.a ? 0 : tau > c.a + c.d ? c.d * .5 + (tau - c.a - c.d) : c.d * (u * u * u - u * u * u * u / 2));   // the integral of the fade: the rhythm slows
    const v = .55 * Math.sin(TAU * c.f * ph + c.p) + .32 * Math.sin(TAU * c.f * .52 * ph + c.q) + .16 * Math.sin(TAU * c.f * 2.1 * ph + c.s) + .35 * noise1(ph * 6 + i * 7, 30 + i)
      + .12 * Math.sin(TAU * c.f * 2.7 * ph + c.p * 1.7) + .14 * noise1(ph * 38 + i * 5, 60 + i);   // the fast, ragged part (beta and the rest)
    return Math.pow(1 - k, 1.4) * v * (.8 + .2 * noise1(ph * 1.3 + i, 40 + i)) + .012 * noise1(tau * 40 + i * 3, 50 + i);
  }

  // the brain of lights inside the glass head (director, 2026-09-30: v1's brain blended into the hook): segment A's own
  // CLOUD, turned to lie as the head lies (its front up toward the face, its top toward the crown, the stem toward the
  // neck: x and y swapped) and scaled by HKB into the skull. Each heartbeat sends a pulse up from the brainstem; as the
  // EEG runs flat the lights go out district by district (v1's order, back to front), and the amber light alone flares
  const HKB = .087, HBO = [-418, -100], HROT = -.22;
  const inHead = (x, y, z) => { const bx = y * HKB, by = x * HKB, c = Math.cos(HROT), s = Math.sin(HROT); return [HBO[0] + bx * c - by * s, HBO[1] + bx * s + by * c, ZB + z * HKB]; };
  const HN = CLOUD.nodes.map(n => inHead(n.x, n.y, n.z)), LW = HN[CLOUD.li];
  const BO0 = 5.35, BO1 = 6.5, offH = n => BO0 + (n.off - STOP0) / 2.35 * (BO1 - BO0);   // CLOUD's blackout times (4.78–7.13) squeezed into the EEG's run-down
  const pulse = (d, t) => HB.reduce((s, [b, a]) => t < b ? s : s + a * Math.exp(-((d - 1500 * (t - b)) ** 2) / (2 * 110 * 110)), 0);
  const aliveH = (n, t) => { const o = offH(n); if (t < o - .28) return 1; if (t > o) return 0; return noise1(t * 40 + n.tw * 9, 3) > -.2 ? .8 : .15; };   // lights flicker before they go out
  // the light: faint among the living lights, it flares as they go out on "বন্ধ", then settles to segment A's own
  // brightness and rays, which it matches exactly from the handover on
  const kH = t => lerp(.55, kLight(t), smooth((t - ZM0 + .1) / .3)) + env(t, ZM0 - .1, ZM0 + .15, ZM0 + .35, XF0 - .05);
  const raysH = t => .85 * env(t, STOP1 - .3, STOP1 + .9, DIM0, DIM0 + 1.4) + .7 * env(t, ZM0 - .1, ZM0 + .2, ZM0 + .5, XF0 - .05);
  function drawHeadBrain(ctx, v, t) {
    const N = CLOUD.nodes, Pj = HN.map(q => D.proj(v, ...q)), pc = Pj[CLOUD.li]; if (!pc) return;
    const zk = pc.s * HKB, dens = clamp(.6 + .4 * zk / 1.2), list = [];   // zk: this view's scale against segment A's; seen small, the lights crowd, so they are dimmed a little
    const on = 1 - smooth((t - BO0) / (BO1 - BO0)), pb = D.proj(v, ...inHead(0, -90, 0));   // the brain's own soft glow, going out with its lights
    if (pb && on > .004) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; glow(ctx, pb.x, pb.y, 62 * pb.s, '#4fb8e0', .2 * on * (1 + .5 * pulse(300, t))); ctx.restore(); }
    const lum = N.map((n, i) => i === CLOUD.li ? 0 : aliveH(n, t) * dens * (.6 + .4 * noise1(t * 1.4 + n.tw, 2)) * (1 + 1.6 * pulse(n.dStem, t)));
    for (const e of CLOUD.edges) {
      const a = Pj[e.a], b = Pj[e.b]; if (!a || !b) continue;
      const al = Math.min(lum[e.a], lum[e.b], 1.4) * .7 / (1 + D.coc(v, (a.d + b.d) / 2) / 4);
      if (al > .03) list.push([a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2, b.x, b.y, Math.min(1, al)]);
    }
    YD.edges(ctx, list, clamp(1.2 * U * zk, .5 * U, 1.2 * U));
    N.forEach((n, i) => { const p = Pj[i]; if (p && lum[i] > .01) YD.node(ctx, i, p.x, p.y, Math.max(3.6 * n.size * p.s * HKB, 1.2 * U), D.coc(v, p.d), Math.min(1.4, lum[i])); });
    for (const e of CLOUD.edges) {   // signals running along the links
      if (!e.spark) continue;
      const al = Math.min(lum[e.a], lum[e.b]); if (al < .3 * dens) continue;
      const ph = t / e.period + e.phase, u = ph - Math.floor(ph); if (u > .5) continue;
      const a = HN[e.a], b = HN[e.b], k = u / .5, p = D.proj(v, lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)); if (!p) continue;
      YD.spark(ctx, p.x, p.y, 3.2 * p.s * HKB, D.coc(v, p.d), Math.min(1, al) * Math.sin(Math.PI * k));
    }
    const lr = Math.max(10 * zk, 4 * U);   // seen small it keeps a size that reads; from the handover on it is segment A's own (larger)
    YD.rays(ctx, pc.x, pc.y, lr, raysH(t), t); YD.light(ctx, pc.x, pc.y, lr, kH(t));
  }

  // the camera: a slow dolly on the bed, never into the monitor; on "বন্ধ" it zooms into the light in the head. The zoom
  // moves the light on screen from where it lies to where segment A shows it, at segment A's scale (so the handover is
  // exact), and solves the camera from that
  const HC = P ? { x0: -373, x1: -382, y: -218, z0: 474, z1: 520 } : { x0: -292, x1: -300, y: -182, z0: 545, z1: 600 };
  const lpA = t => D.proj(camA(t), LP.x, LP.y, LP.z);
  function camH(t) {
    const u = t / ZM0, cw = { x: lerp(HC.x0, HC.x1, u), y: HC.y, z: lerp(HC.z0, HC.z1, u) };
    if (t <= ZM0) return D.view({ ...cw, focus: ZB - cw.z, aperture: 10 }, W, H);
    const e = easeIO(clamp((t - ZM0) / (ZM1 - ZM0))), pw = D.proj(D.view(cw, W, H), ...LW), L = lpA(t);
    const s = Math.exp(lerp(Math.log(pw.s), Math.log(L.s / HKB), e)), px = lerp(pw.x, L.x, e), py = lerp(pw.y, L.y, e), d = 1000 * U / s;
    return D.view({ x: LW[0] - (px - W / 2) / s, y: LW[1] - (py - H / 2) / s, z: LW[2] - d, focus: lerp(ZB - LW[2] + d, d, e), aperture: 10 }, W, H);   // the focus slides from the bed to the light
  }

  // a trace of light in screen pixels, the ঘ way (wide soft glow, then the core); its left end fades into the glass
  function glowTrace(ctx, pts, w, rgb, a, fade) {
    if (pts.length < 2 || a <= .004) return;
    const x0 = pts[0][0], x1 = pts[pts.length - 1][0], soft = fade > .01 && x1 - x0 > 4;
    const paint = al => { if (!soft) return `rgba(${rgb},${al})`; const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(fade, `rgba(${rgb},${al})`); g.addColorStop(1, `rgba(${rgb},${al})`); return g; };
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = paint(.12 * a); ctx.lineWidth = w * 6; ctx.stroke(); ctx.strokeStyle = paint(.25 * a); ctx.lineWidth = w * 2.6; ctx.stroke();
    ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = paint(a); ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  }
  const traceWidth = v => { const p = D.proj(v, MON.x, MON.y, MON.z); return p ? clamp(1.1 * MS * p.s, 1.3 * U, 3.4 * U) : 1; };

  // the ECG scrolls like the EEG, written at XH over the last TS seconds, so the last beat moves off and the flat line
  // follows it in (a sweeping trace kept the old beats on screen after the heart had stopped)
  const TS = 1.6;
  function monitorTraces(ctx, v, t) {
    const lw = traceWidth(v), pts = [];
    for (let i = 0; i <= 200; i++) { const x = XL + (XH - XL) * i / 200, p = D.proj(v, MON.x + x * MS, MON.y + (-64 - 34 * S.ecg(t - (XH - x) / (XH - XL) * TS, HB)) * MS, MON.z); if (p) pts.push([p.x, p.y]); }
    glowTrace(ctx, pts, lw, '95,227,255', .95, .18);
    const q = pts[pts.length - 1]; if (q) YD.spark(ctx, q[0], q[1], 2.2 * lw, 0, .75);
    for (let i = 0; i < 4; i++) {   // the EEG, running flat on "কার্যকলাপ বন্ধ"
      const ep = [];
      for (let k = 0; k <= 200; k++) { const x = XL + (XH - XL) * k / 200, p = D.proj(v, MON.x + x * MS, MON.y + (EEG_Y[i] - AMP * eeg(i, t - (XH - x) / (XH - XL) * WIN)) * MS, MON.z); if (p) ep.push([p.x, p.y]); }
      glowTrace(ctx, ep, lw, '207,233,255', .9, .22);
      const e = ep[ep.length - 1]; if (e) YD.spark(ctx, e[0], e[1], 2 * lw, 0, .65);
    }
    const k = easeOut(clamp((t - STOP0 + .05) / .6), 3) * (1 - smooth((t - ZM0) / .4));   // its name beside the screen, on its word
    const pl = k > .01 && D.proj(v, MON.x + 186 * MS, MON.y + EEG_MID * MS, MON.z);
    if (pl) { ctx.save(); ctx.setTransform(1, 0, 0, 1, pl.x, pl.y); YD.text(ctx, 'মস্তিষ্কের তরঙ্গ', 28 * U, .92 * k, { align: 'left', weight: 500, glow: .35 }); ctx.restore(); }
  }

  function drawHook(ctx, t) {
    const v = camH(t);
    YD.bg(ctx, v); YD.fill(ctx, '#000000', .35);   // a darker room than the brain's space
    const pw = D.plane(ctx, v, WIN_.x, WIN_.y, WIN_.z, 400, 500, c => paintWindow(c), { fog: .3 });
    if (pw) {   // the moonlight falling from the window across the room, in soft bands
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) {
        const x = pw.x + (-300 + 150 * i) * pw.s, y = pw.y - 200 * pw.s, len = Math.max(W, H) * 1.1, g = ctx.createLinearGradient(x, y, x - .55 * len, y + .85 * len);
        g.addColorStop(0, moon(.045)); g.addColorStop(1, moon(0)); ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 60 * pw.s, y); ctx.lineTo(x + 60 * pw.s - .55 * len, y + .85 * len); ctx.lineTo(x - .55 * len - 40 * pw.s, y + .85 * len); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    const pm = D.proj(v, MON.x, MON.y, MON.z);
    if (pm) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; glow(ctx, pm.x, pm.y, 430 * MS * pm.s, '#5fe3ff', .1 * (.85 + .15 * Math.min(1, beatAt(t)))); ctx.restore(); }   // its light on the wall
    D.plane(ctx, v, MON.x, MON.y, MON.z, 190, 95, c => paintMonitor(c, t), { fog: 0 });
    monitorTraces(ctx, v, t);
    D.plane(ctx, v, 0, 0, ZB, 560, 420, c => paintBed(c, t), { fog: 0 });
    YD.fill(ctx, '#000000', .8 * smooth((t - ZM0 - .2) / (ZM1 - ZM0 - .2)));   // the room goes dark around the light as the camera nears it
    drawHeadBrain(ctx, v, t);
    drawDust(ctx, YD, v, t, .5);
    YD.post(ctx);
    YD.fill(ctx, '#000000', 1 - smooth(t / .5));   // in from black
  }
  // ═══ B · the book of history (চ, 16.4–24.9) ═══════════════════════════════
  // An open pop-up book stands facing us. On "হাজার বছর ধরে" its pages turn backward, fast, several in the air at once:
  // a city at night, a medieval town, a Roman aqueduct, ships of the ancient seas, pages of old writing, and at last
  // an ancient river valley where the pyramids (ধর্ম), a Greek colonnade (দর্শন) and a clay tablet (সাহিত্য) fold up
  // out of the page on their words. Paper lanterns rise out of it on "উত্তর খোঁজা হয়েছে". On "আধুনিক বিজ্ঞান" the
  // whole frame turns away like a page, and behind it is the brain.
  const K = { pyr: ['#ecd6a6', '#c7a871', '#a98b58'], col: ['#f1e8d6', '#cbbfa8', '#8f836e'], clay: ['#c07e4e', '#8d5632'] };
  function drawLandmark(c, type, Kk) {
    if (type === 'pyr') {
      c.fillStyle = Kk.pyr[1]; c.beginPath(); c.moveTo(-330, 0); c.lineTo(-210, -150); c.lineTo(-90, 0); c.fill();   // the small pyramid behind
      c.fillStyle = Kk.pyr[0]; c.beginPath(); c.moveTo(-210, 0); c.lineTo(10, -270); c.lineTo(60, 0); c.fill();
      c.fillStyle = Kk.pyr[2]; c.beginPath(); c.moveTo(10, -270); c.lineTo(230, 0); c.lineTo(60, 0); c.fill();
    } else if (type === 'col') {
      c.fillStyle = Kk.col[1]; c.fillRect(-215, -22, 430, 22); c.fillStyle = Kk.col[0]; c.fillRect(-195, -44, 390, 22);
      for (let i = 0; i < 6; i++) { const x = -165 + i * 66; c.fillStyle = Kk.col[0]; c.fillRect(x - 13, -234, 26, 190); c.fillStyle = Kk.col[1]; c.fillRect(x + 5, -234, 8, 190); c.fillStyle = Kk.col[0]; c.fillRect(x - 19, -246, 38, 12); }
      c.fillStyle = Kk.col[0]; c.fillRect(-205, -276, 410, 30); c.fillStyle = Kk.col[1]; c.beginPath(); c.moveTo(-215, -276); c.lineTo(0, -352); c.lineTo(215, -276); c.closePath(); c.fill();
    } else {
      c.save(); c.rotate(-.06); c.fillStyle = Kk.clay[0]; c.beginPath(); c.roundRect ? c.roundRect(-110, -300, 220, 290, 18) : c.rect(-110, -300, 220, 290); c.fill();
      c.fillStyle = Kk.clay[1]; for (let r = 0; r < 9; r++) for (let k = 0; k < 7; k++) { if (hash(r, k) < .2) continue; const x = -85 + k * 26 + hash(k, r) * 6, y = -272 + r * 30; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 14, y + 4); c.lineTo(x, y + 9); c.closePath(); c.fill(); }   // wedge marks, no real text
      c.restore();
    }
  }

  const PGW = 900, PGH = 1150, BK_S = Math.min(.9 * (W / U) / (2 * PGW + 80), .8 * (H / U) / PGH), BZ = 1000 / BK_S, GROUND = 300;
  // the eras, each a full spread painted once in cut paper (world units, half resolution)
  const RS = .5;
  function era(kind) {
    const [c, x] = F.canvas(2 * PGW * RS, PGH * RS); x.scale(RS, RS); x.translate(PGW, PGH / 2);
    const sky = (a, b, c2) => { const g = x.createLinearGradient(0, -PGH / 2, 0, GROUND); g.addColorStop(0, a); g.addColorStop(.7, b); g.addColorStop(1, c2 || b); x.fillStyle = g; x.fillRect(-PGW, -PGH / 2, 2 * PGW, PGH); };
    const layer = (col, pts, sh = true) => { x.save(); if (sh) { x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 14; x.shadowOffsetY = -5; } x.fillStyle = col; x.beginPath(); pts.forEach(([px, py], i) => i ? x.lineTo(px, py) : x.moveTo(px, py)); x.closePath(); x.fill(); x.restore(); };
    const hills = (col, base, amp, f, seed) => { const p = [[-PGW, PGH / 2]]; for (let k = 0; k <= 60; k++) { const px = -PGW + k * 2 * PGW / 60; p.push([px, base - amp * (.5 + .5 * Math.sin(px / f + seed)) - 18 * noise1(k * .4, seed)]); } p.push([PGW, PGH / 2]); layer(col, p); };
    const stars = n => { const r = rng(n); for (let i = 0; i < n; i++) { x.fillStyle = `rgba(246,236,217,${.4 + .5 * r()})`; x.beginPath(); x.arc((r() - .5) * 2 * PGW, -PGH / 2 + r() * PGH * .45, 2 + r() * 3, 0, TAU); x.fill(); } };
    const r = rng(kind.length * 7);
    if (kind === 'today') {
      sky('#0f1934', '#2d3c68', '#46507a'); stars(50);
      for (const [col, hmin, hmax, lit] of [['#3a4a74', 180, 420, .15], ['#1b2746', 120, 330, .5]]) {
        for (let bx = -PGW; bx < PGW;) { const bw = 60 + r() * 90, bh = hmin + r() * (hmax - hmin); layer(col, [[bx, GROUND], [bx, GROUND - bh], [bx + bw, GROUND - bh], [bx + bw, GROUND]], false);
          if (r() < .4) layer(col, [[bx + bw / 2 - 3, GROUND - bh], [bx + bw / 2 - 3, GROUND - bh - 50], [bx + bw / 2 + 3, GROUND - bh - 50], [bx + bw / 2 + 3, GROUND - bh]], false);   // an aerial
          x.fillStyle = '#ffd98a'; for (let wy = GROUND - bh + 16; wy < GROUND - 10; wy += 22) for (let wx = bx + 10; wx < bx + bw - 10; wx += 16) if (r() < lit) x.fillRect(wx, wy, 7, 10);
          bx += bw + 6; }
      }
      layer('#121a30', [[-PGW, GROUND], [PGW, GROUND], [PGW, PGH / 2], [-PGW, PGH / 2]]);
    } else if (kind === 'medieval') {
      sky('#27365f', '#b87a6a', '#e7ae7c'); hills('#5d7b64', GROUND - 120, 90, 260, 1); hills('#41614f', GROUND - 40, 60, 180, 2);
      const castle = (cx) => { x.fillStyle = '#8b909c'; x.fillRect(cx - 130, GROUND - 260, 260, 220); for (const tx of [-150, 110]) { x.fillRect(cx + tx, GROUND - 330, 40, 290); for (let k = 0; k < 3; k++) x.fillRect(cx + tx + k * 14, GROUND - 345, 10, 15); } for (let k = 0; k < 9; k++) x.fillRect(cx - 130 + k * 30, GROUND - 275, 16, 15); x.fillStyle = '#3a3140'; x.fillRect(cx - 25, GROUND - 120, 50, 80); };
      x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 14; castle(-420); x.restore();
      for (let i = 0; i < 7; i++) { const hx = 60 + i * 110, hw = 80, hh = 70 + r() * 30; layer('#eadbb8', [[hx, GROUND], [hx, GROUND - hh], [hx + hw, GROUND - hh], [hx + hw, GROUND]]); layer('#b5603f', [[hx - 8, GROUND - hh], [hx + hw / 2, GROUND - hh - 55], [hx + hw + 8, GROUND - hh]]); }
      layer('#d9c9a8', [[760, GROUND], [775, GROUND - 190], [805, GROUND - 190], [820, GROUND]]); x.save(); x.translate(790, GROUND - 190); x.fillStyle = '#6e5a44'; for (let k = 0; k < 4; k++) { x.rotate(TAU / 4); x.fillRect(-6, 0, 12, 130); } x.restore();   // a windmill
      layer('#2d4637', [[-PGW, GROUND], [PGW, GROUND], [PGW, PGH / 2], [-PGW, PGH / 2]]);
    } else if (kind === 'rome') {
      sky('#34396a', '#c98a72', '#f0b27a'); hills('#7a8a8f', GROUND - 170, 80, 300, 3);
      x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 14; x.fillStyle = '#dccba5';
      for (const [y0, h, n, wth] of [[GROUND, 190, 9, 180], [GROUND - 190, 120, 14, 115]]) { x.beginPath(); x.rect(-PGW, y0 - h, 2 * PGW, h); for (let k = 0; k < n; k++) { const ax = -PGW + (k + .5) * 2 * PGW / n; x.moveTo(ax + wth * .32, y0); x.lineTo(ax + wth * .32, y0 - h * .55); x.arc(ax, y0 - h * .55, wth * .32, 0, Math.PI, true); x.lineTo(ax - wth * .32, y0); x.closePath(); } x.fill('evenodd'); }   // the aqueduct's arches
      x.restore();
      for (const cx of [-700, -560, 480, 640, 760]) layer('#27402e', [[cx - 22, GROUND], [cx, GROUND - 230 - r() * 60], [cx + 22, GROUND]]);   // cypresses
      layer('#4c5c45', [[-PGW, GROUND], [PGW, GROUND], [PGW, PGH / 2], [-PGW, PGH / 2]]);
    } else if (kind === 'sea') {
      sky('#1d2b52', '#8a6a8a', '#d98e6a'); stars(20);
      const ship = (sx, s) => { x.save(); x.translate(sx, GROUND - 40); x.scale(s, s); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 10; x.fillStyle = '#3b2a1f'; x.beginPath(); x.moveTo(-150, 0); x.lineTo(150, 0); x.lineTo(110, 45); x.lineTo(-110, 45); x.closePath(); x.fill(); x.fillRect(-4, -230, 8, 230); x.fillStyle = '#eadcc0'; x.fillRect(-90, -210, 180, 150); x.restore(); };
      ship(-420, 1); ship(380, .7);
      for (const [col, y0, amp] of [['#2f5c86', GROUND - 20, 18], ['#23456a', GROUND + 40, 22], ['#1a3350', GROUND + 110, 26]]) { const p = [[-PGW, PGH / 2]]; for (let k = 0; k <= 80; k++) { const px = -PGW + k * 2 * PGW / 80; p.push([px, y0 - amp * Math.abs(Math.sin(px / 60 + y0))]); } p.push([PGW, PGH / 2]); layer(col, p); }
    } else if (kind === 'ancient') {
      sky('#1a2346', '#b8707a', '#f2a869'); stars(25);
      hills('#e0b27a', GROUND - 60, 70, 320, 5); hills('#c9925a', GROUND + 10, 50, 230, 6);
      const p = []; for (let k = 0; k <= 40; k++) { const px = -PGW + k * 2 * PGW / 40; p.push([px, GROUND + 70 + 30 * Math.sin(px / 200)]); } for (let k = 40; k >= 0; k--) { const px = -PGW + k * 2 * PGW / 40; p.push([px, GROUND + 130 + 30 * Math.sin(px / 200)]); } layer('#6fb7c1', p);   // the river
      for (const cx of [-820, -250, 300, 820]) { x.fillStyle = '#4a3a28'; x.fillRect(cx - 5, GROUND - 150, 10, 150); x.fillStyle = '#2f4a2c'; for (let k = 0; k < 6; k++) { x.save(); x.translate(cx, GROUND - 150); x.rotate(-Math.PI / 2 + (k - 2.5) * .45); x.beginPath(); x.ellipse(45, 0, 50, 10, 0, 0, TAU); x.fill(); x.restore(); } }   // palms
      layer('#b07a44', [[-PGW, GROUND + 160], [PGW, GROUND + 160], [PGW, PGH / 2], [-PGW, PGH / 2]]);
    } else {   // a page of old writing
      x.fillStyle = '#efe2c8'; x.fillRect(-PGW, -PGH / 2, 2 * PGW, PGH);
      x.strokeStyle = 'rgba(80,60,40,.55)'; x.lineWidth = 3; x.lineCap = 'round';
      for (const side of [-1, 1]) for (let ly = -PGH / 2 + 110; ly < PGH / 2 - 100; ly += 42) for (let lx = side < 0 ? -PGW + 90 : 90; lx < (side < 0 ? -90 : PGW - 90);) { const len = 30 + r() * 90; x.beginPath(); for (let k = 0; k <= len; k += 6) { const px = lx + k, py = ly + 4 * Math.sin(k * .5 + lx); k ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); lx += len + 18; }
    }
    // the paper itself over everything: fibre, and a soft darkening toward the gutter
    x.globalAlpha = .28; x.fillStyle = x.createPattern(F.fibreTile(41), 'repeat'); x.fillRect(-PGW, -PGH / 2, 2 * PGW, PGH); x.globalAlpha = 1;
    const g = x.createLinearGradient(-90, 0, 90, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(-90, -PGH / 2, 180, PGH);
    return c;
  }
  // the pop-up cards, painted once: each monument on a transparent card, its base on the card's bottom edge
  const CARD = { pyr: { w: 640, h: 400, ox: 30 }, col: { w: 470, h: 400, ox: 0 }, clay: { w: 300, h: 360, ox: 0 } };
  let CARDS = null;
  const cards = () => CARDS || (CARDS = Object.fromEntries(Object.entries(CARD).map(([type, d]) => {
    const r = .6, [c, x] = F.canvas(d.w * r, d.h * r); x.scale(r, r); x.translate(d.w / 2 + d.ox, d.h - 8);
    x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 10; x.shadowOffsetX = 6; drawLandmark(x, type, K);
    const [sh, sx] = F.canvas(c.width, c.height); sx.filter = 'blur(5px)'; sx.drawImage(c, 0, 0); sx.filter = 'none'; sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#1e0f00'; sx.fillRect(0, 0, c.width, c.height);   // its soft silhouette, for the shadow it casts
    return [type, { c, sh, ...d }];
  })));
  // where the monuments stand (x of the monument's centre, z of the card's hinge) and the word each one answers; every
  // card fits on the page lying flat, since that is how it starts
  const CS = 1.3, MK = [['pyr', 'ধর্ম', RELIG, -470, -110], ['col', 'দর্শন', PHIL, 0, 50], ['clay', 'সাহিত্য', LIT_, 520, -220]];   // staggered in depth, for parallax
  const cardBox = (type, cx) => { const d = CARD[type], cw = d.w * CS, ch = d.h * CS, x0 = cx - cw / 2 - d.ox * CS; return { cw, ch, x0, x1: x0 + cw }; };
  const SPREADS = ['today', 'text', 'medieval', 'rome', 'text', 'sea', 'ancient'];
  let ERAS = null;
  const eras = () => ERAS || (ERAS = SPREADS.map(era));
  const NF = SPREADS.length - 1, F0 = YEARS - .2, FDUR = .55, F1 = RELIG - .45, FSTART = i => F0 + i * (F1 - FDUR - F0) / (NF - 1);
  // the last spread with its pop-ups still lying on it, printed side up; the 3D cards take over from these exactly
  let AFLAT = null;
  const ancientFlat = () => AFLAT || (AFLAT = (() => {
    const src = eras()[NF], [c, x] = F.canvas(src.width, src.height), CD = cards(); x.drawImage(src, 0, 0);
    for (const [type, , , cx, zc] of MK) { const b = cardBox(type, cx); x.drawImage(CD[type].c, (b.x0 + PGW) * RS, (PGH / 2 - zc - b.ch) * RS, b.cw * RS, b.ch * RS); }
    return c;
  })());
  // a monument's lift off the page (director, 2026-09-29): it leans up, face toward us, as its spread settles, and then
  // simply stays at that slant; the camera's slow descent gives the parallax. It never jumps on its word: only the
  // word fades in with the voice
  const TILT = 48 * Math.PI / 180, cardUp = t => t < F1 ? 0 : TILT * easeOut(clamp((t - F1) / .7));
  // ─── the book lies on a desk; a camera looks down on it in perspective (director, 2026-09-29) ───
  // Book space: x right, y up, z away from us; the spine runs along z at x = 0, the pages lie at y = 0.
  // A turning page is cut into strips from the spine out. Its cross-section is a curve whose angle grows toward the
  // free edge (the edge lags, so the page bends), and the lag is larger at the top than the bottom (the corner leads,
  // as a page does when it is lifted by a corner): a cheap cousin of the cone deformation used for page curls.
  const flipAngle = (i, t) => Math.PI * (1 - easeIO(clamp((t - FSTART(i)) / FDUR)));   // from lying left (π) to lying right (0)
  const BOOKW = 2 * PGW + 80, FIT = (P ? .82 : .78) * (W / U) * 2450 / BOOKW;
  function camBook(t) {
    // high over the book while its pages turn; then one slow, unbroken descent, sliding sideways past the slanted monuments
    // so their depth against the page reads as parallax (director, 2026-09-29: "ক্যামেরাটা জাস্ট প্যান হয়ে নেমে")
    const r = keyed(t, [[PAPER, 2700], [F0, 2500], [F1, 2500], [LENS, P ? 2350 : 2150]]), p = keyed(t, [[PAPER, 60], [F1, 52], [LENS, 15]]) * Math.PI / 180;   // one unbroken descent once the last page is down
    const tz = keyed(t, [[PAPER, -40], [F1, 40], [LENS, 110]]), ty = 300 * (1 - (1 - clamp((t - F0) / (LENS - F0))) ** 2);   // the aim rises from the first turn on, early, so the monuments and their words keep headroom
    const tx = 25 * Math.sin(t * .35) + keyed(t, [[F1, 0], [LENS, P ? -110 : -220]]);
    return { x: tx, y: ty + r * Math.sin(p), z: tz - r * Math.cos(p), pitch: p, f: FIT };
  }
  const P3 = (c, x, y, z) => { const dx = x - c.x, dy = y - c.y, dz = z - c.z, cp = Math.cos(c.pitch), sp = Math.sin(c.pitch), y2 = dy * cp + dz * sp, z2 = Math.max(1, -dy * sp + dz * cp), s = c.f / z2 * U; return { x: W / 2 + dx * s, y: H / 2 - y2 * s, s, d: z2 }; };
  // an image triangle (s0, s1, s2 in image pixels) onto a screen triangle (d0, d1, d2), grown a hair to hide seams
  function tri(ctx, img, s0, s1, s2, d0, d1, d2) {
    const [x0, y0] = s0, [x1, y1] = s1, [x2, y2] = s2, den = x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1); if (!den) return;
    const cx = (d0.x + d1.x + d2.x) / 3, cy = (d0.y + d1.y + d2.y) / 3, g = p => { const dx = p.x - cx, dy = p.y - cy, l = Math.hypot(dx, dy) || 1; return [p.x + dx / l * 1.4, p.y + dy / l * 1.4]; };   // grown by a fixed 1.4 px, so no seam shows at any size
    ctx.save(); ctx.beginPath(); ctx.moveTo(...g(d0)); ctx.lineTo(...g(d1)); ctx.lineTo(...g(d2)); ctx.closePath(); ctx.clip();
    const a = (d0.x * (y1 - y2) + d1.x * (y2 - y0) + d2.x * (y0 - y1)) / den, c = (d0.x * (x2 - x1) + d1.x * (x0 - x2) + d2.x * (x1 - x0)) / den;
    const e = (d0.x * (x1 * y2 - x2 * y1) + d1.x * (x2 * y0 - x0 * y2) + d2.x * (x0 * y1 - x1 * y0)) / den;
    const b = (d0.y * (y1 - y2) + d1.y * (y2 - y0) + d2.y * (y0 - y1)) / den, d = (d0.y * (x2 - x1) + d1.y * (x0 - x2) + d2.y * (x1 - x0)) / den;
    const f = (d0.y * (x1 * y2 - x2 * y1) + d1.y * (x2 * y0 - x0 * y2) + d2.y * (x0 * y1 - x1 * y0)) / den;
    ctx.setTransform(a, b, c, d, e, f); ctx.drawImage(img, 0, 0); ctx.restore();
  }
  // a textured quad (4 screen points, 4 image points) as two triangles, then a shade over it
  function quad(ctx, img, S, Dp, shade) {
    tri(ctx, img, S[0], S[1], S[2], Dp[0], Dp[1], Dp[2]); tri(ctx, img, S[0], S[2], S[3], Dp[0], Dp[2], Dp[3]);
    if (shade > .01) { ctx.save(); ctx.fillStyle = `rgba(18,10,4,${shade})`; ctx.beginPath(); Dp.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath(); ctx.fill(); ctx.restore(); }
  }
  const LIGHT = (() => { const l = [-.35, 1, -.45], n = Math.hypot(...l); return l.map(x => x / n); })();
  // A plane whose rows each lie at one depth (a page lying flat, a card rising about a hinge parallel to x) projects
  // every row to a horizontal screen line of uniform scale, so it can be drawn as thin horizontal bands with no
  // clipping and no seams. rowAt(r) gives the row's left and right ends in book space for r = 0..1 (image bottom..top);
  // sx0, sw: the image columns to use.
  function rowsPlane(ctx, v, img, sx0, sw, rowAt, N, wide = false) {
    const ih = img.height; let prev = null;
    for (let k = 0; k <= N; k++) {
      const [L, R] = rowAt(k / N), a = P3(v, ...L), b = P3(v, ...R), cur = { y: a.y, xl: a.x, xr: b.x };
      if (prev) {
        const top = Math.min(prev.y, cur.y), hgt = Math.abs(cur.y - prev.y) + .9, xl = wide ? Math.min(prev.xl, cur.xl) : (prev.xl + cur.xl) / 2, xr = wide ? Math.max(prev.xr, cur.xr) : (prev.xr + cur.xr) / 2;
        const sy = ih * (1 - k / N), sh = ih / N;
        ctx.drawImage(img, sx0, sy, sw, sh, Math.min(xl, xr), top, Math.abs(xr - xl), hgt);
      }
      prev = cur;
    }
  }
  // a flat half page: side -1 left, +1 right; img the spread
  function flatPage(ctx, v, img, side) {
    const iw = img.width / 2, xa = side < 0 ? -PGW : 0, xb = side < 0 ? 0 : PGW;
    ctx.save(); ctx.beginPath(); [[xa, -PGH / 2], [xb, -PGH / 2], [xb, PGH / 2], [xa, PGH / 2]].forEach(([x, z], i) => { const p = P3(v, x, 0, z); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.clip();   // the page's own outline, so its sides stay straight
    rowsPlane(ctx, v, img, side < 0 ? 0 : iw, iw, r => { const z = (r - .5) * PGH; return [[xa, 0, z], [xb, 0, z]]; }, 60, true);
    ctx.restore();
  }
  // a turning page at base angle th: front = the left half of spread A, back = the right half of spread B
  function turningPage(ctx, v, A, B, th) {
    const NU = 16, NV = 4, L = PGW, lag = .72 * Math.sin(th), cells = [];
    const cross = w => {   // the page's cross-section at height w (0 near, 1 far): points and angles from spine to edge
      const pts = [[0, 0]], ang = []; let x = 0, y = 0;
      for (let i = 0; i < NU; i++) { const s = (i + .5) / NU, phi = clamp(th + lag * Math.pow(s, 1.5) * (.9 + .2 * w), .004, Math.PI - .004); ang.push(phi); x += Math.cos(phi) * L / NU; y += Math.sin(phi) * L / NU; pts.push([x, y]); }
      return { pts, ang };
    };
    const secs = Array.from({ length: NV + 1 }, (_, j) => cross(j / NV)), iw = A.width / 2, ih = A.height;
    for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {
      const w0 = j / NV, w1 = (j + 1) / NV, z0 = (w0 - .5) * PGH, z1 = (w1 - .5) * PGH, a = secs[j], b = secs[j + 1];
      const q = [[a.pts[i], z0], [a.pts[i + 1], z0], [b.pts[i + 1], z1], [b.pts[i], z1]].map(([[x, y], z]) => ({ x, y, z }));
      const phi = (a.ang[i] + b.ang[i]) / 2, nF = [Math.sin(phi), -Math.cos(phi), 0], mid = { x: (q[0].x + q[2].x) / 2, y: (q[0].y + q[2].y) / 2, z: (z0 + z1) / 2 };
      const front = nF[0] * (v.x - mid.x) + nF[1] * (v.y - mid.y) > 0, n = front ? nF : nF.map(k => -k), lam = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
      const D3 = q.map(p => P3(v, p.x, p.y, p.z)), u0 = i / NU, u1 = (i + 1) / NU;
      const im = front ? (u, w) => [iw - u * iw, (1 - w) * ih] : (u, w) => [iw + u * iw, (1 - w) * ih];
      cells.push({ d: (D3[0].d + D3[2].d) / 2, img: front ? A : B, S: [im(u0, w0), im(u1, w0), im(u1, w1), im(u0, w1)], D3, shade: .62 * (1 - (.35 + .65 * lam)) });
    }
    cells.sort((p, q) => q.d - p.d).forEach(c => quad(ctx, c.img, c.S, c.D3, c.shade));
    return secs[Math.floor(NV / 2)].pts;
  }
  function poly3(ctx, v, pts, fill) { ctx.beginPath(); pts.forEach(([x, y, z], i) => { const p = P3(v, x, y, z); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
  function drawBook(ctx, t) {
    const v = camBook(t), CD = cards();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // the desk: dark wood whose plank seams run away from us, and the warm pool of a lamp on the book
    ctx.fillStyle = '#120d09'; ctx.fillRect(0, 0, W, H);
    const c0 = P3(v, 0, 0, 0), gl = ctx.createRadialGradient(c0.x, c0.y, 0, c0.x, c0.y, Math.max(W, H) * .75); gl.addColorStop(0, 'rgba(255,190,120,.22)'); gl.addColorStop(.6, 'rgba(120,70,30,.06)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,220,180,.06)'; ctx.lineWidth = 2 * U;
    for (let x = -3300; x <= 3300; x += 330) { const a = P3(v, x, -40, -1800), b = P3(v, x, -40, 5000); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    // the book's cover and the thickness of its pages, with a soft shadow on the desk
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 40 * U; ctx.shadowOffsetY = 18 * U;
    poly3(ctx, v, [[-PGW - 40, -34, -PGH / 2 - 30], [PGW + 40, -34, -PGH / 2 - 30], [PGW + 40, -34, PGH / 2 + 30], [-PGW - 40, -34, PGH / 2 + 30]], '#5a1f22'); ctx.restore();
    poly3(ctx, v, [[-PGW - 40, -34, -PGH / 2 - 30], [PGW + 40, -34, -PGH / 2 - 30], [PGW + 40, -48, -PGH / 2 - 30], [-PGW - 40, -48, -PGH / 2 - 30]], '#3d1416');   // the cover's front edge
    poly3(ctx, v, [[-PGW, 0, -PGH / 2], [PGW, 0, -PGH / 2], [PGW, -30, -PGH / 2], [-PGW, -30, -PGH / 2]], '#d9c9a6');                                // the page block's front edge
    ctx.strokeStyle = 'rgba(120,95,60,.45)'; ctx.lineWidth = 1;
    for (let k = 1; k < 6; k++) { const a = P3(v, -PGW, -k * 5, -PGH / 2), b = P3(v, PGW, -k * 5, -PGH / 2); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    ctx.restore();
    // the two open pages: the left shows how far the turning has come, the right where it started
    let started = 0, landed = 0; for (let i = 0; i < NF; i++) { if (t >= FSTART(i)) started = i + 1; if (t >= FSTART(i) + FDUR) landed = i + 1; }
    const E = landed >= NF ? eras() : [...eras().slice(0, NF), ancientFlat()];
    flatPage(ctx, v, E[started], -1); flatPage(ctx, v, E[landed], 1);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);   // the gutter's shadow
    const gA = P3(v, 0, 0, 0), gB = P3(v, 70, 0, 0), sh = ctx.createLinearGradient(gA.x - (gB.x - gA.x), 0, gB.x, 0); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(.5, 'rgba(0,0,0,.28)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sh; ctx.beginPath(); [[-70, -PGH / 2], [70, -PGH / 2], [70, PGH / 2], [-70, PGH / 2]].forEach(([x, z], i) => { const p = P3(v, x, 0, z); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.fill(); ctx.restore();
    // the pages in the air, each casting a soft shadow on the page under it. Stacking: a page lying nearly flat is the
    // lowest (on the left pile or the right), a page standing nearly upright the highest, so they are drawn from the
    // flattest to the most upright; a page counts as in the air from the first frame of its turn to its last.
    const air = []; for (let i = 0; i < NF; i++) { const u = (t - FSTART(i)) / FDUR; if (u >= 0 && u <= 1) air.push({ i, th: flipAngle(i, t) }); }
    air.sort((a, b) => Math.abs(b.th - Math.PI / 2) - Math.abs(a.th - Math.PI / 2));
    for (const { i, th } of air) {
      const lift = Math.sin(th), tip = PGW * Math.cos(th) * .92;   // the shadow falls under the page, on the side it is over
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); poly3(ctx, v, [[0, 1, -PGH / 2], [tip, 1, -PGH / 2 + 20], [tip, 1, PGH / 2 - 20], [0, 1, PGH / 2]], `rgba(20,10,0,${.22 * lift})`); ctx.restore();
      turningPage(ctx, v, E[i], E[i + 1], th);
    }
    // the pop-ups: die-cut monuments, face toward us from the first frame they lift (no blank back, no card edge)
    if (landed >= NF) {
      const cs = MK.map(([type, label, t0, cx, zc]) => ({ type, label, t0, cx, zc, el: cardUp(t), b: cardBox(type, cx) })).sort((p, q) => q.zc - p.zc);
      for (const q of cs) {   // the shadows first: each silhouette cast back and to the right on the page, away from the lamp
        const sn = Math.sin(q.el), cn = Math.cos(q.el), img = CD[q.type].sh; if (sn < .01) continue;
        ctx.save(); ctx.globalAlpha = .34 * sn;
        rowsPlane(ctx, v, img, 0, img.width, r => { const hh = r * q.b.ch, y = sn * hh, z = q.zc + cn * hh + .45 * y, dx = .35 * y; return [[q.b.x0 + dx, 1, z], [q.b.x1 + dx, 1, z]]; }, 32);
        ctx.restore();
      }
      for (const q of cs) {
        const sn = Math.sin(q.el), cn = Math.cos(q.el), img = CD[q.type].c;
        rowsPlane(ctx, v, img, 0, img.width, r => { const hh = r * q.b.ch; return [[q.b.x0, sn * hh, q.zc + cn * hh], [q.b.x1, sn * hh, q.zc + cn * hh]]; }, 48);   // in bands, so the columns stay straight
        const lk = smooth((t - q.t0 + .05) / .4), top = P3(v, q.cx, sn * (q.b.ch + 70), q.zc + cn * (q.b.ch + 70));   // the word fades in with the voice
        if (lk > 0) YP.hudText(ctx, q.label, top.x, top.y, (P ? 40 : 50) * U, lk * .95, 'text', 500);
      }
    }
    // paper lanterns rising out of the book into the dark
    for (let i = 0; i < 16; i++) {
      const u = (t - (ANSWER - .35 + hash(i, 1) * 1.7)) / 3.2; if (u <= 0) continue;
      const p = P3(v, (hash(i, 2) - .5) * 1600 + 40 * Math.sin(t * .9 + i), 60 + 1700 * easeIn(clamp(u), 1.5), (hash(i, 3) - .5) * 700); const a = smooth(u / .12) * (1 - smooth((u - .8) / .3));
      ctx.save(); ctx.globalAlpha = a; ctx.setTransform(p.s, 0, 0, p.s, p.x, p.y);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(ctx, 0, 0, 130, '#ffb347', .45); ctx.restore();
      ctx.fillStyle = '#ff9a3c'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-24, -32, 48, 64, 15) : ctx.rect(-24, -32, 48, 64); ctx.fill();
      glow(ctx, 0, 0, 32, '#fff1c9', .6); ctx.restore();
    }
    YP.post(ctx);
  }

  // ═══ C · the scan (ঙ, 24.9–32.9) and the dive (ঙ→ঘ, 32.9–35.1) ═══════════════════════════════
  const TURN1 = LENS + .9, LAB0 = LENS + .2, BR_IN = LENS - .05;

  // the MRI (v7, director 2026-09-29: the deck of v5 was the better animation; fix only the brain turning into slices
  // and the big middle slice hiding the deck). The scan beam turns the brain into its own cross-section as it passes
  // (no swap); the deck fans out around that same section, which keeps its place in the middle of the deck instead of
  // sitting in front of it; on "চেতনা" the deck parts to both sides and that section comes forward through the gap
  const VB = S.brain(360, 0, 0), ZS = 1150, NS = 7, MID = 3, VLIGHT = VB.centre;
  const SCAN0 = SLICE - .6, SCAN1 = SLICE + .6, FAN0 = SLICE + .45;
  const beamX = t => lerp(VB.box.x0 - 80, VB.box.x1 + 80, easeIO(clamp((t - SCAN0) / (SCAN1 - SCAN0))));
  const fan = t => easeIO(clamp((t - FAN0) / 1.5));
  const part = t => easeIO(clamp((t - LIT + 1.1) / .9));   // the deck parts to both sides...
  const pull = t => easeIO(clamp((t - LIT + .8) / 1.1));   // ...and the middle section comes forward, clear of the others
  const DX = P ? 110 : 230, DY = P ? 70 : 45, DZ = P ? 150 : 140, ZT = P ? 700 : 540, PAN = P ? -150 : -330;
  const slicePos = (i, t) => {
    const o = i - MID, k = fan(t);
    if (!o) { const p = pull(t); return { x: 0, y: -40 * p, z: ZS - ZT * p, rot: 0 }; }
    const away = t > PUSH ? 400 * easeIn(clamp((t - PUSH) / 1.8), 2) : 0;
    return { x: o * DX * k + Math.sign(o) * (1300 * part(t) + away), y: -o * DY * k, z: ZS + o * DZ * k, rot: o * .03 * k };
  };
  const lightC = t => { const q = slicePos(MID, t); return [q.x + VLIGHT[0], q.y + VLIGHT[1], q.z]; };
  const Z0 = P ? -700 : -250;
  const sway = u => 120 * Math.sin((u - LAB0) * .35) * smooth((u - SLICE) / 1.5);
  const camX = t => sway(t) + PAN * fan(t) * (1 - part(t));   // the near half of the deck looks bigger: pan so the whole deck sits centred
  function camC(t) {
    if (t < PUSH) return D.view({ x: camX(t), y: 0, z: Z0, focus: slicePos(MID, t).z - Z0, aperture: 14 }, W, H);
    const k = clamp((t - PUSH) / (CUT - PUSH)), m = smooth(k / .45), L = lightC(t), z = lerp(Z0, L[2] - 60, easeIn(k, 2.6));
    return D.view({ x: lerp(camX(PUSH), L[0], m), y: lerp(0, L[1], m), z, focus: Math.max(40, L[2] - z), aperture: 14 + 36 * k }, W, H);
  }
  const outline = c => { c.beginPath(); VB.outline.pts.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
  const STEM = [...VB.stem[0].pts, ...VB.stem[1].pts.slice().reverse()];
  function drawSlice(c, o, frame = 1) {   // one MRI section on its glass plate; o: its distance from the midline, −3..3
    const a = Math.abs(o), ls = Math.sqrt(1 - (o / 4.2) ** 2), med = 1 - a / 3;   // sections away from the midline are smaller
    c.save(); c.scale(ls, ls); c.lineCap = 'round'; c.lineJoin = 'round';
    if (frame > .004) { c.save(); c.globalAlpha *= frame; rr(c, -385, -330, 770, 660, 22); c.fillStyle = 'rgba(150,215,255,.07)'; c.fill(); c.strokeStyle = 'rgba(63,240,208,.6)'; c.lineWidth = 2.5; c.stroke(); c.restore(); }   // the plate, sized to its section
    outline(c); c.fillStyle = '#ff7eb3'; c.fill();   // grey matter
    c.save(); c.translate(-10, 12); c.scale(.72 + .1 * med, .66 + .1 * med); outline(c); c.fillStyle = '#ffb3d4'; c.fill(); c.restore();   // white matter, more of it toward the middle
    c.strokeStyle = '#c2477a'; c.lineWidth = 5;
    VB.sulci.forEach((p, j) => { if ((j + a) % 2 && a < 3) return; c.beginPath(); p.pts.forEach(([x, y], q) => q ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); });
    if (a < 3) {   // the cerebellum, and at the midline the brainstem
      if (!a) { c.fillStyle = '#c2477a'; c.beginPath(); STEM.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); }
      c.fillStyle = '#e0588f'; c.beginPath(); VB.cerebellum.pts.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill();
      c.strokeStyle = '#b23c72'; c.lineWidth = 3; VB.folia.forEach(p => { c.beginPath(); p.pts.forEach(([x, y], q) => q ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); });
    }
    if (a < 3) { const s = [.6, 1, .55][a]; c.fillStyle = '#6a2f78'; c.beginPath(); c.ellipse(-36, -8, 95 * s, 24 * s, -.12, 0, TAU); c.fill(); }   // the ventricles, widest just off the midline
    if (!a) { c.strokeStyle = '#fff0f6'; c.lineWidth = 15; c.beginPath(); c.ellipse(-30, 30, 165, 92, 0, Math.PI * 1.1, Math.PI * 1.92); c.stroke(); }   // the corpus callosum arching over them
    c.restore();
  }
  function drawC(ctx, t) {
    const v = camC(t), bx = beamX(t), frame = smooth((t - SCAN1 + .3) / .6);
    YV.bg(ctx, v);
    const order = Array.from({ length: NS }, (_, i) => i).filter(i => i === MID || fan(t) > 0).sort((a, b) => slicePos(b, t).z - slicePos(a, t).z);
    for (const i of order) {
      const o = i - MID, q = slicePos(i, t);
      if (o) { const k = fan(t); D.plane(ctx, v, q.x, q.y, q.z, 420, 360, c => drawSlice(c, o, smooth((k - .3) / .4)), { alpha: smooth(k / .25) * (1 - .08 * Math.abs(o)) * (1 - .5 * part(t)), rot: q.rot, fog: 0 }); continue; }
      D.plane(ctx, v, q.x, q.y, q.z, 460, 400, c => {
        // the one brain: its surface ahead of the beam, its section behind it
        if (t < SCAN1) { c.save(); c.beginPath(); c.rect(bx, -500, 1000, 1000); c.clip(); const s = .94 + .06 * smooth((t - LENS) / 1.2); c.scale(s, s); YV.brain(c, 'under', VB, 1); YV.brain(c, 'cerebrum', VB, 1); YV.brain(c, 'sulci', VB, 1); c.restore(); }
        if (bx > VB.box.x0 - 70) { c.save(); c.beginPath(); c.rect(-1000, -500, bx + 1000, 1000); c.clip(); drawSlice(c, 0, frame); c.restore(); }
        // the light of consciousness in the middle section, and the question around it
        const k = smooth((t - LIT + .1) / .5) * (1 + .5 * env(t, LIT, LIT + .3, LIT + .4, LIT + 1.1));
        c.save(); c.translate(VLIGHT[0], VLIGHT[1]);
        if (k > 0) { const gg = c.createRadialGradient(0, 0, 0, 0, 0, 150); gg.addColorStop(0, `rgba(255,201,60,${.45 * Math.min(1, k)})`); gg.addColorStop(1, 'rgba(255,95,162,0)'); c.fillStyle = gg; c.beginPath(); c.arc(0, 0, 150, 0, TAU); c.fill();
          for (const [mm, col, a] of [[44, '#ff9f43', .5], [28, '#ffc93c', .95], [15, '#fff3c4', 1]]) { c.fillStyle = F.rgba(F.hex(col), a * Math.min(1, k)); c.beginPath(); c.arc(0, 0, mm * (.7 + .3 * Math.min(1, k)), 0, TAU); c.fill(); } }
        const kr = 1 - smooth((t - PUSH - .5) / .5);
        YV.ring(c, 74, easeIO((t - LIT + .05) / .8), .9 * kr);   // the ring of the unknown draws itself on "চেতনা"; the question joins on "কী"
        c.save(); c.translate(96, -84); YV.text(c, '?', 64, smooth((t - ASK) / .35) * kr, { role: 'amber' }); c.restore();
        c.restore();
      }, { fog: 0 });
    }
    // the scan beam, on the brain's own plane so its line sits exactly on the seam
    const sb = clamp((t - SCAN0) / (SCAN1 - SCAN0));
    if (sb > 0 && sb < 1) D.plane(ctx, v, 0, 0, slicePos(MID, t).z, 540, 480, c => YV.scan(c, bx, VB.box.y0 - 70, VB.box.y1 + 70, Math.sin(Math.PI * sb)), { fog: 0 });
    drawDust(ctx, YV, v, t, .35);
    YV.post(ctx);
    // the vector world melts into cinematic depth as the camera reaches the light
    const cin = smooth((t - 33.9) / .75);
    if (cin > 0) {
      ctx.save(); ctx.globalAlpha = cin; YD.bg(ctx, v); ctx.restore();
      const lp = D.proj(v, ...lightC(t));
      if (lp) { ctx.save(); ctx.globalAlpha = cin; YD.rays(ctx, lp.x, lp.y, 10 * lp.s, .9, t); YD.light(ctx, lp.x, lp.y, 10 * lp.s, 1 + 1.6 * smooth((t - 34.2) / .8)); ctx.restore(); }
      drawDust(ctx, YD, v, t, .8 * cin);
    }
    if (t > MYST) YD.fill(ctx, 'flash', .95 * smooth((t - MYST - .05) / (35.05 - MYST - .05)));
  }

  // ─── the title, after the hard cut (ঘ) ───
  const TITLE = ['মৃত্যুর', 'পর', 'কি', 'চেতনা', 'থাকে?'], T_IN = CUT + .2;
  function drawEnd(ctx, t) {
    YD.fill(ctx, 'end', 1);
    drawDust(ctx, YD, D.view({ x: 0, y: 0, z: (t - CUT) * 260, focus: 700, aperture: 40 }, W, H), t, .8);
    if (t >= T_IN) {
      const size = (P ? 98 : 100) * U, gap = size * .3, rows = P ? [TITLE.slice(0, 3), TITLE.slice(3)] : [TITLE];
      let i = 0;
      rows.forEach((row, ri) => {
        const ws = row.map(s => YD.measure(ctx, s, size)), y = H / 2 + (ri - (rows.length - 1) / 2) * size * 1.35 - 10 * U;
        let x = W / 2 - (ws.reduce((a, b) => a + b, 0) + gap * (row.length - 1)) / 2;
        row.forEach((s, j) => { const k = smooth((t - T_IN - i * .1) / .28); YD.hudText(ctx, s, x + ws[j] / 2, y + 14 * U * (1 - k), size, k, 'text', 700); x += ws[j] + gap; i++; });
      });
      const uy = H / 2 + (rows.length * size * 1.35) / 2 + 18 * U, uw = 140 * U * easeOut((t - CUT - .5) / .4);
      YD.hud(ctx, [[W / 2 - uw / 2, uy], [W / 2 + uw / 2, uy]], 3 * U, 1, 'amber');
    }
    YD.post(ctx);
  }

  // ─── sound effects, about 10 dB under the voice ───
  const LEVEL = .48;
  const SFX = [
    { t: .05, type: 'drone', dur: 7.8, f: 49, g: .5 },
    ...HB.filter(([bt]) => bt >= 0).map(([bt, a]) => ({ t: bt, type: 'heartbeat', g: .8 * a })),   // the heart's last beats
    { t: 2.95, type: 'exhale', dur: 1.3, g: .1 },                                                  // the last breath
    { t: .4, type: 'spark', dur: BO1 - .4, rate: 7, fade: 1, g: .2 },                              // the brain of lights at work, thinning out
    { t: BO0, type: 'powerDown', dur: 2.4, f: 196, g: .32 },                                       // its lights going out
    { t: ZM0 - .1, type: 'bloom', dur: 1.8, f: 294, g: .35 },                                       // the light flares
    { t: ZM0, type: 'air', dur: 1.4, f0: 500, f1: 1300, peak: .7, g: .14 },                         // the zoom into it
    ...PANES.map(p => ({ t: p.t0, type: 'air', dur: .7, f0: 1100, f1: 2200, g: .12 })),
    { t: MEM - .05, type: 'bloom', dur: 1.4, f: 392, g: .2 },
    { t: SELF, type: 'air', dur: 1.2, f0: 400, f1: 900, g: .12 },
    ...PANES.map(p => ({ t: p.t1 - .05, type: 'air', dur: .45, f0: 1600, f1: 500, peak: .2, g: .12 })),   // each pane going out
    { t: PAPER, type: 'air', dur: 1, f0: 500, f1: 1200, g: .16 },                                 // into the book
    { t: F0, type: 'flutter', dur: F1 - F0 + .3, g: .24 },                                          // pages turning back through time
    ...Array.from({ length: NF }, (_, i) => ({ t: FSTART(i) + .08, type: 'flip', g: .2, pan: -.3 + .1 * i })),
    { t: F1 + .02, type: 'air', dur: .7, f0: 700, f1: 1500, peak: .3, g: .12 },                       // the monuments leaning up off the page
    ...[RELIG, PHIL, LIT_].map((t0, i) => ({ t: t0 + .05, type: 'bloom', dur: 1.4, f: [262, 294, 330][i], g: .2 })),
    { t: ANSWER - .2, type: 'air', dur: 2.2, f0: 500, f1: 1400, peak: .6, g: .14 },            // the lanterns rising
    { t: LENS, type: 'air', dur: .9, f0: 900, f1: 250, peak: .45, g: .16 },   // the fade to black and back
    { t: SCAN0, type: 'scan', dur: SCAN1 - SCAN0 + .3, n: 5, g: .32 },
    ...[-3, -2, -1, 1, 2, 3].map(o => ({ t: FAN0 + .08 + Math.abs(o) * .1 + (o > 0 ? .05 : 0), type: 'slide', dur: .35, g: .1, pan: o * .08 })),   // the deck fanning out
    { t: LIT - 1.1, type: 'air', dur: 1, f0: 900, f1: 400, peak: .4, g: .12 },                       // the deck parting
    { t: LIT - .8, type: 'air', dur: 1.1, f0: 300, f1: 800, peak: .6, g: .1 },                        // the middle one coming forward
    { t: LIT - .05, type: 'bloom', dur: 1.8, f: 330, g: .35 }, { t: ASK, type: 'air', dur: .6, g: .1 },
    { t: PUSH, type: 'riser', dur: CUT - PUSH, f0: 200, f1: 2400, g: .22 },
    { t: CUT, type: 'impact', size: .9, g: .42 },
  ].map(c => ({ ...c, g: c.g * LEVEL }));
  /*END*/
  const fontsReady = Promise.race([
    Promise.all(['Hind Siliguri', 'Noto Serif Bengali'].flatMap(f => [500, 600, 700].map(wt => document.fonts.load(`${wt} 60px "${f}"`, 'মৃত্যু বিজ্ঞান')))),
    new Promise(r => setTimeout(r, 5000)),
  ]);
  const label = t => { let s = ''; for (const x of T.words) if (x[1] <= t + 1e-6) s = x[0]; return s; };
  F.scene(ID, { W, H, duration: DUR, draw: (ctx, t) => { D.frameStart(); drawScene(ctx, t); }, ready: fontsReady.then(() => { eras(); cards(); ancientFlat(); }), label, sfx: typeof SFX !== 'undefined' ? SFX : [], grain: 'frame' });
  const [FXC, FXX] = F.canvas(W, H);   // an offscreen frame for crossfades
  const fxClean = () => { FXX.setTransform(1, 0, 0, 1, 0, 0); FXX.globalAlpha = 1; FXX.globalCompositeOperation = 'source-over'; FXX.filter = 'none'; };
  function drawScene(ctx, t) {
    if (t >= CUT) return drawEnd(ctx, t);
    if (t < XF0) return drawHook(ctx, t);
    if (t < TH) {   // the zoom has put the light where segment A has it, at its size: the room's last traces fade away around it
      drawA(ctx, t); fxClean(); drawHook(FXX, t);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - smooth((t - XF0) / (TH - XF0)); ctx.drawImage(FXC, 0, 0); ctx.restore(); return;
    }
    if (t < PAPER) return drawA(ctx, t);
    if (t < PAPER + .9) {   // the last light dissolves into the open book
      drawBook(ctx, t); fxClean(); drawA(FXX, t);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - smooth((t - PAPER) / .9); ctx.drawImage(FXC, 0, 0); ctx.restore(); return;
    }
    if (t < LENS) return drawBook(ctx, t);
    if (t < TURN1) {   // a dip to black: the book fades out, the brain fades in (director, 2026-09-29: a fade, not a page turn)
      const k = (t - LENS) / (TURN1 - LENS);
      if (k < .5) { drawBook(ctx, t); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.globalAlpha = smooth(k / .5); ctx.fillRect(0, 0, W, H); ctx.restore(); }
      else { drawC(ctx, t); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.globalAlpha = 1 - smooth((k - .5) / .5); ctx.fillRect(0, 0, W, H); ctx.restore(); }
      return;
    }
    drawC(ctx, t);
  }
})();
