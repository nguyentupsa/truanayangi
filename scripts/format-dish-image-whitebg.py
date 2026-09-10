#!/usr/bin/env python3
"""Variant for product shots on a PURE WHITE background (menu/marketing images).
rembg eats white plates/rice on white bg; this flood-fills the white from the
edges instead, keeping interior white. Usage: python scripts/format-dish-image-whitebg.py raw.png public/dishes/x.webp"""
import os, sys
from PIL import Image, ImageDraw
src, dst = sys.argv[1], sys.argv[2]
BG = (16, 16, 18)
im = Image.open(src).convert("RGB")
# pad 4px white so edge-touching bg is fully connected, then flood-fill from corners
w, h = im.size
pad = Image.new("RGB", (w+8, h+8), (255, 255, 255))
pad.paste(im, (4, 4))
seen = pad.copy()
for xy in [(0,0),(pad.width-1,0),(0,pad.height-1),(pad.width-1,pad.height-1)]:
    ImageDraw.floodfill(seen, xy, BG, thresh=40)
# anything now == BG is background; keep rest from original
px_s, px_p = seen.load(), pad.load()
out = Image.new("RGB", pad.size, BG)
op = out.load()
for y in range(pad.height):
    for x in range(pad.width):
        if px_s[x, y] != BG:
            op[x, y] = px_p[x, y]
box = out.getbbox_nonbg = None
# crop to non-BG bbox
mask = Image.new("L", out.size, 0)
mp = mask.load()
for y in range(out.height):
    for x in range(out.width):
        if op[x, y] != BG:
            mp[x, y] = 255
bb = mask.getbbox()
if bb: out = out.crop(bb)
w, h = out.size
side = int(max(w, h) * 1.16)
canvas = Image.new("RGB", (side, side), BG)
canvas.paste(out, ((side-w)//2, (side-h)//2))
canvas = canvas.resize((800, 800), Image.LANCZOS)
canvas.save(dst, "WEBP", quality=88, method=6)
print("OK", dst, os.path.getsize(dst))
