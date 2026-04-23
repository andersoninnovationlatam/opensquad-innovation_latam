---
step: 2
name: find-and-rank-news
type: agent
agent: rodrigo-radar
execution: subagent
inputFile: squads/instagram-carrossel/output/research-focus.md
outputFile: squads/instagram-carrossel/output/news-brief.md
model_tier: powerful
---

## Contexto

**Agente:** Rodrigo Radar — Pesquisador de Tendências
**Execução:** Subagente (opera em background, sem interação com o usuário)
**Tempo estimado:** 2-4 minutos

Rodrigo Radar pesquisa pautas relevantes com base no foco definido no Passo 1. Ele busca em fontes primárias nacionais e internacionais, verifica credibilidade, checa o frescor das notícias e ranqueia as melhores opções por relevância, ineditismo e potencial de engajamento no Instagram.

---

## Instruções

O agente Rodrigo Radar deve:

### Context Loading
- Ler `squads/instagram-carrossel/output/research-focus.md` para extrair tema e janela temporal
- Ler `squads/instagram-carrossel/pipeline/data/research-brief.md` para referência de formato de output e fontes de alta credibilidade
- Ler `squads/instagram-carrossel/pipeline/data/domain-framework.md` para critérios de relevância ao público

### Process

1. **Executar buscas em duplo idioma** (PT-BR e EN) com no mínimo 4 queries distintas cobrindo o tema e suas variações
2. **Filtrar por relevância** ao público de inovação corporativa da Innovation Latam (grandes empresas + ecossistema de startups B2B)
3. **Verificar credibilidade** de cada fonte encontrada (ALTA / MÉDIA / BAIXA conforme critérios do research-brief.md)
4. **Checar frescor** de cada pauta contra a janela temporal solicitada; alertar explicitamente se pauta estiver fora da janela
5. **Ranquear por critério triple:** relevância ao público (0-3) + ineditismo (0-3) + potencial de engajamento no Instagram (0-3)
6. **Estruturar output** com 3-5 pautas ranqueadas + recomendação editorial justificada

### Output Format
Gravar em `squads/instagram-carrossel/output/news-brief.md` seguindo exatamente o formato definido em `research-brief.md`:
- Header com tema, janela e data da pesquisa
- 3-5 pautas ranqueadas com: título, fonte, URL, data, confiança, resumo
- Pauta #1 com campo adicional "Por que recomendar"
- Seção "Recomendação Editorial" com justificativa de 2-3 linhas

### Output Example

```
RESEARCH BRIEF
Tema: IA generativa em grandes empresas brasileiras
Janela temporal: Últimos 7 dias
Data da pesquisa: 2026-04-05

---

PAUTAS ENCONTRADAS (ranqueadas por relevância)

#1 (Recomendada): "Gartner: 70% das empresas Fortune 500 usarão IA generativa até 2026"
Fonte: Gartner (https://www.gartner.com/en/newsroom/press-releases/2026-04-ai-report)
Data de publicação: 2026-04-03
Confiança: ALTA
Resumo: Relatório primário confirma aceleração de adoção de IA nas grandes corporações globais.
Por que recomendar: Dado de máxima credibilidade com número impactante que ancora carrossel Data-Driven ou Mito vs Realidade.

#2: "Startups de IA levantam US$ 2,3B no Brasil em Q1 2026"
Fonte: Distrito (https://www.distrito.me/relatorios/ia-q1-2026)
Data de publicação: 2026-04-01
Confiança: ALTA
Resumo: Crescimento de 180% vs Q1 2025; soluções B2B em finanças e saúde lideram.

---

RECOMENDAÇÃO EDITORIAL
Pauta selecionada: #1
Justificativa: Dado primário Gartner, número impactante e ainda sub-explorado no Instagram de inovação. A pauta #2 pode ser citada como dado complementar no carrossel para reforçar o contexto Latam.
```

### Veto Conditions

- **PARAR se** research-focus.md não existir — registrar erro no output e aguardar novo input
- **NUNCA entregar** fontes sem URL verificável
- **NUNCA assumir** conteúdo de fonte sem acessá-la — verificar antes de incluir
- **NUNCA entregar** menos de 3 pautas sem registrar a limitação e sugerir alternativas

### Quality Criteria

- 3-5 pautas entregues com todos os campos preenchidos
- 100% das fontes com URL verificável
- Nível de confiança em 100% das pautas
- Pauta #1 com campo "Por que recomendar" preenchido
- Buscas realizadas em PT-BR e EN
