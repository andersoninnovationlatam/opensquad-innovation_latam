---
task: "Gerar Imagens e Renderizar Slides"
order: 2
input: |
  - art_brief: Briefing visual completo (de art-brief.md)
  - carousel_copy: Textos dos slides (de carousel-copy.md)
  - reference_images: Imagens reais baixadas pelo Bruno em output/images/index.json
output: |
  - slide_images: PNGs renderizados em squads/carousel-noticias/output/slides/
  - bg_images: Imagens de fundo em squads/carousel-noticias/output/images/
---

# Gerar Imagens e Renderizar Slides

Executa a produção visual completa do carrossel: usa as 4 imagens reais do Bruno (`slide-01-ref.*`, `slide-03-ref.*`, `slide-05-ref.*`, `slide-07-ref.*`) como base para os backgrounds dos slides ímpares 1, 3, 5 e 7, monta HTML self-contained para cada slide, e renderiza sempre **8 slides** em PNG 1080×1350px via image-creator (Playwright).

**Estrutura fixa — sempre 8 slides:**
- Slides ímpares (1, 3, 5, 7): background com imagem de referência do Bruno + overlay de gradiente
- Slides pares (2, 4, 6, 8): background sólido #993CB1 + texto branco

## Process

1. **Preparar diretórios de output**: verificar que `squads/carousel-noticias/output/slides/` e `squads/carousel-noticias/output/images/` existem. Verificar que `innovation-latam-logo-white.png` está disponível no caminho indicado no briefing.

2. **Carregar imagens de referência do Bruno**: ler `squads/carousel-noticias/output/images/index.json`. O index mapeia cada imagem a um slide específico via campo `slide`. Usar essa correspondência direta: `slide-01-ref.*` → slide 1, `slide-03-ref.*` → slide 3, `slide-05-ref.*` → slide 5, `slide-07-ref.*` → slide 7.

3. **Gerar imagens AI para slides ímpares**: para cada slide ímpar no briefing, chamar `image-ai-generator` com:
   - `--prompt`: o prompt de imagem AI do briefing (em inglês), enriquecido com "ultra realistic, professional photography, high resolution, 4:5 aspect ratio, clean composition". **Se houver imagem de referência do Bruno relevante para o slide, incluir no prompt: "inspired by [descrição da imagem de referência], incorporate the visual identity of [entidade]"**
   - `--reference`: caminho absoluto da imagem de referência do Bruno (quando disponível e relevante ao slide)
   - `--output`: `squads/carousel-noticias/output/images/slide-0N-bg.png` (zero-padded)
   - `--mode`: `production`
   Salvar caminho de cada imagem gerada para usar no HTML.

   **Alternativa quando image-ai-generator não suportar `--reference`**: usar a imagem do Bruno diretamente como background do slide, aplicando filtros CSS (blur, brightness, saturate) e overlay de gradiente para adequar ao design system.

3. **Criar HTML slide 1** (cover): montar HTML completo e self-contained com:
   - `body { width: 1080px; height: 1350px; overflow: hidden; font-family: 'Montserrat', sans-serif; }`
   - Background image da imagem gerada + overlay de gradiente
   - Headline em Montserrat Bold 700, tamanho hero (67px+)
   - Supporting text se houver, Montserrat Medium 500 (34px)
   - Branding no canto inferior direito: logo + @innovationlatam
   - Google Fonts @import como único recurso externo

4. **Renderizar slide 1 via image-creator** (Playwright): salvar como `slide-01.png`. Inspecionar visualmente o screenshot. Verificar: texto legível, branding visível, overlay correto, dimensão 1080×1350. Se houver problema, corrigir HTML antes de continuar.

5. **Criar e renderizar slides 2-8** usando o mesmo design system verificado no slide 1. O carrossel sempre terá exatamente **8 slides**:
   - Slides pares (2, 4, 6, 8): background #993CB1, texto branco, hierarquia tipográfica Heading/Body + overlay radial no centro (`radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0.35) 0%, transparent 65%)`) para contraste com fonte branca
   - Slides ímpares intermediários (3, 5, 7): background com imagem de referência do Bruno (`slide-03-ref.*`, `slide-05-ref.*`, `slide-07-ref.*`) + overlay radial no centro (`radial-gradient(ellipse 90% 75% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.10) 80%, transparent 100%)`)
   - Slide 8 (último/CTA): background sólido #993CB1, sem imagem de fundo — CTA com texto grande e branding destacado
   - Nomear arquivos: `slide-02.png`, `slide-03.png`, ..., `slide-08.png`

6. **Apresentar galeria de slides**: exibir todos os 8 screenshots renderizados em ordem para inspeção do usuário. Indicar os caminhos de output.

## Output Format

```
=== IMAGENS AI GERADAS ===
Slide 1: squads/carousel-noticias/output/images/slide-01-bg.png ✓ (ref: slide-01-ref.*)
Slide 3: squads/carousel-noticias/output/images/slide-03-bg.png ✓ (ref: slide-03-ref.*)
Slide 5: squads/carousel-noticias/output/images/slide-05-bg.png ✓ (ref: slide-05-ref.*)
Slide 7: squads/carousel-noticias/output/images/slide-07-bg.png ✓ (ref: slide-07-ref.*)

=== SLIDES RENDERIZADOS ===
slide-01.png — [dimensão verificada] ✓
slide-02.png — [dimensão verificada] ✓
[...até slide-08.png...]

=== PREVIEW ===
[imagens renderizadas apresentadas em sequência]

Output salvo em: squads/carousel-noticias/output/slides/
Total de slides: 8
```

## Output Example

> Use como referência de qualidade, não como template rígido.

```
=== IMAGENS AI GERADAS ===
Slide 1: squads/carousel-noticias/output/images/slide-01-bg.png ✓ (ref: slide-01-ref.webp)
Slide 3: squads/carousel-noticias/output/images/slide-03-bg.png ✓ (ref: slide-03-ref.png)
Slide 5: squads/carousel-noticias/output/images/slide-05-bg.png ✓ (ref: slide-05-ref.jpg)
Slide 7: squads/carousel-noticias/output/images/slide-07-bg.png ✓ (ref: slide-07-ref.jpg)

=== SLIDES RENDERIZADOS ===
slide-01.png — 1080×1350px ✓ (cover com imagem AI + overlay + headline bold)
slide-02.png — 1080×1350px ✓ (fundo #993CB1 + texto branco)
slide-03.png — 1080×1350px ✓ (imagem AI + overlay + headline)
slide-04.png — 1080×1350px ✓ (fundo #993CB1 + texto branco)
slide-05.png — 1080×1350px ✓ (imagem AI + overlay + headline)
slide-06.png — 1080×1350px ✓ (fundo #993CB1 + texto branco)
slide-07.png — 1080×1350px ✓ (imagem AI + overlay + headline)
slide-08.png — 1080×1350px ✓ (fundo #993CB1 + CTA + branding)

=== PREVIEW ===
[slide-01.png]
[slide-02.png]
...
[slide-08.png]

Output salvo em: squads/carousel-noticias/output/slides/
Total de slides: 8
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
      background: linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.60) 25%, rgba(0,0,0,0.15) 50%, transparent 65%);
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

- [ ] Imagens AI geradas com `--mode production` para os 4 slides ímpares (1, 3, 5, 7), usando as referências do Bruno
- [ ] Slide 1 inspecionado visualmente antes de renderizar o lote
- [ ] **Exatamente 8 slides** renderizados: slide-01.png a slide-08.png
- [ ] Todos os slides em 1080×1350px (verificado no screenshot)
- [ ] Montserrat Bold 700 no cover, Medium 500 nos demais
- [ ] Overlay de gradiente em todos os slides com foto (legibilidade verificada)
- [ ] Fundo #993CB1 em todos os slides pares (2, 4, 6, 8)
- [ ] Logo branco + @innovationlatam no canto inferior direito de todos os slides
- [ ] HTML completamente self-contained (nenhuma dependência externa além de Google Fonts)
- [ ] Arquivos nomeados com zero-padding: slide-01.png, slide-02.png, ..., slide-08.png

## Veto Conditions

Rejeitar e refazer se:
1. Qualquer slide renderizado não tem logo + @handle visível no canto inferior direito
2. Qualquer slide com texto sobre foto não tem overlay de contraste (texto não legível)
