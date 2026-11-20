// `kim-can`: mặt đồng hồ cân bằng đồng thau, kim quét từ 0 tới vạch, kèm nhãn khắc. Dùng cho cảnh cân, đo, con số.
// Tham số: x, y (tâm, mặc định 960/420), r (bán kính, 150), label, color, value (0–1 vị trí kim), sweep ('back' để kim quay lại)
import { when, r3, esc } from "./_util.mjs";

const kimCan = {
  id: "kim-can",
  cat: "accent",
  label: "Mặt cân đồng thau: kim quét tới vạch, vòng chia độ hiện dần, nhãn khắc (x, y, r, label, value, sweep)",
  run(ctx, o) {
    const { t, d } = when(ctx, o, 0.35);
    const id = ctx.id;
    const x = o.x ?? 960, y = o.y ?? 420, r = o.r ?? 150;
    const ink = "#22302b", brass = "#c9a227", paper = "#f3ede0";
    let ticks = "";
    for (let i = 0; i <= 12; i++) {
      const a = (-220 + i * 20) * (Math.PI / 180);
      const x1 = r3(Math.cos(a) * (r - 8)), y1 = r3(Math.sin(a) * (r - 8));
      const x2 = r3(Math.cos(a) * (r - (i % 3 === 0 ? 34 : 22))), y2 = r3(Math.sin(a) * (r - (i % 3 === 0 ? 34 : 22)));
      ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="${i % 3 === 0 ? 5 : 2}" opacity=".85"/>`;
    }
    const val = Math.max(0, Math.min(1, o.value ?? 0.82));
    const angle = -220 + 260 * val;
    const html = `<div id="${id}" style="position:absolute;left:${x - r - 30}px;top:${y - r - 30}px;width:${(r + 30) * 2}px;height:${(r + 30) * 2}px;pointer-events:none;opacity:0" data-layout-allow-overlap>
      <svg viewBox="-${r + 30} -${r + 30} ${(r + 30) * 2} ${(r + 30) * 2}" style="width:100%;height:100%;overflow:visible">
        <circle r="${r}" fill="${paper}" stroke="${ink}" stroke-width="9"/>
        <circle r="${r - 12}" fill="none" stroke="${brass}" stroke-width="6" opacity=".7"/>
        ${ticks}
        <g id="${id}-needle" style="transform-origin:0px 0px;transform:rotate(-220deg)">
          <path d="M0 0 L0 -${r + 10}" stroke="#a2492f" stroke-width="7" stroke-linecap="round"/>
          <circle r="13" fill="${brass}" stroke="${ink}" stroke-width="5"/>
        </g>
      </svg>
      <div style="position:absolute;left:0;top:${r + 44}px;width:${(r + 30) * 2}px;text-align:center;font-family:'Courier New',monospace;font-size:26px;letter-spacing:2px;color:${ink}">${esc(o.label || "93 KG")}</div>
    </div>`;
    const js = `      tl.set(q('#${id}'),{opacity:1},${r3(t)});
      tl.fromTo(q('#${id}'),{scale:.7},{scale:1,duration:.45,ease:'back.out(1.6)',immediateRender:false},${r3(t)});
      tl.fromTo(q('#${id}-needle'),{rotation:-220},{rotation:${r3(o.sweep === "back" ? angle - 40 : angle)},duration:${r3(Math.min(1.4, Math.max(.6, d * .6)))},ease:'power3.out',immediateRender:false},${r3(t + .15)});
      tl.to(q('#${id}'),{opacity:0,duration:.3},${r3(t + d - .3)});`;
    return { over: html, js };
  },
};

export default kimCan;
