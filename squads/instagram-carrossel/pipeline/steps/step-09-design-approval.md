---
step: 9
name: design-approval
type: checkpoint
inputFile: squads/instagram-carrossel/output/design-brief.md
outputFile: squads/instagram-carrossel/output/design-approval.md
---

## Contexto

Beatriz Briefing concluiu o briefing visual. Antes de renderizar os slides HTML, você precisa revisar e aprovar as especificações de design.

**Por que este checkpoint é importante:** Uma vez que a renderização começa, todos os slides serão gerados com base neste briefing. Problemas de especificação detectados aqui custam muito menos do que após a renderização completa.

**O que revisar:**
- Tipo de background de cada slide (foto conceitual vs roxo sólido)
- Especificações técnicas de fotografia dos slides ímpares (câmera, luz, lente, sujeito)
- Tom e composição descritos para cada slide
- Presença do branding em todos os slides

---

## Context Loading

Ler `squads/instagram-carrossel/output/design-brief.md` e apresentar ao usuário.

---

## Instructions

### Process

1. **Apresentar o design brief completo** ao usuário:
   - Design system aplicado (paleta, tipografia, viewport)
   - Briefing de cada slide com todas as especificações

2. **Destacar os pontos críticos** para revisão:
   - Slides ímpares: especificações técnicas (câmera, luz, lente) e sujeito descrito
   - Slides pares: confirmação de fundo #993CB1 e elementos decorativos
   - Branding: logo + handle no canto inferior direito de todos os slides
   - Capa (slide 1): Montserrat Bold (700) 68px+ declarado

3. **Solicitar decisão** do usuário:
   - **APROVAR** — prosseguir para renderização (Passo 10)
   - **AJUSTAR** — corrigir especificação específica antes de renderizar
   - **REJEITAR** — refazer o briefing completo (retornar ao Passo 8)

4. **Gravar design-approval.md** com a decisão e avançar conforme decisão

### Output Format

Apresentar ao usuário:
```
## Design Brief para Aprovação

**Design System:**
[resumo de paleta, tipografia, viewport]

---

**Slide 1 — Cover (ímpar)**
Background: [tipo e situação]
Câmera: [especificação]
Luz: [esquema]
Lente: [focal e abertura]
Sujeito: [descrição]
Tipografia: [peso e tamanho]
Branding: [posição confirmada]

[... todos os slides ...]

---
APROVAR (renderizar slides) ou AJUSTAR/REJEITAR com feedback:
```

Após decisão, gravar em `squads/instagram-carrossel/output/design-approval.md`:
```
DECISÃO: [APROVADO / AJUSTADO / REJEITADO]
Data: [YYYY-MM-DD]
Ajustes solicitados: [se houver]
Próxima ação: [render-slides se APROVADO / design-slides se REJEITADO]
```

### Output Example

```
## Design Brief para Aprovação

**Design System:**
Viewport: 1080×1350px | Padding: 72px | Fonte: Montserrat
Fundo ímpares: #0d0d14 + glow roxo radial | Fundo pares: #993CB1
Tipografia: Capa Bold/68px | Títulos Black/62px | Corpo Medium/34px | Tags Bold/24px

---

**Slide 1 — Cover (ímpar)**
Background: Foto — executivo em sala de reunião olhando para dashboard
Câmera: Plano médio (cintura para cima)
Luz: Low key com luz de contorno (rim)
Lente: Teleobjetiva 85mm f/1.8
Sujeito: Executivo, expressão reflexiva, tela de dados ao fundo desfocada
Tipografia: Montserrat Bold (700) 68px para headline; Medium (500) 34px para suporte
Branding: logo + @innovationlatam — canto inferior direito, margem 48px ✓

**Slide 2 — Mito 1 (par)**
Background: Fundo roxo #993CB1 sólido
Decorativos: círculos de borda rgba(255,255,255,0.12) e rgba(255,255,255,0.08) — canto superior direito
Tipografia: Montserrat Black (900) 62px para headline; Medium (500) 34px para corpo
Branding: logo + @innovationlatam — canto inferior direito, margem 48px ✓

[... slides 3-7 ...]

---
APROVAR (renderizar 7 slides) ou AJUSTAR/REJEITAR com feedback:
```

### Veto Conditions

- **NÃO iniciar renderização** sem aprovação explícita do usuário — este checkpoint protege contra renderização com briefing incorreto
- **NÃO assumir** que ausência de feedback é aprovação — aguardar resposta explícita
- **Se AJUSTADO:** aplicar as correções antes de gravar a aprovação e avançar

### Quality Criteria

- Design brief apresentado integralmente — não resumido
- Pontos críticos destacados para revisão fácil do usuário
- Decisão explícita registrada em design-approval.md antes de avançar
- Nenhum slide renderizado antes desta aprovação
