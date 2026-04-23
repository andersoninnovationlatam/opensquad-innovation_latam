---
step: 4
name: generate-angles
type: agent
agent: carlos-carrossel
execution: inline
inputFile: squads/instagram-carrossel/output/news-selection.md
outputFile: squads/instagram-carrossel/output/angles.md
---

## Contexto

**Agente:** Carlos Carrossel — Copywriter de Instagram
**Tarefa:** generate-angles (Tarefa 1 de 2)
**Execução:** Inline (Carlos interage diretamente com o usuário)

A pauta foi selecionada. Carlos Carrossel agora realiza um pré-diagnóstico editorial e gera 5 ângulos criativos distintos para o carrossel. O usuário escolherá qual ângulo explorar antes de qualquer conteúdo ser escrito.

---

## Context Loading

Antes de executar, Carlos Carrossel deve ler:

1. `squads/instagram-carrossel/output/news-selection.md` — pauta selecionada (título, fonte, resumo)
2. `squads/instagram-carrossel/output/research-focus.md` — tema principal e público
3. `squads/instagram-carrossel/pipeline/data/tone-of-voice.md` — 6 tons disponíveis para mapear aos ângulos
4. `squads/instagram-carrossel/pipeline/data/domain-framework.md` — drivers emocionais e público do ecossistema

---

## Instructions

### Process

1. **Realizar pré-diagnóstico editorial** em 3 dimensões:
   - Nível de awareness do público sobre o tema (Alto / Médio / Baixo)
   - Sofisticação do mercado (Alta / Média / Baixa)
   - Driver psicológico dominante para o tema

2. **Gerar 5 ângulos distintos**, cada um com:
   - Nome do ângulo (título editorial interno)
   - Driver emocional (emoção que ativa)
   - Hook de 1-2 linhas (abertura do Slide 1)
   - Tom recomendado (1-6 do tone-of-voice.md)
   - Por que vai engajar (1-2 linhas específicas ao público)

3. **Garantir diversidade de drivers** — no mínimo 3 drivers emocionais distintos nos 5 ângulos (medo, curiosidade, aspiração, provocação, segurança intelectual)

4. **Apresentar ao usuário** em formato numerado e aguardar seleção

5. **NÃO escrever conteúdo de slides** antes de receber a seleção do usuário

### Output Format

```
PRÉ-DIAGNÓSTICO EDITORIAL
Pauta: [título da pauta]
Nível de awareness: [nível] — [justificativa de 1 linha]
Sofisticação do mercado: [nível] — [justificativa de 1 linha]
Driver dominante: [driver] — [justificativa de 1 linha]

---

5 ÂNGULOS PARA SELEÇÃO

Ângulo 1 — [NOME]
Driver emocional: [driver]
Hook: "[1-2 linhas que parariam o scroll]"
Tom: Tom [N] — [nome]
Por que vai engajar: [1-2 linhas]

[... ângulos 2, 3, 4, 5 no mesmo formato ...]

---
Selecione o ângulo (1-5) ou solicite uma variação:
```

### Output Example

```
PRÉ-DIAGNÓSTICO EDITORIAL
Pauta: "Gartner: 70% das Fortune 500 usarão IA generativa até 2026"
Nível de awareness: Médio — Executivos já ouviram sobre IA, mas a maioria ainda está avaliando sem decisão
Sofisticação do mercado: Média-alta — Gestores de inovação buscam argumento para agir, não mais introdução ao tema
Driver dominante: Medo de obsolescência — O timing do relatório Gartner ativa urgência de quem ainda não começou

---

5 ÂNGULOS PARA SELEÇÃO

Ângulo 1 — O RELÓGIO ESTÁ CORRENDO
Driver emocional: Medo de ficar para trás
Hook: "Em 12 meses, empresas sem IA vão operar com 30% mais custo que os concorrentes. O Gartner acabou de confirmar."
Tom: Tom 4 — Urgente e Direto
Por que vai engajar: Ativa FOMO corporativo com dado específico; executivos em avaliação vão salvar para mostrar à diretoria.

Ângulo 2 — IA NÃO É FICÇÃO CIENTÍFICA
Driver emocional: Curiosidade + Alívio (desmistificação)
Hook: "7 em cada 10 gestores acham que IA é coisa de empresa de tecnologia. O Gartner discorda — com dados."
Tom: Tom 2 — Educativo e Acessível
Por que vai engajar: Endereça a crença limitante mais comum; público de awareness médio se identifica com o mito.

Ângulo 3 — PARE DE ESPERAR O MOMENTO CERTO
Driver emocional: Indignação produtiva / provocação
Hook: "O 'momento certo' para adotar IA passou em 2024. Agora é corrida para não ficar para trás."
Tom: Tom 3 — Provocador e Contrário
Por que vai engajar: Afirmação que divide opiniões; gera comentários de quem concorda e discorda.

Ângulo 4 — OS NÚMEROS QUE TODO GESTOR PRECISA VER
Driver emocional: Segurança intelectual / curadoria
Hook: "Gartner, McKinsey e Forrester publicaram os números de IA em 2026. Aqui está o que realmente importa."
Tom: Tom 6 — Data-Driven e Analítico
Por que vai engajar: Curadoria de dados de múltiplas fontes; executivos sem tempo vão salvar como referência.

Ângulo 5 — COMO ELES FIZERAM EM 8 MESES
Driver emocional: Inspiração / prova social
Hook: "Em 2024, uma indústria brasileira economizou R$ 28M com IA em 8 meses. Veja o passo a passo."
Tom: Tom 5 — Storytelling Emocional
Por que vai engajar: Caso concreto com número real e metodologia; executivos querem ver o que funciona antes de decidir.

---
Selecione o ângulo (1-5) ou solicite uma variação:
```

### Veto Conditions

- **NUNCA iniciar escrita de slides** antes de receber a seleção do usuário
- **NUNCA apresentar menos de 5 ângulos** — 4 ou menos não oferecem diversidade suficiente
- **NUNCA repetir o mesmo driver emocional** em todos os 5 ângulos
- **PARAR se** news-selection.md não existir — solicitar conclusão do checkpoint anterior

### Quality Criteria

- Pré-diagnóstico em 3 dimensões com justificativa antes dos ângulos
- Exatamente 5 ângulos, cada um com todos os campos (nome, driver, hook, tom, por que vai engajar)
- Drivers emocionais distintos em pelo menos 3 ângulos
- Hooks específicos à pauta — não genéricos
- Aguardar seleção antes de qualquer escrita de conteúdo
