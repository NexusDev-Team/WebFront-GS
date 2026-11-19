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
 * noticias.js — as matérias que mostram POR QUE o C-Shield existe: os ataques cibernéticos aos
 * refrigeradores na Europa (outubro e novembro de 2026). O conteúdo é fixo; cada cartão leva à
 * matéria original. Os resumos são da equipe, em português simples; nenhum texto ou imagem dos
 * jornais é copiado.
 *
 * manchetePublicada: true  = o título foi conferido na página da fonte (copiado como saiu).
 * manchetePublicada: false = a página não abriu na conferência (bloqueio do site); o título é
 *   da equipe, descreve a matéria e a tela avisa "Título da equipe". Conferir quando der.
 *
 * Fatos e fontes: ver cada notícia e a página Problema.
 */

export const NOTICIAS = [
  {
    id: 'agencia-brasil-segunda-onda',
    veiculo: 'Agência Brasil',
    idioma: 'pt',
    data: '2026-11-02',
    manchete: 'Supermercados europeus são atingidos por novo ataque cibernético',
    manchetePublicada: true,
    resumo:
      'Freezers chegaram a 50 °C e estragaram alimentos em mais de cem lojas de vários países. O chefe do centro de cibersegurança da Suécia disse que o país tem muitos equipamentos expostos que precisam de atualização.',
    url: 'https://agenciabrasil.ebc.com.br/internacional/noticia/2026-11/supermercados-europeus-sao-atingidos-por-novo-ataque-cibernetico',
    destaque: true,
  },
  {
    id: 'g1-reuters-freezers-50c',
    veiculo: 'g1 / Reuters',
    idioma: 'pt',
    data: '2026-11-02',
    manchete: 'Hackers atacam supermercados europeus e elevam temperatura de freezers a 50 °C',
    manchetePublicada: false, // título montado a partir do endereço da matéria; a página bloqueou a conferência
    resumo:
      'Na loja da ICA em Estocolmo, o ataque aconteceu às 2h e só foi percebido às 5h30. A União Europeia chamou o caso de tentativa deliberada de desestabilizar o abastecimento de alimentos.',
    url: 'https://g1.globo.com/tecnologia/ciberseguranca/noticia/2026/11/02/hackers-atacam-supermercados-europeus-e-elevam-temperatura-de-freezers-a-50c.ghtml',
  },
  {
    id: 'guardian-quem-e-por-que',
    veiculo: 'The Guardian',
    idioma: 'en',
    data: '2026-11-02',
    manchete: 'Geladeiras de supermercados europeus invadidas: quem está por trás e por quê',
    manchetePublicada: false, // título da equipe; a página bloqueou a conferência
    resumo:
      'Um especialista da Sophos comparou o ataque a "usar luvas de borracha e mexer nos interruptores": foi simples, sem vírus sofisticado. A matéria também lembra que geladeiras de bases militares dos EUA falharam em agosto.',
    url: 'https://www.theguardian.com/technology/2026/nov/02/europe-supermarket-fridges-freezers-who-hacking-why',
  },
  {
    id: 'agora-litoral-banco-de-sangue',
    veiculo: 'Agora Litoral',
    idioma: 'pt',
    data: '2026-11-07',
    manchete: 'Hackers invadem freezers de bancos de sangue na França e alteram temperaturas',
    manchetePublicada: true,
    resumo:
      'O plasma guardado a cerca de -30 °C teve o controle ajustado para até 110 °C. O estrago só não aconteceu porque os alarmes tocaram e havia um técnico de plantão para agir a tempo.',
    url: 'https://agoralitoral.com.br/2026/11/07/hackers-invadem-freezers-de-bancos-de-sangue-na-franca-e-alteram-temperaturas/',
  },
  {
    id: 'cnn-brasil-riscos-no-brasil',
    veiculo: 'CNN Brasil',
    idioma: 'pt',
    data: '2026-11-05',
    manchete: 'De freezers a hospitais: ataques hackers na Europa expõem riscos no Brasil',
    manchetePublicada: true,
    resumo:
      'Especialistas dizem que os mesmos equipamentos atacados na Europa existem no Brasil, inclusive em hospitais, junto de refrigeradores de vacinas e remédios. Ainda não há registro aqui de um ataque igual: é hora de prevenir.',
    url: 'https://www.cnnbrasil.com.br/economia/money/tecnologia/de-freezers-a-hospitais-ataques-hackers-na-europa-expoem-riscos-no-brasil/',
  },
  {
    id: 'food-safety-eua',
    veiculo: 'Food Safety Magazine',
    idioma: 'en',
    data: '2026-11-06',
    manchete: 'Governo dos EUA manda o varejo tirar a refrigeração da internet',
    manchetePublicada: false, // título da equipe; a página bloqueou a conferência
    resumo:
      'CISA, FBI e outros órgãos americanos pediram que lojas desconectem os refrigeradores da internet e definam limites de temperatura nos aparelhos que ficam depois dos controladores, com alerta para qualquer desvio.',
    url: 'https://www.food-safety.com/articles/12001-us-government-tells-food-retailers-to-take-refrigerators-off-the-internet-due-to-malicious-cyberattacks',
  },
  {
    id: 'crodeon-quem-monitora',
    veiculo: 'Crodeon',
    idioma: 'en',
    data: '2026-11-05',
    manchete: 'Refrigeration systems hacked: who monitors the temperature when the controls are attacked?',
    manchetePublicada: true,
    resumo:
      'Monitores de temperatura independentes avisam quando algo esquenta, mas a própria empresa admite que o monitoramento não impede o ataque. É a lacuna que o C-Shield fecha: ele mede sozinho e também age.',
    url: 'https://www.crodeon.com/blogs/news/refrigeration-systems-hacked-who-monitors-the-temperature-when-the-controls-are-attacked',
  },
  {
    id: 'forescout-expostos',
    veiculo: 'Forescout',
    idioma: 'en',
    data: '2026-10-22',
    manchete: 'Cold Chain, Open Control: Exposed Refrigeration Systems Reveal Global Risk',
    manchetePublicada: true,
    resumo:
      'Semanas antes da segunda onda, a Forescout achou quase 13 mil controles de refrigeração abertos na internet, em 99 países. Oito em cada dez aparelhos Danfoss observados estavam desatualizados.',
    url: 'https://www.forescout.com/blog/cold-chain-open-control-exposed-refrigeration-systems-reveal-global-risk/',
  },
]

// A matéria de capa.
export function noticiaDestaque() {
  return NOTICIAS.find((n) => n.destaque)
}

// As demais, da mais recente para a mais antiga (a capa fica de fora).
export function noticiasOrdenadas() {
  return NOTICIAS.filter((n) => !n.destaque).sort((a, b) => b.data.localeCompare(a.data))
}
