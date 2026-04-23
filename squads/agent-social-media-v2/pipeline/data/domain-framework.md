# Domain Framework — Social Media Innovation Latam v2
**Squad:** agent-social-media-v2
**Domínio:** Carrosséis Instagram para Inovação Corporativa
**Última Atualização:** 2026-04-01

---

## Visão Geral do Domínio

Este squad produz carrosséis de Instagram para a Innovation Latam — o maior marketplace B2B de inovação corporativa da América Latina. O conteúdo é direcionado a profissionais de inovação, executivos C-level, gestores de startups e empreendedores corporativos.

O pipeline transforma um texto/notícia em `input/` em slides **JPEG** renderizados via Playwright (`inject-bg-and-render.mjs`), prontos para publicação no feed Instagram.

---

## Parte 1: Framework Editorial — Os 5 Ângulos Virais

### Definição de Ângulo

Um ângulo é a perspectiva emocional usada para contar UM conteúdo. A MESMA notícia produz carrosséis completamente diferentes dependendo do ângulo escolhido.

### Os 5 Ângulos Padrão para Conteúdo de Inovação Corporativa

| Ângulo | Emoção Primária | Hook Pattern | Ideal Para |
|--------|----------------|--------------|------------|
| Medo | Urgência + Risco | "Se sua empresa não fizer X agora, Y vai acontecer" | Dados de ameaça competitiva |
| Oportunidade | FOMO + Esperança | "Esta janela de vantagem vai fechar em [prazo]" | Tendências emergentes |
| Educacional | Segurança + Competência | "Como [mecanismo] funciona — explicado em [N] slides" | Tutoriais e frameworks |
| Contrário | Surpresa + Curiosidade | "O que ninguém te conta sobre [tema consolidado]" | Dados contraintuitivos |
| Inspiracional | Pertencimento + Propósito | "Imagine como será sua empresa quando [transformação]" | Cases de sucesso |

### Critérios de Seleção de Ângulo

Carlos Conteúdo auto-seleciona o ângulo seguindo esta lógica:
1. **Match com o dado-âncora**: o ângulo que faz o dado-âncora brilhar mais
2. **Nível de consciência da audiência**: iniciantes → Educacional/Oportunidade; avançados → Contrário/Medo
3. **Tipo de conteúdo**: notícia factual → Oportunidade/Medo; metodologia → Educacional; debate → Contrário
4. **Evitar saturação**: não repetir o mesmo ângulo em posts consecutivos

---

## Parte 2: Estrutura de Slides — Anatomia do Carrossel

### Contagem de Slides

- **Fixo:** **6 slides** por carrossel (não gerar 5, 7 ou 8).

### Papel de Cada Slide

| Posição | Papel | Regras |
|---------|-------|--------|
| Slide 1 | Hook âncora | Dado mais forte. Máx 2 linhas. Passa o scroll-stop test. Nunca começa com marca ou apresentação. |
| Slide 2 | Contexto | Por que esse dado importa? O que ele revela? Imagem full-bleed com overlay. Frases curtas (norma do squad). |
| Slides 3 e 4 | Desenvolvimento | 1 ideia por slide. Frases curtas; preferir ≤3 linhas visíveis. Cada slide avança a narrativa. Sem repetição. |
| Slide 5 | Reflexão | Síntese emocional. Pergunta que incomoda construtivamente. NÃO um dado novo. Tratamento visual distinto. |
| Slide 6 | CTA | 2 ações: salvar + comentar. Conectado especificamente ao tema. Tratamento visual distinto. |

### Regras de Copy por Slide

1. Slide 1 abre com DADO ÂNCORA — nunca com nome da marca, "Hoje vamos falar" ou qualquer apresentação
2. Cada slide tem NO MÁXIMO 4-5 linhas visíveis de texto
3. Slides conectados em sequência lógica — cada um é consequência do anterior
4. Nenhuma informação repetida entre slides
5. Slide de reflexão: síntese emocional, pergunta que incomoda, NÃO um dado novo
6. CTA: específico ao tema ("Salva pra mostrar pra quem ainda diz que [X]"), duas ações (salvar + comentar)
7. Caption Instagram: hook nos primeiros 125 chars + body + pergunta final + 8-12 hashtags

---

## Parte 3: Sistema Visual — Padrão post-05

### Fundamentos Invioláveis

O sistema visual do squad é o **padrão post-05** da Innovation Latam, conforme documentado em `pipeline/data/visual-identity.md`. Este padrão é obrigatório e não admite exceções.

**Tokens do sistema (nunca alterar):**
- Fonte: `Montserrat` exclusivamente (Google Fonts)
- Fundo slides 3+: `#150a1c → #2a1538`
- Destaque teal: `#c0fefd`
- Destaque gold: `#e8c85c`
- Institucional roxo: `#993CB1`
- Logo: branco, canto superior esquerdo, `max-width: 200px`, margem `30px` / `100px` conforme `real-imagery-and-safe-zones.md`
- **Rodapé:** `@innovationlatam` + `ARRASTE ->` em todos os slides (ver `real-imagery-and-safe-zones.md`)

### Variações de Layout Permitidas

Variação de layout é implementada DENTRO dos tokens do sistema (sem criar novas cores ou fontes). As variações permitidas estão documentadas em `pipeline/data/layout-variations.md`:

1. **Cover Layout** (slide 1) — hook na banda **60%–80%**, **à esquerda** no bloco; fundo foto IA full-bleed; canvas **1080×1350**
2. **Image Context Layout** (slide 2) — imagem full-bleed + overlay + texto **à esquerda**
3. **Standard Content Layout** (slides 3+) — texto **à esquerda**, fundo foto IA após inject
4. **Split Content Layout** (variação slides 3+) — headline + callout box; editorial **à esquerda**
5. **Reflection Layout** (penúltimo) — texto **à esquerda**, padding **100px**
6. **CTA Layout** (último) — botão teal, ações salvar/comentar, texto **à esquerda**

### Geração HTML

- HTML auto-suficiente por slide: CSS inline, @import Montserrat, body **1080×1350px** (4:5)
- Logo via data-URI de `squads/tech-instagram-carousel/assets/innovation-latam-logo-white.png`
- Sem dependências externas além de Google Fonts @import
- Sem JavaScript
- Sem frameworks CSS (Bootstrap, Tailwind etc.)
- Verificação WCAG AA (4.5:1 mínimo) obrigatória em todos os elementos de texto

---

## Parte 4: Pipeline de Produção

### Fluxo Completo

```
input/content.md (notícia do usuário)
      ↓
  [step-01] Carlos Conteúdo
  Geração de 5 ângulos, auto-seleção com justificativa
      ↓
  output/angles.yaml
      ↓
  [step-02] Carlos Conteúdo
  Copy completo de todos os slides + caption + hashtags
      ↓
  output/carousel-draft.md
      ↓
  [step-03] Daniel Diretor
  Cenas fotográficas + prompts EN por slide (`slide-scenes.md`)
      ↓
  output/slide-scenes.md
      ↓
  [step-04] Dária Design
  HTMLs auto-suficientes por slide (padrão post-05 + briefing do Daniel Diretor)
      ↓
  output/slides/slide-NN.html
      ↓
  [step-05] Dária Design
  Renderização Playwright → JPEG (`inject-bg-and-render.mjs`)
      ↓
  output/slides/{version}/rendered/slide-NN.jpg
```

*(Os critérios C1–C6 e V1–V3 em `quality-criteria.md` podem ser usados para revisão humana opcional; não há agente automático de revisão neste pipeline.)*

---

## Parte 5: Sistema de Revisão de Qualidade (referência)

### Critérios de Copy (C1-C6)

| Critério | Peso | Pergunta Central |
|----------|------|-----------------|
| C1 Scroll-Stop Test | 1.5× | O slide 1 para qualquer scroll? |
| C2 Data Integrity | 1× | Toda afirmação factual tem dado/fonte? |
| C3 Story Coherence | 1× | Os slides contam uma história coerente? |
| C4 Reflexão Final | 1× | O penúltimo entrega reflexão memorável? |
| C5 CTA Specificity | 1× | O CTA é específico e conectado ao tema? |
| C6 Brand Voice | 1× | O tom é didático-revelador, não corporativo? |

### Critérios Visuais (V1-V3)

| Critério | Pergunta Central |
|----------|-----------------|
| V1 Design System Consistency | Todos os slides usam o mesmo sistema? |
| V2 Readability | Texto ≥28px body, WCAG AA em todos os slides? |
| V3 Visual Impact | O visual é impactante e fiel ao padrão post-05? |

### Regras de Veredicto

- **APPROVE**: Média ≥ 7.0 e nenhum critério abaixo de 4/10
- **CONDITIONAL APPROVE**: Média ≥ 7.0 com itens não-bloqueantes identificados
- **REJECT**: Média < 7.0 OU qualquer critério abaixo de 4/10 OU veto ativado

### Veto Conditions (REJECT Automático)

1. Slide 1 começa com nome da marca ou "Hoje vamos falar sobre"
2. Afirmação factual central sem dado ou fonte
3. Total de slides diferente de **6**
4. Caption com mais de 2.200 caracteres
5. HTML não renderizável ou texto cortado nos slides
6. Todos os slides com mesmo layout sem variação
7. Fonte diferente de Montserrat em qualquer slide
8. Logo ausente em qualquer slide
9. Contraste abaixo de 4.5:1 em texto sobre imagem sem overlay adequado

---

## Parte 6: Contexto da Marca — Innovation Latam

**Empresa:** Innovation Latam — O Primeiro e Maior Marketplace B2B de Inovação Corporativa da América Latina

**Público-alvo:** Grandes empresas que buscam inovação aberta, programas com startups e engajamento de colaboradores; executivos C-level, gestores de inovação, empreendedores corporativos.

**Produtos:** Marketplace B2B de inovação, plataforma de gestão de programas, Hub IA4FIN, Robot Rock (IA)

**Tom de voz:** Profissional, acessível e educativo — com energia empreendedora. Didático-revelador, nunca corporativo-formal.

**Handle Instagram:** @innovationlatam

**Temas de conteúdo:** Inovação corporativa, startups, inteligência artificial, transformação digital, gestão de inovação, open innovation, empreendedorismo corporativo.
