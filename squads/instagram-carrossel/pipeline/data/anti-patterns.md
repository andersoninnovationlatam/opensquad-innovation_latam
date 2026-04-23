# Anti-Patterns — Instagram Carrossel Innovation Latam

Este documento lista os erros mais comuns e proibições explícitas para o squad. Todos os agentes devem conhecer e aplicar estas regras.

---

## Anti-Patterns de Pesquisa (Rodrigo Radar)

### NUNCA FAZER

**1. Incluir fonte sem URL verificável**
- Problema: Destrói a credibilidade do brief e impossibilita verificação editorial
- Sintoma: "Fonte: notícias recentes" / "Fonte: relatório do setor"
- Correção: Toda fonte deve ter URL completa e funcional

**2. Ranquear por popularidade em vez de relevância ao público**
- Problema: Gera pautas genéricas que qualquer perfil poderia usar, sem valor editorial para o público de inovação corporativa
- Sintoma: "Essa notícia viralizou no LinkedIn ontem" sem critério editorial
- Correção: Ranquear por relevância + ineditismo + potencial de engajamento para o público específico

**3. Usar notícias fora da janela temporal sem aviso**
- Problema: Conteúdo datado prejudica autoridade e pode gerar críticas de público informado
- Sintoma: Incluir artigo de 45 dias atrás em busca de "últimos 7 dias"
- Correção: Alertar explicitamente quando a melhor pauta disponível está fora da janela

**4. Retornar apenas uma pauta**
- Problema: Elimina a capacidade de curadoria editorial do usuário
- Sintoma: "Encontrei apenas esta pauta relevante"
- Correção: Buscar com variações de query (PT-BR + EN) até ter pelo menos 3 pautas

**5. Confundir opinião com dado**
- Problema: Opiniões de analistas sem dado de suporte não têm o mesmo peso que relatórios primários
- Sintoma: "Especialistas acreditam que..." sem citar o estudo
- Correção: Distinguir claramente dado primário (relatório com metodologia) de opinião editorial

---

## Anti-Patterns de Copywriting (Carlos Carrossel)

### NUNCA FAZER

**1. Criar o conteúdo do carrossel antes de apresentar os 5 ângulos**
- Problema: Elimina o processo de curadoria editorial que garante o melhor ângulo
- Sintoma: Começar a escrever slides sem perguntar qual ângulo o usuário prefere
- Correção: Sempre apresentar 5 ângulos com drivers emocionais distintos e aguardar seleção

**2. Slides com menos de 40 palavras**
- Problema: Conteúdo raso, não entrega valor suficiente para gerar save
- Sintoma: "Slide 3: Use IA na sua empresa. Funciona."
- Correção: Cada slide deve ter headline + texto de suporte totalizando 40-80 palavras

**3. Slides com mais de 80 palavras**
- Problema: Destrói legibilidade mobile; o usuário desiste antes de ler
- Sintoma: Parágrafos de 5-6 linhas em um único slide
- Correção: Cortar até o essencial; cada palavra deve ganhar seu espaço

**4. Legenda sem CTA específico**
- Problema: Desperdiça a maior oportunidade de gerar comentários e salvar o post
- Sintoma: "Esperamos que gostem!" / "Compartilhe com quem precisa!"
- Correção: CTA específico conectado ao conteúdo (ex: "Comenta: qual mito mais te surpreendeu?")

**5. Começar a legenda com contexto em vez de hook**
- Problema: Os primeiros 125 caracteres são o único texto visível antes do "ver mais" — desperdiçá-los é perder a abertura
- Sintoma: "Neste post de hoje, vamos falar sobre os principais desafios da inovação..."
- Correção: Primeiro linha = afirmação ou dado que provoca leitura imediata

**6. Usar em dash (—) no copy**
- Problema: Prejudica o ritmo de leitura mobile; muitos leitores fazem pausa desnecessária
- Sintoma: "A inovação aberta — que conecta empresas e startups — pode transformar..."
- Correção: Reescrever usando ponto, vírgula, dois pontos ou nova frase

**7. Jargões corporativos vazios**
- Problema: Distancia o leitor e transmite falta de substância
- Sintoma: "Sinergia", "paradigma", "game changer", "revolucionário", "incrível"
- Correção: Substituir por descrição específica do benefício ou dado concreto

**8. Slides sem hierarquia visual explícita**
- Problema: Sem headline e texto de suporte distintos, o Diretor de Arte não consegue criar o layout
- Sintoma: Texto corrido sem separação entre título e corpo
- Correção: Cada slide deve ter "Headline: [X]" e "Texto de suporte: [Y]" explícitos

---

## Anti-Patterns de Design (Beatriz Briefing)

### NUNCA FAZER

**1. Termos de câmera/luz/lente fora do guia_diretor_arte.md**
- Problema: Quebra a consistência técnica e pode levar a briefings incompreensíveis para o gerador de imagem
- Sintoma: "Foto tirada de longe" / "Iluminação dramática" (termos vagos)
- Correção: Usar EXCLUSIVAMENTE os termos do guia: ex. "Plano médio · Low key · Teleobjetiva 85mm f/1.8"

**2. Branding fora do canto inferior direito**
- Problema: Viola o doc_posicao_logo_logo_conta.md e a identidade visual da marca
- Sintoma: Logo no centro, no canto superior, ou ausente
- Correção: Logo + handle SEMPRE no canto inferior direito, margem mínima 32-48px

**3. Font-size abaixo de 34px para corpo de texto**
- Problema: Ilegível no feed mobile (tela de 5-6 polegadas, distância de leitura ~30cm)
- Sintoma: `font-size: 24px` para texto de suporte
- Correção: Mínimo 34px para body text; 62px para títulos de conteúdo; 68px para capa

**4. Font-weight abaixo de 500 (Medium)**
- Problema: Texto fino perde legibilidade sobre fotos ou fundos coloridos
- Sintoma: `font-weight: 400` ou `font-weight: 300`
- Correção: Mínimo 500 (Medium) para corpo; 700 (Bold) para tags; 900 (Black) para títulos

**5. Contador de slide no HTML**
- Problema: Instagram tem navegação nativa; contador é redundante e ocupa espaço de conteúdo
- Sintoma: "2/8" ou "Slide 2 de 8" no layout
- Correção: Nunca incluir contador; usar swipe hint apenas nos slides não-finais

**6. Posicionamento absolute para layout principal**
- Problema: Quebra em viewports diferentes; dificulta manutenção
- Sintoma: `position: absolute; top: X; left: Y` para elementos do conteúdo principal
- Correção: Usar `display: flex; flex-direction: column` conforme visual-identity.md

**7. Dependências externas além de Google Fonts**
- Problema: Slides HTML precisam ser auto-contidos para renderizar offline com Playwright
- Sintoma: `<link>` para CDN de ícones, imagens externas sem fallback
- Correção: Inline CSS, apenas `@import` do Google Fonts; imagens como path local

**8. Renderizar todos os slides sem verificar o slide 1 primeiro**
- Problema: Se o template estiver errado, todos os slides serão refeitos
- Sintoma: Gerar slide-01.html a slide-09.html em sequência sem pausa
- Correção: Gerar slide-01, verificar via screenshot, confirmar design system, então renderizar o restante

---

## Anti-Patterns de Review (Vera Veredito)

### NUNCA FAZER

**1. Aprovar sem ler o conteúdo integralmente**
- Problema: Erros críticos passam despercebidos; a revisão perde valor
- Sintoma: "Parece bom, aprovado"
- Correção: Pontuar cada um dos 8 critérios com justificativa específica

**2. Dar score sem justificativa na mesma frase**
- Problema: "7/10" sem explicação não instrui o criador sobre o que foi bem ou mal
- Sintoma: "Hook: 6/10" sem contexto
- Correção: "Hook: 6/10 porque a afirmação é genérica — não há dado específico que ancora a urgência"

**3. Rejeitar sem indicar correção específica**
- Problema: Criador não sabe o que mudar; iteração torna-se ineficiente
- Sintoma: "Slides com muito texto — rejeitar"
- Correção: "Slides 3 e 5 têm 95 e 102 palavras respectivamente — cortar para máximo 80 palavras cada"

**4. Deixar preferência pessoal sobrepor critérios**
- Problema: Review subjetivo é inconsistente e injusto
- Sintoma: "Não gostei do tom deste slide" sem critério objetivo
- Correção: Avaliar o tom contra o critério definido no quality-criteria.md e tom-of-voice.md

**5. Omitir a identificação de forças**
- Problema: Feedback sem reconhecimento de forças desencoraja criadores e não instrui sobre o que manter
- Sintoma: Review que lista apenas problemas
- Correção: Identificar pelo menos 1 força genuína, mesmo em conteúdo rejeitado

---

## Anti-Patterns Globais (Todos os Agentes)

**1. Usar placeholder em entregáveis**
- Sintoma: "Lorem ipsum", "[inserir dado aqui]", "TBD"
- Correção: Conteúdo de produção desde o primeiro rascunho

**2. Omitir unidades e especificações numéricas**
- Sintoma: "Fonte grande", "margem adequada", "próximo da borda"
- Correção: Sempre "font-size: 68px", "margin: 48px", "bottom-right corner"

**3. Criar entregável sem ler os arquivos de entrada**
- Sintoma: Ignorar research-focus.md e usar tema inventado
- Correção: Leitura dos arquivos de input é o primeiro passo de qualquer tarefa

**4. Avançar etapa sem checkpoint quando um existe no pipeline**
- Sintoma: Carlos cria o carrossel sem aguardar seleção de ângulo
- Correção: Respeitar todos os checkpoints — apresentar opções e aguardar input do usuário
