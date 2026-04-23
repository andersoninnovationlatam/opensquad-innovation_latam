---
task: create-carousel
order: 2
agent: carlos-carrossel
input:
  - squads/instagram-carrossel/output/angle-selection.md
  - squads/instagram-carrossel/pipeline/data/visual-identity.md
  - squads/instagram-carrossel/pipeline/data/tone-of-voice.md
output: squads/instagram-carrossel/output/carousel-content.md
---

## Process

### Passo 1 — Ler os arquivos de entrada
Ler `squads/instagram-carrossel/output/angle-selection.md` para extrair:
- Ângulo aprovado pelo usuário (nome, driver emocional, hook)
- Tom de voz selecionado ou recomendado

Ler `squads/instagram-carrossel/pipeline/data/visual-identity.md` para internalizar:
- Regra de slides ímpares (foto conceitual, fundo escuro #0d0d14)
- Regra de slides pares (fundo roxo #993CB1)
- Hierarquia visual: Tag → Título → Corpo/Lista → Swipe hint → Rodapé

Ler `squads/instagram-carrossel/pipeline/data/tone-of-voice.md` para confirmar o tom selecionado.

### Passo 2 — Confirmar tom de voz com o usuário
Apresentar as opções de tom de voice (1-6) do arquivo tone-of-voice.md com uma recomendação baseada no ângulo selecionado. Aguardar confirmação antes de escrever.

Formato de apresentação:
```
Tom recomendado: Tom [N] — [Nome]
Motivo: [1 linha explicando por que este tom se encaixa no ângulo aprovado]

Outros tons compatíveis:
- Tom [X] — [Nome]: [situação em que faria sentido]
- Tom [Y] — [Nome]: [situação em que faria sentido]

Confirma o Tom [N] ou prefere outro?
```

### Passo 3 — Selecionar o formato de carrossel
Com base no ângulo e tom aprovados, selecionar o formato mais adequado:

| Formato | Melhor para |
|---------|-------------|
| Editorial / Análise | Ângulos data-driven e analíticos |
| Listicle (Lista) | Ângulos educativos com itens enumeráveis |
| Tutorial (Passo a Passo) | Ângulos que ensinam um processo |
| Mito vs Realidade | Ângulos provocadores que desmistificam |
| Storytelling | Ângulos emocionais com protagonista |
| Problema → Solução | Ângulos de urgência com saída clara |

Declarar explicitamente o formato escolhido e o número de slides (6-9).

### Passo 4 — Escrever os slides do carrossel
Para cada slide, seguir a estrutura:

**Slides ímpares (1, 3, 5, 7, 9) — Fundo escuro com foto conceitual:**
- Headline em Montserrat Bold (70px+) — o título principal do slide
- Texto de suporte em Montserrat Medium (34px) — 40-80 palavras no total do slide
- Background: descrição da foto conceitual (sujeito, ambiente, expressão) para o Diretor de Arte

**Slides pares (2, 4, 6, 8) — Fundo roxo sólido #993CB1:**
- Tag de categoria pill no topo
- Headline em Montserrat Black (900) — o título do slide
- Texto de suporte ou lista de itens — 40-80 palavras no total do slide
- Background: roxo sólido #993CB1

**Regras obrigatórias por slide:**
- Contar palavras do headline + texto de suporte: mínimo 40, máximo 80
- Slide 1 (capa): hook que para o scroll; tensão ou dado provocativo
- Slide final (CTA): substituir swipe hint por CTA específico com pergunta direta
- Nunca usar em dash (—) no texto
- Swipe hint "Arraste para continuar →" em todos exceto o último slide

### Passo 5 — Escrever a legenda
Estrutura obrigatória:

1. **Linha 1 (hook):** afirmação ou dado que funciona como hook standalone — máximo 125 caracteres (incluindo espaços). Verificar contagem antes de finalizar.
2. **Corpo (linhas 2-5):** desenvolvimento do argumento com dado específico ou exemplo concreto. Não repetir o que está nos slides — aprofundar ou dar contexto.
3. **Pergunta de encerramento:** pergunta direta ao público conectada ao tema do carrossel. Deve gerar resposta nos comentários.
4. **Comprimento total:** máximo ~2200 caracteres (limite do Instagram)

### Passo 6 — Selecionar hashtags
Escolher 8-12 hashtags com mix equilibrado:

| Tipo | Volume | Exemplos |
|------|--------|---------|
| Niche | < 500k posts | #inovacaocorporativa, #openinnovation, #innovationlatam |
| Mid-range | 500k-5M posts | #inovacao, #startups, #transformacaodigital |
| Broad | > 5M posts | #lideranca, #gestao, #tecnologia |

Usar no mínimo 3 de cada tipo. Sem hashtags banidas ou irrelevantes ao conteúdo.

---

## Output Format

```
=== ÂNGULO SELECIONADO ===
[Nome do ângulo]
Driver: [driver emocional]
Tom: Tom [N] — [nome]
Formato: [nome do formato] ([N] slides)

=== SLIDES ===

Slide 1 (Cover — ímpar, foto conceitual):
Headline: "[texto do headline]"
Texto de suporte: [texto de suporte — verificar 40-80 palavras total com headline]
Background: [descrição da foto conceitual para o Diretor de Arte]

Slide 2 ([nome — par, fundo roxo]):
Tag: [categoria em uppercase]
Headline: "[texto do headline]"
Texto de suporte: [texto de suporte — verificar 40-80 palavras total com headline]
Background: Fundo roxo #993CB1

[... continuar para todos os slides ...]

Slide [N] (CTA — [par/ímpar], [tipo]):
Headline: "[texto do headline]"
Texto de suporte: [proposta de valor + CTA]
CTA: "[ação específica + pergunta]"
Background: [descrição]

=== LEGENDA ===
[hook — verificar: máximo 125 chars na primeira linha]

[corpo — dado ou aprofundamento que não repete os slides]

[pergunta de encerramento]

=== HASHTAGS ===
[hashtags — verificar: entre 8 e 12, mix niche/mid/broad]
```

---

## Output Example

```
=== ÂNGULO SELECIONADO ===
IA NÃO É FICÇÃO CIENTÍFICA
Driver: Curiosidade + Alívio (desmistificação)
Tom: Tom 2 — Educativo e Acessível
Formato: Mito vs Realidade (7 slides)

=== SLIDES ===

Slide 1 (Cover — ímpar, foto conceitual):
Headline: "7 mitos sobre IA que estão travando sua empresa"
Texto de suporte: O Gartner confirmou: 70% das Fortune 500 já usam IA generativa. Se a sua não usa, o problema provavelmente não é a tecnologia.
Background: Executivo em sala de reunião moderna, olhando para tela de dashboard, expressão reflexiva, plano médio, fundo escuro

Slide 2 (Mito 1 — par, fundo roxo):
Tag: MITO 1
Headline: "IA só funciona em empresas de tecnologia"
Texto de suporte: Indústria, varejo, agro e saúde já automatizaram processos inteiros com IA. O Bradesco analisa 1,5 milhão de documentos por dia com IA. O setor não é o obstáculo; a decisão de começar é.
Background: Fundo roxo #993CB1

Slide 3 (Realidade 1 — ímpar, foto conceitual):
Headline: "Qualquer empresa pode começar com IA hoje"
Texto de suporte: A maioria das aplicações iniciais não exige equipe de data science. Microsoft Copilot, ChatGPT Enterprise e Google Vertex já estão prontos para operações, jurídico, RH e atendimento ao cliente.
Background: Equipe diversa colaborando ao redor de laptop, ambiente aberto e moderno, high key, plano americano

Slide 4 (Mito 2 — par, fundo roxo):
Tag: MITO 2
Headline: "Implementar IA custa milhões e leva anos"
Texto de suporte: Um POC de IA pode ser rodado em 6 a 12 semanas com orçamento entre R$ 50 mil e R$ 150 mil. Startups especializadas fazem isso com grandes empresas todos os dias. A Innovation Latam conecta ambas.
Background: Fundo roxo #993CB1

Slide 5 (Realidade 2 — ímpar, foto conceitual):
Headline: "O maior custo é não começar"
Texto de suporte: McKinsey estima que empresas líderes em IA vão capturar 80% do valor gerado pela tecnologia até 2030. Cada trimestre de espera é market share entregue de graça para os concorrentes que já saíram na frente.
Background: Gráfico de crescimento exponencial em tela grande, executivo de costas observando, contraluz, plano aberto

Slide 6 (Mito 3 — par, fundo roxo):
Tag: MITO 3
Headline: "IA vai substituir todos os funcionários"
Texto de suporte: As empresas que mais cresceram com IA não demitiram, realocaram. Goldman Sachs criou 1.500 novos cargos ligados a IA enquanto automatizava o back-office. IA aumenta capacidade humana; não substitui julgamento.
Background: Fundo roxo #993CB1

Slide 7 (CTA — ímpar, foto conceitual):
Headline: "Sua empresa está pronta para a próxima etapa?"
Texto de suporte: A Innovation Latam conecta grandes empresas com as melhores startups de IA do Brasil. Mais de 200 programas de inovação aberta já rodaram na plataforma. O próximo pode ser o seu.
CTA: "Comenta abaixo: qual o maior obstáculo de IA na sua empresa? Lemos todos."
Background: Skyline urbano com sobreposição digital, tons de roxo, plano aberto, contraluz

=== LEGENDA ===
7 em cada 10 gestores ainda acham que IA é coisa de empresa de tecnologia. O Gartner discorda.

O relatório mais recente é claro: 70% das Fortune 500 já usam IA generativa. E não é só o setor de tech. Indústria, varejo, saúde e agro estão na lista.

O problema não é a tecnologia. É a crença de que sua empresa não está pronta.

Neste carrossel, derrubamos os 3 mitos que mais travam a adoção de IA em grandes empresas brasileiras, com dados reais, exemplos concretos e o que você pode fazer na semana que vem.

Qual o maior obstáculo de IA na sua empresa? Comenta abaixo.

=== HASHTAGS ===
#inovacaocorporativa #inteligenciaartificial #openinnovation #innovationlatam #transformacaodigital #inovacao #startups #futurodotrabalho #gestaoempresarial #lideranca #ia #tecnologiaempresarial
```

---

## Quality Criteria

1. Tom de voz confirmado com o usuário antes de escrever os slides
2. Formato de carrossel explicitamente declarado antes do conteúdo
3. 6-9 slides com headline e texto de suporte distintos em cada um
4. Todos os slides com 40-80 palavras (headline + texto de suporte) — verificar contagem
5. Slide 1 com hook que para o scroll; último slide com CTA específico e pergunta direta
6. Background descrito em cada slide (foto conceitual com situação ou roxo sólido com tag)
7. Slides ímpares = foto conceitual descrita; slides pares = roxo #993CB1 declarado
8. Legenda com hook nos primeiros 125 caracteres — verificar contagem
9. 8-12 hashtags com mix equilibrado de niche, mid-range e broad
10. Nenhum em dash (—) usado no copy

---

## Veto Conditions

- **NUNCA escrever slides antes de confirmar o tom de voz** — a confirmação é parte do processo
- **NUNCA entregar slide com menos de 40 ou mais de 80 palavras** — verificar contagem em cada slide antes de finalizar
- **NUNCA abrir a legenda com apresentação ou contexto** — primeiro caractere deve ser parte do hook
- **NUNCA usar em dash (—)** — reescrever usando ponto, vírgula, dois pontos ou nova frase
- **PARAR se** angle-selection.md não existir — o usuário deve completar o checkpoint antes desta tarefa
