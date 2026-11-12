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
import { NOTICIAS } from './noticias.js'

export const BANNER = {
  rotulo: 'Cadeia do frio',
  titulo: 'Proteção inteligente para a cadeia de frio',
  texto:
    'Às 2h da manhã, o C-Shield age onde ninguém mais consegue. Vê de longe. Só obedece de perto.',
  acaoPrincipal: { rotulo: 'Simular um ataque', para: '/emulador' },
  acaoSecundaria: { rotulo: 'Como funciona', para: '/como-funciona' },
  // A imagem é fornecida pela equipe; se o arquivo não existir, o banner mostra um espaço reservado.
  imagem: {
    src: '/imagens/hero-camara.webp',
    alt: 'Câmara fria industrial coberta de gelo, à noite',
  },
}

export const PROBLEMA = {
  titulo: 'Invadiram o frio pela internet',
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

export const SOLUCAO = {
  titulo: 'Vê de longe. Só obedece de perto.',
  texto:
    'Um dispositivo independente, instalado junto da câmara, que não recebe nenhum comando pela rede. Ele só envia dados.',
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
      verbo: 'Alertar',
      icone: 'sino',
      texto:
        'Luz, som e mensagem no local avisam na hora. Para liberar, é preciso estar presente e segurar o botão por 3 segundos.',
    },
  ],
  link: { rotulo: 'Entender o funcionamento', para: '/como-funciona' },
}

// A notícia que serve de fonte a um fato do problema (veículo, data e link).
export function fonteDoFato(fato) {
  return NOTICIAS.find((noticia) => noticia.id === fato.fonteId)
}
