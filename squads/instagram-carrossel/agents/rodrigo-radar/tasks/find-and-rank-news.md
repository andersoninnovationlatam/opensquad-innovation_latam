---
task: find-and-rank-news
order: 1
agent: rodrigo-radar
input:
  - squads/instagram-carrossel/output/research-focus.md
output: squads/instagram-carrossel/output/news-brief.md
---

## Process

### Passo 1 — Ler o arquivo de foco da pesquisa
Ler `squads/instagram-carrossel/output/research-focus.md` para extrair:
- **Tema principal:** o foco editorial definido pelo usuário
- **Janela temporal:** 24h / 7 dias / 1 mês / evergreen
- Qualquer restrição ou contexto adicional informado

Se o arquivo não existir ou estiver vazio, parar e registrar erro no output.

### Passo 2 — Executar buscas em duplo idioma
Realizar no mínimo 4 buscas web:
1. Query em Português (Brasil) — tema principal + palavras de inovação
2. Query em Português (Brasil) — variação temática (ex: setor específico, empresa, dado)
3. Query em Inglês — tema principal + "corporate innovation" / "B2B startups" / "Latin America"
4. Query em Inglês — variação temática ou busca em fonte primária específica (Gartner, McKinsey, CB Insights)

**Exemplos de queries para tema "IA corporativa":**
- PT-BR: `"inteligência artificial" empresas brasileiras 2026 site:gartner.com OR site:mckinsey.com OR site:distrito.me`
- PT-BR: `IA generativa grandes empresas Brasil resultado prático`
- EN: `generative AI enterprise adoption Latin America 2026 report`
- EN: `site:gartner.com OR site:mckinsey.com generative AI corporate 2026`

### Passo 3 — Filtrar por relevância ao público
Para cada resultado encontrado, aplicar filtro de relevância:

**Aceitar:**
- Impacto direto em grandes empresas ou startups B2B
- Dado de fonte primária (relatório, pesquisa, comunicado oficial)
- Conteúdo dentro da janela temporal solicitada
- Ângulo ainda não amplamente explorado

**Descartar:**
- Notícias sem aplicação prática ao ecossistema de inovação corporativa
- Conteúdo fora da janela temporal (ou sinalizar explicitamente se for a única opção relevante)
- Fontes sem URL verificável
- Manchetes sensacionalistas sem dados de suporte

### Passo 4 — Verificar credibilidade das fontes
Para cada pauta filtrada, classificar a fonte:

| Nível | Critério |
|-------|----------|
| ALTA  | Fonte primária verificada: relatório com metodologia, comunicado oficial, paper acadêmico, dado de consultoria Big 4 ou Gartner/Forrester/IDC |
| MÉDIA | Veículo de negócios credenciado (Valor, Exame, Bloomberg) citando fonte primária com link |
| BAIXA | Artigo de opinião, blog corporativo, LinkedIn post sem dado rastreável |

### Passo 5 — Verificar frescor (janela temporal)
- Checar a data de publicação de cada fonte
- Se uma pauta relevante estiver fora da janela: incluir com nota explícita "[FORA DA JANELA — publicado em X]"
- Se a janela for "evergreen": aceitar pautas atemporais (frameworks, estudos de caso clássicos)

### Passo 6 — Ranquear as pautas (critério triple)
Avaliar cada pauta nos três eixos e determinar o ranking:

1. **Relevância ao público** (0-3): impacta diretamente grandes empresas ou ecossistema de startups B2B?
2. **Ineditismo** (0-3): ângulo ainda não explorado ou dado recém-publicado?
3. **Potencial de engajamento no Instagram** (0-3): vai gerar saves? Comentários? Surpresa?

Somar os pontos e ranquear de 1 (maior pontuação) a N.

### Passo 7 — Estruturar e gravar o output
Gravar em `squads/instagram-carrossel/output/news-brief.md` seguindo exatamente o formato definido abaixo.

---

## Output Format

```
RESEARCH BRIEF
Tema: [tema extraído de research-focus.md]
Janela temporal: [período solicitado]
Data da pesquisa: [YYYY-MM-DD]

---

PAUTAS ENCONTRADAS (ranqueadas por relevância)

#1 (Recomendada): "[Título completo da pauta]"
Fonte: [Nome da publicação/fonte] ([URL completa])
Data de publicação: [YYYY-MM-DD]
Confiança: [ALTA / MÉDIA / BAIXA]
Resumo: [1-2 linhas sobre o conteúdo e relevância para o público]
Por que recomendar: [1 linha com justificativa editorial]

#2: "[Título completo da pauta]"
Fonte: [Nome da publicação/fonte] ([URL completa])
Data de publicação: [YYYY-MM-DD]
Confiança: [ALTA / MÉDIA / BAIXA]
Resumo: [1-2 linhas sobre o conteúdo e relevância]

#3: "[Título completo da pauta]"
Fonte: [Nome da publicação/fonte] ([URL completa])
Data de publicação: [YYYY-MM-DD]
Confiança: [ALTA / MÉDIA / BAIXA]
Resumo: [1-2 linhas sobre o conteúdo e relevância]

[#4 e #5 se disponíveis, seguindo o mesmo formato]

---

RECOMENDAÇÃO EDITORIAL
Pauta selecionada: #[N]
Justificativa: [2-3 linhas explicando por que esta pauta tem maior potencial de engajamento e relevância para o público do @innovationlatam]
```

---

## Output Example

```
RESEARCH BRIEF
Tema: Inteligência Artificial em grandes empresas brasileiras
Janela temporal: Últimos 7 dias
Data da pesquisa: 2026-04-05

---

PAUTAS ENCONTRADAS (ranqueadas por relevância)

#1 (Recomendada): "Gartner: 70% das empresas Fortune 500 usarão IA generativa até 2026"
Fonte: Gartner (https://www.gartner.com/en/newsroom/press-releases/2026-04-generative-ai)
Data de publicação: 2026-04-03
Confiança: ALTA
Resumo: Relatório confirma aceleração da adoção de IA generativa nas maiores corporações globais, com impacto em operações, RH e estratégia de negócios — dado diretamente relevante para o público de inovação corporativa da Innovation Latam.
Por que recomendar: Dado de fonte primária de máxima credibilidade, com número impactante que ancora um carrossel Data-Driven ou Mito vs Realidade sobre IA corporativa.

#2: "Startups de IA levantam US$ 2,3B no Brasil em Q1 2026"
Fonte: Distrito (https://www.distrito.me/relatorios/ia-q1-2026)
Data de publicação: 2026-04-01
Confiança: ALTA
Resumo: Relatório trimestral do Distrito aponta crescimento de 180% nos aportes para startups de IA brasileiras vs Q1 2025, com destaque para soluções B2B em finanças e saúde.

#3: "Banco Itaú lança programa de open innovation focado em IA aplicada ao crédito"
Fonte: Valor Econômico (https://www.valor.com.br/financas/exemplo-url)
Data de publicação: 2026-04-02
Confiança: ALTA
Resumo: Programa conecta startups de IA com times internos de crédito e cobrança do maior banco privado do Brasil, abrindo ciclo de submissões até 30 de abril.

#4: "McKinsey: empresas líderes em IA capturam 80% do valor até 2030"
Fonte: McKinsey & Company (https://www.mckinsey.com/capabilities/quantumblack/our-insights/exemplo)
Data de publicação: 2026-03-28
Confiança: ALTA
Resumo: Análise projeta concentração de valor entre early adopters de IA, com janela de vantagem competitiva se fechando nos próximos 18-24 meses.

---

RECOMENDAÇÃO EDITORIAL
Pauta selecionada: #1
Justificativa: O dado do Gartner é específico, verificável e surpreendente para o público que ainda está em fase de avaliação sobre IA. Cria a ancoragem perfeita para um carrossel Mito vs Realidade ou Data-Driven que desmistifica a adoção de IA em grandes empresas. A pauta #4 (McKinsey) pode ser usada como dado complementar dentro do carrossel para reforçar o argumento de urgência.
```

---

## Quality Criteria

1. Mínimo de 3 pautas entregues, cada uma com todos os campos preenchidos (título, fonte, URL, data, confiança, resumo)
2. Pauta recomendada (#1) com justificativa editorial específica de pelo menos 2 linhas
3. 100% das fontes com URL completa e funcional — sem "fonte: a internet" ou similar
4. Nível de confiança atribuído a cada pauta com critério consistente
5. Buscas realizadas em pelo menos dois idiomas (PT-BR e EN)
6. Output gravado em `squads/instagram-carrossel/output/news-brief.md` no formato exato definido acima

---

## Veto Conditions

- **PARAR se** `research-focus.md` não existir ou estiver vazio — registrar erro e solicitar novo input
- **PARAR se** após buscas extensivas não for possível encontrar nenhuma pauta com Confiança ALTA ou MÉDIA sobre o tema — registrar limitação e sugerir tema alternativo ou janela temporal expandida
- **NUNCA entregar** pautas sem URL verificável — melhor registrar "fonte não verificável descartada" do que incluir link quebrado
- **NUNCA assumir** o conteúdo de uma fonte sem acessá-la — verificar antes de incluir
