// Kiểu mặt CARTOON của kênh Tèo Thể Thao (người dùng chọn 2026-10-26, thay mặt anime mắt to long lanh).
// Dùng cho mọi nhân vật của kênh (Tèo + cầu thủ) để nhận diện thống nhất: viền đậm một màu, mắt bầu dục trắng con ngươi đen nhỏ,
// lông mày khối dày, mũi rõ, miệng rộng biểu cảm mạnh, tóc mảng phẳng 1 tông + 1 mảng tối. Không má gạch, không ánh mắt nhiều lớp.
// Hợp đồng rig2 (teo-kiem-hiep/engine/rig2.mjs): export default (p, o, kit) → svg đầu trong toạ độ 300×420 (mắt ~y182, cằm ~y270).
// Nhóm bắt buộc: <p>-mat, <p>-ex-<biểu cảm> (chứa <p>-mc-/<p>-mo-<biểu cảm>), <p>-blink.

const OUT = "#22182A";             // màu viền chung
const CX = 150, EY = 184;
const W = 6;                        // độ dày viền
const ln = (d, w = W, c = OUT) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const sh = (d, fill, w = W) => `<path d="${d}" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round"/>`;

// khuôn mặt: tròn · hàm vuông · mặt dài — chọn theo băm id
const FACES = {
  tron: "M150 274 C104 274 58 250 54 196 C50 112 96 62 150 62 C204 62 250 112 246 196 C242 250 196 274 150 274Z",
  vuong: "M150 276 C112 276 64 266 58 222 C50 116 96 62 150 62 C204 62 250 116 242 222 C236 266 188 276 150 276Z",
  dai: "M150 284 C112 284 66 256 58 206 C50 112 96 60 150 60 C204 60 250 112 242 206 C234 256 188 284 150 284Z",
};
const NOSES = {
  bau: (s) => `<ellipse cx="152" cy="216" rx="13" ry="10" fill="${s}" stroke="${OUT}" stroke-width="4.5"/>`,
  moc: () => ln("M154 206 Q168 220 150 226 Q146 225 144 221", 4.5),
  nut: (s) => `<path d="M140 218 Q150 230 162 218" fill="${s}" stroke="${OUT}" stroke-width="4.5" stroke-linecap="round"/>`,
};

// mắt: lòng trắng bầu dục đứng, con ngươi đen nhỏ, 1 chấm sáng
function eye(cx, side, e, skin) {
  const rx = e === "soc" ? 25 : 21, ry = e === "soc" ? 31 : 27, cy = EY;
  if (e === "ko") return ln(`M${cx - 13} ${cy - 13} L${cx + 13} ${cy + 13} M${cx + 13} ${cy - 13} L${cx - 13} ${cy + 13}`, 6);
  // "vui" giữ mắt mở (Godot đổi binh ↔ vui để nhép miệng khi nói, mắt không được nháy theo)
  const look = { ngai: [-side * 7 + 5, 8], buon: [0, 8], soc: [0, 0], "dac-y": [6, 4], gian: [-side * 3, 4], "quyet-tam": [-side * 3, 2] }[e] || [0, 3];
  const pr = e === "soc" ? 5 : 8.5;
  let s = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#FFFFFF" stroke="${OUT}" stroke-width="${W}"/>`;
  s += `<circle cx="${cx + look[0]}" cy="${cy + look[1]}" r="${pr}" fill="${OUT}"/><circle cx="${cx + look[0] - 3}" cy="${cy + look[1] - 3}" r="2.6" fill="#FFFFFF"/>`;
  // mí che (cùng màu da) cho giận / đắc ý / buồn
  const lid = (y1, y2) => `<path d="M${cx - rx - 3} ${cy - ry - 4} L${cx + rx + 3} ${cy - ry - 4} L${cx + rx + 3} ${side > 0 ? y2 : y1} L${cx - rx - 3} ${side > 0 ? y1 : y2}Z" fill="${skin}"/>` + ln(`M${cx - rx - 1} ${side > 0 ? y1 : y2} L${cx + rx + 1} ${side > 0 ? y2 : y1}`, W);
  if (e === "gian" || e === "quyet-tam") s += lid(cy - (e === "gian" ? 4 : 10), cy - ry + 2);   // xếch vào trong
  if (e === "dac-y") s += lid(cy - 2, cy - 2);
  if (e === "buon") s += lid(cy - ry + 2, cy - 6);
  return s;
}
function brows(e, c, side) {
  // khối lông mày dày: [nghiêng °, nâng y]
  const [rot, dy] = { gian: [22, 6], "quyet-tam": [16, 4], buon: [-20, -4], soc: [0, -18], ngai: [-12, -6], "dac-y": [side > 0 ? -10 : 8, side > 0 ? -10 : 0], ko: [0, -10], vui: [0, -10] }[e] || [0, -6];
  const cx = CX + side * 36, y = EY - 44 + dy;
  return `<rect x="${cx - 20}" y="${y - 6}" width="40" height="12" rx="6" fill="${c}" stroke="${OUT}" stroke-width="3.5" transform="rotate(${side * rot} ${cx} ${y})"/>`;
}
function mouth(e, p) {
  const y = 246, M = "#7A1E2E", T = "#FF7A8A";
  const open = {
    vui: `<path d="M118 ${y - 6} Q150 ${y - 2} 182 ${y - 6} Q176 ${y + 30} 150 ${y + 30} Q124 ${y + 30} 118 ${y - 6}Z" fill="${M}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><path d="M124 ${y - 4} L176 ${y - 4} L174 ${y + 4} L126 ${y + 4}Z" fill="#fff"/><path d="M134 ${y + 22} Q150 ${y + 10} 166 ${y + 22} Q150 ${y + 30} 134 ${y + 22}Z" fill="${T}"/>`,
    soc: `<ellipse cx="150" cy="${y + 6}" rx="14" ry="19" fill="${M}" stroke="${OUT}" stroke-width="${W}"/>`,
    gian: `<path d="M124 ${y + 8} Q150 ${y - 8} 176 ${y + 8} L170 ${y + 18} L130 ${y + 18}Z" fill="#fff" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>` + ln(`M128 ${y + 11} L172 ${y + 11}`, 3),
    "quyet-tam": `<path d="M122 ${y} L178 ${y} L174 ${y + 16} L126 ${y + 16}Z" fill="#fff" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>` + ln(`M124 ${y + 8} L176 ${y + 8} M138 ${y} L138 ${y + 16} M150 ${y} L150 ${y + 16} M162 ${y} L162 ${y + 16}`, 3),
    buon: `<path d="M126 ${y + 16} Q150 ${y - 4} 174 ${y + 16} Q150 ${y + 8} 126 ${y + 16}Z" fill="${M}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`,
    "dac-y": `<path d="M124 ${y + 2} Q156 ${y + 8} 180 ${y - 8} Q170 ${y + 18} 148 ${y + 16} Q130 ${y + 14} 124 ${y + 2}Z" fill="${M}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`,
    ngai: `<ellipse cx="150" cy="${y + 6}" rx="8" ry="7" fill="${M}" stroke="${OUT}" stroke-width="5"/>`,
  };
  const closed = {
    vui: ln(`M120 ${y - 2} Q150 ${y + 26} 180 ${y - 2}`, W),
    binh: ln(`M132 ${y + 4} Q150 ${y + 12} 168 ${y + 4}`, W),
    gian: ln(`M128 ${y + 12} Q150 ${y - 2} 172 ${y + 12}`, W),
    buon: ln(`M128 ${y + 14} Q150 ${y} 172 ${y + 14}`, W),
    soc: `<ellipse cx="150" cy="${y + 6}" rx="10" ry="13" fill="${M}" stroke="${OUT}" stroke-width="${W}"/>`,
    "dac-y": ln(`M128 ${y + 6} Q156 ${y + 12} 176 ${y - 6}`, W),
    ngai: ln(`M134 ${y + 8} q5 -6 10 0 t10 0 t10 0`, 5),
    "quyet-tam": ln(`M128 ${y + 6} L172 ${y + 6}`, W + 1),
    ko: `<ellipse cx="150" cy="${y + 8}" rx="12" ry="9" fill="${M}" stroke="${OUT}" stroke-width="${W}"/>`,
  };
  const eo = e === "binh" ? "vui" : e === "ko" ? "soc" : e;
  return `<g id="${p}-mc-${e}">${closed[e] || closed.binh}</g><g id="${p}-mo-${e}" opacity="0">${open[eo] || open.vui}</g>`;
}
function marks(e) {
  const blush = (op) => [-1, 1].map((s) => `<ellipse cx="${CX + s * 70}" cy="232" rx="16" ry="9" fill="#FF8C8C" opacity="${op}"/>`).join("");
  switch (e) {
    case "ngai": return blush(0.55) + `<path d="M244 128 q10 14 0 22 q-10 -8 0 -22Z" fill="#BFE8FF" stroke="${OUT}" stroke-width="3"/>`;
    case "soc": return ln("M90 108 l-6 -18 M108 100 l-2 -20 M126 98 l2 -20", 4);
    case "gian": return `<g transform="translate(232 104)" stroke="#E02424" stroke-width="5" stroke-linecap="round" fill="none"><path d="M-12 -4 Q-4 -4 -4 -12 M4 -12 Q4 -4 12 -4 M12 4 Q4 4 4 12 M-4 12 Q-4 4 -12 4"/></g>`;
    case "buon": return `<path d="M200 206 q8 14 0 22 q-8 -8 0 -22Z" fill="#BFE8FF" stroke="${OUT}" stroke-width="3"/>`;
    default: return "";
  }
}

// tóc: mảng phẳng + 1 mảng tối phía sau, viền đậm
const CAP = {
  bowl: "M52 178 C42 92 94 44 150 44 C206 44 258 92 248 178 L246 150 C244 134 236 126 224 124 L76 124 C64 126 56 134 54 150Z",
  part: "M52 172 C44 92 96 46 150 46 C208 46 256 92 248 172 C244 132 228 108 200 98 C172 122 118 132 74 124 C62 136 56 152 52 172Z",
  crew: "M54 168 C48 96 96 52 150 52 C204 52 252 96 246 168 C238 132 216 112 192 108 C176 118 124 118 108 108 C84 112 62 132 54 168Z",
  spiky: "M56 170 C50 122 66 88 92 72 L80 40 L116 56 L126 20 L152 50 L176 18 L186 56 L222 40 L210 74 C234 92 250 126 244 170 C232 132 198 112 150 112 C102 112 68 132 56 170Z",
};
const STYLE = { "mai-bang": ["bowl"], "re-ngoi": ["part"], "bom-gai": ["spiky"], ngan: ["crew"], "duoi-ngua": ["part", "pony"], "bui-toi": ["part", "bun"], "bui-cao": ["crew", "bunHigh"], "tien-ong": ["crew", "bun"], "dai-thang": ["bowl", "long"], troc: [null] };
function hairBack(kind, c, d) {
  switch (kind) {
    case "pony": return sh("M232 120 C276 150 282 236 248 286 C252 230 244 176 222 150Z", d);
    case "bun": return `<circle cx="150" cy="36" r="26" fill="${c}" stroke="${OUT}" stroke-width="${W}"/>`;
    case "bunHigh": return `<circle cx="150" cy="24" r="32" fill="${c}" stroke="${OUT}" stroke-width="${W}"/>`;
    case "long": return sh("M54 150 C38 230 46 300 70 330 L230 330 C254 300 262 230 246 150Z", d);
    default: return "";
  }
}

let dk, lt;
const hash = (s) => [...String(s)].reduce((a, ch) => (Math.imul(a, 31) + ch.charCodeAt(0)) >>> 0, 7);
const pickBy = (obj, n) => Object.keys(obj)[n % Object.keys(obj).length];

export default function ve(p, o, kit) {
  ({ dk, lt } = kit);
  const EXPRS = kit.EXPRS, skin = o.skin, hc = o.hair?.color || "#2B2220";
  const n = hash(o.id || p), m = o.mat || {};
  // trục khuon/mui của kiểu khác (vd "cham") không có ở đây → bỏ qua, chọn theo băm id
  const khuon = FACES[m.khuon] ? m.khuon : pickBy(FACES, n), mui = NOSES[m.mui] ? m.mui : pickBy(NOSES, n >>> 4);
  const [front, back] = STYLE[o.hair?.style] || STYLE.ngan;
  const skinD = dk(skin, 0.12), hd = dk(hc, 0.25);
  const h = [];
  if (back) h.push(hairBack(back, hc, hd));
  // tai chữ C + mặt + mũi
  const ear = (s) => sh(`M${150 + s * 96} 176 C${150 + s * 118} 168 ${150 + s * 122} 206 ${150 + s * 96} 212`, skin, 5) + ln(`M${150 + s * 102} 184 Q${150 + s * 110} 194 ${150 + s * 102} 202`, 3.5);
  h.push(`<g id="${p}-mat">${ear(-1)}${ear(1)}${sh(FACES[khuon], skin)}<path d="M84 238 C104 266 196 266 216 238 C200 262 176 270 150 270 C124 270 100 262 84 238Z" fill="${skinD}" opacity=".45"/></g>`);
  if (o.age === "gia") h.push(ln("M112 120 Q150 110 188 120 M120 108 Q150 100 180 108", 3.5, dk(skin, 0.4)));
  if (front) h.push(sh(CAP[front], hc) + `<path d="M96 70 Q120 60 140 62" fill="none" stroke="${lt(hc, 0.35)}" stroke-width="7" stroke-linecap="round" opacity=".7"/>`);
  else h.push(`<path d="M104 84 Q130 70 156 72" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity=".35"/>`);
  if (o.beard === "rau-de") h.push(sh("M136 262 Q150 292 164 262 Q150 270 136 262Z", o.beardColor || hc, 4));
  const bc = dk(hc, 0.1);
  for (const e of EXPRS) {
    h.push(`<g id="${p}-ex-${e}" opacity="${e === (o.expr || "vui") ? 1 : 0}">${marks(e)}${eye(CX - 36, -1, e, skin)}${eye(CX + 36, 1, e, skin)}${brows(e, bc, -1)}${brows(e, bc, 1)}${mouth(e, p)}</g>`);
  }
  h.push(`<g id="${p}-blink" opacity="0">${[-1, 1].map((s) => { const cx = CX + s * 36; return `<ellipse cx="${cx}" cy="${EY}" rx="25" ry="31" fill="${skin}"/>` + ln(`M${cx - 20} ${EY + 4} Q${cx} ${EY + 14} ${cx + 20} ${EY + 4}`, 6); }).join("")}</g>`);
  h.push(NOSES[mui](skin)); // mũi vẽ sau mắt để không bị lòng trắng che
  if (o.beard === "ria" || o.beard === "rau-dai") h.push(sh("M150 232 Q130 222 112 236 Q132 240 150 236 Q168 240 188 236 Q170 222 150 232Z", o.beardColor || hc, 4));
  if (o.glasses) h.push(`<g fill="none" stroke="${OUT}" stroke-width="5"><circle cx="${CX - 36}" cy="${EY}" r="32"/><circle cx="${CX + 36}" cy="${EY}" r="32"/><path d="M${CX - 4} ${EY - 4} L${CX + 4} ${EY - 4}"/></g>`);
  return h.join("");
}
