# Trộn lại tiếng một tập theo hợp đồng main.gd: giọng [id].wav đặt ở t0 (timeline.json), nhac.ogg -3 dB từ 0 s.
#   python tron_tieng.py <thư mục tập>   → work/tieng.wav, renders/final.mp4 thay tiếng (-c:v copy), giữ bản cũ final-cam.mp4
import json, subprocess, sys, wave, os
sys.stdout.reconfigure(encoding="utf-8")
import numpy as np

TAP = sys.argv[1]
G = os.path.join(TAP, "godot")
SR = 44100
tl = json.load(open(os.path.join(G, "timeline.json"), encoding="utf-8"))
n = int((tl["dur"] + 1) * SR)
mix = np.zeros((n, 2), np.float32)


def doc(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2)


nh = doc(os.path.join(G, "nhac.ogg")) * (10 ** (-3 / 20))
m = min(len(nh), n)
mix[:m] += nh[:m]
thieu = []
for c in tl["cau"]:
    p = os.path.join(G, "voice", c["id"] + ".wav")
    if not os.path.exists(p):
        thieu.append(c["id"]); continue
    v = doc(p)
    i = int(c["t0"] * SR)
    k = min(len(v), n - i)
    mix[i:i + k] += v[:k]
np.clip(mix, -1, 1, out=mix)
out = os.path.join(TAP, "work", "tieng.wav")
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
f = os.path.join(TAP, "renders", "final.mp4")
cam = os.path.join(TAP, "renders", "final-cam.mp4")
os.replace(f, cam)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", cam, "-i", out, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                "-af", "volume=3dB", "-c:a", "aac", "-b:a", "192k", "-shortest", f], check=True)
print("thiếu giọng:", thieu or "không", "→", f)
