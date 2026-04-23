---
execution: inline
agent: daria-design
inputFile: squads/agent-social-media-v2/output/slides/
outputFile: squads/agent-social-media-v2/output/slides/
---

## Context Loading

Antes de executar, carregar:
- `squads/agent-social-media-v2/output/slides/design-documentation.md` — confirmação de quais HTMLs foram gerados
- `squads/agent-social-media-v2/agents/daria-design/tasks/render-slides.md` — task file detalhado
- `squads/agent-social-media-v2/pipeline/data/real-imagery-and-safe-zones.md` — export **JPEG** único em `rendered/`

## Instructions

### Process

**Extremamente importante:** este step exige **execução real** dos scripts (Shell na raiz do repo). O runner **não** pode apenas “assumir” que as imagens existem: deve **correr** `generate-bg-image.mjs` + `inject-bg-and-render.mjs` para cada slide, **ou** `run-squad-design.mjs {run_id}` uma vez.

**Norma atual:** o render final do carrossel vem de **`inject-bg-and-render.mjs`** (fundo IA injetado + screenshot **JPEG**). Preferir o orquestrador `run-squad-design.mjs <run-id>` da raiz do repo, que já encadeia geração de fundo + inject por slide.

1. **Localizar HTMLs** em `output/{run_id}/slides/{version}/` (ex.: `v1/slide-01.html` … `slide-06.html`).

2. **Confirmar** que existem imagens em `slides/backgrounds/bg-NN.*` e que o inject foi executado por slide (ou executar):
   ```bash
   node squads/agent-social-media-v2/scripts/inject-bg-and-render.mjs NN squads/agent-social-media-v2/output/{run_id}/slides
   ```

3. **Verificar ficheiros em** `output/{run_id}/slides/{version}/rendered/`:
   - Um **`slide-NN.jpg`** por slide (único formato; ver `real-imagery-and-safe-zones.md` regra 4)
   - Dimensões: 1080×1350px
   - Logo visível; texto legível; sem overflow
   - Rodapé `@innovationlatam` + `ARRASTE ->` visível em todos os slides

4. **Legado (opcional):** `squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs` pode gerar **PNG** para outros fluxos — **não** substitui o JPEG do squad v2 para publicação Instagram.

5. **Documentar resultado** com lista de `slide-NN.jpg` e verificações.

## Output Format

```
Renderização — [N] slides

Método: inject-bg-and-render.mjs (ou run-squad-design.mjs)

Arquivos em .../slides/v1/rendered/:
- slide-01.jpg ✓ (1080×1350px)
- slide-02.jpg ✓ (1080×1350px)
[...]

Verificações:
✓ N JPEGs = N HTMLs
✓ Dimensões 1080×1350px
✓ Nenhum ficheiro em branco ou com erro de renderização

Status: COMPLETO — [N]/[N] slides
```

## Veto Conditions

1. Número de JPEGs em `rendered/` diferente do número de HTMLs — renderização incompleta
2. Qualquer imagem final com dimensão diferente de 1080×1350px

## Quality Criteria

- Cada `slide-NN.html` tem `slide-NN.jpg` correspondente após o pipeline completo
- Dimensões 1080×1350px
- Logo e copy conforme `real-imagery-and-safe-zones.md` e `layout-variations.md`
