import os
import sys
import numpy as np
from collections import deque
from PIL import Image, ImageDraw, ImageOps


def flood_remove_bg(crop_arr: np.ndarray, tol: int = 22) -> Image.Image:
    """Remove uniform background via border flood-fill, keeping dark interior outlines intact."""
    h, w, _ = crop_arr.shape
    bg_color = crop_arr[0, 0, :3].astype(np.int32)
    rgb = crop_arr[:, :, :3].astype(np.int32)
    dist = np.max(np.abs(rgb - bg_color), axis=2)
    is_bg = dist <= tol

    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        if is_bg[0, x]:
            visited[0, x] = True
            q.append((0, x))
        if is_bg[h - 1, x]:
            visited[h - 1, x] = True
            q.append((h - 1, x))
    for y in range(h):
        if is_bg[y, 0]:
            visited[y, 0] = True
            q.append((y, 0))
        if is_bg[y, w - 1]:
            visited[y, w - 1] = True
            q.append((y, w - 1))

    while q:
        cy, cx = q.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and is_bg[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))

    out = crop_arr.copy()
    out[visited, 3] = 0
    return Image.fromarray(out)


def extract_quadrant_parts(sheet_path: str, out_dir: str, regions: dict, tol: int = 22):
    """
    Extract isolated modular parts from a uniform-background sprite sheet.
    regions: dict of {part_name: (x_frac0, y_frac0, x_frac1, y_frac1)}
    """
    os.makedirs(out_dir, exist_ok=True)
    im = Image.open(sheet_path).convert("RGBA")
    arr = np.array(im)
    h, w, _ = arr.shape
    clean_sheet = flood_remove_bg(arr, tol=tol)

    saved = {}
    for name, (x0, y0, x1, y1) in regions.items():
        crop = clean_sheet.crop((int(w * x0), int(h * y0), int(w * x1), int(h * y1)))
        bbox = crop.getbbox()
        if bbox:
            crop = crop.crop(bbox)
        out_path = os.path.join(out_dir, f"{name}.png")
        crop.save(out_path)
        saved[name] = (out_path, crop.size)
        print(f"Saved {name}: {crop.size} -> {out_path}")
    return saved


if __name__ == "__main__":
    print("Use flood_remove_bg() or extract_quadrant_parts() from this module.")
