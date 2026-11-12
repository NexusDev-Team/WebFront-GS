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
 * useLeituraDemo — a leitura simulada que alimenta os gráficos da página inicial. Guarda uma
 * janela de n leituras e, a cada 2 s, tira a mais antiga e põe uma nova (a série continua de onde
 * parou, ver domain/serieDemo.js). Com "menos movimento" nas preferências da pessoa, a série fica
 * parada (W47). É uma demonstração com dados fictícios: nada aqui vem do aparelho.
 */
import { useEffect, useState } from 'react'
import { proximaLeitura, serieSensor } from '../domain/serieDemo.js'
import { usePrefereMenosMovimento } from './usePrefereMenosMovimento.js'

const PERIODO_MS = 2000

export function useLeituraDemo({ base, amplitude, semente, n = 24, periodoMs = PERIODO_MS }) {
  const reduzirMovimento = usePrefereMenosMovimento()
  const [serie, setSerie] = useState(() => serieSensor({ inicio: 0, n, base, amplitude, semente }))

  useEffect(() => {
    if (reduzirMovimento) return undefined
    const id = setInterval(() => {
      setSerie((atual) => [...atual.slice(1), proximaLeitura(atual, { base, amplitude, semente })])
    }, periodoMs)
    return () => clearInterval(id)
  }, [reduzirMovimento, base, amplitude, semente, periodoMs])

  return serie
}
