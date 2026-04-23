---
task: research-and-enrich
agent: rafael-rastreio
order: 1
input:
  - squads/agent-social-media-innovation-latam/input/content.md
  - web_search results
  - web_fetch results
output:
  - squads/agent-social-media-innovation-latam/output/research.md
---

## Process

1. **Ler o input completo.** Abrir `input/content.md` e absorver todo o conteúdo — identificar tema central, dados já presentes (números, percentuais, fontes, empresas mencionadas), e possíveis lacunas de informação.

2. **Identificar o dado-âncora inicial.** Qual é o número mais surpreendente ou contraintuitivo já presente no input? Marcá-lo como candidato a dado-âncora.

3. **Planejar as buscas.** Definir 3-5 queries de pesquisa com base no tema:
   - `"[tema] estatísticas 2024 2025 relatório"`
   - `"[tema] Brasil dados [IBGE FGV Abstartups]"`
   - `"[tema] [Gartner McKinsey WEF] report"`
   - `"[tema] mito realidade dados contraintuitivos"`

4. **Executar buscas e verificar fontes.** Usar `web_search` para cada query, `web_fetch` para verificar acesso a URLs encontradas. Registrar data de acesso.

5. **Selecionar dados enriquecidos.** Escolher 3-5 dados adicionais de fontes primárias distintas que ampliem ou contraponham o input original. Cada dado com fonte, ano, URL verificada, nível de confiança.

6. **Confirmar o dado-âncora.** Dentre todos os dados (input + enriquecidos), identificar O número mais forte para o hook do slide 1. Marcá-lo explicitamente como "Dado-âncora".

7. **Compilar o brief estruturado.** Escrever `output/research.md` nas 6 seções obrigatórias. Não fazer nenhuma sugestão editorial.

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
**Fonte:** [Nome da fonte], [Ano]
**URL:** [URL verificada]
**Data de acesso:** [YYYY-MM-DD]
**Confiança:** Alta / Média / Baixa

---

## [ENRICHED DATA]

### Dado 1
**Afirmação:** [dado específico com número]
**Fonte:** [Nome], [Ano]
**URL:** [URL verificada]
**Confiança:** Alta / Média / Baixa

### Dado 2
[mesma estrutura]

### Dado 3
[mesma estrutura]

---

## [TRENDING ANGLES]
[padrões emergentes, dados contraditórios, tensões identificadas — SEM sugestão de ângulo editorial]

---

## [SOURCES]
1. [Nome] — [URL] — Acessado em [YYYY-MM-DD]
2. [Nome] — [URL] — Acessado em [YYYY-MM-DD]
[...]

---

## [GAPS]
- [Informação buscada mas não encontrada com confiança suficiente]
- [Informação que dependeria de relatório pago não acessível]
```

## Output Example

```markdown
# Research Brief — Inovação Corporativa com IA no Brasil 2025
**Input recebido:** 2026-04-01
**Pesquisado por:** Rafael Rastreio

---

## [INPUT SUMMARY]
O conteúdo original descreve um relatório McKinsey 2025 indicando que 78% das grandes empresas globais declaram IA como prioridade estratégica, mas apenas 12% possuem programa estruturado em produção. O texto menciona que o Brasil segue o padrão global, com crescimento de programas mas baixa maturidade de execução.

---

## [ANCHOR DATA]
**Dado-âncora:** Gap de 66 pontos percentuais entre intenção (78%) e execução real (12%) em programas de IA corporativa.
**Fonte:** McKinsey Global Institute — "The State of AI in 2025"
**URL:** https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
**Data de acesso:** 2026-04-01
**Confiança:** Alta

---

## [ENRICHED DATA]

### Dado 1
**Afirmação:** Empresas com programas estruturados de IA por mais de 2 anos reportam ganho médio de 23% de produtividade vs. empresas sem programa.
**Fonte:** McKinsey Global Institute, 2025
**URL:** https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
**Confiança:** Alta

### Dado 2
**Afirmação:** 73% dos casos de uso com maior ROI em IA corporativa surgem das áreas de negócio (vendas, operações, RH) — não do TI.
**Fonte:** Harvard Business Review — "Where AI Actually Creates Business Value", 2024
**URL:** https://hbr.org/2024/03/where-ai-creates-value
**Confiança:** Alta

### Dado 3
**Afirmação:** Programas de IA que chegam ao 12º mês de operação capturam 90% do valor total projetado; 71% dos programas são encerrados antes disso.
**Fonte:** Gartner Innovation Survey 2025
**URL:** https://www.gartner.com/en/articles/ai-program-maturity-2025
**Confiança:** Média (comunicado público, não relatório completo)

### Dado 4
**Afirmação:** No Brasil, adoção estruturada de IA em grandes empresas cresceu 34% em 2024, mas concentrada em setor financeiro (42% do total).
**Fonte:** ANPEI — Relatório de Inovação Empresarial Brasil 2025
**URL:** https://anpei.org.br/relatorio-inovacao-2025
**Confiança:** Alta

---

## [TRENDING ANGLES]
- Tensão entre intenção estratégica e execução real: alta declaração de prioridade, baixa entrega de projetos em produção
- Concentração setorial: setor financeiro puxando a média de adoção, outros setores muito atrás
- Fenômeno de "morte precoce" dos programas: maioria encerrada antes de atingir o ponto de retorno
- Gap de origem dos casos de uso: negócio vs. TI como ponto de tensão organizacional

---

## [SOURCES]
1. McKinsey Global Institute — https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai — Acessado em 2026-04-01
2. Harvard Business Review — https://hbr.org/2024/03/where-ai-creates-value — Acessado em 2026-04-01
3. Gartner — https://www.gartner.com/en/articles/ai-program-maturity-2025 — Acessado em 2026-04-01
4. ANPEI — https://anpei.org.br/relatorio-inovacao-2025 — Acessado em 2026-04-01

---

## [GAPS]
- Dados específicos de ROI por setor no Brasil não encontrados com confiança suficiente (relatórios disponíveis são pagos)
- Benchmarks de tempo médio de implementação de programas de IA no Brasil: não encontrado em fonte primária acessível
- Dados de 2025 sobre budget médio investido: McKinsey não publicou breakdown regional gratuito
```

## Quality Criteria

- Mínimo 3 dados adicionais com fonte verificável e URL confirmada além do input original
- Dado-âncora explicitamente identificado na seção [ANCHOR DATA]
- Nenhuma sugestão de ângulo editorial ou hook — apenas matéria-prima de dados
- Todas as 6 seções obrigatórias presentes no brief
- Máximo 2 fontes do mesmo veículo em todo o brief

## Veto Conditions

1. Brief contém sugestão de ângulo, hook ou tom editorial — invasão de território do Carlos Conteúdo
2. URL incluída no brief não verificada como acessível no momento da pesquisa
