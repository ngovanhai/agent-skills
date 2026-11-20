// Chụp một khung cho mỗi câu (ở 70% câu, tối đa +4 s) bằng Godot movie maker, ghép thành các tờ 4×3 để soi.
//   node soi.mjs <tap> [--chi k10,k11] [--tile 4x3] [--dt 0.7]
import { readFileSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf("--" + k); return i >= 0 ? argv[i + 1] : d; };
const TAP = resolve(argv[0]), G = join(TAP, "godot"), W = join(TAP, "work", "soi");
const GODOT = "C:/tool/Godot/Godot_v4.7.2-stable_win64_console.exe";
const chi = opt("chi", "") ? opt("chi").split(",") : null;
const frac = +opt("dt", 0.7);
const tl = JSON.parse(readFileSync(join(G, "timeline.json"), "utf8"));
rmSync(W, { recursive: true, force: true });
mkdirSync(W, { recursive: true });
const shots = tl.cau.filter((c) => !chi || chi.some((k) => c.id.startsWith(k))).map((c) => ({ id: c.id, t: c.t0 + Math.min(c.dur * frac, 4.0) }));
for (const s of shots) {
  const out = join(W, `${s.id}_.png`);
  spawnSync(GODOT, ["--path", G, "--position", "-10000,-10000", "--write-movie", out, "--fixed-fps", "30", "--resolution", "960x540", "--",
    `--from=${s.t.toFixed(3)}`, `--to=${(s.t + 0.12).toFixed(3)}`], { stdio: "ignore" });
}
const pngs = readdirSync(W).filter((f) => f.endsWith(".png")).sort();
// mỗi câu lấy khung cuối cùng của nó
const last = new Map();
for (const f of pngs) last.set(f.split("_")[0], f);
const files = [...last.values()];
const [cx, cy] = opt("tile", "4x3").split("x").map(Number);
const per = cx * cy;
for (let p = 0; p * per < files.length; p++) {
  const part = files.slice(p * per, (p + 1) * per);
  const inputs = part.flatMap((f) => ["-i", join(W, f)]);
  const lay = part.map((_, i) => `${(i % cx) * 960}_${Math.floor(i / cx) * 540}`).join("|");
  const sc = part.map((_, i) => `[${i}:v]scale=960:540[s${i}]`).join(";");
  const fc = part.length > 1 ? `${sc};${part.map((_, i) => `[s${i}]`).join("")}xstack=inputs=${part.length}:layout=${lay}:fill=white,scale=1920:-1` : "scale=1920:-1";
  spawnSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", fc, "-frames:v", "1", join(TAP, "work", `soi-${String(p + 1).padStart(2, "0")}.jpg`)], { stdio: "inherit" });
  console.log(`soi-${String(p + 1).padStart(2, "0")}.jpg: ${part.map((f) => f.split("_")[0]).join(" ")}`);
}
