---
task: render-slides
agent: daria-design
order: 2
input:
  - squads/agent-social-media-innovation-latam/output/slides/slide-01.html
  - squads/agent-social-media-innovation-latam/output/slides/slide-NN.html
output:
  - squads/agent-social-media-innovation-latam/output/slides/rendered/slide-01.png
  - squads/agent-social-media-innovation-latam/output/slides/rendered/slide-NN.png
---

## Process

1. **Verificar se o script de build existe.** Checar se o arquivo `squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs` está presente no repositório.

2. **Se o script existe:** Executar via Node.js apontando para o diretório de output do run atual:
   ```bash
   node squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs squads/agent-social-media-innovation-latam/output/
   ```
   O script renderiza todos os HTMLs em `output/slides/` e salva PNGs em `output/slides/rendered/`.

3. **Se o script não existe ou falha:** Usar o Playwright browser tool diretamente para renderizar cada HTML individualmente:
   - Navegar para cada arquivo HTML local (via `file://` path absoluto)
   - Aguardar carregamento completo (incluindo Google Fonts @import)
   - Tirar screenshot com viewport exato 1080×1440px
   - Salvar em `output/slides/rendered/slide-NN.png`

4. **Verificar os PNGs gerados.** Confirmar que:
   - Todos os slides têm PNG correspondente em `output/slides/rendered/`
   - Dimensões corretas: 1080×1440px
   - Logo visível no canto superior esquerdo
   - Texto legível (sem overflow cortado)
   - Nenhum slide renderizado em branco ou com erro

5. **Documentar resultado.** Listar todos os PNGs gerados com confirmação de dimensões e status.

## Output Format

```
Renderização concluída — [N] slides

Arquivos gerados:
- output/slides/rendered/slide-01.png ✓ (1080×1440px)
- output/slides/rendered/slide-02.png ✓ (1080×1440px)
- output/slides/rendered/slide-03.png ✓ (1080×1440px)
[...]
- output/slides/rendered/slide-0N.png ✓ (1080×1440px)

Método de renderização: [script / playwright direto]
Status: COMPLETO

Verificações:
✓ Logo presente em todos os PNGs
✓ Dimensões 1080×1440px em todos os PNGs
✓ Nenhum slide em branco ou com erro de renderização
✓ Texto legível sem overflow
```

## Output Example

```
Renderização concluída — 8 slides

Verificando script: squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs
Script encontrado. Executando:
  node squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs squads/agent-social-media-innovation-latam/output/

Output do script:
  [build-carousel-slides] Processando 8 HTMLs em output/slides/
  [build-carousel-slides] slide-01.html → slide-01.png ✓
  [build-carousel-slides] slide-02.html → slide-02.png ✓
  [build-carousel-slides] slide-03.html → slide-03.png ✓
  [build-carousel-slides] slide-04.html → slide-04.png ✓
  [build-carousel-slides] slide-05.html → slide-05.png ✓
  [build-carousel-slides] slide-06.html → slide-06.png ✓
  [build-carousel-slides] slide-07.html → slide-07.png ✓
  [build-carousel-slides] slide-08.html → slide-08.png ✓
  [build-carousel-slides] Concluído. 8/8 PNGs gerados.

Arquivos gerados em output/slides/rendered/:
- slide-01.png ✓ (1080×1440px — Cover Layout, logo presente)
- slide-02.png ✓ (1080×1440px — Image Context Layout, overlay visível)
- slide-03.png ✓ (1080×1440px — Standard Content Layout, fundo roxo)
- slide-04.png ✓ (1080×1440px — Split Content Layout, callout box teal)
- slide-05.png ✓ (1080×1440px — Standard Content Layout)
- slide-06.png ✓ (1080×1440px — Split Content Layout)
- slide-07.png ✓ (1080×1440px — Reflection Layout, texto centralizado)
- slide-08.png ✓ (1080×1440px — CTA Layout, botão teal presente)

Método de renderização: build-carousel-slides.mjs (Playwright via script)
Status: COMPLETO — 8/8 slides renderizados com sucesso

Verificações visuais:
✓ Logo Innovation Latam branco visível no canto superior esquerdo de todos os slides
✓ Dimensões 1080×1440px confirmadas em todos os PNGs
✓ Nenhum slide em branco ou erro de renderização
✓ Texto legível, sem overflow cortado em nenhum slide
✓ Rodapé @innovationlatam | ARRASTE → visível nos slides 1-6
✓ Slides 7 e 8 sem rodapé ARRASTE (correto para Reflection e CTA)
✓ Botão teal visível no slide 8 (CTA Layout)
```

## Quality Criteria

- Todos os HTMLs foram renderizados para PNG correspondente (N HTMLs = N PNGs)
- Dimensões confirmadas como 1080×1440px em todos os PNGs
- Logo visível e posicionado corretamente em todos os slides
- Nenhum PNG em branco, com erro ou texto cortado/overflow

## Veto Conditions

1. Número de PNGs gerados diferente do número de HTMLs de input — renderização incompleta
2. Qualquer PNG com dimensão diferente de 1080×1440px — falha de especificação técnica
