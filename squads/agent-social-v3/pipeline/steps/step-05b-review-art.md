---
execution: inline
agent: rafael-revisor
inputFile: squads/agent-social-v3/output/slides/
outputFile: squads/agent-social-v3/output/art-review.md
checkpoint: false
---

## Context Loading

Antes de executar, carregar:

- `output/{run_id}/slides/{version}/rendered/` — os 6 JPEGs finais
- `output/{run_id}/v1/carousel-draft.md` — copy de Carlos Conteúdo
- `output/{run_id}/v1/slide-scenes.md` — direção de arte de Daniel Diretor
- `squads/agent-social-v3/pipeline/data/quality-criteria.md` — critérios e scoring
- `squads/agent-social-v3/pipeline/data/art-direction-photography-guide.md` — referência técnica

## Instructions

### Processo

**Este step exige que os 6 JPEGs em `rendered/` existam.** Se faltar algum, parar e reportar que o step-05 (render) deve ser concluído primeiro.

1. **Localizar os slides renderizados** em `output/{run_id}/slides/{version}/rendered/`:
   ```bash
   ls squads/agent-social-v3/output/{run_id}/slides/$(ls -1 squads/agent-social-v3/output/{run_id}/slides/ | grep -E '^v[0-9]+$' | sort -V | tail -1)/rendered/
   ```

2. **Ler os documentos de contexto** (`carousel-draft.md` e `slide-scenes.md`) antes de abrir qualquer JPEG.

3. **Revisar cada slide** (01 a 06) avaliando as 4 dimensões do checklist de Rafael:
   - Conexão Copy-Visual (peso 2×)
   - Qualidade Visual (peso 1.5×)
   - Fidelidade à Direção de Arte (peso 1×)
   - Identidade & Técnico (peso 1×)

4. **Calcular score por slide** e emitir veredito individual.

5. **Emitir veredito geral** e salvar relatório:
   ```
   output/{run_id}/v1/art-review.md
   ```

6. **Se REPROVADO:** não prosseguir para step-06. Listar itens bloqueantes e aguardar correção.

### Verificação de Pré-Condições

Antes de iniciar a revisão, confirmar:
- [ ] 6 JPEGs em `rendered/` (slide-01.jpg … slide-06.jpg)
- [ ] `carousel-draft.md` existe e está legível
- [ ] `slide-scenes.md` existe e está legível

## Output Format

```markdown
# Revisão de Arte — {run_id}

**Veredito Geral:** APROVADO | APROVADO COM RESSALVAS | REPROVADO

## Slide N — [tipo: Hook/Dado/Conteúdo/Reflexão/CTA]
**Veredito:** ...
**Conexão Copy-Visual:** X/10 — observação
**Qualidade Visual:** X/10 — observação
**Fidelidade à Direção de Arte:** X/10 — observação
**Identidade & Técnico:** X/10 — observação
**Score:** X.X/10
**Melhorias:** [lista acionável]

## Resumo Executivo
### Pontos Fortes
### Melhorias Prioritárias
### Itens Bloqueantes (se houver)
### Veredito Final
```

## Veto Conditions

1. Menos de 6 JPEGs em `rendered/` — parar e reportar render incompleto
2. `carousel-draft.md` ou `slide-scenes.md` ausentes — parar e reportar dependência faltante
3. Qualquer slide com logo ausente, rodapé ausente ou texto com overflow — REPROVADO automático para aquele slide
4. Imagem visivelmente não-fotorrealista (cartoon, CGI, ilustração) — REPROVADO automático para aquele slide

## Quality Criteria

- [ ] Todos os 6 slides avaliados individualmente com nota e observação
- [ ] Veredito por slide documentado (APROVADO / COM RESSALVAS / REPROVADO)
- [ ] Melhorias listadas com sugestão acionável (slide específico + o quê mudar + como)
- [ ] Resumo executivo presente com pontos fortes, melhorias priorizadas e itens bloqueantes
- [ ] `art-review.md` salvo em `output/{run_id}/v1/`
- [ ] Veredito geral REPROVADO bloqueia step-06; APROVADO/COM RESSALVAS libera step-06
