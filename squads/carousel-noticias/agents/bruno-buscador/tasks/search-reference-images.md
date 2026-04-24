---
task: "Buscar Referências Visuais na Web"
order: 2
input: |
  - topics.json: entidades extraídas do copy com search_queries
output: |
  - image-refs.json: referências visuais com URL, descrição e notas de paródia por entidade
---

# Buscar Referências Visuais na Web

Usa o modelo de busca web (`OPENROUTER_MODELS_SEARCH`) para encontrar a identidade visual de cada entidade identificada no copy. O resultado é um documento técnico que a Diana Design usa para criar prompts de paródia editorial — imagens que remetem a marcas e empresas reais de forma criativa.

## Process

1. **Confirmar prerequisito**: verificar que `squads/carousel-noticias/output/topics.json` existe (saída da task anterior).

2. **Executar o script de busca**:
   ```bash
   node squads/carousel-noticias/scripts/search-reference-images.mjs squads/carousel-noticias/output
   ```
   O script fará uma chamada ao modelo de busca para cada entidade (companies + brands + public_figures). Aguardar conclusão — pode levar alguns segundos por entidade.

3. **Verificar o output**: confirmar que `squads/carousel-noticias/output/image-refs.json` foi criado e contém entradas para todas as entidades.

4. **Inspecionar referências críticas**: para as 2-3 entidades mais centrais no copy, verificar se a `visual_description` é suficientemente específica para gerar paródia (deve conter cores, formas e elementos característicos).

5. **Reportar ao usuário**: apresentar resumo com quantidade de referências encontradas, destacando quais têm URL e quais têm apenas descrição.

## Output Format

```
=== REFERÊNCIAS VISUAIS ENCONTRADAS ===

[N] referências para [M] entidades:

🖼️  [Empresa1] (company)
    Cores: [#hex1, #hex2]
    Logo: [descrição do logo]
    Paródia: [elemento mais reconhecível para parodiar]
    URL: [url ou "não encontrada"]

📝  [Marca1] (brand) — apenas descrição
    Cores: [#hex1, #hex2]
    Logo: [descrição do logo]
    Paródia: [elemento mais reconhecível para parodiar]

---
✅ image-refs.json salvo em squads/carousel-noticias/output/image-refs.json
   [N] referências com URL | [M] referências apenas com descrição
```

## Output Example

```
=== REFERÊNCIAS VISUAIS ENCONTRADAS ===

3 referências para 3 entidades:

🖼️  Banco Central do Brasil (company)
    Cores: #00A859 (verde), #003F2D (verde escuro), branco
    Logo: escudo heráldico estilizado em verde com letras "BCB", tipografia serifada institucional
    Paródia: escudo verde com símbolo de taxa de juros no centro, prédio cinza de governo ao fundo
    URL: https://www.bcb.gov.br/content/home2/imgs/logo-bcb.png

🖼️  Nubank (company)
    Cores: #8A05BE (roxo), branco
    Logo: letra "n" minúscula em roxo sobre fundo branco, tipografia sans-serif clean e moderna
    Paródia: "n" roxo sendo espremido por uma pinça metálica com rótulo "14,75% a.a."
    URL: https://nubank.com.br/brand/nubank-logo.svg

📝  Pix (brand) — apenas descrição
    Cores: #00BDAE (teal/turquesa), branco
    Logo: quatro losangos formando um "x" estilizado em teal, bordas arredondadas
    Paródia: símbolo Pix com velocímetro apontando para "0" ao lado de relógio em câmera lenta

---
✅ image-refs.json salvo em squads/carousel-noticias/output/image-refs.json
   2 referências com URL | 1 referência apenas com descrição
```

## Quality Criteria

- [ ] Script executado com sucesso (exit code 0)
- [ ] `image-refs.json` existe e contém array `refs` com pelo menos uma entrada por entidade
- [ ] Toda entrada contém: entity, type, visual_description, brand_colors, logo_style, parody_notes, image_url
- [ ] Descrições visuais suficientes para gerar paródia sem depender do URL (URL é complemento, não requisito)
- [ ] Resumo apresentado ao usuário com totais e destaques das referências mais importantes

## Veto Conditions

Rejeitar e refazer se:
1. `image-refs.json` não foi criado ou `refs` está vazio quando existem entidades em `topics.json`
2. Descrição visual de entidade central no copy é vaga demais (ex: apenas "empresa de tecnologia")
