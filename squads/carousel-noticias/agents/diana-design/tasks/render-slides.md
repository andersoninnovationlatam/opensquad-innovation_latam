---
task: "Gerar Imagens e Renderizar Slides"
order: 2
input: |
  - art_brief: Briefing visual completo (de art-brief.md)
  - carousel_copy: Textos dos slides (de carousel-copy.md)
output: |
  - slide_images: PNGs renderizados em squads/carousel-noticias/output/slides/
  - bg_images: Imagens AI geradas em squads/carousel-noticias/output/images/
---

# Gerar Imagens e Renderizar Slides

Executa a produção visual completa do carrossel: gera imagens AI de fundo para slides ímpares via image-ai-generator, monta HTML self-contained para cada slide, e renderiza todos em PNG 1080×1350px via image-creator (Playwright).

## Process

1. **Preparar diretórios de output**: verificar que `squads/carousel-noticias/output/slides/` e `squads/carousel-noticias/output/images/` existem. Verificar que `innovation-latam-logo-white.png` está disponível no caminho indicado no briefing.

2. **Gerar imagens AI para slides ímpares**: para cada slide ímpar no briefing, chamar `image-ai-generator` com:
   - `--prompt`: o prompt de imagem AI do briefing (em inglês), enriquecido com "ultra realistic, professional photography, high resolution, 4:5 aspect ratio, clean composition"
   - `--output`: `squads/carousel-noticias/output/images/slide-0N-bg.png` (zero-padded)
   - `--mode`: `production`
   Salvar caminho de cada imagem gerada para usar no HTML.

3. **Criar HTML slide 1** (cover): montar HTML completo e self-contained com:
   - `body { width: 1080px; height: 1350px; overflow: hidden; font-family: 'Montserrat', sans-serif; }`
   - Background image da imagem gerada + overlay de gradiente
   - Headline em Montserrat Bold 700, tamanho hero (67px+)
   - Supporting text se houver, Montserrat Medium 500 (34px)
   - Branding no canto inferior direito: logo + @innovationlatam
   - Google Fonts @import como único recurso externo

4. **Renderizar slide 1 via image-creator** (Playwright): salvar como `slide-01.png`. Inspecionar visualmente o screenshot. Verificar: texto legível, branding visível, overlay correto, dimensão 1080×1350. Se houver problema, corrigir HTML antes de continuar.

5. **Criar e renderizar slides 2-N** usando o mesmo design system verificado no slide 1:
   - Slides pares: background #993CB1, texto branco, hierarquia tipográfica Heading/Body
   - Slides ímpares: background image gerada + overlay de gradiente
   - Nomear arquivos: `slide-02.png`, `slide-03.png`, etc.

6. **Apresentar galeria de slides**: exibir todos os screenshots renderizados em ordem para inspeção do usuário. Indicar quantos slides foram gerados e os caminhos de output.

## Output Format

```
=== IMAGENS AI GERADAS ===
Slide 1: squads/carousel-noticias/output/images/slide-01-bg.png ✓
Slide 3: squads/carousel-noticias/output/images/slide-03-bg.png ✓
[...demais ímpares...]

=== SLIDES RENDERIZADOS ===
slide-01.png — [dimensão verificada] ✓
slide-02.png — [dimensão verificada] ✓
[...demais slides...]

=== PREVIEW ===
[imagens renderizadas apresentadas em sequência]

Output salvo em: squads/carousel-noticias/output/slides/
Total de slides: [N]
```

## Output Example

> Use como referência de qualidade, não como template rígido.

```
=== IMAGENS AI GERADAS ===
Slide 1: squads/carousel-noticias/output/images/slide-01-bg.png ✓
Slide 3: squads/carousel-noticias/output/images/slide-03-bg.png ✓
Slide 5: squads/carousel-noticias/output/images/slide-05-bg.png ✓
Slide 7: squads/carousel-noticias/output/images/slide-07-bg.png ✓

=== SLIDES RENDERIZADOS ===
slide-01.png — 1080×1350px ✓ (cover com imagem AI + overlay + headline bold)
slide-02.png — 1080×1350px ✓ (fundo #993CB1 + texto branco)
slide-03.png — 1080×1350px ✓ (imagem AI + overlay + headline)
slide-04.png — 1080×1350px ✓ (fundo #993CB1 + texto branco)
slide-05.png — 1080×1350px ✓ (imagem AI + overlay + headline)
slide-06.png — 1080×1350px ✓ (fundo #993CB1 + texto branco)
slide-07.png — 1080×1350px ✓ (CTA + imagem AI + branding)

=== PREVIEW ===
[slide-01.png]
[slide-02.png]
...

Output salvo em: squads/carousel-noticias/output/slides/
Total de slides: 7
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
      background: linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 55%, transparent 100%);
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
  <div class="content">
    <h1>Empresas que adotaram IA reduziram custos em 34% em 18 meses. A sua ainda está esperando o quê?</h1>
    <p>Relatório McKinsey com 1.500 empresas globais</p>
  </div>
  <div class="branding">
    <img src="/absolute/path/to/innovation-latam-logo-white.png" alt="Innovation Latam" />
    <span class="handle">@innovationlatam</span>
  </div>
</body>
</html>
```

## Quality Criteria

- [ ] Imagens AI geradas com `--mode production` para todos os slides ímpares
- [ ] Slide 1 inspecionado visualmente antes de renderizar o lote
- [ ] Todos os slides em 1080×1350px (verificado no screenshot)
- [ ] Montserrat Bold 700 no cover, Medium 500 nos demais
- [ ] Overlay de gradiente em todos os slides com foto (legibilidade verificada)
- [ ] Fundo #993CB1 em todos os slides pares
- [ ] Logo branco + @innovationlatam no canto inferior direito de todos os slides
- [ ] HTML completamente self-contained (nenhuma dependência externa além de Google Fonts)
- [ ] Arquivos nomeados com zero-padding: slide-01.png, slide-02.png, etc.

## Veto Conditions

Rejeitar e refazer se:
1. Qualquer slide renderizado não tem logo + @handle visível no canto inferior direito
2. Qualquer slide com texto sobre foto não tem overlay de contraste (texto não legível)
