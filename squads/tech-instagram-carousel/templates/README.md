# Templates visuais — padrão post-05 (Innovation Latam)

O gerador `scripts/build-carousel-slides.mjs` produz HTML a partir destes padrões (não substitui ficheiros aqui; a lógica está no script):

| Tipo | Uso | Referência aprovada |
|------|-----|---------------------|
| **Cover** | Slide 1 do carrossel — gancho visual + manchete | `slide-titulo` (Montserrat Bold 700, imagem hero, gradiente, destaques dourados, letter-spacing -0.02em) |
| **Content + Image** | Slide 2 — contexto denso com imagem de fundo | `slide-conteudo-imagem` (Montserrat, imagem hero + overlay escuro, headline 46px, body 36px, destaques teal) |
| **Content** | Slides 3+ — resumo, sem título de capa | `slide-conteudo-01` (Montserrat, fundo roxo marca, texto à esquerda, padding 5%, destaques teal) |

Logo branco: **embutido no HTML** em todos os slides (build usa data-URI do PNG em `assets/`).

Assets: `../assets/ai-brain-glow.png`, `../assets/innovation-latam-logo-white.png`.
