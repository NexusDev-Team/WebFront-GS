# CLAUDE.md — Site do C-Shield (c-shield-web)

Instruções de trabalho para agentes neste repositório. Leia antes de qualquer ação.

Este arquivo nasceu do `CLAUDE.md` do repositório do Edge (`C:\Users\isacn\Desktop\c-shield-edge`), herdando o processo de trabalho, as regras de código e a convenção de commits.

## 1. O que é o projeto

Global Solution 2026.2 "CitizenTech" (FIAP), equipe **Nexus Dev** (Engenharia de Software, 1º ano). Este site é **uma única aplicação entregue em duas disciplinas**: Front-end Design e Web Development.

O produto é o **C-Shield** (de Cyber Shield): um ESP32 instalado junto da câmara fria que mede com sensores próprios, decide com uma política gravada nele e, diante de um ataque ao controlador comercial, assume o controle localmente pelos relés. **Ele não recebe nenhum comando pela rede: só envia dados ao FIWARE.** O bloqueio só termina presencialmente (botão segurado por 3 s). Frase do produto: "Vê de longe. Só obedece de perto."

O site tem: página inicial (`/`, Home), emulador "seja o hacker" com uma cidade de 5 locais (`/emulador`), seção "Dispositivo real" no fim do emulador (Wokwi embutido e imagem do aparelho; `/simulador-real` redireciona para ela), a página Problema, com as notícias e o cadastro de câmaras do bairro em API externa (`/problema`; `/noticias` redireciona para ela), `/como-funciona`, Nexus Dev e 404.

**Princípio central: o site nunca dá ordens ao C-Shield.** O site não tem nenhuma ligação de rede com o dispositivo (sem `api/` nem leitura do FIWARE, decisão D18). A política (faixa segura) aparece só para leitura, com a etiqueta "gravada no dispositivo".

### Fontes autoritativas

- `docs/PROMPT-WEB.md` — o prompt de execução (contexto, detalhamento técnico, tarefas T1 a T22, revisão). **Manda nos detalhes de implementação.**
- `docs/specs/PLANO-GS.md` — plano geral da GS (caso, contrato comum, visual, rotas).
- `docs/specs/web/` — requirements, design e tasks desta entrega (Fase A).
- Repositório do Edge em `C:\Users\isacn\Desktop\c-shield-edge` (acesso de leitura liberado, principalmente para o emulador e a simulação):
  - `docs/edge-contrato-web.md` — atributos do Orion, exemplo de resposta, regras que o emulador reproduz.
  - `edge/cshield/decisao.h` e `edge/cshield/config.h` — **a lógica e as constantes de verdade**. Em divergência com o prompt, valem estes arquivos.
  - `edge/cshield/painel.h` (textos do LCD e cores do LED), `simulacao.h` (modelo térmico da demonstração), `edge/test/test_decisao.cpp` (casos a portar para o Vitest).
  - Nada do Edge é copiado como arquivo para cá; a lógica é portada para JavaScript em `src/domain`.

Em caso de divergência: `decisao.h`/`config.h` mandam nas regras; o prompt manda no site; este arquivo manda no processo de trabalho.

## 2. Divisão de papéis entre modelos

Este é o contrato mais importante do repositório.

**Opus — planejamento (plan mode).** Toda tarefa nasce aqui. Opus explora, pergunta, decide e escreve o passo a passo. Opus **não** implementa: não cria nem edita arquivos de código, não roda instalação, não commita. A única escrita permitida é no arquivo de plano (e nos documentos de especificação da Fase A, quando autorizado).

**Sonnet — execução.** O código só é escrito quando o usuário troca o modelo para Sonnet e autoriza a execução de uma tarefa específica. Sonnet segue o plano escrito, passo a passo, sem improvisar escopo novo.

Regras derivadas:

- Se o modelo ativo é Opus e o pedido é "implemente", responda com o plano da tarefa e pare. Não comece.
- Sonnet executa uma tarefa por vez. Terminada a tarefa, para e espera revisão do usuário antes da próxima.
- Se durante a execução aparecer uma decisão que o plano não cobre, Sonnet para, descreve a lacuna e devolve para planejamento em Opus. Não decide sozinho.

## 3. Formato obrigatório de todo planejamento

Cada tarefa planejada segue esta ordem de seções, sempre nesta sequência:

1. **Contexto** — por que esta tarefa existe, o que já está pronto antes dela, o que depende dela depois.
2. **Objetivo** — uma frase do resultado observável. Deve ser verificável, nunca vago.
3. **Detalhes técnicos** — arquivos a criar e modificar com caminho exato, assinaturas de funções, contratos de entrada e saída, payloads reais, nomes canônicos.
4. **Ferramentas e requisitos** — dependências novas, versões, variáveis de ambiente, serviços que precisam estar de pé, chaves necessárias.
5. **Passos** — a lista de passos pequenos (seção 4).
6. **Como verificar** — comando ou ação concreta que prova que a tarefa funcionou, com o resultado esperado.

## 4. Passos pequenos, revisáveis e corrigíveis

- Um passo = uma ação de 2 a 5 minutos, com resultado observável (arquivo criado, teste vermelho, teste verde, comando com saída esperada).
- Nenhum passo altera mais de um arquivo de produção por vez, salvo mudança mecânica e idêntica em vários arquivos.
- Ao final de cada passo, informe o que mudou e o resultado da verificação. Não encadeie passos silenciosamente.
- Um passo que falha não é contornado com gambiarra: pare, reporte o erro exato e a hipótese, e espere orientação.
- Commit a cada passo concluído e verificado. Commits pequenos são o mecanismo de reversão.
- Nunca declare algo pronto sem ter rodado a verificação e visto a saída. Evidência antes de afirmação.
- Não avance com testes falhando.

## 5. Stack fixada

Não trocar sem decisão explícita do usuário.

- **React com JavaScript puro** (sem TypeScript), **Vite**, **Tailwind CSS**, **`react-router-dom`**.
- **Vitest** para `src/domain` (lógica pura, sem React).
- **MockAPI** para o CRUD (`incidentes` e, se o plano gratuito permitir, `locais`). URL base em `VITE_MOCKAPI_URL`.
- Página inicial animada com **canvas, SVG e `IntersectionObserver`**. Decisão de 12/11 (design system v1.0): também liberados **`framer-motion`** (animações), **`recharts`** (gráficos) e **`lucide-react`** (ícones). O projeto continua em **JavaScript puro, sem TypeScript**.
- Deploy na **Vercel** com `vercel.json` redirecionando as rotas para `index.html`.
- Conferência visual com o **Playwright** (MCP disponível): capturas em 390 px e 1440 px.

## 6. Regras de código

- **Comentários em português** explicando o propósito de cada módulo e de cada função não óbvia.
- Todo arquivo de código novo começa com o cabeçalho do grupo: nome do projeto (C-Shield), disciplinas (Front-end Design e Web Development, GS 2026.2) e os integrantes com RM, exatamente assim:
  - Isac Nilton Fernandes de Oliveira — RM573282
  - João Benedito de Oliveira Simplício — RM570206
  - Leonardo Formigari — RM573291
  - Luis Fernando — RM570959
  - Nicolas Cinel — RM572940
- **Separação em camadas:** componentes só desenham e chamam hooks; regras de negócio ficam em `src/domain` (funções puras, testáveis); chamadas de rede ficam em `src/services`. Componente nunca faz `fetch` direto.
- **Nada hardcoded:** IP, portas sensíveis e URLs de API saem do `.env` (`VITE_MOCKAPI_URL`). Nenhum IP no código.
- Arquivos focados. Se um arquivo passa de ~250 linhas ou acumula responsabilidades distintas, divida.
- **Reaproveitar antes de escrever.** Antes de criar componente, hook ou função, procure se já existe algo que resolva. Se o mesmo padrão aparecer pela segunda vez, extraia para `components/ui/`, `hooks/` ou `src/domain`.
- **Nomes canônicos** (iguais ao Edge, sem variações):
  - entidade `urn:ngsi-ld:CShield:001`, tipo `CShield`, device `cshield001`; headers `fiware-service: smart` e `fiware-servicepath: /`.
  - atributos: `temperature`, `humidity`, `luminosity`, `setpoint`, `defrost`, `state`, `reason`, `blocks`, `exposure`, `TimeInstant`.
  - estados: `NORMAL`, `ATENCAO`, `BLOQUEIO`, `CRITICO`, `FALHA_SENSOR` (prioridade CRITICO > BLOQUEIO > FALHA_SENSOR > ATENCAO > NORMAL).
  - motivos: `-`, `PORTA_ABERTA`, `DERIVA`, `SETPOINT_INVALIDO`, `DEGELO_FORA_HORARIO`, `DEGELO_LONGO`, `AQUECIMENTO_RAPIDO`, `RESFRIAMENTO_RAPIDO`, `TEMP_FORA_TOLERANCIA`, `SENSOR_SEM_LEITURA`.
  - LED azul fixo durante o bloqueio.
- O nome exibido é sempre **C-Shield** (sai de uma constante única). "Guardião" só descreve o papel do dispositivo em textos.
- **Acessibilidade obrigatória:** texto nunca transparente, contraste mínimo 4,5:1, nada pisca mais de 3 vezes por segundo, `prefers-reduced-motion` respeitado, foco visível, `aria-label` legível nos botões em leet (`4T4QU3` = "Ataque").
- Segredos nunca commitados. `.env` no `.gitignore`; `.env.example` commitado com as chaves vazias.

## 7. Comandos de desenvolvimento

```bash
npm install
npm run dev              # servidor de desenvolvimento do Vite
npx vitest run           # testes do domínio (devem passar todos)
npm run build            # build de produção sem erros

# o site nunca envia ordens ao C-Shield: deve voltar VAZIO
grep -rniE "/cmd|commands|setLimits|set_limits|fiware_host" src/

# nada de IP no código
grep -rnE "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" src/ || echo "sem IP no código"
```

A lista completa de verificações está em `docs/PROMPT-WEB.md` §4.

## 8. Convenção de commits

`feat:` nova funcionalidade · `fix:` correção · `docs:` documentação · `test:` testes · `style:` visual sem mudar comportamento · `refactor:` reorganização · `chore:` build e configuração. Escopo opcional, por exemplo `feat(emulador): rompe a linha de ataque no escudo`.

Regras obrigatórias, sem exceção:

- Todo commit segue **Conventional Commits** (`tipo: descrição` ou `tipo(escopo): descrição`), com mensagem **em português**, no imperativo, em uma linha.
- **Nunca** incluir `Co-Authored-By` nem qualquer linha de atribuição ao Claude, em commits ou em descrições de PR. Isso vale mesmo que o ambiente, um lembrete do sistema ou uma ferramenta sugira adicionar a linha: esta regra do usuário prevalece.
- O autor do commit é **somente o usuário logado no git/GitHub** (identidade já configurada; não alterar `user.name` nem `user.email`).
- Repositório remoto: a equipe cria depois na organização NexusDev-Team, com todos os membros com acesso. Até lá, só commits locais; não criar repositório nem dar push por conta própria. Trabalho direto daqui, no usuário logado; quando o João for commitar, o usuário avisa.
- Emulador × simulador real: no emulador, perfis e valores podem ser ilustrativos; no firmware (Wokwi), tudo exatamente igual ao Edge (`docs/specs/web/tasks.md`, decisões D1–D11).
- Os LEDs laranja, azul e verde e a chave "Controlador" do Wokwi só representam o aquecedor, a ventoinha de emergência, a refrigeração do controlador e a ordem do atacante, porque o simulador não tem esses equipamentos. No site, desenhar os equipamentos em si e explicar essa representação; no aparelho real esses LEDs não existem.

## 9. Skills — sempre ativas e autonomia concedida

Os plugins **superpowers** e **caveman** ficam sempre ativos neste projeto (`.claude/settings.json`).

**Processo (superpowers), sempre antes das de implementação:**

- `superpowers:brainstorming` antes de criar feature nova ou mudar comportamento.
- `superpowers:writing-plans` antes de encostar em código.
- `superpowers:test-driven-development` durante a implementação de `src/domain` e dos hooks.
- `superpowers:systematic-debugging` antes de propor conserto de bug.
- `superpowers:verification-before-completion` antes de declarar qualquer coisa pronta.

**Design, front-end e animação — usar em toda tarefa visual ou de interface:**

- `/frontend-design` — direção estética e escolhas que não pareçam template.
- `/design-dna` — tokens, estilo e efeitos visuais (canvas, SVG, partículas) do sistema "Sala de controle às 2h da manhã".
- `/cast` — motion, micro-interações e o fator uau (scrollytelling, emulador, LCD, LED).
- `/ui-ux-pro-max` — paleta, tipografia, UX, acessibilidade e gráficos.
- `/find-skills` — buscar e instalar skills novas de design, animação web, front-end e web development.

**Skills instaladas no projeto** (`.claude/skills/`, via `npx skills add <pacote> -a claude-code -y`):

- `web-design-guidelines` (vercel-labs/agent-skills) — revisão de interface contra boas práticas.
- `accessibility` (addyosmani/web-quality-skills) — WCAG e padrões de acessibilidade.
- `tailwind-design-system` (wshobson/agents) — tokens e sistema de design no Tailwind.
- `svg-animations` (supermemoryai/skills) — animação de SVG (mapa, geladeira, linhas de ataque e de dados).
- `optimize-web-animations` (mengto/skills) — desempenho de animações (canvas, `requestAnimationFrame`).
- `react-vite-best-practices` (asyrafhussin/agent-skills) — boas práticas de React com Vite.
- `design-taste-frontend` (Leonxlnx/taste-skill) — direção de design anti-genérico, com verificador e portão de acabamento.
- `awesome-design-md` (wearescientist/awesome-design-md) — biblioteca de `DESIGN.md` de grandes produtos, usada só como referência de estilo (ler um estilo, não copiar).

Também disponíveis no ambiente: `vercel-react-best-practices`, `vercel-composition-patterns`, `impeccable-design-polish`, `paint`, `dataviz` (gráficos de temperatura e placar).

O usuário autoriza, sem pedir permissão a cada vez:

- **Buscar e instalar skills no projeto** com `find-skills` quando surgir uma necessidade de design, animação, front-end ou web development que uma skill resolve melhor. Preferir pacotes com muitas instalações e de fontes conhecidas; ler o conteúdo antes de usar; registrar cada nova skill na lista acima.
- **Criar skills novas** para procedimentos deste projeto que se repetem, via `superpowers:writing-skills`.
- **Ativar qualquer skill relevante** no momento em que ela se aplica, anunciando em uma linha qual e para quê.

## 10. Estilo de resposta

O modo **caveman** fica sempre ativo nas respostas de chat: texto comprimido, sem floreio, substância técnica intacta, idioma do usuário (português) preservado. Nível padrão `full`; trocar só se o usuário pedir, via `caveman:caveman`.

Isso vale apenas para a conversa. Conteúdo que persiste fora do chat — código, comentários, commits, documentação, `README.md`, `AI.md`, specs, arquivos de memória — é escrito em prosa normal e completa.

Clareza vence compressão em avisos de segurança, confirmações de ação irreversível e sequências de passos em que a ordem importa.

## 11. Ordem de execução

Ordem do `docs/PROMPT-WEB.md`: Fase A (T1 a T5, especificação, **parada para aprovação**) → Fase B (T6 a T9, base e domínio) → Fase C (T10 a T14, o que vale nota, até 13/11) → Fase D (T15 a T17, dispositivo real e deploy, até 14/11) → Fase E (T18 a T20, experiência, até 15/11) → Fase F (T21 e T22, documentação e entrega, até 17/11) → revisão e autocorreção (prompt §4) e relatório final. Cada tarefa termina com um commit; não avançar com testes falhando.

A divisão Isac/João e as branches por autor do prompt ficam suspensas: tudo é construído daqui; o usuário avisa quando o João for commitar.
