import sys, os
from rembg import remove, new_session
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
BG = (16, 16, 18)
sess = new_session("u2netp")          # 4MB model, quick download
im = Image.open(src).convert("RGBA")
cut = remove(im, session=sess, post_process_mask=True)
bb = cut.getbbox()
if bb: cut = cut.crop(bb)
w, h = cut.size
side = int(max(w, h) * 1.16)
canvas = Image.new("RGB", (side, side), BG)
canvas.paste(cut, ((side - w)//2, (side - h)//2), cut)
canvas = canvas.resize((800, 800), Image.LANCZOS)
canvas.save(dst, "WEBP", quality=88, method=6)
print("OK", dst, os.path.getsize(dst), "bytes")
