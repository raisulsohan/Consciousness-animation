// Scene 04 · The quantum world (1:13.250–1:42.283 of voice/Death.mp3), plan v2: ঙ vivid vector, ending in paper.
// One unbroken zoom from a grain of salt spilled from a shaker into its cubic lattice and down to one atom's electron
// cloud; the cloud becomes the source of a double-slit experiment, where each electron passes both slits as a wave
// and lands as one dot, and the dots build the stripes of interference (superposition); two particles born in one
// flash fly apart and cannot be described one without the other (entanglement); the lights come up on the bench that
// made them, both detectors ticking together (proven, Nobel 2022); on "কিন্তু" everything freezes, and the frame
// folds away like a sheet of paper onto the closed curtain of the paper theatre of scene 05.
(function () {
  'use strict';
  const F = FILM, D = F.depth, { clamp, smooth, easeIO, easeOut, easeIn, lerp, noise1, hash, rng, TAU } = F;
  const ID = 'scene-04', T = window.TIMING[ID], DUR = T.duration;
  const { W, H, portrait: P } = F.format(), U = Math.min(W, H) / 1080, SW = W / U / 2, SH = H / U / 2;   // the stage: U px per unit, origin at the centre
  const YV = F.style25('vector', W, H), YP = F.style25('papercut', W, H);
  const norm = s => s.normalize('NFC').replace(/[।,?!—'"()\s]/g, '');
  const w = (word, n = 1) => { let k = 0; for (const x of T.words) if (norm(x[0]) === norm(word) && ++k === n) return x[1]; throw new Error(`${ID}: no word "${word}" (${n})`); };
  const SYS = w('ব্যবস্থা'), SAME = w('একই'), SUPER = w('সুপারপজিশন'), TWO = w('দুটি'), TANGLE = w('জড়িয়ে'), APART = w('আলাদা'), NO = w('না');
  const QE = w('কোয়ান্টাম', 3), ENT = w('এনট্যাঙ্গেলমেন্ট'), TEST = w('পরীক্ষায়'), EST = w('প্রতিষ্ঠিত'), BUT = w('কিন্তু'), CLEAR = w('পরিষ্কার');
  const glow = (c, x, y, r, col, a) => { if (a <= .004 || r <= 0) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, F.rgba(F.hex(col), a)); g.addColorStop(1, F.rgba(F.hex(col), 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const add = (ctx, f) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; f(); ctx.restore(); };
  const stage = ctx => ctx.setTransform(U, 0, 0, U, W / 2, H / 2);
  const bn = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
  const V0 = D.view({ x: 0, y: 0, z: 0, focus: 1000 }, W, H);
  // a quiet word or line of type in stage units, fading in with the voice
  const say = (ctx, s, x, y, size, a, role = 'text', weight = 600) => YV.hudText(ctx, s, W / 2 + x * U, H / 2 + y * U, size * U, a, role, weight);

  // a lit ball, painted once and scaled (atoms, particles)
  const ball = (c, hi, lo) => { const n = 160, [cv, x] = F.canvas(n, n), g = x.createRadialGradient(n * .38, n * .34, n * .04, n * .5, n * .5, n * .5); g.addColorStop(0, hi); g.addColorStop(.55, c); g.addColorStop(1, lo); x.fillStyle = g; x.beginPath(); x.arc(n / 2, n / 2, n / 2 - 1, 0, TAU); x.fill(); x.fillStyle = 'rgba(20,0,60,.28)'; x.beginPath(); x.arc(n / 2, n / 2, n / 2 - 1, .15 * Math.PI, 1.05 * Math.PI); x.arc(n * .47, n * .44, n * .43, 1.05 * Math.PI, .15 * Math.PI, true); x.fill(); return cv; };
  const CL = ball('#3fcf86', '#b9ffd8', '#1f8a55'), NA = ball('#8a6cf0', '#d9ccff', '#5a3fc0'), PHO = ball('#29d6c0', '#e6fffb', '#138f84');
  const sprite = (ctx, img, x, y, r, a = 1) => { if (a <= .004) return; ctx.globalAlpha = a; ctx.drawImage(img, x - r, y - r, 2 * r, 2 * r); ctx.globalAlpha = 1; };

  // ═══ A · into a grain of salt (0–4.8) ═══════════════════════════════════════
  // Seen from above: a salt shaker lying on its side on a table, salt spilled from its cap, one grain at the centre.
  // Zoom (log10 of the magnification): the grain's face fills the frame, becomes the rock-salt lattice (sodium and
  // chloride ions alternating in a square grid: the face of a cube), and one chloride ion becomes an electron cloud.
  const zA = t => .25 * smooth(t / 1.5) + 3.86 * easeIO(clamp((t - 1.35) / 2.6));   // arrives on "কোয়ান্টাম ব্যবস্থা"
  const A0 = 4.55, A1 = 5.3;   // the atom's cloud shrinks into the electron source of the double slit
  const GRAINS = (() => { const r = rng(4), g = []; for (let i = 0; i < 46; i++) { const u = r(), x = lerp(-205, -40, Math.pow(u, .8)) + (r() - .5) * 70 * (1 - u), y = -60 + (r() - .5) * (40 + 120 * u) + 50 * u; g.push({ x, y, s: 6 + r() * 7, a: (r() - .5) * .9 }); } for (let i = 0; i < 14; i++) g.push({ x: (r() - .5) * 360, y: (r() - .5) * 220 + 40, s: 5 + r() * 6, a: (r() - .5) * 1.2 }); return g.filter(q => Math.hypot(q.x, q.y) > 40); })();
  function grain(ctx, x, y, s, a) {   // a salt grain from above: a little cube, its top face lit
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    ctx.fillStyle = 'rgba(40,15,0,.35)'; ctx.fillRect(-s / 2 + s * .12, -s / 2 + s * .18, s, s);
    ctx.fillStyle = '#dfe3ff'; ctx.fillRect(-s / 2, -s / 2, s, s); ctx.fillStyle = '#ffffff'; ctx.fillRect(-s / 2 + s * .12, -s / 2 + s * .12, s * .76, s * .76);
    ctx.restore();
  }
  function drawTable(ctx, m, a, face = 1) {   // everything at magnification m about the target grain at the origin
    if (a <= .004) return;
    ctx.save(); stage(ctx); ctx.globalAlpha = a; ctx.scale(m, m); if (P) ctx.scale(.74, .74);
    const lim = 1 / m; if (lim > .002) {   // the table and the shaker (off-frame once the zoom is deep)
      const g = ctx.createRadialGradient(-60, -30, 60, 0, 0, 1400); g.addColorStop(0, '#a8764c'); g.addColorStop(.6, '#7c5335'); g.addColorStop(1, '#4e331f'); ctx.fillStyle = g; ctx.fillRect(-1600, -1000, 3200, 2000);   // a wooden kitchen table
      ctx.strokeStyle = 'rgba(60,30,10,.22)'; ctx.lineWidth = 3; for (let y = -1000; y < 1000; y += 190) { ctx.beginPath(); ctx.moveTo(-1600, y); ctx.lineTo(1600, y + 40); ctx.stroke(); }   // the planks
      ctx.strokeStyle = 'rgba(60,30,10,.1)'; ctx.lineWidth = 2; for (let y = -1000; y < 1000; y += 23) { ctx.beginPath(); ctx.moveTo(-1600, y + 8 * Math.sin(y)); ctx.bezierCurveTo(-500, y + 14, 500, y - 10, 1600, y + 30); ctx.stroke(); }   // the wood's grain
      ctx.save(); ctx.translate(-470, -70); ctx.rotate(-.12); ctx.scale(1.3, 1.3); ctx.translate(60, 0);   // the shaker, lying on its side, its cap toward the spill
      ctx.fillStyle = 'rgba(40,15,0,.35)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-170, -62, 380, 150, 60) : ctx.rect(-170, -62, 380, 150); ctx.fill();
      ctx.fillStyle = 'rgba(190,225,255,.28)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-190, -80, 330, 150, 60) : ctx.rect(-190, -80, 330, 150); ctx.fill();
      ctx.fillStyle = '#eef1ff'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-170, -30, 300, 88, 40) : ctx.rect(-170, -30, 300, 88); ctx.fill();   // the salt inside
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(-150, -66, 250, 12);   // the glass catching the light
      const cg = ctx.createLinearGradient(0, -80, 0, 70); cg.addColorStop(0, '#d9dcef'); cg.addColorStop(.5, '#9ea3c6'); cg.addColorStop(1, '#6c7098'); ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(140, -84, 84, 158, 22) : ctx.rect(140, -84, 84, 158); ctx.fill();   // the cap
      ctx.fillStyle = '#3b3f66'; for (const [hx, hy] of [[182, -40], [182, 0], [182, 40], [204, -20], [204, 20]]) { ctx.beginPath(); ctx.arc(hx, hy, 7, 0, TAU); ctx.fill(); }
      ctx.restore();
      for (const q of GRAINS) grain(ctx, q.x, q.y, q.s, q.a);
    }
    ctx.globalAlpha = a * face; grain(ctx, 0, 0, 14, .06);   // the grain we go into
    ctx.restore();
  }
  // the lattice: a face of the rock-salt cube, chloride (larger, green) and sodium (smaller, violet) alternating
  const TS = 64, TILE = (() => { const [c, x] = F.canvas(2 * TS, 2 * TS); for (const [px, py, cl] of [[0, 0, 1], [TS, TS, 1], [TS, 0, 0], [0, TS, 0]]) for (const dx of [-1, 0, 1]) for (const dy of [-1, 0, 1]) { const r = (cl ? .36 : .22) * TS; x.drawImage(cl ? CL : NA, px + dx * 2 * TS - r, py + dy * 2 * TS - r, 2 * r, 2 * r); } return c; })();
  function drawLattice(ctx, z, a, t) {
    if (a <= .004) return;
    const sp = 90 * Math.pow(10, z - 3) * U;
    if (sp < 70 * U) {   // fine: one pattern fill, a chloride ion on the centre
      const pat = ctx.createPattern(TILE, 'repeat'); pat.setTransform(new DOMMatrix().translate(W / 2, H / 2).rotate(.06 * 180 / Math.PI).scale(sp / TS));
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = pat; ctx.fillRect(0, 0, W, H); ctx.restore(); return;
    }
    const cx = W / 2, cy = H / 2, ni = Math.ceil(W / 2 / sp) + 1, nj = Math.ceil(H / 2 / sp) + 1, rot = .06;
    const atom = smooth((z - 3.72) / .32);   // the centre ion is handed over to the cloud
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    for (let j = -nj; j <= nj; j++) for (let i = -ni; i <= ni; i++) {
      const cl = (i + j) % 2 === 0, x = i * sp, y = j * sp, jig = 1.5 * U * smooth((sp / U - 70) / 50) * noise1(t * 3 + i * 1.7 + j * 2.3, 9);   // a little thermal jiggle, once the ions are large
      if (!i && !j) { sprite(ctx, CL, x, y, .36 * sp, a * (1 - atom)); continue; }
      sprite(ctx, cl ? CL : NA, x + jig, y - jig, (cl ? .36 : .22) * sp, a * (1 - .55 * atom));
    }
    ctx.restore();
  }
  // the atom: a tiny nucleus inside a cloud of where its electrons may be found (not orbits); the dots come and go
  const CLOUD = (() => { const r = rng(12), d = []; for (let i = 0; i < 520; i++) { const shell = r() < .35 ? .28 : r() < .55 ? .6 : .88, rr = shell * (.55 + .5 * Math.sqrt(-Math.log(1 - r() * .95)) * .6), th = r() * TAU; d.push({ x: Math.cos(th) * rr, y: Math.sin(th) * rr, ph: r(), sp: .8 + r() * 1.6 }); } return d; })();
  function drawCloud(ctx, x, y, R, a, t) {
    if (a <= .004) return;
    ctx.save(); ctx.globalAlpha = a;
    add(ctx, () => { glow(ctx, x, y, R, '#3ff0d0', .22); glow(ctx, x, y, R * .6, '#7aa7ff', .25); glow(ctx, x, y, R * .3, '#bff8ff', .18); });
    ctx.fillStyle = '#d8fffa';
    const dr = Math.max(1.2 * U, R * .006);
    for (const d of CLOUD) { const f = (t * d.sp + d.ph) % 1, al = Math.sin(Math.PI * f); if (al < .2) continue; ctx.globalAlpha = a * al * .85; ctx.beginPath(); ctx.arc(x + d.x * R, y + d.y * R, dr, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = a; add(ctx, () => glow(ctx, x, y, Math.max(8 * U, R * .06), '#fff3c4', .95));   // the nucleus (far larger than to scale)
    ctx.restore();
  }

  // ═══ B · the double slit (4.6–12.3) ═══════════════════════════════════════════
  // Apparatus units: the beam runs along +ax, the slits across it (ay). In 4:5 the whole bench is turned a quarter so
  // the beam runs down the frame. The screen is shown face-on as a panel: its stripes lie across the beam's side axis.
  const B = P ? { src: -560, bar: -120, s0: 320, s1: 480, half: 400 } : { src: -760, bar: -260, s0: 500, s1: 720, half: 420 };
  const SLIT = 70, GAPH = 18, VW = 900;   // slit centres at ±70, each 36 wide; wave speed (units/s)
  const fromApp = (ax, ay) => P ? [-ay, ax] : [ax, ay];
  const setApp = ctx => { stage(ctx); if (P) ctx.rotate(Math.PI / 2); };
  const I = y => Math.pow(Math.cos(Math.PI * y / 74), 2) * Math.exp(-Math.pow(y / 250, 2));   // where electrons land: two-slit fringes under a single-slit envelope
  const FIRE0 = SAME - .15, FIRE1 = FIRE0 + 1.6, toBar = (B.bar - B.src) / VW, toScr = (B.s0 - B.bar) / VW;
  const DOTS = (() => {
    const r = rng(21), d = [{ t: FIRE0 + toBar + toScr, y: -74 }, { t: FIRE1 + toBar + toScr, y: 148 }], N = 950;
    for (let k = 0; k < N; k++) { let y; do { y = (r() - .5) * 2 * B.half * .92; } while (r() > I(y)); d.push({ t: FIRE1 + toBar + toScr + .25 + 3.1 * Math.pow(k / N, .55), y }); }
    d.forEach(q => { q.x = B.s0 + 12 + r() * (B.s1 - B.s0 - 24); }); return d;
  })();
  function drawWave(ctx, t0, t, a) {   // one electron as a wave: rings from the source, through both slits, gone on landing
    const r = (t - t0) * VW; if (r <= 0 || a <= .004) return;
    const L1 = B.bar - B.src, L2 = B.s0 - B.bar; if (r > L1 + L2) return;
    ctx.save(); ctx.lineCap = 'round';
    for (let c = 0; c < 4; c++) {
      const rc = r - c * 26; if (rc <= 0) continue; const al = a * (1 - c / 4) * .9;
      ctx.strokeStyle = F.rgba(F.hex('#3ff0d0'), al); ctx.lineWidth = 4;
      if (rc < L1) { ctx.beginPath(); ctx.arc(B.src, 0, rc, -.42, .42); ctx.stroke(); }
      else for (const sy of [-SLIT, SLIT]) { const r2 = rc - L1; ctx.beginPath(); ctx.arc(B.bar, sy, r2, -1.25, 1.25); ctx.stroke(); }   // the same wave out of both slits at once
    }
    ctx.restore();
  }
  function drawBench(ctx, t) {   // B: the source, the barrier, the screen, the waves and the dots
    const on = smooth((t - A0 - .25) / .5), out = 1 - smooth((t - TWO + .6) / .5); if (on <= 0 || out <= 0) return;
    const a = on * out;
    ctx.save(); setApp(ctx); ctx.globalAlpha = a; ctx.lineCap = 'round';
    // the barrier with its two slits
    ctx.fillStyle = '#8f7cf0'; const bw = 22;
    for (const [y0, y1] of [[-B.half, -SLIT - GAPH], [-SLIT + GAPH, SLIT - GAPH], [SLIT + GAPH, B.half]]) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(B.bar - bw / 2, y0, bw, y1 - y0, 6) : ctx.rect(B.bar - bw / 2, y0, bw, y1 - y0); ctx.fill(); }
    // the screen, face-on: a dark panel where the electrons land
    ctx.fillStyle = '#140c38'; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(B.s0, -B.half, B.s1 - B.s0, 2 * B.half, 10) : ctx.rect(B.s0, -B.half, B.s1 - B.s0, 2 * B.half); ctx.fill(); ctx.stroke();
    // the slits light up as the first wave passes both at once
    const lit = Math.exp(-Math.pow((t - FIRE0 - toBar - .08) / .22, 2)) + Math.exp(-Math.pow((t - FIRE1 - toBar - .08) / .22, 2));
    if (lit > .02) add(ctx, () => { for (const sy of [-SLIT, SLIT]) glow(ctx, B.bar, sy, 90, '#3ff0d0', .7 * lit); });
    drawWave(ctx, FIRE0, t, 1); drawWave(ctx, FIRE1, t, 1);
    for (let k = 2; k < 9; k++) drawWave(ctx, DOTS[k * 60].t - toBar - toScr, t, .35);   // now and then a faint wave among the many
    // the dots, each with a short flash where it lands
    ctx.fillStyle = '#c9fff6';
    for (const d of DOTS) { if (d.t > t) continue; ctx.beginPath(); ctx.arc(d.x, d.y, 4, 0, TAU); ctx.fill(); }
    add(ctx, () => DOTS.forEach((d, i) => { const u = t - d.t, big = i < 2; if (u < 0 || u > (big ? .6 : .2) || (!big && i % 4)) return; const k = 1 - u / (big ? .6 : .2); glow(ctx, d.x, d.y, (big ? 60 : 14) * k + 5, '#3ff0d0', (big ? 1 : .6) * k); }));   // a flash for the first two, a spark for some of the rest
    ctx.restore();
  }

  // ═══ C · two particles, one state (12.4–22.5) ═══════════════════════════════════
  const XE = P ? 330 : 700, XD = XE + (P ? 60 : 80);
  const STARS = (() => { const r = rng(33), s = []; for (let i = 0; i < 260; i++) s.push({ x: (r() - .5) * 5200, y: (r() - .5) * 3400, r: .8 + r() * 2.2, ph: r() * 9 }); return s; })();
  const pullback = t => 1 + 7 * easeIO(clamp((t - TWO - .2) / 5));
  const sepX = t => lerp(0, XE, easeOut(clamp((t - TWO) / 2.6), 2.4));
  const LAB0 = ENT + .95;   // the lights come up on the bench
  function drawPair(ctx, t) {
    if (t < TWO - .2) return;
    const lab = smooth((t - LAB0) / .7), a = 1;
    // the stars stream in toward the middle as the camera pulls back: the two are getting ever farther apart
    ctx.save(); stage(ctx);
    const zc = pullback(t), sa = (1 - lab) * smooth((t - TWO + .1) / .6);
    if (sa > 0) { ctx.fillStyle = '#ffffff'; for (const s of STARS) { const x = s.x / zc, y = s.y / zc; if (Math.abs(x) > SW + 5 || Math.abs(y) > SH + 5) continue; ctx.globalAlpha = sa * (.35 + .4 * Math.sin(t * 1.3 + s.ph) ** 2); ctx.beginPath(); ctx.arc(x, y, s.r / Math.sqrt(zc) + .6, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
    // the flash that makes them
    const fl = Math.exp(-Math.pow((t - TWO) / .16, 2)) + .5 * Math.exp(-Math.max(0, t - TWO) * 3) * (t > TWO ? 1 : 0);
    if (fl > .01 && t < LAB0) add(ctx, () => { glow(ctx, 0, 0, 150 * Math.min(1, fl), '#fff3c4', .5 * Math.min(1, fl)); glow(ctx, 0, 0, 60, '#ffffff', .8 * Math.exp(-Math.pow((t - TWO) / .1, 2))); });
    // the two, each a ball with both its arrows faint (neither up nor down alone); their arrows brighten in turn,
    // always opposite: one state for the pair, none for either one
    const inD = clamp((t - LAB0 - .1) / .3), X = lerp(sepX(t), XD, easeIn(inD, 2)), R = 42 * (1 - easeIn(inD, 2)), ph = Math.sin(t * TAU / 1.1);
    if (R > .5 && t >= TWO) for (const s of [-1, 1]) {
      const x = s * X; sprite(ctx, PHO, x, 0, R, a);
      const up = .5 + .5 * ph * s, dn = 1 - up;
      ctx.strokeStyle = '#ffffff'; ctx.lineCap = 'round'; ctx.lineWidth = 4.5;
      for (const [dir, k] of [[-1, up], [1, dn]]) { ctx.globalAlpha = .25 + .7 * k; ctx.beginPath(); ctx.moveTo(x, -dir * R * .42); ctx.lineTo(x, dir * R * .5); ctx.moveTo(x - R * .22, dir * R * .26); ctx.lineTo(x, dir * R * .5); ctx.lineTo(x + R * .22, dir * R * .26); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    // one brace under both, one state; a label over either one alone cannot settle
    const br = smooth((t - TANGLE) / .6) * (1 - lab);
    if (br > 0) {
      ctx.save(); stage(ctx); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const X = sepX(t), y = 95, dx = X * br;   // drawn out from the middle
      ctx.beginPath(); ctx.moveTo(-dx, y); ctx.quadraticCurveTo(-dx, y + 22, -dx + 30, y + 22); ctx.lineTo(-24, y + 22); ctx.quadraticCurveTo(0, y + 22, 0, y + 44); ctx.quadraticCurveTo(0, y + 22, 24, y + 22); ctx.lineTo(dx - 30, y + 22); ctx.quadraticCurveTo(dx, y + 22, dx, y); ctx.stroke();
      ctx.restore();
      say(ctx, 'একটাই অবস্থা', 0, 180, 44, br * .95, 'text', 600);
    }
    const q = smooth((t - APART) / .4) * (1 - smooth((t - LAB0) / .4));
    if (q > 0) for (const s of [-1, 1]) {
      const settle = smooth((t - NO + .2) / .4), flick = Math.floor(t * 14 + (s > 0 ? 3 : 0)) % 3, glyph = settle > .5 ? '?' : ['↑', '↓', '?'][flick];
      say(ctx, glyph, s * sepX(t), -92, 52, q * (settle > .5 ? .95 : .6), 'text', 700);
    }
    // the title, word by word with the voice
    const tt = smooth((t - QE + .05) / .4) * (1 - smooth((t - LAB0 + .2) / .5));
    if (tt > 0) { const y = -SH + 105; if (P) { say(ctx, 'কোয়ান্টাম', 0, y, 64, tt, 'text', 700); say(ctx, 'এনট্যাঙ্গেলমেন্ট', 0, y + 82, 64, smooth((t - ENT + .05) / .4) * (1 - smooth((t - LAB0 + .2) / .5)), 'text', 700); } else { say(ctx, 'কোয়ান্টাম', -250, y, 70, tt, 'text', 700); say(ctx, 'এনট্যাঙ্গেলমেন্ট', 130, y, 70, smooth((t - ENT + .05) / .4) * (1 - smooth((t - LAB0 + .2) / .5)), 'text', 700); } }
  }

  // ═══ D · the bench that made them (22.5–25.2): laser, crystal, two detectors, the pairs counted ═══
  const PAIRS = Array.from({ length: 40 }, (_, k) => LAB0 + .45 + k * .28);
  const LASER = P ? [0, 400] : [0, 330], COUNT = P ? [0, -290] : [0, -205];
  function arrivals(t) { let n = t >= LAB0 + .4 ? 1 : 0; for (const p of PAIRS) if (t >= p + .3) n++; return n; }
  function drawLab(ctx, t) {
    const lab = smooth((t - LAB0) / .7); if (lab <= 0) return;
    ctx.save(); stage(ctx); ctx.globalAlpha = lab; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // the laser pumping the crystal from below
    ctx.fillStyle = '#2d2170'; ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(LASER[0] - 90, LASER[1] - 30, 180, 90, 14) : ctx.rect(LASER[0] - 90, LASER[1] - 30, 180, 90); ctx.fill(); ctx.stroke();
    add(ctx, () => { ctx.strokeStyle = 'rgba(120,255,140,.35)'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, LASER[1] - 30); ctx.lineTo(0, 24); ctx.stroke(); ctx.strokeStyle = 'rgba(190,255,200,.95)'; ctx.lineWidth = 4; ctx.stroke(); });
    // the crystal where the flash was
    ctx.save(); ctx.rotate(Math.PI / 4); ctx.fillStyle = 'rgba(63,240,208,.35)'; ctx.strokeStyle = '#bff8ff'; ctx.lineWidth = 3; ctx.fillRect(-24, -24, 48, 48); ctx.strokeRect(-24, -24, 48, 48); ctx.restore();
    // the detectors, and the cables to the counter
    const hitAt = t => { const u = [LAB0 + .4, ...PAIRS.map(p => p + .3)].filter(x => x <= t).pop(); return u === undefined ? 0 : Math.exp(-(t - u) * 9); };
    const hit = hitAt(t);
    ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 3;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * (XD + s * 0 + 20), -60); ctx.bezierCurveTo(s * (XD + 20), COUNT[1], s * 300, COUNT[1], s * 90, COUNT[1]); ctx.stroke(); }   // a cable from each detector to the counter
    for (const s of [-1, 1]) {
      const x = s * XD; ctx.fillStyle = '#2d2170'; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - 40 + s * 20, -60, 80, 120, 14) : ctx.rect(x - 40 + s * 20, -60, 80, 120); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#140c38'; ctx.beginPath(); ctx.arc(x - s * 14, 0, 20, 0, TAU); ctx.fill();   // the window facing the crystal
      add(ctx, () => glow(ctx, x - s * 14, 0, 70, '#3ff0d0', .9 * hit));
    }
    // the pairs flying out, both halves reaching their detectors at the same moment
    for (const p of PAIRS) { const u = (t - p) / .3; if (u < 0 || u > 1) continue; for (const s of [-1, 1]) sprite(ctx, PHO, s * lerp(0, XD - 20, u), 0, 9, 1); }
    // the counter of pairs caught together
    ctx.fillStyle = '#140c38'; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(COUNT[0] - 90, COUNT[1] - 46, 180, 92, 14) : ctx.rect(COUNT[0] - 90, COUNT[1] - 46, 180, 92); ctx.fill(); ctx.stroke();
    ctx.restore();
    say(ctx, bn(arrivals(t)), COUNT[0], COUNT[1] - 6, 50, lab, 'signal', 700);
    say(ctx, 'জোড়া', COUNT[0], COUNT[1] + 72, 30, lab * .8, 'text', 500);
    say(ctx, 'লেজার', LASER[0], LASER[1] + 95, 30, lab * .8, 'text', 500);   // each part named, quietly
    for (const sd of [-1, 1]) say(ctx, 'ডিটেক্টর', sd * (XD + 20), 100, 30, lab * .8, 'text', 500);
    // the verdict: a solid tag (established) and the prize
    const v = smooth((t - TEST) / .4), n = smooth((t - EST) / .45), y = -SH + (P ? 150 : 115);
    if (v > 0) {
      const tw = YV.measure(ctx, 'প্রমাণিত', 54 * U, 700) / U + 64;
      ctx.save(); stage(ctx); ctx.globalAlpha = v; ctx.strokeStyle = '#3ff0d0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-tw / 2, y - 40, tw, 80, 16) : ctx.rect(-tw / 2, y - 40, tw, 80); ctx.stroke(); ctx.restore();
      YV.hudText(ctx, 'প্রমাণিত', W / 2, H / 2 + y * U, 54 * U, v, 'signal', 700);
    }
    say(ctx, 'পদার্থবিজ্ঞানে নোবেল ২০২২', 0, y + 88, 40, n * .95, 'text', 500);
  }

  // ═══ E · freeze, and the frame folds away like a sheet of paper (25.2–29.0) ═══
  const FOLD0 = CLEAR - .3, FOLD1 = FOLD0 + .85, DROP0 = FOLD1 + .08, DROP1 = DROP0 + .8;
  const [FZ, FZX] = F.canvas(W, H); let fzOk = false;
  const [BK, BKX] = F.canvas(Math.ceil(W / 2), H);   // the back of the sheet: paper, the print showing faintly through
  function frozen() {
    if (fzOk) return FZ;
    FZX.setTransform(1, 0, 0, 1, 0, 0); FZX.globalAlpha = 1; FZX.globalCompositeOperation = 'source-over'; D.frameStart(); drawLive(FZX, BUT);
    const [tmp, tx] = F.canvas(W, H); tx.filter = 'saturate(.6) brightness(.93)'; tx.drawImage(FZ, 0, 0); FZX.clearRect(0, 0, W, H); FZX.drawImage(tmp, 0, 0);
    BKX.fillStyle = '#efe3cc'; BKX.fillRect(0, 0, BK.width, H); BKX.globalAlpha = .3; BKX.fillStyle = BKX.createPattern(F.fibreTile(23), 'repeat'); BKX.fillRect(0, 0, BK.width, H); BKX.globalAlpha = .07;
    BKX.save(); BKX.translate(BK.width, 0); BKX.scale(-1, 1); BKX.drawImage(FZ, W / 2, 0, W / 2, H, 0, 0, W / 2, H); BKX.restore(); BKX.globalAlpha = 1;
    fzOk = true; return FZ;
  }
  const foldAng = t => Math.PI * easeIO(clamp((t - FOLD0) / (FOLD1 - FOLD0)));
  function drawFold(ctx, t) {
    const img = frozen(), phi = foldAng(t), cam = 2.4 * W, N = 56, hw = W / 2;
    const drop = easeIn(clamp((t - DROP0) / (DROP1 - DROP0)), 2.2);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (drop > 0) { ctx.translate(W * .25, H / 2 + drop * H * 1.25); ctx.rotate(.14 * drop); ctx.translate(-W * .25, -H / 2); }   // the folded sheet falls away
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30 * U; ctx.shadowOffsetY = 12 * U; ctx.drawImage(img, 0, 0, hw, H, 0, 0, hw, H); ctx.restore();   // the left half stays
    // the flap: vertical bands of the right half turning about the fold, in perspective
    const cols = [];
    for (let i = 0; i < N; i++) {
      const u0 = i / N * hw, u1 = (i + 1) / N * hw, z = (u0 + u1) / 2 * Math.sin(phi);   // how far the band has come toward us
      const x0 = W / 2 + (u0 * Math.cos(phi)) * (cam / (cam - u0 * Math.sin(phi))), x1 = W / 2 + (u1 * Math.cos(phi)) * (cam / (cam - u1 * Math.sin(phi)));
      cols.push({ u0, u1, x0, x1, s: cam / (cam - z) });
    }
    const back = phi > Math.PI / 2, shade = back ? .18 * Math.sin(phi) : .45 * Math.sin(phi) ** 1.5;
    for (const c of cols) {
      const left = Math.min(c.x0, c.x1), wd = Math.abs(c.x1 - c.x0) + .8, hh = H * c.s, top = H / 2 - hh / 2;
      if (back) ctx.drawImage(BK, BK.width - c.u1, 0, c.u1 - c.u0, H, left, top, wd, hh);
      else ctx.drawImage(img, hw + c.u0, 0, c.u1 - c.u0, H, left, top, wd, hh);
      if (shade > .01) { ctx.fillStyle = `rgba(10,5,20,${shade})`; ctx.fillRect(left, top, wd, hh); }
    }
    ctx.restore();
  }

  // ─── the paper theatre behind the sheet: the closed curtain scene 05 opens (চ) ───
  function drawTheatre(ctx) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#1a1014'; ctx.fillRect(0, 0, W, H);
    const fl = H * .84, cx0 = W * .07, cx1 = W * .93, top = H * .1;
    // the stage floor and its footlights
    const fg = ctx.createLinearGradient(0, fl, 0, H); fg.addColorStop(0, '#7a5236'); fg.addColorStop(1, '#4a2f1f'); ctx.fillStyle = fg; ctx.fillRect(0, fl, W, H - fl);
    ctx.fillStyle = '#9a6a45'; ctx.fillRect(0, fl, W, 6 * U);
    // the curtain: two halves of red paper folds meeting in the middle
    const folds = P ? 14 : 22, fw = (cx1 - cx0) / folds;
    for (let i = 0; i < folds; i++) {
      const x = cx0 + i * fw, g = ctx.createLinearGradient(x, 0, x + fw, 0); g.addColorStop(0, '#6e0f1a'); g.addColorStop(.35, '#b3283a'); g.addColorStop(.6, '#c93a4b'); g.addColorStop(1, '#7a1320');
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 12 * U; ctx.shadowOffsetX = 4 * U; ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x + fw + 1, top); ctx.lineTo(x + fw + 1, fl + 8 * U); ctx.quadraticCurveTo(x + fw / 2, fl + 22 * U, x, fl + 8 * U); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(W / 2 - 2 * U, top, 4 * U, fl - top);   // where the two halves meet
    add(ctx, () => { for (let i = 0; i < 9; i++) glow(ctx, cx0 + (i + .5) * (cx1 - cx0) / 9, fl + 14 * U, 90 * U, '#ffb24d', .35); });   // footlights
    // the valance: a scalloped band with a gold edge
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 18 * U; ctx.shadowOffsetY = 8 * U;
    ctx.fillStyle = '#5c0c16'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H * .16); const sc = P ? 7 : 11; for (let i = sc; i >= 0; i--) { const x = i * W / sc; ctx.quadraticCurveTo(x + W / sc / 2, H * .22, x, H * .16); } ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.strokeStyle = '#d8a64a'; ctx.lineWidth = 5 * U; ctx.beginPath(); for (let i = 0; i <= sc; i++) { const x = i * W / sc; if (!i) ctx.moveTo(x, H * .16); else ctx.quadraticCurveTo(x - W / sc / 2, H * .22, x, H * .16); } ctx.stroke();
    // the proscenium's sides
    for (const [x0, x1] of [[0, cx0], [cx1, W]]) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 20 * U; ctx.fillStyle = '#3d0a12'; ctx.fillRect(x0, 0, x1 - x0, H); ctx.restore(); ctx.fillStyle = '#d8a64a'; ctx.fillRect(x0 === 0 ? x1 - 5 * U : x0, H * .16, 5 * U, fl - H * .16); }
    ctx.globalAlpha = .22; ctx.fillStyle = ctx.createPattern(F.fibreTile(29), 'repeat'); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ─── the frame ───
  function drawLive(ctx, t) {
    YV.bg(ctx, V0);
    // A · the zoom into the salt
    if (t < A1 + .2) {
      const z = zA(t), m = Math.pow(10, z), shrink = easeIO(clamp((t - A0) / (A1 - A0)));
      drawTable(ctx, m, 1 - smooth((z - 2.3) / .2), 1 - .75 * smooth((z - 1.6) / .3) - .25 * smooth((z - 1.9) / .3));   // the grain turns glassy, then clear
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); drawLattice(ctx, z, smooth((z - 1.7) / .45) * (1 - smooth((t - A0) / .35)), t); ctx.restore();
      // the chloride ion becomes its cloud; then the cloud shrinks and moves to where the electron source will be
      const R0 = .36 * 90 * Math.pow(10, z - 3) * U, cA = smooth((z - 3.72) / .32);
      const [sx, sy] = fromApp(B.src, 0), cxp = lerp(W / 2, W / 2 + sx * U, shrink), cyp = lerp(H / 2, H / 2 + sy * U, shrink);
      if (cA > 0 && t < A1) drawCloud(ctx, cxp, cyp, lerp(R0, 26 * U, shrink), cA, t);
    }
    // B · the double slit; the electron source is the small cloud
    if (t >= A0) {
      const [sx, sy] = fromApp(B.src, 0), on = smooth((t - A1 + .1) / .2) * (1 - smooth((t - TWO + .6) / .5));
      if (on > 0) drawCloud(ctx, W / 2 + sx * U, H / 2 + sy * U, 26 * U, on, t);
      drawBench(ctx, t);
      const sp = smooth((t - SUPER + .05) / .4) * (1 - smooth((t - TWO + .5) / .4));
      if (sp > 0) say(ctx, 'সুপারপজিশন', 0, -SH + (P ? 110 : 95), P ? 66 : 72, sp, 'text', 700);
      if (t > A1 - .2 && t < FIRE1 + 1) say(ctx, 'ইলেকট্রন', ...(P ? [100, B.src] : [B.src, 78]), 34, smooth((t - A1 + .1) / .4) * (1 - smooth((t - FIRE1 - .4) / .5)) * .9, 'text', 500);
    }
    // C and D · the pair, then the bench that made them
    drawPair(ctx, t);
    drawLab(ctx, t);
    YV.post(ctx);
    const inA = 1 - smooth(t / .4); if (inA > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = inA; ctx.fillStyle = '#0b0718'; ctx.fillRect(0, 0, W, H); ctx.restore(); }   // out of scene 03's dark
  }
  function drawScene(ctx, t) {
    if (t < BUT) return drawLive(ctx, t);
    if (t < FOLD0) {   // everything stops mid-motion
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(frozen(), 0, 0);
      const k = 1 - smooth((t - BUT) / .25); if (k > 0) { ctx.globalAlpha = k * .35; ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H); }   // a blink as it freezes
      ctx.restore(); return;
    }
    drawTheatre(ctx); drawFold(ctx, t); YP.post(ctx);
  }

  // ─── sound effects, about 10 dB under the voice ───
  const LEVEL = .48;
  const SFX = [
    { t: 1.35, type: 'riser', dur: 2.6, f0: 200, f1: 1600, g: .2 },                                   // the zoom down into the salt
    { t: SYS - .2, type: 'shimmer', dur: 1.6, g: .14 },                                                // the electron cloud
    { t: A0, type: 'whoosh', dur: .7, g: .16 },                                                          // the cloud into the source
    { t: FIRE0, type: 'air', dur: 1.4, f0: 1200, f1: 700, peak: .4, g: .12 }, { t: FIRE1, type: 'air', dur: 1.4, f0: 1200, f1: 700, peak: .4, g: .1 },
    ...DOTS.filter((d, i) => i < 2 || i % 9 === 0).map(d => ({ t: d.t, type: 'tick', g: .06 })),             // the dots landing
    { t: SUPER, type: 'bloom', dur: 1.6, f: 294, g: .2 },
    { t: TWO - .05, type: 'impact', size: .5, f: 70, g: .28 }, { t: TWO, type: 'whizz', dur: 1.2, g: .16 },      // the flash, the two flying apart
    { t: TWO + .3, type: 'drone', dur: 9, f: 55, g: .3 },                                               // the pull-back into distance
    { t: TANGLE, type: 'bloom', dur: 1.6, f: 330, g: .16 }, { t: QE, type: 'bloom', dur: 2, f: 262, g: .2 },
    { t: LAB0, type: 'lampOn', g: .2 }, { t: LAB0 + .05, type: 'hum', dur: BUT - LAB0, g: .1 },
    ...[LAB0 + .4, ...PAIRS.map(p => p + .3)].filter(x => x < BUT).map(x => ({ t: x, type: 'clack', g: .08 })),   // the detectors firing together
    { t: TEST, type: 'titleHit', g: .18 },
    { t: BUT, type: 'clunk', g: .22 },                                                                  // everything stops
    { t: FOLD0, type: 'flip', g: .3 }, { t: FOLD1 - .05, type: 'tap', g: .16 }, { t: DROP0, type: 'swoosh', dur: .7, f0: 500, f1: 150, g: .16 },
  ].map(c => ({ ...c, g: c.g * LEVEL }));

  const fontsReady = Promise.race([
    Promise.all(['Hind Siliguri', 'Noto Serif Bengali'].flatMap(f => [500, 600, 700].map(wt => document.fonts.load(`${wt} 60px "${f}"`, 'কোয়ান্টাম সুপারপজিশন')))),
    new Promise(r => setTimeout(r, 5000)),
  ]);
  const label = t => { let s = ''; for (const x of T.words) if (x[1] <= t + 1e-6) s = x[0]; return s; };
  F.scene(ID, { W, H, duration: DUR, draw: (ctx, t) => { D.frameStart(); drawScene(ctx, t); }, ready: fontsReady, label, sfx: SFX, grain: 'frame' });
})();
