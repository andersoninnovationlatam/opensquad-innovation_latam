---
execution: inline
agent: caio-carrossel
format: instagram-carousel
inputFile: squads/carousel-noticias/output/news-input.md
outputFile: squads/carousel-noticias/output/carousel-copy.md
---

# Step: Criar Copy do Carrossel

## Context Loading

Load these files before executing:
- `squads/carousel-noticias/output/news-input.md` — notícia e ângulo (frontmatter `angulo:`) fornecidos pelo usuário no checkpoint
- `pipeline/data/tone-of-voice.md` — 6 tons disponíveis para seleção
- `pipeline/data/output-examples.md` — exemplos completos de referência
- `_opensquad/_memory/company.md` — tom de voz e identidade da Innovation Latam

## Instructions

### Process
1. **Ler o ângulo do frontmatter** de `news-input.md` (campo `angulo:`). Valores válidos: `EDUCACIONAL`, `MEDO`, `ENTUSIASMO`, `CURIOSIDADE`, `POLEMICA`, `EMPATIA`. Se não houver frontmatter ou o valor for inválido, perguntar ao usuário antes de continuar e gravar o ângulo escolhido no frontmatter de `news-input.md`.
2. Apresentar o tom recomendado para o ângulo lido e aguardar confirmação ou escolha alternativa.
3. Selecionar o formato de carrossel mais adequado (Editorial/Tese, Listicle, Tutorial, Storytelling, Problema-Solução).
4. Planejar a estrutura: **mínimo 5, máximo 8 slides**. A quantidade exata é definida pela densidade da notícia — notícia com poucos dados/contexto → 5 slides; notícia rica → até 8 slides. Definir o papel de cada slide antes de escrever.
5. **Extrair entidades visuais** da notícia: pessoas, empresas, marcas e países mencionados. Essa lista será usada pelo Bruno Buscador para baixar imagens dos slides 1, 3, 5 e 7 (no máximo 4 entidades).
6. Escrever slide a slide com headline bold + texto de suporte (40-80 palavras combinados). Cada slide avança a narrativa.
7. Redigir caption: hook em 125 chars + corpo + fechamento com pergunta ou CTA.
8. Selecionar 5-15 hashtags relevantes (mix nicho + mid-range + amplas).
9. Verificar checklist de qualidade antes de entregar.

## Output Format

```
=== ANGULO ===
[ângulo lido do frontmatter de news-input.md]

=== FORMATO ===
[Nome do formato escolhido]

=== TOM ===
[Tom selecionado]

=== ENTIDADES ===
- [Nome da entidade 1] (tipo: empresa | marca | pessoa | pais) — slide alvo: 1
- [Nome da entidade 2] (tipo: ...) — slide alvo: 3
- [Nome da entidade 3] (tipo: ...) — slide alvo: 5
- [Nome da entidade 4] (tipo: ...) — slide alvo: 7

=== SLIDES ===

Slide 1 (Cover):
  Headline: [...]
  Supporting text: [...]
  Entidade visual: [nome da entidade ou "nenhuma"]
  Background: [foto conceitual / fundo sólido]

Slide 2 ([papel]):
  Headline: [...]
  Supporting text: [...]
  Accent keywords: [...]
  Background: [fundo sólido]

[...demais slides — total entre 5 e 8...]

Slide N (CTA):
  Headline: [...]
  Supporting text: [opcional]
  CTA: [instrução específica seguindo @innovationlatam]
  Background: [fundo sólido]

=== CAPTION ===
[Hook 125 chars]

[Corpo]

[Pergunta/CTA]

=== HASHTAGS ===
#hashtag1 #hashtag2 [5-15 total]
```

### Regras do bloco `=== ENTIDADES ===`

- Captura nomes próprios da notícia: pessoas, empresas, marcas, países.
- Máximo 4 entidades — uma por slide ímpar (1, 3, 5, 7). Se a notícia tiver menos de 4 entidades reconhecíveis, listar apenas as existentes (mapeando para os slides ímpares na ordem 1 → 3 → 5 → 7).
- Se a notícia não citar nenhuma entidade reconhecível, deixar a seção com a linha `- (nenhuma)`.
- Não inventar entidades. Apenas o que está no texto da notícia.
- O campo `slide alvo` deve coincidir com o slide do carrossel onde a entidade aparece pela primeira vez.

## Veto Conditions

Rejeitar e redo se:
1. Qualquer slide com menos de 30 palavras (sem pedido explícito do usuário)
2. Qualquer dado ou afirmação não rastreável à notícia original em `news-input.md`
3. Bloco `=== ENTIDADES ===` ausente ou contendo entidade não citada na notícia
4. Total de slides fora da faixa 5-8

## Quality Criteria

- [ ] Ângulo lido do frontmatter de `news-input.md` (sem regerar 5 ângulos)
- [ ] Tom apresentado e confirmado antes de escrever
- [ ] 5-8 slides com 40-80 palavras cada
- [ ] Cover: máximo 20 palavras, scroll-stop test aprovado internamente
- [ ] Bloco `=== ENTIDADES ===` preenchido com até 4 entidades reais da notícia
- [ ] Caption: 125 chars funcionam como hook standalone
- [ ] Último slide tem CTA pedindo curtir/compartilhar/salvar/seguir @innovationlatam (sem fonte)
- [ ] 5-15 hashtags mix nicho/mid/amplas
