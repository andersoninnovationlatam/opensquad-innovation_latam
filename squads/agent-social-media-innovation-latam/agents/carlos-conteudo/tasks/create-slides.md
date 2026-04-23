---
task: create-slides
agent: carlos-conteudo
order: 2
input:
  - squads/agent-social-media-innovation-latam/output/angles.yaml
  - squads/agent-social-media-innovation-latam/output/research.md
  - squads/agent-social-media-innovation-latam/input/content.md
output:
  - squads/agent-social-media-innovation-latam/output/carousel-draft.md
---

## Regra obrigatória — texto curto (Instagram / feed mobile)

Carrossel = **scan em tela pequena**. Menos texto no slide; **caption** traz nuance.

- **Frases curtas:** preferir **≤12 palavras** por frase quando couber.
- **Slide 2 (contexto):** **2 ou 3 frases curtas** — **não** exigir 60 palavras; teto mental **~25–45 palavras** no body.
- **Slides 3 até N-2:** headline **1 linha**; body **no máximo 2 frases curtas**; **preferir ≤3 linhas visíveis** (**nunca** 5 como alvo).
- **Reflexão e CTA:** headline + **no máximo 1–2 frases curtas** no body.

---

## Process

1. **Ler o ângulo selecionado (definido pelo usuário em `input/content.md`).** Abrir `output/angles.yaml`, confirmar `angulo_escolhido_pelo_usuario` e localizar `selected: true` e o `hook_preview`. Não trocar de ângulo — só desenvolver o carrossel nessa lente. O `hook_preview` é o ponto de partida para o slide 1.

2. **Definir a estrutura do carrossel.** Determinar o número de slides (7-9) e os papéis: Slide 1 (hook) → Slide 2 (contexto/imagem) → Slides 3-N-2 (desenvolvimento) → Slide N-1 (reflexão) → Slide N (CTA).

3. **Escrever o Slide 1 (hook).** Começar com o dado-âncora — a afirmação mais surpreendente, direta ao ponto. Máximo 2 linhas visíveis. Deve passar o scroll-stop test.

4. **Escrever o Slide 2 (contexto).** Responde em **2 ou 3 frases curtas**: "Por que esse dado importa?" Sem parágrafo longo (revogado: mínimo de 60 palavras).

5. **Escrever os slides de desenvolvimento (3 a N-2).** Uma ideia por slide. **No máximo 2 frases curtas** no body; **preferir ≤3 linhas visíveis**. Cada slide avança a narrativa — deve ser consequência do anterior. Verificar: nenhuma informação repetida.

6. **Escrever o slide de reflexão (N-1).** Síntese emocional. Uma pergunta ou afirmação que toca na realidade do leitor profissional de inovação. NÃO um dado novo.

7. **Escrever o slide de CTA (N).** Duas ações específicas ao tema: salvar + comentar. O CTA deve conectar o conteúdo do carrossel a um próximo passo específico do leitor.

8. **Escrever a caption Instagram.** Hook nas primeiras 125 chars (para o preview de feed) + body + pergunta final + 8-12 hashtags no final. Máximo 2.200 chars total.

9. **Revisar o draft completo.** Verificar: slide 1 não começa com marca, **nenhum slide com mais de 4 linhas** no corpo (meta ≤3), **frases curtas**, nenhuma informação repetida, penúltimo slide é de reflexão.

## Output Format

```markdown
# Carrossel: [TÍTULO DESCRITIVO]
**Ângulo:** [ângulo selecionado]
**Dado-âncora:** [dado âncora e fonte]
**Total de slides:** [N]

---

## Slide 1 — HOOK (Cover Layout)
**Headline:** [texto da headline — máx 2 linhas]
**Visual cue:** [instrução para Dária: tipo de fundo, imagem sugerida, layout]

---

## Slide 2 — CONTEXTO (Image Context Layout)
**Headline:** [texto — 1 linha]
**Body:** [2 ou 3 frases curtas; ~25–45 palavras no total]
**Visual cue:** [instrução para Dária: imagem full-bleed sugerida, overlay]

---

## Slide 3 — [NOME DO PONTO] (Standard/Split Content Layout)
**Headline:** [texto — 1 linha]
**Body:** [no máximo 2 frases curtas — preferir ≤3 linhas visíveis]
**Visual cue:** [instrução para Dária: Standard ou Split layout, destaque de cor]

---

[slides adicionais com mesma estrutura]

---

## Slide N-1 — REFLEXÃO (Reflection Layout)
**Headline:** [pergunta ou afirmação de reflexão]
**Body:** [complemento opcional]
**Visual cue:** Reflection layout — texto centralizado, espaçamento generoso

---

## Slide N — CTA (CTA Layout)
**Headline:** [headline do CTA]
**Body:** [contexto da ação]
**Ação 1 (Salvar):** [instrução de save específica ao tema]
**Ação 2 (Comentar):** [pergunta de comentário específica ao tema]
**Visual cue:** CTA layout — botão teal, alto contraste

---

## Caption Instagram

[Hook nos primeiros 125 chars]

[Body da caption — 3-5 parágrafos]

[Pergunta final para engajamento]

📌 [CTA de salvar na caption]

#hashtag1 #hashtag2 #hashtag3 [...] #hashtag12
```

## Output Example

```markdown
# Carrossel: IA Corporativa — O Gap que Ninguém Fala
**Ângulo:** Contrário / Revelador
**Dado-âncora:** 78% declaram IA como prioridade, apenas 12% têm programa real (McKinsey, 2025)
**Total de slides:** 8

---

## Slide 1 — HOOK (Cover Layout)
**Headline:** 78% das empresas dizem que IA é prioridade.
Só 12% têm um programa real.
**Visual cue:** Fundo escuro com imagem AI brain glow. Hero text 82px terço inferior. "78%" e "12%" em gold #e8c85c.

---

## Slide 2 — CONTEXTO (Image Context Layout)
**Headline:** O que separa os 12% dos 78%?
**Body:** Não é orçamento. Não é tecnologia. É estrutura.
As empresas que estão colhendo resultados reais com IA têm três coisas em comum: um caso de uso específico (não genérico), uma equipe dedicada e um processo de experimentação com ciclos curtos.
As outras 66%? Têm PowerPoints de estratégia IA — e nenhum projeto em produção.
*(McKinsey Global Institute, 2025)*
**Visual cue:** Imagem full-bleed sala de reunião tech + overlay rgba(21,10,28,0.85). Headline 46px, body 36px, destaques em teal #c0fefd.

---

## Slide 3 — POR QUE AS INTENÇÕES NÃO VIRAM PROJETOS (Standard Content Layout)
**Headline:** Por que as intenções não viram projetos?
**Body:** Porque "programa de IA" foi delegado ao TI.
Mas 73% dos casos de uso mais rentáveis de IA surgem do negócio: vendas, operações, RH — não do departamento de tecnologia.
*(Harvard Business Review, 2024)*
**Visual cue:** Standard Content Layout. Destaque teal em "73%".

---

## Slide 4 — O ERRO MAIS COMUM (Split Content Layout)
**Headline:** O erro mais comum das empresas
**Body:** Buscar a transformação perfeita em vez do experimento imperfeito.
**Callout box:** Um piloto bem desenhado leva 6-8 semanas. As empresas que mais avançam fazem 4-6 pilotos por ano.
**Complemento:** As que ficam para trás esperaram o projeto "ideal" por 18 meses. *(Gartner, 2025)*
**Visual cue:** Split Content Layout. Callout box com borda teal e background rgba(153,60,177,0.30).

---

## Slide 5 — STARTUPS + GRANDES EMPRESAS (Standard Content Layout)
**Headline:** A combinação que funciona
**Body:** 67% das Fortune 500 que mais avançaram em IA em 2024 fizeram isso em parceria com startups — não apenas com big techs.
Velocidade de startup + escala corporativa = vantagem competitiva real.
*(World Economic Forum, 2024)*
**Visual cue:** Standard Content Layout. Destaque gold em "67%".

---

## Slide 6 — O CUSTO DE ESPERAR (Split Content Layout)
**Headline:** O custo de esperar mais um trimestre
**Body:** Empresas com programas estruturados de IA desde 2022 têm hoje 23% mais produtividade.
**Callout box:** Em mercados de margem apertada, 23% de produtividade não é detalhe — é sobrevivência.
*(McKinsey, 2025)*
**Visual cue:** Split Content Layout. "23%" em destaque teal no callout.

---

## Slide 7 — REFLEXÃO (Reflection Layout)
**Headline:** A pergunta que sua empresa precisa responder hoje:
**Body:** Você está nos 12% que fazem — ou nos 66% que falam?
Não existe posição neutra nessa corrida. Cada trimestre de espera é vantagem que vai para o competidor que começou antes.
**Visual cue:** Reflection Layout — texto centralizado, espaçamento 80px, gradiente sutil, sem rodapé ARRASTE.

---

## Slide 8 — CTA (CTA Layout)
**Headline:** Salva esse carrossel.
**Body:** Da próxima vez que o board perguntar "mas como começamos com IA", você vai ter a estrutura certa.
**Ação 1 (Salvar):** Salva esse carrossel para a próxima reunião de estratégia.
**Ação 2 (Comentar):** Comenta: sua empresa está nos 12% ou nos 66%?
**Visual cue:** CTA Layout — botão teal sólido #50beba, "Salva" em texto escuro #0d0718, ação de comentar em gold.

---

## Caption Instagram

78% das empresas dizem que IA é prioridade estratégica. Só 12% têm um programa real em produção. 🔍

O gap não é de tecnologia. É de estrutura — e de coragem para começar pequeno e iterar rápido.

Os 12% que fazem têm três coisas: caso de uso específico, equipe dedicada e ciclos curtos de experimentação. O resto tem PowerPoints de estratégia.

73% dos casos de uso mais rentáveis de IA não surgem do TI. Surgem do negócio. Isso muda tudo sobre como estruturar um programa.

Em qual lado dessa divisão a sua empresa está?

📌 Salva esse carrossel para a próxima conversa sobre IA corporativa na sua empresa.

#inovacaocorporativa #inteligenciaartificial #inovacao #transformacaodigital #openinnovation #innovationlatam #startups #gestaoinovacao #corporateinnovation #AIstrategy #inovacaoaberta #empreendedorismocorporativo
```

## Quality Criteria

- Slide 1 abre com dado-âncora — nunca apresentação, marca ou "Hoje vamos falar"
- 7-9 slides totais com papéis claros (hook + contexto + desenvolvimento + reflexão + CTA)
- **Copy enxuto:** slide 2 com 2–3 frases curtas; desenvolvimento com **≤3 linhas visíveis** no corpo (máx. 4 se inevitável)
- Slide N-1 é de reflexão emocional — sem dados novos
- CTA tem exatamente 2 ações específicas ao tema (salvar + comentar)
- Caption com hook nos primeiros 125 chars + 8-12 hashtags no final

## Veto Conditions

1. Slide 1 começa com nome da marca, "Hoje vamos falar" ou qualquer apresentação — falha de scroll-stop
2. Slide de reflexão contém dado novo — violação do papel do slide de reflexão
3. Qualquer slide com **parágrafo longo** ou **mais de 4 linhas** no corpo — falha de formato Instagram
