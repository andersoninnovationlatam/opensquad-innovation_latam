---
task: "Criar Copy do Carrossel"
order: 1
input: |
  - news_input: Texto da notícia + frontmatter com `angulo:` (de news-input.md)
  - tone_of_voice: Tons disponíveis para escolha (de pipeline/data/tone-of-voice.md)
output: |
  - carousel_copy: Copy completo do carrossel (slides + entidades + caption + hashtags) em carousel-copy.md
---

# Criar Copy do Carrossel

Produz o copy completo do carrossel de Instagram com base no ângulo já escolhido pelo usuário no frontend e na notícia fornecida. Inclui: bloco de entidades visuais (insumo do Bruno Buscador), todos os slides com headline + texto de suporte, caption completa e hashtags.

## Process

1. **Ler ângulo + notícia**: abrir `news-input.md` no `runDir` atual e extrair `angulo:` do frontmatter. Valores válidos: `EDUCACIONAL`, `MEDO`, `ENTUSIASMO`, `CURIOSIDADE`, `POLEMICA`, `EMPATIA`. Se faltar, perguntar ao usuário e gravar no frontmatter antes de continuar.

2. **Seleção de tom**: ler `pipeline/data/tone-of-voice.md`. Identificar o tom que melhor combina com o ângulo recebido e apresentar ao usuário:
   > "Para o ângulo [valor], o tom recomendado é **[Tom X]** ([descrição 1 frase]). Quer usar este ou prefere outro? (1-Educacional / 2-Inspiracional / 3-Provocador / 4-Urgente / 5-Storytelling / 6-Analítico)"
   Aguardar confirmação antes de escrever.

3. **Escolher formato de carrossel**: baseado no ângulo + tom, selecionar o formato mais adequado:
   - EDUCACIONAL → Tutorial/Passo-a-passo ou Listicle
   - MEDO → Editorial/Tese ou Problema-Solução (urgência)
   - ENTUSIASMO → Editorial/Tese ou Listicle (oportunidade/futuro)
   - CURIOSIDADE → Storytelling com revelação progressiva ou Listicle
   - POLEMICA → Editorial/Tese (Mito vs. Realidade) ou Contrarian
   - EMPATIA → Storytelling ou Antes e Depois

4. **Planejar a estrutura de slides**: definir o número de slides entre **5 e 8** com base na densidade da notícia (notícia rica → 8 slides; notícia enxuta → 5 slides). Documentar brevemente o papel de cada slide antes de escrever.

5. **Extrair entidades visuais**: identificar pessoas, empresas, marcas e países citados literalmente na notícia. Mapear até 4 entidades para os slides 1, 3, 5 e 7 (ordem em que aparecem no carrossel). Se a notícia tiver menos de 4 entidades, listar apenas as existentes. Se não houver entidades reconhecíveis, marcar `(nenhuma)`.

6. **Escrever slide a slide**: para cada slide, redigir headline (bold, claim principal) + texto de suporte (contexto, dado ou exemplo). Cada slide com 40-80 palavras combinados, avançando a narrativa.

7. **Redigir a caption**: hook nos primeiros 125 caracteres + corpo + fechamento com pergunta aberta ou CTA específico.

8. **Selecionar hashtags**: 5-15 hashtags, mix de nicho/mid-range/amplas.

9. **Aplicar checklist de qualidade** antes de entregar.

## Output Format

```
=== ANGULO ===
[ângulo lido do frontmatter de news-input.md]

=== FORMATO ===
[Nome do formato de carrossel escolhido]

=== TOM ===
[Tom selecionado]

=== ENTIDADES ===
- [Nome] (tipo: empresa | marca | pessoa | pais) — slide alvo: 1
- [Nome] (tipo: ...) — slide alvo: 3
- [Nome] (tipo: ...) — slide alvo: 5
- [Nome] (tipo: ...) — slide alvo: 7

=== SLIDES ===

Slide 1 (Cover):
  Headline: [Headline bold — máx. 20 palavras]
  Supporting text: [Subtítulo ou frase de contexto — opcional no cover]
  Entidade visual: [nome da entidade do bloco acima ou "nenhuma"]
  Background: [foto conceitual / fundo sólido]

Slide 2 ([papel]):
  Headline: [...]
  Supporting text: [...]
  Accent keywords: [...]
  Background: [fundo sólido]

[...total entre 5 e 8 slides...]

Slide N (CTA):
  Headline: [...]
  CTA: [Instrução pedindo curtir/compartilhar/salvar/seguir @innovationlatam]
  Background: [fundo sólido]

=== CAPTION ===
[Primeiros 125 chars — hook standalone]

[Corpo]

[Pergunta aberta ou CTA específico]

=== HASHTAGS ===
#hashtag1 #hashtag2 [5-15 hashtags totais]
```

## Quality Criteria

- [ ] Ângulo lido do frontmatter `angulo:` (sem regerar 5 ângulos)
- [ ] Tom apresentado e confirmado pelo usuário antes de escrever
- [ ] Cover: headline máximo 20 palavras
- [ ] 5-8 slides, cada um com 40-80 palavras
- [ ] Bloco `=== ENTIDADES ===` com até 4 entidades reais da notícia, mapeadas a slides 1/3/5/7
- [ ] Nenhuma afirmação ou entidade sem base na notícia original
- [ ] Caption: primeiros 125 chars funcionam como hook standalone
- [ ] Último slide com CTA pedindo curtir/compartilhar/salvar/seguir @innovationlatam (sem fonte)
- [ ] Hashtags: 5-15, mix de nicho + mid-range + amplas

## Veto Conditions

Rejeitar e refazer se:
1. Qualquer slide com menos de 30 palavras (sem pedido explícito do usuário)
2. Qualquer afirmação numérica/factual ausente na notícia original
3. Bloco `=== ENTIDADES ===` ausente ou com entidades não citadas no texto da notícia
4. Total de slides fora da faixa 5-8
