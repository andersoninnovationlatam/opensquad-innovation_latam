---
task: generate-angles
agent: carlos-conteudo
order: 1
input:
  - squads/agent-social-media-innovation-latam/input/content.md
  - squads/agent-social-media-innovation-latam/output/research.md
output:
  - squads/agent-social-media-innovation-latam/output/angles.yaml
---

## Process

0. **Ler o ângulo escolhido pelo usuário (obrigatório).** No topo de `input/content.md`, o YAML frontmatter deve incluir `angulo_escolhido` com **exatamente um** destes IDs: `medo` | `oportunidade` | `educacional` | `contrario` | `inspiracional`. Se estiver ausente, inválido ou ambíguo, **não** prosseguir até correção.

1. **Absorver o brief completo.** Ler `output/research.md` em sua totalidade — dar especial atenção ao [ANCHOR DATA] e ao [ENRICHED DATA]. O dado-âncora é o ponto de partida para os ângulos (a notícia original está em `input/content.md` abaixo do frontmatter; o Rafael enriquece em `research.md`).

2. **Identificar a tensão central.** Todo carrossel forte tem um conflito ou revelação central. Qual é a tensão nos dados? (ex: "declaram vs. executam", "planejam vs. entregam", "sabem vs. fazem").

3. **Gerar os 5 ângulos** — cada um com uma lente emocional completamente diferente:
   - **Medo:** "Se sua empresa não fizer X, Y vai acontecer" — urgência, risco competitivo
   - **Oportunidade:** "Esta janela ainda está aberta — mas não por muito tempo" — FOMO, antecipação
   - **Educacional:** "Como [mecanismo] funciona — explicado de forma clara" — segurança, competência
   - **Contrário:** "O que ninguém te conta sobre [tema consolidado]" — surpresa, revisão de crença
   - **Inspiracional:** "Imagine como será sua empresa quando [transformação acontecer]" — pertencimento, propósito

4. **Avaliar cada ângulo** contra 3 critérios: (a) o dado-âncora brilha nesse ângulo? (b) é relevante para profissionais de inovação corporativa? (c) tem potencial de gerar save/comment?

5. **Aplicar a escolha do usuário.** Marcar `selected: true` **somente** no ângulo cujo `id` coincide com `angulo_escolhido` do frontmatter de `input/content.md`. No ângulo selecionado, a `justification` deve reconhecer que o ângulo foi **definido pelo usuário** e explicar o encaixe com o dado-âncora e o brief (2-3 linhas), sem competir com os outros ângulos.

6. **Escrever o hook_preview** de cada ângulo — 1-2 linhas que seria o slide 1 se aquele ângulo fosse selecionado. Deve sempre começar com o dado-âncora.

7. **Preencher `angulo_selecionado`** no YAML com o mesmo ID que `angulo_escolhido` do input.

## Output Format

```yaml
# angles.yaml — gerado por Carlos Conteúdo
tema: "[TEMA DO BRIEF]"
dado_ancora: "[DADO ÂNCORA IDENTIFICADO NO BRIEF]"
fonte_ancora: "[FONTE DO DADO ÂNCORA]"
angulo_escolhido_pelo_usuario: "[mesmo id que em input/content.md — medo|oportunidade|educacional|contrario|inspiracional]"
gerado_em: "[YYYY-MM-DD]"

angulos:
  - id: medo
    label: "Medo / Urgência"
    emotional_lens: "Risco competitivo — o custo de não agir agora"
    hook_preview: "[1-2 linhas que seriam o slide 1 neste ângulo]"
    score_ancora: "[1-5 — o dado-âncora funciona bem neste ângulo?]"
    score_relevancia: "[1-5 — relevante para profissionais de inovação?]"
    score_engajamento: "[1-5 — potencial de save/comment?]"
    selected: false
    justification: ""

  - id: oportunidade
    label: "Oportunidade / FOMO"
    emotional_lens: "A janela que ainda está aberta"
    hook_preview: "[1-2 linhas]"
    score_ancora: "[1-5]"
    score_relevancia: "[1-5]"
    score_engajamento: "[1-5]"
    selected: false
    justification: ""

  - id: educacional
    label: "Educacional / Didático"
    emotional_lens: "Aprenda como funciona — clareza e competência"
    hook_preview: "[1-2 linhas]"
    score_ancora: "[1-5]"
    score_relevancia: "[1-5]"
    score_engajamento: "[1-5]"
    selected: false
    justification: ""

  - id: contrario
    label: "Contrário / Revelador"
    emotional_lens: "O que ninguém te conta — surpresa e revisão de crença"
    hook_preview: "[1-2 linhas]"
    score_ancora: "[1-5]"
    score_relevancia: "[1-5]"
    score_engajamento: "[1-5]"
    selected: true
    justification: "[2-3 linhas: ângulo definido pelo usuário + encaixe com dado-âncora e brief]"

  - id: inspiracional
    label: "Inspiracional / Transformador"
    emotional_lens: "Imagine como será quando a transformação acontecer"
    hook_preview: "[1-2 linhas]"
    score_ancora: "[1-5]"
    score_relevancia: "[1-5]"
    score_engajamento: "[1-5]"
    selected: false
    justification: ""

angulo_selecionado: contrario
proximo_passo: "Criar slides com ângulo selecionado usando o dado-âncora no slide 1"
```

## Output Example

```yaml
# angles.yaml — gerado por Carlos Conteúdo
tema: "Inovação Corporativa com IA no Brasil 2025"
dado_ancora: "78% das empresas declaram IA como prioridade — apenas 12% têm programa real em produção"
fonte_ancora: "McKinsey Global Institute, 2025"
angulo_escolhido_pelo_usuario: "contrario"
gerado_em: "2026-04-01"

angulos:
  - id: medo
    label: "Medo / Urgência"
    emotional_lens: "Risco competitivo — empresas concorrentes já estão colhendo resultados"
    hook_preview: "Seu concorrente já tem programa de IA rodando. Você tem um PowerPoint de estratégia. A diferença vai aparecer no P&L do próximo trimestre."
    score_ancora: 3
    score_relevancia: 4
    score_engajamento: 3
    selected: false
    justification: ""

  - id: oportunidade
    label: "Oportunidade / FOMO"
    emotional_lens: "A janela de vantagem competitiva via IA ainda está aberta"
    hook_preview: "Empresas que estruturaram IA entre 2022-2024 já têm 23% mais produtividade. A janela não está fechada — mas está encolhendo rápido."
    score_ancora: 4
    score_relevancia: 5
    score_engajamento: 4
    selected: false
    justification: ""

  - id: educacional
    label: "Educacional / Didático"
    emotional_lens: "Como um programa de IA corporativo realmente funciona — 4 elementos essenciais"
    hook_preview: "73% dos casos de uso mais rentáveis de IA não surgem do TI. Surgem do negócio. Aqui está como estruturar isso."
    score_ancora: 3
    score_relevancia: 4
    score_engajamento: 3
    selected: false
    justification: ""

  - id: contrario
    label: "Contrário / Revelador"
    emotional_lens: "O gap que ninguém fala — 78% dizem, 12% fazem"
    hook_preview: "78% das empresas dizem que IA é prioridade estratégica. Só 12% têm um programa real em produção. O gap não é de tecnologia — é de estrutura."
    score_ancora: 5
    score_relevancia: 5
    score_engajamento: 5
    selected: true
    justification: "Ângulo definido pelo usuário em input/content.md (angulo_escolhido: contrario). O dado-âncora 78% vs 12% é intrinsecamente contraintuitivo; a lente Contrário faz o gap declaração/execução explodir no feed para a audiência Innovation Latam."

  - id: inspiracional
    label: "Inspiracional / Transformador"
    emotional_lens: "Imagine sua empresa nos 12% que fazem — não nos 66% que falam"
    hook_preview: "Existem duas empresas no seu setor. Uma nos 12% que têm IA rodando. Outra nos 66% que têm reunião sobre IA. Em qual você quer estar em 2027?"
    score_ancora: 3
    score_relevancia: 3
    score_engajamento: 3
    selected: false
    justification: ""

angulo_selecionado: contrario
proximo_passo: "Criar slides com ângulo Contrário/Revelador usando dado-âncora 78% vs 12% no slide 1"
```

## Quality Criteria

- Frontmatter de `input/content.md` com `angulo_escolhido` válido; 5 ângulos gerados com lentes emocionais genuinamente distintas entre si
- Hook preview de cada ângulo começa com o dado-âncora (ou derivado direto)
- Exatamente 1 ângulo com `selected: true` — o que coincide com `angulo_escolhido` do usuário
- `angulo_selecionado` no YAML = `angulo_escolhido` do input; campo `angulo_escolhido_pelo_usuario` preenchido
- Scores preenchidos para todos os 5 ângulos nos 3 critérios
- Output é YAML válido e parseável

## Veto Conditions

1. `angulo_escolhido` ausente ou ID inválido em `input/content.md`
2. Menos de 5 ângulos gerados — tarefa incompleta
3. Mais de 1 ângulo marcado como `selected: true`, ou o selecionado ≠ `angulo_escolhido` do usuário
