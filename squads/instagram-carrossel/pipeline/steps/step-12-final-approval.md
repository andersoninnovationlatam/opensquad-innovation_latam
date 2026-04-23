---
step: 12
name: final-approval
type: checkpoint
inputFile: squads/instagram-carrossel/output/review.md
---

## Contexto

Vera Veredito concluiu a revisão. Este é o checkpoint final do pipeline — o momento de decidir o que fazer com o carrossel aprovado.

---

## Context Loading

Ler `squads/instagram-carrossel/output/review.md` e apresentar o veredicto ao usuário.

---

## Instructions

### Process

1. **Apresentar o veredicto** de Vera Veredito de forma clara e estruturada

2. **Adaptar a resposta conforme o veredicto:**

   **Se APROVAR:**
   - Parabenizar pela conclusão do carrossel
   - Mostrar o resumo do que foi criado (tema, ângulo, slides, legenda)
   - Listar os arquivos gerados com caminhos
   - Apresentar opções de próximo passo

   **Se APROVAR CONDICIONAL:**
   - Mostrar os critérios que precisam de ajuste antes da publicação
   - Listar as mudanças recomendadas (não obrigatórias para aprovação, mas recomendadas para publicação)
   - Apresentar opções ao usuário

3. **Apresentar opções de próximo passo** (conforme veredicto):

   **Opções para APROVAR:**
   - "Publicar agora" — export para o Instagram (se instagram-publisher disponível)
   - "Salvar como rascunho" — manter os arquivos para publicação posterior
   - "Criar variação" — gerar um segundo ângulo do mesmo tema
   - "Novo carrossel" — iniciar um novo pipeline com tema diferente
   - "Ajuste fino" — fazer pequena edição em um slide específico

   **Opções para APROVAR CONDICIONAL:**
   - "Publicar mesmo assim" — publicar sem aplicar as sugestões
   - "Aplicar ajustes" — retornar ao Passo 6 com as mudanças recomendadas
   - "Salvar como rascunho" — decidir depois

4. **Registrar decisão final** e fechar o pipeline

### Output Format

**Para APROVAR:**
```
## Carrossel Aprovado!

**Veredicto de Vera Veredito:** APROVAR
**Score médio:** [X.X/10]
**Rodada:** [N de 3]

---

### Resumo do Carrossel
**Tema:** [tema pesquisado]
**Pauta:** "[título da pauta]"
**Ângulo:** [nome do ângulo]
**Formato:** [formato] ([N] slides)
**Tom:** [tom selecionado]

### Força Identificada
[força destacada por Vera Veredito]

### Arquivos Gerados
- **Conteúdo:** squads/instagram-carrossel/output/carousel-content.md
- **Design Brief:** squads/instagram-carrossel/output/design-brief.md
- **Slides HTML:** squads/instagram-carrossel/output/slides/ ([N] arquivos)
- **Review:** squads/instagram-carrossel/output/review.md

---

### O que fazer agora?
1. Publicar agora no Instagram
2. Salvar como rascunho (publicar depois)
3. Criar variação deste carrossel com outro ângulo
4. Iniciar novo carrossel com tema diferente
5. Fazer ajuste fino em um slide específico

Qual é a sua escolha?
```

**Para APROVAR CONDICIONAL:**
```
## Carrossel Aprovado com Ressalvas

**Veredicto de Vera Veredito:** APROVAR CONDICIONAL
**Score médio:** [X.X/10]

---

### Ajustes Recomendados antes da Publicação
[Lista das mudanças recomendadas do review.md]

---

### O que fazer agora?
1. Aplicar os ajustes recomendados (retorna ao Passo 6)
2. Publicar como está (ignorar sugestões não-bloqueantes)
3. Salvar como rascunho e decidir depois

Qual é a sua escolha?
```

### Output Example

```
## Carrossel Aprovado!

**Veredicto de Vera Veredito:** APROVAR
**Score médio:** 8.6/10
**Rodada:** 1 de 3

---

### Resumo do Carrossel
**Tema:** IA generativa em grandes empresas brasileiras
**Pauta:** "Gartner: 70% das Fortune 500 usarão IA generativa até 2026"
**Ângulo:** IA Não É Ficção Científica
**Formato:** Mito vs Realidade (7 slides)
**Tom:** Tom 2 — Educativo e Acessível

### Força Identificada
O slide 4 usa dado específico (POC em 6-12 semanas / R$ 50-150k) que desmistifica o custo de IA de forma prática — alta probabilidade de save por executivos em fase de avaliação.

### Arquivos Gerados
- Conteúdo: squads/instagram-carrossel/output/carousel-content.md
- Design Brief: squads/instagram-carrossel/output/design-brief.md
- Slides HTML: squads/instagram-carrossel/output/slides/ (7 arquivos: slide-01.html a slide-07.html)
- Review: squads/instagram-carrossel/output/review.md

---

### O que fazer agora?
1. Publicar agora no Instagram @innovationlatam
2. Salvar como rascunho (publicar depois)
3. Criar variação deste carrossel com outro ângulo
4. Iniciar novo carrossel com tema diferente
5. Fazer ajuste fino em um slide específico

Qual é a sua escolha?
```

### Veto Conditions

- **NÃO apresentar este checkpoint** se o veredicto for REJEITAR — o pipeline retorna ao Passo 6 automaticamente
- **NUNCA ignorar** o veredicto de Vera Veredito — APROVAR CONDICIONAL não é o mesmo que APROVAR
- **NUNCA forçar publicação** sem decisão explícita do usuário

### Quality Criteria

- Veredicto apresentado de forma clara (APROVAR ou APROVAR CONDICIONAL)
- Score médio e força identificada apresentados
- Resumo completo do que foi criado (tema, pauta, ângulo, formato, tom)
- Lista completa dos arquivos gerados com caminhos
- Opções de próximo passo apresentadas claramente
- Para CONDICIONAL: ajustes recomendados listados com clareza antes das opções
