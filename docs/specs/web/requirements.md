# Requisitos — site do C-Shield (c-shield-web)

Fase A, T1 e T2 do `docs/PROMPT-WEB.md`. Formato: "QUANDO <condição>, O SITE DEVE <resposta>". Os números (W1, W2...) são citados no `tasks.md` e nos commits de teste.

Fontes: `docs/PROMPT-WEB.md`, `docs/specs/PLANO-GS.md` e, no repositório do Edge, `docs/edge-contrato-web.md`, `edge/cshield/decisao.h`, `config.h`, `painel.h`, `simulacao.h` e `edge/test/test_decisao.cpp`. Em divergência de regra, valem `decisao.h` e `config.h`.

## T1 — As regras que o emulador precisa reproduzir (resumo em 5 linhas)

1. **Estados e prioridade:** `CRITICO` > `BLOQUEIO` > `FALHA_SENSOR` > `ATENCAO` (`PORTA_ABERTA` com luz > 40%, ou `DERIVA` fora da faixa) > `NORMAL`; `CRITICO` e `FALHA_SENSOR` só depois de 2 ciclos seguidos; o bloqueio é uma condição persistente, separada do estado mostrado.
2. **Quatro gatilhos de bloqueio, vale o primeiro:** setpoint fora de `[tMin, tMax]` (`SETPOINT_INVALIDO`); degelo > 30 min (`DEGELO_LONGO`) ou fora de 06–07 h e 18–19 h (`DEGELO_FORA_HORARIO`); aquecimento > 0,5 °C/min na janela de 60 s com a porta fechada (`AQUECIMENTO_RAPIDO`); resfriamento > 0,5 °C/min abaixo do centro da faixa, com a porta aberta ou fechada (`RESFRIAMENTO_RAPIDO`). A taxa só vale com pelo menos 10 s de janela.
3. **Relés por direção:** calor (temperatura > `tMax`, ou ataque não frio dentro da faixa) corta o aquecedor e liga a ventoinha de emergência; frio (temperatura < `tMin`, setpoint abaixo da faixa ou `RESFRIAMENTO_RAPIDO`) libera o aquecedor e não liga a ventoinha. Só atua com bloqueio ou crítico.
4. **Trava e liberação presencial:** durante o bloqueio as novas ordens do controlador são ignoradas; ele não acaba sozinho; o botão segurado por 3 s só libera depois da trava mínima (60 s no firmware de demonstração, 10 s reais no emulador acelerado); liberar descarta o histórico da taxa; se a ordem continuar inválida, o bloqueio reabre no mesmo ciclo.
5. **Alertas e exposição:** LED verde/amarelo/amarelo piscando/vermelho e **azul fixo durante o bloqueio**; buzzer em bloqueio ou crítico só com temperatura fora da faixa (ou nos 5 s iniciais do bloqueio); exposição térmica = soma de `(T − tMax) × dt` em °C·min, acumulada só acima de `tMax`; LCD com `Estado: Ideal|Atencao|Bloqueio|Critico|Falha` e a linha 2 alternando a cada 2 s com os textos de `painel.h`.

## Rotas e navegação

- **W1.** QUANDO a pessoa acessar `/`, `/emulador`, `/simulador-real`, `/incidentes` ou `/como-funciona`, O SITE DEVE mostrar a página correspondente com a barra de navegação e o rodapé.
- **W2.** QUANDO a pessoa acessar uma rota inexistente, O SITE DEVE mostrar a página 404 com um link para o início.
- **W3.** QUANDO a pessoa atualizar a página em qualquer rota no site publicado, O SITE DEVE carregar a mesma rota sem erro 404 (`vercel.json`).
- **W4.** QUANDO a pessoa navegar pelo teclado, O SITE DEVE mostrar o foco visível em todos os links e controles e indicar a rota atual na navegação (`aria-current`).

## Página inicial (scrollytelling) — W5 a W9 SUBSTITUÍDOS em 12/11 por W5'

> **Decisão do João (12/11):** a página inicial não terá scrollytelling. W5 a W9 ficam como histórico e valem os requisitos abaixo.

- **W5'.** QUANDO a pessoa abrir `/`, O SITE DEVE mostrar, nesta ordem, o banner (título "Proteção inteligente para a cadeia de frio", frase do produto, os botões "Simular um ataque" e "Como funciona" e a imagem da câmara fria), a seção de monitoramento de temperatura, a seção do problema (os números 3h30, 12.976 e 110 °C, cada um com a fonte linkada), o painel do C-Shield, a seção da solução (os quatro passos: medir, decidir, assumir, alertar) e a faixa final de chamada para o emulador.
- **W5a'.** QUANDO o arquivo da imagem do banner não existir, O SITE DEVE mostrar um espaço reservado com o escudo da logo, sem imagem quebrada.
- **W5b'.** QUANDO o texto da página inicial for escrito, O SITE NUNCA DEVE usar leet (o leet fica só no emulador) nem sugerir que o C-Shield recebe comandos pela rede (W43).
- **W5c'.** QUANDO a página inicial mostrar leituras, gráficos, alertas ou relés, O SITE DEVE dizer na tela que são dados simulados no navegador (W16a), e o gráfico DEVE ter uma tabela equivalente para leitor de tela, guia e valor ao passar o mouse e linha que já aparece inteira com movimento reduzido.
- **W5d'.** QUANDO o painel do C-Shield mostrar o estado dos relés, O SITE DEVE desenhá-los como indicadores só de leitura (estado em texto, sem botão e sem foco), com a nota "Os relés só mudam pelo próprio C-Shield." (W42).


- **W5.** QUANDO a pessoa abrir `/`, O SITE DEVE apresentar 4 capítulos em rolagem: Madrugada, A invasão, O C-Shield e A prova, com os textos da seção 2.5 do prompt.
- **W6.** QUANDO um capítulo ocupar a maior parte da tela, O SITE DEVE ajustar o fundo binário (velocidade, direção e cor), a geladeira (porta e faíscas) e o brilho dos títulos ao capítulo atual.
- **W7.** QUANDO a aba estiver oculta, O SITE DEVE pausar as animações de canvas.
- **W8.** QUANDO a pessoa chegar ao capítulo 4, O SITE DEVE mostrar "Na Europa: 3h30 até alguém perceber. Com o C-Shield: segundos." e o botão "Ataque uma cidade", que leva a `/emulador`.
- **W9.** QUANDO a tela for estreita (até 640 px), O SITE DEVE desenhar menos colunas de binário e manter os textos legíveis sobre o véu escuro.

## Emulador — mapa da cidade

- **W10.** QUANDO a pessoa abrir `/emulador`, O SITE DEVE mostrar o mapa SVG com os 5 locais (UBS Vila Mariana protegida, UBS Brasilândia, Hemocentro Consolação, Farmácia Mooca, Mercado Liberdade), o atacante fora da cidade, a central (FIWARE) no centro e o rótulo "tempo acelerado: 1 s = 1 min".
- **W11.** QUANDO um local tiver C-Shield, O SITE DEVE desenhar uma linha de dados azul desse local **até a central**, com pulsos andando só em direção à central; O SITE NUNCA DEVE desenhar linhas entre locais nem da central para os locais.
- **W12.** QUANDO a pessoa selecionar um local (clique, toque ou Enter), O SITE DEVE oferecer os botões `4T4QU3 D3 C4L0R` e `4T4QU3 D3 FR10`, com `aria-label` "Ataque de calor" e "Ataque de frio".
- **W13.** QUANDO um local desprotegido for atacado, O SITE DEVE desenhar a linha de ataque vermelha até ele, deixá-lo vermelho, levar a temperatura para fora da faixa pelo modelo térmico e iniciar o relógio do ataque.
- **W14.** QUANDO um local protegido for atacado, O SITE DEVE romper a linha de ataque no escudo azul da borda do local, entrar em `BLOQUEIO` no primeiro ciclo de decisão e mostrar "Ataque bloqueado".
- **W15.** QUANDO a pessoa acionar "Ataque em massa", O SITE DEVE atacar todos os locais ao mesmo tempo e a central DEVE mostrar "Ataque coordenado detectado: N locais em X s".
- **W16.** QUANDO o clique de ataque completar 3 ou mais locais atacados em até 20 s reais, O SITE DEVE detectar o ataque coordenado imediatamente, nesse mesmo clique, mesmo que os ataques tenham sido individuais.
- **W16a.** QUANDO o emulador usar perfis de produto, O SITE PODE usar valores ilustrativos (comentados como demonstração); QUANDO `/simulador-real` mostrar faixa, estados, motivos, cores e textos, O SITE DEVE usar exatamente os valores do Edge (perfil VACINA 2 a 8 °C, tolerância 1 °C).
- **W17.** QUANDO a pessoa acionar "Ativar C-Shield", O SITE DEVE proteger os locais desprotegidos; um local atacado DEVE passar a azul com "Ataque bloqueado" e, quando a temperatura voltar à faixa, "Seguro" — ou "Seguro · lote em análise" se tiver exposição maior que zero.
- **W18.** QUANDO a pessoa acionar "Recomeçar", O SITE DEVE voltar todos os locais, o placar e os relógios ao estado inicial.
- **W19.** QUANDO o emulador estiver aberto, O SITE DEVE mostrar o placar comparativo entre as duas UBS (temperatura, tempo até reagir, exposição em °C·min e situação) atualizado a cada ciclo, com a frase "Mesma cidade, mesmo ataque, mesma hora.". Sem C-Shield, o tempo até reagir DEVE mostrar "3h30 até alguém perceber".

## Emulador — a câmara por dentro

- **W20.** QUANDO a pessoa selecionar um local (ou, por padrão, a UBS protegida), O SITE DEVE mostrar a câmara por dentro: LCD 16x2, LED de estado, relé do aquecedor, relé da ventoinha, gráfico de temperatura com a faixa segura e o botão de liberação.
- **W21.** QUANDO o estado mudar, O SITE DEVE mostrar no LCD exatamente os textos do firmware (`Estado: Bloqueio`, `Alt. de Setpoint`, `Aquec. rapido`, `Resfria rapido`, `Restaurando temp`, `Liberacao em 8s`, `Segure botao 3s`, `Trava ativa`, `Estado: Liberado`...), alternando a linha 2 a cada 2 s, com no máximo 16 caracteres por linha.
- **W22.** QUANDO houver bloqueio, O SITE DEVE acender o LED em azul fixo; nos outros estados, verde (`NORMAL`), amarelo (`ATENCAO`), amarelo piscando no máximo 3 vezes por segundo (`FALHA_SENSOR`) e vermelho (`CRITICO` sem bloqueio).
- **W23.** QUANDO a pessoa segurar o botão de liberação por 3 s (mouse, toque ou teclado), O SITE DEVE mostrar o progresso e enviar a liberação à lógica do emulador; soltar antes de 3 s DEVE cancelar.
- **W24.** QUANDO a liberação for tentada antes da trava mínima, O SITE DEVE mostrar `Trava ativa` / `Aguarde Ns` e manter o bloqueio.
- **W25.** QUANDO a liberação for aceita com a ordem do controlador ainda inválida, O SITE DEVE reabrir o bloqueio.
- **W26.** QUANDO o emulador estiver aberto, O SITE DEVE mostrar a faixa segura do perfil só para leitura, com a etiqueta "gravada no dispositivo"; O SITE NUNCA DEVE oferecer controle para alterar a política.

## Os LEDs e a chave do Wokwi são representações

No Wokwi não há aquecedor, ventoinha nem controlador comercial de verdade. Por isso o circuito usa substitutos (`diagram.json` do Edge):

| Peça no Wokwi | O que representa | Comportamento |
| --- | --- | --- |
| LED laranja "Aquecedor liberado" (no contato NF do relé 1) | O aquecedor/degelo da câmara | Aceso = aquecedor recebe energia; apaga quando o C-Shield corta (ataque de calor) |
| LED azul "Ventoinha de emergência" (relé 2, NA) | A ventoinha de emergência do C-Shield | Acende quando o C-Shield liga a ventoinha (ataque de calor); apagada no ataque de frio |
| LED verde "Ventoinha de refrigeração" (GPIO 16) | A refrigeração normal do controlador comercial | Segue a chave: NORMAL liga, ATAQUE desliga; durante o bloqueio a chave só consegue **ligar**, nunca desligar (`ventoinhaRefrigeracaoSimulada` em `simulacao.h`) |
| Chave "Controlador" (NORMAL / ATAQUE) | A ordem que o controlador invadido manda | NORMAL = setpoint 5 °C; ATAQUE = setpoint 45 °C (o atacante mandando esquentar) |

Num equipamento real esses LEDs não existem: o relé corta ou libera o aquecedor e liga a ventoinha de verdade, e a ordem vem do controlador invadido, não de uma chave.

- **W26a.** QUANDO o emulador mostrar a câmara por dentro, O SITE DEVE desenhar os **equipamentos que os LEDs representam** — aquecedor (resistência que brilha quando ligada e apaga quando cortada), ventoinha de emergência (gira quando ligada), refrigeração do controlador (ventoinha/compressor ligado ou parado) — e não LEDs genéricos; cada um com rótulo de texto do seu estado ("Aquecedor cortado pelo C-Shield", "Ventoinha de emergência ligada"...).
- **W26b.** QUANDO o visitante clicar `4T4QU3 D3 C4L0R` ou `4T4QU3 D3 FR10`, O SITE DEVE tratar o clique como a chave do controlador indo para ATAQUE: calor = setpoint alto (45 °C no perfil vacina) e refrigeração do controlador desligada; frio = setpoint abaixo da faixa e aquecedor do controlador ligado. Durante o bloqueio, as ordens do atacante são ignoradas e a refrigeração do controlador só pode voltar a ligar, nunca desligar (mesma regra do `simulacao.h`).
- **W26c.** QUANDO `/como-funciona` ou a seção do Wokwi no emulador explicarem o circuito, O SITE DEVE dizer que os LEDs laranja, azul e verde e a chave "Controlador" são representações do aquecedor, da ventoinha de emergência, da refrigeração e da ordem do controlador, porque o simulador não tem esses equipamentos; no aparelho real eles não existem.
- **W41a.** QUANDO `/simulador-real` mostrar os relés, O SITE DEVE derivá-los do que o Edge publica (o FIWARE não publica relés), com a mesma regra do `decisao.h`: atua só em `BLOQUEIO` ou `CRITICO`; modo calor se `temperature` > 8 °C, ou se não está abaixo de 2 °C e o motivo não é de frio; motivo de frio = `RESFRIAMENTO_RAPIDO` ou `SETPOINT_INVALIDO` com `setpoint` < 2 °C. A posição da chave aparece como "Controlador: NORMAL" (setpoint 5) ou "Controlador: ATAQUE" (setpoint 45).

## Emulador — o aparelho real

- **W27.** QUANDO a pessoa rolar até o fim do emulador, O SITE DEVE mostrar o Wokwi embutido (`https://wokwi.com/projects/480328417992209409`) ou, se o embed não funcionar, um cartão com o link em nova aba; e o botão "Abrir simulador real", que leva a `/simulador-real`.

## Integração emulador → incidentes (SUBSTITUÍDA, ver W53 a W58)

- **W28.** QUANDO um bloqueio começar no emulador, O SITE DEVE criar um incidente na API com `origem: "emulador"`, `localId`, `localNome`, `bairro`, `tipo` (`CALOR` ou `FRIO`), `motivo`, `inicio`, `tempoReacaoS`, `exposicao` e `status: "ABERTO"`, uma única vez por bloqueio.
- **W29.** QUANDO a criação do incidente falhar, O SITE DEVE continuar o emulador normalmente e avisar de forma discreta, sem travar a tela.

## Incidentes (CRUD) (SUBSTITUÍDO por Notícias e Instalações, ver W53 a W58)

- **W30.** QUANDO a pessoa abrir `/incidentes`, O SITE DEVE listar os incidentes da API, com estados de carregando, erro (com tentar de novo) e lista vazia.
- **W31.** QUANDO a pessoa usar os filtros, O SITE DEVE filtrar por status (`ABERTO`, `EM_ANALISE`, `RESOLVIDO`) e por tipo (`CALOR`, `FRIO`).
- **W32.** QUANDO a pessoa enviar o formulário de novo incidente, O SITE DEVE validar os campos (mensagem junto ao campo), criar com `origem: "manual"` e mostrar o item na lista.
- **W33.** QUANDO a pessoa editar um incidente, O SITE DEVE permitir mudar o status e escrever a ação tomada, e salvar na API.
- **W34.** QUANDO a pessoa pedir para excluir, O SITE DEVE pedir confirmação na própria página (sem `confirm()`) e só então excluir na API.
- **W35.** QUANDO o recurso `locais` existir na API, O SITE DEVE permitir cadastrar "a câmara fria do seu bairro" (nome, bairro, perfil entre os fixos) e mostrá-la no mapa.

## Dispositivo real (agora a seção `#dispositivo-real` do emulador, ver W57)

- **W36.** QUANDO o navegador pedir `GET /api/estado`, a função de servidor DEVE consultar o Orion (`/v2/entities/urn:ngsi-ld:CShield:001?options=keyValues`, headers `fiware-service: smart` e `fiware-servicepath: /`) usando `FIWARE_HOST` e devolver o JSON.
- **W37.** QUANDO o navegador pedir `GET /api/historico?attr=<a>&lastN=<n>`, a função DEVE consultar o STH-Comet (porta 8666) e aceitar só `temperature`, `humidity`, `luminosity`, `state`, `blocks` e `exposure`, com `lastN` limitado; outro atributo DEVE responder 400.
- **W38.** QUANDO uma função de `api/` receber método diferente de GET, ela DEVE responder 405.
- **W39.** QUANDO a pessoa abrir `/simulador-real`, O SITE DEVE consultar a ponte a cada 3 s e mostrar o estado com a cor do LED, a temperatura grande, o motivo, o contador de bloqueios, a exposição e o gráfico do histórico; ao sair da página, o polling DEVE parar.
- **W40.** QUANDO o `TimeInstant` tiver mais de 30 s, ou a ponte falhar, O SITE DEVE mostrar "dispositivo offline", a última leitura, o aviso "Abra a simulação no Wokwi para ver ao vivo" e um botão para o emulador.
- **W41.** QUANDO `temperature`, `humidity` ou `setpoint` valerem `-999`, O SITE DEVE mostrar "sem leitura" em vez do número.

## O site nunca dá ordens ao C-Shield

- **W42.** O SITE NUNCA DEVE enviar comando ao dispositivo: nenhum POST, PUT, PATCH ou DELETE para o FIWARE, nenhuma rota de comando e nenhum botão em `/simulador-real` que envie algo. O texto "Nem este site consegue dar ordens ao C-Shield." DEVE aparecer em `/simulador-real`.
- **W43.** QUANDO o site falar do C-Shield em qualquer página, ele NUNCA DEVE sugerir que o dispositivo recebe comandos pela rede.

## Como funciona

- **W44.** QUANDO a pessoa abrir `/como-funciona`, O SITE DEVE mostrar os 4 verbos (medir, decidir, assumir, alertar), os 5 estados com as cores do LED, a arquitetura em uma direção (dispositivo → FIWARE → site), o link do Wokwi, o link do repositório do Edge e a equipe com RMs.

## Acessibilidade e responsividade

- **W45.** QUANDO o texto for desenhado, O SITE DEVE garantir contraste mínimo de 4,5:1 e nunca usar texto transparente (só o fundo dos painéis).
- **W46.** QUANDO qualquer efeito piscar, O SITE DEVE limitar a no máximo 3 piscadas por segundo; o efeito `led-falha` só aparece durante um ataque.
- **W47.** QUANDO `prefers-reduced-motion` estiver ativo, O SITE DEVE parar binário em movimento, faíscas, pulsos e piscadas, trocando por imagens estáticas e transições suaves de cor.
- **W48.** QUANDO a tela tiver de 360 px a 1440 px, O SITE DEVE funcionar sem rolagem horizontal, com alvos de toque de pelo menos 44 × 44 px.
- **W49.** QUANDO o estado for indicado por cor, O SITE DEVE indicá-lo também por texto ou ícone (nunca só pela cor).
- **W50.** QUANDO o estado de um local ou do dispositivo mudar, O SITE DEVE anunciá-lo a leitores de tela por uma região `aria-live="polite"`.

## Qualidade e entrega

- **W51.** O código DEVE separar regra (`src/domain`, testada no Vitest com os casos de `test_decisao.cpp`), acesso a dados (`src/services`) e apresentação (`src/components`), com pelo menos 8 componentes e 2 hooks personalizados.
- **W52.** O repositório DEVE ter `README.md` (Ficha CitizenTech igual à do Edge), `AI.md` com os 5 itens, `.env.example` sem valores e nenhum segredo ou IP no código.

## Mudanças de 11/11 (tarde): notícias, instalações, dispositivo real e Nexus Dev

- **W53.** QUANDO a pessoa abrir `/noticias`, O SITE DEVE mostrar as manchetes reais dos ataques aos refrigeradores na Europa (capa, grade e linha do tempo), cada uma com o veículo, a data, a manchete, um resumo da equipe e o link "Ler na fonte" em nova aba; QUANDO o título não foi conferido na página da fonte, DEVE dizer "Título da equipe". `/incidentes` DEVE redirecionar para `/noticias`.
- **W54 (SUBSTITUÍDO pelo W59).** QUANDO a pessoa abrir o emulador, O SITE DEVE mostrar o painel "Instalações do C-Shield" com os 5 locais, e QUANDO a pessoa instalar, editar ou remover, DEVE gravar na API externa (recurso `instalacoes`) e o mapa DEVE refletir a proteção na hora; sem a API, o jogo DEVE seguir só com a unidade piloto e mostrar o erro com "Tentar de novo".
- **W55 (SUBSTITUÍDO: a regra de não desativar com o bloqueio ficou no jogo, ver W60).** QUANDO um local estiver com o ataque bloqueado, O SITE NÃO DEVE permitir remover o C-Shield dele, e DEVE dizer "Libere o bloqueio no local primeiro."; a unidade piloto NUNCA DEVE sair.
- **W56 (SUBSTITUÍDO pelo W59).** QUANDO a pessoa remover, DEVE confirmar na própria página (sem `confirm()`); a faixa segura NUNCA DEVE ser editável pela rede.
- **W57.** QUANDO a pessoa clicar em "Ver o dispositivo real" (ou abrir `/emulador#dispositivo-real` ou o antigo `/simulador-real`), O SITE DEVE rolar até a seção "Dispositivo real" no fim do emulador, com o link do Wokwi e a frase "Nem este site consegue dar ordens ao C-Shield."
- **W58.** QUANDO a pessoa abrir `/nexus-dev`, O SITE DEVE mostrar os 5 integrantes com foto (ou avatar com as iniciais), nome, função e RM, além da visão, da cultura e de "Sobre a GS 2026.2"; o item "Nexus Dev" DEVE ser o último do menu.

## Mudança de 12/11: o CRUD vira o cadastro de câmaras do bairro; o emulador fica sem API

- **W59.** QUANDO a pessoa chegar ao fim de `/noticias`, O SITE DEVE mostrar a seção "E na sua cidade?" com o cadastro de câmaras do bairro: cadastrar (nome do lugar, bairro, o que guarda e observação opcional, com mensagem de erro junto do campo), listar com filtro por tipo, editar e excluir (com confirmação na própria página, sem `confirm()`), gravando na API externa (recurso `camaras`), com estados de carregando, erro com "Tentar de novo" e lista vazia.
- **W60.** QUANDO a pessoa escolher um local no emulador, O SITE DEVE oferecer, na zona de defesa do card, "Ativar C-Shield nesse local" ou "Desativar C-Shield nesse local", só dentro do jogo e sem chamar nenhuma API; a desativação DEVE ficar desligada, com o motivo escrito, enquanto o ataque estiver bloqueado, e a unidade piloto NUNCA DEVE sair.
- **W61.** O emulador NÃO DEVE depender de internet nem de API externa: "Recomeçar" zera o jogo inteiro, inclusive o C-Shield ativado nos locais.
