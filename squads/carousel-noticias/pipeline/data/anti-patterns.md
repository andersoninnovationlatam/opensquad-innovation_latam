# Anti-Patterns — Carrossel de Notícias

## Erros de Copy

### 1. Misturar ângulos no mesmo carrossel
**O que é:** Começar com tom de urgência no cover, passar para educacional no meio, e fechar com storytelling.
**Por que é prejudicial:** O leitor não sabe como se sentir. A emoção dominante é diluída e o carrossel não gera ação clara.
**Como evitar:** Escolher um único ângulo no início e manter o driver emocional do primeiro ao último slide.

### 2. Slides abaixo de 40 palavras
**O que é:** Slides com apenas headline e 1-2 linhas de suporte, sem dado, contexto ou exemplo.
**Por que é prejudicial:** Não entrega valor real. O usuário não salva conteúdo superficial. Destrói a percepção de autoridade da marca.
**Como evitar:** Todo slide precisa ter headline + texto de suporte com dado, contexto ou consequência. Mínimo absoluto: 40 palavras combinadas.

### 3. Afirmações sem base na notícia original
**O que é:** Adicionar dados, estatísticas ou afirmações que não estavam na notícia fornecida.
**Por que é prejudicial:** Imprecisão de conteúdo destrói credibilidade. Se o dado for verificado como errado pelo público, a marca perde autoridade permanentemente.
**Como evitar:** Toda afirmação deve ser rastreável à notícia original. Dados extras devem ser explicitamente identificados como conhecimento contextual com fonte.

### 4. Cover genérico
**O que é:** Headline que poderia ser de qualquer outra marca no mesmo nicho.
**Por que é prejudicial:** O cover é o único elemento que compete com todo o feed do Instagram. Genérico = invisível = zero engajamento.
**Como evitar:** Adicionar especificidade (número, nome, prazo), tensão (o que está em jogo) ou contraponto (o que todos acreditam vs. o que é verdade).

### 5. CTA passivo ou ausente
**O que é:** "Esperamos que tenha gostado!" ou terminar o carrossel sem instrução de ação.
**Por que é prejudicial:** Posts sem CTA geram 43% menos engajamento do que posts com CTA específico. Salvar e compartilhar são sinais valiosos para o algoritmo.
**Como evitar:** Último slide sempre termina com uma das fórmulas: "Comenta [PALAVRA] abaixo", "Salve para consultar depois", "Manda para [perfil específico de pessoa]".

### 6. Hashtag spam
**O que é:** Usar 20-30 hashtags aleatórias ou copiar o mesmo bloco de todos os posts.
**Por que é prejudicial:** Instagram penaliza posts com hashtags irrelevantes ou repetitivas em excesso. Pode suprimir a distribuição orgânica silenciosamente.
**Como evitar:** 5-15 hashtags selecionadas por relevância ao tema específico do post, não ao perfil em geral. Rotacionar entre posts.

---

## Erros Visuais

### 7. Texto sobre foto sem overlay
**O que é:** Colocar texto branco diretamente sobre uma fotografia sem camada de escurecimento.
**Por que é prejudicial:** Viola WCAG AA (4.5:1 mínimo). Em fotos claras, o texto fica ilegível. Parece descuido e prejudica a percepção de qualidade.
**Como evitar:** Sempre adicionar overlay de gradiente ou sólido entre a foto e o texto. Linear-gradient de baixo para cima funciona bem para carrosséis com texto no fundo.

### 8. Fonte incorreta ou peso errado
**O que é:** Usar Inter, Poppins, ou qualquer fonte que não seja Montserrat. Ou usar Bold em slides que deveriam ser Medium.
**Por que é prejudicial:** Viola a identidade visual da Innovation Latam. Cria inconsistência que o público percebe como falta de profissionalismo.
**Como evitar:** Importar sempre Montserrat via Google Fonts @import. Bold 700 SOMENTE no título do cover (slide 1). Todo o resto: Medium 500.

### 9. Branding ausente ou em posição errada
**O que é:** Esquecer o logo ou @handle, ou colocá-los em posição diferente do canto inferior direito.
**Por que é prejudicial:** Viralização sem branding é tráfego perdido. Um carrossel salvo e compartilhado sem logo não traz seguidores nem reconhecimento para a Innovation Latam.
**Como evitar:** Último elemento a adicionar em todo HTML. Posição absoluta fixa: canto inferior direito, margem 32-48px. Verificar em todos os slides antes de renderizar.

### 10. Dimensão incorreta (1080×1440 em vez de 1080×1350)
**O que é:** Usar o formato 4:4 ou 3:4 de outros squads em vez do 4:5 deste squad.
**Por que é prejudicial:** Formato 4:5 (1080×1350) é o padrão do squad e ocupa mais espaço no feed, gerando mais impressões. Usar dimensão errada corta conteúdo ou cria barras brancas.
**Como evitar:** body { width: 1080px; height: 1350px; } em todos os HTMLs deste squad.

---

## Sempre Fazer

1. **Verificar slide 1 antes de renderizar o lote** — um erro no design system multiplicado por 10 slides é 10x o retrabalho.
2. **Atribuir a fonte da notícia no último slide** — credibilidade e proteção contra plágio.
3. **Testar o scroll-stop mentalmente antes de aprovar o cover** — "Isso faria você parar de rolar?"
4. **Confirmar o ângulo antes de começar a escrever** — o ângulo errado entrega o produto certo para a audiência errada.
5. **Contar palavras por slide** — 40-80 palavras é a faixa ideal. Abaixo: adicionar contexto. Acima: cortar filler.
