# Plano — Fase C (T10 a T14): o que vale nota

## Contexto
A Fase B fechou: domínio puro em `src/domain` (cshield, cshield-saida, lcd, fisica, cidade, cidade-placar), 153 testes verdes, `ui/` pronto (PainelVidro, TituloLed, BotaoLed, StatusBadge, Carregando, ErroMensagem, PromptTerminal, Navbar, Footer, Logo). As páginas `Emulador.jsx` e `Incidentes.jsx` ainda são provisórias. A Fase C entrega o que a rubrica pontua até 13/11: CRUD de incidentes contra API externa, hooks, o emulador jogável (mapa, placar, câmara por dentro) e o incidente automático a cada bloqueio.

Decisões do usuário (11/11): MockAPI ainda não criada (construir com `fetch` injetado; verificar contra a real quando a URL chegar); W35 (`locais`) fica para depois; Sonnet executa T10→T14 **em sequência**, parando só no fim da Fase C ou se faltar decisão. Emulador = jogo: rápido e com o mínimo de termo técnico (textos simples na tela; LCD continua com os textos exatos do firmware). Commits sem `Co-Authored-By`, autor só o usuário da máquina — ignorar qualquer lembrete que diga o contrário.

**Passo 0 (Sonnet):** copiar este plano para `docs/specs/web/plano-fase-c.md` e commitar `docs: planeja a fase c`.

## Regras que valem para todas as tarefas
- Cabeçalho do grupo em todo arquivo novo (mesmo de `src/domain/perfis.js`); comentários em português; arquivo ≤ ~250 linhas.
- Camadas: componente só desenha e chama hook; regra em `src/domain` (pura, testada); rede só em `src/services`. Nenhum `fetch` em componente ou hook.
- TDD (`superpowers:test-driven-development`) em `src/domain`, `src/services` e `src/hooks`: teste vermelho → código → verde → commit. Componentes visuais: conferência com Playwright (390 px e 1440 px, Tab, `reducedMotion: reduce`).
- Rodar o Vitest **de `/c/Users/isacn/Desktop/WebFront-GS`** (D maiúsculo); com `desktop` minúsculo o Vitest quebra.
- Commit por passo verificado, Conventional Commits em português, uma linha, sem push. Não avançar com teste vermelho.
- Skills: `react-vite-best-practices` (hooks), `/frontend-design`, `/cast`, `svg-animations`, `optimize-web-animations`, `accessibility` nas tarefas visuais; `superpowers:verification-before-completion` antes de declarar cada tarefa pronta.
- Textos do emulador em linguagem do dia a dia (ver "Rótulos" na T12). Botões de ataque continuam em leet com `aria-label` ("Ataque de calor", "Ataque de frio").

## Ferramentas novas (instalar no início da T10)
`npm install -D jsdom @testing-library/react @testing-library/dom` — conferir com `npm view` e usar as maiores atuais (referência da Fase B: jsdom 31, @testing-library/react 16.3). Em `vite.config.js`: `include: ['tests/**/*.test.{js,jsx}']`. Testes de hook começam com `// @vitest-environment jsdom`. Nenhuma outra dependência.

---

## T10 — CRUD de incidentes (W30–W34)

### Contexto
Primeira integração com API externa; T14 reaproveita o serviço. A MockAPI ainda não existe: tudo é testado com `fetch` simulado e a conferência real fica para quando o usuário colar a URL.

### Objetivo
`/incidentes` lista, filtra (status e tipo), cria, edita (status + ação tomada) e exclui com confirmação inline, com carregando, erro com "Tentar de novo" e lista vazia; testes de domínio, serviço e hook verdes.

### Detalhes técnicos
- `src/domain/incidentes.js`
  - `STATUS = ['ABERTO','EM_ANALISE','RESOLVIDO']`, `TIPOS = ['CALOR','FRIO']`, `MOTIVOS_BLOQUEIO` (os 6 de bloqueio + `TEMP_FORA_TOLERANCIA`).
  - `ROTULOS` em português simples: status (Aberto, Em análise, Resolvido), tipo (Calor, Frio), motivo (`SETPOINT_INVALIDO` → "Ordem de temperatura perigosa", `AQUECIMENTO_RAPIDO` → "Esquentou rápido demais", `RESFRIAMENTO_RAPIDO` → "Esfriou rápido demais", `DEGELO_LONGO` → "Degelo longo demais", `DEGELO_FORA_HORARIO` → "Degelo fora de hora", `TEMP_FORA_TOLERANCIA` → "Temperatura fora do limite"), origem (Emulador, Manual).
  - `validarIncidente(dados)` → `{ [campo]: mensagem }` (vazio = válido): `localNome` e `bairro` obrigatórios (2–60 caracteres), `tipo` e `motivo` dos conjuntos, `inicio` data válida, `tempoReacaoS` e `exposicao` números ≥ 0 (podem ficar vazios → 0), `status` do conjunto, `acaoTomada` ≤ 300 caracteres e **obrigatória quando `status` = RESOLVIDO**.
  - `novoIncidenteManual(form)` → payload completo com `origem: 'manual'`, `localId: 'manual'`, números convertidos, textos aparados, `status` padrão `ABERTO`, `acaoTomada` padrão `''`.
  - `validarEdicao({ status, acaoTomada })` (mesmas regras dos dois campos).
- `src/services/mockapi.js`
  - `export class ErroApi extends Error { status }` com mensagem pronta para a tela.
  - `criarClienteIncidentes(baseUrl, fetchImpl = fetch)` → `{ listar({ status, tipo }), criar(dados), atualizar(id, dados), excluir(id) }`. `listar` usa `?status=&tipo=&sortBy=inicio&order=desc` (só os filtros preenchidos). JSON com `Content-Type: application/json`.
  - Erros normalizados: sem `baseUrl` → "A API de incidentes não está configurada (VITE_MOCKAPI_URL)."; falha de rede → "Sem conexão com a API. Confira a internet e tente de novo."; HTTP ≥ 400 → "A API respondeu com erro (NNN)." **Quirk da MockAPI:** `listar` com filtro sem resultado responde 404 — tratar 404 em `listar` como `[]`.
  - `export const incidentesApi = criarClienteIncidentes(import.meta.env.VITE_MOCKAPI_URL)`.
- `src/hooks/useIncidentes.js` — `useIncidentes(api = incidentesApi)` → `{ itens, carregando, erro, filtros, setFiltros, recarregar, criar, atualizar, excluir }`. Lista ao montar e quando `filtros` muda (descarta resposta velha com flag/AbortController). `criar/atualizar/excluir` devolvem promessa, atualizam `itens` localmente após sucesso e repassam o `ErroApi` para o formulário mostrar.
- `src/components/incidentes/`
  - `FiltrosIncidentes.jsx` — dois `fieldset` com `legend` e botões-rádio estilizados (Todos/Aberto/Em análise/Resolvido; Todos/Calor/Frio), alvo ≥ 44 px.
  - `IncidenteItem.jsx` — local, bairro, tipo, motivo (rótulo), início formatado `pt-BR`, reação (s), exposição (°C·min, 1 casa), status em texto + cor, origem, ação tomada. Botões Editar e Excluir; excluir troca por "Excluir este incidente? [Sim, excluir] [Cancelar]" na própria linha (sem `confirm()`), foco vai para "Cancelar".
  - `IncidenteForm.jsx` — `modo: 'novo' | 'editar'`; no editar só status e ação tomada. Rótulo visível, erro abaixo do campo com `aria-describedby` + `aria-invalid`, botão desabilitado enquanto salva, erro da API em `ErroMensagem`.
- `src/pages/Incidentes.jsx` — `TituloLed` "Incidentes", `PromptTerminal`, botão "+ Novo incidente" que abre o form, filtros, `Carregando` / `ErroMensagem` (com `recarregar`) / vazio ("Nenhum incidente por aqui. Que tal atacar uma cidade no emulador?" com link `/emulador`) / lista.

### Passos
1. Instalar jsdom e testing-library; ajustar `include` do Vitest; `npx vitest run` verde. Commit `chore: adiciona jsdom e testing-library para testar hooks`.
2. `tests/incidentes.test.js` (validação, payload manual, rótulos) vermelho → `src/domain/incidentes.js` → verde. Commits `test(domain): ...` e `feat(domain): valida e monta incidentes`.
3. `tests/mockapi.test.js` com `fetch` falso (`vi.fn`): URL e query de `listar`, 404 vira `[]`, POST/PUT/DELETE com corpo certo, cada erro normalizado, sem baseUrl. Vermelho → serviço → verde. Dois commits.
4. `tests/useIncidentes.test.jsx` (`renderHook`, api falsa): carrega, troca de filtro recarrega, erro e recarregar, criar/atualizar/excluir mexem na lista. Vermelho → hook → verde. Dois commits.
5. `FiltrosIncidentes` + `IncidenteItem`. Commit `feat(incidentes): cria filtros e item da lista`.
6. `IncidenteForm`. Commit `feat(incidentes): cria o formulario com validacao junto ao campo`.
7. Página `/incidentes`. `npm run build`. Playwright em 390/1440 com a API **não configurada** (deve mostrar o erro claro e "Tentar de novo"). Commit `feat(incidentes): monta a pagina do crud`.

### Como verificar
`npx vitest run` verde; `npm run build` sem erro; Playwright mostra o erro de API não configurada sem quebrar. **Pendente do usuário:** criar a MockAPI (ver anexo) e colar a URL no `.env`; então criar, filtrar, editar e excluir no navegador.

---

## T11 — Hooks do emulador (W13–W19, W23)

### Contexto
O domínio da cidade já é puro. Falta o laço de tempo no React, as ações com o relógio real, a vista de uma câmara (LCD, LED, equipamentos) e os eventos que T13 e T14 usam. Atenção: `passo` roda vários ciclos por quadro, então `decisao.novoBloqueio`/`liberou` do último ciclo **não** bastam para detectar eventos — comparar cidade antes/depois.

### Objetivo
`useCidadeSimulada`, `useCShield`, `useSegurar` e `usePrefereMenosMovimento` testados, com a lógica de vista e eventos em funções puras testadas.

### Detalhes técnicos
- `src/domain/cidade.js` — exportar `TRAVA_SIM_MS`, `MS_SIM_POR_MS_REAL` e `travaRestanteSimMs(local, relogioSimMs)`.
- `src/domain/cidade-eventos.js` — `eventosDoPasso(antes, depois)` → `{ novosBloqueios: [localId], liberados: [localId] }` (novo bloqueio = `contexto.bloqueios` aumentou; liberado = `contexto.bloqueado` foi de true a false).
- `src/domain/camara-vista.js` — `vistaDaCamara({ local, def, perfil, relogioSimMs, agoraRealMs, progressoLiberacao, aviso })` → `{ temCShield, lcd: [l1, l2] | null, corLed | null, equipamentos: { aquecedor: 'ligado'|'cortado'|'parado', ventoinhaEmergencia: bool, refrigeracao: bool }, controlador: 'NORMAL'|'ATAQUE', setpointMandado, faixa: { tMin, tMax } }`.
  - LCD por prioridade: segurando (`progressoLiberacao > 0`) → `telaLiberando`; `aviso.tipo` TRAVA/LIBERADO/SEM_BLOQUEIO dentro do prazo → `telaTrava(restanteReal)`/`telaLiberado`/`telaSemBloqueio`; senão `telaEstado` com a decisão em **tempo real** (`travaRestanteMs / MS_SIM_POR_MS_REAL`, para o LCD dizer "Liberacao em 9s", não "9m") e alternando pelo `agoraRealMs`; sem decisão ainda → `telaBoot`.
  - Aquecedor: CALOR e cortado → 'cortado'; CALOR sem corte → 'ligado'; FRIO com bloqueio → 'ligado' (liberado pelo C-Shield); resto 'parado'. Desprotegido: `lcd` e `corLed` nulos.
- `src/domain/cidade-placar.js` — `formatarReacao(item)` → `null` | "2 s" (segundos simulados, arredondado) | "3h30 até alguém perceber".
- `src/hooks/usePrefereMenosMovimento.js` — `matchMedia('(prefers-reduced-motion: reduce)')` com listener e limpeza.
- `src/hooks/useCidadeSimulada.js` — `useCidadeSimulada()` → `{ cidade, placar, eventos, atacar(id, tipo), ataqueEmMassa(tipo), ativarCShield(), liberar(id), recomecar() }`. `setInterval` de 100 ms; `dt` real por `Date.now()` com teto de 250 ms (aba dormindo não dá salto); pausa com `document.hidden`; limpa no unmount. Ações usam `Date.now()` como `agoraRealMs`. `eventos` = último `eventosDoPasso` não vazio (com um `id` crescente para efeitos reagirem uma vez).
- `src/hooks/useCShield.js` — `useCShield(cidade, localId, { progressoLiberacao, aviso })` → `vistaDaCamara(...)`; `useEffect` com intervalo de 1 s atualizando `agoraRealMs` (alternância do LCD a cada 2 s e pisca do LED).
- `src/hooks/useSegurar.js` — `useSegurar(ms, aoCompletar)` → `{ progresso (0..1), segurando, props }`; `props` = `onPointerDown/Up/Leave/Cancel` e `onKeyDown/Up` (Espaço e Enter, sem repetir no auto-repeat); soltar antes cancela e zera; completa uma única vez; intervalo de 50 ms; limpa no unmount.

### Passos
1. `tests/cidade-eventos.test.js` + exports do `cidade.js` → verde. Commits `test:`/`feat(domain): detecta novos bloqueios e liberacoes`.
2. `tests/camara-vista.test.js` (LCD de cada caso, conversão para segundos reais, equipamentos calor/frio/desprotegido) → `camara-vista.js`. Commits.
3. `formatarReacao` com teste. Commit.
4. `usePrefereMenosMovimento` + teste jsdom (mock de `matchMedia`). Commit.
5. `tests/useCidadeSimulada.test.jsx` (fake timers: ataque leva a `SOB_ATAQUE`/`ATAQUE_BLOQUEADO`, evento de novo bloqueio sai uma vez, limpeza no unmount, teto de dt) → hook. Commits.
6. `tests/useSegurar.test.jsx` (completa em 3 s, cancela ao soltar, teclado, uma vez só) → hook. Commits.
7. `useCShield` + teste curto. Commit `feat(hooks): cria o useCShield com o ciclo de 1 s`.

### Como verificar
`npx vitest run` verde; nenhum `fetch` em `src/hooks`; `grep -rnE "Date\.now|new Date" src/domain` vazio.

---

## T12 — Mapa do emulador (W10–W18, W50)

### Contexto
Usa `useCidadeSimulada` e `usePrefereMenosMovimento`. É a cara do "seja o hacker".

### Objetivo
`/emulador` mostra o mapa SVG com 5 locais, atacante, central, linhas de ataque (rompem no escudo dos protegidos) e de dados (só local → central), controles de ataque, coordenado na central e anúncio `aria-live`, jogável por mouse, toque e teclado.

### Detalhes técnicos
- `src/components/emulador/rotulos.js` — textos simples: situação (Normal, Sob ataque, Ataque bloqueado, Seguro, Seguro · lote em análise) e cor de cada uma (vermelho = ataque, `led-forte` = protegido/bloqueado, `ok` = seguro).
- `MapaCidade.jsx` — `<svg viewBox="0 0 1000 600" role="group" aria-label="Mapa da cidade">`; desenha linhas antes dos nós. Ajustar `x,y` de `LOCAIS` em `cidade.js` se preciso para: central no centro (~500,300) sem encostar em local; nenhuma linha de ataque passando sobre a central ou outro local (atacante fora da cidade, ex. canto superior esquerdo). Testes de `LOCAIS` continuam valendo.
- `LocalNoMapa.jsx` — `role="button"`, `tabIndex=0`, Enter/Espaço/clique seleciona, `aria-pressed` quando selecionado, `aria-label` "UBS Brasilândia, sob ataque". Ícone próprio por perfil (frasco, gota, cruz, carrinho), escudo azul quando protegido, vermelho + `led-falha` quando sob ataque, temperatura em Plex Mono.
- `LinhaAtaque.jsx` — atacante → local enquanto `ordem !== 'NORMAL'`; desprotegido: linha inteira vermelha; protegido: para no raio do escudo com quebra (faíscas curtas). Animação por `stroke-dashoffset`; parada com reduced-motion.
- `LinhaDados.jsx` — só para protegidos, local → central, pulsos andando só na direção da central; estático com reduced-motion. Nunca entre locais nem da central para fora.
- `Central.jsx` — "Central (FIWARE)" e, com `coordenado`, "Ataque coordenado detectado: N locais em X s".
- `ControlesAtaque.jsx` — com local selecionado: `4T4QU3 D3 C4L0R` / `4T4QU3 D3 FR10` (`BotaoLed variante="ataque"`, `aria-label`); sempre: "Ataque em massa", "Ativar C-Shield", "Recomeçar". Rótulo "tempo acelerado: 1 s = 1 min" visível.
- `AvisoAoVivo.jsx` — região `aria-live="polite"` visualmente oculta que anuncia mudanças de situação ("UBS Brasilândia: sob ataque").
- `src/pages/Emulador.jsx` — cabeçalho "Seja o hacker" + uma frase simples de instrução; mapa + controles. Seleção padrão: `ubs-vila-mariana`.

### Passos
1. `rotulos.js` + `LocalNoMapa` + `MapaCidade` com locais, atacante e central. Commit.
2. `LinhaDados` e `LinhaAtaque` (com quebra no escudo). Commit `feat(emulador): rompe a linha de ataque no escudo`.
3. `Central` + `ControlesAtaque` + `AvisoAoVivo`, ligados ao hook na página. Commit.
4. Playwright 390/1440: atacar desprotegido (vermelho, temperatura sai da faixa em ~1 s), atacar protegido (linha rompe, "Ataque bloqueado"), ataque em massa (coordenado n = 5), ativar e recomeçar; Tab + Enter; `reducedMotion: reduce` sem animação; sem rolagem horizontal. Corrigir. Commit `fix`/`style` se houver.

### Como verificar
Capturas 390/1440; fluxo completo pelo teclado; build sem erro.

---

## T13 — Placar e câmara por dentro (W19–W26a, W23, W24)

### Contexto
Usa `useCShield`, `useSegurar`, `formatarReacao` e `eventos.liberados` (aviso "Liberado").

### Objetivo
Placar das duas UBS atualizado a cada quadro e a câmara do local selecionado com LCD, LED, equipamentos desenhados, ordem do controlador, faixa "gravada no dispositivo", gráfico e botão de segurar 3 s que libera de verdade.

### Detalhes técnicos
- `src/components/emulador/PlacarComparativo.jsx` — duas colunas (com C-Shield × sem): Temperatura, Tempo até reagir (`formatarReacao`), Exposição ao calor (°C·min, 1 casa), Situação (texto + cor). Frase: "Mesma cidade, mesmo ataque, mesma hora."
- `src/components/camara/`
  - `Lcd16x2.jsx` — VT323, `lcd-fundo`/`lcd-texto`, 2 linhas sempre com 16 colunas (completa com espaço), `aria-label` com o texto das duas linhas.
  - `LedEstado.jsx` — cor + texto ("Bloqueio — azul fixo"); `amarelo-pisca` usa classe de pisca ≤ 3 Hz; reduced-motion parado. Reusável no `/simulador-real` e no como-funciona.
  - `Equipamento.jsx` — `tipo: 'aquecedor' | 'ventoinha' | 'refrigeracao'`: resistência que brilha/apaga, ventoinha que gira (CSS `transform`, parada no reduced-motion), refrigeração ligada/parada; rótulo em texto ("Aquecedor cortado pelo C-Shield", "Ventoinha de emergência ligada", "Refrigeração desligada pelo atacante").
  - `Rele.jsx` — tag "Relé 1 · aquecedor: cortado/normal", "Relé 2 · ventoinha: ligada/desligada".
  - `GraficoTemperatura.jsx` — SVG próprio: linha do `historico`, faixa segura sombreada, eixo em Plex Mono; props `{ pontos, tMin, tMax }`; reusável no T16.
  - `PainelCamara.jsx` — compõe tudo; desprotegido mostra "Sem C-Shield: ninguém vê, ninguém reage" + equipamentos + gráfico (sem LCD/LED/botão). "Ordem do controlador: normal / ataque (mandou 45 °C)". Faixa "2 °C a 8 °C · gravada no dispositivo" só leitura.
- `src/components/ui/BotaoSegurar.jsx` — usa `useSegurar(3000, aoCompletar)`; mostra barra de 16 blocos; texto "Segure 3 s para liberar"; ao completar chama `liberar(id)`; se ficar recusado (`liberacaoRecusada`), aviso TRAVA no LCD por 3 s; se não havia bloqueio, aviso SEM_BLOQUEIO; `eventos.liberados` → aviso LIBERADO 3 s.
- Página Emulador: placar ao lado do mapa (desktop) ou abaixo (celular); câmara abaixo.

### Passos
1. `PlacarComparativo`. Commit.
2. `Lcd16x2` + `LedEstado`. Commit.
3. `Equipamento` + `Rele`. Commit.
4. `GraficoTemperatura`. Commit.
5. `BotaoSegurar` + `PainelCamara` ligados na página. Commit `feat(camara): mostra a camara por dentro com o botao de segurar`.
6. Playwright: ataque no protegido → LCD "Estado: Bloqueio"/"Alt. de Setpoint"/"Liberacao em Ns"; segurar antes de 10 s → "Trava ativa"; depois → "Estado: Liberado" e situação "Seguro"; desprotegido ativado tarde → "Seguro · lote em análise"; teclado (Espaço segurado); reduced-motion; 390/1440. Corrigir e commitar.

### Como verificar
Fluxo inteiro em menos de 1 min real no navegador; capturas; build e testes verdes.

---

## T14 — Incidente automático (W28, W29)

### Contexto
Liga o emulador (T11/T12) ao serviço da T10.

### Objetivo
Cada novo bloqueio no emulador cria um incidente uma única vez; falha não trava o jogo e aparece como aviso discreto.

### Detalhes técnicos
- `src/domain/incidentes.js` — `incidenteDoBloqueio({ def, local, inicioIso })` → `{ origem: 'emulador', localId, localNome, bairro, tipo: local.ordem, motivo: local.contexto.motivoBloqueio, inicio, tempoReacaoS: round(reacaoSimMs / 1000), exposicao: 1 casa, status: 'ABERTO', acaoTomada: '' }`.
- `src/hooks/useIncidenteAutomatico.js` — `useIncidenteAutomatico(cidade, eventos, api = incidentesApi)` → `{ aviso }`; para cada `novosBloqueios`, chave `${localId}:${contexto.bloqueios}` num `Set` em `useRef` (não duplica nem no StrictMode); `inicioIso = new Date().toISOString()` no hook; erro vira `aviso` "Não deu para registrar o incidente agora. O C-Shield seguiu protegendo." por alguns segundos.
- Página Emulador: aviso discreto (`role="status"`) perto dos controles + link "Ver incidentes".

### Passos
1. Teste de `incidenteDoBloqueio` → código. Commits.
2. `tests/useIncidenteAutomatico.test.jsx` (cria uma vez por bloqueio, dois bloqueios = dois incidentes, erro vira aviso sem lançar) → hook. Commits.
3. Ligar na página; Playwright com API não configurada: jogo continua e o aviso aparece. Commit `feat(emulador): registra um incidente a cada bloqueio`.

### Como verificar
Testes verdes; com a MockAPI real: atacar 2 locais protegidos → 2 incidentes `origem: emulador` em `/incidentes`.

---

## Fim da Fase C — verificação geral
`npx vitest run` verde; `npm run build` sem erro; `npm run lint` sem erro novo; greps do `CLAUDE.md` §7 (nada de POST/PUT/PATCH/DELETE em `fiware.js`/`api/`, nada de `/cmd`, nada de IP); nenhum `fetch` fora de `src/services`; arquivos ≤ ~250 linhas; capturas 390/1440 do emulador e de `/incidentes`. Relatório ao usuário e parada. Pendências que dependem dele: URL da MockAPI e conferência do CRUD real.

## Anexo — criar a MockAPI (usuário)
1. mockapi.io → entrar → novo projeto "c-shield-web".
2. Recurso `incidentes` com campos: `localId` (string), `localNome` (string), `bairro` (string), `tipo` (string), `motivo` (string), `inicio` (date), `tempoReacaoS` (number), `exposicao` (number), `status` (string), `acaoTomada` (string), `origem` (string). Apagar os dados de exemplo (faker) ou deixar com 0 itens.
3. Copiar a URL base (ex. `https://xxxx.mockapi.io/api/v1`) para `.env` como `VITE_MOCKAPI_URL=` e reiniciar o `npm run dev`.
