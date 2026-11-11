# Prompt — Site do C-Shield (Front-end Design + Web Development · GS 2026.2 · Nexus Vision)

> Cole este arquivo no Claude Code, na raiz do repositório **`c-shield-web`** (privado, separado do repositório do Edge).
> Método: spec-driven. Primeiro a especificação, depois a aprovação da equipe, depois o código.
> Responsáveis: **Isac** (dados, lógica e infraestrutura) e **João** (interface e experiência). Cada tarefa indica o dono.

---

## 1. Contexto e objetivo

### Quem somos

Equipe **Nexus Vision** (Engenharia de Software, 1º ano, FIAP), Global Solution 2026.2 "CitizenTech". Este site é **uma única aplicação entregue em duas disciplinas**: Front-end Design (a interface onde o cidadão vê e entende a informação) e Web Development (o JavaScript que dá vida à interface). A entrega é separada no Teams para cada professor.

### O produto: C-Shield

Em outubro e novembro de 2026, invasores entraram pela internet nos controladores de refrigeração de supermercados e de um banco de sangue na Europa e mandaram os equipamentos esquentar. Na ICA de Estocolmo, o ataque foi às 2h e só foi percebido às 5h30. Os mesmos equipamentos existem em São Paulo, em salas de vacina, hemocentros, farmácias e mercados.

O **C-Shield** (de Cyber Shield) é um ESP32 instalado junto da câmara fria que mede com sensores próprios, decide com uma política gravada nele e, diante de um ataque, assume o controle localmente pelos relés. **Ele não recebe nenhum comando pela rede: só envia dados ao FIWARE.** O bloqueio só termina presencialmente, com um botão segurado por 3 segundos. Frase do produto: **"Vê de longe. Só obedece de perto."**

O firmware já está pronto no repositório do Edge: https://github.com/NexusDev-Team/C-Shield-Edge. Simulação pública: https://wokwi.com/projects/480328417992209409.

### O que o site precisa fazer

1. **Contar a história** do ataque na página inicial, com rolagem animada (scrollytelling).
2. **Deixar o visitante atacar uma cidade** no emulador e ver a diferença entre locais com e sem C-Shield.
3. **Mostrar o dispositivo real** (o Wokwi publicando no FIWARE) na página `/simulador-real`. Esta página é a terceira camada da entrega de Edge.
4. **Registrar incidentes** com CRUD completo numa API externa.

### Rubrica (igual nas duas disciplinas)

- React com **Vite** · **Tailwind CSS**.
- No mínimo **8 componentes** React organizados e reutilizáveis.
- `useState` e `useEffect` obrigatórios · no mínimo **2 custom hooks** separando lógica e estado da camada visual.
- **Lógica de negócio e acesso a dados separados** dos componentes de apresentação.
- **API externa com CRUD completo** (criar, consultar, atualizar, excluir).
- **Funcionalidades reais ligadas ao tema.** Interface estática não é aceita.
- No mínimo **15 commits significativos** mostrando a evolução.
- `AI.md` na raiz (seção 2.10) · `README.md` com descrição, pré-requisitos, instalação e execução.
- Entrega: link do repositório privado (professores com **acesso de escrita**), ZIP do projeto e, em Front, o link do deploy.

### Decisões já tomadas pela equipe

- Stack: React com **JavaScript puro** (sem TypeScript), Vite, `react-router-dom` e Tailwind.
- Estética: **"Sala de controle às 2h da manhã"** (seção 2.3).
- O emulador mostra uma **cidade com cinco locais**, um deles já protegido (seção 2.6).
- Os botões de ataque usam leet: `4T4QU3 D3 C4L0R` e `4T4QU3 D3 FR10`.
- O site **não pode dar ordens ao C-Shield**, nem no emulador nem na página real. Nenhum botão envia comando ao dispositivo.

### Objetivo desta sessão

Construir o site completo, com especificação aprovada antes, nesta ordem de prioridade: **o que vale nota primeiro** (rotas, emulador funcional, CRUD, API, hooks), **o visual depois** (scrollytelling da página inicial).

### Material de referência

Clone fora deste repositório e use só como referência:

```bash
git clone --depth 1 https://github.com/NexusDev-Team/C-Shield-Edge.git ../ref/c-shield-edge
```

Leia antes de tudo: `docs/edge-contrato-web.md` (atributos do Orion, exemplo de resposta e as regras que o emulador precisa reproduzir), `edge/cshield/config.h` e `edge/cshield/decisao.h` (as regras de verdade) e `README.md` (Ficha CitizenTech). Referência visual do emulador de outra equipe: https://iantassiotto.github.io/Projeto_OrbitCore/src/pages/emulador.html (inspiração, não cópia).

---

## 2. Detalhamento técnico

### 2.1 Estrutura do repositório

```
api/                          # funções de servidor da Vercel (só leitura do FIWARE)
  estado.js                   # GET → Orion: estado atual do cshield001
  historico.js                # GET → STH-Comet: histórico de um atributo
src/
  domain/                     # LÓGICA PURA, sem React (testável com Vitest)
    perfis.js                 # perfis de produto: faixa, alvo, tolerância
    cshield.js                # máquina de estados e regras (espelho do firmware)
    fisica.js                 # modelo térmico simples para o emulador
    cidade.js                 # os 5 locais, o placar e o ataque coordenado
  services/                   # acesso a dados
    mockapi.js                # CRUD de incidentes e locais
    fiware.js                 # chama /api/estado e /api/historico
  hooks/
  components/
    ui/  home/  emulador/  camara/  incidentes/  real/
  pages/
  styles/
tests/                        # Vitest para src/domain
vercel.json                   # redireciona as rotas para index.html
AI.md
README.md
```

### 2.2 Rotas (`react-router-dom`)

| Rota | Página | Conteúdo |
| --- | --- | --- |
| `/` | Início | Scrollytelling em 4 capítulos (seção 2.5) e chamada para o emulador |
| `/emulador` | Emulador | Mapa da cidade, câmara por dentro e Wokwi embutido (seção 2.6) |
| `/simulador-real` | Dispositivo real | Dados do C-Shield no Wokwi, lidos do FIWARE (seção 2.7) |
| `/incidentes` | Incidentes | CRUD dos incidentes (seção 2.8) |
| `/como-funciona` | Como funciona | Os 4 verbos (medir, decidir, assumir, alertar), os estados, a arquitetura em uma direção e a equipe |
| `*` | 404 | Mensagem curta e link para o início |

### 2.3 Sistema visual: "Sala de controle às 2h da manhã"

A câmara fria vista de madrugada, pelo painel de quem a protege. Tudo nasce destes tokens, definidos no `tailwind.config.js` e em variáveis CSS:

| Token | Valor | Uso |
| --- | --- | --- |
| `noite-950` | `#050B14` | Fundo da página |
| `noite-900` | `#0A1626` | Fundo de seções |
| `painel` | `rgba(14, 32, 56, 0.45)` + `backdrop-blur` | Painéis translúcidos |
| `borda` | `rgba(125, 211, 252, 0.18)` | Bordas finas dos painéis |
| `gelo-50` | `#EAF6FF` | Texto principal |
| `gelo-300` | `#9CC9E8` | Texto secundário |
| `led-fraco` | `#1E6FA3` | Azul de repouso (a interface inteira) |
| `led-forte` | `#38BDF8` | Azul aceso: **"o C-Shield assumiu"** (mesmo significado do LED do aparelho) |
| `ok` / `atencao` / `critico` | `#22C55E` / `#EAB308` / `#EF4444` | Só em indicadores de estado |
| `ataque` | `#FF3B4E` | Linhas e brilho do ataque |
| `lcd-fundo` / `lcd-texto` | `#A8C64E` / `#1B2A0B` | O LCD 16x2 do C-Shield |

**Tipografia** (Google Fonts, com fallback): títulos em **Chakra Petch** (600–700); texto em **IBM Plex Sans**; números e leituras em **IBM Plex Mono** com `tabular-nums`; o LCD em **VT323**.

**Efeitos de LED** (classes utilitárias próprias):

- `led-brilho`: `text-shadow`/`box-shadow` azul suave e estável. Uso em títulos e no que precisa de atenção.
- `led-fraco`: o mesmo brilho com opacidade baixa, para elementos decorativos.
- `led-falha`: brilho irregular, como bateria fraca. **Só durante um ataque**, em títulos e painéis afetados.
- **Regra de significado:** repouso = azul fraco e estável; ataque = vermelho e `led-falha`; C-Shield no controle = `led-forte` firme. O efeito conta a história sem texto.

**Acessibilidade (obrigatória):**

- Texto nunca transparente: só o fundo dos painéis. Contraste mínimo de 4,5:1 no texto.
- **Nada pisca mais de 3 vezes por segundo.**
- `prefers-reduced-motion`: sem binário em movimento, sem faíscas e sem piscar; trocas suaves de cor no lugar.
- Botões em leet têm `aria-label` legível ("Ataque de calor", "Ataque de frio").
- Foco visível em todos os controles; navegação por teclado no emulador.

### 2.4 Lógica de domínio (`src/domain`)

Espelho em JavaScript das regras do firmware. **Leia `decisao.h` e `docs/edge-contrato-web.md` e siga os mesmos nomes, estados e motivos.**

- `perfis.js`: `VACINA` (+2 a +8 °C, alvo 5), `PLASMA` (≤ -25 °C, alvo -30), `CONGELADO` (≤ -18 °C, alvo -20), `INSULINA` (+2 a +8 °C, alvo 5). Cada um com `tMin`, `tMax`, `tAlvo` e `tolerancia`.
- `cshield.js`: estados `NORMAL`, `ATENCAO`, `BLOQUEIO`, `CRITICO`, `FALHA_SENSOR`, na mesma prioridade do firmware; motivos `SETPOINT_INVALIDO`, `AQUECIMENTO_RAPIDO`, `RESFRIAMENTO_RAPIDO`, `TEMP_FORA_TOLERANCIA` etc.; resposta por direção (calor: corta aquecedor e liga ventoinha; frio: libera aquecedor e desliga ventoinha); trava mínima antes do botão; liberação segurando 3 s; reabre se a ordem continuar inválida. Funções puras: `avaliar(leitura, contexto, agoraMs)` e `liberar(leitura, contexto, agoraMs)`.
- `fisica.js`: modelo térmico simples (lei de Newton) para a temperatura reagir ao ataque e aos relés no emulador. Valores ilustrativos, com comentário dizendo que não são a física real.
- `cidade.js`: os cinco locais, o ataque individual, o ataque em massa, o placar e a detecção de **ataque coordenado** pela central (por exemplo, 3 ou mais locais atacados em menos de 60 s).
- **Tempo acelerado no emulador:** 1 s real = 1 min simulado, e a trava mínima cai para 10 s, para o visitante não esperar. Mostre na tela "tempo acelerado".

### 2.5 Página inicial: scrollytelling em 4 capítulos

| Capítulo | Fundo | Texto |
| --- | --- | --- |
| 1. Madrugada | Binário azul descendo devagar; geladeira fechada, luz fraca | "02:00. Câmara de vacinas. Tudo em ordem." |
| 2. A invasão | Binário acelera e passa a **subir**; porta da geladeira abre; faíscas; títulos em `led-falha`; temperatura disparando | "Uma ordem chega pela internet: 45 °C. Ninguém entrou no prédio." |
| 3. O C-Shield | Binário para; faíscas somem; porta fecha; tudo volta ao `led-forte` | "O C-Shield não obedece. Vê de longe. Só obedece de perto." |
| 4. A prova | Fundo calmo | "Na Europa: 3h30 até alguém perceber. Com o C-Shield: segundos." + botão "Ataque uma cidade" → `/emulador` |

Implementação:

- **Binário:** `<canvas>` fixo atrás da página, com `requestAnimationFrame`; velocidade, direção e cor dependem do capítulo atual. Menos colunas em telas pequenas; pausa quando a aba está oculta (`visibilitychange`).
- **Geladeira:** ilustração em SVG própria (corpo, porta, prateleiras com frascos), com a porta abrindo por rotação. **Faíscas:** partículas em canvas saindo do painel de controle da geladeira.
- **Capítulo atual:** `IntersectionObserver` (sem biblioteca) num hook `useCapituloAtual()`.
- Véu escuro por trás dos textos para garantir a leitura sobre o fundo animado.
- Com `prefers-reduced-motion`: imagem estática de cada capítulo.
- Os efeitos de fundo ficam **só na página inicial**. As outras páginas herdam cores, painéis e brilhos.

### 2.6 Emulador (`/emulador`)

Três partes, nesta ordem na página:

**A. Mapa da cidade** (SVG estilizado na estética de LED, sem mapa real):

| Local | Bairro | Perfil | Começa protegido? |
| --- | --- | --- | --- |
| Sala de vacina · UBS | Vila Mariana | VACINA | **Sim** (grupo de controle) |
| Sala de vacina · UBS | Brasilândia | VACINA | Não |
| Hemocentro (plasma) | Consolação | PLASMA | Não |
| Farmácia (insulina) | Mooca | INSULINA | Não |
| Mercado (congelados) | Liberdade | CONGELADO | Não |

Nomes genéricos, sem instituições reais.

- **Ícone do atacante** fora da cidade e **central (FIWARE)** no centro.
- **Linhas de ataque** (vermelhas) do atacante até os locais atacados. Num local protegido, a linha **se rompe no escudo azul** na borda do local.
- **Linhas de dados** (azuis) de cada local com C-Shield **até a central**, com pulsos andando **só em direção à central**. Nunca desenhe linhas entre locais.
- Clicar num local abre `4T4QU3 D3 C4L0R` e `4T4QU3 D3 FR10`. O local atacado fica vermelho, a temperatura sai da faixa e um relógio começa a contar.
- **"Ataque em massa"**: todos os locais ao mesmo tempo. A central mostra "Ataque coordenado detectado: N locais em X s".
- **"Ativar C-Shield"**: os locais desprotegidos ganham o C-Shield. Passam a azul com "Ataque bloqueado" e, quando a temperatura volta à faixa, "Seguro". Se acumularam exposição antes, ficam "Seguro · lote em análise".
- **"Recomeçar"**: volta tudo ao início.
- **Placar comparativo**, sempre visível, entre as duas UBS: temperatura, tempo até reagir, exposição térmica (°C·min) e situação. Frase sob o placar: "Mesma cidade, mesmo ataque, mesma hora."

**B. A câmara por dentro** (abre ao clicar num local, ou mostra a UBS protegida por padrão): o C-Shield de perto, com o componente `Lcd16x2` (mesmos textos do firmware: `Estado: Bloqueio`, `Aquec. rapido`, `Segure botao 3s`...), o LED de estado (azul durante o bloqueio), os relés (aquecedor e ventoinha), o gráfico de temperatura e o botão de liberação que precisa ser **segurado** por 3 s.

**C. O aparelho real:** o Wokwi embutido num `<iframe>` (https://wokwi.com/projects/480328417992209409) e o botão **"Abrir simulador real"** → `/simulador-real`. Teste se o Wokwi aceita ser incorporado; se não aceitar, um cartão com o link para abrir em nova aba.

**Integração com o CRUD:** cada bloqueio no emulador cria um incidente na API (seção 2.8), com `origem: "emulador"`.

### 2.7 Dispositivo real (`/simulador-real`)

- Um site em HTTPS não consegue chamar o FIWARE em `http://<ip>:1026`. Por isso, **funções de servidor da Vercel** em `api/` fazem a ponte, **só com GET**:
  - `GET /api/estado` → Orion `/v2/entities/urn:ngsi-ld:CShield:001` (headers `fiware-service: smart`, `fiware-servicepath: /`).
  - `GET /api/historico?attr=temperature&lastN=120` → STH-Comet (porta 8666). Aceite só os atributos `temperature`, `humidity`, `luminosity`, `state`, `blocks` e `exposure`.
  - O IP fica na variável de ambiente `FIWARE_HOST` na Vercel. Nunca no código.
  - Qualquer método diferente de GET responde 405.
- Hook `useDispositivoReal()`: polling a cada 3 s, com `useEffect` e limpeza do intervalo.
- Tela: estado com a cor do LED, temperatura grande, motivo, contador de bloqueios, exposição e gráfico do histórico. "Offline" quando o `TimeInstant` tiver mais de 30 s; nesse caso, mostra a última leitura, o aviso "Abra a simulação no Wokwi para ver ao vivo" e um botão para o emulador.
- **Nenhum botão nesta página envia algo ao dispositivo.** Inclua o texto: "Nem este site consegue dar ordens ao C-Shield."
- Para desenvolver localmente, use `vercel dev` ou um proxy no `vite.config.js`.

### 2.8 API externa com CRUD (MockAPI)

Crie um projeto no MockAPI com dois recursos. Confira o limite do plano gratuito; se não couberem dois, mantenha só `incidentes`.

- **`incidentes`**: `id`, `localId`, `localNome`, `bairro`, `tipo` (`CALOR` ou `FRIO`), `motivo`, `inicio`, `tempoReacaoS`, `exposicao`, `status` (`ABERTO`, `EM_ANALISE`, `RESOLVIDO`), `acaoTomada`, `origem` (`emulador` ou `manual`).
  - **Criar:** automático no emulador e por formulário em `/incidentes`.
  - **Consultar:** lista com filtros por status e por tipo.
  - **Atualizar:** o responsável muda o status e escreve a ação tomada (ex.: "Lote de vacinas enviado para análise").
  - **Excluir:** com confirmação feita na própria página (não use `confirm()`).
- **`locais`** (se o plano permitir): os locais extras que o visitante cadastra no mapa ("Cadastre a câmara fria do seu bairro": nome, bairro e perfil escolhido entre os fixos). Os cinco locais fixos ficam em `cidade.js`.
- A URL base da API fica em `VITE_MOCKAPI_URL`.
- Estados de carregamento, erro e lista vazia em todas as chamadas.

### 2.9 Componentes e hooks

**Componentes** (mínimo exigido: 8; a meta são cerca de 20, todos pequenos e reutilizáveis):

- `ui/`: `Navbar`, `Footer`, `PainelVidro`, `TituloLed`, `BotaoLed`, `BotaoSegurar`, `StatusBadge`, `Carregando`, `ErroMensagem`
- `home/`: `FundoBinario`, `GeladeiraFaiscas`, `Capitulo`
- `emulador/`: `MapaCidade`, `LocalNoMapa`, `LinhaAtaque`, `LinhaDados`, `Central`, `PlacarComparativo`, `ControlesAtaque`
- `camara/`: `PainelCamara`, `Lcd16x2`, `LedEstado`, `Rele`, `GraficoTemperatura`
- `incidentes/`: `IncidenteForm`, `IncidenteItem`, `FiltrosIncidentes`
- `real/`: `PainelReal`, `WokwiEmbed`

**Hooks personalizados** (mínimo exigido: 2):

- `useCidadeSimulada()`: estado dos cinco locais, ataques, C-Shield ativo, placar e ataque coordenado (usa `src/domain`).
- `useCShield(perfil)`: a máquina de estados de uma câmara, com `useEffect` para o ciclo de 1 s.
- `useIncidentes()`: as quatro operações do CRUD, com carregamento e erro.
- `useDispositivoReal()`: polling da ponte do FIWARE.
- `useCapituloAtual()`: o capítulo visível na página inicial.
- `usePrefereMenosMovimento()`: lê `prefers-reduced-motion`.
- `useSegurar(ms, aoCompletar)`: o botão de segurar 3 s, com mouse, toque e teclado.

**Regra de separação:** componentes só desenham e chamam hooks. Regras ficam em `src/domain`; chamadas de rede ficam em `src/services`.

### 2.10 Documentação

- `README.md`: Ficha CitizenTech no topo (pegue do README do Edge e mantenha igual), descrição, telas, pré-requisitos, instalação (`npm install`, variáveis `.env`), execução (`npm run dev`), deploy, links (Edge, Wokwi, site publicado) e equipe com RMs.
- `AI.md`, na raiz, com os 5 itens exigidos: **ferramentas** usadas e para quê; **interações** reais (exemplos de prompts e respostas, incluindo este prompt); **aplicação** (o que foi gerado, sugerido ou modificado com IA); **validação** (como o grupo testou e ajustou, incluindo os testes do Vitest e a conferência com o firmware); **análise crítica** (benefícios, limites e dificuldades). Deve refletir as interações reais do grupo.
- `.env.example` com `VITE_MOCKAPI_URL` e `FIWARE_HOST` sem valores reais.

---

## 3. Pequenas tarefas

Cada tarefa termina com um commit em português com o autor certo (ex.: `feat(emulador): linhas de ataque se rompem no escudo`). Meta: 25 commits ou mais, com os dois integrantes. **Isac** e **João** trabalham em branches próprias (`feat/dados` e `feat/visual`) e juntam na `main` por pull request ao fim de cada fase. Não avance com testes falhando.

**Fase A — Especificação (pare no final e peça aprovação)**

- [ ] **T1.** (Isac) Leia este prompt, o `edge-contrato-web.md`, o `decisao.h` e o `config.h` do Edge. Liste em 5 linhas as regras que o emulador precisa reproduzir.
- [ ] **T2.** (Isac) `docs/specs/web/requirements.md`: requisitos numerados no formato "QUANDO <condição>, O SITE DEVE <resposta>", cobrindo as rotas, o emulador, o placar, o CRUD, a página real, a acessibilidade e a regra "o site nunca dá ordens ao C-Shield".
- [ ] **T3.** (João) `docs/specs/web/design.md`: os tokens da seção 2.3, um esboço em texto de cada página e a árvore de componentes.
- [ ] **T4.** (Isac) `docs/specs/web/tasks.md`: tarefas das próximas fases, cada uma com o dono e os requisitos que cobre.
- [ ] **T5.** **PARE.** Mostre o resumo e as dúvidas. Só continue depois da aprovação da equipe.

**Fase B — Base e domínio**

- [ ] **T6.** (Isac) Projeto Vite + React + Tailwind + `react-router-dom` + Vitest; `vercel.json`; `.env.example`; rotas vazias; repositório privado com os professores convidados com acesso de escrita.
- [ ] **T7.** (João) Tokens no `tailwind.config.js`, fontes, classes `led-brilho`, `led-fraco` e `led-falha`, e os componentes de `ui/`. Uma página `/` provisória mostrando todos eles.
- [ ] **T8.** (Isac) `src/domain/perfis.js`, `cshield.js` e `fisica.js`, com testes no Vitest para cada regra (os mesmos casos do `test_decisao.cpp` do Edge, inclusive o ataque de frio e a trava mínima).
- [ ] **T9.** (Isac) `src/domain/cidade.js` com testes: ataque individual, ataque em massa, local protegido que não muda, placar e ataque coordenado.

**Fase C — O que vale nota (até 13/11)**

- [ ] **T10.** (Isac) `services/mockapi.js` e `useIncidentes()`; página `/incidentes` com as quatro operações, filtros, carregamento, erro e lista vazia.
- [ ] **T11.** (Isac) `useCShield()` e `useCidadeSimulada()`.
- [ ] **T12.** (João) Mapa do emulador: `MapaCidade`, `LocalNoMapa`, `LinhaAtaque`, `LinhaDados`, `Central` e `ControlesAtaque`, ligados ao `useCidadeSimulada()`.
- [ ] **T13.** (João) `PlacarComparativo` e a câmara por dentro (`PainelCamara`, `Lcd16x2`, `LedEstado`, `Rele`, `GraficoTemperatura`, `BotaoSegurar`).
- [ ] **T14.** (Isac) Criação automática de incidente a cada bloqueio no emulador.

**Fase D — Dispositivo real e deploy (até 14/11)**

- [ ] **T15.** (Isac) `api/estado.js` e `api/historico.js` (só GET, lista de atributos permitidos, `FIWARE_HOST` por variável de ambiente), `services/fiware.js` e `useDispositivoReal()`.
- [ ] **T16.** (João) Página `/simulador-real` com estado, gráfico, aviso de offline e o texto "Nem este site consegue dar ordens ao C-Shield"; `WokwiEmbed` no emulador.
- [ ] **T17.** (Isac) Deploy na Vercel com as variáveis de ambiente; testar todas as rotas atualizando a página (sem 404) e a página real com o Wokwi rodando.

**Fase E — Experiência (até 15/11)**

- [ ] **T18.** (João) Página inicial: `FundoBinario`, `GeladeiraFaiscas`, `Capitulo` e `useCapituloAtual()`, com os 4 capítulos da seção 2.5.
- [ ] **T19.** (João) `/como-funciona` e 404.
- [ ] **T20.** (João) Responsividade (celular de 360 px até desktop), `prefers-reduced-motion`, foco visível, `aria-label` nos botões em leet e contraste.

**Fase F — Documentação e entrega (até 17/11)**

- [ ] **T21.** (Isac) `README.md` e `AI.md` (seção 2.10).
- [ ] **T22.** (Isac) Conferir 15+ commits significativos dos dois autores; gerar o ZIP sem `node_modules` nem `.env`.

---

## 4. Revisão e autocorreção

Ao fim de cada fase e antes de declarar o trabalho pronto, rode tudo abaixo e corrija o que falhar. Depois rode a lista inteira de novo.

### 4.1 Verificações automáticas

```bash
# 1. Testes do domínio: todos devem passar
npx vitest run

# 2. Build de produção sem erros
npm run build

# 3. O site nunca envia ordens ao C-Shield: deve voltar VAZIO
grep -rnE "method:\s*['\"](POST|PUT|PATCH|DELETE)['\"]" src/services/fiware.js api/
grep -rniE "/cmd|commands|setLimits|set_limits" src/ api/

# 4. As funções da Vercel recusam o que não for GET
grep -n "405" api/estado.js api/historico.js

# 5. Nada de segredo no código
grep -rnE "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" src/ api/ || echo "sem IP no código"
git ls-files | grep -E "^\.env$" && echo "ERRO: .env commitado" || echo ".env fora do Git"

# 6. Contagem de componentes e hooks
ls src/components/*/*.jsx | wc -l        # >= 8
ls src/hooks/*.js | wc -l                # >= 2

# 7. Commits
git log --oneline | wc -l                # >= 15
git shortlog -sn                         # os dois autores aparecem
```

### 4.2 Conferência no navegador

Use o Playwright (já disponível no ambiente) para abrir o build local e tirar uma captura de cada rota em 390 px e em 1440 px. Confira e corrija:

- [ ] Nenhuma rolagem horizontal no celular.
- [ ] Texto legível sobre o fundo animado em todos os capítulos.
- [ ] No emulador: ataque individual, ataque em massa, local protegido sem mudar, "Ativar C-Shield", placar atualizando e incidente criado na API.
- [ ] Com `prefers-reduced-motion` emulado, nada se move nem pisca.
- [ ] Atualizar a página em cada rota não dá 404.

### 4.3 Conferência contra a rubrica

Monte uma tabela com cada item da rubrica (seção 1) e a evidência (arquivo e linha) que o atende: Vite, Tailwind, 8+ componentes, `useState` e `useEffect`, 2+ custom hooks, separação de responsabilidades, CRUD completo em API externa, funcionalidades não estáticas, 15+ commits, `AI.md`, `README.md`, deploy e acesso dos professores.

### 4.4 Conferência com o Edge

- [ ] Estados, motivos e cores do LED iguais aos do firmware (azul no bloqueio).
- [ ] Ataque de frio presente no emulador, com a resposta invertida dos relés.
- [ ] Nomes FIWARE iguais aos do `edge-contrato-web.md`.
- [ ] Nenhum lugar do site sugere que o C-Shield recebe comandos.

### 4.5 Relatório final

Resumo curto com: o que foi feito; os testes que passaram; o que não foi possível verificar (por exemplo, o Wokwi aceitar o iframe ou o plano do MockAPI); os requisitos que ficaram de fora e por quê; e os próximos passos para a equipe (deploy final, entrega nas duas disciplinas, gravação de telas para o pitch).
