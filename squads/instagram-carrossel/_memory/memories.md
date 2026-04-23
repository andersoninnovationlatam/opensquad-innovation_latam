# Memórias do Squad — Instagram Carrossel

> Arquivo de memória persistente do squad `instagram-carrossel`. Atualizado automaticamente após cada run aprovado.
> Última atualização: 2026-04-06

---

## Estilo de Escrita

- **Contagem de palavras:** 20-40 palavras por slide (máximo absoluto). O padrão inicial de 40-80 palavras foi rejeitado explicitamente.
- **Tom preferido:** Tom 4 — Urgente e Direto. Frases curtas, sem verbos auxiliares desnecessários. Ex: "Não é promessa. É dado." > "Esse resultado não é apenas uma promessa de fornecedores."
- **Sem legenda:** usuário não quer legenda no output final.
- **Sem hashtags:** usuário não quer hashtags no output final.

---

## Design Visual

- **Template aprovado:** B — Roxo Sólido (#993CB1) para slides pares.
- **Slides ímpares:** fundo #0d0d14 com glow direcional via `radial-gradient`. Cada slide ímpares tem um "mood" de iluminação diferente (S1: azul monitor; S3: high key teal; S5: golden hour âmbar).
- **Accent color:** #50beba aplicado somente em 1-2 keywords por slide (números, termos-chave). Nunca em blocos de texto.
- **Tag pill no slide 4:** usar `rgba(220,50,50,0.30)` com borda vermelha para slides de "Atenção/Risco" — diferencia visualmente o slide de reversão.
- **Tag pill em slides escuros:** usar borda colorida + fundo transparente (ex: S3 com borda #50beba) em vez de pill branco.

---

## Estrutura de Conteúdo

- **Quantidade de slides aprovada:** 5 slides (não 6, 7 ou 8).
- **Arco narrativo validado (5 slides):** Cover (Urgência) → Dado/Contexto → Evidência → Reversão/Risco → CTA.
- **Slide par com "tag de risco":** slide 4 (Reversão) funciona melhor com tag "Atenção" em vermelho — sinaliza mudança de tom antes do CTA.
- **CTA slide:** pill branco com texto #993CB1 + fonte citada (Gartner, McKinsey) + sem swipe hint.
- **Pauta de melhor desempenho (run 1):** Agentes de IA Autônomos / 40% das apps corporativas até 2026 / Gartner. Ângulo: URGÊNCIA — medo de perda.

---

## Proibições Explícitas

- **Sem legenda** — rejeitado explicitamente na run 1.
- **Sem hashtags** — rejeitado explicitamente na run 1.
- **Máximo 5 slides** — 8 slides foi rejeitado; ajustar para 5 nas próximas runs.
- **Máximo 40 palavras por slide** — textos mais longos foram rejeitados.

---

## Técnico

- **Servidor para Playwright:** `python3 -m http.server` na pasta de slides (porta 33200 usada na run 1). O protocolo `file://` está bloqueado no Playwright configurado.
- **Screenshot path:** relativo ao CWD do processo Claude Code (não ao diretório do servidor).
- **Viewport:** `1080x1350px` via `mcp__playwright__browser_resize` antes de navegar.
- **Ordem de render:** gerar slide-01, verificar screenshot, depois batch 02-05.
- **Assets de logo:** nenhum arquivo PNG encontrado em `assets/`. Usar fallback `IL` com `background: rgba(153,60,177,0.50)` em slides escuros e `rgba(255,255,255,0.25)` em slides roxos.
- **Output path:** `output/{run_id}/v{N}/slides/slide-0X.html` + `slide-0X-preview.png`.
