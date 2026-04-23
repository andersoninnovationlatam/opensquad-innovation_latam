---
step: 5
name: angle-selection
type: checkpoint
inputFile: squads/instagram-carrossel/output/angles.md
outputFile: squads/instagram-carrossel/output/angle-selection.md
---

## Contexto

Carlos Carrossel apresentou 5 ângulos criativos para a pauta selecionada. Agora é hora de escolher o ângulo que melhor representa a mensagem que você quer transmitir para o público da Innovation Latam.

**Lembre-se:** O ângulo define o "por quê" emocional do carrossel — a razão pela qual alguém vai parar o scroll, ler até o final e salvar o post.

---

## Context Loading

Ler `squads/instagram-carrossel/output/angles.md` e apresentar os ângulos ao usuário.

---

## Instructions

### Process

1. **Apresentar o pré-diagnóstico** resumido para contexto
2. **Listar os 5 ângulos** numerados com: nome, driver emocional, hook e tom recomendado
3. **Aguardar seleção** do usuário — aceitar:
   - Número do ângulo (1-5)
   - Pedido de variação ("Ângulo 2 mas com tom mais urgente")
   - Ângulo próprio do usuário (será registrado como "Ângulo customizado")
4. **Confirmar a seleção** com o usuário
5. **Gravar em angle-selection.md** com todos os detalhes do ângulo escolhido

### Output Format

Apresentar ao usuário:
```
## Ângulos Disponíveis — [título da pauta]

[Pré-diagnóstico resumido: awareness + driver dominante]

1. **[NOME DO ÂNGULO]**
   Driver: [driver emocional]
   Hook: "[hook de 1-2 linhas]"
   Tom: [Tom N — Nome]

2. **[NOME DO ÂNGULO]**
   [... mesmo formato ...]

[... até ângulo 5 ...]

---
Qual ângulo você escolhe? (número, variação ou ângulo próprio):
```

Após confirmação, gravar em `squads/instagram-carrossel/output/angle-selection.md`:
```
ÂNGULO SELECIONADO
Nome: [nome do ângulo]
Driver emocional: [driver]
Hook aprovado: "[hook]"
Tom de voz: Tom [N] — [nome]
Justificativa: [por que vai engajar — do angles.md]

Selecionado em: [YYYY-MM-DD]
```

### Output Example

```
## Ângulos Disponíveis — "Gartner: 70% das Fortune 500 usarão IA generativa até 2026"

Diagnóstico: Awareness médio, sofisticação média-alta. Driver dominante: medo de obsolescência.

1. **O RELÓGIO ESTÁ CORRENDO**
   Driver: Medo de ficar para trás
   Hook: "Em 12 meses, empresas sem IA vão operar com 30% mais custo que os concorrentes. O Gartner confirmou."
   Tom: Tom 4 — Urgente e Direto

2. **IA NÃO É FICÇÃO CIENTÍFICA**
   Driver: Curiosidade + Alívio (desmistificação)
   Hook: "7 em cada 10 gestores acham que IA é coisa de empresa de tecnologia. O Gartner discorda — com dados."
   Tom: Tom 2 — Educativo e Acessível

3. **PARE DE ESPERAR O MOMENTO CERTO**
   Driver: Indignação produtiva
   Hook: "O 'momento certo' para adotar IA passou em 2024. Agora é corrida para não ficar para trás."
   Tom: Tom 3 — Provocador e Contrário

4. **OS NÚMEROS QUE TODO GESTOR PRECISA VER**
   Driver: Segurança intelectual / curadoria
   Hook: "Gartner, McKinsey e Forrester publicaram os números de IA em 2026. Aqui está o que importa."
   Tom: Tom 6 — Data-Driven e Analítico

5. **COMO ELES FIZERAM EM 8 MESES**
   Driver: Inspiração / prova social
   Hook: "Em 2024, uma indústria brasileira economizou R$ 28M com IA em 8 meses. Veja o passo a passo."
   Tom: Tom 5 — Storytelling Emocional

---
Qual ângulo você escolhe? (1-5, variação ou ângulo próprio):
```

### Veto Conditions

- **NÃO avançar** sem confirmação explícita do usuário
- **NÃO assumir** que o usuário quer o ângulo recomendado — aguardar input
- **PARAR se** angles.md não existir — solicitar que o Passo 4 seja executado

### Quality Criteria

- Todos os 5 ângulos apresentados com todos os campos
- Pré-diagnóstico resumido para contexto de escolha
- angle-selection.md gravado com o ângulo completo após confirmação
- Nenhuma escrita de carrossel antes de receber a confirmação
