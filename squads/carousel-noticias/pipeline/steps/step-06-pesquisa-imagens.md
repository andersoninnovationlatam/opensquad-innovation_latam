---
execution: inline
agent: bruno-buscador
inputFile: squads/carousel-noticias/output/carousel-copy.md
outputFile: squads/carousel-noticias/output/image-refs.json
---

# Step 06: Pesquisa de Referências Visuais

## Context Loading

Load these files before executing:
- `squads/carousel-noticias/output/carousel-copy.md` — copy aprovado pelo usuário no checkpoint anterior

## Instructions

### Process

1. Confirmar que `squads/carousel-noticias/output/carousel-copy.md` existe e está preenchido.

2. **Executar extração de entidades**:
   ```bash
   node squads/carousel-noticias/scripts/extract-topics.mjs squads/carousel-noticias/output
   ```
   Aguardar a criação de `squads/carousel-noticias/output/topics.json`.

3. **Verificar topics.json**: confirmar que o arquivo existe e contém entidades visuais identificadas (companies, brands, public_figures). Se o copy não contiver marcas específicas, o arquivo terá apenas themes — isso é aceitável.

4. **Executar busca de referências visuais**:
   ```bash
   node squads/carousel-noticias/scripts/search-reference-images.mjs squads/carousel-noticias/output
   ```
   Aguardar a criação de `squads/carousel-noticias/output/image-refs.json`. O script fará uma chamada de busca por entidade — pode levar alguns segundos.

5. **Apresentar resumo ao usuário**: mostrar as entidades encontradas e as referências visuais coletadas conforme o formato de output abaixo.

## Output Format

```
=== PESQUISA DE REFERÊNCIAS VISUAIS ===

📌 Temas identificados: [N]
   [tema1], [tema2], ...

🏢 Empresas/Instituições: [N]
   [empresa1], [empresa2], ...

🏷️  Marcas/Produtos: [N]
   [marca1], [marca2], ...

👤 Figuras Públicas: [N]
   [nome1], [nome2], ...

---

🎨 Referências visuais coletadas: [N de M entidades]

🖼️  [Entidade1] ([tipo])
    Cores: [cores da marca]
    Logo: [descrição do logo]
    Paródia: [o que usar para criar paródia reconhecível]

📝  [Entidade2] ([tipo]) — apenas descrição
    Cores: [cores estimadas]
    Logo: [descrição]
    Paródia: [sugestão de paródia]

---

✅ topics.json e image-refs.json salvos em squads/carousel-noticias/output/
   Diana Design usará essas referências para criar prompts de paródia editorial nos slides ímpares.
```

## Veto Conditions

Rejeitar e redo se:
1. `topics.json` não foi criado (script falhou)
2. `image-refs.json` não foi criado quando existem entidades em `topics.json`

## Quality Criteria

- [ ] `topics.json` criado com estrutura correta
- [ ] `image-refs.json` criado com ao menos uma entrada por entidade visual identificada
- [ ] Descrições visuais com cores e elementos suficientes para prompts de paródia
- [ ] Resumo apresentado ao usuário com contagem de entidades e referências
