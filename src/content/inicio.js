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
 * inicio.js — o texto da página inicial, em três blocos: banner, problema e solução.
 * Os números do problema vêm de notícias que já estão em noticias.js; o fato guarda só o id da
 * notícia (fonteId), e fonteDoFato devolve o veículo e o link. Assim a fonte não se repete aqui.
 * Fatos e fontes: docs/specs/PLANO-GS.md, seção "O caso".
 */
import imagemHero from '../assets/imghero.jpg'
import { NOTICIAS } from './noticias.js'

export const BANNER = {
  rotulo: 'Tecnologia. Segurança. Controle.',
  tituloLinha1: 'Proteção inteligente',
  tituloLinha2: 'para a cadeia de frio',
  texto: 'O C-Shield atua onde ninguém mais consegue.',
  acaoPrincipal: { rotulo: 'Simular um ataque', para: '/emulador' },
  acaoSecundaria: { rotulo: 'Como funciona', para: '/como-funciona' },
  // Render do aparelho enviado pela equipe (fundo de tela cheia do hero).
  imagem: {
    src: imagemHero,
    alt: 'Aparelho C-Shield com tela azul e LED verde, com gelo nas bordas e envolto em névoa azul.',
  },
}

// A câmara simulada da demonstração (monitoramento e painel da página inicial): uma câmara de
// congelados perto de -19,2 °C, variando até 1,2 °C. São dados fictícios, gerados no navegador
// (domain/serieDemo.js); a página diz isso na tela.
export const DEMO = {
  perfil: 'CONGELADO',
  titulo: 'Câmara de congelados',
  base: -19.2,
  amplitude: 1.2,
  semente: 7,
  n: 24,
}

export const PROBLEMA = {
  titulo: 'Invadiram a refrigeração pela internet',
  texto:
    'Entre outubro e novembro de 2026, invasores entraram pela internet nos controladores de refrigeração de supermercados e de um banco de sangue na Europa e mandaram os equipamentos esquentar. Ninguém entrou nos prédios.',
  fatos: [
    {
      valor: '3h30',
      rotulo: 'entre o ataque e alguém perceber, na loja da ICA em Estocolmo: das 2h às 5h30.',
      fonteId: 'g1-reuters-freezers-50c',
    },
    {
      valor: '12.976',
      rotulo: 'serviços de controle de refrigeração abertos na internet, em 99 países.',
      fonteId: 'forescout-expostos',
    },
    {
      valor: '110 °C',
      rotulo: 'foi o ajuste enviado a freezers de plasma que ficam a cerca de −30 °C, na França.',
      fonteId: 'agora-litoral-banco-de-sangue',
    },
  ],
  link: { rotulo: 'Ver as notícias', para: '/noticias' },
}

// O painel do C-Shield: o que o aparelho mostra no local e envia à central. Tudo aqui é leitura. Os
// relés aparecem como indicadores (nome e estado em texto), e nada na página manda ordem ao
// aparelho (W43). Os números de alerta são da demonstração, e o texto diz isso.
export const PAINEL = {
  titulo: 'Painel do C-Shield',
  subtitulo: 'O que o aparelho mostra no local e envia à central. Nada aqui manda ordens a ele.',
  alertas: {
    titulo: 'Alertas',
    texto: 'Ordens perigosas barradas hoje: 0. Último bloqueio: nenhum.',
    aviso: 'Valores da demonstração.',
  },
  variacao: { titulo: 'Variação no período mostrado' },
  historico: {
    titulo: 'Histórico térmico',
    reles: [
      { nome: 'Ventoinha de emergência', estado: 'desligada', ligado: false },
      { nome: 'Aquecedor', estado: 'liberado', ligado: true },
    ],
    nota: 'Os relés só mudam pelo próprio C-Shield.',
  },
}

export const SOLUCAO = {
  titulo: 'C-Shield não espera ninguém. Ele age.',
  texto:
    'O C-Shield fica ao lado da câmara fria e vigia a temperatura por conta própria. Se alguém invadir o sistema e tentar esquentar a câmara, ele age na hora. Ele não recebe nenhum comando pela rede, só envia dados.',
  passos: [
    {
      numero: '01',
      verbo: 'Medir',
      icone: 'termometro',
      texto:
        'Sensores próprios medem a temperatura, a umidade e a porta da câmara. O atacante não controla nenhum deles.',
    },
    {
      numero: '02',
      verbo: 'Decidir',
      icone: 'escudo',
      texto:
        'Compara tudo com uma regra gravada no próprio aparelho. Ninguém muda essa regra pela internet.',
    },
    {
      numero: '03',
      verbo: 'Assumir',
      icone: 'rele',
      texto:
        'Diante de uma ordem perigosa, o C-Shield assume os relés, corrige a temperatura e ignora novas ordens do controlador.',
    },
    {
      numero: '04',
      verbo: 'Alertar e bloquear',
      icone: 'sino',
      texto:
        'Luz, som e mensagem no local avisam na hora, e o bloqueio fica ativo: as ordens do controlador são ignoradas. Para liberar, é preciso estar presente e segurar o botão por 3 segundos.',
    },
  ],
  link: { rotulo: 'Entender o funcionamento', para: '/como-funciona' },
}

// A faixa final da página: o contraste que resume o projeto, e o caminho para o emulador.
export const CHAMADA = {
  rotulo: 'Simulação de ataque',
  titulo: 'Agora é a sua vez de atacar',
  texto: 'Na Europa, foram 3h30 até alguém perceber. Com o C-Shield, segundos.',
  convite: 'Tente esquentar uma câmara e veja o que acontece.',
  acao: { rotulo: 'Simular um ataque', para: '/emulador' },
}

// A notícia que serve de fonte a um fato do problema (veículo, data e link).
export function fonteDoFato(fato) {
  return NOTICIAS.find((noticia) => noticia.id === fato.fonteId)
}

// Prévia da equipe na página inicial (a lista de integrantes vem de equipe.js).
export const NEXUS = {
  rotulo: 'Nexus Dev',
  titulo: 'Quem constrói o C-Shield',
  texto:
    'Cinco estudantes de Engenharia de Software da FIAP, na Global Solution 2026.2, criando uma proteção para o frio que não depende de ninguém acordar às 2 da manhã.',
  tecnologias: ['React', 'Vite', 'Tailwind CSS', 'ESP32', 'FIWARE'],
  link: { rotulo: 'Conhecer a equipe', para: '/nexus-dev' },
}
