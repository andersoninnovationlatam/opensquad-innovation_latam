---
task: "Criar Copy do Carrossel"
order: 2
input: |
  - selected_angle: Ângulo escolhido pelo usuário (de selected-angle.md)
  - news_content: Texto da notícia original (de news-input.md)
  - tone_of_voice: Tons disponíveis para escolha (de pipeline/data/tone-of-voice.md)
output: |
  - carousel_copy: Copy completo do carrossel (slides + caption + hashtags) em carousel-copy.md
---

# Criar Copy do Carrossel

Produz o copy completo do carrossel de Instagram com base no ângulo selecionado e na notícia fornecida. Inclui todos os slides com headline + texto de suporte, caption completa e hashtags.

## Process

1. **Seleção de tom**: ler `pipeline/data/tone-of-voice.md`. Identificar o tom que melhor combina com o ângulo selecionado e apresentar ao usuário:
   > "Para este ângulo [nome], o tom recomendado é **[Tom X]** ([descrição 1 frase]). Quer usar este ou prefere outro? (1-Educacional / 2-Inspiracional / 3-Provocador / 4-Urgente / 5-Storytelling / 6-Analítico)"
   Aguardar confirmação antes de escrever.

2. **Escolher formato de carrossel**: baseado no ângulo + tom, selecionar o formato mais adequado:
   - Medo/Urgente → Editorial/Tese ou Problema-Solução
   - Oportunidade → Editorial/Tese ou Listicle
   - Educacional → Tutorial/Passo-a-passo ou Listicle
   - Contrário → Editorial/Tese (Mito vs. Realidade)
   - Inspiracional → Storytelling ou Antes e Depois

3. **Planejar a estrutura de slides**: definir o número de slides (6-10) e o papel de cada um antes de escrever. Documentar brevemente: "Slide 1: cover com [headline]. Slide 2: contexto. Slides 3-6: argumentos. Slide 7: CTA."

4. **Escrever slide a slide**: para cada slide, redigir headline (bold, claim principal) + texto de suporte (contexto, dado ou exemplo). Verificar que cada slide tem 40-80 palavras combinados. Cada slide deve avançar a narrativa — nenhum slide repete ideia do anterior.

5. **Redigir a caption**: hook nos primeiros 125 caracteres (deve funcionar sozinho como gancho antes do "ver mais"), corpo expandindo o argumento central, fechamento com pergunta aberta ou CTA específico.

6. **Selecionar hashtags**: 5-15 hashtags relevantes ao tema, mix de: 3-4 de nicho/específicas (ex: #openfinancebrasil) + 3-4 de mid-range + 2-3 amplas (ex: #inovacao). Nunca repetir as mesmas de posts anteriores.

7. **Aplicar checklist de qualidade** antes de entregar. Corrigir qualquer falha identificada.

## Output Format

```
=== FORMATO ===
[Nome do formato de carrossel escolhido]

=== TOM ===
[Tom selecionado]

=== SLIDES ===

Slide 1 (Cover):
  Headline: [Headline bold — máx. 20 palavras]
  Supporting text: [Subtítulo ou frase de contexto — opcional no cover]
  Background: [foto conceitual / fundo sólido — indicação para o Designer]

Slide 2 ([papel do slide]):
  Headline: [Headline bold — claim principal do slide]
  Supporting text: [Contexto, dado ou exemplo — 1-3 frases]
  Accent keywords: [palavras para destacar em cor accent]
  Background: [foto conceitual / fundo sólido]

[...demais slides seguindo o mesmo formato...]

Slide N (CTA):
  Headline: [Call-to-action direto]
  Supporting text: [Fonte da notícia]
  CTA: [Instrução específica de ação]
  Background: [foto conceitual / fundo sólido]

=== CAPTION ===
[Primeiros 125 chars — hook standalone]

[Corpo — 2-4 parágrafos expandindo o argumento]

[Pergunta aberta ou CTA específico de fechamento]

=== HASHTAGS ===
#hashtag1 #hashtag2 #hashtag3 [5-15 hashtags totais]
```

## Output Example

> Use como referência de qualidade, não como template rígido.

```
=== FORMATO ===
Editorial / Tese

=== TOM ===
Urgente

=== SLIDES ===

Slide 1 (Cover):
  Headline: "Empresas que adotaram IA reduziram custos em 34% em 18 meses. A sua ainda está esperando o quê?"
  Supporting text: Relatório McKinsey com 1.500 empresas globais
  Background: foto — profissional em escritório moderno olhando dados em tela grande, expressão confiante

Slide 2 (Contexto):
  Headline: "O relatório que todo CEO está lendo agora"
  Supporting text: "A McKinsey entrevistou mais de 1.500 empresas globais sobre adoção de IA generativa. O resultado é claro: não é mais questão de SE, mas de QUANDO. E o QUANDO está acabando para quem ainda não começou."
  Accent keywords: 1.500 empresas, QUANDO
  Background: fundo sólido

Slide 3 (Argumento 1):
  Headline: "34% de redução de custos operacionais"
  Supporting text: "Empresas que implementaram IA em processos repetitivos — atendimento, análise de dados, geração de relatórios — cortaram um terço dos custos. Sem demitir. Realocando pessoas para funções de maior valor."
  Accent keywords: 34%, maior valor
  Background: foto — equipe colaborando em volta de mesa com laptop, luz natural

Slide 4 (Argumento 2):
  Headline: "Velocidade de entrega dobrou em 18 meses"
  Supporting text: "Times que usam IA para geração de código, testes e documentação entregam o dobro de funcionalidades no mesmo período. Cada sprint, a vantagem competitiva se acumula."
  Accent keywords: dobrou, vantagem competitiva
  Background: fundo sólido

Slide 5 (Argumento 3):
  Headline: "Quem começou em 2023 já tem 18 meses de vantagem sobre você"
  Supporting text: "A curva de aprendizado de IA em contexto corporativo leva tempo. Cada mês de atraso não é apenas um mês perdido: é um mês que o concorrente acumula expertise operacional difícil de replicar."
  Accent keywords: 18 meses, expertise operacional
  Background: foto — gráfico de crescimento exponencial em tela, foco na curva

Slide 6 (Síntese):
  Headline: "A janela ainda está aberta. Por pouco tempo."
  Supporting text: "A maioria do mercado ainda não começou. Isso significa que há espaço para sair na frente — se agir nos próximos 6 a 12 meses. Depois disso, será apenas manutenção do atraso."
  Accent keywords: 6 a 12 meses
  Background: fundo sólido

Slide 7 (CTA):
  Headline: "O que você vai fazer com essa informação?"
  Supporting text: "Fonte: McKinsey Global Institute — The State of AI in 2024"
  CTA: "Salve esse carrossel e manda pro seu time de inovação. Comenta IA abaixo se quiser entender como aplicar na sua empresa."
  Background: foto — pessoa no celular, feed do Instagram visível, postura aberta

=== CAPTION ===
34% de redução de custos. Velocidade de entrega dobrada. Isso não é promessa de vendedor — é o que a McKinsey mediu em 1.500 empresas reais.

O relatório que saiu essa semana mudou a conversa sobre IA nas empresas. Não é mais "vamos estudar". É "quem não implementou já está ficando para trás."

Mas há uma parte que pouca gente está discutindo: a vantagem não é das gigantes. É de quem agir agora, antes que o mercado acomode.

Você está esperando o quê para começar?

Salve esse post. Manda para alguém que precisa ver isso.

=== HASHTAGS ===
#inovacao #inteligenciaartificial #IAcorporativa #McKinsey #inovacaoempresarial #innovationlatam #transformacaodigital #startups #lideranca #futuredotrabalho
```

## Quality Criteria

- [ ] Tom apresentado e confirmado pelo usuário antes de qualquer escrita de corpo
- [ ] Formato de carrossel escolhido e alinhado ao ângulo + tom
- [ ] Cover: headline máximo 20 palavras, passa scroll-stop test
- [ ] 6-10 slides, cada um com 40-80 palavras (headline + suporte combinados)
- [ ] Nenhuma afirmação sem base na notícia original (news-input.md)
- [ ] Cada slide avança a narrativa — nenhum repete ideia do anterior
- [ ] Caption: primeiros 125 chars funcionam como hook standalone
- [ ] Último slide tem CTA específico e acionável + fonte da notícia
- [ ] Hashtags: 5-15, mix de nicho + mid-range + amplas

## Veto Conditions

Rejeitar e refazer se:
1. Qualquer slide tem menos de 30 palavras (sem pedido explícito do usuário para slides curtos)
2. Qualquer afirmação numérica ou factual não está presente na notícia original fornecida
