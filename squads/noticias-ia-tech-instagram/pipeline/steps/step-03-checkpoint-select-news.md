---
type: checkpoint
outputFile: squads/noticias-ia-tech-instagram/output/selected-story.md
---

# Step 03: Checkpoint — Escolher uma notícia

## Context Loading

Load these files before executing:
- `squads/noticias-ia-tech-instagram/output/ranked-news.md` — lista ranqueada
- `squads/noticias-ia-tech-instagram/output/research-focus.md` — foco original

## Instructions

### Process

1. Mostrar ao gestor os **3–5 primeiros itens** de `ranked-news.md` com: título, fonte, data, uma linha “por que importa”.
2. Incluir opção final numerada: **Pesquisar mais notícias** (volta a pedir refinamento ao Pedro numa edição futura do pipeline — neste run, regista pedido no ficheiro).
3. Aguardar número da escolha.
4. Gravar a história escolhida em `selected-story.md` com URL e resumo.

## Output Format

```markdown
# Selected story

**Choice:** {rank number from ranked-news}
**Title:** ...
**Source:** ...
**URL:** ...
**Published:** ...
**Summary:**
...
**Reason for selection:** {gestor pode colar uma frase}
```

## Output Example

```markdown
# Selected story

**Choice:** 1
**Title:** Empresa X anuncia API multimodal enterprise
**Source:** Tech Journal
**URL:** https://example.com/x-api
**Published:** 2026-03-28
**Summary:**
Novo endpoint unifica texto e imagem com preço por token divulgado.
**Reason for selection:** Alinha ao nosso foco em stacks cloud esta semana.
```

## Veto Conditions

Reject and redo if ANY are true:
1. História escolhida sem URL.
2. Número escolhido inexistente na lista apresentada.

## Quality Criteria

- [ ] Uma única notícia selecionada
- [ ] Campos obrigatórios preenchidos
