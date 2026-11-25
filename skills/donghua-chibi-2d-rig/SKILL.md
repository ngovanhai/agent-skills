---
name: donghua-chibi-2d-rig
description: >-
  End-to-end pipeline to design, extract, rig, and animate 2D Donghua/Chibi martial arts characters
  and layered Wuxia scenery in HTML5 Canvas 2D (60 FPS) with headless Chrome visual verification.
  Use when creating animated 2D Chibi/Donghua characters, modular sprite sheets, skeletal rigs,
  or Wuxia battle scenes.
---

# Donghua Chibi 2D Character & Scenery Rigging Skill

This skill packages the complete workflow for creating **2D Donghua / Heroic Chibi** characters with **true hierarchical skeletal animation**, **painted modular sprites**, **layered Wuxia scenery**, and **automated visual QA** via headless Chrome.

---

## Pipeline Overview

```
1. Design Blueprint (2.6-Head Heroic Chibi + Z-Order + Palette)
        ↓
2. Modular Part Generation (Head + Non-Overlapping Body Parts Sheet)
        ↓
3. Clean Extraction (scripts/extract_parts.py: Flood-Fill BG Removal + Chin Mask)
        ↓
4. Hierarchical Canvas 2D Rig + Scenery + VFX (Parent-Child Matrix)
        ↓
5. Mandatory Headless Chrome Screenshot Verification (Gather & Strike)
```

---

## Step 1: Character Design Rules (2.6-Head Heroic Chibi)

Avoid 1.5-head baby proportions for martial arts heroes. Use **2.6-head Heroic Chibi**:
- **Silhouette**: Inverted triangle (broad shoulders/fur pelt vs. narrow belted waist).
- **Line-weight & Ink**: Warm dark brown-black `#1C110E` (avoid harsh `#000000`). Outer silhouette `~3.2px`, inner details `~1.6px`.
- **Two Distinct Key Poses**:
  1. **Gather (`Mã Bộ`)**: Lower pelvis, lean torso back `-10°`, wide horse stance, striking arm coiled at waist holding energy orb, back arm guarding forward.
  2. **Strike (`Cung Bộ` Lunge)**: Translate pelvis forward `+X`, lean torso `+18°`–`+22°`, front knee bent forward, rear leg extended straight kicking up dust, back arm pulled behind for counter-balance, striking arm thrust straight `+X`.

---

## Step 2: Modular Part Sheet & Clean Extraction

When generating sprites with `image-generator`:
1. Generate the **Character Head** cleanly (or isolate from a turnaround sheet).
2. Generate a **separate Modular Body Parts Sheet** on a **solid uniform dark charcoal background (`#22252A`)** with **NO head** and generous empty spacing around each part:
   - `part_torso` (robe, collar, wolf fur, sash, plaque, torn hem)
   - `part_arm` (muscular arm + studded bracer + open striking palm)
   - `part_leg` (baggy trousers + criss-cross leg wraps + upturned boot)
   - `part_cape` (tattered 3-point cape)
3. **Never** use simple brightness thresholding to remove `#22252A` (it eats dark hair/outlines). Always use **border flood-fill (`scripts/extract_parts.py`)** so interior `#1C110E` outlines remain 100% opaque.

---

## Step 3: Hierarchical Skeletal Rigging & Scenery

### Z-Order & Parent-Child Matrix
Always nest child joints inside `ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ... ctx.restore();` so limbs never detach:
1. `cape_back` (child of `torso`, sways with `windForce`)
2. `arm_back` (child of `torso`, `filter = "brightness(0.72)"`)
3. `leg_back` (child of `pelvis`, `filter = "brightness(0.72)"`)
4. `leg_front` (child of `pelvis`)
5. `torso` (child of `pelvis`)
6. `head` (child of `torso` at neck pivot)
7. `arm_front` (child of `torso` at shoulder pivot) — extract `palmGlobalPos` using `ctx.getTransform()` so energy orbs, shockwaves, and dragon splines spawn **precisely from the palm**.

### Scenery & Dragon VFX Rules (Avoid Amateur Look)
- **Stars**: Render ONLY in the upper sky (`y < 320`, behind mountain ridges), never on the ground.
- **Mountains**: Use organic `quadraticCurveTo` craggy ridges with distant pagoda silhouettes and drifting `bezierCurveTo` mist clouds.
- **Pine Tree**: Gnarled S-curved trunk + scalloped multi-cluster needle fans (never flat ellipses).
- **Dragon Head Junction**: Attach a high-res painted `dragon_head.png` to the tip of the additive-glowing energy spline, and place a radial solar flare (`globalCompositeOperation = "lighter"`) over the neck junction so the seam blends seamlessly.
- **Image Preloading**: Always wait for `Promise.all(allPartImgs.map(...))` before calling `renderFrame()` in static/screenshot mode.

---

## Step 4: Mandatory Visual Verification (Headless Chrome)

Never report completion without visually inspecting both poses:
1. Support `?state=gather&p=1.0` and `?state=strike&p=0.9` URL parameters in the HTML.
2. Serve locally with `python -m http.server` and capture screenshots using Chrome headless:
   ```powershell
   Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList @(
     "--headless=new", "--disable-gpu", "--no-first-run",
     "--user-data-dir=$tmpProfile", "--window-size=1280,920",
     "--virtual-time-budget=1500", "--screenshot=verify_strike.png",
     "http://127.0.0.1:18938/rig.html?state=strike&p=0.9"
   ) -Wait -PassThru
   ```
3. Inspect `verify_gather.png` and `verify_strike.png` using `read_file` to verify zero overlapping seams, clean proportions, and cohesive lighting.
