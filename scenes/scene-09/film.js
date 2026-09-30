// Scene 09 · Honest (3:41.220–4:06.224 of voice/Death.mp3, and a hold of the last line to 4:08.8), v2 (2026-09-29; v1's
// two glass cards were "খুবই ক্লিশে", kept as film.old-style.js). It opens on scene 08's last frame: the fork keeps moving
// on its own clock (scene 08's registered draw, loaded with the page), then falls away below as the camera rises into the
// dark. A sheet of scanning light draws itself across the frame, "আজকের বিজ্ঞান", and snaps sharp on "পরিষ্কার". The
// claim "মৃত্যুর পর ব্যক্তিগত চেতনা টিকে থাকে" flies in word by word as big hollow dashed letters; on "এমন কোনো প্রমাণ"
// the scan sweeps up through it, its readout searching and settling on "প্রমাণ ০", and each word falls away in sparks;
// "প্রমাণ নেই". The amber light comes up; "চেতনা কীভাবে জন্ম নেয়" flies in under it, and on "প্রশ্নের" a thousand sparks
// swirl into a "?" whose dot is the light itself; "উত্তর জানা হয়নি". On "আর বিজ্ঞানের সৌন্দর্য" it all spirals into the
// light as the camera dives in, and pulls back out of it (scene 01's opening, reversed): the light is one neuron in the
// brain of lights; the brain's network stretches out into the web of galaxies, a visual rhyme only, and the one small
// light is left in front of it, facing it. "আমরা এখনো জানি না।" comes in under the light and holds. No music or end card
// yet (the director's call, after the whole video).
(function () {
  'use strict';
  const F = FILM, D = F.depth, { clamp, smooth, easeIO, easeOut, easeIn, easeOutBack, lerp, keyed, noise1, hash, rng, TAU } = F;
  const ID = 'scene-09', T = window.TIMING[ID], DUR = T.duration;
  const { W, H, portrait: P } = F.format(), U = Math.min(W, H) / 1080;
  const YV = F.style25('vector', W, H), YD = F.style25('depth', W, H);
  const norm = s => s.normalize('NFC').replace(/[।,?!—'"()\s]/g, '');
  const w = (word, n = 1) => { let k = 0; for (const x of T.words) if (norm(x[0]) === norm(word) && ++k === n) return x[1]; throw new Error(`${ID}: no word "${word}" (${n})`); };
  const at = g => +(g - T.start).toFixed(3);   // a time measured from the voice itself, where the SRT is off
  const TODAY = w('আজকের'), SCI = w('বিজ্ঞানের'), POS = w('অবস্থান'), CLEAR = w('পরিষ্কার');
  const DEATH = w('মৃত্যুর'), AFTER = w('পর'), PERS = w('ব্যক্তিগত'), MIND = w('চেতনা'), SURV = w('টিকে'), STAYS = w('থাকে'), PROOF = w('প্রমাণ'), NONE = w('নেই');
  const BUT = w('তবে'), MIND2 = at(230.38), HOW = w('কীভাবে'), BIRTH = w('জন্ম'), TAKES = w('নেয়'), QN = w('প্রশ্নের'), ANSWER = w('উত্তরও'), KNOWN = at(233.56), NOTYET = w('হয়নি');   // "চেতনা" 0.35 s after the SRT, "জানা" 0.27 s before it (measured)
  const AND = w('আর'), BEAUTY = w('সৌন্দর্য'), HERE = w('এখানেই'), ALL = w('সবকিছু'), UNKNOWN = w('অজানার'), FACING = w('সামনে');
  const WE = w('আমরা'), STILL = w('এখনো'), KNOW = w('জানি'), NO = w('না');
  const glow = (c, x, y, r, col, a) => { if (a <= .004 || r <= 0) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, F.rgba(F.hex(col), a)); g.addColorStop(1, F.rgba(F.hex(col), 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const expo = x => 1 - Math.pow(2, -10 * clamp(x));
  const rise = (t, t0, d = .55) => expo((t - t0) / d);
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); };
  const AMBER = '#ffc93c', MINT = '#3ff0d0';

  // ═══ the glass language of scenes 06–08 (their painters) ═══
  function glass(c, w, h, a, r = 36, dashed = false, tint = null) {
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
  function words(c, list, t, x, y, size, a, align = 'center', o = {}) {
    const wt = o.weight || 600, gap = size * .3, ws = list.map(([s]) => YV.measure(c, s, size, wt)), tot = ws.reduce((p, q) => p + q, 0) + gap * (list.length - 1);
    let xx = align === 'left' ? x : align === 'right' ? x - tot : x - tot / 2;
    list.forEach(([s, t0], i) => { const k = smooth((t - t0 + .05) / .35); say(c, s, xx + ws[i] / 2, y + 12 * (1 - k), size, a * k, { weight: wt, ...o }); xx += ws[i] + gap; });
    return tot;
  }

  // ═══ scene 08, carried on: its fork keeps moving on its own clock, then falls away below as the camera rises into the
  // dark (its top edge softened as it goes, so it leaves no hard line) ═══
  const S8 = F.getScene('scene-08'), DUR8 = S8 ? S8.duration : 30.97, LIVE = 1.0, RISE = 2.5;
  const [BGC, BGX] = F.canvas(W, H), [MKC, MKX] = F.canvas(W, H);
  let HELD = null;
  function masked(src, m) {
    MKX.setTransform(1, 0, 0, 1, 0, 0); MKX.globalAlpha = 1; MKX.globalCompositeOperation = 'copy'; MKX.drawImage(src, 0, 0);
    if (m > 0) { MKX.globalCompositeOperation = 'destination-in'; const g = MKX.createLinearGradient(0, 0, 0, H * .4); g.addColorStop(0, `rgba(0,0,0,${1 - m})`); g.addColorStop(1, 'rgba(0,0,0,1)'); MKX.fillStyle = g; MKX.fillRect(0, 0, W, H); }
    MKX.globalCompositeOperation = 'source-over'; return MKC;
  }
  function drawFork(ctx, t) {
    const u = clamp(t / RISE); if (u >= 1) return;
    let src = BGC;
    if (t < LIVE || !S8) { BGX.setTransform(1, 0, 0, 1, 0, 0); if (S8) S8.draw(BGX, DUR8 + t); else { BGX.fillStyle = '#000'; BGX.fillRect(0, 0, W, H); } }
    else { if (!HELD) { BGX.setTransform(1, 0, 0, 1, 0, 0); S8.draw(BGX, DUR8 + LIVE); const [hc, hx] = F.canvas(W, H); hx.drawImage(BGC, 0, 0); HELD = hc; } src = HELD; }
    const img = masked(src, smooth(t / .6)), dy = H * .62 * easeIn(u, 1.8), s = 1 - .1 * easeIn(u, 1.5), a = 1 - smooth((u - .45) / .55);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.translate(W / 2, H / 2 + dy); ctx.scale(s, s); ctx.drawImage(img, -W / 2, -H / 2); ctx.restore();
  }

  // ═══ the dark above it: world units, the plane of the words and the light at z 1000 ═══
  const LV = [0, 170, 1000];                                                    // where the light will be: the dot of the "?"
  const FOLD0 = AND - .25, FOLD1 = FOLD0 + .65;
  const foldK = t => easeIn(clamp((t - FOLD0) / (FOLD1 - FOLD0)), 2);
  function camV(t) {
    const up = easeOut(clamp(t / RISE), 2.2), push = 60 * easeIO((t - (BUT - .3)) / 4.5), fk = foldK(t);   // up out of the fork; a slow push in; the dive into the light
    const x = lerp(12 * Math.sin(t * .35), LV[0], fk), y = lerp(lerp(420, 0, up) + 7 * Math.sin(t * .5), LV[1], fk), z = lerp(push, LV[2] - 88, fk);
    return D.view({ x, y, z, focus: LV[2] - z, aperture: 12, maxBlur: 30, fogNear: 2600, fogFar: 9000 }, W, H);
  }
  const MOTES = Array.from({ length: 200 }, (_, i) => ({ x: (hash(i, 1) - .5) * 3600, y: (hash(i, 2) - .5) * 3000, z: 200 + hash(i, 3) * 3400, r: 2 + hash(i, 4) * 4, ph: hash(i, 5) * 10 }));
  function drawMotes(ctx, v, t) {
    for (const m of MOTES) {
      const p = D.proj(v, m.x + 30 * noise1(t * .15 + m.ph, 3), m.y + 20 * noise1(t * .12 + m.ph, 4), m.z); if (!p || p.d < 60 || p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) continue;
      YD.dust(ctx, p.x, p.y, m.r * p.s, D.coc(v, p.d), .5 * smooth((p.d - 60) / 200) * (1 - D.fog(v, p.d)));
    }
  }

  // ─── the scan: a sheet of light across the dark, "আজকের বিজ্ঞান"; it snaps sharp on "পরিষ্কার", then sweeps up
  // through the claim looking for evidence, its readout searching and settling on "০" ───
  const BEAM0 = TODAY - .25, BEAM1 = SCI + .55, SW0 = w('এমন') - .05, SW1 = SW0 + 1.05;
  const BY = t => keyed(t, [[SW0, 330], [SW1, -520]]);
  const bn = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
  function drawBeam(ctx, v, t) {
    const grow = easeOut(clamp((t - BEAM0) / (BEAM1 - BEAM0)), 2.5), out = 1 - smooth((t - SW1 - .2) / .6); if (grow <= 0 || out <= 0) return;
    const p = D.proj(v, 0, BY(t), 1000); if (!p) return;
    const y = p.y, half = W * .6 * grow, snap = Math.exp(-Math.pow((t - CLEAR - .05) / .14, 2)), crisp = smooth((t - CLEAR + .1) / .3), sweep = Math.sin(Math.PI * clamp((t - SW0) / (SW1 - SW0)));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    const hz = lerp(150, 80, crisp) * U * (1 + .4 * sweep);
    ctx.save(); ctx.translate(W / 2, y); ctx.scale(half / hz, 1); const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, hz); rg.addColorStop(0, `rgba(95,227,255,${(.26 + .35 * snap + .12 * sweep) * out})`); rg.addColorStop(1, 'rgba(95,227,255,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, hz, 0, TAU); ctx.fill(); ctx.restore();
    const lg = ctx.createLinearGradient(W / 2 - half, 0, W / 2 + half, 0), ca = x => `rgba(230,250,255,${x * out})`; lg.addColorStop(0, ca(0)); lg.addColorStop(.18, ca(.95)); lg.addColorStop(.82, ca(.95)); lg.addColorStop(1, ca(0));
    ctx.strokeStyle = lg; ctx.lineWidth = lerp(4.5, 2.4, crisp) * U * (1 + snap); ctx.beginPath(); ctx.moveTo(W / 2 - half, y); ctx.lineTo(W / 2 + half, y); ctx.stroke();
    ctx.restore();
    // its name at one end; the readout at the other while it sweeps
    ctx.save(); ctx.setTransform(U, 0, 0, U, W / 2 - half * .66, y - 36 * U); words(ctx, [['আজকের', TODAY], ['বিজ্ঞান', SCI]], t, 0, 0, P ? 30 : 34, .9 * out * grow, 'left', { weight: 600 }); ctx.restore();
    const ra = smooth((t - SW0 + .1) / .2) * out; if (ra > .004) {
      const dg = t < SW1 ? bn(Math.floor(hash(Math.floor(t * 22), 7) * 10)) : '০';
      ctx.save(); ctx.setTransform(U, 0, 0, U, W / 2 + half * .66, y - 36 * U); say(ctx, 'প্রমাণ', -44, 0, P ? 30 : 34, ra * .9, { weight: 600, align: 'right' }); say(ctx, dg, 0, 0, P ? 38 : 42, ra, { weight: 700, role: 'amber', align: 'right' }); ctx.restore();
    }
  }

  // ─── the claim: big hollow dashed words flying in out of the dark; the scan turns each to falling sparks ───
  const CLAIM = [['মৃত্যুর', DEATH], ['পর', AFTER], ['ব্যক্তিগত', PERS], ['চেতনা', MIND], ['টিকে', SURV], ['থাকে', STAYS]];
  const CROWS = P ? [[0, 1], [2, 3], [4, 5]] : [[0, 1, 2, 3], [4, 5]], CS = P ? 80 : 92, CROWY = P ? [-310, -200, -90] : [-235, -115];
  const hitT = y => { for (let i = 0; i <= 300; i++) { const t = SW0 + (SW1 - SW0) * i / 300; if (BY(t) <= y) return t; } return SW1; };
  let WORDS = null;   // laid out and sampled once the fonts are in
  function outline(c, s, size, a, flash) {   // a hollow dashed word (a claim), lit cyan by the scan as it passes
    c.save(); c.font = YV.fontOf(size, 700); c.textAlign = 'center'; c.textBaseline = 'middle';
    const col = flash > .01 ? `${Math.round(lerp(255, 190, flash))},${Math.round(lerp(214, 246, flash))},${Math.round(lerp(140, 255, flash))}` : '255,214,140';
    c.setLineDash([size * .2, size * .1]); c.lineWidth = size * .07; c.strokeStyle = `rgba(255,201,60,${.75 * a})`; c.shadowColor = `rgba(255,190,70,${.55 * a})`; c.shadowBlur = size * .2; c.strokeText(s, 0, 0);   // a dashed amber edge round it: a claim
    c.setLineDash([]); c.shadowBlur = 0; c.fillStyle = `rgba(${col},${.92 * a})`; c.fillText(s, 0, 0); c.restore();   // the letters themselves solid, so they read
  }
  function buildWords() {
    if (WORDS) return WORDS;
    const [mc, mx] = F.canvas(8, 8); WORDS = [];
    CROWS.forEach((row, ri) => {
      const ws = row.map(i => YV.measure(mx, CLAIM[i][0], CS, 700)), gap = CS * .34, tot = ws.reduce((p, q) => p + q, 0) + gap * (row.length - 1); let xx = -tot / 2;
      row.forEach((i, j) => {
        const s = CLAIM[i][0], wv = ws[j], [cv, cx] = F.canvas(Math.ceil(wv + CS), Math.ceil(CS * 1.8)); cx.translate(cv.width / 2, cv.height / 2); outline(cx, s, CS, 1, 0);
        const d = cx.getImageData(0, 0, cv.width, cv.height).data, pts = [];
        for (let y = 0; y < cv.height; y += 3) for (let x = 0; x < cv.width; x += 3) if (d[(y * cv.width + x) * 4 + 3] > 90) pts.push([x - cv.width / 2, y - cv.height / 2]);
        const keep = pts.filter((_, k) => hash(k, i * 7 + 3) < Math.min(1, 380 / pts.length));
        const y = CROWY[ri]; WORDS.push({ s, t0: CLAIM[i][1], x: xx + wv / 2, y, hit: hitT(y), pts: keep, k: i }); xx += wv + gap;
      });
    });
    return WORDS;
  }
  function drawClaim(ctx, v, t) {
    if (t < DEATH - .3 || t > SW1 + 2) return;
    for (const wd of buildWords()) {
      const u = t - wd.hit;
      if (u < 0) {   // flying in, then held; the scan's light on it as it comes
        const k = expo((t - wd.t0 + .12) / .8); if (k <= .004) continue;
        const z = 1000 + 3600 * (1 - k), fl = Math.exp(-Math.pow(u / .07, 2));
        D.plane(ctx, v, wd.x + (hash(wd.k, 11) - .5) * 500 * (1 - k), wd.y + (hash(wd.k, 12) - .5) * 300 * (1 - k), z, 400, 120, c => outline(c, wd.s, CS, smooth(k * 1.6), fl), { fog: .3, blurMul: .6 });
      } else {       // sparks, falling away into the dark
        const p = D.proj(v, wd.x, wd.y, 1000); if (!p) continue;
        const fl = Math.exp(-Math.pow(u / .09, 2)); if (fl > .02) D.plane(ctx, v, wd.x, wd.y, 1000, 400, 120, c => outline(c, wd.s, CS, fl, 1), { fog: 0, blurMul: 0 });
        const al = 1 - smooth((u - .25) / 1.2); if (al <= .01) continue;
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
        wd.pts.forEach(([px, py], j) => {
          const h1 = hash(j, wd.k + 21), h2 = hash(j, wd.k + 22), dx = (h1 - .5) * 110 * u, dy = (30 + 80 * h2) * u + 240 * u * u, tw = .55 + .45 * Math.sin(u * 14 + h1 * 30);
          ctx.globalAlpha = al * tw; ctx.fillStyle = h2 < .25 ? '#bff6ff' : '#ffc96a'; const r = Math.max(1, 2.2 * p.s) * (1 - .5 * u / 1.5);
          ctx.fillRect(p.x + (px + dx) * p.s - r, p.y + (py + dy) * p.s - r, 2 * r, 2 * r);
        });
        ctx.restore();
      }
    }
    // the verdict, where the claim was
    D.plane(ctx, v, 0, P ? -200 : -175, 1000, 500, 100, c => pill(c, ['প্রমাণ', 'নেই'], [PROOF, NONE], t, 0, 0, P ? 64 : 72, 1 - smooth((t - BUT - .25) / .5), true, badgeK(t, PROOF)), { fog: 0, blurMul: 0 });
  }

  // ─── the question: the light; "চেতনা কীভাবে জন্ম নেয়" flies in under it; a thousand sparks swirl into a "?" whose dot is the light ───
  const LT0 = BUT - .2, Q0 = QN - .35, QW = [['চেতনা', MIND2], ['কীভাবে', HOW], ['জন্ম', BIRTH], ['নেয়', TAKES]], QS = P ? 54 : 60;
  let QP = null;   // the "?" as points round its dot, built once the fonts are in
  function buildQ() {
    if (QP) return QP;
    const S = P ? 820 : 760, [c, x] = F.canvas(S, Math.ceil(S * 1.3)); x.font = YV.fontOf(S, 700); x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillStyle = '#fff'; x.fillText('?', S / 2, S * 1.05);
    const d = x.getImageData(0, 0, c.width, c.height).data, pts = [], st = 8;
    for (let yy = 0; yy < c.height; yy += st) for (let xx = 0; xx < c.width; xx += st) if (d[(yy * c.width + xx) * 4 + 3] > 128) pts.push([xx, yy]);
    const ys = [...new Set(pts.map(p => p[1]))].sort((a, b) => a - b); let gy = ys[ys.length - 1];
    for (let i = ys.length - 1; i > 0; i--) if (ys[i] - ys[i - 1] > st * 2) { gy = ys[i]; break; }   // the dot starts after the last gap
    const dot = pts.filter(p => p[1] >= gy), body = pts.filter(p => p[1] < gy);
    const cx = dot.reduce((s, p) => s + p[0], 0) / Math.max(1, dot.length), cy = dot.reduce((s, p) => s + p[1], 0) / Math.max(1, dot.length);
    QP = body.map(([px, py], i) => { const a0 = hash(i, 401) * TAU, r0 = 700 + 900 * hash(i, 402); return { x: px - cx + (hash(i, 403) - .5) * 4, y: py - cy + (hash(i, 404) - .5) * 4, sx: Math.cos(a0) * r0, sy: Math.sin(a0) * r0 * .7, sz: (hash(i, 405) - .5) * 900, dl: .5 * hash(i, 406), ph: hash(i, 407) * 9 }; });
    return QP;
  }
  function drawQuestion(ctx, v, t) {
    if (t < LT0 - .3) return;
    const fk = foldK(t);
    // the sparks: dim dust round the light at first, swirling into the "?" on "প্রশ্নের"; into the light when it all folds
    const Q = buildQ(), dim = smooth((t - LT0) / .8);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    Q.forEach((q, i) => {
      const e = easeIO(clamp((t - Q0 - q.dl) / 1.4)), sw = (1 - e) * 2.2 + .15 * t, cs = Math.cos(sw), sn = Math.sin(sw), ox = q.sx - q.x, oy = q.sy - q.y;
      let x = q.x + (ox * cs - oy * sn) * (1 - e), y = q.y + (ox * sn + oy * cs) * (1 - e), z = q.sz * (1 - e);
      x += 3 * Math.sin(t * 2 + q.ph) * e; y += 3 * Math.cos(t * 1.7 + q.ph) * e;
      const f = easeIn(clamp((fk - q.dl * .6) / .7), 1.5); x *= 1 - f; y *= 1 - f; z *= 1 - f;
      const p = D.proj(v, LV[0] + x, LV[1] + y, LV[2] + z); if (!p || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) return;
      const al = dim * lerp(.28, .9, e) * (.7 + .3 * Math.sin(t * 3 + q.ph)) * (1 - f * .6), r = Math.max(1.2 * U, 4.2 * p.s);
      if (i % 9 === 0) YD.spark(ctx, p.x, p.y, r * .9, D.coc(v, p.d), al); else { ctx.globalAlpha = al; ctx.fillStyle = i % 5 ? '#bff4ff' : '#ffd79a'; ctx.fillRect(p.x - r, p.y - r, 2 * r, 2 * r); }
    });
    ctx.restore();
    // the light: the dot of the question
    const lp = D.proj(v, ...LV), g = easeOutBack(clamp((t - LT0) / .9), 1.4);
    if (lp && g > .004) { const r = lerp(14, 4, fk) * lp.s, k = Math.min(1.5, g * (1 + .3 * smooth((t - Q0 - 1) / .6) + .15 * fk)); YD.rays(ctx, lp.x, lp.y, r, .4 * Math.min(1, g) * (1 - fk), t * .5); YD.light(ctx, lp.x, lp.y, r, k); }
    // its words, flying in from the dark to sit under it; the badge under them; all of it into the light as it folds
    const out = 1 - smooth(fk / .6);
    if (out > .004) {
      const gap = QS * .3, ws = QW.map(([s]) => YV.measure(ctx, s, QS, 600)), tot = ws.reduce((p, q) => p + q, 0) + gap * (QW.length - 1); let xx = -tot / 2;
      QW.forEach(([s, t0], i) => {
        const k = expo((t - t0 + .1) / .75), wx = xx + ws[i] / 2, sx = (hash(i, 501) - .5) * 1800, sy = (hash(i, 502) - .5) * 1000; xx += ws[i] + gap; if (k <= .004) return;
        D.plane(ctx, v, LV[0] + lerp(sx, wx, k) * (1 - fk), LV[1] + lerp(sy, 150, k) * (1 - fk), LV[2] + 2600 * (1 - k), 300, 80, c => say(c, s, 0, 0, QS, smooth(k * 1.5) * out, { weight: 600 }), { fog: .3, blurMul: .6 });
      });
      D.plane(ctx, v, LV[0], LV[1] + 250 * (1 - fk), LV[2], 500, 80, c => pill(c, ['উত্তর', 'জানা', 'হয়নি'], [ANSWER, KNOWN, NOTYET], t, 0, 0, P ? 44 : 48, out, true, badgeK(t, ANSWER)), { fog: 0, blurMul: 0 });
    }
  }
  function drawVoid(ctx, t) {
    const v = camV(t);
    YD.bg(ctx, v); drawMotes(ctx, v, t); YD.post(ctx);
    drawFork(ctx, t);                                                            // scene 08's frame has its own bloom: it goes on after
    drawBeam(ctx, v, t);
    drawClaim(ctx, v, t);
    drawQuestion(ctx, v, t);
  }

  // ═══ the light, and the pull-back from it: scene 01's opening reversed. The brain of lights is scene 01's own (the same
  // outline, seed and counts), the light its nearest neuron to the middle; then its network stretches out into the web
  // of galaxies (a visual rhyme only), and the one light is left in front of it ═══
  const inside = (pts, x, y) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const BS = 470, BRL = F.sci.brain(BS, 0, 0);
  const CLOUD = (() => {   // as scene 01 built it
    const r = rng(5), nodes = [], stemPoly = [...BRL.stem[0].pts, ...BRL.stem[1].pts.slice().reverse()];
    const fill = (poly, n, thick, kind) => {
      const b = F.bounds(poly); let k = 0, guard = 0;
      while (k < n && guard++ < n * 60) {
        const x = b.x0 + r() * b.w, y = b.y0 + r() * b.h; if (!inside(poly, x, y)) continue;
        const nx = (x - b.cx) / (b.w / 2), ny = (y - b.cy) / (b.h / 2), z = (r() * 2 - 1) * thick * Math.sqrt(Math.max(.05, 1 - (nx * nx + ny * ny) * .6));
        nodes.push({ x, y, z, kind, size: .7 + r() * .8, tw: r() * 10 }); k++;
      }
    };
    fill(BRL.outline.pts, 780, 230, 0); fill(BRL.cerebellum.pts, 110, 110, 1); fill(stemPoly, 45, 50, 2);
    let li = 0, best = Infinity; nodes.forEach((n, i) => { const d = Math.hypot(n.x - BRL.centre[0], n.y - BRL.centre[1]); if (n.kind === 0 && d < best) { best = d; li = i; } });
    nodes[li].z = -70;
    const edges = [];
    nodes.forEach((a, i) => nodes.map((q, j) => [j, Math.hypot(a.x - q.x, a.y - q.y, a.z - q.z)]).filter(([j, d]) => j > i && d < 95).sort((p, q) => p[1] - q[1]).slice(0, 2).forEach(([j]) => edges.push([i, j])));
    return { nodes, edges, li };
  })();
  const LP = CLOUD.nodes[CLOUD.li];
  // the web of galaxies: clusters joined by filaments, galaxies strung along them, clumps at the clusters
  const WEB = (() => {
    const r = rng(909), K = P ? 30 : 34, cl = [];
    for (let i = 0; i < K; i++) cl.push([(r() - .5) * (P ? 15000 : 24000), -9000 + r() * 11000, 6000 + r() * 16000]);
    const fil = [], seen = new Set();
    cl.forEach((a, i) => cl.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1], (a[2] - b[2]) * .5)]).filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]).slice(0, 3).forEach(([j]) => { const key = Math.min(i, j) + ',' + Math.max(i, j); if (!seen.has(key)) { seen.add(key); fil.push([i, j]); } }));
    const gal = [], edges = [];
    for (const [i, j] of fil) {
      const a = cl[i], b = cl[j], n = Math.round(clamp(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 650, 6, 22)); let prev = -1;
      for (let k = 1; k < n; k++) { const u = k / n, jit = 380 * (.4 + Math.sin(Math.PI * u)); gal.push({ x: lerp(a[0], b[0], u) + (r() - .5) * jit, y: lerp(a[1], b[1], u) + (r() - .5) * jit, z: lerp(a[2], b[2], u) + (r() - .5) * jit, size: .5 + r() * .6, tw: r() * 10 }); const id = gal.length - 1; if (prev >= 0) edges.push([prev, id]); prev = id; }
    }
    cl.forEach(c0 => { for (let k = 0; k < 12; k++) gal.push({ x: c0[0] + (r() - .5) * 1000, y: c0[1] + (r() - .5) * 1000, z: c0[2] + (r() - .5) * 1000, size: .8 + r() * .9, tw: r() * 10, core: true }); });
    const cx = cl.reduce((s, c0) => s + c0[0], 0) / K, cy = cl.reduce((s, c0) => s + c0[1], 0) / K;
    return { gal, edges, cx, cy };
  })();
  // each neuron of the brain goes to a galaxy at the same bearing, so the network opens outward
  const PAIR = (() => {
    const N = CLOUD.nodes, G = WEB.gal, map = new Map(), used = new Set();
    const bi = N.map((n, i) => [i, Math.atan2(n.y - BRL.centre[1], n.x - BRL.centre[0])]).filter(([i]) => i !== CLOUD.li).sort((p, q) => p[1] - q[1]).map(([i]) => i);
    const gi = G.map((g, i) => [i, Math.atan2(g.y - WEB.cy, g.x - WEB.cx)]).sort((p, q) => p[1] - q[1]).map(([i]) => i);
    bi.forEach((b, k) => { const g = gi[Math.floor(k * gi.length / bi.length)]; map.set(b, g); used.add(g); });
    return { map, extra: gi.filter(g => !used.has(g)) };
  })();
  const PB0 = FOLD1 - .12, PB1 = PB0 + 1.35, MOR0 = PB1 - .1, MOR1 = MOR0 + 3.4, END1 = MOR0 + 4.2;
  function camU(t) {
    const e = easeOut(clamp((t - PB0) / (PB1 - PB0)), 3), d1 = P ? 1500 : 1000, dz = 40 * Math.pow(d1 / 40, e);   // the distance grows by the same factor each moment
    let x = lerp(LP.x, LP.x * .6, smooth(e)), y = lerp(LP.y, LP.y * .6 + 10, smooth(e)), z = LP.z - dz;   // the light stays near the middle; the brain opens round it
    const f = easeIO((t - MOR0) / (END1 - MOR0));   // on back and a little up, as the web opens: the light ends small, low in the frame, facing it all
    x = lerp(x, LP.x, f) + (P ? 25 : 60) * Math.sin((t - MOR0) * .22) * f; y = lerp(y, LP.y - (P ? 560 : 400), f); z = lerp(z, LP.z - (P ? 2600 : 2000), f);
    const focus = lerp(LP.z - z, 9000, smooth((t - MOR0 - .6) / 2.5));
    return D.view({ x, y, z, focus: Math.max(30, focus), aperture: lerp(34, 10, f), maxBlur: 30, fogNear: 30000, fogFar: 60000 }, W, H);
  }
  const STARS = Array.from({ length: 420 }, (_, i) => ({ x: hash(i, 301), y: hash(i, 302), r: .5 + 1.3 * hash(i, 303) * hash(i, 304), ph: hash(i, 305) * 9 }));
  function drawUniverse(ctx, t) {
    const v = camU(t), mk = smooth((t - MOR0) / 2.5);
    YD.bg(ctx, v);
    if (mk > 0) {   // the dark of space comes in, and far stars
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = mk; const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#020409'); g.addColorStop(1, '#050b16'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#dfe8ff'; for (const s of STARS) { ctx.globalAlpha = mk * (.25 + .35 * Math.abs(Math.sin(t * .6 + s.ph))); ctx.fillRect(s.x * W, s.y * H, s.r * U, s.r * U); } ctx.restore();
    }
    // the network: the brain's neurons, stretching out to their galaxies
    const N = CLOUD.nodes, G = WEB.gal, m0 = t - MOR0, pos = new Array(N.length), mm = new Array(N.length);
    N.forEach((n, i) => { if (i === CLOUD.li) return; const g = G[PAIR.map.get(i)], d = Math.hypot(n.x - BRL.centre[0], n.y - BRL.centre[1]) / 520, m = easeIO(clamp((m0 - .6 * d) / 2.6)); mm[i] = m; pos[i] = D.proj(v, lerp(n.x, g.x, m), lerp(n.y, g.y, m), lerp(n.z, g.z, m)); });
    const nin = smooth((t - FOLD1) / .35);   // the brain's lights come up round the light as we back out of it
    const lum = N.map((n, i) => i === CLOUD.li || !pos[i] ? 0 : nin * (.6 + .4 * noise1(t * 1.4 + n.tw, 2)) * lerp(1, .85 + .5 * Math.abs(Math.sin(t * .9 + n.tw)), mm[i]));
    const list = [], ba = 1 - smooth((t - MOR0) / 1.1);
    if (ba > 0) for (const [a, b] of CLOUD.edges) { const p = pos[a], q = pos[b]; if (!p || !q) continue; const al = Math.min(lum[a], lum[b]) * .7 * ba / (1 + D.coc(v, (p.d + q.d) / 2) / 4); if (al > .03) list.push([p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2, q.x, q.y, Math.min(1, al)]); }
    const wa = smooth((t - MOR0 - 1.4) / 1.6);
    if (wa > 0) for (const [a, b] of WEB.edges) { const p = D.proj(v, G[a].x, G[a].y, G[a].z), q = D.proj(v, G[b].x, G[b].y, G[b].z); if (p && q) list.push([p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2, q.x, q.y, .45 * wa]); }
    YD.edges(ctx, list, 1.2 * U);
    N.forEach((n, i) => { const p = pos[i]; if (!p || lum[i] < .01 || p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) return; const rr = Math.max(1.1 * U, lerp(3.6, 50, mm[i]) * n.size * p.s); YD.node(ctx, i, p.x, p.y, rr, D.coc(v, p.d), Math.min(1.3, lum[i])); });
    const xa = smooth((t - MOR0 - 1.2) / 1.8);   // the rest of the galaxies
    if (xa > 0) for (const gi of PAIR.extra) { const g = G[gi], p = D.proj(v, g.x, g.y, g.z); if (!p || p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) continue; YD.node(ctx, gi, p.x, p.y, Math.max(1.1 * U, 50 * g.size * p.s), D.coc(v, p.d), xa * (g.core ? 1.1 : .7) * (.7 + .3 * Math.sin(t * .8 + g.tw))); }
    // the light, in front of it all
    const lp = D.proj(v, LP.x, LP.y, LP.z);
    if (lp) { const r = Math.max(5 * U, 4 * lp.s), k = smooth((t - (FOLD1 - .25)) / .3) * (1 + .5 * Math.exp(-Math.max(0, t - FOLD1) * 3)); YD.rays(ctx, lp.x, lp.y, r, .45 * smooth((t - MOR0 - .5) / 2), t * .5); YD.light(ctx, lp.x, lp.y, r, Math.min(1.6, k)); }
    YD.post(ctx);
    // "আমরা এখনো জানি না।" under the light, and it holds
    if (lp && t > WE - .3) { ctx.save(); ctx.setTransform(U, 0, 0, U, lp.x, lp.y + (P ? 120 : 110) * U); words(ctx, [['আমরা', WE], ['এখনো', STILL], ['জানি', KNOW], ['না।', NO]], t, 0, 0, P ? 58 : 62, 1, 'center', { weight: 600 }); ctx.restore(); }
    return lp;
  }

  function drawScene(ctx, t) {
    if (t < FOLD1) drawVoid(ctx, t);   // the dive into the light ends where the pull-back from it begins (88 units away)
    else drawUniverse(ctx, t);
  }

  // ─── sound effects, about 10 dB under the voice (as scenes 06–08) ───
  const LEVEL = .48;
  const airy = (t0, g = .09) => ({ t: t0, type: 'air', dur: .6, f0: 900, f1: 1600, g });
  const SFX = [
    { t: .05, type: 'swoosh', dur: RISE, f0: 250, f1: 900, peak: .55, g: .16 }, { t: .1, type: 'drone', dur: FOLD1, f: 50, g: .14 },              // up out of the fork; a low bed
    { t: BEAM0, type: 'trace', dur: BEAM1 - BEAM0, g: .14 }, { t: BEAM0, type: 'air', dur: 1, f0: 600, f1: 1500, g: .1 },                         // the scan draws itself across
    { t: CLEAR, type: 'bloom', dur: .7, f: 440, g: .1 }, { t: CLEAR, type: 'tap', g: .1 },                                                          // "পরিষ্কার": it snaps sharp
    ...CLAIM.map(([, t0]) => ({ t: t0 - .12, type: 'whoosh', dur: .55, f0: 300, f1: 1200, g: .07 })),                                              // the claim flies in, word by word
    { t: SW0, type: 'scan', dur: SW1 - SW0, n: 3, g: .16 }, ...Array.from({ length: 16 }, (_, i) => ({ t: SW0 + i * (SW1 - SW0) / 16, type: 'tick', g: .05 })),   // the sweep, the readout searching
    { t: SW0 + .15, type: 'crackle', dur: 1.4, rate: 14, g: .08 }, { t: SW0 + .3, type: 'swoosh', dur: 1.4, f0: 900, f1: 180, peak: .3, g: .1 },  // the words fall away in sparks
    { t: PROOF, type: 'stampSmall', g: .28 }, { t: PROOF, type: 'tap', g: .1 }, { t: NONE, type: 'stampSmall', g: .26 },                          // "প্রমাণ নেই"
    { t: LT0, type: 'bloom', dur: 1.6, f: 330, g: .16 }, ...QW.map(([, t0]) => ({ t: t0 - .1, type: 'whoosh', dur: .5, f0: 400, f1: 1300, g: .06 })),   // the light; its words fly in
    { t: Q0, type: 'shimmer', dur: 1.8, g: .14 }, { t: Q0, type: 'riser', dur: 1.4, f0: 250, f1: 1600, g: .1 }, { t: Q0 + 1.45, type: 'bloom', dur: 1.4, f: 392, g: .12 },   // the sparks swirl into the "?"
    { t: ANSWER, type: 'stampSmall', g: .24 }, { t: KNOWN, type: 'tap', g: .1 }, { t: NOTYET, type: 'stampSmall', g: .24 },                       // "উত্তর জানা হয়নি"
    { t: FOLD0, type: 'swoosh', dur: FOLD1 - FOLD0 + .1, f0: 400, f1: 1300, peak: .9, g: .16 }, { t: FOLD0 + .1, type: 'riser', dur: FOLD1 - FOLD0 - .1, f0: 300, f1: 2400, g: .14 },   // they fold into the light
    { t: FOLD1, type: 'bloom', dur: 2.4, f: 330, g: .24 }, { t: FOLD1, type: 'impact', size: .35, f: 58, g: .16 },
    { t: PB0, type: 'swoosh', dur: 1.6, f0: 1300, f1: 250, peak: .25, g: .18 },                                                                     // the pull-back from it
    { t: MOR0, type: 'shimmer', dur: 3.2, g: .12 }, { t: MOR0 + .2, type: 'spark', dur: 3, rate: 5, fade: true, g: .08 }, { t: MOR0, type: 'bloom', dur: 4.5, f: 196, g: .14 },   // the network opens into the galaxies
    { t: MOR0 + 1, type: 'drone', dur: DUR - MOR0 - 1, f: 41, g: .18 },                                                                            // the dark of space, to the end
    airy(WE, .07), { t: NO, type: 'bloom', dur: 3, f: 262, g: .12 },                                                                              // "আমরা এখনো জানি না।"
  ].map(c => ({ ...c, g: c.g * LEVEL }));

  const fontsReady = Promise.race([
    Promise.all(['Hind Siliguri', 'Noto Serif Bengali'].flatMap(f => [500, 600, 700].map(wt => document.fonts.load(`${wt} 60px "${f}"`, 'যা জানি না আমরা এখনো প্রমাণ নেই চেতনা')))),
    new Promise(r => setTimeout(r, 5000)),
  ]).then(() => { buildWords(); buildQ(); });   // the claim's sparks and the "?" are sampled from the real letters
  const label_ = t => { let s = ''; for (const x of T.words) if (x[1] <= t + 1e-6) s = x[0]; return s; };
  F.scene(ID, { W, H, duration: DUR, draw: (ctx, t) => { D.frameStart(); drawScene(ctx, t); }, ready: Promise.all([fontsReady, S8 && S8.ready]), label: label_, sfx: SFX, grain: 'frame' });
})();
