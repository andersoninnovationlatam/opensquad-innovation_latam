---
task: "Extrair Entidades Visuais do Copy"
order: 1
input: |
  - carousel_copy: Texto completo do copy aprovado (carousel-copy.md)
output: |
  - topics.json: JSON com themes, companies, brands, public_figures, search_queries
---

# Extrair Entidades Visuais do Copy

Analisa o copy do carrossel aprovado e extrai todas as entidades que possuem identidade visual reconhecível — marcas, empresas, organizações, figuras públicas e temas iconograficamente representáveis. O resultado alimenta a busca de referências visuais na etapa seguinte.

## Process

1. **Ler o copy aprovado**: carregar `squads/carousel-noticias/output/carousel-copy.md` integralmente.

2. **Executar o script de extração**:
   ```bash
   node squads/carousel-noticias/scripts/extract-topics.mjs squads/carousel-noticias/output
   ```

3. **Verificar o output**: confirmar que `squads/carousel-noticias/output/topics.json` foi criado e contém as 5 chaves esperadas (`themes`, `companies`, `brands`, `public_figures`, `search_queries`).

4. **Revisar as search_queries geradas**: verificar se cobrem todas as entidades identificadas. Se alguma entidade importante estiver faltando, editar o JSON manualmente antes de avançar.

5. **Reportar ao usuário**: apresentar brevemente o que foi extraído (totais por categoria).

## Output Format

```
=== EXTRAÇÃO DE ENTIDADES ===

Temas principais: [N]
  - [tema1], [tema2], ...

Empresas/Instituições: [N]
  - [empresa1], [empresa2], ...

Marcas/Produtos: [N]
  - [marca1], [marca2], ...

Figuras Públicas: [N]
  - [nome1], [nome2], ...

Queries de busca geradas: [N]
  → [query1]
  → [query2]

✅ topics.json salvo em squads/carousel-noticias/output/topics.json
```

## Quality Criteria

- [ ] Script executado com sucesso (exit code 0)
- [ ] `topics.json` existe e é JSON válido
- [ ] Todas as entidades mencionadas no copy estão cobertas pelas search_queries
- [ ] Pelo menos uma search_query por entidade com identidade visual (empresa, marca, figura)

## Veto Conditions

Rejeitar e refazer se:
1. `topics.json` não foi criado ou está vazio
2. Entidade com identidade visual clara presente no copy mas ausente nas search_queries
