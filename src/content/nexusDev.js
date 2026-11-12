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
 * nexusDev.js — os textos da página da equipe: visão, cultura e "Sobre a GS".
 *
 * RASCUNHO: escrito a partir do plano do projeto (docs/specs/PLANO-GS.md) para a equipe revisar
 * e trocar pelas próprias palavras. Os fatos sobre a GS e o produto são os do plano; a visão e a
 * cultura são a nossa leitura do que o projeto defende e precisam da aprovação do grupo.
 */

export const VISAO =
  'Que nenhuma vacina, bolsa de sangue ou alimento estrague porque alguém, de longe, mexeu num botão. ' +
  'A proteção do frio não pode depender de ninguém acordar às 2 da manhã: ela precisa estar ali, medindo e decidindo, ' +
  'inclusive para quem não tem equipe de segurança, como o açougue do bairro e a sala de vacina da UBS.'

export const CULTURA = [
  {
    titulo: 'Vê de longe, só obedece de perto',
    texto:
      'É a frase do produto e o jeito como a gente pensa: olhar tudo de qualquer lugar, mas só aceitar ordem de quem está presente. O C-Shield só envia dados; a liberação é com a mão, no aparelho.',
  },
  {
    titulo: 'Simples para quem não é de tecnologia',
    texto:
      'Se a enfermeira ou o dono do mercado precisam de um manual, falhamos. Por isso o emulador é um jogo e os textos usam palavras do dia a dia.',
  },
  {
    titulo: 'Testar antes de afirmar',
    texto:
      'A lógica do C-Shield tem testes automáticos, conferidos contra o código do aparelho. Só dizemos que funciona depois de ver funcionando.',
  },
  {
    titulo: 'Transparência sobre o que sabemos',
    texto:
      'Nas notícias, avisamos quando o título é nosso porque a página da fonte não abriu. Preferimos mostrar o limite a esconder.',
  },
  {
    titulo: 'Para todo mundo usar',
    texto:
      'Contraste forte, teclado funcionando, respeito a quem pede menos movimento na tela. Segurança que só alguns conseguem usar não protege a cidade.',
  },
]

export const SOBRE_GS = [
  'A Global Solution 2026.2 da FIAP, com o tema CitizenTech, pede um projeto de tecnologia para o cidadão: um problema real de São Paulo e uma pessoa real que convive com ele.',
  'O nosso problema nasceu das notícias da Europa: invasores entraram pela internet nos controladores de refrigeração de supermercados e de um banco de sangue e mandaram tudo esquentar. O risco existe aqui também, onde estão as vacinas das UBS, o plasma dos hemocentros e a comida dos mercados de bairro.',
  'A resposta é o C-Shield: um aparelho ao lado da câmara fria que mede com sensores próprios, decide com uma política gravada nele e assume o controle quando uma ordem perigosa chega. O projeto é dividido em partes que se encaixam: o aparelho (Edge), a central e os cálculos, este site, a experiência do usuário e o pitch. Este site é a entrega de Front-end Design e Web Development.',
]
