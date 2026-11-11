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
