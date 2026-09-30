// Scene 06 · Orch-OR (2:03.166–2:36.116 of voice/Death.mp3), v1 (2026-09-29). It opens on scene 05's last frame, pixel
// for pixel: the ঘ neuron field with the violet shimmer and the dashed "?". The focus pulls forward and glass name cards
// rise over the soft field in scene 05 v2's motion language (staggered reveals, pills, a badge): Roger Penrose, Nobel
// 2020 for black-hole research, and Stuart Hameroff, anaesthesiologist. The cards fold into two name chips, the "?" comes
// forward and opens into a dashed idea card ("আলোচিত ধারণা"), where "Orchestrated Objective Reduction" types itself and
// folds into "Orch-OR" with a "তত্ত্ব" badge. The card shrinks to a corner chip, and the camera dives into the neuron the
// shimmer sat in: a bundle of microtubules (≈ 25 nm, a solid dimension line), the flight down one of them (an
// illustration, not to scale), the tubulin flickering violet (dashed, a theory), a wave of collapse rushing at the lens
// and bursting into the amber light ("চেতনার সাথে যুক্ত", dashed). The camera backs out as the tube swings side-on around
// the light; on "কিন্তু" everything turns grey and still, and "প্রমাণিত নয়" stamps in, outlined.
(function () {
  'use strict';
  const F = FILM, D = F.depth, { clamp, smooth, easeIO, easeOut, easeIn, easeOutBack, lerp, keyed, noise1, hash, rng, TAU } = F;
  const ID = 'scene-06', T = window.TIMING[ID], DUR = T.duration;
  const { W, H, portrait: P } = F.format(), U = Math.min(W, H) / 1080;
  const YV = F.style25('vector', W, H), YD = F.style25('depth', W, H);
  const norm = s => s.normalize('NFC').replace(/[।,?!—'"()\s]/g, '');
  const w = (word, n = 1) => { let k = 0; for (const x of T.words) if (norm(x[0]) === norm(word) && ++k === n) return x[1]; throw new Error(`${ID}: no word "${word}" (${n})`); };
  const NOBEL = w('নোবেল'), PHYS = w('পদার্থবিজ্ঞানী'), ROGER = w('রজার'), PENROSE = w('পেনরোজ'), AND = w('এবং'), ANAES = w('অ্যানেস্থেসিওলজিস্ট'), STUART = w('স্টুয়ার্ট'), HAMEROFF = w('হ্যামারফ');
  const THIS = w('এই'), QUESTION = w('প্রশ্ন'), AN = w('একটি'), TALKED = w('আলোচিত'), IDEA = w('ধারণা'), GAVE = w('দিয়েছিলেন');
  const NAME = w('নাম'), ORCH = w('অর্কেস্ট্রেটেড'), OBJ = w('অবজেক্টিভ'), RED = w('রিডাকশন'), SHORT = w('সংক্ষেপে'), ORCHOR = w('অর্ক-ওআর'), ORCHOR2 = w('Orch-OR');
  const THEIR = w('তাঁদের'), NEURON = w('নিউরনের'), INSIDE = w('ভেতরে'), MT = w('মাইক্রোটিউবিউল'), TINY = w('ক্ষুদ্র'), STRUCT = w('কাঠামোতে');
  const QUANT = w('কোয়ান্টাম'), PROCESS = w('প্রক্রিয়া'), AND2 = w('আর'), MIND = w('চেতনার'), WITH = w('সাথে'), LINKED = w('যুক্ত');
  const THEORY = w('থিওরিটা'), BUT = w('কিন্তু'), PROVEN = w('প্রমাণিত'), NOT = w('নয়');
  const glow = (c, x, y, r, col, a) => { if (a <= .004 || r <= 0) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, F.rgba(F.hex(col), a)); g.addColorStop(1, F.rgba(F.hex(col), 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const expo = x => 1 - Math.pow(2, -10 * clamp(x));                       // the ease of a product page: fast out, soft landing
  const rise = (t, t0, d = .55) => expo((t - t0) / d);                      // an element's reveal, 0..1
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); };
  const AMBER = '#ffc93c', MINT = '#3ff0d0', PINK = '#ff5fa2', BLUE = '#7aa7ff';

  // ═══ scene 05's clock: the neuron field goes on exactly as scene 05 left it (its last frame is this scene's first) ═══
  const T5 = (window.TIMING || {})['scene-05'], DUR5 = T5 ? T5.duration : 20.883;
  const QUANT5 = 18.733, WORK5 = 19.733;   // scene 05's "কোয়ান্টাম" (3rd) and "কাজ": long since on at its end
  const g5 = t => t + DUR5;                 // scene 05's time, for everything that keeps moving across the cut

  // ═══ ঘ · the neuron field, the violet shimmer, the dashed "?" (scene 05's drawInside, carried on) ═══
  const NEU = (() => {
    const r = rng(55), nodes = [];
    for (let i = 0; i < 1200; i++) nodes.push({ x: (r() - .5) * 4200, y: (r() - .5) * 3000, z: 200 + r() * 4600, size: .7 + r() * .9, tw: r() * 10 });
    const edges = [];
    nodes.forEach((a, i) => { const c = []; for (let j = i + 1; j < nodes.length; j++) { const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z); if (d < 430) c.push([j, d]); } c.sort((p, q) => p[1] - q[1]).slice(0, 2).forEach(([j]) => edges.push({ a: i, b: j, period: 1.2 + hash(i, j) * 2.2, phase: hash(j, i), spark: hash(i + 7, j) < .3 })); });
    return { nodes, edges };
  })();
  const MOTES = Array.from({ length: 150 }, (_, i) => ({ x: (hash(i, 1) - .5) * 3600, y: (hash(i, 2) - .5) * 2400, z: hash(i, 3) * 3200, r: 2 + hash(i, 4) * 4, ph: hash(i, 5) * 10 }));
  const wrap = (a, span) => ((a % span) + span * 1.5) % span - span / 2;
  function drawDust(ctx, v, tg, a) {
    for (const m of MOTES) {
      const dx = wrap(m.x + 30 * noise1(tg * .15 + m.ph, 3) - v.x, 3600), dy = wrap(m.y + 20 * noise1(tg * .12 + m.ph, 4) - v.y, 2400), dz = ((m.z - v.z) % 3200 + 3200) % 3200 + 120;
      const p = D.proj(v, v.x + dx, v.y + dy, v.z + dz); if (!p) continue;
      const fade = smooth((dz - 120) / 300) * (1 - smooth((dz - 2800) / 400)) * smooth((1800 - Math.abs(dx)) / 300) * smooth((1200 - Math.abs(dy)) / 250);
      YD.dust(ctx, p.x, p.y, m.r * p.s, D.coc(v, p.d), .55 * a * fade);
    }
  }
  const SHN = 160, SHP = P ? [120, 40, 1500] : [280, -40, 1500], QP = P ? [-230, -200, 1460] : [-230, -70, 1460], [SHC, SHX] = F.canvas(SHN, SHN), SHD = SHX.createImageData(SHN, SHN);
  function shimmerTex(t, e) {   // three-source interference in violet, faded to nothing at its rim
    const n = SHN, h = n / 2, d = SHD.data, k = .8, om = 5, S3 = [[h - 12, h + 4], [h + 9, h - 10], [h + 3, h + 12]];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      let A = 0; for (const [sx, sy] of S3) A += Math.cos(k * Math.hypot(x - sx, y - sy) - om * t); A /= 3; const I = A * A;
      const rim = smooth(1 - Math.hypot(x - h, y - h) / (h - 3)), ee = e * rim, o = (y * n + x) * 4;
      d[o] = 150 * I * ee + 30; d[o + 1] = 110 * I * ee + 10; d[o + 2] = 255 * Math.min(1, I * ee + .15); d[o + 3] = 255 * Math.min(1, (I * ee * .9 + .12 * ee));
    }
    SHX.putImageData(SHD, 0, 0);
  }
  // the camera of the field: scene 05's drift, come to rest at z 700; from here it creeps on. The focus pulls forward to
  // the cards (the field goes soft behind them) and back when they leave
  const FOC0 = .15, FOC1 = 1.2, DV0 = THEIR + .5, DV1 = INSIDE + .05;   // DV: the dive into the neuron the shimmer sits in
  const pullK = t => easeIO((t - FOC0) / (FOC1 - FOC0)) * (1 - easeIO((t - THEIR) / 1.1));
  const camF = t => {
    const tg = g5(t), u = clamp((t - DV0) / (DV1 - DV0)), ku = easeIO(u);
    const z0 = 700 + 5 * t * smooth(t / 2), z = lerp(z0, SHP[2] + 40, easeIn(u, 2.2)), x = lerp(30 * Math.sin(tg * .3), SHP[0], ku), y = lerp(20 * Math.sin(tg * .23), SHP[1], ku);
    const f = lerp(Math.max(300, 1500 - z), 330, pullK(t)), fd = Math.max(90, SHP[2] - z);
    return D.view({ x, y, z, focus: u > 0 ? lerp(f, fd, smooth(u * 3)) : f, aperture: 24, fogNear: 1600, fogFar: 4200 }, W, H);
  };
  // the neuron the shimmer sits in: a soma and its branches, fading in while the field is soft behind the cards
  const HERO = (() => {
    const r = rng(66), br = [];
    const grow = (x, y, ang, len, wd, depth) => {
      const pts = [[x, y]]; let a = ang, px = x, py = y;
      for (let i = 1; i <= 7; i++) { a += (r() - .5) * .5; px += Math.cos(a) * len / 7; py += Math.sin(a) * len / 7; pts.push([px, py]); }
      br.push({ path: F.sci.path(F.sci.spline(pts, false, 6)), wd });
      if (depth < 2) { const k = 3 + Math.floor(r() * 3), [fx, fy] = pts[k]; grow(fx, fy, ang + (r() < .5 ? -1 : 1) * (.45 + r() * .4), len * (.45 + r() * .2), wd * .6, depth + 1); if (depth === 0 && r() < .6) grow(fx, fy, ang - .5, len * .4, wd * .55, 2); }
    };
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + (r() - .5) * .5; grow(Math.cos(a) * 48, Math.sin(a) * 48, a, 280 + r() * 240, 7, 0); }
    grow(Math.cos(2.2) * 50, Math.sin(2.2) * 50, 2.2, 900, 5, 2);   // the axon, long and thin
    return br;
  })();
  function drawHero(ctx, v, t, a) {
    if (a <= .004) return;
    const p = D.proj(v, ...SHP); if (!p) return;
    const b = D.coc(v, p.d), soft = 1 + b / 7, dim = 1 / (1 + b / 12) * lerp(.45, 1, smooth((p.d - 120) / 380));   // out of focus: wider, fainter lines instead of a costly blur; less glare up close
    D.plane(ctx, v, ...SHP, 1400, 1400, c => {
      c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round'; c.lineJoin = 'round';
      for (const { path, wd } of HERO) {
        const n = path.pts.length, seg = 4;
        for (let s = 0; s < seg; s++) {   // each branch in four pieces, thinner and fainter toward its end (the ends fade out)
          const pts = path.pts.slice(Math.floor(s * (n - 1) / seg), Math.floor((s + 1) * (n - 1) / seg) + 1), f = 1 - s / seg;
          c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
          c.strokeStyle = `rgba(95,200,255,${.16 * a * f * dim})`; c.lineWidth = wd * 4 * f * soft; c.stroke();
          c.strokeStyle = `rgba(190,238,255,${.75 * a * f * dim})`; c.lineWidth = Math.max(1.2, wd * f) * soft; c.stroke();
        }
      }
      const g = c.createRadialGradient(0, 0, 0, 0, 0, 120 * soft); g.addColorStop(0, `rgba(235,250,255,${.9 * a * dim})`); g.addColorStop(.28, `rgba(120,215,255,${.65 * a * dim})`); g.addColorStop(.55, `rgba(60,160,220,${.2 * a * dim})`); g.addColorStop(1, 'rgba(60,160,220,0)');
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, 120 * soft, 0, TAU); c.fill();
      c.restore();
      const lk = smooth((t - NEURON + .05) / .35) * (1 - smooth((t - DV1 + .4) / .25));   // its word, beside it
      if (lk > 0) { c.save(); c.translate(P ? -110 : 120, 105); const lw = YD.measure(c, 'নিউরন', 46, 600) + 44; c.save(); c.translate(P ? -lw / 2 + 22 : lw / 2 - 22, 0); YD.tag(c, lw, 72, lk * a * .9); c.restore(); YD.text(c, 'নিউরন', 46, lk * a, { weight: 600, glow: .5, align: P ? 'right' : 'left' }); c.restore(); }
    }, { blurMul: 0, fog: .3 });
  }
  // o: { words (the shimmer's caption), q (the "?"), near (thins the nodes in front of the cards) }; all 1/1/0 at the cut
  function drawField(ctx, v, t, o) {
    const tg = g5(t);
    YD.bg(ctx, v);
    const N = NEU.nodes, Pj = N.map(n => D.proj(v, n.x, n.y, n.z)), list = [];
    const lum = N.map((n, i) => { const p = Pj[i]; if (!p) return 0; const l = (.6 + .4 * noise1(tg * 1.4 + n.tw, 2)) * (1 - .8 * D.fog(v, p.d)); return o.near > 0 ? l * (1 - o.near * (1 - smooth((p.d - 250) / 350))) : l; });
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
      const ph = tg / e.period + e.phase, u = ph - Math.floor(ph); if (u > .5) continue;
      const a = N[e.a], b = N[e.b], k = u / .5, p = D.proj(v, lerp(a.x, b.x, k), lerp(a.y, b.y, k), lerp(a.z, b.z, k)); if (!p) continue;
      YD.spark(ctx, p.x, p.y, 3.2 * p.s, D.coc(v, p.d), Math.min(1, al) * Math.sin(Math.PI * k));
    }
    if (o.hero > 0) drawHero(ctx, v, t, o.hero);
    // the violet shimmer, flickering as it did; its caption and the dashed "?"
    const e =smooth((tg - QUANT5 + .05) / .45) * (.55 + .45 * clamp(noise1(tg * 9, 7) * 1.5 + .5));
    if (e > .01) { shimmerTex(tg, e); D.plane(ctx, v, ...SHP, 240, 240, c => { c.globalCompositeOperation = 'lighter'; c.drawImage(SHC, -240, -240, 480, 480); }, { fog: .3 }); }
    const w1 = o.words, w2 = o.words;
    if (w1 > 0) D.plane(ctx, v, SHP[0], SHP[1] + 290, SHP[2] - 20, 400, 60, c => { const a1 = YD.measure(c, 'কোয়ান্টাম', 46, 600), a2 = YD.measure(c, 'প্রক্রিয়া', 46, 600), g = 18, x0 = -(a1 + g + a2) / 2; c.save(); c.translate(x0 + a1 / 2, 0); YD.text(c, 'কোয়ান্টাম', 46, w1, { weight: 600, glow: .5 }); c.restore(); c.save(); c.translate(x0 + a1 + g + a2 / 2, 0); YD.text(c, 'প্রক্রিয়া', 46, w2, { weight: 600, glow: .5 }); c.restore(); }, { fog: 0 });
    const q = o.q;
    if (q > 0) D.plane(ctx, v, ...QP, 160, 200, c => { c.font = YD.fontOf(300, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.setLineDash([16, 12]); c.lineWidth = 6; c.strokeStyle = `rgba(255,178,77,${.95 * q})`; c.shadowColor = `rgba(255,178,77,${.6 * q})`; c.shadowBlur = 30; c.strokeText('?', 0, 20); }, { fog: 0 });
    drawDust(ctx, v, tg, .6);
    YD.post(ctx);
  }

  // ═══ the glass UI over the field (screen space: 1 unit = 1 px at 1080 on the short side), scene 05 v2's language ═══
  // the UI camera: first on Penrose's card, then across to both (a scroll in 4:5); a slow sway, each layer by its depth
  const PAN0 = AND - .45, PAN1 = PAN0 + .95, FOLD0 = THIS - .25, FOLD1 = FOLD0 + .8, AWAY0 = THEIR - .05, AWAY1 = AWAY0 + .85;
  const CARDW = P ? 920 : 820, CARDH = 330, CP = P ? [0, -190] : [-455, 60], CH = P ? [0, 220] : [455, 60];
  const CHIPW = P ? 470 : 520, CHIPH = 112, CHP = P ? [-255, -505] : [-330, -330], CHH = P ? [255, -505] : [330, -330];   // the two cards as name chips, above the idea
  const IDW = P ? 940 : 1060, IDH = P ? 520 : 440, IDP = P ? [0, 70] : [0, 150];
  const uiCam = t => { const k = keyed(t, [[PAN0, 0], [PAN1, 1]]); return P ? [0, lerp(CP[1], 0, k)] : [lerp(CP[0], 0, k), 0]; };
  const sway = (t, d) => { const tg = g5(t); return [(P ? 8 : 16) * Math.sin(tg * .35) * d, 9 * Math.sin(tg * .5) * d]; };
  function ui(c, t, x, y, d, f) {   // paint f around (x, y) of the UI plane, placed by the UI camera, shifted by depth d
    const [ux, uy] = uiCam(t), [sx, sy] = sway(t, d);
    c.save(); c.setTransform(U, 0, 0, U, W / 2 + (x - ux + sx) * U, H / 2 + (y - uy + sy) * U); f(c); c.restore();
  }
  function glass(c, w, h, a, r = 36, dashed = false, tint = null) {   // a glass card: translucent fill, a hairline, a highlight along the top, a soft shadow; tint: a colour glowing in from its top-left corner
    if (a <= .004) return;
    c.save(); c.globalAlpha *= a;
    c.shadowColor = 'rgba(0,6,14,.55)'; c.shadowBlur = 60; c.shadowOffsetY = 28; rrect(c, -w / 2, -h / 2, w, h, r); c.fillStyle = 'rgba(14,44,62,.72)'; c.fill();
    c.shadowColor = 'rgba(0,0,0,0)'; c.shadowBlur = 0; c.shadowOffsetY = 0;
    c.save(); rrect(c, -w / 2, -h / 2, w, h, r); c.clip(); const g = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, 'rgba(170,235,255,.12)'); g.addColorStop(.5, 'rgba(255,255,255,.02)'); g.addColorStop(1, 'rgba(95,227,255,.07)'); c.fillStyle = g; c.fillRect(-w / 2, -h / 2, w, h);
    if (tint) { const tg = c.createRadialGradient(-w / 2 + 90, -h / 2 + 90, 0, -w / 2 + 90, -h / 2 + 90, Math.max(w, h) * .75); tg.addColorStop(0, F.rgba(F.hex(tint), .2)); tg.addColorStop(1, F.rgba(F.hex(tint), 0)); c.fillStyle = tg; c.fillRect(-w / 2, -h / 2, w, h); }
    c.restore();
    if (dashed) { c.setLineDash([22, 14]); c.strokeStyle = F.rgba(F.hex(AMBER), .85); c.lineWidth = 3; c.shadowColor = 'rgba(255,201,60,.4)'; c.shadowBlur = 14; }
    else { c.strokeStyle = 'rgba(200,240,255,.26)'; c.lineWidth = 2; }
    rrect(c, -w / 2, -h / 2, w, h, r); c.stroke(); c.setLineDash([]); c.shadowBlur = 0;
    const hl = c.createLinearGradient(-w / 2, 0, w / 2, 0); hl.addColorStop(0, 'rgba(255,255,255,0)'); hl.addColorStop(.5, 'rgba(255,255,255,.45)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); c.strokeStyle = hl; c.lineWidth = 2; c.beginPath(); c.moveTo(-w / 2 + 50, -h / 2 + 1); c.lineTo(w / 2 - 50, -h / 2 + 1); c.stroke();
    c.restore();
  }
  // a pill of words arriving on their times; dashed amber (a claim, a theory) or solid mint (a fact). k pops it in; align 'left' grows it from its left end
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
  const badgeK = (t, t0) => easeOutBack(clamp((t - t0 + .05) / .4), 2.2);   // a badge stamps in with a little overshoot
  const say = (c, s, x, y, size, a, o = {}) => { if (a <= .004) return; c.save(); c.translate(x, y); YV.text(c, s, size, a, { role: 'text', weight: 600, glow: .35, ...o }); c.restore(); };
  const TATTVA = 'তত্ত্ব';
  const tag = (c, x, y, t0, t, a, size = 26) => pill(c, [TATTVA], [t0], t, x, y, size, a, true, badgeK(t, t0), 'left');   // the small dashed "তত্ত্ব" tag on every part of the idea

  // ─── the two people, as name cards (no portraits): an initial in a disc, the name, the role, one fact ───
  function blackHole(c, x, y, r, a) {   // a black hole as the 2019 image showed one: a dark shadow in a glowing orange ring, brighter along one side
    if (a <= .004) return;
    c.save(); c.globalAlpha *= a; c.translate(x, y);
    const g = c.createRadialGradient(0, 0, r * .55, 0, 0, r * 1.25); g.addColorStop(0, 'rgba(255,120,40,0)'); g.addColorStop(.35, 'rgba(255,150,50,.95)'); g.addColorStop(.6, 'rgba(255,200,110,.75)'); g.addColorStop(1, 'rgba(255,110,30,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * 1.25, 0, TAU); c.fill();
    const b = c.createLinearGradient(0, -r, 0, r); b.addColorStop(0, 'rgba(255,230,160,0)'); b.addColorStop(1, 'rgba(255,236,170,.75)');   // the brighter lower arc
    c.strokeStyle = b; c.lineWidth = r * .22; c.beginPath(); c.arc(0, 0, r * .82, .15 * Math.PI, .85 * Math.PI); c.stroke();
    c.fillStyle = '#030406'; c.beginPath(); c.arc(0, 0, r * .6, 0, TAU); c.fill();
    c.restore();
  }
  const PEOPLE = [
    { at: CP, chip: CHP, d: 1, t0: .4, initial: 'র', grad: ['#ffc93c', '#ff5fa2'], name: [['রজার', ROGER], ['পেনরোজ', PENROSE]], role: ['পদার্থবিজ্ঞানী', PHYS],
      fact: (c, x, y, t, a) => { const pw = pill(c, ['নোবেল', '২০২০'], [NOBEL + .72, NOBEL + .72], t, x, y, 32, a, false, badgeK(t, NOBEL + .72), 'left'); const k = smooth((t - 1.25) / .4); blackHole(c, x + pw + 58, y, 21, a * k); say(c, 'ব্ল্যাক হোল গবেষণার জন্য', x + pw + 104, y, 30, a * k * .9, { align: 'left', weight: 500, body: true }); } },
    { at: CH, chip: CHH, d: 1.25, t0: AND - .2, initial: 'স', grad: ['#3ff0d0', '#7aa7ff'], name: [['স্টুয়ার্ট', STUART], ['হ্যামারফ', HAMEROFF]], role: ['অ্যানেস্থেসিওলজিস্ট', ANAES],
      fact: (c, x, y, t, a) => { const k = smooth((t - (ANAES + .75)) / .4); if (k <= 0) return; YV.light(c, x + 22, y, 4.2, a * k); say(c, 'চেতনা নিয়ে গবেষণা', x + 66, y, 30, a * k * .9, { align: 'left', weight: 500, body: true }); } },
  ];
  function drawPerson(c, p, t) {
    const on = rise(t, p.t0, .7), m = easeIO(clamp((t - FOLD0) / (FOLD1 - FOLD0))), gone = smooth((t - AWAY0) / .6), a = on * (1 - gone);
    if (a <= .004) return;
    const x = lerp(p.at[0], p.chip[0], m), y = lerp(p.at[1], p.chip[1], m) + 40 * (1 - on) - 60 * gone, ms = easeIO(clamp(m * 1.6)), w = lerp(CARDW, CHIPW, ms), h = lerp(CARDH, CHIPH, ms);   // the size shrinks ahead of the move, so the two never overlap
    ui(c, t, x, y, p.d, c => {
      glass(c, w, h, a, lerp(36, 56, ms), false, p.grad[0]);
      const L = -w / 2, Tt = -h / 2, full = 1 - smooth(ms / .3);
      // the initial, in a gradient disc
      const ar = lerp(50, 36, ms), ax = L + lerp(92, 64, ms), ay = Tt + lerp(96, 56, ms), ak = rise(t, p.t0 + .2, .5);
      c.save(); c.globalAlpha *= a * ak; c.translate(ax, ay); c.scale(.8 + .2 * ak, .8 + .2 * ak); const g = c.createLinearGradient(-ar, -ar, ar, ar); g.addColorStop(0, p.grad[0]); g.addColorStop(1, p.grad[1]); c.fillStyle = g; c.beginPath(); c.arc(0, 0, ar, 0, TAU); c.fill();
      YV.text(c, p.initial, ar * 1.05, 1, { role: 'text', weight: 700, glow: .2, body: true }); c.restore();
      // the name, word by word on the voice
      const ns = lerp(52, 40, ms), nx = L + lerp(172, 118, ms), ny = Tt + lerp(80, 56, ms);
      let xx = nx; for (const [s, t0] of p.name) { const k = smooth((t - t0 + .05) / .35); say(c, s, xx, ny + 14 * (1 - k), ns, a * k, { align: 'left', weight: 700, body: true }); xx += YV.measure(c, s, ns, 700) + ns * .3; }
      // the role and the fact line, gone as the card folds into a chip
      say(c, p.role[0], nx, Tt + 138, 32, a * full * smooth((t - p.role[1] + .05) / .35) * .75, { align: 'left', weight: 500, body: true });
      if (full > .01) {
        c.save(); c.globalAlpha *= a * full * rise(t, p.t0 + .35, .6); const lg = c.createLinearGradient(L + 40, 0, -L - 40, 0); lg.addColorStop(0, 'rgba(200,240,255,0)'); lg.addColorStop(.5, 'rgba(200,240,255,.16)'); lg.addColorStop(1, 'rgba(200,240,255,0)'); c.strokeStyle = lg; c.lineWidth = 1.5; c.beginPath(); c.moveTo(L + 40, Tt + 196); c.lineTo(-L - 40, Tt + 196); c.stroke(); c.restore();
        p.fact(c, L + 50, h / 2 - 66, t, a * full);
      }
    });
  }

  // ─── "this question": scene 05's dashed "?" comes forward out of the field and opens into the idea card ───
  const uiPt = (t, x, y, d) => { const [ux, uy] = uiCam(t), [sx, sy] = sway(t, d); return [W / 2 + (x - ux + sx) * U, H / 2 + (y - uy + sy) * U]; };
  const Q0 = THIS - .1, Q1 = Q0 + .75, OPEN0 = AN - .05;
  function qMark(c, x, y, s, a, blur = 0) {   // the dashed "?" as scene 05 drew it (font 300 in its own units), at screen (x, y), s px per unit
    if (a <= .004) return;
    c.save(); c.setTransform(s, 0, 0, s, x, y); if (blur > .3) c.filter = `blur(${blur.toFixed(1)}px)`;
    c.font = YD.fontOf(300, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.setLineDash([16, 12]); c.lineWidth = 6; c.strokeStyle = `rgba(255,178,77,${.95 * a})`; c.shadowColor = `rgba(255,178,77,${.6 * a})`; c.shadowBlur = 30 * s; c.strokeText('?', 0, 20);
    c.restore();
  }
  function drawQuestion(ctx, t, v) {
    if (t < Q0) return;
    const k = easeIO((t - Q0) / (Q1 - Q0)), open = expo((t - OPEN0) / .7), a = (1 - smooth(open / .55));
    if (a <= .004) return;
    const p = D.proj(v, ...QP), [ex, ey] = uiPt(t, IDP[0], IDP[1], .85), blur0 = p ? D.coc(v, p.d) / 2 : 0;
    const x = lerp(p ? p.x : ex, ex, k), y = lerp(p ? p.y : ey, ey, k), s = lerp(p ? p.s : .8 * U, .8 * U, k) * (1 - .45 * open);
    qMark(ctx, x, y, s, a * lerp(.35, 1, smooth(k * 1.6)), blur0 * (1 - k));
  }

  // ─── the idea: a dashed glass card, "আলোচিত ধারণা"; the name types itself and folds into "Orch-OR"; then it shrinks to a corner chip ───
  const KW = [['Orchestrated', ORCH, 4], ['Objective', OBJ, 1], ['Reduction', RED, 1]];   // each word, its time and how many of its first letters stay
  const FD0 = SHORT + .02, FD1 = FD0 + .6, TS = P ? 80 : 84, TS2 = P ? 124 : 132, TY = P ? 40 : 34;
  const HUDH = 66, HUDW = 318, HUD = [44 + HUDW / 2, 44 + HUDH / 2];   // the corner chip, in screen units
  let GLY = null;   // letter offsets, measured once the fonts are in
  function glyphs(c) {
    if (GLY) return GLY;
    const font = s => YV.fontOf(s, 700), mw = (s, size) => { c.save(); c.font = font(size); const x = c.measureText(s).width; c.restore(); return x; };
    const words = KW.map(([s]) => ({ s, w: mw(s, TS), xs: [...s].map((_, i) => mw(s.slice(0, i), TS)), ws: [...s].map(ch => mw(ch, TS)) }));
    const tgt = 'Orch-OR', tw = mw(tgt, TS2), txs = [...tgt].map((_, i) => mw(tgt.slice(0, i), TS2) - tw / 2), tws = [...tgt].map(ch => mw(ch, TS2));
    return (GLY = { words, txs, tws, tw });
  }
  function drawTitle(c, t, a, size2 = TS2) {   // around (0, 0): three stacked words on the voice, then the fold into one short name
    const G = glyphs(c), fk = easeIO((t - FD0) / (FD1 - FD0)), map = [[0, 1, 2, 3], [5], [6]], sc = size2 / TS2;
    KW.forEach(([s, t0, keep], wi) => {
      const g = G.words[wi], y0 = (wi - 1) * TS * 1.12, x0 = -g.w / 2;
      const keptEnd = () => { const j = map[wi][keep - 1]; return lerp(x0 + g.xs[keep - 1] + g.ws[keep - 1], (G.txs[j] + G.tws[j]) * sc, fk); };
      [...s].forEach((ch, i) => {
        const ki = expo((t - (t0 - .04 + i * .028)) / .45); if (ki <= 0) return;
        const kept = i < keep, sx = x0 + g.xs[i], sy = y0 + 30 * (1 - ki);
        let x, y, size, al = a * smooth(ki * 1.5), sxk = 1;
        if (kept) { const j = map[wi][i]; x = lerp(sx, G.txs[j] * sc, fk); y = lerp(sy, 0, fk); size = lerp(TS, size2, fk); }
        else { const ck = clamp(fk / .55); x = lerp(sx, keptEnd(), ck); y = lerp(sy, lerp(y0, 0, fk), ck); size = TS; al *= 1 - ck; sxk = 1 - ck; }
        if (al <= .004) return;
        c.save(); c.translate(x, y); c.scale(sxk, 1); c.font = YV.fontOf(size, 700); c.textAlign = 'left'; c.textBaseline = 'middle';
        c.shadowColor = 'rgba(0,10,20,.5)'; c.shadowBlur = size * .2; c.shadowOffsetY = size * .06;
        c.fillStyle = kept ? F.rgba(F.hex(AMBER), al) : `rgba(255,255,255,${al})`; c.fillText(ch, 0, 0); c.restore();
      });
    });
    const hk = smooth((fk - .55) / .45); if (hk > 0) { c.save(); c.font = YV.fontOf(size2, 700); c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = F.rgba(F.hex(AMBER), a * hk); c.fillText('-', G.txs[4] * sc, 0); c.restore(); }   // the hyphen
    return G.tw * sc;
  }
  function drawIdea(ctx, t) {
    const open = expo((t - OPEN0) / .7); if (open <= .004) return;
    const away = easeIO((t - AWAY0) / (AWAY1 - AWAY0)), [ix, iy] = uiPt(t, IDP[0], IDP[1], .85);
    const cx = lerp(ix, HUD[0] * U, away), cy = lerp(iy, HUD[1] * U, away), w = lerp(lerp(220, IDW, open), HUDW, away), h = lerp(lerp(280, IDH, open), HUDH, away);
    ctx.save(); ctx.setTransform(U, 0, 0, U, cx, cy);
    glass(ctx, w, h, smooth(open * 2), lerp(40, HUDH / 2, away), true);
    const full = 1 - smooth(away / .5), c = ctx;
    // "আলোচিত ধারণা": large in the middle on its words, then up to the top as the name begins
    const up = easeIO((t - (NAME - .15)) / .6), ks = lerp(58, 34, up), kick = [['আলোচিত', TALKED], ['ধারণা', IDEA]], kws = kick.map(([s]) => YV.measure(c, s, ks, 600)), kt = kws[0] + kws[1] + ks * .3, ky = lerp(0, -IDH / 2 + 58, up);
    let kx = -kt / 2; kick.forEach(([s, t0], i) => { const k = smooth((t - t0 + .05) / .35); say(c, s, kx + kws[i] / 2, ky + 12 * (1 - k), ks, full * open * k * lerp(1, .85, up)); kx += kws[i] + ks * .3; });
    const tSize = lerp(TS2, 36, away), tx = lerp(0, -HUDW / 2 + 26 + glyphs(c).tw * 36 / TS2 / 2, away), ty = lerp(TY, 0, away);
    c.save(); c.translate(tx, ty); drawTitle(c, t, open, tSize); c.restore();
    say(c, 'অর্ক-ওআর', 0, TY + TS2 * .72, 40, full * smooth((t - ORCHOR + .05) / .4) * .7, { weight: 500 });
    tag(c, lerp(-IDW / 2 + 40, HUDW / 2 - 104, away), lerp(-IDH / 2 + 56, 0, away), ORCHOR2, t, open, lerp(32, 24, away));   // the "তত্ত্ব" badge stamps on "(Orch-OR)"
    ctx.restore();
  }
  function drawLinks(ctx, t) {   // the two names to their idea: thin solid lines (that they proposed it is a fact), their ends fading out
    const k = expo((t - (AN + .15)) / .7) * (1 - smooth((t - AWAY0) / .45)); if (k <= .004) return;
    const [bx, by] = uiPt(t, IDP[0], IDP[1] - IDH / 2, .85);
    for (const [p, side] of [[PEOPLE[0], -1], [PEOPLE[1], 1]]) {
      const [ax, ay] = uiPt(t, p.chip[0], p.chip[1] + CHIPH / 2, p.d), ex = bx + side * IDW * .2 * U, ey = by;
      const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30 * k, m = 1 - u; pts.push([m * m * m * ax + 3 * m * m * u * ax + 3 * m * u * u * ex + u * u * u * ex, m * m * m * ay + 3 * m * m * u * (ay + ey) / 2 + 3 * m * u * u * (ay + ey) / 2 + u * u * u * ey]); }
      const g = ctx.createLinearGradient(ax, ay, ex, ey); g.addColorStop(0, 'rgba(200,240,255,0)'); g.addColorStop(.25, 'rgba(200,240,255,.5)'); g.addColorStop(.75, 'rgba(200,240,255,.5)'); g.addColorStop(1, 'rgba(200,240,255,0)');
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = g; ctx.lineWidth = 2 * U; ctx.lineCap = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
    }
  }

  // ═══ ঘ · inside the neuron: microtubules. A real one is a hollow tube about 25 nm across, 13 strands (protofilaments) of
  // α/β-tubulin, each unit about 4 nm, the strands staggered into a helix; here drawn to those proportions, in world units ═══
  const MR = 300, MN = 13, MDZ = 96, MHX = 22, MLEN = 16000;   // the units' radius, strands, spacing along the tube, the helical rise from strand to strand
  // tubulin as shaded beads, the look of a scientific illustration, painted far to near so the wall reads as a surface
  const sphere = (lite, mid, dark) => (x, r) => { const g = x.createRadialGradient(-r * .3, -r * .35, r * .05, 0, 0, r); g.addColorStop(0, lite); g.addColorStop(.5, mid); g.addColorStop(.9, dark); g.addColorStop(1, F.rgba(F.hex(dark), 0)); x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill(); };
  const halo = c => (x, r) => { const g = x.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, F.rgba(F.hex(c), .9)); g.addColorStop(.4, F.rgba(F.hex(c), .35)); g.addColorStop(1, F.rgba(F.hex(c), 0)); x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill(); };
  const SA = D.sprites(sphere('#b4ecff', '#45aad4', '#0b3448')), SB = D.sprites(sphere('#aebfff', '#3558bf', '#0d1b50')), SQ = D.sprites(sphere('#dccaff', '#8a62e8', '#2a1664'));   // α, β, the violet of the quantum flicker
  const HQ = D.sprites(halo('#b98cff')), HW = D.sprites(halo('#fff0cf'));   // glows, added on top: the flicker, the collapse front
  const TUBES = [{ x: 0, y: 0, z0: 0, roll: 0, hero: true }, ...Array.from({ length: 5 }, (_, i) => { const a = i / 5 * TAU + .3 + hash(i, 81) * .5, r = 1000 + hash(i, 82) * 500; return { x: Math.cos(a) * r, y: Math.sin(a) * r * .85, z0: -1400 + hash(i, 83) * 2600, roll: hash(i, 84) * TAU }; })];
  // the beats inside
  const E0 = DV1 - .2, GO = TINY + .17, VT = 1300, AT = .7, ZA = -1150;   // arrival, then speeding up into the tube's mouth
  const SW0 = MT + .25, SW1 = TINY - .05, A0 = P ? .55 : .8, B0 = P ? .55 : .38;   // the bundle, tilted at first so the tubes are seen as tubes, swings onto the lens axis
  const COL0 = AND2, COL1 = MIND, OUT0 = THEORY, OUT1 = BUT - .1, GREY = BUT, YAW = P ? 1.2 : 1.25, ROLL = P ? -.62 : -.22;
  const sGo = tau => tau <= 0 ? 0 : tau < AT ? VT * AT * (Math.pow(tau / AT, 3) - Math.pow(tau / AT, 4) / 2) : VT * (tau - AT / 2);   // speed ramps up smoothly, then holds
  const zAt = t => {
    if (t < GO) return lerp(-4200, ZA, easeOut((t - E0) / (GO - E0), 2));
    if (t < COL1) return ZA + sGo(t - GO);
    const zm = ZA + sGo(COL1 - GO), tt = 2 * 1000 / VT;   // after the burst: slowing to a stop 1300 short of the light
    return lerp(zm, zm + 1000, easeOut((t - COL1) / tt, 2));
  };
  const LZ = ZA + sGo(COL1 - GO) + 2300;   // the amber light, far down the tube, where the collapse ends
  const still = t => Math.min(t, GREY + .15);   // on "কিন্তু" everything stops
  function camM(t) {
    const ts = still(t), k = easeIO((t - E0) / (GO - E0 + .3)), out = easeIO((t - OUT0) / (OUT1 - OUT0)), wob = (1 - out) * smooth((t - GO - .5) / .8);
    const x = lerp(P ? 200 : 380, 0, k) + 22 * Math.sin(ts * .7) * wob, y = lerp(P ? -200 : -170, 0, k) + 16 * Math.sin(ts * .55) * wob;
    const z = t < OUT0 ? zAt(t) : lerp(zAt(OUT0), LZ - (P ? 2500 : 2300), out);
    const fm = t < GO ? Math.max(500, -z) : t < OUT0 ? 800 : lerp(800, LZ - z, out);
    return D.view({ x, y, z, focus: fm, aperture: 14, maxBlur: 26, fogNear: 1500, fogFar: 7400 }, W, H);
  }
  // orientation this frame: the bundle's tilt (yaw a, pitch b, about the hero's mouth) and, at the end, the hero's swing side-on around the light
  const orient = t => { const k = easeIO((t - SW0) / (SW1 - SW0)), s = easeIO((t - OUT0 - .25) / (OUT1 - OUT0 - .25)); return { a: A0 * (1 - k), b: B0 * (1 - k), s }; };
  function place(tube, O, lx, ly, lz) {   // a point of a tube (its own frame: the axis along z from its mouth) → world
    let x = lx + tube.x, y = ly + tube.y, z = lz + tube.z0;
    if (O.b) { const cb = Math.cos(O.b), sb = Math.sin(O.b), y1 = y * cb - z * sb; z = y * sb + z * cb; y = y1; }
    if (O.a) { const ca = Math.cos(O.a), sa = Math.sin(O.a), x1 = x * ca + z * sa; z = -x * sa + z * ca; x = x1; }
    if (tube.hero && O.s > 0) {
      const a = YAW * O.s, r = ROLL * O.s, dz = z - LZ, x1 = x * Math.cos(a) + dz * Math.sin(a), z1 = -x * Math.sin(a) + dz * Math.cos(a);
      x = x1 * Math.cos(r) - y * Math.sin(r); y = x1 * Math.sin(r) + y * Math.cos(r); z = z1 + LZ;
    }
    return [x, y, z];
  }
  // the quantum state of the units: q 0..1 (the flicker: a theory), and the collapse front rushing at the lens
  const qOn = t => smooth((t - QUANT + .05) / .5);
  const front = t => t < COL0 ? Infinity : t > COL1 ? -Infinity : zAt(t) + 6500 * (1 - easeIn((t - COL0) / (COL1 - COL0), 1.6));
  function drawTubes(ctx, v, t, a) {
    const ts = still(t), q0 = qOn(t), zf = front(t), others = 1 - smooth((t - (GO + .5)) / .5), O = orient(t), aligned = !O.a && !O.b && !O.s, list = [];
    const br = lerp(64, 78, smooth((t - GO - .7) / .6) * (1 - O.s));   // the beads' size: fuller inside, so the wall reads as a wall
    for (const tube of TUBES) {
      const ta = a * (tube.hero ? 1 : others); if (ta <= .004) continue;
      const roll = tube.roll + .05 * ts, len = tube.hero ? (aligned ? MLEN : 9000) : 4500;
      let k0 = 0, k1 = Math.floor(len / MDZ);
      if (aligned) { k0 = Math.max(0, Math.floor((v.z - tube.z0 - 300) / MDZ)); k1 = Math.min(k1, Math.ceil((v.z - tube.z0 + v.fogFar + 300) / MDZ)); }   // down the tunnel: only what is ahead
      for (let i = 0; i < MN; i++) {
        const th = i / MN * TAU + roll, cs = MR * Math.cos(th), sn = MR * Math.sin(th);
        for (let k = k0; k <= k1; k++) {
          const lz = k * MDZ + i * MHX, [wx, wy, wz] = place(tube, O, cs, sn, lz), p = D.proj(v, wx, wy, wz);
          if (!p || p.d < 40 || p.d > v.fogFar) continue;
          const rr = br * p.s; if (rr < 1.4 || p.x < -rr * 2 || p.x > W + rr * 2 || p.y < -rr * 2 || p.y > H + rr * 2) continue;
          const al = ta * (1 - D.fog(v, p.d)) * smooth((p.d - 60) / 240); if (al < .02) continue;
          const qu = tube.hero ? q0 * smooth((wz - zf) / -160 + .5) : 0, wf = tube.hero && zf !== Infinity ? Math.exp(-Math.pow((wz - zf) / 240, 2)) : 0;
          list.push([p.d, p.x, p.y, rr, D.coc(v, p.d), al, k % 2, qu, wf, hash(i, k)]);
        }
      }
    }
    list.sort((m, n) => n[0] - m[0]);
    const glows = [];
    ctx.save();
    for (const [, x, y, rr, b, al, tn, qu, wf, h] of list) {
      bead1(ctx, tn ? SB : SA, x, y, rr, b, al);
      if (qu > .01) {   // superposed: violet, both tones flickering through it at once
        const f = Math.sin(ts * 31 + h * 40) > 0;
        bead1(ctx, SQ, x, y, rr, b, al * qu * .85); bead1(ctx, f ? SA : SB, x, y, rr * .8, b, al * qu * .45);
        glows.push([HQ, x, y, rr * 1.5, b, al * qu * .2 * (.6 + .4 * Math.sin(ts * 23 + h * 17))]);
      }
      if (wf > .02) glows.push([HW, x, y, rr * 1.8, b, al * wf * .8 * lerp(.15, 1, smooth((rr - 60 * U) / -40 + 1))]);   // the front, a bright ring racing past
    }
    ctx.globalCompositeOperation = 'lighter'; for (const g of glows) bead1(ctx, ...g);
    ctx.restore();
  }
  // one pre-blurred level per bead, the nearest to its blur (no crossfade: beads are small and move fast), so a bead is one drawImage
  const LV = [0, .15, .35, .7, 1.2, 2];
  function bead1(ctx, set, x, y, rr, b, a) {
    if (a <= .004) return;
    const f = b / rr; let i = 0; while (i < 5 && LV[i + 1] <= f) i++; if (i < 5 && f - LV[i] > LV[i + 1] - f) i++;
    const s = set[i], e = s.pad * rr / s.r; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(s.c, x - e, y - e, 2 * e, 2 * e);
  }
  // the words at the mouth: "মাইক্রোটিউবিউল" beside it, "≈ ২৫ ন্যানোমিটার" across it (a fact: solid)
  function drawMouthLabels(ctx, v, t) {
    const la = smooth((t - MT + .05) / .4) * (1 - smooth((t - (GO + .35)) / .3)); if (la <= .004) return;
    const O = orient(t), H0 = TUBES[0], RO = MR + 54;
    const lp = D.proj(v, ...place(H0, O, RO + 40, -RO - 20, 0));   // at a steady size beside the mouth, wherever the mouth is
    if (lp) { ctx.save(); ctx.setTransform(U, 0, 0, U, Math.min(lp.x + 24 * U, W - 420 * U), Math.max(lp.y - 20 * U, 90 * U)); YD.text(ctx, 'মাইক্রোটিউবিউল', 50, la, { weight: 600, glow: .5, align: 'left' }); ctx.restore(); }
    const dk = expo((t - TINY + .05) / .6); if (dk <= .004) return;
    D.plane(ctx, v, 0, 0, 0, 900, 700, c => {   // the mouth faces the lens by now
      const y = RO + 70, x0 = -RO * dk, x1 = RO * dk;
      c.save(); c.globalAlpha *= la; c.strokeStyle = 'rgba(225,246,255,.9)'; c.lineWidth = 3; c.lineCap = 'round'; c.shadowColor = 'rgba(95,200,255,.6)'; c.shadowBlur = 10;
      c.beginPath(); c.moveTo(-RO, 30); c.lineTo(-RO, y + 22); c.moveTo(RO, 30); c.lineTo(RO, y + 22); c.stroke();                        // the extension lines
      c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();                                                                  // the dimension line, drawing out from the middle
      for (const [x, s] of [[x0, 1], [x1, -1]]) { c.beginPath(); c.moveTo(x + s * 20, y - 12); c.lineTo(x, y); c.lineTo(x + s * 20, y + 12); c.stroke(); }
      c.restore();
      c.save(); c.translate(0, y + 70); YD.text(c, '≈ ২৫ ন্যানোমিটার', 54, la * smooth((dk - .5) / .5), { weight: 600, glow: .45 }); c.restore();
    }, { fog: 0, blurMul: .3 });
  }

  // a claim in a dashed pill with its "তত্ত্ব" tag after it, centred on (0, y) of the current transform
  function claim(c, words, times, t, y, size, a) {
    if (a <= .004) return;
    const ws = words.map(s => YV.measure(c, s, size, 700)), pw = ws.reduce((p, q) => p + q, 0) + size * .28 * (words.length - 1) + size * 1.1, tw = YV.measure(c, TATTVA, 26, 700) + 26 * 1.1, tot = pw + 18 + tw;
    const ba = a * smooth((t - times[0] + .05) / .3); if (ba > .004) { c.save(); c.globalAlpha *= ba; rrect(c, -tot / 2 - 18, y - size * 1.05, tot + 36, size * 2.1, size * 1.05); c.fillStyle = 'rgba(4,14,24,.62)'; c.fill(); c.restore(); }   // dark glass behind, so it reads over the tunnel
    pill(c, words, times, t, -tot / 2 + pw / 2, y, size, a, true);
    tag(c, -tot / 2 + pw + 18, y, times[times.length - 1] + .2, t, a, 26);
  }

  // ═══ the two worlds, one frame ═══
  function drawW1(ctx, t) {   // the field, the cards over it, the dive
    const v = camF(t), pk = pullK(t);
    drawField(ctx, v, t, { words: 1 - smooth((t - .2) / .6), q: t < Q0 ? 1 - .65 * smooth(pk * 1.8) : 0, near: pk, hero: smooth((t - 1) / 3) * lerp(P ? .2 : .32, 1, smooth((t - AWAY0) / .8)) });   // faint behind the cards (in 4:5 it sits right behind them), full once they go
    if (pk > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(2,10,16,${.12 * pk})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }   // the field steps back behind the cards
    drawLinks(ctx, t);
    for (const p of PEOPLE) drawPerson(ctx, p, t);
    drawQuestion(ctx, t, v);
  }
  function drawW2(ctx, t) {   // inside the neuron
    const v = camM(t), gk = smooth((t - GREY) / .6);
    YD.bg(ctx, v);
    drawTubes(ctx, v, t, smooth((t - E0) / .35));
    const lp = D.proj(v, 0, 0, LZ), lk = t < COL1 ? 0 : Math.min(1, (t - COL1) / .2) * (1 + .7 * Math.exp(-(t - COL1) * 2.5)) * lerp(1, .4, gk);   // the amber light, where the collapse ends
    if (lp && lk > 0) { const lr = 20 * lp.s * (1 + .9 * orient(t).s); YD.rays(ctx, lp.x, lp.y, lr, .5 * lk, still(t)); YD.light(ctx, lp.x, lp.y, lr, lk); }
    drawMouthLabels(ctx, v, t);
    drawDust(ctx, v, g5(still(t)), .5);
    YD.post(ctx);
    const fl = Math.exp(-Math.pow((t - COL1) / .1, 2)) * .3; if (fl > .01) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = fl; ctx.fillStyle = '#ffc46a'; ctx.fillRect(0, 0, W, H); ctx.restore(); }   // the burst, amber
    ctx.save(); ctx.setTransform(U, 0, 0, U, W / 2, H / 2);
    const py = (P ? 330 : 270);
    claim(ctx, ['কোয়ান্টাম', 'প্রক্রিয়া'], [QUANT, PROCESS], t, py, 40, 1 - smooth((t - COL0 - .05) / .3));
    claim(ctx, ['চেতনার', 'সাথে', 'যুক্ত'], [MIND, WITH, LINKED], t, py, 40, 1 - smooth((t - OUT0 - .3) / .5));
    const na = .55 * smooth((t - GO - .2) / .5) * (1 - smooth((t - OUT0 - .2) / .5));   // the tunnel is an illustration
    if (na > .004) say(ctx, 'প্রতীকী ছবি · মাপ অনুযায়ী নয়', W / 2 / U - 44, H / 2 / U - 44, 24, na, { align: 'right', weight: 500, glow: .2 });
    ctx.restore();
  }
  const [FXC, FXX] = F.canvas(W, H), [GRC, GRX] = F.canvas(W, H);
  const X0 = DV1 - .32, X1 = DV1 + .02;   // the lens passes the neuron's skin
  function drawScene(ctx, t) {
    const k = smooth((t - X0) / (X1 - X0));
    if (k <= 0) drawW1(ctx, t);
    else {
      drawW2(ctx, t);
      if (k < 1) { FXX.setTransform(1, 0, 0, 1, 0, 0); FXX.globalAlpha = 1; FXX.globalCompositeOperation = 'source-over'; FXX.filter = 'none'; drawW1(FXX, t); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - k; ctx.drawImage(FXC, 0, 0); ctx.restore(); }
    }
    const fl = Math.exp(-Math.pow((t - (DV1 - .1)) / .12, 2)) * .5; if (fl > .01) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = fl; ctx.fillStyle = '#dff6ff'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    drawIdea(ctx, t);   // the idea card, and then the corner chip that stays
    const gk = smooth((t - GREY) / .6);   // "কিন্তু": grey and still
    if (gk > 0) {
      GRX.setTransform(1, 0, 0, 1, 0, 0); GRX.globalAlpha = 1; GRX.globalCompositeOperation = 'copy'; GRX.filter = `saturate(${(1 - .93 * gk).toFixed(3)}) brightness(${(1 - .2 * gk).toFixed(3)})`; GRX.drawImage(ctx.canvas, 0, 0); GRX.filter = 'none';
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'copy'; ctx.drawImage(GRC, 0, 0); ctx.restore();
    }
    ctx.save(); ctx.setTransform(U, 0, 0, U, W / 2, H / 2); pill(ctx, ['প্রমাণিত', 'নয়'], [PROVEN, NOT], t, 0, H / 2 / U - (P ? 180 : 150), 58, 1, true, badgeK(t, PROVEN)); ctx.restore();   // the verdict, outlined
  }

  // ─── sound effects, about 10 dB under the voice ───
  const LEVEL = .48;
  const airy = (t0, g = .09) => ({ t: t0, type: 'air', dur: .6, f0: 900, f1: 1600, g });
  const SFX = [
    { t: FOC0, type: 'air', dur: 1.1, f0: 500, f1: 1100, g: .1 },                                                                                  // the focus pulls forward
    { t: .4, type: 'air', dur: .8, f0: 500, f1: 1400, g: .14 }, { t: .6, type: 'pop', g: .1 }, { t: NOBEL + .72, type: 'stampSmall', g: .22 }, { t: NOBEL + .72, type: 'tap', g: .1 },   // Penrose's card
    airy(PHYS), { t: 1.25, type: 'pop', g: .08 }, airy(ROGER),
    { t: PAN0, type: 'swoosh', dur: .9, f0: 500, f1: 900, peak: .5, g: .18 },
    { t: AND - .2, type: 'air', dur: .8, f0: 500, f1: 1400, g: .14 }, { t: AND, type: 'pop', g: .1 }, airy(ANAES), { t: ANAES + .75, type: 'pop', g: .08 }, airy(STUART),   // Hameroff's
    { t: FOLD0, type: 'slide', dur: .7, g: .14 }, { t: Q0, type: 'air', dur: .75, f0: 400, f1: 1200, g: .14 },                                    // the cards fold, the "?" comes forward
    { t: OPEN0, type: 'bloom', dur: 1.2, f: 294, g: .16 }, { t: OPEN0 + .05, type: 'pop', g: .1 }, { t: AN + .15, type: 'trace', dur: .7, g: .12 }, airy(TALKED), airy(IDEA),
    ...[ORCH, OBJ, RED].flatMap(t0 => [{ t: t0, type: 'trace', dur: .4, g: .1 }, { t: t0, type: 'tap', g: .1 }]),                                // the name types itself
    { t: FD0, type: 'slide', dur: .5, g: .16 }, { t: FD1 - .05, type: 'clack', g: .16 },                                                           // folds into Orch-OR
    { t: ORCHOR2, type: 'stampSmall', g: .26 }, { t: ORCHOR2, type: 'tap', g: .1 },                                                                // "তত্ত্ব"
    { t: AWAY0, type: 'swoosh', dur: .85, f0: 900, f1: 400, peak: .5, g: .18 },                                                                    // to the corner
    { t: DV0, type: 'riser', dur: DV1 - .1 - DV0, f0: 200, f1: 1800, g: .2 }, { t: DV1 - .1, type: 'impact', size: .45, f: 60, g: .28 },          // the dive into the neuron
    { t: E0, type: 'drone', dur: DUR - E0, f: 48, g: .28 }, { t: E0 + .2, type: 'spark', dur: COL0 - E0, rate: 3, g: .1 },                         // inside
    airy(MT), { t: TINY, type: 'trace', dur: .6, g: .14 },
    { t: GO, type: 'swoosh', dur: 1.3, f0: 300, f1: 1200, peak: .8, g: .22 },                                                                      // into the tube
    { t: QUANT, type: 'shimmer', dur: 2, g: .22 },                                                                                                  // the flicker
    { t: COL0, type: 'riser', dur: COL1 - COL0, f0: 400, f1: 3000, g: .22 }, { t: COL1, type: 'impact', size: .6, f: 70, g: .3 }, { t: COL1, type: 'bloom', dur: 2, f: 330, g: .26 },   // the collapse, the light
    airy(WITH), airy(LINKED),
    { t: OUT0, type: 'swoosh', dur: 1.6, f0: 1200, f1: 300, peak: .4, g: .2 }, { t: OUT0 + .8, type: 'air', dur: 1.5, f0: 700, f1: 400, g: .1 },    // backing out, the swing
    { t: GREY, type: 'powerDown', dur: 1.4, f: 260, g: .2 },                                                                                        // grey and still
    { t: PROVEN, type: 'stampSmall', g: .3 }, { t: PROVEN, type: 'tap', g: .12 }, { t: NOT, type: 'stampSmall', g: .3 },                           // the verdict
  ].map(c => ({ ...c, g: c.g * LEVEL }));

  const fontsReady = Promise.race([
    Promise.all(['Hind Siliguri', 'Noto Serif Bengali'].flatMap(f => [500, 600, 700].map(wt => document.fonts.load(`${wt} 60px "${f}"`, 'প্রমাণিত নয় তত্ত্ব Orchestrated')))),
    new Promise(r => setTimeout(r, 5000)),
  ]);
  const label_ = t => { let s = ''; for (const x of T.words) if (x[1] <= t + 1e-6) s = x[0]; return s; };
  F.scene(ID, { W, H, duration: DUR, draw: (ctx, t) => { D.frameStart(); drawScene(ctx, t); }, ready: fontsReady, label: label_, sfx: SFX, grain: 'frame' });
})();
