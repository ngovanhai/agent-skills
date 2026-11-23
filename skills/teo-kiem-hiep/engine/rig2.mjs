// Rig v2 — nhân vật chibi thân ngắn đầu to (~2,3 đầu), mặt anime, 16 khớp lồng nhau (FK). Mỗi khớp là <g id="p-<khớp>" transform="translate(x y) rotate(0)">,
// phần con vẽ trong toạ độ của khớp (khớp ở 0,0). runtime2.js xoay bằng attr transform nên không cần svgOrigin, không lệch tâm.
// viewBox 0 0 400 620: gốc/hông ở (200,400), vai y≈308, cổ y≈294, chân chạm y≈548 (FEET). Đầu lấy từ gen-chars.anime (300×420) thu 0,855 (~2,6 đầu).
// Khớp: all torso head uaF faF hdF uaB faB hdB thF shF ftF thB shB ftB (+ breath, flapF flapB hairB tail = chuyển động phụ)
const hx = (c) => { c = c.replace("#", ""); if (c.length === 3) c = [...c].map((x) => x + x).join(""); return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16)); };
const toHex = (a) => "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
export const dk = (c, f = 0.45) => toHex(hx(c).map((v) => v * (1 - f)));
export const lt = (c, f = 0.35) => toHex(hx(c).map((v) => v + (255 - v) * f));
const st = (c, w = 3) => `stroke="${dk(c, 0.55)}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const LINE = "#3A2420";
export const SKIN = { sang: "#FFE3CF", vang: "#FBD3B0", nau: "#E2A578", dam: "#A86B45" };
export const EXPRS = ["vui", "binh", "gian", "buon", "soc", "dac-y", "ngai", "quyet-tam", "ko"];
const G = (id, x, y, inner, extra = "") => `<g id="${id}" transform="translate(${x} ${y}) rotate(0)"${extra}>${inner}</g>`;
// đoạn chi thuôn: rộng w1 ở gốc, w2 ở đầu xa (dùng cho tay/chân, thay cho ống trụ)
// đoạn gốc (đùi): fill phẳng hai đầu, chỉ viền 2 cạnh -> không còn mí ở hông/gối
const limb = (len, w1, w2, c, extra = "") => {
  const d = `M${-w1} 0 Q${-w1 - 2} ${len * 0.42} ${-w2} ${len} L${w2} ${len} Q${w1 + 2} ${len * 0.42} ${w1} 0 Z`;
  const edge = `M${-w1} 0 Q${-w1 - 2} ${len * 0.42} ${-w2} ${len} M${w1} 0 Q${w1 + 2} ${len * 0.42} ${w2} ${len}`;
  return `<path d="${d}" fill="${c}"/><path d="${edge}" fill="none" stroke="${dk(c, 0.55)}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${extra}`;
};
// đoạn chi "hở" đầu trên: fill vẫn trùm lên khớp để che nét của đoạn trước,
// nhưng KHÔNG viền mép trên -> không còn đường ngang đôi ở khuỷu/gối.
const seg = (len, w1, w2, c, open = true, extra = "", top = 0) => {
  const d = `M${-w1} 0 Q${-w1 - 2} ${len * 0.42} ${-w2} ${len - 6} Q0 ${len + 3} ${w2} ${len - 6} Q${w1 + 2} ${len * 0.42} ${w1} 0 Q0 ${-top} ${-w1} 0Z`;
  const edge = `M${-w1} 0 Q${-w1 - 2} ${len * 0.42} ${-w2} ${len - 6} Q0 ${len + 3} ${w2} ${len - 6} Q${w1 + 2} ${len * 0.42} ${w1} 0${open ? "" : ` Q0 ${-top} ${-w1} 0Z`}`;
  return `<path d="${d}" fill="${c}"/><path d="${edge}" fill="none" stroke="${dk(c, 0.55)}" stroke-width="3" stroke-linejoin="round" stroke-linecap="butt"/>${extra}`;
};
// bàn tay mở: mu tay + 3 ngón + ngón cái (s = 1 tay F, -1 tay B để ngón cái hướng vào thân)
const handOpen = (skin, s = 1) =>
  `<g transform="scale(${s} 1)"><path d="M-9.5 -9 Q0 -13 9.5 -9 L9.5 12 Q9.5 16 6.2 15.5 Q4.4 15 4 11.5 Q3 16 0 16 Q-3.2 16 -4 11.5 Q-4.4 15 -6.2 15.5 Q-9.5 16 -9.5 12Z" fill="${skin}" ${st(skin)}/>` +
  `<path d="M-8.5 0 Q-13.5 3 -12.5 8.5 Q-11.5 12 -8.5 9" fill="${skin}" ${st(skin, 2.6)}/>` +
  `<path d="M-4 -2 L-4 2 M4 -2 L4 2" fill="none" stroke="${dk(skin, 0.4)}" stroke-width="1.6" stroke-linecap="round" opacity=".5"/></g>`;
// bàn tay nắm (khi cầm vũ khí): khối nắm + gân ngón + ngón cái vắt
const handFist = (skin, s = 1) =>
  `<g transform="scale(${s} 1)"><rect x="-10" y="-10" width="20" height="22" rx="8" fill="${skin}" ${st(skin)}/>` +
  `<path d="M-8 3 Q0 7 8 3" fill="none" stroke="${dk(skin, 0.4)}" stroke-width="2.2" stroke-linecap="round" opacity=".85"/>` +
  `<path d="M-3 -2 L-3 5 M3 -2 L3 5" fill="none" stroke="${dk(skin, 0.4)}" stroke-width="1.8" stroke-linecap="round" opacity=".45"/>` +
  `<path d="M-11 1 Q-16 4 -14 10 Q-12 13 -9 10" fill="${skin}" ${st(skin, 2.6)}/></g>`;
// bàn chân: gót + mũi giày hướng ra ngoài; chân B lật để hai mũi chân mở ra hai bên
const foot = (side, boots) => {
  const m = side === "B" ? ` transform="scale(-1 1)"` : "";
  return `<g${m}><path d="M-15 -6 Q-21 4 -16 13 Q-6 18 7 16.5 L26 15.5 Q34 12.5 29 5 L13 -3 Q-1 -10.5 -15 -6Z" fill="${boots}"/>` +
    `<path d="M-15 -6 Q-21 4 -16 13 Q-6 18 7 16.5 L26 15.5 Q34 12.5 29 5 L13 -3" fill="none" stroke="${dk(boots, 0.55)}" stroke-width="3" stroke-linejoin="round" stroke-linecap="butt"/>` +
    `<path d="M-14 11.5 Q4 17 26 14" fill="none" stroke="${dk(boots, 0.45)}" stroke-width="3.5" stroke-linecap="round"/>` +
    `<path d="M10 -2 Q20 -1 25 5" fill="none" stroke="${lt(boots, 0.25)}" stroke-width="2.5" stroke-linecap="round" opacity=".55"/></g>`;
};

// ---------------------------------------------------------------- vũ khí (tay ở 0,0; lưỡi hướng -y)
const K = (c) => st(c, 3.5);
export const WEAPON = {
  kiem: () => `<path d="M-7 -22 L-7 -190 L0 -212 L7 -190 L7 -22 Z" fill="#EEF3F8" ${K("#9FB3C8")}/><path d="M0 -26 L0 -190" stroke="#AFC0D0" stroke-width="2.5"/><rect x="-26" y="-24" width="52" height="10" rx="5" fill="#E3A21A" ${K("#E3A21A")}/><rect x="-5" y="-15" width="10" height="36" rx="4" fill="#6B3E1F" ${K("#6B3E1F")}/>`,
  dao: () => `<path d="M-7 -20 L-9 -150 Q-6 -200 26 -214 Q12 -180 16 -150 L9 -20 Z" fill="#E4E9EE" ${K("#9FB3C8")}/><rect x="-24" y="-22" width="48" height="9" rx="4" fill="#8A2A1E" ${K("#8A2A1E")}/><rect x="-5" y="-14" width="10" height="34" rx="4" fill="#3B2A1A" ${K("#3B2A1A")}/>`,
  "trong-kiem": () => `<path d="M-13 -20 L-13 -200 L0 -230 L13 -200 L13 -20 Z" fill="#3E4650" ${K("#3E4650")}/><path d="M-5 -30 L-5 -195 M5 -30 L5 -195" stroke="#5A6470" stroke-width="2"/><rect x="-30" y="-24" width="60" height="12" rx="4" fill="#2A2F36" ${K("#2A2F36")}/><rect x="-6" y="-14" width="12" height="40" rx="4" fill="#4A3A2A" ${K("#4A3A2A")}/>`,
  giao: () => `<path d="M0 70 L0 -190" stroke="#6B3E1F" stroke-width="9" stroke-linecap="round"/><path d="M0 -226 L12 -190 L-12 -190 Z" fill="#C9D3DD" ${K("#9FB3C8")}/><path d="M-9 -188 Q0 -172 9 -188 Z" fill="#C8372D"/>`,
  gay: () => `<path d="M0 90 L0 -180" stroke="${dk("#B5813E", 0.55)}" stroke-width="14" stroke-linecap="round"/><path d="M0 90 L0 -180" stroke="#B5813E" stroke-width="8" stroke-linecap="round"/>`,
  quat: () => `<path d="M0 0 L-52 -90 A105 105 0 0 1 52 -90 Z" fill="#F6EFE0" ${K("#C9B88A")}/><path d="M0 0 L-27 -98 M0 0 L0 -104 M0 0 L27 -98" stroke="#C8372D" stroke-width="2.5"/><circle r="5" fill="#3B2A1A"/>`,
  none: () => "",
};
export const WEAPONS = Object.keys(WEAPON);

// ---------------------------------------------------------------- mặt (toạ độ anime 300×420, tâm mắt 150,172)
const CX = 150, EY = 172, EX = 38;
const FACE = "M150 262 C110 262 58 232 53 170 C48 100 92 56 150 56 C208 56 252 100 247 170 C242 232 190 262 150 262Z";
const FACES = {
  tron: FACE,
  vuong: "M150 260 C122 260 86 250 68 226 L56 170 L64 112 C78 74 110 54 150 54 C190 54 222 74 236 112 L244 170 L232 226 C214 250 178 260 150 260Z",
  dai: "M150 268 C114 268 70 240 64 178 C58 108 100 58 150 58 C200 58 242 108 236 178 C230 240 186 268 150 268Z",
  goc: "M150 258 C128 258 94 250 76 228 L58 172 L64 118 C78 78 110 56 150 56 C190 56 222 78 236 118 L242 172 L224 228 C206 250 172 258 150 258Z",
};
function eye(cx, o, side) {
  const { iris, expr, gid } = o, rx = 23, ry = o.age === "gia" ? 20 : 29, cy = EY;
  const tiny = expr === "soc", p = [];
  if (expr === "dac-y" && side > 0) return `<path d="M${cx - rx} ${cy + 4} Q${cx} ${cy - 16} ${cx + rx} ${cy + 4}" fill="none" stroke="${LINE}" stroke-width="6" stroke-linecap="round"/>`;
  p.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff"/>`);
  if (tiny) p.push(`<circle cx="${cx}" cy="${cy}" r="6" fill="${dk(iris, 0.5)}"/><circle cx="${cx - 2}" cy="${cy - 2}" r="2" fill="#fff"/>`);
  else {
    const ir = rx * 0.74, iry = ry * 0.8, ic = cx + (expr === "ngai" ? -6 * side : 0), icy = cy + ry * 0.1;
    p.push(`<ellipse cx="${ic}" cy="${icy}" rx="${ir}" ry="${iry}" fill="url(#${gid})"/><ellipse cx="${ic}" cy="${icy + 2}" rx="${ir * 0.45}" ry="${iry * 0.5}" fill="${dk(iris, 0.7)}"/>`);
    if (expr === "quyet-tam") p.push(`<path d="M${ic - 8} ${icy - 20} l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3Z" fill="#fff"/>`);
    else p.push(`<circle cx="${ic - ir * 0.38}" cy="${icy - iry * 0.42}" r="${ir * 0.36}" fill="#fff"/><circle cx="${ic + ir * 0.4}" cy="${icy + iry * 0.42}" r="${ir * 0.15}" fill="#fff"/>`);
  }
  if (expr === "dac-y" || o.sleepy) p.push(`<path d="M${cx - rx - 2} ${cy + 2} L${cx - rx - 2} ${cy - ry - 4} L${cx + rx + 2} ${cy - ry - 4} L${cx + rx + 2} ${cy + 2}Z" fill="${o.skin}"/><path d="M${cx - rx - 3} ${cy + 2} Q${cx} ${cy - 3} ${cx + rx + 3} ${cy + 2}" fill="none" stroke="${LINE}" stroke-width="6" stroke-linecap="round"/>`);
  else {
    const ox = cx + side * (rx + 4), ix = cx - side * (rx + 2), ang = expr === "gian" ? 7 : expr === "buon" ? -6 : 0;
    p.push(`<path d="M${ix} ${cy - ry * 0.25 + ang} Q${cx} ${cy - ry - 9} ${ox} ${cy - ry * 0.45}" fill="none" stroke="${LINE}" stroke-width="6.5" stroke-linecap="round"/><path d="M${ox - side * 2} ${cy - ry * 0.45} l${side * 8} -7" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/><path d="M${cx - rx * 0.6} ${cy + ry + 2} Q${cx} ${cy + ry + 5} ${cx + rx * 0.6} ${cy + ry + 2}" fill="none" stroke="${LINE}" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>`);
  }
  if (expr === "buon" && side < 0) p.push(`<path d="M${cx - 6} ${cy + ry} q-6 14 0 20 q6 -6 0 -20Z" fill="#8FD3FF" stroke="#4A9BD6" stroke-width="2"/>`);
  return p.join("");
}
function brows(expr, c) {
  const y = EY - 46, L = CX - 60, R = CX + 60, l = CX - 18, r = CX + 18;
  const d = {
    gian: [`M${L - 2} ${y - 6} L${l + 2} ${y + 10}`, `M${R + 2} ${y - 6} L${r - 2} ${y + 10}`],
    buon: [`M${L} ${y + 8} Q${CX - 40} ${y - 4} ${l} ${y - 8}`, `M${R} ${y + 8} Q${CX + 40} ${y - 4} ${r} ${y - 8}`],
    soc: [`M${L} ${y - 6} Q${CX - 40} ${y - 16} ${l - 2} ${y - 8}`, `M${R} ${y - 6} Q${CX + 40} ${y - 16} ${r + 2} ${y - 8}`],
    "quyet-tam": [`M${L} ${y - 4} L${l} ${y + 6}`, `M${R} ${y - 4} L${r} ${y + 6}`],
    "dac-y": [`M${L} ${y} Q${CX - 40} ${y - 8} ${l} ${y - 2}`, `M${R} ${y - 10} Q${CX + 40} ${y - 16} ${r} ${y - 6}`],
    ko: [`M${L} ${y - 2} Q${CX - 40} ${y - 14} ${l} ${y - 6}`, `M${R} ${y - 2} Q${CX + 40} ${y - 14} ${r} ${y - 6}`],
  }[expr] || [`M${L} ${y} Q${CX - 40} ${y - 9} ${l} ${y - 3}`, `M${R} ${y} Q${CX + 40} ${y - 9} ${r} ${y - 3}`];
  return `<path d="${d[0]} ${d[1]}" fill="none" stroke="${dk(c, 0.25)}" stroke-width="6" stroke-linecap="round"/>`;
}
function mouth(expr, p) {
  const y = 226, S = `stroke="${LINE}" stroke-width="3"`, open = {
    vui: `<path d="M136 ${y - 2} Q150 ${y - 4} 164 ${y - 2} Q162 ${y + 18} 150 ${y + 18} Q138 ${y + 18} 136 ${y - 2}Z" fill="#B8344A" ${S}/><path d="M142 ${y + 12} Q150 ${y + 6} 158 ${y + 12} Q150 ${y + 18} 142 ${y + 12}Z" fill="#FF8FA3"/>`,
    gian: `<path d="M134 ${y + 2} L166 ${y + 2} L160 ${y + 18} L140 ${y + 18}Z" fill="#B8344A" ${S}/><path d="M136 ${y + 5} L164 ${y + 5}" stroke="#fff" stroke-width="4"/>`,
    buon: `<path d="M138 ${y + 14} Q150 ${y} 162 ${y + 14} Q150 ${y + 10} 138 ${y + 14}Z" fill="#B8344A" ${S}/>`,
    soc: `<ellipse cx="150" cy="${y + 8}" rx="11" ry="15" fill="#B8344A" ${S}/>`,
    "dac-y": `<path d="M138 ${y} Q154 ${y + 2} 166 ${y - 6} Q160 ${y + 14} 148 ${y + 12} Q140 ${y + 10} 138 ${y}Z" fill="#B8344A" ${S}/>`,
    ngai: `<ellipse cx="150" cy="${y + 6}" rx="7" ry="6" fill="#B8344A" ${S}/>`,
    "quyet-tam": `<path d="M134 ${y} Q150 ${y + 4} 166 ${y} Q164 ${y + 16} 150 ${y + 16} Q136 ${y + 16} 134 ${y}Z" fill="#fff" ${S}/><path d="M135 ${y + 6} L165 ${y + 6}" stroke="${LINE}" stroke-width="2"/>`,
  }, closed = {
    vui: `<path d="M140 ${y} Q150 ${y + 9} 160 ${y}" fill="none" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>`,
    binh: `<path d="M141 ${y + 3} Q150 ${y + 6} 159 ${y + 3}" fill="none" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>`,
    gian: `<path d="M138 ${y + 8} Q144 ${y + 2} 150 ${y + 6} Q156 ${y + 2} 162 ${y + 8}" fill="none" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>`,
    buon: `<path d="M140 ${y + 8} Q150 ${y} 160 ${y + 8}" fill="none" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>`,
    soc: `<ellipse cx="150" cy="${y + 6}" rx="6" ry="8" fill="#B8344A" ${S}/>`,
    "dac-y": `<path d="M136 ${y + 2} Q143 ${y + 8} 150 ${y + 2} Q157 ${y + 8} 166 ${y - 4}" fill="none" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>`,
    ngai: `<path d="M138 ${y + 4} q4 -4 8 0 t8 0 t8 0" fill="none" stroke="${LINE}" stroke-width="3.5" stroke-linecap="round"/>`,
    "quyet-tam": `<path d="M138 ${y + 4} L162 ${y + 2}" stroke="${LINE}" stroke-width="4.5" stroke-linecap="round"/>`,
    ko: `<ellipse cx="150" cy="${y + 8}" rx="8" ry="6" fill="#B8344A" ${S}/>`,
  };
  const e = expr === "binh" ? "vui" : expr === "ko" ? "soc" : expr;
  return `<g id="${p}-mc-${expr}">${closed[expr] || closed.vui}</g><g id="${p}-mo-${expr}" opacity="0">${open[e] || open.vui}</g>`;
}
function marks(expr) {
  const blush = (op) => `<ellipse cx="${CX - 62}" cy="208" rx="17" ry="9" fill="#FF8FA3" opacity="${op}"/><ellipse cx="${CX + 62}" cy="208" rx="17" ry="9" fill="#FF8FA3" opacity="${op}"/>`;
  switch (expr) {
    case "gian": return blush(0.3) + `<g transform="translate(228 92)" stroke="#E23D3D" stroke-width="5" stroke-linecap="round" fill="none"><path d="M-12 -4 Q-4 -4 -4 -12 M4 -12 Q4 -4 12 -4 M12 4 Q4 4 4 12 M-4 12 Q-4 4 -12 4"/></g>`;
    case "soc": return `<path d="M88 104 l0 22 M104 98 l0 26 M120 102 l0 20" stroke="#5B6BD6" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
    case "ngai": return blush(0.7) + `<path d="M238 118 q9 13 0 20 q-9 -7 0 -20Z" fill="#8FD3FF" stroke="#4A9BD6" stroke-width="2"/>`;
    case "dac-y": return blush(0.4);
    case "quyet-tam": return blush(0.35);
    case "buon": case "ko": return blush(0.2);
    default: return blush(0.45);
  }
}
const HAIR = { "mai-bang": ["bangs"], "re-ngoi": ["side"], "bom-gai": ["spiky", "spikyBack"], "duoi-ngua": ["side", "pony"], "bui-cao": ["swept", "bunHigh"], "bui-toi": ["swept", "knot"], ngan: ["short"], troc: ["none"], "tien-ong": ["swept", "knot"], "dai-thang": ["bangs", "long"] };
// lớp tóc sau lưng: vẽ 1 lần ở SAU thân (trước vạt/chân) để không phủ lên áo.
// Lớp sát da đầu (hairNear) vẫn nằm trong nhóm đầu để che đường nối khi đầu xoay.
// chỉ long/pony mới thực sự phủ lên thân/áo; spikyBack/bunHigh/knot nằm trên/ngoài đầu
// (không chạm áo) nên phải ở lại nhóm head để bám đầu khi xoay.
const FAR_BACK = ["long", "pony"];
const HEAD_Y = -104, FACE_Y = -92, FACE_S = 0.855;
function hairBack(kind, c, gid) {
  const g = `fill="url(#${gid})" ${st(c)}`;
  switch (kind) {
    case "long": return `<path d="M62 150 C42 220 32 320 40 400 Q100 422 150 412 Q200 422 260 400 C268 320 258 220 238 150 Z" ${g}/>` +
      `<path d="M56 200 C48 280 44 350 48 394 M244 200 C252 280 256 350 252 394" fill="none" stroke="${lt(c, 0.35)}" stroke-width="4" stroke-linecap="round" opacity=".28"/>`;
    case "bunHigh": return `<circle cx="150" cy="34" r="34" ${g}/><path d="M118 40 Q150 22 182 40" fill="none" stroke="${lt(c, 0.4)}" stroke-width="4" stroke-linecap="round" opacity=".7"/>`;
    case "knot": return `<ellipse cx="150" cy="40" rx="24" ry="20" ${g}/><rect x="138" y="22" width="24" height="8" rx="3" fill="#C9A227" ${st("#C9A227")}/>`;
    case "spikyBack": return `<path d="M60 170 L30 150 L56 128 L36 96 L74 92 L70 54 L108 66 L120 28 L150 52 L180 28 L192 66 L230 54 L226 92 L264 96 L244 128 L270 150 L240 170 Z" ${g}/>`;
    default: return "";
  }
}
// lớp tóc sát đầu, vẽ trong nhóm đầu (xoay theo head) để che mối nối với lớp tóc sau lưng
function hairNear(kind, c, gid) {
  const g = `fill="url(#${gid})" ${st(c)}`;
  if (kind === "long") return `<path d="M62 150 C50 200 56 236 80 264 Q150 278 220 264 C244 236 250 200 238 150 Z" ${g}/>`;
  return "";
}
function hairFront(kind, c, gid) {
  const g = `fill="url(#${gid})" ${st(c)}`, shine = (d) => `<path d="${d}" fill="none" stroke="${lt(c, 0.6)}" stroke-width="6" stroke-linecap="round" opacity=".55"/>`;
  switch (kind) {
    case "bangs": return `<path d="M48 168 C40 80 96 38 150 38 C204 38 260 80 252 168 L242 136 L226 128 L214 140 L198 124 L182 140 L166 122 L150 138 L134 122 L118 140 L102 124 L86 140 L74 128 L58 136 Z" ${g}/>` + shine("M90 80 Q150 52 210 80");
    case "side": return `<path d="M48 170 C40 80 96 38 152 38 C206 38 262 82 252 170 C246 128 226 106 200 98 C188 126 150 142 104 136 C86 142 64 152 48 170 Z" ${g}/><path d="M200 98 C214 120 222 136 226 160 C230 130 222 110 200 98Z" ${g}/>` + shine("M96 84 Q150 54 206 82");
    case "spiky": return `<path d="M50 170 C44 96 92 48 150 46 C208 48 256 96 250 170 L236 140 L226 156 L212 118 L194 146 L178 112 L162 144 L146 108 L130 146 L112 114 L98 150 L84 122 L72 156 L62 136 Z" ${g}/>` + shine("M96 84 Q150 60 204 84");
    case "swept": return `<path d="M50 168 C44 86 96 44 150 44 C204 44 256 86 250 168 C240 120 210 98 150 96 C90 98 60 120 50 168 Z" ${g}/>` + shine("M84 92 Q150 60 216 92");
    case "short": return `<path d="M52 158 C46 84 96 46 150 46 C204 46 254 84 248 158 C240 124 218 112 196 108 L186 124 L170 106 L150 122 L132 106 L116 124 L102 110 C80 116 60 130 52 158 Z" ${g}/>` + shine("M96 82 Q150 58 204 82");
    case "none": return `<path d="M104 78 Q150 62 196 78" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".45"/>`;
    default: return "";
  }
}
function beard(kind, c) {
  const g = `fill="${c}" ${st(c)}`;
  switch (kind) {
    case "rau-de": return `<path d="M136 244 Q150 280 164 244 Q150 252 136 244Z" ${g}/>`;
    case "rau-dai": return `<path d="M96 222 Q100 262 150 266 Q200 262 204 222 Q206 300 150 340 Q94 300 96 222Z" ${g}/><path d="M130 280 Q150 300 170 280" fill="none" stroke="${lt(c, 0.5)}" stroke-width="3" opacity=".6"/>`;
    case "ria": return `<path d="M150 214 Q132 206 116 220 Q132 222 150 218 Q168 222 184 220 Q168 206 150 214Z" ${g}/>`;
    default: return "";
  }
}
function hat(kind, c = "#8A2A1E") {
  switch (kind) {
    case "non-la": return `<path d="M150 -6 L290 96 Q150 118 10 96 Z" fill="#F2D88A" ${st("#C9A227")}/>${[40, 70, 100].map((y) => `<path d="M${150 - y * 1.3} ${y - 4} Q150 ${y + 6} ${150 + y * 1.3} ${y - 4}" fill="none" stroke="#C9A227" stroke-width="2"/>`).join("")}`;
    case "khan": return `<path d="M52 126 C56 70 100 48 150 48 C200 48 244 70 248 126 C210 108 90 108 52 126 Z" fill="${c}" ${st(c)}/><path d="M60 104 Q150 76 240 104" fill="none" stroke="${dk(c, 0.4)}" stroke-width="3"/>`;
    case "linh": return `<path d="M46 150 C42 70 96 30 150 30 C204 30 258 70 254 150 C230 118 70 118 46 150Z" fill="#3A3F47" ${st("#3A3F47")}/><path d="M150 30 L150 6" stroke="#2A2F36" stroke-width="6"/><circle cx="150" cy="4" r="9" fill="#C8372D" ${st("#C8372D")}/>`;
    case "troc": return `${[130, 150, 170].map((x) => `<circle cx="${x}" cy="72" r="4" fill="#B5813E"/>`).join("")}`;
    case "tram": return `<path d="M100 36 L210 48" stroke="#C9D3DD" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="36" r="6" fill="#E3A21A" ${st("#E3A21A")}/>`;
    default: return "";
  }
}
// đầu (toạ độ anime) → chuỗi svg; p: prefix. opts: skin hair{style,color} eyes beard beardColor hat glasses age expr
function head(p, o) {
  const skin = o.skin, hc = o.hair.color, hg = `${p}-hg`, ig = `${p}-ig`;
  const [front, back] = HAIR[o.hair.style] || HAIR.ngan;
  const h = [];
  h.push(`<defs><linearGradient id="${hg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lt(hc, 0.25)}"/><stop offset=".55" stop-color="${hc}"/><stop offset="1" stop-color="${dk(hc, 0.25)}"/></linearGradient><linearGradient id="${ig}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dk(o.eyes, 0.45)}"/><stop offset="1" stop-color="${lt(o.eyes, 0.45)}"/></linearGradient></defs>`);
  if (back) h.push(FAR_BACK.includes(back) ? hairNear(back, hc, hg) : hairBack(back, hc, hg));
  h.push(`<ellipse cx="52" cy="182" rx="12" ry="17" fill="${skin}" ${st(skin)}/><ellipse cx="248" cy="182" rx="12" ry="17" fill="${skin}" ${st(skin)}/><path d="${FACES[o.face] || FACE}" fill="${skin}" ${st(skin)}/>`);
  h.push(`<path d="M70 210 C90 250 210 250 230 210 C214 244 186 258 150 258 C114 258 86 244 70 210Z" fill="${dk(skin, 0.08)}" opacity=".6"/><path d="M148 204 q3 3 6 0" fill="none" stroke="${dk(skin, 0.35)}" stroke-width="2.5" stroke-linecap="round"/>`);
  if (o.beard) h.push(beard(o.beard === true ? "rau-dai" : o.beard, o.beardColor || hc));
  h.push(hairFront(front, hc, hg));
  // biểu cảm: mỗi nhóm có lông mày + mắt + miệng đóng/mở; chỉ một nhóm hiện
  for (const e of EXPRS) {
    const eo = { iris: o.eyes, expr: e, gid: ig, skin, age: o.age };
    const eyes = e === "ko" ? `<path d="M96 156 L128 188 M128 156 L96 188 M172 156 L204 188 M204 156 L172 188" stroke="${LINE}" stroke-width="7" stroke-linecap="round"/>` : eye(CX - EX, eo, -1) + eye(CX + EX, eo, 1);
    h.push(`<g id="${p}-ex-${e}" opacity="${e === (o.expr || "vui") ? 1 : 0}">${marks(e)}${eyes}${brows(e, hc)}${mouth(e, p)}</g>`);
  }
  // chớp mắt: mí da phủ lên mắt
  h.push(`<g id="${p}-blink" opacity="0"><ellipse cx="${CX - EX}" cy="${EY}" rx="31" ry="36" fill="${skin}"/><ellipse cx="${CX + EX}" cy="${EY}" rx="31" ry="36" fill="${skin}"/><path d="M${CX - EX - 23} ${EY + 4} Q${CX - EX} ${EY + 16} ${CX - EX + 23} ${EY + 4} M${CX + EX - 23} ${EY + 4} Q${CX + EX} ${EY + 16} ${CX + EX + 23} ${EY + 4}" fill="none" stroke="${LINE}" stroke-width="6" stroke-linecap="round"/></g>`);
  if (o.beard === "ria" || o.beard === "rau-dai" || o.beard === true) h.push(beard("ria", o.beardColor || hc));
  if (o.glasses) h.push(`<g fill="none" stroke="#4A3A30" stroke-width="4.5"><circle cx="${CX - EX}" cy="${EY + 2}" r="31"/><circle cx="${CX + EX}" cy="${EY + 2}" r="31"/><path d="M${CX - 8} ${EY - 2} Q${CX} ${EY - 8} ${CX + 8} ${EY - 2} M${CX - EX - 31} ${EY - 4} L54 170 M${CX + EX + 31} ${EY - 4} L246 170"/></g>`);
  if (o.hat) h.push(hat(o.hat, o.hatColor));
  return h.join("");
}

// ---------------------------------------------------------------- toàn thân
// o.ve: hàm vẽ đầu riêng của tập (ve.mjs, xem SKILL.md "Mặt riêng từng tập") thay cho head() mặc định
// o: id mat skin hair eyes eyes2 fem robe robe2 pants belt boots weapon hand(F|B) band glasses beard hat age oneArm skirt flaps(bool) expr
export function figure(p, w, o = {}) {
  const skin = o.skin || SKIN.vang, robe = o.robe || "#5C6B7A", robe2 = o.robe2 || lt(robe, 0.5), pants = o.pants || dk(robe, 0.35), belt = o.belt || "#3B2A1A", boots = o.boots || "#3A2A22";
  const hair = o.hair || { style: "ngan", color: "#3A2A22" }, eyes = o.eyes || "#6B4A3A";
  const h = Math.round((w * 620) / 400);
  const wp = (side) => (o.weapon && o.weapon !== "none" && !o.sheath && (o.hand || "F") === side ? `<g id="${p}-wp${side}" transform="translate(0 8) rotate(0)"><g transform="scale(0.8)">${WEAPON[o.weapon]()}</g></g>` : "");
  // tay: vai xuôi (khớp lùi vào trong thân), cẳng tay hơi khoát ra ngoài để bàn tay không dính hông
  const arm = (side, x) => {
    const s = side === "B" ? -1 : 1, back = side === "B";
    const cs = back ? dk(robe, 0.13) : robe, cuff = back ? dk(robe, 0.26) : dk(robe, 0.4);
    const fold = dk(cs, 0.3);
    const holding = !!o.weapon && o.weapon !== "none" && !o.sheath && (o.hand || "F") === side;
    return G(`${p}-ua${side}`, x, -88, `<g transform="rotate(${-s * 3})">` +
      `<circle cx="0" cy="57" r="11" fill="${cs}" ${st(cs, 2.5)}/>` +
      `<path d="M-13 0 C-13 12 -17 28 -14 43 L-13 57 Q0 61 13 57 L14 43 C17 28 13 12 13 0 C13 -5.5 -13 -5.5 -13 0Z" fill="${cs}"/>` +
        `<path d="M13 57 L14 43 C17 28 13 12 13 0 M-13 0 C-13 12 -17 28 -14 43 L-13 57" fill="none" stroke="${dk(cs, 0.55)}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>` +
        `<path d="M13 0 C13 -5.5 -13 -5.5 -13 0" fill="none" stroke="${dk(cs, 0.45)}" stroke-width="1.8" stroke-linecap="round"/>` +

        `<path d="M${-s * 9} 30 Q${-s * 11} 42 ${-s * 9} 52" fill="none" stroke="${fold}" stroke-width="2.5" stroke-linecap="round" opacity=".28"/>` +
      G(`${p}-fa${side}`, 0, 57,
        `<g transform="rotate(${-s * 4})">` + seg(48, 13, 16, cs, true, `<path d="M-9 2 Q0 6 9 2" fill="none" stroke="${fold}" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>`, 0) + `</g>` +
        G(`${p}-hd${side}`, s * 4, 53, wp(side) + `<g transform="rotate(${-s * 3})">${holding ? handFist(skin, s) : handOpen(skin, s)}</g>`) +
        `<g transform="rotate(${-s * 4})"><path d="M-17 34 Q0 32 17 34 L17.5 44 Q0 47.5 -17.5 44Z" fill="${cuff}" ${st(cs)}/></g>`) + `</g>`);
  };
  const emptySleeve = (x) => `<g><path d="M${x - 16} -98 Q${x - 20} -40 ${x - 24} 26 Q${x - 22} 44 ${x - 10} 42 Q${x - 2} 38 ${x - 6} 10 Q${x + 7} -40 ${x + 15} -98 Q${x} -106 ${x - 16} -98Z" fill="${dk(robe, 0.15)}" ${st(robe)}/>` +
    `<path d="M${x - 12} -68 Q${x - 16} -20 ${x - 18} 34" fill="none" stroke="${dk(robe, 0.35)}" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>` +
    `<path d="M${x - 23} 32 Q${x - 18} 44 ${x - 8} 40 Q${x - 3} 36 ${x - 5} 29 L${x - 9} 37 Q${x - 17} 39 ${x - 20} 29Z" fill="${dk(robe, 0.3)}" ${st(robe)}/></g>`;
  // chân: đùi có khối, đầu gối thuôn, bắp chân rồi cổ chân; giày có gót + mũi riêng
  const leg = (side, x) => {
    const back = side === "B", cp = back ? dk(pants, 0.12) : pants;
    return G(`${p}-th${side}`, x, 0,
      `<circle cx="0" cy="68" r="15" fill="${cp}" ${st(cp, 2.5)}/>` +
      limb(68, 24, 18, cp, `<path d="M-14 10 Q-20 34 -15 56" fill="none" stroke="${dk(cp, 0.3)}" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>`) +
      G(`${p}-sh${side}`, 0, 68,
        seg(63.5, 18, 14, cp, true, `<path d="M-14 2 Q0 6 14 2" fill="none" stroke="${dk(cp, 0.3)}" stroke-width="2.5" stroke-linecap="round" opacity=".32"/><path d="M${back ? 9 : -9} 10 Q${back ? 14 : -14} 24 ${back ? 10 : -10} 38" fill="none" stroke="${lt(cp, 0.22)}" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>`, 2) +
        `<path d="M-17 34 Q-19 48 -12 63 L12 63 Q19 48 17 34 Q0 30 -17 34Z" fill="${boots}" ${st(boots)}/>` +
        `<path d="M-15 36 Q0 33 15 36" fill="none" stroke="${lt(boots, 0.28)}" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>` +
        G(`${p}-ft${side}`, 0, 63.5, foot(side, boots))));
  };
  // vạt hông: buông mềm, gấu có lớp lót tối; chừa khoảng trước cho đùi đọc được
  const flap = (side, x) => G(`${p}-flap${side}`, x, 8,
    `<path d="M-15 -6 L15 -6 Q18 18 21 40 Q11 52 1 48 Q-9 52 -21 40 Q-18 18 -15 -6Z" fill="${side === "B" ? dk(robe, 0.15) : robe}" ${st(robe)}/>` +
    `<path d="M-21 40 Q-9 50 1 46 Q12 50 21 40 L20 48 Q10 56 0 52 Q-12 56 -21 48Z" fill="${dk(robe, 0.2)}"/>` +
    `<path d="M-5 -4 Q-8 18 -4 40" fill="none" stroke="${dk(robe, 0.24)}" stroke-width="2.5" stroke-linecap="round" opacity=".45"/>`);
  const skirt = o.skirt ? `<path d="M-62 -10 Q0 0 62 -10 L82 104 Q0 124 -82 104Z" fill="${robe}" ${st(robe)}/>` +
    `<path d="M-82 104 Q0 124 82 104 L80 113 Q0 132 -80 113Z" fill="${dk(robe, 0.18)}"/>` +
    `<path d="M-30 2 L-40 106 M30 2 L40 106 M0 30 Q3 74 0 114" fill="none" stroke="${dk(robe, 0.22)}" stroke-width="2.5" stroke-linecap="round" opacity=".45"/>` : "";
  const sheath = o.sheath && o.weapon && o.weapon !== "none" ? `<g transform="translate(-30 -40) rotate(-32)"><g transform="translate(0 -100) rotate(180) scale(0.8)">${WEAPON[o.weapon]()}</g></g>` : "";
  // thân áo: vai xuôi rộng, eo thắt sau đai, gấu loe; cổ chữ V viền áo lót, một mép chéo xuống hông
  const torso = sheath + `<path d="M-70 -92 Q-36 -106 0 -106 Q36 -106 70 -92 L58 -62 Q53 -34 55 -8 L60 22 Q0 33 -60 22 L-55 -8 Q-53 -34 -58 -62 Z" fill="${robe}" ${st(robe)}/>` +
    `<path d="M-60 13 Q0 24 60 13 L60 22 Q0 33 -60 22Z" fill="${dk(robe, 0.14)}"/>` +

    // cổ chữ V: vạt trong tối hơn, viền áo lót sáng chạy theo hai mép, cổ thật nhỏ ở trên
    `<path d="M-34 -102 L0 -62 L34 -102 Q0 -94 -34 -102Z" fill="${dk(robe, 0.12)}"/>` +
    `<path d="M-34 -102 L0 -62 L34 -102" fill="none" stroke="${dk(robe, 0.55)}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="butt"/>` +
    `<path d="M-30 -99 L0 -66 M30 -99 L0 -66" fill="none" stroke="${robe2}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="butt"/>` +
    `<path d="M-14 -105 Q0 -94 14 -105 Q0 -99 -14 -105Z" fill="${skin}"/>` +
    `<path d="M2 -67 Q7 -52 12 -38" fill="none" stroke="${dk(robe, 0.3)}" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>` +
    (o.sash ? `<path d="M44 -96 L30 -92 L-52 -6 L-36 2Z" fill="${o.sash}" ${st(o.sash)}/>` : "") +
    `<path d="M-57 -27 Q0 -21 57 -27 L56 0 Q0 6 -56 0Z" fill="${belt}" ${st(belt)}/>` +
    `<path d="M0 4 L0 24" fill="none" stroke="${dk(robe, 0.26)}" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>` +
    `<path d="M-10 -25 L-7 26 Q-4 30 -2 26 L-3 -25 Z M10 -25 L7 26 Q4 30 2 26 L3 -25 Z" fill="${dk(belt, 0.14)}" ${st(belt, 2.5)}/>` +
    `<rect x="-13" y="-30" width="26" height="17" rx="5" fill="${belt}" ${st(belt)}/><path d="M-7 -21 Q0 -17 7 -21" fill="none" stroke="${lt(belt, 0.3)}" stroke-width="2" stroke-linecap="round" opacity=".6"/>`;
  const band = o.band ? `<path d="M50 132 Q150 96 250 132 L252 154 Q150 118 48 154 Z" fill="${o.band}" ${st(o.band)}/>` : "";
  const tail = o.band ? G(`${p}-tail`, -87, -119, `<path d="M0 0 Q-30 10 -46 44 Q-28 36 -14 42 Q-10 20 0 0Z" fill="${o.band}" ${st(o.band)}/><path d="M0 4 Q-34 36 -40 78 Q-22 60 -8 64 Q-12 34 0 4Z" fill="${o.band}" ${st(o.band)}/>`) : "";
  // tóc sau: lớp dài nằm sau thân (farHair), lớp sát đầu (ponyNear/hairNear) nằm trong nhóm đầu
  const backStyle = (HAIR[hair.style] || [])[1], pony = backStyle === "pony";
  const farHair = o.ve || !backStyle || !FAR_BACK.includes(backStyle) ? "" :
    pony ? G(`${p}-hairB`, 70, -110, `<path d="M0 4 C44 12 52 90 26 158 C34 92 20 44 -6 18Z" fill="${hair.color}" ${st(hair.color)}/>`)
      : G(`${p}-hairFar`, 0, HEAD_Y, `<g transform="translate(0 ${FACE_Y}) scale(${FACE_S}) translate(-150 -172)">${hairBack(backStyle, hair.color, `${p}-hg`)}</g>`);
  const ponyNear = pony ? G(`${p}-hairBn`, 70, -110, `<path d="M-8 2 C8 4 14 20 6 40 C2 22 -4 12 -12 6Z" fill="${hair.color}" ${st(hair.color)}/><circle cx="0" cy="2" r="8" fill="#E2483D" ${st("#E2483D")}/>`) : "";
  const headG = G(`${p}-head`, 0, HEAD_Y, `<path d="M-15 -14 Q0 -18 15 -14 L13 2 Q0 6 -13 2Z" fill="${skin}"/>` + ponyNear + tail +
    `<g id="${p}-face" transform="translate(0 ${FACE_Y}) scale(${FACE_S}) translate(-150 -172)">${(o.ve || head)(p, { id: o.id, mat: o.mat || {}, skin, hair, eyes, eyes2: o.eyes2, fem: o.fem ?? !!o.skirt, beard: o.beard, beardColor: o.beardColor, hat: o.hat, hatColor: o.hatColor, glasses: o.glasses, age: o.age, face: o.face, expr: o.expr }, KIT)}${band}</g>`);
  const body = (o.oneArm ? emptySleeve(-70) : arm("B", -70)) + headG + arm("F", 70);
  return `<svg viewBox="0 0 400 620" width="${w}" height="${h}" style="display:block;overflow:visible" data-rig="v2">
${G(`${p}-all`, 200, 400, `<ellipse cy="148" rx="80" ry="12" fill="#000" opacity=".14"/>` + farHair +
    (o.flaps !== false && !o.skirt ? flap("B", -50) : "") + `<path d="M-24 -4 Q0 2 24 -4 L20 26 Q0 32 -20 26Z" fill="${pants}"/>` + leg("B", -26) + leg("F", 26) +
    G(`${p}-torso`, 0, 0, `<g id="${p}-breath" transform="scale(1 1)">${skirt}${o.flaps !== false && !o.skirt ? flap("F", 50) : ""}${torso}${body}</g>`))}
</svg>`;
}
// đồ nghề cho ve.mjs: màu + tóc/mũ/râu dựng sẵn (mắt, mũi, khuôn mặt, miệng thì tập tự vẽ)
export const KIT = { dk, lt, hx, toHex, st, EXPRS, SKIN, hairBack, hairFront, HAIR, beard, hat };
// tỉ lệ chibi ~2,3 đầu: hông (200,430), vai y=338, chân chạm y≈548 (FEET), đầu to (mặt anime thu 0,95)
// thân kiểu "người lớn thu nhỏ": vai 140, eo 106, gấu 124; tay dài tới 1/3 đùi, chân có đùi/gối/bắp chân/cổ chân
export const FEET = 548;
export const JOINTS = ["all", "torso", "head", "uaF", "faF", "hdF", "uaB", "faB", "hdB", "thF", "shF", "ftF", "thB", "shB", "ftB", "wpF", "wpB", "flapF", "flapB", "hairB", "tail"];
export const JPOS = { all: [200, 400], torso: [0, 0], head: [0, HEAD_Y], uaF: [70, -88], faF: [3, 57], hdF: [4, 53], uaB: [-70, -88], faB: [-3, 57], hdB: [-4, 53], thF: [26, 0], shF: [0, 68], ftF: [0, 63.5], thB: [-26, 0], shB: [0, 68], ftB: [0, 63.5], wpF: [8, 58], wpB: [-8, 58], flapF: [50, 8], flapB: [-50, 8], hairB: [70, -110], tail: [-87, -119] };

// ---------------------------------------------------------------- diện mạo có sẵn (tap.json: {"preset":"hiep-khach", ...ghi đè})
export const PRESETS = {
  teo: { skin: SKIN.sang, hair: { style: "bom-gai", color: "#6B3F26" }, eyes: "#4A8BE0", glasses: true, robe: "#5B8DEF", robe2: "#FFFFFF", pants: "#2B2D42", belt: "#2B2D42", band: "#D7263D", weapon: "kiem" },
  linh: { robe: "#5C6B7A", hat: "linh", weapon: "giao", hair: { style: "ngan", color: "#2B2220" } },
  "cao-thu": { robe: "#2B2D42", hair: { style: "bui-toi", color: "#1E1A1A" }, beard: "rau-de", weapon: "dao", belt: "#C8372D", eyes: "#8A2A1E" },
  "hiep-khach": { robe: "#3E8E5A", hair: { style: "re-ngoi", color: "#2B2220" }, weapon: "kiem" },
  "thu-sinh": { robe: "#E8E2D0", hat: "khan", hair: { style: "ngan", color: "#2B2220" }, weapon: "quat", belt: "#2E6FB7" },
  "chuong-quy": { robe: "#B5813E", hair: { style: "ngan", color: "#4A3A30" }, beard: "ria", weapon: "none", age: "gia" },
  "su-phu": { robe: "#F3EAD2", hair: { style: "bui-toi", color: "#DADADA" }, beard: "rau-dai", beardColor: "#EEEEEE", weapon: "gay", belt: "#8A2A1E", age: "gia" },
  "nu-hiep": { robe: "#D7263D", hair: { style: "duoi-ngua", color: "#1E1A1A" }, weapon: "kiem", belt: "#F3EAD2", skirt: true, eyes: "#3A6FA8" },
  "cai-bang": { robe: "#8A6A44", hair: { style: "ngan", color: "#5A4A3A" }, weapon: "gay", belt: "#C9A45C" },
  tang: { robe: "#E3A21A", hair: { style: "troc", color: "#3A2A22" }, hat: "troc", weapon: "none", belt: "#8A2A1E", sash: "#8A2A1E" },
  "dao-si": { robe: "#3D6FA8", hair: { style: "bui-cao", color: "#1E1A1A" }, hat: "tram", weapon: "kiem", belt: "#F3EAD2" },
  "cong-tu": { robe: "#F4F1EA", hair: { style: "bui-toi", color: "#2B2220" }, weapon: "kiem", belt: "#2E6FB7" },
  "lao-quai": { robe: "#4A2E5C", hair: { style: "tien-ong", color: "#9A9A9A" }, beard: "rau-dai", beardColor: "#BBBBBB", weapon: "gay", belt: "#C8372D", age: "gia" },
};
