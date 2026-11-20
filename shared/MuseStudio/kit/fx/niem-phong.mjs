// `niem-phong`: con dấu sáp đỏ đóng xuống một nhãn giấy, kèm vòng sóng và mảnh sáp văng. Dùng cho câu chốt, chuyển đoạn, kết luận.
// Tham số: x, y (tâm), r (bán kính, 80), label, color, rotate
import { when, r3, esc } from "./_util.mjs";

const niemPhong = {
  id: "niem-phong",
  cat: "accent",
  label: "Con dấu sáp đóng xuống nhãn giấy, vòng sóng + mảnh sáp văng (x, y, r, label, rotate)",
  run(ctx, o) {
    const { t, d } = when(ctx, o, 0.5);
    const id = ctx.id;
    const x = o.x ?? 960, y = o.y ?? 300, r = o.r ?? 86;
    const red = o.color || "#a2492f", ink = "#22302b";
    const rot = o.rotate ?? -12;
    const bits = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.3;
      const dx = r3(Math.cos(a) * (r + 34)), dy = r3(Math.sin(a) * (r + 34));
      bits.push(`<div id="${id}-b${i}" style="position:absolute;left:${x + r - 7}px;top:${y + r - 7}px;width:14px;height:14px;border-radius:3px;background:${red};opacity:0"></div>`);
      bits.push(`JS:tl.set(q('#${id}-b${i}'),{opacity:1},${r3(t)});tl.fromTo(q('#${id}-b${i}'),{x:0,y:0,rotation:0},{x:${dx},y:${dy},rotation:${180 + i * 20},duration:.5,ease:'power2.out',immediateRender:false},${r3(t)});tl.to(q('#${id}-b${i}'),{opacity:0,duration:.3},${r3(t + .5)});`);
    }
    const html = `<div id="${id}" style="position:absolute;left:${x - r - 26}px;top:${y - r - 26}px;width:${(r + 26) * 2}px;height:${(r + 26) * 2}px;pointer-events:none;opacity:0" data-layout-allow-overlap>
      <div id="${id}-ring" style="position:absolute;left:${r + 26 - r}px;top:${r + 26 - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;border:8px solid ${red};opacity:0"></div>
      <div id="${id}-seal" style="position:absolute;left:${r + 26 - r}px;top:${r + 26 - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle at 34% 28%,#c4573a,${red} 62%,#7d3522 100%);border:5px solid #6f2f1e;transform:rotate(${rot}deg);opacity:0;display:flex;align-items:center;justify-content:center;font-family:'Courier New',monospace;font-weight:700;font-size:${Math.max(13, Math.round(r * 0.3))}px;color:#f6e3c8;letter-spacing:1px;text-align:center;line-height:1.1">${esc(o.label || "ĐÃ KIỂM")}</div>
    </div>${bits.filter((b) => !b.startsWith("JS:")).join("")}`;
    let js = `      tl.set(q('#${id}'),{opacity:1},${r3(t)});
      tl.fromTo(q('#${id}-seal'),{scale:2.4,opacity:0},{scale:1,opacity:1,duration:.32,ease:'power3.in',immediateRender:false},${r3(t)});
      tl.to(q('#${id}-ring'),{opacity:1,duration:.08},${r3(t + .3)});
      tl.fromTo(q('#${id}-ring'),{scale:.6,opacity:.9},{scale:2.1,opacity:0,duration:.7,ease:'power2.out',immediateRender:false},${r3(t + .3)});\n`;
    for (const b of bits) if (b.startsWith("JS:")) js += `      ${b.slice(3)}\n`;
    js += `      tl.to(q('#${id}'),{opacity:0,duration:.35},${r3(t + Math.min(d, 2.2))});`;
    return { over: html, js };
  },
};

export default niemPhong;
