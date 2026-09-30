// Scene 03 · Physics and experience (0:52.283–1:13.250 of voice/Death.mp3), plan v2: a split screen, ঙ vector for
// the physics (side A: left, or top in 4:5) and ঘ cinematic for the experience (side B: right, or bottom). Red light
// enters an eye and leaves it as plain grey spikes; where they reach the dividing line, red blooms like ink in water.
// Pain: a clean oscilloscope trace, then its glass cracks and a red crack races through the other side. The halves
// slide apart into a canyon; the questions fall in; from its floor rises a violet interference shimmer.
(function () {
  'use strict';
  const F = FILM, D = F.depth, { clamp, smooth, easeIO, easeOut, easeIn, lerp, env, noise1, hash, rng, TAU } = F;
  const ID = 'scene-03', T = window.TIMING[ID], DUR = T.duration;
  const { W, H, portrait: P } = F.format(), U = Math.min(W, H) / 1080;
  const YD = F.style25('depth', W, H), YV = F.style25('vector', W, H);
  const norm = s => s.normalize('NFC').replace(/[।,?!—'"()\s]/g, '');
  const w = (word, n = 1) => { let k = 0; for (const x of T.words) if (norm(x[0]) === norm(word) && ++k === n) return x[1]; throw new Error(`${ID}: no word "${word}" (${n})`); };
  const WAVE = w('আলোর'), RED = w('লাল', 2), PAIN = w('ব্যথা'), NERVE = w('স্নায়ুর'), HURT = w('ব্যক্তিগত'), Q = w('এই'), DONT = w('জানে'), GAP = w('অজানা'), QUANT = w('কোয়ান্টাম');
  const glow = (c, x, y, r, col, a) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, F.rgba(F.hex(col), a)); g.addColorStop(1, F.rgba(F.hex(col), 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const add = (ctx, f) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; f(); ctx.restore(); };

  // ─── the split: side A (physics) and side B (experience); in 4:5 the split turns so A is on top ───
  // Side A has its own units: a 1000 × 800 box with the dividing line at x = +500. In 4:5 the box is turned a quarter
  // so that line lies along the bottom of the top half.
  const SLIDE0 = Q + .1, SLIDE1 = GAP + 1.2;
  // the director (2026-09-29): on "ব্যথা কেন" side A fills the whole frame; on "ব্যক্তিগত যন্ত্রণা" it slides back to
  // its half and side B comes in. splitK: 1 = split, 0 = side A alone
  const splitK = t => t < PAIN ? 1 : t < HURT - .25 ? 1 - easeIO(clamp((t - PAIN) / .6)) : easeIO(clamp((t - HURT + .25) / .6));
  const apart = t => easeIO(clamp((t - SLIDE0) / (SLIDE1 - SLIDE0)));   // how far the halves have slid apart (0..1)
  const shift = t => apart(t) * (P ? H * .5 : W * .5) * 1.02;
  const lenA = t => (P ? H : W) * (1 - .5 * splitK(t));                 // how much of the frame side A takes
  const scAt = t => P ? Math.min(W / 800, lenA(t) / 1000) * .92 : Math.min(lenA(t) / 1000, H / 800) * .9;
  let scA = scAt(0);
  function setA(ctx, t) {
    const s = shift(t), c = lenA(t) / 2; scA = scAt(t);
    if (P) ctx.setTransform(0, scA, -scA, 0, W / 2, c - s); else ctx.setTransform(scA, 0, 0, scA, c - s, H / 2);
  }
  const toA = (x, y, t) => { const s = shift(t), c = lenA(t) / 2, k = scAt(t); return P ? [W / 2 - y * k, c - s + x * k] : [c - s + x * k, H / 2 + y * k]; };
  const rectB = t => { const s = shift(t), a = lenA(t); return P ? [0, a + s, W, H - a] : [a + s, 0, W - a, H]; };
  const rectA = t => { const s = shift(t), a = lenA(t); return P ? [0, -s, W, a] : [-s, 0, a, H]; };
  const clipRect = (ctx, r) => { ctx.beginPath(); ctx.rect(r[0], r[1], r[2], r[3]); ctx.clip(); };

  // ─── A · the physics of red: a light wave, an eye, grey spikes along the optic nerve ───
  const EYE = [70, 0], NERVE_PTS = [[215, 25], [300, 50], [400, 58], [500, 60]];
  const SPIKES = Array.from({ length: 11 }, (_, i) => RED - 1.05 + i * .33);   // leaving the retina; the first reaches the line on "লাল অনুভব"
  const spikeAt = (t0, t) => { const u = (t - t0) / 1.05; return u < 0 || u > 1 ? null : u; };
  const onNerve = u => { const L = NERVE_PTS.length - 1, s = u * L, i = Math.min(L - 1, Math.floor(s)), f = s - i, a = NERVE_PTS[i], b = NERVE_PTS[i + 1]; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; };
  function drawEye(ctx, t, a) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    // the wave, travelling in from the far side
    const front = lerp(-470, EYE[0] - 150, easeOut(clamp((t - WAVE + .9) / 1.6), 2));
    ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.strokeStyle = '#ff4d5e'; ctx.shadowColor = 'rgba(255,77,94,.6)'; ctx.shadowBlur = 14 * scA;
    ctx.beginPath(); for (let x = -470; x <= front; x += 4) { const y = 42 * Math.sin((x - t * 260) / 90 * TAU / 2.2); x === -470 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.shadowColor = 'transparent';
    // the eye in cross-section: sclera, cornea, iris, lens, retina, and the optic nerve leaving it
    ctx.fillStyle = '#b7aaf0'; ctx.beginPath(); ctx.arc(EYE[0], EYE[1], 158, 0, TAU); ctx.fill();                                                     // sclera
    ctx.fillStyle = '#3a2a86'; ctx.beginPath(); ctx.arc(EYE[0], EYE[1], 138, 0, TAU); ctx.fill();                                                     // the dark inside of the eye
    ctx.strokeStyle = '#bfe9ff'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(EYE[0] - 108, EYE[1], 72, -1.05, 1.05); ctx.stroke();                 // cornea
    ctx.fillStyle = '#ff9f43'; ctx.fillRect(EYE[0] - 126, EYE[1] - 74, 14, 46); ctx.fillRect(EYE[0] - 126, EYE[1] + 28, 14, 46);                  // iris, the pupil open between
    ctx.fillStyle = '#bfe9ff'; ctx.beginPath(); ctx.ellipse(EYE[0] - 88, EYE[1], 24, 52, 0, 0, TAU); ctx.fill();                                   // lens
    ctx.strokeStyle = '#3ff0d0'; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(EYE[0], EYE[1], 128, -1.1, 1.1); ctx.stroke();                          // retina
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 26; ctx.lineJoin = 'round'; ctx.beginPath(); NERVE_PTS.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();   // optic nerve
    // the light focused through the lens onto the retina
    const lit = smooth((t - WAVE - .5) / .4);
    if (lit > 0) { ctx.globalAlpha = a * lit; ctx.strokeStyle = 'rgba(255,77,94,.85)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(EYE[0] - 150, -40); ctx.lineTo(EYE[0] - 88, -30); ctx.lineTo(EYE[0] + 126, 12); ctx.moveTo(EYE[0] - 150, 40); ctx.lineTo(EYE[0] - 88, 30); ctx.lineTo(EYE[0] + 126, 12); ctx.stroke(); ctx.fillStyle = '#ff4d5e'; ctx.beginPath(); ctx.arc(EYE[0] + 126, 12, 9, 0, TAU); ctx.fill(); ctx.globalAlpha = a; }
    // the signal: plain grey spikes, nothing red in them
    for (const t0 of SPIKES) { const u = spikeAt(t0, t); if (u === null) continue; const [x, y] = onNerve(u); ctx.strokeStyle = '#4b4f63'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 10, y + 16); ctx.lineTo(x, y - 30); ctx.lineTo(x + 10, y + 16); ctx.stroke(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y - 30, 5, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // ─── B · the experience of red: ink blooming in dark water from where the signal meets the line ───
  // plumes of ink curling out into the water: each a chain of soft puffs that widen as they go
  const PLUMES = Array.from({ length: 16 }, (_, i) => ({ th: (hash(i, 1) - .5) * 2.3, len: 450 + hash(i, 2) * 750, curl: (hash(i, 3) - .5) * 5, del: hash(i, 4) * .9, r0: 22 + hash(i, 5) * 30, ph: hash(i, 6) * 10, c: ['#b3001b', '#e0162b', '#8a0014', '#ff2d3f'][i % 4] }));
  function drawInk(ctx, t) {
    const k0 = t - RED; if (k0 <= 0) return;
    const drain = smooth((t - PAIN) / .9); if (drain >= 1) return;
    const [ox, oy] = toA(500, 60, t), dir = P ? [0, 1] : [1, 0], perp = [-dir[1], dir[0]];
    ctx.save(); ctx.globalAlpha = 1 - drain;
    for (const b of PLUMES) {
      const k = easeOut(clamp((k0 - b.del) / 2.8), 2); if (k <= 0) continue;
      for (let j = 0; j <= 12; j++) {
        const u = j / 12 * k, along = u * b.len, side = Math.tan(b.th) * along * .5 + Math.sin(u * 4 + b.curl) * along * .22 + 40 * noise1(t * .5 + b.ph + j * .3, 7) * u;
        const x = ox + (dir[0] * along + perp[0] * side) * U, y = oy + (dir[1] * along + perp[1] * side) * U;
        glow(ctx, x, y, b.r0 * (1 + 5.5 * u) * U, b.c, .3 * (1 - .45 * u / Math.max(k, .01)));
      }
    }
    const flood = smooth((k0 - 1.2) / 1.2);   // and in the end the whole side is red
    if (flood > 0) { const r = rectB(t); ctx.globalAlpha = (1 - drain) * .8 * flood; ctx.fillStyle = '#6d0012'; ctx.fillRect(r[0], r[1], r[2], r[3]); }
    ctx.restore();
  }

  // ─── B · a person in pain (director, 2026-09-29: "on the right, a character holding their head in pain"; of a stick
  // figure and a figure with no face he chose the one with no face). Front view, in figure units: the feet at 0, the head's top near −100, y up is negative. Idle until the red crack reaches the head;
  // then the head is knocked back, the hands fly up to it on arcs (overshooting a touch), the body folds forward and
  // the knees give a little (hips first, the head after, the hands last); it rocks and trembles while the pain lasts ---
  const HIT = HURT + .85;   // the crack's tip reaches the head
  const figPlace = t => { const s = shift(t); return P ? { x: W * .62, y: H * .965 + s, k: H * .42 / 100 } : { x: W * .78 + s, y: H * .87, k: H * .56 / 100 }; };
  const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
  const add2 = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
  function limb(a, b, la, lb, out) {   // two bones from a to b; the joint bends toward side `out` (−1 left, +1 right)
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.min(Math.hypot(dx, dy), la + lb - .01), base = Math.atan2(dy, dx);
    const off = Math.acos(clamp((la * la + d * d - lb * lb) / (2 * la * d), -1, 1));
    const e1 = [a[0] + Math.cos(base + off) * la, a[1] + Math.sin(base + off) * la], e2 = [a[0] + Math.cos(base - off) * la, a[1] + Math.sin(base - off) * la];
    return (e1[0] - e2[0]) * out > 0 ? e1 : e2;
  }
  function figPose(t) {
    const u = t - HIT, on = u > 0, breathe = Math.sin(t * 2.2);
    const kick = on ? (u < .07 ? u / .07 : Math.exp(-(u - .07) * 7)) : 0;              // the blow: fast out, slow back
    const fold = on ? easeIO(clamp((u - .06) / .5)) : 0;                                 // the hips lead the fold
    const give = on ? easeOut(clamp((u - .1) / .45), 2) : 0;                              // the knees give
    const hands = on ? F.easeOutBack(clamp((u - .1) / .36), 1.3) : 0;                    // the hands arrive last
    const rock = on ? smooth((u - .45) / .6) : 0, ph = (u - .45) * TAU / 1.5;
    const trem = on ? (noise1(t * 9, 3) - .5) * smooth(u / .3) : 0;
    const lean = .07 * rock * Math.sin(ph) + .012 * trem - .03 * (1 - fold) * Math.sin(t * .7);   // swaying; at rest the weight drifts a little
    const hip = [2 * Math.sin(lean) * 10, -47 + 5 * give + .25 * breathe];              // standing legs nearly straight
    const up = [Math.sin(lean), -Math.cos(lean)], side = [Math.cos(lean), Math.sin(lean)];
    const chest = add2(hip, up, 31 * (1 - .28 * fold) + .5 * breathe * (1 - fold));     // folding toward us shortens the torso
    const hunch = 2.4 * fold + .4 * trem;                                                 // the shoulders rise toward the ears
    const shL = add2(add2(chest, side, -10.5), up, hunch), shR = add2(add2(chest, side, 10.5), up, hunch);
    const roll = lean * 1.6 + .2 * rock * Math.sin(ph + .7) + .22 * kick + .03 * trem;   // the head tilts after the body
    const neck = add2(chest, up, 4.5 * (1 - .7 * fold));
    const head = add2(add2(neck, rot([0, -8.6], roll), 1), [0, -2.4 * kick + 1.6 * fold]);
    const R = 8.6;
    // the hands: at the sides when calm; on the temples in pain, travelling on an outward arc
    const spot = (s) => add2(head, rot([s * (R + 1.3), -1.2], roll)), rest = (s, sh) => [sh[0] + s * 3.5, sh[1] + 28.5];   // hanging, a little bent
    const hand = (s, sh) => { const k = hands, a = rest(s, sh), b = spot(s), m = [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]; return [m[0] + s * 9 * Math.sin(Math.PI * clamp(k)) + .5 * trem, m[1] + .4 * trem]; };
    const hL = hand(-1, shL), hR = hand(1, shR);
    // the elbows: hanging, bent a little outward; in pain out to the sides just above the shoulders (seen from the front the
    // forearms come toward us, so the elbow is placed, not solved: a plain 2D solve threw it up over the head)
    const elbow = (s, sh) => { const a = limb(sh, rest(s, sh), 15.5, 14.5, s), b = add2(sh, rot([s * 8.8, -3.5], lean)), k = clamp(hands); return [lerp(a[0], b[0], k) + s * 3 * Math.sin(Math.PI * k), lerp(a[1], b[1], k)]; };
    const elL = elbow(-1, shL), elR = elbow(1, shR);
    const hipL = add2(hip, side, -5), hipR = add2(hip, side, 5), ftL = [-8.5, 0], ftR = [8.5, 0];
    const knee = (h, f, s) => [(h[0] + f[0]) / 2 + s * (1 + 2.6 * give), (h[1] + f[1]) / 2];   // a bent knee comes toward us: shown as a small outward kink
    return { hip, chest, neck, head, R, roll, shL, shR, elL, elR, hL, hR, hipL, hipR, knL: knee(hipL, ftL, -1), knR: knee(hipR, ftR, 1), ftL, ftR };
  }
  function drawFigure(ctx, t) {
    if (t < HURT - .3 || t > SLIDE1) return;
    const J = figPose(t), pl = figPlace(t), S = p => [pl.x + p[0] * pl.k, pl.y + p[1] * pl.k], k = pl.k;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // a soft pool of shadow under the feet
    const g = ctx.createRadialGradient(pl.x, pl.y, 0, pl.x, pl.y, 30 * k); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.translate(pl.x, pl.y); ctx.scale(1, .16); ctx.translate(-pl.x, -pl.y); ctx.fillStyle = g; ctx.fillRect(pl.x - 30 * k, pl.y - 30 * k, 60 * k, 60 * k); ctx.restore();
    // a figure with no face: soft solid limbs, lit from behind on the left by the red of the crack
    const cap = (a, b, w, col) => { const p = S(a), q = S(b); ctx.strokeStyle = col; ctx.lineWidth = w * k; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); };
    const torso = (col) => { ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 3 * k; ctx.beginPath(); [J.shL, J.shR, add2(J.hip, [7, 1]), add2(J.hip, [-7, 1])].map(S).forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill(); ctx.stroke(); };
    const headShape = (col) => { const p = S(J.head); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(p[0], p[1], 7.8 * k, 9.3 * k, J.roll, 0, TAU); ctx.fill(); };
    const body = col => { cap(J.hipL, J.knL, 7, col); cap(J.knL, J.ftL, 6.4, col); cap(J.hipR, J.knR, 7, col); cap(J.knR, J.ftR, 6.4, col); torso(col); cap(J.chest, J.neck, 4.6, col); headShape(col); };
    const arms = col => { for (const [sh, el, h] of [[J.shL, J.elL, J.hL], [J.shR, J.elR, J.hR]]) { cap(sh, el, 5.4, col); cap(el, h, 4.8, col); const p = S(h); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(p[0], p[1], 3.2 * k, 3.8 * k, 0, 0, TAU); ctx.fill(); } };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const rim = (f, dx, dy, col) => { ctx.save(); ctx.translate(dx * k, dy * k); f(col); ctx.restore(); };
    const flick = .75 + .25 * noise1(t * 18, 5), warm = `rgba(255,110,70,${(.55 + .35 * smooth((t - HIT) / .2)) * flick})`;
    rim(body, -.6, -.45, warm); rim(body, .5, -.15, 'rgba(120,220,255,.35)'); body('#071419');       // the body, its rims
    rim(arms, -.55, -.45, warm); rim(arms, .45, -.15, 'rgba(120,220,255,.35)'); arms('#0c1e24');       // the arms in front of the head, a shade lighter
    ctx.restore();
  }

  // ─── A · pain as physics: a nerve fibre and an oscilloscope with a clean spike train; then the glass cracks ───
  const SC = { x: -430, y: -330, w: 760, h: 380 }, SPK = Array.from({ length: 12 }, (_, k) => NERVE - .2 + k * .4), IMPACT = [70, -150];
  const CRACKS = Array.from({ length: 9 }, (_, i) => { const r = rng(40 + i), a = i / 9 * TAU + r() * .5, pts = [[0, 0]]; let x = 0, y = 0, ang = a; const L = 110 + r() * 260; for (let k = 1; k <= 5; k++) { ang += (r() - .5) * .7; x += Math.cos(ang) * L / 5; y += Math.sin(ang) * L / 5; pts.push([x, y]); } return pts; });
  const impactLocal = () => { if (!P) return IMPACT; const cx = SC.x + SC.w / 2, cy = SC.y + SC.h / 2; return [cx + (IMPACT[1] - cy), -(IMPACT[0] - cx)]; };   // where the drawn impact lands once the screen is turned upright
  function apShape(x) {   // an action potential, seen on the scope: a small rise, the spike, an undershoot
    return x < -30 || x > 70 ? 0 : x < 0 ? .08 * (1 + x / 30) : x < 12 ? x / 12 : x < 30 ? 1 - (x - 12) / 18 * 1.25 : -.25 * (1 - (x - 30) / 40);
  }
  function drawScope(ctx, t, a) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    if (!P) { ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-470, 190); ctx.lineTo(500, 190); ctx.stroke(); }   // the nerve fibre (in 4:5 it would cross the screen, so the trace alone carries it)
    if (!P) { ctx.strokeStyle = '#8f7cf0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-60, 180); ctx.lineTo(-60, SC.y + SC.h); ctx.stroke(); }   // the electrode
    if (P) { const cx = SC.x + SC.w / 2, cy = SC.y + SC.h / 2; ctx.translate(cx, 0); ctx.rotate(-Math.PI / 2); ctx.translate(-cx, -cy); }   // in 4:5 the screen itself stays upright, centred across the frame
    ctx.fillStyle = '#1b1242'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(SC.x, SC.y, SC.w, SC.h, 18) : ctx.rect(SC.x, SC.y, SC.w, SC.h); ctx.fill();
    ctx.strokeStyle = '#d9ccff'; ctx.lineWidth = 6; ctx.stroke();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(160,140,255,.16)'; ctx.lineWidth = 1.5;
    for (let x = SC.x; x < SC.x + SC.w; x += 47.5) { ctx.beginPath(); ctx.moveTo(x, SC.y); ctx.lineTo(x, SC.y + SC.h); ctx.stroke(); }
    for (let y = SC.y; y < SC.y + SC.h; y += 47.5) { ctx.beginPath(); ctx.moveTo(SC.x, y); ctx.lineTo(SC.x + SC.w, y); ctx.stroke(); }
    const base = SC.y + SC.h * .72, right = SC.x + SC.w;
    ctx.strokeStyle = '#3ff0d0'; ctx.lineWidth = 5; ctx.shadowColor = '#3ff0d0'; ctx.shadowBlur = 12 * scA; ctx.beginPath();
    for (let x = SC.x; x <= right; x += 3) { let y = 0; for (const ts of SPK) { const xs = right - (t - ts) * 330; y += apShape(x - xs); } const yy = base - y * SC.h * .55; x === SC.x ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
    ctx.stroke(); ctx.shadowColor = 'transparent';
    const k = easeOut(clamp((t - HURT) / .3), 2);   // the glass cracks
    if (k > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3;
      for (const c of CRACKS) { const n = Math.max(2, Math.ceil(c.length * k)); ctx.beginPath(); c.slice(0, n).forEach(([x, y], i) => i ? ctx.lineTo(IMPACT[0] + x, IMPACT[1] + y) : ctx.moveTo(IMPACT[0] + x, IMPACT[1] + y)); ctx.stroke(); }
      ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.arc(IMPACT[0], IMPACT[1], 30 * k, 0, TAU); ctx.fill();
    }
    ctx.restore(); ctx.restore();
  }
  // the red crack racing from the broken glass across the line through side B (screen space, so it can cross)
  function crackPath(t) {
    const [x0, y0] = toA(...impactLocal(), t), r = rng(9), pts = [[x0, y0]];
    const J = figPose(HIT - .01), pl = figPlace(t), x1 = pl.x + (J.head[0] - J.R * .9) * pl.k, y1 = pl.y + J.head[1] * pl.k;   // it ends at the person's head
    for (let i = 1; i <= 16; i++) { const u = i / 16; pts.push([lerp(x0, x1, u) + (r() - .5) * 90 * U, lerp(y0, y1, u) + (r() - .5) * 90 * U]); }
    const br = [5, 9, 12].map((i, j) => { const q = [pts[i]]; let [x, y] = pts[i]; for (let k = 0; k < 5; k++) { x += (P ? (r() - .5) * 90 : 30 + r() * 50) * U; y += (P ? 30 + r() * 50 : (j % 2 ? -1 : 1) * (20 + r() * 50)) * U; q.push([x, y]); } return q; });
    return { pts, br };
  }
  function drawCrack(ctx, t) {
    const k = easeIn(clamp((t - HURT - .3) / .55), 1.6); if (k <= 0) return;   // once side B has come back in
    const out = smooth((t - Q) / .5); if (out >= 1) return;
    const { pts, br } = crackPath(t), fl = (1 - out) * (.8 + .2 * noise1(t * 22, 4));
    const part = (list, u) => list.slice(0, Math.max(2, Math.ceil(list.length * u)));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const stroke = (list, wmul) => { for (const [c, wd, al] of [['#ff3b1f', 26, .25], ['#ff7a2a', 9, .6], ['#ffe0a8', 3, 1]]) { ctx.strokeStyle = F.rgba(F.hex(c), al * fl); ctx.lineWidth = wd * wmul * U; ctx.beginPath(); list.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); } };
    stroke(part(pts, k), 1);
    br.forEach((b, j) => { const kb = clamp((k - .35 - j * .12) / .4); if (kb > 0) stroke(part(b, kb), .6); });
    const tip = part(pts, k).at(-1); glow(ctx, tip[0], tip[1], 160 * U, '#ff5a2a', .5 * fl);
    ctx.restore();
  }

  // ─── the canyon: the halves slide apart; the questions fall in; a violet interference shimmer rises from below ───
  const CARDS = ['আমি?', 'লাল?', 'ব্যথা?'];
  function drawCards(ctx, t) {
    CARDS.forEach((s, i) => {
      const t0 = Q + .15 + i * .2, k = easeOut(clamp((t - t0) / .4), 3); if (k <= 0) return;
      const tf = DONT - 1.2 + i * .2, f = easeIn(clamp((t - tf) / 1.1), 2), a = k * (1 - smooth((t - tf - .6) / .6)); if (a <= 0) return;
      const [x, y] = P ? [W * (.2 + .3 * i), H / 2] : [W / 2, H * (.3 + .2 * i)];
      ctx.save(); ctx.setTransform(1, 0, 0, 1, x + (P ? 0 : (i - 1) * 120 * U * f), y + (P ? 0 : 60 * U * f)); ctx.rotate(f * (i - 1 + .6) * 1.4); const sc = U * (.9 + .1 * k) * (1 - .8 * f); ctx.scale(sc, sc);
      const lw = YV.measure(ctx, s, 62); YV.tag(ctx, lw + 60, 96, a); YV.text(ctx, s, 62, a, { body: true }); ctx.restore();
    });
  }
  const [IC, IX] = F.canvas(Math.ceil(W / 6), Math.ceil(H / 6)), ID_ = IX.createImageData(IC.width, IC.height);
  function drawShimmer(ctx, t) {
    const rise = smooth((t - DONT - .3) / 3.4); if (rise <= 0) return;
    const boost = 1 + .9 * smooth((t - QUANT) / .6), zoom = 1 + 1.6 * easeIn(clamp((t - QUANT) / (DUR - QUANT)), 2);
    const w = IC.width, h = IC.height, d = ID_.data, k = .55 / zoom, om = 5, sep = w * .09 * zoom, sy = h * 1.1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const r1 = Math.hypot(x - (w / 2 - sep), y - sy), r2 = Math.hypot(x - (w / 2 + sep), y - sy);
      const A = (Math.cos(k * r1 - om * t) + Math.cos(k * r2 - om * t)) / 2, I = A * A;
      const reveal = clamp((y / h - (1 - rise * 1.1)) / .25), e = reveal * boost * (.35 + .65 * (y / h)), o = (y * w + x) * 4;
      d[o] = 150 * I * e + 30; d[o + 1] = 110 * I * e + 10; d[o + 2] = 255 * Math.min(1, I * e + .15); d[o + 3] = 255 * Math.min(1, I * e * .9);
    }
    IX.putImageData(ID_, 0, 0);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.imageSmoothingEnabled = true; ctx.drawImage(IC, 0, 0, W, H); ctx.restore();
  }
  function drawCanyon(ctx, t) {
    const s = shift(t); if (s <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const [gx, gy, gw, gh] = P ? [0, H / 2 - s, W, 2 * s] : [W / 2 - s, 0, 2 * s, H];
    ctx.beginPath(); ctx.rect(gx, gy, gw, gh); ctx.clip();
    ctx.fillStyle = '#020308'; ctx.fillRect(gx, gy, gw, gh);
    const g = P ? ctx.createLinearGradient(0, gy, 0, gy + gh) : ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(40,20,80,0)'); g.addColorStop(1, 'rgba(60,30,120,.35)'); ctx.fillStyle = g; ctx.fillRect(gx, gy, gw, gh);   // the far floor
    drawShimmer(ctx, t);
    ctx.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = 'rgba(220,210,255,.5)'; ctx.lineWidth = 3 * U;   // the lit rims of the two cliffs
    if (P) { for (const y of [H / 2 - s, H / 2 + s]) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
    else { for (const x of [W / 2 - s, W / 2 + s]) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } }
    ctx.restore();
  }

  // ─── "কোয়ান্টাম পদার্থবিদ্যা": each word surfaces made of the interference ripples, then settles into crisp type, its
  // violet and cyan ghosts closing in on it (a state that resolves); a hairline draws itself under the words ───
  const [QC, QX] = F.canvas(W, H), PHYS = w('পদার্থবিদ্যা');
  function drawQuantumTitle(ctx, t) {
    if (t < QUANT - .15) return;
    const size = (P ? 96 : 120) * U, gap = size * .32, rows = P ? [[0], [1]] : [[0, 1]], WORDS = ['কোয়ান্টাম', 'পদার্থবিদ্যা'], T0 = [QUANT - .1, PHYS - .1];
    const k = T0.map(t0 => clamp((t - t0) / 1.1)), settle = k.map(x => easeIO(clamp((x - .3) / .7)));
    const pos = []; rows.forEach((row, ri) => {
      const ws = row.map(i => YD.measure(ctx, WORDS[i], size, 600)), y = H * (P ? .34 : .4) + ri * size * 1.35;
      let x = W / 2 - (ws.reduce((a, b) => a + b, 0) + gap * (row.length - 1)) / 2;
      row.forEach((i, j) => { pos[i] = [x + ws[j] / 2, y, ws[j]]; x += ws[j] + gap; });
    });
    // 0 · a soft darkness behind the words, so they read over the bright ripples
    const back = smooth((t - QUANT + .2) / .6); if (back > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const cy = H * (P ? .34 : .4) + (P ? size * .67 : 0), g = ctx.createRadialGradient(W / 2, cy, 0, W / 2, cy, (P ? .55 : .42) * W); g.addColorStop(0, 'rgba(6,3,18,' + (.6 * back) + ')'); g.addColorStop(1, 'rgba(6,3,18,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    // 1 · the words made of the ripples
    QX.setTransform(1, 0, 0, 1, 0, 0); QX.globalCompositeOperation = 'source-over'; QX.globalAlpha = 1; QX.clearRect(0, 0, W, H);
    QX.font = YD.fontOf(size, 600); QX.textAlign = 'center'; QX.textBaseline = 'middle';
    WORDS.forEach((s, i) => { if (k[i] <= 0) return; QX.globalAlpha = smooth(k[i] * 3); QX.fillStyle = '#ffffff'; QX.fillText(s, pos[i][0], pos[i][1] + 18 * U * (1 - easeOut(k[i], 3))); });
    QX.globalAlpha = 1; QX.globalCompositeOperation = 'source-in'; QX.drawImage(IC, 0, 0, W, H);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1 - .7 * Math.min(settle[0], k[1] > 0 ? settle[1] : 1); ctx.drawImage(QC, 0, 0); ctx.restore();
    // 2 · settling into crisp type, the colour ghosts closing in
    WORDS.forEach((s, i) => {
      const st = settle[i]; if (st <= 0) return;
      const [x, y] = pos[i], off = 14 * U * (1 - st);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = YD.fontOf(size, 600); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .55 * st * (1 - st * .6);
      ctx.fillStyle = '#a78bfa'; ctx.fillText(s, x - off, y); ctx.fillStyle = '#5fe3ff'; ctx.fillText(s, x + off, y);
      ctx.restore();
      YD.hudText(ctx, s, x, y, size, st, 'text', 600);
    });
    // 3 · the hairline under the words
    const ul = easeOut(clamp((t - PHYS - .6) / .6), 3); if (ul > 0) {
      const last = pos[P ? 1 : 1], y = last[1] + size * .78, half = (P ? last[2] : pos[1][0] + pos[1][2] / 2 - pos[0][0] + pos[0][2] / 2) / 2 * ul, cx = P ? last[0] : (pos[0][0] - pos[0][2] / 2 + pos[1][0] + pos[1][2] / 2) / 2;
      YD.hud(ctx, [[cx - half, y], [cx + half, y]], 2 * U, .8, '#b8a6ff');
    }
  }

  // ─── the frame ───
  function drawScene(ctx, t) {
    const v0 = D.view({ x: 0, y: 0, z: 0, focus: 1000 }, W, H);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); clipRect(ctx, rectA(t)); YV.bg(ctx, v0);
    setA(ctx, t); drawEye(ctx, t, 1 - smooth((t - PAIN) / .5)); drawScope(ctx, t, smooth((t - PAIN - .2) / .5)); ctx.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); clipRect(ctx, rectB(t)); YD.bg(ctx, v0); drawInk(ctx, t); drawFigure(ctx, t); ctx.restore();
    const div = (1 - smooth((t - SLIDE0) / .3)) * smooth(splitK(t) / .15), dl = lenA(t);   // the dividing line: the gap between physics and experience
    if (div > 0) add(ctx, () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = `rgba(230,225,255,${.8 * div})`; ctx.lineWidth = 3 * U; ctx.shadowColor = 'rgba(200,190,255,.8)'; ctx.shadowBlur = 16 * U; ctx.beginPath(); P ? (ctx.moveTo(0, dl), ctx.lineTo(W, dl)) : (ctx.moveTo(dl, 0), ctx.lineTo(dl, H)); ctx.stroke(); });
    drawCanyon(ctx, t);
    drawCrack(ctx, t);
    drawCards(ctx, t);
    drawQuantumTitle(ctx, t);
    const lab = smooth((t - WAVE + .6) / .5) * (1 - smooth((t - RED) / .5));   // the one number on screen: the wavelength of red light
    if (lab > 0) { const [x, y] = toA(-250, -110, t); YV.hudText(ctx, 'λ ≈ ৭০০ ন্যানোমিটার', x, y, 42 * U, lab, 'text', 700); }
    YV.post(ctx);   // the softer bloom of the vector side, so the diagram does not burn out
  }

  const LEVEL = .48;
  const SFX = [
    { t: WAVE - .9, type: 'air', dur: 1.8, f0: 500, f1: 1500, peak: .7, g: .16 },           // the light wave travelling in
    ...SPIKES.map(t0 => ({ t: t0, type: 'tick', g: .12 })),                                   // grey spikes leaving the eye
    { t: RED, type: 'bloom', dur: 2.4, f: 131, g: .32 }, { t: RED, type: 'drone', dur: 2.3, f: 65, g: .4 },   // red blooming like ink
    { t: PAIN, type: 'air', dur: .9, f0: 900, f1: 300, g: .14 },                               // the red draining away
    { t: PAIN, type: 'swoosh', dur: .6, f0: 300, f1: 700, pan0: .5, pan1: 1, g: .18 },         // side A takes the whole frame
    { t: HURT - .25, type: 'swoosh', dur: .6, f0: 700, f1: 250, pan0: 1, pan1: .4, g: .2 },    // and gives half of it back
    ...SPK.map(ts => ({ t: ts, type: 'tick', g: .1 })),                                         // the scope's clean spikes
    { t: HURT, type: 'glass', g: .26 }, { t: HIT, type: 'impact', size: .4, f: 55, g: .28 },   // the crack striking the head
    { t: HURT + .15, type: 'crack', dur: 1, g: .36 }, { t: HURT + .1, type: 'impact', size: .5, g: .3 },
    { t: Q + .05, type: 'rumble', dur: 2.2, g: .3 },                                            // the canyon opening
    ...CARDS.map((s, i) => ({ t: DONT - 1.2 + i * .2, type: 'swoosh', dur: 1, f0: 800, f1: 250, g: .14 })),
    { t: GAP, type: 'shimmer', dur: 3, g: .14 }, { t: QUANT - 1.2, type: 'riser', dur: 1.2, f0: 300, f1: 1800, g: .16 },
    { t: QUANT, type: 'bloom', dur: 2, f: 196, g: .28 }, { t: QUANT, type: 'drone', dur: DUR - QUANT, f: 73, g: .35 },
  ].map(c => ({ ...c, g: c.g * LEVEL }));

  const fontsReady = Promise.race([
    Promise.all(['Hind Siliguri'].flatMap(f => [500, 600, 700].map(wt => document.fonts.load(`${wt} 60px "${f}"`, 'লাল ব্যথা আমি')))),
    new Promise(r => setTimeout(r, 5000)),
  ]);
  const label = t => { let s = ''; for (const x of T.words) if (x[1] <= t + 1e-6) s = x[0]; return s; };
  F.scene(ID, { W, H, duration: DUR, draw: (ctx, t) => { D.frameStart(); drawScene(ctx, t); }, ready: fontsReady, label, sfx: SFX, grain: 'frame' });
})();
