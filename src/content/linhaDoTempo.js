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
 * linhaDoTempo.js — o caso em ordem, do primeiro sinal ao que o C-Shield muda. Fatos de
 * docs/specs/PLANO-GS.md ("O caso"). tipo: 'ataque' (vermelho), 'alerta' (amarelo) ou
 * 'cshield' (azul forte: o que o produto faz).
 */

export const LINHA_DO_TEMPO = [
  {
    data: '2026-08',
    quando: 'Agosto',
    titulo: 'Geladeiras de bases militares dos EUA falham',
    texto:
      'Pelo menos seis bases americanas perderam comida e o Pentágono investiga se foi ataque. Pesquisadores já avisavam de falhas nos controladores de refrigeração.',
    tipo: 'alerta',
  },
  {
    data: '2026-10-11',
    quando: '11 de outubro',
    titulo: 'Primeira onda, na França',
    texto:
      'Mais de cem lojas de uma rede e centenas de outras de duas redes tiveram a refrigeração mexida pelo software do fabricante. Toneladas de comida foram jogadas fora e o governo chamou de sabotagem em larga escala.',
    tipo: 'ataque',
  },
  {
    data: '2026-10-22',
    quando: '22 de outubro',
    titulo: 'Quase 13 mil controles abertos na internet',
    texto:
      'Uma empresa de segurança contou 12.976 sistemas de refrigeração expostos, em 99 países. Muitos estavam sem atualização.',
    tipo: 'alerta',
  },
  {
    data: '2026-11-01',
    quando: '1 e 2 de novembro',
    titulo: 'Segunda onda: mais de 100 lojas em vários países',
    texto:
      'Freezers chegaram a 50 °C. Em Estocolmo, o ataque foi às 2h e só foi percebido às 5h30: 3h30 até alguém perceber.',
    tipo: 'ataque',
  },
  {
    data: '2026-11-02',
    quando: '2 de novembro',
    titulo: 'Banco de sangue na França',
    texto:
      'O plasma, guardado a cerca de -30 °C, recebeu ordem para chegar a 110 °C. Só não houve perda porque um técnico de plantão ouviu o alarme.',
    tipo: 'ataque',
  },
  {
    data: '2026-11-06',
    quando: '6 de novembro',
    titulo: 'Os EUA mandam tirar a refrigeração da internet',
    texto:
      'Órgãos do governo americano pediram limites de temperatura nos aparelhos depois dos controladores e alerta para qualquer desvio.',
    tipo: 'alerta',
  },
  {
    data: '2026-11-11',
    quando: 'Com o C-Shield',
    titulo: 'Segundos, em vez de 3h30',
    texto:
      'O C-Shield mede a temperatura com sensores próprios, não confia na ordem que chegou e assume o controle ali mesmo. Só quem está presente consegue liberar.',
    tipo: 'cshield',
  },
]
