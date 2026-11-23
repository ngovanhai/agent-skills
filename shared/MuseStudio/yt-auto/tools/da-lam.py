#!/usr/bin/env python3
"""In mọi chủ đề một kênh đã đăng, đang làm hoặc đã xếp hàng, để chọn chủ đề mới không bị trùng.

    python3 da-lam.py teo-tuu-lau
    python3 da-lam.py lai-la-teo-day

Gom từ: state.json (tiêu đề video dài đã đăng), series/<kênh>.json (loạt đang làm, loạt cũ, hàng chờ chủ đề),
series/1h-<kênh>.json (hàng chờ video 1 tiếng) và thư mục project trên máy. Chỉ đọc, không ghi gì.
"""

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DU_AN = {"teo-tuu-lau": os.path.expanduser("~/MuseStudio/kiem-hiep"), "lai-la-teo-day": os.path.expanduser("~/MuseStudio/videos")}


def doc(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def main():
    kenh = sys.argv[1] if len(sys.argv) > 1 else ""
    if kenh not in DU_AN:
        sys.exit(f"dùng: da-lam.py <{' | '.join(DU_AN)}>")

    print("== Video dài đã đăng")
    for v in doc(os.path.join(ROOT, "state.json")).get(kenh, {}).values():
        if v.get("kind") == "long":
            print(f"  {(v.get('scheduled') or '')[:10]}  {v.get('title')}")

    loat = doc(os.path.join(ROOT, "series", f"{kenh}.json"))
    print("\n== Loạt 3 tập")
    for l in loat.get("cac_loat_truoc", []):
        print(f"  (xong) {l.get('chu_de')}")
    if loat.get("chu_de"):
        print(f"  (đang) {loat['chu_de']}  [{', '.join(loat.get('tap', []))}]")
    for c in loat.get("hang_cho_chu_de", []):
        print(f"  (chờ)  {c}")

    print("\n== Hàng chờ video 1 tiếng")
    for v in doc(os.path.join(ROOT, "series", f"1h-{kenh}.json")).get("video", []):
        print(f"  ({v.get('trang_thai')}) {v.get('slug')}: {v.get('ten')}")

    print("\n== Thư mục project trên máy")
    goc = DU_AN[kenh]
    ten = sorted(d for d in os.listdir(goc) if os.path.isdir(os.path.join(goc, d)) and not d.startswith((".", "_")))
    print("  " + ", ".join(ten))


if __name__ == "__main__":
    main()
