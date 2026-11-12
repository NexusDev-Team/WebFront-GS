# Plano — Fase D revisada (12/11): sem FIWARE, Wokwi embutido e imagem do aparelho

## Contexto
- A Fase D original (T15–T16) ligava o site ao FIWARE: `api/estado.js`, `api/historico.js`, `services/fiware.js`, `useDispositivoReal()` e o painel ao vivo. Era a "terceira camada" do Edge.
- A entrega de Edge já saiu em 11/11 (link do Wokwi + vídeo). O emulador já mostra todo o comportamento. Um painel ao vivo ficaria redundante e ainda dependeria do EC2 ligado e do Wokwi rodando no dia da avaliação.
- **Decisão do usuário (D18):** sai a ponte FIWARE. A seção `#dispositivo-real` do emulador passa a mostrar (1) o circuito do Wokwi embutido e (2) uma imagem de como o C-Shield seria fisicamente, mandada pela equipe.
- Já pronto: `src/components/emulador/SecaoDispositivoReal.jsx` (cartão com link do Wokwi e o texto "O painel ao vivo... chega na próxima etapa"), redirect `/simulador-real` em `src/App.jsx:41`, `vercel.json` com rewrite que exclui `api/` (pasta `api/` não existe).
- Código que só servia ao FIWARE e sai: `relesPublicados` em `src/domain/cshield-saida.js:53-73` + bloco `describe('relesPublicados (W41a)')` em `tests/cshield-saida.test.js`; `FIWARE_HOST` em `.env.example`.
- Depois desta fase: T17 (deploy) e Fase E.

## Objetivo
Em `/emulador#dispositivo-real` aparecem o Wokwi do C-Shield (iframe, ou cartão com link se o Wokwi bloquear) e a imagem do aparelho (ou um espaço reservado até a equipe mandar), sem nenhuma referência a painel ao vivo ou FIWARE no código; testes e build verdes.

## Detalhes técnicos

### Passo de docs (primeiro)
- `docs/specs/web/tasks.md`: nova **D18** e Fase D reescrita (T15 = limpeza, T16 = seção, T17 = deploy sem `FIWARE_HOST`). Marcar W36–W41a e W39–W40 como obsoletos; W42/W43 continuam valendo (agora trivialmente: não há rede com o dispositivo).
- `docs/specs/web/plano-fase-c.md` linha 9: "Próximo passo" aponta para este plano.
- `CLAUDE.md`: §1 (rotas: sem `/simulador-real` lendo FIWARE), §5 (remover a linha das funções da Vercel/FIWARE), §6 (`.env` só `VITE_MOCKAPI_URL`), §7 (remover os greps de `api/` e `fiware.js`; manter o grep de IP só em `src/`).
- Copiar este plano para `docs/specs/web/plano-fase-d.md`.

### T15 — limpeza do que era FIWARE
- `src/domain/cshield-saida.js`: apagar `relesPublicados`; apagar imports que ficarem sem uso (`PERFIS_FIRMWARE`, `SETPOINT_DEMO_NORMAL/ATAQUE`, `temperaturaValida` — conferir com grep antes); ajustar o comentário do topo (linha 14).
- `tests/cshield-saida.test.js`: apagar o `describe` de `relesPublicados`, o import e o comentário da linha 13.
- `.env.example`: apagar as linhas 4–5.
- Não mexer em `PERFIS_FIRMWARE` (usado por `lcd.js` e testes).

### T16 — seção "Dispositivo real"
- Novo `src/components/emulador/WokwiEmbed.jsx` (~60 linhas): props `{ url }`. Tenta `<iframe src={url} title="Circuito do C-Shield no simulador Wokwi" loading="lazy" className="aspect-video w-full rounded ...">`. Plano B decidido no passo de teste: se o Wokwi recusar o iframe (`X-Frame-Options`/CSP — conferir no console do Playwright), o componente vira só o cartão com o botão "Abrir o Wokwi ↗". Não tentar detectar bloqueio em tempo de execução (navegador não informa); a escolha fica fixa no código conforme o teste.
- Novo `src/components/emulador/ImagemDispositivo.jsx` (~50 linhas): `<figure>` com `<img src={imagem}` (import de `src/assets/dispositivo.png`)`  alt="Como o C-Shield seria instalado junto da câmara fria: caixa com display, LED e botão de liberação" loading="lazy">` e `<figcaption>` "Ilustração de como o aparelho seria. Na simulação, LEDs e chave representam aquecedor, ventoinha e a ordem do atacante." Se a imagem não carregar (`onError`), mostra um quadro tracejado "Imagem do aparelho em breve" (texto com contraste ≥ 4,5:1).
- A imagem (PNG sem fundo, enviada pela equipe) fica em `src/assets/dispositivo.png` e é importada pelo Vite; sem pasta `public/dispositivo/`.
- `SecaoDispositivoReal.jsx`: remover o parágrafo "O painel ao vivo... próxima etapa" e o comentário das linhas 12–14; montar `ImagemDispositivo` + `WokwiEmbed` (duas colunas em `lg`, empilhado no celular); manter os dois textos e a frase "Nem este site consegue dar ordens ao C-Shield." Reusar `PainelVidro`, `TituloLed`, `BotaoLed` e `URL_WOKWI`.
- Cabeçalho do grupo nos arquivos novos.

### T17 — deploy (inalterado, só sem `FIWARE_HOST`)
Variável única na Vercel: `VITE_MOCKAPI_URL`. Ação externa: confirmar com o usuário antes.

## Ferramentas e requisitos
- Nenhuma dependência nova.
- Playwright MCP para testar o iframe e as capturas em 390 px e 1440 px.
- Imagem do aparelho: já entregue pela equipe em `src/assets/dispositivo.png` (PNG sem fundo).

## Passos (um commit por passo, sem `Co-Authored-By`, sem push)
1. Docs (tasks.md D18, plano-fase-c.md, CLAUDE.md, plano-fase-d.md). `docs: tira a ponte fiware da fase d e registra a decisao d18`
2. Apagar o teste de `relesPublicados`; `npx vitest run` verde. Apagar a função e imports mortos; vitest verde. `refactor: remove os reles deduzidos do fiware`
3. `.env.example` sem `FIWARE_HOST`. `chore: remove fiware_host do env de exemplo`
4. Teste do Wokwi: Playwright numa página local com o iframe do projeto público; ver se o circuito carrega ou se o console acusa bloqueio. Reportar o resultado antes de seguir.
5. `WokwiEmbed.jsx` (iframe ou cartão, conforme passo 4). `feat(emulador): embute o circuito do wokwi`
6. `ImagemDispositivo.jsx` . `feat(emulador): reserva a imagem de como o aparelho seria`
7. `SecaoDispositivoReal.jsx` montando os dois e sem o texto do painel ao vivo. `feat(emulador): mostra circuito e aparelho na secao do dispositivo real`
8. Capturas 390 px e 1440 px de `/emulador#dispositivo-real`; conferir foco visível, contraste e sem rolagem horizontal.
9. Parar para revisão. T17 só depois de aprovação.

## Como verificar
- `npx vitest run` → todos verdes (contagem cai só pelos testes de `relesPublicados`).
- `npm run build` → sem erros.
- `grep -rni "fiware_host\|relesPublicados\|painel ao vivo\|próxima etapa" src tests .env.example` → vazio.
- `grep -rnE "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" src/ || echo "sem IP no código"` → "sem IP no código".
- `/simulador-real` no navegador → cai em `/emulador#dispositivo-real` e rola até a seção.
- Na seção: Wokwi visível (iframe ou cartão com link em nova aba); imagem ou quadro "Imagem do aparelho em breve"; nenhum botão que envie algo.
