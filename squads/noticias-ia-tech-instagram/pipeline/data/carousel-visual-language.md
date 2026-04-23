# Linguagem visual — carrosséis de notícias (Instagram)

Referência obrigatória para **todos** os PNGs gerados neste squad: estilo “notícia / tech editorial” alinhado aos exemplos em `pipeline/assets/examples/`, com **marca Innovation Latam sempre visível**.

## Logo (obrigatório)

| Item | Regra |
|------|--------|
| **Ficheiro (canónico)** | `squads/noticias-ia-tech-instagram/pipeline/assets/innovation-latam-logo.png` — **única fonte**; substituir este PNG para mudar a marca em todo o pipeline. |
| **Posição** | Canto **superior esquerdo**, margem segura (~40–56 px das bordas) |
| **Tamanho** | Largura máxima recomendada **280–320 px** (proporção original do PNG) |
| **Onde** | **Todos** os slides do carrossel, sem exceção (incluindo capa e créditos) |
| **Contraste** | Se o fundo for claro, manter o logo como no ficheiro; se necessário, usar sombra discreta ou faixa escura mínima por baixo **sem** alterar as cores da marca |

**Nunca** entregar carrossel sem o logo aplicado. **Fluxo preferido:** desenhar cada slide em **HTML/CSS** (logo em `<img src="logo.png">` no layout), depois converter para PNG com o script **`scripts/render-carousel-html-to-png.mjs`** (Playwright). **Fallback:** se os PNGs forem gerados por outra ferramenta sem logo, usar `scripts/apply-innovation-logo.py`.

## Exemplos de referência (`pipeline/assets/examples/`)

| Ficheiro | O que copiar |
|----------|----------------|
| `01-noticia-openai-chef.png` | Capa com cena forte + faixa inferior escura + headline em caixa alta; hierarquia clara; “desliza” / paginação. |
| `02-google-campus-headline.png` | Fotografia real + **gradiente escuro na zona do texto** para legibilidade; headline grande na parte inferior. |
| `03-ratos-card-dark.png` | Fundo preto, acento **amarelo** em etiquetas/tags, cartão branco para “recorte” de artigo, headline editorial. |
| `04-ratos-serif-body.png` | Mistura **serif itálico** (destaque) + **sans** no corpo; texto longo legível em mobile. |
| `05-ratos-number-stat.png` | Número grande como âncora visual + linha de acento + corpo conversacional. |

Não é preciso copiar o conteúdo desses exemplos — só **ritmo**, contraste, hierarquia e sensação de “post de notícia tech”.

## Pipeline HTML → PNG

1. Gerar `slide-01.html` … `slide-NN.html` em `carousel-package/<vN>/html/` (tipografia e cores alinhadas aos exemplos; **imagem de fundo** por slide + overlays; logo copiado como `logo.png` junto aos HTML). O script `render-carousel-html-to-png.mjs` usa o array `DEFAULT_ILLUSTRATIONS` (URLs Unsplash) — editar no script para alinhar imagens ao tema da notícia.
2. Na raiz do repo: `npm install` e `npx playwright install chromium` (uma vez por máquina).
3. Executar:
   ```bash
   node squads/noticias-ia-tech-instagram/scripts/render-carousel-html-to-png.mjs \
     --draft squads/noticias-ia-tech-instagram/output/<RUN>/v3/instagram-draft.md \
     --png-out squads/noticias-ia-tech-instagram/output/<RUN>/carousel-package/v1
   ```
4. Opcional: `--html-only` para só gerar HTML e abrir no browser para revisão.

## Tipografia

### Combinação canónica (Innovation Latam)

| Nível | Fonte | Peso | Tamanho (1080×1440) |
|-------|-------|------|----------------------|
| Título / Headline | **Montserrat** | Bold (700) | 80–100 px |
| Subtítulo | **Montserrat** | SemiBold (600) | 48–64 px |
| Corpo do slide | **Open Sans** | Regular / Medium (400–500) | 32–40 px |
| Legenda / caption | **Open Sans** | Regular (400) | 24–28 px |

> **Regra de ouro:** máximo **2 famílias** por carrossel. Nunca usar fonte decorativa no corpo. Nunca usar peso < 400 em mobile (fine/thin é ilegível em ecrã pequeno).

Alternativas aceites se Montserrat/Open Sans indisponíveis:
- Título: Poppins Bold · Bebas Neue
- Corpo: Lato Regular · Nunito Regular

Hierarquia obrigatória: título **sempre** mais grosso que o corpo — proporção mínima 1.5× entre níveis. Se o olho não distingue imediatamente o título do texto de apoio, a hierarquia está errada.

---

## Paleta de cores — Innovation Latam

### Fundo escuro (padrão deste squad)

| Papel | Hex | Uso |
|-------|-----|-----|
| Background principal | `#191d24` | Fundo sólido da maioria dos slides |
| Background alternativo | `#f21f91` (magenta) | Slides de destaque / CTA — usar com moderação |
| Texto principal | `#FFFFFF` | Headlines, corpo |
| Texto secundário | `#D0D0D0` | Apoio, legendas, fonte da notícia |
| Acento corporativo 1 | `#76cecb` (azul-esverdeado) | Palavras-chave, tags, ícones |
| Acento corporativo 2 | `#FFD600` (amarelo) | Números grandes, destaques críticos |

> Usar **no máximo 1 cor de acento por slide**. Não misturar `#76cecb` e `#FFD600` no mesmo quadro.

### Fundo com imagem (slides de capa)

- Overlay escuro obrigatório: `rgba(0,0,0,0.50–0.70)` ou gradiente de baixo para cima
- Texto branco `#FFFFFF` por cima
- Contraste mínimo WCAG AA: 4.5:1 para corpo, 3:1 para títulos grandes (> 18px bold)
- **Nunca** colocar texto directamente sobre zona clara ou texturizada sem scrim

---

## Parâmetros técnicos

- **Tipografia (slides HTML→PNG):** definida em `scripts/render-carousel-html-to-png.mjs` (Google Fonts no `<head>` + `font-family` no CSS). Família preferida: **Montserrat** (títulos) + **Open Sans** (corpo). Para mudar, editar esse ficheiro.
- **Proporção:** 3:4 (feed Instagram), **1080×1440 px** por slide.
- **Paleta activa:** veja tabela "Paleta de cores — Innovation Latam" acima.
- **Capa:** promessa clara no primeiro slide; combinar **imagem ilustrativa** (stock alinhada ao tema) com **gradiente / overlay escuro** na zona do texto para não competir com a leitura.
- **Slides interiores:** um conceito principal por slide; **sempre** imagem de fundo temática + **overlay** (gradiente ou `rgba` 0,65–0,88) para o texto permanecer legível; usar `text-shadow` em títulos quando necessário.
- **Regra de ouro:** a fotografia ilustra o conteúdo; o texto fica **sempre** por cima de áreas escurecidas ou em painel semi-opaco — nunca texto directamente sobre zonas muito claras ou muito ocupadas.
- **Posição do texto:** com imagem de fundo → bloco na **parte inferior**, **alinhado à esquerda**; sem imagem → painel **centrado** no quadro com texto **alinhado à esquerda** dentro do painel. **Não** incluir na imagem tags entre colchetes nem URL/fonte da notícia. **Handle** `@innovationlatam` no canto **inferior direito** em todos os slides.

---

## Composição e ritmo visual

### Hierarquia de leitura (obrigatória)

O olho deve percorrer o slide nesta ordem sem esforço:

1. **Título** (maior, mais gordo)
2. **Destaque** — palavra(s) em cor de acento ou peso maior
3. **Texto de apoio** (menor, mais leve)

Nunca deixar todos os elementos com o mesmo peso visual.

### Espaço vazio (respiração)

- Margem mínima das bordas: **80 px** em todos os lados
- Espaçamento entre linhas: **1.2–1.5**
- Espaço entre blocos de texto: ≥ 48 px
- Design bom = espaço + foco. Poluição visual destrói engajamento.

### 1 ideia por slide

- Ideal: **1 conceito central** por slide
- Máximo: 2–3 linhas de texto de apoio
- Carrossel não é blog — o leitor desliza, não lê

### Consistência entre slides

Todos os slides do mesmo carrossel devem usar:
- Mesma família tipográfica
- Mesma paleta de cores
- Mesmo estilo de layout (posição do logo, handle, margens)

Consistência cria identidade de marca reconhecível ao deslizar.

### Elementos que aumentam performance

| Elemento | Como usar |
|----------|-----------|
| **Destaque de palavras** | Cor de acento (`#76cecb` ou `#FFD600`) em 1–2 palavras-chave por slide |
| **Ícones simples** | ✔ ❌ → para guiar leitura; não exceder 2 por slide |
| **Linhas / divisores** | Separar título do corpo; 1–2 px, cor de acento ou cinza claro |
| **Número grande** | Âncora visual quando há estatística relevante (ver exemplo `05-ratos-number-stat.png`) |
| **Emojis** | Apenas para guiar leitura no copy; **não** no texto dos slides HTML |

---

## Estrutura modelo de carrossel (Tech/IA)

### Slide 1 — Hook (capa)
- Imagem ilustrativa + overlay escuro
- Título grande (80–100 px): promessa ou pergunta provocativa
- Ex.: "IA Revoluciona [Setor]: 4 Tendências de 2026"
- Logo superior esquerdo + handle inferior direito

### Slides 2–(N-1) — Conteúdo
- 1 notícia ou insight por slide
- Headline em destaque (acento corporativo)
- Texto de apoio em branco ou cinza claro
- Imagem de fundo temática + overlay

### Slide final — CTA
- Fundo sólido (`#191d24` ou `#f21f91`)
- "Acompanhe com a Innovation Latam"
- Handle / canais (@innovationlatam, LinkedIn, site)
- Logo centralizado ou posicionado com destaque



## Erros que destroem o post

| Erro | Por que falha |
|------|---------------|
| Texto pequeno (< 24 px) | Ilegível em mobile |
| Muito texto por slide | Leitor não desliza |
| Baixo contraste (< 4.5:1) | Inacessível e suprimido pelo algoritmo |
| 3 ou mais famílias tipográficas | Poluição visual, falta de identidade |
| Fundo com imagem sem overlay | Texto invisível sobre zonas claras |
| Todos os elementos com o mesmo peso | Sem hierarquia, olho não sabe onde focar |
| Slide sem ideia clara | Sem motivo para deslizar |

---

## Checklist antes de ENTREGA

- [ ] Pasta `html/` com `slide-NN.html` e `logo.png` (ou documentação do gerador).
- [ ] Cada `slide-NN.png` tem o logo Innovation no canto superior esquerdo.
- [ ] Estilo geral condiz com os exemplos (contraste, hierarquia, “notícia”).
- [ ] Último slide com fonte/URL da notícia (como já definido no roteiro).
- [ ] Tipografia: máximo 2 famílias; títulos em Montserrat Bold, corpo em Open Sans.
- [ ] Tamanho de texto: título ≥ 80 px, corpo ≥ 32 px, caption ≥ 24 px.
- [ ] Paleta: fundo `#191d24` ou imagem com overlay; texto `#FFFFFF`/`#D0D0D0`; acento `#76cecb` ou `#FFD600`.
- [ ] Contraste WCAG AA: ≥ 4.5:1 para corpo, ≥ 3:1 para títulos grandes.
- [ ] Margem mínima de 80 px em todas as bordas.
- [ ] Máximo 1 ideia por slide; nenhum slide excede 3 linhas de texto de apoio.
- [ ] Hierarquia visual clara: título > destaque > apoio — sem níveis de mesmo peso.
- [ ] Consistência: mesma fonte, mesma paleta, mesmo layout em todos os slides.
- [ ] Zoom não necessário para ler qualquer elemento em tela de smartphone.
