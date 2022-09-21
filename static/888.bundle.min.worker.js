(self.webpackChunkcornerstoneWADOImageLoader =
  self.webpackChunkcornerstoneWADOImageLoader || []).push([
  [888],
  {
    1888(e, r) {
      const n = { Unkown: 0, Grayscale: 1, AdobeRGB: 2, RGB: 3, CYMK: 4 };
      const o = (function() {
        const e = new Int32Array([
          0,
          1,
          8,
          16,
          9,
          2,
          3,
          10,
          17,
          24,
          32,
          25,
          18,
          11,
          4,
          5,
          12,
          19,
          26,
          33,
          40,
          48,
          41,
          34,
          27,
          20,
          13,
          6,
          7,
          14,
          21,
          28,
          35,
          42,
          49,
          56,
          57,
          50,
          43,
          36,
          29,
          22,
          15,
          23,
          30,
          37,
          44,
          51,
          58,
          59,
          52,
          45,
          38,
          31,
          39,
          46,
          53,
          60,
          61,
          54,
          47,
          55,
          62,
          63,
        ]);
        const r = 4017;
        const o = 799;
        const a = 3406;
        const t = 2276;
        const s = 1567;
        const i = 3784;
        const c = 5793;
        const l = 2896;
        function f() {}
        function u(e, r) {
          for (var n, o, a = 0, t = [], s = 16; s > 0 && !e[s - 1]; ) s--;
          t.push({ children: [], index: 0 });
          let i;
          let c = t[0];
          for (n = 0; n < s; n++) {
            for (o = 0; o < e[n]; o++) {
              for ((c = t.pop()).children[c.index] = r[a]; c.index > 0; )
                c = t.pop();
              for (c.index++, t.push(c); t.length <= n; )
                t.push((i = { children: [], index: 0 })),
                (c.children[c.index] = i.children),
                (c = i);
              a++;
            }
            n + 1 < s &&
              (t.push((i = { children: [], index: 0 })),
              (c.children[c.index] = i.children),
              (c = i));
          }
          return t[0].children;
        }
        function h(e, r, n) {
          return 64 * ((e.blocksPerLine + 1) * r + n);
        }
        function b(r, n, o, a, t, s, i, c, l) {
          o.precision, o.samplesPerLine, o.scanLines;
          const f = o.mcusPerLine;
          const u = o.progressive;
          const b = (o.maxH, o.maxV, n);
          let v = 0;
          let m = 0;
          function p() {
            if (m > 0) return m--, (v >> m) & 1;
            if ((v = r[n++]) == 255) {
              const e = r[n++];
              if (e) throw `unexpected marker: ${((v << 8) | e).toString(16)}`;
            }
            return (m = 7), v >>> 7;
          }
          function d(e) {
            for (var r, n = e; (r = p()) !== null; ) {
              if (typeof (n = n[r]) === 'number') return n;
              if (typeof n !== 'object') throw 'invalid huffman sequence';
            }
            return null;
          }
          function k(e) {
            for (var r = 0; e > 0; ) {
              const n = p();
              if (n === null) return;
              (r = (r << 1) | n), e--;
            }
            return r;
          }
          function w(e) {
            const r = k(e);
            return r >= 1 << (e - 1) ? r : r + (-1 << e) + 1;
          }
          let C = 0;
          let P;
          let g = 0;
          function D(e, r, n, o, a) {
            const t = n % f;
            r(e, h(e, ((n / f) | 0) * e.v + o, t * e.h + a));
          }
          function L(e, r, n) {
            r(e, h(e, (n / e.blocksPerLine) | 0, n % e.blocksPerLine));
          }
          let y;
          let x;
          let A;
          let T;
          let I;
          let U;
          const q = a.length;
          U = u
            ? s === 0
              ? c === 0
                ? function(e, r) {
                  let n = d(e.huffmanTableDC);
                    var o = n === 0 ? 0 : w(n) << l;
                  e.blockData[r] = e.pred += o;
                }
                : function(e, r) {
                  e.blockData[r] |= p() << l;
                }
              : c === 0
                ? function(r, n) {
                  if (C > 0) C--;
                  else
                    for (let o = s, a = i; o <= a; ) {
                      const t = d(r.huffmanTableAC);
                      const c = 15 & t;
                      const f = t >> 4;
                      if (c !== 0) {
                        const u = e[(o += f)];
                        (r.blockData[n + u] = w(c) * (1 << l)), o++;
                      } else {
                        if (f < 15) {
                          C = k(f) + (1 << f) - 1;
                          break;
                        }
                        o += 16;
                      }
                    }
                }
              : function(r, n) {
                  for (let o = s, a = i, t = 0; o <= a; ) {
                    const c = e[o];
                    switch (g) {
                      case 0:
                        var f = d(r.huffmanTableAC);
                        var u = 15 & f;
                        if (((t = f >> 4), u === 0))
                          t < 15
                            ? ((C = k(t) + (1 << t)), (g = 4))
                            : ((t = 16), (g = 1));
                        else {
                          if (u !== 1) throw 'invalid ACn encoding';
                          (P = w(u)), (g = t ? 2 : 3);
                        }
                        continue;
                      case 1:
                      case 2:
                        r.blockData[n + c]
                          ? (r.blockData[n + c] += p() << l)
                          : --t == 0 && (g = g == 2 ? 3 : 0);
                        break;
                      case 3:
                        r.blockData[n + c]
                          ? (r.blockData[n + c] += p() << l)
                          : ((r.blockData[n + c] = P << l), (g = 0));
                        break;
                      case 4:
                        r.blockData[n + c] && (r.blockData[n + c] += p() << l);
                    }
                    o++;
                  }
                  g === 4 && --C == 0 && (g = 0);
                }
            : function(r, n) {
              const o = d(r.huffmanTableDC);
                let a = o === 0 ? 0 : w(o);
              r.blockData[n] = r.pred += a;
              for (let t = 1; t < 64; ) {
                const s = d(r.huffmanTableAC);
                  var i = 15 & s;
                  const c = s >> 4;
                if (i !== 0) {
                  let l = e[(t += c)];
                  (r.blockData[n + l] = w(i)), t++;
                } else {
                  if (c < 15) break;
                  t += 16;
                }
              }
            };
          let G;
          let M;
          let z;
          let H;
          let O = 0;
          for (
            M =
              q == 1
                ? a[0].blocksPerLine * a[0].blocksPerColumn
                : f * o.mcusPerColumn,
            t || (t = M);
            O < M;

          ) {
            for (x = 0; x < q; x++) a[x].pred = 0;
            if (((C = 0), q == 1))
              for (y = a[0], I = 0; I < t; I++) L(y, U, O), O++;
            else
              for (I = 0; I < t; I++) {
                for (x = 0; x < q; x++)
                  for (z = (y = a[x]).h, H = y.v, A = 0; A < H; A++)
                    for (T = 0; T < z; T++) D(y, U, O, A, T);
                O++;
              }
            if (((m = 0), (G = (r[n] << 8) | r[n + 1]) <= 65280))
              throw 'marker was not found';
            if (!(G >= 65488 && G <= 65495)) break;
            n += 2;
          }
          return n - b;
        }
        function v(e, n, f) {
          let u;
          let h;
          let b;
          let v;
          let m;
          let p;
          let d;
          let k;
          let w;
          let C;
          const P = e.quantizationTable;
          for (C = 0; C < 64; C++) f[C] = e.blockData[n + C] * P[C];
          for (C = 0; C < 8; ++C) {
            const g = 8 * C;
            f[1 + g] !== 0 ||
            f[2 + g] !== 0 ||
            f[3 + g] !== 0 ||
            f[4 + g] !== 0 ||
            f[5 + g] !== 0 ||
            f[6 + g] !== 0 ||
            f[7 + g] !== 0
              ? ((u = (c * f[0 + g] + 128) >> 8),
              (h = (c * f[4 + g] + 128) >> 8),
              (b = f[2 + g]),
              (v = f[6 + g]),
              (m = (l * (f[1 + g] - f[7 + g]) + 128) >> 8),
              (k = (l * (f[1 + g] + f[7 + g]) + 128) >> 8),
              (p = f[3 + g] << 4),
              (d = f[5 + g] << 4),
              (w = (u - h + 1) >> 1),
              (u = (u + h + 1) >> 1),
              (h = w),
              (w = (b * i + v * s + 128) >> 8),
              (b = (b * s - v * i + 128) >> 8),
              (v = w),
              (w = (m - d + 1) >> 1),
              (m = (m + d + 1) >> 1),
              (d = w),
              (w = (k + p + 1) >> 1),
              (p = (k - p + 1) >> 1),
              (k = w),
              (w = (u - v + 1) >> 1),
              (u = (u + v + 1) >> 1),
              (v = w),
              (w = (h - b + 1) >> 1),
              (h = (h + b + 1) >> 1),
              (b = w),
              (w = (m * t + k * a + 2048) >> 12),
              (m = (m * a - k * t + 2048) >> 12),
              (k = w),
              (w = (p * o + d * r + 2048) >> 12),
              (p = (p * r - d * o + 2048) >> 12),
              (d = w),
              (f[0 + g] = u + k),
              (f[7 + g] = u - k),
              (f[1 + g] = h + d),
              (f[6 + g] = h - d),
              (f[2 + g] = b + p),
              (f[5 + g] = b - p),
              (f[3 + g] = v + m),
              (f[4 + g] = v - m))
              : ((w = (c * f[0 + g] + 512) >> 10),
              (f[0 + g] = w),
              (f[1 + g] = w),
              (f[2 + g] = w),
              (f[3 + g] = w),
              (f[4 + g] = w),
              (f[5 + g] = w),
              (f[6 + g] = w),
              (f[7 + g] = w));
          }
          for (C = 0; C < 8; ++C) {
            const D = C;
            f[8 + D] !== 0 ||
            f[16 + D] !== 0 ||
            f[24 + D] !== 0 ||
            f[32 + D] !== 0 ||
            f[40 + D] !== 0 ||
            f[48 + D] !== 0 ||
            f[56 + D] !== 0
              ? ((u = (c * f[0 + D] + 2048) >> 12),
              (h = (c * f[32 + D] + 2048) >> 12),
              (b = f[16 + D]),
              (v = f[48 + D]),
              (m = (l * (f[8 + D] - f[56 + D]) + 2048) >> 12),
              (k = (l * (f[8 + D] + f[56 + D]) + 2048) >> 12),
              (p = f[24 + D]),
              (d = f[40 + D]),
              (w = (u - h + 1) >> 1),
              (u = (u + h + 1) >> 1),
              (h = w),
              (w = (b * i + v * s + 2048) >> 12),
              (b = (b * s - v * i + 2048) >> 12),
              (v = w),
              (w = (m - d + 1) >> 1),
              (m = (m + d + 1) >> 1),
              (d = w),
              (w = (k + p + 1) >> 1),
              (p = (k - p + 1) >> 1),
              (k = w),
              (w = (u - v + 1) >> 1),
              (u = (u + v + 1) >> 1),
              (v = w),
              (w = (h - b + 1) >> 1),
              (h = (h + b + 1) >> 1),
              (b = w),
              (w = (m * t + k * a + 2048) >> 12),
              (m = (m * a - k * t + 2048) >> 12),
              (k = w),
              (w = (p * o + d * r + 2048) >> 12),
              (p = (p * r - d * o + 2048) >> 12),
              (d = w),
              (f[0 + D] = u + k),
              (f[56 + D] = u - k),
              (f[8 + D] = h + d),
              (f[48 + D] = h - d),
              (f[16 + D] = b + p),
              (f[40 + D] = b - p),
              (f[24 + D] = v + m),
              (f[32 + D] = v - m))
              : ((w = (c * f[C + 0] + 8192) >> 14),
              (f[0 + D] = w),
              (f[8 + D] = w),
              (f[16 + D] = w),
              (f[24 + D] = w),
              (f[32 + D] = w),
              (f[40 + D] = w),
              (f[48 + D] = w),
              (f[56 + D] = w));
          }
          for (C = 0; C < 64; ++C) {
            const L = n + C;
            let y = f[C];
            (y =
              y <= -2056 / e.bitConversion
                ? 0
                : y >= 2024 / e.bitConversion
                ? 255 / e.bitConversion
                : (y + 2056 / e.bitConversion) >> 4),
            (e.blockData[L] = y);
          }
        }
        function m(e, r) {
          for (
            let n = r.blocksPerLine,
              o = r.blocksPerColumn,
              a = new Int32Array(64),
              t = 0;
            t < o;
            t++
          )
            for (let s = 0; s < n; s++) {
              v(r, h(r, t, s), a);
            }
          return r.blockData;
        }
        function p(e) {
          return e <= 0 ? 0 : e >= 255 ? 255 : 0 | e;
        }
        return (
          (f.prototype = {
            load(e) {
              const r = function(e) {
                this.parse(e), this.onload && this.onload();
              }.bind(this);
              if (e.indexOf('data:') > -1) {
                for (
                  var n = e.indexOf('base64,') + 7,
                    o = atob(e.substring(n)),
                    a = new Uint8Array(o.length),
                    t = o.length - 1;
                  t >= 0;
                  t--
                )
                  a[t] = o.charCodeAt(t);
                r(o);
              } else {
                const s = new XMLHttpRequest();
                s.open('GET', e, !0),
                  (s.responseType = 'arraybuffer'),
                  (s.onload = function() {
                  let e = new Uint8Array(s.response);
                  r(e);
                  }),
                  s.send(null);
              }
            },
            parse(r) {
              function o() {
                const e = (r[c] << 8) | r[c + 1];
                return (c += 2), e;
              }
              function a() {
                const e = o();
                const n = r.subarray(c, c + e - 2);
                return (c += n.length), n;
              }
              function t(e) {
                for (
                  var r = Math.ceil(e.samplesPerLine / 8 / e.maxH),
                    n = Math.ceil(e.scanLines / 8 / e.maxV),
                    o = 0;
                  o < e.components.length;
                  o++
                ) {
                  S = e.components[o];
                  const a = Math.ceil(
                    (Math.ceil(e.samplesPerLine / 8) * S.h) / e.maxH,
                  );
                  const t = Math.ceil(
                    (Math.ceil(e.scanLines / 8) * S.v) / e.maxV,
                  );
                  const s = r * S.h;
                  const i = 64 * (n * S.v) * (s + 1);
                  (S.blockData = new Int16Array(i)),
                    (S.blocksPerLine = a),
                  (S.blocksPerColumn = t);
                }
                (e.mcusPerLine = r), (e.mcusPerColumn = n);
              }
              let s;
              let i;
              var c = 0;
              let l = (r.length, null);
              let f = null;
              const h = [];
              const v = [];
              const p = [];
              let d = o();
              if (d != 65496) throw 'SOI not found';
              for (d = o(); d != 65497; ) {
                var k;
                var w;
                switch (d) {
                  case 65504:
                  case 65505:
                  case 65506:
                  case 65507:
                  case 65508:
                  case 65509:
                  case 65510:
                  case 65511:
                  case 65512:
                  case 65513:
                  case 65514:
                  case 65515:
                  case 65516:
                  case 65517:
                  case 65518:
                  case 65519:
                  case 65534:
                    var C = a();
                    d === 65504 &&
                      C[0] === 74 &&
                      C[1] === 70 &&
                      C[2] === 73 &&
                      C[3] === 70 &&
                      C[4] === 0 &&
                      (l = {
                        version: { major: C[5], minor: C[6] },
                        densityUnits: C[7],
                        xDensity: (C[8] << 8) | C[9],
                        yDensity: (C[10] << 8) | C[11],
                        thumbWidth: C[12],
                        thumbHeight: C[13],
                        thumbData: C.subarray(14, 14 + 3 * C[12] * C[13]),
                      }),
                      d === 65518 &&
                        C[0] === 65 &&
                        C[1] === 100 &&
                        C[2] === 111 &&
                        C[3] === 98 &&
                        C[4] === 101 &&
                        C[5] === 0 &&
                        (f = {
                          version: C[6],
                          flags0: (C[7] << 8) | C[8],
                          flags1: (C[9] << 8) | C[10],
                          transformCode: C[11],
                        });
                    break;
                  case 65499:
                    for (let P = o() + c - 2; c < P; ) {
                      const g = r[c++];
                      const D = new Int32Array(64);
                      if (g >> 4 == 0)
                        for (k = 0; k < 64; k++) {
                          D[e[k]] = r[c++];
                        }
                      else {
                        if (g >> 4 != 1) throw 'DQT: invalid table spec';
                        for (k = 0; k < 64; k++) {
                          D[e[k]] = o();
                        }
                      }
                      h[15 & g] = D;
                    }
                    break;
                  case 65472:
                  case 65473:
                  case 65474:
                    if (s) throw 'Only single frame JPEGs supported';
                    o(),
                      ((s = {}).extended = d === 65473),
                    (s.progressive = d === 65474),
                      (s.precision = r[c++]),
                    (s.scanLines = o()),
                      (s.samplesPerLine = o()),
                    (s.components = []),
                      (s.componentIds = {});
                    var L;
                    var y = r[c++];
                    var x = 0;
                    var A = 0;
                    for (J = 0; J < y; J++) {
                      L = r[c];
                      const T = r[c + 1] >> 4;
                      const I = 15 & r[c + 1];
                      x < T && (x = T), A < I && (A = I);
                      const U = r[c + 2];
                      (w = s.components.push({
                        h: T,
                        v: I,
                        quantizationTable: h[U],
                        quantizationTableId: U,
                        bitConversion: 255 / ((1 << s.precision) - 1),
                      })),
                        (s.componentIds[L] = w - 1),
                      (c += 3);
                    }
                    (s.maxH = x), (s.maxV = A), t(s);
                    break;
                  case 65476:
                    var q = o();
                    for (J = 2; J < q; ) {
                      const G = r[c++];
                      const M = new Uint8Array(16);
                      let z = 0;
                      for (k = 0; k < 16; k++, c++) z += M[k] = r[c];
                      const H = new Uint8Array(z);
                      for (k = 0; k < z; k++, c++) H[k] = r[c];
                      (J += 17 + z), ((G >> 4 == 0 ? p : v)[15 & G] = u(M, H));
                    }
                    break;
                  case 65501:
                    o(), (i = o());
                    break;
                  case 65498:
                    o();
                    var O = r[c++];
                    var R = [];
                    for (J = 0; J < O; J++) {
                      const V = s.componentIds[r[c++]];
                      S = s.components[V];
                      const Y = r[c++];
                      (S.huffmanTableDC = p[Y >> 4]),
                      (S.huffmanTableAC = v[15 & Y]),
                      R.push(S);
                    }
                    var B = r[c++];
                    var X = r[c++];
                    var j = r[c++];
                    var E = b(r, c, s, R, i, B, X, j >> 4, 15 & j);
                    c += E;
                    break;
                  case 65535:
                    r[c] !== 255 && c--;
                    break;
                  default:
                    if (r[c - 3] == 255 && r[c - 2] >= 192 && r[c - 2] <= 254) {
                      c -= 3;
                      break;
                    }
                    throw `unknown JPEG marker ${d.toString(16)}`;
                }
                d = o();
              }
              switch (
                ((this.width = s.samplesPerLine),
                (this.height = s.scanLines),
                (this.jfif = l),
                (this.adobe = f),
                (this.components = []),
                s.components.length)
              ) {
                case 1:
                  this.colorspace = n.Grayscale;
                  break;
                case 3:
                  this.adobe
                    ? (this.colorspace = n.AdobeRGB)
                    : (this.colorspace = n.RGB);
                  break;
                case 4:
                  this.colorspace = n.CYMK;
                  break;
                default:
                  this.colorspace = n.Unknown;
              }
              for (var J = 0; J < s.components.length; J++) {
                var S;
                (S = s.components[J]).quantizationTable ||
                  S.quantizationTableId === null ||
                  (S.quantizationTable = h[S.quantizationTableId]),
                  this.components.push({
                  output: m(0, S),
                    scaleX: S.h / s.maxH,
                    scaleY: S.v / s.maxV,
                  blocksPerLine: S.blocksPerLine,
                    blocksPerColumn: S.blocksPerColumn,
                  bitConversion: S.bitConversion,
                });
              }
            },
            getData16(e, r) {
              if (this.components.length !== 1) throw 'Unsupported color mode';
              let n;
              let o;
              let a;
              let t;
              let s;
              let i;
              const c = this.width / e;
              const l = this.height / r;
              let f = 0;
              const u = this.components.length;
              const b = new Uint16Array(e * r * u);
              const v = new Uint16Array(
                (this.components[0].blocksPerLine << 3) *
                  this.components[0].blocksPerColumn *
                  8,
              );
              for (i = 0; i < u; i++) {
                for (
                  var m,
                    p,
                    d,
                    k = (n = this.components[i]).blocksPerLine,
                    w = n.blocksPerColumn,
                    C = k << 3,
                    P = 0,
                    g = 0;
                  g < w;
                  g++
                )
                  for (let D = g << 3, L = 0; L < k; L++) {
                    const y = h(n, g, L);
                    const x = ((f = 0), L << 3);
                    for (m = 0; m < 8; m++) {
                      P = (D + m) * C;
                      for (p = 0; p < 8; p++) v[P + x + p] = n.output[y + f++];
                    }
                  }
                for (
                  o = n.scaleX * c, a = n.scaleY * l, f = i, s = 0;
                  s < r;
                  s++
                )
                  for (t = 0; t < e; t++)
                    (d = (0 | (s * a)) * C + (0 | (t * o))),
                    (b[f] = v[d]),
                      (f += u);
              }
              return b;
            },
            getData(e, r) {
              let n;
              let o;
              let a;
              let t;
              let s;
              let i;
              let c;
              let l;
              let f;
              let u;
              let b;
              let v;
              let m;
              let d;
              let k;
              const w = this.width / e;
              const C = this.height / r;
              let P = 0;
              const g = this.components.length;
              const D = e * r * g;
              const L = new Uint8Array(D);
              const y = new Uint8Array(
                (this.components[0].blocksPerLine << 3) *
                  this.components[0].blocksPerColumn *
                  8,
              );
              for (i = 0; i < g; i++) {
                for (
                  var x,
                    A,
                    T,
                    I = (n = this.components[i]).blocksPerLine,
                    U = n.blocksPerColumn,
                    q = I << 3,
                    G = 0,
                    M = 0;
                  M < U;
                  M++
                )
                  for (let z = M << 3, H = 0; H < I; H++) {
                    const O = h(n, M, H);
                    const R = ((P = 0), H << 3);
                    for (x = 0; x < 8; x++) {
                      G = (z + x) * q;
                      for (A = 0; A < 8; A++)
                        y[G + R + A] = n.output[O + P++] * n.bitConversion;
                    }
                  }
                for (
                  o = n.scaleX * w, a = n.scaleY * C, P = i, s = 0;
                  s < r;
                  s++
                )
                  for (t = 0; t < e; t++)
                    (T = (0 | (s * a)) * q + (0 | (t * o))),
                    (L[P] = y[T]),
                      (P += g);
              }
              switch (g) {
                case 1:
                case 2:
                  break;
                case 3:
                  if (
                    ((k = !0),
                    this.adobe && this.adobe.transformCode
                      ? (k = !0)
                      : void 0 !== this.colorTransform &&
                        (k = !!this.colorTransform),
                    k)
                  )
                    for (i = 0; i < D; i += g)
                      (c = L[i]),
                        (l = L[i + 1]),
                        (v = p(c - 179.456 + 1.402 * (f = L[i + 2]))),
                        (m = p(c + 135.459 - 0.344 * l - 0.714 * f)),
                      (d = p(c - 226.816 + 1.772 * l)),
                        (L[i] = v),
                        (L[i + 1] = m),
                      (L[i + 2] = d);
                  break;
                case 4:
                  if (!this.adobe)
                    throw 'Unsupported color mode (4 components)';
                  if (
                    ((k = !1),
                    this.adobe && this.adobe.transformCode
                      ? (k = !0)
                      : void 0 !== this.colorTransform &&
                        (k = !!this.colorTransform),
                    k)
                  )
                    for (i = 0; i < D; i += g)
                      (c = L[i]),
                      (l = L[i + 1]),
                        (u = p(434.456 - c - 1.402 * (f = L[i + 2]))),
                      (b = p(119.541 - c + 0.344 * l + 0.714 * f)),
                        (c = p(481.816 - c - 1.772 * l)),
                      (L[i] = u),
                        (L[i + 1] = b),
                      (L[i + 2] = c);
                  break;
                default:
                  throw 'Unsupported color mode';
              }
              return L;
            },
          }),
          f
        );
      })();
      e.exports = { JpegImage: o };
    },
  },
]);
// # sourceMappingURL=888.bundle.min.worker.js.map
