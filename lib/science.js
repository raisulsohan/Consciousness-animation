// Scientific shapes for বিচিত্র বিজ্ঞান films: smooth paths that can draw themselves, a human brain in side view,
// a glowing neural network and a heart trace. Shapes only (arrays of points in world units); looks-science.js paints them.
// Everything is built once from seeds, so a frame stays a pure function of time.
(function () {
  'use strict';
  const F = FILM, { clamp, lerp, noise1, rng, hash } = F;
  const S = (F.sci = {});

  // ─── paths ────────────────────────────────────────────────────────────────
  // Catmull-Rom through the points, n samples per span → [[x, y], …]
  S.spline = (pts, closed = false, n = 12) => {
    const out = [], N = pts.length, P = i => closed ? pts[(i + N) % N] : pts[clamp(i, 0, N - 1)];
    const spans = closed ? N : N - 1;
    for (let i = 0; i < spans; i++) {
      const a = P(i - 1), b = P(i), c = P(i + 1), d = P(i + 2);
      for (let k = 0; k < n; k++) {
        const s = k / n, s2 = s * s, s3 = s2 * s;
        out.push([0, 1].map(j => .5 * (2 * b[j] + (c[j] - a[j]) * s + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * s2 + (3 * b[j] - a[j] - 3 * c[j] + d[j]) * s3)));
      }
    }
    out.push(closed ? out[0].slice() : pts[N - 1].slice());
    return out;
  };
  // a path with its arc length, so part of it can be drawn: { pts, cum, len }
  S.path = pts => { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, cum, len: cum[cum.length - 1] }; };
  // the first k (0..1) of a path, the end point interpolated
  S.part = (p, k) => {
    k = clamp(k); if (k >= 1) return p.pts; if (k <= 0) return [];
    const L = k * p.len; let i = 1; while (i < p.cum.length && p.cum[i] < L) i++;
    const u = (L - p.cum[i - 1]) / ((p.cum[i] - p.cum[i - 1]) || 1), a = p.pts[i - 1], b = p.pts[i];
    return [...p.pts.slice(0, i), [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]];
  };
  // push each point along the path's normal by smooth noise: an organic edge
  S.wiggle = (pts, amp, seed = 1, freq = 9) => pts.map((q, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const d = noise1(i / pts.length * freq, seed) * amp; return [q[0] - dy / l * d, q[1] + dx / l * d];
  });
  const place = (pts, s, cx, cy) => pts.map(([x, y]) => [cx + x * s, cy + y * s]);

  // ─── the human brain, left side view (front to the left) ────────────────────
  // Drawn from standard lateral-view anatomy: frontal, parietal, occipital and temporal lobes, the lateral (Sylvian)
  // fissure, the central sulcus with the pre- and postcentral sulci, the frontal, temporal and intraparietal sulci,
  // the cerebellum under the occipital lobe and the brainstem. Unit coordinates: x −1..1, y down.
  const CEREBRUM = [[-.97, .02], [-.93, -.28], [-.78, -.52], [-.55, -.68], [-.25, -.77], [.08, -.79], [.38, -.72], [.63, -.57], [.82, -.36], [.95, -.10], [.98, .10], [.90, .26], [.74, .33], [.50, .33], [.30, .38], [.05, .44], [-.20, .44], [-.38, .37], [-.45, .25], [-.41, .15], [-.54, .16], [-.73, .18], [-.90, .13]];
  const CEREBELLUM = [[.40, .36], [.62, .34], [.80, .37], [.88, .46], [.81, .58], [.61, .64], [.43, .60], [.35, .48]];
  const FOLIA = [[[.40, .44], [.62, .42], [.85, .46]], [[.39, .52], [.60, .51], [.81, .55]], [[.47, .59], [.60, .59], [.73, .60]]];
  const STEM = [[[.11, .44], [.13, .58], [.15, .72], [.17, .88]], [[.30, .40], [.30, .55], [.29, .72], [.28, .88]]];
  const SULCI = [
    [[-.41, .15], [-.20, .08], [.05, .02], [.25, -.05], [.38, -.17]],            // lateral (Sylvian) fissure
    [[.10, -.78], [.05, -.60], [.02, -.42], [-.03, -.25], [-.05, -.10], [-.02, .0]], // central sulcus
    [[-.13, -.72], [-.16, -.60], [-.19, -.47]],                                  // precentral, upper part
    [[-.21, -.39], [-.23, -.27], [-.26, -.14]],                                  // precentral, lower part (usually interrupted)
    [[.29, -.69], [.26, -.56], [.24, -.45]],                                     // postcentral, upper part
    [[.22, -.37], [.20, -.26], [.19, -.14]],                                     // postcentral, lower part
    [[-.24, -.58], [-.46, -.55], [-.68, -.45]],                                  // superior frontal
    [[-.27, -.31], [-.51, -.27], [-.75, -.18]],                                  // inferior frontal
    [[-.33, .29], [-.05, .24], [.25, .16], [.48, .02]],                          // superior temporal
    [[-.20, .38], [.10, .34], [.40, .27]],                                       // inferior temporal
    [[.28, -.40], [.48, -.42], [.70, -.30]],                                     // intraparietal
    [[.80, -.25], [.78, -.05], [.84, .12]],                                      // toward the occipital pole
  ];
  // s: world units per unit (the brain is about 1.95·s wide); cx, cy: its centre. Returns paths ready to draw.
  S.brain = (s = 390, cx = 0, cy = 0) => {
    const at = pts => place(pts, s, cx, cy - .04 * s);
    return {
      outline: S.path(at(S.wiggle(S.spline(CEREBRUM, true, 14), .006, 3, 30))),
      cerebellum: S.path(at(S.spline(CEREBELLUM, true, 10))),
      folia: FOLIA.map((f, i) => S.path(at(S.wiggle(S.spline(f, false, 12), .006, 20 + i, 6)))),
      stem: STEM.map(f => S.path(at(S.spline(f, false, 10)))),
      sulci: SULCI.map((f, i) => S.path(at(S.wiggle(S.spline(f, false, 14), .012, 40 + i, 7)))),
      centre: [cx + .55 * s, cy - .18 * s],  // an open spot of cortex, clear of the drawn sulci, where a symbol can sit (a symbol, not a location)
      box: { x0: cx - s, x1: cx + s, y0: cy - .83 * s, y1: cy + .84 * s },
    };
  };

  // ─── a neural network like a night sky ─────────────────────────────────────
  // Nodes on a jittered grid over [−X, X] × [−Y, Y] (world units), node 0 at the centre; each links to its nearest
  // neighbours. Every edge carries a spark with its own period and phase.
  S.network = ({ X = 1050, Y = 780, cell = 105, seed = 11, links = 3, reach = 200 } = {}) => {
    const r = rng(seed), nodes = [{ x: 0, y: 0, d: 0, tw: r() * 10, size: 1.4 }];
    for (let gx = -X; gx <= X; gx += cell) for (let gy = -Y; gy <= Y; gy += cell) {
      const x = gx + (r() - .5) * cell * .9, y = gy + (r() - .5) * cell * .9;
      if (Math.hypot(x, y) < cell * .7) continue;
      nodes.push({ x, y, d: Math.hypot(x, y), tw: r() * 10, size: .6 + r() * .8 });
    }
    const edges = [], seen = new Set();
    nodes.forEach((a, i) => {
      nodes.map((b, j) => [j, Math.hypot(a.x - b.x, a.y - b.y)]).filter(([j, d]) => j !== i && d < reach).sort((p, q) => p[1] - q[1]).slice(0, links)
        .forEach(([j]) => { const k = i < j ? `${i}-${j}` : `${j}-${i}`; if (seen.has(k)) return; seen.add(k); edges.push({ a: i, b: j, bend: (r() - .5) * .35, period: 1.3 + r() * 2.2, phase: r(), dir: r() < .5 }); });
    });
    return { nodes, edges };
  };
  // a point along an edge (slightly bowed), u 0..1
  S.edgeAt = (net, e, u) => {
    const a = net.nodes[e.a], b = net.nodes[e.b], mx = (a.x + b.x) / 2 - (b.y - a.y) * e.bend, my = (a.y + b.y) / 2 + (b.x - a.x) * e.bend;
    const v = 1 - u; return [v * v * a.x + 2 * v * u * mx + u * u * b.x, v * v * a.y + 2 * v * u * my + u * u * b.y];
  };

  // ─── the heart's electrical trace (ECG), for a list of beats [[t, amplitude], …] ──
  // P wave, QRS complex and T wave as gaussians around each beat, in units of the R peak
  const G = (x, m, w) => Math.exp(-((x - m) * (x - m)) / (2 * w * w));
  S.ecg = (tau, beats) => beats.reduce((v, [b, a]) => {
    const x = tau - b; if (x < -.3 || x > .45) return v;
    return v + a * (.12 * G(x, -.17, .035) - .14 * G(x, -.028, .01) + 1 * G(x, 0, .011) - .28 * G(x, .03, .013) + .26 * G(x, .22, .055));
  }, 0);

  S.hash = hash;
})();
