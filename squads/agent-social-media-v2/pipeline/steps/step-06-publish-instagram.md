---
execution: inline
agent: daria-design
inputFile: squads/agent-social-media-v2/output/slides/
outputFile: squads/agent-social-media-v2/output/publish-result.md
checkpoint: true
---

## Context Loading

Antes de executar, carregar:
- `squads/agent-social-media-v2/output/carousel-draft.md` — copy completo para montar a caption do Instagram
- A pasta de renders (ver Instruções passo 1 para localizar)

## Instructions

### Processo

#### 1. Localizar e listar slides renderizados

**Regra de localização:** os JPEGs finais estão sempre dentro da **última pasta de versão** em `output/slides/`, no subdiretório `rendered/`. Nunca em `output/slides/rendered/` diretamente.

**Norma:** `inject-bg-and-render.mjs` gera **apenas** `slide-NN.jpg` em `rendered/` (sem PNG duplicado). Ver `real-imagery-and-safe-zones.md` — regra 4.

Executar via Bash para encontrar a versão mais alta:
```bash
ls -1 squads/agent-social-media-v2/output/{run_id}/slides/ | grep -E '^v[0-9]+$' | sort -V | tail -1
```
Usar o resultado (ex: `v1`, `v2`) como `{version}`. Os ficheiros estão em:
```
output/slides/{version}/rendered/slide-NN.jpg
```

Listar todos os JPEGs ordenados numericamente. Se não houver `slide-NN.jpg`: parar e informar que o pipeline de design (`run-squad-design.mjs` ou inject) deve ser executado primeiro.

#### 2. JPEG (runs antigos só com PNG)

O Instagram só aceita JPEG em carrosséis. Se ainda existirem apenas `slide-NN.png` (run legado), converter para JPEG com ImageMagick:

```bash
convert squads/agent-social-media-v2/output/{run_id}/slides/{version}/rendered/slide-NN.png \
  -quality 92 \
  squads/agent-social-media-v2/output/{run_id}/slides/{version}/rendered/slide-NN.jpg
```

Se já existirem só `.jpg` conforme a norma atual, **saltar** esta conversão.

#### 3. Extrair caption do carousel-draft.md

Montar a caption do Instagram a partir do `carousel-draft.md`:
- Usar o texto do slide de capa (hook) como abertura
- Adicionar o CTA do slide final
- Adicionar hashtags relevantes ao tema (5–8 hashtags, ex: `#innovationlatam #inovacao #startups`)
- Limitar a **2200 caracteres** (limite do Instagram)

#### 4. Apresentar PUBLISH PREVIEW

```
PUBLISH PREVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plataforma:  Instagram (carrossel)
Conta:       @innovationlatam
Skill:       instagram-publisher
Imagens:     N slides
  1. slide-01.jpg
  2. slide-02.jpg
  [...]

Caption (X / 2200 chars):
  "[primeiros 300 chars da caption]..."

Hashtags: [lista]

VALIDAÇÃO
  Formato: JPEG (exigido: JPEG) ✓
  Quantidade: N (exigido: 2–10) ✓
  Caption: X chars (máx: 2200) ✓
  Hashtags: N (recomendado: 5–8) ✓

Status: Aguardando aprovação do usuário.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**CHECKPOINT:** Apresentar o preview ao usuário usando AskUserQuestion:
- "Aprovar e fazer dry-run"
- "Editar caption antes de publicar"
- "Cancelar publicação"

Não avançar sem resposta explícita.

#### 5. Executar dry-run

Se aprovado, executar o script com `--dry-run`:

```bash
set -a && source .env && set +a && node skills/instagram-publisher/scripts/publish.js \
  --images "squads/agent-social-media-v2/output/{run_id}/slides/{version}/rendered/slide-01.jpg,...,slide-NN.jpg" \
  --caption "CAPTION_AQUI" \
  --dry-run
```

Reportar resultado do dry-run (credenciais, upload de imagens, containers criados).

#### 6. Solicitar confirmação final para publicação

```
DRY-RUN RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Credenciais: Válidas
  Upload imgBB: N/N imagens enviadas
  Containers Instagram: N/N criados
  Publicação: Ignorada (dry-run)

Dry-run aprovado. Confirmar publicação ao vivo?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**CHECKPOINT FINAL:** AskUserQuestion:
- "Publicar agora no @innovationlatam"
- "Cancelar — só queria testar"

#### 7. Publicar

Se confirmado, executar sem `--dry-run`:

```bash
set -a && source .env && set +a && node skills/instagram-publisher/scripts/publish.js \
  --images "squads/agent-social-media-v2/output/{run_id}/slides/{version}/rendered/slide-01.jpg,...,slide-NN.jpg" \
  --caption "CAPTION_AQUI"
```

#### 8. Reportar resultado e salvar

Salvar em `output/publish-result.md`:

```markdown
# Resultado da Publicação — [YYYY-MM-DD HH:MM]

- **Status:** Publicado com sucesso / Falhou
- **URL:** https://www.instagram.com/p/XXXXXX/
- **Post ID:** [id]
- **Slides:** N imagens
- **Caption:** [primeiros 200 chars]
- **Publicado em:** [timestamp UTC]
```

Se falha: reportar erro, HTTP status e sugestão de correção.

## Veto Conditions

1. `.env` sem `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID` ou `IMGBB_API_KEY` — parar e informar o usuário para configurar o `.env` conforme `.env.example`
2. Publicar sem confirmação explícita do usuário — nunca pular os checkpoints
3. Caption acima de 2200 caracteres — apresentar o problema ao usuário e pedir que encurte antes de publicar

## Quality Criteria

- [ ] Slides finais em JPEG (`slide-NN.jpg`); se run legado só tiver PNG, converter antes do envio
- [ ] Publish preview exibido com todas as informações (plataforma, conta, imagens, caption, validações)
- [ ] Dry-run executado e aprovado antes da publicação ao vivo
- [ ] Usuário confirmou explicitamente antes da publicação
- [ ] Resultado salvo em `output/publish-result.md` com URL do post
