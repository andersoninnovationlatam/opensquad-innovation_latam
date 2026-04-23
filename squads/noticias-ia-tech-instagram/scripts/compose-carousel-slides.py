#!/usr/bin/env python3
"""
Compõe slides finais 1080×1350: fundo IA + faixa escura + texto + logo Innovation Latam.

Uso:
  python3 compose-carousel-slides.py \\
    --visual-prompts path/to/visual_prompts.json \\
    --carousel-copy path/to/carousel_copy.json \\
    --raw-dir path/to/raw \\
    --out-dir path/to/carousel-package

Espera ficheiros raw/raw_slide_01.png … raw_slide_05.png (gerados antes com image-ai-generator).
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
LOGO_MAX_W = 280
MARGIN = 40
TEXT_MAX_W = W - 2 * MARGIN
FOOTER_H = 420


def repo_squad_root() -> Path:
    return Path(__file__).resolve().parent.parent


def load_font(size: int) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    ]
    for p in candidates:
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                continue
    return ImageFont.load_default()


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.replace("\n", " ").split()
    if not words:
        return []
    lines: list[str] = []
    cur: list[str] = []
    for w in words:
        test = " ".join(cur + [w])
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_width:
            cur.append(w)
        else:
            if cur:
                lines.append(" ".join(cur))
            cur = [w]
    if cur:
        lines.append(" ".join(cur))
    return lines


def resize_cover(img: Image.Image, tw: int, th: int) -> Image.Image:
    img = img.convert("RGBA")
    sw, sh = img.size
    scale = max(tw / sw, th / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return img.crop((left, top, left + tw, top + th))


def load_logo() -> Image.Image:
    path = repo_squad_root() / "pipeline" / "assets" / "innovation-latam-logo.png"
    if not path.exists():
        raise FileNotFoundError(f"Logo não encontrado: {path}")
    logo = Image.open(path).convert("RGBA")
    lw, lh = logo.size
    if lw > LOGO_MAX_W:
        ratio = LOGO_MAX_W / lw
        logo = logo.resize((LOGO_MAX_W, int(lh * ratio)), Image.Resampling.LANCZOS)
    return logo


def composite(
    raw_path: Path,
    headline: str,
    out_path: Path,
    logo: Image.Image,
) -> None:
    base = resize_cover(Image.open(raw_path), W, H)
    out = Image.new("RGBA", (W, H))
    out.paste(base, (0, 0))

    overlay = Image.new("RGBA", (W, FOOTER_H), (15, 23, 42, 220))
    out.alpha_composite(overlay, (0, H - FOOTER_H))

    draw = ImageDraw.Draw(out)
    font_title = load_font(38)
    lines = wrap_text(draw, headline, font_title, TEXT_MAX_W)
    y = H - FOOTER_H + 36
    for line in lines[:5]:
        draw.text((MARGIN, y), line, font=font_title, fill=(255, 255, 255, 255))
        bbox = draw.textbbox((0, 0), line, font=font_title)
        y += bbox[3] - bbox[1] + 8

    lw, lh = logo.size
    out.alpha_composite(logo, (MARGIN, MARGIN))
    rgb = out.convert("RGB")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    rgb.save(out_path, "PNG", optimize=True)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--visual-prompts", required=True, type=Path)
    ap.add_argument("--carousel-copy", required=True, type=Path)
    ap.add_argument("--raw-dir", required=True, type=Path)
    ap.add_argument("--out-dir", required=True, type=Path)
    args = ap.parse_args()

    vp = json.loads(args.visual_prompts.read_text(encoding="utf-8"))
    cc = json.loads(args.carousel_copy.read_text(encoding="utf-8"))

    slides_vp = {s["slide_number"]: s for s in vp.get("slides", [])}
    slides_cc = cc.get("slides", cc) if isinstance(cc.get("slides"), list) else []
    if isinstance(cc, list):
        slides_cc = cc
    by_num = {s["slide_number"]: s for s in slides_cc}

    logo = load_logo()
    for num in sorted(slides_vp.keys()):
        raw_name = f"raw_slide_{num:02d}.png"
        raw_path = args.raw_dir / raw_name
        if not raw_path.exists():
            print(f"ERRO: ficheiro em falta: {raw_path}", file=sys.stderr)
            return 1
        headline = by_num.get(num, {}).get("slide_text") or slides_vp[num].get("text_overlay", "")
        out_path = args.out_dir / f"slide-{num:02d}.png"
        composite(raw_path, headline, out_path, logo)
        print(out_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
