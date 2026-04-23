<!-- Copied from squads/tech-instagram-carousel/pipeline/data/visual-identity.md — padrão obrigatório para este squad -->

# Visual Identity: Tech Instagram Carousel

## Padrão default (obrigatório): Innovation Latam — post-05

Este é o sistema que **`scripts/build-carousel-slides.mjs`** aplica por omissão. O agente de design (Diana) deve seguir esta secção e **`templates/README.md`**, não inventar outro layout salvo brief explícito em contrário.

### Slide 1 — Capa (referência: `slide-titulo`)

- **Hero:** imagem de fundo `squads/tech-instagram-carousel/assets/ai-brain-glow.png` (ou asset equivalente / imagem gerada por IA).
- **Tipografia:** **Montserrat Bold (700)**, sans-serif; manchete em caixa alta; **`letter-spacing: -0.02em`** (espaçamento reduzido); `font-size: 82px`; destaques em **`#e8c85c`** (`.hl`).
- **Google Fonts import:** `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');`
- **Composição:** gradiente escuro sobre a imagem; bloco de texto no terço inferior; **padding lateral 5%**; **padding inferior do bloco de título** `10%` (slide-titulo).
- **Sem** contador de carrossel no layout. **Logo Innovation Latam** (branco) está **sempre** embutido no HTML gerado pelo build (ver secção **Logo e automação**); **independente** do logo de empresa opcional (`company-logo.png`).

### Slide 2 — Conteúdo com imagem de fundo (referência: `slide-conteudo-imagem`)

- **Fundo:** imagem de fundo `slide2-image.png` como **FUNDO FULL-BLEED** (`background-image: url(...); background-size: cover; background-position: center`) que **represente visualmente o que o texto do slide está retratando** + **overlay escuro forte** (`rgba(21,10,28,0.75–0.95)`) por cima para legibilidade. Fallback: `cover-image.png` → `ai-brain-glow.png`.
- **PROIBIDO:** Usar `<img>` em caixa/box no topo do slide. A imagem deve cobrir 100% do slide como background, igual à capa.
- **Texto:** este slide deve ter **a maior carga de texto do carrossel** — Supporting Text mínimo 60 palavras, máximo 120.
- **Tipografia:** **Montserrat** em todo o slide; headline **700 / 46px**; body **500 / 36px**; destaques **`#c0fefd`** (teal).
- **Conteúdo:** este slide deve conter **carga maior de texto** que os demais — é o slide de contexto/aprofundamento.
- **Layout:** headline no topo do bloco de conteúdo, body text abaixo; texto alinhado à **esquerda**; **padding horizontal 5%**.
- **Rodapé:** handle **`@innovationlatam`** à esquerda; **ARRASTE →** à direita.

### Slides 3+ — Conteúdo (referência: `slide-conteudo-01`)

- **Fundo:** roxo Innovation Latam (ex.: `#150a1c` → `#2a1538`, brilhos `rgba(153,60,177)` / `#961C82`).
- **Tipografia:** **Montserrat** em todo o slide; body **500 / 40px**; parágrafos com espaçamento entre blocos (~`1.35em`); destaques **`#c0fefd`**.
- **Layout:** texto alinhado à **esquerda**; **padding horizontal 5%**.
- **Rodapé:** handle **`@innovationlatam`** à esquerda; **ARRASTE →** à direita (acima da faixa inferior).

### Tipografia unificada (todos os slides)

- **Fonte única:** Montserrat (Google Fonts) para **todos** os textos do carrossel.
- **Google Fonts import:** `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');`
- **Pesos utilizados:**
  - Slide 1 headline: **700 (Bold)** — `letter-spacing: -0.02em`
  - Slide 2 headline: **700 (Bold)** — `46px`
  - Body text: **500 (Medium)** — slides de conteúdo
  - Destaques (`.hl`): **700 (Bold)**
  - Handle/footer: **600 (SemiBold)** — `24px`
- **Não usar** Bebas Neue, Playfair Display, Inter ou qualquer outra fonte.

### Logo e automação

- Logo branco **sempre** no HTML gerado pelo build (data-URI de `assets/innovation-latam-logo-white.png`), canto superior esquerdo, `max-width: 200px`, margem **30px** — presente em **todos** os PNG após Playwright.
- Geração: `node squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs [RUN_DIR]` — `RUN_DIR` opcional; se omitido, usa a pasta **mais recente** em `output/YYYY-MM-DD-*`.

### Referência visual no repositório

Coloque cópias ou exports em **`squads/tech-instagram-carousel/examples/`** (ex.: capa e conteúdo aprovados) para o time e o agente alinharem hierarquia.

---

## Referência de exemplos (repositório)

Para alinhar layout e hierarquia visual, use como referência as imagens em **`squads/tech-instagram-carousel/examples/`** (ver `examples/README.md`). O estilo **default** é o **post-05** (capa + conteúdo roxo), não o Number Focus abaixo salvo brief explícito.

## Template legado: Template C — Number Focus

### Design Philosophy
High-contrast, stat-driven design that emphasizes big numbers and data. Dark backgrounds with bold accent color create professional tech aesthetic. Layout prioritizes readability and visual impact through typography hierarchy.

### Color System

**Primary Palette:**
- **Background Primary:** `#0a0a0a` (Near black)
- **Accent:** `#FFD700` (Gold)
- **Text Primary:** `#FFFFFF` (Pure white)
- **Text Secondary:** `#AAAAAA` (Light gray)
- **Text Muted:** `#888888` (Medium gray)

**Background Cards:**
- Dark card: `#0a0a0a` (full background)
- Light card on dark: `#1a1a1a` with slight elevation
- Accent card: `#FFD70033` (gold with 20% opacity) for emphasis

**Usage Guidelines:**
- Use gold (`#FFD700`) sparingly for maximum impact: big numbers, key phrases, accent lines
- Alternate slide backgrounds: dark → light card → dark → accent → dark pattern
- Maintain high contrast ratios (WCAG AA minimum 4.5:1)

### Typography

**Font Family:** Inter (Google Fonts)
- Import: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;700;900&display=swap');`

**Type Scale:**
- **Hero Number:** 180px / 900 weight / line-height 0.85
  - Use for: Big statistics, percentages, key numbers
  - Color: Gold (`#FFD700`)
  
- **Headline:** 58px / 700 weight / line-height 1.15
  - Use for: Slide titles, main concept statements
  - Color: White (`#FFFFFF`)
  
- **Body Text:** 34px / 500 weight / line-height 1.6
  - Use for: Supporting text, explanations, context
  - Color: Light gray (`#AAAAAA`)
  
- **Caption/Tag:** 24px / 800 weight / line-height 1.2
  - Use for: Header tags, labels, small accents
  - Color: Gold (`#FFD700`) or White

**Hierarchy Rules:**
- Every slide has two-layer hierarchy: bold headline + lighter supporting text
- Use weight contrast (700 vs 500) and color contrast (white vs gray) to create separation
- Headlines should be scannable without reading body text

### Layout System

**Viewport:** 1080px × 1440px (Instagram carousel standard)

**Spacing Base:** 24px modular scale
- Padding: 72px (3× base)
- Section gaps: 32px or 64px
- Line spacing: 24px between text blocks
- Accent elements: 4px height for divider lines

**Grid Structure:**
- Use CSS Flexbox for vertical layouts (`flex-direction: column`)
- Main content area: Full width with 72px padding on all sides
- Footer always at bottom with `margin-top: auto`

**Layout Patterns:**

1. **Stat Layout (for big numbers):**
   ```
   [Header Tag]
   [Big Number] [Headline]
   [Accent Line]
   [Body Text]
   [Footer]
   ```

2. **Text Layout (no big number):**
   ```
   [Header Tag]
   [Headline with accent keywords]
   [Accent Line]
   [Body Text]
   [Footer]
   ```

### Visual Elements

**Header Tag:**
- Style: Rounded corners (8px), gold background with opacity (`#FFD70033`)
- Padding: 10px 24px
- Typography: 24px / 800 weight / uppercase / letter-spacing 2px
- Color: Gold (`#FFD700`)
- Examples: "TECH INSIGHT #3", "CONTRAPONTO", "PASSO 1"

**Accent Line:**
- Width: 100px
- Height: 4px
- Color: Gold (`#FFD700`)
- Placement: Between headline and body text as visual separator

**Footer:**
- Border top: 1px solid `#333333`
- Padding top: 32px
- Layout: Flexbox with space-between
- Left: Brand name "Innovation Latam" (24px / 600 weight / gray `#888888`)
- Right: Swipe indicator "ARRASTE →" (24px / muted gray `#666666`)

### Content Formatting

**Keyword Emphasis:**
- Use `<span>` with gold color for critical terms
- Example: `<span style="color: #FFD700;">67%</span>`
- Use sparingly (1-3 keywords per slide maximum)

**Text Treatment:**
- All lowercase for body text (creates modern, approachable feel)
- Title case for headlines
- Uppercase for header tags only

**Line Breaks:**
- Use semantic line breaks to control rhythm
- Keep related concepts on same line
- Break after punctuation when possible

### Brand Elements

**Logo/Brand Presence:**
- Text-based: "Innovation Latam" in footer
- Style: 24px / 600 weight / gray (#888888)
- Position: Bottom left of every slide

**Swipe Indicator:**
- Text: "ARRASTE →" (Portuguese for "Swipe")
- Position: Bottom right of every slide
- Style: 24px / gray (#666666)
- Purpose: Guides users to continue carousel

### Design System Rules

1. **Consistency:** All slides in a carousel must use identical design system (colors, fonts, spacing)
2. **Contrast:** Every text element must meet WCAG AA (4.5:1 minimum)
3. **Self-contained:** All HTML files must work standalone with inline CSS
4. **No dependencies:** Except Google Fonts @import (acceptable)
5. **Viewport exact:** Body width and height must be exactly 1080px × 1440px
6. **No slide counters:** Instagram provides native navigation, counters are redundant

### Template Reference

See `pipeline/data/template-reference.html` for complete working example with all patterns implemented.

---

### Layout institucional v2 (legado — painel central)

**Nota:** O `build-carousel-slides.mjs` atual usa o **padrão post-05** (capa + conteúdo sem painel central). A secção abaixo descreve uma composição anterior (ABNT/MIT-style) para referência histórica.

Referências de composição (inspiração, não cópia de marca de terceiros):

- **[Post ABNT / composição](https://www.instagram.com/p/DVdVkl-D3U3/):** imagem de fundo com peso visual; **bloco de texto centralizado** no slide, com hierarquia legível (subtítulo / manchete / corpo quando aplicável). No squad, isso traduz-se em **painel semi-opaco central** (`border-radius` ~18px) e texto **alinhado ao centro**, sobre fundo com gradiente.
- **[Post MIT Technology Review BR / tratamento editorial](https://www.instagram.com/p/DTX5a7OjYVb/):** **camadas roxo e cinza** no fundo (gradientes e formas suaves), tipografia clara; **informações da marca e handle na faixa inferior**, **centralizadas** na largura do slide.

**Branding (alinhado a `squads/innovation-latam-news/scripts/apply-overlay.py` e `_opensquad/_memory/doc_posicao_logo_logo_conta.md`):**

- **Logo branco** (`squads/tech-instagram-carousel/assets/innovation-latam-logo-white.png`): canto **superior esquerdo**, margem **36px**, altura visual ~**36px** (compacto). Incorporado no HTML via data-URI no script de build.
- **Rodapé:** apenas **`@innovationlatam`** na **faixa inferior**, texto **centralizado**; indicador **ARRASTE →** discreto à **direita**, acima do rodapé.
- **Roxo institucional** de referência: `#993CB1` em gradientes combinados com cinzas (`#1a1d26`, `#252030`, etc.).

O gerador HTML do squad aplica variantes `dark` / `light` / `accent` conforme o campo `**Background:**` de cada slide no markdown (mapeado a partir de Dark / Light card / Accent do copywriter).

### Rationale

**Why Template C (Number Focus)?**
- Tech content is often data-driven (statistics, percentages, benchmarks)
- Big numbers create immediate visual impact and credibility
- High contrast (dark bg + gold accent) signals professional tech brand
- Typography-first approach works well on mobile (Instagram's primary platform)
- Gold accent color provides energy without being overwhelming

**Why Inter font?**
- Excellent readability at small sizes on mobile
- Wide weight range (500/700/900) enables strong hierarchy
- Modern, professional feel appropriate for tech content
- Free via Google Fonts, reliable rendering

**Why dark backgrounds?**
- Tech industry convention (dark mode aesthetic)
- High contrast makes text pop on mobile screens
- Reduces eye strain for users scrolling at night
- Gold accent has maximum impact against dark bg
