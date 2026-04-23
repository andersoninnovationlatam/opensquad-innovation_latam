---
execution: script
script: "node squads/agent-social-v3/scripts/generate-html.mjs {run_id}"
inputFile: squads/agent-social-v3/output/{run_id}/v1/slide-scenes.md
outputFile: squads/agent-social-v3/output/{run_id}/slides/v1/
---

## Instructions

Este step gera os 6 slides HTML + `design-documentation.md` via OpenRouter usando `OPENROUTER_MODELS_CONTENT` do `.env`.

### Process

1. **Executar o script na raiz do repo:**
   ```bash
   node squads/agent-social-v3/scripts/generate-html.mjs {run_id}
   ```

2. **Verificar os outputs gerados:**
   - `squads/agent-social-v3/output/{run_id}/slides/v1/slide-01.html` … `slide-06.html`
   - `squads/agent-social-v3/output/{run_id}/slides/v1/design-documentation.md`

## Output Format

```
Design HTML via OpenRouter — run: {run_id}
Modelo: [valor de OPENROUTER_MODELS_CONTENT]

Arquivos gerados:
- slides/v1/slide-01.html ✓
- slides/v1/slide-02.html ✓
- slides/v1/slide-03.html ✓
- slides/v1/slide-04.html ✓
- slides/v1/slide-05.html ✓
- slides/v1/slide-06.html ✓
- slides/v1/design-documentation.md ✓

Status: COMPLETO — 6/6 slides
```

## Veto Conditions

1. Menos de 6 arquivos `.html` em `slides/v1/` após execução
2. `OPENROUTER_API_KEY` não definida no `.env`
3. `output/{run_id}/v1/slide-scenes.md` ausente (executar step-03 antes)
