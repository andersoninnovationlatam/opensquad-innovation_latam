---
execution: inline
agent: daria-design
inputFile: squads/agent-social-media-innovation-latam/output/slides/
outputFile: squads/agent-social-media-innovation-latam/output/slides/rendered/
---

## Context Loading

Antes de executar, carregar:
- `squads/agent-social-media-innovation-latam/output/slides/design-documentation.md` — confirmação de quais HTMLs foram gerados
- `squads/agent-social-media-innovation-latam/agents/daria-design/tasks/render-slides.md` — task file detalhado

## Instructions

### Process

1. **Listar todos os HTMLs** em `output/slides/` — confirmar que o número de HTMLs corresponde ao número de slides do carrossel.

2. **Verificar existência do script de build:**
   ```
   squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs
   ```

3. **Se o script existe:** Executar via Node.js com o diretório de output do squad como argumento:
   ```bash
   node squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs squads/agent-social-media-innovation-latam/output/
   ```
   O script processa todos os HTMLs em `output/slides/` e salva PNGs em `output/slides/rendered/`.

4. **Se o script não existe ou retorna erro:** Usar o Playwright browser tool diretamente para cada HTML:
   - Navegar para `file:///[ABSOLUTE_PATH]/output/slides/slide-NN.html`
   - Aguardar carregamento completo incluindo Google Fonts (usar `wait_for: networkidle` ou aguardar 3 segundos)
   - Capturar screenshot com clip: `{x: 0, y: 0, width: 1080, height: 1440}`
   - Salvar como `output/slides/rendered/slide-NN.png`
   - Repetir para todos os slides em ordem numérica

5. **Verificar todos os PNGs gerados:**
   - Número de PNGs = número de HTMLs
   - Dimensões: 1080×1440px
   - Logo visível no canto superior esquerdo
   - Texto legível, sem overflow cortado
   - Nenhum PNG em branco ou com erro de renderização

6. **Documentar resultado** com lista completa de PNGs e status de verificação.

## Output Format

```
Renderização — [N] slides

Método: [build-carousel-slides.mjs / Playwright direto]

Arquivos gerados em output/slides/rendered/:
- slide-01.png ✓ (1080×1440px)
- slide-02.png ✓ (1080×1440px)
[...]
- slide-0N.png ✓ (1080×1440px)

Verificações visuais:
✓ Logo presente e posicionado corretamente em todos os slides
✓ Dimensões 1080×1440px confirmadas
✓ Nenhum PNG em branco ou com erro
✓ Texto legível sem overflow em todos os slides
✓ Variação de layout visível entre slides de conteúdo

Status: COMPLETO — [N]/[N] slides renderizados com sucesso
```

## Output Example

```
Renderização — 8 slides

Verificando: squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs
✓ Script encontrado.

Executando:
  node squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs squads/agent-social-media-innovation-latam/output/

Output do script:
  Processando 8 HTMLs em output/slides/
  slide-01.html → slide-01.png ✓
  slide-02.html → slide-02.png ✓
  slide-03.html → slide-03.png ✓
  slide-04.html → slide-04.png ✓
  slide-05.html → slide-05.png ✓
  slide-06.html → slide-06.png ✓
  slide-07.html → slide-07.png ✓
  slide-08.html → slide-08.png ✓
  Concluído. 8/8 PNGs gerados em output/slides/rendered/

Arquivos gerados em output/slides/rendered/:
- slide-01.png ✓ (1080×1440px — Cover Layout, hero text "R$3,20" em gold)
- slide-02.png ✓ (1080×1440px — Image Context Layout, overlay escuro sobre imagem)
- slide-03.png ✓ (1080×1440px — Standard Content Layout, fundo roxo)
- slide-04.png ✓ (1080×1440px — Split Content Layout, callout box teal)
- slide-05.png ✓ (1080×1440px — Standard Content Layout)
- slide-06.png ✓ (1080×1440px — Split Content Layout, "67%" em destaque)
- slide-07.png ✓ (1080×1440px — Reflection Layout, texto centralizado)
- slide-08.png ✓ (1080×1440px — CTA Layout, botão teal visível)

Verificações visuais:
✓ Logo Innovation Latam branco presente e posicionado no canto superior esquerdo em 8/8 slides
✓ Dimensões 1080×1440px confirmadas em todos os PNGs
✓ Nenhum PNG em branco ou erro de renderização
✓ Texto legível sem overflow em todos os slides
✓ Rodapé @innovationlatam | ARRASTE → visível nos slides 1-6
✓ Slides 7 e 8 sem rodapé ARRASTE → (correto para Reflection e CTA)
✓ Botão teal #50beba visível no slide 8
✓ Variação de layout claramente distinguível entre slides

Método: build-carousel-slides.mjs (Playwright via script)
Status: COMPLETO — 8/8 slides renderizados com sucesso
```

## Veto Conditions

1. Número de PNGs gerados diferente do número de HTMLs de input — renderização incompleta, step deve ser re-executado
2. Qualquer PNG com dimensão diferente de 1080×1440px — falha de especificação técnica que invalida os slides para publicação

## Quality Criteria

- Todos os HTMLs renderizados para PNG correspondente (N HTMLs = N PNGs)
- Dimensões 1080×1440px confirmadas em todos os PNGs
- Logo visível e corretamente posicionado em todos os slides
- Nenhum PNG em branco, com erro ou texto cortado/overflow
