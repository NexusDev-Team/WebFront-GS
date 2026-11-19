# Uso de Inteligência Artificial no site do C-Shield

**Projeto:** C-Shield, site da Global Solution 2026.2 "CitizenTech" (FIAP)
**Disciplinas:** Front-end Design e Web Development
**Equipe Nexus Dev:**

- Isac Nilton Fernandes de Oliveira — RM573282
- João Benedito de Oliveira Simplício — RM570206
- Leonardo Formigari — RM573291
- Luis Fernando — RM570959
- Nicolas Cinel — RM572940

Este documento descreve, de forma transparente, como a IA foi usada no desenvolvimento do site. Ele foi escrito a partir dos históricos reais das sessões de trabalho e do histórico de commits do repositório.

---

## 1. Ferramentas utilizadas

| Ferramenta | Para que usamos |
|---|---|
| **Claude Code** (Anthropic), pela extensão do VS Code | Assistente de programação dentro do repositório: lê o código, propõe planos, escreve e altera arquivos, roda testes e comandos e faz os commits que a equipe autoriza. |
| Modelo **Claude Opus** | Planejamento: explorar o código, discutir alternativas e escrever o plano passo a passo de cada tarefa. Nesse modo ele não edita código. |
| Modelo **Claude Sonnet** | Execução: implementar o plano aprovado, um passo por vez, com testes e verificação. |
| Plugins e skills do Claude Code | Roteiros de trabalho que a IA segue: desenvolvimento guiado por testes (TDD), escrita de planos, verificação antes de declarar algo pronto, e guias de design, acessibilidade e animação. |
| Playwright (via MCP do Claude Code) | Abrir o site num navegador real e tirar capturas em 390 px (celular) e 1440 px (desktop) para conferir o layout. |

**Nenhuma outra ferramenta de IA foi usada.** Não usamos ChatGPT, Gemini, Copilot nem geradores de imagem. As imagens e os banners, as fotos dos integrantes, as notícias e suas fontes e os textos da página Nexus Dev foram produzidos pela equipe.

---

## 2. Como trabalhamos com a IA

Definimos um processo fixo para não perder o controle do projeto:

1. **A equipe decide o que fazer.** Cada pedido partia de uma ideia ou de uma decisão nossa (o que a página deve mostrar, o que tirar, como deve parecer).
2. **A IA planeja (Opus).** Ela lia o código e escrevia um plano com contexto, objetivo, arquivos afetados, passos pequenos e como verificar.
3. **A equipe aprova ou corrige o plano.** Vários planos voltaram com mudanças antes de serem executados.
4. **A IA executa (Sonnet), um passo por vez,** com um commit pequeno para cada passo verificado. Isso deixou cada mudança fácil de revisar e de desfazer.
5. **A equipe confere o resultado** no navegador, nos testes e contra o firmware, e pede ajustes quando algo não ficou bom.

Regras que impusemos à IA desde o começo: comentários em português, cabeçalho da equipe em todo arquivo, lógica de negócio separada dos componentes, nenhuma URL ou IP fixo no código, acessibilidade obrigatória e mensagens de commit em português no padrão Conventional Commits.

---

## 3. Interações realizadas

Exemplos representativos, com o pedido como foi enviado (só com pequenas correções de digitação) e o que a IA respondeu ou fez.

### 3.1 O prompt de execução do site

Escrevemos um prompt longo com o contexto do produto, a rubrica das duas disciplinas, as decisões já tomadas pela equipe (React com JavaScript puro, Vite, Tailwind, a estética "sala de controle às 2h da manhã", a cidade com cinco locais, os botões de ataque em leet e a regra de que o site nunca dá ordens ao C-Shield) e uma lista de tarefas em fases. A primeira fase era só de especificação:

> "Método: spec-driven. Primeiro a especificação, depois a aprovação da equipe, depois o código."

**Resposta da IA:** escreveu os requisitos, o design e a lista de tarefas e **parou para a nossa aprovação** antes de criar qualquer código, como pedido.

### 3.2 Portar as regras do firmware com testes

> "Execute a T8 do plano da fase B, passo a passo, com TDD. Os arquivos do Edge estão em [pasta do repositório do Edge] (edge/cshield/*.h, edge/test/test_decisao.cpp...)."

**Resposta da IA:** leu o `decisao.h`, o `config.h` e os testes em C++ do firmware que a equipe já tinha feito para a entrega de Edge, e portou as regras para JavaScript (`src/domain`). Para cada regra, escreveu primeiro o teste no Vitest (com os mesmos casos do firmware, como o ataque de frio e a trava mínima), viu o teste falhar e só então escreveu o código.

### 3.3 Correção de rumo: o emulador é um jogo

O primeiro plano do emulador seguia o tempo real da câmara fria. A equipe corrigiu:

> "não precisa demorar 6 min, é pra ser como um jogo, pode ser instantâneo, no emulador vamos usar o mínimo ou quase nenhum termo técnico e etc, pra ficar simples e interativo pro usuário"

> "faz que essa parte da simulação dure menos de 1 min, os usuários não vão esperar todo esse tempo, como eu disse não precisa ser exatamente real tudo, é só uma simulação"

**Resposta da IA:** acelerou o relógio da simulação, trocou os termos técnicos por linguagem simples e separou o que é ilustrativo no emulador do que precisa ser idêntico ao firmware (o simulador Wokwi).

### 3.4 Decisão de escopo da equipe: tirar o painel ao vivo

> "estava pensando e acho desnecessário fazer a parte de edge da fase d junta com web, acho que não precisa e vai ficar redundante, porque tem o emulador, então minha ideia é tirar essa parte do plano e no lugar deixar só o anexo do Wokwi aberto com o circuito..."

**Resposta da IA:** refez o plano dessa fase. Saíram a leitura do FIWARE, as funções de API e o painel ao vivo. No lugar entrou a seção "Dispositivo real", com o Wokwi embutido e a imagem do aparelho enviada pela equipe.

### 3.5 Direção visual da equipe

> "vamos planejar o design do site com base nisso, também se baseie principalmente no exemplo anexado, e a logo também está anexada: C-SHIELD — Design System & Front-end Guidelines, DESIGN SYSTEM v1.0..."

**Resposta da IA:** a partir do Design System e das referências da equipe, planejou os tokens de cor, as fontes e os efeitos (fundo com binários e circuitos que pausam fora da tela) e depois aplicou a mesma linguagem visual em todas as páginas.

### 3.6 Ajustes de interface pedidos pela equipe

> "no mobile, a imagem de banner está embaixo da primeira parte, não de fundo, adapte pra ela ficar de fundo nessa parte, e ficar melhor posicionada"

> "não ficou bom não, suba a imagem pro topo, pra deixar alinhada com a escrita lá em cima e mude essa frase: Proteção inteligente para a cadeia de frio para Proteção inteligente para o bem da cidade ou algo relacionado a isso"

> "vamos planejar ajustes finais, nas páginas em cada uma delas quero colocar imagem como está na principal, porque tem o espaço vazio [...] e antes em notícias mudar o nome da página pra Problema"

**Resposta da IA:** reposicionou a imagem do hero, sugeriu a frase "Proteção inteligente para a saúde da cidade" (aprovada pela equipe), colocou os banners da equipe nas páginas internas (convertidos para WebP, mais leves) e renomeou a página de notícias para Problema, com redirecionamento do endereço antigo.

### 3.7 README e deploy

> "agora por último, planeje o readme e subir na vercel"

**Resposta da IA:** planejou o README (ficha CitizenTech, telas, instalação, execução e deploy) e o passo a passo da Vercel. A equipe criou o projeto na Vercel, configurou a variável da MockAPI, testou o site publicado e só então autorizou a continuação ("testei, deu certo, pode seguir o plano").

### 3.8 Mudança do hardware: liberação por cartão NFC

Por sugestão do professor, a equipe trocou no firmware o botão de liberação por um cartão NFC cadastrado. Escrevemos um roteiro com os textos a trocar e pedimos:

> "com base no arquivo [roteiro] atualize os textos do site e do readme, com base nessas alterações que fizemos no sistema de hardware, após isso veja o que precisa e o que falta para realizarmos a entrega final"

**Resposta da IA:** trocou os textos, achou uma menção ao botão que o roteiro não cobria e atualizou o teste que ainda exigia o texto antigo. Ao rodar os testes, descobriu que o Vitest não rodava mais nesta máquina (falhava até um teste vazio) e corrigiu a configuração (`pool: 'vmThreads'`). Depois listou o que faltava para a entrega.

---

## 4. Aplicação no projeto

A maior parte do código do site foi escrita pela IA, seguindo os planos e as decisões da equipe e passando pela nossa revisão. O conteúdo, as regras do produto e as decisões são da equipe.

| Parte do projeto | Papel da equipe | Papel da IA |
|---|---|---|
| Regras do C-Shield (estados, motivos, trava mínima, política) | Definidas pela equipe no firmware do Edge (`decisao.h`, `config.h`) | Portou para JavaScript em `src/domain` (`cshield.js`, `fisica.js`, `perfis.js`, `cidade.js` e outros), com testes |
| Emulador "seja o hacker" (cidade com 5 locais, ataques, placar) | Ideia, regras do jogo, tempo curto, linguagem simples | Lógica da cidade, hook `useCidadeSimulada`, mapa em SVG, animações |
| Cadastro de câmaras na MockAPI (CRUD) | Escolha do tema e dos campos, criação da API | Cliente `src/services/mockapi.js`, hook `useCamaras`, formulário com validação e confirmação de exclusão |
| Hooks (`useCShield`, `useSegurar`, `useLeituraDemo`, `usePrefereMenosMovimento` e outros) | Requisitos de comportamento e acessibilidade | Implementação e testes |
| Componentes e páginas (Home, Emulador, Problema, Como funciona, Nexus Dev, 404) | Estrutura das páginas, o que cada uma mostra, revisão visual | Código dos componentes React e do layout em Tailwind |
| Visual (Design System v1.0, logo, cores) | Design System, logo e referências visuais | Tokens no Tailwind, efeitos de fundo e aplicação nas páginas |
| Imagens, banners e fotos | Produzidos pela equipe | Só otimização (conversão para WebP) e posicionamento |
| Notícias, linha do tempo, textos da Nexus Dev | Pesquisa das notícias, fontes e textos da equipe | Organização em arquivos de conteúdo (`src/content`) |
| README e deploy | Configuração da Vercel e da MockAPI, testes do site publicado | Texto do README e configuração do `vercel.json` |
| Este AI.md | Revisão e aprovação | Rascunho a partir dos históricos das sessões |

---

## 5. Validação das respostas

Nada gerado pela IA entrou no projeto sem verificação. Os métodos que usamos:

- **Testes automatizados.** 372 testes no Vitest cobrem as regras do domínio e os hooks. Os casos das regras do C-Shield são os mesmos dos testes em C++ do firmware (`test_decisao.cpp`), para garantir que o emulador decide como o aparelho. Nenhuma tarefa avançava com teste falhando.
- **Conferência com o firmware.** As constantes e a ordem de prioridade dos estados (CRITICO > BLOQUEIO > FALHA_SENSOR > ATENCAO > NORMAL) foram comparadas com o `config.h` e o `decisao.h` do Edge. Quando havia diferença, valia o firmware.
- **Build e lint.** `npm run build` e `npm run lint` sem erros antes de cada entrega.
- **Verificações das regras do produto.** Buscas no código que precisam voltar vazias: nenhuma rota ou função que envie comandos ao C-Shield e nenhum IP fixo no código.
- **Conferência visual.** Capturas no navegador em 390 px e 1440 px, sem rolagem horizontal, e testes de navegação pelo teclado e com animações reduzidas.
- **Testes manuais.** Criar, editar e excluir câmaras na MockAPI; jogar o emulador; abrir o site publicado na Vercel.
- **Revisão da equipe e pedidos de correção.** Exemplos reais: a simulação longa demais (pedimos menos de 1 minuto), termos técnicos no emulador (pedimos linguagem simples), a imagem do hero no celular ("não ficou bom não") e o espaçamento desigual entre as seções.

---

## 6. Análise crítica

**Benefícios**

- **Velocidade.** Conseguimos construir um site com emulador, CRUD, várias páginas e animações num prazo curto, com mais de 270 commits pequenos e fáceis de revisar.
- **Disciplina.** O fluxo planejar, aprovar e executar, com testes antes do código, nos obrigou a pensar no que queríamos antes de pedir, e deixou o código organizado em camadas.
- **Fidelidade ao firmware.** Portar os testes do firmware para o Vitest garantiu que o emulador segue as mesmas regras do aparelho.

**Limitações**

- **A IA não decide o produto.** Sem uma direção clara, ela seguia o pedido ao pé da letra (por exemplo, uma simulação em tempo real que ninguém esperaria terminar). As melhores decisões do projeto vieram da equipe.
- **Layout visual exige várias rodadas.** Ela não vê a tela como uma pessoa. Ajustes de posição de imagem e espaçamento levaram várias tentativas e precisaram do nosso olhar.
- **Não substitui a revisão.** Em alguns momentos ela propôs coisas além do pedido ou deixou um texto desatualizado em outro lugar. Só a revisão e os testes pegaram isso.

**Dificuldades**

- **Conversas longas.** Em sessões grandes, era preciso pedir para "continuar de onde parou" e reforçar regras já combinadas.
- **Problemas de ambiente.** Perto da entrega, o Vitest parou de rodar nesta máquina por um problema de ambiente, sem relação com o nosso código. A IA ajudou a diagnosticar e contornar.
- **Entender o código gerado.** Como boa parte do código foi gerada, a equipe precisou estudar e revisar os arquivos para conseguir explicar e manter o projeto.

**Aprendizado do grupo**

A IA funcionou melhor como uma ferramenta muito rápida nas mãos da equipe do que como autora. O que fez diferença foi chegar com decisões claras, pedir planos antes de código, revisar cada passo e testar tudo. Usar a IA também exigiu de nós entender bem o problema, as regras do firmware e o que cada página precisava comunicar.
