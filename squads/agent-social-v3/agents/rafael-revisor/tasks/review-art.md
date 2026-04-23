# Task: Revisar Arte do Carrossel
**Agent:** Rafael Revisor
**Step:** step-05b
**Trigger:** Após render completo dos PNGs (step-05)

---

## Objetivo

Avaliar os 6 slides renderizados quanto à conexão entre conteúdo e imagem, qualidade visual, fidelidade à direção de arte e identidade de marca. Emitir veredito por slide e geral, com pontos de melhoria acionáveis.

---

## Inputs Obrigatórios

Antes de iniciar, carregar:

1. **`output/{run_id}/slides/{version}/rendered/`** — os 6 PNGs finais (`slide-01.jpg` … `slide-06.jpg`)
2. **`output/{run_id}/v1/carousel-draft.md`** — copy original de Carlos Conteúdo
3. **`output/{run_id}/v1/slide-scenes.md`** — direção de arte de Daniel Diretor
4. **`pipeline/data/quality-criteria.md`** — critérios e scoring oficial
5. **`pipeline/data/art-direction-photography-guide.md`** — referência técnica para sugestões

---

## Processo de Revisão

### Passo 1 — Leitura de Contexto

1. Ler `carousel-draft.md` por completo — entender a narrativa, o ângulo escolhido e o copy de cada slide.
2. Ler `slide-scenes.md` por completo — entender a intenção visual de Daniel para cada slide (cena, ângulo, lente, luz, prompt mestre).
3. Verificar se existem 6 arquivos PNG em `rendered/`. Se faltar algum, **parar e reportar** — o pipeline de render não foi concluído.

### Passo 2 — Revisão por Slide

Para cada slide de 01 a 06, visualizar o PNG e avaliar:

#### Conexão Copy-Visual (peso 2×)
- O tema da imagem corresponde à mensagem central do copy desse slide?
- A cena escolhida foi a especificada em `slide-scenes.md`? Se divergiu, a divergência melhora ou piora o resultado?
- A imagem amplifica a emoção que o copy quer transmitir (urgência, reflexão, dados, convite)?

#### Qualidade Visual (peso 1.5×)
- A composição equilibra bem o espaço visual e o conteúdo textual do slide?
- O overlay escuro garante legibilidade? (Slides 2-6: `rgba(21,10,28,0.88)` mínimo)
- A iluminação e atmosfera estão coerentes com o tom emocional do slide?

#### Fidelidade à Direção de Arte (peso 1×)
- O ângulo, plano e lente descritos em `slide-scenes.md` foram respeitados?
- Se houve desvio, impacta positiva ou negativamente o slide?

#### Identidade & Técnico (peso 1×)
- Logo Innovation Latam visível no canto superior esquerdo (top: 30px; left: 100px)?
- Rodapé `@innovationlatam` + `ARRASTE ->` presente?
- Texto editorial alinhado à esquerda, sem overflow?
- Fonte exclusivamente Montserrat?
- Contraste WCAG AA (4.5:1) verificado visualmente?

### Passo 3 — Cálculo de Score e Veredito

Para cada slide, calcular:

```
Score = (Conexão×2 + Impacto×1.5 + Arte×1 + Técnico×1) / 5.5
```

| Score | Veredito |
|---|---|
| ≥ 7.0, nenhum critério < 4 | APROVADO |
| ≥ 7.0, itens não-bloqueantes | APROVADO COM RESSALVAS |
| < 7.0 ou critério < 4 ou veto | REPROVADO |

**Veto conditions automáticas (REPROVADO imediato):**
- Imagem claramente genérica e sem relação com o copy (ex: foto de escritório genérico para slide sobre dado específico)
- Logo ausente
- Texto com overflow visível
- Rodapé ausente
- Evidência de cartoon/CGI/ilustração na imagem de fundo

### Passo 4 — Veredito Geral

| Situação | Veredito Geral |
|---|---|
| Todos os slides APROVADOS ou APROVADOS COM RESSALVAS | APROVADO COM RESSALVAS |
| Todos APROVADOS, ressalvas menores | APROVADO |
| Um ou mais slides REPROVADOS | REPROVADO — bloquear upload |

### Passo 5 — Documentar e Salvar

Salvar o relatório de revisão em:
- `output/{run_id}/v1/art-review.md`

---

## Output

O arquivo `art-review.md` deve seguir exatamente o formato definido em `rafael-revisor.agent.md` (seção Output Format):
- Cabeçalho com veredito geral
- Uma seção por slide com notas, observações e melhorias
- Resumo executivo com pontos fortes, melhorias prioritárias e itens bloqueantes

---

## Condições de Bloqueio do Pipeline

Se o veredito geral for **REPROVADO**:
1. Não prosseguir para step-06 (upload Google Drive)
2. Listar explicitamente os itens bloqueantes com o slide afetado
3. Sugerir a correção necessária (novo prompt para `generate-bg-image.mjs`, ajuste no HTML, etc.)
4. Aguardar correção e re-render antes de reemitir o veredito

Se **APROVADO** ou **APROVADO COM RESSALVAS**:
1. Registrar melhorias não-bloqueantes em `art-review.md`
2. Prosseguir para step-06 normalmente
