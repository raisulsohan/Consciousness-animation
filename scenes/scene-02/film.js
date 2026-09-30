// Scene 02 · The neuron forest (0:36.033–0:52.283 of voice/Death.mp3), plan v2, all ঘ cinematic depth.
// The title from scene 01 breaks into sparks over a forest at night whose trees are pyramidal neurons (the apical
// dendrite as trunk and crown, the cell body glowing at its foot, the axon down into the ground); the camera rises
// over a sea of them; a side-on chase of a nerve impulse jumping node to node along a myelinated axon ends at a
// synapse in slow motion; then signals rising toward the light splash on a pane of glass, and the drops run into
// the word "আমি" and a question mark.
(function () {
  'use strict';
  const F = FILM, S = F.sci, D = F.depth, { clamp, smooth, easeIO, easeOut, easeIn, lerp, env, keyed, noise1, hash, rng, TAU } = F;
  const ID = 'scene-02', T = window.TIMING[ID], DUR = T.duration;
  const { W, H, portrait: P } = F.format(), U = Math.min(W, H) / 1080;
  const YD = F.style25('depth', W, H);
  const norm = s => s.normalize('NFC').replace(/[।,?!—'"()\s]/g, '');
  const w = (word, n = 1) => { let k = 0; for (const x of T.words) if (norm(x[0]) === norm(word) && ++k === n) return x[1]; throw new Error(`${ID}: no word "${word}" (${n})`); };
  const DEEP = w('গভীর'), BILL = w('কোটি'), ELEC = w('বৈদ্যুতিক'), CHEM = w('রাসায়নিক'), HOW = w('কিন্তু'), FEELQ = w('অনুভূতি?'), AMI = w('আমি'), AMI2 = w('আমি', 2), KORI = w('করি?');
  const glow = (c, x, y, r, col, a) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, F.rgba(F.hex(col), a)); g.addColorStop(1, F.rgba(F.hex(col), 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const add = (ctx, f) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; f(); ctx.restore(); };

  // ═══ the forest of neurons ══════════════════════════════════════════════
  // A pyramidal neuron: an apical dendrite rising from the cell body and branching into a crown, short basal
  // dendrites around the body, and the axon going down. Built once per tree as paths by branch order.
  function neuron(seed) {
    const r = rng(seed), lv = [[], [], [], []], tips = [];
    const branch = (x, y, ang, len, depth, out) => {
      const pts = [[x, y]]; let a = ang, cx = x, cy = y;
      for (let i = 1; i <= 6; i++) { a += (r() - .5) * .35; cx += Math.cos(a) * len / 6; cy += Math.sin(a) * len / 6; pts.push([cx, cy]); }
      out[Math.min(3, 3 - depth)].push(pts);
      if (depth > 0) { const k = 2 + (r() < .35 ? 1 : 0); for (let j = 0; j < k; j++) branch(cx, cy, ang + (r() - .5) * 1.35, len * (.55 + r() * .18), depth - 1, out); }
      else tips.push([cx, cy]);
    };
    branch(0, 0, -Math.PI / 2 + (r() - .5) * .25, 480 + r() * 220, 3, lv);                                     // apical dendrite and crown
    for (let j = 0; j < 5; j++) branch(0, 0, Math.PI * (.08 + .84 * (j + r() * .5) / 5), 90 + r() * 70, 1, lv);   // basal dendrites
    const ax = [[0, 0]]; for (let i = 1; i <= 8; i++) ax.push([10 * noise1(i * .6, seed), i * 110]); lv[0].push(ax);   // the axon, down into the ground
    const paths = lv.map(list => { const p = new Path2D(); list.forEach(pts => pts.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y))); return p; });
    const all = lv.flat();
    return { paths, all, tips };
  }
  const TREES = (() => {
    const r = rng(77), list = [];
    for (let i = 0; i < 46; i++) {
      const z = 250 + Math.pow(r(), .8) * 6800, x = (r() - .5) * (1400 + z * .9);
      if (Math.abs(x) < 160 + z * .02 && z < 2400) continue;   // keep a flight path clear
      list.push({ x, y: 250, z, n: neuron(100 + i), i, tw: r() * 10 });
    }
    return list;
  })();
  const SEA = Array.from({ length: 450 },(_, i) => ({ x: (hash(i, 1) - .5) * 26000, z: 2500 + Math.pow(hash(i, 2), .6) * 30000, s: .6 + hash(i, 3) }));   // far cell bodies to the horizon
  const MOON = [0, -1500, 9000];

  function drawForest(ctx, v, t, a = 1) {
    // far cell bodies to the horizon, a sea of small lights
    for (const q of SEA) { const p = D.proj(v, q.x, 250, q.z); if (p && p.x > -20 && p.x < W + 20 && p.y > -20 && p.y < H + 20) YD.node(ctx, q.x | 0, p.x, p.y, 7 * q.s * p.s, 0, a * .8 * (1 - .7 * D.fog(v, p.d)) * (.6 + .4 * noise1(t * .7 + q.x, 5))); }
    const trees = TREES.filter(o => o.z > v.z + 60).sort((p, q) => q.z - p.z);
    for (const o of trees) {
      const p = D.proj(v, o.x, o.y, o.z); if (!p) continue;
      const R = 900 * p.s; if (p.x + R < 0 || p.x - R > W || p.y + R * 1.3 < 0 || p.y - R * 1.2 > H) continue;
      const bl = D.coc(v, p.d), al = a * (1 - .75 * D.fog(v, p.d)) / (1 + bl / 18);
      ctx.save(); ctx.setTransform(p.s, 0, 0, p.s, p.x, p.y); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const soft = bl / p.s;   // out of focus: a wider, fainter halo instead of a blur filter (much cheaper)
      o.n.paths.forEach((path, k) => {
        const wd = [7, 4.5, 3, 2][k];
        if (k < 2 && p.s > .15) { ctx.strokeStyle = `rgba(79,184,224,${.1 * al})`; ctx.lineWidth = wd * 4.5 + soft * 1.4; ctx.stroke(path); }   // the halo only on the trunk and first branches of nearer trees
        ctx.strokeStyle = `rgba(150,225,255,${.55 * al / (1 + bl / 6)})`; ctx.lineWidth = wd + soft * .5; ctx.stroke(path);
      });
      ctx.restore();
      YD.node(ctx, o.i, p.x, p.y, 20 * p.s, bl, al * 1.3 * (.8 + .2 * noise1(t * 1.2 + o.tw, 2)));   // the cell body
      for (let k = 0; k < 2; k++) {   // signals running up the dendrites
        const pts = o.n.all[(o.i * 7 + k * 5 + Math.floor(t / 1.7 + hash(o.i, k))) % o.n.all.length], u = ((t / 1.7 + hash(o.i, k)) % 1);
        const q = pts[Math.min(pts.length - 1, Math.floor(u * pts.length))], pp = D.proj(v, o.x + q[0], o.y + q[1], o.z);
        if (pp) YD.spark(ctx, pp.x, pp.y, 5 * pp.s, bl, al * Math.sin(Math.PI * u));
      }
    }
  }

  // the camera over the forest: low between the trees, then rising over the canopy to see the sea of lights
  const RISE0 = BILL - .1, RISE1 = ELEC - .15;
  function camF(t) {
    if (t < RISE0) { const k = t / RISE0; return D.view({ x: 120 * Math.sin(t * .4), y: 20, z: lerp(-300, 1200, k), focus: 900, aperture: 30, fogNear: 2500, fogFar: 16000 }, W, H); }
    const k = easeIO(clamp((t - RISE0) / (RISE1 - RISE0)));
    return D.view({ x: 120 * Math.sin(t * .4), y: lerp(20, -1500, k), z: lerp(1200, 2400, k), focus: lerp(900, 4000, k), aperture: 26, fogNear: 2500, fogFar: 22000 }, W, H);
  }

  // the title from scene 01, breaking into sparks that fall into the forest (0–1.4)
  const TITLE = ['মৃত্যুর', 'পর', 'কি', 'চেতনা', 'থাকে?'];
  const EMBERS = Array.from({ length: 160 }, (_, i) => ({ u: hash(i, 1), v: hash(i, 2), dx: (hash(i, 3) - .5) * 160, g: 380 + hash(i, 4) * 420, d: hash(i, 5) * .5, r: 1.5 + hash(i, 6) * 2.5 }));
  function drawTitleBreak(ctx, t) {
    if (t > 2.4) return;
    const size = (P ? 98 : 100) * U, gap = size * .3, rows = P ? [TITLE.slice(0, 3), TITLE.slice(3)] : [TITLE], a = 1 - smooth(t / .7);
    rows.forEach((row, ri) => {   // laid out exactly as scene 01 ends, so the cut is seamless
      const ws = row.map(s => YD.measure(ctx, s, size)), y = H / 2 + (ri - (rows.length - 1) / 2) * size * 1.35 - 10 * U;
      let x = W / 2 - (ws.reduce((p, q) => p + q, 0) + gap * (row.length - 1)) / 2;
      row.forEach((s, j) => { YD.hudText(ctx, s, x + ws[j] / 2, y, size, a, 'text', 700); x += ws[j] + gap; });
    });
    const uy = H / 2 + (rows.length * size * 1.35) / 2 + 18 * U; YD.hud(ctx, [[W / 2 - 70 * U, uy], [W / 2 + 70 * U, uy]], 3 * U, a, 'amber');
    const bw = (P ? 560 : 1100) * U, bh = rows.length * size * 1.2;
    for (const e of EMBERS) {
      const tt = t - e.d * .6; if (tt <= 0) continue;
      const x = W / 2 + (e.u - .5) * bw + e.dx * tt * U, y = H / 2 + (e.v - .5) * bh + .5 * e.g * tt * tt * U, al = smooth(tt / .15) * (1 - smooth((tt - .9) / .9));
      YD.spark(ctx, x, y, e.r * U, 0, al);
    }
  }

  function drawF(ctx, t) {
    const v = camF(t);
    YD.bg(ctx, v);
    drawForest(ctx, v, t, smooth((t + .3) / 1));
    const m = D.proj(v, ...MOON);   // the light of consciousness, found far above the canopy on "গভীর সম্পর্ক"
    if (m) { const k = smooth((t - DEEP + .2) / .8); YD.rays(ctx, m.x, m.y, 10 * m.s * 3, .5 * k, t); YD.light(ctx, m.x, m.y, 10 * m.s * 3, k); }
    const ka = smooth((t - BILL - .5) / .5) * (1 - smooth((t - RISE1 + .45) / .3));   // the count, on "কোটি কোটি নিউরন"
    YD.hudText(ctx, '≈ ৮,৬০০ কোটি নিউরন', W / 2, H * (P ? .84 : .82), 66 * U, ka, 'text', 700);
    drawDust(ctx, v, t, .7);
    YD.post(ctx);
    drawTitleBreak(ctx, t);
  }

  // ═══ the chase: a nerve impulse jumping along a myelinated axon, seen from the side; then the synapse ═══
  const XT = 0, NODE = 440, NJ = 10, E0 = ELEC - .15, E1 = CHEM - .2, AZ = 900;
  const jump = t => clamp(Math.floor((t - E0) / ((E1 - E0) / NJ)), -1, NJ);   // which node the impulse is at (saltatory conduction)
  function camAx(t) {
    const run = XT - NJ * NODE * (1 - clamp((t - E0) / (E1 - E0))) - 150;
    const x = t < E1 ? run : lerp(-150, XT + 300, easeOut(clamp((t - E1) / .9), 3));
    const z = t < CHEM ? 0 : lerp(0, 260, smooth((t - CHEM) / (HOW - CHEM)));
    return D.view({ x, y: 0, z, focus: AZ - z, aperture: 26 }, W, H);
  }
  const FIBRES = Array.from({ length: 9 }, (_, i) => ({ y: (hash(i, 1) - .5) * 1400, z: i < 2 ? 300 + i * 80 : 1700 + hash(i, 2) * 2600, th: 14 + hash(i, 3) * 20 }));
  const VES = Array.from({ length: 9 }, (_, i) => ({ x: XT + 150 + (hash(i, 1) - .6) * 170, y: (hash(i, 2) - .5) * 200, t: CHEM + .1 + i * .16, my: (hash(i, 3) - .5) * 160 }));
  const NT = VES.flatMap((ve, i) => Array.from({ length: 12 }, (_, j) => ({ i, j, dy: (hash(i, j) - .5) * 150, sp: .75 + hash(j, i) * .6, wob: hash(i + 3, j) * 10 })));
  const GAPL = XT + 150 + 170, GAPR = GAPL + 130;
  function drawAxon(ctx, t) {
    const v = camAx(t);
    YD.bg(ctx, v);
    for (const f of FIBRES) {   // other fibres behind and in front, streaking past
      const a = D.proj(v, v.x - 8000, f.y, f.z), b = D.proj(v, v.x + 8000, f.y, f.z); if (!a || !b) continue;
      const bl = D.coc(v, a.d); ctx.save(); if (bl > 1) ctx.filter = `blur(${(bl / 2).toFixed(1)}px)`;
      YD.hud(ctx, [[a.x, a.y], [b.x, b.y]], f.th * a.s, .35 * (1 - .6 * D.fog(v, a.d)), 'dim'); ctx.restore();
    }
    const J = jump(t), p0 = D.proj(v, 0, 0, AZ); if (!p0) return;
    ctx.save(); ctx.setTransform(p0.s, 0, 0, p0.s, p0.x, p0.y);   // world units along the axon, at its depth (p0 already carries the camera)
    for (let n = 0; n <= NJ + 6; n++) {
      const xn = XT - (NJ - n) * NODE; if ((xn - v.x) * p0.s > W || (xn - v.x + NODE) * p0.s < -W) continue;
      if (n < NJ) {   // the myelin sheath after this node
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(xn + 30, -40, NODE - 60, 80, 40) : ctx.rect(xn + 30, -40, NODE - 60, 80);
        ctx.fillStyle = 'rgba(120,200,235,.10)'; ctx.fill(); ctx.strokeStyle = 'rgba(160,225,255,.55)'; ctx.lineWidth = 3; ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(160,225,255,.8)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(xn - 32, 0); ctx.lineTo(xn + 32, 0); ctx.stroke();   // the bare axon at the node
      const since = J >= n ? (t - (E0 + n * (E1 - E0) / NJ)) : -1;
      if (since >= 0 && n <= NJ) add(ctx, () => { glow(ctx, xn, 0, 150, '#8ff0ff', .9 * Math.exp(-since * 5)); glow(ctx, xn, 0, 50, '#ffffff', .9 * Math.exp(-since * 9)); });   // the flash at each node it reaches
    }
    // the terminal, the gap, the next cell
    ctx.fillStyle = 'rgba(120,200,235,.12)'; ctx.strokeStyle = 'rgba(160,225,255,.7)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(XT + 150, 0, 170, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(GAPR + 600, -420); ctx.quadraticCurveTo(GAPR - 40, -300, GAPR, 0); ctx.quadraticCurveTo(GAPR - 40, 300, GAPR + 600, 420); ctx.lineTo(GAPR + 1400, 420); ctx.lineTo(GAPR + 1400, -420); ctx.closePath();
    ctx.fillStyle = 'rgba(120,200,235,.08)'; ctx.fill(); ctx.stroke();
    const REC = Array.from({ length: 9 }, (_, i) => -200 + i * 50);
    for (const y of REC) {   // receptors on the next cell, lighting up as the transmitters land
      const hits = NT.filter(n => { const tt = t - VES[n.i].t - .35; return tt > 0 && Math.abs(VES[n.i].my + n.dy - y) < 26 && tt * n.sp * 130 > 110; }).length;
      const xr = GAPR - 8 + Math.abs(y) * .07; ctx.fillStyle = hits ? '#ffd27a' : 'rgba(160,225,255,.6)';
      ctx.fillRect(xr - 6, y - 12, 12, 24); if (hits) add(ctx, () => glow(ctx, xr, y, 60, '#ffc85a', Math.min(.8, .25 * hits)));
    }
    for (const ve of VES) {   // vesicles move to the membrane, open, and release the transmitter across the gap
      const m = easeIO(clamp((t - ve.t) / .35)), x = lerp(ve.x, GAPL - 24, m), y = lerp(ve.y, ve.my, m), open = clamp((t - ve.t - .35) / .25);
      if (open < 1) { ctx.strokeStyle = 'rgba(255,214,140,.9)'; ctx.fillStyle = 'rgba(255,200,110,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 20, open * Math.PI * .9, TAU - open * Math.PI * .9); ctx.fill(); ctx.stroke(); }
    }
    for (const n of NT) {
      const ve = VES[n.i], tt = t - ve.t - .35; if (tt <= 0) continue;
      const x = Math.min(GAPR - 14, GAPL - 10 + tt * n.sp * 130), y = ve.my + n.dy * clamp(tt * 1.5) + 8 * Math.sin(tt * 3 + n.wob);
      add(ctx, () => { glow(ctx, x, y, 11, '#ffc85a', .3); ctx.fillStyle = 'rgba(255,241,201,.85)'; ctx.beginPath(); ctx.arc(x, y, 3.2, 0, TAU); ctx.fill(); });
    }
    ctx.restore();
    // the impulse itself, bright at its node (before it reaches the terminal)
    if (J >= 0 && J <= NJ) { const q = D.proj(v, XT - (NJ - J) * NODE, 0, AZ); if (q) YD.spark(ctx, q.x, q.y, 14 * q.s, 0, t < E1 + .2 ? 1 : 0); }
    drawDust(ctx, v, t, .6);
    YD.post(ctx);
  }

  // ═══ signals rise toward the light and splash on a pane of glass; the drops run into "আমি" and "?" ═══
  const GZ = 1900, GLIGHT = [0, -950, 5200];
  const SIG = Array.from({ length: 85 }, (_, i) => {
    const late = i >= 70, t0 = late ? AMI2 - .2 + (i - 70) * .045 : HOW - .3 + (i / 70) * (FEELQ + .5 - HOW + .3);
    const s = [(hash(i, 1) - .5) * 2600, 250, 300 + hash(i, 2) * 1300], u = (GZ - s[2]) / (GLIGHT[2] - s[2]);
    const hit = [lerp(s[0], GLIGHT[0], u) + (hash(i, 3) - .5) * 700, lerp(s[1], GLIGHT[1], u) - 300 * Math.sin(Math.PI * u) + (hash(i, 4) - .5) * 300, GZ];
    return { i, t0, s, hit, th: t0 + 1.1, late };
  });
  const DROPS = SIG.flatMap(s => [0, 1, 2, 3].map(k => ({ s, k, dx: (hash(s.i, k + 10) - .5) * 70, dy: (hash(s.i, k + 20) - .5) * 50, slide: 12 + hash(s.i, k + 30) * 30 })));
  let TARGETS = null;   // points of "আমি" and "?" in glass-plane units, sampled once the font is ready
  function targets() {
    if (TARGETS) return TARGETS;
    const sample = (txt, size, n, ox) => {
      const [c, x] = F.canvas(size * 3, size * 1.6); x.font = YD.fontOf(size, 700); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.fillText(txt, c.width / 2, c.height / 2);
      const d = x.getImageData(0, 0, c.width, c.height).data, pts = [];
      for (let y = 0; y < c.height; y += 7) for (let xx = 0; xx < c.width; xx += 7) if (d[(y * c.width + xx) * 4 + 3] > 140) pts.push([xx - c.width / 2 + ox, y - c.height / 2]);
      const out = []; for (let k = 0; k < n; k++) out.push(pts[Math.floor(k * pts.length / n)] || [ox, 0]);
      return out;
    };
    const nA = DROPS.filter(d => !d.s.late).length, nQ = DROPS.length - nA;
    TARGETS = [...sample('আমি', 380, nA, -90), ...sample('?', 380, nQ, 330)];
    return TARGETS;
  }
  function camG(t) { const k = (t - HOW) / (DUR - HOW); return D.view({ x: 90 * Math.sin(t * .3), y: 40, z: lerp(-250, 150, k), focus: GZ - lerp(-250, 150, k), aperture: 20, fogNear: 2500, fogFar: 16000 }, W, H); }
  function drawGlass(ctx, t) {
    const v = camG(t);
    YD.bg(ctx, v);
    drawForest(ctx, v, t, .55);
    const m = D.proj(v, ...GLIGHT);
    if (m) { YD.rays(ctx, m.x, m.y, 30 * m.s, .6, t); YD.light(ctx, m.x, m.y, 30 * m.s, 1); }
    const g0 = D.proj(v, 0, -300, GZ);   // the glass: a faint sheen, only the splashes show it is there
    if (g0) add(ctx, () => { const gr = ctx.createLinearGradient(0, 0, W, H); gr.addColorStop(.35, 'rgba(160,230,255,0)'); gr.addColorStop(.5, 'rgba(160,230,255,.05)'); gr.addColorStop(.62, 'rgba(160,230,255,0)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); });
    for (const s of SIG) {   // signals in flight
      if (t < s.t0 || t > s.th) continue;
      const u = (t - s.t0) / (s.th - s.t0), x = lerp(s.s[0], s.hit[0], u), z = lerp(s.s[2], s.hit[2], u), y = lerp(s.s[1], s.hit[1], u) - 120 * Math.sin(Math.PI * u), p = D.proj(v, x, y, z);
      if (p) YD.spark(ctx, p.x, p.y, 7 * p.s, D.coc(v, p.d), .9);
      const bs = D.proj(v, s.s[0], s.s[1], s.s[2]); if (bs && u < .3) YD.node(ctx, 0, bs.x, bs.y, 18 * bs.s, D.coc(v, bs.d), (1 - u / .3) * .8);
    }
    for (const s of SIG) {   // splash rings on the glass
      const tt = t - s.th; if (tt < 0 || tt > .6) continue;
      const p = D.proj(v, s.hit[0], s.hit[1], GZ); if (!p) continue;
      add(ctx, () => { ctx.strokeStyle = `rgba(160,235,255,${.7 * (1 - tt / .6)})`; ctx.lineWidth = 2 * U; ctx.beginPath(); ctx.ellipse(p.x, p.y, 70 * tt / .6 * p.s * 1.4, 70 * tt / .6 * p.s, 0, 0, TAU); ctx.stroke(); });
    }
    const TG = t > AMI - .3 ? targets() : null;
    DROPS.forEach((d, j) => {   // the drops: they stick, slide a little, then run into the word
      const th = d.s.th; if (t < th) return;
      let x = d.s.hit[0] + d.dx, y = d.s.hit[1] + d.dy + d.slide * Math.min(t - th, 3);
      if (TG) {
        const go = d.s.late ? KORI - .45 : AMI + j * .0028, k = easeIO(clamp((t - go) / .95));
        if (k > 0) { const [tx, ty] = TG[j]; x = lerp(x, tx, k); y = lerp(y, ty - 250, k) + 40 * Math.sin(Math.PI * k) * (hash(j, 5) - .3); }
      }
      const p = D.proj(v, x, y, GZ); if (!p) return;
      const formed = TG ? smooth((t - (d.s.late ? KORI : AMI2)) / .4) : 0;
      YD.spark(ctx, p.x, p.y, 6 * p.s, 0, .85 - .45 * formed);   // the drops dim as the crisp word takes over
    });
    // once the drops have run into place, the word itself, crisp, so it reads at once
    const fa = smooth((t - AMI2 + .05) / .45), fq = smooth((t - KORI + .05) / .4);
    if (fa > 0) D.plane(ctx, v, -90, -250, GZ - 5, 420, 220, c => YD.text(c, 'আমি', 380, fa), { fog: 0 });
    if (fq > 0) D.plane(ctx, v, 330, -250, GZ - 5, 160, 220, c => YD.text(c, '?', 380, fq), { fog: 0 });
    drawDust(ctx, v, t, .5);
    YD.post(ctx);
  }

  // dust in a box that travels with the camera
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

  const [FXC, FXX] = F.canvas(W, H);
  function drawScene(ctx, t) {
    if (t < E0) drawF(ctx, t); else if (t < HOW) drawAxon(ctx, t); else drawGlass(ctx, t);
    const fl = env(t, E0 - .12, E0, E0 + .02, E0 + .3);   // a cyan flash as the camera dives onto the axon
    if (fl > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .85 * fl; ctx.fillStyle = '#bff3ff'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    const cf = 1 - smooth((t - HOW) / .5);   // the synapse dissolves into the forest and the glass
    if (t >= HOW && cf > 0) {
      FXX.setTransform(1, 0, 0, 1, 0, 0); FXX.globalAlpha = 1; FXX.globalCompositeOperation = 'source-over'; FXX.filter = 'none';
      drawAxon(FXX, t);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = cf; ctx.drawImage(FXC, 0, 0); ctx.restore();
    }
  }

  const LEVEL = .48;
  const SFX = [
    { t: .05, type: 'drone', dur: E0, f: 55, g: .45 },
    { t: .02, type: 'air', dur: 1.4, f0: 2000, f1: 600, g: .16 },                       // the title falling as embers
    { t: .4, type: 'spark', dur: E0 - .5, rate: 4, g: .18 },
    { t: DEEP - .1, type: 'bloom', dur: 2, f: 262, g: .28 },                             // the light above the canopy
    { t: RISE0, type: 'swoosh', dur: RISE1 - RISE0, f0: 200, f1: 700, peak: .6, g: .3 },  // rising over the canopy
    { t: E0 - .15, type: 'whizz', dur: .35, f0: 2600, f1: 900, g: .28 },                 // the dive onto the axon
    ...Array.from({ length: NJ + 1 }, (_, n) => ({ t: E0 + n * (E1 - E0) / NJ, type: 'tick', g: .28 })),   // each node the impulse jumps to
    { t: E0, type: 'swoosh', dur: E1 - E0 + .3, f0: 700, f1: 1400, pan0: -.6, pan1: .6, g: .25 },
    ...VES.map(ve => ({ t: ve.t + .35, type: 'pop', g: .12 })),                            // vesicles opening
    { t: CHEM, type: 'shimmer', dur: 2.2, g: .14 },
    { t: HOW - .1, type: 'air', dur: .8, f0: 500, f1: 1200, g: .14 },
    ...SIG.filter((s, i) => i % 6 === 0).map(s => ({ t: s.th, type: 'tap', g: .1, pan: clamp(s.hit[0] / 1500, -1, 1) })),   // splashes on the glass
    { t: AMI, type: 'air', dur: 1.2, f0: 800, f1: 1800, peak: .7, g: .14 }, { t: AMI2 + .2, type: 'bloom', dur: 1.6, f: 330, g: .22 },
    { t: KORI - .1, type: 'tap', g: .16 },
  ].map(c => ({ ...c, g: c.g * LEVEL }));

  const fontsReady = Promise.race([
    Promise.all(['Hind Siliguri', 'Noto Serif Bengali'].flatMap(f => [500, 600, 700].map(wt => document.fonts.load(`${wt} 60px "${f}"`, 'মৃত্যু বিজ্ঞান আমি')))),
    new Promise(r => setTimeout(r, 5000)),
  ]);
  const label = t => { let s = ''; for (const x of T.words) if (x[1] <= t + 1e-6) s = x[0]; return s; };
  F.scene(ID, { W, H, duration: DUR, draw: (ctx, t) => { D.frameStart(); drawScene(ctx, t); }, ready: fontsReady, label, sfx: SFX, grain: 'frame' });
})();
