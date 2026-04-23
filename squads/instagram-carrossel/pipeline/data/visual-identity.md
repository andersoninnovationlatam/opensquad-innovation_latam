# Visual Identity — Instagram Carrossel Innovation Latam

Template aprovado: **B — Roxo Sólido**
Aprovado em: 2026-04-05

---

## Color Palette

- **Primary:** `#993CB1` — fundo sólido dos slides pares (cor institucional Innovation Latam)
- **Accent:** `#50beba` — destaques, palavras-chave, elementos de contraste em títulos
- **Text:** `#FFFFFF` — texto principal em todos os slides
- **Text Muted:** `rgba(255,255,255,0.70-0.85)` — subtextos e textos de suporte
- **Overlay Light:** `rgba(255,255,255,0.15-0.25)` — cards de item, elementos de fundo nos slides pares
- **Dark BG (slides ímpares):** `#0d0d14` — fundo escuro para slides com foto conceitual

## Typography

- **Família:** `Montserrat` (Google Fonts) — obrigatória em todos os slides
- **Título de capa (slide 1):** Montserrat Bold (700), mínimo 68px
- **Títulos de conteúdo:** Montserrat Black (900), 62-72px
- **Subtítulos / texto de suporte:** Montserrat Medium (500), 32-34px
- **Tags / labels:** Montserrat Bold (700), 22-24px, uppercase, letter-spacing 2-3px
- **Rodapé / handle:** Montserrat Bold (700) para nome + Medium (500) para handle, 20px
- **Mínimos absolutos:** Hero 58px, Heading 43px, Body 34px, Caption 24px

## Layout

- **Viewport:** 1080×1350 px (formato 4:5, vertical portrait)
- **Padding:** 72px em todos os lados
- **Grid:** Flexbox em coluna — `display: flex; flex-direction: column`
- **Espaçamento entre seções:** 20-48px conforme hierarquia
- **Border radius dos cards:** 16px (itens) / 100px (tags pill)

## Slide Composition Rules

### Slides ímpares (1, 3, 5, 7…) — Com foto conceitual
- Fundo: `#0d0d14` (escuro) com glow roxo `radial-gradient(circle, #993CB133, transparent 70%)`
- Contém: foto/imagem conceitual descrita pelo Diretor de Arte
- Barra de destaque: linha vertical `#993CB1` + label de categoria
- Título grande (700-900 weight, 68px+)
- **Especificar sempre:** câmera + luz + lente (conforme `guia_diretor_arte.md`)

### Slides pares (2, 4, 6, 8…) — Fundo sólido roxo
- Fundo: `#993CB1` obrigatório
- Elementos decorativos: círculos de borda `rgba(255,255,255,0.10-0.15)` no canto superior direito
- Tag de categoria: pill com `rgba(255,255,255,0.20)`, uppercase, 24px
- Título: Montserrat 900, 62-72px
- Conteúdo: lista de itens com cards `rgba(255,255,255,0.15)` ou texto corrido com `body-text`

## Footer / Branding (TODOS OS SLIDES — obrigatório)

- **Posição:** canto inferior direito
- **Elementos:** (1) nome `INNOVATION LATAM` em 20px bold + (2) handle `@innovationlatam` em 20px medium
- **Logo:** `innovation-latam-logo-white.png` — usar como `<img>` com width 48px quando disponível
  - Caminho: `squads/instagram-carrossel/assets/innovation-latam-logo-white.png`
  - Fallback quando arquivo ausente: `<div>IL</div>` com fundo `rgba(255,255,255,0.25)`
- **Separador:** `border-top: 1px solid rgba(255,255,255,0.25)` acima do rodapé
- **Margem mínima das bordas:** 32-48px

## Composition Rules

- **Visual hierarchy:** Tag → Título → Corpo/Lista → Swipe hint → Rodapé
- **Swipe hint:** "Arraste para continuar →" em 24px, `rgba(255,255,255,0.60)` — omitir no último slide
- **Último slide (CTA):** substituir swipe hint por CTA direcional (ex.: "Comenta abaixo", "Link na bio")
- **Sem contadores de slide:** nunca incluir "1/8" ou similar — Instagram tem navegação nativa

## Adaptation Rules

- **Cor em títulos:** use `color: #50beba` para destacar palavras-chave no título (ex.: anos, números, termos-chave)
- **Quantidade de itens em lista:** 3-4 por slide para manter legibilidade e espaçamento
- **Quando usar texto corrido vs lista:** listas para dicas/passos; texto corrido para tese/argumento
- **Slides de transição:** usar tag diferente (ex.: "Insights", "Dados", "Por quê?") para sinalizar mudança de bloco narrativo
- **Destaques em accent:** `color: #50beba` somente em 1-2 palavras por título — nunca em blocos de texto
