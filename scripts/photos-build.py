"""Build the bundled photo library from assets/photos/manifest.json.

Each manifest entry names a slot and its source (a local file, or an http(s) URL that
is downloaded once into assets/photos/src/). The image is cover-cropped to the slot's
frame (hero 820x512, card 576x432) around an optional vertical focal point, encoded as
WebP, and assets/photo-data.js is regenerated for scripts/photo-sync.mjs to inline.

    python3 scripts/photos-build.py                     # build everything missing
    python3 scripts/photos-build.py --only a,b --force  # rebuild just these slots

An entry may carry "box": [left, top, right, bottom] in source pixels to take a region
of the source first (e.g. to leave out a background that would misplace the subject).
"""
import base64, json, os, sys, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHOTOS = os.path.join(ROOT, "assets", "photos")
SRC = os.path.join(PHOTOS, "src")
SIZES = {"hero": (820, 512), "card": (576, 432)}
force = "--force" in sys.argv
only = next((a.split("=", 1)[1] if "=" in a else sys.argv[i + 1]
             for i, a in enumerate(sys.argv) if a.startswith("--only")), "")
only = set(filter(None, only.split(",")))

def fetch(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "EyeMakkah-prototype/1.0"})
    with urllib.request.urlopen(req, timeout=90) as r, open(dest, "wb") as f:
        f.write(r.read())

def build(slot, entry):
    out = os.path.join(PHOTOS, slot + ".webp")
    if os.path.exists(out) and not force:
        return "kept"
    src = entry.get("file")
    if not src:
        url = entry["url"]
        os.makedirs(SRC, exist_ok=True)
        src = os.path.join(SRC, slot + os.path.splitext(url.split("?")[0])[1].lower()[:5] or ".jpg")
        if not os.path.exists(src):
            fetch(url, src)
    elif not os.path.isabs(src):
        src = os.path.join(ROOT, src)
    im = Image.open(src).convert("RGB")
    if entry.get("box"):
        im = im.crop(tuple(entry["box"]))
    tw, th = SIZES[entry.get("size", "card")]
    ar, (w, h) = tw / th, im.size
    fx, fy = entry.get("focal", [0.5, 0.4])
    if w / h > ar:
        nw = int(h * ar); left = int((w - nw) * fx); im = im.crop((left, 0, left + nw, h))
    else:
        nh = int(w / ar); top = int((h - nh) * fy); im = im.crop((0, top, w, top + nh))
    im.resize((tw, th), Image.LANCZOS).save(out, "WEBP", quality=entry.get("q", 54), method=6)
    return "built"

def main():
    manifest = json.load(open(os.path.join(PHOTOS, "manifest.json"), encoding="utf-8"))
    for slot, entry in manifest.items():
        if slot.startswith("_") or (only and slot not in only):
            continue
        try:
            print(f"{slot:28s} {build(slot, entry)}")
        except Exception as e:
            print(f"{slot:28s} FAILED {e}")
    slots = sorted(f[:-5] for f in os.listdir(PHOTOS) if f.endswith(".webp"))
    parts = []
    for s in slots:
        with open(os.path.join(PHOTOS, s + ".webp"), "rb") as f:
            parts.append(f'  {s}: "data:image/webp;base64,{base64.b64encode(f.read()).decode()}",')
    with open(os.path.join(ROOT, "assets", "photo-data.js"), "w") as f:
        f.write("const PHOTO_DATA = {\n" + "\n".join(parts) + "\n};\n")
    total = sum(os.path.getsize(os.path.join(PHOTOS, s + ".webp")) for s in slots)
    print(f"{len(slots)} photos, {total // 1024} KB -> assets/photo-data.js")

if __name__ == "__main__":
    main()
