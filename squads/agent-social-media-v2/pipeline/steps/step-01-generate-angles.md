---
execution: inline
agent: carlos-conteudo
inputFile: squads/agent-social-media-v2/input/content.md
outputFile: squads/agent-social-media-v2/output/angles.yaml
---

## Context Loading

Antes de executar, carregar:
- `squads/agent-social-media-v2/input/content.md` — notícia ou texto-base **e** `angulo_escolhido` no frontmatter YAML (obrigatório: `medo` | `oportunidade` | `educacional` | `contrario` | `inspiracional`)
- `squads/agent-social-media-v2/pipeline/data/domain-framework.md` — os 5 ângulos e critérios de seleção
- `squads/agent-social-media-v2/pipeline/data/tone-of-voice.md` — os 6 tons e vocabulário
- `squads/agent-social-media-v2/pipeline/data/anti-patterns.md` — o que evitar no copy
- `squads/agent-social-media-v2/agents/carlos-conteudo/tasks/generate-angles.md` — task file detalhado

## Instructions

### Process

**Língua (Carlos):** textos do YAML (`hook_preview`, `justification`) em **português brasileiro** com ortografia e gramática corretas; **maiúscula** no início de cada `hook_preview` e de cada frase nas justificativas. Ver `agents/carlos-conteudo.agent.md` e `tasks/generate-angles.md`.

0. **Validar o ângulo do usuário.** Ler o frontmatter de `input/content.md` e confirmar `angulo_escolhido` com um dos IDs válidos. Se ausente ou inválido, parar e pedir correção no input.

1. **Absorver o texto completo do usuário.** Ler o corpo de `input/content.md` (após o frontmatter) e extrair o **dado-âncora** (número, afirmação central ou gancho factual mais forte presente no texto). Se não houver número, usar a afirmação mais específica e verificável do próprio texto como âncora. O dado-âncora é o ponto de partida obrigatório para todos os ângulos.

2. **Identificar a tensão central do conteúdo.** Qual é o conflito ou revelação que emerge do texto? (ex: "declaram vs. executam", "sabem vs. fazem", "querem vs. conseguem").

3. **Gerar os 5 ângulos virais** — cada um com uma lente emocional genuinamente diferente:
   - **Medo:** urgência, risco competitivo, custo de não agir
   - **Oportunidade:** janela aberta, FOMO, quem está aproveitando
   - **Educacional:** framework claro, "como funciona", segurança + competência
   - **Contrário:** surpresa, revisão de crença, o que ninguém conta
   - **Inspiracional:** transformação possível, pertencimento, visão futura

4. **Avaliar cada ângulo** com scores de 1-5 em: (a) força com o dado-âncora, (b) relevância para profissionais de inovação corporativa, (c) potencial de engajamento (save/comment).

5. **Aplicar a escolha do usuário.** Marcar `selected: true` **somente** no ângulo cujo `id` = `angulo_escolhido`. Incluir no YAML o campo `angulo_escolhido_pelo_usuario` com esse mesmo id. Justificativa no ângulo selecionado: ângulo definido pelo usuário + encaixe com notícia e dado-âncora (2-3 linhas). Não substituir o ângulo do usuário por outro.

6. **Escrever o hook_preview de cada ângulo.** 1-2 linhas que seriam o slide 1 se aquele ângulo fosse selecionado. DEVE começar com o dado-âncora ou derivado direto.

7. **Definir `angulo_selecionado`** no YAML igual a `angulo_escolhido` do input.

## Output Format

```yaml
# angles.yaml
tema: "[TEMA]"
dado_ancora: "[DADO ÂNCORA]"
fonte_ancora: "[FONTE]"
angulo_escolhido_pelo_usuario: "[id do frontmatter — medo|oportunidade|educacional|contrario|inspiracional]"
gerado_em: "[YYYY-MM-DD]"

angulos:
  - id: medo
    label: "Medo / Urgência"
    emotional_lens: "[lente emocional específica]"
    hook_preview: "[1-2 linhas do slide 1]"
    score_ancora: [1-5]
    score_relevancia: [1-5]
    score_engajamento: [1-5]
    selected: false
    justification: ""

  - id: oportunidade
    label: "Oportunidade / FOMO"
    emotional_lens: "[...]"
    hook_preview: "[...]"
    score_ancora: [1-5]
    score_relevancia: [1-5]
    score_engajamento: [1-5]
    selected: false
    justification: ""

  - id: educacional
    label: "Educacional / Didático"
    emotional_lens: "[...]"
    hook_preview: "[...]"
    score_ancora: [1-5]
    score_relevancia: [1-5]
    score_engajamento: [1-5]
    selected: false
    justification: ""

  - id: contrario
    label: "Contrário / Revelador"
    emotional_lens: "[...]"
    hook_preview: "[...]"
    score_ancora: [1-5]
    score_relevancia: [1-5]
    score_engajamento: [1-5]
    selected: true
    justification: "[2-3 linhas de justificativa da seleção]"

  - id: inspiracional
    label: "Inspiracional / Transformador"
    emotional_lens: "[...]"
    hook_preview: "[...]"
    score_ancora: [1-5]
    score_relevancia: [1-5]
    score_engajamento: [1-5]
    selected: false
    justification: ""

angulo_selecionado: contrario
proximo_passo: "Criar slides com ângulo selecionado — slide 1 abre com dado-âncora"
```

## Output Example

```yaml
# angles.yaml — Open Innovation Brasil 2025
tema: "Programas de Open Innovation no Brasil 2025"
dado_ancora: "ROI médio de 3.2× por real investido em programas de open innovation acima de 12 meses"
fonte_ancora: "Abstartups, Relatório de Inovação Aberta 2025"
angulo_escolhido_pelo_usuario: "oportunidade"
gerado_em: "2026-04-01"

angulos:
  - id: medo
    label: "Medo / Urgência"
    emotional_lens: "Pool de startups de alto potencial diminuindo — concorrência por parceiros vai aumentar"
    hook_preview: "Em 2024, programas de open innovation no Brasil cresceram 43%. O pool de startups disponíveis está encolhendo. Sua empresa ainda vai a tempo?"
    score_ancora: 3
    score_relevancia: 4
    score_engajamento: 3
    selected: false
    justification: ""

  - id: oportunidade
    label: "Oportunidade / FOMO"
    emotional_lens: "A janela de ROI 3.2× ainda está disponível — mas exige começar agora e persistir por 12 meses"
    hook_preview: "Para cada R$1 investido em open innovation por mais de 12 meses: R$3,20 de retorno. A janela está aberta — mas 71% das empresas desistem antes de chegar lá."
    score_ancora: 5
    score_relevancia: 5
    score_engajamento: 4
    selected: true
    justification: "Ângulo definido pelo usuário em input/content.md (angulo_escolhido: oportunidade). O ROI 3.2× pede narrativa de janela e retorno; o dado dos 71% que desistem antes de 6 meses fecha o gancho com urgência sem virar medo puro — encaixa o brief e a notícia."

  - id: educacional
    label: "Educacional / Didático"
    emotional_lens: "O framework dos 3 elementos que fazem um hub de inovação funcionar"
    hook_preview: "ROI de 3.2× em programas de open innovation não é sorte. É estrutura. 3 elementos presentes nos programas que funcionam."
    score_ancora: 3
    score_relevancia: 4
    score_engajamento: 3
    selected: false
    justification: ""

  - id: contrario
    label: "Contrário / Revelador"
    emotional_lens: "71% dos programas desistem antes do ponto de retorno — o erro é de duração, não de conceito"
    hook_preview: "A maioria das empresas diz que open innovation 'não funciona'. Mas 71% dos programas foram encerrados antes de completar 6 meses. Exatamente antes do ROI aparecer."
    score_ancora: 4
    score_relevancia: 4
    score_engajamento: 4
    selected: false
    justification: ""

  - id: inspiracional
    label: "Inspiracional / Transformador"
    emotional_lens: "Imagine sua empresa nos 12 meses de open innovation — onde o ROI começa a aparecer"
    hook_preview: "Imagine estar na reunião de board em que o CFO apresenta ROI de 3.2× do programa de inovação. Isso está a 12 meses de distância."
    score_ancora: 3
    score_relevancia: 3
    score_engajamento: 3
    selected: false
    justification: ""

angulo_selecionado: oportunidade
proximo_passo: "Criar slides com ângulo Oportunidade — slide 1 abre com dado ROI 3.2× e tensão dos 71% que desistem antes"
```

## Veto Conditions

1. `angulo_escolhido` ausente ou inválido em `input/content.md`
2. Menos de 5 ângulos gerados — tarefa incompleta que bloqueia o step seguinte
3. Mais de 1 ângulo com `selected: true`, ou o selecionado ≠ `angulo_escolhido` do usuário

## Quality Criteria

- 5 ângulos com lentes emocionais genuinamente distintas entre si; exatamente o ângulo do usuário com `selected: true`
- Hook preview de cada ângulo começa com o dado-âncora ou derivado direto
- Justificativa no ângulo selecionado: encaixe editorial (usuário já escolheu o ângulo)
- `angulo_selecionado` = `angulo_escolhido` do input; campo `angulo_escolhido_pelo_usuario` preenchido
- Output é YAML válido e parseável pelo step seguinte
