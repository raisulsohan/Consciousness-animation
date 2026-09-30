// Scene 07 · The broken bridge (2:36.116–3:10.250 of voice/Death.mp3), v1 (2026-09-29). It opens on scene 06's last
// frame, pixel for pixel: the grey, still microtubule side-on, the outlined "প্রমাণিত নয়" badge and the corner chip. The
// camera pulls back and that frame turns out to be the picture on a glass card, "মস্তিষ্কে কোয়ান্টাম প্রভাব" with a
// solid "থাকতেই পারে"; the colour comes back to it and the amber light leaves the tube for a second card across a gap,
// "চেতনার মূল উৎস". A dashed bridge of planks builds toward it and breaks midway, the planks tumbling into the dark
// ("কোয়ান্টাম প্রক্রিয়াই", a claim). The camera rises: far beyond floats a dashed card, "মৃত্যুর পর চেতনা?" (a flat heart
// line under the light), and the outlined "প্রমাণ নেই" stamps under it. Three solid steps rise out of the dark toward
// it, each with its icon from scene 04 and a tick: সুপারপজিশন, এনট্যাঙ্গেলমেন্ট, কোয়ান্টাম জগত অদ্ভুত. A fourth, dashed
// and standing on nothing, fills with "স্মৃতি, ব্যক্তিত্ব, আমিত্ব মৃত্যুর পর টিকে থাকে", cracks as it is said and breaks
// apart into the dark; the three ticks remain. The motion language of scenes 05 v2 and 06 (parallax depth, glass cards,
// staggered reveals, badges), not the papercut the plan had; solid line = fact, dashed = claim.
(function () {
  'use strict';
  const F = FILM, D = F.depth, { clamp, smooth, easeIO, easeOut, easeIn, easeOutBack, lerp, keyed, noise1, hash, rng, TAU } = F;
  const ID = 'scene-07', T = window.TIMING[ID], DUR = T.duration;
  const { W, H, portrait: P } = F.format(), U = Math.min(W, H) / 1080;
  const YV = F.style25('vector', W, H), YD = F.style25('depth', W, H);
  const norm = s => s.normalize('NFC').replace(/[।,?!—'"()\s]/g, '');
  const w = (word, n = 1) => { let k = 0; for (const x of T.words) if (norm(x[0]) === norm(word) && ++k === n) return x[1]; throw new Error(`${ID}: no word "${word}" (${n})`); };
  const BRAIN = w('মস্তিষ্কে'), QU1 = w('কোয়ান্টাম'), EFFECT = w('প্রভাব'), CAN = w('থাকতেই'), MAY = w('পারে');
  const FROM = w('সেখান'), NO = w('না'), QU2 = w('কোয়ান্টাম', 2), PROC = w('প্রক্রিয়াই'), MIND = w('চেতনার'), ROOT = w('মূল'), SOURCE = w('উৎস');
  const AND = w('আর'), FROM2 = w('সেখান', 2), MORE = w('আরও'), BIG = w('বড়'), QUESTION = w('প্রশ্ন'), DEATH = w('মৃত্যুর'), AFTER = w('পরও'), MIND2 = w('চেতনা'), ASKS = w('থাকে');
  const CLAIM = w('দাবির'), PROOF = w('প্রমাণ'), NONE = w('নেই');
  const SUPER = w('সুপারপজিশন'), HAS1 = w('আছে'), ENT = w('এনট্যাঙ্গেলমেন্ট'), HAS2 = w('আছে', 2), QU3 = w('কোয়ান্টাম', 3), WORLD = w('জগত'), WEIRD = w('অদ্ভুত');
  const BUT2 = w('কিন্তু', 2), NONEOF = w('কোনোটাই'), PROVE = w('প্রমাণ', 2), MEM = w('স্মৃতি'), PERS = w('ব্যক্তিত্ব'), SELF = w('আমিত্ব');
  const DEATH2 = w('মৃত্যুর', 2), AFTER2 = w('পর'), QU4 = w('কোয়ান্টাম', 4), SURV2 = w('টিকে', 2), STAYS2 = w('থাকে', 2);
  const glow = (c, x, y, r, col, a) => { if (a <= .004 || r <= 0) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, F.rgba(F.hex(col), a)); g.addColorStop(1, F.rgba(F.hex(col), 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const expo = x => 1 - Math.pow(2, -10 * clamp(x));                       // the ease of a product page: fast out, soft landing
  const rise = (t, t0, d = .55) => expo((t - t0) / d);                      // an element's reveal, 0..1
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); };
  const AMBER = '#ffc93c', MINT = '#3ff0d0', PINK = '#ff5fa2', BLUE = '#7aa7ff';

  // ═══ the glass UI of scene 06 (its painters, as they were) ═══
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

  // ═══ scene 06's last frame: its code, run at its own end (t6, its duration), where everything has stood still since
  // "কিন্তু". Painted once: the tube world with and without its light, and the corner chip; the grey and the badge are
  // laid on as scene 06 laid them, so the first frame here is its last ═══
  const S6 = (() => {
    // scene 06's word times (scenes/scene-06/timing.js) and scene 05's clock, as scene 06 read them
    const AND = 2.75, AN = 6.5, TALKED = 6.95, IDEA = 7.534, NAME = 9.634, ORCH = 9.95, OBJ = 10.784, RED = 11.6, SHORT = 12.85, ORCHOR = 13.417, ORCHOR2 = 14.35, THEIR = 15.184;
    const INSIDE = 17.584, MT = 18.317, TINY = 20.084, MIND = 24.65, THEORY = 26.934, BUT = 29.434, PROVEN = 31.6, NOT = 32.134, t6 = 32.95;
    const T5 = (window.TIMING || {})['scene-05'], DUR5 = T5 ? T5.duration : 20.883, g5 = t => t + DUR5;
    // the corner chip "Orch-OR · তত্ত্ব" (scene 06's drawIdea at its end)
    const PAN0 = AND - .45, PAN1 = PAN0 + .95, CP = P ? [0, -190] : [-455, 60];
    const IDW = P ? 940 : 1060, IDH = P ? 520 : 440, IDP = P ? [0, 70] : [0, 150];
    const uiCam = t => { const k = keyed(t, [[PAN0, 0], [PAN1, 1]]); return P ? [0, lerp(CP[1], 0, k)] : [lerp(CP[0], 0, k), 0]; };
    const sway = (t, d) => { const tg = g5(t); return [(P ? 8 : 16) * Math.sin(tg * .35) * d, 9 * Math.sin(tg * .5) * d]; };
    const uiPt = (t, x, y, d) => { const [ux, uy] = uiCam(t), [sx, sy] = sway(t, d); return [W / 2 + (x - ux + sx) * U, H / 2 + (y - uy + sy) * U]; };
    const OPEN0 = AN - .05, AWAY0 = THEIR - .05, AWAY1 = AWAY0 + .85;
    const KW = [['Orchestrated', ORCH, 4], ['Objective', OBJ, 1], ['Reduction', RED, 1]];
    const FD0 = SHORT + .02, FD1 = FD0 + .6, TS = P ? 80 : 84, TS2 = P ? 124 : 132, TY = P ? 40 : 34;
    const HUDH = 66, HUDW = 318, HUD = [44 + HUDW / 2, 44 + HUDH / 2];
    let GLY = null;
    function glyphs(c) {
      if (GLY) return GLY;
      const font = s => YV.fontOf(s, 700), mw = (s, size) => { c.save(); c.font = font(size); const x = c.measureText(s).width; c.restore(); return x; };
      const words = KW.map(([s]) => ({ s, w: mw(s, TS), xs: [...s].map((_, i) => mw(s.slice(0, i), TS)), ws: [...s].map(ch => mw(ch, TS)) }));
      const tgt = 'Orch-OR', tw = mw(tgt, TS2), txs = [...tgt].map((_, i) => mw(tgt.slice(0, i), TS2) - tw / 2), tws = [...tgt].map(ch => mw(ch, TS2));
      return (GLY = { words, txs, tws, tw });
    }
    function drawTitle(c, t, a, size2 = TS2) {
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
      const hk = smooth((fk - .55) / .45); if (hk > 0) { c.save(); c.font = YV.fontOf(size2, 700); c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = F.rgba(F.hex(AMBER), a * hk); c.fillText('-', G.txs[4] * sc, 0); c.restore(); }
      return G.tw * sc;
    }
    function drawIdea(ctx, t) {
      const open = expo((t - OPEN0) / .7); if (open <= .004) return;
      const away = easeIO((t - AWAY0) / (AWAY1 - AWAY0)), [ix, iy] = uiPt(t, IDP[0], IDP[1], .85);
      const cx = lerp(ix, HUD[0] * U, away), cy = lerp(iy, HUD[1] * U, away), w = lerp(lerp(220, IDW, open), HUDW, away), h = lerp(lerp(280, IDH, open), HUDH, away);
      ctx.save(); ctx.setTransform(U, 0, 0, U, cx, cy);
      glass(ctx, w, h, smooth(open * 2), lerp(40, HUDH / 2, away), true);
      const full = 1 - smooth(away / .5), c = ctx;
      const up = easeIO((t - (NAME - .15)) / .6), ks = lerp(58, 34, up), kick = [['আলোচিত', TALKED], ['ধারণা', IDEA]], kws = kick.map(([s]) => YV.measure(c, s, ks, 600)), kt = kws[0] + kws[1] + ks * .3, ky = lerp(0, -IDH / 2 + 58, up);
      let kx = -kt / 2; kick.forEach(([s, t0], i) => { const k = smooth((t - t0 + .05) / .35); say(c, s, kx + kws[i] / 2, ky + 12 * (1 - k), ks, full * open * k * lerp(1, .85, up)); kx += kws[i] + ks * .3; });
      const tSize = lerp(TS2, 36, away), tx = lerp(0, -HUDW / 2 + 26 + glyphs(c).tw * 36 / TS2 / 2, away), ty = lerp(TY, 0, away);
      c.save(); c.translate(tx, ty); drawTitle(c, t, open, tSize); c.restore();
      say(c, 'অর্ক-ওআর', 0, TY + TS2 * .72, 40, full * smooth((t - ORCHOR + .05) / .4) * .7, { weight: 500 });
      tag(c, lerp(-IDW / 2 + 40, HUDW / 2 - 104, away), lerp(-IDH / 2 + 56, 0, away), ORCHOR2, t, open, lerp(32, 24, away));
      ctx.restore();
    }
    // the tube world (scene 06's drawW2 at its end: only the hero tube is left, side-on around the light, no flicker)
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
    const MR = 300, MN = 13, MDZ = 96, MHX = 22;
    const sphere = (lite, mid, dark) => (x, r) => { const g = x.createRadialGradient(-r * .3, -r * .35, r * .05, 0, 0, r); g.addColorStop(0, lite); g.addColorStop(.5, mid); g.addColorStop(.9, dark); g.addColorStop(1, F.rgba(F.hex(dark), 0)); x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill(); };
    const SA = D.sprites(sphere('#b4ecff', '#45aad4', '#0b3448')), SB = D.sprites(sphere('#aebfff', '#3558bf', '#0d1b50'));
    const HERO = { x: 0, y: 0, z0: 0, roll: 0, hero: true };
    const DV1 = INSIDE + .05, E0 = DV1 - .2, GO = TINY + .17, VT = 1300, AT = .7, ZA = -1150;
    const SW0 = MT + .25, SW1 = TINY - .05, A0 = P ? .55 : .8, B0 = P ? .55 : .38;
    const COL1 = MIND, OUT0 = THEORY, OUT1 = BUT - .1, GREY = BUT, YAW = P ? 1.2 : 1.25, ROLL = P ? -.62 : -.22;
    const sGo = tau => tau <= 0 ? 0 : tau < AT ? VT * AT * (Math.pow(tau / AT, 3) - Math.pow(tau / AT, 4) / 2) : VT * (tau - AT / 2);
    const zAt = t => {
      if (t < GO) return lerp(-4200, ZA, easeOut((t - E0) / (GO - E0), 2));
      if (t < COL1) return ZA + sGo(t - GO);
      const zm = ZA + sGo(COL1 - GO), tt = 2 * 1000 / VT;
      return lerp(zm, zm + 1000, easeOut((t - COL1) / tt, 2));
    };
    const LZ = ZA + sGo(COL1 - GO) + 2300;
    const still = t => Math.min(t, GREY + .15);
    function camM(t) {
      const ts = still(t), k = easeIO((t - E0) / (GO - E0 + .3)), out = easeIO((t - OUT0) / (OUT1 - OUT0)), wob = (1 - out) * smooth((t - GO - .5) / .8);
      const x = lerp(P ? 200 : 380, 0, k) + 22 * Math.sin(ts * .7) * wob, y = lerp(P ? -200 : -170, 0, k) + 16 * Math.sin(ts * .55) * wob;
      const z = t < OUT0 ? zAt(t) : lerp(zAt(OUT0), LZ - (P ? 2500 : 2300), out);
      const fm = t < GO ? Math.max(500, -z) : t < OUT0 ? 800 : lerp(800, LZ - z, out);
      return D.view({ x, y, z, focus: fm, aperture: 14, maxBlur: 26, fogNear: 1500, fogFar: 7400 }, W, H);
    }
    const orient = t => { const k = easeIO((t - SW0) / (SW1 - SW0)), s = easeIO((t - OUT0 - .25) / (OUT1 - OUT0 - .25)); return { a: A0 * (1 - k), b: B0 * (1 - k), s }; };
    function place(tube, O, lx, ly, lz) {
      let x = lx + tube.x, y = ly + tube.y, z = lz + tube.z0;
      if (O.b) { const cb = Math.cos(O.b), sb = Math.sin(O.b), y1 = y * cb - z * sb; z = y * sb + z * cb; y = y1; }
      if (O.a) { const ca = Math.cos(O.a), sa = Math.sin(O.a), x1 = x * ca + z * sa; z = -x * sa + z * ca; x = x1; }
      if (tube.hero && O.s > 0) {
        const a = YAW * O.s, r = ROLL * O.s, dz = z - LZ, x1 = x * Math.cos(a) + dz * Math.sin(a), z1 = -x * Math.sin(a) + dz * Math.cos(a);
        x = x1 * Math.cos(r) - y * Math.sin(r); y = x1 * Math.sin(r) + y * Math.cos(r); z = z1 + LZ;
      }
      return [x, y, z];
    }
    const LV = [0, .15, .35, .7, 1.2, 2];
    function bead1(ctx, set, x, y, rr, b, a) {
      if (a <= .004) return;
      const f = b / rr; let i = 0; while (i < 5 && LV[i + 1] <= f) i++; if (i < 5 && f - LV[i] > LV[i + 1] - f) i++;
      const s = set[i], e = s.pad * rr / s.r; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(s.c, x - e, y - e, 2 * e, 2 * e);
    }
    function drawTubes(ctx, v, t) {   // scene 06's drawTubes at its end: the others have gone, the flicker and the collapse front are over
      const ts = still(t), O = orient(t), list = [], tube = HERO;
      const br = lerp(64, 78, smooth((t - GO - .7) / .6) * (1 - O.s));
      const roll = tube.roll + .05 * ts, k1 = Math.floor(9000 / MDZ);
      for (let i = 0; i < MN; i++) {
        const th = i / MN * TAU + roll, cs = MR * Math.cos(th), sn = MR * Math.sin(th);
        for (let k = 0; k <= k1; k++) {
          const lz = k * MDZ + i * MHX, [wx, wy, wz] = place(tube, O, cs, sn, lz), p = D.proj(v, wx, wy, wz);
          if (!p || p.d < 40 || p.d > v.fogFar) continue;
          const rr = br * p.s; if (rr < 1.4 || p.x < -rr * 2 || p.x > W + rr * 2 || p.y < -rr * 2 || p.y > H + rr * 2) continue;
          const al = 1 * (1 - D.fog(v, p.d)) * smooth((p.d - 60) / 240); if (al < .02) continue;
          list.push([p.d, p.x, p.y, rr, D.coc(v, p.d), al, k % 2]);
        }
      }
      list.sort((m, n) => n[0] - m[0]);
      ctx.save(); for (const [, x, y, rr, b, al, tn] of list) bead1(ctx, tn ? SB : SA, x, y, rr, b, al); ctx.restore();
    }
    let LIGHT = null;
    function world(ctx, light) {
      const t = t6, v = camM(t), gk = smooth((t - GREY) / .6);
      YD.bg(ctx, v);
      drawTubes(ctx, v, t);
      const lp = D.proj(v, 0, 0, LZ), lk = t < COL1 ? 0 : Math.min(1, (t - COL1) / .2) * (1 + .7 * Math.exp(-(t - COL1) * 2.5)) * lerp(1, .4, gk);
      if (lp && lk > 0) { const lr = 20 * lp.s * (1 + .9 * orient(t).s); if (light) { YD.rays(ctx, lp.x, lp.y, lr, .5 * lk, still(t)); YD.light(ctx, lp.x, lp.y, lr, lk); } LIGHT = { x: lp.x, y: lp.y, r: lr, k: lk }; }
      drawDust(ctx, v, g5(still(t)), .5);
      YD.post(ctx);
    }
    // painted once, when the fonts are in: the tube with its light (the first frames), without it (once the light has
    // left), smaller copies of that (the picture seen small), and the chip
    let TL = null, TN = null, TN2 = null, TN4 = null, CHIP = null;
    function frames() {
      if (TL) return;
      const mk = light => { const [c, x] = F.canvas(W, H); world(x, light); return c; };
      TL = mk(true); TN = mk(false);
      const half = (src, k) => { const [c, x] = F.canvas(Math.ceil(W * k), Math.ceil(H * k)); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, c.width, c.height); return c; };
      TN2 = half(TN, .5); TN4 = half(TN2, .5);
      const [c, x] = F.canvas(W, H); drawIdea(x, t6); CHIP = c;
    }
    // the badge, as scene 06 stamped it (relative to the current transform: the picture's, which is the frame's at first)
    function badge(c, a) { if (a <= .004) return; c.save(); c.transform(U, 0, 0, U, W / 2, H / 2); pill(c, ['প্রমাণিত', 'নয়'], [PROVEN, NOT], t6, 0, H / 2 / U - (P ? 180 : 150), 58, a, true, badgeK(t6, PROVEN)); c.restore(); }
    return { frames, badge, img: () => ({ TL, TN, CHIP }), small: k => k > .62 ? TN : k > .31 ? TN2 : TN4, light: () => LIGHT, grey: gk => `saturate(${(1 - .93 * gk).toFixed(3)}) brightness(${(1 - .2 * gk).toFixed(3)})` };
  })();

  // ═══ the layout: glass cards on the card plane (z Z0, 1:1 when the camera rests at z 0); the picture on card A is
  // scene 06's frame at 1/R of its size ═══
  const Z0 = 1000, IZ = 1800, R = 5, TW = W / U / R, TH = H / U / R;
  const A = P ? { x: -370, y: -90, w: 280, h: 478 } : { x: -580, y: -30, w: TW + 40, h: 444 }, B = { ...A, x: -A.x };
  const TILEY = -A.h / 2 + 20 + TH / 2, TBOT = -A.h / 2 + 20 + TH;           // the picture's centre and bottom, card-local
  const LN1 = TBOT + (P ? 42 : 46), LN2 = LN1 + (P ? 42 : 48), TSZ = P ? 32 : 40, PILY = LN2 + (P ? 58 : 64), PISZ = P ? 26 : 30;
  const TILE = [A.x, A.y + TILEY];                                             // the picture's centre, in the world
  const CC = P ? [0, -1500] : [0, -1300];                                     // the camera over the steps (section C); section A's is [0, 0]
  const ISL = P ? { x: 0, y: CC[1] - 440 * IZ / Z0, w: 900, h: 520 } : { x: 470 * IZ / Z0, y: CC[1] - 320 * IZ / Z0, w: 940, h: 520 };   // the far card, where it shows over the steps
  const CB = [ISL.x, ISL.y + (P ? 150 : 120), P ? 600 : 650];                // section B's camera: near the far card, it a little above the middle
  const CAZ = P ? 0 : 100;                                                     // section A's camera (16:9 a little nearer the cards)

  // ─── the camera: the pull-back (scene 06's frame shrinks into its card), the rise to the far card, the pull back over the steps ───
  const PB1 = 1.45, RISE0 = AND + .05, RISE1 = RISE0 + 1.75, PUSH1 = RISE0 + 2.4, BACK0 = NONE + .02, BACK1 = BACK0 + .65;
  const swift = u => { u = clamp(u); return 1 - Math.pow(1 - u, 3) * (1 + 3 * u); };   // starts at rest, quick early, a long soft landing
  function cam(t) {
    const k = swift(t / PB1), d = 200 * Math.pow((Z0 - CAZ) / 200, k);       // the distance grows by the same factor each moment: an even zoom out
    let x = lerp(TILE[0], 0, k), y = lerp(TILE[1], 0, k), z = Z0 - d;
    const r = easeIO((t - RISE0) / (RISE1 - RISE0)), rz = easeIO((t - RISE0 - .5) / (PUSH1 - RISE0 - .5)), b = easeIO((t - BACK0) / (BACK1 - BACK0));   // up first, then in (the cards are gone by then)
    x = lerp(lerp(x, CB[0], r), CC[0], b); y = lerp(lerp(y, CB[1], r), CC[1], b); z = lerp(lerp(z, CB[2], rz), 0, b);
    const sw = smooth((t - .8) / 1.2); x += (P ? 8 : 16) * Math.sin(t * .35) * sw; y += 9 * Math.sin(t * .5) * sw;   // a slow sway: the layers slide at their own rates
    const fz = keyed(t, [[RISE0, Z0], [RISE1, IZ], [BACK0, IZ], [BACK1, Z0 + 60]]), ap = keyed(t, [[BACK0, 14], [BACK1, 6]]);
    return D.view({ x, y, z, focus: Math.max(60, fz - z), aperture: ap, maxBlur: 30, fogNear: 1600, fogFar: 5200 }, W, H);
  }

  // ═══ the space: the ঘ backdrop, a far dot grid, soft colour far behind, the dark below, bokeh chips in front ═══
  const BLOBS = Array.from({ length: 18 }, (_, i) => ({ x: (hash(i, 1) - .5) * 6400, y: 1000 - hash(i, 2) * 4600, z: 2000 + hash(i, 3) * 1800, r: 280 + hash(i, 4) * 420, c: ['#1d6f8a', '#5a3fc0', '#c07a2a', '#2a8f9a'][i % 4], a: .1 + hash(i, 5) * .1 }));
  const CHIPS = Array.from({ length: 64 }, (_, i) => ({ x: (hash(i, 6) - .5) * 4400, y: 1000 - hash(i, 7) * 4800, z: 380 + hash(i, 8) * 420, r: 4 + hash(i, 9) * 10, ph: hash(i, 10) * 10, warm: hash(i, 11) < .35 }));
  const VIG = F.vignette(W, H, .5);
  function drawSpace(ctx, v, t) {
    YD.bg(ctx, v);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const gz = 2600, gd = gz - v.z, gs = v.f / gd * v.U;   // the dot grid, far back
    if (gd > 50) {
      const step = 130, x0 = Math.floor((v.x - W / 2 / gs) / step) * step, x1 = v.x + W / 2 / gs, y0 = Math.floor((v.y - H / 2 / gs) / step) * step, y1 = v.y + H / 2 / gs;
      ctx.fillStyle = 'rgba(190,235,255,.09)';
      for (let gx = x0; gx <= x1; gx += step) for (let gy = y0; gy <= y1; gy += step) { const p = D.proj(v, gx, gy, gz); if (p) { ctx.beginPath(); ctx.arc(p.x, p.y, 2.2 * U, 0, TAU); ctx.fill(); } }
    }
    ctx.globalCompositeOperation = 'lighter';
    for (const b of BLOBS) { const p = D.proj(v, b.x, b.y, b.z); if (!p) continue; const r = b.r * p.s; if (p.x < -r || p.x > W + r || p.y < -r || p.y > H + r) continue; glow(ctx, p.x, p.y, r, b.c, b.a * (.8 + .2 * Math.sin(t * .4 + b.x))); }
    ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createLinearGradient(0, H * .5, 0, H); g.addColorStop(0, 'rgba(1,6,10,0)'); g.addColorStop(1, 'rgba(1,6,10,.55)'); ctx.fillStyle = g; ctx.fillRect(0, H * .5, W, H * .5);   // the dark below
    ctx.restore();
  }
  function drawChips(ctx, v, t) {   // the nearest layer: soft chips drifting, sliding fastest with the camera
    const a0 = smooth((t - .35) / .8); if (a0 <= .004) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (const q of CHIPS) {
      const p = D.proj(v, q.x + 40 * noise1(t * .2 + q.ph, 3), q.y + 30 * noise1(t * .17 + q.ph, 4), q.z); if (!p || p.x < -80 || p.x > W + 80 || p.y < -80 || p.y > H + 80) continue;
      const a = a0 * smooth((p.d - 120) / 220) * (.55 + .3 * Math.sin(t * .8 + q.ph));
      if (q.warm) YD.dust(ctx, p.x, p.y, q.r * p.s, D.coc(v, p.d), a * .7); else YD.spark(ctx, p.x, p.y, q.r * p.s * .5, D.coc(v, p.d), a * .5);
    }
    ctx.restore();
  }

  // ═══ card A: scene 06's frame as its picture (exact at t = 0), the words, a solid "থাকতেই পারে" ═══
  const GREY0 = .45, GREY1 = 1.6;                                            // the colour comes back to the tube
  const greyAt = t => 1 - smooth((t - GREY0) / (GREY1 - GREY0));
  const [SCC, SCX] = F.canvas(W, H);
  function drawPicture(ctx, v, t) {
    const p = D.proj(v, TILE[0], TILE[1], Z0); if (!p) return;
    const k = p.s / (R * U), ox = p.x - W / 2 * k, oy = p.y - H / 2 * k;     // frame px → screen: 1:1 at the first frame
    if (ox > W || oy > H || ox + W * k < 0 || oy + H * k < 0) return;
    const { TL, TN, CHIP } = S6.img(), g = greyAt(t), xf = smooth((t - .3) / .3), chip = 1 - smooth((t - .06) / .4);   // the light leaves (the painted one takes over), the chip fades
    let img;
    if (xf >= 1 && chip <= 0) img = S6.small(k);
    else {
      SCX.setTransform(1, 0, 0, 1, 0, 0); SCX.filter = 'none'; SCX.globalCompositeOperation = 'copy'; SCX.globalAlpha = 1; SCX.drawImage(TL, 0, 0);
      SCX.globalCompositeOperation = 'source-over';
      if (xf > 0) { SCX.globalAlpha = xf; SCX.drawImage(TN, 0, 0); }
      if (chip > 0) { SCX.globalAlpha = chip; SCX.drawImage(CHIP, 0, 0); }
      SCX.globalAlpha = 1; img = SCC;
    }
    ctx.save(); ctx.setTransform(k, 0, 0, k, ox, oy);
    const rad = 70 * smooth(t / .7);                                          // its corners round off as it becomes a picture (14 world units)
    if (rad > .5) { ctx.save(); rrect(ctx, 0, 0, W, H, rad); ctx.clip(); }
    if (g > .0005) ctx.filter = S6.grey(g);
    ctx.drawImage(img, 0, 0, W, H);
    ctx.filter = 'none';
    if (rad > .5) { ctx.restore(); ctx.strokeStyle = `rgba(200,240,255,${.3 * smooth((t - .2) / .5)})`; ctx.lineWidth = 2 / k; rrect(ctx, 0, 0, W, H, rad); ctx.stroke(); }
    S6.badge(ctx, 1 - smooth((t - .04) / .42));                              // the verdict of scene 06 fades as its frame recedes
    ctx.restore();
  }

  // a row of words, each fading in and rising a little on its time; align: where x is (the row's centre, left or right end)
  function words(c, list, t, x, y, size, a, align = 'center', o = {}) {
    const wt = o.weight || 600, gap = size * .3, ws = list.map(([s]) => YV.measure(c, s, size, wt)), tot = ws.reduce((p, q) => p + q, 0) + gap * (list.length - 1);
    let xx = align === 'left' ? x : align === 'right' ? x - tot : x - tot / 2;
    list.forEach(([s, t0], i) => { const k = smooth((t - t0 + .05) / .35); say(c, s, xx + ws[i] / 2, y + 12 * (1 - k), size, a * k, { weight: wt, ...o }); xx += ws[i] + gap; });
    return tot;
  }
  function pillar(c, w, h, a, len = 900) {   // a card stands on a glass column that fades into the dark below: a cliff, a step
    if (a <= .004) return;
    const x0 = -w * .4, x1 = w * .4, y0 = h / 2 - 10, y1 = y0 + len;
    c.save(); c.globalAlpha *= a;
    const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(60,140,170,.2)'); g.addColorStop(.45, 'rgba(30,90,120,.07)'); g.addColorStop(1, 'rgba(10,40,60,0)');
    c.fillStyle = g; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    const e = c.createLinearGradient(0, y0, 0, y1); e.addColorStop(0, 'rgba(200,240,255,.3)'); e.addColorStop(.7, 'rgba(200,240,255,.04)'); e.addColorStop(1, 'rgba(200,240,255,0)');
    c.strokeStyle = e; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y1); c.moveTo(x1, y0); c.lineTo(x1, y1); c.stroke();
    c.restore();
  }
  function edge(c, w, h, r, col, a) {   // a solid coloured hairline round a card (a fact)
    if (a <= .004) return;
    c.save(); c.globalAlpha *= a; c.strokeStyle = col; c.lineWidth = 2.5; c.shadowColor = F.rgba(F.hex(col), .6); c.shadowBlur = 16; rrect(c, -w / 2, -h / 2, w, h, r); c.stroke(); c.restore();
  }
  function drawCardA(c, t) {
    const a = 1;
    pillar(c, A.w, A.h, a * smooth((t - .5) / .8));
    glass(c, A.w, A.h, a, 36, false, MINT);
    edge(c, A.w, A.h, 36, MINT, .6 * smooth((t - CAN + .05) / .4));
    words(c, [['মস্তিষ্কে', BRAIN]], t, 0, LN1, TSZ, a);
    words(c, [['কোয়ান্টাম', QU1], ['প্রভাব', EFFECT]], t, 0, LN2, TSZ, a);
    pill(c, ['থাকতেই', 'পারে'], [CAN, MAY], t, 0, PILY, PISZ, a, false, badgeK(t, CAN));
  }
  // ─── card B: an empty frame where the light lands, "চেতনার মূল উৎস" ───
  const B_ON = .75;
  function drawCardB(c, t) {
    const on = rise(t, B_ON, .8), a = on;
    c.translate(0, 50 * (1 - on));
    pillar(c, B.w, B.h, a * smooth((t - B_ON - .3) / .8));
    glass(c, B.w, B.h, a, 36, false, AMBER);
    c.save(); c.globalAlpha *= a; rrect(c, -TW / 2, TILEY - TH / 2, TW, TH, 14); c.fillStyle = 'rgba(2,10,18,.55)'; c.fill(); c.strokeStyle = 'rgba(200,240,255,.16)'; c.lineWidth = 2; c.stroke(); c.restore();   // its picture frame, waiting for the light
    words(c, [['চেতনার', MIND]], t, 0, LN1, TSZ, a);
    words(c, [['মূল', ROOT], ['উৎস', SOURCE]], t, 0, LN2, TSZ, a);
  }

  // ─── the light leaves the tube for card B: out of the picture (where scene 06 left it), over the gap, into B's frame ───
  const LT0 = .3, LT1 = 2.35, LB = [B.x, B.y + TILEY];
  const qb = (a, m, b, u) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * m + u * u * b;
  function lightAt(t) {   // world position, and how far along (0..1)
    const e = easeIO((t - LT0) / (LT1 - LT0)), my = Math.min(TILE[1], LB[1]) - (P ? 230 : 280);
    const bob = smooth((t - LT1) / .8);
    return { x: qb(TILE[0], 0, LB[0], e), y: qb(TILE[1], my, LB[1], e) - 6 * Math.sin((t - LT1) * 1.6) * bob, e };
  }
  function drawLight(ctx, v, t, a = 1) {
    if (t < LT0 || a <= .004) return;
    const L0 = S6.light(); if (!L0) return;
    const { x, y, e } = lightAt(t), p = D.proj(v, x, y, Z0); if (!p || p.x < -300 || p.x > W + 300 || p.y < -300 || p.y > H + 300) return;
    const kin = smooth((t - LT0) / .3), sty = smooth((e - .15) / .6), g = greyAt(t), r0 = L0.r / (R * U);   // it takes over from the one in the picture, then turns into card B's flat light
    const puls = 1 + .06 * Math.sin(t * 2.2) * smooth((t - LT1) / .6), fly = Math.sin(Math.PI * e);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (g > .0005) ctx.filter = S6.grey(g);
    for (let j = 12; j >= 1 && fly > .05; j--) { const q = lightAt(t - j * .022), pq = D.proj(v, q.x, q.y, Z0); if (pq) YD.light(ctx, pq.x, pq.y, r0 * pq.s * (1 + fly) * (1 - j / 16), a * kin * .12 * fly * (1 - j / 13)); }   // a faint trail while it flies
    YD.light(ctx, p.x, p.y, r0 * p.s * lerp(1, 1.5, e) * (1 + .9 * fly), a * kin * lerp(L0.k, 1, e) * (1 - sty));
    YV.light(ctx, p.x, p.y, (P ? 7 : 8.5) * p.s * lerp(.5, 1, e) * puls, a * kin * sty);
    ctx.restore();
  }

  // ─── the bridge: dashed planks from card A toward card B; it breaks midway and the planks tumble into the dark ───
  const XS = A.x + A.w / 2, XE = B.x - B.w / 2, NP = P ? 7 : 11, PITCH = (XE - XS) / NP, PL = PITCH * .64, PTH = P ? 12 : 14, DECK = A.y;
  const NL = P ? 4 : 6, KB = P ? 2 : 3, BRK = NO, PL0 = FROM - .05, PLD = (BRK - .45 - PL0) / (NL - 1);
  const tp = i => PL0 + i * PLD, fallAt = i => BRK + (i - KB) * .05;
  const XB = XS + KB * PITCH;                                                 // where it breaks
  function plank(c, x, y, rot, a) {
    if (a <= .004) return;
    c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= a;
    c.shadowColor = 'rgba(255,190,60,.45)'; c.shadowBlur = 14; rrect(c, -PL / 2, -PTH / 2, PL, PTH, PTH / 2); c.fillStyle = 'rgba(255,201,60,.3)'; c.fill();
    c.shadowBlur = 0; c.strokeStyle = 'rgba(255,214,110,.95)'; c.lineWidth = 2; c.stroke();
    c.strokeStyle = 'rgba(255,244,210,.7)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-PL / 2 + PTH / 2, -PTH / 2 + 2.5); c.lineTo(PL / 2 - PTH / 2, -PTH / 2 + 2.5); c.stroke();   // its lit top edge
    c.restore();
  }
  function drawBridge(ctx, v, t) {
    if (t < PL0) return;
    D.plane(ctx, v, XS, DECK, Z0, XE - XS + 60, 160, c => {
      const shake = smooth((t - (BRK - .4)) / .25) * (1 - smooth((t - BRK) / .05));
      for (let i = 0; i < NL; i++) {
        if (i >= KB && t >= fallAt(i)) continue;
        const k = expo((t - tp(i)) / .28); if (k <= .004) continue;
        let x = lerp(i ? (i - .5) * PITCH : .5 * PITCH - 30, (i + .5) * PITCH, k), y = -18 * (1 - k), rot = 0;
        if (i >= KB) { y += 2.2 * Math.sin(t * 71 + i * 2) * shake; rot = .02 * Math.sin(t * 53 + i) * shake; }   // straining, before it gives
        if (i === KB - 1 && t > BRK) { const u = t - BRK, ang = .42 * smooth(u / .35) + .1 * Math.sin(u * 9) * Math.exp(-u * 3); x -= PL / 2; c.save(); c.translate(x, y); c.rotate(ang); plank(c, PL / 2, 0, 0, smooth(k * 3)); c.restore(); continue; }   // the last one left hangs from its end
        plank(c, x, y, rot, smooth(k * 3));
      }
      const fl = Math.exp(-Math.pow((t - BRK - .04) / .12, 2));   // the snap
      if (fl > .01) { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, KB * PITCH, 0, 110, '#ffd27a', .7 * fl); glow(c, KB * PITCH, 0, 30, '#ffffff', .8 * fl); c.restore(); }
    }, { fog: 0, blurMul: 0 });
    // the fallen planks: down and away into the dark, turning
    for (let i = KB; i < NL; i++) {
      const u = t - fallAt(i); if (u < 0 || u > 2.2) continue;
      const x = XS + (i + .5) * PITCH + (hash(i, 31) - .4) * 60 * u, y = DECK + 60 * u + 700 * u * u, z = Z0 + 900 * u * u, rot = (hash(i, 32) < .5 ? -1 : 1) * (1.2 + 2 * hash(i, 33)) * u;
      D.plane(ctx, v, x, y, z, PL, PL, c => plank(c, 0, 0, 0, 1), { rot, fog: .9, alpha: 1 - smooth((u - 1) / .9) });
    }
    // bits of the break, falling
    for (let j = 0; j < 7; j++) {
      const u = t - BRK - .02; if (u < 0 || u > 1.6) continue;
      const x = XB + (hash(j, 41) - .5) * 70 + (hash(j, 42) - .5) * 160 * u, y = DECK - 80 * u * hash(j, 43) + 900 * u * u, z = Z0 + 300 * u;
      const p = D.proj(v, x, y, z); if (p) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = (1 - smooth((u - .6) / .8)) * .9; ctx.fillStyle = '#ffd27a'; ctx.translate(p.x, p.y); ctx.rotate(u * 7 * (hash(j, 44) - .5)); ctx.fillRect(-4 * p.s, -2 * p.s, 8 * p.s, 4 * p.s); ctx.restore(); }
    }
    // the claim the bridge was: over the gap
    D.plane(ctx, v, (XS + XE) / 2, DECK - (P ? 92 : 100), Z0, 400, 60, c => pill(c, ['কোয়ান্টাম', 'প্রক্রিয়াই'], [QU2, PROC], t, 0, 0, P ? 28 : 34, 1, true, badgeK(t, QU2)), { fog: 0, blurMul: 0 });
  }

  // ═══ the far card: "মৃত্যুর পর চেতনা?", floating in the depth; the verdict under it ═══
  const ISL_ON = RISE0 + .25;
  function ecg(c, x0, x1, y, t, a) {   // the heart line gone flat (death, as in scene 01): one last beat at its left, then flat; a sweep runs along it; its ends fade
    if (a <= .004) return;
    const pts = [], n = 120;
    for (let i = 0; i <= n; i++) { const u = i / n, b = (u - .17) / .014; pts.push([lerp(x0, x1, u), y - 58 * Math.exp(-b * b) + 16 * Math.exp(-Math.pow(b - 1.9, 2))]); }
    const g = c.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, F.rgba(F.hex(MINT), 0)); g.addColorStop(.12, F.rgba(F.hex(MINT), .35)); g.addColorStop(.35, F.rgba(F.hex(MINT), .8)); g.addColorStop(.85, F.rgba(F.hex(MINT), .8)); g.addColorStop(1, F.rgba(F.hex(MINT), 0));
    c.save(); c.globalAlpha *= a; c.strokeStyle = g; c.lineWidth = 3.5; c.lineJoin = 'round'; c.shadowColor = 'rgba(63,240,208,.5)'; c.shadowBlur = 12;
    c.beginPath(); pts.forEach(([x, yy], i) => i ? c.lineTo(x, yy) : c.moveTo(x, yy)); c.stroke();
    const sx = lerp(x0, x1, .3 + .6 * (((t - ISL_ON) * .22) % 1)); c.globalCompositeOperation = 'lighter'; glow(c, sx, y, 26, MINT, .5 * smooth((x1 - sx) / 60)); c.restore();
  }
  function drawIsland(c, t) {
    const a = smooth((t - ISL_ON) / 1.1), { w: iw, h: ih } = ISL; if (a <= .004) return;
    c.save(); c.globalCompositeOperation = 'lighter'; glow(c, 0, ih / 2 + 30, iw * .55, '#c07a2a', .1 * a); c.restore();   // afloat on its own light
    glass(c, iw, ih, a, 44, true);
    words(c, [['আরও', MORE], ['বড়', BIG], ['প্রশ্ন', QUESTION]], t, -iw / 2 + 58, -ih / 2 + 66, 34, a * .8, 'left', { weight: 500 });
    pill(c, ['দাবি'], [CLAIM], t, iw / 2 - 104, -ih / 2 + 66, 28, a, true, badgeK(t, CLAIM));
    ecg(c, -iw / 2 + 40, -30, 118, t, a);                                     // the left half: the light over the flat line
    YV.light(c, -iw / 4 + 5, -8, 8, a * (.78 + .22 * noise1(t * 2.6, 9)));    // it flickers: is it still there?
    const tx = iw / 4 - 6, cw = YV.measure(c, 'চেতনা', 70, 700), qw = YV.measure(c, '?', 70, 700);
    words(c, [['মৃত্যুর', DEATH], ['পর', AFTER]], t, tx, -34, 70, a, 'center', { weight: 700 });
    words(c, [['চেতনা', MIND2]], t, tx - qw / 2 - 4, 62, 70, a, 'center', { weight: 700 });
    const qk = smooth((t - ASKS + .05) / .35); say(c, '?', tx + cw / 2 + 4, 62 + 12 * (1 - qk), 70, a * qk, { weight: 700, role: 'amber' });
    pill(c, ['প্রমাণ', 'নেই'], [PROOF, NONE], t, 0, ih / 2 + 86, 50, a, true, badgeK(t, PROOF));   // the verdict, outlined
  }
  // the dashed line from the break up to the far card: "and from there, a bigger question"
  const ARC0 = FROM2 - .1, ARC1 = ARC0 + 1.5;
  function drawArc(ctx, v, t) {
    const k = easeIO((t - ARC0) / (ARC1 - ARC0)), fade = 1 - smooth((t - BACK0) / .7); if (k <= .004 || fade <= .004) return;
    const p0 = [XB + PITCH * .4, DECK, Z0], p2 = [ISL.x - ISL.w * .28, ISL.y + ISL.h / 2 + 20, IZ], p1 = [(p0[0] + p2[0]) / 2 - (P ? 120 : 260), (p0[1] + p2[1]) / 2 - 200, (Z0 + IZ) / 2];
    const pts = []; for (let i = 0; i <= 60; i++) { const u = i / 60 * k, p = D.proj(v, qb(p0[0], p1[0], p2[0], u), qb(p0[1], p1[1], p2[1], u), qb(p0[2], p1[2], p2[2], u)); if (p) pts.push([p.x, p.y]); }
    if (pts.length < 2) return;
    const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1], g = ctx.createLinearGradient(ax, ay, bx, by), cA = x => F.rgba(F.hex(AMBER), x * fade);
    g.addColorStop(0, cA(0)); g.addColorStop(.25, cA(.85)); g.addColorStop(.8, cA(.85)); g.addColorStop(1, cA(k > .97 ? 0 : .85));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = g; ctx.lineWidth = 3 * U; ctx.setLineDash([14 * U, 11 * U]); ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(255,201,60,.4)'; ctx.shadowBlur = 10 * U;
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
  }

  // ═══ the three solid steps (facts), rising out of the dark toward the far card, each with its icon from scene 04 and a tick ═══
  const SWd = P ? 260 : 300, SHd = P ? 196 : 210;
  const FRINGE = (() => { const r = rng(21), d = [], I = x => Math.pow(Math.cos(Math.PI * x / 21), 2) * Math.exp(-Math.pow(x / 75, 2)); for (let k = 0; k < 460; k++) { let x; do { x = (r() - .5) * 156; } while (r() > I(x)); d.push({ x, y: (r() - .5) * 66, t: Math.pow(k / 460, .6) }); } return d; })();
  function iconFringe(c, x, y, t, a, s) {   // superposition: the double slit's screen, the dots landing one by one into stripes
    c.save(); c.translate(x, y); c.globalAlpha *= a;
    rrect(c, -86, -42, 172, 84, 12); c.fillStyle = 'rgba(6,14,34,.85)'; c.fill(); c.strokeStyle = 'rgba(200,240,255,.18)'; c.lineWidth = 1.5; c.stroke();
    const u = clamp((t - s.t0 - .25) / 1.5); c.fillStyle = '#c9fff6';
    for (const d of FRINGE) { if (d.t > u) continue; c.beginPath(); c.arc(d.x, d.y, 1.9, 0, TAU); c.fill(); }
    c.restore();
  }
  const BALL = (() => { const n = 96, [cv, x] = F.canvas(n, n), g = x.createRadialGradient(n * .38, n * .34, n * .04, n * .5, n * .5, n * .5); g.addColorStop(0, '#e6fffb'); g.addColorStop(.55, '#29d6c0'); g.addColorStop(1, '#138f84'); x.fillStyle = g; x.beginPath(); x.arc(n / 2, n / 2, n / 2 - 1, 0, TAU); x.fill(); return cv; })();
  function iconPair(c, x, y, t, a) {   // entanglement: two particles, their arrows always opposite, one brace under both (scene 04)
    c.save(); c.translate(x, y - 6); c.globalAlpha *= a;
    const ph = Math.sin(t * TAU / 1.1), R0 = 20, X = 52;
    c.strokeStyle = '#ffffff'; c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = 3;
    for (const sg of [-1, 1]) {
      const bx = sg * X; c.globalAlpha = a; c.drawImage(BALL, bx - R0, -R0, 2 * R0, 2 * R0);
      const up = .5 + .5 * ph * sg;
      for (const [dir, k] of [[-1, up], [1, 1 - up]]) { c.globalAlpha = a * (.25 + .7 * k); c.beginPath(); c.moveTo(bx, -dir * R0 * .42); c.lineTo(bx, dir * R0 * .5); c.moveTo(bx - R0 * .22, dir * R0 * .26); c.lineTo(bx, dir * R0 * .5); c.lineTo(bx + R0 * .22, dir * R0 * .26); c.stroke(); }
    }
    c.globalAlpha = a * .85; c.lineWidth = 2.5; const yb = R0 + 8, dx = X;
    c.beginPath(); c.moveTo(-dx, yb); c.quadraticCurveTo(-dx, yb + 10, -dx + 14, yb + 10); c.lineTo(-11, yb + 10); c.quadraticCurveTo(0, yb + 10, 0, yb + 20); c.quadraticCurveTo(0, yb + 10, 11, yb + 10); c.lineTo(dx - 14, yb + 10); c.quadraticCurveTo(dx, yb + 10, dx, yb); c.stroke();
    c.restore();
  }
  const CLOUD = Array.from({ length: 110 }, (_, i) => { const a = hash(i, 61) * TAU, d = Math.sqrt(-2 * Math.log(1 - hash(i, 62) * .97)) * .42; return { x: Math.cos(a) * d, y: Math.sin(a) * d * .82, sp: .7 + 1.8 * hash(i, 63), ph: hash(i, 64) }; });
  function iconCloud(c, x, y, t, a) {   // the strange quantum world: the electron cloud of scene 04, dots flickering where the electron may be
    c.save(); c.translate(x, y); c.globalAlpha *= a;
    const R0 = 44; c.save(); c.globalCompositeOperation = 'lighter'; glow(c, 0, 0, R0 * 1.1, MINT, .2); glow(c, 0, 0, R0 * .65, BLUE, .22); glow(c, 0, 0, R0 * .3, '#bff8ff', .16); c.restore();
    c.fillStyle = '#d8fffa';
    for (const d of CLOUD) { const f = (t * d.sp + d.ph) % 1, al = Math.sin(Math.PI * f); if (al < .2) continue; c.globalAlpha = a * al * .85; c.beginPath(); c.arc(d.x * R0 * 1.5, d.y * R0 * 1.5, 1.8, 0, TAU); c.fill(); }
    c.globalAlpha = a; c.globalCompositeOperation = 'lighter'; glow(c, 0, 0, 8, '#fff3c4', .95);
    c.restore();
  }
  const STEPS = [
    { at: P ? [-330, 490] : [-720, 370], t0: SUPER - .65, tick: HAS1, rows: [[['সুপারপজিশন', SUPER]]], icon: iconFringe },
    { at: P ? [-30, 370] : [-400, 260], t0: ENT - .5, tick: HAS2, rows: [[['এনট্যাঙ্গেলমেন্ট', ENT]]], icon: iconPair },
    { at: P ? [270, 250] : [-80, 150], t0: QU3 - .5, tick: WEIRD + .12, rows: [[['কোয়ান্টাম', QU3], ['জগত', WORLD]], [['অদ্ভুত', WEIRD]]], icon: iconCloud },
  ].map(s => ({ ...s, x: CC[0] + s.at[0], y: CC[1] + s.at[1] }));
  function tick(c, x, y, t, t0, a) {   // a tick in a mint disc, stamping in; the check draws itself
    const a0 = a * smooth((t - t0 + .05) / .2); if (a0 <= .004) return;
    const k = badgeK(t, t0), dk = smooth((t - t0 - .02) / .3), P3 = [[-10, 1], [-3, 8], [11, -7]], l1 = Math.hypot(7, 7), l2 = Math.hypot(14, 15), L = dk * (l1 + l2);
    c.save(); c.translate(x, y); c.scale(k, k); c.globalAlpha *= a0;
    c.shadowColor = 'rgba(63,240,208,.7)'; c.shadowBlur = 18; c.fillStyle = MINT; c.beginPath(); c.arc(0, 0, 24, 0, TAU); c.fill(); c.shadowBlur = 0;
    c.strokeStyle = '#053b33'; c.lineWidth = 5; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(...P3[0]);
    if (L <= l1) c.lineTo(lerp(P3[0][0], P3[1][0], L / l1), lerp(P3[0][1], P3[1][1], L / l1)); else { c.lineTo(...P3[1]); const u = (L - l1) / l2; c.lineTo(lerp(P3[1][0], P3[2][0], u), lerp(P3[1][1], P3[2][1], u)); }
    c.stroke(); c.restore();
  }
  function drawStep(c, s, i, t) {
    const on = expo((t - s.t0) / .95), a = smooth((t - s.t0) / .35); if (a <= .004) return;
    const look = Math.exp(-Math.pow((t - (NONEOF + .05 + i * .14)) / .13, 2)), stay = Math.exp(-Math.pow((t - (BREAK + .15 + i * .07)) / .22, 2));   // "কোনোটাই": a glance along them; at the break they hold
    c.translate(0, (P ? 640 : 580) * (1 - on));
    pillar(c, SWd, SHd, a, 1000);
    glass(c, SWd, SHd, a, 30, false, MINT);
    edge(c, SWd, SHd, 30, MINT, (.62 * smooth((t - s.tick + .05) / .3) + .35 * look + .38 * stay));
    s.icon(c, 0, -SHd / 2 + 64, t, a, s);
    const fs = P ? 26 : 30;
    s.rows.forEach((row, j) => words(c, row, t, 0, SHd / 2 - (s.rows.length === 2 ? (j ? 30 : 68) : 46), fs, a));
    tick(c, SWd / 2 - 18, -SHd / 2 + 18, t, s.tick, a);
    if (stay > .01) { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, SWd / 2 - 18, -SHd / 2 + 18, 80, MINT, .5 * stay); c.restore(); }
  }

  // ═══ the fourth step, dashed and standing on nothing: "স্মৃতি, ব্যক্তিত্ব, আমিত্ব মৃত্যুর পর টিকে থাকে"; it cracks as it
  // is said, and breaks apart into the dark ═══
  const S4 = { at: P ? [60, 20] : [380, 45], w: P ? 520 : 600, h: P ? 210 : 220 }; S4.x = CC[0] + S4.at[0]; S4.y = CC[1] + S4.at[1];
  const S4_0 = BUT2 - .15, S4_1 = S4_0 + 1, BREAK = STAYS2 + .22, DG = Math.hypot(S4.w, S4.h), CO = [-S4.w / 2 + 30, S4.h / 2 - 24];   // CO: where the cracks start (the corner nearest the steps)
  const wob = t => { const u = t - PROVE; return { rot: .008 * Math.sin(t * 1.7) + (u > 0 ? .03 * Math.sin(u * 52) * Math.exp(-6 * u) : 0), dy: 6 * Math.sin(t * 1.3) }; };
  const PERIM = (() => {   // its rounded edge as points, clockwise from the bottom of its left side, with the length run so far
    const w = S4.w / 2, h = S4.h / 2, r = 30, pts = [];
    const line = (x0, y0, x1, y1, n) => { for (let i = 0; i < n; i++) pts.push([lerp(x0, x1, i / n), lerp(y0, y1, i / n)]); };
    const arc = (cx, cy, a0, n = 8) => { for (let i = 0; i < n; i++) { const a = a0 + i / n * Math.PI / 2; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
    line(-w, h - r, -w, -h + r, 10); arc(-w + r, -h + r, Math.PI);
    line(-w + r, -h, w - r, -h, 24); arc(w - r, -h + r, -Math.PI / 2);
    line(w, -h + r, w, h - r, 10); arc(w - r, h - r, 0);
    line(w - r, h, -w + r, h, 24); arc(-w + r, h - r, Math.PI / 2);
    pts.push(pts[0]);
    let s = 0; return pts.map((p, i) => { if (i) s += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]); return [p[0], p[1], s]; });
  })();
  // the cracks: the inner edges of a jittered grid, each a little zig-zag, appearing outward from CO as the claim is said;
  // the grid's cells are the pieces it breaks into
  const NX = P ? 5 : 6, NY = 2;
  const GRID = (() => { const r = rng(77), g = []; for (let i = 0; i <= NX; i++) { g.push([]); for (let j = 0; j <= NY; j++) { const ex = i === 0 || i === NX, ey = j === 0 || j === NY; g[i].push([(i / NX - .5) * S4.w + (ex ? 0 : (r() - .5) * S4.w / NX * .55), (j / NY - .5) * S4.h + (ey ? 0 : (r() - .5) * S4.h / NY * .5)]); } } return g; })();
  const CRACKS = (() => {
    const r = rng(78), out = [], add = (p, q) => { const da = Math.hypot(p[0] - CO[0], p[1] - CO[1]), db = Math.hypot(q[0] - CO[0], q[1] - CO[1]); if (db < da) [p, q] = [q, p]; const L = Math.hypot(q[0] - p[0], q[1] - p[1]), nx = -(q[1] - p[1]) / L, ny = (q[0] - p[0]) / L, pts = [p]; for (let i = 1; i < 4; i++) { const u = i / 4 + (r() - .5) * .08, j = (r() - .5) * .16 * L; pts.push([lerp(p[0], q[0], u) + nx * j, lerp(p[1], q[1], u) + ny * j]); } pts.push(q); out.push({ pts, d0: Math.min(da, db), d1: Math.max(da, db) }); };
    for (let i = 1; i < NX; i++) for (let j = 0; j < NY; j++) add(GRID[i][j], GRID[i][j + 1]);
    for (let j = 1; j < NY; j++) for (let i = 0; i < NX; i++) add(GRID[i][j], GRID[i + 1][j]);
    return out;
  })();
  const crackR = t => keyed(t, [[PROVE, 0], [PROVE + .35, .3 * DG], [DEATH2, .3 * DG], [DEATH2 + .35, .5 * DG], [QU4, .5 * DG], [QU4 + .35, .72 * DG], [STAYS2, .72 * DG], [BREAK, 1.25 * DG]]);
  function drawCracks(c, t) {
    const rc = crackR(t); if (rc <= 0) return;
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    for (const k of CRACKS) {
      const f = clamp((rc - k.d0) / Math.max(1, k.d1 - k.d0)); if (f <= 0) continue;
      const n = k.pts.length - 1, e = f * n, path = () => { c.beginPath(); c.moveTo(...k.pts[0]); for (let i = 1; i <= n; i++) { if (i <= e) { c.lineTo(...k.pts[i]); continue; } const u = e - (i - 1), [x0, y0] = k.pts[i - 1], [x1, y1] = k.pts[i]; c.lineTo(lerp(x0, x1, u), lerp(y0, y1, u)); break; } };
      c.strokeStyle = 'rgba(0,8,14,.5)'; c.lineWidth = 4; c.save(); c.translate(1.5, 2); path(); c.stroke(); c.restore();
      c.strokeStyle = 'rgba(255,246,225,.92)'; c.lineWidth = 2; c.shadowColor = 'rgba(255,201,60,.6)'; c.shadowBlur = 8; path(); c.stroke(); c.shadowBlur = 0;
    }
    c.restore();
  }
  // the quantum state it would survive in: scene 06's violet shimmer, small, round the amber light
  const SHN = 96, [SHC, SHX] = F.canvas(SHN, SHN), SHD = SHX.createImageData(SHN, SHN);
  function shimmerTex(t, e) {
    const n = SHN, h = n / 2, d = SHD.data, k = .8, om = 5, S3 = [[h - 7, h + 2], [h + 5, h - 6], [h + 2, h + 7]];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      let A = 0; for (const [sx, sy] of S3) A += Math.cos(k * Math.hypot(x - sx, y - sy) - om * t); A /= 3; const I = A * A;
      const rim = smooth(1 - Math.hypot(x - h, y - h) / (h - 3)), ee = e * rim, o = (y * n + x) * 4;
      d[o] = 150 * I * ee + 30; d[o + 1] = 110 * I * ee + 10; d[o + 2] = 255 * Math.min(1, I * ee + .15); d[o + 3] = 255 * Math.min(1, (I * ee * .9 + .12 * ee));
    }
    SHX.putImageData(SHD, 0, 0);
  }
  function drawS4Card(c, t) {   // around its centre, card-local
    const { w: sw, h: sh } = S4, a = smooth((t - S4_0) / .5), tr = easeIO((t - S4_0) / (S4_1 - S4_0)); if (a <= .004) return;
    c.save(); c.globalAlpha *= a * .92; c.shadowColor = 'rgba(0,6,14,.5)'; c.shadowBlur = 50; c.shadowOffsetY = 24; rrect(c, -sw / 2, -sh / 2, sw, sh, 30); c.fillStyle = 'rgba(14,44,62,.62)'; c.fill(); c.shadowBlur = 0; c.shadowOffsetY = 0;
    const g = c.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2); g.addColorStop(0, 'rgba(255,214,120,.1)'); g.addColorStop(.6, 'rgba(255,255,255,.02)'); g.addColorStop(1, 'rgba(255,201,60,.05)'); c.fillStyle = g; c.fill(); c.restore();
    // its dashed edge, drawing itself round
    const L = PERIM[PERIM.length - 1][2] * tr;
    c.save(); c.globalAlpha *= a; c.setLineDash([22, 14]); c.strokeStyle = F.rgba(F.hex(AMBER), .9); c.lineWidth = 3; c.shadowColor = 'rgba(255,201,60,.45)'; c.shadowBlur = 14; c.beginPath();
    for (let i = 0; i < PERIM.length; i++) { const [x, y, s] = PERIM[i]; if (!i) { c.moveTo(x, y); continue; } if (s <= L) { c.lineTo(x, y); continue; } const [px, py, ps] = PERIM[i - 1], u = (L - ps) / (s - ps); c.lineTo(lerp(px, x, u), lerp(py, y, u)); break; }
    c.stroke(); c.restore();
    // the light, and the quantum state round it (on "কোয়ান্টাম")
    const ix = -sw / 2 + (P ? 76 : 84), qe = smooth((t - QU4 + .1) / .5);
    YV.light(c, ix, 0, lerp(5.5, 4.2, qe), a * smooth((t - S4_0 - .3) / .5) * (.85 + .15 * noise1(t * 2.2, 5)));
    if (qe > .01) { shimmerTex(t, qe); c.save(); c.globalAlpha *= a; c.globalCompositeOperation = 'lighter'; c.drawImage(SHC, ix - 95, -95, 190, 190); c.drawImage(SHC, ix - 95, -95, 190, 190); c.restore(); }   // on top of the light, twice: the violet has to read over the amber
    // the claim, word by word
    const fs = P ? 30 : 36, x0 = -sw / 2 + (P ? 150 : 166);
    words(c, [['স্মৃতি,', MEM], ['ব্যক্তিত্ব,', PERS], ['আমিত্ব', SELF]], t, x0, -30, fs, a, 'left', { weight: 700 });
    words(c, [['মৃত্যুর', DEATH2], ['পর', AFTER2], ['টিকে', SURV2], ['থাকে', STAYS2]], t, x0, 34, fs, a, 'left', { weight: 700 });
  }
  let S4SNAP = null; const SPAD = 60;
  function snapS4() {   // its look at the break, painted once, for the pieces
    if (S4SNAP) return S4SNAP;
    const [cv, x] = F.canvas(S4.w + 2 * SPAD, S4.h + 2 * SPAD); x.translate(S4.w / 2 + SPAD, S4.h / 2 + SPAD); drawS4Card(x, BREAK); drawCracks(x, BREAK);
    return (S4SNAP = cv);
  }
  function drawS4(ctx, v, t) {
    if (t < S4_0 || t >= BREAK) return;
    const o = wob(t);
    D.plane(ctx, v, S4.x, S4.y + o.dy, Z0, S4.w / 2 + 60, S4.h / 2 + 60, c => { c.rotate(o.rot); drawS4Card(c, t); drawCracks(c, t); }, { fog: 0, blurMul: 0 });
  }
  const PIECES = (() => { const out = []; for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) { const poly = [GRID[i][j], GRID[i + 1][j], GRID[i + 1][j + 1], GRID[i][j + 1]], cx = poly.reduce((s, p) => s + p[0], 0) / 4, cy = poly.reduce((s, p) => s + p[1], 0) / 4, n = out.length; out.push({ poly, cx, cy, delay: .12 * Math.hypot(cx - CO[0], cy - CO[1]) / DG, vx: cx / S4.w * 160 + (hash(n, 71) - .5) * 60, vy: -40 - 90 * hash(n, 72), spin: (hash(n, 73) - .5) * 5 }); } return out; })();
  function drawPieces(ctx, v, t) {
    if (t < BREAK) return;
    const img = snapS4(), o = wob(BREAK);
    for (const q of PIECES) {
      const u = Math.max(0, t - BREAK - q.delay), al = 1 - smooth((u - .3) / .5); if (al <= .004) continue;
      const p = D.proj(v, S4.x + q.cx + .6 * q.vx * u, S4.y + o.dy + q.cy + q.vy * u + 2300 * u * u, Z0 + 900 * u * u); if (!p) continue;
      ctx.save(); ctx.setTransform(p.s, 0, 0, p.s, p.x, p.y); ctx.rotate(o.rot + q.spin * u); ctx.translate(-q.cx, -q.cy); ctx.globalAlpha = al;
      ctx.beginPath(); q.poly.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.save(); ctx.clip(); ctx.drawImage(img, -S4.w / 2 - SPAD, -S4.h / 2 - SPAD); ctx.restore();
      ctx.strokeStyle = `rgba(255,246,225,${.55 * smooth(u / .08)})`; ctx.lineWidth = 1.5 / p.s * U; ctx.stroke();
      ctx.restore();
    }
    const fl = Math.exp(-Math.pow((t - BREAK - .03) / .1, 2)); if (fl > .01) { const p = D.proj(v, S4.x + CO[0], S4.y + CO[1], Z0); if (p) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; glow(ctx, p.x, p.y, 220 * p.s, '#ffe3a8', .5 * fl); ctx.restore(); } }
  }

  function drawScene(ctx, t) {
    const v = cam(t), inA = t < RISE1 + .3;
    if (t > .004) drawSpace(ctx, v, t);
    if (t > RISE0 - .1) { D.plane(ctx, v, ISL.x, ISL.y + 10 * Math.sin(t * .8), IZ, ISL.w / 2 + 60, ISL.h / 2 + 170, c => drawIsland(c, t), { fog: .4, rot: .007 * Math.sin(t * .55) }); drawArc(ctx, v, t); }
    drawPieces(ctx, v, t);
    STEPS.forEach((s, i) => { if (t > s.t0) D.plane(ctx, v, s.x, s.y, Z0, SWd / 2 + 40, SHd / 2 + 1000, c => drawStep(c, s, i, t), { fog: 0, blurMul: 0 }); });
    if (inA && t > .02) {
      D.plane(ctx, v, B.x, B.y, Z0, B.w / 2 + 40, B.h / 2 + 900, c => drawCardB(c, t), { fog: 0 });
      D.plane(ctx, v, A.x, A.y, Z0, A.w / 2 + 40, A.h / 2 + 900, c => drawCardA(c, t), { fog: 0 });
    }
    if (inA) { drawPicture(ctx, v, t); drawBridge(ctx, v, t); drawLight(ctx, v, t); }
    drawS4(ctx, v, t);
    drawChips(ctx, v, t);
    const vg = smooth(t / .8); if (vg > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = vg; ctx.drawImage(VIG, 0, 0); ctx.restore(); }
  }

  // ─── sound effects, about 10 dB under the voice (as scene 06) ───
  const LEVEL = .48;
  const airy = (t0, g = .09) => ({ t: t0, type: 'air', dur: .6, f0: 900, f1: 1600, g });
  const SFX = [
    { t: 0, type: 'drone', dur: DUR, f: 50, g: .16 },                                                                                             // the dark under it all
    { t: .02, type: 'swoosh', dur: 1.35, f0: 1100, f1: 300, peak: .3, g: .2 }, { t: .05, type: 'air', dur: 1.2, f0: 500, f1: 1200, g: .1 },       // the pull-back: scene 06's frame becomes a picture
    airy(BRAIN), airy(EFFECT),
    { t: LT0, type: 'bloom', dur: 1.8, f: 294, g: .1 }, { t: B_ON, type: 'air', dur: .8, f0: 500, f1: 1400, g: .12 }, { t: B_ON + .15, type: 'pop', g: .08 },   // the light leaves; card B
    { t: LT1 - .15, type: 'bloom', dur: 1.4, f: 330, g: .14 },                                                                                    // it lands
    { t: CAN, type: 'stampSmall', g: .18 }, { t: CAN, type: 'tap', g: .08 },                                                                        // "থাকতেই পারে"
    ...Array.from({ length: NL }, (_, i) => ({ t: tp(i) + .04, type: 'tap', g: .1 })),                                                               // the planks laid
    { t: BRK - .4, type: 'creak', dur: .35, g: .08 },
    { t: BRK, type: 'crack', dur: .45, g: .22 }, { t: BRK, type: 'impact', size: .35, f: 62, g: .2 }, { t: BRK + .08, type: 'swoosh', dur: 1.2, f0: 700, f1: 150, peak: .25, g: .16 },   // it breaks, the planks fall
    { t: QU2, type: 'stampSmall', g: .14 }, airy(PROC), airy(MIND), airy(ROOT),
    { t: RISE0, type: 'swoosh', dur: 1.75, f0: 300, f1: 900, peak: .55, g: .18 }, { t: ARC0, type: 'trace', dur: 1.4, g: .12 },                    // the camera rises; the dashed line climbs
    { t: ISL_ON, type: 'air', dur: 1.4, f0: 400, f1: 1100, g: .12 }, airy(MORE), airy(DEATH), airy(MIND2), { t: ASKS, type: 'tap', g: .08 },
    { t: CLAIM, type: 'stampSmall', g: .16 },
    { t: PROOF, type: 'stampSmall', g: .3 }, { t: PROOF, type: 'tap', g: .12 }, { t: NONE, type: 'stampSmall', g: .3 },                              // the verdict
    { t: BACK0, type: 'swoosh', dur: 1.05, f0: 900, f1: 300, peak: .45, g: .16 },                                                                   // back, over the steps
    ...STEPS.flatMap(s => [{ t: s.t0, type: 'whoosh', dur: .75, f0: 200, f1: 800, g: .1 }, { t: s.t0 + .55, type: 'thud', g: .08 }, { t: s.tick, type: 'stampSmall', g: .24 }, { t: s.tick, type: 'pop', g: .08 }]),
    ...[0, 1, 2].map(i => ({ t: NONEOF + .05 + i * .14, type: 'tap', g: .06 })),                                                                    // "কোনোটাই": a glance along them
    { t: S4_0, type: 'trace', dur: 1, g: .12 }, { t: S4_0, type: 'air', dur: .9, f0: 600, f1: 1300, g: .1 },                                       // the fourth, dashed
    { t: PROVE, type: 'crack', dur: .3, g: .13 }, { t: DEATH2, type: 'crackle', dur: .4, g: .1 }, { t: QU4, type: 'shimmer', dur: 1.3, g: .14 }, { t: QU4, type: 'crackle', dur: .4, g: .1 },
    airy(MEM), airy(SELF),
    { t: BREAK - .06, type: 'crack', dur: .3, g: .2 }, { t: BREAK, type: 'glass', g: .2 }, { t: BREAK, type: 'impact', size: .4, f: 55, g: .2 }, { t: BREAK + .1, type: 'swoosh', dur: .9, f0: 600, f1: 150, peak: .25, g: .14 },   // it breaks apart
    { t: BREAK + .15, type: 'bloom', dur: 1, f: 392, g: .08 },                                                                                      // the three hold
  ].map(c => ({ ...c, g: c.g * LEVEL }));

  const fontsReady = Promise.race([
    Promise.all(['Hind Siliguri', 'Noto Serif Bengali'].flatMap(f => [500, 600, 700].map(wt => document.fonts.load(`${wt} 60px "${f}"`, 'প্রমাণিত নয় তত্ত্ব Orchestrated মস্তিষ্কে সুপারপজিশন')))),
    new Promise(r => setTimeout(r, 5000)),
  ]).then(() => S6.frames());
  const label_ = t => { let s = ''; for (const x of T.words) if (x[1] <= t + 1e-6) s = x[0]; return s; };
  F.scene(ID, { W, H, duration: DUR, draw: (ctx, t) => { D.frameStart(); drawScene(ctx, t); }, ready: fontsReady, label: label_, sfx: SFX, grain: 'frame' });
})();
