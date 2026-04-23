---
task: create-slides
agent: carlos-conteudo
order: 2
input:
  - squads/agent-social-v3/output/angles.yaml
  - squads/agent-social-v3/input/content.md
  - squads/agent-social-v3/pipeline/data/real-imagery-and-safe-zones.md
  - squads/agent-social-v3/pipeline/data/layout-variations.md
output:
  - squads/agent-social-v3/output/carousel-draft.md
---

## Regra obrigatória — português BR e maiúsculas

- **Idioma:** escrever sempre em **português brasileiro** com **gramática e ortografia** corretas (acentuação, hífen, crase, concordância, pontuação). Revisar o draft antes de entregar.
- **Maiúscula inicial:** todo **Headline**, **Body**, parágrafos da **Caption**, **Ação 1 / Ação 2**, e textos em **Visual cue** que forem frases completas começam com **letra maiúscula**. Cada nova frase após **.** também começa com maiúscula. Não iniciar linha de slide com minúscula (exceto nomes próprios no meio da frase, siglas ou dados já formatados).

---

## Regra obrigatória — texto curto (Instagram / feed mobile)

O carrossel é lido **em tela pequena e em scan**. Menos texto no slide; a **caption** pode carregar nuance e contexto.

- **Frases curtas:** preferir **≤12 palavras** por frase quando couber; evitar períodos com duas ou mais orações em uma linha só.
- **Slide 2 (contexto):** **2 ou 3 frases curtas** (nunca parágrafo longo). Total do body na faixa **~25–45 palavras** como referência (não precisa contar no arquivo; use como teto mental).
- **Slides 3 e 4 (desenvolvimento):** **headline** em uma linha; **body** com **no máximo 2 frases curtas**; **preferir ≤3 linhas visíveis** no slide (**nunca** 5 linhas como alvo).
- **Slide 5 (reflexão) e slide 6 (CTA):** headline + **no máximo 1–2 frases curtas** no body.

---

## Process

0. **Aplicar** a secção **«português BR e maiúsculas»** acima em todo o ficheiro de saída.

1. **Ler `real-imagery-and-safe-zones.md` e `layout-variations.md`** antes de escrever. Os **Visual cues** são o contrato com a Dária (fundos fotográficos por slide, safe zone, texto editorial **à esquerda** em todos os slides; **rodapé** `@innovationlatam` + `ARRASTE ->`; **padding lateral 100px**; viewport **1080×1350**).

2. **Ler o ângulo selecionado (já escolhido pelo usuário no input).** Abrir `output/angles.yaml`, confirmar `angulo_escolhido_pelo_usuario` e localizar o ângulo com `selected: true` e o `hook_preview`. O usuário definiu `angulo_escolhido` em `input/content.md`; Carlos **não** troca de ângulo neste passo — só desenvolve o carrossel nessa lente. O `hook_preview` é o ponto de partida para o slide 1.

3. **Definir a estrutura do carrossel — exatamente 6 slides (fixo).** Papéis obrigatórios: Slide 1 (hook) → Slide 2 (contexto/imagem) → **Slides 3 e 4** (desenvolvimento, 1 ideia por slide) → Slide 5 (reflexão) → Slide 6 (CTA). Não gerar 5, 7 ou 8 slides.

4. **Escrever o Slide 1 (hook).** Começar DIRETAMENTE com o dado-âncora — a afirmação mais surpreendente. 
   **REGRA CRÍTICA (GUARDRAIL):** É estritamente PROIBIDO adicionar palavras quantificadoras genéricas (como "Milhares", "Muitos", "Diversos", "Vários") no início do slide se elas não existirem explicitamente no texto-base (`dado_ancora`). 
   O slide deve começar EXATAMENTE com o `hook_preview` do ângulo selecionado. Nenhuma palavra inventada pode preceder o dado real.
   Máximo 2 linhas visíveis.

5. **Escrever o Slide 2 (contexto).** Responde "Por que esse dado importa?" com **2 ou 3 frases curtas** (ver regra acima). Sem parágrafos nem blocos de artigo. **Visual cue** = Image Context com cenário concreto full-bleed.

6. **Escrever os slides de desenvolvimento (slides 3 e 4 apenas).** Uma ideia por slide. **No máximo 2 frases curtas** no body; **preferir ≤3 linhas visíveis**. Não usar travessão (—): substituir por ponto final ou vírgula. Cada slide avança a narrativa. Verificar: nenhuma informação repetida. **Visual cue** = Standard ou Split (texto **à esquerda**, padding 100px).

7. **Escrever o slide de reflexão (slide 5).** Síntese emocional. Uma pergunta ou afirmação que toca na realidade do leitor profissional de inovação. NÃO um dado novo.

8. **Escrever o slide de CTA (slide 6).** Duas ações específicas ao tema: salvar + comentar. O CTA deve conectar o conteúdo do carrossel a um próximo passo específico do leitor.

9. **Escrever a caption Instagram.** Hook nas primeiras 125 chars (para o preview de feed) + body + pergunta final + 8-12 hashtags no final. Máximo 2.200 chars total.

10. **Revisar o draft completo.** Confirmar **exatamente 6 slides**. Verificar: slide 1 não começa com marca, **nenhum slide com mais de 4 linhas** no corpo (meta: ≤3), frases curtas, nenhuma informação repetida, slide 5 = reflexão e slide 6 = CTA, **Visual cues** conforme norma v3. **Revisão de língua:** PT-BR correto; maiúsculas nos inícios de texto/frase conforme regra acima.

11. **Opcional:** Incluir no topo do draft o bloco **Brief de layout (esta run)** (modelo em `real-imagery-and-safe-zones.md` §3).

## Output Format

```markdown
# Carrossel: [TÍTULO DESCRITIVO]
**Ângulo:** [ângulo selecionado]
**Dado-âncora:** [dado âncora e fonte]
**Total de slides:** 6

---

## Brief de layout (esta run)
_Opcional — ver `real-imagery-and-safe-zones.md` §3._

---

## Slide 1 — HOOK (Cover Layout)
**Headline:** [texto da headline — máx 2 linhas]
**Visual cue:** Cover Layout — fundo full-bleed [cena]; headline banda 60–80% **à esquerda** no bloco; padding **100px**; gold #e8c85c; [compliance]

---

## Slide 2 — CONTEXTO (Image Context Layout)
**Headline:** [texto — 1 linha]
**Body:** [2 ou 3 frases curtas; ~25–45 palavras no total; fonte em linha final se couber]
**Visual cue:** Image Context — full-bleed [cenário]; overlay; data-URI na implementação

---

## Slide 3 — [NOME DO PONTO] (Standard/Split Content Layout)
**Headline:** [texto — 1 linha]
**Body:** [no máximo 2 frases curtas — preferir ≤3 linhas visíveis]
**Visual cue:** Standard ou Split **v3** — texto **à esquerda**; padding **100px**; rodapé @ + ARRASTE ->; safe zone y ≥ **1150px**; viewport **1080×1350**

---

[slides adicionais com mesma estrutura]

---

## Slide N-1 — REFLEXÃO (Reflection Layout)
**Headline:** [pergunta ou afirmação de reflexão]
**Body:** [complemento opcional]
**Visual cue:** Reflection layout — texto **à esquerda**, padding **100px**, rodapé, espaçamento generoso

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

## Quality Criteria

- Ortografia e gramática **brasileiras**; maiúscula no início de cada bloco de copy e após ponto final
- Slide 1 abre com dado-âncora — nunca apresentação, marca ou "Hoje vamos falar"
- **Exatamente 6 slides** (hook + contexto + 2 desenvolvimento + reflexão + CTA)
- **Copy enxuto:** slide 2 com 2–3 frases curtas; slides 3–4 com **≤3 linhas visíveis** no corpo (máximo 4 só se inevitável); frases curtas em todo o carrossel
- Slide 5 é de reflexão emocional — sem dados novos
- CTA tem exatamente 2 ações específicas ao tema (salvar + comentar)
- Caption com hook nos primeiros 125 chars + 8-12 hashtags no final (detalhe e contexto ficam aqui)

## Veto Conditions

0. **Língua:** copy com erros graves de ortografia/gramática (PT-BR) ou linhas de slide/caption que deveriam começar com maiúscula e começam com minúscula — revisar e corrigir antes de entregar
1. **Total de slides diferente de 6** — estrutura fixa obrigatória
2. Slide 1 começa com nome da marca, "Hoje vamos falar" ou qualquer apresentação — falha de scroll-stop
3. Slide de reflexão contém dado novo — violação do papel do slide de reflexão
4. Qualquer slide com **parágrafo longo** ou **mais de 4 linhas** no corpo (texto de artigo no slide) — falha de formato Instagram
