# Domain Framework — Carrossel de Notícias

## Pipeline de Produção

### Fase 1: Entrada de Notícia
O usuário fornece o texto da notícia (artigo completo, resumo ou link copiado).
O sistema extrai: fatos principais, dados quantitativos, protagonistas, contexto e impacto.

### Fase 2: Geração de Ângulos
A partir de uma única notícia, geram-se 5 ângulos narrativos distintos.
Cada ângulo usa um driver emocional diferente e produzirá um carrossel com caráter único.
O usuário seleciona o ângulo antes de qualquer produção de copy.

**Os 5 ângulos padrão:**
| Ângulo | Driver Emocional | Audiência Principal |
|--------|-----------------|---------------------|
| Medo | Perda, risco de ficar para trás | Líderes que temem obsolescência |
| Oportunidade | Desejo, ganho, vantagem competitiva | Empreendedores em busca de diferencial |
| Educacional | Curiosidade, domínio do assunto | Profissionais que querem entender |
| Contrário | Indignação intelectual, espanto | Pensadores críticos, questionadores |
| Inspiracional | Esperança, empoderamento | Todos — especialmente quem está travado |

### Fase 3: Produção do Copy
Com o ângulo definido, o redator escolhe o formato de carrossel mais adequado:
- **Editorial/Tese**: para argumentos baseados em dados
- **Listicle**: para listas de dicas, ferramentas, ou insights
- **Problema-Solução**: para mostrar o problema da notícia e a saída
- **Storytelling**: quando a notícia tem elemento humano forte

Produção slide a slide: headline (claim) + texto de suporte (contexto/dado).

### Fase 4: Briefing Visual
O Diretor de Arte transforma cada slide em especificação técnica:
- Slides ímpares: prompt de imagem com câmera, luz e lente (conforme vocabulário técnico)
- Slides pares: fundo #993CB1 com texto otimizado para legibilidade sobre roxo

### Fase 5: Geração e Renderização
- Imagens AI geradas via image-ai-generator (slides ímpares)
- HTML montado com design system (Montserrat, cores, grid)
- Renderizado em PNG 1080×1350px via image-creator (Playwright)

### Fase 6: Revisão
Revisão única cobrindo copy e visual:
- Copy: ângulo, slides, caption, CTA, hashtags
- Visual: identidade, legibilidade, branding, consistência

## Princípios de Design do Conteúdo

### Para Copy
1. Um ângulo por carrossel — nunca misturar drivers emocionais
2. Especificidade sempre supera generalidade ("47% em 3 meses" > "muitas empresas")
3. O slide 1 é a aposta mais importante — se não para o scroll, nada mais importa
4. Cada slide precisa de razão para existir — se pode ser removido sem perda, remova
5. CTA alinhado ao funil: awareness = salvar/compartilhar; consideração = comentar/DM

### Para Visual
1. Hierarquia tipográfica clara: headline grande e bold, suporte menor e medium
2. Contraste WCAG AA em todos os slides (4.5:1 mínimo)
3. Alternância visual: foto (ímpar) vs. cor sólida (par) cria ritmo e previne fadiga
4. Branding consistente: logo + @handle em todos os slides, mesma posição

## Checklist de Entrega

### Copy
- [ ] 6-10 slides com 40-80 palavras cada
- [ ] Cover com headline de máximo 20 palavras e alto impacto
- [ ] Caption com hook em 125 chars + corpo + pergunta/CTA + 5-15 hashtags

### Visual
- [ ] Slides ímpares: imagem AI + overlay de contraste
- [ ] Slides pares: fundo #993CB1
- [ ] Montserrat em todos os slides (Bold no cover, Medium nos demais)
- [ ] Logo + @innovationlatam no canto inferior direito de todos os slides
- [ ] Dimensão 1080×1350px
