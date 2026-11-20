// Giọng đọc cho tập dựng bằng Godot: <tap>/godot/loi.txt → <tap>/godot/voice/<id>.wav + voice.json (độ dài thật từng câu)
//   node <SKILL>/scripts/gd-voice.mjs <tap> [--voice Lóng] [--voice-nu "Ngọc Huyền"] [--dry] [--no-gpu]
// Giọng phụ: các id liệt kê trong <tap>/godot/story.json "giong_nu" (thoại nhân vật nữ) đọc bằng --voice-nu, còn lại --voice.
// loi.txt: mỗi câu đọc là một dòng "[id] lời đọc" (id: chữ thường/số/gạch, không trùng). Mọi dòng khác (tiêu đề, ghi chú dựng,
// đánh dấu cảnh…) công cụ này bỏ qua — cấu trúc kịch bản do từng tập tự đặt và tự đọc trong GDScript của tập.
// Có cache: câu nào chữ không đổi và còn wav thì không đọc lại. Chạy trong suất máy: bash kiem-hiep/_tools/slot.sh "<tập> giọng" node …
import { readFileSync, writeFileSync, mkdirSync, existsSync, openSync, readSync, closeSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { spoken, DEFAULT_VOICE } from "../engine/voice.mjs";

const KIT = "C:/Users/anhha/MuseStudio/kit", VIENEU = "C:/Users/anhha/VieNeu-TTS";
const PY_CPU = join(VIENEU, ".venv/Scripts/python.exe"), PY_DML = join(VIENEU, ".venv-dml/Scripts/python.exe");
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf("--" + k); return i >= 0 ? argv[i + 1] : d; };
const die = (m) => { console.error("gd-voice: " + m); process.exit(1); };
const dir = resolve(argv.find((a) => !a.startsWith("--")) || die("thiếu <tap>"));
const STORY = (() => { try { return JSON.parse(readFileSync(join(dir, "godot/story.json"), "utf8")); } catch { return {}; } })();
// Giọng mặc định theo kênh: --voice > story.json "giong" > kênh Tèo Thể Thao (MuseStudio/the-thao) đọc "Hải Đăng" (người dùng chốt 2026-11-03) > Lóng
const KENH_VOICE = /[\\/]MuseStudio[\\/]the-thao[\\/]/i.test(dir) ? "Hải Đăng" : DEFAULT_VOICE;
// tập đã có voice.json thì giữ giọng cũ (không đổi giọng giữa chừng một tập đang làm), trừ khi --voice/story.giong nói khác
const OLD_VOICE = (() => { try { return JSON.parse(readFileSync(join(dir, "godot/voice/voice.json"), "utf8")).voice; } catch { return ""; } })();
const voice = opt("voice", STORY.giong || OLD_VOICE || KENH_VOICE), voiceNu = opt("voice-nu", "Ngọc Huyền");
const NU = new Set(STORY.giong_nu || []);
const vdir = join(dir, "godot/voice"), manFile = join(vdir, "voice.json");

const src = readFileSync(join(dir, "godot/loi.txt"), "utf8").split(/\r?\n/);
const all = [], ids = new Set();
src.forEach((ln, i) => {
  const m = ln.match(/^\s*\[([a-z0-9][a-z0-9-]*)\]\s+(.+)$/);
  if (!m) return;
  if (ids.has(m[1])) die(`dòng ${i + 1}: id "${m[1]}" trùng`);
  ids.add(m[1]);
  const t = spoken(m[2]), w = t.split(" ").length;
  if (w < 6) console.warn(`cảnh báo: [${m[1]}] chỉ ${w} từ — VieNeu dễ đọc vội/méo, nên ≥10 từ`);
  if (/chương\s+(\d|sau|tới|trước)/i.test(t)) console.warn(`cảnh báo: [${m[1]}] nhắc "chương" — luật: không nói Chương X / Chương sau`);
  all.push({ id: m[1], text: t, out: join(vdir, m[1] + ".wav"), voice: NU.has(m[1]) ? voiceNu : voice });
});
if (!all.length) die("loi.txt không có dòng [id] lời đọc nào");
for (const id of NU) if (!ids.has(id)) die(`story.giong_nu có "${id}" nhưng loi.txt không có câu này`);
if (NU.size) console.log(`gd-voice: ${NU.size} câu thoại nữ đọc bằng "${voiceNu}"`);
const old = existsSync(manFile) ? JSON.parse(readFileSync(manFile, "utf8")) : { lines: {} };
const todo = all.filter((l) => !((old.lines[l.id]?.voice || old.voice) === l.voice && old.lines[l.id]?.text === l.text && existsSync(l.out)));
const words = all.reduce((n, l) => n + l.text.split(" ").length, 0), wTodo = todo.reduce((n, l) => n + l.text.split(" ").length, 0);
console.log(`gd-voice: ${all.length} câu · ${words} từ · ước ${(words / 4.1 / 60).toFixed(1)} phút giọng (Lóng ≈ 4,1 từ/giây) · cần đọc ${todo.length} câu (${wTodo} từ)`);
if (argv.includes("--dry")) process.exit(0);

mkdirSync(vdir, { recursive: true });
if (todo.length) {
  if (!existsSync(PY_CPU)) die(`không thấy VieNeu: ${PY_CPU}`);
  for (const l of todo) if (existsSync(l.out)) unlinkSync(l.out); // tts.py bỏ qua file đã có
  const env = { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" };
  let job = "";
  const run = (py, e) => spawnSync(py, [join(KIT, "py/tts.py"), job], { stdio: "inherit", cwd: VIENEU, env: e }).status;
  const gpu = !argv.includes("--no-gpu") && !existsSync(join(KIT, "gpu-off")) && existsSync(PY_DML);
  for (const v of [...new Set(todo.map((l) => l.voice))]) {
  job = join(vdir, "tts-job.json");
  writeFileSync(job, JSON.stringify({ voice: v, temperature: 0.8, lines: todo.filter((l) => l.voice === v).map(({ id, text, out }) => ({ id, text, out })) }, null, 1));
  let st = gpu ? run(PY_DML, { ...env, VIENEU_ORT_PROVIDERS: "DmlExecutionProvider", VIENEU_ORT_GPU_PARTS: "pre,dec,codec" }) : -1;
  if (gpu && st !== 0) console.log("gd-voice: ! GPU lỗi (exit " + st + ") — chạy lại bằng CPU");
  if (st !== 0) st = run(PY_CPU, env);
  if (st !== 0) die("tts.py lỗi (exit " + st + ")");
  }
}
function wavDur(f) {
  const fd = openSync(f, "r"), buf = Buffer.alloc(4096), n = readSync(fd, buf, 0, 4096, 0); closeSync(fd);
  let p = 12, rate = 0;
  while (p + 8 <= n) {
    const id = buf.toString("ascii", p, p + 4), len = buf.readUInt32LE(p + 4);
    if (id === "fmt ") rate = buf.readUInt32LE(p + 16);
    if (id === "data") return rate ? len / rate : die("wav lỗi: " + f);
    p += 8 + len + (len & 1);
  }
  die("wav lỗi: " + f);
}
const man = { voice, lines: {} };
for (const l of all) man.lines[l.id] = { dur: Math.round(wavDur(l.out) * 1000) / 1000, text: l.text, ...(l.voice !== voice ? { voice: l.voice } : {}) };
writeFileSync(manFile, JSON.stringify(man, null, 1));
const tot = Object.values(man.lines).reduce((s, x) => s + x.dur, 0);
console.log(`gd-voice: xong ${all.length} câu, tổng ${(tot / 60).toFixed(1)} phút giọng → ${manFile}`);
