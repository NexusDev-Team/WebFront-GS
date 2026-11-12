# Tarefas — site do C-Shield (c-shield-web)

Fase A, T4 do `docs/PROMPT-WEB.md`. Cada tarefa: requisitos cobertos (W..), verificação e commit em português (Conventional Commits, sem co-autor). Sem dono por pessoa: tudo é construído daqui; o usuário avisa quando o João for commitar. Cada fase ganha plano próprio em Opus antes de executar em Sonnet (`CLAUDE.md` §2).

## Decisões do T5 (aprovadas pelo usuário em 11/11)

- **D1–D4 — emulador × simulador real.** No **emulador**, perfis e valores podem ser ilustrativos (simulados), desde que coerentes: faixas do prompt (PLASMA ≤ -25 alvo -30, CONGELADO ≤ -18 alvo -20, INSULINA +2 a +8), com comentário dizendo que são de demonstração. No **`/simulador-real`**, tudo deve ser **exatamente igual ao Edge**: perfil VACINA `{2, 8, tol 1}` do `config.h`, nomes FIWARE, estados, motivos, cores do LED, textos e `FIWARE_HOST` para o endereço. As regras de decisão (`cshield.js`) seguem `decisao.h` nos dois casos; só os perfis e o tempo do emulador mudam.
- **D5 — offline:** 30 s (sem objeção do usuário).
- **D6 — trava mínima no emulador:** 10 s reais, com o rótulo "tempo acelerado". Aprovado.
- **D7 — resfriamento rápido:** abaixo do centro da faixa, como no `decisao.h` (sem objeção).
- **D8 — ataque coordenado mais rápido e interativo:** a central detecta **no próprio clique** que completa 3 ou mais locais atacados dentro de **20 s reais**; o "Ataque em massa" é detectado na hora. A mensagem "Ataque coordenado detectado: N locais em X s" aparece imediatamente.
- **D9 — API externa:** MockAPI primeiro (`incidentes` e `locais`). Se o plano gratuito não suportar os dois recursos ou o CRUD completo, trocar por outra API externa que suporte tudo (por exemplo, Supabase com REST ou crudcrud), só mudando `src/services/mockapi.js` (renomeado para `src/services/api.js` se trocar). Nenhum componente muda.
- **D11 — LEDs e chave do Wokwi (11/11):** os LEDs laranja (aquecedor liberado), azul (ventoinha de emergência) e verde (refrigeração do controlador) e a chave "Controlador" só existem porque o Wokwi não tem os equipamentos reais. No emulador, desenhar os equipamentos (W26a) e tratar os botões de ataque como a chave (W26b); no `/simulador-real`, derivar os relés pela regra do `decisao.h` e mostrar a posição da chave pelo setpoint (W41a); explicar a representação no `/como-funciona` e na seção do Wokwi (W26c). Afeta T8 (`cshield.js` + função pura `ventoinhaRefrigeracao`, portando `teste_ventoinha_refrigeracao_no_bloqueio`), T13, T16 e T19.
- **D10 — repositório:** a equipe cria o repositório depois, na organização, com todos os membros já com acesso. Nada de `gh repo create` nem push por aqui; o repositório local segue só com commits até lá.

### Mudanças de escopo de 11/11 (tarde), pedidas pelo usuário

- **D12 — Notícias no lugar dos incidentes.** A página `/incidentes` virou `/noticias`: mostra POR QUE o C-Shield existe, com manchetes reais dos ataques aos refrigeradores na Europa, no formato de portal (capa, grade, linha do tempo). Conteúdo fixo em `src/content`; cada cartão leva à matéria original. Onde a página da fonte não abriu na conferência, o título é da equipe e a tela avisa "Título da equipe". `/incidentes` redireciona para `/noticias`.
- **D13 (substituída pela D17) — CRUD de instalações no emulador.** O CRUD exigido pela rubrica passa a ser o das **instalações do C-Shield** (recurso `instalacoes` da MockAPI: `localId`, `apelido`, `observacao`, `instaladoEm`). Instalar protege um local; editar muda apelido e observação; remover tira a proteção, mas só depois de liberar o bloqueio. Substitui o botão "Ativar C-Shield". A UBS Vila Mariana é a unidade piloto, fixa e fora da API. A faixa segura nunca é cadastro.
- **D14 — Dispositivo real dentro do emulador.** A página `/simulador-real` saiu: virou a seção `#dispositivo-real` no fim do emulador, com um botão no topo que leva até ela. `/simulador-real` redireciona para `/emulador#dispositivo-real`. O painel ao vivo (FIWARE) entra na Fase D como parte dessa seção.
- **D15 — Página Nexus Dev e novo nome da equipe.** Nova página `/nexus-dev`, última do menu, com foto, nome, função e RM de cada integrante, visão, cultura e "Sobre a GS". A equipe passa a se chamar **Nexus Dev** (antes, Nexus Vision) no site, nos cabeçalhos dos arquivos e nos specs. Funções, fotos e a revisão dos textos ficam com a equipe.
- **D16 — T14 cortada.** Sem a página de incidentes, não há mais incidente automático a cada bloqueio. **W28 a W35 ficam substituídos** pelos requisitos W53 a W58 (ver `requirements.md`).

- **D17 — O CRUD sai do emulador e vira o cadastro de câmaras do bairro, em Notícias (12/11).** O usuário não gostou do ativar/desativar ligado à API dentro do emulador. Agora: (a) o emulador fica **sem nenhuma API**: ativar e desativar o C-Shield num local é uma ação do jogo, na zona de defesa do card; o apelido saiu; "Recomeçar" zera tudo; (b) o CRUD em API externa (rubrica) é o cadastro **"E na sua cidade?"**, no fim de `/noticias`: cadastrar, listar com filtro por tipo, editar e excluir câmaras do bairro (recurso `camaras` da MockAPI: `nome`, `bairro`, `tipo`, `observacao`, `cadastradoEm`). Substitui W54 a W56 pelos requisitos W59 a W61.

### Tabela original (referência)

| # | Item | Prompt | Edge (fonte de verdade) | Recomendação |
| --- | --- | --- | --- | --- |
| D1 | Perfil PLASMA | ≤ -25, alvo -30 | `{tMin -40, tMax -25, tol 1}` | usar config.h; alvo -30 |
| D2 | Perfil CONGELADO | ≤ -18, alvo -20 | `{tMin -30, tMax -18, tol 1}` | usar config.h; alvo -20 |
| D3 | Perfil INSULINA | +2 a +8 | não existe no firmware | perfil só do site, valores de VACINA, comentado |
| D4 | Variável do Orion | `FIWARE_HOST` | `FIWARE_URL` no exemplo | `FIWARE_HOST` (só o host; portas 1026/8666 em constante) |
| D5 | Offline | `TimeInstant` > 30 s | "uns 15 s" | 30 s (publica a cada 5 s; folga para a EC2) |
| D6 | Trava mínima no emulador | 10 s (1 s = 1 min) | 60 s demo / 30 min real | 10 s reais, rótulo "tempo acelerado" |
| D7 | Resfriamento rápido | "temperatura abaixo de 5 °C" (contrato) | abaixo do **centro** da faixa | centro da faixa (vale para todos os perfis) |
| D8 | Ataque coordenado | "3 ou mais locais em menos de 60 s" | — | 3+ locais em 60 s **reais** (em tempo simulado seria só 1 s real, curto demais para clicar locais um a um) |
| D9 | MockAPI | `incidentes` + `locais` | — | criar os dois; se o plano gratuito não couber, só `incidentes` (W35 cai) |
| D10 | Repositório remoto | privado | — | `NexusDev-Team/c-shield-web`; criar e dar push só com confirmação; professores com escrita (faltam os usuários GitHub deles) |

## Fase B — Base e domínio

- **T6** Projeto Vite + React (JS) + Tailwind + `react-router-dom` + Vitest; `vercel.json` (rewrite para `index.html`); `.env.example` (`VITE_MOCKAPI_URL`, `FIWARE_HOST`); rotas vazias com Navbar/Footer provisórios e 404. Cobre W1, W2, W3. Verificar: `npm run build` e `npx vitest run` (1 teste de fumaça) passam; as 5 rotas e uma inexistente abrem no `npm run dev`. Commit: `chore: cria o projeto vite com react, tailwind, router e vitest`.
- **T7** Tokens (`tokens.css` + `tailwind.config.js`), fontes, `efeitos.css` (`led-brilho`, `led-fraco`, `led-falha`, `led-forte`, reduced-motion) e `ui/` (Navbar, Footer, PainelVidro, TituloLed, BotaoLed, StatusBadge, Carregando, ErroMensagem); página `/` provisória com todos. Cobre W4, W45, W46, W47 (base). Verificar: captura Playwright 390/1440 px; foco visível por Tab. Commits por grupo de componentes.
- **T8** `src/domain/perfis.js`, `cshield.js` (`criarContexto`, `avaliar(leitura, ctx, agoraMs)` devolvendo `{decisao, ctx}` sem mutar a entrada), `fisica.js` (Newton ilustrativo, efeito dos relés) e `lcd.js` (textos de `painel.h`). TDD portando os casos de `test_decisao.cpp` (perfis, normal, porta, deriva, setpoint inválido, sem setpoint, degelo longo/fora de hora, aquecimento rápido porta fechada/aberta, sensor inválido, trava ignora ordem, liberação antes/depois da trava, descarte do histórico, reabertura, crítico, exposição, prioridade, relés, alarme até regularizar, ataque de frio). Cobre T1, W21, W22, W24, W25. Verificar: `npx vitest run` verde. Commits `test:` e `feat(domain):` alternados.
- **T9** `src/domain/cidade.js`: 5 locais, ataque individual, ataque em massa, local protegido que não muda de política, ativar C-Shield, situação ("Ataque bloqueado", "Seguro", "Seguro · lote em análise"), placar das UBS e ataque coordenado. Cobre W10, W13–W19. Verificar: testes verdes.

## Fase C — O que vale nota (até 13/11)

- **T10 (replanejada, ver D12 e D13)** `services/mockapi.js` (cliente por recurso: listar, criar, atualizar, excluir; erros normalizados) + `useInstalacoes()` + painel de instalações no emulador; a página `/noticias` no lugar de `/incidentes`. Antes: `useIncidentes()` + página `/incidentes` com IncidenteForm, IncidenteItem, FiltrosIncidentes, confirmação inline. Cobre W30–W34 (W35 se D9). Verificar: criar, filtrar, editar e excluir no navegador contra a MockAPI real; lista vazia e erro simulados.
- **T11** `useCShield(perfil)` (ciclo com `useEffect` + intervalo, limpeza) e `useCidadeSimulada()` (usa `cidade.js`, relógio acelerado, `usePrefereMenosMovimento`). Cobre W13–W19.
- **T12** Mapa: MapaCidade, LocalNoMapa, LinhaAtaque (rompe no escudo), LinhaDados (pulsos só para a central), Central, ControlesAtaque. Cobre W10–W18, W50.
- **T13** PlacarComparativo e câmara por dentro: PainelCamara, Lcd16x2, LedEstado, Rele, GraficoTemperatura, BotaoSegurar + `useSegurar(ms, aoCompletar)` (mouse, toque, teclado). Cobre W19–W26, W23.
- **T14 (cortada, ver D16)** Incidente automático a cada novo bloqueio (`novoBloqueio` → `criar`), uma vez por bloqueio, falha silenciosa com aviso. Cobre W28, W29.

## Fase D — Dispositivo real e deploy (até 14/11)

- **T15** `api/estado.js` e `api/historico.js` (só GET, 405, lista de atributos, `lastN` limitado, `FIWARE_HOST`), `services/fiware.js`, `useDispositivoReal()` (polling 3 s, offline > 30 s). Proxy no `vite.config.js` ou `vercel dev` para desenvolver. Cobre W36–W41. Verificar: greps do prompt §4.1 vazios; `curl -X POST` local → 405.
- **T16** Página `/simulador-real` (PainelReal, offline, "Nem este site consegue dar ordens ao C-Shield.") e `WokwiEmbed` no emulador (testar se o Wokwi aceita iframe). Cobre W27, W39–W43.
- **T17** Deploy na Vercel com as variáveis; atualizar cada rota sem 404; página real com o Wokwi rodando. Cobre W3. (Ação externa: confirmar antes.)

## Fase E — Experiência (até 15/11)

- **T18** Home: FundoBinario, GeladeiraFaiscas, Capitulo, `useCapituloAtual()` (IntersectionObserver), 4 capítulos. Usar `/cast`, `/design-dna`, `svg-animations`, `optimize-web-animations`. Cobre W5–W9, W46, W47.
- **T19** `/como-funciona` e 404 final. Cobre W2, W44.
- **T20** Responsividade 360–1440 px, reduced-motion, foco, `aria-label`, `aria-live`, contraste; revisão com `web-design-guidelines` e `accessibility`. Cobre W45–W50.

## Fase F — Documentação e entrega (até 17/11)

- **T21** `README.md` (Ficha CitizenTech igual à do Edge, descrição, telas, pré-requisitos, instalação, execução, deploy, links, equipe) e `AI.md` (ferramentas, interações, aplicação, validação, análise crítica). Cobre W52.
- **T22** Revisão completa do prompt §4 (greps, build, testes, Playwright, tabela da rubrica, conferência com o Edge); 15+ commits; ZIP sem `node_modules` nem `.env`. Cobre W51, W52.
