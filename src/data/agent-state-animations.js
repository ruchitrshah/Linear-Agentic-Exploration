const base = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 90,
  w: 72,
  h: 72,
  nm: "agent-state",
  ddd: 0,
  assets: [],
};

export const inProgressAnimation = {
  ...base,
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "orbital-ring",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 90, s: [360] }] },
        p: { a: 0, k: [36, 36, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [38, 38] }, nm: "ring-path" },
            {
              ty: "st",
              c: { a: 0, k: [0.9608, 0.7725, 0.0392, 1] },
              o: { a: 0, k: 85 },
              w: { a: 0, k: 4 },
              lc: 2,
              lj: 2,
              d: [
                { n: "d", nm: "dash", v: { a: 0, k: 54 } },
                { n: "g", nm: "gap", v: { a: 0, k: 18 } },
                { n: "o", nm: "offset", v: { a: 1, k: [{ t: 0, s: [0] }, { t: 90, s: [-72] }] } },
              ],
              nm: "ring-stroke",
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } },
          ],
          nm: "ring-group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "core-dot",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [90] }, { t: 45, s: [100] }, { t: 90, s: [90] }] },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [36, 36, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [82, 82, 100] }, { t: 45, s: [100, 100, 100] }, { t: 90, s: [82, 82, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [12, 12] }, nm: "dot-path" },
            { ty: "fl", c: { a: 0, k: [0.9608, 0.7725, 0.0392, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "dot-fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } },
          ],
          nm: "dot-group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
  ],
};

export const doneAnimation = {
  ...base,
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "done-glow",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [20] }, { t: 25, s: [40] }, { t: 70, s: [20] }] },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [36, 36, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [80, 80, 100] }, { t: 25, s: [110, 110, 100] }, { t: 70, s: [80, 80, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [28, 28] }, nm: "halo-path" },
            { ty: "fl", c: { a: 0, k: [0.4157, 0.8824, 0.6353, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "halo-fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } },
          ],
          nm: "halo-group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "done-ring",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [36, 36, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [38, 38] }, nm: "ring-path" },
            { ty: "st", c: { a: 0, k: [0.4157, 0.8824, 0.6353, 1] }, o: { a: 0, k: 40 }, w: { a: 0, k: 3 }, lc: 2, lj: 2, nm: "ring-stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } },
          ],
          nm: "ring-group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "checkmark",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [36, 36, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [88, 88, 100] }, { t: 25, s: [100, 100, 100] }, { t: 90, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                  v: [[-8, 1], [-2, 8], [10, -6]],
                  c: false,
                },
              },
              nm: "check-path",
            },
            { ty: "st", c: { a: 0, k: [0.4157, 0.8824, 0.6353, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 4 }, lc: 2, lj: 2, nm: "check-stroke" },
            { ty: "tm", s: { a: 1, k: [{ t: 0, s: [0] }, { t: 24, s: [100] }, { t: 90, s: [100] }] }, e: { a: 0, k: 100 }, o: { a: 0, k: 0 }, m: 1, nm: "trim" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } },
          ],
          nm: "check-group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
  ],
};
