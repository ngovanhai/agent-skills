import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const LIB = "C:/Users/anhha/.claude/skills/nhan-vat-chibi/scripts/lib.mjs";
const { rig, loadChars, lookOf } = await import(pathToFileURL(LIB).href);
const { figure, JOINTS } = rig;
const BOOK = loadChars();

const outDir = "C:/Users/anhha/MuseStudio/the-thao/tap-23-real-madrid-di-stefano-5-cup-c1/godot/chars";
fs.mkdirSync(outDir, { recursive: true });

const charIds = ["bd-teo-baotang", "bd-di-stefano", "bd-bernabeu", "bd-puskas", "bd-gento", "bd-kopa"];
const EXPR = ["vui", "binh", "gian", "soc", "quyet-tam", "ko", "dac-y", "ngai"];

function parse(src) {
  const root = { tag: "#root", attrs: "", kids: [] };
  const st = [root];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[5] !== undefined) { if (m[5].trim()) st.at(-1).kids.push({ text: m[5] }); continue; }
    if (!m[2]) continue;
    if (m[1]) { st.pop(); continue; }
    const n = { tag: m[2], attrs: m[3], kids: [] };
    st.at(-1).kids.push(n);
    if (!m[4]) st.push(n);
  }
  return root;
}
const ser = (n) => (n.text !== undefined ? n.text : `<${n.tag}${n.attrs}>${n.kids.map(ser).join("")}</${n.tag}>`);
const idOf = (n) => (n.attrs && (n.attrs.match(/\bid="([^"]+)"/) || [])[1]) || "";

function build(id, o, expr) {
  const p = "c";
  const svg = figure(p, 400, { ...o, expr });
  const tree = parse(svg);
  const jointName = (n) => { const i = idOf(n); return i.startsWith(p + "-") && JOINTS.includes(i.slice(2)) && n.tag === "g" ? i.slice(2) : null; };
  const hasJoint = (n) => (n.kids || []).some((k) => jointName(k) || hasJoint(k));
  const defs = [];
  const grabDefs = (n) => { for (const k of n.kids || []) { if (k.tag === "defs") defs.push(ser(k)); else grabDefs(k); } };
  grabDefs(tree);
  const joints = [];
  const segs = [];
  function walkJoint(n, name, parent) {
    const tr = n.attrs.match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
    joints.push({ name, parent, pos: [+tr[1], +tr[2]] });
    const order = [];
    let cur = [];
    const flush = () => { if (cur.length) { order.push({ seg: cur.join("") }); cur = []; } };
    function walk(node, wraps) {
      for (const k of node.kids) {
        const jn = k.text === undefined ? jointName(k) : null;
        if (jn) { flush(); order.push({ joint: jn }); walkJoint(k, jn, name); }
        else if (k.text === undefined && hasJoint(k)) walk(k, [...wraps, k]);
        else if (k.tag !== "defs") {
          let s = ser(k);
          for (let i = wraps.length - 1; i >= 0; i--) s = `<${wraps[i].tag}${wraps[i].attrs}>${s}</${wraps[i].tag}>`;
          cur.push(s);
        }
      }
      flush();
    }
    walk(n, []);
    segs.push({ name, order });
  }
  for (const k of tree.kids[0].kids) if (jointName(k) === "hip") { walkJoint(k, "hip", null); break; }
  return { defs: defs.join(""), joints, segs };
}

function grabHead(o, expr) {
  const svg = figure("c", 400, { ...o, expr });
  const tree = parse(svg);
  let head = null;
  function find(n) {
    if (idOf(n) === "c-head") { head = n; return; }
    for (const k of n.kids || []) if (!head) find(k);
  }
  find(tree);
  const out = [];
  for (const k of head.kids) if (!idOf(k).startsWith("c-")) out.push(ser(k));
  return out.join("");
}

for (const id of charIds) {
  const look = lookOf(id, BOOK);
  const base = build(id, look, "binh");
  const faces = {};
  for (const e of EXPR) faces[e] = grabHead(look, e);
  const data = { id, view: [400, 620], defs: base.defs, joints: base.joints, segs: base.segs, faces };
  fs.writeFileSync(path.join(outDir, `${id}.json`), JSON.stringify(data));
  console.log("Exported", id);
}
