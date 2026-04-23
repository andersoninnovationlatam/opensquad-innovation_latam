---
task: research-brand-assets
agent: leo-logos
order: 1
input:
  - squads/agent-social-v3/output/{run_id}/v1/carousel-draft.md
  - squads/agent-social-v3/input/content.md
output:
  - squads/agent-social-v3/output/{run_id}/v1/brand-assets.md
---

## Tarefa: Pesquisar Ativos Visuais de Marcas

Ler o `carousel-draft.md` gerado por Carlos e a notícia original em `input/content.md`, identificar todas as empresas/organizações mencionadas e produzir `brand-assets.md` com referências visuais estruturadas para o Daniel Diretor.

---

## Process

### 1. Identificar empresas

- Ler `carousel-draft.md` na íntegra
- Ler `input/content.md` (notícia original) na íntegra
- Listar todas as empresas, marcas, produtos e organizações mencionadas
- Identificar qual é a **protagonista** (sujeito principal da notícia) e quais são **coadjuvantes**

### 2. Para cada empresa — Bloco Completo (Protagonista)

Pesquisar e documentar:

| Campo | Descrição |
|-------|-----------|
| **Nome oficial** | Nome completo da empresa |
| **Setor** | Tecnologia, Finanças, Saúde, etc. |
| **Grau de confiança** | Alta / Média / Baixa |
| **Paleta de cores** | Primárias e secundárias com hex codes |
| **Estilo visual de marca** | Adjetivos fotográficos concretos em inglês |
| **Tipografia** | Fonte(s) associadas à marca |
| **Elementos iconográficos** | Formas, símbolos, padrões recorrentes |
| **Feeling fotográfico** | Como a marca usa fotografia em campanhas |
| **Ambientes sugeridos (3x)** | Cenários que evocam o universo da marca |
| **Prompt element (EN)** | Fragmento pronto para inserir em prompt de imagem |

### 3. Para cada empresa — Bloco Resumido (Coadjuvantes)

Documentar apenas:
- Nome, setor, grau de confiança
- Cores principais (hex)
- Prompt element (EN) — 1 linha

### 4. Validação antes de escrever

- Se confiança for **Baixa**: descrever o que é conhecido + sugerir alternativa visual genérica do setor
- Nunca inventar hex codes específicos sem certeza — usar faixas ("dark navy blue range, ~#0B2D5E") quando incerto
- Verificar se há rebrand recente conhecido e sinalizar

### 5. Escrever brand-assets.md

Salvar em `output/{run_id}/v1/brand-assets.md` com a estrutura abaixo.

---

## Output Format

```markdown
# Brand Assets — [TÍTULO DO CARROSSEL]
**Gerado por:** Leo Logos
**Data:** {today}
**Run:** {run_id}

---

## Empresa Protagonista

### [NOME DA EMPRESA]
**Setor:** [setor]
**Confiança:** Alta | Média | Baixa

#### Identidade Visual
| Campo | Detalhes |
|-------|----------|
| Cor primária | `#XXXXXX` — [nome da cor] |
| Cor secundária | `#XXXXXX` — [nome da cor] |
| Cor de destaque | `#XXXXXX` — [nome da cor] |
| Tipografia | [fonte(s)] |
| Elementos icônicos | [formas, símbolos] |

#### Estilo Visual de Marca
[2–3 frases descrevendo como a marca se apresenta visualmente. Ex: "Clean, minimalist aesthetic dominated by white space and bold typography. Photography tends to be high-key, bright, featuring diverse human faces in professional but approachable settings."]

#### Feeling Fotográfico
[Como a marca usa imagens em campanhas — ex: "Bright, optimistic environments. Candid human interactions. Natural light preferred. Architecture often features open spaces, glass, and modern design."]

#### Ambientes Sugeridos para Daniel
1. **[Ambiente 1]:** [Descrição do cenário fotográfico que evoca a marca]
2. **[Ambiente 2]:** [Descrição do cenário fotográfico que evoca a marca]
3. **[Ambiente 3]:** [Descrição do cenário fotográfico que evoca a marca]

#### Prompt Element (EN)
> [Fragmento de 1–2 linhas pronto para inserir em qualquer prompt de geração de imagem — captura o essence visual da marca sem reproduzir logo]
>
> Ex: "corporate environment with clean white surfaces and electric blue accent lighting, professional DSLR photography, modern open-plan office aesthetic"

---

## Empresas Mencionadas

### [NOME DA EMPRESA 2]
**Setor:** [setor] | **Confiança:** [nível]
**Cores:** `#XXXXXX` (primária), `#XXXXXX` (secundária)
**Prompt element (EN):** [1 linha]

### [NOME DA EMPRESA 3]
**Setor:** [setor] | **Confiança:** [nível]
**Cores:** `#XXXXXX` (primária)
**Prompt element (EN):** [1 linha]

---

## Notas para Daniel Diretor

- **Empresa protagonista nos slides:** [recomendação de quais slides priorizar brand integration]
- **Combinação com paleta IL:** [como as cores da empresa combinam ou contrastam com roxo/teal da Innovation Latam]
- **Alerta de rebrand:** [se houver mudança recente de identidade visual conhecida]
- **Alternativa se confiança baixa:** [sugestão de estilo genérico do setor para usar no lugar]
```

---

## Quality Criteria

- `brand-assets.md` presente após execução
- Empresa protagonista identificada e com bloco completo
- Todas as empresas do carousel-draft.md e content.md documentadas
- Hex codes presentes (ou faixas indicadas com nota de incerteza)
- Prompt elements em inglês, prontos para uso direto
- Seção "Notas para Daniel Diretor" preenchida

## Veto Conditions

1. `brand-assets.md` ausente após execução
2. Empresa protagonista não identificada
3. Prompt elements ausentes ou em português (devem ser em inglês)
4. Hex codes inventados sem sinalização de incerteza
