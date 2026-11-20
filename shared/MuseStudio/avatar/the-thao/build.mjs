// Builds the "Tèo Thể Thao" channel art as two HyperFrames compositions:
//   the-thao/avatar/index.html (800x800) and the-thao/banner/index.html (2560x1440).
// Banner safe area (all devices) is the centred 1546x423 box: x 507–2053, y 508–931.
// Snapshot: npx --yes hyperframes@0.8.172 snapshot avatar/the-thao/<avatar|banner> --at 0.5 --no-end -o <out> --describe false
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { join } from "path";
const here = fileURLToPath(new URL(".", import.meta.url));
const kit = join(here, "../../kit");

const teo = readFileSync(join(here, "teo-the-thao.svg"), "utf8")
  .replace(/\swidth="500" height="760"/, "")
  .replace("<svg", '<svg preserveAspectRatio="xMidYMax meet" style="width:100%;height:100%;display:block;overflow:visible"');

function prepare(name, w, h) {
  const out = join(here, name);
  mkdirSync(join(out, "assets/fonts"), { recursive: true });
  for (const f of readdirSync(join(kit, "fonts"))) copyFileSync(join(kit, "fonts", f), join(out, "assets/fonts", f));
  if (!existsSync(join(out, "package.json"))) writeFileSync(join(out, "package.json"), JSON.stringify({ name, private: true, type: "module" }));
  return (body) => writeFileSync(join(out, "index.html"), `<!doctype html>
<html lang="vi"><head><meta charset="UTF-8" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
  @font-face { font-family: "Space Grotesk"; src: url("assets/fonts/Space_Grotesk-Variable.ttf") format("truetype"); font-weight: 300 700; font-display: block; }
  @font-face { font-family: "Inter"; src: url("assets/fonts/Inter-Variable.ttf") format("truetype"); font-weight: 100 900; font-display: block; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${w}px; height: ${h}px; overflow: hidden; background: #000; }
  #root { position: relative; width: ${w}px; height: ${h}px; overflow: hidden; font-family: "Space Grotesk", sans-serif; }
</style></head>
<body>
<div id="root" data-composition-id="${name}" data-start="0" data-duration="1" data-width="${w}" data-height="${h}">
  <div class="clip" data-start="0" data-duration="1" data-track-index="0" style="position:absolute;inset:0;">
${body}
  </div>
</div>
<script>window.__timelines = window.__timelines || {}; window.__timelines["${name}"] = gsap.timeline({ paused: true }); window.__timelines["${name}"].set({}, {}, 1);</script>
</body></html>`);
}

const stripes = (h) => `repeating-linear-gradient(90deg, #2E9E46 0 ${h}px, #36B04F ${h}px ${2 * h}px)`;

// ---- avatar: head + ball inside YouTube's round crop, on a pitch with a sunburst
{
  const S = 1.6, cx = 280, cy = 205; // midpoint of head (200,180) and ball (372,222)
  const left = 400 - cx * S, top = 395 - cy * S;
  prepare("avatar", 800, 800)(`
    <div style="position:absolute;inset:0;background:${stripes(100)};"></div>
    <div style="position:absolute;left:-350px;top:-370px;width:1500px;height:1500px;border-radius:50%;opacity:0.22;background:repeating-conic-gradient(#FFF6B0 0deg 7deg, transparent 7deg 16deg);"></div>
    <div style="position:absolute;left:110px;top:105px;width:580px;height:580px;border-radius:50%;border:14px solid rgba(255,255,255,0.75);"></div>
    <div style="position:absolute;left:170px;top:150px;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle, #FFE066 0%, rgba(255,205,0,0.0) 70%);"></div>
    <div style="position:absolute;left:${left}px;top:${top}px;width:${500 * S}px;height:${760 * S}px;">${teo}</div>`);
}

// ---- banner: night stadium, crowd, pitch; text + Tèo in the safe area
{
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const colors = ["#DA251D", "#FFCD00", "#FFFFFF", "#5B8DEF", "#FF8FA3", "#A6F28A"];
  const crowd = [];
  for (let y = 640; y < 920; y += 26) for (let x = -10; x < 2570; x += 26) {
    const c = colors[Math.floor(rnd() * colors.length)];
    crowd.push(`<circle cx="${x + rnd() * 12}" cy="${y + rnd() * 10}" r="${8 + rnd() * 4}" fill="${c}" opacity="${0.35 + rnd() * 0.3}"/>`);
  }
  const light = (x) => `
    <div style="position:absolute;left:${x - 360}px;top:-260px;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle, rgba(255,255,220,0.85) 0%, rgba(255,255,200,0.25) 30%, transparent 65%);"></div>
    <div style="position:absolute;left:${x - 70}px;top:60px;width:140px;height:70px;background:#FFFDE8;border:6px solid #111;border-radius:10px;box-shadow:0 0 60px 20px rgba(255,255,210,0.7);"></div>
    <div style="position:absolute;left:${x - 8}px;top:130px;width:16px;height:520px;background:#1B2340;"></div>`;
  const goal = `<svg viewBox="0 0 420 300" style="position:absolute;left:2100px;top:690px;width:420px;height:300px;">
    <defs><pattern id="net" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 0 L22 22 M22 0 L0 22" stroke="#fff" stroke-width="2" opacity="0.7"/></pattern></defs>
    <rect x="20" y="20" width="380" height="270" fill="url(#net)"/>
    <path d="M20 290 V20 H400 V290" fill="none" stroke="#111" stroke-width="22" stroke-linejoin="round"/>
    <path d="M20 290 V20 H400 V290" fill="none" stroke="#fff" stroke-width="12" stroke-linejoin="round"/></svg>`;
  const cup = `<svg viewBox="0 0 200 300" style="position:absolute;left:180px;top:620px;width:220px;height:330px;transform:rotate(-6deg);">
    <path d="M40 20 H160 Q160 130 100 150 Q40 130 40 20 Z" fill="#FFCD00" stroke="#111" stroke-width="8" stroke-linejoin="round"/>
    <path d="M40 40 Q0 40 10 80 Q20 110 55 110 M160 40 Q200 40 190 80 Q180 110 145 110" fill="none" stroke="#111" stroke-width="8"/>
    <rect x="86" y="148" width="28" height="60" fill="#FFCD00" stroke="#111" stroke-width="8"/>
    <rect x="50" y="206" width="100" height="40" rx="6" fill="#DA251D" stroke="#111" stroke-width="8"/>
    <rect x="35" y="244" width="130" height="34" rx="6" fill="#5A3825" stroke="#111" stroke-width="8"/>
    <path d="M70 40 Q70 100 92 120" fill="none" stroke="#FFF6B0" stroke-width="10" stroke-linecap="round"/></svg>`;
  const ball = (x, y, r, rot) => `<svg viewBox="-60 -60 120 120" style="position:absolute;left:${x}px;top:${y}px;width:${2 * r}px;height:${2 * r}px;transform:rotate(${rot}deg);">
    <circle r="56" fill="#fff" stroke="#111" stroke-width="6"/><path d="M0 -18 L17 -6 L11 15 L-11 15 L-17 -6 Z" fill="#111"/>
    <path d="M0 -18 L0 -52 M17 -6 L48 -16 M11 15 L30 44 M-11 15 L-30 44 M-17 -6 L-48 -16" stroke="#111" stroke-width="4"/></svg>`;
  const chip = (t, bg) => `<span style="display:inline-block;padding:10px 20px 7px;margin-right:14px;background:${bg};border:5px solid #000;box-shadow:6px 6px 0 #000;font-size:34px;font-weight:700;">${t}</span>`;
  prepare("banner", 2560, 1440)(`
    <div style="position:absolute;inset:0;background:linear-gradient(180deg, #0B1230 0%, #1B2A5E 45%, #2B3F86 60%);"></div>
    ${light(320)}${light(2240)}
    <svg style="position:absolute;left:0;top:0;width:2560px;height:1440px;"><rect x="0" y="620" width="2560" height="320" fill="#141B38"/>${crowd.join("")}</svg>
    <div style="position:absolute;left:0;top:930px;width:2560px;height:510px;background:${stripes(160)};border-top:10px solid #000;"></div>
    <div style="position:absolute;left:0;top:930px;width:2560px;height:14px;background:#fff;opacity:0.85;"></div>
    ${cup}${goal}${ball(430, 860, 60, 20)}${ball(2010, 902, 40, -30)}
    <div style="position:absolute;left:540px;top:500px;width:380px;height:560px;">${teo}</div>
    <div style="position:absolute;left:915px;top:515px;width:1140px;height:400px;background:rgba(11,18,48,0.88);border:6px solid #000;border-radius:28px;box-shadow:12px 12px 0 #000;"></div>
    <div style="position:absolute;left:955px;top:540px;width:1080px;">
      <div style="display:inline-block;padding:10px 26px 6px;background:#DA251D;color:#fff;font-size:40px;font-weight:700;text-transform:uppercase;border:5px solid #fff;transform:rotate(-2deg);">Tèo Thể Thao</div>
      <div style="margin-top:22px;font-size:118px;line-height:1;font-weight:700;color:#fff;text-transform:uppercase;-webkit-text-stroke:6px #000;paint-order:stroke fill;text-shadow:10px 10px 0 #000;">Cùng Tèo <span style="color:#FFCD00">ra sân!</span></div>
      <div style="margin-top:42px;white-space:nowrap;">${chip("Bóng đá", "#A6F28A")}${chip("Huyền thoại", "#FFCD00")}${chip("Kỷ lục", "#9EE6FF")}${chip("Video mới mỗi ngày", "#fff")}</div>
    </div>`);
}
console.log("avatar/the-thao/{avatar,banner}/index.html written");
