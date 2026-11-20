// Quét chủ đề đang nóng (hôm nay / tuần / tháng) để chọn đề tài ăn ké view và ăn tìm kiếm.
//   node hot.mjs [--seed "bóng đá,bóng đá việt nam"] [--out <file.md>] [--json <file.json>]
// Nguồn (không cần trình duyệt, không cần khoá API):
//   Google Trends VN (RSS ngày) · RSS báo thể thao · YouTube tìm kiếm lọc hôm nay/tuần/tháng xếp theo view
//   · YouTube gợi ý tìm kiếm (autocomplete) cho các tên nóng và câu hỏi dài.
import { writeFileSync } from "fs";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SEEDS = arg("--seed", "bóng đá,bóng đá việt nam,ngoại hạng anh,champions league").split(",").map((s) => s.trim()).filter(Boolean);
const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36", "Accept-Language": "vi-VN,vi;q=0.9" };
const NEWS = [
  "https://vnexpress.net/rss/the-thao.rss",
  "https://cdn.24h.com.vn/upload/rss/bongda.rss",
  "https://thanhnien.vn/rss/the-thao.rss",
];
// lọc: hôm nay / tuần này / tháng này, xếp theo lượt xem
const SP = { "hôm nay": "CAMSBAgCEAE%3D", "tuần": "CAMSBAgDEAE%3D", "tháng": "CAMSBAgEEAE%3D" };
const SPORT = /bóng|đá|cup|cúp|league|liga|serie|bundesliga|fifa|uefa|aff|sea games|u\d\d|hlv|cầu thủ|tuyển|world cup|ballon|quả bóng vàng|messi|ronaldo|mbapp|haaland|yamal|kane|salah|man utd|man city|arsenal|chelsea|liverpool|barca|barcelona|real|bayern|psg|juventus|inter|milan|v-league|v.league|công an hà nội|hà nội fc|thể công|nam định|hagl|quang hải|tiến linh|xuân son|kim sang|park hang/i;
const STOP = new Set(["Tôi", "Anh", "Chị", "Em", "Ông", "Bà", "Những", "Các", "Một", "Khi", "Sau", "Trước", "Vì", "Tại", "Với", "Trong", "Người", "Đội", "Trận", "Cầu", "Clip", "Video", "Highlights", "Trực", "Live", "Bình", "Nhận", "Kết", "Lịch", "Tin", "Bảng", "HLV", "CLB", "Có", "Không", "Đây", "Ai", "Vào", "Lần", "Đã", "Sẽ", "Thua", "Thắng", "Hòa", "Chủ", "Blues", "League", "Cup", "FC", "Nhận", "Dự", "Xem", "Full", "Official", "Extended", "Pens"]);
const NOISE = new Set("highlights highlight trực tiếp live vs bóng đá hôm nay full match bình luận tiếng việt the of và của với trong trận đấu clip video 2026 2025 26/27 25/26 fc official extended đá cup league | - / : ngày lúc giờ h00 h30 phút tin nóng mới nhất".split(" "));

const get = async (u) => { try { const r = await fetch(u, { headers: UA, signal: AbortSignal.timeout(20000) }); return r.ok ? await r.text() : ""; } catch { return ""; } };
const MARK = { grave: "̀", acute: "́", circ: "̂", tilde: "̃" };
const unx = (s) => s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&([a-zA-Z])(grave|acute|circ|tilde);/g, (_, c, m) => (c + MARK[m]).normalize("NFC")).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/<[^>]+>/g, "").trim();
const tag = (x, t) => [...x.matchAll(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`, "g"))].map((m) => unx(m[1]));

async function trends() {
  const x = await get("https://trends.google.com/trending/rss?geo=VN");
  return x.split("<item>").slice(1).map((it) => ({
    q: tag(it, "title")[0], traffic: tag(it, "ht:approx_traffic")[0] || "", tin: tag(it, "ht:news_item_title").slice(0, 2),
  })).map((t) => ({ ...t, the_thao: SPORT.test(t.q + " " + t.tin.join(" ")) }));
}

async function news() {
  const out = [];
  for (const u of NEWS) {
    const x = await get(u);
    for (const it of x.split("<item>").slice(1)) {
      const title = tag(it, "title")[0], d = new Date(tag(it, "pubDate")[0] || 0);
      if (title && Date.now() - d < 48 * 3600e3) out.push({ title, nguon: new URL(u).hostname, gio: d });
    }
  }
  return out;
}

const viewsNum = (s) => Number(String(s || "").replace(/[^\d]/g, "")) || 0;
function ytVideos(html) {
  const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
  if (!m) return [];
  const out = [];
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (o && typeof o === "object") {
      if (o.videoRenderer) {
        const v = o.videoRenderer;
        out.push({ title: v.title?.runs?.[0]?.text || "", kenh: v.ownerText?.runs?.[0]?.text || "", view: viewsNum(v.viewCountText?.simpleText),
          luc: v.publishedTimeText?.simpleText || "", id: v.videoId, live: /trực tiếp|live/i.test(v.publishedTimeText?.simpleText || "") });
      }
      Object.values(o).forEach(walk);
    }
  };
  walk(JSON.parse(m[1]));
  return out;
}
async function ytSearch(q, sp) {
  return ytVideos(await get(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}${sp ? `&sp=${sp}` : ""}&hl=vi&gl=VN`));
}
async function suggest(q) {
  const t = await get(`https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=vi&gl=VN&q=${encodeURIComponent(q)}`);
  try { return JSON.parse(t)[1] || []; } catch { return []; }
}

// tên riêng: cụm 1–3 từ viết hoa chữ đầu, bỏ tiêu đề VIẾT HOA TOÀN BỘ
function names(title) {
  const up = (title.match(/\p{Lu}/gu) || []).length, low = (title.match(/\p{Ll}/gu) || []).length;
  if (up > low) return [];
  const words = title.replace(/[|:,.!?()"'“”‘’\[\]–-]/g, " ").split(/\s+/).filter(Boolean);
  const res = [];
  for (let i = 0; i < words.length; i++) {
    if (!/^\p{Lu}/u.test(words[i]) || STOP.has(words[i])) continue;
    let j = i; while (j + 1 < words.length && j - i < 2 && /^\p{Lu}/u.test(words[j + 1])) j++;
    const n = words.slice(i, j + 1).join(" ");
    if (n.length >= 3) res.push(n);
    i = j;
  }
  return res;
}

const main = async () => {
  const [tr, nw] = await Promise.all([trends(), news()]);
  const yt = {};
  for (const [k, sp] of Object.entries(SP)) {
    const all = [];
    for (const s of SEEDS) all.push(...(await ytSearch(s, sp)));
    const seen = new Set();
    yt[k] = all.filter((v) => v.id && !seen.has(v.id) && seen.add(v.id)).sort((a, b) => b.view - a.view);
  }
  // đếm tên trong tin 48 giờ + video tuần
  const cnt = new Map();
  const add = (n, w, src) => { const c = cnt.get(n) || { n, diem: 0, tin: 0, yt: 0, view: 0 }; c.diem += w; c[src]++; cnt.set(n, c); };
  for (const a of nw) for (const n of new Set(names(a.title))) add(n, 2, "tin");
  for (const v of yt["tuần"].slice(0, 60)) for (const n of new Set(names(v.title))) { add(n, 1 + Math.log10(1 + v.view) / 3, "yt"); cnt.get(n).view += v.view; }
  for (const t of tr.filter((t) => t.the_thao)) for (const n of new Set([t.q, ...t.tin.flatMap(names)])) add(n, 5, "tin");
  // cụm từ lặp nhiều trong tiêu đề video tuần/tháng (bắt được cả tiêu đề VIẾT HOA): bigram/trigram, trọng số theo view
  const cum = new Map();
  for (const v of [...yt["tuần"], ...yt["tháng"]]) {
    const w = v.title.toLowerCase().replace(/[|:,.!?()"'“”‘’\[\]–🔴🛑]/g, " ").split(/\s+/).filter((x) => x && !/^\d+[-–]\d+$/.test(x));
    const seen = new Set();
    for (let k = 2; k <= 3; k++) for (let i = 0; i + k <= w.length; i++) {
      const g = w.slice(i, i + k);
      if (NOISE.has(g[0]) || NOISE.has(g[k - 1]) || g.every((x) => NOISE.has(x))) continue;
      const key = g.join(" "); if (seen.has(key)) continue; seen.add(key);
      const c = cum.get(key) || { cum: key, so: 0, view: 0, kenh: new Set() }; c.so++; c.view += v.view; c.kenh.add(v.kenh); cum.set(key, c);
    }
  }
  // cần ≥2 kênh khác nhau; bỏ cụm con khi cụm dài hơn chứa nó có cùng số video (cùng một nguồn)
  const cands = [...cum.values()].filter((c) => c.kenh.size >= 2);
  const cumTop = cands.filter((c) => !cands.some((d) => d !== c && d.cum.includes(c.cum) && d.so === c.so))
    .sort((a, b) => b.view - a.view).slice(0, 25).map(({ kenh, ...c }) => ({ ...c, kenh: kenh.size }));
  const top = [...cnt.values()].filter((c) => c.tin + c.yt >= 2).sort((a, b) => b.diem - a.diem).slice(0, 15);
  // nhu cầu tìm kiếm: gợi ý YouTube cho tên nóng + câu hỏi dài
  for (const c of top.slice(0, 10)) c.goi_y = (await suggest(c.n.toLowerCase())).slice(0, 8);
  const hoi = {};
  for (const p of ["tại sao", "vì sao", "ai là", "tiểu sử", "lịch sử", "câu chuyện", "huyền thoại", "so sánh"]) hoi[p] = (await suggest(`${p} ${SEEDS[0]}`)).slice(0, 8);

  const fmt = (n) => n.toLocaleString("vi-VN");
  const L = [];
  const now = new Date();
  L.push(`# Chủ đề nóng ${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`, "", `Hạt giống: ${SEEDS.join(", ")}`, "");
  L.push("## 1. Tên đang nóng (tin 48 giờ + video tuần + Google Trends)", "", "| tên | điểm | số tin | số video tuần | view video tuần | gợi ý tìm kiếm YouTube |", "|---|---|---|---|---|---|");
  for (const c of top) L.push(`| ${c.n} | ${c.diem.toFixed(1)} | ${c.tin} | ${c.yt} | ${fmt(c.view)} | ${(c.goi_y || []).join(" · ")} |`);
  L.push("", "## 1b. Cụm từ lặp trong tiêu đề video nhiều view (tuần + tháng)", "", "| cụm | số video | số kênh | tổng view |", "|---|---|---|---|");
  for (const c of cumTop) L.push(`| ${c.cum} | ${c.so} | ${c.kenh} | ${fmt(c.view)} |`);
  L.push("", "## 2. Google Trends Việt Nam hôm nay", "", "| tìm kiếm | lượt | thể thao? | tin liên quan |", "|---|---|---|---|");
  for (const t of tr) L.push(`| ${t.q} | ${t.traffic} | ${t.the_thao ? "**có**" : ""} | ${t.tin.join(" / ")} |`);
  for (const [k, v] of Object.entries(yt)) {
    L.push("", `## 3. YouTube: video nhiều view nhất (${k})`, "", "| view | lúc đăng | kênh | tiêu đề |", "|---|---|---|---|");
    for (const x of v.slice(0, 15)) L.push(`| ${fmt(x.view)} | ${x.luc} | ${x.kenh} | ${x.title.replace(/\|/g, "/")} |`);
  }
  L.push("", "## 4. Câu hỏi người xem đang gõ (gợi ý YouTube)", "");
  for (const [p, v] of Object.entries(hoi)) L.push(`- **${p}**: ${v.join(" · ") || "(trống)"}`);
  L.push("", "## 5. Tin thể thao 48 giờ qua", "");
  for (const a of nw.slice(0, 40)) L.push(`- ${a.title} (${a.nguon})`);
  const md = L.join("\n") + "\n";
  const out = arg("--out"); if (out) writeFileSync(out, md); else process.stdout.write(md);
  const js = arg("--json"); if (js) writeFileSync(js, JSON.stringify({ trends: tr, news: nw, yt, top, cum: cumTop, hoi }, null, 1));
};
main();
