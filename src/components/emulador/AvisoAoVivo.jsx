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

// Região aria-live: anuncia, só para leitor de tela, quando a situação de um local muda
// ("UBS Brasilândia: sob ataque."). Fica fora da vista (sr-only). Compara a situação de agora
// com a anterior durante a renderização, sem efeito colateral.
import { useState } from 'react'
import { LOCAIS } from '../../domain/cidade.js'
import { situacao } from '../../domain/cidade-placar.js'
import { anunciarMudancas } from './rotulos.js'

const NOMES = Object.fromEntries(LOCAIS.map((l) => [l.id, l.nome]))

function situacoesDaCidade(cidade) {
  return Object.fromEntries(LOCAIS.map((def) => [def.id, situacao(cidade.locais[def.id])]))
}

export default function AvisoAoVivo({ cidade }) {
  const atuais = situacoesDaCidade(cidade)
  const [anteriores, setAnteriores] = useState(atuais)
  const [mensagem, setMensagem] = useState('')

  if (JSON.stringify(anteriores) !== JSON.stringify(atuais)) {
    setAnteriores(atuais)
    setMensagem(anunciarMudancas(anteriores, atuais, NOMES))
  }

  return (
    <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {mensagem}
    </p>
  )
}
