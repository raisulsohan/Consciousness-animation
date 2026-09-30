// Scene 08 · The real mystery (3:10.250–3:41.220 of voice/Death.mp3), v1 (2026-09-29). It opens on scene 07's last
// frame: scene 07's world goes on moving on its own clock (its code, loaded with the page) while the dark closes in on
// the far card; on "না।" black, one beat of silence. Then ঘ: the violet shimmer of the quantum idea ("কোয়ান্টাম
// পদার্থবিদ্যা", and "নয়") drains into its centre, and what is left there is the amber light, larger than ever, the
// camera circling it ("আসল রহস্য · চেতনা নিজেই"). The camera backs off and a glass balance scale draws itself under the
// light: the brain on one pan (≈ ১.৪ কেজি; the voice says "কয়েক কিলোগ্রাম"), and out of it, word by word, five worlds
// in glass orbs fly over to the other pan until it outweighs the brain (ভালোবাসা, ভয়, স্মৃতি, স্বপ্ন, কল্পনা); on
// "অস্তিত্বের অনুভূতি" they all pour up into the light. "এখনো জানি না": the scale fades. The ground comes up under the
// light and the road forks: a solid road into a forest of neurons ("নিউরোবায়োলজি") and a dashed one into a dotted,
// shimmering dark of atoms ("প্রকৃতির গভীর স্তর"); each ends at a "?". No papercut: ঘ for the inner world, the glass
// language of scenes 05 v2–07 for the scale and the labels.
(function () {
  'use strict';
  const F = FILM, D = F.depth, { clamp, smooth, easeIO, easeOut, easeIn, easeOutBack, lerp, keyed, noise1, hash, rng, TAU } = F;
  const ID = 'scene-08', T = window.TIMING[ID], DUR = T.duration;
  const { W, H, portrait: P } = F.format(), U = Math.min(W, H) / 1080;
  const YV = F.style25('vector', W, H), YD = F.style25('depth', W, H);
  const norm = s => s.normalize('NFC').replace(/[।,?!—'"()\s]/g, '');
  const w = (word, n = 1) => { let k = 0; for (const x of T.words) if (norm(x[0]) === norm(word) && ++k === n) return x[1]; throw new Error(`${ID}: no word "${word}" (${n})`); };
  const QUESTION = w('প্রশ্নটা'), END = w('শেষ'), NO = w('না'), BECAUSE = w('কারণ'), REAL = w('আসল'), MYST = w('রহস্যটা'), QU = w('কোয়ান্টাম'), PHYS = w('পদার্থবিদ্যা'), NOT = w('নয়');
  const REAL2 = w('আসল', 2), MIND = w('চেতনা'), ITSELF = w('নিজেই');
  const FEW = w('কয়েক'), KG = w('কিলোগ্রাম'), BRAIN = w('মস্তিষ্কের'), HOW = w('কীভাবে'), BIRTH = w('জন্ম');
  const LOVE = w('ভালোবাসা'), FEAR = w('ভয়'), MEMORY = w('স্মৃতি'), DREAM = w('স্বপ্ন'), IMAG = w('কল্পনা'), OWN = w('নিজের'), EXIST = w('অস্তিত্বের'), FEEL = w('অনুভূতি');
  const WE = w('আমরা'), STILL = w('এখনো'), KNOW = w('জানি'), NO2 = w('না', 2);
  const MAYBE = w('হয়তো'), NEURO = w('নিউরোবায়োলজির'), WITHIN = w('মধ্যেই'), NATURE = w('প্রকৃতির'), DEEP = w('গভীর'), LAYER = w('স্তর'), UNDER = w('বুঝতে');
  const glow = (c, x, y, r, col, a) => { if (a <= .004 || r <= 0) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, F.rgba(F.hex(col), a)); g.addColorStop(1, F.rgba(F.hex(col), 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const expo = x => 1 - Math.pow(2, -10 * clamp(x));
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); };
  const AMBER = '#ffc93c', MINT = '#3ff0d0', PINK = '#ff5fa2', BLUE = '#7aa7ff', VIOLET = '#b98cff';
  const spring = u => u <= 0 ? 0 : 1 - Math.exp(-5 * u) * Math.cos(10 * u);   // a step that overshoots a little and settles

  // ═══ the glass language of scenes 06–07 (their painters) ═══
  function pill(c, words, times, t, x, y, size, a, dashed = true, k = 1, align = 'center') {
    const a0 = a * smooth((t - times[0] + .05) / .3); if (a0 <= .004) return 0;
    const gap = size * .28, ws = words.map(s => YV.measure(c, s, size, 700)), total = ws.reduce((p, q) => p + q, 0) + gap * (words.length - 1), col = dashed ? AMBER : MINT;
    c.save(); c.translate(align === 'left' ? x + total / 2 + size * .55 : x, y); c.scale(k, k);
    let cx = -total / 2, right = -total / 2;
    words.forEach((s, i) => { const ai = smooth((t - times[i] + .05) / .3); if (ai > 0) { c.save(); c.translate(cx + ws[i] / 2, 0); YV.text(c, s, size, a0 * ai, { role: 'text', weight: 700, glow: .3, body: true }); c.restore(); right = cx + ws[i] * ai; } cx += ws[i] + gap; });
    c.globalAlpha = a0; if (dashed) c.setLineDash([size * .22, size * .16]); c.lineWidth = size * .07; c.strokeStyle = col; c.shadowColor = F.rgba(F.hex(col), .5); c.shadowBlur = size * .4;
    if (!dashed) { rrect(c, -total / 2 - size * .55, -size * .78, right + total / 2 + size * 1.1, size * 1.56, size * .78); c.fillStyle = F.rgba(F.hex(MINT), .1); c.fill(); }
    rrect(c, -total / 2 - size * .55, -size * .78, right + total / 2 + size * 1.1, size * 1.56, size * .78); c.stroke();
    c.restore();
    return total + size * 1.1;
  }
  const badgeK = (t, t0) => easeOutBack(clamp((t - t0 + .05) / .4), 2.2);
  const say = (c, s, x, y, size, a, o = {}) => { if (a <= .004) return; c.save(); c.translate(x, y); YV.text(c, s, size, a, { role: 'text', weight: 600, glow: .35, ...o }); c.restore(); };
  function words(c, list, t, x, y, size, a, align = 'center', o = {}) {   // a row of words, each fading in and rising a little on its time
    const wt = o.weight || 600, gap = size * .3, ws = list.map(([s]) => YV.measure(c, s, size, wt)), tot = ws.reduce((p, q) => p + q, 0) + gap * (list.length - 1);
    let xx = align === 'left' ? x : align === 'right' ? x - tot : x - tot / 2;
    list.forEach(([s, t0], i) => { const k = smooth((t - t0 + .05) / .35); say(c, s, xx + ws[i] / 2, y + 12 * (1 - k), size, a * k, { weight: wt, ...o }); xx += ws[i] + gap; });
    return tot;
  }

  // ═══ scene 07, carried on: its world keeps moving on its own clock (its registered draw, loaded with the page), and
  // the dark closes in on the far card "মৃত্যুর পর চেতনা?" until "না।" ═══
  const S7 = F.getScene('scene-07'), DUR7 = S7 ? S7.duration : 34.134;
  const ISLP = P ? [W / 2, H / 2 - 440 * U] : [W / 2 + 470 * U, H / 2 - 320 * U];   // where scene 07's far card is on screen
  const DARK0 = QUESTION + .35, DARK1 = NO;
  function drawA(ctx, t) {
    if (S7) S7.draw(ctx, DUR7 + t); else { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); }
    const k = smooth((t - DARK0) / (DARK1 - DARK0)); if (k <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
    const R = Math.hypot(W, H) * 1.15 * (1 - easeIn(k, 1.3)) + 1, g = ctx.createRadialGradient(ISLP[0], ISLP[1], R * .3, ISLP[0], ISLP[1], R);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = smooth((t - (DARK1 - .6)) / .6); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);   // the last of it
    ctx.restore();
  }

  // ═══ ঘ: the dark space round the light (world units; the light's plane is z 1000) ═══
  const LW = [0, -300, 1000];
  const CAM_B = [0, -300, 300], CAM_C = P ? [0, 150, -100] : [0, 110, 0], CAM_E = P ? [0, -60, -520] : [0, -120, -400];
  const PULL0 = ITSELF + .45, PULL1 = PULL0 + 1.1, FORK0 = NO2 + .15, FORK1 = FORK0 + 1.5;
  function camD(t) {
    const b = easeIO((t - PULL0) / (PULL1 - PULL0)), e = easeIO((t - FORK0) / (FORK1 - FORK0));
    let [x, y, z] = [0, 1, 2].map(i => lerp(lerp(CAM_B[i], CAM_C[i], b), CAM_E[i], e));
    z += 260 * easeIO((t - FORK1) / (DUR - FORK1));                                              // on down the roads, slowly
    x += keyed(t, [[NEURO - .3, 0], [WITHIN + .2, P ? -110 : -230], [NATURE - .3, P ? -110 : -230], [LAYER + .3, P ? 80 : 150]]);   // a lean to one road, then the other
    x += 10 * Math.sin(t * .4); y += 6 * Math.sin(t * .55);
    return D.view({ x, y, z, focus: LW[2] - z, aperture: 10, maxBlur: 30, fogNear: 2400, fogFar: 9000 }, W, H);
  }
  // dust round the light; the camera circles the light (the dust turns about the light's vertical axis)
  const MOTES = Array.from({ length: 220 }, (_, i) => ({ x: (hash(i, 1) - .5) * 3400, y: (hash(i, 2) - .5) * 2400, z: -900 + hash(i, 3) * 3000, r: 2 + hash(i, 4) * 4, ph: hash(i, 5) * 10 }));
  const orbit = t => .05 * t + .6 * smooth((t - NOT) / 4);
  function drawMotes(ctx, v, t, a) {
    const th = orbit(t), cs = Math.cos(th), sn = Math.sin(th);
    for (const m of MOTES) {
      const mx = m.x + 30 * noise1(t * .15 + m.ph, 3), my = m.y + 20 * noise1(t * .12 + m.ph, 4);
      const p = D.proj(v, LW[0] + mx * cs - m.z * sn, LW[1] + my, LW[2] + mx * sn + m.z * cs); if (!p || p.d < 60 || p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) continue;
      YD.dust(ctx, p.x, p.y, m.r * p.s, D.coc(v, p.d), .5 * a * smooth((p.d - 60) / 200) * (1 - D.fog(v, p.d)));
    }
  }
  // the violet shimmer of scene 05–06 (three-source interference, faded to nothing at its rim)
  const SHN = 160, [SHC, SHX] = F.canvas(SHN, SHN), SHD = SHX.createImageData(SHN, SHN);
  function shimmerTex(t, e) {
    const n = SHN, h = n / 2, d = SHD.data, k = .8, om = 5, S3 = [[h - 12, h + 4], [h + 9, h - 10], [h + 3, h + 12]];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      let A = 0; for (const [sx, sy] of S3) A += Math.cos(k * Math.hypot(x - sx, y - sy) - om * t); A /= 3; const I = A * A;
      const rim = smooth(1 - Math.hypot(x - h, y - h) / (h - 3)), ee = e * rim, o = (y * n + x) * 4;
      d[o] = 150 * I * ee + 30; d[o + 1] = 110 * I * ee + 10; d[o + 2] = 255 * Math.min(1, I * ee + .15); d[o + 3] = 255 * Math.min(1, (I * ee * .9 + .12 * ee));
    }
    SHX.putImageData(SHD, 0, 0);
  }
  // B: the shimmer fades up on "কারণ" and drains into its centre on "নয়"; what is left there is the light
  const DRAIN0 = NOT + .05, DRAIN1 = DRAIN0 + 1.05, LIT0 = DRAIN0 + .55, LIT1 = LIT0 + 1.1;
  function drawShimmer(ctx, v, t) {
    const on = smooth((t - BECAUSE + .2) / .9), dr = easeIn(clamp((t - DRAIN0) / (DRAIN1 - DRAIN0)), 1.7), e = on * (1 - dr) * (.8 + .2 * clamp(noise1(t * 9, 7) * 1.5 + .5));
    if (e <= .01) return;
    shimmerTex(t, e);
    D.plane(ctx, v, ...LW, 320, 320, c => { c.globalCompositeOperation = 'lighter'; const s = 1 - .9 * dr; c.drawImage(SHC, -290 * s, -290 * s, 580 * s, 580 * s); c.drawImage(SHC, -290 * s, -290 * s, 580 * s, 580 * s); }, { fog: 0, blurMul: 0 });
  }
  // the light: born where the shimmer drained, larger than ever; smaller over the scale; it flares as the worlds pour in
  let FLARE = () => 0;   // set by the scale (the worlds arriving)
  function drawLight(ctx, v, t) {
    const g = easeOutBack(clamp((t - LIT0) / (LIT1 - LIT0)), 1.4); if (g <= .004) return;
    const p = D.proj(v, ...LW); if (!p) return;
    const rw = 20 * g * lerp(1, .78, easeIO((t - PULL0) / (PULL1 - PULL0))), fl = FLARE(t), k = Math.min(1.9, g * (1 + fl) * (.94 + .06 * Math.sin(t * 2.1)));
    YD.rays(ctx, p.x, p.y, rw * p.s, (.55 - .25 * smooth((t - PULL0) / 1.2)) * Math.min(1, g) * (1 + .6 * fl), orbit(t) * 1.6);
    YD.light(ctx, p.x, p.y, rw * p.s, k);
  }
  function drawWordsB(ctx, v, t) {   // "আসল রহস্য" above; under it first "কোয়ান্টাম পদার্থবিদ্যা নয়", then "চেতনা নিজেই"
    const out = 1 - smooth((t - PULL0) / .5); if (out <= .004 || t < REAL - .1) return;
    D.plane(ctx, v, ...LW, 700, 460, c => {
      const pk = 1 + .06 * Math.exp(-Math.pow((t - REAL2 - .1) / .15, 2));   // "আসল রহস্যটা", again: a nudge
      c.save(); c.translate(0, -300); c.scale(pk, pk); words(c, [['আসল', REAL], ['রহস্য', MYST]], t, 0, 0, 34, out * .85, 'center', { weight: 500 }); c.restore();
      const q = 1 - smooth((t - DRAIN0 - .1) / .6), qy = 270 + 40 * smooth((t - DRAIN0 - .1) / .6);   // the quantum line goes with the shimmer
      if (q > .004) { const tw = words(c, [['কোয়ান্টাম', QU], ['পদার্থবিদ্যা', PHYS]], t, 0, qy, 44, q * out, 'center', { weight: 600 }), nk = smooth((t - NOT + .05) / .3); say(c, 'নয়', tw / 2 + 44, qy + 10 * (1 - nk), 44, q * out * nk, { weight: 700, role: 'amber' }); }
      words(c, [['চেতনা', MIND], ['নিজেই', ITSELF]], t, 0, 250, 64, out, 'center', { weight: 700 });
    }, { fog: 0, blurMul: 0 });
  }

  // ═══ C · the balance scale under the light: the brain on one pan, the worlds it makes on the other ═══
  const SC = P ? { piv: [0, -40], arm: 300, str: 250, base: 600, pan: 290, r: 46, bs: 74 } : { piv: [0, -60], arm: 460, str: 240, base: 540, pan: 400, r: 62, bs: 100 };
  const SC0 = PULL0 + .15, BRL = SC0 + .95, TH0 = -.13, DTH = .07;               // it draws itself; the brain lands on it and tips it
  const BR = F.sci.brain(SC.bs, 0, 0);
  const WORLDS = [[LOVE, 'ভালোবাসা', PINK], [FEAR, 'ভয়', '#ff4d6d'], [MEMORY, 'স্মৃতি', AMBER], [DREAM, 'স্বপ্ন', VIOLET], [IMAG, 'কল্পনা', MINT]].map(([t0, word, tint], k) => {
    const tb = t0 - .18, land = tb + .95, lv = OWN + .05 + k * .09;
    return { k, word, tint, t0, tb, land, lv, arrive: lv + .6 };
  });
  const SLOTS = [[0, 0], [-2.05, 0], [2.05, 0], [-1.03, -1.75], [1.03, -1.75]];   // in orb radii, from the middle of the bottom row
  const theta = t => TH0 * spring(t - BRL) + DTH * WORLDS.reduce((s, o) => s + spring(t - o.land) - spring(t - o.lv), 0);
  const ends = t => { const th = theta(t), c = Math.cos(th), s = Math.sin(th), [px, py] = SC.piv; return { th, L: [px - SC.arm * c, py - SC.arm * s], R: [px + SC.arm * c, py + SC.arm * s] }; };
  const rimOf = e => [e[0], e[1] + SC.str];                                      // a pan hangs straight down from its end of the beam
  const brainAt = t => { const [x, y] = rimOf(ends(t).L), drop = 1 - expo((t - (BRL - .35)) / .45); return [x, y - SC.bs * .95 - 260 * drop]; };
  const slotAt = (t, k) => { const [x, y] = rimOf(ends(t).R), [sx, sy] = SLOTS[k]; return [x + sx * SC.r, y + 20 - SC.r + sy * SC.r]; };
  const qb = (a, m, b, u) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * m + u * u * b;
  FLARE = t => WORLDS.reduce((s, o) => s + .4 * Math.exp(-Math.pow((t - o.arrive) / .12, 2)), 0) + .3 * smooth((t - (OWN + .6)) / .5) * (1 - smooth((t - FEEL - .6) / 1));
  // ─── the worlds, each in a glass orb (painted inside a circle of radius r, age = seconds since it was born) ───
  const PAINT = [
    (c, r, age) => {   // love: two lights circling each other
      const a0 = age * 3.2;
      for (let j = 4; j >= 0; j--) { const a = a0 - j * .12, al = j ? .18 * (1 - j / 5) : 1; for (const [s, col] of [[1, AMBER], [-1, PINK]]) { const x = s * r * .34 * Math.cos(a), y = s * r * .2 * Math.sin(a); c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x, y, r * (j ? .16 : .36), col, al * .9); c.restore(); if (!j) { c.fillStyle = '#fff6e2'; c.beginPath(); c.arc(x, y, r * .08, 0, TAU); c.fill(); } } }
    },
    (c, r, age) => {   // fear: the dark creeping in from the edge toward a small, shaking light
      c.save(); c.globalCompositeOperation = 'lighter'; glow(c, 0, 0, r * .9, '#ff4d6d', .18); c.restore();
      const fl = .75 + .25 * Math.sin(age * 23) * Math.sin(age * 7.3); c.fillStyle = `rgba(255,236,220,${.9 * fl})`; c.beginPath(); c.arc(Math.sin(age * 31) * 1.2, 0, r * .07, 0, TAU); c.fill();
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * TAU + .3, L = r * (.42 + .3 * (.5 + .5 * Math.sin(age * 2.2 + i * 1.7))), wd = .28;
        const g = c.createRadialGradient(0, 0, r - L, 0, 0, r); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.35, 'rgba(2,0,6,.8)'); g.addColorStop(1, 'rgba(2,0,6,.95)');
        c.fillStyle = g; c.beginPath(); c.moveTo(Math.cos(a) * (r - L), Math.sin(a) * (r - L)); c.lineTo(Math.cos(a - wd) * r * 1.02, Math.sin(a - wd) * r * 1.02); c.lineTo(Math.cos(a + wd) * r * 1.02, Math.sin(a + wd) * r * 1.02); c.closePath(); c.fill();
      }
    },
    (c, r, age) => {   // memory: three photographs of places, fanning out
      const spread = easeOutBack(clamp(age / .55), 1.6), pics = [[-1, (x, pw, ph) => { const g = x.createLinearGradient(0, -ph / 2, 0, ph / 2); g.addColorStop(0, '#ff9f6b'); g.addColorStop(1, '#ff5fa2'); x.fillStyle = g; x.fillRect(-pw / 2, -ph / 2, pw, ph); x.fillStyle = '#ffe28a'; x.beginPath(); x.arc(pw * .12, 0, ph * .18, 0, TAU); x.fill(); x.fillStyle = '#3a1d4a'; x.beginPath(); x.moveTo(-pw / 2, ph / 2); x.quadraticCurveTo(-pw * .1, -ph * .05, pw / 2, ph * .22); x.lineTo(pw / 2, ph / 2); x.fill(); }],
        [1, (x, pw, ph) => { const g = x.createLinearGradient(0, -ph / 2, 0, ph / 2); g.addColorStop(0, '#7aa7ff'); g.addColorStop(1, '#1e4f8f'); x.fillStyle = g; x.fillRect(-pw / 2, -ph / 2, pw, ph); x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 1.4; for (let i = 0; i < 3; i++) { x.beginPath(); for (let j = 0; j <= 8; j++) { const px = -pw / 2 + j * pw / 8, py = ph * (.05 + i * .14) + 2 * Math.sin(j * 1.6 + i); j ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); } }],
        [0, (x, pw, ph) => { const g = x.createLinearGradient(0, -ph / 2, 0, ph / 2); g.addColorStop(0, '#9ff3e6'); g.addColorStop(1, '#3ff0d0'); x.fillStyle = g; x.fillRect(-pw / 2, -ph / 2, pw, ph); x.fillStyle = '#6b4a2b'; x.fillRect(-pw * .04, 0, pw * .08, ph / 2); x.fillStyle = '#2e9f7a'; x.beginPath(); x.arc(0, -ph * .02, ph * .3, 0, TAU); x.fill(); }]];
      for (const [s, paint] of pics) {
        const pw = r * .78, ph = r * .6; c.save(); c.translate(s * r * .36 * spread, s ? r * .06 : -r * .08); c.rotate(s * .32 * spread);
        c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 8; c.fillStyle = '#f4ecd8'; c.fillRect(-pw / 2 - 4, -ph / 2 - 4, pw + 8, ph + 12); c.shadowBlur = 0; paint(c, pw, ph); c.restore();
      }
    },
    (c, r, age) => {   // dream: floating islands under a crescent moon, stars blinking
      const g = c.createLinearGradient(0, -r, 0, r); g.addColorStop(0, '#2a1768'); g.addColorStop(1, '#5a3fc0'); c.fillStyle = g; c.fillRect(-r, -r, 2 * r, 2 * r);
      for (let i = 0; i < 14; i++) { const x = (hash(i, 91) - .5) * 1.7 * r, y = (hash(i, 92) - .8) * r, tw = .4 + .6 * Math.abs(Math.sin(age * 2 + i * 1.3)); c.fillStyle = `rgba(255,255,255,${tw})`; c.beginPath(); c.arc(x, y, 1.3, 0, TAU); c.fill(); }
      c.fillStyle = '#fff3c4'; c.beginPath(); c.arc(r * .38, -r * .45, r * .17, 0, TAU); c.fill(); c.fillStyle = '#3a2280'; c.beginPath(); c.arc(r * .46, -r * .5, r * .15, 0, TAU); c.fill();
      for (const [x, y, s, ph] of [[-r * .32, r * .02, 1, 0], [r * .3, r * .3, .7, 1.7]]) {
        const yy = y + r * .06 * Math.sin(age * 1.6 + ph); c.save(); c.translate(x, yy); c.scale(s, s);
        c.fillStyle = '#5b3a8c'; c.beginPath(); c.moveTo(-r * .3, 0); c.lineTo(r * .3, 0); c.lineTo(0, r * .34); c.closePath(); c.fill();
        c.fillStyle = '#3ff0d0'; c.beginPath(); c.ellipse(0, 0, r * .32, r * .08, 0, 0, TAU); c.fill(); c.restore();
      }
    },
    (c, r, age) => {   // imagination: a fractal branching out, growing
      const gr = smooth(age / 1.3), rot = age * .25;
      const br = (x, y, a, len, d) => { const k = clamp(gr * 6 - (6 - d)); if (k <= 0) return; const x1 = x + Math.cos(a) * len * k, y1 = y + Math.sin(a) * len * k; c.strokeStyle = d > 2 ? '#3ff0d0' : AMBER; c.lineWidth = Math.max(.8, d * .7); c.beginPath(); c.moveTo(x, y); c.lineTo(x1, y1); c.stroke(); if (d > 1 && k >= 1) { br(x1, y1, a - .55, len * .7, d - 1); br(x1, y1, a + .55, len * .7, d - 1); } };
      c.save(); c.rotate(rot); c.lineCap = 'round'; for (let i = 0; i < 3; i++) br(0, 0, i / 3 * TAU - Math.PI / 2, r * .3, 6); c.restore();
    },
  ];
  function orb(c, o, r, t) {   // a glass sphere with its world inside
    const age = t - o.tb;
    c.save(); c.globalCompositeOperation = 'lighter'; glow(c, 0, 0, r * 1.9, o.tint, .2); c.restore();
    c.beginPath(); c.arc(0, 0, r, 0, TAU); const g = c.createRadialGradient(-r * .3, -r * .35, r * .1, 0, 0, r); g.addColorStop(0, 'rgba(34,64,86,.92)'); g.addColorStop(1, 'rgba(5,14,24,.95)'); c.fillStyle = g; c.fill();
    c.save(); c.clip(); PAINT[o.k](c, r, age); c.restore();
    c.strokeStyle = F.rgba(F.hex(o.tint), .75); c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, r * .82, -2.6, -1.7); c.stroke();
  }
  function orbState(o, t) {   // where it is and how big, or null
    if (t < o.tb || t > o.arrive) return null;
    if (t < o.land) {
      const u = (t - o.tb) / (o.land - o.tb), [sx, sy] = brainAt(t), [ex, ey] = slotAt(t, o.k), e = easeIO(u);
      return { x: qb(sx, 0, ex, e), y: qb(sy, SC.piv[1] - 270, ey, e), s: easeOutBack(clamp(u / .22), 2) * lerp(1.7, 1, smooth((u - .35) / .65)) };   // it bursts out big, and settles to its size in the pan
    }
    const [x, y] = slotAt(t, o.k); if (t < o.lv) return { x, y, s: 1 };
    const u = easeIn((t - o.lv) / (o.arrive - o.lv), 1.8); return { x: lerp(x, LW[0], u), y: lerp(y, LW[1], u), s: 1 - .9 * u };
  }
  function drawScale(ctx, v, t) {
    const a = smooth((t - SC0) / .3) * (1 - smooth((t - WE) / 1.1)); if (a <= .004) return;
    D.plane(ctx, v, 0, 0, LW[2], 900, 900, c => {
      c.save(); c.globalAlpha *= a; c.lineCap = 'round'; c.lineJoin = 'round';
      const [px, py] = SC.piv, gp = easeIO((t - SC0) / .45), gb = easeIO((t - SC0 - .3) / .4), gs = easeIO((t - SC0 - .55) / .45), { th, L, R } = ends(t);
      // the post and its foot, growing up out of the dark
      const top = lerp(SC.base, py, gp), pg = c.createLinearGradient(0, SC.base, 0, py); pg.addColorStop(0, 'rgba(200,240,255,.05)'); pg.addColorStop(1, 'rgba(200,240,255,.5)');
      c.strokeStyle = pg; c.lineWidth = 14; c.beginPath(); c.moveTo(px, SC.base); c.lineTo(px, top); c.stroke();
      c.globalAlpha = a * gp; rrect(c, -130, SC.base - 6, 260, 20, 10); c.fillStyle = 'rgba(14,44,62,.8)'; c.fill(); c.strokeStyle = 'rgba(200,240,255,.3)'; c.lineWidth = 2; c.stroke(); c.globalAlpha = a;
      // the beam, from the middle out, and the needle that shows its tilt
      if (gb > 0) {
        c.save(); c.translate(px, py); c.rotate(th * gb);
        rrect(c, -SC.arm * gb - 10, -8, 2 * SC.arm * gb + 20, 16, 8); c.fillStyle = 'rgba(20,60,80,.85)'; c.fill(); c.strokeStyle = 'rgba(200,240,255,.55)'; c.lineWidth = 2; c.stroke();
        c.strokeStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(-SC.arm * gb + 10, -5); c.lineTo(SC.arm * gb - 10, -5); c.stroke();
        c.strokeStyle = 'rgba(200,240,255,.7)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -70 * gb); c.stroke();
        c.restore();
        c.fillStyle = 'rgba(200,240,255,.85)'; c.beginPath(); c.arc(px, py, 12, 0, TAU); c.fill();
      }
      // the pans: strings from the beam's ends, a shallow glass bowl
      if (gs > 0) for (const e of [L, R]) {
        const [rx, ry] = rimOf(e), hw = SC.pan / 2;
        c.globalAlpha = a * gs; c.strokeStyle = 'rgba(200,240,255,.45)'; c.lineWidth = 2; c.beginPath(); c.moveTo(e[0], e[1]); c.lineTo(rx - hw, lerp(e[1], ry, gs)); c.moveTo(e[0], e[1]); c.lineTo(rx + hw, lerp(e[1], ry, gs)); c.stroke();
        const yy = lerp(e[1], ry, gs); c.beginPath(); c.moveTo(rx - hw, yy); c.quadraticCurveTo(rx, yy + 70, rx + hw, yy); c.closePath(); c.fillStyle = 'rgba(20,60,80,.75)'; c.fill(); c.strokeStyle = 'rgba(200,240,255,.55)'; c.stroke();
        c.strokeStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.moveTo(rx - hw + 6, yy + 2); c.lineTo(rx + hw - 6, yy + 2); c.stroke();
      }
      c.globalAlpha = a;
      // the brain, and its weight (the voice says "কয়েক কিলোগ্রাম"; an adult brain is about 1.2–1.4 kg)
      const ba = smooth((t - (BRL - .4)) / .3);
      if (ba > 0) {
        const [bx, by] = brainAt(t), puls = Math.exp(-Math.pow((t - BRAIN - .2) / .35, 2)) + WORLDS.reduce((s, o) => s + .8 * Math.exp(-Math.pow((t - o.tb) / .1, 2)), 0);
        c.save(); c.globalAlpha *= ba; c.translate(bx, by); YV.brain(c, 'under', BR, 1); YV.brain(c, 'cerebrum', BR, 1); YV.brain(c, 'sulci', BR, 1);
        if (puls > .01) { c.globalCompositeOperation = 'lighter'; glow(c, BR.centre[0], BR.centre[1], SC.bs * 1.4, AMBER, .45 * Math.min(1, puls)); }
        c.restore();
        const [lx, ly] = rimOf(L); pill(c, ['≈', '১.৪', 'কেজি'], [KG, KG, KG], t, lx, ly + 110, P ? 34 : 40, 1, false, badgeK(t, KG));
      }
      c.restore();
    }, { fog: 0, blurMul: 0 });
  }
  function drawOrbs(ctx, v, t) {   // over the scale (they fly over it), with each one's word while it flies
    D.plane(ctx, v, 0, 0, LW[2], 900, 900, c => {
      for (const o of WORLDS) {
        const st = orbState(o, t); if (!st) continue;
        c.save(); c.translate(st.x, st.y); c.scale(st.s, st.s); orb(c, o, SC.r, t); c.restore();
        const la = smooth((t - o.t0 + .05) / .25) * (1 - smooth((t - o.land - .3) / .35)) * (1 - smooth((t - o.lv) / .2)); if (la > .004) say(c, o.word, st.x, st.y - SC.r * st.s - 36, 44, la, { weight: 700 });
      }
    }, { fog: 0, blurMul: 0 });
  }
  function drawWordsCD(ctx, v, t) {   // over the light: "অস্তিত্বের অনুভূতি", then "এখনো জানি না"
    if (t < OWN - .2 || t > FORK1 + .5) return;
    D.plane(ctx, v, LW[0], LW[1] + 125, LW[2], 600, 80, c => {
      words(c, [['অস্তিত্বের', EXIST], ['অনুভূতি', FEEL]], t, 0, 0, 44, 1 - smooth((t - WE) / .5), 'center', { weight: 600 });
      words(c, [['এখনো', STILL], ['জানি', KNOW], ['না', NO2]], t, 0, 0, 44, 1 - smooth((t - FORK0 - .4) / .6), 'center', { weight: 600 });
    }, { fog: 0, blurMul: 0 });
  }

  // ═══ E · the ground comes up under the light and the road forks: solid into a forest of neurons, dashed into a
  // dotted, shimmering dark of atoms; each ends at a "?" ═══
  const GY = LW[1] + 550, FZ = LW[2], RX = P ? 900 : 1400, ZL = 3800;
  const roadX = (s, side) => side * RX * (.35 * s + .65 * (1 - (1 - s) * (1 - s)));   // it leaves the fork at an angle, then bends on ahead
  const roadP = (s, side) => [roadX(s, side), GY, FZ + s * ZL];
  const sL = t => keyed(t, [[FORK1 - .5, 0], [FORK1 + .5, .12], [NEURO - .15, .12], [WITHIN + .15, 1]]), sR = t => keyed(t, [[FORK1 - .5, 0], [FORK1 + .5, .12], [NATURE - .15, .12], [LAYER + .35, 1]]);
  const QL = WITHIN + .1, QR = LAYER + .45;                                       // the "?" at each end
  function drawGround(ctx, v, t) {   // a faint grid of dots on the ground, far to near
    const a = smooth((t - FORK0) / 1.2) * .5; if (a <= .004) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(170,230,255,1)';
    for (let gz = 5800; gz >= -200; gz -= 200) for (let gx = -3000; gx <= 3000; gx += 200) {
      const p = D.proj(v, gx, GY, gz); if (!p || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) continue;
      const al = a * .5 * (1 - D.fog(v, p.d)) * smooth((p.d - 150) / 400); if (al < .01) continue; const r = Math.max(.8, 4.4 * p.s); ctx.globalAlpha = al; ctx.fillRect(p.x - r, p.y - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }
  function road(ctx, v, t, side, s1, col, dashed) {   // drawn to s1, its width by depth, a bright head while it runs, its far end fading
    if (s1 <= .002) return;
    const n = 90, pts = []; for (let i = 0; i <= n; i++) { const s = i / n * s1, p = D.proj(v, ...roadP(s, side)); if (p) pts.push([p.x, p.y, p.s, s]); }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.lineCap = 'round'; ctx.strokeStyle = col;
    for (const [wk, ak] of [[3.2, .16], [1, 1]]) for (let i = 1; i < pts.length; i++) {   // a wide faint pass for the glow (square ends, so the pieces don't overlap into beads), then the line
      const [x0, y0, ps, s] = pts[i - 1], [x1, y1] = pts[i]; if (dashed && Math.floor(s * 44) % 2) continue;
      ctx.lineCap = wk > 1 || !dashed ? 'butt' : 'round';
      ctx.globalAlpha = ak * (1 - smooth((s - .86) / .14)) * smooth(s / .02 + .3); ctx.lineWidth = Math.max(1.2, 13 * ps) * wk; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    const run = s1 < .995 && s1 > .005 ? 1 : 0, hd = pts[pts.length - 1];
    if (run && hd) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1; glow(ctx, hd[0], hd[1], 70 * hd[2] + 8, col, .8); }
    ctx.restore();
  }
  const NEURS = Array.from({ length: 64 }, (_, i) => { const s = .28 + .78 * hash(i, 101), out = hash(i, 102) < .8, off = out ? -(180 + 1300 * hash(i, 103)) : 150 + 250 * hash(i, 103), h = 220 + 760 * hash(i, 104);
    return { s, x: roadX(s, -1) + off, y: GY - h, z: FZ + s * ZL + (hash(i, 105) - .5) * 500, br: Array.from({ length: 4 }, (_, j) => { const a = -Math.PI / 2 + (hash(i, 110 + j) - .5) * 2.2, L = 120 + 200 * hash(i, 120 + j); return [a, L, (hash(i, 130 + j) - .5) * .8]; }) }; });
  function drawForest(ctx, v, t) {   // pyramidal neurons standing like trees, lighting up as the solid road reaches them
    const s1 = sL(t); if (s1 < .2) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const n of NEURS) {
      const a = smooth((s1 - n.s) / .08 + 1) * (.75 + .25 * noise1(t * 1.3 + n.s * 20, 3)); if (a <= .01) continue;
      const p = D.proj(v, n.x, n.y, n.z); if (!p) continue;
      const fa = a * (1 - .7 * D.fog(v, p.d)), pg = D.proj(v, n.x, GY, n.z);
      ctx.strokeStyle = `rgba(110,210,255,${.5 * fa})`; ctx.lineWidth = Math.max(1, 5 * p.s);
      if (pg) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pg.x, pg.y); ctx.stroke(); }   // the axon, down to the ground
      for (const [ba, L, bend] of n.br) { const m = D.proj(v, n.x + Math.cos(ba) * L * .5, n.y + Math.sin(ba) * L * .5, n.z), e = D.proj(v, n.x + Math.cos(ba + bend) * L, n.y + Math.sin(ba + bend) * L, n.z); if (m && e) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(m.x, m.y, e.x, e.y); ctx.stroke(); } }
      YD.node(ctx, 0, p.x, p.y, 14 * p.s, D.coc(v, p.d), fa);
    }
    ctx.restore();
  }
  const DOTS = Array.from({ length: 700 }, (_, i) => { const s = .22 + .85 * hash(i, 201); return { s, x: roadX(s, 1) - 200 + 1900 * hash(i, 202), y: GY - 1400 * Math.pow(hash(i, 203), 1.3), z: FZ + s * ZL + (hash(i, 204) - .5) * 600, ph: hash(i, 205) * 20, sp: 2 + 5 * hash(i, 206) }; });
  const ATOMS = Array.from({ length: 11 }, (_, i) => { const s = .3 + .7 * hash(i, 211); return { s, x: roadX(s, 1) + 150 + 1200 * hash(i, 212), y: GY - 150 - 900 * hash(i, 213), z: FZ + s * ZL, ph: hash(i, 214) * 9 }; });
  function drawAtoms(ctx, v, t) {   // a dotted, shimmering dark, and atoms as clouds of flickering dots, as the dashed road reaches them
    const s1 = sR(t); if (s1 < .2) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    for (const q of ATOMS) {
      const a = smooth((s1 - q.s) / .1 + 1); if (a <= .01) continue; const p = D.proj(v, q.x, q.y, q.z); if (!p) continue; const R = 90 * p.s, fa = a * (1 - .6 * D.fog(v, p.d));
      glow(ctx, p.x, p.y, R * 1.6, VIOLET, .25 * fa); glow(ctx, p.x, p.y, R * .8, BLUE, .25 * fa);
      ctx.fillStyle = '#e8dcff'; for (let j = 0; j < 22; j++) { const f = (t * (.8 + hash(j, 221) * 1.6) + hash(j, 222) + q.ph) % 1, al = Math.sin(Math.PI * f); if (al < .25) continue; const an = hash(j, 223) * TAU, rr = Math.sqrt(hash(j, 224)) * R; ctx.globalAlpha = fa * al; ctx.beginPath(); ctx.arc(p.x + Math.cos(an) * rr, p.y + Math.sin(an) * rr * .85, Math.max(.8, 3 * p.s), 0, TAU); ctx.fill(); }
      ctx.globalAlpha = fa; glow(ctx, p.x, p.y, 10 * p.s + 2, '#fff3c4', .9);
    }
    ctx.fillStyle = '#d9c8ff';
    for (const d of DOTS) {
      const a = smooth((s1 - d.s) / .08 + 1); if (a <= .01) continue; const p = D.proj(v, d.x, d.y, d.z); if (!p || p.x < 0 || p.x > W || p.y < 0 || p.y > H) continue;
      ctx.globalAlpha = a * (.2 + .8 * Math.pow(Math.abs(Math.sin(t * d.sp + d.ph)), 3)) * (1 - .5 * D.fog(v, p.d)); ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(.7, 4 * p.s), 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function drawFork(ctx, v, t) {
    if (t < FORK0) return;
    drawGround(ctx, v, t);
    drawForest(ctx, v, t); drawAtoms(ctx, v, t);
    // the road so far, up to the fork under the light (its near end fading)
    const st = easeIO((t - FORK0 - .3) / .9);
    if (st > 0) { const n = 30, pts = []; for (let i = 0; i <= n; i++) { const p = D.proj(v, 0, GY, lerp(-150, FZ, i / n)); if (p) pts.push(p); } ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.lineCap = 'butt'; for (let i = 1; i < pts.length; i++) { const u = i / n; if (u > st) break; ctx.globalAlpha = .45 * smooth(u / .4); ctx.strokeStyle = '#dff6ff'; ctx.lineWidth = Math.max(1.2, 10 * pts[i].s); ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke(); } ctx.restore(); }
    road(ctx, v, t, -1, sL(t), MINT, false);
    road(ctx, v, t, 1, sR(t), AMBER, true);
  }
  function drawForkLabels(ctx, v, t) {   // their names, and the "?" where each ends (after the bloom)
    if (t < FORK0) return;
    const lp = roadP(.08, -1), rp = roadP(.08, 1);   // beside the fork, out of the roads' way
    D.plane(ctx, v, lp[0] - (P ? 440 : 560), GY - 30, lp[2], 500, 80, c => pill(c, ['নিউরোবায়োলজি'], [NEURO], t, 0, 0, 58, 1, false, badgeK(t, NEURO)), { fog: 0, blurMul: 0 });
    D.plane(ctx, v, rp[0] + (P ? 500 : 640), GY - 30, rp[2], 700, 80, c => pill(c, ['প্রকৃতির', 'গভীর', 'স্তর'], [NATURE, DEEP, LAYER], t, 0, 0, 58, 1, true, badgeK(t, NATURE)), { fog: 0, blurMul: 0 });
    for (const [side, tq] of [[-1, QL], [1, QR]]) {
      const k = smooth((t - tq) / .5); if (k <= .004) continue; const e = roadP(1, side);
      D.plane(ctx, v, e[0], GY - 260, e[2], 200, 240, c => { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, 0, 0, 260, AMBER, .25 * k); c.restore(); c.save(); c.translate(0, 30 * (1 - k)); YV.text(c, '?', 420, k, { weight: 700, role: 'amber', glow: .6 }); c.restore(); }, { fog: 0, blurMul: .5 });
    }
  }

  function drawDeep(ctx, t) {
    const v = camD(t), a = smooth((t - BECAUSE + .3) / 1);
    YD.bg(ctx, v);
    drawMotes(ctx, v, t, a * (1 - .6 * smooth((t - FORK0) / 1.5)));
    drawFork(ctx, v, t);
    drawShimmer(ctx, v, t);
    drawLight(ctx, v, t);
    YD.post(ctx);
    drawWordsB(ctx, v, t);
    drawForkLabels(ctx, v, t);
    if (t > SC0 && t < FORK1) { drawScale(ctx, v, t); drawOrbs(ctx, v, t); drawWordsCD(ctx, v, t); }
    const blk = 1 - smooth((t - BECAUSE + .35) / .9); if (blk > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = blk; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); }   // up out of the black
  }
  function drawScene(ctx, t) {
    if (t < NO) drawA(ctx, t);
    else if (t < BECAUSE - .4) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); }   // one beat of black
    else drawDeep(ctx, t);
  }

  // ─── sound effects, about 10 dB under the voice (as scenes 06–07) ───
  const LEVEL = .48;
  const airy = (t0, g = .09) => ({ t: t0, type: 'air', dur: .6, f0: 900, f1: 1600, g });
  const SFX = [
    { t: DARK0, type: 'powerDown', dur: NO - DARK0 + .3, f: 220, g: .18 },                                                                       // the dark closes in; then one beat of silence
    { t: BECAUSE - .3, type: 'drone', dur: DUR - BECAUSE + .3, f: 48, g: .16 }, { t: BECAUSE - .2, type: 'shimmer', dur: DRAIN0 - BECAUSE + .6, g: .14 },   // the quantum shimmer
    airy(REAL), airy(QU),
    { t: DRAIN0, type: 'swoosh', dur: 1.1, f0: 1300, f1: 250, peak: .6, g: .14 },                                                                 // it drains
    { t: LIT0, type: 'bloom', dur: 2.2, f: 330, g: .22 }, { t: LIT0 + .05, type: 'impact', size: .3, f: 60, g: .14 }, airy(MIND),                  // the light, larger than ever
    { t: PULL0, type: 'swoosh', dur: 1.1, f0: 900, f1: 300, peak: .4, g: .14 },                                                                   // back; the scale draws itself
    { t: SC0, type: 'trace', dur: .5, g: .1 }, { t: SC0 + .3, type: 'slide', dur: .4, g: .1 }, { t: SC0 + .6, type: 'tap', g: .08 }, { t: SC0 + .7, type: 'tap', g: .07 },
    { t: BRL, type: 'thud', g: .14 }, { t: BRL + .05, type: 'creak', dur: .25, g: .06 }, { t: KG, type: 'stampSmall', g: .2 },                      // the brain lands, it tips; its weight
    { t: BRAIN, type: 'bloom', dur: .9, f: 294, g: .08 },
    ...WORLDS.flatMap(o => [{ t: o.tb, type: 'pop', g: .1 }, { t: o.tb, type: 'air', dur: .8, f0: 600, f1: 1500, g: .1 }, { t: o.land, type: 'tap', g: .1 }, { t: o.land + .03, type: 'creak', dur: .22, g: .06 }]),   // each world, born and landing
    { t: OWN, type: 'whoosh', dur: 1, f0: 300, f1: 1500, g: .12 }, { t: OWN + .6, type: 'bloom', dur: 1.8, f: 392, g: .2 },                        // they pour up into the light
    { t: WE, type: 'air', dur: 1.2, f0: 1200, f1: 500, g: .1 },                                                                                    // the scale fades
    { t: FORK0, type: 'swoosh', dur: 1.5, f0: 300, f1: 800, peak: .5, g: .14 }, { t: FORK0 + .3, type: 'trace', dur: .9, g: .1 },                 // the ground, the road so far
    { t: FORK1 - .5, type: 'trace', dur: 1, g: .1 },
    { t: NEURO - .15, type: 'trace', dur: WITHIN - NEURO + .3, g: .12 }, { t: NEURO, type: 'spark', dur: 2.2, rate: 7, g: .1 }, { t: NEURO, type: 'stampSmall', g: .12 },   // the solid road, the forest
    { t: NATURE - .15, type: 'trace', dur: LAYER - NATURE + .5, g: .12 }, { t: NATURE, type: 'shimmer', dur: 2.6, g: .12 }, { t: NATURE, type: 'crackle', dur: 2, rate: 6, g: .06 }, { t: NATURE, type: 'stampSmall', g: .12 },   // the dashed road, the atoms
    { t: QL, type: 'tap', g: .1 }, { t: QR, type: 'tap', g: .1 },                                                                                 // the two "?"
  ].map(c => ({ ...c, g: c.g * LEVEL }));

  const fontsReady = Promise.race([
    Promise.all(['Hind Siliguri', 'Noto Serif Bengali'].flatMap(f => [500, 600, 700].map(wt => document.fonts.load(`${wt} 60px "${f}"`, 'চেতনা নিজেই ভালোবাসা স্বপ্ন কল্পনা নিউরোবায়োলজি')))),
    new Promise(r => setTimeout(r, 5000)),
  ]);
  const label_ = t => { let s = ''; for (const x of T.words) if (x[1] <= t + 1e-6) s = x[0]; return s; };
  F.scene(ID, { W, H, duration: DUR, draw: (ctx, t) => { D.frameStart(); drawScene(ctx, t); }, ready: Promise.all([fontsReady, S7 && S7.ready]), label: label_, sfx: SFX, grain: 'frame' });
})();
