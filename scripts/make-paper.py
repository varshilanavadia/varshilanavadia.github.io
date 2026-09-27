"""Build the paper-cutout silhouette from the hero portrait's alpha.

The paper is the portrait's outline grown outward by a fixed radius, on a canvas padded
on every side so the grown edge never runs off the image. The site uses the file twice:
as the white paper behind the figure, and as the mask for the copy of the name band that
runs across the paper. Re-run after replacing public/hero-portrait.webp:

    python3 scripts/make-paper.py
"""
import numpy as np
from PIL import Image, ImageFilter

SRC = "public/hero-portrait.webp"
PAD = 39  # source px added on every side; the CSS insets are derived from this
R = 30  # grow radius in source px: about 22px of paper at the portrait's full 605px width
# and 10px at its 280px floor on a phone. The figure runs off the sides and the foot, so PAD
# must be at least R plus the blur, or the grown edge is cut off and np.roll wraps it round.

alpha = np.asarray(Image.open(SRC).convert("RGBA"))[:, :, 3].astype(np.float32)
h, w = alpha.shape
padded = np.zeros((h + 2 * PAD, w + 2 * PAD), np.float32)
padded[PAD:PAD + h, PAD:PAD + w] = alpha

# Grey dilation with a round kernel: the max over every offset inside the radius.
grown = padded.copy()
for dy in range(-R, R + 1):
    for dx in range(-R, R + 1):
        if dx * dx + dy * dy <= R * R:
            grown = np.maximum(grown, np.roll(np.roll(padded, dy, 0), dx, 1))
a = Image.fromarray(grown.clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
out = Image.new("RGBA", a.size, (255, 255, 255, 0))
out.putalpha(a)
out.save("public/hero-paper.png", optimize=True)
print(out.size, f"inset x {-PAD / w * 100:.4f}%  y {-PAD / h * 100:.4f}%  band +{PAD / (h + 2 * PAD) * 100:.4f}%")
