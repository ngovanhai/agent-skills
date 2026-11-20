// Sổ cái video của 2 kênh: Tèo Thể Thao (tt) và Cọng Tóc Cuối (ctc).
// Mỗi tập một bản ghi, trạng thái: dang-lam → dong-goi → cho-dang → da-tai → da-hen → cong-khai, hoặc loi.
//   node so-cai.mjs quet [kenh]          đối chiếu với thư mục tập / Drive / da-dang.json / job-log: thêm tập mới, đẩy trạng thái tiến lên, báo lệch (không lùi, không xoá)
//   node so-cai.mjs ghi <kenh> <slug> <trang_thai> [--id ID|--link URL] [--gio "YYYY-MM-DD HH:MM"] [--loi "..."] [--canh-bao "..."] [--tieu-de "..."] [--ghi "..."]
//   node so-cai.mjs xem [kenh] [--short]  bảng theo tập
//   node so-cai.mjs lich [--ngay 7]       khung 07:00/19:00 của 2 kênh, khung trống, hàng chờ còn đủ tới ngày nào
//   node so-cai.mjs can-xu-ly             lỗi, cảnh báo, quá giờ hẹn chưa công khai, hàng chờ sắp cạn
//   node so-cai.mjs kiem [kenh] [--het]   hỏi oEmbed công khai của YouTube: 200 = công khai, 401/403/404 = chưa (không cần FoxProfile)
//   node so-cai.mjs da-dang <kenh>        JSON {da:[slug], kin:["YYYY-MM-DD HH:MM"]} cho script đăng bài (chặn tải trùng)
//   node so-cai.mjs html                  xuất bang.html
//   node so-cai.mjs serve [--port 4747]   bảng động http://localhost:4747: mỗi lần F5 quét lại, kiểm công khai ≤5 phút/lần, trang tự tải lại mỗi phút
// kenh: tt | teo-the-thao | ctc | cong-toc-cuoi
import { existsSync, readFileSync, writeFileSync, renameSync, readdirSync, openSync, closeSync, unlinkSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const MUSE = "C:/Users/anhha/MuseStudio";
const KENH = {
  "teo-the-thao": { ten: "Tèo Thể Thao", root: `${MUSE}/the-thao`, drive: process.env.TEO_TT_DRIVE_DIR || "G:/My Drive/TeoTheThao" },
  "cong-toc-cuoi": { ten: "Cọng Tóc Cuối", root: `${MUSE}/cong-toc-cuoi`, drive: "G:/My Drive/CongTocCuoi" },
};
const ALIAS = { tt: "teo-the-thao", ctc: "cong-toc-cuoi", "teo-the-thao": "teo-the-thao", "cong-toc-cuoi": "cong-toc-cuoi" };
const TT = ["dang-lam", "dong-goi", "cho-dang", "da-tai", "da-hen", "cong-khai"];
const NHAN = { "dang-lam": "đang làm", "dong-goi": "đóng gói", "cho-dang": "chờ đăng", "da-tai": "đã tải (riêng tư)", "da-hen": "đã hẹn", "cong-khai": "công khai", loi: "LỖI" };
const GIO = ["07:00", "19:00"];
const rank = (s) => TT.indexOf(s); // loi = -1
const ID_RE = /^[A-Za-z0-9_-]{11}$/;

const pad = (n) => String(n).padStart(2, "0");
const ngayStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const luc = (d = new Date()) => `${ngayStr(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
const parseLuc = (s) => { const m = /^(\d{4})-(\d\d)-(\d\d) (\d\d):(\d\d)/.exec(s || ""); return m ? new Date(+m[1], m[2] - 1, +m[3], +m[4], +m[5]) : null; };
const rd = (f) => (existsSync(f) ? readFileSync(f, "utf8").trim() : "");
const soTap = (slug) => +(/^tap-(\d+)/.exec(slug)?.[1] || 0);
const kenhOf = (k) => { const x = ALIAS[k]; if (!x) { console.error(`kênh lạ: ${k} (tt | ctc)`); process.exit(1); } return x; };
const linkOf = (r) => (r.video_id ? (r.loai === "short" ? `https://youtube.com/shorts/${r.video_id}` : `https://youtu.be/${r.video_id}`) : "");
function idTu(s) { // nhận ID hoặc link, trả ID 11 ký tự hoặc null
  if (!s) return null;
  const m = /(?:youtu\.be\/|shorts\/|v=|\/video\/)([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/.exec(s);
  const id = m ? m[1] : s.trim();
  return ID_RE.test(id) ? id : null;
}

// ---------- đọc / ghi sổ (khoá + ghi file tạm rồi đổi tên) ----------
const fileSo = (k) => join(HERE, `${k}.json`);
function docSo(k) {
  const f = fileSo(k);
  if (!existsSync(f)) return { kenh: k, cap_nhat: null, tap: {} };
  return JSON.parse(readFileSync(f, "utf8"));
}
function khoa(k, fn) {
  const lock = fileSo(k) + ".lock";
  const het = Date.now() + 15000;
  for (;;) {
    try { closeSync(openSync(lock, "wx")); break; } catch {
      try { if (Date.now() - statSync(lock).mtimeMs > 60000) { unlinkSync(lock); continue; } } catch {}
      if (Date.now() > het) { console.error(`không lấy được khoá ${lock}`); process.exit(3); }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200);
    }
  }
  try {
    const so = docSo(k);
    const kq = fn(so);
    so.cap_nhat = new Date().toISOString();
    const tmp = fileSo(k) + `.${process.pid}.tmp`;
    writeFileSync(tmp, JSON.stringify(so, null, 1) + "\n");
    renameSync(tmp, fileSo(k));
    return kq;
  } finally { try { unlinkSync(lock); } catch {} }
}
function doiTrangThai(r, moi, ghi) {
  const cu = r.trang_thai;
  r.lich_su = r.lich_su || [];
  r.lich_su.push({ luc: luc(), tu: cu || null, sang: moi, ghi: ghi || "" });
  r.trang_thai = moi;
}

// ---------- quét nguồn hiện có ----------
const ds = (d) => (existsSync(d) ? readdirSync(d) : []);
function quetTT() {
  const { root, drive } = KENH["teo-the-thao"];
  const out = {};
  for (const slug of ds(root).filter((n) => /^tap-\d+/.test(n)).sort()) {
    const y = join(root, slug, "youtube"), dv = join(drive, slug);
    let s = "dang-lam";
    if (existsSync(join(y, `${slug}.mp4`))) s = "dong-goi";
    if (existsSync(join(dv, `${slug}.mp4`)) || existsSync(join(y, "DA-LEN-DRIVE.txt"))) s = "cho-dang";
    out[slug] = { tap: soTap(slug), slug, loai: "dai", trang_thai: s,
      tieu_de: rd(join(y, "tieu-de.txt")) || rd(join(dv, "tieu-de.txt")) || null,
      drive: existsSync(dv) ? dv : null, uu_tien: !!rd(join(dv, "UU-TIEN.txt")) || !!rd(join(y, "UU-TIEN.txt")) };
  }
  const dbf = join(root, "_tools/da-dang.json");
  for (const x of existsSync(dbf) ? JSON.parse(readFileSync(dbf, "utf8")) : []) {
    const r = out[x.id] || (out[x.id] = { tap: soTap(x.id), slug: x.id, loai: x.loai });
    r.loai = x.loai; r.video_id = idTu(x.link); r.gio_hen = x.gio;
    r.trang_thai = /công khai/i.test(String(x.ghi)) ? "cong-khai" : "da-hen";
    if (!r.video_id) r.canh_bao = `link trong da-dang.json không ra ID: ${x.link}`;
  }
  return out;
}
function quetCTC() {
  const { root, drive } = KENH["cong-toc-cuoi"];
  const out = {};
  for (const slug of ds(root).filter((n) => /^tap-\d+/.test(n)).sort()) {
    const y = join(root, slug, "youtube");
    out[slug] = { tap: soTap(slug), slug, loai: "dai",
      trang_thai: existsSync(join(y, `${slug}.mp4`)) ? "cho-dang" : "dang-lam",
      tieu_de: rd(join(y, "tieu-de.txt")) || null, drive: existsSync(join(drive, slug)) ? join(drive, slug) : null };
  }
  // lỗi tải lên trong log job (cũ trước, mới sau)
  const runs = join(root, "_tools/job-runs");
  for (const f of ds(runs).filter((n) => /^dang-.*\.log$/.test(n)).sort()) {
    const ngay = /dang-(\d{4}-\d\d-\d\d)_(\d\d)(\d\d)/.exec(f);
    const dong = readFileSync(join(runs, f), "utf8").split(/\r?\n/);
    dong.forEach((l, i) => {
      const m = /LỖI (tap-\d+[a-z0-9-]*), dừng/.exec(l);
      if (!m || !out[m[1]]) return;
      const tu = dong.slice(0, i).findLastIndex((x) => /LOI|ERR/.test(x));
      const ly = (tu >= 0 && i - tu <= 8 ? dong.slice(tu, i) : [l]).map((x) => x.replace(/^\d\d:\d\d:\d\d\s+/, "").trim()).join(" ").replace(/\s+/g, " ");
      out[m[1]].loi_moi = { luc: ngay ? `${ngay[1]} ${ngay[2]}:${ngay[3]}` : "", loi: ly.slice(0, 300) };
    });
  }
  // job-log: dòng sau đè dòng trước
  for (const l of rd(join(root, "_tools/job-log.md")).split(/\r?\n/)) {
    const m = /^- (\d{4}-\d\d-\d\d \d\d:\d\d) (tap-\d+[a-z0-9-]*) → (https?:\/\/\S+) · (.*)$/.exec(l);
    if (!m) continue;
    const [, khi, slug, link, rest] = m;
    const r = out[slug] || (out[slug] = { tap: soTap(slug), slug, loai: "dai" });
    r.video_id = idTu(link) || r.video_id;
    const h = /hẹn công khai (\d{4}-\d\d-\d\d) (\d\d:\d\d)/.exec(rest);
    if (h) r.gio_hen = `${h[1]} ${h[2]}`;
    delete r.canh_bao; delete r.loi;
    if (/CÔNG KHAI NGAY/.test(rest)) { r.trang_thai = "cong-khai"; r.gio_hen = khi; }
    else if (/CHUA HEN/.test(rest)) { r.trang_thai = "da-tai"; r.loi = "chưa hẹn được giờ: " + rest.slice(0, 200); }
    else {
      r.trang_thai = "da-hen";
      if (/-> Riêng tư/.test(rest)) r.canh_bao = "lúc hẹn Studio báo 'Riêng tư' — kiểm lại";
      else if (/Đang chờ xử lý/.test(rest)) r.canh_bao = "lúc hẹn Studio báo 'Đang chờ xử lý' — kiểm lại";
    }
    if (r.loi_moi && r.loi_moi.luc <= khi) delete r.loi_moi;
    if (!r.video_id) r.canh_bao = `job-log có link hỏng: ${link}`;
  }
  for (const r of Object.values(out)) if (r.loi_moi && rank(r.trang_thai) < rank("da-tai")) { r.trang_thai = "loi"; r.loi = r.loi_moi.loi; r.loi_luc = r.loi_moi.luc; }
  for (const r of Object.values(out)) delete r.loi_moi;
  return out;
}

function quet(k) {
  const tinh = k === "teo-the-thao" ? quetTT() : quetCTC();
  const bao = [];
  khoa(k, (so) => {
    for (const [slug, c] of Object.entries(tinh)) {
      const e = so.tap[slug];
      if (!e) {
        const { trang_thai, ...rest } = c;
        const r = (so.tap[slug] = { ...rest, trang_thai: null, video_id: c.video_id || null, gio_hen: c.gio_hen || null, lich_su: [] });
        doiTrangThai(r, trang_thai, "quet: nhập lần đầu");
        bao.push(`+ ${slug}: ${NHAN[trang_thai]}`);
        continue;
      }
      for (const f of ["tieu_de", "drive", "tap"]) if (c[f] && !e[f]) e[f] = c[f];
      if (c.uu_tien !== undefined) e.uu_tien = c.uu_tien;
      if (c.video_id && e.video_id && c.video_id !== e.video_id) bao.push(`! ${slug}: ID lệch, sổ ${e.video_id} / nguồn ${c.video_id}`);
      if (c.video_id && !e.video_id) e.video_id = c.video_id;
      if (c.gio_hen && !e.gio_hen) e.gio_hen = c.gio_hen;
      const rc = rank(c.trang_thai), re = rank(e.trang_thai);
      if (c.trang_thai === e.trang_thai) {
        if (c.canh_bao !== undefined && c.canh_bao !== e.canh_bao && !e.canh_bao_xong) e.canh_bao = c.canh_bao;
        if (c.trang_thai === "loi" && c.loi && c.loi !== e.loi) e.loi = c.loi;
        continue;
      }
      if (e.trang_thai === "loi") {
        if (rc >= rank("da-tai")) { Object.assign(e, { gio_hen: c.gio_hen || e.gio_hen }); delete e.loi; doiTrangThai(e, c.trang_thai, "quet"); bao.push(`↑ ${slug}: LỖI → ${NHAN[c.trang_thai]}`); }
        continue;
      }
      if (c.trang_thai === "loi") {
        const lan = (e.lich_su || []).at(-1)?.luc || "";
        if (re < rank("da-tai") && (c.loi_luc || "") > lan) { e.loi = c.loi; doiTrangThai(e, "loi", c.loi); bao.push(`✗ ${slug}: LỖI ${c.loi}`); }
        continue;
      }
      if (rc > re) {
        if (c.gio_hen) e.gio_hen = c.gio_hen;
        if (c.canh_bao) e.canh_bao = c.canh_bao;
        doiTrangThai(e, c.trang_thai, "quet");
        bao.push(`↑ ${slug}: ${NHAN[e.lich_su.at(-1).tu] || "?"} → ${NHAN[c.trang_thai]}`);
      } else if (re >= rank("da-tai") && rc < rank("da-tai")) {
        bao.push(`! ${slug}: sổ ghi ${NHAN[e.trang_thai]} nhưng nguồn chưa thấy tải lên`);
      }
    }
    for (const slug of Object.keys(so.tap)) if (!tinh[slug] && !slug.includes("/")) bao.push(`? ${slug}: có trong sổ, không thấy thư mục/nguồn`);
  });
  return bao;
}

// ---------- ghi ----------
function ghi(k, slug, tt, o) {
  if (!TT.includes(tt) && tt !== "loi") { console.error(`trạng thái lạ: ${tt} (${TT.join(" | ")} | loi)`); process.exit(1); }
  let id = null;
  if (o.id || o.link) {
    id = idTu(o.id || o.link);
    if (!id) { console.error(`ID video không hợp lệ: "${o.id || o.link}" — từ chối ghi`); process.exit(2); }
  }
  if (o.gio && !parseLuc(o.gio)) { console.error(`giờ sai dạng "YYYY-MM-DD HH:MM": ${o.gio}`); process.exit(1); }
  return khoa(k, (so) => {
    const r = so.tap[slug] || (so.tap[slug] = { tap: soTap(slug), slug, loai: slug.includes("/") ? "short" : "dai", trang_thai: null, video_id: null, gio_hen: null, lich_su: [] });
    if (id) { if (r.video_id && r.video_id !== id) r.lich_su.push({ luc: luc(), ghi: `đổi ID ${r.video_id} → ${id}` }); r.video_id = id; }
    if (o.gio) r.gio_hen = o.gio;
    if (o["tieu-de"]) r.tieu_de = o["tieu-de"];
    if (tt === "loi") r.loi = o.loi || o.ghi || "lỗi"; else delete r.loi;
    if (o["canh-bao"] !== undefined) { if (o["canh-bao"]) r.canh_bao = o["canh-bao"]; else delete r.canh_bao; }
    else if (tt === "cong-khai") delete r.canh_bao;
    if (r.trang_thai === tt) r.lich_su.push({ luc: luc(), ghi: o.ghi || o.loi || "(ghi lại)" });
    else doiTrangThai(r, tt, o.ghi || o.loi || "");
    return `${slug}: ${NHAN[tt]}${r.video_id ? " " + linkOf(r) : ""}${r.gio_hen ? " · hẹn " + r.gio_hen : ""}`;
  });
}

// ---------- xem / lịch / cần xử lý ----------
const tatCa = () => Object.keys(KENH).map((k) => ({ k, ...KENH[k], so: docSo(k) }));
const cat = (s, n) => { s = s || ""; return s.length > n ? s.slice(0, n - 1) + "…" : s; };
function dsTap(so, short = false) { return Object.values(so.tap).filter((r) => short || r.loai !== "short").sort((a, b) => a.tap - b.tap || a.slug.localeCompare(b.slug)); }

// ---------- hàng chờ: thứ tự đăng + dự kiến khung ----------
// Thứ tự mặc định giống hệt job đăng: TT = tập trong ep-19h.txt trước, rồi theo tên; CTC = theo tên.
// Người dùng kéo thả trên bảng → so.thu_tu = [slug...] (lệnh `xep`), job đăng đọc lại bằng `thu-tu`.
const EP19 = () => rd(`${MUSE}/the-thao/_tools/ep-19h.txt`).split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));
function hangChoXep(k, so) {
  const tt = k === "teo-the-thao", ep = tt ? EP19() : [];
  const laEp = (r) => ep.some((e) => r.slug.startsWith(e));
  // TT: hàng chờ = có trên Drive; CTC: tập đóng gói (kể cả tập tải hỏng chưa có mã video, job sẽ thử lại)
  const q = Object.values(so.tap).filter((r) => r.loai === "dai" && !r.video_id && !r.gio_hen &&
    (r.trang_thai === "cho-dang" || (r.trang_thai === "loi" && (!tt || r.drive))));
  q.sort((a, b) => (tt ? (laEp(b) ? 1 : 0) - (laEp(a) ? 1 : 0) : 0) || a.slug.localeCompare(b.slug));
  const xep = so.thu_tu || [], ix = (r) => { const i = xep.indexOf(r.slug); return i < 0 ? 1e9 : i; };
  return q.map((r, i) => ({ r, i })).sort((a, b) => ix(a.r) - ix(b.r) || a.i - b.i)
    .map(({ r }) => ({ ...r, nhom: tt ? (r.uu_tien && !laEp(r) ? "nong" : "ke") : "chung" }));
}
// khung trống này job đăng còn kịp lấp không
function kipLap(k, key, now) {
  const t = parseLuc(key), r = new Date(now);
  if (k === "cong-toc-cuoi") { r.setHours(9, 0, 0, 0); if (now >= r) r.setDate(r.getDate() + 1); return t - r > 2 * 3600e3; } // job 09:00 lấp khung cách ≥2 tiếng
  r.setHours(20, 0, 0, 0); if (now >= r) r.setDate(r.getDate() + 1); r.setDate(r.getDate() + 1); // job 20:00 hẹn khe 19:00 ngày mai
  return ngayStr(t) >= ngayStr(r);
}
// kieu của khung: hen (đã có tập hẹn) | du-kien (tập hàng chờ sẽ vào) | tin-sang (TT 07:00, job 04:00 tự làm) | khong-kip | trong (hết tập)
function lichKenh(k, so, soNgay) {
  const now = new Date(), homNay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dai = Object.values(so.tap).filter((r) => r.loai === "dai" && r.gio_hen && r.trang_thai !== "loi");
  const q = hangChoXep(k, so), con = q.filter((x) => x.nhom !== "nong"), vao = {};
  const khe = [];
  let du = null, het = null;
  const xa = new Date(homNay); xa.setDate(xa.getDate() + 60);
  for (let d = new Date(homNay), i = 0; d < xa && (i < soNgay || !het); d.setDate(d.getDate() + 1), i++) {
    for (const g of GIO) {
      const key = `${ngayStr(d)} ${g}`, qua = parseLuc(key) < now;
      const r = dai.find((x) => x.gio_hen === key) || null;
      let kieu = r ? "hen" : qua ? "qua" : null, dk = null;
      if (!kieu) {
        if (k === "teo-the-thao" && g === "07:00") kieu = "tin-sang";
        else if (!kipLap(k, key, now)) kieu = "khong-kip";
        else if (con.length) { dk = con.shift(); vao[dk.slug] = key; kieu = "du-kien"; }
        else { kieu = "trong"; het = het || key; }
      }
      if (!qua && (r || dk)) du = key;
      if (i < soNgay) khe.push({ k: key, qua, r, kieu, dk });
    }
  }
  return { khe, cho: q.length, du, het, hang: q.map((r) => ({ ...r, vao: vao[r.slug] || null })) };
}

function canXuLy() {
  const out = [], now = new Date();
  for (const { k, ten, so } of tatCa()) {
    for (const r of dsTap(so, true)) {
      if (r.trang_thai === "loi") out.push({ kenh: ten, slug: r.slug, muc: "lỗi", ghi: r.loi });
      else if (r.canh_bao && r.trang_thai !== "cong-khai") out.push({ kenh: ten, slug: r.slug, muc: "cảnh báo", ghi: r.canh_bao });
      if (r.trang_thai === "da-hen" && r.gio_hen && now - parseLuc(r.gio_hen) > 3600e3)
        out.push({ kenh: ten, slug: r.slug, muc: "quá giờ hẹn", ghi: `hẹn ${r.gio_hen}, chưa xác nhận công khai (chạy: so-cai kiem)` });
      if (r.trang_thai === "da-tai") {
        const t = parseLuc((r.lich_su || []).at(-1)?.luc);
        if (t && now - t > 2 * 3600e3) out.push({ kenh: ten, slug: r.slug, muc: "chưa hẹn", ghi: `tải lên lúc ${(r.lich_su || []).at(-1).luc}, vẫn riêng tư chưa hẹn giờ` });
      }
    }
    const l = lichKenh(k, so, 3);
    // khung trống mà hàng chờ không đủ tập để lấp (khung hàng chờ lấp được thì job đăng tự lo)
    const trong = l.khe.filter((x) => x.kieu === "trong").map((x) => x.k);
    const khongKip = l.khe.filter((x) => x.kieu === "khong-kip").map((x) => x.k);
    if (l.het && parseLuc(l.het) - now < 2 * 86400e3) out.push({ kenh: ten, slug: "-", muc: "hàng chờ sắp cạn", ghi: `còn ${l.cho} tập chờ, khung trống đầu tiên không có tập: ${l.het}` });
    else if (trong.length) out.push({ kenh: ten, slug: "-", muc: "hết tập cho khung", ghi: trong.join(", ") });
    if (khongKip.length) out.push({ kenh: ten, slug: "-", muc: "khung trống", ghi: `job đăng không kịp lấp (đăng tay nếu cần): ${khongKip.join(", ")}` });
  }
  return out;
}

// ---------- kiểm công khai qua oEmbed ----------
async function trangThaiCong(id) {
  try {
    const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, { signal: AbortSignal.timeout(15000) });
    if (r.status === 200) { const j = await r.json(); return { cong: true, title: j.title }; }
    if ([401, 403, 404].includes(r.status)) return { cong: false, ma: r.status };
    return { loi: `HTTP ${r.status}` };
  } catch (e) { return { loi: String(e.message || e) }; }
}
async function kiem(ks, het) {
  const now = new Date(), bao = [];
  for (const k of ks) {
    const so = docSo(k);
    // da-hen đã tới giờ, và cả tập 'loi' đã có mã video (hẹn không chắc nhưng có thể vẫn lên đúng giờ)
    const can = Object.values(so.tap).filter((r) => r.video_id && (het ? r.trang_thai !== "cong-khai"
      : ["da-hen", "loi", "da-tai"].includes(r.trang_thai) && r.gio_hen && parseLuc(r.gio_hen) <= now));
    for (const r of can) {
      const s = await trangThaiCong(r.video_id);
      const qua = r.gio_hen ? (now - parseLuc(r.gio_hen)) / 60000 : 0;
      if (s.cong) { bao.push(ghi(k, r.slug, "cong-khai", { ghi: "kiem: oEmbed 200" })); }
      else if (s.loi) { bao.push(`${r.slug}: chưa rõ (${s.loi})`); }
      else if (r.trang_thai === "loi") { bao.push(`${r.slug}: vẫn chưa công khai (đã báo lỗi trước đó)`); }
      else if (qua > 30) { bao.push(ghi(k, r.slug, "loi", { loi: `quá giờ hẹn ${r.gio_hen} ${Math.round(qua)} phút mà video chưa công khai (oEmbed ${s.ma}) — mở Studio kiểm` })); }
      else bao.push(`${r.slug}: chưa công khai, mới quá ${Math.round(qua)} phút — để lượt sau`);
    }
  }
  return bao;
}

// ---------- html ----------
const MAU_KENH = { "teo-the-thao": "#0e7c66", "cong-toc-cuoi": "#c2410c" };
function html() {
  const soNgay = 7, now = new Date();
  const d = { luc: luc(), kenh: [], xl: canXuLy() };
  for (const { k, ten, so } of tatCa()) {
    const l = lichKenh(k, so, soNgay), all = dsTap(so);
    d.kenh.push({
      k, ten, mau: MAU_KENH[k], cho: l.cho, du: l.du, het: l.het,
      sapCan: !!(l.het && parseLuc(l.het) - now < 2 * 86400e3),
      short: Object.values(so.tap).filter((r) => r.loai === "short").length,
      khe: l.khe.map((x) => ({ k: x.k, qua: x.qua, kieu: x.kieu, r: x.r ? { tap: x.r.tap, tieu_de: x.r.tieu_de || x.r.slug, tt: x.r.trang_thai, cb: !!x.r.canh_bao } : null,
        dk: x.dk ? { tap: x.dk.tap, slug: x.dk.slug, tieu_de: x.dk.tieu_de || x.dk.slug } : null })),
      hang: l.hang.map((r) => ({ tap: r.tap, slug: r.slug, tieu_de: r.tieu_de || r.slug, nhom: r.nhom, vao: r.vao, loi: r.trang_thai === "loi" })),
      tap: all.map((r) => ({ tap: r.tap, slug: r.slug, tt: r.trang_thai, tieu_de: r.tieu_de || r.slug, gio: r.gio_hen || "", link: linkOf(r), loi: r.loi || "", cb: r.canh_bao || "", uu: !!r.uu_tien })),
    });
  }
  const json = JSON.stringify(d).replace(/</g, "\\u003c");
  const page = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sổ cái video</title>
<style>
:root{--bg:#f4f3f0;--card:#fff;--fg:#1c1b19;--mu:#6d6b66;--line:#e4e2dd;--soft:#f0eee9;
--ok:#15803d;--okb:#dcfce7;--hen:#1d4ed8;--henb:#dbeafe;--cho:#a16207;--chob:#fef3c7;--lam:#57534e;--lamb:#eeece8;--do:#b91c1c;--dob:#fee2e2;--today:#fff7d6}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#141413;--card:#1f1f1d;--fg:#ecebe7;--mu:#a19f99;--line:#33322e;--soft:#292826;
--ok:#4ade80;--okb:#14321f;--hen:#93b4fb;--henb:#1b2a4a;--cho:#fbbf24;--chob:#3b2f10;--lam:#c4c1ba;--lamb:#2b2a27;--do:#fca5a5;--dob:#421a1a;--today:#2e2a17}}
:root[data-theme="dark"]{--bg:#141413;--card:#1f1f1d;--fg:#ecebe7;--mu:#a19f99;--line:#33322e;--soft:#292826;
--ok:#4ade80;--okb:#14321f;--hen:#93b4fb;--henb:#1b2a4a;--cho:#fbbf24;--chob:#3b2f10;--lam:#c4c1ba;--lamb:#2b2a27;--do:#fca5a5;--dob:#421a1a;--today:#2e2a17}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,"Segoe UI",Roboto,sans-serif}
main{max-width:1180px;margin:0 auto;padding:24px 16px 64px}
header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px;margin-bottom:18px}
h1{font-size:26px;margin:0;letter-spacing:-.01em}
h2{font-size:18px;margin:34px 0 12px}
.mu{color:var(--mu)}a{color:var(--hen)}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px}
/* thẻ kênh */
.kenh{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr));gap:14px}
.k{padding:16px 18px;border-top:5px solid var(--m)}
.k h3{margin:0 0 10px;font-size:17px;display:flex;align-items:center;gap:8px}
.cham{width:10px;height:10px;border-radius:50%;background:var(--m);display:inline-block}
.hc{font-size:15px;margin:0 0 14px}.hc b{font-size:28px;margin-right:4px}
.canh{display:inline-block;margin-left:8px;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:600;background:var(--dob);color:var(--do);vertical-align:middle}
.dem{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
.dem div{background:var(--soft);border-radius:10px;padding:8px 6px;text-align:center}
.dem b{display:block;font-size:20px;line-height:1.2}.dem span{font-size:12px;color:var(--mu)}
.dem .loi b{color:var(--do)}
/* cần xử lý */
.xl{margin-top:14px;padding:14px 18px}
.xl h3{margin:0 0 8px;font-size:16px}
.xl ul{margin:0;padding:0;list-style:none}
.xl li{display:flex;gap:10px;padding:7px 0;border-top:1px solid var(--line);align-items:flex-start}
.xl li:first-child{border-top:0}
.tag{flex:none;font-size:12px;font-weight:600;padding:2px 9px;border-radius:999px;white-space:nowrap}
.t-loi{background:var(--dob);color:var(--do)}.t-cb{background:var(--chob);color:var(--cho)}.t-hen{background:var(--henb);color:var(--hen)}
.xl .nd{min-width:0;overflow-wrap:anywhere}.xl .nd small{display:block;color:var(--mu)}
.ok-all{margin-top:14px;padding:12px 18px;color:var(--ok);background:var(--okb);border-color:transparent}
/* lịch */
.cuon{overflow-x:auto;-webkit-overflow-scrolling:touch}
table.lich{border-collapse:separate;border-spacing:6px;min-width:900px;width:100%}
.lich th{font-size:13px;font-weight:600;color:var(--mu);padding:4px 2px;text-align:left}
.lich th.nay{color:var(--fg)}
.lich th.nay span{background:var(--fg);color:var(--bg);border-radius:6px;padding:1px 6px;margin-left:4px;font-size:11px}
.lich td{vertical-align:top;width:13%}
.lich td.nhan{width:110px;font-size:13px;font-weight:600;white-space:nowrap}
.lich td.nhan i{font-style:normal;display:block;font-weight:400;color:var(--mu)}
.o{border-radius:10px;padding:8px 10px;min-height:76px;border-left:4px solid transparent;background:var(--card);border:1px solid var(--line);border-left-width:4px}
.o b{font-size:13px}.o p{margin:2px 0 0;font-size:12.5px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.o.trong{border:2px dashed var(--do);background:var(--dob);color:var(--do);font-weight:600;font-size:13px;display:flex;align-items:center;justify-content:center}
.o.se-lap,.o.trong{flex-direction:column;gap:2px}
.o.se-lap{border:1px dashed var(--mu);color:var(--mu);background:transparent;font-size:12.5px;display:flex;align-items:center;justify-content:center;text-align:center}
.chu{display:flex;gap:16px;flex-wrap:wrap;font-size:12.5px;color:var(--mu);margin:-4px 0 10px}
.chu span::before{content:"";display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px;background:var(--c);border:1px dashed var(--b,transparent)}
.o.qua-trong{background:transparent;border:1px dashed var(--line);color:var(--mu);display:flex;align-items:center;justify-content:center}
.o.qua{opacity:.55}
.o.dk{border-style:dashed;border-color:var(--cho);background:var(--chob)}
.o small{font-weight:400;font-size:11.5px}
.p-dk{background:var(--chob);color:var(--cho)}
.keo[draggable="true"]{cursor:grab}.dang-keo{opacity:.4}
.tha{outline:3px solid var(--hen);outline-offset:2px}
.grip{color:var(--mu);margin-right:6px;font-weight:400;user-select:none}
.goi-y{font-size:13px;margin:-4px 0 10px}
.hang{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(420px,100%),1fr));gap:14px}
.hk{border-top:4px solid var(--m)}.hk h3{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.nho{margin-left:auto;font:inherit;font-size:12.5px;padding:4px 10px;border-radius:8px;border:1px solid var(--line);background:var(--soft);color:var(--fg);cursor:pointer}
ol.xep{list-style:none;margin:0;padding:0}
ol.xep li{display:grid;grid-template-columns:auto 26px minmax(0,1fr) auto auto;align-items:center;gap:8px;padding:8px 6px;border-top:1px solid var(--line);border-radius:8px}
ol.xep li:first-child{border-top:0}
ol.xep .stt{font-weight:700;color:var(--mu);text-align:right}
ol.xep .td{font-size:13.5px;line-height:1.35}ol.xep .td small{display:block}
ol.xep .vao{font-size:12.5px;color:var(--cho);white-space:nowrap;font-weight:600}
ol.xep .nut{display:flex;gap:4px}
ol.xep .nut button{width:30px;height:30px;border-radius:8px;border:1px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer;font-size:14px}
ol.xep .nut button:disabled{opacity:.3;cursor:default}
body.dang-luu{cursor:progress}body.dang-luu main{opacity:.6;pointer-events:none}
@media (max-width:640px){ol.xep li{grid-template-columns:26px minmax(0,1fr) auto;grid-template-areas:"stt td nut" "stt vao nut"}ol.xep .grip{display:none}
 ol.xep .stt{grid-area:stt}ol.xep .td{grid-area:td}ol.xep .vao{grid-area:vao}ol.xep .nut{grid-area:nut}}
.o.cb{box-shadow:inset 0 0 0 2px var(--cho)}
.b-cong-khai{border-left-color:var(--ok)!important}.b-da-hen,.b-da-tai{border-left-color:var(--hen)!important}.b-cho-dang{border-left-color:var(--cho)!important}.b-loi{border-left-color:var(--do)!important}.b-dang-lam,.b-dong-goi{border-left-color:var(--lam)!important}
.td-nay{background:var(--today);border-radius:12px}
/* danh sách */
.tabs{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap}
.tabs button,.loc button{font:inherit;cursor:pointer;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:999px;padding:6px 14px}
.tabs button.on{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.loc{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.loc button{font-size:13px;padding:4px 11px}
.loc button.on{border-color:var(--fg);font-weight:600}
.loc button i{font-style:normal;color:var(--mu);margin-left:3px}
.loc input{font:inherit;font-size:14px;margin-left:auto;padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--fg);min-width:200px}
.ds{padding:4px 0}
.dong{display:grid;grid-template-columns:56px 130px minmax(0,1fr) 150px 60px;gap:12px;align-items:center;padding:10px 18px;border-top:1px solid var(--line)}
.dong:first-child{border-top:0}
.dong .so{font-weight:700;color:var(--mu)}
.dong .td{min-width:0}.dong .td small{display:block;font-size:12.5px;margin-top:2px}
.dong .td small.loi{color:var(--do)}.dong .td small.cb{color:var(--cho)}
.dong .gio{font-size:13.5px;color:var(--mu)}
.pill{display:inline-block;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;white-space:nowrap}
.p-cong-khai{background:var(--okb);color:var(--ok)}.p-da-hen,.p-da-tai{background:var(--henb);color:var(--hen)}.p-cho-dang{background:var(--chob);color:var(--cho)}.p-loi{background:var(--dob);color:var(--do)}.p-dang-lam,.p-dong-goi{background:var(--lamb);color:var(--lam)}
.uu{font-size:11px;font-weight:600;color:var(--cho);margin-left:6px}
.rong{padding:24px 18px;color:var(--mu);text-align:center}
@media (max-width:720px){
 .dem{grid-template-columns:repeat(3,1fr)}
 .dong{grid-template-columns:40px minmax(0,1fr) auto;padding:10px 14px;grid-template-areas:"so td xem" "so tt gio";row-gap:6px}
 .dong .so{grid-area:so}.dong .td{grid-area:td}.dong .tt{grid-area:tt}.dong .gio{grid-area:gio;text-align:right}.dong .xem{grid-area:xem}
 .loc input{margin-left:0;width:100%}
}
</style></head><body><main>
<header><h1>Sổ cái video</h1><span class="mu" id="capnhat"></span></header>
<section class="kenh" id="kenh"></section>
<div id="xl"></div>
<h2>Lịch 7 ngày tới</h2>
<div class="chu"><span style="--c:var(--ok)">Đã công khai</span><span style="--c:var(--hen)">Đã hẹn giờ</span><span style="--c:var(--chob);--b:var(--cho)">Dự kiến: tập trong hàng chờ, job đăng sẽ hẹn</span><span style="--c:transparent;--b:var(--mu)">Tin sáng (TT 07:00, job 04:00 tự làm)</span><span style="--c:var(--dob);--b:var(--do)">Trống, hết tập</span></div>
<p class="mu goi-y" id="goiy"></p>
<div class="cuon"><table class="lich" id="lich"></table></div>
<h2>Thứ tự đăng hàng chờ</h2>
<div class="hang" id="hang"></div>
<h2>Danh sách tập</h2>
<div class="tabs" id="tabs"></div>
<div class="loc" id="loc"></div>
<div class="card ds" id="ds"></div>
<p class="mu" style="margin-top:24px;font-size:13px">Làm mới: <code>node so-cai.mjs quet</code> rồi <code>node so-cai.mjs kiem</code> · job so-cai-kiem tự chạy 07:40 và 19:40.</p>
</main>
<script type="application/json" id="du-lieu">${json}</script>
<script>
var D = JSON.parse(document.getElementById("du-lieu").textContent);
var SUA = location.protocol.indexOf("http")==0; // mở qua server bảng động mới sửa thứ tự được
var NHAN = {"dang-lam":"Đang làm","dong-goi":"Đóng gói","cho-dang":"Chờ đăng","da-tai":"Đã tải","da-hen":"Đã hẹn","cong-khai":"Công khai","loi":"Lỗi"};
var THU = ["CN","T2","T3","T4","T5","T6","T7"];
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function ngay(s){if(!s)return "";var p=s.split(" ")[0].split("-");var dt=new Date(+p[0],p[1]-1,+p[2]);return THU[dt.getDay()]+" "+p[2]+"/"+p[1];}
function luc(s){return s?ngay(s)+" · "+s.slice(11,16):"";}
function $(id){return document.getElementById(id);}
function nho(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}}

$("capnhat").textContent = "Cập nhật " + luc(D.luc);

// thẻ kênh
$("kenh").innerHTML = D.kenh.map(function(k){
  var c=function(s){return k.tap.filter(function(r){return s.indexOf(r.tt)>=0;}).length;};
  return '<div class="card k" style="--m:'+k.mau+'"><h3><span class="cham"></span>'+esc(k.ten)+'</h3>'+
   '<p class="hc"><b>'+k.cho+'</b> tập chờ đăng'+(k.sapCan?'<span class="canh">Sắp cạn</span>':'')+'<br><span class="mu">'+
   (k.du?'Đủ đăng tới '+luc(k.du):'Không còn tập nào xếp lịch')+'</span></p>'+
   '<div class="dem"><div><b>'+c(["dang-lam","dong-goi"])+'</b><span>Đang làm</span></div><div><b>'+c(["cho-dang"])+'</b><span>Chờ đăng</span></div>'+
   '<div><b>'+c(["da-hen","da-tai"])+'</b><span>Đã hẹn</span></div><div><b>'+c(["cong-khai"])+'</b><span>Công khai</span></div>'+
   '<div class="loi"><b>'+c(["loi"])+'</b><span>Lỗi</span></div></div></div>';
}).join("");

// cần xử lý
(function(){
  var x = D.xl;
  if(!x.length){$("xl").innerHTML='<div class="card ok-all">Mọi thứ ổn, không có việc cần xử lý.</div>';return;}
  var lop = function(m){return m=="lỗi"?"t-loi":(m=="quá giờ hẹn"||m=="chưa hẹn")?"t-hen":"t-cb";};
  $("xl").innerHTML='<div class="card xl"><h3>Cần xử lý ('+x.length+')</h3><ul>'+x.map(function(i){
    return '<li><span class="tag '+lop(i.muc)+'">'+esc(i.muc)+'</span><div class="nd"><b>'+esc(i.kenh)+'</b>'+(i.slug!="-"?' · '+esc(i.slug):'')+'<small>'+esc(i.ghi).replace(/\\d{4}-\\d\\d-\\d\\d \\d\\d:\\d\\d/g,function(m){return luc(m);})+'</small></div></li>';
  }).join("")+'</ul></div>';
})();

// lịch
(function(){
  var hn = D.luc.slice(0,10), days = [];
  D.kenh[0].khe.forEach(function(x){var d=x.k.slice(0,10);if(days.indexOf(d)<0)days.push(d);});
  var h='<thead><tr><th></th>'+days.map(function(d){return '<th class="'+(d==hn?'nay':'')+'">'+ngay(d)+(d==hn?'<span>hôm nay</span>':'')+'</th>';}).join("")+'</tr></thead><tbody>';
  D.kenh.forEach(function(k){
    ["07:00","19:00"].forEach(function(g){
      h+='<tr><td class="nhan" style="color:'+k.mau+'">'+esc(k.ten)+'<i>'+g+'</i></td>';
      days.forEach(function(d){
        var x=k.khe.filter(function(y){return y.k==d+" "+g;})[0], cls=d==hn?' class="td-nay"':'';
        if(x&&x.dk){h+='<td'+cls+'><div class="o dk keo" draggable="'+SUA+'" data-k="'+k.k+'" data-slug="'+esc(x.dk.slug)+'" title="'+esc(x.dk.tieu_de)+'"><b>'+(SUA?'<span class="grip">⠿</span>':'')+'Tập '+x.dk.tap+'</b> <span class="pill p-dk" style="font-size:10.5px;padding:1px 7px">Dự kiến</span><p>'+esc(x.dk.tieu_de)+'</p></div></td>';return;}
        if(!x||!x.r){var t=!x||x.qua?'qua-trong">—':x.kieu=="tin-sang"?'se-lap">Tin sáng<br><small>job 04:00 tự làm</small>':x.kieu=="khong-kip"?'trong">Trống<br><small>job không kịp lấp</small>':'trong">Trống — hết tập';
          h+='<td'+cls+'><div class="o '+t+'</div></td>';return;}
        h+='<td'+cls+'><div class="o b-'+x.r.tt+(x.qua?' qua':'')+(x.r.cb?' cb':'')+'" title="'+esc(x.r.tieu_de)+'"><b>Tập '+x.r.tap+'</b> <span class="pill p-'+x.r.tt+'" style="font-size:10.5px;padding:1px 7px">'+NHAN[x.r.tt]+'</span><p>'+esc(x.r.tieu_de)+'</p></div></td>';
      });
      h+='</tr>';
    });
  });
  $("lich").innerHTML=h+'</tbody>';
})();

// thứ tự đăng hàng chờ: kéo thả (máy tính) hoặc nút ↑↓ (điện thoại); lưu qua server bảng động
function luuXep(kk, ds, macDinh){
  document.body.classList.add("dang-luu");
  fetch("/xep",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({kenh:kk,ds:ds,mac_dinh:!!macDinh})})
    .then(function(r){return r.json();}).then(function(j){if(!j.ok)throw new Error(j.loi||"lỗi");location.reload();})
    .catch(function(e){document.body.classList.remove("dang-luu");alert("Không lưu được: "+e.message);});
}
function kenhCua(kk){return D.kenh.filter(function(k){return k.k==kk;})[0];}
function thuTu(kk){return kenhCua(kk).hang.map(function(r){return r.slug;});}
function doiCho(kk, a, b, kieu){ // kieu "doi": hoán đổi 2 tập; "chen": đưa a vào chỗ b
  var ds=thuTu(kk), i=ds.indexOf(a), j=ds.indexOf(b); if(i<0||j<0||i==j)return;
  if(kieu=="doi"){ds[i]=b;ds[j]=a;}else{ds.splice(i,1);ds.splice(j,0,a);}
  luuXep(kk, ds);
}
$("goiy").innerHTML = SUA ? 'Kéo một ô <b>Dự kiến</b> thả lên ô <b>Dự kiến</b> khác cùng kênh để đổi chỗ hai tập. Tập đã hẹn trên YouTube thì không kéo được.'
  : 'Muốn kéo thả đổi tập, mở bảng động <a href="http://localhost:4747">http://localhost:4747</a>.';
(function(){
  $("hang").innerHTML = D.kenh.map(function(k){
    var ke=k.hang.filter(function(r){return r.nhom!="nong";}), nong=k.hang.filter(function(r){return r.nhom=="nong";});
    return '<div class="card hk" style="--m:'+k.mau+'"><h3><span class="cham"></span>'+esc(k.ten)+' <span class="mu" style="font-weight:400;font-size:13px">· '+ke.length+' tập</span>'+
      (SUA&&k.hang.length?'<button class="nho mac" data-k="'+k.k+'">Về thứ tự mặc định</button>':'')+'</h3>'+
      (ke.length?'<ol class="xep">'+ke.map(function(r,i){
        return '<li class="keo" draggable="'+SUA+'" data-k="'+k.k+'" data-slug="'+esc(r.slug)+'">'+(SUA?'<span class="grip">⠿</span>':'')+
          '<span class="stt">'+(i+1)+'</span><div class="td"><b>Tập '+r.tap+'</b> '+esc(r.tieu_de)+(r.loi?' <small class="loi">tải lỗi lần trước, job thử lại</small>':'')+'</div>'+
          '<span class="vao">'+(r.vao?luc(r.vao):'ngoài 60 ngày')+'</span>'+
          (SUA?'<span class="nut"><button data-d="-1" '+(i==0?'disabled':'')+' aria-label="Lên">↑</button><button data-d="1" '+(i==ke.length-1?'disabled':'')+' aria-label="Xuống">↓</button></span>':'')+'</li>';
      }).join("")+'</ol>':'<div class="rong">Hàng chờ trống.</div>')+
      (nong.length?'<p class="mu" style="font-size:13px;margin:10px 0 0">Tin nóng nằm chờ (chỉ đăng qua chon-mot, không vào khe 19:00): '+nong.map(function(r){return 'Tập '+r.tap;}).join(", ")+'</p>':'')+
      '</div>';
  }).join("");
  if(!SUA)return;
  var keo=null;
  document.addEventListener("dragstart",function(e){var el=e.target.closest&&e.target.closest(".keo");if(!el)return;keo={k:el.dataset.k,slug:el.dataset.slug,lich:el.classList.contains("o")};el.classList.add("dang-keo");try{e.dataTransfer.setData("text/plain",keo.slug);e.dataTransfer.effectAllowed="move";}catch(x){}});
  document.addEventListener("dragend",function(e){document.querySelectorAll(".dang-keo,.tha").forEach(function(n){n.classList.remove("dang-keo","tha");});keo=null;});
  document.addEventListener("dragover",function(e){var el=e.target.closest&&e.target.closest(".keo");if(!keo||!el||el.dataset.k!=keo.k||el.dataset.slug==keo.slug)return;e.preventDefault();
    document.querySelectorAll(".tha").forEach(function(n){if(n!=el)n.classList.remove("tha");});el.classList.add("tha");});
  document.addEventListener("drop",function(e){var el=e.target.closest&&e.target.closest(".keo");if(!keo||!el||el.dataset.k!=keo.k)return;e.preventDefault();
    doiCho(keo.k,keo.slug,el.dataset.slug,(keo.lich||el.classList.contains("o"))?"doi":"chen");});
  $("hang").addEventListener("click",function(e){
    var m=e.target.closest(".mac");if(m){if(confirm("Bỏ thứ tự đã xếp, về thứ tự mặc định của job đăng?"))luuXep(m.dataset.k,[],true);return;}
    var b=e.target.closest("button[data-d]");if(!b)return;var li=b.closest("li"),kk=li.dataset.k,ds=thuTu(kk),ke=kenhCua(kk).hang.filter(function(r){return r.nhom!="nong";}).map(function(r){return r.slug;});
    var i=ke.indexOf(li.dataset.slug),j=i+(+b.dataset.d);if(j<0||j>=ke.length)return;doiCho(kk,ke[i],ke[j],"doi");
  });
})();

// danh sách
var LOC=[["chua","Chưa đăng",["dang-lam","dong-goi","cho-dang","da-tai","da-hen","loi"]],["cho","Chờ đăng",["cho-dang"]],["hen","Đã hẹn",["da-hen","da-tai"]],["cong","Công khai",["cong-khai"]],["loi","Lỗi",["loi"]],["lam","Đang làm",["dang-lam","dong-goi"]],["het","Tất cả",null]];
var st={k:nho("sc-kenh")||D.kenh[0].k,loc:nho("sc-loc")||"chua",q:""};
function ve(){
  var k=D.kenh.filter(function(x){return x.k==st.k;})[0]||D.kenh[0];
  $("tabs").innerHTML=D.kenh.map(function(x){return '<button data-k="'+x.k+'" class="'+(x.k==k.k?'on':'')+'">'+esc(x.ten)+'</button>';}).join("");
  var q=$("tim")?$("tim").value:st.q;
  $("loc").innerHTML=LOC.map(function(l){var n=k.tap.filter(function(r){return !l[2]||l[2].indexOf(r.tt)>=0;}).length;
    return '<button data-l="'+l[0]+'" class="'+(l[0]==st.loc?'on':'')+'">'+l[1]+'<i>'+n+'</i></button>';}).join("")+'<input id="tim" placeholder="Tìm tên tập…" value="'+esc(q)+'">';
  var f=LOC.filter(function(l){return l[0]==st.loc;})[0][2], ql=q.toLowerCase();
  var rs=k.tap.filter(function(r){return (!f||f.indexOf(r.tt)>=0)&&(!ql||(r.tieu_de+" "+r.slug).toLowerCase().indexOf(ql)>=0);}).slice().reverse();
  $("ds").innerHTML=rs.length?rs.map(function(r){
    return '<div class="dong"><span class="so">#'+r.tap+'</span><span class="tt"><span class="pill p-'+r.tt+'">'+NHAN[r.tt]+'</span></span>'+
      '<div class="td">'+esc(r.tieu_de)+(r.uu?'<span class="uu">ƯU TIÊN</span>':'')+(r.loi?'<small class="loi">'+esc(r.loi)+'</small>':r.cb&&r.tt!="cong-khai"?'<small class="cb">'+esc(r.cb)+'</small>':'')+'</div>'+
      '<span class="gio">'+luc(r.gio)+'</span><span class="xem">'+(r.link?'<a href="'+r.link+'" target="_blank" rel="noopener">Xem ↗</a>':'')+'</span></div>';
  }).join(""):'<div class="rong">Không có tập nào.</div>';
  var t=$("tim");t.oninput=function(){st.q=t.value;ve();var n=$("tim");n.focus();n.setSelectionRange(n.value.length,n.value.length);};
}
$("tabs").onclick=function(e){var b=e.target.closest("button");if(b){st.k=b.dataset.k;nho("sc-kenh",st.k);ve();}};
$("loc").onclick=function(e){var b=e.target.closest("button");if(b){st.loc=b.dataset.l;nho("sc-loc",st.loc);ve();}};
ve();
</script></body></html>`;
  writeFileSync(join(HERE, "bang.html"), page);
  return join(HERE, "bang.html");
}

// ---------- CLI ----------
function opts(a) { const o = {}, pos = []; for (let i = 0; i < a.length; i++) { if (a[i].startsWith("--")) { const k = a[i].slice(2); o[k] = a[i + 1] && !a[i + 1].startsWith("--") ? a[++i] : true; } else pos.push(a[i]); } return { o, pos }; }
const [cmd, ...rest] = process.argv.slice(2);
const { o, pos } = opts(rest);
const chonKenh = (x) => (x ? [kenhOf(x)] : Object.keys(KENH));
const lamHtml = () => { try { html(); } catch (e) { console.error("không xuất được bang.html: " + e.message); } };

if (cmd === "quet") {
  for (const k of chonKenh(pos[0])) { const b = quet(k); console.log(`== ${KENH[k].ten}: ${b.length ? "" : "không có gì mới"}`); b.forEach((x) => console.log("  " + x)); }
  lamHtml();
} else if (cmd === "ghi") {
  const [kx, slug, tt] = pos;
  if (!kx || !slug || !tt) { console.error("dùng: ghi <kenh> <slug> <trang_thai> [--id|--link] [--gio] [--loi] [--canh-bao] [--tieu-de] [--ghi]"); process.exit(1); }
  console.log(ghi(kenhOf(kx), slug, tt, o)); lamHtml();
} else if (cmd === "xem") {
  for (const k of chonKenh(pos[0])) {
    const so = docSo(k); console.log(`\n== ${KENH[k].ten} (cập nhật ${so.cap_nhat || "chưa quét"})`);
    for (const r of dsTap(so, !!o.short)) console.log(`${String(r.tap).padStart(3)}  ${(NHAN[r.trang_thai] || "?").padEnd(17)} ${(r.gio_hen || "").padEnd(16)} ${(r.video_id || "").padEnd(11)}  ${cat(r.tieu_de || r.slug, 60)}${r.loi ? "  ✗ " + cat(r.loi, 80) : r.canh_bao ? "  ⚠ " + cat(r.canh_bao, 80) : ""}`);
    const sh = Object.values(so.tap).filter((r) => r.loai === "short").length; if (sh && !o.short) console.log(`  (+${sh} Short, xem bằng --short)`);
  }
} else if (cmd === "lich") {
  const n = +(o.ngay || 7);
  const KIEU = { "tin-sang": "(tin sáng, job 04:00 tự làm)", "khong-kip": "TRỐNG — job không kịp lấp", trong: "TRỐNG — hết tập", qua: "—" };
  for (const { k, ten, so } of tatCa()) {
    const l = lichKenh(k, so, n); console.log(`\n== ${ten}: ${l.cho} tập chờ · đủ tới ${l.du || "—"}${l.het ? ` · khung không có tập đầu tiên ${l.het}` : ""}`);
    for (const x of l.khe) console.log(`  ${x.k}  ${x.r ? `T${x.r.tap} ${(NHAN[x.r.trang_thai] || "").padEnd(10)} ${cat(x.r.tieu_de || x.r.slug, 55)}`
      : x.dk ? `T${x.dk.tap} ${"dự kiến".padEnd(10)} ${cat(x.dk.tieu_de || x.dk.slug, 55)}` : KIEU[x.kieu]}`);
  }
} else if (cmd === "thu-tu") {
  // thứ tự đăng hàng chờ (JSON [slug...]) cho job đăng; rỗng = thứ tự mặc định
  const k = kenhOf(pos[0]); console.log(JSON.stringify(hangChoXep(k, docSo(k)).map((r) => r.slug)));
} else if (cmd === "xep") {
  // xep <kenh> <slug...>: đặt thứ tự đăng hàng chờ (bảng kéo thả gọi)
  const k = kenhOf(pos[0]), ds = pos.slice(1);
  if (o["mac-dinh"]) { khoa(k, (so) => { delete so.thu_tu; }); lamHtml(); console.log("về thứ tự mặc định"); process.exit(0); }
  if (!ds.length) { console.error("dùng: xep <kenh> <slug> <slug> ... | xep <kenh> --mac-dinh"); process.exit(1); }
  const la = ds.filter((s) => !docSo(k).tap[s]); if (la.length) { console.error(`không có tập: ${la.join(", ")}`); process.exit(2); }
  khoa(k, (so) => { so.thu_tu = [...new Set(ds)]; });
  lamHtml(); console.log("đã xếp: " + ds.join(" → "));
} else if (cmd === "can-xu-ly") {
  const x = canXuLy(); if (!x.length) console.log("không có việc cần xử lý");
  for (const i of x) console.log(`${i.kenh} · ${i.muc} · ${i.slug} — ${i.ghi}`);
} else if (cmd === "kiem") {
  const b = await kiem(chonKenh(pos[0]), !!o.het); console.log(b.length ? b.join("\n") : "không có tập nào cần kiểm"); lamHtml();
} else if (cmd === "da-dang") {
  const so = docSo(kenhOf(pos[0])), rs = Object.values(so.tap);
  console.log(JSON.stringify({ da: rs.filter((r) => r.video_id || rank(r.trang_thai) >= rank("da-tai")).map((r) => r.slug),
    kin: rs.filter((r) => r.gio_hen && r.trang_thai !== "loi" && r.loai === "dai").map((r) => r.gio_hen) }));
} else if (cmd === "html") {
  console.log(html());
} else if (cmd === "serve") {
  // Bảng động: mỗi lần mở/F5 thì quét lại rồi dựng bảng mới; kiểm công khai (oEmbed) tối đa 5 phút/lần.
  // Quét/kiểm chạy bằng tiến trình con, vì khoa() có thể process.exit, không được làm sập server.
  const { createServer } = await import("http");
  const { execFile } = await import("child_process");
  const port = +(o.port || 4747), self = fileURLToPath(import.meta.url);
  const chay = (...a) => new Promise((ok) => execFile(process.execPath, [self, ...a], { timeout: 60000 }, (e, out, err) => ok({ e, out, err })));
  let lanKiem = 0, dangKiem = null;
  const kiemNen = () => {
    if (dangKiem || Date.now() - lanKiem < 5 * 60000) return dangKiem;
    lanKiem = Date.now();
    return (dangKiem = chay("kiem").finally(() => { dangKiem = null; }));
  };
  const TUDONG = `<script>(function(){var t=Date.now();setInterval(function(){var a=document.activeElement;
if(document.hidden||(a&&a.tagName=="INPUT")||Date.now()-t<60000)return;location.reload();},5000);
document.addEventListener("visibilitychange",function(){if(!document.hidden&&Date.now()-t>60000)location.reload();});})();</script>`;
  createServer(async (req, res) => {
    const u = new URL(req.url, "http://x");
    if (req.method === "POST" && u.pathname === "/xep") { // kéo thả trên bảng: đặt thứ tự đăng hàng chờ
      let body = ""; for await (const c of req) { body += c; if (body.length > 1e5) break; }
      const tra = (code, j) => { res.writeHead(code, { "content-type": "application/json; charset=utf-8" }); res.end(JSON.stringify(j)); };
      // chỉ nhận application/json: trang web lạ gửi chéo sang localhost sẽ bị trình duyệt chặn ở bước preflight
      if (!/^application\/json/.test(req.headers["content-type"] || "")) return tra(415, { ok: false, loi: "cần application/json" });
      try {
        const j = JSON.parse(body), kx = ALIAS[j.kenh];
        if (!kx) return tra(400, { ok: false, loi: "kênh lạ" });
        const ds = Array.isArray(j.ds) ? j.ds.filter((s) => typeof s === "string" && /^tap-\d+[a-z0-9-]*$/.test(s)) : [];
        if (!j.mac_dinh && !ds.length) return tra(400, { ok: false, loi: "danh sách trống" });
        const r = await chay("xep", kx, ...(j.mac_dinh ? ["--mac-dinh"] : ds));
        console.log(`[${luc()}] xếp ${kx}: ${(r.out || r.err || "").trim()}`);
        return r.e ? tra(500, { ok: false, loi: (r.err || r.e.message).trim() }) : tra(200, { ok: true });
      } catch (e) { return tra(400, { ok: false, loi: e.message }); }
    }
    if (u.pathname !== "/" && u.pathname !== "/bang.html") { res.writeHead(404); return res.end(); }
    if (u.searchParams.has("kiem")) { lanKiem = 0; await kiemNen(); } // ?kiem: ép kiểm công khai ngay
    else kiemNen();
    const r = await chay("quet");
    if (r.e) console.error(`[${luc()}] quét lỗi: ${(r.err || r.e.message).trim()}`);
    let page = existsSync(join(HERE, "bang.html")) ? readFileSync(join(HERE, "bang.html"), "utf8") : "<p>chưa có bang.html</p>";
    page = page.replace("</body>", () => TUDONG + "</body>");
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    res.end(page);
  }).listen(port, "127.0.0.1", () => console.log(`bảng động: http://localhost:${port}  (F5 = quét lại; ?kiem = kiểm công khai ngay)`))
    .on("error", (e) => { console.error(e.code === "EADDRINUSE" ? `cổng ${port} đang bận (server đã chạy rồi?)` : e.message); process.exit(1); });
} else {
  console.error("lệnh: quet [kenh] | ghi <kenh> <slug> <trang_thai> ... | xem [kenh] [--short] | lich [--ngay N] | can-xu-ly | kiem [kenh] [--het] | da-dang <kenh> | html | serve [--port N]");
  process.exit(1);
}
