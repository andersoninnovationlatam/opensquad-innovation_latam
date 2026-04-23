---
task: "Find and rank news"
order: 1
input: |
  - research_focus: Tema, janela temporal e quatro eixos (ficheiro research-focus.md)
  - company_context: company.md quando existir
output: |
  - ranked_news: ranked-news.md (YAML) — canónico para o pipeline
  - news_raw: news_raw.json — mesmo diretório; handoff estruturado
---

# Find and rank news

Consolida pesquisa web focada em IA e tecnologia de forma a alimentar a escolha de **uma** notícia pelo gestor (passo 3). Usa os **quatro eixos** de `research-focus.md` para orientar diversidade na curadoria.

## Tools

- **`web_search`**: descoberta de candidatos e titulares recentes.
- **`web_fetch`**: confirmação de URL, data e leitura quando o conteúdo público permitir (respeitar paywalls — não inventar o que não foi legível).

## Fontes (allowlist orientativa)

Priorizar veículos e instituições reconhecidos, por exemplo: TechCrunch, The Verge, Wired, MIT Technology Review, Ars Technica, Reuters, Bloomberg, Exame, Valor, anúncios oficiais em blogs de empresas e reguladores.

**Fora da lista:** permitido apenas com `confidence: baixa` ou `media` e **justificativa** em `notes` (autoria, rastreio de origem, cruzamento de fonte).

## Process

1. Ler `research-focus.md`: extrair **Topic**, **Time Range** e os **quatro eixos** em `## Research themes (diversidade)`.
2. Executar buscas alinhadas ao tema e à janela temporal; mapear candidatos aos eixos quando fizer sentido.
3. Recolher **5–10** candidatos; eliminar duplicados da mesma história (manter a fonte mais completa).
4. Para cada candidato manter: titular, fonte limpa, URL, data (`YYYY-MM-DD` ou `desconhecido` com justificativa), 2–3 bullets factuais, “por que importa”, confiança (`alta` | `media` | `baixa`).
5. Ordenar por relevância ao foco e frescor; produzir **`ranked-news.md`** no formato YAML abaixo.
6. Gerar **`news_raw.json`** no **mesmo diretório** que `ranked-news.md` (após injeção de `run_id` pelo runner), com um objeto JSON por item, **mesma ordem de rank** que em `items`.
7. Se na janela pedida (ex.: últimas 24h) só existirem **3** histórias fortes, entregar **3** itens excelentes, preencher `gaps` e **não** diluir com fontes duvidosas.
8. Validar URLs: tentar `web_fetch` ou, se falhar, assinalar em `notes` (404, paywall, bloqueio).

## Output Format — ranked-news.md

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
    published: "YYYY-MM-DD ou desconhecido"
    summary_bullets:
      - "..."
      - "..."
    why_it_matters: "..."
    confidence: "alta | media | baixa"
    notes: "..."
gaps: "..."
```

## Output Format — news_raw.json

Array JSON válido; cada elemento corresponde a um item de `items` (mesmo `rank`). Campos:

| Campo | Origem |
|-------|--------|
| `rank` | `items[].rank` |
| `titulo` | `items[].title` |
| `link` | `items[].url` |
| `published_date` | `items[].published` |
| `conteudo` | Parágrafo curto derivado dos bullets + contexto; sem cópia literal de trechos protegidos |
| `fonte` | `items[].source` |
| `confidence` | `items[].confidence` |
| `theme_axis` | Opcional: qual dos quatro eixos do `research-focus.md` (texto curto) |

Conforme `squads/noticias-ia-tech-instagram/pipeline/artifacts/news_raw.schema.json`.

## Output Example

> Use como referência de qualidade, não como conteúdo fixo.

```yaml
meta:
  focus_summary: "Lançamentos de modelos multimodais para empresas"
  time_window: "Últimos 7 dias"
  generated_at: "2026-03-30"
items:
  - rank: 1
    title: "Empresa X anuncia modelo multimodal com API empresarial"
    source: "TechCrunch"
    url: "https://example.com/article"
    published: "2026-03-28"
    summary_bullets:
      - "Novo modelo aceita texto + imagem + áudio no mesmo endpoint."
      - "Preço por token divulgado para clientes enterprise."
    why_it_matters: "Impacta decisões de stack para equipas que já usam IA generativa."
    confidence: "alta"
    notes: "Cruzado com comunicado oficial em blog da Empresa X."
gaps: "Não há dados de adoção real — só anúncio."
```

```json
[
  {
    "rank": 1,
    "titulo": "Empresa X anuncia modelo multimodal com API empresarial",
    "link": "https://example.com/article",
    "published_date": "2026-03-28",
    "conteudo": "Resumo: novo endpoint unifica texto, imagem e áudio; preços enterprise divulgados. Sem dados de adoção em produção.",
    "fonte": "TechCrunch",
    "confidence": "alta",
    "theme_axis": "Novos modelos e APIs"
  }
]
```

## Quality Criteria

- [ ] Todas as URLs foram verificadas com fetch ou nota explícita se falhou.
- [ ] Cada item tem confiança justificada.
- [ ] Lista ordenada e sem duplicados óbvios.
- [ ] `news_raw.json` presente e consistente com `ranked-news.md` (mesmo conjunto de ranks).
- [ ] Quatro eixos considerados; lacunas em `gaps` se algum eixo não tiver cobertura credível.

## Veto Conditions

Reject and redo if ANY are true:
1. Menos de 3 itens com URL válida quando existem fontes suficientes na web para o foco e janela.
2. Qualquer item sem data ou sem explicação quando a data não existe.
3. `news_raw.json` ausente, inválido ou dessincronizado com `ranked-news.md`.
