# Plano — Fase B (T6 a T9): base e domínio

Planejado em Opus em 11/11. Executar em **Sonnet**, uma tarefa por vez, parando para revisão do usuário ao fim de cada tarefa (`CLAUDE.md` §2). Requisitos: `requirements.md` (W..). Decisões: `tasks.md` (D1–D11).

Regras que valem para todas as tarefas:

- Todo arquivo novo de código começa com o cabeçalho do grupo (modelo no fim deste plano).
- Comentários em português. Arquivo ≤ ~250 linhas.
- Commit ao fim de cada passo verificado: Conventional Commits em português, uma linha, **sem `Co-Authored-By`**, identidade git já configurada. Sem push (D10).
- Skills: `superpowers:test-driven-development` em T8 e T9; `tailwind-design-system`, `/frontend-design` e `/ui-ux-pro-max` em T7; `react-vite-best-practices` em T6; `superpowers:verification-before-completion` antes de declarar cada tarefa pronta.

Versões conferidas em 11/11 com `npm view` (Node 24.19, npm 11.17): `vite` 8.3, `@vitejs/plugin-react` 6.3, `react`/`react-dom` 19.3, `react-router-dom` 7.18, `tailwindcss` e `@tailwindcss/vite` 4.3, `vitest` 5.1, `jsdom` 31, `@testing-library/react` 16.3. Instalar com `^` nessas versões maiores.

---

## T6 — Projeto Vite + React + Tailwind + router + Vitest

### Contexto
Repositório tem só `.gitignore` commitado. Nada de app ainda. Tudo das fases seguintes depende desta base.

### Objetivo
`npm run dev` abre as 5 rotas e a 404 com Navbar e Footer provisórios; `npm run build` e `npx vitest run` passam.

### Detalhes técnicos
Criar **à mão** (sem `npm create vite`, porque a pasta não está vazia):

- `package.json` — `"name": "c-shield-web"`, `"private": true`, `"type": "module"`, scripts `dev` (`vite`), `build` (`vite build`), `preview` (`vite preview`), `test` (`vitest run`), `test:watch` (`vitest`).
- `vite.config.js` — plugins `react()` e `tailwindcss()`; bloco `test: { environment: 'node', include: ['tests/**/*.test.js'] }`. (Proxy de `/api` fica para o T15.)
- `index.html` — `lang="pt-BR"`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, título "C-Shield — Vê de longe. Só obedece de perto.", `<div id="root">`, `<script type="module" src="/src/main.jsx">`.
- `src/main.jsx` — `createRoot` + `<BrowserRouter>` + `<App />`, importa `./styles/index.css`.
- `src/App.jsx` — `<Routes>` com `/`, `/emulador`, `/simulador-real`, `/incidentes`, `/como-funciona`, `*`; layout com Navbar provisória (links com `NavLink`) e Footer provisório.
- `src/pages/` — `Inicio.jsx`, `Emulador.jsx`, `SimuladorReal.jsx`, `Incidentes.jsx`, `ComoFunciona.jsx`, `NaoEncontrada.jsx` (cada uma só com o título `<h1>` e uma frase).
- `src/styles/index.css` — `@import "tailwindcss";` (tokens entram no T7).
- `vercel.json` — `{ "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }] }` (W3; não captura `/api`).
- `.env.example` — `VITE_MOCKAPI_URL=` e `FIWARE_HOST=` vazios, com comentário de cada um.
- `tests/fumaca.test.js` — `expect(1 + 1).toBe(2)`, só para provar que o Vitest roda.
- `src/domain/produto.js` — `export const NOME_PRODUTO = 'C-Shield'` (constante única do nome, usada pela Navbar).

Tailwind v4 usa configuração no CSS (`@theme`), sem `tailwind.config.js`. O prompt cita o `tailwind.config.js`; a v4 cumpre o mesmo papel com variáveis CSS (registrar isso no `AI.md` depois).

### Ferramentas e requisitos
`npm install react react-dom react-router-dom` e `npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite vitest`. Nenhuma variável de ambiente ainda.

### Passos
1. Criar `package.json`, `vite.config.js`, `index.html`. Rodar os dois `npm install`. Resultado: `node_modules/` e `package-lock.json`.
2. Criar `src/main.jsx`, `src/App.jsx`, `src/styles/index.css`, `src/domain/produto.js` e as 6 páginas. Rodar `npm run build`. Resultado: `dist/` sem erro.
3. Commit `chore: cria o projeto vite com react, tailwind e rotas vazias`.
4. Criar `tests/fumaca.test.js`; `npx vitest run` → 1 teste passando. Commit `test: configura o vitest com um teste de fumaca`.
5. Criar `vercel.json` e `.env.example`. Commit `chore: adiciona o vercel.json para as rotas e o env de exemplo`.
6. `npm run dev` e abrir com Playwright `/`, `/emulador`, `/simulador-real`, `/incidentes`, `/como-funciona` e `/xyz` (404). Resultado: cada uma mostra o seu `<h1>`.

### Como verificar
`npm run build` sem erro; `npx vitest run` → `1 passed`; `git log --oneline` com 4 commits; `git check-ignore node_modules dist .env` lista os três; 6 rotas abrem.

---

## T7 — Sistema visual e componentes de `ui/`

### Contexto
Base do T6 pronta. Todas as páginas vão herdar estes tokens, efeitos e componentes. Ver `design.md` §2 (tokens e contraste medido).

### Objetivo
Uma página `/` provisória mostra todos os componentes de `ui/` com os tokens, fontes e efeitos LED, legível em 390 px e 1440 px, com foco visível por Tab.

### Detalhes técnicos
- `src/styles/tokens.css` — bloco `@theme` com as cores do `design.md` §2 (`--color-noite-950`, `--color-noite-900`, `--color-painel`, `--color-borda`, `--color-gelo-50`, `--color-gelo-300`, `--color-led-fraco`, `--color-led-forte`, `--color-ok`, `--color-atencao`, `--color-critico`, `--color-ataque`, `--color-lcd-fundo`, `--color-lcd-texto`) e fontes (`--font-titulo: "Chakra Petch"`, `--font-texto: "IBM Plex Sans"`, `--font-mono: "IBM Plex Mono"`, `--font-lcd: "VT323"`, cada uma com fallback).
- `src/styles/efeitos.css` — classes `led-brilho`, `led-fraco`, `led-forte`, `led-falha` (keyframes com no máximo 3 quedas por segundo, W46) e `@media (prefers-reduced-motion: reduce)` desligando as animações (W47). Foco: `:focus-visible` com contorno `led-forte` de 2 px e deslocamento.
- `src/styles/index.css` — importa `tailwindcss`, `tokens.css`, `efeitos.css`; `body` com fundo `noite-950`, texto `gelo-50`, fonte de texto, base 16 px, `line-height` 1.5.
- `index.html` — `<link>` do Google Fonts (Chakra Petch 600;700, IBM Plex Sans 400;500, IBM Plex Mono 400;500, VT323) com `preconnect` e `display=swap`.
- `src/components/ui/` (um arquivo por componente, só apresentação):
  - `PainelVidro.jsx` — `as`, `className`, `children`; fundo `painel` + `backdrop-blur` + `borda`. Texto nunca translúcido.
  - `TituloLed.jsx` — `nivel` (1–3), `variante` (`repouso` | `ataque` | `assumiu`) → `led-fraco`/`led-falha`/`led-forte`; fonte de título.
  - `BotaoLed.jsx` — `variante` (`primario` | `ataque` | `fantasma`), `ariaLabel`, `disabled`; alvo mínimo 44 × 44 px; transição 150–200 ms.
  - `StatusBadge.jsx` — `estado` (`NORMAL`…`FALHA_SENSOR`) → cor + **texto** (W49); texto legível pelo nome do estado.
  - `Carregando.jsx` — `texto`; `role="status"`.
  - `ErroMensagem.jsx` — `mensagem`, `aoTentarDeNovo`; `role="alert"`.
  - `Navbar.jsx` — final: logo + `NOME_PRODUTO` + 5 `NavLink` com `aria-current` (W4); no celular, botão de menu com `aria-expanded`.
  - `Footer.jsx` — frase do produto, links do Edge e do Wokwi, "Nexus Dev · GS 2026.2".
  - `BotaoSegurar` fica para o T13 (depende de `useSegurar`).
- `src/pages/Inicio.jsx` — provisória: vitrine com cada componente e cada variante.

Regra de cor do `design.md`: `led-fraco` nunca em texto; `critico` em texto pequeno só sobre `noite-950`/`noite-900`.

### Ferramentas e requisitos
Nenhuma dependência nova. Skills: `tailwind-design-system`, `/frontend-design`, `/ui-ux-pro-max`, `accessibility`.

### Passos
1. `tokens.css` + `index.css` + fontes no `index.html`; `npm run build`. Commit `style: define os tokens de cor e as fontes da sala de controle`.
2. `efeitos.css` com as 4 classes e o reduced-motion. Commit `style: adiciona os efeitos de led e o modo sem movimento`.
3. `PainelVidro`, `TituloLed`, `BotaoLed`. Commit `feat(ui): cria painel de vidro, titulo led e botao led`.
4. `StatusBadge`, `Carregando`, `ErroMensagem`. Commit `feat(ui): cria badge de estado, carregando e mensagem de erro`.
5. `Navbar` e `Footer` finais, ligados no `App.jsx`. Commit `feat(ui): cria a navegacao e o rodape`.
6. Vitrine no `Inicio.jsx`. Playwright: capturas em 390 e 1440 px; Tab por todos os controles; `browser_emulate_media` com `reducedMotion: reduce`. Corrigir o que falhar. Commit `feat(ui): mostra a vitrine provisoria dos componentes`.

### Como verificar
Capturas sem rolagem horizontal em 390 px; foco visível em todos os links e botões; `led-falha` parado com reduced-motion; `npm run build` sem erro.

---

## T8 — Domínio: perfis, regras do C-Shield, física e LCD

### Contexto
É o coração do emulador e do `/simulador-real`. Porta em JavaScript a `decisao.h`, o `config.h`, o `painel.h` e a função pura do `simulacao.h`, com os casos de `edge/test/test_decisao.cpp` virando testes do Vitest. Ler esses arquivos no repositório do Edge antes de começar (`C:\Users\isacn\Desktop\c-shield-edge\edge\`).

### Objetivo
`npx vitest run` passa com os casos do `test_decisao.cpp` portados (mesmos números esperados), mais os testes de física e LCD.

### Detalhes técnicos
Tudo em JavaScript puro, sem React, sem `Date.now()` dentro das funções (o tempo entra por parâmetro).

- `src/domain/config.js` — espelho das constantes de `config.h` usadas pela decisão e pelo LCD, com os mesmos comentários de justificativa: `JANELA_TAXA_MS`, `PERIODO_LEITURA_MS`, `N_AMOSTRAS_TAXA`, `TAXA_MIN_INTERVALO_MS`, `TAXA_MAX_C_POR_MIN`, `TAXA_MAX_RESFRIAMENTO_C_POR_MIN`, `DEGELO_MAX_MS`, `HORA_DEGELO_1/2`, `JANELA_DEGELO_H`, `TRAVA_MS` (60 s, modo demonstração), `LIBERACAO_MS`, `CONFIRMACOES`, `DHT_TEMP_MIN/MAX_FISICA`, `LIMIAR_PORTA_PCT`, `ALARME_INICIAL_MS`, `ALTERNA_TELA_MS`, `SETPOINT_DEMO_NORMAL` (5), `SETPOINT_DEMO_ATAQUE` (45), `SETPOINT_AUSENTE` (-999), `LED_PISCA_MS`. Mais as do emulador, separadas e comentadas como demonstração (D6): `EMULADOR_TRAVA_MS_REAL = 10000`, `EMULADOR_MINUTOS_POR_SEGUNDO = 1`.
- `src/domain/perfis.js` (D1–D3):
  - `PERFIS_FIRMWARE` — `VACINA {2, 8, tol 1}`, `CONGELADO {-30, -18, 1}`, `RESFRIADO {0, 4, 1}`, `PLASMA {-40, -25, 1}`. Usado pelo `/simulador-real` (sempre `VACINA`, igual ao `PERFIL_ATIVO`) e pelos testes portados.
  - `PERFIS_EMULADOR` — `VACINA` (2 a 8, alvo 5), `INSULINA` (2 a 8, alvo 5), `PLASMA` (máx. -25, alvo -30), `CONGELADO` (máx. -18, alvo -20), com `tMin`, `tMax`, `tAlvo`, `tolerancia`, `nome`. Comentário: valores ilustrativos do emulador.
  - Formato único: `{ id, nome, tMin, tMax, tAlvo, tolerancia }`.
- `src/domain/cshield.js`:
  - `ESTADOS` e `MOTIVOS` com os nomes canônicos exatos (strings `'NORMAL'`, `'SETPOINT_INVALIDO'`, `'-'`…).
  - `criarContexto()` — equivalente a `iniciarContexto`.
  - `avaliar(leitura, contexto, agoraMs, opcoes = {})` → `{ decisao, contexto }`. **Não muta** o contexto recebido: copia no início (`structuredClone`) e devolve o novo, para servir ao estado do React. `opcoes.perfil` (padrão `PERFIS_FIRMWARE.VACINA`) e `opcoes.travaMs` (padrão `TRAVA_MS`). Ordem e lógica **linha por linha** como a `avaliar()` da `decisao.h` (sensor/histórico/exposição/crítico → liberação → julgar ordem ou ignorar → estado por prioridade → relés → alarme → trava restante).
  - `leitura`: `{ valida, temperatura, umidade, luzPct, temSetpoint, setpoint, degelo, horaValida, hora, liberacao }`.
  - `decisao`: `{ estado, motivo, cortaAquecedor, ligaVentoinha, novoBloqueio, mudancaIgnorada, liberou, liberacaoRecusada, bloqueado, alarme, taxaCPorMin, exposicao, travaRestanteMs }`.
  - Auxiliares exportadas: `temperaturaValida`, `portaAberta`, `degeloPermitidoNaHora`, `calcularTaxa`.
  - `ventoinhaRefrigeracao(ligadaAntes, bloqueado, chaveEmNormal)` — porta de `ventoinhaRefrigeracaoSimulada` (D11, W26b).
  - `corLed(decisao, agoraMs)` → `'verde' | 'amarelo' | 'amarelo-pisca' | 'vermelho' | 'azul'`; azul sempre que `bloqueado` (W22). Conferir contra `atuadores.h`.
  - `relesPublicados({ state, reason, temperature, setpoint }, perfil)` → `{ cortaAquecedor, ligaVentoinha, controlador: 'NORMAL' | 'ATAQUE' | 'DESCONHECIDO' }` para o `/simulador-real` (W41a): atua só em `BLOQUEIO`/`CRITICO`; frio = `RESFRIAMENTO_RAPIDO` ou (`SETPOINT_INVALIDO` e `setpoint < tMin`); controlador `NORMAL` se `setpoint` = 5, `ATAQUE` se = 45.
- `src/domain/lcd.js` — porta de `painel.h`, devolvendo `[linha1, linha2]` com no máximo 16 caracteres e o grau como `°`:
  - `telaEstado(decisao, leitura, agoraMs, perfil)` — mesma lista de mensagens e a mesma alternância (`ALTERNA_TELA_MS`); `"Liberacao em Ns"`/`"Nm"`, `"Segure botao 3s"`, `"Restaurando temp"`, `"Exposicao 1.2"`.
  - `telaTrava(travaRestanteMs)`, `telaLiberado()`, `telaSemBloqueio()`, `telaLiberando(pct)` (16 blocos `█`), `telaBoot()`.
- `src/domain/fisica.js` — modelo ilustrativo (comentário: "não é a física real; a DPS calibra o modelo de verdade"). Lei de Newton por passo: `T += (alvo − T) × (1 − e^(−k·dtMin))`.
  - `alvoTermico({ perfil, ordem, aquecedorLigado, ventoinhaEmergencia, refrigeracaoLigada })`:
    - calor sem C-Shield: alvo = 45 °C para vacina/insulina (o setpoint do atacante), ou `tMax + 30` nos congelados; frio sem C-Shield: alvo = `tMin − 12`;
    - C-Shield no controle (calor): aquecedor cortado + ventoinha → alvo = `tAlvo`, `k` maior; (frio): aquecedor liberado → alvo = `tAlvo`;
    - normal: alvo = `tAlvo`.
  - `passoTermico(temperatura, alvo, k, dtMin)`; constantes `K_ATAQUE`, `K_PROTECAO`, `K_NORMAL` em `config.js`, escolhidas para um ataque de calor sem proteção sair da faixa da vacina em 2 a 4 min simulados (2 a 4 s reais).
- `tests/cshield.test.js`, `tests/lcd.test.js`, `tests/fisica.test.js`, `tests/helpers.js` (`base()`, `T0 = 100000`, `PASSO = 2000`, `bloquearPorSetpoint`, `quase(a, b, eps = 0.001)` — os mesmos de `test_decisao.cpp`).

Testes a portar (um `describe` por função do C++, cada `CHECK` vira um `expect`, mesmos valores): `teste_perfis`, `teste_validacao_temperatura`, `teste_normal`, `teste_porta_aberta`, `teste_deriva`, `teste_setpoint_invalido`, `teste_sem_setpoint`, `teste_degelo_longo`, `teste_degelo_fora_horario`, `teste_aquecimento_rapido_porta_fechada`, `teste_aquecimento_rapido_porta_aberta`, `teste_sensor_invalido`, `teste_falha_sensor_mantem_regras_1_e_2`, `teste_trava_ignora_ordem`, `teste_liberacao_antes_da_trava`, `teste_liberacao_temperatura_boa`, `teste_liberacao_temperatura_ruim`, `teste_liberacao_descarta_historico_da_taxa`, `teste_liberacao_ordem_ainda_invalida`, `teste_critico`, `teste_exposicao`, `teste_prioridade`, `teste_reles_por_estado`, `teste_nomes`, `teste_alarme_ate_regularizar`, `teste_ataque_frio`, `teste_ventoinha_refrigeracao_no_bloqueio`. Testes extras: `avaliar` não muta o contexto de entrada; `opcoes.travaMs` de 10 s libera em 10 s; `corLed`; `relesPublicados` com o exemplo de resposta do `edge-contrato-web.md` (`BLOQUEIO`, `SETPOINT_INVALIDO`, setpoint 45 → corta aquecedor, liga ventoinha, controlador `ATAQUE`); LCD com 16 colunas no máximo e os textos exatos; física convergindo para o alvo e nunca passando dele.

### Ferramentas e requisitos
Nenhuma dependência nova. TDD obrigatório (`superpowers:test-driven-development`): teste vermelho → código mínimo → verde → commit.

### Passos
1. `config.js` e `perfis.js` + `teste_perfis`. Vermelho, verde. Commit `feat(domain): porta as constantes e os perfis do firmware`.
2. `tests/helpers.js` + testes de `teste_validacao_temperatura` a `teste_deriva` (vermelhos). Commit `test(domain): porta os casos de normal, porta aberta e deriva`.
3. Auxiliares e esqueleto de `avaliar` até os testes do passo 2 passarem. Commit `feat(domain): avalia estados normal, atencao e deriva`.
4. Testes das regras 1 e 2 (setpoint, sem setpoint, degelo longo, degelo fora de hora) → código → verde. Dois commits (`test:` e `feat:`).
5. Regras 3 e 4 (aquecimento rápido com porta fechada e aberta, ataque de frio). Dois commits.
6. Sensor inválido, falha de sensor mantendo regras 1 e 2, crítico, exposição, prioridade. Dois commits.
7. Trava e liberação (5 testes) + `opcoes.travaMs`. Dois commits.
8. Relés, alarme, nomes, imutabilidade do contexto. Dois commits.
9. `ventoinhaRefrigeracao`, `corLed`, `relesPublicados` com testes. Commit `feat(domain): adiciona led, ventoinha de refrigeracao e reles publicados`.
10. `lcd.js` com testes. Commit `feat(domain): porta as telas do lcd 16x2`.
11. `fisica.js` com testes. Commit `feat(domain): cria o modelo termico ilustrativo do emulador`.
12. Contar: o número de `expect` dos testes portados deve ficar perto dos `CHECK` correspondentes do C++ (`grep -c "CHECK(" edge/test/test_decisao.cpp`). Registrar a contagem no relatório da tarefa.

### Como verificar
`npx vitest run` → todos verdes; `grep -rn "Date.now\|new Date" src/domain` vazio; `grep -rn "react" src/domain` vazio; nenhum arquivo de `src/domain` passa de ~250 linhas (se `cshield.js` passar, separar `cshield-saida.js` com `corLed` e `relesPublicados`).

---

## T9 — Domínio da cidade (`cidade.js`)

### Contexto
O mapa do emulador (T11, T12) e o placar (T13) leem tudo daqui. Usa `avaliar`, `fisica` e os perfis do emulador do T8.

### Objetivo
Testes verdes para ataque individual, ataque em massa, local protegido, ativar C-Shield, situação, placar, ataque coordenado (D8) e recomeçar.

### Detalhes técnicos
- `LOCAIS` (5, nomes genéricos, W10): `ubs-vila-mariana` (VACINA, protegido), `ubs-brasilandia` (VACINA), `hemocentro-consolacao` (PLASMA), `farmacia-mooca` (INSULINA), `mercado-liberdade` (CONGELADO); cada um com `x`, `y` (posição no SVG, viewBox 0 0 1000 600), `nome`, `bairro`, `perfil`.
- Estado da cidade (objeto simples, imutável entre passos): `{ relogioSimMs, locais: { [id]: estadoLocal }, ataquesRecentes: [{ localId, emRealMs }], coordenado: null | { n, segundos } }`.
- `estadoLocal`: `{ protegido, temperatura, ordem: 'NORMAL' | 'CALOR' | 'FRIO', inicioAtaqueSimMs, reacaoSimMs, exposicao, contexto, decisao, refrigeracaoLigada, historico: [{ tSimMin, temperatura }] }`.
- Funções puras (todas devolvem a nova cidade):
  - `criarCidade()`.
  - `atacar(cidade, localId, tipo, agoraRealMs)` — W26b: CALOR = setpoint 45 (ou `tMax + 30`) e refrigeração do controlador desligada; FRIO = setpoint `tMin − 12` e aquecedor do controlador ligado. Registra em `ataquesRecentes` e **detecta o coordenado no mesmo clique** (D8: 3+ locais distintos em até 20 s reais).
  - `ataqueEmMassa(cidade, tipo, agoraRealMs)` — ataca os 5; coordenado na hora, `{ n: 5, segundos: 0 }`.
  - `ativarCShield(cidade)` — protege todos; a política não muda (W26).
  - `passo(cidade, dtRealMs)` — avança o relógio simulado (`dtRealMs × 60`, 1 s = 1 min) em sub-ciclos de 2 s simulados; em cada sub-ciclo: monta a `leitura` (setpoint da ordem, porta fechada, hora 02 com `horaValida`), chama `avaliar` só nos protegidos (com `travaMs` = 10 min simulados, equivalente a 10 s reais, D6), aplica `ventoinhaRefrigeracao`, calcula o alvo térmico e roda `passoTermico`. Desprotegido: sem decisão; exposição integrada igual (`(T − tMax) × dt`). Guarda `reacaoSimMs` no primeiro `novoBloqueio`. Histórico limitado (últimos 120 pontos).
  - `liberar(cidade, localId)` — liberação presencial do botão de 3 s: o próximo sub-ciclo leva `liberacao: true`.
  - `situacao(local)` → `'NORMAL' | 'SOB_ATAQUE' | 'ATAQUE_BLOQUEADO' | 'SEGURO' | 'SEGURO_LOTE_EM_ANALISE'` (W17).
  - `placar(cidade)` → as duas UBS: temperatura, tempo até reagir (protegida: `reacaoSimMs`; desprotegida: "3h30 até alguém perceber", constante `PERCEPCAO_SEM_CSHIELD_MIN = 210` vinda do caso ICA), exposição, situação (W19).
  - `recomecar()` = `criarCidade()` (W18).
- `tests/cidade.test.js`: ataque individual muda só o local atacado; local desprotegido sai da faixa em poucos minutos simulados; local protegido entra em `BLOQUEIO` no primeiro ciclo com `SETPOINT_INVALIDO` e volta à faixa; ataque de frio inverte os relés; ataque em massa marca coordenado com n = 5; três ataques individuais em menos de 20 s marcam coordenado no terceiro clique; dois ataques não marcam; três com mais de 20 s não marcam; `ativarCShield` faz o local atacado virar `ATAQUE_BLOQUEADO` e depois `SEGURO` ou `SEGURO_LOTE_EM_ANALISE` conforme a exposição; placar mostra a UBS protegida com reação em segundos simulados e a outra com 3h30; `liberar` antes de 10 s reais é recusado e depois aceito; `recomecar` volta ao inicial; `passo` não muta a cidade recebida.

### Ferramentas e requisitos
Nenhuma dependência nova. TDD.

### Passos
1. `LOCAIS` + `criarCidade` + teste. Commit `feat(domain): define os cinco locais da cidade`.
2. `atacar` e coordenado (testes primeiro). Commits `test:` e `feat:`.
3. `passo` com física e decisão (testes primeiro). Commits.
4. `ativarCShield`, `situacao`, `liberar`. Commits.
5. `placar`, `ataqueEmMassa`, `recomecar`. Commits.
6. Se `cidade.js` passar de ~250 linhas, separar `cidade-placar.js`. Rodar tudo.

### Como verificar
`npx vitest run` → todos verdes (T8 + T9); `npm run build` sem erro.

---

## Modelo de cabeçalho dos arquivos

```js
/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Dev. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 */
```

Em `.jsx`, o mesmo bloco no topo. Em `.css`, o mesmo texto em `/* */`. Arquivos JSON (`package.json`, `vercel.json`) não levam cabeçalho.

## Fim da Fase B

Ao terminar o T9: rodar `npx vitest run`, `npm run build`, `git log --oneline | wc -l` (esperado ≥ 20 commits) e parar. A Fase C (T10–T14) ganha plano próprio em Opus.
