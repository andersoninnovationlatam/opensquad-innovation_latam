---
step: 3
name: news-selection
type: checkpoint
inputFile: squads/instagram-carrossel/output/news-brief.md
outputFile: squads/instagram-carrossel/output/news-selection.md
---

## Contexto

Rodrigo Radar concluiu a pesquisa. Abaixo estão as pautas encontradas e ranqueadas para o tema que você definiu.

**Próximo passo:** Selecione a pauta que deseja transformar em carrossel. Carlos Carrossel usará sua escolha para gerar 5 ângulos criativos distintos.

---

## Instruções

### Context Loading
Ler `squads/instagram-carrossel/output/news-brief.md` e apresentar as pautas ao usuário.

### Process

1. **Apresentar o brief completo** do Rodrigo Radar, incluindo:
   - Tema pesquisado e janela temporal
   - Lista numerada de 3-5 pautas com: título, fonte, data, confiança e resumo
   - Pauta recomendada (#1) destacada com justificativa
   - Recomendação editorial final

2. **Solicitar seleção** do usuário com as seguintes opções:
   - Número da pauta (1, 2, 3, etc.)
   - "Pesquisar mais" — para que Rodrigo execute nova busca com critérios diferentes
   - "Propor pauta" — para que o usuário informe uma pauta específica não encontrada

3. **Confirmar a seleção** antes de avançar

4. **Gravar em news-selection.md** com a pauta selecionada completa

### Output Format

Apresentar ao usuário:
```
## Pautas Encontradas — [tema pesquisado]

**[#1 — RECOMENDADA]** "[Título]"
Fonte: [Nome] | Data: [data] | Confiança: [nível]
Resumo: [1-2 linhas]
Por que recomendar: [justificativa]

**[#2]** "[Título]"
Fonte: [Nome] | Data: [data] | Confiança: [nível]
Resumo: [1-2 linhas]

[... demais pautas ...]

---
Qual pauta você escolhe? (número, "Pesquisar mais" ou "Propor pauta"):
```

Após seleção, gravar em `squads/instagram-carrossel/output/news-selection.md`:
```
PAUTA SELECIONADA
Título: [título completo]
Fonte: [nome da fonte]
URL: [URL completa]
Data: [data de publicação]
Confiança: [nível]
Resumo: [resumo completo]

Selecionado em: [YYYY-MM-DD]
```

### Output Example

```
## Pautas Encontradas — IA generativa em grandes empresas brasileiras

**[#1 — RECOMENDADA]** "Gartner: 70% das empresas Fortune 500 usarão IA generativa até 2026"
Fonte: Gartner | Data: 2026-04-03 | Confiança: ALTA
Resumo: Relatório primário confirma aceleração de adoção de IA nas grandes corporações globais, com impacto em operações, RH e estratégia.
Por que recomendar: Dado de máxima credibilidade com número impactante que ancora um carrossel Data-Driven ou Mito vs Realidade sobre IA corporativa.

**[#2]** "Startups de IA levantam US$ 2,3B no Brasil em Q1 2026"
Fonte: Distrito | Data: 2026-04-01 | Confiança: ALTA
Resumo: Crescimento de 180% vs Q1 2025; soluções B2B em finanças e saúde lideram.

**[#3]** "Banco Itaú lança programa de open innovation focado em IA aplicada ao crédito"
Fonte: Valor Econômico | Data: 2026-04-02 | Confiança: ALTA
Resumo: Programa conecta startups de IA com times internos de crédito e cobrança.

---
Qual pauta você escolhe? (1, 2, 3, "Pesquisar mais" ou "Propor pauta"):
```

### Veto Conditions

- **PARAR se** news-brief.md não existir ou estiver vazio — solicitar que o Passo 2 seja executado
- **NÃO avançar** sem confirmação explícita do usuário — aguardar resposta antes de salvar news-selection.md
- **NÃO assumir** que o usuário escolheu a pauta recomendada — sempre aguardar input

### Quality Criteria

- news-brief.md apresentado integralmente, não resumido
- Todas as pautas mostradas com todos os campos (não apenas título)
- Pauta recomendada claramente identificada
- news-selection.md gravado com a pauta completa após confirmação do usuário
