#!/usr/bin/env python3
"""
apply-overlay.py — Instagram carousel overlay (1080×1350).

- Logo pequeno no canto superior esquerdo
- @innovationlatam discreto no canto inferior direito (menor que o logo)
- Modo jornalístico: subtítulo + manchete + corpo; texto alinhado à esquerda,
  bloco centralizado na vertical; painel escuro arredondado no tamanho do texto
- Slide final: ícones estilo Instagram (curtir, salvar, compartilhar) + handle
"""

from __future__ import annotations

import argparse
import sys
import textwrap
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("ERROR: Pillow not installed. Run: pip install Pillow")
    sys.exit(1)

DEFAULT_HANDLE = "@innovationlatam"

_SCRIPT_DIR = Path(__file__).resolve().parent
_SQUAD_ROOT = _SCRIPT_DIR.parent
_BUNDLED_MONTSERRAT_VF = _SQUAD_ROOT / "pipeline" / "assets" / "fonts" / "Montserrat-VF.ttf"


def hex_to_rgb(hex_color: str) -> tuple:
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))


FONT_FALLBACK_BOLD = [
    "/usr/share/fonts/truetype/montserrat/Montserrat-Bold.ttf",
    "/usr/share/fonts/opentype/montserrat/Montserrat-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    "/System/Library/Fonts/Supplemental/Montserrat-Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "C:/Windows/Fonts/montserrat-bold.ttf",
    "C:/Windows/Fonts/Montserrat-Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]
FONT_FALLBACK_REG = [
    "/usr/share/fonts/truetype/montserrat/Montserrat-Regular.ttf",
    "/usr/share/fonts/opentype/montserrat/Montserrat-Regular.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    "/System/Library/Fonts/Supplemental/Montserrat-Regular.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "C:/Windows/Fonts/montserrat-regular.ttf",
    "C:/Windows/Fonts/Montserrat-Regular.ttf",
    "C:/Windows/Fonts/arial.ttf",
]


def load_font(size: int, *, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    """Montserrat via fonte variável em pipeline/assets; fallback para TTF do sistema ou Liberation."""
    if _BUNDLED_MONTSERRAT_VF.exists():
        try:
            font = ImageFont.truetype(str(_BUNDLED_MONTSERRAT_VF), size)
            if hasattr(font, "set_variation_by_name"):
                font.set_variation_by_name("Bold" if bold else "Regular")
            return font
        except (OSError, ValueError, AttributeError):
            pass
    candidates = FONT_FALLBACK_BOLD if bold else FONT_FALLBACK_REG
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def draw_overlay_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    font: ImageFont.ImageFont,
    fill: tuple,
) -> None:
    draw.text(xy, text, font=font, fill=fill)


def _line_height(font: ImageFont.ImageFont) -> int:
    try:
        return int(font.size * 1.28)
    except AttributeError:
        return 16


def draw_content_sized_panel(
    base: Image.Image,
    box: tuple[int, int, int, int],
    fill: tuple[int, int, int, int] = (0, 0, 0, 220),
    radius: int = 18,
) -> Image.Image:
    """Painel escuro semi-opaco com cantos arredondados, limitado ao retângulo do texto."""
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = box
    if x1 <= x0 or y1 <= y0:
        return base
    if hasattr(d, "rounded_rectangle"):
        d.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill)
    else:
        d.rectangle([x0, y0, x1, y1], fill=fill)
    return Image.alpha_composite(base, layer)


def draw_engagement_row(
    draw: ImageDraw.ImageDraw,
    font_icon: ImageFont.ImageFont,
    rgb: tuple[int, int, int],
    y_row: int,
) -> None:
    """Curtir · salvar · compartilhar (glifos universais: coração, marcador, seta)."""
    margin = 36
    gap = 36
    x = margin
    fill = (*rgb, 255)
    # ♡ coração · ⌖ alvo/salvamento · ↗ compartilhar (ou 21AA seta curva)
    for ch in ("\u2661", "\u25A3", "\u21AA"):
        draw_overlay_text(draw, (x, y_row), ch, font_icon, fill)
        bbox = draw.textbbox((0, 0), ch, font=font_icon)
        x += (bbox[2] - bbox[0]) + gap


def apply_overlay(
    input_path: str,
    logo_path: str,
    text: str,
    output_path: str,
    logo_opacity: float = 0.80,
    logo_size: int = 72,
    text_color: str = "#FFFFFF",
    font_size_override: int | None = None,
    subtitle: str = "",
    headline: str = "",
    body: str = "",
    social_handle: str = DEFAULT_HANDLE,
    show_engagement_icons: bool = False,
) -> None:
    base = Image.open(input_path).convert("RGBA")
    width, height = base.size

    # --- Logo (top-left, compact) ---
    logo_path_obj = Path(logo_path)
    if logo_path_obj.exists():
        logo = Image.open(logo_path).convert("RGBA")
        logo_ratio = logo.width / logo.height
        logo_h = logo_size
        logo_w = int(logo_h * logo_ratio)
        logo = logo.resize((logo_w, logo_h), Image.LANCZOS)
        r, g, b, a = logo.split()
        a = a.point(lambda p: int(p * logo_opacity))
        logo = Image.merge("RGBA", (r, g, b, a))
        margin = 36
        base.paste(logo, (margin, margin), logo)
    else:
        print(f"WARNING: Logo not found at {logo_path} — skipping logo overlay")

    use_journal = bool((subtitle or headline or body).strip())
    if not use_journal and not (text and text.strip()):
        final = base.convert("RGB")
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        final.save(output_path, "PNG", optimize=True)
        print(f"Saved: {output_path} ({width}x{height}px)")
        return

    # Área útil vertical (substitui gradiente em tela cheia; contraste vem do painel sob o texto)
    grad_start = int(height * 0.38) if use_journal else int(height * 0.55)

    draw = ImageDraw.Draw(base)
    text_rgb = hex_to_rgb(text_color)

    handle_size = max(18, min(26, logo_size // 3))
    font_sub = load_font(max(22, int(height * 0.022)), bold=True)
    font_head = load_font(max(30, int(height * 0.032)), bold=True)
    font_body = load_font(max(20, int(height * 0.021)), bold=False)
    font_handle = load_font(handle_size, bold=False)

    if font_size_override:
        font_head = load_font(font_size_override, bold=True)
        font_body = load_font(max(18, font_size_override - 8), bold=False)

    margin_h = 48
    max_text_w = width - 2 * margin_h
    line_gap = int(getattr(font_body, "size", 20) * 0.35)
    block_lines: list[tuple[str, ImageFont.ImageFont, tuple]] = []

    if use_journal:
        sub_w = max(24, max_text_w // max(8, getattr(font_sub, "size", 22) // 2))
        head_w = max(18, max_text_w // max(8, getattr(font_head, "size", 30) // 2))
        body_w = max(32, max_text_w // max(6, getattr(font_body, "size", 20) // 2))
        if subtitle.strip():
            for line in textwrap.wrap(subtitle.strip(), width=sub_w):
                block_lines.append((line, font_sub, text_rgb))
        if headline.strip():
            for line in textwrap.wrap(headline.strip(), width=head_w):
                block_lines.append((line, font_head, text_rgb))
        if body.strip():
            wrap_w = body_w
            for line in textwrap.wrap(body.strip(), width=wrap_w):
                block_lines.append((line, font_body, text_rgb))
    else:
        fs = max(40, int(height * 0.048)) if not font_size_override else font_size_override
        font_single = load_font(fs, bold=True)
        fsz = max(1, getattr(font_single, "size", 40) // 2)
        wrap_w = max(12, max_text_w // fsz)
        for line in textwrap.wrap(text.strip(), width=wrap_w):
            block_lines.append((line, font_single, text_rgb))

    font_icon = load_font(max(28, handle_size + 4), bold=False)
    hb = draw.textbbox((0, 0), social_handle, font=font_handle)
    hh = hb[3] - hb[1]
    margin_bottom = 36
    hy = height - margin_bottom - hh
    icon_h = getattr(font_icon, "size", 28)
    y_icons = hy - icon_h - 10 if show_engagement_icons else hy
    text_bottom = (y_icons - 14) if show_engagement_icons else (hy - 12)

    total_h = 0
    if block_lines:
        total_h += sum(_line_height(f) for _, f, _ in block_lines)
        total_h += line_gap * max(0, len(block_lines) - 1)

    content_top = grad_start + 24
    content_bottom = text_bottom
    avail = max(0, content_bottom - content_top)
    if block_lines and total_h <= avail:
        y = content_top + (avail - total_h) // 2
    else:
        y = content_bottom - total_h
        min_y = grad_start + 20
        if y < min_y:
            y = min_y

    text_left_x = margin_h
    panel_pad = 22
    radius = 18

    # Painel escuro dimensionado ao conteúdo (contraste sem cobrir a foto inteira)
    if block_lines:
        y_first = y
        max_line_w = 0
        y_last_bottom = y_first
        y_measure = y
        for line, font, rgb in block_lines:
            bbox = draw.textbbox((text_left_x, y_measure), line, font=font)
            max_line_w = max(max_line_w, bbox[2] - bbox[0])
            y_last_bottom = bbox[3]
            y_measure += _line_height(font) + line_gap
        px0 = max(0, text_left_x - panel_pad)
        py0 = max(0, y_first - panel_pad)
        px1 = min(width, text_left_x + max_line_w + panel_pad)
        py1 = min(height, y_last_bottom + panel_pad)
        base = draw_content_sized_panel(base, (px0, py0, px1, py1), fill=(0, 0, 0, 220), radius=radius)
        draw = ImageDraw.Draw(base)

    for line, font, rgb in block_lines:
        draw_overlay_text(draw, (text_left_x, y), line, font, (*rgb, 255))
        y += _line_height(font) + line_gap

    if show_engagement_icons:
        draw_engagement_row(draw, font_icon, text_rgb, y_icons)

    hb = draw.textbbox((0, 0), social_handle, font=font_handle)
    hw = hb[2] - hb[0]
    hx = width - margin_h - hw
    draw_overlay_text(draw, (hx, hy), social_handle, font_handle, (*text_rgb, 255))

    final = base.convert("RGB")
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    final.save(output_path, "PNG", optimize=True)
    saved = Image.open(output_path)
    print(f"Saved: {output_path} ({saved.size[0]}x{saved.size[1]}px)")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Apply logo, @handle, and news-style text overlay to a slide image"
    )
    parser.add_argument("--input", required=True)
    parser.add_argument("--logo", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--text", default="", help="Legacy single block (if no headline/body)")
    parser.add_argument("--subtitle", default="", help="Kicker / section line")
    parser.add_argument("--headline", default="", help="Main headline")
    parser.add_argument("--body", default="", help="Supporting paragraph")
    parser.add_argument("--social-handle", default=DEFAULT_HANDLE)
    parser.add_argument(
        "--show-engagement-icons",
        action="store_true",
        help="Draw like/save/share icons (use on last slide)",
    )
    parser.add_argument("--logo-opacity", type=float, default=0.80)
    parser.add_argument("--logo-size", type=int, default=72, help="Logo height in px (default smaller)")
    parser.add_argument("--text-color", default="#FFFFFF")
    parser.add_argument("--font-size", type=int, default=None)

    args = parser.parse_args()

    if not Path(args.input).exists():
        print(f"ERROR: Input file not found: {args.input}")
        sys.exit(1)

    apply_overlay(
        input_path=args.input,
        logo_path=args.logo,
        text=args.text,
        output_path=args.output,
        logo_opacity=args.logo_opacity,
        logo_size=args.logo_size,
        text_color=args.text_color,
        font_size_override=args.font_size,
        subtitle=args.subtitle,
        headline=args.headline,
        body=args.body,
        social_handle=args.social_handle,
        show_engagement_icons=args.show_engagement_icons,
    )


if __name__ == "__main__":
    main()
