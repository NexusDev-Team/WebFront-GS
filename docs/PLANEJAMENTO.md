# Planejamento completo — site do C-Shield (c-shield-web)

Global Solution 2026.2 "CitizenTech" · FIAP · Engenharia de Software, 1º ano
Disciplinas: **Front-end Design** e **Web Development** (uma única aplicação para as duas)
Equipe **Nexus Vision**:

- Isac Nilton Fernandes de Oliveira — RM573282
- João Benedito de Oliveira Simplício — RM570206
- Leonardo Formigari — RM573291
- Luis Fernando — RM570959
- Nicolas Cinel — RM572940

Versão de 11/11/2026. Este documento junta, num arquivo só, o que está espalhado em `docs/PROMPT-WEB.md`, `docs/specs/PLANO-GS.md` e `docs/specs/web/` (requirements, design, tasks e plano da Fase B).

**Situação atual:** Fase A (especificação) concluída e aprovada, com as decisões D1 a D11. Fase B (T6 a T9) planejada em detalhe, pronta para execução. Fases C a F com escopo definido; cada uma ganha plano detalhado antes de começar.

> **Atualização de 12/11 — Fase D revisada (D18).** O site deixa de ler o FIWARE. Saem as funções `api/estado.js` e `api/historico.js`, o `services/fiware.js`, o `useDispositivoReal()`, o painel ao vivo e a variável `FIWARE_HOST`. A entrega de Edge já foi feita em 11/11 (link do Wokwi e vídeo) e o emulador já mostra todo o comportamento do C-Shield, então um painel ao vivo seria redundante e ainda dependeria do servidor FIWARE e do Wokwi rodando no dia da avaliação. No lugar, a seção `#dispositivo-real` do emulador mostra o circuito do Wokwi embutido (ou um cartão com link, se o Wokwi recusar o iframe) e uma imagem de como o aparelho seria, enviada pela equipe. O plano detalhado está em `docs/specs/web/plano-fase-d.md`. As mudanças da Fase C (notícias, cadastro "E na sua cidade?", emulador sem API, página Nexus Dev, decisões D12 a D17) estão em `docs/specs/web/plano-fase-c.md`. Onde este documento divergir desses dois planos, valem os planos.

---

## 1. O produto

O **C-Shield** (de Cyber Shield) é um ESP32 instalado junto da câmara fria (vacinas, plasma, insulina, congelados). Ele mede com sensores próprios, decide com uma política gravada nele e, quando o controlador comercial da câmara é invadido e recebe uma ordem perigosa (por exemplo, "esquente para 45 °C"), assume o controle localmente pelos relés.

- **Ele não recebe nenhum comando pela rede.** Só envia dados ao FIWARE.
- O bloqueio só termina **presencialmente**: botão segurado por 3 s, depois de uma trava mínima.
- Frase do produto: **"Vê de longe. Só obedece de perto."**

O caso de referência é o ataque real na Europa em que se passaram cerca de **3h30 até alguém perceber**. Com o C-Shield, a reação é em segundos.

## 2. Princípio central do site

**O site nunca dá ordens ao C-Shield.** Nenhum botão, função de servidor ou serviço envia comando ao dispositivo.

- O site não tem nenhuma ligação de rede com o dispositivo: não há funções de servidor nem chamadas ao FIWARE (D18).
- A política (faixa segura) aparece só para leitura, com a etiqueta "gravada no dispositivo".
- Na seção "Dispositivo real" do emulador aparece o texto "Nem este site consegue dar ordens ao C-Shield."
- Nenhum texto do site sugere que o dispositivo recebe comandos pela rede.

## 3. O que o site tem

| Rota | O que é |
| --- | --- |
| `/` | Página inicial com scrollytelling em 4 capítulos (Madrugada, A invasão, O C-Shield, A prova) |
| `/emulador` | "Seja o hacker": uma cidade com 5 locais para atacar, placar comparativo e a câmara por dentro |
| `/simulador-real` | Redireciona para `/emulador#dispositivo-real`: circuito do Wokwi embutido e imagem de como o aparelho seria (D14 e D18) |
| `/incidentes` | CRUD de incidentes numa API externa (MockAPI) |
| `/como-funciona` | Os 4 verbos, os 5 estados, a arquitetura em uma direção e a equipe |
| `*` | 404: "Esta câmara não existe." |

## 4. Stack

- **React com JavaScript puro** (sem TypeScript), **Vite**, **Tailwind CSS v4**, **react-router-dom**.
- **Vitest** para a lógica pura em `src/domain`.
- ~~Funções de servidor da Vercel em `api/`, ponte para o FIWARE.~~ Removidas na D18: o site não lê o FIWARE.
- **MockAPI** para o CRUD (`incidentes` e, se o plano gratuito permitir, `locais`). URL em `VITE_MOCKAPI_URL`.
- Animações com **canvas, SVG e IntersectionObserver**, sem biblioteca de animação.
- Deploy na **Vercel**, com `vercel.json` redirecionando as rotas para `index.html`.
- Conferência visual com **Playwright** em 390 px e 1440 px.

Versões conferidas em 11/11: vite 8.3, @vitejs/plugin-react 6.3, react 19.3, react-router-dom 7.18, tailwindcss 4.3, vitest 5.1 (Node 24, npm 11).

## 5. Regras de código

- Comentários em português; todo arquivo de código começa com o cabeçalho do grupo (projeto, disciplinas e integrantes com RM).
- **Camadas separadas:** componentes só desenham e chamam hooks; regras de negócio em `src/domain` (funções puras e testadas); rede em `src/services`. Componente nunca faz `fetch` direto.
- **Nada hardcoded:** nenhum IP, porta sensível ou URL de API no código; tudo vem do `.env`. `.env` fora do Git; `.env.example` commitado com as chaves vazias.
- Arquivos com até ~250 linhas; padrão repetido vira componente, hook ou função compartilhada.
- **Nomes canônicos iguais ao Edge:**
  - entidade `urn:ngsi-ld:CShield:001`, tipo `CShield`, device `cshield001`; headers `fiware-service: smart` e `fiware-servicepath: /`;
  - atributos `temperature`, `humidity`, `luminosity`, `setpoint`, `defrost`, `state`, `reason`, `blocks`, `exposure`, `TimeInstant`;
  - estados `NORMAL`, `ATENCAO`, `BLOQUEIO`, `CRITICO`, `FALHA_SENSOR`;
  - motivos `-`, `PORTA_ABERTA`, `DERIVA`, `SETPOINT_INVALIDO`, `DEGELO_FORA_HORARIO`, `DEGELO_LONGO`, `AQUECIMENTO_RAPIDO`, `RESFRIAMENTO_RAPIDO`, `TEMP_FORA_TOLERANCIA`, `SENSOR_SEM_LEITURA`.
- O nome exibido é sempre **C-Shield**, vindo de uma constante única.
- **Commits:** Conventional Commits em português, imperativo, uma linha (`feat:`, `fix:`, `docs:`, `test:`, `style:`, `refactor:`, `chore:`). Um commit por passo verificado. Sem push até a equipe criar o repositório na organização.

## 6. As regras do C-Shield que o site reproduz

A lógica é portada para JavaScript a partir do firmware do Edge (`decisao.h` e `config.h`), que é a fonte de verdade.

1. **Estados e prioridade:** `CRITICO` > `BLOQUEIO` > `FALHA_SENSOR` > `ATENCAO` (porta aberta com luz > 40%, ou deriva fora da faixa) > `NORMAL`. `CRITICO` e `FALHA_SENSOR` só depois de 2 ciclos seguidos. O bloqueio é uma condição persistente, separada do estado mostrado.
2. **Quatro gatilhos de bloqueio (vale o primeiro):** setpoint fora da faixa (`SETPOINT_INVALIDO`); degelo com mais de 30 min (`DEGELO_LONGO`) ou fora das janelas 06–07 h e 18–19 h (`DEGELO_FORA_HORARIO`); aquecimento acima de 0,5 °C/min com a porta fechada (`AQUECIMENTO_RAPIDO`); resfriamento acima de 0,5 °C/min abaixo do centro da faixa (`RESFRIAMENTO_RAPIDO`). A taxa só vale com pelo menos 10 s de janela.
3. **Relés por direção:** no calor, corta o aquecedor e liga a ventoinha de emergência; no frio, libera o aquecedor e não liga a ventoinha. Só atua com bloqueio ou crítico.
4. **Trava e liberação presencial:** durante o bloqueio, as novas ordens do controlador são ignoradas. O bloqueio não acaba sozinho. O botão segurado por 3 s só libera depois da trava mínima (60 s no firmware de demonstração; 10 s reais no emulador). Liberar descarta o histórico da taxa; se a ordem continuar inválida, o bloqueio reabre no mesmo ciclo.
5. **Alertas e exposição:** LED verde / amarelo / amarelo piscando / vermelho e **azul fixo durante o bloqueio**. Buzzer só com temperatura fora da faixa (ou nos 5 s iniciais do bloqueio). Exposição térmica = soma de (T − tMax) × dt em °C·min, só acima de tMax. LCD 16x2 com os mesmos textos do firmware, linha 2 alternando a cada 2 s.

## 7. Decisões aprovadas (11/11)

| # | Decisão |
| --- | --- |
| D1–D4 | **Emulador × simulador real.** No emulador, perfis e valores podem ser ilustrativos (PLASMA até -25 °C alvo -30; CONGELADO até -18 °C alvo -20; INSULINA 2 a 8 °C), comentados como demonstração. No `/simulador-real`, tudo exatamente igual ao Edge: perfil VACINA 2 a 8 °C com tolerância 1 °C, nomes FIWARE, estados, motivos, cores e textos. As regras de decisão são as mesmas nos dois. Endereço do Orion em `FIWARE_HOST`. |
| D5 | Dispositivo considerado **offline** quando o `TimeInstant` tem mais de **30 s**. |
| D6 | Trava mínima no emulador: **10 s reais**, com o rótulo "tempo acelerado" (1 s real = 1 min simulado). |
| D7 | Resfriamento rápido só conta **abaixo do centro da faixa**, como no firmware. |
| D8 | **Ataque coordenado** detectado no próprio clique que completa **3 ou mais locais atacados em até 20 s reais**; o "Ataque em massa" é detectado na hora. |
| D9 | API externa: **MockAPI** com `incidentes` e `locais`. Se o plano gratuito não suportar, trocar por outra API (Supabase REST, crudcrud) mudando só `src/services/`. |
| D10 | Repositório remoto criado depois pela equipe, na organização NexusDev-Team, com todos com acesso. Até lá, só commits locais. |
| D11 | Os LEDs laranja, azul e verde e a chave "Controlador" do Wokwi **representam** o aquecedor, a ventoinha de emergência, a refrigeração do controlador e a ordem do atacante. No site, desenhar os equipamentos em si e explicar essa representação; no aparelho real esses LEDs não existem. |
| D12–D17 | Decisões da Fase C (12/11): notícias no lugar dos incidentes, CRUD "E na sua cidade?", dispositivo real como seção do emulador, emulador sem API. Detalhes em `docs/specs/web/plano-fase-c.md` e `docs/specs/web/tasks.md`. |
| D18 | **Sem ponte FIWARE (12/11).** Saem `api/`, `services/fiware.js`, `useDispositivoReal()`, o painel ao vivo, `relesPublicados` e `FIWARE_HOST`. A seção `#dispositivo-real` mostra o Wokwi embutido (ou cartão com link) e a imagem do aparelho enviada pela equipe (`src/assets/dispositivo.png`). Motivo: a entrega de Edge já foi feita e o emulador cobre o comportamento; o painel seria redundante e frágil no dia da avaliação. |

### Representação do circuito do Wokwi (D11)

| Peça no Wokwi | O que representa | Comportamento |
| --- | --- | --- |
| LED laranja "Aquecedor liberado" | Aquecedor/degelo da câmara | Aceso = aquecedor com energia; apaga quando o C-Shield corta (calor) |
| LED azul "Ventoinha de emergência" | Ventoinha de emergência do C-Shield | Acende quando o C-Shield a liga (calor); apagada no frio |
| LED verde "Ventoinha de refrigeração" | Refrigeração do controlador comercial | Segue a chave; durante o bloqueio a chave só consegue ligar, nunca desligar |
| Chave "Controlador" NORMAL/ATAQUE | Ordem do controlador invadido | NORMAL = setpoint 5 °C; ATAQUE = setpoint 45 °C |

## 8. Requisitos (resumo por área)

Lista completa em `docs/specs/web/requirements.md` (W1 a W52), no formato "QUANDO <condição>, O SITE DEVE <resposta>".

- **Rotas e navegação (W1–W4):** 5 rotas com navbar e rodapé; 404 com link para o início; atualizar a página não dá 404; foco visível e `aria-current`.
- **Página inicial (W5–W9):** 4 capítulos em rolagem; fundo binário, geladeira e brilho dos títulos mudam por capítulo; canvas pausa com a aba oculta; capítulo 4 com "Na Europa: 3h30 até alguém perceber. Com o C-Shield: segundos." e o botão "Ataque uma cidade"; menos colunas de binário no celular.
- **Mapa do emulador (W10–W19):** 5 locais (UBS Vila Mariana protegida, UBS Brasilândia, Hemocentro Consolação, Farmácia Mooca, Mercado Liberdade), atacante fora da cidade, central FIWARE no centro; linhas de dados azuis só do local para a central; botões `4T4QU3 D3 C4L0R` e `4T4QU3 D3 FR10` (com `aria-label` "Ataque de calor" e "Ataque de frio"); linha de ataque vermelha que se rompe no escudo do local protegido; ataque em massa; ataque coordenado; "Ativar C-Shield"; "Recomeçar"; placar das duas UBS com "Mesma cidade, mesmo ataque, mesma hora." e "3h30 até alguém perceber" na UBS sem C-Shield.
- **Câmara por dentro (W20–W26c):** LCD 16x2 com os textos do firmware, LED de estado, equipamentos desenhados (aquecedor, ventoinha de emergência, refrigeração), gráfico com a faixa segura, botão de liberação segurado por 3 s (mouse, toque e teclado), "Trava ativa / Aguarde Ns" antes da trava, reabertura com ordem ainda inválida, faixa segura só leitura "gravada no dispositivo".
- **Aparelho real no emulador (W27, revisado na D18):** Wokwi embutido (ou cartão com link em nova aba) e a imagem de como o aparelho seria, na seção `#dispositivo-real`.
- **Emulador cria incidentes (W28–W29):** a cada novo bloqueio, cria um incidente com `origem: "emulador"`, uma vez por bloqueio; se falhar, aviso discreto sem travar.
- **Incidentes (W30–W35):** listar com carregando, erro e lista vazia; filtros por status (`ABERTO`, `EM_ANALISE`, `RESOLVIDO`) e tipo (`CALOR`, `FRIO`); criar com validação; editar status e ação tomada; excluir com confirmação na própria página; opcionalmente cadastrar "a câmara fria do seu bairro".
- **Dispositivo real (W36–W41a) — obsoletos desde a D18:** `GET /api/estado` (Orion) e `GET /api/historico` (STH-Comet, atributos permitidos e `lastN` limitado, 400 para outro atributo); 405 para outro método; polling a cada 3 s que para ao sair da página; offline com mais de 30 s; "sem leitura" quando o valor é -999; relés derivados do que o Edge publica, com a posição da chave pelo setpoint.
- **Nunca dar ordens (W42–W43).** Continuam valendo; sem ponte FIWARE, o site não tem nenhum caminho de rede até o dispositivo.
- **Como funciona (W44):** medir, decidir, assumir, alertar; 5 estados com as cores; arquitetura dispositivo → FIWARE → site; links do Wokwi e do Edge; equipe com RMs.
- **Acessibilidade (W45–W50):** contraste mínimo 4,5:1 e texto nunca transparente; nada pisca mais de 3 vezes por segundo; `prefers-reduced-motion` respeitado; 360 a 1440 px sem rolagem horizontal e alvos de 44 × 44 px; estado nunca só pela cor; mudanças anunciadas com `aria-live`.
- **Qualidade (W51–W52):** separação domínio / serviços / componentes, pelo menos 8 componentes e 2 hooks; `README.md`, `AI.md`, `.env.example` e nenhum segredo no código.

## 9. Direção visual: "Sala de controle às 2h da manhã"

A câmara fria vista de madrugada pelo painel de quem a protege. Sala escura, instrumentos acesos: repouso em azul fraco e estável; ataque em vermelho e falha de energia; o C-Shield assumindo em azul forte e firme, o mesmo significado do LED do aparelho. **A luz conta a história antes do texto.**

Tese de interação:

1. **A cor é estado, não decoração.** Verde, amarelo e vermelho só em indicadores; azul forte só quando o C-Shield está no controle.
2. **O ataque tem direção e se quebra.** Linhas vermelhas do atacante até o local, rompidas no escudo; linhas azuis de dados só do local para a central.
3. **Segurar é um gesto físico.** Liberação segurando 3 s, com barra de 16 blocos como no LCD.
4. **Tempo comprimido, mas honesto.** "Tempo acelerado" sempre visível.

### Tokens de cor

| Token | Valor | Uso |
| --- | --- | --- |
| `noite-950` | `#050B14` | Fundo da página |
| `noite-900` | `#0A1626` | Fundo de seções |
| `painel` | `rgba(14, 32, 56, 0.45)` + blur | Painéis (só o fundo é translúcido) |
| `borda` | `rgba(125, 211, 252, 0.18)` | Bordas finas |
| `gelo-50` | `#EAF6FF` | Texto principal |
| `gelo-300` | `#9CC9E8` | Texto secundário |
| `led-fraco` | `#1E6FA3` | Azul de repouso — **nunca em texto** (contraste 3,6:1) |
| `led-forte` | `#38BDF8` | "O C-Shield assumiu" |
| `ok` / `atencao` / `critico` | `#22C55E` / `#EAB308` / `#EF4444` | Só indicadores de estado |
| `ataque` | `#FF3B4E` | Linhas e brilho do ataque |
| `lcd-fundo` / `lcd-texto` | `#A8C64E` / `#1B2A0B` | LCD 16x2 (contraste 7,85:1) |

Contraste medido: todos os textos acima de 4,5:1, exceto `led-fraco` (proibido em texto) e `critico` sobre o painel (4,33:1, só em texto grande ou ícone).

**Tipografia:** Chakra Petch (títulos), IBM Plex Sans (texto, 16 px), IBM Plex Mono com números tabulares (leituras), VT323 (LCD).

**Efeitos:** `led-brilho`, `led-fraco`, `led-falha` (no máximo 3 quedas por segundo, só durante ataque) e `led-forte`; todos param com `prefers-reduced-motion`. Transições de 150 a 300 ms, só `transform` e `opacity`; canvas com `requestAnimationFrame` pausado quando a aba fica oculta. Ícones em SVG próprio, sem emoji.

### Esboço das páginas

**Página inicial**

```
[canvas FundoBinario fixo atrás]
 Cap. 1  02:00. Câmara de vacinas. Tudo em ordem.        [geladeira fechada, luz fraca]
 Cap. 2  Uma ordem chega pela internet: 45 °C.            [porta abre, faíscas, título em falha,
         Ninguém entrou no prédio.                          termômetro subindo]
 Cap. 3  O C-Shield não obedece.                          [binário para, porta fecha, azul forte]
         Vê de longe. Só obedece de perto.
 Cap. 4  Na Europa: 3h30 até alguém perceber.             [fundo calmo]
         Com o C-Shield: segundos.   [Ataque uma cidade →]
```

**Emulador**

```
┌ "Seja o hacker" · "tempo acelerado: 1 s = 1 min"                                        ┐
├───────────────────────────────────────────────┬──────────────────────────────────────────┤
│ Mapa da cidade (SVG)                          │ Placar comparativo                       │
│  atacante ──vermelho──▶ locais                │  UBS Vila Mariana | UBS Brasilândia      │
│  5 locais ── azul ──▶ Central (FIWARE)        │  temperatura / reação / exposição /      │
│                                               │  situação                                │
│ [Ataque em massa] [Ativar C-Shield] [Recomeçar]                                          │
│ local selecionado: [4T4QU3 D3 C4L0R] [4T4QU3 D3 FR10]                                    │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Câmara por dentro: LCD 16x2 · LED · aquecedor · ventoinha de emergência · refrigeração   │
│   "Controlador: NORMAL | ATAQUE" · gráfico com faixa segura · botão segurar 3 s          │
│   faixa segura "gravada no dispositivo" (só leitura)                                     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ #dispositivo-real: imagem do aparelho │ circuito do Wokwi (iframe ou cartão com link)    │
│   "Nem este site consegue dar ordens ao C-Shield."                                       │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Dispositivo real (D18):** seção no fim do emulador. Duas colunas no desktop e empilhado no celular: a imagem de como o C-Shield seria instalado junto da câmara (com legenda dizendo que é ilustração e que, na simulação, LEDs e chave representam aquecedor, ventoinha e a ordem do atacante) e o circuito do Wokwi. Sem painel ao vivo.

**Incidentes:** filtros de status e tipo, lista com local, bairro, tipo, motivo, início, reação, exposição e status, botões editar e excluir (confirmação inline), formulário com erro junto ao campo.

## 10. Arquitetura

```
App (router)
├─ ui/         Navbar · Footer · PainelVidro · TituloLed · BotaoLed · BotaoSegurar
│              StatusBadge · Carregando · ErroMensagem
├─ pages/      Inicio · Emulador · SimuladorReal · Incidentes · ComoFunciona · NaoEncontrada
├─ home/       FundoBinario (canvas) · GeladeiraFaiscas (SVG + canvas) · Capitulo
├─ emulador/   MapaCidade · LocalNoMapa · LinhaAtaque · LinhaDados · Central
│              PlacarComparativo · ControlesAtaque
├─ camara/     PainelCamara · Lcd16x2 · LedEstado · Rele · Equipamento · GraficoTemperatura
├─ incidentes/ IncidenteForm · IncidenteItem · FiltrosIncidentes
└─ emulador/   SecaoDispositivoReal · WokwiEmbed · ImagemDispositivo   (D18)

hooks/    useCidadeSimulada · useCShield · useCamaras
          useCapituloAtual · usePrefereMenosMovimento · useSegurar
domain/   config · perfis · cshield · fisica · cidade · lcd · camaras
services/ mockapi
```

Sem `api/`, `services/fiware.js` nem `useDispositivoReal` (D18). A única rede do site é a MockAPI do cadastro de câmaras do bairro. A árvore acima mostra só o que mudou; a lista completa da Fase C está em `docs/specs/web/plano-fase-c.md`.

## 11. Fases, tarefas e prazos

| Fase | Tarefas | Prazo | Situação |
| --- | --- | --- | --- |
| A — Especificação | T1 a T5 | 11/11 | Concluída e aprovada |
| B — Base e domínio | T6 a T9 | antes da Fase C | Planejada em detalhe |
| C — O que vale nota | T10 a T14 | 13/11 | Escopo definido |
| D — Dispositivo real e deploy | T15 a T17 | 14/11 | Revisada na D18 (sem FIWARE); plano em `plano-fase-d.md` |
| E — Experiência | T18 a T20 | 15/11 | Escopo definido |
| F — Documentação e entrega | T21 e T22 | 17/11 | Escopo definido |

Cada tarefa termina com verificação e commit. Não se avança com testes falhando.

### Fase A — Especificação (concluída)

- **T1** Leitura do prompt e do firmware; as 5 regras da seção 6.
- **T2** `requirements.md` com W1 a W52.
- **T3** `design.md` com tokens, esboços e árvore de componentes.
- **T4** `tasks.md` com as fases seguintes.
- **T5** Parada para aprovação: decisões D1 a D11 aprovadas em 11/11.

### Fase B — Base e domínio

**T6 — Projeto Vite + React + Tailwind + router + Vitest.**
Cria `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx` com as 6 rotas, páginas vazias, `src/domain/produto.js` (constante `NOME_PRODUTO`), `vercel.json` (rewrite que não captura `/api`), `.env.example` e um teste de fumaça.
Verificação: `npm run build` sem erro, `npx vitest run` com 1 teste passando, as 6 rotas abrindo. Cobre W1–W3.

**T7 — Sistema visual e componentes de `ui/`.**
`tokens.css` (cores e fontes no `@theme` do Tailwind v4), `efeitos.css` (classes de LED e reduced-motion, foco visível), fontes do Google Fonts, e os componentes PainelVidro, TituloLed, BotaoLed (alvo de 44 px), StatusBadge (cor e texto), Carregando, ErroMensagem, Navbar (menu no celular com `aria-expanded`) e Footer. Página inicial provisória como vitrine.
Verificação: capturas em 390 e 1440 px sem rolagem horizontal, Tab por todos os controles, animações paradas com reduced-motion. Cobre W4, W45–W47.

**T8 — Domínio: perfis, regras, física e LCD (TDD).**
- `config.js` — as constantes do `config.h` (janelas, taxas, degelo, trava, setpoints de demonstração 5 e 45, ausente -999) e as do emulador (trava de 10 s, 1 s = 1 min).
- `perfis.js` — `PERFIS_FIRMWARE` (VACINA 2 a 8, CONGELADO -30 a -18, RESFRIADO 0 a 4, PLASMA -40 a -25) e `PERFIS_EMULADOR` (VACINA, INSULINA, PLASMA, CONGELADO, ilustrativos).
- `cshield.js` — `criarContexto()` e `avaliar(leitura, contexto, agoraMs, opcoes)` devolvendo `{ decisao, contexto }` sem mutar a entrada, na mesma ordem da `avaliar()` do firmware; mais `ventoinhaRefrigeracao`, `corLed` (azul sempre no bloqueio) e `relesPublicados` (para o `/simulador-real`; removida na D18).
- `lcd.js` — as telas do `painel.h` (16 colunas no máximo).
- `fisica.js` — modelo térmico ilustrativo (lei de Newton), calibrado para um ataque de calor sem proteção sair da faixa da vacina em 2 a 4 s reais.
- Testes: os 27 casos do `test_decisao.cpp` portados com os mesmos valores, mais imutabilidade, trava de 10 s, LED, relés publicados, LCD e física.
Verificação: `npx vitest run` todo verde; nenhum `Date.now` nem React em `src/domain`. Cobre W21, W22, W24, W25.

**T9 — Domínio da cidade (`cidade.js`, TDD).**
5 locais com posição no mapa; funções puras `criarCidade`, `atacar` (com detecção de coordenado no clique), `ataqueEmMassa`, `ativarCShield`, `passo` (relógio acelerado, decisão só nos protegidos, física em todos, exposição), `liberar`, `situacao` (Normal, Sob ataque, Ataque bloqueado, Seguro, Seguro · lote em análise), `placar` (UBS sem C-Shield com "3h30 até alguém perceber") e `recomecar`.
Verificação: testes verdes para cada comportamento, incluindo os casos-limite do coordenado (2 ataques não contam; 3 com mais de 20 s não contam). Cobre W10, W13–W19.

### Fase C — O que vale nota (até 13/11)

- **T10** `services/mockapi.js` (listar com filtros, criar, atualizar, excluir; erros padronizados), hook `useIncidentes()` e página `/incidentes` com formulário, item, filtros e confirmação inline. Verificar no navegador contra a MockAPI real, incluindo lista vazia e erro. Cobre W30–W35.
- **T11** Hooks `useCShield(perfil)` (ciclo com `useEffect` e intervalo, com limpeza) e `useCidadeSimulada()` (usa `cidade.js` e respeita reduced-motion). Cobre W13–W19.
- **T12** Mapa: MapaCidade, LocalNoMapa, LinhaAtaque (rompe no escudo), LinhaDados (pulsos só para a central), Central e ControlesAtaque. Cobre W10–W18, W50.
- **T13** PlacarComparativo e a câmara por dentro: PainelCamara, Lcd16x2, LedEstado, Rele, Equipamento, GraficoTemperatura (SVG próprio), BotaoSegurar com `useSegurar` (mouse, toque e teclado). Cobre W19–W26c.
- **T14** Incidente criado automaticamente a cada novo bloqueio no emulador, uma vez por bloqueio, com falha silenciosa e aviso discreto. Cobre W28–W29.

### Fase D — Dispositivo real e deploy (até 14/11, revisada na D18)

- **T15 — limpeza do que era FIWARE.** Apagar `relesPublicados` de `src/domain/cshield-saida.js` e o bloco de testes dela em `tests/cshield-saida.test.js`, com os imports que ficarem sem uso (`PERFIS_FIRMWARE` continua, porque `lcd.js` usa). Tirar `FIWARE_HOST` do `.env.example`. Atualizar `CLAUDE.md` e `tasks.md`. Verificar: `npx vitest run` verde e `grep -rni "fiware_host\|relesPublicados" src tests .env.example` vazio.
- **T16 — seção "Dispositivo real".** Testar com o Playwright se o Wokwi (https://wokwi.com/projects/480328417992209409) aceita iframe. `WokwiEmbed.jsx` usa o iframe se aceitar e o cartão com link em nova aba se não aceitar (a escolha fica fixa no código, conforme o teste). `ImagemDispositivo.jsx` mostra `src/assets/dispositivo.png` (importada pelo Vite) com legenda. `SecaoDispositivoReal.jsx` monta os dois e perde o texto "O painel ao vivo... chega na próxima etapa". Verificar com capturas em 390 e 1440 px. Cobre W27, W42, W43.
- **T17 — deploy na Vercel**, só com `VITE_MOCKAPI_URL`; atualizar cada rota sem 404 (incluindo `/simulador-real` caindo na seção). Ação externa: confirmar com a equipe antes.

### Fase E — Experiência (até 15/11)

- **T18** Página inicial: FundoBinario (canvas), GeladeiraFaiscas, Capitulo e `useCapituloAtual()` com IntersectionObserver, nos 4 capítulos. Cobre W5–W9, W46, W47.
- **T19** `/como-funciona` (incluindo a explicação dos LEDs e da chave do Wokwi) e a 404 final. Cobre W2, W26c, W44.
- **T20** Responsividade de 360 a 1440 px, reduced-motion, foco, `aria-label` nos botões em leet, `aria-live` e contraste, com revisão de acessibilidade. Cobre W45–W50.

### Fase F — Documentação e entrega (até 17/11)

- **T21** `README.md` (Ficha CitizenTech igual à do Edge, descrição, telas, pré-requisitos, instalação, execução, deploy, links, equipe) e `AI.md` (ferramentas, interações, aplicação, validação e análise crítica). Cobre W52.
- **T22** Revisão completa (seção 12), 15 ou mais commits significativos, ZIP sem `node_modules` nem `.env`. Cobre W51, W52.

## 12. Revisão e autocorreção (ao fim de cada fase e antes da entrega)

### Verificações automáticas

```bash
npx vitest run           # todos os testes do domínio passam
npm run build            # build de produção sem erros

# o site nunca envia ordens ao C-Shield (D18: não existe api/ nem services/fiware.js): deve voltar VAZIO
grep -rniE "/cmd|commands|setLimits|set_limits|fiware_host" src/
test -d api && echo "ERRO: pasta api/ voltou" || echo "sem api/"

# nada de segredo nem IP no código
grep -rnE "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" src/ || echo "sem IP no código"
git ls-files | grep -E "^\.env$" && echo "ERRO: .env commitado" || echo ".env fora do Git"

ls src/components/*/*.jsx | wc -l   # 8 ou mais componentes
ls src/hooks/*.js | wc -l           # 2 ou mais hooks
git log --oneline | wc -l           # 15 ou mais commits
```

### Conferência no navegador (Playwright, 390 e 1440 px)

- Nenhuma rolagem horizontal no celular.
- Texto legível sobre o fundo animado em todos os capítulos.
- No emulador: ataque individual, ataque em massa, local protegido sem mudar, "Ativar C-Shield", placar atualizando e incidente criado na API.
- Com reduced-motion emulado, nada se move nem pisca.
- Atualizar a página em cada rota não dá 404.

### Conferência contra a rubrica

Tabela com cada item e a evidência (arquivo e linha): Vite, Tailwind, 8+ componentes, `useState` e `useEffect`, 2+ hooks personalizados, separação de responsabilidades, CRUD completo em API externa, funcionalidades não estáticas, 15+ commits, `AI.md`, `README.md`, deploy e acesso dos professores.

### Conferência com o Edge

- Estados, motivos e cores do LED iguais aos do firmware (azul no bloqueio).
- Ataque de frio presente no emulador, com a resposta invertida dos relés.
- Nomes FIWARE iguais aos do contrato do Edge.
- Nenhum lugar do site sugere que o C-Shield recebe comandos.

### Relatório final

O que foi feito; testes que passaram; o que não deu para verificar (por exemplo, o iframe do Wokwi ou o plano da MockAPI); requisitos que ficaram de fora e por quê; próximos passos (deploy final, entrega nas duas disciplinas, gravação de telas para o pitch).

## 13. Riscos e pontos em aberto

- **Plano gratuito da MockAPI:** pode não suportar os dois recursos. Plano B definido em D9 (trocar só a camada de serviço).
- **Wokwi em iframe:** pode ser bloqueado. Plano B: cartão com link em nova aba (W27).
- ~~Servidor FIWARE (EC2) fora do ar.~~ Deixou de ser risco com a D18: o site não depende mais do FIWARE.
- **Imagem do aparelho:** já entregue pela equipe em `src/assets/dispositivo.png`.
- **Repositório remoto:** depende da equipe criar na organização NexusDev-Team e dar acesso aos professores (D10).
- **Prazo apertado entre 12 e 17/11:** a Fase C é a prioridade, porque concentra o que vale nota.
