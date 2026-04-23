---
execution: subagent
agent: researcher
model_tier: fast
inputFile: squads/noticias-ia-tech-instagram/output/research-focus.md
outputFile: squads/noticias-ia-tech-instagram/output/ranked-news.md
---

# Step 02: Pesquisar e ranquear notícias

## Context Loading

Load these files before executing:
- `squads/noticias-ia-tech-instagram/output/research-focus.md` — foco, janela temporal e **quatro eixos de diversidade**
- `squads/noticias-ia-tech-instagram/pipeline/data/research-brief.md` — princípios de curadoria
- `squads/noticias-ia-tech-instagram/pipeline/artifacts/news_raw.schema.json` — contrato JSON (referência)
- `squads/noticias-ia-tech-instagram/agents/researcher/tasks/find-and-rank-news.md` — tarefa do agente
- `_opensquad/_memory/company.md` — opcional

## Instructions

### Process

1. Carregar o agente **Pedro Pesquisa** com a tarefa `find-and-rank-news.md`.
2. Usar **`web_search`** para descobrir candidatos e **`web_fetch`** para confirmar titulares, datas e viabilidade do URL (tratar paywall conforme a tarefa).
3. Produzir **`ranked-news.md`** (YAML) no mesmo diretório de run que o `outputFile` transformado pelo runner — este ficheiro é o **output canónico** validado pelo pipeline.
4. Produzir **`news_raw.json`** no **mesmo diretório** que `ranked-news.md` (após transformação de path: `squads/noticias-ia-tech-instagram/output/{run_id}/news_raw.json`), como espelho estruturado para integrações; ver schema em `pipeline/artifacts/news_raw.schema.json`.
5. Preferir **5–8 itens** ranqueados quando a cobertura permitir; se a janela for curta (ex.: 24h) e só houver **3 candidatos fortes**, entregar 3 excelentes, declarar em `gaps` e **não** preencher com fontes fracas.
6. Cobrir, quando possível, os **quatro eixos** definidos em `research-focus.md`; se um eixo não tiver notícia credível na janela, explicar em `gaps`.

## Output Format

### Ficheiro 1 — `ranked-news.md` (obrigatório, YAML no corpo)

The output MUST follow this exact structure (YAML no corpo do ficheiro):

```yaml
meta:
  focus_summary: "..."
  time_window: "..."
  generated_at: "YYYY-MM-DD"
items:
  - rank: 1
    title: "..."
    source: "..."
    url: "https://..."
    published: "YYYY-MM-DD"
    summary_bullets:
      - "..."
    why_it_matters: "..."
    confidence: "alta | media | baixa"
    notes: "..."
gaps: "..."
```

### Ficheiro 2 — `news_raw.json` (obrigatório, mesmo diretório)

Array JSON onde cada elemento corresponde a um item de `items` (mesma ordem de rank), com campos alinhados ao schema `news_raw.schema.json`.

## Output Example

Ver `agents/researcher/tasks/find-and-rank-news.md` — exemplo completo com meta, bullets por item e gaps.

## Veto Conditions

Reject and redo if ANY are true:
1. Nenhuma URL `https://` presente.
2. Itens sem campo `confidence`.
3. `news_raw.json` ausente ou não válido JSON no mesmo diretório que `ranked-news.md`.
4. Menos de 3 itens quando existia cobertura web razoável para o foco e janela pedidos.

## Quality Criteria

- [ ] Ordem decrescente de relevância
- [ ] Datas ou explicação quando ausentes
- [ ] Secção `gaps` quando aplicável
- [ ] Diversidade orientada pelos quatro eixos do `research-focus.md` (ou lacuna justificada)
- [ ] `news_raw.json` preenchido em paralelo a `ranked-news.md`
