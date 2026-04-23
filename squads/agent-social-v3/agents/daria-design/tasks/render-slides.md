---
task: render-slides
agent: daria-design
order: 2
input:
  - squads/agent-social-v3/output/slides/v1/slide-01.html
  - squads/agent-social-v3/output/slides/v1/slide-NN.html
output:
  - squads/agent-social-v3/output/slides/v1/rendered/slide-01.jpg
  - squads/agent-social-v3/output/slides/v1/rendered/slide-NN.jpg
---

## Process

0. **Obrigatório (extremamente importante):** este task **só** cumpre o seu papel se os comandos abaixo forem **executados** (Shell na raiz do repositório). Não basta descrever o fluxo: **tem de correr** `generate-bg-image` e `inject-bg-and-render` para cada slide, ou `run-squad-design.mjs` para o `run_id` completo.

1. **Norma:** `inject-bg-and-render.mjs` gera **`slide-NN.jpg`** em `slides/{version}/rendered/` (ver `real-imagery-and-safe-zones.md`). O fluxo completo é: `generate-bg-image.mjs` → `inject-bg-and-render.mjs` por slide, ou `run-squad-design.mjs <run-id>`.

2. **Se os PNGs ainda não existem:** **executar** (não adiar) para cada `NN` de `01` a `06` (a partir da raiz do repo). Se faltar `backgrounds/bg-NN.*`, **sempre** gerar antes do inject:
   ```bash
   node squads/agent-social-v3/scripts/generate-bg-image.mjs NN squads/agent-social-v3/output/{run_id}/slides
   node squads/agent-social-v3/scripts/inject-bg-and-render.mjs NN squads/agent-social-v3/output/{run_id}/slides
   ```
   **Ou** uma vez: `node squads/agent-social-v3/scripts/run-squad-design.mjs {run_id}` (regenera também HTML via `gen-slides-for-run.mjs`; usar só se aceitável).

3. **Verificar** `rendered/slide-NN.jpg`:
   - N PNGs = N HTMLs
   - 1080×1350px; logo visível; texto legível; rodapé @innovationlatam + ARRASTE -> em todos os slides

4. **Legado:** `build-carousel-slides.mjs` (tech-instagram-carousel) pode produzir PNG para outros projetos — não é o entregável principal do squad v2.

5. **Documentar** lista de ficheiros e verificações.

## Output Format

```
Renderização concluída — [N] slides

Arquivos:
- .../slides/v1/rendered/slide-01.jpg ✓ (1080×1350px)
[...]

Método: inject-bg-and-render.mjs
Status: COMPLETO
```

## Quality Criteria

- N HTMLs = N PNGs em `rendered/`
- Dimensões 1080×1350px; logo e copy conforme norma

## Veto Conditions

1. Contagem de PNGs ≠ número de HTMLs
2. Qualquer imagem final com dimensões ≠ 1080×1350px
