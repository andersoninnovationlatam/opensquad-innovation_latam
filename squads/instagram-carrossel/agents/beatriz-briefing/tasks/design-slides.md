---
task: design-slides
order: 1
agent: beatriz-briefing
input:
  - squads/instagram-carrossel/output/carousel-content.md
  - squads/instagram-carrossel/output/content-approval.md
  - squads/instagram-carrossel/pipeline/data/visual-identity.md
  - _opensquad/_memory/guia_diretor_arte.md
  - _opensquad/_memory/doc_posicao_logo_logo_conta.md
output: squads/instagram-carrossel/output/design-brief.md
---

## Process

### Passo 1 — Ler todos os arquivos de entrada
Ler `squads/instagram-carrossel/output/carousel-content.md` para extrair:
- Número total de slides e estrutura (formato escolhido)
- Headline e texto de suporte de cada slide
- Background descrito pelo Copywriter para cada slide
- Tipo de cada slide (ímpar = foto, par = roxo)

Ler `squads/instagram-carrossel/output/content-approval.md` para confirmar que o conteúdo foi aprovado.

Ler `squads/instagram-carrossel/pipeline/data/visual-identity.md` para internalizar:
- Color palette completa (Primary #993CB1, Dark BG #0d0d14, Accent #50beba, etc.)
- Especificações tipográficas por elemento (capa, títulos, corpo, tags, rodapé)
- Regras de layout (padding 72px, Flexbox em coluna, border-radius)
- Regras de composição (hierarquia visual, swipe hint, footer)

Ler `_opensquad/_memory/guia_diretor_arte.md` para memorizar o vocabulário técnico de:
- Posicionamento de câmera / enquadramento
- Luz (key, fill, contorno, esquemas)
- Lente / ótica (focal, abertura)

Ler `_opensquad/_memory/doc_posicao_logo_logo_conta.md` para confirmar:
- Posição do branding: canto inferior direito, margem mínima 32-48px
- Elementos: logo `innovation-latam-logo-white.png` + handle `@innovationlatam`
- Contraste sobre foto e sobre fundo roxo

### Passo 2 — Criar briefing para cada slide usando o esqueleto padrão
Para cada slide do carousel-content.md, gerar um briefing usando EXATAMENTE o esqueleto abaixo.

**Para slides ímpares (1, 3, 5, 7, 9):**
```
Slide [N] (ímpar — foto conceitual):
Tipo de Background: Foto baseada no texto do Copywriter
Especificações Técnicas:
  - Câmera: [termo exato do guia_diretor_arte.md — posicionamento de câmera]
  - Luz: [termo exato do guia_diretor_arte.md — esquema de luz]
  - Lente: [termo exato do guia_diretor_arte.md — focal + abertura]
  - Sujeito: [descrição do sujeito, ambiente e expressão]
Tipografia: Montserrat [peso] ([número]) [tamanho]px para [elemento]; [repetir para outros elementos]
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px
```

**Para slides pares (2, 4, 6, 8):**
```
Slide [N] (par — fundo sólido roxo):
Tipo de Background: Fundo roxo #993CB1
Elementos decorativos: círculos de borda rgba(255,255,255,0.10-0.15) no canto superior direito
Tipografia: Montserrat Black (900) [tamanho]px para headline; Medium (500) 34px para corpo
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px
```

**Regras obrigatórias:**
- Câmera, Luz e Lente: SOMENTE termos do guia_diretor_arte.md — nunca inventar termos
- Capa (slide 1): Montserrat Bold (700), mínimo 68px para o headline
- Títulos de conteúdo (slides 2+): Montserrat Black (900), 62-72px
- Corpo/texto de suporte: Montserrat Medium (500), 32-34px
- Branding: verificar contraste — sobre foto dark, usar logo branco; sobre roxo, logo branco com opacidade plena

### Passo 3 — Verificar consistência do briefing
Antes de gravar o output, fazer checklist:

- [ ] Todos os slides têm tipo de background declarado
- [ ] Slides ímpares têm especificações técnicas completas (câmera + luz + lente)
- [ ] Todos os termos de câmera/luz/lente estão no guia_diretor_arte.md
- [ ] Slides pares têm roxo #993CB1 declarado explicitamente
- [ ] Branding confirmado em 100% dos slides
- [ ] Font-size mínimo 34px para corpo em todos os slides
- [ ] Font-weight mínimo 500 em todos os elementos de corpo

### Passo 4 — Gravar design-brief.md
Gravar o briefing completo em `squads/instagram-carrossel/output/design-brief.md` e apresentar ao usuário para aprovação antes de renderizar.

---

## Output Format

```
DESIGN BRIEF — Carrossel "[título do carrossel]"
Slides: [N] | Template: B — Roxo Sólido
Data: [YYYY-MM-DD]

---

Slide 1 (ímpar — foto conceitual):
Tipo de Background: Foto baseada no texto — [descrição da situação]
Especificações Técnicas:
  - Câmera: [posicionamento do guia]
  - Luz: [esquema do guia]
  - Lente: [focal e abertura do guia]
  - Sujeito: [pessoa/objeto, ambiente, expressão/ação]
Tipografia: Montserrat Bold (700) 68px para headline de capa; Medium (500) 34px para subtítulo
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px

Slide 2 (par — fundo sólido roxo):
Tipo de Background: Fundo roxo #993CB1
Elementos decorativos: círculos de borda rgba(255,255,255,0.10-0.15) no canto superior direito
Tipografia: Montserrat Black (900) 62px para headline; Medium (500) 34px para corpo
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px

[... continuar para todos os slides ...]
```

---

## Output Example

```
DESIGN BRIEF — Carrossel "7 mitos sobre IA que estão travando sua empresa"
Slides: 7 | Template: B — Roxo Sólido
Data: 2026-04-05

---

Slide 1 (ímpar — foto conceitual):
Tipo de Background: Foto baseada no texto — executivo em sala de reunião moderna olhando para tela de dashboard
Especificações Técnicas:
  - Câmera: Plano médio (cintura para cima), ângulo neutro
  - Luz: Low key com luz de contorno (rim) — sombras marcadas, contraste alto, sujeito separado do fundo escuro
  - Lente: Teleobjetiva 85mm f/1.8 — compressão e desfoque de fundo com tela de dados visível mas desfocada
  - Sujeito: Executivo (masculino ou feminino, 35-45 anos), terno ou blazer, expressão reflexiva e concentrada, tela de dashboard com gráficos ao fundo
Tipografia: Montserrat Bold (700) 68px para headline de capa; Medium (500) 34px para texto de suporte
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px; logo branco sobre fundo escuro, alto contraste

Slide 2 (par — fundo sólido roxo):
Tipo de Background: Fundo roxo #993CB1
Elementos decorativos: dois círculos de borda rgba(255,255,255,0.12) e rgba(255,255,255,0.08) no canto superior direito, escalonados (400px e 280px de diâmetro)
Tipografia: Montserrat Black (900) 62px para headline; Medium (500) 34px para corpo de texto
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px; handle @innovationlatam em rgba(255,255,255,0.75)

Slide 3 (ímpar — foto conceitual):
Tipo de Background: Foto baseada no texto — equipe diversa colaborando ao redor de laptop em ambiente aberto
Especificações Técnicas:
  - Câmera: Plano americano (joelho para cima), ligeiramente contra-plongée
  - Luz: High key com luz difusa — ambiente claramente iluminado, sombras suaves, sensação de abertura e colaboração
  - Lente: Grande angular 35mm — capturar o ambiente e a equipe com profundidade de campo maior
  - Sujeito: 3-4 profissionais diversos (gênero e etnia), laptop no centro da mesa, expressões engajadas e positivas
Tipografia: Montserrat Black (900) 62px para headline; Medium (500) 34px para corpo
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px

Slide 4 (par — fundo sólido roxo):
Tipo de Background: Fundo roxo #993CB1
Elementos decorativos: dois círculos de borda rgba(255,255,255,0.10) e rgba(255,255,255,0.07) no canto superior direito
Tipografia: Montserrat Black (900) 62px para headline; Medium (500) 34px para corpo
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px

Slide 5 (ímpar — foto conceitual):
Tipo de Background: Foto baseada no texto — gráfico de crescimento exponencial em tela grande, executivo observando
Especificações Técnicas:
  - Câmera: Plano aberto (long shot), ângulo neutro
  - Luz: Contraluz — fonte de luz atrás do sujeito criando silhueta ou halo, tela iluminada em primeiro plano
  - Lente: Grande angular 28mm — capturar sala inteira com tela de dados dominando o frame
  - Sujeito: Executivo de costas, silhueta contra tela de gráfico de crescimento, postura confiante
Tipografia: Montserrat Black (900) 62px para headline; Medium (500) 34px para corpo
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px

Slide 6 (par — fundo sólido roxo):
Tipo de Background: Fundo roxo #993CB1
Elementos decorativos: dois círculos de borda rgba(255,255,255,0.12) e rgba(255,255,255,0.08) no canto superior direito
Tipografia: Montserrat Black (900) 62px para headline; Medium (500) 34px para corpo
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px

Slide 7 (ímpar — foto conceitual, CTA):
Tipo de Background: Foto baseada no texto — skyline urbano com sobreposição digital em tons de roxo
Especificações Técnicas:
  - Câmera: Plano aberto (long shot), ângulo plongée suave
  - Luz: Luz natural / golden hour com pós-processamento em tons frios (filtro azul-roxo)
  - Lente: Grande angular 24mm — skyline completo com profundidade de campo total
  - Sujeito: Skyline de cidade moderna (São Paulo ou genérica), luzes da cidade ao entardecer, sobreposição de grade digital em roxo transparente
Tipografia: Montserrat Black (900) 62px para headline CTA; Medium (500) 34px para texto de suporte
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px
```

---

## Quality Criteria

1. Briefing completo para todos os slides do carousel-content.md — nenhum slide pode ser omitido
2. Slides ímpares com especificações técnicas nos três eixos: Câmera, Luz e Lente — todos usando exclusivamente termos do guia_diretor_arte.md
3. Slides pares com Tipo de Background = "Fundo roxo #993CB1" e elementos decorativos declarados
4. Check de Branding confirmado em 100% dos slides com posição e margem especificadas
5. Font-size mínimo 34px para corpo declarado em todos os slides
6. Capa (slide 1) com Montserrat Bold (700) 68px+ — não Black nem peso abaixo de 700
7. Output gravado em design-brief.md antes da aprovação; não renderizar até checkpoint

---

## Veto Conditions

- **NUNCA usar termos de câmera/luz/lente fora do guia_diretor_arte.md** — verificar cada termo antes de gravar
- **NUNCA posicionar branding fora do canto inferior direito** — mesmo se parecer melhor composicionalmente
- **NUNCA declarar font-size abaixo de 34px para corpo** — mínimo absoluto de legibilidade mobile
- **NUNCA renderizar slides antes do checkpoint de design-approval** — aguardar aprovação do briefing
- **PARAR se** carousel-content.md não existir ou content-approval.md não indicar aprovação
