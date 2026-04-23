#!/usr/bin/env python3
"""
Compõe o logo Innovation Latam (branco, para fundos escuros) no canto superior esquerdo de cada slide PNG.
Uso: python3 apply-innovation-logo.py <pasta> [--glob PADRÃO]

Por omissão procura slide-*.png. Use --glob 'slide-conteudo-*.png' para só slides de conteúdo.
Sobrescreve os ficheiros (backup não é criado).
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image

LOGO_MAX_W = 200
MARGIN = 30
# Logo branco para fundos escuros (carrosséis, etc.)
LOGO_FILENAME = "innovation-latam-logo-white.png"


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def load_logo() -> Image.Image:
    path = repo_root() / "pipeline" / "assets" / LOGO_FILENAME
    if not path.exists():
        raise FileNotFoundError(f"Logo não encontrado: {path}")
    return Image.open(path).convert("RGBA")


def resize_logo(logo: Image.Image, max_w: int) -> Image.Image:
    w, h = logo.size
    if w <= max_w:
        return logo
    ratio = max_w / w
    nh = int(h * ratio)
    return logo.resize((max_w, nh), Image.Resampling.LANCZOS)


def composite_slide(slide_path: Path, logo: Image.Image) -> None:
    base = Image.open(slide_path).convert("RGBA")
    lw, lh = logo.size
    pos = (MARGIN, MARGIN)
    out = Image.new("RGBA", base.size)
    out.paste(base, (0, 0))
    out.alpha_composite(logo, pos)
    rgb = out.convert("RGB")
    rgb.save(slide_path, "PNG", optimize=True)


def main() -> int:
    ap = argparse.ArgumentParser(description="Aplica logo Innovation Latam (branco) aos PNGs.")
    ap.add_argument("folder", type=Path, help="Pasta com os slides PNG")
    ap.add_argument(
        "--glob",
        default="slide-*.png",
        metavar="PADRÃO",
        help="Glob por ficheiro (default: slide-*.png)",
    )
    args = ap.parse_args()
    folder = args.folder.resolve()
    if not folder.is_dir():
        print(f"Pasta inválida: {folder}", file=sys.stderr)
        return 1
    logo = resize_logo(load_logo(), LOGO_MAX_W)
    slides = sorted(folder.glob(args.glob))
    if not slides:
        print(f"Nenhum ficheiro com glob {args.glob!r} em {folder}", file=sys.stderr)
        return 1
    for p in slides:
        composite_slide(p, logo)
        print(p)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
