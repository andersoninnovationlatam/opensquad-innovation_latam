---
execution: subagent
agent: rafael-rastreio
model_tier: powerful
inputFile: squads/agent-social-media-innovation-latam/input/content.md
outputFile: squads/agent-social-media-innovation-latam/output/research.md
---

## Context Loading

Antes de executar, carregar:
- `squads/agent-social-media-innovation-latam/pipeline/data/research-brief.md` — estrutura e regras do brief de pesquisa
- `squads/agent-social-media-innovation-latam/pipeline/data/domain-framework.md` — contexto do domínio e da marca
- `squads/agent-social-media-innovation-latam/pipeline/data/anti-patterns.md` — o que nunca fazer na pesquisa
- `_opensquad/_memory/company.md` — contexto da Innovation Latam

## Instructions

### Process

1. **Ler o arquivo de input completo** em `squads/agent-social-media-innovation-latam/input/content.md`. Identificar: tema central, dados já presentes (números, percentuais, fontes, empresas), e possíveis lacunas de informação.

2. **Identificar o dado-âncora candidato.** Qual é o número mais surpreendente ou contraintuitivo já presente no input? Marcar como candidato. O enriquecimento pode revelar um dado ainda mais forte.

3. **Executar buscas de enriquecimento.** Usar `web_search` com queries direcionadas:
   - `"[tema] estatísticas 2024 2025 relatório"`
   - `"[tema] Brasil dados IBGE FGV Abstartups"`
   - `"[tema] Gartner McKinsey WEF report"`
   - `"[tema] inovação corporativa dados recentes"`
   Usar `web_fetch` para verificar acesso a URLs e baixar conteúdo de relatórios.

4. **Selecionar e qualificar dados enriquecidos.** Escolher 3-5 dados adicionais de fontes primárias distintas (máximo 2 do mesmo veículo). Atribuir nível de confiança (Alta/Média/Baixa) a cada dado.

5. **Confirmar o dado-âncora final.** Dentre todos os dados (input + enriquecidos), identificar O número mais forte. Marcar explicitamente como "Dado-âncora" na seção [ANCHOR DATA].

6. **Compilar o brief em 6 seções obrigatórias:** [INPUT SUMMARY] / [ANCHOR DATA] / [ENRICHED DATA] / [TRENDING ANGLES] / [SOURCES] / [GAPS].

7. **Nunca sugerir ângulos editoriais ou hooks.** Isso é território exclusivo do Carlos Conteúdo (step-02).

## Output Format

```markdown
# Research Brief — [TEMA]
**Input recebido:** [data YYYY-MM-DD]
**Pesquisado por:** Rafael Rastreio

---

## [INPUT SUMMARY]
[3-5 frases resumindo o conteúdo original sem editorializações]

---

## [ANCHOR DATA]
**Dado-âncora:** [afirmação com número específico]
**Fonte:** [Nome], [Ano]
**URL:** [URL verificada]
**Data de acesso:** [YYYY-MM-DD]
**Confiança:** Alta / Média / Baixa

---

## [ENRICHED DATA]

### Dado 1
**Afirmação:** [dado com número específico]
**Fonte:** [Nome], [Ano]
**URL:** [URL verificada]
**Confiança:** Alta / Média / Baixa

[Dados 2-5 com mesma estrutura]

---

## [TRENDING ANGLES]
[Padrões, tensões e dados contraditórios identificados — SEM sugestão editorial]

---

## [SOURCES]
1. [Nome] — [URL] — Acessado em [YYYY-MM-DD]
[...]

---

## [GAPS]
- [Informação buscada mas não encontrada com confiança suficiente]
```

## Output Example

```markdown
# Research Brief — Programas de Open Innovation no Brasil 2025
**Input recebido:** 2026-04-01
**Pesquisado por:** Rafael Rastreio

---

## [INPUT SUMMARY]
O conteúdo original descreve dados da Abstartups 2025 indicando crescimento de 43% nos programas de open innovation corporativo no Brasil em 2024. O texto cita ROI médio de 3.2× em programas com mais de 12 meses de duração, calculado sobre 847 programas brasileiros ativos. Menciona concentração no setor financeiro sem percentual específico.

---

## [ANCHOR DATA]
**Dado-âncora:** ROI médio de 3.2× por real investido em programas de open innovation com duração superior a 12 meses no Brasil.
**Fonte:** Abstartups — Relatório de Inovação Aberta 2025
**URL:** https://abstartups.com.br/relatorio-inovacao-aberta-2025
**Data de acesso:** 2026-04-01
**Confiança:** Alta

---

## [ENRICHED DATA]

### Dado 1
**Afirmação:** 71% dos programas de open innovation são encerrados antes de completar 6 meses — exatamente antes de atingir o ponto de retorno do investimento.
**Fonte:** Distrito — Open Innovation Report Brasil 2024
**URL:** https://distrito.me/relatorio-open-innovation-2024
**Confiança:** Alta

### Dado 2
**Afirmação:** O setor financeiro concentra 38% de todos os programas de open innovation ativos no Brasil, seguido por varejo (22%) e saúde (18%).
**Fonte:** Abstartups — Relatório de Inovação Aberta 2025
**URL:** https://abstartups.com.br/relatorio-inovacao-aberta-2025
**Confiança:** Alta

### Dado 3
**Afirmação:** Programas com patrocinador C-level com autoridade de decisão têm taxa de sucesso 2.4× maior do que programas delegados a gerências de inovação sem poder de aprovação de budget.
**Fonte:** Gartner — Corporate Innovation Program Success Factors 2025
**URL:** https://www.gartner.com/en/articles/open-innovation-success-factors
**Confiança:** Média (comunicado público, não relatório completo)

### Dado 4
**Afirmação:** 67% das Fortune 500 que mais avançaram em posição competitiva em 2024 atribuem parte do ganho a parcerias com startups via programas estruturados.
**Fonte:** World Economic Forum — The Global Innovation Index 2024
**URL:** https://www.weforum.org/reports/global-innovation-index-2024
**Confiança:** Alta

---

## [TRENDING ANGLES]
- Paradoxo de duração: ROI máximo acontece após 12 meses, mas 71% dos programas são encerrados antes disso — tensão entre expectativa de resultado rápido e realidade do ciclo de inovação
- Concentração setorial: financeiro domina open innovation no Brasil, criando oportunidade para outros setores entrarem agora com menos concorrência por startups
- Fator C-level: patrocinadores com poder de decisão multiplicam resultado em 2.4× — dado que desafia a prática comum de "inovação como projeto de middle management"
- Crescimento de 43% em 2024 → pool de startups disponíveis diminuindo — urgência temporal

---

## [SOURCES]
1. Abstartups — https://abstartups.com.br/relatorio-inovacao-aberta-2025 — Acessado em 2026-04-01
2. Distrito — https://distrito.me/relatorio-open-innovation-2024 — Acessado em 2026-04-01
3. Gartner — https://www.gartner.com/en/articles/open-innovation-success-factors — Acessado em 2026-04-01
4. World Economic Forum — https://www.weforum.org/reports/global-innovation-index-2024 — Acessado em 2026-04-01

---

## [GAPS]
- Dados de ROI específicos por setor (financeiro vs. saúde vs. varejo) não encontrados em fonte primária gratuita
- Benchmarks de custo médio de estruturação de hub de inovação no Brasil: não encontrado com confiança suficiente
- Dados de 2025 sobre tempo médio de implementação de pilotos: relatório Gartner completo é pago
```

## Veto Conditions

1. Brief contém sugestão de ângulo, hook ou tom editorial — tarefa incompleta e invasão de território do step-02
2. URL incluída no brief não verificada como acessível — dado não pode ser rastreado e invalida a integridade do brief

## Quality Criteria

- Mínimo 3 dados adicionais com fonte verificável e URL confirmada
- Dado-âncora explicitamente identificado em [ANCHOR DATA]
- Todas as 6 seções obrigatórias presentes
- Nenhuma sugestão editorial — apenas dados e padrões observados
