# Manual OpenSquad
> Guia completo de funcionamento, manutenção e customização da plataforma

---

## Sumário

1. [O que é o OpenSquad](#1-o-que-é-o-opensquad)
2. [Estrutura de diretórios](#2-estrutura-de-diretórios)
3. [Como os prompts se relacionam](#3-como-os-prompts-se-relacionam)
4. [Ciclo de vida de um squad](#4-ciclo-de-vida-de-um-squad)
5. [Como modificar um prompt para uma tarefa específica](#5-como-modificar-um-prompt-para-uma-tarefa-específica)
6. [Como funciona a integração com o OpenRouter](#6-como-funciona-a-integração-com-o-openrouter)
7. [Como especificar modelos para tarefas específicas](#7-como-especificar-modelos-para-tarefas-específicas)
8. [Manutenção de agentes e memória](#8-manutenção-de-agentes-e-memória)
9. [Referência rápida de arquivos-chave](#9-referência-rápida-de-arquivos-chave)

---

## 1. O que é o OpenSquad

OpenSquad é um framework de orquestração de múltiplos agentes de IA, rodando diretamente dentro do Cursor (ou Claude Code). Em vez de um único prompt gigante, você define **squads** — equipes de agentes especializados que executam em sequência, passando contexto entre si através de arquivos.

**Fluxo resumido:**

```
Você           → /opensquad run <nome>
Skill (SKILL.md) → Carrega pipeline runner
Pipeline Runner → Executa passo a passo
Cada passo      → Ativa um agente com persona própria
Agente          → Produz um arquivo de saída
Próximo agente  → Lê o arquivo e continua
```

**Princípios de design:**
- Cada agente tem **uma** responsabilidade clara.
- A comunicação entre agentes é feita via **arquivos** (nunca via memória de contexto).
- Checkpoints pausam o pipeline para sua aprovação.
- Tudo que os agentes produzem vai para `squads/{nome}/output/{run_id}/`.

---

## 2. Estrutura de diretórios

```
opensquad-innovation_latam/
│
├── _opensquad/                    ← Core do framework (não editar manualmente)
│   ├── _memory/                   ← Memória persistente global
│   │   ├── company.md             ← Perfil da empresa (carregado em toda execução)
│   │   ├── preferences.md         ← Idioma e preferências do usuário
│   │   ├── guia_diretor_arte.md   ← Guia visual da marca
│   │   └── doc_posicao_logo_logo_conta.md
│   ├── core/
│   │   ├── architect.agent.yaml   ← Agente Arquiteto (cria/edita squads)
│   │   ├── runner.pipeline.md     ← Motor de execução do pipeline
│   │   ├── skills.engine.md       ← Motor de gerenciamento de skills
│   │   ├── prompts/               ← Prompts das 4 fases de criação de squad
│   │   │   ├── discovery.prompt.md
│   │   │   ├── design.prompt.md
│   │   │   ├── build.prompt.md
│   │   │   ├── sherlock-shared.md
│   │   │   ├── sherlock-instagram.md
│   │   │   ├── sherlock-youtube.md
│   │   │   ├── sherlock-twitter.md
│   │   │   └── sherlock-linkedin.md
│   │   └── best-practices/        ← Biblioteca de boas práticas por formato
│   │       ├── _catalog.yaml      ← Índice (o que existe e quando usar)
│   │       ├── copywriting.md
│   │       ├── instagram-feed.md
│   │       ├── image-design.md
│   │       └── ... (20+ arquivos)
│   └── config/
│       └── playwright.config.json ← Configuração do browser automation
│
├── .claude/skills/opensquad/
│   └── SKILL.md                   ← Ponto de entrada (intercepta /opensquad)
│
├── skills/                        ← Skills instaladas (capacidades extras)
│   ├── image-creator/             ← Renderiza HTML em PNG via Playwright
│   ├── image-ai-generator/        ← Gera imagens via OpenRouter API
│   └── instagram-publisher/       ← Publica no Instagram
│
└── squads/                        ← Seus squads criados
    └── tech-instagram-carousel/
        ├── squad.yaml             ← Manifesto do squad
        ├── squad-party.csv        ← Roster de agentes
        ├── pipeline/
        │   ├── pipeline.yaml      ← Ordem dos passos
        │   ├── data/              ← Contexto injetado nos agentes
        │   └── steps/             ← Instruções de cada passo (step-01.md, ...)
        ├── agents/                ← Definição de cada agente (.agent.md)
        ├── _build/                ← Artefatos de criação do squad
        ├── _memory/               ← Memória específica do squad
        │   ├── memories.md        ← Preferências aprendidas
        │   └── runs.md            ← Histórico de execuções
        └── output/                ← Saídas geradas por run_id
            └── 2026-04-01-093432/
```

---

## 3. Como os prompts se relacionam

O OpenSquad tem **três camadas de prompts**, que são compostas em tempo de execução:

### Camada 1 — Prompts de criação de squad (usados só pelo Arquiteto)

Ficam em `_opensquad/core/prompts/`. São usados **apenas quando você cria ou edita um squad**. Não influenciam a execução diária.

| Arquivo | Fase | O que faz |
|---------|------|-----------|
| `discovery.prompt.md` | Fase 1 | Faz perguntas para entender o objetivo do squad |
| `design.prompt.md` | Fase 3 | Desenha os agentes, pipeline e artefatos |
| `build.prompt.md` | Fase 4 | Gera todos os arquivos do squad |
| `sherlock-*.md` | Fase 2 (opcional) | Analisa perfis de referência (Instagram, YouTube etc.) |

### Camada 2 — Definição dos agentes (usados em execução)

Cada agente tem um arquivo `.agent.md` em `squads/{nome}/agents/`. Este arquivo é composto de:
- **Frontmatter YAML**: metadados (id, nome, skills que usa, modo de execução)
- **Persona**: role, identity, communication style, principles
- **Operational Framework**: processo passo a passo que o agente segue
- **Voice Guidance**: vocabulário obrigatório e proibido
- **Output Examples**: exemplos de saída de alta qualidade
- **Anti-Patterns**: erros que o agente nunca deve cometer
- **Quality Criteria**: checklist de aprovação

### Camada 3 — Instruções de passo (usados em execução)

Cada passo do pipeline tem um arquivo em `squads/{nome}/pipeline/steps/`. Este arquivo é composto de:
- **Frontmatter YAML**: metadados de execução (`execution`, `agent`, `model_tier`, `inputFile`, `outputFile`)
- **Context Loading**: quais arquivos o agente deve ler
- **Instructions**: o que o agente deve fazer neste passo específico
- **Veto Conditions**: critérios que disparam rejeição automática

### Como o runner compõe o contexto de um agente

Antes de executar qualquer passo, o runner monta o contexto do agente nesta ordem:

```
1. Persona do agente (.agent.md)
      ↓
2. Best practices do formato (se o step tem campo "format:")
   → Lê _opensquad/core/best-practices/{format}.md
      ↓
3. Instruções da skill (se o agente declara skills no frontmatter)
   → Lê skills/{skill}/SKILL.md
      ↓
4. Instruções específicas do passo (steps/step-XX.md)
```

**Diagrama de composição:**

```
squad-party.csv          ← quem são os agentes
      +
agents/{agente}.agent.md ← como o agente pensa e age
      +
best-practices/{formato}.md ← conhecimento da plataforma/formato
      +
skills/{skill}/SKILL.md  ← capacidades técnicas
      +
steps/step-XX.md         ← o que fazer neste passo específico
      +
pipeline/data/*.md       ← contexto do squad (identidade visual, tom de voz, etc.)
      ↓
Contexto final enviado ao modelo de IA
```

### Como os arquivos de dados do pipeline são usados

Os arquivos em `squads/{nome}/pipeline/data/` são **injetados via squad.yaml** e ficam disponíveis para todos os agentes lerem durante o pipeline:

| Arquivo | Conteúdo |
|---------|----------|
| `research-brief.md` | Pesquisa de mercado e benchmarks do domínio |
| `domain-framework.md` | Frameworks e metodologias relevantes |
| `quality-criteria.md` | Critérios de qualidade do conteúdo |
| `output-examples.md` | Exemplos de saída de referência |
| `anti-patterns.md` | Erros comuns a evitar |
| `tone-of-voice.md` | Diretrizes de tom e voz da marca |
| `visual-identity.md` | Design system (cores, tipografia, layout) |
| `template-reference.html` | Template HTML de referência |

---

## 4. Ciclo de vida de um squad

### 4.1 Criação (feita uma vez)

```
/opensquad create "descrição do que precisa"
```

```
Fase 1 — Discovery    → _build/discovery.yaml
Fase 2 — Sherlock     → _investigations/*/raw-content.md (opcional)
Fase 3 — Design       → _build/design.yaml
Fase 4 — Build        → squad.yaml + agents/*.agent.md + pipeline/
```

### 4.2 Execução (feita repetidamente)

```
/opensquad run tech-instagram-carousel
```

```
Runner inicializa  → Carrega squad.yaml, squad-party.csv, company.md, memories.md
Cria run folder   → output/2026-04-01-143022/
Executa passos    → step-01 → checkpoint → step-02 → step-03 → ...
Checkpoints       → Pausa para sua aprovação
Finaliza           → Salva output, atualiza memories.md e runs.md
```

### 4.3 Estrutura de saída por execução

```
output/
└── 2026-04-01-093432/          ← run_id (timestamp)
    ├── v1/                      ← versão do output (evita sobrescrever)
    │   ├── social-handoff.md
    │   ├── angles-brief.yaml
    │   └── carousel-draft.md
    └── design/
        └── post-01-medo/
            └── slides/
                ├── v1/
                │   ├── slide-01.html
                │   └── slide-01.png
                └── v2/          ← se o passo foi reexecutado
```

---

## 5. Como modificar um prompt para uma tarefa específica

Existem **4 pontos de intervenção** dependendo do que você quer mudar:

### 5.1 Mudar como um agente se comporta

**Arquivo a editar:** `squads/{nome}/agents/{agente}.agent.md`

**Quando usar:** Você quer que o Copywriter use mais dados, que a Diana aplique outro design system, que o revisor seja mais ou menos rigoroso.

**Exemplo — Fazer o Copywriter ser mais direto e menos criativo:**

```markdown
### Communication Style

<!-- ANTES -->
Escreve com criatividade e usa metáforas para engajar.

<!-- DEPOIS -->
Escreve de forma direta, factual e objetiva. Sem metáforas.
Cada afirmação deve ter um dado ou fonte como suporte.
```

**Exemplo — Adicionar uma restrição ao agente:**

No bloco `## Principles`, adicione:
```markdown
7. **Sem emojis em headlines:** Headlines de carrossel não usam emojis.
   Emojis são permitidos apenas no caption da legenda.
```

### 5.2 Mudar o que um passo específico faz

**Arquivo a editar:** `squads/{nome}/pipeline/steps/step-XX.md`

**Quando usar:** O agente está correto, mas este passo específico precisa de instruções diferentes.

**Exemplo — Fazer o passo de design gerar só 5 slides em vez de 9:**

```markdown
## Instructions

<!-- Adicione antes das instruções existentes -->
> RESTRIÇÃO DE FORMATO: Este carrossel deve ter exatamente 5 slides:
> slide 1 (cover), slides 2-4 (conteúdo), slide 5 (CTA).
```

**Exemplo — Adicionar uma Veto Condition nova:**

```markdown
## Veto Conditions

Reject and redo if ANY of these are true:

1. [condição existente...]
2. [condição existente...]
3. **Headline com mais de 8 palavras:** Headlines longas não funcionam
   em mobile. Máximo 8 palavras por headline, sem exceção.
```

### 5.3 Mudar as boas práticas injetadas em todos os agentes de um formato

**Arquivo a editar:** `_opensquad/core/best-practices/{formato}.md`

**Quando usar:** Você aprendeu algo novo sobre o formato (ex: Instagram mudou o algoritmo) e quer que **todos** os agentes que produzem esse formato absorvam o conhecimento.

**Exemplo — Atualizar as regras de Instagram feed:**

Edite `_opensquad/core/best-practices/instagram-feed.md` e adicione:
```markdown
## Algoritmo 2026

- Carrosséis com 10 slides têm distribuição 40% maior que carrosséis de 5 slides
- O slide 1 é o único que aparece no feed inicial — ele deve funcionar sozinho
```

### 5.4 Mudar os dados de contexto do squad

**Arquivos a editar:** `squads/{nome}/pipeline/data/*.md`

**Quando usar:** Você quer mudar o tom de voz, o design system, os critérios de qualidade ou os exemplos de referência.

**Exemplo — Mudar o tom de voz:**

Edite `pipeline/data/tone-of-voice.md` diretamente. As mudanças entram em vigor na próxima execução.

**Exemplo — Atualizar o design system:**

Edite `pipeline/data/visual-identity.md` com as novas cores, fontes ou layouts.

---

## 6. Como funciona a integração com o OpenRouter

O OpenRouter é usado **exclusivamente pela skill `image-ai-generator`** para geração de imagens com IA. Não é usado para os modelos de linguagem (LLMs) que executam os agentes — esses são gerenciados pelo Cursor/Claude Code diretamente.

### Configuração da API Key

A skill espera a variável de ambiente `OPENROUTER_API_KEY`. Configure no seu ambiente:

```bash
# No .env do projeto ou no seu shell profile
export OPENROUTER_API_KEY="sk-or-v1-..."
```

### Modelos disponíveis via OpenRouter

| Modo | Modelo | Quando usar |
|------|--------|-------------|
| `test` | `google/gemini-2.5-flash-image` | Iteração, validação de layout, testes |
| `production` | `google/gemini-3.1-flash-image-preview` | Imagens finais para publicação |

### Como acionar a geração de imagem em um passo

A skill é chamada via linha de comando dentro das instruções do agente:

```bash
# Geração simples
python3 skills/image-ai-generator/scripts/generate.py \
  --prompt "Descrição detalhada da imagem" \
  --output "squads/{squad}/output/{run_id}/assets/imagem.jpg" \
  --mode test

# Com imagem de referência (logo, mascote)
python3 skills/image-ai-generator/scripts/generate.py \
  --prompt "Banner com logo da empresa em destaque" \
  --output "squads/{squad}/output/{run_id}/assets/banner.jpg" \
  --reference "squads/{squad}/assets/logo.png" \
  --mode production
```

### Estratégia de custo

- **Sempre use `--mode test` primeiro.** Aprove o resultado, depois gere em `--mode production`.
- Nunca gere mais de 1 imagem de teste por conceito.
- Um carrossel com 8 imagens em production pode custar significativamente. Valide tudo em test antes.

### Adicionar suporte a geração de imagem em um squad existente

1. Adicione `image-ai-generator` na lista `skills:` do `squad.yaml`:
   ```yaml
   skills:
     - image-ai-generator
   ```

2. No agente que vai gerar imagens, adicione `image-ai-generator` no frontmatter:
   ```yaml
   skills: ["image-ai-generator"]
   ```

3. As instruções da skill serão injetadas automaticamente no contexto do agente.

---

## 7. Como especificar modelos para tarefas específicas

O OpenSquad não usa nomes de modelos diretamente. Em vez disso, usa um sistema de **tiers** que abstrai a escolha:

| Tier | Velocidade | Custo | Qualidade | Quando usar |
|------|-----------|-------|-----------|-------------|
| `fast` | Alta | Baixo | Boa | Tarefas simples, análises, extração de dados, Sherlock |
| `powerful` | Normal | Normal | Alta | Criação de conteúdo, design, revisão crítica |

O Cursor/Claude Code mapeia cada tier para o melhor modelo disponível no seu plano.

### Onde configurar o tier de um passo

No frontmatter de cada arquivo de passo (`pipeline/steps/step-XX.md`):

```yaml
---
execution: subagent        ← "subagent" ou "inline"
agent: copywriter
model_tier: powerful       ← "fast" ou "powerful"
inputFile: squads/tech-instagram-carousel/output/social-handoff.md
outputFile: squads/tech-instagram-carousel/output/carousel-draft.md
---
```

> **Importante:** `model_tier` só funciona quando `execution: subagent`. Para passos `execution: inline`, o modelo é o mesmo da conversa principal.

### Regras práticas para escolher o tier

**Use `fast` para:**
- Passos de análise e classificação (ex: "leia a notícia e extraia os pontos-chave")
- Passos de pesquisa e coleta de dados (Sherlock)
- Passos que processam inputs estruturados com pouca criatividade necessária

**Use `powerful` para:**
- Criação de copy (copywriter)
- Design e geração de HTML (designer)
- Revisão com critérios complexos (revisor)
- Qualquer passo onde a qualidade da saída é crítica

### Exemplo: configurar tiers no pipeline do carrossel

```
step-01: checkpoint          (sem tier — é interação humana)
step-02: inline              (sem tier — usa modelo atual)
step-03: subagent, fast      (gerar ângulos — análise estruturada)
step-04: checkpoint          (sem tier)
step-05: subagent, powerful  (criar copy — alta criatividade)
step-06: checkpoint          (sem tier)
step-07: inline              (design — usa modelo atual + Playwright)
step-08: subagent, powerful  (revisão crítica)
step-09: checkpoint          (sem tier)
```

### Verificar o tier atual de um passo

Leia o frontmatter do arquivo de passo:

```bash
head -10 squads/tech-instagram-carousel/pipeline/steps/step-05-copywriter-create-carousel.md
```

Se `model_tier:` não estiver declarado, o runner assume `powerful` por padrão.

---

## 8. Manutenção de agentes e memória

### 8.1 Memória persistente global (`_opensquad/_memory/`)

Esses arquivos são carregados em **toda** execução de qualquer squad.

| Arquivo | Quando editar |
|---------|---------------|
| `company.md` | Quando a empresa mudar de posicionamento, produto ou público |
| `preferences.md` | Para mudar idioma padrão ou outras preferências globais |
| `guia_diretor_arte.md` | Para atualizar o guia visual da marca |

**Para atualizar via comando:**
```
/opensquad edit-company
```

### 8.2 Memória específica do squad (`squads/{nome}/_memory/`)

| Arquivo | Conteúdo | Quem escreve |
|---------|----------|-------------|
| `memories.md` | Preferências aprendidas de execuções anteriores | Runner (automático) + você (manual) |
| `runs.md` | Histórico de execuções | Runner (automático) |

**Estrutura do `memories.md`:**

```markdown
# Squad Memory: Tech Instagram Carousel

## Estilo de Escrita
- [preferências sobre tom, vocabulário, estrutura de texto]

## Design Visual
- [preferências sobre cores, layout, tipografia]

## Estrutura de Conteúdo
- [preferências sobre formato, número de slides, etc.]

## Proibições Explícitas
- [coisas que o usuário explicitamente rejeitou]

## Técnico (específico do squad)
- [workarounds, bugs conhecidos, comportamentos específicos]
```

**Para adicionar uma preferência manualmente**, edite `memories.md` e adicione na seção correta. O runner vai absorver na próxima execução.

**Para resetar a memória** (começa do zero):

```bash
# Limpa as preferências mas mantém o histórico
echo "# Squad Memory: {nome}\n\n## Estilo de Escrita\n\n## Design Visual\n\n## Estrutura de Conteúdo\n\n## Proibições Explícitas\n\n## Técnico (específico do squad)" > squads/{nome}/_memory/memories.md
```

### 8.3 Atualizar um agente sem recriar o squad

Edite diretamente o arquivo `.agent.md` do agente:

```
squads/{nome}/agents/{agente}.agent.md
```

Mudanças entram em vigor na próxima execução. Não é necessário recriar o squad.

**O que pode ser editado livremente:**
- Persona (role, identity, communication style)
- Principles
- Operational Framework (processo passo a passo)
- Voice Guidance (vocabulário permitido/proibido)
- Output Examples
- Anti-Patterns
- Quality Criteria

**O que não deve ser editado sem cuidado:**
- `id:` no frontmatter (referenciado em squad-party.csv)
- `skills:` no frontmatter (deve corresponder a skills instaladas)
- `execution:` no frontmatter (altera como o runner dispara o agente)

### 8.4 Adicionar um novo agente ao squad

1. Crie o arquivo de definição em `squads/{nome}/agents/novo-agente.agent.md`
2. Adicione uma linha em `squads/{nome}/squad-party.csv`
3. Crie os arquivos de passo em `squads/{nome}/pipeline/steps/`
4. Adicione os passos ao `squads/{nome}/pipeline/pipeline.yaml`

### 8.5 Manutenção das best-practices

Os arquivos em `_opensquad/core/best-practices/` são a **base de conhecimento** do sistema. Atualize-os quando:

- Você aprender algo novo sobre um formato/plataforma
- Uma plataforma mudar suas especificações técnicas
- Um agente cometer o mesmo erro repetidamente (adicione como anti-pattern)

Para adicionar uma nova categoria de best-practice:

1. Crie o arquivo `.md` em `_opensquad/core/best-practices/`
2. Adicione a entrada no `_catalog.yaml` com `id`, `name`, `whenToUse` e `file`
3. O Arquiteto vai referenciar automaticamente na próxima criação de squad relevante

---

## 9. Referência rápida de arquivos-chave

### Arquivos do framework (core — modificar com cuidado)

| Arquivo | Modifique quando... |
|---------|---------------------|
| `_opensquad/core/runner.pipeline.md` | Quiser mudar regras de execução globais |
| `_opensquad/core/architect.agent.yaml` | Quiser mudar o comportamento de criação de squads |
| `_opensquad/core/prompts/design.prompt.md` | Quiser mudar como squads são projetados |
| `_opensquad/core/prompts/build.prompt.md` | Quiser mudar quais arquivos são gerados na criação |
| `_opensquad/core/best-practices/_catalog.yaml` | Quiser adicionar/remover categorias de best-practices |

### Arquivos do squad (modificar livremente)

| Arquivo | Modifique quando... |
|---------|---------------------|
| `squads/{nome}/squad.yaml` | Quiser adicionar skills ou mudar o entry point |
| `squads/{nome}/pipeline/pipeline.yaml` | Quiser reordenar, adicionar ou remover passos |
| `squads/{nome}/pipeline/steps/step-XX.md` | Quiser mudar o que um passo específico faz |
| `squads/{nome}/agents/{agente}.agent.md` | Quiser mudar a persona ou comportamento de um agente |
| `squads/{nome}/pipeline/data/visual-identity.md` | Quiser mudar o design system |
| `squads/{nome}/pipeline/data/tone-of-voice.md` | Quiser mudar o tom de voz |
| `squads/{nome}/_memory/memories.md` | Quiser adicionar/remover preferências aprendidas |

### Comandos rápidos

| Comando | O que faz |
|---------|-----------|
| `/opensquad` | Abre o menu principal |
| `/opensquad create "descrição"` | Cria um novo squad |
| `/opensquad run {nome}` | Executa um squad |
| `/opensquad edit {nome}` | Edita um squad existente |
| `/opensquad list` | Lista todos os squads |
| `/opensquad edit-company` | Atualiza o perfil da empresa |
| `/opensquad skills` | Gerencia skills instaladas |
| `/opensquad help` | Exibe a ajuda completa |

---

*Versão do framework: 0.1.0 — Atualizado em 2026-04-01*
