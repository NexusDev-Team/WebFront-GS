> **Atualização de 12/11 (fim do dia): estado real da Fase C.** O plano abaixo foi escrito em 11/11 e mudou duas vezes depois, por pedido do usuário. Vale o que está aqui.
>
> - **Notícias no lugar dos incidentes** (D12): `/noticias`, com as manchetes reais dos ataques na Europa.
> - **O CRUD em API externa não é mais o de incidentes nem o de instalações** (D13 foi substituída pela D17). Ele é o cadastro **"E na sua cidade?"**, no fim de `/noticias`: câmaras do bairro (`nome`, `bairro`, `tipo`, `observacao`, `cadastradoEm`), com cadastrar, listar com filtro por tipo, editar e excluir.
> - **O emulador não usa nenhuma API.** Ativar e desativar o C-Shield num local é uma ação do jogo (sem apelido); "Recomeçar" zera tudo. A T14 (incidente automático) foi cortada.
> - **Dispositivo real** virou a seção `#dispositivo-real` do emulador; **Nexus Dev** é a última página do menu.
> - **MockAPI criada e testada** (12/11): recurso `camaras` no projeto `cshield`; a URL base fica no `.env` local (`VITE_MOCKAPI_URL`, ignorado pelo Git) e deve ser repetida nas variáveis de ambiente da Vercel no deploy (T17). Cadastro, edição, filtro e exclusão foram conferidos pelo site contra a API real.
> - **Pendências da equipe:** a função e a foto de cada integrante (`public/equipe/`), a revisão dos textos de visão e cultura (`src/content/nexusDev.js`) e a conferência dos títulos marcados "Título da equipe" (g1, The Guardian e Food Safety Magazine, cujas páginas bloquearam a leitura automática).
> - **Próximo passo:** Fase D revisada pela D18 (sem FIWARE): ver `docs/specs/web/plano-fase-d.md`.

# Plano — Fase C revisada (11/11, tarde): notícias, CRUD de instalações, emulador e Nexus Dev

## Contexto

### Onde paramos (registrar antes de qualquer outra coisa)
- **T10 pronta**: CRUD de incidentes (`domain/incidentes.js`, `services/mockapi.js`, `hooks/useIncidentes.js`, `components/incidentes/*`, `pages/Incidentes.jsx`). Foi verificada no navegador contra uma MockAPI falsa local.
- **T11 pronta**: `cidade-eventos.js` (com `eventosDoPasso` e `resultadoDaLiberacao`), `camara-vista.js`, `formatarReacao`, e os hooks `usePrefereMenosMovimento`, `useCidadeSimulada`, `useSegurar` e `useCShield`.
- **T12 parou no passo 1**: `components/emulador/rotulos.js` (com teste), `geometria.js` e as novas posições de `LOCAIS`. Último commit: `3446e6c`.
- Testes: 252 verdes (antes de `rotulos`), build ok. A MockAPI real ainda não existe.
- Primeiro passo da execução: gravar este resumo em `docs/specs/web/plano-fase-c.md` (substituindo o plano antigo) e na memória do projeto (`project-fase-c-estado.md` + linha no `MEMORY.md`).

### O que mudou (decisões do usuário, 11/11)
1. **A página de incidentes vira "Notícias".** Ela mostra *por que o C-Shield existe*: as manchetes dos ataques cibernéticos aos refrigeradores na Europa, num visual de portal de notícias. Cada notícia é um cartão com veículo, data, manchete, um resumo nosso e o link "Ler na fonte" (nova aba). As manchetes ficam fixas no código. Não há CRUD nessa página.
2. **O CRUD vai para o emulador: instalações do C-Shield.** Ele substitui o botão "Ativar C-Shield", que protegia tudo de uma vez. Cada local ganha o C-Shield criando um registro no recurso `instalacoes` da MockAPI:
   - **criar** = instalar;
   - **listar** = ver quem está protegido;
   - **editar** = mudar o apelido ou a observação;
   - **excluir** = remover.
   A faixa segura nunca muda pela rede (W26). Não é possível remover enquanto o local está bloqueado ("Libere o bloqueio no local primeiro"). A UBS Vila Mariana continua protegida de fábrica, como unidade piloto fixa e fora da API.
3. **Sai a página `/simulador-real`.** O dispositivo real vira uma seção no fim do emulador (`#dispositivo-real`). Um botão no topo do emulador rola até ela. Os links antigos `/simulador-real` redirecionam para `/emulador#dispositivo-real`.
4. **Nova página "Nexus Dev"** (`/nexus-dev`), última do menu. Mostra cada integrante com nome, função no projeto, foto e RM, e tem seções sobre a visão e a cultura da equipe e sobre a GS.
5. **A equipe passa a se chamar Nexus Dev** em todo o site e nos cabeçalhos dos arquivos (antes, Nexus Dev).
6. **A T14 (incidente automático) sai do plano.** W28 a W35 ficam obsoletos e o código de incidentes é removido. As partes reaproveitáveis viram peças de `ui/`.

### Regras que continuam valendo
- Cabeçalho do grupo em todo arquivo novo; comentários em português; arquivos de até ~250 linhas.
- Camadas: componente só desenha, regra em `src/domain`, rede em `src/services`.
- TDD em domain, services e hooks.
- Vitest sempre a partir de `/c/Users/isacn/Desktop/WebFront-GS` (com D maiúsculo).
- Um commit por passo, sem `Co-Authored-By`, sem push.
- Emulador com linguagem simples, como um jogo.
- Playwright em 390 px e 1440 px.
- Não usar `pkill`. Para conferir o CRUD sem a MockAPI real, usar o servidor falso do scratchpad (`mockapi-falsa.mjs`), adaptado para o recurso `instalacoes`.
- Executar em sequência e parar só no fim, ou se aparecer uma decisão que o plano não cobre.

---

## R1 — Rotas, menu e nome da equipe

**Objetivo:** o menu mostra Início · Emulador · Notícias · Como funciona · Nexus Dev. `/incidentes` e `/simulador-real` redirecionam; "Nexus Dev" substitui "Nexus Dev" em todo lugar.

- `src/components/ui/Navbar.jsx`: novos links `/`, `/emulador`, `/noticias` ("Notícias"), `/como-funciona` e `/nexus-dev` ("Nexus Dev").
- `src/App.jsx`:
  - rotas novas `/noticias` e `/nexus-dev`;
  - `/incidentes` → `<Navigate to="/noticias" replace />`;
  - `/simulador-real` → `<Navigate to="/emulador#dispositivo-real" replace />`.
- Páginas provisórias `src/pages/Noticias.jsx` e `src/pages/NexusDev.jsx`.
- Apagar `src/pages/SimuladorReal.jsx`.
- Troca mecânica de `Nexus Dev` por `Nexus Dev` em todos os cabeçalhos de `src/`, `tests/` e `vite.config.js`, no rodapé (`Footer.jsx`), no `CLAUDE.md` §1 e nos specs (`docs/specs/web/*.md`). Conferir com `grep -rn "Nexus Dev" src tests docs CLAUDE.md`, que deve voltar vazio.
- **Passos:**
  1. Rotas e menu. Commit `feat: reorganiza as rotas com noticias e nexus dev`.
  2. Troca do nome. Commit `chore: renomeia a equipe para nexus dev`.
- **Verificação:** build ok; Playwright abre as 5 rotas e as duas antigas redirecionam.

## R2 — Página Notícias (por que o C-Shield existe)

**Objetivo:** `/noticias` parece um portal de notícias, com a manchete principal em destaque, a grade das outras, uma linha do tempo do caso e a chamada para o emulador. Todo link leva a uma matéria real.

- `src/content/noticias.js`: lista `{ id, veiculo, idioma ('pt' | 'en'), data (AAAA-MM-DD), manchete, resumo, url, destaque? }`. As matérias vêm das fontes do `docs/specs/PLANO-GS.md` §Caso:
  - g1/Reuters, 02/11;
  - The Guardian, 02/11;
  - BBC (as duas ondas);
  - Agência Brasil;
  - CNN Brasil, 05/11;
  - JRI e Crodeon (os monitores que só avisam).
  - **Antes de escrever cada uma:** abrir a URL com WebFetch e copiar a manchete exatamente como foi publicada, com a data. Se a página não abrir, usar os fatos do PLANO-GS e marcar `verificar: true` num comentário. O resumo (2 frases) é nosso, em português simples. Matéria em inglês ganha a etiqueta "Em inglês".
- `src/content/linhaDoTempo.js`, com os fatos do PLANO-GS:
  - 11/10: primeira onda na França;
  - 01 e 02/11: segunda onda, com mais de 100 lojas em vários países;
  - ICA de Estocolmo: ataque às 2h, percebido às 5h30 ("3h30 até alguém perceber");
  - fechamento: "Com o C-Shield: segundos."
- `src/components/noticias/`:
  - `ManchetePrincipal.jsx`: grande, com o veículo como chapéu, manchete em Chakra Petch, resumo, data e "Ler na fonte ↗" (`target="_blank" rel="noopener noreferrer"`, com `aria-label` "Ler a matéria completa no <veículo> (abre em nova aba)");
  - `CartaoNoticia.jsx`;
  - `LinhaDoTempo.jsx`: lista ordenada semântica, com marcador de ataque em vermelho e o C-Shield em `led-forte`.
- Imagens: nenhuma tirada dos sites (direito autoral). Usar uma ilustração SVG própria no destaque, como o termômetro subindo e uma geladeira com faíscas.
- `src/pages/Noticias.jsx`:
  - cabeçalho "Por que o C-Shield existe" e uma frase;
  - destaque e grade de cartões;
  - linha do tempo;
  - painel final "Os monitores avisam. O C-Shield avisa e age." com o botão "Ataque uma cidade" para `/emulador`;
  - nota "Manchetes e links das fontes originais; resumos da equipe."
- `tests/noticias.test.js`: toda notícia tem os campos obrigatórios, `url` em https, data válida, manchete de no máximo 140 caracteres, ids únicos e exatamente um destaque.
- **Passos:**
  1. Conteúdo com teste. Commits `test:` e `feat(noticias): reune as manchetes reais dos ataques na europa`.
  2. Componentes. Commit `feat(noticias): cria a manchete, o cartao e a linha do tempo`.
  3. Página e Playwright em 390 e 1440 px (sem rolagem horizontal, foco visível, links com nova aba). Commit `feat(noticias): monta a pagina de noticias`.

## R3 — CRUD de instalações (substitui incidentes)

**Objetivo:** no emulador, o painel "Instalações do C-Shield" lista os 5 locais e permite instalar, editar o apelido ou a observação e remover (com confirmação na própria linha). O mapa muda na hora, e a remoção fica bloqueada enquanto o local está bloqueado.

### Domínio
- `src/domain/cidade.js`:
  - trocar `ativarCShield(cidade)` por `instalarCShield(cidade, localId)` (mesma regra de hoje, para um local: contexto novo, carrega a exposição e reinicia a reação se o local estiver sob ataque);
  - criar `removerCShield(cidade, localId)`: não faz nada se o local estiver bloqueado ou for o piloto; caso contrário, volta para desprotegido com `decisao = null`, contexto novo e a refrigeração seguindo a ordem;
  - criar `sincronizarProtecao(cidade, idsInstalados)`: instala quem falta e remove quem saiu, sempre mantendo o piloto (`ID_PROTEGIDO_INICIAL`, que passa a ser exportado como `ID_PILOTO`);
  - nos testes de `cidade.test.js` que usavam `ativarCShield`, trocar pela instalação de um local;
  - mais testes: remover um local bloqueado não muda nada; o piloto não sai; sincronizar instala e remove.
- `src/domain/instalacoes.js`:
  - `validarInstalacao({ localId, apelido, observacao }, idsJaInstalados)`: o local precisa estar em `LOCAIS`, não ser o piloto e não estar instalado; `apelido` com até 40 caracteres e `observacao` com até 200, ambos opcionais;
  - `validarEdicaoInstalacao` (só apelido e observação);
  - `novaInstalacao(form, instaladoEmIso)` → `{ localId, apelido, observacao, instaladoEm }`;
  - `idsInstalados(lista)`;
  - `podeRemover(local)` = `!local.contexto.bloqueado`.
- `src/domain/cidade-eventos.js` não muda.

### Serviço e hooks
- `src/services/mockapi.js`:
  - generalizar para `criarCliente(baseUrl, recurso, fetchImpl)`, com `listar(filtros)` (ordenação opcional), `criar`, `atualizar` e `excluir`, mantendo os erros normalizados e o 404 virando `[]`;
  - exportar `instalacoesApi = criarCliente(import.meta.env.VITE_MOCKAPI_URL, 'instalacoes')`;
  - a mensagem de "não configurada" passa a citar a API do C-Shield;
  - adaptar `tests/mockapi.test.js`.
- `src/hooks/useInstalacoes.js`, feito a partir do `useIncidentes` sem filtros: `{ itens, carregando, erro, recarregar, instalar(form), editar(id, dados), remover(id) }`. Testes adaptados de `tests/useIncidentes.test.jsx`.
- `src/hooks/useCidadeSimulada.js`:
  - trocar `ativarCShield` por `instalar(id)`, `remover(id)` e `sincronizar(ids)`;
  - `recomecar()` mantém a proteção das instalações cadastradas (recomeçar zera o jogo, não o cadastro);
  - atualizar o teste.

### Reaproveitar e remover
- Mover o `Campo` do `IncidenteForm` para `src/components/ui/CampoFormulario.jsx`.
- Extrair a confirmação inline do `IncidenteItem` para `src/components/ui/ConfirmacaoInline.jsx`.
- Mover `formato.js` para `src/components/ui/formato.js`.
- Apagar `domain/incidentes.js`, `hooks/useIncidentes.js`, `components/incidentes/*`, `pages/Incidentes.jsx` e os testes deles.

### Tela
- `src/components/emulador/PainelInstalacoes.jsx`: uma linha por local.
  - **Piloto:** "Instalação piloto, fixa".
  - **Sem C-Shield:** "Instalar", que abre um mini formulário com apelido e observação opcionais.
  - **Instalado:** apelido, data e os botões "Editar" e "Remover". "Remover" fica desabilitado, com texto, enquanto o local estiver bloqueado.
  - Estados de carregando, erro com "Tentar de novo" (sem a API o jogo continua só com o piloto) e salvando.
- Na página do emulador: ao carregar a lista, chamar `sincronizar(idsInstalados(itens))`; depois de instalar ou remover com sucesso na API, chamar `instalar` ou `remover` no jogo.

### Passos (cada um com `test:` e `feat:` quando há código testado)
1. `cidade.js`: instalar, remover e sincronizar.
2. `domain/instalacoes.js`.
3. Serviço genérico.
4. `useInstalacoes`.
5. Hook da cidade.
6. Peças de `ui/` reaproveitadas e remoção do código de incidentes.
7. `PainelInstalacoes`.

**Verificação:** testes verdes; contra a MockAPI falsa, instalar a Brasilândia deixa o local azul e com escudo, e um ataque nele vira "Ataque bloqueado"; tentar remover durante o bloqueio está desabilitado; liberar e depois remover funciona.

## R4 — Mapa do emulador (T12, retomada a partir do passo 2)

Igual ao plano anterior: `LocalNoMapa`, `MapaCidade`, `LinhaAtaque` (rompe no escudo), `LinhaDados` (só local → central), `Central` (aviso de ataque coordenado sobreposto ao mapa) e `AvisoAoVivo` (`aria-live`). As mudanças:

- `ControlesAtaque` fica com os botões de ataque do local escolhido (`4T4QU3 D3 C4L0R` e `4T4QU3 D3 FR10`), "Ataque em massa" (calor) e "Recomeçar". **Não tem mais "Ativar C-Shield"**: a proteção vem do `PainelInstalacoes`.
- O rótulo "tempo acelerado: 1 s = 1 min" fica visível.
- Página do emulador:
  - cabeçalho "Seja o hacker" com o botão "Ver o dispositivo real ↓", que rola até `#dispositivo-real`;
  - o mapa, os controles e o painel de instalações;
  - no fim, a seção `<section id="dispositivo-real">` com o cartão do Wokwi (https://wokwi.com/projects/480328417992209409, em nova aba) e o espaço do painel ao vivo, que vem na Fase D (texto "O painel ao vivo chega na próxima etapa.").
  - A rota `/emulador#dispositivo-real` tem que rolar até a seção (`scrollIntoView` no carregamento quando houver hash).
- **Passos:** 2. Linhas. 3. Central, controles, aviso e seção do dispositivo real. 4. Playwright com o fluxo completo pelo teclado, em 390 e 1440 px, com e sem movimento reduzido.

## R5 — Placar e câmara por dentro (T13)

Igual ao plano anterior: `PlacarComparativo`, `Lcd16x2`, `LedEstado`, `Equipamento`, `Rele`, `GraficoTemperatura`, `PainelCamara` e `BotaoSegurar`, com o aviso TRAVA, LIBERADO ou SEM_BLOQUEIO a partir do `resultadoDaLiberacao`. O teste do fluxo no navegador usa a Brasilândia instalada pelo CRUD no lugar do "Ativar".

## R6 — Página Nexus Dev

**Objetivo:** `/nexus-dev` apresenta a equipe com os 5 integrantes (foto, nome, função e RM), visão, cultura e "Sobre a GS".

- `src/content/equipe.js`: `{ nome, rm, funcao, foto, iniciais }` com os 5 nomes e RMs do `CLAUDE.md`. `funcao` começa como `'Função a definir'`. `foto` aponta para `/equipe/<slug>.jpg`; sem o arquivo, mostra um avatar com as iniciais (o `onError` troca para o avatar).
- `public/equipe/`: pasta vazia com um `README.md` dizendo o nome esperado de cada foto.
- `src/components/equipe/CartaoIntegrante.jsx`: foto com `alt` "Foto de <nome>", nome, função e RM em Plex Mono.
- `src/pages/NexusDev.jsx`:
  - "Nexus Dev" (`TituloLed`) e a grade dos integrantes;
  - seções "Nossa visão", "Nossa cultura" e "Sobre a GS 2026.2" (CitizenTech, FIAP, Engenharia de Software 1º ano, as disciplinas de Front-end Design e Web Development, o desafio e o C-Shield como resposta).
  - Os textos de visão e cultura são um **rascunho da equipe para revisão**, marcado num comentário `// RASCUNHO`, escrito a partir do PLANO-GS (cidadão que depende do frio, "vê de longe, só obedece de perto", segurança pensada para quem não tem equipe de TI).
- **Passos:**
  1. Conteúdo com teste (5 integrantes, RMs iguais aos do `CLAUDE.md`). Commits `test:` e `feat(equipe):`.
  2. Cartão e página, com Playwright. Commit `feat(equipe): monta a pagina nexus dev`.
- **Pendente do usuário:** a função de cada um, as fotos (`public/equipe/<slug>.jpg`) e a revisão dos textos.

## R7 — Documentação das decisões
- `docs/specs/web/tasks.md`: registrar as decisões D12 a D16 (notícias no lugar dos incidentes, CRUD de instalações, dispositivo real como seção, Nexus Dev e a troca do nome) e marcar W28 a W35 como substituídos.
- `docs/specs/web/requirements.md`: novos requisitos curtos para notícias, instalações e Nexus Dev.
- Commit `docs: registra as mudancas de escopo da fase c`.

## Verificação geral (fim)
- `npx vitest run` verde e `npm run build` sem erro.
- `npm run lint` sem erro novo.
- Greps do `CLAUDE.md` §7, nenhum `fetch` fora de `src/services` e `grep -rn "Nexus Dev"` vazio.
- Capturas em 390 e 1440 px de `/noticias`, `/emulador` (incluindo a seção do dispositivo real) e `/nexus-dev`.
- Relatório ao usuário com as pendências: URL da MockAPI com o recurso `instalacoes` (campos `localId`, `apelido`, `observacao`, `instaladoEm`), as funções e as fotos da equipe, a revisão dos textos e a conferência das manchetes marcadas para verificar.
