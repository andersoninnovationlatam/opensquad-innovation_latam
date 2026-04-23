---
execution: inline
agent: carlos-conteudo
inputFile: squads/agent-social-v3/input/content.md
outputFile: squads/agent-social-v3/output/{run_id}/v1/carousel-draft.md
---

## Context Loading

Antes de executar, confirmar:
- `squads/agent-social-v3/input/content.md` — notícia + `angulo_escolhido` no frontmatter (obrigatório)

## Instructions

Este step gera o conteúdo do carrossel via OpenRouter usando `OPENROUTER_MODELS_CONTENT` do `.env`.

### Process

1. **Identificar o `{run_id}` da run atual.** O run_id é o identificador da run corrente (ex: `2026-04-09` ou string definida no início do pipeline).

2. **Executar o script na raiz do repo:**
   ```bash
   node squads/agent-social-v3/scripts/generate-content.mjs {run_id}
   ```

3. **Verificar os outputs gerados:**
   - `squads/agent-social-v3/output/{run_id}/v1/angles.yaml` — deve conter 5 ângulos com o ângulo correto marcado `selected: true`
   - `squads/agent-social-v3/output/{run_id}/v1/carousel-draft.md` — deve conter exatamente 6 slides + caption

4. **Confirmar que `angulo_escolhido` em `input/content.md` é válido** (`medo` | `oportunidade` | `educacional` | `contrario` | `inspiracional`). Se ausente ou inválido, o script encerrará com erro — corrigir o input antes de prosseguir.

## Output Format

```
Geração de conteúdo via OpenRouter — run: {run_id}
Modelo: [valor de OPENROUTER_MODELS_CONTENT]
Ângulo: [angulo_escolhido]

Arquivos gerados:
- output/{run_id}/v1/angles.yaml ✓ (5 ângulos, selected: [angulo])
- output/{run_id}/v1/carousel-draft.md ✓ (6 slides + caption)

Status: COMPLETO
```

## Veto Conditions

1. `angulo_escolhido` ausente ou inválido em `input/content.md` — script não executa
2. `angles.yaml` ausente ou com menos de 5 ângulos após execução
3. `carousel-draft.md` ausente ou com número de slides diferente de 6
4. `OPENROUTER_API_KEY` não definida no `.env`
