---
task: "Auto-select emotional angle"
order: 1.5
input: |
  - angles: squads/tech-instagram-carousel/output/angles.md
  - social_handoff: squads/tech-instagram-carousel/output/social-handoff.md
output: |
  - selected_angle: squads/tech-instagram-carousel/output/selected-angle.md
---

# Auto-select angle

Sem intervenção humana: escolhe **um** dos cinco ângulos para o carrossel completo.

## Process

1. Ler `angles.md` completo (os 5 ângulos + qualquer bloco “Recomendo…”).
2. **Regra principal:** se o Copywriter já tiver escrito uma recomendação explícita (ex.: “Recomendo ângulo educacional…”, “Recomendo o Ângulo 2”), **selecione exatamente esse ângulo** e copie título + trigger para o output.
3. **Fallback** (se não houver recomendação clara): prioridade fixa **Oportunidade → Educacional → Contrário → Inspiracional → Medo** — escolha o primeiro que estiver bem fundamentado no brief (`social-handoff.md`).
4. Gravar `selected-angle.md` no formato abaixo (sempre em PT-BR).

## Output Format

```markdown
# Ângulo selecionado (automático)

**Modo:** seleção automática — sem checkpoint humano.

**Trigger:** [Medo | Oportunidade | Educacional | Contrário | Inspiracional]

**Título do carrossel:** [título exatamente como no ângulo escolhido em angles.md]

**Justificativa:** [1–2 frases: por que este ângulo foi escolhido]

**Fonte da escolha:** [Recomendação explícita em angles.md | Fallback por prioridade editorial]
```

## Quality Criteria

- [ ] Exatamente um ângulo dos cinco
- [ ] Consistente com `angles.md` (não inventar novo ângulo)
- [ ] Arquivo salvo em `squads/tech-instagram-carousel/output/selected-angle.md`
