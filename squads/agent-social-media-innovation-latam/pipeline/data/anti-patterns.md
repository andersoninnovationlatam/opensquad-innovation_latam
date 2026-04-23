# Anti-Patterns — Social Media Innovation Latam
**Squad:** agent-social-media-innovation-latam
**Marca:** Innovation Latam
**Atualizado:** 2026-04-01

Este arquivo documenta os erros mais comuns na criação de carrosséis para a Innovation Latam.
Cada agente deve consultar este arquivo antes de entregar seu output.

---

## NEVER DO — Copy Anti-Patterns

### 1. Começar o slide 1 com apresentação ou meta-comentário
❌ "Hoje vamos falar sobre inteligência artificial..."
❌ "Conteúdo: Como estruturar um programa de inovação"
❌ "Innovation Latam apresenta: 5 tendências de IA"

**Por quê é prejudicial:** O leitor está em modo de scroll rápido. A primeira fração de segundo decide se ele para ou continua. Apresentações e anúncios de intenção não param scroll — dados e hooks concretos param.

✅ "78% das empresas dizem que IA é prioridade. Só 12% têm um programa real. O que separa os dois grupos?"

---

### 2. Afirmações factuais sem dado ou fonte
❌ "A IA está transformando a inovação corporativa."
❌ "Cada vez mais empresas estão adotando open innovation."
❌ "A maioria dos executivos já conhece sobre startups."

**Por quê é prejudicial:** A audiência da Innovation Latam é formada por executivos e profissionais de inovação — pessoas cíticas e analíticas que descartam copy sem evidência como conteúdo de marketing genérico. Cada afirmação factual precisa de número específico ou fonte identificável.

✅ "43% dos programas de open innovation no Brasil cresceram em 2024. (Abstartups, 2025)"

---

### 3. Copy vazia que fala muito e diz pouco
❌ "A inovação corporativa está evoluindo de formas que nunca vimos antes, criando oportunidades e desafios que exigem uma nova abordagem estratégica para empresas que desejam se manter competitivas."

**Por quê é prejudicial:** Esse tipo de copy pode ser escrita por qualquer marca sobre qualquer tema — ela não diz nada específico. Cada frase deve carregar uma informação ou insight real.

✅ "Empresas com programas estruturados de IA têm 23% mais produtividade que concorrentes sem. (McKinsey, 2025)"

---

### 4. Carrossel sem slide de reflexão — só informação
❌ Slide 1 dado → Slide 2 dado → Slide 3 dado → Slide N CTA

**Por quê é prejudicial:** Dados sem impacto emocional são esquecidos em minutos. A reflexão que "toca na alma" é o que faz o leitor salvar, compartilhar e lembrar. Todo carrossel precisa de um momento de pausa reflexiva antes do CTA.

✅ Sempre inclua um slide de reflexão (penúltimo): síntese emocional, pergunta que incomoda construtivamente, sem dados novos.

---

### 5. CTA genérico desconectado do conteúdo
❌ "Nos siga para mais conteúdo de inovação!"
❌ "Acesse o link na bio pra saber mais."
❌ "Salve este post." (sem contexto)

**Por quê é prejudicial:** CTAs genéricos revelam que o criador não pensou no próximo passo do leitor. Um bom CTA conecta o conteúdo do carrossel a uma ação específica e relevante.

✅ "Salva esse carrossel. Da próxima vez que o board perguntar 'qual é o ROI de inovação', você vai ter os números prontos."

---

### 6. Mais de 5 linhas de texto visível por slide
❌ Parágrafos completos em slides de carrossel
❌ Mais de 4 pontos por slide
❌ Notas de rodapé densas dentro do slide

**Por quê é prejudicial:** Carrosséis são consumidos em mobile, em movimento. Slides densos frustram o leitor e reduzem o tempo de swipe.

✅ Máximo de 4-5 linhas visíveis. Uma ideia. Um impacto.

---

### 7. Slide de reflexão com dado novo
❌ Slide de reflexão: "Além disso, 45% das empresas também relatam que... (Fonte, 2025)"

**Por quê é prejudicial:** O slide de reflexão é síntese emocional, não informação adicional. Inserir dados novos nesse slide transforma a reflexão em mais um slide de conteúdo — a pausa emocional é perdida.

✅ Slide de reflexão: pergunta que conecta os dados já apresentados com a realidade do leitor.

---

## NEVER DO — Design Anti-Patterns (Sistema post-05)

### 8. Usar qualquer fonte diferente de Montserrat
❌ Bebas Neue no slide 1
❌ Inter para o body
❌ Playfair Display para títulos de reflexão
❌ System fonts como fallback primário

**Por quê é prejudicial:** O sistema post-05 é fundamentado em Montserrat. Qualquer outra fonte quebra a consistência da identidade visual e indica que o agente não seguiu o visual-identity.md.

✅ Montserrat em todos os pesos necessários: 500 (Medium), 600 (SemiBold), 700 (Bold), 800-900 (Extra Bold para hero)

---

### 9. Texto sobre imagem sem overlay escuro suficiente
❌ Texto branco sobre foto sem overlay
❌ Overlay rgba(0,0,0,0.3) — muito transparente
❌ Sombra de texto como única proteção de contraste

**Por quê é prejudicial:** WCAG AA exige contraste 4.5:1. Overlay insuficiente sobre imagens é a causa número 1 de falha de contraste no sistema post-05.

✅ Overlay mínimo rgba(21,10,28,0.75) nos slides de imagem (slide 2+). Em fundos com muito detalhe: rgba(21,10,28,0.90+)

---

### 10. Inventar cores fora do sistema de tokens
❌ #FF5733 como destaque para "urgência"
❌ Azul #1DA1F2 para links ou elementos interativos
❌ Verde #00FF00 em qualquer slide

**Por quê é prejudicial:** O sistema post-05 tem uma paleta definida. Qualquer cor fora dos tokens documentados em visual-identity.md viola a identidade visual.

✅ Apenas: roxo bg (#150a1c → #2a1538), teal (#c0fefd), gold (#e8c85c), roxo institucional (#993CB1 para efeitos especiais)

---

### 11. Logo ausente ou posicionado incorretamente
❌ Slide sem logo
❌ Logo no centro ou canto inferior
❌ Logo colorido (não branco)
❌ Logo externo não convertido a data-URI

**Por quê é prejudicial:** O logo branco no canto superior esquerdo é elemento não-negociável do sistema post-05. Sua ausência é falha de identidade de marca que ativa veto automático.

✅ Logo branco via data-URI, canto superior esquerdo, max-width 200px, margem 30px em TODOS os slides.

---

### 12. Todos os slides com o mesmo layout
❌ Todos os slides com fundo roxo sólido, texto esquerda, sem variação
❌ Copiar exatamente o mesmo HTML de um slide para o próximo trocando só o texto

**Por quê é prejudicial:** Ritmo visual monótono reduz engajamento e é causa de veto automático na revisão de qualidade.

✅ Aplicar ao menos 3-4 variações de layout diferentes ao longo do carrossel, conforme documentado em layout-variations.md.

---

### 13. Contador de slides nos HTMLs
❌ "3/8" no canto do slide
❌ Dots de paginação no rodapé
❌ "Slide 3 de 8" em qualquer posição

**Por quê é prejudicial:** Instagram provê navegação nativa. Contadores são redundantes e poluem visualmente o rodapé.

✅ Rodapé com apenas: @innovationlatam esquerda | ARRASTE → direita (só nos slides que não são CTA)

---

### 14. Dependências externas além de Google Fonts
❌ Bootstrap, Tailwind ou qualquer CDN de CSS
❌ Imagens externas via URL (não convertidas a data-URI)
❌ JavaScript de qualquer tipo
❌ Fontes locais por caminho relativo

**Por quê é prejudicial:** O rendering via Playwright não tem acesso a dependências externas não carregadas. Qualquer dependência não resolvida quebra o slide silenciosamente.

✅ HTML auto-suficiente: CSS inline, @import Montserrat Google Fonts, logo via data-URI, sem JS.

---

## ALWAYS DO

1. **Verifique o slide 1 como se você fosse um executivo desconhecido no feed** — Você pararia de scrollar SEM saber o que é a Innovation Latam? Se não, reescreva o hook.

2. **Inclua pelo menos um dado com fonte em cada carrossel** — Dados verificáveis são a diferença entre autoridade e opinião para a audiência corporativa.

3. **Leia o visual-identity.md ANTES de criar o primeiro HTML** — Os tokens são o contrato visual. Não há criatividade fora dos tokens.

4. **Renderize e verifique o slide 1 antes de renderizar todos os demais** — Erros de espaçamento ou fonte no slide 1 se propagam por todo o carrossel se não detectados cedo.

5. **Mantenha a legenda abaixo de 2.000 caracteres** — Mesmo o limite sendo 2.200, hashtags ocupam espaço e a legenda precisa respirar.

6. **Garanta que o penúltimo slide é de reflexão emocional** — Não apenas informação. Uma pergunta, uma afirmação que incomoda, ou uma perspectiva que o leitor não tinha antes.

7. **Verifique contraste em cada slide individualmente** — Especialmente slides 1 e 2 com imagens de fundo. Use a fórmula de luminância relativa WCAG, não confie apenas no olho.
