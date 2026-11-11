# Plano GS 2026.2 — C-Shield

Nov 9, 2026 · @Isac

## Ficha CitizenTech (topo de todos os READMEs)

| Campo | Conteúdo |
| --- | --- |
| Nome da CitizenTech | C-Shield (de Cyber Shield) |
| Equipe | Nexus Vision — Isac Nilton Fernandes de Oliveira (RM 573282), João Benedito de Oliveira Simplício (RM 570206), Leonardo Formigari (RM 573291), Luis Fernando (RM 570959), Nicolas Cinel (RM 572940) |
| Cidade e bairro | São Paulo — \[bairro do comércio ou da UBS entrevistada\] |
| Cidadão beneficiado | Quem depende do que está guardado no frio sem ver o equipamento: o paciente que precisa de transfusão, a criança que vai tomar vacina na UBS e a família que compra no mercado do bairro. Quem usa o Guardião é o responsável pelo frio sem equipe de segurança: o dono do açougue, a farmacêutica, a enfermeira da sala de vacina |
| Problema, em uma frase | Controladores de câmaras frias conectados à internet podem ser invadidos e mandados esquentar, e quem guarda vacinas, sangue e alimentos só descobre horas depois, quando o produto já está perdido |
| Como funciona | Um ESP32 independente, instalado junto da câmara, mede a temperatura com sensores próprios, compara com uma política gravada nele e, diante de uma ordem perigosa, reage pelos relés (num ataque de calor, corta o aquecedor e liga a ventoinha de emergência; num ataque de frio, libera o aquecedor e desliga a ventoinha de emergência), trava novas ordens e avisa no local, mesmo sem internet. Ele não recebe comandos pela rede: só envia dados. A liberação é presencial, por um botão no aparelho |
| O que cada parte faz | **Edge:** o Guardião no Wokwi, publicando no FIWARE · **Python:** central que cadastra câmaras, avalia ordens recebidas e calcula a exposição térmica · **DPS:** modelo do aquecimento (lei de Newton) que mostra quanto tempo o produto aguenta e quanto o Guardião evita perder · **Front e Web:** site com o emulador do ataque, o painel do dispositivo e o registro de incidentes · **Experiência:** requisitos, caso de uso e protótipo · **Pitch:** a história e o negócio |
| Links | Repositório do site: \[link\] · Repositório do Edge: [C-Shield-Edge](https://github.com/NexusDev-Team/C-Shield-Edge) · Wokwi: [projeto público](https://wokwi.com/projects/480328417992209409) · Site publicado: \[link\] |
| Indicador de impacto | Tempo entre o ataque e a resposta (na Europa, 3h30; com o Guardião, segundos) · exposição térmica evitada (°C·min) · número de ordens perigosas bloqueadas |
| ODS | 3 Saúde e bem-estar · 9 Indústria, inovação e infraestrutura · 2 Fome zero |

Nome decidido em 10/11: **C-Shield**. Neste plano, "Guardião" descreve o papel do dispositivo C-Shield. No firmware, no site e nos READMEs, o nome exibido é C-Shield.

## Status das entregas (11/11)

| Disciplina | Responsável | Status | Pendências |
| --- | --- | --- | --- |
| Edge Computing | Cinel | Firmware, circuito, testes, FIWARE e documentação prontos | Gravar e publicar o vídeo até 11/11 à noite e colocar o link no README |
| Front-end e Web | Isac e João | Não iniciado (repositório `c-shield-web`) | Emulador, `/simulador-real`, CRUD e deploy |
| Python | Leo | Sem atualização | Usar os nomes FIWARE canônicos da seção do Edge |
| DPS | Luis | Sem atualização | Calibrar as duas taxas provisórias do firmware |
| Experiência | Grupo, com o Claude | Após as outras | Incluir o ataque de frio no "Como funciona" |
| Pitch | Grupo, com o Claude | Após as outras | Roteiro e gravação |

## O caso: o frio foi invadido pela internet

Entre outubro e novembro de 2026, invasores entraram remotamente nos controladores de refrigeração de supermercados e de um banco de sangue na Europa e mandaram os equipamentos esquentar. Ninguém entrou nos prédios.

| Data | O que aconteceu | Fonte |
| --- | --- | --- |
| 06/11/2026 | CISA, FBI e outros órgãos dos EUA mandam o varejo tirar a refrigeração da internet e definir limites de setpoint em dispositivos que operam depois dos controladores, com alerta para desvios | [Food Safety Magazine](https://www.food-safety.com/articles/12001-us-government-tells-food-retailers-to-take-refrigerators-off-the-internet-due-to-malicious-cyberattacks) |
| 02/11/2026 | Banco de sangue francês (EFS): 3 instalações; plasma guardado a cerca de -30 °C teve o controle ajustado para até 110 °C. Alarmes e um técnico de plantão perceberam a tempo; nada foi perdido | [Agora Litoral](https://agoralitoral.com.br/2026/11/07/hackers-invadem-freezers-de-bancos-de-sangue-na-franca-e-alteram-temperaturas/) · [Cybernews](https://cybernews.com/security/frances-blood-storage-breach-temperatures-rise/) |
| 01 e 02/11/2026 | Segunda onda, mais de 100 lojas em sete a nove países (Bélgica, Luxemburgo, Suécia, Irlanda, Estônia, Finlândia, entre outros). Na ICA de Estocolmo, o ataque foi às 2h e só foi identificado às 5h30. A União Europeia chamou de "tentativa deliberada de desestabilizar nossa cadeia de abastecimento de alimentos" | [g1/Reuters](https://g1.globo.com/tecnologia/ciberseguranca/noticia/2026/11/02/hackers-atacam-supermercados-europeus-e-elevam-temperatura-de-freezers-a-50c.ghtml) · [The Guardian](https://www.theguardian.com/technology/2026/nov/02/europe-supermarket-fridges-freezers-who-hacking-why) · [BBC](https://www.bbc.com/news/articles/cmg474vk6dyqo) |
| 22/10/2026 | Forescout encontra 12.976 serviços de controle de refrigeração expostos, em 6.017 endereços, em 99 países; 80% dos Danfoss AK-SM 800A observados estavam desatualizados | [Forescout](https://www.forescout.com/blog/cold-chain-open-control-exposed-refrigeration-systems-reveal-global-risk/) |
| 11/10/2026 | Primeira onda na França: mais de 100 lojas da Coopérative U e 180 do Intermarché e Netto, além de Carrefour, Monoprix e E.Leclerc, pelo software da Danfoss. Toneladas de alimentos destruídas e incêndios em algumas lojas. O governo francês chamou de "o primeiro ciberataque de sabotagem em larga escala no nosso território" e depois acusou uma unidade ligada à Guarda Revolucionária do Irã; o Irã ainda não respondeu oficialmente | [BBC](https://www.bbc.com/news/articles/cmg474vk6dyqo) · [g1/Reuters](https://g1.globo.com/tecnologia/ciberseguranca/noticia/2026/11/02/hackers-atacam-supermercados-europeus-e-elevam-temperatura-de-freezers-a-50c.ghtml) |
| Agosto/2026 | Geladeiras de pelo menos seis bases militares dos EUA falham e estragam comida; o Pentágono investiga como possível ataque. A Claroty divulga falhas nos controladores Danfoss AK-SM 800A e Copeland XWEB Pro | [The Guardian](https://www.theguardian.com/technology/2026/nov/02/europe-supermarket-fridges-freezers-who-hacking-why) · [Latin Times](https://www.latintimes.com/europe-supermarket-refrigeration-cyberattacks-600832) |

**Como entraram:** acesso remoto usado por técnicos terceirizados, senhas padrão, firmware sem atualização e equipamentos fora de linha que nunca mais recebem correção (Danfoss AK-SM 800 e AK-SC 355). Ninguém assumiu a autoria; a Bélgica abriu investigação criminal e admite que os autores talvez nunca sejam identificados.

**As duas lições que viram o projeto:**

- **Quem estava isolado não caiu.** Lojas que tiraram os controladores da internet depois do ataque francês não foram atingidas. Nos Países Baixos, as vítimas foram sobretudo açougues e pequenos mercados independentes; as grandes redes não relataram impacto.
- **O banco de sangue só se salvou porque alguém olhou.** O alarme existia e um técnico estava de plantão. Um especialista ouvido pela CNN Brasil recomenda exatamente isso: alertas de temperatura **independentes do sistema que controla o equipamento**. É a definição do nosso produto.

**Três fatos que valem ouro para o projeto:**

- **3h30 de silêncio.** Na ICA de Estocolmo, o ataque foi às 2h e só foi percebido às 5h30. É o número do cenário "sem Guardião" da DPS e do pitch.
- **A tela pode mentir.** Em testes da Claroty, o atacante desligou o resfriamento e o painel continuou mostrando temperatura normal enquanto o refrigerador esquentava ([RWTA](https://www.rwta.com.au/rwtanews/cybersecurity-vulnerabilities-refrigeration-systems)). Por isso o Guardião precisa dos próprios sensores: "um sistema comprometido não avisa que foi comprometido".
- **Nem precisou de vírus.** "Foi como usar luvas de borracha e mexer nos interruptores" (Rafe Pilling, Sophos, ao Guardian). O ataque foi simples; a defesa também pode ser.

**Fonte pública brasileira para os slides:** a [Agência Brasil](https://agenciabrasil.ebc.com.br/internacional/noticia/2026-11/supermercados-europeus-sao-atingidos-por-novo-ataque-cibernetico) republicou a matéria da Reuters sobre a segunda onda, com dois fatos extras: o chefe do Centro Nacional de Cibersegurança da Suécia disse que o país tem muitos dispositivos de tecnologia operacional expostos, que precisam de atualização; e a Ahold já tinha comunicado à polícia holandesa atividades suspeitas em sua infraestrutura no mês anterior. Por ser uma agência pública brasileira em português, é uma boa fonte para citar no slide de problema.

## São Paulo e o cidadão

O briefing do 1º ano exige **um problema real de São Paulo e uma pessoa real que conviva com ele**. O ataque foi na Europa, então o projeto precisa trazer o risco para cá, sem exagerar.

**O que dá para afirmar sobre o Brasil** ([CNN Brasil, 05/11/2026](https://www.cnnbrasil.com.br/economia/money/tecnologia/de-freezers-a-hospitais-ataques-hackers-na-europa-expoem-riscos-no-brasil/)):

- "Os mesmos equipamentos que foram atacados na Europa existem aqui" (Fernando de Falchi, Check Point).
- Empresas brasileiras de bens de consumo e serviços sofrem em média 1.924 ataques cibernéticos por semana (Check Point).
- Ainda não há registro no Brasil de um incidente igual ao europeu (Roberto Toscani, Tripla). Isso posiciona o projeto como **prevenção**, e é honesto: a França só reduziu a exposição em 71% depois de ser atacada.
- Em hospitais, a matéria cita refrigeradores de vacinas e medicamentos entre os equipamentos conectados em risco.

**Onde está o frio que importa em São Paulo:** salas de vacina (a prefeitura vacina em mais de 400 locais da capital, segundo a [Secretaria Municipal da Saúde](https://prefeitura.sp.gov.br/w/refeitura-leva-vacina%C3%A7%C3%A3o-contra-gripe-sarampo-e-febre-amarela-a-mais-de-400-locais-da-capital-a-partir-desta-segunda-8-)), hemocentros, farmácias, mercados de bairro e açougues.

**Cidadão beneficiado (proposta):** quem depende do que está guardado no frio sem nunca ver o equipamento: o paciente que precisa de uma transfusão, a criança que vai tomar vacina na UBS, a família que compra carne no mercado do bairro.

**Quem usa o Guardião:** o responsável pelo frio que não tem equipe de segurança: o dono do açougue ou do mercadinho, a farmacêutica, a enfermeira da sala de vacina. Na Europa, foram justamente os pequenos que mais caíram. Esse é o ângulo CitizenTech: grandes redes têm time de segurança; o comércio do bairro e o serviço público de saúde, não.

**Entrevista: agora ela é fácil e vale muito.** Todo bairro tem um açougue ou mercadinho com câmara fria. Dez minutos de conversa resolvem a exigência do briefing e dão a frase de abertura do pitch. Perguntas sugeridas:

1. Se a câmara esquentar às 3 da manhã, como você fica sabendo?
2. Quanto você perderia se tivesse que jogar tudo fora?
3. O controlador é conectado à internet? Quem tem acesso remoto (técnico, fabricante)?
4. Você já trocou a senha que veio de fábrica?

Usem só o primeiro nome ou um apelido e peçam autorização para citar a fala (regra da GS: nada de dados pessoais reais).

## A solução: vê de longe, só obedece de perto

O Guardião é um dispositivo independente, instalado junto da câmara fria, que tem os próprios sensores, guarda as próprias regras na memória e **não recebe nenhum comando pela rede**. Ele só envia dados. Se o controlador do equipamento for invadido e mandar esquentar, o Guardião veta, corrige, trava e avisa.

&#91;embedded content: arquitetura do Guardião · veto local, envio em uma direção\]

A ordem do atacante chega ao controlador comercial, mas o relé do Guardião fica entre ele e a câmara. O Guardião mede com os próprios sensores, veta o que aumenta o risco e só envia dados para o FIWARE e o site.

**Como ele funciona, em quatro verbos** (o ciclo que a disciplina de Edge pede):

1. **Medir:** temperatura e umidade com sensores próprios, que o atacante não controla; luminosidade para saber se a porta foi aberta; e o que o controlador comercial está mandando (setpoint e degelo).
2. **Decidir:** compara tudo com a política gravada nele (faixa segura do produto, janela de degelo permitida, velocidade máxima de aquecimento). Ninguém consegue alterar essa política pela internet.
3. **Atuar:** um relé fica entre o controlador e o equipamento. Diante de uma ordem perigosa, o Guardião corta o degelo ou o aquecimento, mantém a refrigeração e entra em bloqueio por um tempo.
4. **Alertar:** luz, som e mensagem no display no local; envio do evento ao FIWARE e ao site para os responsáveis.

**A única forma de liberar é presencial:** um botão físico no aparelho, segurado por 3 segundos. Frase do produto (proposta): **"Vê de longe. Só obedece de perto."**

**De onde vem a ideia (para a banca ver que não é invenção):**

- A indústria já separa o sistema que **controla** do sistema que **protege**. Em refinarias e químicas, o sistema instrumentado de segurança (norma IEC 61511) é independente do controle, justamente para continuar funcionando se o controle falhar ou for comprometido.
- Infraestruturas críticas usam gateways unidirecionais ("diodos de dados"): a informação sai, mas nada entra.
- O Guardião leva essas duas ideias para o freezer do açougue e para a geladeira da UBS, com um ESP32.

**Limite honesto:** no protótipo, a direção única é garantida pelo software (o firmware não assina nenhum tópico de comando e não aceita atualização pela rede). Um diodo físico de verdade entra no roadmap.

**A história que só vocês têm:** no CP5, a Vinheria recebia o comando `set_limits` pela internet e mudava os limites sozinha. É o mesmo padrão explorado na Europa. No Guardião, o grupo inverte a própria arquitetura: a nuvem só observa. É um ótimo momento para o pitch e para o vídeo de Edge.

## O que já existe e o que aproveitar

Existem três tipos de solução no mercado, e nenhuma junta sensor independente, veto local e envio em uma só direção com custo de comércio de bairro. Esse é o espaço do Guardião.

| Tipo | Exemplos | O que faz | O que não faz | O que aproveitamos |
| --- | --- | --- | --- | --- |
| Monitores independentes de temperatura | [JRI](https://jri-mms.com/en/blog/cyberattack-on-fridges-independent-temperature-monitoring-system) (França), [Crodeon](https://www.crodeon.com/blogs/news/refrigeration-systems-hacked-who-monitors-the-temperature-when-the-controls-are-attacked) (Bélgica), Ladle (EUA), [Sensorweb](https://www.baguete.com.br/noticias/sensorweb-monitora-hemorrede-do-parana) (Brasil) | Sensores próprios, separados do controlador, que registram e alertam por SMS, e-mail ou ligação; alguns usam rede celular e bateria | **Não agem.** A Crodeon admite que o monitoramento "não impede o ciberataque". Alguém precisa acordar às 2h e ir até a loja | Separação física e lógica do controle, detecção de porta aberta, bateria, rede celular e o modelo de negócio |
| Segurança de redes industriais | Claroty, Forescout, Nozomi | Encontram equipamentos expostos e tráfego suspeito | São plataformas para grandes empresas, com equipe de segurança dedicada | As pesquisas deles são a nossa fundamentação |
| Gateways unidirecionais (diodos de dados) | [Waterfall](https://waterfall-security.com/ot-insights-center/ot-cybersecurity-insights-center/firewalls-vs-data-diodes-vs-unidirectional-security-gateways), Owl | Hardware que deixa a informação sair e impede qualquer entrada | Feitos para usinas e infraestrutura crítica, com custo de projeto industrial | O princípio de "só envia" do firmware |

**O argumento de posicionamento (para o pitch e a banca):** os monitores avisam; o Guardião avisa e age. Na ICA de Estocolmo passaram 3h30 entre o ataque e alguém perceber. Um alerta às 2h da manhã ainda depende de uma pessoa acordar e chegar a tempo; o veto acontece em segundos.

**O governo dos EUA apoia a ideia central.** O alerta da CISA de 06/11 recomenda limites de setpoint em dispositivos que operam depois dos controladores, com alerta para desvios. É a descrição do relé do Guardião.

**O que aproveitar, na prática:**

1. **Duas versões do produto.** "Guardião Vigia": só sensores e alertas, instala sem mexer na refrigeração, como os concorrentes. "Guardião Veto": com o relé, instalado por um técnico. Isso responde à objeção de que mexer no equipamento é arriscado e vira degraus de preço no modelo de negócio.
2. **Modelo de negócio da Sensorweb.** Ela venceu uma licitação para monitorar as 21 unidades do hemocentro do Paraná (600 pontos, 384 hospitais atendidos) e vende serviço completo: instala, opera, mantém e treina. É um caminho real para hemocentros e UBS; para o comércio, assinatura mensal.
3. **Falha segura.** Se o Guardião ficar sem energia, o relé deve deixar o equipamento funcionar como antes (contato normalmente fechado). O Guardião nunca pode ser o motivo de uma câmara parar de gelar.
4. **Rede própria.** Os concorrentes evitam usar a internet da loja. No roadmap, o Guardião também pode enviar dados por celular ou LoRa, fora da rede que o atacante já conhece.

Todos esses materiais são de marketing das próprias empresas; as capacidades são as que elas declaram.

## Como o Guardião decide (contrato comum do grupo)

O firmware, o Python, a DPS e o site usam os mesmos estados, regras e nomes. Fechar isto até 11/11.

**Estados** (a rubrica de Edge pede no mínimo 3):

| Estado | Quando | Resposta no local | Envia ao FIWARE |
| --- | --- | --- | --- |
| NORMAL | Temperatura na faixa e nenhuma ordem fora da política | Relés em repouso; LED verde; LCD "Estado: Ideal" | Leitura a cada 5 s |
| ATENCAO | Porta aberta ou temperatura derivando dentro da tolerância | LED amarelo; bipe a cada 10 s; LCD "Estado: Atencao" | Leitura + motivo |
| BLOQUEIO | Setpoint fora da faixa, degelo longo ou fora do horário, aquecimento rápido com a porta fechada ou resfriamento rápido | Relés conforme a direção do ataque (abaixo); ordens do controlador ignoradas; **LED azul fixo**; buzzer até a temperatura voltar à faixa; LCD "Estado: Bloqueio" | Evento com o motivo, imediato |
| CRITICO | Mesmo com o bloqueio, a temperatura passou do limite do produto | LED vermelho fixo (azul enquanto houver bloqueio); buzzer; LCD "Estado: Critico" e a exposição | Evento crítico + exposição térmica |
| FALHA\_SENSOR | Leitura inválida ou fora de -40 a 80 °C | LED amarelo piscando; bipe a cada 10 s; LCD "Estado: Falha" | Evento de falha |

**Por que a luminosidade importa:** ela separa um funcionário abrindo a porta (ATENCAO, normal no dia a dia) de um aquecimento sem ninguém na câmara (BLOQUEIO). É o sensor da Vinheria com um papel novo.

**Políticas por tipo de produto** (valores de referência do protótipo; confirmar a fonte de cada um antes de citar):

| Produto | Faixa segura | Exemplo real |
| --- | --- | --- |
| Plasma congelado | -30 °C ou menos | EFS, França |
| Vacinas | +2 a +8 °C | Sala de vacina da UBS |
| Congelados | -18 °C ou menos | Freezer do supermercado |
| Carnes resfriadas | 0 a +4 °C | Câmara do açougue |

**Regras do bloqueio:**

- **Quatro gatilhos de bloqueio** (vale a primeira regra violada): (1) setpoint comandado fora da faixa do produto; (2) degelo por mais de 30 minutos ou fora dos horários permitidos (06:00 a 07:00 e 18:00 a 19:00, hora de Brasília por NTP); (3) aquecimento acima de 0,5 °C/min, medido em 60 s, com a porta fechada; (4) **resfriamento** acima de 0,5 °C/min com a temperatura abaixo do centro da faixa, com a porta aberta ou fechada.
- **Ataque de frio (novo, levantado pela equipe):** frio demais também estraga sangue e vacina. A resposta dos relés depende da direção:
  - **Calor:** o relé 1 (NF, em série com o aquecedor) corta o aquecedor e o relé 2 liga a ventoinha de emergência.
  - **Frio:** o aquecedor fica liberado e a ventoinha de emergência desligada. Acima de 8 °C vale a resposta de calor, abaixo de 2 °C a de frio, e dentro da faixa vale a direção do ataque.
  - Limite: o relé 1 só corta o aquecedor, nunca o liga. Num ataque de frio, quem liga o aquecedor é o controlador. Um terceiro relé fica como trabalho futuro.
- **Durante o bloqueio,** as ordens do controlador são ignoradas. A chave de ataque não consegue mais desligar a ventoinha de refrigeração do controlador, só ligá-la.
- **O bloqueio não acaba sozinho.** Depois de uma trava mínima (60 s na demonstração, 30 min no uso real), só termina quando alguém segura o botão do aparelho por 3 segundos. Se a ordem do controlador continuar inválida na hora de liberar, o bloqueio reabre.
- **Buzzer:** no bloqueio e no crítico, apita enquanto a temperatura estiver fora da faixa e para quando ela volta, com o bloqueio continuando. Nos 5 primeiros segundos de um bloqueio apita de qualquer jeito, porque um ataque de setpoint pode acontecer com a temperatura ainda boa.
- **Falha segura:** relés desenergizados no boot e sem energia; a geladeira volta a obedecer ao controlador.
- **Suavização:** média móvel de 5 leituras; confirmação em 2 ciclos para CRITICO e FALHA\_SENSOR.
- **As taxas de 0,5 °C/min são provisórias** e serão calibradas pela DPS.

Uma versão 2 dessa lógica (termostato de emergência, sem trava mínima) chegou a ser implementada, mas a equipe preferiu esta. A versão 2 ficou só numa branch local e não vale para os outros documentos.

## Maquete física: o ataque ao vivo

A ideia do professor Cabrini cabe numa caixa de plástico transparente: o "hacker" manda esquentar pelo notebook, um aquecedor liga dentro da caixa e, em segundos, o Guardião corta, apita e mostra "ATAQUE BLOQUEADO". Não é preciso uma geladeira de verdade.

**Montagem recomendada (barata, segura e rápida de ver):**

| Peça | Papel na cena |
| --- | --- |
| Caixa de plástico transparente com tampa (tipo pote organizador) + gelo em gel | A câmara fria, gelada de verdade |
| ESP32 nº 1 com o firmware da Vinheria adaptado | O **controlador comercial vulnerável**: aceita comandos pela internet, como os da Europa |
| Aquecedor de baixa tensão (resistência de potência ou aquecedor USB) sobre uma chapinha de alumínio | O "degelo forçado" que o ataque liga |
| Ventoinha de 5 V | A refrigeração que o Guardião mantém ligada |
| ESP32 nº 2 + sensor de temperatura à prova d'água (DS18B20) ou DHT22 + LDR na tampa | O **Guardião**, com sensores próprios |
| Módulo relé de 5 V, ligado em série com o aquecedor | O veto: o Guardião abre o circuito |
| LED RGB, buzzer, display OLED, botão | Respostas locais e liberação presencial |

**Placas (09/11):** o grupo tem um ESP32 e pode pegar outro emprestado na FIAP.

- **ESP32 do grupo = Guardião.** É a placa da maquete e a que publica no FIWARE durante a demonstração.
- **ESP32 da FIAP = controlador vulnerável**, com o firmware da Vinheria adaptado (aceita comandos pela internet). "O sistema que nós construímos no CP5 vira a vítima."
- **Plano B, se a FIAP não emprestar:** uma tomada inteligente Wi-Fi comum, controlada pelo aplicativo do celular, faz o papel do controlador vulnerável. Ela liga a fonte USB do aquecedor, que continua em baixa tensão. É até mais forte na narrativa: "um aparelho conectado que qualquer pessoa compra na loja".

**Não deixem para montar na hora.** Confirmem o empréstimo nesta semana, montem e testem a maquete até o checkpoint de 16/11 e gravem a demonstração funcionando. No dia, a gravação é o seguro contra fio solto e Wi-Fi instável.

**Roteiro da demonstração (2 minutos):**

1. Caixa gelada, Guardião verde, site mostrando a temperatura ao vivo.
2. **Sem o Guardião** (relé em modo "desligado"): alguém clica "Atacar: 50 °C" no notebook, o aquecedor liga e o gráfico sobe. Pausa. É o que aconteceu na Europa.
3. **Com o Guardião:** mesmo clique. Em cerca de 2 segundos o relé abre, o buzzer toca, o display mostra "ATAQUE BLOQUEADO" e o site registra o incidente.
4. Tentar "desbloquear pela internet": nada acontece, porque o Guardião não escuta.
5. Alguém aperta o botão físico por 3 segundos: liberado.

**Segurança da maquete (obrigatório):** só baixa tensão (5 a 12 V, nada ligado direto na tomada de 220 V); aquecedor preso na chapinha, sem encostar em plástico ou isopor; testar sempre com alguém olhando e desligar após a demonstração.

**Lista de compras (preços aproximados, conferir em loja de eletrônica):** módulo relé, DS18B20, aquecedor de baixa tensão, ventoinha de 5 V, caixa plástica e, se preciso, um segundo ESP32. Peçam ao Cinel a lista final com os pinos, depois de montar no Wokwi.

**Pontos extras para a banca:** a maquete gera dados reais de aquecimento. O Luis usa essa curva para calibrar o modelo da DPS, e o pitch pode dizer "medimos", e não "supomos".

## Lista de materiais e ligações

**O mapa de pinos e os componentes do Wokwi estão no README do repositório [C-Shield-Edge](https://github.com/NexusDev-Team/C-Shield-Edge)**, que é a fonte de verdade. O circuito final usa LCD 16x2 I2C, uma chave "Controlador" (NORMAL ou ATAQUE) e não tem chave de degelo. A lista abaixo só vale se o grupo montar a maquete para o pitch; o vídeo de Edge não usa maquete.

**Maquete física.** O preço é uma estimativa aproximada; confiram antes de comprar.

| Item | Qtd | Especificação | Para quê | Preço aprox. |
| --- | --- | --- | --- | --- |
| ESP32 DevKit V1 | 2 | 30 pinos, com cabo USB | Guardião (do grupo) e controlador vulnerável (emprestado da FIAP) | R$ 40 a 60 cada, se precisar comprar |
| Sensor DHT22 (AM2302), em módulo | 1 | Mede de -40 a 80 °C | Temperatura e umidade dentro da caixa | R$ 25 a 40 |
| Módulo LDR | 1 | Com saída analógica (AO) | Porta aberta | R$ 5 a 10 |
| Módulo relé de 2 canais, 5 V | 1 | Com contatos NA e NF | Veto do Guardião | R$ 15 a 25 |
| Módulo relé de 1 canal, 5 V | 1 | Contato NA | O controlador vulnerável liga o aquecedor | R$ 10 a 15 |
| Display LCD 16x2 com módulo I2C | 1 | 16 colunas x 2 linhas | Mensagem "ATAQUE BLOQUEADO" | R$ 20 a 30 |
| LED RGB cátodo comum + resistores de 220 Ω | 1 + 3 | 5 mm | Estado | R$ 3 |
| Buzzer ativo 5 V | 1 |  | Alerta sonoro | R$ 3 a 6 |
| Botão táctil | 1 | 12 mm, de preferência | Liberação presencial | R$ 1 a 3 |
| Resistor de potência 22 Ω, 10 W | 1 | Cerâmico | O "aquecimento do ataque" (cerca de 6,5 W a 12 V) | R$ 3 a 6 |
| Fonte 12 V, 1 A ou mais | 1 | Com plug P4 e adaptador borne | Alimenta só o aquecedor | R$ 20 a 35 |
| Chapinha de alumínio ou dissipador pequeno | 1 |  | Base do resistor, para espalhar o calor | R$ 5 a 10 |
| Ventoinha 5 V, 40 ou 50 mm | 1 |  | "Refrigeração de emergência" | R$ 10 a 15 |
| Pote plástico transparente com tampa | 1 | 3 a 5 litros | A câmara fria | R$ 15 a 25 |
| Gelo em gel reutilizável | 2 |  | Deixa a caixa gelada de verdade | R$ 8 a 15 |
| Protoboard 830 pontos | 2 |  | Uma por ESP32 | R$ 15 a 20 cada |
| Jumpers macho-macho e macho-fêmea | 1 kit | 40 de cada | Ligações | R$ 15 a 20 |
| Power bank ou carregador USB | 2 | 5 V | Alimenta os ESP32 longe do notebook | Use o que tiverem |
| Papelão, fita dupla face, abraçadeiras, etiquetas |  |  | Cenário e organização dos fios | R$ 10 a 20 |

Comprando tudo menos o ESP32 do grupo, a estimativa fica entre R$ 230 e R$ 380; sem precisar comprar o segundo ESP32, cai para algo entre R$ 190 e R$ 320. Em São Paulo, a Rua Santa Ifigênia, no Centro, tem quase tudo em um dia; pela internet, a entrega pode não chegar antes de 16/11.

**Três cuidados técnicos:**

- **Não usem o DHT11 da Vinheria.** Ele só mede de 0 a 50 °C e não enxerga o frio da caixa com gelo. Tem que ser DHT22, que também é o do Wokwi. Na placa real, \`MODELO\_TERMICO\_DEMO\` deve valer 0.
- **Ligação do aquecedor:** fonte 12 V → relé do controlador (NA) → relé do Guardião (NF) → resistor → volta à fonte. O controlador fecha o circuito para atacar; o Guardião abre para vetar. Se o Guardião desligar, o NF continua fechado e o equipamento funciona como antes (falha segura). Muitos módulos de relé acionam com nível baixo (LOW); testem antes.
- **Fio do degelo:** liguem o pino do controlador que aciona o relé dele ao GPIO 18 do Guardião e liguem os GND das duas placas. É assim que o Guardião "vê" a ordem na maquete; no Wokwi, a chave deslizante faz esse papel.

**Segurança:** testem o resistor fora da caixa primeiro, sobre a chapinha e longe de plástico, e acompanhem quanto ele esquenta. Dentro da caixa, ele fica sobre a chapinha e a pelo menos 2 cm das paredes. Nunca deixem o aquecedor ligado sem alguém olhando, e nada é ligado direto na tomada de 220 V além das fontes prontas.

## Cinel — Edge Computing (o coração do projeto)

**Status em 11/11: tudo pronto, menos o vídeo.** Prazo da entrega: 11/11, à noite. Entrega oficial: link público do Wokwi + vídeo de até 7 min, só com o simulador, sem maquete.

- Repositório: [NexusDev-Team/C-Shield-Edge](https://github.com/NexusDev-Team/C-Shield-Edge)
- Simulação pública: [Wokwi](https://wokwi.com/projects/480328417992209409)
- Vídeo: ainda não gravado (o botão do README aguarda o link)

| Item | Onde | Situação |
| --- | --- | --- |
| Firmware (`cshield.ino`, `config.h`, `decisao.h`, `sensores.h`, `atuadores.h`, `painel.h`, `rede.h`, `simulacao.h`) | `edge/cshield/` | Pronto; roda no Wokwi |
| Circuito (`diagram.json`, `libraries.txt`) | `edge/cshield/` e projeto público | Pronto, layout validado pela equipe |
| Testes da lógica | `edge/test/test_decisao.cpp` | 135 verificações, 0 falhas |
| Provisionamento FIWARE | `edge/fiware/provisionar.sh` | Executado em 11/11: device sem comandos e 6 subscriptions do STH-Comet |
| Teste ponta a ponta | `docs/edge-testes-estados.md` | Aprovado em 11/11: o Orion registrou o bloqueio em cerca de 6 s |
| Roteiro do vídeo (6 min 50 s) | `docs/edge-roteiro-video.md` | Pronto |
| Contrato Edge e site | `docs/edge-contrato-web.md` | Pronto |
| README com a Ficha CitizenTech | `README.md` | Pronto |

**Como o circuito ficou** (o mapa de pinos completo está no README do repositório, que é a fonte de verdade):

- **Display LCD 16x2 I2C** no lugar do OLED, por ser mais fácil no físico. Linha 1: `Estado: Ideal`, `Atencao`, `Bloqueio`, `Critico` ou `Falha`; linha 2 alterna a temperatura com as mensagens (`Alt. de Setpoint`, `Aquec. rapido`, `Resfria rapido`, `Liberacao em 58s`, `Segure botao 3s`).
- **Chave "Controlador" de duas posições** no lugar do potenciômetro: NORMAL = setpoint 5 °C, ATAQUE = 45 °C.
- **Sem chave de degelo no Wokwi.** As regras de degelo estão no firmware e cobertas pelos testes, mas não aparecem na simulação.
- O LED verde da ventoinha do controlador é comandado pelo firmware no GPIO 16 (pino RX2 no Wokwi).

**Modelo térmico da demonstração (`simulacao.h`) — precisa ser dito no vídeo.** O DHT22 do Wokwi é um slider e não esfria nem esquenta sozinho. Durante um bloqueio, o firmware simula o efeito físico: a ventoinha de emergência baixa a temperatura que a decisão enxerga e o aquecedor liberado a sobe. Se alguém mexe no slider, volta a valer o slider. Numa placa real, `MODELO_TERMICO_DEMO` vale 0. Sem explicação, parece que o sensor está sendo falsificado.

**Nomes FIWARE canônicos** (todas as outras entregas devem usar exatamente estes):

- Device `cshield001`, entidade `urn:ngsi-ld:CShield:001`, tipo `CShield`; headers `fiware-service: smart` e `fiware-servicepath: /`; apikey `TEF`.
- Tópico único `/TEF/cshield001/attrs`, nenhum tópico de comando. Payload: `t|4.8|h|81|l|12|sp|5.0|dg|0|st|NORMAL|mt|-|bq|0|ex|0`.
- Atributos no Orion: `temperature`, `humidity`, `luminosity`, `setpoint`, `defrost`, `state`, `reason`, `blocks`, `exposure`.
- Motivos em `reason`: `-`, `PORTA_ABERTA`, `DERIVA`, `SETPOINT_INVALIDO`, `DEGELO_FORA_HORARIO`, `DEGELO_LONGO`, `AQUECIMENTO_RAPIDO`, `RESFRIAMENTO_RAPIDO`, `TEMP_FORA_TOLERANCIA`, `SENSOR_SEM_LEITURA`.
- Histórico no STH-Comet: `temperature`, `humidity`, `luminosity`, `state`, `blocks`, `exposure`.

**Terceira camada (dashboard):** é o site da GS, que fica no repositório `c-shield-web`, separado do Edge. A rota que lê o FIWARE se chama **`/simulador-real`** (antes `/ao-vivo`). O Orion libera CORS, mas um site em HTTPS não consegue chamar `http://<ip>:1026` direto; é preciso uma rota de servidor na Vercel, só de leitura. O contrato completo (atributos, exemplo de resposta e regras para o emulador) está em `docs/edge-contrato-web.md`.

**Pendências do Edge:**

- [ ] Gravar e publicar o vídeo até 11/11 à noite e colocar o link no README
- [ ] Dar `git push` nos commits locais (README novo, `.gitignore`, ajustes de docs) e conferir no GitHub
- [ ] Preencher a coluna "Resultado" de `docs/edge-testes-estados.md`
- [ ] Decidir se limpa o histórico do GitHub: `CLAUDE.md`, `PLANO-CSHIELD.md` e `docs/specs/` ainda aparecem em commits antigos (limpar exige reescrever o histórico)
- [ ] Calibrar as duas taxas de 0,5 °C/min com a DPS
- [ ] Trabalho futuro: terceiro relé para o C-Shield aquecer sozinho e versão em JavaScript da lógica para o emulador

## Isac e João — Front-end e Web Development

Um site em React com JavaScript puro, Vite, `react-router-dom` e Tailwind, entregue nas duas disciplinas. Decisão de 09/11: o centro do site é um emulador interativo do Guardião, no estilo do OrbitCore, que funciona 24h sem depender de placa ou servidor ligados. Os dados reais do FIWARE aparecem só durante a demonstração da maquete.

**Rotas:**

| Rota | Tela | O que a pessoa faz |
| --- | --- | --- |
| `/` | Início | Entende o problema em 10 segundos: o caso europeu, a frase do produto e a chamada para o emulador |
| `/emulador` | Seja o hacker | Roda a lógica do C-Shield no navegador, sem ESP32: a pessoa dispara ataques de calor e de frio e vê duas câmaras lado a lado, sem e com C-Shield, com o LCD, o LED e os relés animados e o relógio do ataque ("sem C-Shield: 3h30 até alguém perceber"). Tem o botão "Abrir simulador real" |
| `/simulador-real` | Dispositivo real | Lê o FIWARE pela rota de servidor da Vercel e mostra estado, temperatura, motivo e histórico do C-Shield rodando no Wokwi. Sem simulação ativa, mostra "dispositivo offline", a última leitura e um botão para o emulador |
| `/incidentes` | Incidentes | Lista de bloqueios; o responsável reconhece, anota a ação tomada, encerra ou exclui (o CRUD) |
| `/como-funciona` | Como funciona | Os quatro verbos, os estados e o link do Wokwi |
| `*` | 404 | Volta ao início |

O contrato com o Edge (atributos do Orion, exemplo de resposta e as regras que o emulador precisa reproduzir) está em `docs/edge-contrato-web.md`, no repositório do Edge. O emulador deve seguir as mesmas regras do firmware, inclusive o ataque de frio, a trava mínima e o LED azul no bloqueio.

**Cuidado de coerência que a banca vai notar:** o site **não pode alterar a política do Guardião**, senão o produto contradiz a própria promessa. A faixa segura aparece no site só para leitura, com a etiqueta "gravada no dispositivo". O CRUD fica nos incidentes e no cadastro de responsáveis.

**Três problemas técnicos para resolver cedo:**

1. **Site em `https` lendo FIWARE em `http`:** o navegador bloqueia. Solução: uma função na pasta `api/` da Vercel faz a ponte (a chamada sai do servidor, não do navegador) e ainda esconde o IP da EC2.
2. **API externa com CRUD:** MockAPI para `incidentes` e `responsaveis`. Os dados ao vivo vêm do FIWARE pela ponte.
3. **Rotas na Vercel:** sem o `vercel.json` de redirecionamento, atualizar a página dá 404 (a Vinheria já tem esse arquivo).

**Reaproveitamento da Vinheria:** a ideia e a arquitetura podem ser reaproveitadas (polling, gráfico, linha do tempo de alertas, cliente FIWARE). **Atenção à autoria:** a Vinheria foi feita pela equipe Smart Solutions, que tinha outros integrantes. Criem um repositório novo para a GS, escrevam o código do Guardião nele e citem a origem no `README.md` e no `AI.md`. Copiar o repositório inteiro pode ser lido como trabalho de outra equipe.

**Hooks (plano de 11/11):** `useCidadeSimulada()` (os 5 locais e o placar) · `useCShield(perfil)` (a máquina de estados de uma câmara) · `useIncidentes()` (o CRUD) · `useDispositivoReal()` (polling do FIWARE) · `useCapituloAtual()` · `usePrefereMenosMovimento()` · `useSegurar()` (botão de 3 s). A rubrica pede 2; com 7 sobra margem.

**Visual: "Sala de controle às 2h da manhã".** Fundo azul quase preto, texto branco-gelo, painéis translúcidos com brilho de LED. Texto nunca transparente. Azul fraco é a interface em repouso; azul forte quer dizer "o C-Shield assumiu", o mesmo significado do LED do aparelho. Verde, amarelo e vermelho só em indicadores de estado. O efeito de bateria fraca aparece só durante o ataque, no máximo 3 piscadas por segundo, e some com `prefers-reduced-motion`. Fontes: Chakra Petch nos títulos, IBM Plex Sans no texto, IBM Plex Mono nos números e VT323 no LCD 16x2. Botões `4T4QU3 D3 C4L0R` e `4T4QU3 D3 FR10`, com `aria-label` legível.

**Página inicial em 4 capítulos (rolagem):** 1. 02:00, tudo calmo, binário descendo devagar · 2. a invasão: o binário acelera e sobe, a geladeira abre soltando faíscas, os títulos falham · 3. o C-Shield: tudo para e volta ao azul firme · 4. a prova: "3h30 na Europa, segundos com o C-Shield" e o botão para o emulador. Feito com canvas, SVG e `IntersectionObserver`, sem biblioteca extra.

**Emulador:** mapa SVG de uma cidade com 5 locais. Duas UBS com vacinas (Vila Mariana já protegida, como grupo de controle, e Brasilândia), um hemocentro com plasma, uma farmácia com insulina e um mercado com congelados. Linhas vermelhas de ataque saem do atacante e se rompem no escudo azul; linhas azuis de dados vão de cada C-Shield só até a central (FIWARE), nunca entre locais. Há ataque por local, "Ataque em massa" (a central detecta o ataque coordenado) e "Ativar C-Shield" (vermelho → "Ataque bloqueado" → "Seguro", ou "Seguro · lote em análise" se já houve exposição). Um placar compara as duas UBS ao vivo. Abaixo ficam a câmara por dentro (LCD, LED, relés, gráfico, botão de 3 s) e o Wokwi embutido. Tempo acelerado: 1 s real = 1 min. Cada bloqueio cria um incidente na MockAPI.

**Prompt de execução:** `prompt-web-claude-code.md`, em 4 partes (contexto, detalhamento, tarefas T1–T22, revisão). A lógica do firmware vira JavaScript puro em `src/domain`, com testes no Vitest iguais aos do Edge. O acesso ao FIWARE passa por funções da Vercel só com GET, e um grep na revisão confirma que nenhum POST ou comando chega ao dispositivo.

**Ordem:** primeiro o que vale nota (CRUD, emulador, hooks, até 13/11), depois o dispositivo real e o deploy (14/11), depois a página inicial animada e a acessibilidade (15/11), e por fim README, AI.md e o ZIP (17/11). Isac fica na branch `feat/dados` e João na `feat/visual`, com PR ao fim de cada fase, para os dois aparecerem nos commits.

**Divisão sugerida:** Isac com dados e infraestrutura (ponte na Vercel, cliente FIWARE, hooks, CRUD, deploy); João com a interface (simulador lado a lado, páginas, responsividade, acessibilidade). Os dois com commits próprios; mínimo de 15 no total.

- [ ] 10/11: repositório novo, professores com acesso, MockAPI criada
- [ ] 13/11: simulador lado a lado e CRUD de incidentes funcionando
- [ ] 16/11: emulador completo; /simulador-real lendo o FIWARE pela rota de servidor; deploy no ar
- [ ] 17/11: `README.md` com a Ficha, `AI.md`, 15 commits conferidos

## Leo — Python e Luis — DPS

**Leo: "Central do Guardião"**, um programa de terminal com menu e arquivos JSON, só com o conteúdo da disciplina.

1. Cadastrar câmara fria (nome, bairro, tipo de produto; a faixa vem de um dicionário de políticas)
2. Listar câmaras com o último estado
3. Registrar leitura e classificar o estado
4. **Avaliar uma ordem recebida** (setpoint ou degelo): responde ACEITA ou BLOQUEADA e o motivo, com a mesma regra do firmware
5. Simular um ataque: série de leituras sem e com Guardião, lado a lado
6. Calcular a exposição térmica e o tempo até a perda (a fórmula do Luis)
7. Incidentes: registrar, listar, encerrar
8. Relatório resumo
9. Sair

Cobre os requisitos da rubrica: `match/case` no menu, `if/elif` na decisão, `try/except` na digitação e nos arquivos, funções com retorno (`avaliar_ordem(camara, ordem) -> tuple`), listas, tuplas, dicionários e JSON. Entrega em ZIP; confirmar com o professor se o arquivo de IA é `prompts.md` ou `prompt.md`.

**Alinhamento com o Edge (11/11):** use os nomes canônicos da seção do Edge (`state`, `reason`, `blocks`, `exposure`, `setpoint`, `defrost`) e os mesmos motivos (`SETPOINT_INVALIDO`, `AQUECIMENTO_RAPIDO`, `RESFRIAMENTO_RAPIDO` etc.). A regra de `avaliar_ordem` deve ser a do firmware, incluindo o ataque de frio e a trava mínima. O firmware não aceita comandos, então a central só registra e analisa; nunca envia ordens ao dispositivo.

**Luis: o modelo matemático do ataque.** Quando o freezer é mandado esquentar, a temperatura segue a lei de aquecimento de Newton. É um modelo clássico, fácil de explicar e que usa limites, derivadas e integrais de forma natural:

```latex
T(t) = T_a + (T_0 - T_a)\,e^{-kt}
```

- **Derivada** T'(t) = k(Ta − T): a velocidade de aquecimento. É o que o Guardião usa para perceber o ataque antes de o produto passar do limite.
- **Limite** quando t tende ao infinito: T tende a Ta, a temperatura que o atacante mandou (50 °C nos supermercados, 110 °C no banco de sangue).
- **Tempo até a perda:** isolando t na equação, o instante em que T chega ao limite do produto.
- **Integral** da temperatura acima do limite ao longo do tempo: a exposição térmica acumulada (em °C·min), que indica se o lote ainda pode ser usado.

**O resultado que vai para o pitch:** comparar dois cenários com os mesmos parâmetros. Sem Guardião, o ataque é descoberto horas depois: na ICA de Estocolmo foram 3h30 (das 2h às 5h30). Com Guardião, o veto acontece em segundos. A diferença na exposição térmica mostra quanto produto deixa de ser perdido.

**Calibração com dados reais:** medir a curva de aquecimento da maquete e ajustar o k. As constantes de uma câmara de verdade são hipóteses e devem ser declaradas como tal no relatório, com uma análise de como o resultado muda se cada uma variar.

**O que o Edge precisa da DPS (11/11):** calibrar as duas taxas provisórias do firmware, 0,5 °C/min de aquecimento e 0,5 °C/min de resfriamento. A derivada T'(t) do modelo de Newton mostra que taxa separa um ataque de uma porta aberta. O firmware já publica a exposição acumulada (`exposure`, em °C·min), que pode ser comparada com a integral do modelo. Atenção: o modelo térmico da demonstração no Wokwi (6 °C/min de resfriamento e 3 °C/min de aquecimento) é só ilustrativo e não deve ser usado como dado.

- [ ] Luis: confirmar se a entrega individual é aceita
- [ ] Luis: até 13/11, repassar ao Cinel e ao Leo a taxa de aquecimento que caracteriza um ataque

## Experiência, Pitch e ODS

**Pitch: apocalíptico, mas com os pés no chão.** A escalada emocional funciona se cada degrau for um fato. A professora Patricia acertou sobre a maquete; o clímax do vídeo é ela.

Roteiro proposto para 3 minutos (cobrindo as 9 etapas da rubrica):

1. **Abertura, silêncio:** "Dois de novembro, madrugada. Em Paris, um freezer de plasma recebe uma ordem: 110 graus. Ninguém entrou no prédio."
2. **A escala:** a mesma ordem em centenas de supermercados franceses; depois, em mais de 100 lojas de sete países numa única noite. Em Estocolmo, o ataque foi às 2h; alguém só percebeu às 5h30. O governo francês chamou de primeiro ciberataque de sabotagem em larga escala no seu território.
3. **O "e se" (o momento apocalíptico):** "E se fosse ao mesmo tempo, em todas as cidades conectadas? Sangue, vacinas, insulina, comida. O frio sustenta a vida moderna, e ele está aberto na internet." Cortar para o número: quase 13 mil sistemas expostos em 99 países.
4. **Trazer para São Paulo:** "Os mesmos equipamentos existem aqui" + a fala do dono do açougue entrevistado.
5. **A virada:** a solução não é mais internet; é um guardião que não escuta.
6. **Clímax ao vivo:** a maquete, primeiro sem e depois com o Guardião. "ATAQUE BLOQUEADO."
7. **Tecnologia em uma frase:** ESP32, FIWARE e o site.
8. **Ecossistema e negócio:** quem paga (seguradoras, hemocentros, redes de farmácia, prefeitura para UBS) e o preço de um Guardião contra o preço de um lote perdido.
9. **Fechamento:** os cinco integrantes. "Vê de longe. Só obedece de perto."

O "e se" precisa ser dito como hipótese, não como fato. Um especialista ouvido pela CNN critica alarmismo sem dados; o pitch vence se o medo vier dos números, e não dos adjetivos.

**Números do Edge para o pitch (medidos em 11/11):** a decisão acontece no próprio aparelho, em ciclos de 2 segundos, mesmo sem internet; no teste ponta a ponta, o FIWARE registrou o bloqueio em cerca de 6 segundos; na Europa, foram 3h30 até alguém perceber. 135 verificações automáticas da lógica, nenhuma falha. Frases: "Vê de longe. Só obedece de perto." e "Aqui não entra nada" (o firmware não tem nenhuma forma de receber comandos).

**Branding (2,5 pontos):** arquétipo sugerido: **Cuidador**, com traços de Herói (protege quem não está vendo o perigo). Missão, visão e valores saem disso. O nome do produto ainda está aberto (ver decisões).

**Software & Total Experience Design:** feito aqui depois que o resto estiver pronto. Atores do caso de uso: responsável pelo frio, controlador comercial, atacante, Guardião e sistema FIWARE. O rascunho dos requisitos sai em 16/11 para bater com o que foi construído.

**ODS:**

| ODS | Meta | Por quê | Recomendação |
| --- | --- | --- | --- |
| 3 Saúde e bem-estar | Acesso a vacinas e medicamentos | Sangue, plasma e vacinas dependem da cadeia de frio | Principal |
| 9 Indústria, inovação e infraestrutura | 9.1 Infraestrutura resiliente | Protege equipamento conectado que não recebe mais correções | Principal |
| 2 Fome zero | Acesso a alimentos | Comida estragada em massa é insegurança alimentar | Principal |
| 12 Consumo responsável | 12.3 Reduzir desperdício de alimentos | Na Europa, toneladas foram descartadas | Complementar (não está na lista da página da GS, mas é válida) |
| 11 Cidades sustentáveis | Serviços básicos resilientes | Ligação mais fraca: a meta 11.5 trata de desastres | Citar só se sobrar espaço |

## Objeções da banca

Cada integrante deve responder as três primeiras em até 20 segundos.

| Objeção | Resposta curta |
| --- | --- |
| "Se o Guardião está conectado, também pode ser hackeado." | Ele não escuta a rede: não existe comando para enviar a ele. A única forma de mudar algo é estar na frente do aparelho. Um atacante com acesso físico continua sendo um risco, e por isso o diodo de hardware está no roadmap. |
| "Por que não só atualizar o firmware e trocar a senha?" | Recomendamos isso também. Mas 80% dos Danfoss AK-SM 800A observados estavam desatualizados, os modelos antigos nunca mais terão correção e o açougue do bairro não tem equipe de TI. O Guardião é a camada que funciona quando as outras falham. |
| "Isso foi na Europa." | Os mesmos equipamentos existem aqui (Check Point). A França só reduziu a exposição depois do ataque; prevenir custa menos. |
| "Já existem monitores independentes, como JRI e Sensorweb." | Eles avisam; o Guardião avisa e age. Na ICA de Estocolmo passaram 3h30 entre o ataque e alguém perceber. E a versão Vigia do Guardião compete com eles no preço. |
| "E o degelo normal do equipamento?" | A janela e a duração máxima do degelo ficam gravadas no Guardião. Fora disso, ele bloqueia. |
| "E se o próprio Guardião falhar?" | O relé é normalmente fechado: sem energia, o equipamento funciona como antes. O Guardião nunca é o motivo de a câmara parar de gelar. |
| "Um falso alarme vai parar a operação." | O Guardião nunca impede a refrigeração, só veta o que aumenta o risco. A liberação presencial leva 3 segundos. |
| "O cenário apocalíptico é exagero." | É apresentado como hipótese. O que não é hipótese: um banco de sangue recebeu a ordem de 110 °C e só se salvou porque alguém estava olhando. |
| "Onde está o cidadão?" | Quem depende do frio sem ver o equipamento: o paciente da transfusão, a criança da vacina, a família no mercado do bairro. E o pequeno comerciante, que foi o mais atingido. |
| "Por que não usaram IA?" | Uma decisão de segurança precisa ser verificável. As regras são explícitas e testadas; o histórico no FIWARE permite aprender padrões numa próxima fase. |
| "No Wokwi, a temperatura muda sozinha. Vocês estão falsificando o sensor?" | O sensor do Wokwi é um controle deslizante e não reage à ventoinha. O modelo térmico da demonstração só simula o efeito físico durante o bloqueio, e é desligado numa placa real (MODELO\_TERMICO\_DEMO = 0). Dizer isso no vídeo antes que perguntem. |
| "E se o ataque for para esfriar demais?" | Também é detectado: resfriamento rápido ou setpoint baixo bloqueiam, e a resposta dos relés se inverte. Frio demais também estraga sangue e vacina. |

## Cronograma, riscos e decisões em aberto

Restam 10 dias com a virada de tema; a regra é integrar em 16/11 e enviar em 18/11.

**Atenção ao prazo do Edge:** a entrega de Edge vence em 11/11, à noite, antes das outras. O que falta é só o vídeo.

1. **10 e 11/11:** contrato comum fechado (estados, políticas, nomes de atributos); entrevista feita; Wokwi com os 5 estados; repositório e MockAPI criados; compras da maquete.
2. **12 e 13/11 — Checkpoint 1:** cada parte mostra o mínimo rodando. Guardião publicando no FIWARE; simulador lado a lado no site; menu do Python com JSON; modelo da DPS com a primeira curva.
3. **14 a 16/11 — Checkpoint 2:** maquete funcionando; aba ao vivo lendo o FIWARE; CRUD de incidentes; DPS calibrada com a maquete; vídeo de Edge gravado. Funcionalidades congeladas.
4. **17/11:** sessão aqui para Experiência e roteiro final do pitch; gravação com os cinco.
5. **18/11:** revisão cruzada e envio de tudo. 19/11 fica de folga.

**Riscos:**

| Risco | Plano B |
| --- | --- |
| Maquete não fica pronta | O pitch usa um vídeo animado do ataque (feito aqui com o Claude) e o emulador do site gravado em tela; a nota de Edge depende do Wokwi. O vídeo animado entra no pitch de qualquer forma, na abertura e no "e se" |
| EC2 ou maquete falhando no dia da apresentação | Mostrar a gravação da demonstração e o emulador, que não depende de nada ligado |
| Outros professores estranharem o tema | Confirmar nesta semana com o professor de Python e o de Experiência que o tema atende "problema real de São Paulo" |
| Prazo apertado pela troca de tema | Cortar escopo, nunca checkpoint |

**Decisões que são do grupo:**

- [x] **Nome do produto.** Decidido em 10/11: C-Shield (de Cyber Shield).
- [ ] **Confirmar o empréstimo do segundo ESP32 na FIAP até 12/11 (se não der, comprar a tomada inteligente do plano B).**
- [ ] **Quem liga e testa a EC2 antes da gravação e da apresentação**.
- [ ] **Quem faz a entrevista** e com quem (açougue, mercadinho, farmácia ou sala de vacina).
- [ ] **Repositório novo** para a GS, citando a Vinheria como origem.

**Fontes consultadas:** [Agora Litoral](https://agoralitoral.com.br/2026/11/07/hackers-invadem-freezers-de-bancos-de-sangue-na-franca-e-alteram-temperaturas/) · [Cybernews (EFS)](https://cybernews.com/security/frances-blood-storage-breach-temperatures-rise/) · [Cybernews (supermercados)](https://cybernews.com/security/europe-supermarket-refrigerator-hacks/) · [The Hacker News](https://thehackernews.com/2026/11/second-wave-of-cyberattacks-hits.html) · [Latin Times](https://www.latintimes.com/europe-supermarket-refrigeration-cyberattacks-600832) · [Forescout](https://www.forescout.com/blog/cold-chain-open-control-exposed-refrigeration-systems-reveal-global-risk/) · [Infosecurity Magazine](https://www.infosecurity-magazine.com/news/france-expose-danfoss-controllers/) · [CNN Brasil](https://www.cnnbrasil.com.br/economia/money/tecnologia/de-freezers-a-hospitais-ataques-hackers-na-europa-expoem-riscos-no-brasil/) · [Prefeitura de São Paulo](https://prefeitura.sp.gov.br/w/refeitura-leva-vacina%C3%A7%C3%A3o-contra-gripe-sarampo-e-febre-amarela-a-mais-de-400-locais-da-capital-a-partir-desta-segunda-8-)
