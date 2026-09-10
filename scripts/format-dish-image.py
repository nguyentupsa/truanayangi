#!/usr/bin/env python3
"""Format a real food photo to match the sprite-atlas look used by the case.

Cuts the dish out of its background, centres it on a near-black square, and
writes an 800x800 webp. The app renders these with mix-blend-mode:lighten so
the near-black melts into the card and the dish "floats" like the built-in art.

Setup (one-off):
    python3 -m venv .venv && ./.venv/bin/pip install "rembg[cpu]" pillow

Usage:
    ./.venv/bin/python scripts/format-dish-image.py raw.jpg public/dishes/xoi-ghe.webp

Then add  "img": "dishes/xoi-ghe.webp"  to the dish entry in src/lib/foods.ts
(remove its "customId" if it has one).
"""
import os
import sys

from PIL import Image
from rembg import new_session, remove

BG = (16, 16, 18)  # vanishes under mix-blend-mode:lighten on the card


def main() -> None:
    src, dst = sys.argv[1], sys.argv[2]
    session = new_session("u2netp")  # small 4MB model, quick download
    image = Image.open(src).convert("RGBA")
    cut = remove(image, session=session, post_process_mask=True)
    box = cut.getbbox()
    if box:
        cut = cut.crop(box)
    w, h = cut.size
    side = int(max(w, h) * 1.16)
    canvas = Image.new("RGB", (side, side), BG)
    canvas.paste(cut, ((side - w) // 2, (side - h) // 2), cut)
    canvas = canvas.resize((800, 800), Image.LANCZOS)
    canvas.save(dst, "WEBP", quality=88, method=6)
    print("wrote", dst, os.path.getsize(dst), "bytes")


if __name__ == "__main__":
    main()
