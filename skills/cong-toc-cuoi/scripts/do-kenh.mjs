// Dò kênh nhiều view để lấy công thức ý tưởng (SKILL bước 0, "Nguồn ý").
//   node do-kenh.mjs                 đo mọi kênh "theo": true trong data/kenh-tham-khao.json
//   node do-kenh.mjs --tat-ca        đo cả kênh "theo": false
//   node do-kenh.mjs --tim           tìm kênh mới theo tu_khoa_tim (+ --tu "<từ khoá>" thêm)
//   node do-kenh.mjs --kenh <url>    đo thêm một kênh lạ
//   [--so 40] số video gần nhất mỗi kênh, [--top 8] số video nhiều view in ra
// Ra: $HOME/MuseStudio/cong-toc-cuoi/_tools/do-kenh-<ngày>.md
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const SKILL = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUTDIR = (process.env.MUSE_ROOT || (await import("node:os")).homedir() + "/MuseStudio") + "/cong-toc-cuoi/_tools";
const argv = process.argv.slice(2);
const has = (k) => argv.includes("--" + k);
const opt = (k, d) => { const i = argv.indexOf("--" + k); return i >= 0 ? argv[i + 1] : d; };
const all = (k) => argv.flatMap((a, i) => (a === "--" + k ? [argv[i + 1]] : []));
const SO = +opt("so", 40), TOP = +opt("top", 8);
const cfg = JSON.parse(readFileSync(join(SKILL, "data/kenh-tham-khao.json"), "utf8"));

function ytdlp(args) {
  const env = { ...process.env, PYTHONIOENCODING: "utf-8" };
  let r = spawnSync("uvx", ["yt-dlp", ...args], { encoding: "utf8", env, maxBuffer: 64 << 20 });
  if (r.status !== 0 && !r.stdout) r = spawnSync("python", ["-m", "yt_dlp", ...args], { encoding: "utf8", env, maxBuffer: 64 << 20 });
  return (r.stdout || "").trim().split("\n").filter(Boolean);
}
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : 0; };
const fmt = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1).replace(".0", "") + " tr" : n >= 1e3 ? Math.round(n / 1e3) + "k" : String(n));

function doKenh(url) {
  const rows = ytdlp(["--flat-playlist", "--playlist-end", String(SO), "--print", "%(view_count)s\t%(duration)s\t%(title)s", url.replace(/\/$/, "") + "/videos"])
    .map((l) => { const [v, d, ...t] = l.split("\t"); return { v: +v || 0, d: +d || 0, t: t.join("\t") }; })
    .filter((x) => x.d >= 60);
  return { n: rows.length, med: med(rows.map((x) => x.v)), phut: Math.round(med(rows.map((x) => x.d)) / 60), top: [...rows].sort((a, b) => b.v - a.v).slice(0, TOP) };
}

const day = new Date().toISOString().slice(0, 10);
const out = [`# Dò kênh — ${day}`, "", `Trung vị view của ${SO} video dài gần nhất mỗi kênh (bỏ video dưới 1 phút).`, ""];
const ds = [...cfg.kenh.filter((k) => has("tat-ca") || k.theo), ...all("kenh").map((u) => ({ ten: u, url: u, nuoc: "?", cong_thuc: "(mới)" }))];
const kq = [];
for (const k of ds) { const r = doKenh(k.url); kq.push({ ...k, ...r }); console.log(`${k.ten}: trung vị ${fmt(r.med)} (${r.n} video)`); }
kq.sort((a, b) => b.med - a.med);
out.push("| Kênh | Nước | Trung vị | Dài | Công thức |", "|---|---|---|---|---|");
for (const k of kq) out.push(`| ${k.ten} | ${k.nuoc} | ${fmt(k.med)} | ${k.phut} phút | ${k.cong_thuc} |`);
out.push("");
for (const k of kq) {
  out.push(`## ${k.ten} (trung vị ${fmt(k.med)})`, "");
  for (const v of k.top) out.push(`- ${fmt(v.v)} · ${Math.round(v.d / 60)}′ · ${v.t}${v.v >= 3 * k.med ? " **← gấp 3 trung vị**" : ""}`);
  out.push("");
}

if (has("tim")) {
  const biet = new Set(cfg.kenh.map((k) => k.url.replace(/\/$/, "")));
  const gom = new Map();
  for (const q of [...cfg.tu_khoa_tim, ...all("tu")]) {
    for (const l of ytdlp(["--flat-playlist", "--print", "%(view_count)s\t%(duration)s\t%(channel)s\t%(channel_url)s\t%(title)s", `ytsearch25:${q}`])) {
      const [v, d, ch, cu, ...t] = l.split("\t");
      if (!(+v >= 200000) || !(+d >= 120) || !cu || cu === "NA" || biet.has(cu)) continue;
      const g = gom.get(cu) || { ch, cu, n: 0, v: 0, vd: [] };
      g.n++; g.v += +v; if (g.vd.length < 3) g.vd.push(`${fmt(+v)} · ${t.join(" ")}`); gom.set(cu, g);
    }
  }
  const moi = [...gom.values()].sort((a, b) => b.n - a.n || b.v - a.v).slice(0, 25);
  out.push("## Kênh mới tìm được (video ≥200k, dài ≥2 phút, chưa có trong danh sách)", "", "Đo kỹ bằng `--kenh <url>`; hợp chất kênh thì thêm vào data/kenh-tham-khao.json.", "");
  for (const g of moi) { out.push(`- **${g.ch}** (${g.n} video khớp) ${g.cu}`); for (const x of g.vd) out.push(`  - ${x}`); }
  out.push("");
}

out.push("## Biến tấu (SKILL bước 0)", "",
  "1. Với mỗi video **gấp 3 trung vị**: gọi tên công thức (thang cấp bậc, đạo lý dạy dỗ, câu hỏi tiền vô lý, ngụ ngôn hai người, châm biếm không lời, phân tích một nỗi sợ tiền…).",
  "2. Chuyển công thức thành **đời của Bạn**: ngôi Bạn, một chặng một nền, có khúc tệ nhất cho tóc rụng. Không chép tiêu đề, không chép chuyện.",
  "3. Ghi ý vào kho với cột `Học từ` (tên kênh + video), kiểu kể `lật` hoặc `thẳng`, chấm điểm như mọi ý.");
mkdirSync(OUTDIR, { recursive: true });
const f = join(OUTDIR, `do-kenh-${day}.md`);
writeFileSync(f, out.join("\n") + "\n");
console.log("→ " + f);
