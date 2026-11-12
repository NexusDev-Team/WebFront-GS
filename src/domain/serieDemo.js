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
 * serieDemo.js — a série simulada de um sensor, usada nos gráficos da página inicial (a
 * demonstração com dados fictícios no navegador). NÃO é física real nem leitura do aparelho: é
 * só um sinal verossímil — duas ondas lentas somadas a um ruído pequeno — para o gráfico ter vida.
 *
 * Cada leitura depende só do índice e da configuração (função pura), então a mesma configuração
 * sempre gera a mesma série e ela pode continuar de onde parou. O ruído vem de um hash do índice,
 * nunca de Math.random.
 *
 * Os pesos das três partes somam 1 (0,55 + 0,30 + 0,15), então a leitura nunca sai de
 * base ± amplitude.
 */

// Pseudo-aleatório determinístico em [-1, 1] para um índice e uma semente.
function ruido(semente, indice) {
  const x = Math.sin(semente * 12.9898 + indice * 78.233) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

// A leitura do índice dado, com uma casa decimal.
function leituraEm(indice, { base, amplitude, semente }) {
  const lenta = Math.sin((2 * Math.PI * indice) / 17)
  const media = Math.sin((2 * Math.PI * indice) / 6.3 + semente)
  const forma = 0.55 * lenta + 0.3 * media + 0.15 * ruido(semente, indice)
  return Math.round((base + amplitude * forma) * 10) / 10
}

// n leituras seguidas a partir do índice "inicio": [{ indice, temperatura }].
export function serieSensor({ inicio, n, base, amplitude, semente }) {
  return Array.from({ length: n }, (_, i) => {
    const indice = inicio + i
    return { indice, temperatura: leituraEm(indice, { base, amplitude, semente }) }
  })
}

// A leitura que viria logo depois da última da série.
export function proximaLeitura(serie, config) {
  const indice = serie[serie.length - 1].indice + 1
  return { indice, temperatura: leituraEm(indice, config) }
}

// Metade da diferença entre a maior e a menor leitura: o "±" do cartão de variação térmica.
export function amplitudeDaSerie(serie) {
  if (serie.length < 2) return 0
  const temps = serie.map((p) => p.temperatura)
  return (Math.max(...temps) - Math.min(...temps)) / 2
}
