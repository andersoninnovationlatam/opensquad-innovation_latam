---
execution: subagent
agent: diana-design
model_tier: powerful
inputFile: squads/carousel-noticias/output/art-brief.md
outputFile: squads/carousel-noticias/output/slides/
---

# Step 09: Gerar Imagens e Renderizar Slides

## Context Loading

Load these files before executing:
- `squads/carousel-noticias/output/art-brief.md` — briefing visual com design system, especificações de cada slide e prompts de paródia editorial
- `squads/carousel-noticias/output/carousel-copy.md` — textos dos slides para incluir nos HTMLs
- `squads/carousel-noticias/output/image-refs.json` — referências visuais das marcas (cores, logos, notas de paródia) para usar como contexto ao gerar imagens via script
- `_opensquad/_memory/company.md` — identidade visual (logo path, handle, cores)

## Instructions

### Process
1. Verificar que `squads/carousel-noticias/output/slides/` existe. Verificar que `squads/carousel-noticias/assets/innovation-latam-logo-white.png` existe (ou seguir instrução do briefing para copiá-lo).
2. **Decidir o background de cada slide ímpar (1, 3, 5, 7) por prioridade:**
   - **Prioridade 1 — usar imagem do Bruno**: se existir `squads/carousel-noticias/output/images/slide-0N-ref.*` (referência baixada pelo Bruno no Step 4), copiar para `squads/carousel-noticias/output/images/slide-0N-bg.<ext>` e usar como background. Não chamar `image-ai-generator` neste caso.
   - **Prioridade 2 — gerar via IA**: somente quando o Bruno não retornou imagem para aquele slide (entidade ausente no `=== ENTIDADES ===` do copy ou download falhou). Chamar `image-ai-generator` com o prompt do briefing (mode production) e salvar em `squads/carousel-noticias/output/images/slide-0N-bg.png`.
     - Os prompts já chegam enriquecidos com identidade visual das marcas — usar exatamente o prompt do briefing, sem simplificar.
     - Alternativa via script: `node squads/carousel-noticias/scripts/generate-bg-image.mjs <N> squads/carousel-noticias/output`.
3. Registrar a origem do background de cada slide ímpar no resumo final (`reference` quando vier do Bruno, `ai-generated` quando vier do image-ai-generator).
4. Criar HTML do slide 1 com o design system do briefing. Renderizar via image-creator (Playwright) em `squads/carousel-noticias/output/slides/slide-01.png`. Inspecionar screenshot.
5. Se slide 1 aprovado na inspeção visual, criar e renderizar todos os slides restantes.
6. Slides pares: background #993CB1, texto branco, hierarquia heading/body. **Sem overlay — fundo sólido não precisa de scrim.**
7. Slides ímpares: background-image com imagem (referência do Bruno OU gerada por IA) + dois layers de contraste obrigatórios:
   - `.overlay` — gradiente sutil cobrindo o slide inteiro (escurece levemente a foto)
   - `.text-scrim` — gradiente fosco matte concentrado atrás do bloco de texto (bottom 60% do slide, rgba(0,0,0,0.85) → transparent), garante contraste WCAG AA com fonte branca
8. Todo HTML: dimensão exata 1080×1350px, Montserrat @import. Branding fixo em todos os slides:
   - Logo Innovation Latam branco → canto superior esquerdo (margem 56px, altura 40px)
   - `@innovationlatam` → canto inferior esquerdo (margem 56px)
   - `ARRASTE →` → canto inferior direito (omitir no último slide)
9. Apresentar todos os slides renderizados para inspeção final.

## Output Format

```
=== PRODUÇÃO VISUAL ===

Backgrounds dos slides ímpares (origem):
  slide-01-bg.* — reference (Bruno) ✓
  slide-03-bg.* — reference (Bruno) ✓
  slide-05-bg.* — ai-generated ✓
  slide-07-bg.* — ai-generated ✓

Slides renderizados:
  slide-01.png — 1080×1350px ✓
  slide-02.png — 1080×1350px ✓
  [...]

Total: [N] slides em squads/carousel-noticias/output/slides/

=== PREVIEW ===
[imagens apresentadas em ordem]
```

## Output Example

```
=== PRODUÇÃO VISUAL ===

Imagens AI geradas:
  slide-01-bg.png ✓ (professional in modern office, warm lighting)
  slide-03-bg.png ✓ (diverse team collaborating around table)
  slide-05-bg.png ✓ (exponential growth chart on screen)
  slide-07-bg.png ✓ (person on mobile phone, open posture)

Slides renderizados:
  slide-01.png — 1080×1350px ✓ (cover + overlay + headline bold + branding)
  slide-02.png — 1080×1350px ✓ (#993CB1 + texto branco + branding)
  slide-03.png — 1080×1350px ✓ (foto + overlay + headline + branding)
  slide-04.png — 1080×1350px ✓ (#993CB1 + texto branco + branding)
  slide-05.png — 1080×1350px ✓ (foto + overlay + headline + branding)
  slide-06.png — 1080×1350px ✓ (#993CB1 + CTA + branding)

Total: 6 slides em squads/carousel-noticias/output/slides/

=== PREVIEW ===
[slide-01.png]
[slide-02.png]
[slide-03.png]
[slide-04.png]
[slide-05.png]
[slide-06.png]
```

HTML exemplo (slide ímpar):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px; height: 1350px; overflow: hidden;
      font-family: 'Montserrat', sans-serif;
      position: relative;
      display: flex; flex-direction: column;
      justify-content: flex-end; padding: 80px;
    }
    .bg {
      position: absolute; inset: 0;
      background-image: url('/absolute/path/to/slide-01-bg.png');
      background-size: cover; background-position: center;
    }
    .overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%);
    }
    .text-scrim {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 62%;
      background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 35%, rgba(0,0,0,0.40) 65%, transparent 100%);
    }
    .content { position: relative; z-index: 2; max-width: 920px; }
    h1 { font-size: 67px; font-weight: 700; color: #ffffff; line-height: 1.2; margin-bottom: 24px; }
    p { font-size: 34px; font-weight: 500; color: rgba(255,255,255,0.85); line-height: 1.5; }
    .branding {
      position: absolute; bottom: 44px; right: 56px; z-index: 2;
      display: flex; align-items: center; gap: 14px;
    }
    .branding img { height: 38px; }
    .handle { font-size: 26px; font-weight: 500; color: rgba(255,255,255,0.75); }
  </style>
</head>
<body>
  <div class="bg"></div>
  <div class="overlay"></div>
  <div class="text-scrim"></div>
  <div class="content">
    <h1>O Brasil tem o 2º maior Open Banking do mundo. O que sua empresa vai fazer com isso?</h1>
    <p>40 milhões de usuários ativos — Banco Central 2024</p>
  </div>
  <div class="branding">
    <img src="/absolute/path/to/innovation-latam-logo-white.png" alt="Innovation Latam" />
    <span class="handle">@innovationlatam</span>
  </div>
</body>
</html>
```

## Veto Conditions

Rejeitar e redo se:
1. Qualquer slide sem logo no canto superior esquerdo OU sem `@innovationlatam` no canto inferior esquerdo
2. Slide intermediário sem `ARRASTE →` no canto inferior direito (regra: presente em todos exceto o último)
3. Último slide com `ARRASTE →` (não há próximo slide)
4. Qualquer slide com foto mas sem `.text-scrim` (gradiente fosco atrás do texto) — texto branco sobre foto sem scrim é ilegível
5. Slides pares (#993CB1) com `.text-scrim` ou `.overlay` — fundo sólido não recebe esses layers

## Quality Criteria

- [ ] Slides ímpares com `slide-0N-ref.*` disponível usam a imagem do Bruno como background (sem regerar via IA)
- [ ] Slides ímpares sem referência do Bruno têm `slide-0N-bg.png` gerado via image-ai-generator
- [ ] Slide 1 inspecionado antes do lote
- [ ] Todos os slides 1080×1350px
- [ ] Montserrat Bold 700 no cover, Medium 500 nos demais
- [ ] Branding em todos os slides
- [ ] HTML completamente self-contained
- [ ] Resumo final lista origem do background de cada slide ímpar (`reference` ou `ai-generated`)
