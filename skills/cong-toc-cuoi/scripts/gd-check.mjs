// Soát một tập Godot trước khi render (và ghi sổ sau khi render xong).
//   node <SKILL>/scripts/gd-check.mjs <thư mục tập> [--no-godot] [--log]
// Kênh Cọng Tóc Cuối. Kiểm: loi.txt (id, không "Chương", hook ngôi "bạn", CTA đúng chỗ), giọng đủ và khớp chữ, Godot parse + DUR 10:00–18:00,
// phim.gd đã thay chỗ giữ, story.json điền đủ và KHÁC 5 tập gần nhất trong data/history.json (độ giống ≥60% là lỗi),
// chân mô tả seo.chan không lặp tập trước, có nv.gd + cọng tóc (toc/toc_roi) trong phim. Chủ đề né: cờ bạc, mại dâm, ma tuý;
// story.facts (không bắt buộc; có thì mỗi dữ kiện ≥2 nguồn + so_lieu_ngay), story.chu_de không trùng tập cũ (≥80%).
// Short dọc (project 1080×1920, tạo bởi new-short.mjs) tự đổi luật: ≤ 60 s, hook ≤ 12 s, kết có "đăng ký", story.kieu khác
// các short anh em, không so history và không --log.
// --log: khi không còn lỗi và đã có renders/final.mp4 → ghi story.json vào data/history.json.
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const SKILL = dirname(dirname(fileURLToPath(import.meta.url)));
const GODOT = process.env.GODOT || (process.platform === "darwin" ? homedir() + "/Godot/Godot.app/Contents/MacOS/Godot" : "godot");
const HIST = join(SKILL, "data/history.json");
const args = process.argv.slice(2);
const has = (k) => { const i = args.indexOf(k); if (i < 0) return false; args.splice(i, 1); return true; };
const noGodot = has("--no-godot"), doLog = has("--log");
if (!args[0]) { console.log("dùng: node gd-check.mjs <thư mục tập> [--no-godot] [--log]"); process.exit(1); }
const TAP = resolve(args[0]), G = join(TAP, "godot"), slug = basename(TAP);
const err = [], warn = [];
const read = (f) => readFileSync(join(G, f), "utf8");
const SHORT = (() => { const p = existsSync(join(G, "project.godot")) ? readFileSync(join(G, "project.godot"), "utf8") : ""; return +(p.match(/viewport_height=(\d+)/)?.[1] || 0) > +(p.match(/viewport_width=(\d+)/)?.[1] || 0); })();
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// ---- loi.txt → đoạn + câu, xếp giờ giống main.gd (GAP 0.7, pre 0.6, post 1.0)
if (!existsSync(join(G, "loi.txt"))) { console.error("không có godot/loi.txt — chạy new-tap.mjs trước"); process.exit(1); }
// giọng: từ tập 21 (2026-11-03) người kể LUÔN là "Quốc Tuấn"; câu thoại của nhân vật nữ liệt kê ở story.giong_nu đọc "Ngọc Huyền".
// Tập ≤20 giữ luật cũ (giọng theo story.ban_gioi: nam → Quốc Tuấn, nu → Ngọc Huyền cả tập).
const VOICES = { nam: "Quốc Tuấn", nu: "Ngọc Huyền" };
const STORY0 = (() => { try { return JSON.parse(read("story.json")); } catch { return {}; } })();
const GIOI = STORY0.ban_gioi || "nam";
if (!VOICES[GIOI]) err.push(`story.ban_gioi phải là "nam" hoặc "nu" (đang là "${GIOI}")`);
const SO_TAP = +((slug.match(/^tap-(\d+)/) || [])[1] || 99);
const VOICE = SO_TAP <= 20 ? (VOICES[GIOI] || VOICES.nam) : VOICES.nam;
const GIONG_NU = new Set(SO_TAP <= 20 ? [] : (STORY0.giong_nu || []));
const vj = existsSync(join(G, "voice/voice.json")) ? JSON.parse(read("voice/voice.json")) : null;
const man = vj ? vj.lines : {};
if (vj && vj.voice !== VOICE) err.push(`giọng người kể đang là "${vj.voice}" — kênh dùng "${VOICE}": chạy lại gd-voice --voice "${VOICE}"`);
if (vj) for (const [id, l] of Object.entries(man)) {
  const can = GIONG_NU.has(id) ? VOICES.nu : VOICE, co = l.voice || vj.voice;
  if (co !== can) err.push(`[${id}] đọc bằng "${co}", phải là "${can}" (thoại nữ chỉ khi id nằm trong story.giong_nu) → chạy lại gd-voice`);
}
const segs = [], lines = [], seen = new Set();
for (const raw of read("loi.txt").split("\n")) {
  const ln = raw.trim();
  if (ln.startsWith("## ")) {
    const [name, note = ""] = ln.slice(3).split("|");
    const kid = name.trim().split(/\s+/)[0];
    const opt = (k, d) => { const m = note.match(new RegExp(k + "=([\\d.]+)")); return m ? +m[1] : d; };
    segs.push({ kid, pre: opt("pre", 0.6), post: opt("post", 1.0), lines: [] });
  } else if (ln.startsWith("[") && segs.length) {
    const id = ln.slice(1, ln.indexOf("]")), text = ln.slice(ln.indexOf("]") + 1).trim();
    if (!/^[a-z0-9-]+$/.test(id)) err.push(`id "${id}" chỉ được chữ thường/số/gạch`);
    if (seen.has(id)) err.push(`id "${id}" trùng`);
    seen.add(id);
    const v = man[id];
    if (!v) err.push(`[${id}] chưa có giọng (chạy gd-voice)`);
    else if (v.text !== text) err.push(`[${id}] chữ đã sửa sau khi đọc giọng (chạy lại gd-voice)`);
    else if (!existsSync(join(G, "voice", id + ".wav"))) err.push(`[${id}] thiếu voice/${id}.wav`);
    const l = { id, text, dur: v?.dur ?? text.split(" ").length / 4.1 };
    segs.at(-1).lines.push(l); lines.push(l);
  }
}
if (!segs.length) err.push("loi.txt không có đoạn nào (## kNN …)");
let tc = 0;
for (const s of segs) {
  s.t0 = tc; tc += s.pre;
  for (const l of s.lines) { l.t0 = tc; tc += l.dur + 0.7; }
  if (s.lines.length) tc -= 0.7;
  tc += s.post; s.t1 = tc;
}
const DURjs = tc + 0.5;

// ---- Godot: parse + DUR
let DUR = DURjs, fresh = false;
if (!noGodot) {
  spawnSync(GODOT, ["--headless", "--path", G, "--import"], { stdio: "ignore", timeout: 180000 });
  const r = spawnSync(GODOT, ["--headless", "--path", G, "--", "--dur"], { encoding: "utf8", timeout: 90000 }); // script lỗi thì Godot không tự quit
  const out = (r.stdout || "") + (r.stderr || "");
  for (const m of out.matchAll(/(SCRIPT ERROR|Parse Error|ERROR):[^\n]*(\n\s+at:[^\n]*)?/g)) err.push("godot: " + m[0].replace(/\s+/g, " ").trim());
  const m = out.match(/DUR=([\d.]+)/);
  if (!m) err.push("main không in DUR= khi chạy --dur");
  else { DUR = +m[1]; fresh = true; if (Math.abs(DUR - DURjs) > 1) warn.push(`DUR Godot ${DUR.toFixed(1)} ≠ tính từ loi.txt ${DURjs.toFixed(1)} — main.gd đã đổi cách xếp giờ; luật CTA/chào dùng giờ của Godot`); }
}
if (SHORT) {
  if (DUR > 60) err.push(`short dài ${DUR.toFixed(1)} s > 60 s — cắt bớt lời`);
  else if (DUR < 20) warn.push(`short chỉ ${DUR.toFixed(1)} s — quá ngắn để kể trọn một ý`);
} else {
  // kênh Cọng Tóc Cuối: video dài 10:00–18:00, nhắm 12–15 phút
  if (DUR > 1080) err.push(`thời lượng ${mmss(DUR)} > 18:00 — cắt khối yếu nhất`);
  else if (DUR < 600) (Object.keys(man).length ? err : warn).push(`thời lượng ${mmss(DUR)} < 10:00 — quá ngắn cho video dài`);
}

// giờ thật lấy từ timeline.json mà main.gd ghi khi --dur (tập có thể đổi cách xếp giờ trong main.gd); không có thì giữ giờ tính bằng JS
const TL = join(G, "timeline.json");
if (fresh && existsSync(TL)) {
  const tl = JSON.parse(readFileSync(TL, "utf8"));
  const at = Object.fromEntries((tl.cau || []).map((c) => [c.id, c.t0]));
  for (const l of lines) if (at[l.id] !== undefined) l.t0 = at[l.id];
  for (const k of tl.khung || []) { const sg = segs.find((x) => x.kid === k.id); if (sg) { sg.t0 = k.t0; sg.t1 = k.t1; } }
  if (!tl.cau) warn.push("timeline.json không có 'cau' — vị trí CTA tính theo cách xếp giờ mặc định");
}

// ---- luật lời: không "Chương", hook trước chào, chào sớm, CTA giữa + cuối
const word = (w) => new RegExp(`(^|[^\\p{L}])${w}(?=$|[^\\p{L}])`, "iu");
for (const l of lines) if (word("chương").test(l.text)) err.push(`[${l.id}] có chữ "Chương" — video liền mạch, không chia chương`);
for (const l of lines) if (/(xin chào|chào mừng các bạn|tôi là|mình là)/i.test(l.text) && l.t0 < 60) err.push(`[${l.id}] người kể không chào, không tự giới thiệu — vào chuyện bằng ngôi "bạn"`);
if (lines[0] && !/(^|[^\p{L}])bạn(?=$|[^\p{L}])/iu.test(lines.slice(0, 3).map((l) => l.text).join(" "))) warn.push("3 câu đầu chưa có chữ \"bạn\" — kênh kể ngôi thứ hai, đặt người xem vào chuyện ngay");
if (lines[0] && /chào/i.test(lines[0].text)) err.push("câu đầu phải là hook, không phải lời chào");
if (SHORT) {
  const hw = lines[0] ? lines[0].text.split(/\s+/).length : 0;
  if (hw > 12) warn.push(`câu hook [${lines[0].id}] ${hw} chữ — nên ≤ 12`);
  if (segs[0] && segs[0].t1 > 12.5) warn.push(`đoạn hook ${segs[0].kid} dài ${segs[0].t1.toFixed(1)} s — nên ≤ 12 s`);
  if (!lines.some((l) => /đăng ký/i.test(l.text) && l.t0 >= DUR * 0.7)) err.push("short phải kết bằng câu mời đăng ký (trong 30% cuối)");
  if (!lines.some((l) => /cọng tóc cuối/i.test(l.text))) warn.push('không câu nào nhắc tên kênh "Cọng Tóc Cuối"');
} else {
  // luật tăng sub (data/tang-truong.md): hook ngắn, xin đăng ký sau khi đã cho giá trị, kết móc sang video sau, không chào tạm biệt
  if (segs[0] && segs[0].t1 > 30.5) warn.push(`đoạn hook ${segs[0].kid} dài ${segs[0].t1.toFixed(1)} s — nên ≤ 30 s, vào thẳng điểm đắt`);
  const sub0 = lines.find((l) => /đăng ký/i.test(l.text));
  if (sub0 && sub0.t0 < 60) warn.push(`[${sub0.id}] xin đăng ký ở ${mmss(sub0.t0)} — quá sớm, xin sau khi đã trả một phần lời hứa của hook (≥ 25%)`);
  // 3 câu cuối (sau đó là màn hình kết không lời)
  const tail = lines.slice(-3);
  if (tail.some((l) => /(tạm biệt|bye|hẹn gặp lại|chào các bạn)/i.test(l.text))) warn.push("3 câu cuối có câu tạm biệt — người xem sẽ thoát trước màn hình kết; thay bằng câu móc sang video tiếp");
  if (!tail.some((l) => /(video|tập) (tiếp|sau|kế|này)|bấm vào|ngay trên màn hình|bên cạnh/i.test(l.text))) warn.push("3 câu cuối chưa móc sang video tiếp (màn hình kết) — thêm câu dẫn người xem bấm video kế");
  const lastSeg = segs.at(-1);
  if (lastSeg && lastSeg.t1 - (lastSeg.lines.at(-1)?.t0 + lastSeg.lines.at(-1)?.dur || 0) < 19) warn.push('đoạn cuối nên có post=20 để chừa màn hình kết 20 s');
}
const CTA = /(đăng ký|bật chuông|bấm like|nhấn like|thả like|bình luận)/i;
const ctas = lines.filter((l) => CTA.test(l.text));
if (!SHORT && !ctas.some((l) => l.t0 >= DUR * 0.25 && l.t0 <= DUR * 0.75)) err.push("thiếu CTA ở khoảng 25–75% thời lượng");
if (!SHORT && !ctas.some((l) => l.t0 >= DUR * 0.9)) err.push("thiếu CTA ở 10% cuối");

// ---- phần hình
if (!existsSync(join(G, "phim.gd")) && !existsSync(join(G, "main.gd"))) err.push("không có phim.gd");
else if (existsSync(join(G, "phim.gd")) && read("phim.gd").includes("CHUA_DUNG")) err.push("phim.gd còn là chỗ giữ (CHUA_DUNG) — chưa dựng hình");
// render liền mạch chỉ vẽ lại node nào gọi queue_redraw: lớp nền/chữ tự viết phải được vẽ lại mỗi khung
// (tập 19, 2026-10-30: soi đúng nhưng bản cuối kẹt nền + thẻ chữ của cảnh đầu phần render; tập 18 thiếu cả hàm at())
if (existsSync(join(G, "phim.gd"))) {
  const ph = read("phim.gd");
  if (!/^func at\(/m.test(ph)) err.push("phim.gd thiếu func at(t, seg, line) — main.gd gọi hàm này mỗi khung");
  for (const [, v, f] of ph.matchAll(/^\s*(\w+)\s*=\s*preload\("res:\/\/(\w+)\.gd"\)\.new\(\)/gm)) {
    if (f === "nv") continue;
    const tuVe = existsSync(join(G, f + ".gd")) && /func _process[\s\S]*?queue_redraw\(\)/.test(read(f + ".gd"));
    if (!tuVe && !ph.includes(`${v}.queue_redraw()`)) err.push(`phim.gd: lớp "${v}" (${f}.gd) không được queue_redraw() mỗi khung → bản render sẽ kẹt hình cảnh đầu`);
  }
}
// chữ trên hình không được gọi tên cấu trúc chuyện (tập 15 "CÚ LẬT: …", tập 12 "MANH MỐI 1/2/3" lộ trước cú lật)
for (const f of existsSync(G) ? readdirSync(G).filter((x) => x.endsWith(".gd") && x !== "nv.gd") : []) {
  read(f).split("\n").forEach((ln, i) => {
    const s = ln.replace(/#.*$/, "");
    if ([...s.matchAll(/"([^"]*)"/g)].some(([, q]) => /cú lật|manh mối|twist|plot/i.test(q)))
      err.push(`${f}:${i + 1} chữ trên hình gọi tên cấu trúc chuyện (cú lật/manh mối/twist): ${ln.trim().slice(0, 70)}`);
  });
}
if (!existsSync(join(G, "nv.gd"))) err.push("thiếu godot/nv.gd — nhân vật phải vẽ bằng engine của kênh (new-tap chép sẵn)");
const gdAll = existsSync(G) ? readdirSync(G).filter((f) => f.endsWith(".gd") && f !== "nv.gd").map((f) => read(f)).join("\n") : "";
// tư thế / biểu cảm phải có trong nv.gd của tập (tên bịa ra làm nhân vật không được vẽ)
if (existsSync(join(G, "nv.gd"))) {
  const nv = read("nv.gd");
  const poses = new Set([...nv.matchAll(/^\t"([a-z_]+)":\s*\{"aR"/gm)].map((m) => m[1]).concat(["di", "chay", ""]));
  const exprs = new Set(["binh", "vui", "met", "buon", "soc"]);
  const badP = new Set([...gdAll.matchAll(/set_pose\(\s*"([a-z_]*)"(?:\s*,\s*"([a-z_]*)")?/g)].flatMap((m) => [m[1], m[2] ?? ""]).filter((p) => !poses.has(p)));
  const badE = new Set([...gdAll.matchAll(/\.expr\s*=\s*"([a-z_]+)"/g)].map((m) => m[1]).filter((e) => !exprs.has(e)));
  if (badP.size) err.push(`phim dùng tư thế không có trong nv.gd: ${[...badP].join(", ")} — nhân vật sẽ không được vẽ; dùng tư thế có sẵn hoặc thêm vào POSES của engine`);
  if (badE.size) err.push(`phim dùng biểu cảm không có: ${[...badE].join(", ")} — chỉ có binh, vui, met, buon, soc`);
}
if (!SHORT && !/\.toc\s*=/.test(gdAll)) warn.push("phim chưa đổi .toc (cọng tóc tâm trạng) — tóc phải gục dần theo chuyện");
// series (story.series = { ten, phan, tong }): tóc chỉ rụng ở phần cuối, phần trước kết bằng câu treo
const SER = (() => { try { return JSON.parse(read("story.json")).series || null; } catch { return null; } })();
const SER_CUOI = !SER || SER.phan === SER.tong;
if (!SHORT && SER_CUOI && !/\.toc_roi\s*=/.test(gdAll)) warn.push("phim chưa có .toc_roi — mỗi tập (hoặc phần cuối series) một khoảnh khắc cọng tóc rụng ở khúc tệ nhất");
if (!SHORT && !SER_CUOI && /\.toc_roi\s*=\s*[^-]/.test(gdAll)) warn.push(`series phần ${SER.phan}/${SER.tong}: tóc chỉ rụng ở phần cuối — phần này để tóc gục, kết bằng câu treo`);

// ---- story.json: điền đủ, khác các tập gần (so theo độ giống: tỉ lệ từ chung, không chỉ chữ y hệt)
const FIELDS = ["khung", "nen", "may_quay", "palette", "nhac", "thumb", "font", "cao_trao"];
const STOP = new Set(["của", "và", "trên", "một", "các", "những", "theo", "kiểu", "với", "cho", "là", "có", "trong", "chữ"]);
const norm = (s) => String(s || "").toLowerCase().normalize("NFC").replace(/\s+/g, " ").trim();
const words = (s) => new Set(norm(s).split(/[^\p{L}\p{N}]+/u).filter((w) => w && !STOP.has(w)));
// Jaccard trên tập từ: "cuộn tranh mực" ~ "tranh cuộn mực" = 1. contain=true (chân mô tả) hoặc một bên ≤ 2 từ (font, tên)
// thì tính theo bên ngắn hơn: "Palatino" ~ "Palatino (pala/palab)" = 1, chép 2/3 dòng chân cũ cũng bị bắt.
const sim = (a, b, contain = false) => {
  const A = words(a), B = words(b); if (!A.size || !B.size) return 0;
  let n = 0; for (const w of A) if (B.has(w)) n++;
  const lo = Math.min(A.size, B.size);
  return contain || lo <= 2 ? Math.max(n / lo, n / (A.size + B.size - n)) : n / (A.size + B.size - n);
};
const SIM_ERR = 0.6, SIM_WARN = 0.4;
let story = null;
if (!existsSync(join(G, "story.json"))) err.push("thiếu godot/story.json");
else if (SHORT) {
  story = JSON.parse(read("story.json"));
  if (!norm(story.kieu) || story.kieu.startsWith("<")) err.push("story.kieu (kiểu short) chưa viết");
  const sdir = dirname(TAP);
  for (const o of readdirSync(sdir)) {
    const f = join(sdir, o, "godot/story.json");
    if (o === slug || !existsSync(f)) continue;
    const x = sim(story.kieu, JSON.parse(readFileSync(f, "utf8")).kieu);
    if (x >= SIM_ERR) err.push(`story.kieu giống short ${o} ${Math.round(x * 100)}% — 3 short của tập phải khác kiểu`);
  }
  if (!norm(story.seo?.mo_ta)) err.push("story.seo.mo_ta chưa viết");
  const t = story.seo?.title || "";
  if (!t || t.includes("…")) err.push("story.seo.title chưa viết");
  else if (t.length > 60) err.push(`seo.title phải ≤ 60 ký tự (đang ${t.length}) — tên quan trọng nhất đặt ở 40 ký tự đầu`);
} else {
  story = JSON.parse(read("story.json"));
  // các phần cùng series giữ chung nền/palette/nhạc/font: chỉ so với tập ngoài series
  const ser = story.series?.ten;
  if (story.series && !(ser && story.series.phan >= 1 && story.series.tong >= 2 && story.series.phan <= story.series.tong)) err.push("story.series phải có { ten, phan, tong } với 1 ≤ phan ≤ tong, tong ≥ 2");
  const hist = JSON.parse(readFileSync(HIST, "utf8")).filter((h) => h.tap !== slug && !(ser && h.series === ser)).slice(-5);
  const near = (f, v) => hist.map((h) => [h, sim(v, h[f], f === "chan")]).sort((a, b) => b[1] - a[1])[0] || [null, 0];
  for (const f of [...FIELDS, "chan"]) {
    const v = f === "chan" ? story.seo?.chan : story[f];
    if (!norm(v)) { err.push(`story.json: "${f === "chan" ? "seo.chan" : f}" trống`); continue; }
    const [h, x] = near(f, v);
    if (x >= SIM_ERR) err.push(`story.json: ${f} giống ${h.tap} ${Math.round(x * 100)}% ("${String(h[f]).split("\n")[0].slice(0, 50)}")`);
    else if (x >= SIM_WARN) warn.push(`story.json: ${f} hơi giống ${h.tap} (${Math.round(x * 100)}%)`);
  }
  const fdir = join(G, "font");
  if (norm(story.font) && !(existsSync(fdir) && readdirSync(fdir).some((f) => /\.(ttf|otf)$/i.test(f))))
    warn.push(`story.font "${story.font}" nhưng godot/font/ chưa có file .ttf/.otf nào`);
  const doan = Object.entries(story.doan || {});
  if (doan.length < 3) warn.push("story.doan nên ghi kiểu dựng của từng đoạn (mỗi đoạn một kiểu)");
  for (let i = 0; i < doan.length; i++) for (let j = i + 1; j < doan.length; j++)
    if (sim(doan[i][1], doan[j][1]) >= SIM_ERR) err.push(`story.doan: ${doan[i][0]} và ${doan[j][0]} cùng kiểu dựng ("${doan[i][1]}" ~ "${doan[j][1]}")`);
  const t = story.seo?.title || "";
  if (!t || t.includes("…")) err.push("story.seo.title chưa viết");
  else if (t.length > 60) err.push(`seo.title phải ≤ 60 ký tự (đang ${t.length}) — tên quan trọng nhất đặt ở 40 ký tự đầu`);
  // tiêu đề theo từ khoá người ta thật sự gõ (scripts/tieu-de.mjs → work/tieu-de.md); tập 1 làm trước luật này
  if (slug !== "tap-01-mot-nam-thue-tro") {
    const kw = (story.seo?.tu_khoa || "").trim().toLowerCase();
    if (!existsSync(join(TAP, "work/tieu-de.md"))) err.push("chưa tìm từ khoá: chạy scripts/tieu-de.mjs <tap> \"<từ khoá>\" … (gợi ý tìm kiếm + video đang nổi)");
    if (!kw) err.push("story.seo.tu_khoa trống — cụm từ khoá chính lấy từ gợi ý tìm kiếm trong work/tieu-de.md");
    else if (t && !t.toLowerCase().slice(0, 45).includes(kw)) err.push(`seo.title phải chứa từ khoá chính "${kw}" trong ~40 ký tự đầu`);
  }
}

// ---- cast.json: vai nét bút dạ; chỉ "ban" có màu áo
if (existsSync(join(G, "cast.json"))) {
  const cast = JSON.parse(read("cast.json"));
  if (!cast.ban) err.push('cast.json thiếu vai "ban" (nhân vật chính)');
  for (const [k, c] of Object.entries(cast)) if (k !== "ban" && k !== "ban_nu" && c.ao) warn.push(`cast.json ${k} có màu áo — luật kênh: chỉ Bạn có màu, vai phụ đen trắng`);
}

// ---- cổng chọn chủ đề + review kịch bản (data/danh-gia.md): y-tuong.md phải có hai mục, tổng điểm ≥28, review ĐẠT
if (!SHORT) {
  const yt = join(TAP, "y-tuong.md");
  const y = existsSync(yt) ? readFileSync(yt, "utf8") : "";
  if (!y) err.push("thiếu y-tuong.md");
  else {
    const dg = y.split(/^## Đánh giá chủ đề/m)[1];
    if (!dg) err.push('y-tuong.md thiếu mục "## Đánh giá chủ đề" (data/danh-gia.md mục 1)');
    else {
      const tong = +(dg.match(/Tổng[^\d]*(\d+)\s*\/\s*40/i)?.[1] || 0);
      if (!tong) err.push('mục Đánh giá chủ đề thiếu dòng "Tổng: NN/40" của ý được chọn');
      else if (tong < 28) err.push(`chủ đề chỉ đạt ${tong}/40 < 28 — chọn chủ đề khác`);
    }
    // ý phải lấy từ kho (tạo trước, lọc sau — người dùng chốt 2026-10-29), áp từ tập 11
    const soTap = +(slug.match(/^tap-(\d+)/)?.[1] || 0);
    if (soTap >= 11) {
      const khoF = join(TAP, "..", "kho-y-tuong.md");
      const kho = existsSync(khoF) ? readFileSync(khoF, "utf8") : "";
      const id = y.match(/^Kho:\s*([A-Z]\d+)/m)?.[1];
      if (!id) err.push('y-tuong.md thiếu dòng "Kho: <ID>" — ý phải lấy từ kho-y-tuong.md (SKILL bước 0)');
      else {
        const row = kho.split("\n").find((l) => l.startsWith(`| ${id} |`));
        if (!row) err.push(`ID ${id} không có trong kho-y-tuong.md`);
        else if (!new RegExp(`(chọn|đã làm) tập ${soTap}\\b`).test(row)) err.push(`kho-y-tuong.md: ${id} chưa ghi "chọn tập ${soTap}" / "đã làm tập ${soTap}"`);
        if (!new RegExp(`^\\*\\*Tập ${soTap}, ${id}`, "m").test(kho) && !/^## Khung logic/m.test(y)) err.push(`chưa có khung logic cho ${id} (kho-y-tuong.md "Khung logic" hoặc y-tuong.md "## Khung logic")`);
      }
    }
    if (!/^## Sổ logic/m.test(y) && !(story && story.tap === "tap-01-mot-nam-thue-tro")) err.push('y-tuong.md thiếu mục "## Sổ logic" (dòng thời gian, sổ tiền, ai biết gì) — chuyện bịa vẫn phải khớp');
    const rv = y.split(/^## Review kịch bản/m)[1];
    if (!rv) err.push('y-tuong.md thiếu mục "## Review kịch bản" (data/danh-gia.md mục 2)');
    else if (!/Kết luận:\s*ĐẠT/i.test(rv)) err.push('Review kịch bản chưa có "Kết luận: ĐẠT"');
    else if (!/độc lập/i.test(rv)) err.push("Review kịch bản thiếu lần review độc lập (subagent)");
  }
}

// ---- chủ đề né (giữ quảng cáo): cờ bạc, mại dâm, ma tuý; dữ kiện ≥2 nguồn + mốc số liệu; chủ đề khác tập cũ
// không chặn chủ đề (người dùng chốt 2026-10-29: "không cần phải né gì")
if (story && !SHORT) {
  const facts = story.facts || [];
  // chuyện được hư cấu hoàn toàn: facts không bắt buộc; dữ kiện nào đã ghi thì phải đủ 2 nguồn
  for (const [i, f] of facts.entries()) if (!f.claim || (f.nguon || []).filter(Boolean).length < 2) err.push(`story.facts[${i}] "${String(f.claim || "").slice(0, 40)}" thiếu claim hoặc chưa đủ 2 nguồn`);
  if (facts.length && !/^\d{4}-\d{2}-\d{2}$/.test(story.so_lieu_ngay || "")) err.push('story.so_lieu_ngay (YYYY-MM-DD) chưa ghi — giá, lương, lãi suất đổi theo thời gian, phải nói "tính đến …"');
  if (!norm(story.chu_de)) err.push("story.chu_de trống");
  else for (const h of JSON.parse(readFileSync(HIST, "utf8")).filter((h) => h.tap !== slug && !(story.series?.ten && h.series === story.series.ten))) {
    const x = sim(story.chu_de, h.chu_de);
    if (x >= 0.8) err.push(`story.chu_de trùng ${h.tap} ${Math.round(x * 100)}% ("${h.chu_de}") — cần góc mới`);
  }
}

// ---- báo
console.log(`${SHORT ? "short " : ""}${slug}: ${segs.length} đoạn, ${lines.length} câu, ${mmss(DUR)}`);
for (const s of segs) console.log(`  ${s.kid.padEnd(5)} ${mmss(s.t0)}–${mmss(s.t1)}  ${s.lines.length} câu`);
for (const w of warn) console.log("CẢNH BÁO " + w);
for (const e of err) console.log("LỖI " + e);
if (!err.length) console.log("OK");
if (doLog) {
  if (SHORT) { console.log("short không ghi sổ history.json"); process.exit(1); }
  if (err.length) { console.log("không ghi sổ: còn lỗi"); process.exit(1); }
  if (!existsSync(join(TAP, "renders/final.mp4"))) { console.log("không ghi sổ: chưa có renders/final.mp4"); process.exit(1); }
  const hist = JSON.parse(readFileSync(HIST, "utf8")).filter((h) => h.tap !== slug);
  const row = { tap: slug, ngay: new Date().toISOString().slice(0, 10) };
  for (const f of FIELDS) row[f] = story[f];
  row.chu_de = story.chu_de; row.format = story.format;
  row.chan = story.seo?.chan;
  if (story.series) { row.series = story.series.ten; row.phan = story.series.phan; row.tong = story.series.tong; }
  hist.push(row);
  writeFileSync(HIST, JSON.stringify(hist, null, 1) + "\n");
  console.log("đã ghi " + HIST);
}
process.exit(err.length ? 1 : 0);
