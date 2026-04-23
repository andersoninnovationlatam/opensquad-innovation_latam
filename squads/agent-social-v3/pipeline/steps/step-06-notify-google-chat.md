---
execution: inline
agent: daria-design
inputFile: squads/agent-social-v3/output/slides/
outputFile: squads/agent-social-v3/output/drive-upload-result.md
checkpoint: false
---

## Context Loading

Antes de executar, carregar:

- Pasta de renders (JPEGs finais)
- Pasta raiz no Drive: `1YB6Qt7-NoI62HU-4v_R-qZpHMNOhANB3`

## Instructions

### Processo

#### 1. Localizar e listar slides renderizados

**Regra de localização:** os JPEGs finais estão dentro da **última pasta de versão** em `output/{run_id}/slides/`, no subdiretório `rendered/`.

Executar via Bash para encontrar a versão mais alta:

```bash
ls -1 squads/agent-social-v3/output/{run_id}/slides/ | grep -E '^v[0-9]+$' | sort -V | tail -1
```

Usar o resultado (ex: `v1`) como `{version}`. Os ficheiros estão em:

```
output/{run_id}/slides/{version}/rendered/slide-NN.jpg
```

Listar todos os JPEGs ordenados numericamente. Se não houver `slide-NN.jpg`: parar e informar que o pipeline de design deve ser executado primeiro.

#### 2. Runs legados só com PNG

Se existir apenas `slide-NN.png`, converter para JPEG com ImageMagick:

```bash
convert squads/agent-social-v3/output/{run_id}/slides/{version}/rendered/slide-NN.png \
  -quality 92 \
  squads/agent-social-v3/output/{run_id}/slides/{version}/rendered/slide-NN.jpg
```

#### 3. Criar pasta no Google Drive e fazer upload dos JPEGs

**Objetivo:** criar uma pasta por run com o nome **`agent-social-v3 — {run_id}`** dentro da pasta raiz do Drive (ID acima) e enviar os 6 JPEGs para lá.

**Requer** credenciais de Service Account e variáveis de ambiente:

- `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON` (path para o JSON da Service Account; nunca commitar)
- `GOOGLE_DRIVE_PARENT_FOLDER_ID` (opcional; por padrão usa `1YB6Qt7-NoI62HU-4v_R-qZpHMNOhANB3`)

Executar na raiz do repo:

```bash
node --env-file=.env squads/agent-social-v3/scripts/upload-to-drive.mjs {run_id}
```

#### 4. Guardar resultado

Após a execução, o script escreve automaticamente:

- `squads/agent-social-v3/output/{run_id}/drive-upload-result.md`
- `squads/agent-social-v3/output/{run_id}/{version}/drive-upload-result.md`

E também imprime um JSON no stdout com `folderId` e contagem de uploads.

Copiar/colar o conteúdo de `drive-upload-result.md` para este step `outputFile` se necessário.

```markdown
# Upload Google Drive — [YYYY-MM-DD HH:MM]

- **Status:** Sucesso / Falhou
- **Slides:** N imagens (lista slide-NN.jpg)
- **Run:** `{run_id}`
- **Notas:** erros de autenticação ou upload, se houver
```

## Veto Conditions

1. `.env` sem `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON` — parar e pedir configuração (nunca commitar o JSON)
2. Nenhum JPEG em `rendered/` após conversão — não chamar o script

## Quality Criteria

- [ ] Todos os slides listados e enviados em ordem
- [ ] Resultado documentado em `drive-upload-result.md`
- [ ] Credenciais nunca escritas em ficheiros versionados
