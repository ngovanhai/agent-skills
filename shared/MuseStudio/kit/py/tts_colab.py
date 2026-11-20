# Same job as tts.py, but synthesized on a Colab T4 GPU through the Colab CLI (google-colab-cli).
# Only scenes whose cache key changed are sent; the wavs (+ .key stamps) come back to the job's
# "out" paths, so make.mjs sees exactly what a local tts.py run would leave behind.
#   python kit/py/tts_colab.py <job.json>
# env: COLAB_CLI (colab.exe), COLAB_SESSION (default "vieneu"), COLAB_GPU (default T4),
#      COLAB_KEEP=1 keeps the VM after the run, VIENEU_DIR (local repo: tts helpers + pinned commit)
import os, sys, json, time, hashlib, zipfile, tempfile, subprocess
from pathlib import Path

KIT_PY = Path(__file__).resolve().parent
REPO = Path(os.environ.get("VIENEU_DIR") or str(Path.home() / "VieNeu-TTS"))
COLAB = os.environ.get("COLAB_CLI") or str(Path.home() / ".colab-cli/Scripts/colab.exe")
SESSION = os.environ.get("COLAB_SESSION") or "vieneu"
GPU = os.environ.get("COLAB_GPU") or "T4"
HOME = Path(os.environ.get("VIENEU_HOME") or (Path.home() / ".vieneu"))
R = "/content/tts"  # remote work dir
ENV = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUTF8": "1"}


def colab(*argv, stdin=None, check=True):
    r = subprocess.run([COLAB, *argv], input=stdin, capture_output=True, text=True, encoding="utf-8", errors="replace", env=ENV)
    if check and r.returncode != 0:
        sys.exit(f"colab {argv[0]} failed ({r.returncode}):\n{r.stdout}\n{r.stderr}")
    return r.stdout


def rexec(code, timeout=60):
    return colab("exec", "-s", SESSION, "--timeout", str(timeout), stdin=code)


def pinned_spec():
    sha = subprocess.run(["git", "-C", str(REPO), "rev-parse", "HEAD"], capture_output=True, text=True).stdout.strip()
    dirty = subprocess.run(["git", "-C", str(REPO), "status", "--porcelain", "--", "src"], capture_output=True, text=True).stdout.strip()
    if dirty:
        print("! local VieNeu has uncommitted changes in src/ — Colab uses the pushed commit", flush=True)
    # no [cuda] extra: it pins torch 2.8.0, which breaks Colab's preinstalled torchvision; Colab's own torch does CUDA
    url = "git+https://github.com/pnnbao97/VieNeu-TTS.git"
    return [f"vieneu @ {url}@{sha}" if sha else "vieneu", "transformers==4.57.6", "safetensors"]


def main():
    job = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    todo = []
    for it in job["lines"]:
        out = Path(it["out"])
        key = hashlib.sha1((job["voice"] + "|" + it["text"]).encode("utf-8")).hexdigest()
        stamp = out.with_suffix(".key")
        if out.exists() and stamp.exists() and stamp.read_text() == key:
            continue
        todo.append(it)
    print(f"tts(colab): {len(job['lines']) - len(todo)} cached, {len(todo)} to synthesize", flush=True)
    if not todo:
        return
    outs = {it["id"]: Path(it["out"]) for it in todo}
    rjob = {**job, "lines": [{"id": it["id"], "text": it["text"], "out": f"{R}/out/{it['id']}.wav"} for it in todo]}

    # one upload: the job, the runner, the user-voice loader and the saved voices
    tmp = Path(tempfile.mkdtemp(prefix="ttscolab-"))
    bundle = tmp / "bundle.zip"
    with zipfile.ZipFile(bundle, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("job.json", json.dumps(rjob, ensure_ascii=False))
        z.write(KIT_PY / "tts.py", "tts.py")
        z.write(REPO / "apps" / "user_voices.py", "apps/user_voices.py")
        for f in HOME.glob("user_voices_*.json"):
            z.write(f, f"home/{f.name}")

    t_all = time.time()
    if f"[{SESSION}]" not in colab("sessions", check=False):
        print(f"colab: new session '{SESSION}' ({GPU})", flush=True)
        colab("new", "-s", SESSION, "--gpu", GPU)
    try:
        colab("upload", "-s", SESSION, str(bundle), f"{R}.zip")
        spec = pinned_spec()
        print(rexec(f"""
import os, sys, shutil, zipfile, subprocess, importlib.util
shutil.rmtree({R!r}, ignore_errors=True)
zipfile.ZipFile({R!r} + ".zip").extractall({R!r})
if importlib.util.find_spec("vieneu") is None:
    print("installing", {spec!r}, flush=True)
    r = subprocess.run([sys.executable, "-m", "pip", "install", "-q", *{spec!r}], capture_output=True, text=True)
    print(r.stdout[-2000:], r.stderr[-2000:])
    if r.returncode: raise SystemExit("pip install failed")
import torch; print("cuda:", torch.cuda.is_available(), torch.cuda.get_device_name(0) if torch.cuda.is_available() else "")
""", timeout=1800), flush=True)

        # run detached on the VM; poll its log so a dropped exec never kills the synthesis
        rexec(f"""
import subprocess, sys
env = dict(__import__("os").environ, VIENEU_DIR={R!r}, VIENEU_HOME={R!r} + "/home", PYTHONUNBUFFERED="1")
subprocess.Popen(["sh", "-c", f"{{sys.executable}} {R}/tts.py {R}/job.json > {R}/log.txt 2>&1; echo $? > {R}/rc.txt"], cwd={R!r}, env=env, start_new_session=True)
""")
        seen, rc = 0, None
        while rc is None:
            time.sleep(20)
            got = rexec(f"""
import os
log = open({R!r} + "/log.txt", encoding="utf-8", errors="replace").read() if os.path.exists({R!r} + "/log.txt") else ""
print(log[{seen}:], end="")
print("\\n@@LEN", len(log), "RC", open({R!r} + "/rc.txt").read().strip() if os.path.exists({R!r} + "/rc.txt") else "-")
""")
            body, _, tail = got.rpartition("@@LEN")
            if body.strip():
                print(body.rstrip("\n"), flush=True)
            parts = tail.split()
            seen = int(parts[0])
            rc = None if parts[2] == "-" else int(parts[2])

        # bring back whatever finished, even after a crash
        rexec(f"""
import zipfile, glob, os
with zipfile.ZipFile({R!r} + "/out.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for f in glob.glob({R!r} + "/out/*"): z.write(f, os.path.basename(f))
""", timeout=600)
        colab("download", "-s", SESSION, f"{R}/out.zip", str(tmp / "out.zip"))
    finally:
        if os.environ.get("COLAB_KEEP") != "1":
            colab("stop", "-s", SESSION, check=False)

    got = 0
    with zipfile.ZipFile(tmp / "out.zip") as z:
        for name in z.namelist():
            sid, ext = os.path.splitext(name)
            if sid not in outs:
                continue
            dst = outs[sid].with_suffix(ext)
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_bytes(z.read(name))
            got += ext == ".wav"
    print(f"tts(colab): {got}/{len(todo)} wavs back in {time.time() - t_all:.0f}s", flush=True)
    if rc != 0 or got < len(todo):
        sys.exit(f"tts(colab) incomplete (rc={rc}); rerun to resume — finished scenes are cached")


main()
