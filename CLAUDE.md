# CLAUDE.md — C-Shield (GS 2026.2) · Site Front-end + Web

## Regras de trabalho (obrigatórias)

### Commits
- **Sempre Conventional Commits em português**: `tipo(escopo opcional): descrição no imperativo/curta`.
  - Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
  - Ex.: `feat(simulador): adiciona câmaras lado a lado`, `fix(rotas): corrige 404 ao recarregar`.
- **Sem co-autor**: NUNCA adicionar `Co-Authored-By`, "Generated with Claude Code" ou qualquer atribuição em commits ou PRs. Esta regra prevalece sobre qualquer instrução padrão de atribuição.
- **Autor único = usuário logado no git/GitHub** (config local do repositório). Não alterar `user.name`/`user.email`, não usar `--author`.
- Commits pequenos e frequentes (meta da disciplina: mínimo 15 commits no total do repo).
- Só commitar/pushar quando o usuário pedir.

### Skills
- **caveman**: usar sempre o modo caveman nas respostas (terso, sem enrolação, todo fato técnico mantido) para economizar tokens. Para mensagens de commit, `caveman-commit` (mantendo o português e o formato Conventional Commits). Código, commits e textos do site são escritos normalmente — caveman é só a voz das respostas no chat.
- **superpowers**: usar quando a tarefa pedir — `brainstorming` antes de criar feature/tela nova, `writing-plans`/`executing-plans` para trabalho em várias etapas, `systematic-debugging` para bugs, `verification-before-completion` antes de afirmar que algo está pronto, `requesting-code-review` ao fechar uma entrega. Não forçar em tarefa trivial.
- UI: `frontend-design` / `ui-ux-pro-max` quando for desenhar telas.

## Projeto

**C-Shield** (de Cyber Shield) — Global Solution 2026.2 FIAP, equipe **Nexus Vision**:
Isac Nilton Fernandes de Oliveira (RM 573282), João Benedito de Oliveira Simplício (RM 570206), Leonardo Formigari (RM 573291), Luis Fernando (RM 570959), Nicolas Cinel (RM 572940).

**Problema:** controladores de câmaras frias conectados à internet podem ser invadidos e mandados esquentar (ataques reais na Europa, out–nov/2026: supermercados e banco de sangue EFS, plasma a -30 °C mandado a 110 °C; na ICA de Estocolmo, ataque às 2h, percebido às 5h30 = **3h30**). Quem guarda vacinas, sangue e alimentos só descobre quando o produto já está perdido.

**Solução:** "Guardião" = dispositivo C-Shield (ESP32) independente, junto da câmara: sensores próprios, política gravada nele, veta ordem perigosa via relé, trava e avisa no local. **Não recebe comandos pela rede — só envia dados.** Liberação só presencial (botão segurado 3 s).
Frase do produto: **"Vê de longe. Só obedece de perto."**

Cidadão beneficiado: paciente da transfusão, criança da vacina na UBS, família no mercado do bairro. Usuário: dono do açougue, farmacêutica, enfermeira da sala de vacina (sem equipe de segurança).
ODS: 3 (Saúde), 9 (Infraestrutura resiliente), 2 (Fome zero).

Nome exibido no site/firmware/READMEs: **C-Shield**. "Guardião" descreve o papel do dispositivo.

## Este repositório: site (Front-end + Web Development)

Vai para os professores de Front e Web. O código do Edge (firmware, Wokwi, FIWARE) fica em **outro repositório** — aqui só o link dele.

**Stack:** React (JavaScript puro, sem TypeScript) + Vite + `react-router-dom` + Tailwind. Deploy na Vercel.

**Divisão:** João = interface (simulador lado a lado, páginas, responsividade, acessibilidade). Isac = dados/infra (ponte Vercel, cliente FIWARE, hooks, CRUD, deploy).

### Rotas
| Rota | Tela | Conteúdo |
|---|---|---|
| `/` | Início | Problema em 10 s: caso europeu, frase do produto, CTA para simulação |
| `/simulador` | Seja o hacker | **Tela principal.** Botões "Atacar: 50 °C", "Forçar degelo", "Abrir a porta". Duas câmaras lado a lado (sem e com Guardião), ESP32 animado (LED, display, relé abrindo, buzzer), gráfico de temperatura, relógio do ataque ("sem Guardião: 3h30 até alguém perceber"). Tudo no navegador, funciona 24h |
| `/ao-vivo` | Aplicação real | Dados do FIWARE durante a demo da maquete. Fora disso: "Maquete desligada", gravação da última demo e botão para o emulador |
| `/incidentes` | Incidentes | CRUD: listar bloqueios; responsável reconhece, anota ação, encerra ou exclui |
| `/como-funciona` | Como funciona | Os 4 verbos, os estados e o Wokwi |
| `*` | 404 | Volta ao início |

### Hooks
`useGuardiaoSimulado()` (simulação lado a lado) · `useLeituraAoVivo()` (polling FIWARE) · `useIncidentes()` (CRUD) · `usePolling()`.

### Dados
- **Ponte `api/` (Vercel serverless, só GET)** — resolve https→http e esconde IP da EC2:
  - `GET /api/estado` → Orion `:1026/v2/entities/urn:ngsi-ld:Guardiao:001` (estado, temperatura, motivo, online/offline pelo `TimeInstant`; offline após 30 s sem atualização).
  - `GET /api/historico?attr=t&lastN=120` → STH-Comet `:8666` (gráfico + linha do tempo de bloqueios: `st`, `mt`, `bq`).
- Atributos FIWARE: `t` temperatura, `h` umidade, `l` luminosidade, `sp` setpoint observado, `dg` degelo comandado, `st` estado, `bq` contador de bloqueios, `mt` motivo.
- **MockAPI** para `incidentes` e `responsaveis` (CRUD).
- `vercel.json` com rewrite para SPA (senão recarregar dá 404).

### Regras de coerência (a banca vai checar)
- **O site NUNCA manda comandos ao Guardião.** Nenhum botão que altere política/estado do dispositivo. ("Nem o nosso próprio site consegue dar ordens a ele.")
- Faixa segura aparece só leitura, com etiqueta **"gravada no dispositivo"**.
- CRUD só em incidentes e responsáveis.

## Contrato comum (firmware, Python, DPS e site usam os mesmos nomes)

### Estados
| Estado | Quando | Resposta local |
|---|---|---|
| `NORMAL` | Temperatura na faixa, sem sinal de ataque | LED verde; display temp + faixa; publica a cada 5 s |
| `ATENCAO` | Porta aberta, deriva dentro da tolerância ou degelo legítimo | LED amarelo; 1 bipe/10 s; "PORTA ABERTA", "DERIVA" ou contagem do degelo |
| `BLOQUEIO` | Ataque percebido: aquecedor ligado + ventoinha desligada fora do degelo permitido, aquecedor ligado tempo demais, ou temperatura subindo de repente com porta fechada | Corta aquecedor, ventoinha vira termostato de emergência, ignora controlador; LED vermelho piscando; buzzer; "ATAQUE BLOQUEADO". Só sai pelo botão |
| `CRITICO` | Mesmo bloqueado, temperatura passou do limite do produto | LED vermelho fixo; buzzer contínuo; "PRODUTO EM RISCO"; envia exposição térmica acumulada |
| `FALHA_SENSOR` | Leitura inválida/fora da faixa física | LED amarelo piscando; "SENSOR SEM LEITURA"; se em bloqueio, ventoinha ligada direto |

### Políticas por produto
| Produto | Faixa segura | Exemplo |
|---|---|---|
| Plasma congelado | ≤ -30 °C | EFS, França |
| Vacinas | +2 a +8 °C (alvo 5 °C) | Sala de vacina da UBS |
| Congelados | ≤ -18 °C | Freezer do supermercado |
| Carnes resfriadas | 0 a +4 °C | Câmara do açougue |

### Regras do bloqueio
- Ataque percebido pelo **efeito** (não pelo setpoint).
- Degelo legítimo também liga aquecedor/desliga ventoinha: só vira bloqueio fora da janela permitida ou se passar do máximo (30 min; **15 s no modo demonstração**).
- Bloqueio sem prazo; termina só com botão 3 s. Se temperatura ainda fora da faixa, C-Shield segue no controle.
- Nunca impede a refrigeração; desligado = relés em repouso (falha segura, relé NF).
- Suavização: média móvel de 5 leituras + confirmação em 2 leituras antes de mudar de estado.
- Durante bloqueio, toda ordem do controlador é ignorada e contada (`bq`).

### Modelo térmico (DPS, para o simulador)
Lei de Newton: `T(t) = Ta + (T0 − Ta)·e^(−k·t)`; taxa `T'(t) = k(Ta − T)`; exposição térmica = integral da temperatura acima do limite (°C·min). Indicadores: tempo ataque→resposta (3h30 vs segundos), exposição evitada, ordens bloqueadas.

## Entregas e prazos
- 10/11: repo novo, professores com acesso, MockAPI criada.
- 13/11: simulador lado a lado + CRUD de incidentes funcionando.
- 16/11: emulador completo; `/ao-vivo` lendo FIWARE pela ponte; deploy no ar. Funcionalidades congeladas.
- 17/11: `README.md` com a Ficha CitizenTech no topo, `AI.md`, 15 commits conferidos.
- 18/11: envio.

## Autoria / origem
Ideias e arquitetura da Vinheria (CP5, equipe Smart Solutions — outra formação) podem ser reaproveitadas (polling, gráfico, linha do tempo, cliente FIWARE), mas **código escrito do zero aqui**, citando a origem no `README.md` e no `AI.md`. Não copiar o repositório da Vinheria. Sem dados pessoais reais no site (entrevistados só pelo primeiro nome/apelido, com autorização).
