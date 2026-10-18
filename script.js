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