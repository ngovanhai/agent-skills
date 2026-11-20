// Hàng chờ đăng của kênh Tèo Thể Thao: video làm xong nằm trên Drive (G:/My Drive/TeoTheThao/<tập>/),
// mỗi ngày job teo-tt-dang-bai lấy 2 tập dài + 6 Short ra đăng (hẹn giờ công khai; 2 dài + 6 Short/ngày từ 2026-10-28).
//   node dang-tu-drive.mjs danh-sach                 xem hàng chờ
//   node dang-tu-drive.mjs chon [--ngay YYYY-MM-DD] [--thu]  chọn video của ngày (--thu: chỉ in, không chép), chép về the-thao/_dang/<id>/ (FoxProfile chỉ tải file trong the-thao), in kế hoạch JSON
//   node dang-tu-drive.mjs chon-mot <tập>            đăng gấp MỘT tập dài theo chủ đề nóng ngay trong ngày (job video-dai gọi sau khi đẩy Drive):
//                                                    giờ: nóng 07:00 (≥20 phút, trễ thì giờ tròn kế tiếp trước 19:00) / kể chuyện 19:00 (≥1 giờ); không còn thì in "de-mai" (job 05:30 lo)
//   node dang-tu-drive.mjs xong <id> <link> "<YYYY-MM-DD HH:MM>"   ghi đã hẹn giờ vào da-dang.json, xoá bản chép tạm
// Luật chọn:
//   - Tập dài: tối đa 2/ngày. 07:00 = tin nóng do job teo-tt-tin-sang (04:00) tự làm và chon-mot; 19:00 = kể chuyện (không UU-TIEN),
//     `chon` (job 05:30) chỉ xếp khe 19:00 bằng tập kể chuyện cũ nhất (người dùng chốt 2026-11-05).
//   - Short: tối đa 6, ưu tiên Short có tập dài đã đăng TRƯỚC ngày đó (để link trỏ tới video đã công khai);
//     thiếu thì lấy Short của tập dài cùng ngày, chỉ xếp sau giờ tập dài đó. Giờ: 09:00, 11:00, 14:00, 16:00, 20:30, 22:00.
import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync, readFileSync, writeFileSync } from "fs";
import { join, basename } from "path";
import { createHash } from "crypto";
import { spawnSync } from "child_process";

const DRIVE = process.env.TEO_TT_DRIVE_DIR || "G:/My Drive/TeoTheThao";
const ROOT = "C:/Users/anhha/MuseStudio/the-thao";
const DB = join(ROOT, "_tools/da-dang.json");
const STAGE = join(ROOT, "_dang");
const GIO_DAI = ["07:00", "19:00"], GIO_SHORT = ["09:00", "11:00", "14:00", "16:00", "20:30", "22:00"], MAX_SHORT = 0; // người dùng tắt đăng Short 2026-11-03 (trước: 6)

const db = () => (existsSync(DB) ? JSON.parse(readFileSync(DB, "utf8")) : []);
// sổ cái chung 2 kênh (MuseStudio/_so-cai): tập nào sổ ghi đã tải/hẹn cũng coi là đã đăng, chặn tải trùng
const SO_CAI = "C:/Users/anhha/MuseStudio/_so-cai/so-cai.mjs";
const soCai = (...a) => existsSync(SO_CAI) ? spawnSync(process.execPath, [SO_CAI, ...a], { encoding: "utf8" }) : null;
const soCaiDa = () => { try { return new Set(JSON.parse(soCai("da-dang", "tt")?.stdout || "{}").da || []); } catch { return new Set(); } };
const sha = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const rd = (f) => (existsSync(f) ? readFileSync(f, "utf8").trim() : "");
const sec = (raw, name) => { const m = raw.match(new RegExp(`${name}:\\s*\\n([\\s\\S]*?)(?:\\n\\s*\\n[A-ZÀ-Ỹ ]+:|$)`)); return m ? m[1].trim() : ""; };

// _tools/ep-19h.txt: tập nóng cũ người dùng cho đăng khe 19:00 như kể chuyện (bỏ qua UU-TIEN.txt)
const EP19 = (() => { try { return readFileSync(join(ROOT, "_tools/ep-19h.txt"), "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#")); } catch { return []; } })();
function hangCho() {
  if (!existsSync(DRIVE)) { console.error(`không thấy ${DRIVE} — mở Google Drive for desktop`); process.exit(2); }
  const done = new Set([...db().map((x) => x.id), ...soCaiDa()]);
  const items = [];
  for (const tap of readdirSync(DRIVE).filter((n) => /^tap-\d+/.test(n)).sort()) {
    const d = join(DRIVE, tap);
    const mp4 = join(d, `${tap}.mp4`);
    if (existsSync(mp4)) items.push({ id: tap, loai: "dai", tap, mp4, thumb: join(d, "thumbnail.png"),
      title: rd(join(d, "tieu-de.txt")), desc: rd(join(d, "mo-ta.txt")), tags: rd(join(d, "tags.txt")), binh_luan: rd(join(d, "binh-luan.txt")),
      uu_tien: EP19.some((e) => tap.startsWith(e)) ? "" : rd(join(d, "UU-TIEN.txt")), ep19: EP19.some((e) => tap.startsWith(e)), da: done.has(tap) });
    const sd = join(d, "shorts");
    if (!existsSync(sd)) continue;
    for (const f of readdirSync(sd).filter((n) => n.endsWith(".mp4")).sort()) {
      const id = `${tap}/${f.replace(/\.mp4$/, "")}`, raw = rd(join(sd, f.replace(/\.mp4$/, ".txt")));
      items.push({ id, loai: "short", tap, mp4: join(sd, f), title: sec(raw, "TIÊU ĐỀ"), desc: sec(raw, "MÔ TẢ"), tags: sec(raw, "TAG"), da: done.has(id) });
    }
  }
  return items;
}

const cmd = process.argv[2];
if (cmd === "danh-sach") {
  const it = hangCho(), list = db();
  for (const x of it) console.log(`${x.da ? "đã " : "chờ"}  ${x.loai.padEnd(5)} ${x.id}  ${x.title}${x.loai === "dai" ? (x.uu_tien ? "  [NÓNG 07:00 · " + x.uu_tien + "]" : "  [KỂ CHUYỆN 19:00]") : ""}`);
  console.log(`\nchờ: ${it.filter((x) => !x.da && x.loai === "dai").length} tập dài (nóng ${it.filter((x) => !x.da && x.loai === "dai" && x.uu_tien).length}, kể chuyện ${it.filter((x) => !x.da && x.loai === "dai" && !x.uu_tien).length}) · đã đăng/hẹn: ${list.length}`);
} else if (cmd === "chon") {
  // job đăng chạy 20:00 (người dùng chốt 2026-11-05) hẹn khe 19:00 NGÀY MAI: không có --ngay thì sau 12:00 mặc định là ngày mai
  const mai = () => { const d = new Date(); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const i = process.argv.indexOf("--ngay"), ngay = i > 0 ? process.argv[i + 1] : (new Date().getHours() >= 12 ? mai() : today());
  const list = db(), it = hangCho().filter((x) => !x.da);
  const dangDai = (tap) => list.find((x) => x.id === tap);
  const plan = [];
  const daiHomNay = list.filter((x) => x.loai === "dai" && x.gio.startsWith(ngay));
  const gioDai = GIO_DAI.filter((g) => !daiHomNay.some((x) => x.gio.slice(11, 16) === g)).slice(0, Math.max(0, GIO_DAI.length - daiHomNay.length));
  // người dùng chốt 2026-11-05: 07:00 = tin nóng (tập có UU-TIEN.txt), 19:00 = kể chuyện (không UU-TIEN: lịch sử CLB, cuộc đời, ít người biết).
  // Khe nào thiếu đúng loại thì lấy loại kia (không để trống khe).
  const han = (x) => (x.uu_tien.match(/Hạn chót đăng:\s*(\d{4}-\d\d-\d\d(?: \d\d:\d\d)?)/) || [, "9999"])[1]; // tin nóng: hạn chót sớm nhất trước
  const nong = it.filter((x) => x.loai === "dai" && x.uu_tien).sort((a, b) => han(a).localeCompare(han(b))), ke = it.filter((x) => x.loai === "dai" && !x.uu_tien).sort((a, b) => (b.ep19 ? 1 : 0) - (a.ep19 ? 1 : 0)); // tin cũ ép 19:00 đăng trước cho đỡ nguội
  // người dùng kéo thả thứ tự trên bảng sổ cái (localhost:4747) → `so-cai thu-tu tt`; tập không có trong danh sách giữ thứ tự trên, xếp sau
  const xep = (() => { try { return JSON.parse(soCai("thu-tu", "tt")?.stdout || "[]"); } catch { return []; } })();
  if (xep.length) { const ix = (x) => { const i = xep.indexOf(x.id); return i < 0 ? 1e9 : i; }; ke.splice(0, ke.length, ...ke.map((x, i) => ({ x, i })).sort((a, b) => ix(a.x) - ix(b.x) || a.i - b.i).map((v) => v.x)); }
  // từ 2026-11-05 (tối): khe 07:00 để riêng cho job teo-tt-tin-sang (04:00 làm tin mới nhất rồi chon-mot) → chon chỉ xếp khe 19:00, chỉ lấy KỂ CHUYỆN
  for (const g of gioDai) {
    if (g === GIO_DAI[0]) continue;
    const d = ke.shift(); if (!d) break;
    plan.push({ ...d, gio: `${ngay} ${g}`, kieu: d.uu_tien ? "nong" : "ke-chuyen" });
  }
  // giờ tập dài của một tập: đã đăng (da-dang.json) hoặc đang xếp trong kế hoạch hôm nay
  const gioCuaDai = (tap) => dangDai(tap)?.gio || plan.find((p) => p.id === tap)?.gio;
  const shortTruoc = it.filter((x) => x.loai === "short" && dangDai(x.tap) && dangDai(x.tap).gio.slice(0, 10) < ngay);
  const shortCungNgay = it.filter((x) => x.loai === "short" && gioCuaDai(x.tap)?.startsWith(ngay));
  const slots = [...GIO_SHORT];
  for (const s of shortTruoc.slice(0, MAX_SHORT)) plan.push({ ...s, gio: `${ngay} ${slots.shift()}`, link_dai: dangDai(s.tap).link });
  for (const s of shortCungNgay) { // chỉ được xếp sau giờ tập dài của nó
    if (plan.filter((p) => p.loai === "short").length >= MAX_SHORT) break;
    const g = slots.find((x) => x > gioCuaDai(s.tap).slice(11, 16)); if (!g) continue;
    slots.splice(slots.indexOf(g), 1);
    plan.push({ ...s, gio: `${ngay} ${g}`, link_dai: dangDai(s.tap)?.link || `(link tập dài ${s.tap} hôm nay)` });
  }
  if (!process.argv.includes("--thu")) for (const p of plan) { // chép tạm về the-thao/_dang
    const dir = join(STAGE, p.id.replace("/", "__")); mkdirSync(dir, { recursive: true });
    for (const k of ["mp4", "thumb"]) {
      if (!p[k] || !existsSync(p[k])) continue;
      const b = join(dir, basename(p[k])); copyFileSync(p[k], b);
      if (sha(b) !== sha(p[k])) { console.error(`chép ${p[k]} lỗi SHA-256`); process.exit(1); }
      p[k] = b.replace(/\\/g, "/");
    }
  }
  console.log(JSON.stringify(plan.map(({ da, ...p }) => p), null, 1));
  if (!plan.length) console.error("hàng chờ trống cho ngày " + ngay);
} else if (cmd === "chon-mot") {
  const tap = process.argv[3];
  const x = hangCho().find((i) => i.id === tap && i.loai === "dai");
  if (!x) { console.error(`không thấy tập dài ${tap} trong hàng chờ`); process.exit(1); }
  if (x.da) { console.error(`${tap} đã đăng/hẹn rồi`); process.exit(1); }
  const now = new Date(), ngay = today(), list = db();
  const taken = new Set(list.filter((i) => i.gio.startsWith(ngay)).map((i) => i.gio.slice(11, 16)));
  const ok = (h, lead) => { const t = new Date(now); t.setHours(h, 0, 0, 0); return t - now >= lead && !taken.has(`${String(h).padStart(2, "0")}:00`); };
  // tin nóng: 07:00 nếu còn ≥20 phút; riêng tập của job tin sáng (UU-TIEN.txt bắt đầu "Tin sáng") trễ thì giờ tròn kế tiếp trước 19:00 để tin vẫn lên trong ngày.
  // kể chuyện: chỉ khe 19:00 hôm nay (còn ≥1 giờ), không thì để job 05:30 ngày sau.
  const h = x.uu_tien ? (/^Tin sáng/i.test(x.uu_tien) ? [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] : [7]).find((h) => ok(h, 20 * 60e3)) : [19].find((h) => ok(h, 3600e3));
  if (h === undefined) { console.log(JSON.stringify({ id: tap, gio: "de-mai" })); process.exit(0); }
  const p = { ...x, gio: `${ngay} ${String(h).padStart(2, "0")}:00` };
  const dir = join(STAGE, p.id); mkdirSync(dir, { recursive: true });
  for (const k of ["mp4", "thumb"]) {
    if (!p[k] || !existsSync(p[k])) continue;
    const b = join(dir, basename(p[k])); copyFileSync(p[k], b);
    if (sha(b) !== sha(p[k])) { console.error(`chép ${p[k]} lỗi SHA-256`); process.exit(1); }
    p[k] = b.replace(/\\/g, "/");
  }
  const { da, ...out } = p; console.log(JSON.stringify(out, null, 1));
} else if (cmd === "xong") {
  const [, , , id, link, gio] = process.argv;
  if (!id || !link || !gio) { console.error('dùng: xong <id> <link> "YYYY-MM-DD HH:MM"'); process.exit(1); }
  const list = db();
  if (list.some((x) => x.id === id)) { console.error(`${id} đã có trong da-dang.json`); process.exit(1); }
  list.push({ id, loai: id.includes("/") ? "short" : "dai", link, gio, ghi: new Date().toISOString() });
  writeFileSync(DB, JSON.stringify(list, null, 1) + "\n");
  rmSync(join(STAGE, id.replace("/", "__")), { recursive: true, force: true });
  console.log(`ghi ${id} → ${gio} ${link}; đã xoá bản chép tạm`);
  const sc = soCai("ghi", "tt", id, "da-hen", "--link", link, "--gio", gio, "--ghi", "dang-tu-drive xong");
  console.log(sc ? (sc.status === 0 ? "sổ cái: " + sc.stdout.trim() : "CẢNH BÁO sổ cái không ghi được: " + (sc.stderr || sc.stdout).trim()) : "(không thấy sổ cái)");
} else {
  console.error("lệnh: danh-sach | chon [--ngay YYYY-MM-DD] [--thu] | chon-mot <tập> | xong <id> <link> <gio>"); process.exit(1);
}
