// Đẩy gói đăng của tập lên Google Drive (ứng dụng Google Drive for desktop, ổ G:) rồi — nếu có --xoa — xoá video nặng trong máy.
//   node <SKILL>/scripts/drive-sync.mjs <thư mục tập> [<tập 2> …] [--xoa]
// Chép mọi file trong <tập>/youtube/ (kể cả youtube/shorts/) sang <DRIVE_ROOT>/<slug>/ giữ nguyên thư mục con,
// ghi qua file .part rồi đổi tên (Drive không đồng bộ file dở), đọc lại bản trên Drive so SHA-256 với bản gốc.
// --xoa (người dùng yêu cầu 2026-10-27): CHỈ khi mọi file đã khớp SHA-256 trên Drive mới xoá trong máy:
//   youtube/**/*.mp4, renders/*.mp4, shorts/*/renders/*.mp4, work/*.avi, work/*.wav.
// Giữ: project godot (giọng, mặt, nhân vật — cần để cắt Short), kịch bản, thumbnail, file chữ (FoxProfile chỉ tải file trong the-thao).
// Gọi SAU khi đã tải video lên YouTube (tải lên đọc file mp4 trong máy). Ghi youtube/DA-LEN-DRIVE.txt để job khác biết.
import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, renameSync, rmSync, readFileSync, writeFileSync } from "fs";
import { join, resolve, basename, relative, dirname } from "path";
import { createHash } from "crypto";

const DRIVE_ROOT = process.env.TEO_TT_DRIVE_DIR || "G:/My Drive/TeoTheThao";
const args = process.argv.slice(2);
const XOA = args.includes("--xoa");
const taps = args.filter((a) => !a.startsWith("--")).map((a) => resolve(a));
if (!taps.length) { console.error("dùng: drive-sync.mjs <thư mục tập> […] [--xoa]"); process.exit(1); }
if (!existsSync(dirname(DRIVE_ROOT))) { console.error(`không thấy ${dirname(DRIVE_ROOT)} — mở ứng dụng Google Drive, đăng nhập rồi chạy lại`); process.exit(1); }

const sha = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const mb = (n) => (n / 1048576).toFixed(1) + " MB";
let fail = 0;

for (const tap of taps) {
  const slug = basename(tap), src = join(tap, "youtube"), dest = join(DRIVE_ROOT, slug);
  if (!existsSync(src)) { console.error(`${slug}: thiếu ${src} — đóng gói trước`); fail++; continue; }
  const files = walk(src).filter((f) => !f.endsWith(".part") && basename(f) !== "DA-LEN-DRIVE.txt");
  const log = [];
  let ok = true, copied = 0;
  for (const a of files) {
    const rel = relative(src, a), b = join(dest, rel), ha = sha(a);
    mkdirSync(dirname(b), { recursive: true });
    if (!(existsSync(b) && statSync(b).size === statSync(a).size && sha(b) === ha)) {
      copyFileSync(a, b + ".part");
      rmSync(b, { force: true });
      renameSync(b + ".part", b);
      copied++;
    }
    const hb = sha(b);
    if (hb !== ha) { ok = false; console.error(`${slug}: ${rel} trên Drive KHÔNG khớp SHA-256`); }
    log.push(`${rel}\t${statSync(a).size}\t${ha}`);
  }
  console.log(`${slug}: ${files.length} file → ${dest} (chép mới ${copied})${ok ? ", khớp SHA-256" : ""}`);
  if (!ok) { fail++; continue; }
  writeFileSync(join(src, "DA-LEN-DRIVE.txt"), `Đã lên Drive ${new Date().toISOString()} → ${dest}\n` + log.join("\n") + "\n");
  if (!XOA) continue;
  // xoá video nặng trong máy (đã có bản khớp trên Drive)
  const del = [
    ...walk(src).filter((f) => f.endsWith(".mp4")),
    ...(existsSync(join(tap, "renders")) ? readdirSync(join(tap, "renders")).filter((n) => n.endsWith(".mp4")).map((n) => join(tap, "renders", n)) : []),
    ...(existsSync(join(tap, "shorts")) ? readdirSync(join(tap, "shorts")).flatMap((s) => { const r = join(tap, "shorts", s, "renders"); return existsSync(r) ? readdirSync(r).filter((n) => n.endsWith(".mp4")).map((n) => join(r, n)) : []; }) : []),
    ...(existsSync(join(tap, "work")) ? readdirSync(join(tap, "work")).filter((n) => /\.(avi|wav)$/i.test(n)).map((n) => join(tap, "work", n)) : []),
  ];
  let freed = 0;
  for (const f of del) { freed += statSync(f).size; rmSync(f, { force: true }); }
  console.log(`${slug}: đã xoá ${del.length} file trong máy, giải phóng ${mb(freed)}`);
}
process.exit(fail ? 1 : 0);
