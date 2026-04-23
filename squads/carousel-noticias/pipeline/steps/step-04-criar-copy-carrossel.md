---
execution: inline
agent: caio-carrossel
format: instagram-carousel
inputFile: squads/carousel-noticias/output/selected-angle.md
outputFile: squads/carousel-noticias/output/carousel-copy.md
---

# Step 04: Criar Copy do Carrossel

## Context Loading

Load these files before executing:
- `squads/carousel-noticias/output/selected-angle.md` — ângulo selecionado pelo usuário
- `squads/carousel-noticias/output/news-input.md` — notícia original para garantir alinhamento factual
- `squads/carousel-noticias/output/angles.md` — contexto dos 5 ângulos gerados
- `pipeline/data/tone-of-voice.md` — 6 tons disponíveis para seleção
- `pipeline/data/output-examples.md` — exemplos completos de referência
- `_opensquad/_memory/company.md` — tom de voz e identidade da Innovation Latam

## Instructions

### Process
1. Apresentar o tom recomendado para o ângulo selecionado e aguardar confirmação ou escolha alternativa.
2. Selecionar o formato de carrossel mais adequado (Editorial/Tese, Listicle, Tutorial, Storytelling, Problema-Solução).
3. Planejar a estrutura de slides (6-10 slides): definir o papel de cada slide antes de escrever.
4. Escrever slide a slide com headline bold (claim principal) + texto de suporte (40-80 palavras combinados). Cada slide avança a narrativa.
5. Redigir caption: hook em 125 chars + corpo + fechamento com pergunta ou CTA.
6. Selecionar 5-15 hashtags relevantes (mix nicho + mid-range + amplas).
7. Verificar checklist de qualidade. Corrigir qualquer falha antes de entregar.

## Output Format

```
=== FORMATO ===
[Nome do formato escolhido]

=== TOM ===
[Tom selecionado]

=== SLIDES ===

Slide 1 (Cover):
  Headline: [...]
  Supporting text: [...]
  Background: [foto conceitual / fundo sólido]

Slide 2 ([papel]):
  Headline: [...]
  Supporting text: [...]
  Accent keywords: [...]
  Background: [foto conceitual / fundo sólido]

[...demais slides...]

Slide N (CTA):
  Headline: [...]
  Supporting text: Fonte: [...]
  CTA: [instrução específica]
  Background: [foto conceitual / fundo sólido]

=== CAPTION ===
[Hook 125 chars]

[Corpo]

[Pergunta/CTA]

=== HASHTAGS ===
#hashtag1 #hashtag2 [5-15 total]
```

## Output Example

```
=== FORMATO ===
Editorial / Tese

=== TOM ===
Urgente

=== SLIDES ===

Slide 1 (Cover):
  Headline: "O Brasil tem o 2º maior Open Banking do mundo. O que sua empresa vai fazer com isso?"
  Supporting text: 40 milhões de usuários ativos — Banco Central 2024
  Background: foto conceitual — vista aérea de centro financeiro urbano, São Paulo

Slide 2 (Contexto):
  Headline: "Open Banking: o sistema que quebrou o monopólio dos dados financeiros"
  Supporting text: "Antes, seus dados bancários pertenciam ao banco. Com Open Banking, eles são seus. Você autoriza qualquer empresa a acessá-los — e isso abre espaço para serviços financeiros radicalmente mais inteligentes."
  Accent keywords: seus dados, qualquer empresa
  Background: fundo sólido

Slide 3 (Escala):
  Headline: "40 milhões de usuários em 3 anos. Só o Reino Unido tem mais."
  Supporting text: "O Brasil saiu do zero para o segundo maior ecossistema de open finance do planeta. Mais de 40 milhões de usuários ativos segundo o Banco Central. Um feito que economias mais antigas ainda não alcançaram."
  Accent keywords: segundo maior, 40 milhões
  Background: foto conceitual

Slide 4 (Impacto empresarial):
  Headline: "Para empresas: acesso a dados que antes eram inacessíveis"
  Supporting text: "Com autorização do cliente, fintechs, varejistas e seguradoras podem acessar histórico financeiro real. Isso transforma precificação, personalização e aprovação de crédito para quem aprender a usar primeiro."
  Accent keywords: dados que antes eram inacessíveis, quem aprender a usar primeiro
  Background: fundo sólido

Slide 5 (Consequência prática):
  Headline: "Crédito mais barato para quem compartilha dados. Mais caro para quem não compartilha."
  Supporting text: "A diferença de risco percebido entre um cliente com histórico verificado e um cliente opaco vai crescer. As empresas que aprenderem a trabalhar com esses dados vão ter vantagem competitiva crescente."
  Accent keywords: vantagem competitiva crescente
  Background: foto conceitual

Slide 6 (CTA):
  Headline: "O que você vai fazer com essa informação?"
  Supporting text: Fonte: Banco Central do Brasil — Relatório Open Finance 2024
  CTA: "Comenta FINTECH abaixo se você quer entender como o open finance pode mudar sua empresa. Manda para alguém do seu time de inovação."
  Background: fundo sólido

=== CAPTION ===
O Brasil tem o 2º maior Open Banking do mundo. 40 milhões de usuários. E a maioria das empresas ainda não entendeu o que isso muda.

Não é só coisa de banco. É sobre quem vai ter vantagem competitiva nos próximos 5 anos.

Explico em 6 slides o tamanho do que está acontecendo e o que muda para o seu negócio.

Comenta FINTECH abaixo se quiser um mapeamento das soluções de open finance disponíveis para empresas como a sua.

=== HASHTAGS ===
#openbanking #openfinance #fintechbrasil #inovacaofinanceira #bancocentral #IA4FIN #innovationlatam #fintech #inovacao #transformacaodigital
```

## Veto Conditions

Rejeitar e redo se:
1. Qualquer slide com menos de 30 palavras (sem pedido explícito do usuário)
2. Qualquer dado ou afirmação não rastreável à notícia original em `news-input.md`

## Quality Criteria

- [ ] Tom apresentado e confirmado antes de escrever
- [ ] 6-10 slides com 40-80 palavras cada
- [ ] Cover: máximo 20 palavras, scroll-stop test aprovado internamente
- [ ] Caption: 125 chars funcionam como hook standalone
- [ ] Último slide tem CTA + fonte da notícia
- [ ] 5-15 hashtags mix nicho/mid/amplas
