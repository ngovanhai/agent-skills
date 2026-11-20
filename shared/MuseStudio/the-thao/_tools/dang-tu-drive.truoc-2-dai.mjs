// Hàng chờ đăng của kênh Tèo Thể Thao: video làm xong nằm trên Drive (G:/My Drive/TeoTheThao/<tập>/),
// mỗi ngày job teo-tt-dang-bai lấy 1 tập dài + 3 Short ra đăng (hẹn giờ công khai, người dùng chọn 2026-10-27).
//   node dang-tu-drive.mjs danh-sach                 xem hàng chờ
//   node dang-tu-drive.mjs chon [--ngay YYYY-MM-DD]  chọn video của ngày, chép về the-thao/_dang/<id>/ (FoxProfile chỉ tải file trong the-thao), in kế hoạch JSON
//   node dang-tu-drive.mjs xong <id> <link> "<YYYY-MM-DD HH:MM>"   ghi đã hẹn giờ vào da-dang.json, xoá bản chép tạm
// Luật chọn:
//   - Tập dài: tập cũ nhất chưa đăng; bỏ qua nếu ngày đó đã có tập dài hẹn sẵn. Giờ 19:00.
//   - Short: tối đa 3, ưu tiên Short có tập dài đã đăng TRƯỚC ngày đó (để ô "video liên quan"/link trỏ tới video đã công khai);
//     thiếu thì lấy Short của chính tập dài hôm đó, xếp sau 19:00. Giờ: 11:30, 15:30, 21:30.
import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync, readFileSync, writeFileSync } from "fs";
import { join, basename } from "path";
import { createHash } from "crypto";

const DRIVE = process.env.TEO_TT_DRIVE_DIR || "G:/My Drive/TeoTheThao";
const ROOT = "C:/Users/anhha/MuseStudio/the-thao";
const DB = join(ROOT, "_tools/da-dang.json");
const STAGE = join(ROOT, "_dang");
const GIO_DAI = "19:00", GIO_SHORT = ["11:30", "15:30", "21:30"];

const db = () => (existsSync(DB) ? JSON.parse(readFileSync(DB, "utf8")) : []);
const sha = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const rd = (f) => (existsSync(f) ? readFileSync(f, "utf8").trim() : "");
const sec = (raw, name) => { const m = raw.match(new RegExp(`${name}:\\s*\\n([\\s\\S]*?)(?:\\n\\s*\\n[A-ZÀ-Ỹ ]+:|$)`)); return m ? m[1].trim() : ""; };

function hangCho() {
  if (!existsSync(DRIVE)) { console.error(`không thấy ${DRIVE} — mở Google Drive for desktop`); process.exit(2); }
  const done = new Set(db().map((x) => x.id));
  const items = [];
  for (const tap of readdirSync(DRIVE).filter((n) => /^tap-\d+/.test(n)).sort()) {
    const d = join(DRIVE, tap);
    const mp4 = join(d, `${tap}.mp4`);
    if (existsSync(mp4)) items.push({ id: tap, loai: "dai", tap, mp4, thumb: join(d, "thumbnail.png"),
      title: rd(join(d, "tieu-de.txt")), desc: rd(join(d, "mo-ta.txt")), tags: rd(join(d, "tags.txt")), binh_luan: rd(join(d, "binh-luan.txt")), da: done.has(tap) });
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
  for (const x of it) console.log(`${x.da ? "đã " : "chờ"}  ${x.loai.padEnd(5)} ${x.id}  ${x.title}`);
  console.log(`\nchờ: ${it.filter((x) => !x.da && x.loai === "dai").length} tập dài, ${it.filter((x) => !x.da && x.loai === "short").length} Short · đã đăng/hẹn: ${list.length}`);
} else if (cmd === "chon") {
  const i = process.argv.indexOf("--ngay"), ngay = i > 0 ? process.argv[i + 1] : today();
  const list = db(), it = hangCho().filter((x) => !x.da);
  const dangDai = (tap) => list.find((x) => x.id === tap);
  const plan = [];
  const coDaiHomNay = list.some((x) => x.loai === "dai" && x.gio.startsWith(ngay));
  const dai = coDaiHomNay ? null : it.find((x) => x.loai === "dai");
  if (dai) plan.push({ ...dai, gio: `${ngay} ${GIO_DAI}` });
  const shortTruoc = it.filter((x) => x.loai === "short" && dangDai(x.tap) && dangDai(x.tap).gio.slice(0, 10) < ngay);
  const shortCungNgay = it.filter((x) => x.loai === "short" && ((dai && x.tap === dai.tap) || (dangDai(x.tap) && dangDai(x.tap).gio.slice(0, 10) === ngay)));
  const slots = [...GIO_SHORT];
  for (const s of shortTruoc.slice(0, 3)) plan.push({ ...s, gio: `${ngay} ${slots.shift()}`, link_dai: dangDai(s.tap).link });
  for (const s of shortCungNgay) { // chỉ được xếp sau giờ tập dài
    const g = slots.find((x) => x > GIO_DAI); if (!g || plan.filter((p) => p.loai === "short").length >= 3) break;
    slots.splice(slots.indexOf(g), 1);
    plan.push({ ...s, gio: `${ngay} ${g}`, link_dai: dangDai(s.tap)?.link || "(link tập dài hôm nay)" });
  }
  for (const p of plan) { // chép tạm về the-thao/_dang
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
} else if (cmd === "xong") {
  const [, , , id, link, gio] = process.argv;
  if (!id || !link || !gio) { console.error('dùng: xong <id> <link> "YYYY-MM-DD HH:MM"'); process.exit(1); }
  const list = db();
  if (list.some((x) => x.id === id)) { console.error(`${id} đã có trong da-dang.json`); process.exit(1); }
  list.push({ id, loai: id.includes("/") ? "short" : "dai", link, gio, ghi: new Date().toISOString() });
  writeFileSync(DB, JSON.stringify(list, null, 1) + "\n");
  rmSync(join(STAGE, id.replace("/", "__")), { recursive: true, force: true });
  console.log(`ghi ${id} → ${gio} ${link}; đã xoá bản chép tạm`);
} else {
  console.error("lệnh: danh-sach | chon [--ngay YYYY-MM-DD] | xong <id> <link> <gio>"); process.exit(1);
}
