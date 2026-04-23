---
execution: script
script: "node squads/agent-social-v3/scripts/research-brand-assets.mjs {run_id}"
inputFile: squads/agent-social-v3/output/{run_id}/v1/carousel-draft.md
outputFile: squads/agent-social-v3/output/{run_id}/v1/brand-assets.md
---

## Instructions

Este step pesquisa as identidades visuais das empresas mencionadas no carousel-draft.md e gera `brand-assets.md` via OpenRouter usando `OPENROUTER_MODELS_CONTENT` do `.env`.

O output alimenta o Daniel Diretor no step-03, enriquecendo os prompts fotográficos com referências reais de marca.

### Process

1. **Executar o script na raiz do repo:**
   ```bash
   node squads/agent-social-v3/scripts/research-brand-assets.mjs {run_id}
   ```

2. **Verificar o output gerado:**
   - `squads/agent-social-v3/output/{run_id}/v1/brand-assets.md` — deve conter bloco completo da empresa protagonista + blocos resumidos das coadjuvantes

## Output Format

```
Pesquisa de marcas via OpenRouter — run: {run_id}
Modelo: [valor de OPENROUTER_MODELS_CONTENT]

Empresas identificadas: [N]
Protagonista: [nome]

Arquivo gerado:
- output/{run_id}/v1/brand-assets.md ✓

Status: COMPLETO
```

## Veto Conditions

1. `brand-assets.md` ausente após execução
2. Nenhuma empresa identificada no conteúdo
3. `OPENROUTER_API_KEY` não definida no `.env`
