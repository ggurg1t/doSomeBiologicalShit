function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rad(d) {
    return d * Math.PI / 180;
}

function deg(d) {
    return d / Math.PI * 180;
}

function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

function mod(x, n) {
    return ((x % n) + n) % n;
}

function pct(x0, x1, t) {
    return x0 + (x1 - x0) * t / 100;
}

function getPct(x0, x1, n) {
    return (n - x0) / (x1 - x0) * 100;
}

function dist(p0, p1) {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
    return Math.sqrt(dx * dx + dy * dy);
}

function angle(p0, p1) {
    return Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
}

function distXY(x0, y0, x1, y1) {
    const dx = x1 - x0, dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
}

function angleXY(x0, y0, x1, y1) {
    return Math.atan2(y1 - y0, x1 - x0);
}

Array.prototype.toOklch = function () {
    return `oklch(${this.join(' ')})`;
}

function angleDiff(d0, d1) {
    return Math.abs(mod(d0 - d1 + Math.PI, 2 * Math.PI) - Math.PI);
}


function smoothstep(x0, x1, x) {
    if (x0 == x1) return x0;

    const t = clamp((x - x0) / (x1 - x0), 0, 1);
    return t * t * (3 - 2 * t);
}

function anglePct(d0, d1, t) {
    const deltaD = mod(d1 - d0 + 180, 360) - 180;
    return mod(d0 + deltaD * t / 100, 360)
}

Array.prototype.sum = function () {
    return this.reduce((a, b) => a += b);
}

function rotateP(p0, p1, d) {
    const c = Math.cos(rad(d)), s = Math.sin(rad(d));
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
    return [p0[0] + c * dx - s * dy, p0[1] + s * dx + c * dy];
}

function circlePos(p, r, d) {
    return [p[0] + r * Math.cos(rad(d)), p[1] + r * Math.sin(rad(d))];
}

function hex2oklch(hex) {
    hex = hex.replace("#", "");

    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const toLinear = c =>
        c <= 0.04045
            ? c / 12.92
            : Math.pow((c + 0.055) / 1.055, 2.4);

    const R = toLinear(r);
    const G = toLinear(g);
    const B = toLinear(b);

    const l = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B;
    const m = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B;
    const s = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B;

    const L = 0.2104542553 * Math.cbrt(l) +
        0.7936177850 * Math.cbrt(m) -
        0.0040720468 * Math.cbrt(s);

    const a = 1.9779984951 * Math.cbrt(l) -
        2.4285922050 * Math.cbrt(m) +
        0.4505937099 * Math.cbrt(s);

    const b_ = 0.0259040371 * Math.cbrt(l) +
        0.7827717662 * Math.cbrt(m) -
        0.8086757660 * Math.cbrt(s);

    const C = Math.sqrt(a * a + b_ * b_);
    let H = Math.atan2(b_, a) * 180 / Math.PI;
    if (H < 0) H += 360;

    return [L, C, H];
}

function oklch2rgb(L, C, H) {
    const hr = H * Math.PI / 180;
    const a = C * Math.cos(hr);
    const b = C * Math.sin(hr);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;

    let R = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let B = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    const toSRGB = c => {
        c = clamp(c, 0, 1);
        return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    };

    return [
        Math.round(toSRGB(R) * 255),
        Math.round(toSRGB(G) * 255),
        Math.round(toSRGB(B) * 255),
    ];
}

function rgb2hex(r, g, b) {
    return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}

function hex2rgb(hex, returnString = false) {
    const h = hex.replace('#', '');
    const rgb = [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16)
    ];
    return returnString ? `rgb(${rgb.join(', ')})` : rgb;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function monoGra(lch0, lch1, n) {
    const result = [];
    for (let i = 0; i < 3; i++) {
        if (i < 2) { result.push(pct(lch0[i], lch1[i], n)); }
        else { result.push(anglePct(lch0[i], lch1[i], n)); }
    }
    return result;
}

function lchInterp(lchList, t) {

    if (t >= 100) return lchList.at(-1);

    const pctArr = lchList.map((x, i) => 100 / (lchList.length - 1) * i);
    const idx0 = pctArr.filter(x => x <= t).length - 1;
    return monoGra(lchList[idx0], lchList[idx0 + 1], getPct(pctArr[idx0], pctArr[idx0 + 1], t));
}

function oklchGra(colorList, t) {
    if (t == 100) { return hex2oklch(colorList.at(-1)); }
    const lchList = colorList.map(hex2oklch);
    return lchInterp(lchList, t);
}

function grade(n, arr) {
    const scoreArr = arr.map((x, i) => [x[0], x[1] + ((i == 0) ? 0 : [...arr].map(v => v[1]).splice(0, i).sum())]);
    return scoreArr.filter(x => x[1] >= n)[0][0];
}

function buildRGBLUT(hexList, steps = 256) {
    const lchList = hexList.map(hex2oklch);
    const lut = new Uint8ClampedArray(steps * 3);
    for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1) * 100;
        const [L, C, H] = lchInterp(lchList, t);
        const [r, g, bch] = oklch2rgb(L, C, H);
        lut[i * 3] = r;
        lut[i * 3 + 1] = g;
        lut[i * 3 + 2] = bch;
    }
    return lut;
}

const LUT_STEPS = 256;
function lutColor(lut, h) {
    const idx = Math.round(clamp(h, 0, 100) / 100 * (LUT_STEPS - 1)) * 3;
    return [lut[idx], lut[idx + 1], lut[idx + 2]];
}

function lutIndex(h) {
    return Math.round(clamp(h, 0, 100) / 100 * (LUT_STEPS - 1)) * 3;
}

const W = 300, H = 300;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imgData = ctx.createImageData(W, H);
let pixels = imgData.data;

function setPixel(x, y, ctxData, r, g, bch, a = 255) {
    const idx = (y * W + x) * 4;
    ctxData[idx] = r;
    ctxData[idx + 1] = g;
    ctxData[idx + 2] = bch;
    ctxData[idx + 3] = a;
    return ctxData;
}

function setPixelLUT(x, y, ctxData, lut, li, a = 255, draw = true) {
    const idx = (y * W + x) * 4;
    if (draw) {
        ctxData[idx] = lut[li];
        ctxData[idx + 1] = lut[li + 1];
        ctxData[idx + 2] = lut[li + 2];
        ctxData[idx + 3] = a;
    }
    return ctxData;
}

function b(x0, y0, x1, y1) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);

    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;

    let err = dx - dy;
    let result = [];
    while (true) {
        result.push([x0, y0])

        if (x0 === x1 && y0 === y1) break;

        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
    return result;
}

const CELL = { cx: 150, cy: 150, a: 100, b: 90 };
const RV = 18;
const K = 10;
const H_OUT = -(RV + K);

function smax(p, q, k) {
    const h = Math.max(k - Math.abs(p - q), 0) / k;
    return Math.max(p, q) + h * h * k * 0.25;
}

function ellipseSD(px, py, a, b) {
    const k0 = Math.hypot(px / a, py / b);
    const k1 = Math.hypot(px / (a * a), py / (b * b));
    return k1 < 1e-9 ? -Math.min(a, b) : k0 * (k0 - 1) / k1;
}

function rim(theta) {
    const c = Math.cos(theta), s = Math.sin(theta), a = CELL.a, b = CELL.b;
    const rr = a * b / Math.hypot(b * c, a * s);
    const px = rr * c, py = rr * s;
    const nx = -px / (a * a), ny = -py / (b * b);
    const len = Math.hypot(nx, ny);
    return { x: CELL.cx + px, y: CELL.cy + py, nx: nx / len, ny: ny / len };
}

function field(x, y, ves) {
    const fCell = ellipseSD(x - CELL.cx, y - CELL.cy, CELL.a, CELL.b);
    let dV = 1e9;
    for (const v of ves) dV = Math.min(dV, distXY(x, y, v.cx, v.cy) - v.r);
    return smax(fCell, -dV, K);
}

function eventH(e, time) {
    const t = clamp((time - e.t0) / e.dur, 0, 1);
    const s = smoothstep(0, 1, t) * 100;
    if (e.type === '') return e.H_FAR;
    if (e.type === 'exo') {
      return pct(e.H_FAR, H_OUT, clamp((s - 50) * 2, 0, 100));
    }
    return e.type === 'endo' ? pct(H_OUT, e.H_FAR, s) : pct(e.H_FAR, H_OUT, s);
}

function buildVes(events, time) {
    return events.map(e => {
        const h = eventH(e, time);
        const m = rim(e.theta);
        return { cx: m.x + m.nx * h, cy: m.y + m.ny * h, r: e.r ?? RV, fixed: e.type === '' };   // fixed: 움직이지 않는 정적 원(캐시 대상)
    });
}

// ───────────────────────── 격자 계산 가속 ─────────────────────────
// 원본은 격자 점(약 43,000개)마다 모든 원(수백 개)과의 거리를 구했다.
// 여기서는 (1) 원마다 영향 범위 안의 격자 점에서만 거리를 갱신하고,
// (2) 움직이지 않는 정적 원과 세포 타원 거리는 캐시해서 매 프레임에는 움직이는 소포만 계산한다.
// 영향 범위 밖(거리 ≥ CUTOFF)은 CUTOFF로 두는데, 이때 smax(fCell, -CUTOFF, K)는
// fCell ≥ -K 구간(= 곡선이 지나는 곳)에서 원래 값과 같고, 그 밖은 둘 다 음수라 곡선 위치가 변하지 않는다.
const CUTOFF = 2 * K;
let fcCache = null, stCache = null;

function splatCircles(dV, list, lox, loy, S) {
    for (const v of list) {
        const reach = v.r + CUTOFF;
        const i0 = Math.max(0, Math.floor(v.cx - reach - lox)), i1 = Math.min(S - 1, Math.ceil(v.cx + reach - lox));
        const j0 = Math.max(0, Math.floor(v.cy - reach - loy)), j1 = Math.min(S - 1, Math.ceil(v.cy + reach - loy));
        for (let j = j0; j <= j1; j++) {
            const row = j * S, y = loy + j;
            for (let i = i0; i <= i1; i++) {
                const d = distXY(lox + i, y, v.cx, v.cy) - v.r;
                if (d < dV[row + i]) dV[row + i] = d;
            }
        }
    }
}

function fieldGrid(ves, lox, loy, S) {
    const fkey = [CELL.cx, CELL.cy, CELL.a, CELL.b, lox, loy, S].join(',');
    if (!fcCache || fcCache.key !== fkey) {
        const arr = new Float32Array(S * S);
        for (let j = 0; j < S; j++)
            for (let i = 0; i < S; i++) arr[j * S + i] = ellipseSD(lox + i - CELL.cx, loy + j - CELL.cy, CELL.a, CELL.b);
        fcCache = { key: fkey, arr };
    }
    const fixed = [], moving = [];
    let h = 0;
    for (const v of ves) {
        if (v.fixed) { fixed.push(v); h = (h * 131 + Math.round(v.cx * 1000) * 7 + Math.round(v.cy * 1000) * 13 + Math.round(v.r * 1000)) % 2147483647; }
        else moving.push(v);
    }
    const skey = fkey + '|' + fixed.length + ':' + h;
    if (!stCache || stCache.key !== skey) {
        const arr = new Float32Array(S * S).fill(CUTOFF);
        splatCircles(arr, fixed, lox, loy, S);
        stCache = { key: skey, arr };
    }
    const dV = Float32Array.from(stCache.arr);
    splatCircles(dV, moving, lox, loy, S);
    const fc = fcCache.arr, g = new Float32Array(S * S);
    for (let k = 0; k < g.length; k++) g[k] = smax(fc[k], -dV[k], K);
    return g;
}

function traceContours(ves) {
    const M = Math.max(CELL.a, CELL.b);
    const lox = CELL.cx - M - 4, loy = CELL.cy - M - 4;
    const n = 2 * M + 8, S = n + 1;
    const g = fieldGrid(ves, lox, loy, S);

    const eH = (i, j) => (j * S + i) * 2;
    const eV = (i, j) => (j * S + i) * 2 + 1;
    const adj = new Map();
    const link = (p, q) => {
        if (!adj.has(p)) adj.set(p, []);
        if (!adj.has(q)) adj.set(q, []);
        adj.get(p).push(q); adj.get(q).push(p);
    };

    for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
            const a = g[j * S + i], bb = g[j * S + i + 1];
            const c = g[(j + 1) * S + i + 1], d = g[(j + 1) * S + i];
            const idx = (a < 0 ? 1 : 0) | (bb < 0 ? 2 : 0) | (c < 0 ? 4 : 0) | (d < 0 ? 8 : 0);
            if (idx === 0 || idx === 15) continue;
            const T = eH(i, j), B = eH(i, j + 1), L = eV(i, j), R = eV(i + 1, j);
            switch (idx) {
                case 1: case 14: link(L, T); break;
                case 2: case 13: link(T, R); break;
                case 3: case 12: link(L, R); break;
                case 4: case 11: link(R, B); break;
                case 6: case 9: link(T, B); break;
                case 7: case 8: link(L, B); break;
                case 5: case 10: {
                    const inside = (a + bb + c + d) / 4 < 0;
                    if ((idx === 5) === inside) { link(T, R); link(L, B); }
                    else { link(L, T); link(R, B); }
                }
            }
        }
    }

    const pos = key => {
        const id = key >> 1, i = id % S, j = (id / S) | 0;
        if ((key & 1) === 0) {
            const f0 = g[j * S + i], f1 = g[j * S + i + 1];
            return [lox + i + f0 / (f0 - f1), loy + j];
        }
        const f0 = g[j * S + i], f1 = g[(j + 1) * S + i];
        return [lox + i, loy + j + f0 / (f0 - f1)];
    };

    const seen = new Set(), loops = [];
    for (const start of adj.keys()) {
        if (seen.has(start)) continue;
        const loop = [];
        let prev = -1, cur = start;
        while (!seen.has(cur)) {
            seen.add(cur);
            loop.push(pos(cur));
            const nb = adj.get(cur);
            const nx = nb[0] === prev ? nb[1] : nb[0];
            prev = cur; cur = nx;
        }
        if (loop.length > 3) loops.push(loop);
    }
    loops.grid = { g, lox, loy, S };      // 법선 계산에 재사용
    return loops;
}

function normalAngle(x, y, ves) {
    const e = 0.5;
    const gx = field(x + e, y, ves) - field(x - e, y, ves);
    const gy = field(x, y + e, ves) - field(x, y - e, ves);
    return Math.atan2(gy, gx);
}

function resample(loop, spacing) {
    const m = loop.length, cum = [0];
    for (let i = 0; i < m; i++) cum.push(cum[i] + dist(loop[i], loop[(i + 1) % m]));
    const total = cum[m];
    const cnt = Math.max(3, Math.round(total / spacing));
    const out = [];
    let seg = 0;
    for (let k = 0; k < cnt; k++) {
        const s = k * total / cnt;
        while (cum[seg + 1] < s) seg++;
        const u = (s - cum[seg]) / (cum[seg + 1] - cum[seg] || 1);
        const p0 = loop[seg], p1 = loop[(seg + 1) % m];
        out.push([p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u]);
    }
    return out;
}

// 격자 값을 쌍선형 보간해서 법선을 구한다 (field()를 다시 부르지 않아 훨씬 빠름)
function gridF(grid, x, y) {
    const { g, lox, loy, S } = grid;
    const u = clamp(x - lox, 0, S - 1.001), v = clamp(y - loy, 0, S - 1.001);
    const i = Math.floor(u), j = Math.floor(v), fx = u - i, fy = v - j;
    const a = g[j * S + i], b0 = g[j * S + i + 1], c = g[(j + 1) * S + i], d = g[(j + 1) * S + i + 1];
    return (a * (1 - fx) + b0 * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
}
function gridNormal(grid, x, y) {
    const e = 1;
    return Math.atan2(gridF(grid, x, y + e) - gridF(grid, x, y - e), gridF(grid, x + e, y) - gridF(grid, x - e, y));
}

// withAngle=false 이면 법선 각도를 계산하지 않는다 (곡선만 그릴 때는 각도가 필요 없다)
function buildMembrane(ves, spacing = 4, withAngle = true) {
    const loops = traceContours(ves), grid = loops.grid;
    return loops
        .map(l => resample(l, spacing).map(p => [p[0], p[1], withAngle ? gridNormal(grid, p[0], p[1]) : 0]))
        .sort((p, q) => q.length - p.length);
}

const events = [];

function startEvent(type, angleDeg, dur, r, H_FAR, maxR) {
    const e = { type, theta: rad(angleDeg), t0: performance.now(), dur, r, H_FAR, maxR };
    events.push(e);
    return e;
}

function endocytosis(angleDeg, dur = 3500, r = RV, H_FAR = 72, maxR = 10) { return startEvent('endo', angleDeg, dur, r, H_FAR, maxR); }
function exocytosis(angleDeg, dur = 3500, H_FAR = 72, maxR = 10) { return startEvent('exo', angleDeg, dur, 2, H_FAR, maxR); }
function clearVesicles() { events.length = 0; }

function pruneEvents(now) {
    for (let i = events.length - 1; i >= 0; i--) {
        const e = events[i];
        if (e.type === 'exo' && now >= e.t0 + e.dur) events.splice(i, 1);
        if (e.type === 'exo' && e.r < e.maxR) {
          const t = clamp((now - e.t0) / e.dur, 0, 1);
          const s = smoothstep(0, 1, t) * 100;
          e.r = pct(2, e.maxR, clamp(s * 2, 0, 100))
        }
    }
}

const LINE_COLOR = hex2rgb('#70768b');

function drawCurve(loops) {
    for (const loop of loops) {
        for (let i = 0; i < loop.length; i++) {
            const p0 = loop[i], p1 = loop[(i + 1) % loop.length];
            for (const [x, y] of b(p0[0], p0[1], p1[0], p1[1])) {
                if (x < 0 || x >= W || y < 0 || y >= H) continue;
                setPixel(x, y, pixels, LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
            }
        }
    }
}

function renderFrame(now) {
    pixels.fill(0);
    pruneEvents(now);
    drawCurve(buildMembrane(buildVes(events, now), 2, false));
    ctx.putImageData(imgData, 0, 0);
    requestAnimationFrame(renderFrame);
}
requestAnimationFrame(renderFrame);

for (let i = 25; i < 45; i += 8) {
    for (let j = -Math.floor(i * 0.75); j <= Math.floor(i * 0.75); j++) {
        startEvent('', j + i / 3 + 110, 0, 2 + (j % Math.floor(i * 0.75) == 0 && j != 0) * 2, i);
    }
}

for (let i = 60; i <= 72; i += 3) {
    for (let j = -i; j <= i; j++) {
        if ([63, 69].includes(i) && (j * j) % ((i - 60) * 13) != 0) continue;
        startEvent('', j + i - 30, 0, 2 + (j % i == 0 && j != 0) * 2, i);
    }
}
startEvent('', 20, 0, 25, 99.5);
setTimeout(() => exocytosis(rand(100, 140), 2000, 25, 10), 500);
