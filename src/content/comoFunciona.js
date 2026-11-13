/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Dev. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 */

/*
 * comoFunciona.js — o texto da página Como funciona (W44, W26c). Os estados e as cores de LED
 * seguem o contrato do Edge (docs/specs/PLANO-GS.md, "Como o Guardião decide"); a página nunca
 * diz que o C-Shield recebe comandos pela rede (W43).
 */
import { URL_REPOSITORIO_EDGE, URL_WOKWI } from './links.js'

export const CABECALHO = {
  rotulo: 'O dispositivo',
  titulo: 'Como o C-Shield',
  destaque: 'protege o frio',
  subtitulo: 'Vê de longe. Só obedece de perto.',
}

export const CICLO = {
  id: 'ciclo',
  titulo: 'O ciclo de proteção',
  subtitulo: 'A cada poucos segundos, o aparelho repete quatro passos, sem precisar de internet para decidir.',
  passos: [
    {
      numero: '01',
      verbo: 'Medir',
      icone: 'termometro',
      texto:
        'Sensores próprios medem a temperatura, a umidade e a luz da porta da câmara. O C-Shield também lê a ordem que o controlador comercial está mandando, o setpoint e o degelo. O atacante não controla nenhum desses sensores.',
    },
    {
      numero: '02',
      verbo: 'Decidir',
      icone: 'escudo',
      texto:
        'Compara tudo com a regra gravada no próprio aparelho: a faixa segura do produto, a janela de degelo permitida e a velocidade máxima de aquecimento ou resfriamento. Ninguém muda essa regra pela internet.',
    },
    {
      numero: '03',
      verbo: 'Assumir',
      icone: 'rele',
      texto:
        'Diante de uma ordem perigosa, o C-Shield assume os relés e ignora as novas ordens do controlador. Num ataque de calor, corta o aquecedor e liga a ventoinha de emergência. Num ataque de frio, libera o aquecedor.',
    },
    {
      numero: '04',
      verbo: 'Alertar e bloquear',
      icone: 'sino',
      texto:
        'Luz, buzzer e mensagem no display avisam no local, mesmo sem internet, e o bloqueio fica ativo: as ordens do controlador são ignoradas. O aparelho envia o evento ao FIWARE e ao site, só nessa direção. O bloqueio só termina presencialmente: o botão do aparelho, segurado por 3 segundos.',
    },
  ],
}

export const ARQUITETURA = {
  id: 'direcao',
  titulo: 'Uma direção só',
  subtitulo:
    'A ordem do atacante chega ao controlador comercial, mas o relé do C-Shield fica entre ele e a câmara. O C-Shield mede, decide e só envia dados.',
  descricao:
    'Diagrama: a internet leva a ordem do atacante ao controlador comercial, que aciona o relé e a câmara fria. O C-Shield mede a câmara com sensores próprios, controla o relé e envia dados ao FIWARE e ao site. Nada entra no C-Shield pela rede.',
  etapas: [
    'A internet leva a ordem do atacante ao controlador comercial.',
    'O controlador manda a ordem ao relé, que a repassa à câmara fria.',
    'O C-Shield mede a câmara com sensores próprios e controla o relé: veta o que aumenta o risco.',
    'O C-Shield só envia dados: para o FIWARE e, de lá, para o site.',
    'O C-Shield não escuta a rede: não existe comando para enviar a ele.',
    'Só o botão do aparelho, segurado por 3 segundos, libera o bloqueio.',
  ],
  limite: 'No protótipo, a direção única é garantida pelo software; um diodo de dados físico entra no roadmap.',
}

// A cor do LED de cada estado é a mesma que domain/cshield-saida.js (corLed) calcula.
export const ESTADOS_DA_PAGINA = [
  {
    id: 'NORMAL',
    nome: 'Normal',
    led: 'verde',
    quando: 'A temperatura está na faixa e nenhuma ordem foge da regra.',
  },
  {
    id: 'ATENCAO',
    nome: 'Atenção',
    led: 'amarelo',
    quando: 'A porta está aberta ou a temperatura deriva, ainda dentro da tolerância.',
  },
  {
    id: 'BLOQUEIO',
    nome: 'Bloqueio',
    led: 'azul',
    quando:
      'Setpoint fora da faixa, degelo longo ou fora do horário, aquecimento rápido com a porta fechada ou resfriamento rápido.',
  },
  {
    id: 'CRITICO',
    nome: 'Crítico',
    led: 'vermelho',
    quando: 'Mesmo com o bloqueio, a temperatura passou do limite do produto.',
  },
  {
    id: 'FALHA_SENSOR',
    nome: 'Falha de sensor',
    led: 'amarelo-pisca',
    quando: 'A leitura é inválida ou fica fora da faixa física do sensor, de -40 a 80 °C.',
  },
]

export const WOKWI = {
  id: 'wokwi',
  titulo: 'No simulador Wokwi',
  texto:
    'No Wokwi não há aquecedor, ventoinha nem controlador comercial, então os LEDs laranja, azul e verde e a chave "Controlador" representam o aquecedor, a ventoinha de emergência, a refrigeração e a ordem do atacante. No aparelho real esses LEDs e essa chave não existem.',
  links: [
    { rotulo: 'Abrir o Wokwi', url: URL_WOKWI },
    { rotulo: 'Repositório do Edge', url: URL_REPOSITORIO_EDGE },
  ],
}
