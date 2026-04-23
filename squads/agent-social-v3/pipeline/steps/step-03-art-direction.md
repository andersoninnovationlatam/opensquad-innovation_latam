---
execution: script
script: "node squads/agent-social-v3/scripts/generate-scenes.mjs {run_id}"
inputFile: squads/agent-social-v3/output/{run_id}/v1/carousel-draft.md
outputFile: squads/agent-social-v3/output/{run_id}/v1/slide-scenes.md
---

## Instructions

Este step gera a direção de arte (slide-scenes.md) via OpenRouter usando `OPENROUTER_MODELS_CONTENT` do `.env`.

### Process

1. **Executar o script na raiz do repo:**
   ```bash
   node squads/agent-social-v3/scripts/generate-scenes.mjs {run_id}
   ```

2. **Verificar o output gerado:**
   - `squads/agent-social-v3/output/{run_id}/v1/slide-scenes.md` — deve conter 6 blocos `## Slide NN` com prompt mestre (EN) e notas para Dária por slide

## Output Format

```
Direção de arte via OpenRouter — run: {run_id}
Modelo: [valor de OPENROUTER_MODELS_CONTENT]

Arquivo gerado:
- output/{run_id}/v1/slide-scenes.md ✓ (6 blocos ## Slide NN)

Status: COMPLETO
```

## Veto Conditions

1. `slide-scenes.md` ausente após execução
2. Menos de 6 blocos `## Slide NN` no arquivo gerado
3. `OPENROUTER_API_KEY` não definida no `.env`
