---
task: "Design Slides"
order: 1
input: |
  - carousel_draft: Copy completo do carrossel (slides, caption, hashtags) do Copywriter
  - visual_identity: Padrão Innovation Latam post-05 (capa + conteúdo roxo) em `pipeline/data/visual-identity.md`
  - examples: `squads/tech-instagram-carousel/examples/` (referência visual)
output: |
  - slide_images: Slides renderizados (slide-01.png através slide-N.png) em output/.../design/<post>/slides/
  - design_documentation: Rationale de design explicando escolhas visuais
---

# Design Slides

Gera HTML/CSS e PNG 1080×1440 seguindo o **padrão default post-05** (slide 1 = capa tipo `slide-titulo`; slides 2+ = conteúdo tipo `slide-conteudo-01`). Ver `templates/README.md`.

## Process

1. **Load carousel text:** Lê o markdown do carrossel (`carousel-post-*.md` ou draft aprovado): por slide, **Headline**, **Supporting Text**, **Accent Keywords**. Slide 1 alimenta a **capa**; slides seguintes usam **só corpo** (sem título de capa no layout).

2. **Load design system:** `pipeline/data/visual-identity.md` — secção **“Padrão default: Innovation Latam — post-05”**. Consulte `examples/reference-slide-titulo-post-05.png` e `reference-slide-conteudo-post-05.png`.

3. **Gerar imagem de capa relevante (obrigatório antes do build):** Para cada post, use a ferramenta de geração de imagem do Cursor para criar uma imagem de fundo `cover-image.png` temática e relacionada ao conteúdo da notícia:
   - Leia o **Headline** e **ângulo** (medo, oportunidade, educacional, contrário, inspiracional) do Slide 1 do carrossel
   - Componha um prompt visual descritivo em inglês baseado no tema: inclua o assunto da notícia, tom emocional, estilo (dark, cinematic, tech, fotorrealístico ou ilustração abstrata) e a instrução `"wide landscape, no text, no watermark, dramatic lighting, 1080x1440 portrait"`
   - Salve a imagem gerada como `cover-image.png` dentro da pasta `output/<run>/design/<post-key>/` (ex: `output/2026-04-01-093432/design/post-01-medo/cover-image.png`)
   - O script de build detectará automaticamente esse arquivo e o usará como hero da capa; se não existir, usará o fallback `ai-brain-glow.png`

4. **Gerar imagem do Slide 2 (obrigatório antes do build):** Para cada post, gere uma imagem que **represente visualmente o que o texto do Slide 2 está retratando**:
   - Leia o **Supporting Text** do Slide 2 e identifique o assunto principal
   - Componha um prompt visual descritivo em inglês que ilustre o conteúdo (não use imagens genéricas/abstratas sem relação com o tema)
   - A composição deve ser ligeiramente mais difusa que a capa (para legibilidade com overlay escuro), mas tematicamente relevante
   - Salve como `slide2-image.png` dentro da pasta `output/<run>/design/<post-key>/`
   - O script de build usará essa imagem como fundo do Slide 2 com overlay escuro forte (75-95% opacidade)
   - Fallback: se não existir, usa a `cover-image.png`; depois `ai-brain-glow.png`

   **Exemplos de prompts por ângulo:**
   - **medo:** `"dark dramatic scene, abstract threat looming over tech devices, deep shadows, cinematic, no text"`
   - **oportunidade:** `"bright futuristic horizon, glowing opportunity portal, optimistic tech landscape, no text"`
   - **educacional:** `"clean abstract knowledge network, glowing nodes, professional tech illustration, no text"`
   - **contrário:** `"bold split scene, contrast between old and new worlds, sharp light vs dark, no text"`
   - **inspiracional:** `"epic sunrise over digital landscape, aspirational mood, warm golden tones, no text"`

5. **Logo da empresa no slide-titulo (quando aplicável):** Se a notícia mencionar uma empresa específica (ex: OpenAI, Google, Apple, Meta, Microsoft, Nvidia, etc.), adicione o logo dessa empresa na capa:
   - Obtenha o logo da empresa em PNG com fundo transparente (via busca ou download da URL oficial; ex: `https://logo.clearbit.com/<domain>`)
   - Salve como `company-logo.png` na pasta `output/<run>/design/<post-key>/` (ex: `output/2026-04-01-093432/design/post-01-medo/company-logo.png`)
   - O script de build posicionará automaticamente o logo no slide-titulo: **canto superior direito**, margem `top: 30%` e `right: 5%`, `max-width: 180px`, com sombra sutil para garantir visibilidade sobre a imagem de fundo
   - Se a notícia **não** mencionar empresa específica (ex: tema genérico de IA, mercado, tendências), **não** crie `company-logo.png` — o campo ficará vazio na capa

6. **Geração (recomendado):** Na raiz do repo:  
   `node squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs [RUN_DIR]`  
   `RUN_DIR` opcional (default: pasta mais recente em `squads/tech-instagram-carousel/output/`). O script gera `slide-01.html`…`slide-NN.html` com **logo branco embutido** e renderiza PNG com Playwright.

7. **Verificação:** Confirme legibilidade, contraste, ausência de clipping, logo Innovation Latam presente, logo da empresa posicionado corretamente (se aplicável), capa com hero relevante e conteúdos sem headline extra.

8. **Documentação:** Escreva `design-documentation.md` com sistema aplicado (post-05), cores, referência aos exemplos, imagem de capa gerada e logo da empresa utilizado (se aplicável).

**Fluxo manual:** Replique HTML/CSS conforme `templates/README.md` e `visual-identity.md`; use HTTP server + Playwright se não usar o script de build.

**Legado:** Template C (Number Focus) em `visual-identity.md` só se o brief pedir explicitamente.

## Output Format

```markdown
# Design Documentation — [Carrossel Title]

## Design System Applied

**Template:** Innovation Latam post-05 (default)

**Colors (resumo):**
- Capa: hero + gradientes; destaques headline #e8c85c
- Conteúdo: fundo roxo (#150a1c / #2a1538); destaques teal #c0fefd
- Legado Template C (opcional): Primary #0a0a0a; Accent #FFD700 (gold)
- Text Primary: #FFFFFF (white)
- Text Secondary: #AAAAAA (light gray)
- Text Muted: #888888 (medium gray)
- Light Card: #f5f5f5 (for contrast slides)

**Typography:**
- Family: Montserrat, sans-serif (Google Fonts)
- Slide 1 headline: 82px / 700 weight / letter-spacing -0.02em
- Slide 2 headline: 46px / 700 weight
- Body: 40px / 500 weight
- Handle/footer: 24px / 600 weight
- Destaques (.hl): 700 weight

**Viewport:** 1080x1440px

**Spacing:** 72px padding, 24px base unit

---

## Layout Patterns Used

**Slide 1 (Cover):**
- Pattern: Cover layout
- Rationale: [por que esse layout serve o hook]

**Slides 2, 6, 8 (Stat-heavy):**
- Pattern: Big number layout
- Rationale: [por que big numbers são hero visual aqui]

**Slides 3-5, 7 (Text-only):**
- Pattern: Text-only layout
- Rationale: [por que text hierarchy sem stat funciona aqui]

**Slide 9 (CTA):**
- Pattern: CTA layout with accent gradient
- Rationale: [por que gradient background destaca call-to-action]

---

## Color Alternation Applied

Slide 1: Dark (#0a0a0a)
Slide 2: Dark (stat with gold accent)
Slide 3: Light card (#f5f5f5 on dark)
Slide 4: Dark
Slide 5: Light card
Slide 6: Dark (stat with gold)
Slide 7: Light card
Slide 8: Dark (stat with gold)
Slide 9: Accent gradient (#FFD700 to #FFA500)

**Rationale:** Alternância dark/light cria visual rhythm. Accent gradient reservado para CTA final cria climax visual.

---

## Contrast Verification

All text combinations verified against WCAG AA 4.5:1 minimum:
- White (#FFF) on dark (#0a0a0a): 19.77:1 ✓
- Gold (#FFD700) on dark (#0a0a0a): 11.35:1 ✓
- Light gray (#AAA) on dark (#0a0a0a): 8.59:1 ✓
- Dark (#0a0a0a) on light card (#f5f5f5): 16.84:1 ✓

---

## Files Generated

- slide-01.html + slide-01.png (Cover)
- slide-02.html + slide-02.png (Context stat)
- slide-03.html + slide-03.png (Content)
- [... through slide-09/10 ...]

All HTML files are self-contained with inline CSS. No external dependencies except Google Fonts @import.

---

## Rendering Notes

- HTTP server run on port 8765 in output folder
- Playwright viewport set to 1080x1440 for all renders
- Slide 1 verified before batch (no rework needed)
- Total render time: ~[X] seconds for [N] slides
- All images saved to squads/tech-instagram-carousel/output/slides/
```

---

## Design System Documentation (Deliverable junto com slides)

[Incluir aqui o design system completo como foi aplicado]

## Quality Criteria

- [ ] Imagem de capa gerada e salva como `cover-image.png` no folder do post antes de rodar o build script
- [ ] Imagem de capa é visualmente relevante ao tema/ângulo do carrossel (não genérica)
- [ ] Imagem do slide 2 gerada e salva como `slide2-image.png` no folder do post antes de rodar o build script
- [ ] Imagem do slide 2 representa visualmente o conteúdo do texto (não genérica/abstrata sem relação)
- [ ] Se a notícia menciona empresa específica: `company-logo.png` salvo no folder do post e posicionado no slide-titulo (top 30%, right 5%)
- [ ] Se a notícia não menciona empresa específica: `company-logo.png` ausente (sem logo de empresa na capa)
- [ ] Design system documentado antes da criação de slides individuais (colors, fonts, spacing, viewport, layouts)
- [ ] Todos os arquivos HTML são self-contained: CSS inline, sem deps externas exceto Google Fonts @import
- [ ] Todos os textos atendem tamanhos mínimos de fonte para plataforma: hero 58px, body 34px, caption 24px
- [ ] Todos os textos atendem WCAG AA contrast ratio de 4.5:1 contra background (verificado e documentado)
- [ ] Dimensões do body correspondem exatamente ao viewport target: width 1080px, height 1440px
- [ ] CSS usa Grid ou Flexbox para layout primário (sem absolute positioning para estrutura)
- [ ] Conteúdo multi-slide usa design system consistente em todos os slides (mesmas cores, fontes, spacing)
- [ ] Primeiro slide foi renderizado e verificado visualmente antes de batch rendering dos demais
- [ ] Sem texto placeholder (Lorem ipsum, "Texto aqui", etc.) em qualquer deliverable
- [ ] Rationale de design documentado junto com output (explica escolhas visuais)
- [ ] Background colors alternam entre slides conforme pattern definido (dark/light/accent rhythm)
- [ ] Footer com "Innovation Latam" presente em todos os slides para brand consistency

## Veto Conditions

Reject and redo if ANY are true:

0. **Imagem de capa ausente ou genérica:** Se `cover-image.png` não foi gerada para o post (usando `ai-brain-glow.png` sem ter tentado gerar uma imagem relevante), ou se a imagem gerada não tem relação visual com o tema da notícia, o slide-titulo deve ser refeito com imagem adequada.

1. **Qualquer font size abaixo de platform minimum:** Se hero <58px ou body <34px ou caption <24px em Instagram carousel, viola specs. Texto será unreadable em mobile. Automatic rejection.

2. **Qualquer text combination com contrast ratio <4.5:1:** Fails WCAG AA accessibility standard. Text cinza claro em background light, gold em background gold, etc. Verifica contrast ANTES de usar a combinação.

3. **HTML não é self-contained:** Se arquivo referencia external stylesheet, CDN library, ou external image (exceto Google Fonts @import), rendering vai falhar. Inline CSS only.

4. **Body dimensions não correspondem a viewport exato:** Se body width ≠ 1080px ou height ≠ 1440px para Instagram carousel, rendering não é pixel-perfect. Screenshots terão dimensões erradas ou clipping.
