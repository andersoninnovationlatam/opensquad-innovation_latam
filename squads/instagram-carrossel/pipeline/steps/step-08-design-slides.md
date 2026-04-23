---
step: 8
name: design-slides
type: agent
agent: beatriz-briefing
execution: inline
inputFile: squads/instagram-carrossel/output/carousel-content.md
outputFile: squads/instagram-carrossel/output/design-brief.md
---

## Contexto

**Agente:** Beatriz Briefing — Diretora de Arte
**Tarefa:** design-slides (Tarefa 1 de 2)
**Execução:** Inline

O conteúdo foi aprovado. Beatriz Briefing transforma o copy de Carlos Carrossel em briefing visual detalhado por slide. Para cada slide, especifica o tipo de background, especificações técnicas de fotografia (slides ímpares), tipografia e check de branding.

---

## Context Loading

Beatriz Briefing deve ler antes de criar o briefing:

1. `squads/instagram-carrossel/output/carousel-content.md` — conteúdo completo de cada slide
2. `squads/instagram-carrossel/output/content-approval.md` — confirmar aprovação antes de prosseguir
3. `squads/instagram-carrossel/pipeline/data/visual-identity.md` — paleta, tipografia, layout, regras de slides
4. `_opensquad/_memory/guia_diretor_arte.md` — vocabulário técnico obrigatório de câmera, luz e lente
5. `_opensquad/_memory/doc_posicao_logo_logo_conta.md` — regras de posicionamento de branding

---

## Instructions

### Process

1. **Confirmar aprovação do conteúdo** lendo content-approval.md — se REJEITADO, parar e aguardar novo conteúdo

2. **Documentar o design system** que será aplicado (paleta, tipografia, layout) antes do briefing por slide

3. **Para cada slide do carousel-content.md**, gerar briefing com o esqueleto padrão:

   **Slides ímpares (foto conceitual):**
   ```
   Slide [N] (ímpar — foto conceitual):
   Tipo de Background: Foto baseada no texto — [situação descrita]
   Especificações Técnicas:
     - Câmera: [SOMENTE termos do guia_diretor_arte.md]
     - Luz: [SOMENTE termos do guia_diretor_arte.md]
     - Lente: [SOMENTE termos do guia_diretor_arte.md — focal + abertura]
     - Sujeito: [pessoa/objeto, ambiente, expressão/ação]
   Tipografia: [peso, tamanho, elemento]
   Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px
   ```

   **Slides pares (roxo sólido):**
   ```
   Slide [N] (par — fundo sólido roxo):
   Tipo de Background: Fundo roxo #993CB1
   Elementos decorativos: círculos de borda rgba(255,255,255,0.10-0.15) no canto superior direito
   Tipografia: Montserrat Black (900) [tamanho]px para headline; Medium (500) 34px para corpo
   Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px
   ```

4. **Verificar checklist antes de gravar:**
   - [ ] Todos os slides têm tipo de background
   - [ ] Slides ímpares com câmera + luz + lente usando SOMENTE termos do guia
   - [ ] Slides pares com #993CB1 explícito
   - [ ] Branding em 100% dos slides
   - [ ] Font-size mínimo 34px para corpo

5. **Gravar design-brief.md** e apresentar ao usuário para aprovação no Passo 9

### Output Format

```
DESIGN BRIEF — Carrossel "[título]"
Slides: [N] | Template: B — Roxo Sólido
Data: [YYYY-MM-DD]

DESIGN SYSTEM APLICADO:
- Background ímpares: #0d0d14 + radial-gradient(circle, #993CB133, transparent 70%)
- Background pares: #993CB1 sólido
- Accent: #50beba (palavras-chave em títulos)
- Tipografia: Montserrat / Capa 700 68px / Títulos 900 62-72px / Corpo 500 34px / Tags 700 24px
- Padding: 72px | Viewport: 1080×1350px

---

Slide 1 (ímpar — foto conceitual):
[briefing completo no formato padrão]

Slide 2 (par — fundo roxo):
[briefing completo no formato padrão]

[... todos os slides ...]
```

### Output Example

```
DESIGN BRIEF — Carrossel "7 mitos sobre IA que estão travando sua empresa"
Slides: 7 | Template: B — Roxo Sólido
Data: 2026-04-05

DESIGN SYSTEM APLICADO:
- Background ímpares: #0d0d14 + radial-gradient(circle, #993CB133, transparent 70%)
- Background pares: #993CB1 sólido
- Accent: #50beba para palavras-chave em títulos de conteúdo
- Tipografia: Montserrat | Capa Bold 700/68px | Títulos Black 900/62px | Corpo Medium 500/34px | Tags Bold 700/24px
- Padding: 72px todos os lados | Viewport: 1080×1350px | Grid: Flexbox coluna

---

Slide 1 (ímpar — foto conceitual):
Tipo de Background: Foto baseada no texto — executivo em sala de reunião moderna olhando para tela de dashboard
Especificações Técnicas:
  - Câmera: Plano médio (cintura para cima), ângulo neutro
  - Luz: Low key com luz de contorno (rim) — sombras marcadas, contraste alto, sujeito separado do fundo escuro
  - Lente: Teleobjetiva 85mm f/1.8 — compressão e desfoque de fundo com tela de dados visível
  - Sujeito: Executivo (35-45 anos), expressão reflexiva e concentrada, tela de dashboard com gráficos ao fundo
Tipografia: Montserrat Bold (700) 68px para headline de capa; Medium (500) 34px para texto de suporte
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px

Slide 2 (par — fundo sólido roxo):
Tipo de Background: Fundo roxo #993CB1
Elementos decorativos: dois círculos de borda rgba(255,255,255,0.12) e rgba(255,255,255,0.08) — canto superior direito, 400px e 280px
Tipografia: Montserrat Black (900) 62px para headline; Medium (500) 34px para corpo
Check de Branding: logo innovation-latam-logo-white.png + @innovationlatam — canto inferior direito, margem 48px
```

### Veto Conditions

- **NUNCA usar termos fora do guia_diretor_arte.md** para câmera, luz ou lente
- **NUNCA posicionar branding fora do canto inferior direito**
- **NUNCA declarar font-size abaixo de 34px** para corpo de texto
- **PARAR se** content-approval.md indicar REJEITADO ou não existir
- **NÃO renderizar slides** antes do checkpoint de design-approval (Passo 9)

### Quality Criteria

- Briefing completo para todos os slides — nenhum omitido
- Slides ímpares com especificações técnicas nos 3 eixos usando exclusivamente termos do guia
- Slides pares com #993CB1 declarado e elementos decorativos especificados
- Branding confirmado em 100% dos slides com posição e margem
- Design system documentado antes do briefing por slide
- design-brief.md gravado e apresentado ao usuário para aprovação
