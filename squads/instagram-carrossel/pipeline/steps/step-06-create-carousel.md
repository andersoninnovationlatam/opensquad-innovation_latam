---
step: 6
name: create-carousel
type: agent
agent: carlos-carrossel
execution: inline
format: instagram-carousel
inputFile: squads/instagram-carrossel/output/angle-selection.md
outputFile: squads/instagram-carrossel/output/carousel-content.md
---

## Contexto

**Agente:** Carlos Carrossel — Copywriter de Instagram
**Tarefa:** create-carousel (Tarefa 2 de 2)
**Execução:** Inline

O ângulo foi selecionado. Carlos Carrossel agora cria o conteúdo completo do carrossel: confirmação do tom de voz, formato, slides com headline e texto de suporte, legenda e hashtags.

Se este é um run de correção (após REJEITAR de Vera Veredito), ler `squads/instagram-carrossel/output/review.md` e aplicar todas as mudanças obrigatórias listadas.

---

## Context Loading

Carlos Carrossel deve ler antes de criar:

1. `squads/instagram-carrossel/output/angle-selection.md` — ângulo aprovado com hook e driver
2. `squads/instagram-carrossel/pipeline/data/visual-identity.md` — regras de slides ímpares/pares e hierarquia visual
3. `squads/instagram-carrossel/pipeline/data/tone-of-voice.md` — 6 tons com descrições e exemplos
4. `squads/instagram-carrossel/pipeline/data/anti-patterns.md` — proibições explícitas de copy
5. `squads/instagram-carrossel/output/review.md` (se existir) — feedback de rodada anterior

---

## Instructions

### Process

1. **Confirmar tom de voz** com o usuário:
   - Mostrar o tom recomendado para o ângulo selecionado
   - Listar alternativas compatíveis
   - Aguardar confirmação antes de escrever

2. **Selecionar formato de carrossel** e declarar:
   - Editorial / Listicle / Tutorial / Mito vs Realidade / Storytelling / Problema→Solução
   - Número de slides (6-9)

3. **Escrever os slides** seguindo as regras:
   - Slides ímpares (1, 3, 5...): fundo escuro com foto conceitual descrita
   - Slides pares (2, 4, 6...): fundo roxo #993CB1, com tag de categoria
   - Cada slide: Headline + Texto de suporte = 40-80 palavras (verificar contagem)
   - Slide 1: hook que para o scroll
   - Slide final: CTA específico com pergunta direta; sem swipe hint
   - Todos os outros slides: incluir swipe hint "Arraste para continuar →"

4. **Escrever a legenda**:
   - Linha 1: hook nos primeiros 125 caracteres (verificar contagem)
   - Corpo: dado ou argumento que aprofunda — não repetir os slides
   - Encerramento: pergunta direta conectada ao tema

5. **Selecionar 8-12 hashtags** com mix equilibrado:
   - Mínimo 3 niche (< 500k posts)
   - Mínimo 3 mid-range (500k-5M posts)
   - Mínimo 2 broad (> 5M posts)

6. **Proibições absolutas:**
   - Nunca usar em dash (—) no copy
   - Nunca abrir legenda com "Neste post..." ou similar
   - Nunca entregar slide com < 40 ou > 80 palavras

### Output Format

```
=== ÂNGULO SELECIONADO ===
[nome do ângulo]
Driver: [driver emocional]
Tom: Tom [N] — [nome]
Formato: [nome do formato] ([N] slides)

=== SLIDES ===

Slide 1 (Cover — ímpar, foto conceitual):
Headline: "[texto]"
Texto de suporte: [texto — total headline+suporte: XX palavras]
Background: [descrição da foto conceitual para o Diretor de Arte]

Slide 2 ([nome — par, fundo roxo]):
Tag: [CATEGORIA em uppercase]
Headline: "[texto]"
Texto de suporte: [texto — total: XX palavras]
Background: Fundo roxo #993CB1

[... continuar para todos os slides ...]

Slide [N] (CTA):
Headline: "[texto]"
Texto de suporte: [proposta de valor]
CTA: "[ação específica + pergunta direta]"
Background: [tipo]

=== LEGENDA ===
[hook — primeiros 125 chars: verificado]

[corpo]

[pergunta de encerramento]

=== HASHTAGS ===
[lista de 8-12 hashtags]
```

### Output Example

```
=== ÂNGULO SELECIONADO ===
IA NÃO É FICÇÃO CIENTÍFICA
Driver: Curiosidade + Alívio (desmistificação)
Tom: Tom 2 — Educativo e Acessível
Formato: Mito vs Realidade (7 slides)

=== SLIDES ===

Slide 1 (Cover — ímpar, foto conceitual):
Headline: "7 mitos sobre IA que estão travando sua empresa"
Texto de suporte: O Gartner confirmou: 70% das Fortune 500 já usam IA generativa. Se a sua não usa, o problema provavelmente não é a tecnologia. [total: 44 palavras]
Background: Executivo em sala de reunião moderna, olhando para tela de dashboard, expressão reflexiva, fundo escuro

Slide 2 (Mito 1 — par, fundo roxo):
Tag: MITO 1
Headline: "IA só funciona em empresas de tecnologia"
Texto de suporte: Indústria, varejo, agro e saúde já automatizaram processos inteiros com IA. O Bradesco analisa 1,5 milhão de documentos por dia com IA. O setor não é o obstáculo; a decisão de começar é. [total: 47 palavras]
Background: Fundo roxo #993CB1

[... slides 3-6 ...]

Slide 7 (CTA — ímpar, foto conceitual):
Headline: "Sua empresa está pronta para a próxima etapa?"
Texto de suporte: A Innovation Latam conecta grandes empresas com as melhores startups de IA do Brasil. Mais de 200 programas de inovação aberta já rodaram na plataforma. O próximo pode ser o seu. [total: 42 palavras]
CTA: "Comenta abaixo: qual o maior obstáculo de IA na sua empresa? Lemos todos."
Background: Skyline urbano com sobreposição digital em tons de roxo

=== LEGENDA ===
7 em cada 10 gestores ainda acham que IA é coisa de empresa de tecnologia. O Gartner discorda.

O relatório mais recente é claro: 70% das Fortune 500 já usam IA generativa. Indústria, varejo, saúde e agro estão na lista. O problema não é a tecnologia. É a crença de que sua empresa não está pronta.

Qual o maior obstáculo de IA na sua empresa? Comenta abaixo.

=== HASHTAGS ===
#inovacaocorporativa #inteligenciaartificial #openinnovation #innovationlatam #transformacaodigital #inovacao #startups #futurodotrabalho #gestaoempresarial #lideranca #ia #tecnologiaempresarial
```

### Veto Conditions

- **NUNCA escrever antes de confirmar o tom** — confirmação é obrigatória
- **NUNCA entregar slide com < 40 ou > 80 palavras** — verificar contagem em cada slide
- **NUNCA abrir legenda com contexto ou apresentação** — hook nos primeiros 125 chars
- **NUNCA usar em dash (—)** em nenhuma parte do copy
- **Se rodada de correção:** aplicar TODAS as mudanças obrigatórias do review.md antes de qualquer nova escrita

### Quality Criteria

- Tom confirmado antes de iniciar os slides
- Formato declarado com número de slides
- 6-9 slides, todos dentro de 40-80 palavras (headline + suporte)
- Background descrito em cada slide
- Legenda com hook nos primeiros 125 chars verificado
- 8-12 hashtags com mix equilibrado
- Nenhum em dash no copy
