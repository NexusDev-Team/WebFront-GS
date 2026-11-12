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
 * grafico.js — a matemática do gráfico de temperatura: transforma os pontos { tSimMin,
 * temperatura } em coordenadas de um SVG, com a faixa segura como uma região sombreada. Função
 * pura; quem desenha é components/camara/GraficoTemperatura.jsx. A escala sempre inclui a faixa
 * inteira e todos os pontos, com uma folga em cima e embaixo.
 */

const MARGEM = { esq: 46, dir: 10, topo: 10, base: 10 }

// pontos: [{ tSimMin, temperatura }]; faixa: { tMin, tMax }; geo: { largura, altura } do SVG.
// Devolve { caminho, area, faixa, yTMin, yTMax }:
//   caminho  'M x y L x y ...' (vazio com menos de 2 pontos);
//   area     o retângulo onde se desenha { x, y, largura, altura };
//   faixa    a região da faixa segura { y, altura };
//   yTMin, yTMax  a altura (y) dos dois limites da faixa.
export function escalarGrafico(pontos, { tMin, tMax }, { largura, altura }) {
  const area = {
    x: MARGEM.esq,
    y: MARGEM.topo,
    largura: largura - MARGEM.esq - MARGEM.dir,
    altura: altura - MARGEM.topo - MARGEM.base,
  }

  const temps = pontos.map((p) => p.temperatura)
  const menor = Math.min(tMin, ...temps)
  const maior = Math.max(tMax, ...temps)
  const folga = Math.max(1, (maior - menor) * 0.1)
  const baixo = menor - folga
  const alto = maior + folga

  const yDe = (t) => area.y + ((alto - t) / (alto - baixo)) * area.altura
  const yTMax = yDe(tMax)
  const yTMin = yDe(tMin)

  let caminho = ''
  if (pontos.length >= 2) {
    const inicio = pontos[0].tSimMin
    const duracao = pontos[pontos.length - 1].tSimMin - inicio || 1
    caminho = pontos
      .map((p, i) => {
        const x = area.x + ((p.tSimMin - inicio) / duracao) * area.largura
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yDe(p.temperatura).toFixed(1)}`
      })
      .join(' ')
  }

  return { caminho, area, faixa: { y: yTMax, altura: yTMin - yTMax }, yTMin, yTMax }
}

const f = (n) => n.toFixed(1)

// Curva suave que passa por todos os pontos (Catmull-Rom convertida em Bézier cúbica), para o
// gráfico de área. pontosXY: [{ x, y }] em coordenadas do SVG. Devolve o atributo `d` de um
// <path>: 'M x y C ...', uma curva por trecho. Com 2 pontos é uma linha reta; com menos de 2,
// texto vazio. Nos extremos, o ponto que falta é repetido, então a curva não "passa do ponto".
export function caminhoSuave(pontosXY) {
  if (pontosXY.length < 2) return ''
  const [primeiro, segundo] = pontosXY
  if (pontosXY.length === 2) return `M ${f(primeiro.x)} ${f(primeiro.y)} L ${f(segundo.x)} ${f(segundo.y)}`

  let d = `M ${f(primeiro.x)} ${f(primeiro.y)}`
  for (let i = 0; i < pontosXY.length - 1; i++) {
    const p0 = pontosXY[i - 1] ?? pontosXY[i]
    const p1 = pontosXY[i]
    const p2 = pontosXY[i + 1]
    const p3 = pontosXY[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2.x)} ${f(p2.y)}`
  }
  return d
}

// O mesmo caminho, fechado pela base do gráfico (baseY): serve ao preenchimento em degradê
// sob a curva. Vazio com menos de 2 pontos.
export function caminhoArea(pontosXY, baseY) {
  const curva = caminhoSuave(pontosXY)
  if (!curva) return ''
  const ultimo = pontosXY[pontosXY.length - 1]
  const primeiro = pontosXY[0]
  return `${curva} L ${f(ultimo.x)} ${f(baseY)} L ${f(primeiro.x)} ${f(baseY)} Z`
}

const MARGEM_SERIE = { esq: 44, dir: 12, topo: 26, base: 28 }
const PASSOS_REDONDOS = [0.5, 1, 2, 5, 10, 20, 50]

// O menor passo "redondo" (0,5 · 1 · 2 · 5 · 10...) que deixa a escala com no máximo 4 intervalos.
function passoRedondo(amplitude) {
  return PASSOS_REDONDOS.find((passo) => amplitude / passo <= 4) ?? 100
}

// Escala do gráfico de área da página inicial: leituras viram pontos do SVG, e o eixo vertical
// ganha marcas redondas que cobrem a série (e a linha de limite, se houver). Função pura; quem
// desenha é components/graficos/GraficoArea.jsx.
//   temperaturas  [número]  as leituras, da mais antiga à mais nova;
//   geo           { largura, altura } do SVG, em pixels;
//   opcoes.limite número opcional (uma linha de referência que precisa caber no gráfico).
// Devolve { pontos: [{x, y}], marcas: [{valor, y}], yDe(valor), area, baseY }.
export function escalarSerie(temperaturas, { largura, altura }, { limite = null } = {}) {
  const area = {
    x: MARGEM_SERIE.esq,
    y: MARGEM_SERIE.topo,
    largura: largura - MARGEM_SERIE.esq - MARGEM_SERIE.dir,
    altura: altura - MARGEM_SERIE.topo - MARGEM_SERIE.base,
  }

  const valores = limite === null ? temperaturas : [...temperaturas, limite]
  const menor = Math.min(...valores)
  const maior = Math.max(...valores)
  const passo = passoRedondo(maior - menor || 1)
  const baixo = Math.floor(menor / passo) * passo
  let alto = Math.ceil(maior / passo) * passo
  if (alto === baixo) alto = baixo + passo

  const yDe = (valor) => area.y + ((alto - valor) / (alto - baixo)) * area.altura

  const marcas = []
  for (let v = baixo; v <= alto + 1e-9; v += passo) {
    const valor = Number(v.toFixed(6))
    marcas.push({ valor, y: yDe(valor) })
  }

  const n = temperaturas.length
  const pontos = temperaturas.map((temperatura, i) => ({
    x: n === 1 ? area.x + area.largura / 2 : area.x + (i / (n - 1)) * area.largura,
    y: yDe(temperatura),
  }))

  return { pontos, marcas, yDe, area, baseY: area.y + area.altura }
}
