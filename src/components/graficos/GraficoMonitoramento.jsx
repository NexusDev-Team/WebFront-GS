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

import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePrefereMenosMovimento } from '../../hooks/usePrefereMenosMovimento.js'
import { formatarGraus } from '../ui/formato.js'

// Gráfico de área da temperatura (recharts): linha ciano de 2 px, degradê que se preenche ao
// entrar, grade discreta e, se houver, a linha tracejada do limite da faixa segura. O
// preenchimento anima só na primeira vez (depois a série anda a cada 2 s e redesenhar toda vez
// cansaria); com "menos movimento" nunca anima. Quem usa leitor de tela encontra uma tabela com
// as mesmas leituras. Props:
//   temperaturas  as leituras, da mais antiga à mais nova;
//   titulo        o que o gráfico mostra (texto alternativo e legenda da tabela);
//   passoSeg      segundos entre uma leitura e a seguinte;
//   limite        { valor, rotulo } opcional;
//   altura        altura em px.
function quando(indice, total, passoSeg) {
  const segundos = (total - 1 - indice) * passoSeg
  return segundos === 0 ? 'agora' : `há ${segundos} s`
}

const TICK = { fill: 'var(--color-gelo-300)', fontSize: 11, fontFamily: 'var(--font-mono)' }

function Dica({ active: ativa, payload }) {
  if (!ativa || !payload?.length) return null
  const ponto = payload[0].payload
  return (
    <div className="rounded-lg border border-borda bg-noite-950 px-3 py-2 font-mono text-sm whitespace-nowrap text-gelo-50">
      <span className="tabular-nums">{formatarGraus(ponto.v)} °C</span>
      <span className="ml-2 text-gelo-300">{ponto.t}</span>
    </div>
  )
}

export default function GraficoMonitoramento({ temperaturas, titulo, passoSeg = 2, limite = null, altura = 260 }) {
  const reduzir = usePrefereMenosMovimento()
  const [primeiraVez, setPrimeiraVez] = useState(true)
  useEffect(() => {
    const id = setTimeout(() => setPrimeiraVez(false), 1400)
    return () => clearTimeout(id)
  }, [])

  const n = temperaturas.length
  const dados = useMemo(
    () => temperaturas.map((v, i) => ({ v, t: quando(i, n, passoSeg) })),
    [temperaturas, n, passoSeg],
  )
  const menor = Math.min(...temperaturas)
  const maior = Math.max(...temperaturas)
  const dominio = [
    Math.floor(Math.min(menor, limite ? limite.valor : menor) - 0.5),
    Math.ceil(Math.max(maior, limite ? limite.valor : maior) + 0.5),
  ]

  return (
    <figure className="w-full min-w-0">
      <div
        role="img"
        aria-label={`${titulo}. Última leitura ${formatarGraus(temperaturas[n - 1])} graus, entre ${formatarGraus(menor)} e ${formatarGraus(maior)}.`}
        style={{ height: altura }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dados} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="preenchimento-temperatura" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-ciano)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--color-ciano)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-borda)" strokeDasharray="3 6" />
            <XAxis dataKey="t" interval="preserveStartEnd" minTickGap={48} tickLine={false} axisLine={false} tick={TICK} />
            <YAxis
              domain={dominio}
              width={44}
              tickCount={4}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatarGraus}
              tick={TICK}
            />
            <Tooltip content={<Dica />} cursor={{ stroke: 'var(--color-gelo-300)', strokeOpacity: 0.4 }} />
            {limite ? (
              <ReferenceLine
                y={limite.valor}
                stroke="var(--color-gelo-300)"
                strokeOpacity={0.6}
                strokeDasharray="4 4"
                label={{ value: limite.rotulo, position: 'insideTopRight', ...TICK }}
              />
            ) : null}
            <Area
              type="monotone"
              dataKey="v"
              baseValue={dominio[0]}
              stroke="var(--color-ciano)"
              strokeWidth={2}
              fill="url(#preenchimento-temperatura)"
              dot={false}
              activeDot={{ r: 5, fill: 'var(--color-ciano)', stroke: 'var(--color-noite-900)', strokeWidth: 2 }}
              isAnimationActive={primeiraVez && !reduzir}
              animationDuration={1100}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="sr-only">
        <table>
          <caption>{titulo}: leituras simuladas, da mais antiga à mais nova</caption>
          <thead>
            <tr>
              <th scope="col">Quando</th>
              <th scope="col">Temperatura (°C)</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((ponto) => (
              <tr key={ponto.t}>
                <td>{ponto.t}</td>
                <td>{formatarGraus(ponto.v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
