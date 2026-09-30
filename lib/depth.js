// 2.5D: a multiplane camera for flat artwork placed at depth, with depth of field and fog.
// World units: x right, y down, z away from the camera. At distance d, one world unit is FOCAL / d reference pixels
// (reference = 1080 px on the short side), so a plane 1000 units away is drawn at 1:1.
//   const v = FILM.depth.view({ x, y, z, focus, aperture }, W, H)
//   FILM.depth.proj(v, x, y, z) → { x, y, s, d } on screen (s: pixels per world unit), or null behind the camera
//   FILM.depth.plane(ctx, v, x, y, z, hw, hh, paint, opts): a flat element drawn by paint(ctx) around its origin in
//     world units (within ±hw, ±hh), placed at depth and blurred by its distance from the focus
// Everything is a pure function of the camera, so a frame is still a pure function of time.
(function () {
  'use strict';
  const F = FILM, { canvas, clamp } = F;
  const D = (F.depth = {});
  const FOCAL = 1000;

  D.view = (cam, W, H) => ({ aperture: 30, maxBlur: 44, fogNear: 1800, fogFar: 6500, ...cam, W, H, U: Math.min(W, H) / 1080, f: FOCAL * (cam.zoom || 1) });
  D.proj = (v, x, y, z) => { const d = z - v.z; if (d <= 8) return null; const s = v.f / d * v.U; return { x: v.W / 2 + (x - v.x) * s, y: v.H / 2 + (y - v.y) * s, s, d }; };
  // blur (circle of confusion, px) of a point at distance d when the lens is focused at v.focus
  D.coc = (v, d) => Math.min(v.maxBlur, v.aperture * v.U * FOCAL * Math.abs(1 / v.focus - 1 / d));
  // fog 0..1 with distance
  D.fog = (v, d) => clamp((d - v.fogNear) / (v.fogFar - v.fogNear));

  // scratch canvases, reused frame after frame
  const POOL = []; let used = 0;
  D.frameStart = () => { used = 0; };
  function scratch(w, h) {
    if (!POOL[used]) POOL[used] = canvas(8, 8);
    const [cv, cx] = POOL[used++];
    if (cv.width < w || cv.height < h) { cv.width = Math.max(cv.width, Math.ceil(w)); cv.height = Math.max(cv.height, Math.ceil(h)); }
    cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over'; cx.filter = 'none';
    cx.shadowColor = 'rgba(0,0,0,0)'; cx.shadowBlur = 0; cx.clearRect(0, 0, cv.width, cv.height);
    return [cv, cx];
  }

  // a flat element at depth: opts { rot, alpha, blurMul, fog (0..1 fade toward nothing at distance) }
  D.plane = (ctx, v, x, y, z, hw, hh, paint, opts = {}) => {
    const p = D.proj(v, x, y, z); if (!p) return null;
    const alpha = (opts.alpha ?? 1) * (1 - (opts.fog ?? .7) * D.fog(v, p.d)); if (alpha <= .004) return p;
    const b = D.coc(v, p.d) * (opts.blurMul ?? 1), pad = Math.ceil(b + 3), R = Math.hypot(hw, hh) * p.s;
    if (p.x + R + pad < 0 || p.x - R - pad > v.W || p.y + R + pad < 0 || p.y - R - pad > v.H) return p;
    if (b < .7) { ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(p.x, p.y); ctx.rotate(opts.rot || 0); ctx.scale(p.s, p.s); paint(ctx, p); ctx.restore(); return p; }
    // blurred: drawn into a scratch canvas (at reduced resolution when it is huge; the blur hides it), then composited
    const size = 2 * R + 2 * pad, k = Math.min(1, 1600 / size), n = Math.ceil(size * k);
    const [cv, cx] = scratch(n, n);
    cx.translate(n / 2, n / 2); cx.rotate(opts.rot || 0); cx.scale(p.s * k, p.s * k); paint(cx, p);
    ctx.save(); ctx.globalAlpha *= alpha; ctx.filter = `blur(${(b * k / 2).toFixed(2)}px)`;
    if (k < 1) { ctx.translate(p.x - size / 2, p.y - size / 2); ctx.scale(1 / k, 1 / k); ctx.drawImage(cv, 0, 0, n, n, 0, 0, n, n); }
    else ctx.drawImage(cv, 0, 0, n, n, p.x - n / 2, p.y - n / 2, n, n);
    ctx.restore();
    return p;
  };

  // sprites pre-blurred at a few levels, so hundreds of points can be out of focus without a filter each:
  // make(ctx, r) draws the sharp sprite of radius r at the origin; D.bokeh picks the level nearest the blur
  const LEVELS = [0, .15, .35, .7, 1.2, 2];   // blur as a fraction of the sprite's radius
  D.sprites = (make, r = 32) => LEVELS.map(lv => {
    const pad = Math.ceil(r * (1.2 + lv * 1.6)), n = 2 * pad, [c, x] = canvas(n, n);
    x.translate(pad, pad); if (lv) x.filter = `blur(${r * lv / 2}px)`; make(x, r); return { c, pad, r };
  });
  // draw a sprite set at (sx, sy) with on-screen radius rr and blur b (px). Two neighbouring levels are crossfaded so a
  // focus pull never pops; beyond the last level a small point grows into a wide soft disc (true bokeh), its light spread.
  const TOP = LEVELS[LEVELS.length - 1];
  D.bokeh = (ctx, set, sx, sy, rr, b, a = 1) => {
    if (a <= .004) return;
    rr = Math.max(rr, .4);
    let f = b / rr;
    if (f > TOP) { const r2 = b / TOP; a *= clamp(3 * (rr / r2) * (rr / r2), .07, 1); rr = r2; f = TOP; }
    let i = 0; while (i < LEVELS.length - 2 && LEVELS[i + 1] <= f) i++;
    const u = clamp((f - LEVELS[i]) / (LEVELS[i + 1] - LEVELS[i])), W = ctx.canvas.width, H = ctx.canvas.height, a0 = ctx.globalAlpha;
    for (const [j, wt] of [[i, 1 - u], [i + 1, u]]) {
      if (wt < .01) continue;
      const s = set[j], e = s.pad * rr / s.r;
      if (sx + e < 0 || sy + e < 0 || sx - e > W || sy - e > H) continue;
      ctx.globalAlpha = a0 * Math.min(1, a) * wt; ctx.drawImage(s.c, sx - e, sy - e, 2 * e, 2 * e);
    }
    ctx.globalAlpha = a0;
  };
})();
