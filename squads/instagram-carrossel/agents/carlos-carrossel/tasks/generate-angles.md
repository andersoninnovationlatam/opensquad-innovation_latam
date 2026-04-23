---
task: generate-angles
order: 1
agent: carlos-carrossel
input:
  - squads/instagram-carrossel/output/news-selection.md
  - squads/instagram-carrossel/output/research-focus.md
output: squads/instagram-carrossel/output/angles.md
---

## Process

### Passo 1 — Ler os arquivos de entrada
Ler `squads/instagram-carrossel/output/news-selection.md` para extrair:
- Pauta selecionada pelo usuário (título, fonte, resumo)
- Qualquer contexto adicional registrado na seleção

Ler `squads/instagram-carrossel/output/research-focus.md` para extrair:
- Tema principal e público do carrossel
- Janela temporal e contexto editorial

### Passo 2 — Executar pré-diagnóstico editorial
Antes de gerar qualquer ângulo, realizar o diagnóstico em 3 dimensões:

**Nível de Awareness do público sobre o tema:**
- **Alto:** Público já conhece o tema, tem opinião formada, pode estar saturado
- **Médio:** Público ouviu falar, mas não se aprofundou; está em fase de avaliação
- **Baixo:** Tema novo para o público; precisa de contextualização antes de aprofundar

**Sofisticação do mercado:**
- **Alta:** Executivos séniores, early adopters, tomadores de decisão com experiência no tema
- **Média:** Gestores de nível médio, profissionais interessados mas não especialistas
- **Baixa:** Público amplo, incluindo colaboradores e empreendedores em fase inicial

**Driver psicológico dominante para o tema:**
- Medo de ficar para trás / obsolescência
- Curiosidade intelectual / vontade de aprender
- Aspiração / desejo de fazer o que os líderes fazem
- Indignação / frustração com o status quo
- Segurança / busca por validação de decisão já tomada

### Passo 3 — Gerar 5 ângulos distintos
Com base no pré-diagnóstico, criar 5 ângulos que exploram drivers emocionais diferentes. Cada ângulo deve ser genuinamente distinto — não variações do mesmo tema.

**Para cada ângulo, entregar:**
- **Nome do ângulo** — título editorial interno (ex: "O relógio está correndo")
- **Driver emocional** — qual emoção activa (ex: Medo de obsolescência)
- **Hook** — abertura de 1-2 linhas que seria o Slide 1 do carrossel
- **Tom recomendado** — qual dos 6 tons de tone-of-voice.md se aplica
- **Por que vai engajar** — 1-2 linhas explicando o potencial de engajamento para o público específico

**Os 5 ângulos devem cobrir pelo menos 3 drivers emocionais distintos** (ex: urgência, curiosidade, inspiração, provocação, segurança intelectual).

### Passo 4 — Apresentar ao usuário e aguardar seleção
Apresentar os 5 ângulos em formato numerado e claro. Não começar a criar o carrossel. Aguardar que o usuário:
1. Selecione um dos 5 ângulos pelo número
2. Solicite uma variação de algum ângulo
3. Proponha um ângulo diferente

Registrar o pré-diagnóstico e os 5 ângulos em `squads/instagram-carrossel/output/angles.md`.

---

## Output Format

```
PRÉ-DIAGNÓSTICO EDITORIAL
Pauta: [título da pauta selecionada]
Nível de awareness do público: [Alto / Médio / Baixo] — [justificativa de 1 linha]
Sofisticação do mercado: [Alta / Média / Baixa] — [justificativa de 1 linha]
Driver psicológico dominante: [nome do driver] — [justificativa de 1 linha]

---

5 ÂNGULOS PARA SELEÇÃO

Ângulo 1 — [NOME DO ÂNGULO]
Driver emocional: [nome do driver]
Hook (Slide 1): "[abertura de 1-2 linhas que para o scroll]"
Tom recomendado: Tom [N] — [nome do tom de tone-of-voice.md]
Por que vai engajar: [1-2 linhas sobre potencial de engajamento específico para o público]

Ângulo 2 — [NOME DO ÂNGULO]
Driver emocional: [nome do driver]
Hook (Slide 1): "[abertura de 1-2 linhas]"
Tom recomendado: Tom [N] — [nome do tom]
Por que vai engajar: [1-2 linhas]

Ângulo 3 — [NOME DO ÂNGULO]
Driver emocional: [nome do driver]
Hook (Slide 1): "[abertura de 1-2 linhas]"
Tom recomendado: Tom [N] — [nome do tom]
Por que vai engajar: [1-2 linhas]

Ângulo 4 — [NOME DO ÂNGULO]
Driver emocional: [nome do driver]
Hook (Slide 1): "[abertura de 1-2 linhas]"
Tom recomendado: Tom [N] — [nome do tom]
Por que vai engajar: [1-2 linhas]

Ângulo 5 — [NOME DO ÂNGULO]
Driver emocional: [nome do driver]
Hook (Slide 1): "[abertura de 1-2 linhas]"
Tom recomendado: Tom [N] — [nome do tom]
Por que vai engajar: [1-2 linhas]

---

Selecione o ângulo desejado (1-5) ou solicite uma variação:
```

---

## Output Example

```
PRÉ-DIAGNÓSTICO EDITORIAL
Pauta: "Gartner: 70% das empresas Fortune 500 usarão IA generativa até 2026"
Nível de awareness do público: Médio — Executivos já ouviram sobre IA, mas a maioria ainda está em fase de avaliação sem decisão tomada
Sofisticação do mercado: Média-alta — Gestores de inovação e C-suite de grandes empresas; familiarizados com o tema mas buscando argumento para agir
Driver psicológico dominante: Medo de obsolescência — O timing do relatório Gartner ativa urgência; quem não agir nos próximos 12-18 meses fica para trás

---

5 ÂNGULOS PARA SELEÇÃO

Ângulo 1 — O RELÓGIO ESTÁ CORRENDO
Driver emocional: Medo de ficar para trás / urgência
Hook (Slide 1): "Em 12 meses, empresas sem IA vão operar com 30% mais custo que os concorrentes. O Gartner acabou de confirmar."
Tom recomendado: Tom 4 — Urgente e Direto
Por que vai engajar: Ativa o FOMO corporativo com dado específico de fonte primária. Executivos em avaliação de IA vão salvar para mostrar à diretoria.

Ângulo 2 — IA NÃO É FICÇÃO CIENTÍFICA
Driver emocional: Curiosidade + Alívio (desmistificação)
Hook (Slide 1): "7 em cada 10 gestores ainda acham que IA é coisa de empresa de tecnologia. O Gartner discorda — e traz dados."
Tom recomendado: Tom 2 — Educativo e Acessível
Por que vai engajar: Endereça a crença limitante mais comum sobre IA. Público de awareness médio se identifica com o mito e quer saber a realidade.

Ângulo 3 — PARE DE CHAMAR DE TRANSFORMAÇÃO DIGITAL
Driver emocional: Indignação produtiva / provocação
Hook (Slide 1): "Transformação digital é o novo PowerPoint. Todo mundo faz apresentação; quase ninguém entrega resultado. IA é diferente — e aqui está o porquê."
Tom recomendado: Tom 3 — Provocador e Contrário
Por que vai engajar: Afirmação que divide opiniões e convida ao debate nos comentários. Alto potencial de compartilhamento por quem concorda.

Ângulo 4 — A JANELA ESTÁ SE FECHANDO
Driver emocional: Aspiração + Segurança de ter agido no momento certo
Hook (Slide 1): "As empresas que estão capturando 80% do valor da IA até 2030 estão fazendo algo que seus concorrentes ainda não começaram."
Tom recomendado: Tom 6 — Data-Driven e Analítico
Por que vai engajar: Dado do McKinsey sobre concentração de valor cria segurança intelectual para o executivo que já decidiu agir — vai salvar como referência.

Ângulo 5 — COMO A [EMPRESA] FEZ
Driver emocional: Inspiração / Prova social
Hook (Slide 1): "Em 2024, uma das maiores indústrias do Brasil economizou R$ 28M com IA em apenas 8 meses. Aqui está o passo a passo do que eles fizeram."
Tom recomendado: Tom 5 — Storytelling Emocional
Por que vai engajar: Caso concreto com número real e metodologia clara. Executivos gostam de ver o que funciona antes de decidir — e este vai gerar pedidos de contato.

---

Selecione o ângulo desejado (1-5) ou solicite uma variação:
```

---

## Quality Criteria

1. Pré-diagnóstico completo com as 3 dimensões preenchidas e justificadas antes dos ângulos
2. Exatamente 5 ângulos entregues, cada um com todos os campos (nome, driver, hook, tom, por que vai engajar)
3. Drivers emocionais distintos em pelo menos 3 dos 5 ângulos — não variações do mesmo tema
4. Hooks específicos ao conteúdo da pauta — não genéricos que poderiam ser de qualquer notícia
5. Tom de voz de tone-of-voice.md corretamente mapeado para cada ângulo
6. Aguardar seleção do usuário antes de qualquer escrita de conteúdo de carrossel

---

## Veto Conditions

- **NUNCA criar conteúdo de slides antes de apresentar os 5 ângulos** — o checkpoint de angle-selection existe exatamente para isso
- **NUNCA apresentar menos de 5 ângulos** — 3 ou 4 ângulos não oferecem diversidade suficiente de abordagem
- **NUNCA repetir o mesmo driver emocional nos 5 ângulos** — isso invalida o propósito de apresentar opções diversas
- **PARAR se** news-selection.md não existir ou estiver vazio — solicitar que o usuário complete o checkpoint anterior
