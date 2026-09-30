// Scene 05 · Two claims (1:42.283–2:03.166 of voice/Death.mp3), v2 (2026-09-29): ঙ vector cards in a parallax depth,
// ending in ঘ. The red curtain of scene 04 parts and the camera pushes through the proscenium into a deep space
// (a gradient backdrop, a far dot grid, colour blobs far behind, bokeh chips drifting past in front, all sliding at
// their own rates). Two claims are floating glass cards that assemble from their parts on the voice, take a dashed
// verdict badge and settle back, as a product page scrolls: a brain beaming a world ("প্রমাণ নেই"); an eye with a
// toggle that goes off while the meter beside it keeps counting ("প্রতিষ্ঠিত নিয়ম নয়"). Then the amber light alone with
// the question that remains, and a dive through a vector brain in depth layers into its neurons, where a violet
// shimmer flickers beside a dashed "?".
// v1 (a paper puppet theatre) is kept as film.old-style.js while he reviews.
(function () {
  'use strict';
  const F = FILM, D = F.depth, { clamp, smooth, easeIO, easeOut, easeIn, easeOutBack, lerp, keyed, noise1, hash, rng, TAU } = F;
  const ID = 'scene-05', T = window.TIMING[ID], DUR = T.duration;
  const { W, H, portrait: P } = F.format(), U = Math.min(W, H) / 1080;
  const YV = F.style25('vector', W, H), YD = F.style25('depth', W, H);
  const norm = s => s.normalize('NFC').replace(/[।,?!—'"()\s]/g, '');
  const w = (word, n = 1) => { let k = 0; for (const x of T.words) if (norm(x[0]) === norm(word) && ++k === n) return x[1]; throw new Error(`${ID}: no word "${word}" (${n})`); };
  const MIND = w('চেতনা'), REAL = w('বাস্তবতা'), MAKES = w('তৈরি'), DOES1 = w('করে'), PROOF = w('প্রমাণ'), NONE = w('নেই');
  const AWARE = w('সচেতন'), PRESENCE = w('উপস্থিতি'), WITHOUT = w('ছাড়া'), QM = w('কোয়ান্টাম', 2), MEASURE = w('মাপজোক'), POSSIBLE = w('সম্ভব'), NOT1 = w('নয়'), EST2 = w('প্রতিষ্ঠিত', 2), RULE = w('নিয়ম'), NOT2 = w('নয়', 2);
  const BUT = w('কিন্তু'), ONE = w('একটি'), INTEREST = w('আকর্ষণীয়'), QUESTION = w('প্রশ্ন'), REMAIN = w('থেকে'), GOES = w('যায়'), BRAIN = w('মস্তিষ্কের'), INSIDE = w('ভেতর'), QUANT = w('কোয়ান্টাম', 3), PROCESS = w('প্রক্রিয়া'), WORK = w('কাজ');
  const glow = (c, x, y, r, col, a) => { if (a <= .004 || r <= 0) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, F.rgba(F.hex(col), a)); g.addColorStop(1, F.rgba(F.hex(col), 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const add = (ctx, f) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; f(); ctx.restore(); };
  const expo = x => 1 - Math.pow(2, -10 * clamp(x));                       // the ease of a product page: fast out, soft landing
  const rise = (t, t0, d = .55) => expo((t - t0) / d);                      // an element's reveal, 0..1
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); };
  const bn = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
  const AMBER = '#ffc93c', MINT = '#3ff0d0', PINK = '#ff5fa2', BLUE = '#7aa7ff';

  // ─── the beats ───
  const T_IN = 1.4;                                        // the push through the curtain
  const SY = P ? 1750 : 1400;                              // one section of the scroll
  const SCROLL2 = AWARE - .1, SCROLL3 = BUT - .05, SCROLL4 = GOES + .05, DIVE0 = BRAIN + .25, DIVE1 = DIVE0 + 1.2;   // the brain scrolls into view before its word; then the dive
  const scroll = t => keyed(t, [[SCROLL2, 0], [SCROLL2 + .9, SY], [SCROLL3, SY], [SCROLL3 + .9, 2 * SY], [SCROLL4, 2 * SY], [SCROLL4 + .85, 3 * SY]]);
  const dolly = t => t < T_IN ? lerp(-700, 0, easeOut(t / T_IN, 2.6)) : t < DIVE0 ? 0 : keyed(t, [[DIVE0, 0], [DIVE1, 1330], [DUR, 1600]], false, x => x < .55 ? easeIn(x / .55, 2) * .55 : .55 + .45 * easeOut((x - .55) / .45, 2));
  const passK = t => smooth((dolly(t) - 1060) / 220);      // 0 outside the brain, 1 inside it
  function camV(t) {
    const z = dolly(t), sway = 1 - smooth((t - DIVE0) / .8);
    return D.view({ x: (P ? 26 : 90) * Math.sin(t * .35) * sway, y: scroll(t) + 14 * Math.sin(t * .5) * sway, z, focus: Math.max(160, 1000 - z), aperture: 14, fogNear: 2600, fogFar: 8000 }, W, H);   // a slow sway for the parallax; less in the narrow frame, so the cards keep their margin
  }

  // ═══ the theatre's curtain and frame, fold for fold as scene 04 drew them (the first frame is scene 04's last) ═══
  const FL = H * .84, CX0 = W * .07, CX1 = W * .93, TOP = H * .1, SC = P ? 7 : 11, FOLDS = P ? 14 : 22, FIB29 = F.fibreTile(29);
  const [THC, THX] = F.canvas(W, H);
  const curtainOpen = t => easeIO(clamp((t - .05) / .75));
  function bakeTheatre(t) {   // the theatre with the parted curtain's gap left clear, so the space shows through it
    const x = THX, open = curtainOpen(t), n = FOLDS / 2, span = (W / 2 - CX0) * (1 - .9 * open), fw = span / n;
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H);
    x.fillStyle = '#1a1014'; x.fillRect(0, 0, W, H);
    const fg = x.createLinearGradient(0, FL, 0, H); fg.addColorStop(0, '#7a5236'); fg.addColorStop(1, '#4a2f1f'); x.fillStyle = fg; x.fillRect(0, FL, W, H - FL); x.fillStyle = '#9a6a45'; x.fillRect(0, FL, W, 6 * U);
    if (open > 0) x.clearRect(CX0 + span - 1, TOP, (CX1 - span) - (CX0 + span) + 2, FL - TOP);   // the gap between the halves
    for (const side of [-1, 1]) for (let i = 0; i < n; i++) {
      const fx = (side < 0 ? CX0 : CX1 - span) + i * fw, g = x.createLinearGradient(fx, 0, fx + fw, 0); g.addColorStop(0, '#6e0f1a'); g.addColorStop(.35, '#b3283a'); g.addColorStop(.6, '#c93a4b'); g.addColorStop(1, '#7a1320');
      x.save(); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 12 * U; x.shadowOffsetX = 4 * U; x.fillStyle = g;
      x.beginPath(); x.moveTo(fx, TOP); x.lineTo(fx + fw + 1, TOP); x.lineTo(fx + fw + 1, FL + 8 * U); x.quadraticCurveTo(fx + fw / 2, FL + 22 * U, fx, FL + 8 * U); x.closePath(); x.fill(); x.restore();
    }
    const seam = 1 - smooth(open / .06); if (seam > 0) { x.fillStyle = `rgba(0,0,0,${.35 * seam})`; x.fillRect(W / 2 - 2 * U, TOP, 4 * U, FL - TOP); }
    add(x, () => { for (let i = 0; i < 9; i++) glow(x, CX0 + (i + .5) * (CX1 - CX0) / 9, FL + 14 * U, 90 * U, '#ffb24d', .35); });
    x.save(); x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 18 * U; x.shadowOffsetY = 8 * U;
    x.fillStyle = '#5c0c16'; x.beginPath(); x.moveTo(0, 0); x.lineTo(W, 0); x.lineTo(W, H * .16); for (let i = SC; i >= 0; i--) { const px = i * W / SC; x.quadraticCurveTo(px + W / SC / 2, H * .22, px, H * .16); } x.closePath(); x.fill(); x.restore();
    x.strokeStyle = '#d8a64a'; x.lineWidth = 5 * U; x.beginPath(); for (let i = 0; i <= SC; i++) { const px = i * W / SC; if (!i) x.moveTo(px, H * .16); else x.quadraticCurveTo(px - W / SC / 2, H * .22, px, H * .16); } x.stroke();
    for (const [x0, x1] of [[0, CX0], [CX1, W]]) { x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 20 * U; x.fillStyle = '#3d0a12'; x.fillRect(x0, 0, x1 - x0, H); x.restore(); x.fillStyle = '#d8a64a'; x.fillRect(x0 === 0 ? x1 - 5 * U : x0, H * .16, 5 * U, FL - H * .16); }
    x.globalAlpha = .22; x.globalCompositeOperation = 'source-atop'; x.fillStyle = x.createPattern(FIB29, 'repeat'); x.fillRect(0, 0, W, H); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    return THC;
  }
  // the vignette and fibre scene 04 laid over its frame (its post), so frame 0 matches; they thin out with the push
  const VIGP = F.vignette(W, H, .45), FIBP = (() => { const [c, x] = F.canvas(W, H); x.fillStyle = x.createPattern(F.fibreTile(29), 'repeat'); x.fillRect(0, 0, W, H); return c; })();
  function drawTheatre(ctx, t) {
    const a = 1 - smooth((t - .95) / .4); if (a <= 0) return;
    const s = 1 + 3.6 * easeIn(clamp((t - .05) / (T_IN - .05)), 1.7), img = bakeTheatre(t);   // the proscenium flies past as the camera pushes through (still, at 1:1, for the first frames: scene 04's last frame exactly)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.translate(W / 2, H * .47); ctx.scale(s, s); ctx.translate(-W / 2, -H * .47); ctx.drawImage(img, 0, 0); ctx.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(VIGP, 0, 0); ctx.globalAlpha = .22 * a; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(FIBP, 0, 0); ctx.restore();
  }

  // ═══ the space: backdrop, a far dot grid, colour blobs far behind, bokeh chips in front ═══
  const BLOBS = Array.from({ length: 16 }, (_, i) => ({ x: (hash(i, 1) - .5) * 5200, y: hash(i, 2) * 4 * SY - SY * .6, z: 1900 + hash(i, 3) * 1800, r: 150 + hash(i, 4) * 220, c: i % 4, a: .1 + hash(i, 5) * .1 }));
  const CHIPS = Array.from({ length: 70 }, (_, i) => ({ x: (hash(i, 6) - .5) * 3600, y: hash(i, 7) * 4.4 * SY - SY * .7, z: 260 + hash(i, 8) * 560, r: 6 + hash(i, 9) * 16, c: i % 4, a: .3 + hash(i, 10) * .4, ph: hash(i, 11) * 10 }));
  function drawSpace(ctx, v, t, a = 1) {
    YV.bg(ctx, v);
    const gd = 2600 - v.z, gs = v.f / gd * v.U; if (gd > 50) {   // the dot grid, far back
      const step = 120, x0 = Math.floor((v.x - W / 2 / gs) / step) * step, x1 = v.x + W / 2 / gs, y0 = Math.floor((v.y - H / 2 / gs) / step) * step, y1 = v.y + H / 2 / gs;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(255,255,255,${.11 * a})`;
      for (let gx = x0; gx <= x1; gx += step) for (let gy = y0; gy <= y1; gy += step) { const p = D.proj(v, gx, gy, 2600); if (p) { ctx.beginPath(); ctx.arc(p.x, p.y, 2.2 * U, 0, TAU); ctx.fill(); } }
      ctx.restore();
    }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (const b of BLOBS) { const p = D.proj(v, b.x, b.y, b.z); if (p) YV.node(ctx, b.c, p.x, p.y, b.r * p.s, D.coc(v, p.d) + 40, b.a * a * (.8 + .2 * Math.sin(t * .4 + b.x))); }
    ctx.restore();
  }
  function drawChips(ctx, v, t, a = 1) {   // the foreground layer: small bokeh chips drifting, sliding fastest with the camera
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (const q of CHIPS) { const p = D.proj(v, q.x + 40 * noise1(t * .2 + q.ph, 3), q.y + 30 * noise1(t * .17 + q.ph, 4), q.z); if (p && p.x > -60 && p.x < W + 60 && p.y > -60 && p.y < H + 60) YV.node(ctx, q.c, p.x, p.y, q.r * p.s, D.coc(v, p.d), q.a * a * (.7 + .3 * Math.sin(t * .8 + q.ph))); }
    ctx.restore();
  }

  // ═══ the cards (painted in world units around their centre) ═══
  const CARD = P ? { w: 880, h: 820 } : { w: 1200, h: 600 };
  function cardBase(c, w, h, a) {   // a glass card: dark translucent fill, a hairline, a highlight along the top, a soft shadow
    if (a <= .004) return;
    c.save(); c.globalAlpha *= a;
    c.shadowColor = 'rgba(8,0,40,.5)'; c.shadowBlur = 70; c.shadowOffsetY = 34; rrect(c, -w / 2, -h / 2, w, h, 40); c.fillStyle = 'rgba(26,15,70,.82)'; c.fill();
    c.shadowColor = 'rgba(0,0,0,0)'; c.shadowBlur = 0; c.shadowOffsetY = 0;
    c.save(); rrect(c, -w / 2, -h / 2, w, h, 40); c.clip(); const g = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, 'rgba(255,255,255,.07)'); g.addColorStop(.5, 'rgba(255,255,255,.02)'); g.addColorStop(1, 'rgba(255,95,162,.06)'); c.fillStyle = g; c.fillRect(-w / 2, -h / 2, w, h); c.restore();
    c.strokeStyle = 'rgba(255,255,255,.16)'; c.lineWidth = 2; rrect(c, -w / 2, -h / 2, w, h, 40); c.stroke();
    const hl = c.createLinearGradient(-w / 2, 0, w / 2, 0); hl.addColorStop(0, 'rgba(255,255,255,0)'); hl.addColorStop(.5, 'rgba(255,255,255,.5)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); c.strokeStyle = hl; c.lineWidth = 2; c.beginPath(); c.moveTo(-w / 2 + 50, -h / 2 + 1); c.lineTo(w / 2 - 50, -h / 2 + 1); c.stroke();
    c.restore();
  }
  function tile(c, x, y, w, h, a, r = 28) {   // a small panel inside a card
    if (a <= .004) return;
    c.save(); c.globalAlpha *= a; c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 24; c.shadowOffsetY = 10; rrect(c, x - w / 2, y - h / 2, w, h, r); c.fillStyle = 'rgba(255,255,255,.06)'; c.fill();
    c.shadowColor = 'rgba(0,0,0,0)'; c.strokeStyle = 'rgba(255,255,255,.14)'; c.lineWidth = 1.5; c.stroke(); c.restore();
  }
  // a pill of words that arrive on their times; dashed (a claim, in amber) or solid (mint). k pops it in
  function pill(c, words, times, t, x, y, size, a, dashed = true, k = 1) {
    const a0 = a * smooth((t - times[0] + .05) / .3); if (a0 <= .004) return;
    const gap = size * .28, ws = words.map(s => YV.measure(c, s, size, 700)), total = ws.reduce((p, q) => p + q, 0) + gap * (words.length - 1), col = dashed ? AMBER : MINT;
    c.save(); c.translate(x, y); c.scale(k, k);
    let cx = -total / 2, right = -total / 2;
    words.forEach((s, i) => { const ai = smooth((t - times[i] + .05) / .3); if (ai > 0) { c.save(); c.translate(cx + ws[i] / 2, 0); YV.text(c, s, size, a0 * ai, { role: 'text', weight: 700, glow: .3, body: true }); c.restore(); right = cx + ws[i] * ai; } cx += ws[i] + gap; });
    c.globalAlpha = a0; if (dashed) c.setLineDash([size * .22, size * .16]); c.lineWidth = size * .07; c.strokeStyle = col; c.shadowColor = F.rgba(F.hex(col), .5); c.shadowBlur = size * .4;
    rrect(c, -total / 2 - size * .55, -size * .78, right + total / 2 + size * 1.1, size * 1.56, size * .78); c.stroke();
    c.restore();
  }
  const badgeK = (t, t0) => easeOutBack(clamp((t - t0 + .05) / .4), 2.2);   // a badge stamps in with a little overshoot
  const label = (c, s, x, y, size, a, weight = 600) => { if (a <= .004) return; c.save(); c.translate(x, y); YV.text(c, s, size, a, { role: 'text', weight, glow: .4 }); c.restore(); };
  const claimChip = (c, w, h, a) => pill(c, ['দাবি'], [-1], 0, -w / 2 + 110, -h / 2 + 62, 28, a, true);   // every card is a claim: a small dashed chip in its corner

  // ─── card 1: the mind making reality ───
  const B1 = F.sci.brain(P ? 88 : 96, 0, 0);
  function landscape(c, x, y, s, a) {   // a small world in a tile: sky, hills, a sun
    if (a <= .004) return;
    c.save(); c.globalAlpha *= a; c.translate(x, y); rrect(c, -s / 2, -s / 2, s, s, 30); c.clip();
    const g = c.createLinearGradient(0, -s / 2, 0, s / 2); g.addColorStop(0, '#2c1760'); g.addColorStop(.55, '#7aa7ff'); g.addColorStop(1, '#3ff0d0'); c.fillStyle = g; c.fillRect(-s / 2, -s / 2, s, s);
    c.fillStyle = AMBER; c.beginPath(); c.arc(s * .2, -s * .12, s * .13, 0, TAU); c.fill();
    c.fillStyle = '#2e9f7a'; c.beginPath(); c.arc(-s * .28, s * .5, s * .5, Math.PI, 0); c.fill(); c.fillStyle = '#1f7a5c'; c.beginPath(); c.arc(s * .3, s * .58, s * .52, Math.PI, 0); c.fill();
    c.restore();
  }
  function drawCard1(c, t) {
    const on = rise(t, T_IN - .5, .7), done = smooth((t - NONE - .5) / .6), a = on * (1 - .45 * done);
    c.translate(0, 40 * (1 - on) + 22 * done); c.scale(1 - .03 * done, 1 - .03 * done);
    const { w, h } = CARD; cardBase(c, w, h, a); claimChip(c, w, h, a * .9);
    const bx = P ? -210 : -w * .3, by = P ? -215 : 10, tx = P ? 210 : w * .29, ty = P ? 125 : 4, ts = 230;   // the brain, the world; in 4:5 on a diagonal
    const k1 = rise(t, T_IN + .2), k2 = rise(t, T_IN + .55);
    // the brain, with the light in it
    c.save(); c.globalAlpha *= a * k1; c.translate(bx, by - 26 * (1 - k1)); c.scale(.96 + .04 * k1, .96 + .04 * k1);
    YV.brain(c, 'under', B1, 1); YV.brain(c, 'cerebrum', B1, 1); YV.brain(c, 'sulci', B1, 1);
    YV.light(c, B1.centre[0], B1.centre[1], 5, k1); c.restore();
    label(c, 'চেতনা', bx, by + (P ? 122 : 128), 40, a * smooth((t - MIND + .05) / .4));
    // the world tile
    c.save(); c.globalAlpha *= a * k2; tile(c, tx, ty - 26 * (1 - k2), ts + 36, ts + 36, 1, 40); landscape(c, tx, ty - 26 * (1 - k2), ts, 1); c.restore();
    label(c, 'বাস্তবতা', tx, ty + ts / 2 + 62, 40, a * smooth((t - REAL + .05) / .4));
    // the dashed arrow of the claim, drawing itself on "তৈরি করে"; it dissolves under the verdict
    const ak = expo((t - MAKES + .1) / .7) * (1 - smooth((t - NONE - .1) / .5));
    if (ak > .004) {
      const [x0, y0] = P ? [bx + 120, by + 95] : [bx + 150, by], [x1, y1] = P ? [tx - 150, ty - 148] : [tx - ts / 2 - 40, ty];
      const xe = lerp(x0, x1, ak), ye = lerp(y0, y1, ak), ang = Math.atan2(y1 - y0, x1 - x0);
      c.save(); c.globalAlpha *= a; c.strokeStyle = AMBER; c.lineWidth = 5; c.lineCap = 'round'; c.setLineDash([16, 14]); c.shadowColor = 'rgba(255,201,60,.5)'; c.shadowBlur = 16;
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(xe, ye); c.stroke(); c.setLineDash([]);
      c.translate(xe, ye); c.rotate(ang); c.beginPath(); c.moveTo(-26, -16); c.lineTo(0, 0); c.lineTo(-26, 16); c.stroke(); c.restore();
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;   // its caption sits just above the arrow, along it
      pill(c, ['তৈরি', 'করে'], [MAKES, DOES1], t, mx + Math.sin(ang) * 72, my - Math.cos(ang) * 72, 30, a * ak, true);
    }
    // the verdict, stamped along the bottom edge, clear of the labels
    pill(c, ['প্রমাণ', 'নেই'], [PROOF, NONE], t, P ? -w / 2 + 240 : 0, h / 2 - (P ? 75 : 70), 44, a, true, badgeK(t, PROOF));
  }

  // ─── card 2: nobody watching ───
  const TICK0 = SCROLL2 + 1.1, TICKD = .42;
  const ticks = t => Math.max(0, Math.floor((t - TICK0) / TICKD) + 1);
  const RES = Array.from({ length: 40 }, (_, i) => hash(i, 21) < .5);   // up or down, per measurement
  function eyeIcon(c, x, y, s, a, off) {   // the eye, struck through once the presence is off
    if (a <= .004) return;
    c.save(); c.globalAlpha *= a; c.translate(x, y); c.lineCap = 'round'; c.lineJoin = 'round';
    const dim = 1 - .55 * off;
    c.strokeStyle = `rgba(255,255,255,${.9 * dim})`; c.lineWidth = s * .07; c.beginPath(); c.moveTo(-s / 2, 0); c.quadraticCurveTo(0, -s * .42, s / 2, 0); c.quadraticCurveTo(0, s * .42, -s / 2, 0); c.closePath(); c.stroke();
    c.fillStyle = off > .5 ? '#8f7cf0' : MINT; c.globalAlpha *= dim; c.beginPath(); c.arc(0, 0, s * .17, 0, TAU); c.fill(); c.fillStyle = '#1a1147'; c.beginPath(); c.arc(0, 0, s * .08, 0, TAU); c.fill(); c.globalAlpha = a;
    if (off > 0) { c.strokeStyle = PINK; c.lineWidth = s * .08; c.shadowColor = 'rgba(255,95,162,.6)'; c.shadowBlur = 14; c.beginPath(); c.moveTo(-s * .42, s * .36); c.lineTo(lerp(-s * .42, s * .42, off), lerp(s * .36, -s * .36, off)); c.stroke(); }
    c.restore();
  }
  function toggle(c, x, y, a, on) {   // a switch: mint when on, grey when off; the knob slides
    if (a <= .004) return;
    c.save(); c.globalAlpha *= a; c.translate(x, y);
    rrect(c, -62, -28, 124, 56, 28); c.fillStyle = on > .5 ? F.rgba(F.hex(MINT), .35 + .55 * on) : `rgba(255,255,255,${.12 + .1 * on})`; c.fill(); c.strokeStyle = 'rgba(255,255,255,.2)'; c.lineWidth = 1.5; c.stroke();
    c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 10; c.shadowOffsetY = 4; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(lerp(-34, 34, on), 0, 22, 0, TAU); c.fill();
    c.restore();
  }
  function meter(c, x, y, w, h, t, a) {   // the measurements: a live count, a bar per result, a lamp that blinks on each
    if (a <= .004) return;
    const n = ticks(t), since = t - (TICK0 + (n - 1) * TICKD), blink = n ? Math.exp(-Math.max(0, since) * 8) : 0;
    tile(c, x, y, w, h, a, 32);
    c.save(); c.globalAlpha *= a; c.translate(x, y);
    label(c, 'কোয়ান্টাম', -w / 2 + 96, -h / 2 + 46, 26, smooth((t - QM + .05) / .35) * .85, 500); label(c, 'মাপজোক', -w / 2 + 96 + 130, -h / 2 + 46, 26, smooth((t - MEASURE + .05) / .35) * .85, 500);
    c.fillStyle = blink > .3 ? MINT : 'rgba(63,240,208,.25)'; c.shadowColor = 'rgba(63,240,208,.8)'; c.shadowBlur = 16 * blink; c.beginPath(); c.arc(w / 2 - 40, -h / 2 + 46, 9, 0, TAU); c.fill(); c.shadowBlur = 0;   // the lamp
    c.save(); c.translate(0, -h * .1 - 6); const pop = 1 + .08 * blink; c.scale(pop, pop); YV.text(c, bn(n), 92, 1, { role: 'signal', weight: 700, glow: .5, body: true }); c.restore();   // the count
    const bw = 14, gap = 8, cols = Math.floor((w - 60) / (bw + gap)), first = Math.max(0, n - cols), base = h / 2 - 34;   // the last results as bars, up in mint and down in pink
    for (let i = first; i < n; i++) { const k = i - first, up = RES[i % RES.length], grow = i === n - 1 ? expo(since / .25) : 1, bh = (up ? 48 : 30) * grow; c.fillStyle = up ? MINT : PINK; c.globalAlpha = a * (.35 + .65 * (k + 1) / cols); rrect(c, -w / 2 + 30 + k * (bw + gap), base - bh, bw, bh, 5); c.fill(); }
    c.restore();
  }
  function drawCard2(c, t) {
    const on = rise(t, SCROLL2 + .55, .7), done = smooth((t - NOT2 - .45) / .6), a = on * (1 - .45 * done);
    c.translate(0, 40 * (1 - on) + 22 * done); c.scale(1 - .03 * done, 1 - .03 * done);
    const { w, h } = CARD; cardBase(c, w, h, a); claimChip(c, w, h, a * .9);
    const off = smooth((t - WITHOUT + .02) / .35);
    const ex = P ? -225 : -w * .3, ey = P ? -197 : -30, mx = P ? 0 : w * .23, my = P ? 164 : 10, mw = P ? w * .8 : 470, mh = P ? 260 : 320;
    const k1 = rise(t, SCROLL2 + .8), k2 = rise(t, SCROLL2 + 1.05);
    // the eye tile and its switch
    c.save(); c.globalAlpha *= a * k1; c.translate(0, -26 * (1 - k1)); tile(c, ex, ey, 230, 230, 1, 40); eyeIcon(c, ex, ey, 150, 1, off); toggle(c, ex, ey + 168, 1, 1 - off); c.restore();
    const lx = P ? 198 : ex, ly = P ? ey - 20 : ey - 175;
    label(c, 'সচেতন', lx, ly, 34, a * smooth((t - AWARE + .05) / .4) * (1 - .5 * off)); label(c, 'উপস্থিতি', lx, ly + 44, 34, a * smooth((t - PRESENCE + .05) / .4) * (1 - .5 * off));
    // the claim: without it, no measurement
    pill(c, ['সম্ভব', 'নয়'], [POSSIBLE, NOT1], t, P ? 198 : ex, P ? ey + 70 : ey + 240, 32, a * (1 - smooth((t - EST2) / .4)), true);
    // the meter that keeps counting
    c.save(); c.globalAlpha *= a * k2; c.translate(0, -26 * (1 - k2)); meter(c, mx, my, mw, mh, t, 1); c.restore();
    pill(c, ['প্রতিষ্ঠিত', 'নিয়ম', 'নয়'], [EST2, RULE, NOT2], t, P ? 200 : w / 2 - 300, h / 2 - (P ? 70 : 78), 42, a, true, badgeK(t, EST2));
  }

  // ─── the question that remains, under the light alone ───
  const QW = [['একটি', ONE], ['আকর্ষণীয়', INTEREST], ['প্রশ্ন', QUESTION], ['থেকে', REMAIN], ['যায়।', GOES]];
  function drawQuestion(c, t) {
    const size = P ? 58 : 64, gap = size * .32, rows = P ? [QW.slice(0, 3), QW.slice(3)] : [QW];
    rows.forEach((row, ri) => {
      const ws = row.map(([s]) => YV.measure(c, s, size, 600)), total = ws.reduce((p, q) => p + q, 0) + gap * (row.length - 1), y = (ri - (rows.length - 1) / 2) * size * 1.4;
      let x = -total / 2;
      row.forEach(([s, t0], i) => { const k = rise(t, t0 - .02, .6); if (k > 0) { c.save(); c.translate(x + ws[i] / 2, y + 24 * (1 - k)); YV.text(c, s, size, k, { role: 'text', weight: 600 }); c.restore(); } x += ws[i] + gap; });
    });
  }

  // ─── the brain ahead, in three depth layers, that the camera dives through ───
  const BB = F.sci.brain(P ? 420 : 500, 0, 0), BZ = 1000, BY3 = 3 * SY + (P ? 60 : 30);
  function drawBrainLayers(ctx, v, t) {
    const near = smooth((v.z - 300) / 500);   // it brightens as we come at it
    const layers = [['back', BZ, 1], ['under', BZ + 110, 1], ['cerebrum', BZ + 110, 1], ['sulci', BZ + 230, 1]];
    for (const [part, z, k] of layers) {
      const p = D.proj(v, 0, BY3, z); if (!p) continue;
      D.plane(ctx, v, 0, BY3, z, 1100, 900, c => { YV.brain(c, part, BB, k, part === 'back' ? .6 + .4 * near : 1); }, { blurMul: 0, fog: .5 });
    }
    const lp = D.proj(v, BB.centre[0], BY3 + BB.centre[1], BZ + 110);   // the light, in the brain
    if (lp) { YV.rays(ctx, lp.x, lp.y, 6 * lp.s, .35, t); YV.light(ctx, lp.x, lp.y, 6 * lp.s, 1); }
    const la = smooth((t - BRAIN + .05) / .4) * (1 - smooth((v.z - 380) / 260));   // gone before the dive brings it close
    if (la > 0) D.plane(ctx, v, 0, BY3 - (P ? 560 : 482), BZ - 40, 500, 80, c => { const a1 = YV.measure(c, 'মস্তিষ্কের', 44, 600), a2 = YV.measure(c, 'ভেতর', 44, 600), g = 16, x0 = -(a1 + g + a2) / 2; label(c, 'মস্তিষ্কের', x0 + a1 / 2, 0, 44, la); label(c, 'ভেতর', x0 + a1 + g + a2 / 2, 0, 44, la * smooth((t - INSIDE + .05) / .4)); }, { fog: 0 });
  }

  // ═══ the vector world, one frame ═══
  function drawWorld(ctx, t) {
    const v = camV(t);
    drawSpace(ctx, v, t);
    // the two cards, on the main plane, and the question between them and the brain
    if (t < SCROLL2 + 1.6) D.plane(ctx, v, 0, 0, 1000, CARD.w / 2 + 60, CARD.h / 2 + 60, c => drawCard1(c, t), { fog: 0 });
    if (t > SCROLL2 - .2 && t < SCROLL3 + 1.6) D.plane(ctx, v, 0, SY, 1000, CARD.w / 2 + 60, CARD.h / 2 + 60, c => drawCard2(c, t), { fog: 0 });
    if (t > SCROLL3 - .2) {
      const lp = D.proj(v, 0, 2 * SY - (P ? 250 : 190), 1000), lk = smooth((t - SCROLL3 - .6) / .6) * (1 - smooth((v.z - 500) / 300));
      if (lp && lk > 0) { YV.rays(ctx, lp.x, lp.y, 9 * lp.s, .4 * lk, t); YV.light(ctx, lp.x, lp.y, 9 * lp.s, lk); }
      D.plane(ctx, v, 0, 2 * SY + (P ? 20 : 40), 1000, 700, 140, c => drawQuestion(c, t), { fog: 0, alpha: 1 - smooth((v.z - 500) / 300) });
    }
    if (t > SCROLL4 - .3) drawBrainLayers(ctx, v, t);
    drawChips(ctx, v, t, 1 - smooth((v.z - 600) / 300));
    YV.post(ctx);
  }

  // ═══ ঘ · inside: the neuron field, the violet shimmer, the dashed "?" ═══
  const NEU = (() => {
    const r = rng(55), nodes = [];
    for (let i = 0; i < 1200; i++) nodes.push({ x: (r() - .5) * 4200, y: (r() - .5) * 3000, z: 200 + r() * 4600, size: .7 + r() * .9, tw: r() * 10 });
    const edges = [];
    nodes.forEach((a, i) => { const c = []; for (let j = i + 1; j < nodes.length; j++) { const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z); if (d < 430) c.push([j, d]); } c.sort((p, q) => p[1] - q[1]).slice(0, 2).forEach(([j]) => edges.push({ a: i, b: j, period: 1.2 + hash(i, j) * 2.2, phase: hash(j, i), spark: hash(i + 7, j) < .3 })); });
    return { nodes, edges };
  })();
  const camI = t => { const z = keyed(t, [[DIVE1 - .5, -300], [DUR, 700]], false, x => easeOut(x, 2.2)); return D.view({ x: 30 * Math.sin(t * .3), y: 20 * Math.sin(t * .23), z, focus: Math.max(300, 1500 - z), aperture: 24, fogNear: 1600, fogFar: 4200 }, W, H); };   // the focus stays on the shimmer as the camera drifts toward it
  const MOTES = Array.from({ length: 150 }, (_, i) => ({ x: (hash(i, 1) - .5) * 3600, y: (hash(i, 2) - .5) * 2400, z: hash(i, 3) * 3200, r: 2 + hash(i, 4) * 4, ph: hash(i, 5) * 10 }));
  const wrap = (a, span) => ((a % span) + span * 1.5) % span - span / 2;
  function drawDust(ctx, v, t, a) {
    for (const m of MOTES) {
      const dx = wrap(m.x + 30 * noise1(t * .15 + m.ph, 3) - v.x, 3600), dy = wrap(m.y + 20 * noise1(t * .12 + m.ph, 4) - v.y, 2400), dz = ((m.z - v.z) % 3200 + 3200) % 3200 + 120;
      const p = D.proj(v, v.x + dx, v.y + dy, v.z + dz); if (!p) continue;
      const fade = smooth((dz - 120) / 300) * (1 - smooth((dz - 2800) / 400)) * smooth((1800 - Math.abs(dx)) / 300) * smooth((1200 - Math.abs(dy)) / 250);
      YD.dust(ctx, p.x, p.y, m.r * p.s, D.coc(v, p.d), .55 * a * fade);
    }
  }
  const SHN = 160, SHP = P ? [120, 40, 1500] : [280, -40, 1500], QP = P ? [-230, -200, 1460] : [-230, -70, 1460], [SHC, SHX] = F.canvas(SHN, SHN), SHD = SHX.createImageData(SHN, SHN);   // the shimmer and the "?", placed for each frame
  function shimmerTex(t, e) {   // two-source interference in violet, faded to nothing at its rim
    const n = SHN, h = n / 2, d = SHD.data, k = .8, om = 5, S3 = [[h - 12, h + 4], [h + 9, h - 10], [h + 3, h + 12]];   // three sources: irregular fringes, like light on water
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      let A = 0; for (const [sx, sy] of S3) A += Math.cos(k * Math.hypot(x - sx, y - sy) - om * t); A /= 3; const I = A * A;
      const rim = smooth(1 - Math.hypot(x - h, y - h) / (h - 3)), ee = e * rim, o = (y * n + x) * 4;
      d[o] = 150 * I * ee + 30; d[o + 1] = 110 * I * ee + 10; d[o + 2] = 255 * Math.min(1, I * ee + .15); d[o + 3] = 255 * Math.min(1, (I * ee * .9 + .12 * ee));
    }
    SHX.putImageData(SHD, 0, 0);
  }
  function drawInside(ctx, t) {
    const v = camI(t);
    YD.bg(ctx, v);
    const N = NEU.nodes, Pj = N.map(n => D.proj(v, n.x, n.y, n.z)), list = [];
    const lum = N.map((n, i) => { const p = Pj[i]; return p ? (.6 + .4 * noise1(t * 1.4 + n.tw, 2)) * (1 - .8 * D.fog(v, p.d)) : 0; });
    for (const e of NEU.edges) {
      const a = Pj[e.a], b = Pj[e.b]; if (!a || !b) continue;
      if ((a.x < -60 && b.x < -60) || (a.x > W + 60 && b.x > W + 60) || (a.y < -60 && b.y < -60) || (a.y > H + 60 && b.y > H + 60)) continue;
      const bl = D.coc(v, (a.d + b.d) / 2), al = Math.min(lum[e.a], lum[e.b]) * .7 / (1 + bl / 4);
      if (al > .03) list.push([a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2, b.x, b.y, Math.min(1, al)]);
    }
    YD.edges(ctx, list, 1.2 * U);
    N.forEach((n, i) => { const p = Pj[i]; if (p && lum[i] > .01 && p.x > -120 && p.x < W + 120 && p.y > -120 && p.y < H + 120) YD.node(ctx, i, p.x, p.y, 3.6 * n.size * p.s, D.coc(v, p.d), Math.min(1.4, lum[i])); });
    for (const e of NEU.edges) {
      if (!e.spark) continue;
      const al = Math.min(lum[e.a], lum[e.b]); if (al < .3) continue;
      const ph = t / e.period + e.phase, u = ph - Math.floor(ph); if (u > .5) continue;
      const a = N[e.a], b = N[e.b], k = u / .5, p = D.proj(v, lerp(a.x, b.x, k), lerp(a.y, b.y, k), lerp(a.z, b.z, k)); if (!p) continue;
      YD.spark(ctx, p.x, p.y, 3.2 * p.s, D.coc(v, p.d), Math.min(1, al) * Math.sin(Math.PI * k));
    }
    // the violet shimmer among the neurons on "কোয়ান্টাম", flickering, its words under it; the dashed "?" beside it on "কাজ"
    const e = smooth((t - QUANT + .05) / .45) * (.55 + .45 * clamp(noise1(t * 9, 7) * 1.5 + .5));
    if (e > .01) { shimmerTex(t, e); D.plane(ctx, v, ...SHP, 240, 240, c => { c.globalCompositeOperation = 'lighter'; c.drawImage(SHC, -240, -240, 480, 480); }, { fog: .3 }); }
    const w1 = smooth((t - QUANT + .05) / .4), w2 = smooth((t - PROCESS + .05) / .4);
    if (w1 > 0) D.plane(ctx, v, SHP[0], SHP[1] + 290, SHP[2] - 20, 400, 60, c => { const a1 = YD.measure(c, 'কোয়ান্টাম', 46, 600), a2 = YD.measure(c, 'প্রক্রিয়া', 46, 600), g = 18, x0 = -(a1 + g + a2) / 2; c.save(); c.translate(x0 + a1 / 2, 0); YD.text(c, 'কোয়ান্টাম', 46, w1, { weight: 600, glow: .5 }); c.restore(); c.save(); c.translate(x0 + a1 + g + a2 / 2, 0); YD.text(c, 'প্রক্রিয়া', 46, w2, { weight: 600, glow: .5 }); c.restore(); }, { fog: 0 });
    const q = smooth((t - WORK + .05) / .45);
    if (q > 0) D.plane(ctx, v, ...QP, 160, 200, c => { c.font = YD.fontOf(300, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.setLineDash([16, 12]); c.lineWidth = 6; c.strokeStyle = `rgba(255,178,77,${.95 * q})`; c.shadowColor = `rgba(255,178,77,${.6 * q})`; c.shadowBlur = 30; c.strokeText('?', 0, 20); }, { fog: 0 });
    drawDust(ctx, v, t, .6);
    YD.post(ctx);
  }

  // ─── the frame ───
  const [FXC, FXX] = F.canvas(W, H);
  function drawScene(ctx, t) {
    const k = passK(t);
    if (k <= 0) { drawWorld(ctx, t); if (t < T_IN) drawTheatre(ctx, t); return; }
    drawInside(ctx, t);
    if (k < 1) {   // through the brain: the vector world, pink and huge, gives way to the inside
      FXX.setTransform(1, 0, 0, 1, 0, 0); FXX.globalAlpha = 1; FXX.globalCompositeOperation = 'source-over'; FXX.filter = 'none'; drawWorld(FXX, t);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - k; ctx.drawImage(FXC, 0, 0); ctx.restore();
    }
    const fl = Math.exp(-Math.pow((t - (DIVE0 + 1.05)) / .12, 2)) * .5; if (fl > .01) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = fl; ctx.fillStyle = '#ffd6ea'; ctx.fillRect(0, 0, W, H); ctx.restore(); }   // a soft pink flash as the lens passes the cortex
  }

  // ─── sound effects, about 10 dB under the voice ───
  const LEVEL = .48;
  const airy = (t0, g = .1) => ({ t: t0, type: 'air', dur: .6, f0: 900, f1: 1600, g });
  const nT = ticks(SCROLL3) ;
  const SFX = [
    { t: .05, type: 'cloth', dur: .8, g: .3 }, { t: .05, type: 'slide', dur: .7, g: .16 }, { t: .1, type: 'swoosh', dur: T_IN, f0: 260, f1: 1100, peak: .7, g: .3 },   // the curtain parts, the push through
    { t: T_IN - .4, type: 'air', dur: .8, f0: 500, f1: 1400, g: .14 }, { t: T_IN + .2, type: 'pop', g: .1 }, { t: T_IN + .55, type: 'pop', g: .1 },                  // the card and its parts
    airy(MIND), airy(REAL), { t: MAKES + .05, type: 'trace', dur: .8, g: .16 },
    { t: PROOF, type: 'stampSmall', g: .3 }, { t: PROOF, type: 'tap', g: .12 }, { t: NONE, type: 'stampSmall', g: .3 }, { t: NONE + .5, type: 'air', dur: .7, f0: 1400, f1: 500, peak: .3, g: .1 },   // the verdict, the card settling back
    { t: SCROLL2, type: 'swoosh', dur: .9, f0: 500, f1: 900, peak: .5, g: .2 }, { t: SCROLL2 + .5, type: 'air', dur: .8, f0: 500, f1: 1400, g: .14 }, { t: SCROLL2 + .8, type: 'pop', g: .1 }, { t: SCROLL2 + 1.05, type: 'pop', g: .1 },
    ...Array.from({ length: nT }, (_, i) => ({ t: TICK0 + i * TICKD, type: 'tick', g: .14 })),                                                                     // the meter counting
    airy(AWARE), airy(PRESENCE), { t: WITHOUT, type: 'clack', g: .16 }, { t: WITHOUT + .02, type: 'powerDown', dur: .5, f: 330, g: .12 },                            // the switch goes off
    airy(QM), airy(MEASURE), airy(POSSIBLE),
    { t: EST2, type: 'stampSmall', g: .3 }, { t: EST2, type: 'tap', g: .12 }, { t: RULE, type: 'stampSmall', g: .3 }, { t: NOT2, type: 'stampSmall', g: .3 }, { t: NOT2 + .45, type: 'air', dur: .7, f0: 1400, f1: 500, peak: .3, g: .1 },
    { t: SCROLL3, type: 'swoosh', dur: .9, f0: 500, f1: 900, peak: .5, g: .2 }, { t: SCROLL3 + .6, type: 'bloom', dur: 1.8, f: 294, g: .24 },                       // the light alone
    airy(ONE), airy(INTEREST), airy(QUESTION),
    { t: SCROLL4, type: 'swoosh', dur: .9, f0: 500, f1: 900, peak: .5, g: .2 },                                                                                     // the brain scrolls into view
    { t: DIVE0, type: 'riser', dur: 1.05, f0: 200, f1: 1800, g: .22 }, { t: DIVE0 + 1.05, type: 'impact', size: .5, f: 60, g: .3 },                                // the dive through the cortex
    { t: DIVE0 + .9, type: 'drone', dur: DUR - DIVE0 - .9, f: 52, g: .3 }, { t: DIVE0 + 1.1, type: 'spark', dur: DUR - DIVE0 - 1.1, rate: 4, g: .16 },
    { t: QUANT, type: 'shimmer', dur: 2, g: .2 }, { t: WORK, type: 'air', dur: .7, f0: 400, f1: 900, g: .12 },
  ].map(c => ({ ...c, g: c.g * LEVEL }));

  const fontsReady = Promise.race([
    Promise.all(['Hind Siliguri', 'Noto Serif Bengali'].flatMap(f => [500, 600, 700].map(wt => document.fonts.load(`${wt} 60px "${f}"`, 'প্রমাণ নেই প্রতিষ্ঠিত নিয়ম')))),
    new Promise(r => setTimeout(r, 5000)),
  ]);
  const label_ = t => { let s = ''; for (const x of T.words) if (x[1] <= t + 1e-6) s = x[0]; return s; };
  F.scene(ID, { W, H, duration: DUR, draw: (ctx, t) => { D.frameStart(); drawScene(ctx, t); }, ready: fontsReady, label: label_, sfx: SFX, grain: 'frame' });
})();
