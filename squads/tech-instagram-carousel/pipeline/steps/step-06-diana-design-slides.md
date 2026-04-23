---
execution: inline
agent: diana-design
inputFile: squads/tech-instagram-carousel/output/carousel-draft.md
outputFile: squads/tech-instagram-carousel/output/slides/
---

# Step 06: Slide Design & Rendering

## Context Loading

Load these files before executing:
- `squads/tech-instagram-carousel/output/carousel-draft.md` — copy completo do carrossel (Copywriter), ou os `carousel-post-*.md` do run em `output/<data>/`
- `pipeline/data/visual-identity.md` — **padrão default post-05** (capa + conteúdo roxo)
- `squads/tech-instagram-carousel/examples/` — PNGs de referência (`reference-slide-titulo-post-05.png`, `reference-slide-conteudo-post-05.png`)
- `pipeline/data/anti-patterns.md` — design mistakes to avoid

## Instructions

### Process

1. **Load carousel text:** Quantos slides; por slide: Headline, Supporting Text, Accent Keywords. Slide 1 = capa; demais = conteúdo (sem título de capa no layout dos slides 2+).

2. **Load design system:** Secção **"Padrão default: Innovation Latam — post-05"** em `visual-identity.md`.

3. **Gerar imagens por post (obrigatório antes do build) — usar modo `production` (Gemini via OpenRouter):**
   - Para cada post, leia o **Headline** do Slide 1 e o **ângulo** do carrossel (medo / oportunidade / educacional / contrário / inspiracional)
   - Use a skill `image-ai-generator` em **modo `production`** (Google Gemini via OpenRouter) para máxima qualidade:
     ```bash
     python3 skills/image-ai-generator/scripts/generate.py \
       --prompt "PROMPT_AQUI" \
       --output "output/<run>/design/<post-key>/cover-image.png" \
       --mode production
     ```
   - **Imagem do Slide 1 (capa):** estilo `"dark cinematic, no text, no watermark, dramatic lighting, 1080x1440 portrait, hyper realistic, 4K quality"`, ajustando ao tema da notícia
   - **Imagem do Slide 2 (conteúdo com fundo):** gere uma **segunda imagem** que **represente visualmente o que o texto do slide 2 está retratando**, funcionando como fundo temático para texto denso. Salve como `slide2-image.png`:
     ```bash
     python3 skills/image-ai-generator/scripts/generate.py \
       --prompt "PROMPT_SLIDE2_AQUI" \
       --output "output/<run>/design/<post-key>/slide2-image.png" \
       --mode production
     ```
     - **IMPORTANTE:** A imagem deve representar o conteúdo do texto — leia o **Supporting Text** do Slide 2 e crie um prompt visual que ilustre o assunto. A composição deve ser ligeiramente mais difusa que a capa (para legibilidade com overlay), mas **tematicamente relevante** ao conteúdo. Ex.: se o texto fala sobre IA substituindo empregos, use `"worried office workers looking at AI robot taking over desk, dark cinematic, dramatic shadows, deep purple tones, no text, no watermark, 1080x1440 portrait, hyper realistic, 4K quality"`. Evite imagens genéricas/abstratas sem relação com o tema.
   - Exemplos de prompts base por ângulo (slide 1 — capa):
     - medo → `"dark dramatic scene, abstract digital threat, deep shadows, cinematic tech, no text, hyper realistic, 4K quality"`
     - oportunidade → `"bright futuristic horizon, glowing opportunity portal, optimistic tech landscape, no text, hyper realistic, 4K quality"`
     - educacional → `"clean abstract knowledge network, glowing nodes, professional tech illustration, no text, hyper realistic, 4K quality"`
     - contrário → `"bold split scene, contrast between old and new tech worlds, sharp light vs dark, no text, hyper realistic, 4K quality"`
     - inspiracional → `"epic sunrise over digital landscape, aspirational mood, warm golden tones, no text, hyper realistic, 4K quality"`
   - O script de build detecta `cover-image.png` e `slide2-image.png` automaticamente; se ausentes, usa `ai-brain-glow.png` como fallback
   - **IMPORTANTE:** Sempre usar `--mode production` para qualidade final. Modo `test` apenas para validar composição rapidamente

4. **Logo da empresa no slide-titulo (quando aplicável):**
   - Analise o conteúdo do carrossel: a notícia menciona uma empresa específica (ex: OpenAI, Google, Apple, Meta, Microsoft, Nvidia, etc.)?
   - **Se sim:** baixe o logo da empresa em PNG com fundo transparente (ex: via `https://logo.clearbit.com/<domain>`) e salve como `company-logo.png` em `output/<run>/design/<post-key>/company-logo.png`. O script posicionará automaticamente: canto superior direito, `top: 30%`, `right: 5%`, `max-width: 180px`
   - **Se não:** não crie o arquivo — a capa ficará sem logo de empresa

5. **Gerar slides (preferido):** Na raiz do repo:
   `node squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs [RUN_DIR]`
   O script gera HTML+PNG por post em `RUN_DIR/design/<post-key>/slides/` (logo branco já no HTML).

6. **Verificar:** Legibilidade, contraste, logo Innovation Latam visível, logo da empresa posicionado corretamente (se aplicável), **fonte Montserrat em todos os slides** (Bold 700 nos headlines, Medium 500 no body, letter-spacing -0.02em na capa), capa com hero relevante ao conteúdo, **slide 2 com imagem como FUNDO FULL-BLEED** (background-image cover + overlay escuro, nunca `<img>` em caixa) **+ maior carga de texto do carrossel (mín. 60 palavras)**, conteúdos com handle + ARRASTE conforme spec.

7. **Documentar:** `design-documentation.md` no folder de design do run, referenciando post-05, exemplos, imagem de capa gerada e logo da empresa (se aplicável).

**Alternativa manual:** Seguir `agents/diana-design/tasks/design-slides.md` (fluxo HTTP server + HTML próprio) se o build não for aplicável.

## Output Format

**Output files:**
- `squads/tech-instagram-carousel/output/slides/slide-01.html` through `slide-N.html`
- `squads/tech-instagram-carousel/output/slides/slide-01.png` through `slide-N.png`
- `squads/tech-instagram-carousel/output/slides/design-documentation.md` — rationale

**Design documentation structure:**

```markdown
# Design Documentation — [Carousel Title]

## Design System Applied

**Template:** Innovation Latam post-05 (capa + conteúdo)

**Colors:** [list with hex values e rationale]
**Typography:** [family, sizes, weights]
**Viewport:** 1080x1440px
**Spacing:** [padding, base unit]

## Cover Images Generated

[Para cada post: descreva o prompt usado e a imagem gerada]

## Layout Patterns Used

[Para cada type de slide, explica qual pattern e why]

## Color Alternation Applied

[Lista background color por slide com rationale do rhythm]

## Contrast Verification

[Verifica todas combinations contra WCAG AA 4.5:1]

## Files Generated

[Lista todos HTML e PNG files]

## Rendering Notes

[HTTP server, Playwright viewport, verificação, timing]
```

## Output Example

Ver design documentation format completo em `pipeline/data/output-examples.md` (Example 5: Visual Identity Reference).

Slides HTML examples em `pipeline/data/template-reference.html` e design.yaml artifacts (agents → diana-design → output_examples).

## Veto Conditions

Reject and redo if ANY of these are true:

0. **Slide 2 com imagem em caixa (não fundo completo):** Se o Slide 2 exibe a imagem dentro de um `<img>` em caixa/box ao invés de usar `background-image: url(...); background-size: cover` cobrindo o slide inteiro com overlay escuro, é rejeição automática. O Slide 2 DEVE ter imagem como fundo full-bleed (igual à capa), com overlay `rgba(21,10,28, 0.75-0.95)` por cima para legibilidade do texto. Use sempre o build script — `contentWithImageSlideHtml` já aplica esse padrão.

0b. **Slide 2 com menos texto que os demais:** Se o Supporting Text do Slide 2 tem menos de 60 palavras, rejeite. É o slide de contexto/aprofundamento e deve sempre ter a maior carga de texto do carrossel.

0c. **Imagem de capa ausente ou genérica:** Se `cover-image.png` não foi gerada para o post (e `ai-brain-glow.png` foi usado sem tentativa de gerar imagem relevante), ou se a imagem não tem relação visual com o tema da notícia, o slide-titulo deve ser refeito.

1. **Qualquer font size abaixo de platform minimum:** Hero <58px ou body <34px ou caption <24px viola Instagram specs. Automatic rejection.

2. **Qualquer text combination com contrast <4.5:1:** Fails WCAG AA. Cinza claro em light background, gold em gold background, etc. Verifica contrast ANTES de usar.

3. **HTML não é self-contained:** Se referencia external stylesheet, CDN, ou external image (exceto Google Fonts @import), rendering vai falhar.

4. **Body dimensions não correspondem a viewport exato:** Se body width ≠ 1080px ou height ≠ 1440px, screenshots terão dimensões erradas.

## Quality Criteria

- [ ] Imagem de capa gerada e salva como `cover-image.png` por post antes do build (modo `production`)
- [ ] Imagem de capa é visualmente relevante ao tema/ângulo do carrossel
- [ ] Imagem do slide 2 gerada e salva como `slide2-image.png` por post (modo `production`)
- [ ] Imagem do slide 2 representa visualmente o conteúdo do texto (tematicamente relevante, não genérica)
- [ ] Slide 2 usa imagem como FUNDO FULL-BLEED (`background-image: cover` + overlay escuro) — nunca `<img>` em caixa
- [ ] Slide 2 tem maior carga de texto do carrossel (Supporting Text ≥ 60 palavras)
- [ ] Todas as imagens geradas via OpenRouter Gemini (`--mode production`)
- [ ] Se notícia menciona empresa específica: `company-logo.png` salvo e posicionado corretamente no slide-titulo
- [ ] Design system documentado antes de slides individuais
- [ ] HTML self-contained (inline CSS, Google Fonts @import only)
- [ ] Font sizes atendem minimums (58/34/24)
- [ ] Contrast ratio >=4.5:1 em todas combinations
- [ ] Body dimensions exatas (1080x1440)
- [ ] Grid ou Flexbox para layout (não absolute positioning)
- [ ] Design system consistente em todos slides
- [ ] Slide 1 verificado antes de batch rendering
- [ ] Sem placeholder text em qualquer slide
- [ ] Rationale documentado (incluindo descrição das imagens de capa geradas)
- [ ] Background colors alternam conforme pattern
- [ ] Footer "Innovation Latam" presente em todos
