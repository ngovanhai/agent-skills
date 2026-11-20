// Tìm từ khoá tiêu đề cho một tập: gợi ý tìm kiếm của YouTube (người ta gõ gì) + video đang lên cùng chủ đề (ăn theo được gì).
//   node tieu-de.mjs <tap> "<từ khoá 1>" "<từ khoá 2>" … [--top 15] [--ngay 90]
// Ra: <tap>/work/tieu-de.md (đọc rồi chọn tiêu đề, ghi story.seo.tu_khoa + mục "## Tiêu đề" trong y-tuong.md).
// Gợi ý: mỗi từ khoá gốc lấy gợi ý của chính nó + gợi ý khi thêm chữ đầu (a–z bỏ bớt) và các đuôi hay gõ ("là gì", "như thế nào"…).
// Video: yt-dlp "ytsearch" + "ytsearchdate" (cần uvx), lấy view, ngày đăng, kênh; xếp theo view/ngày để thấy video đang nổi.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf("--" + k); return i >= 0 ? argv[i + 1] : d; };
const pos = argv.filter((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
if (pos.length < 2) { console.error('dùng: node tieu-de.mjs <tap> "<từ khoá>" ["<từ khoá 2>" …] [--top 15] [--ngay 90]'); process.exit(1); }
const [tapArg, ...seeds] = pos;
const TAP = resolve(tapArg), TOP = +opt("top", 15), NGAY = +opt("ngay", 90);

async function suggest(q) {
  const u = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=vi&gl=VN&q=${encodeURIComponent(q)}`;
  try { const r = await fetch(u); const j = JSON.parse(await r.text()); return j[1] || []; } catch { return []; }
}
const DUOI = ["", " là gì", " như thế nào", " tại sao", " có nên", " kinh nghiệm", " thật", " bao nhiêu"];
const CHU = "abcdghklmnpstv".split("");

function search(q, moi = false) {
  const r = spawnSync("uvx", ["yt-dlp", `ytsearch${moi ? "date" : ""}${TOP}:${q}`, "--flat-playlist", "--extractor-args", "youtube:lang=vi", "--print", "%(view_count)s\t%(duration)s\t%(channel)s\t%(id)s\t%(title)s"],
    { encoding: "utf8", env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  return (r.stdout || "").trim().split("\n").filter(Boolean).map((l) => {
    const [v, d, ch, id, ...t] = l.split("\t");
    return { view: +v || 0, dur: +d || 0, ch, id, title: t.join("\t") };
  });
}
// ngày đăng: flat-playlist không có, lấy riêng cho top vài video
function upload(id) {
  const r = spawnSync("uvx", ["yt-dlp", "--skip-download", "--print", "%(upload_date)s", `https://www.youtube.com/watch?v=${id}`],
    { encoding: "utf8" });
  const s = (r.stdout || "").trim();
  return /^\d{8}$/.test(s) ? new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}`) : null;
}

const out = [`# Từ khoá tiêu đề — ${new Date().toISOString().slice(0, 10)}`, "", `Từ khoá gốc: ${seeds.join(", ")}`, ""];
const all = new Map();
for (const s of seeds) {
  const got = new Set();
  for (const d of DUOI) for (const x of await suggest(s + d)) got.add(x);
  for (const c of CHU) for (const x of await suggest(`${s} ${c}`)) got.add(x);
  out.push(`## Gợi ý tìm kiếm: "${s}" (${got.size})`, "");
  for (const x of got) { out.push(`- ${x}`); all.set(x, (all.get(x) || 0) + 1); }
  out.push("");
}

const now = Date.now();
for (const s of seeds) {
  // video nổi lâu (xếp theo độ liên quan) + video mới đăng (ytsearchdate) để bắt cái đang lên
  const seen = new Set(), vids = [];
  for (const v of [...search(s), ...search(s, true)]) if (v.dur >= 60 && !seen.has(v.id)) { seen.add(v.id); vids.push(v); }
  for (const v of vids) { const d = upload(v.id); v.ngay = d ? Math.max(1, Math.round((now - d) / 864e5)) : null; v.toc = v.ngay ? Math.round(v.view / v.ngay) : 0; }
  vids.sort((a, b) => b.toc - a.toc || b.view - a.view);
  out.push(`## Video trên YouTube: "${s}" (xếp theo view/ngày; ★ = đăng trong ${NGAY} ngày)`, "", "| view | view/ngày | ngày | phút | kênh | tiêu đề |", "|---|---|---|---|---|---|");
  for (const v of vids) out.push(`| ${v.view.toLocaleString("vi")} | ${v.toc ? v.toc.toLocaleString("vi") : "?"} | ${v.ngay ?? "?"}${v.ngay && v.ngay <= NGAY ? " ★" : ""} | ${Math.round(v.dur / 60)} | ${v.ch} | ${v.title} |`);
  out.push("");
}
out.push("## Việc tiếp theo", "",
  "1. Chọn **từ khoá chính**: cụm có trong gợi ý tìm kiếm, khớp chuyện của tập (ghi `story.seo.tu_khoa`).",
  "2. Xem video ★ có view/ngày cao: họ dùng cụm từ nào → được dùng cùng cụm đó (ăn theo), không chép nguyên tiêu đề.",
  "3. Viết 5 tiêu đề, từ khoá chính trong 40 ký tự đầu, ≤60 ký tự, chọn 1; các cụm gợi ý còn lại đưa vào tags và 2 dòng đầu mô tả.");
mkdirSync(join(TAP, "work"), { recursive: true });
writeFileSync(join(TAP, "work/tieu-de.md"), out.join("\n") + "\n");
console.log(`tieu-de: ${all.size} gợi ý, ${seeds.length} lượt tìm video → ${join(TAP, "work/tieu-de.md")}`);
