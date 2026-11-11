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
 * useCidadeSimulada — o jogo da cidade no React. Guarda a cidade (src/domain/cidade.js), a faz
 * andar com um intervalo de 100 ms (1 s real = 1 min simulado) e expõe as ações do jogador.
 * Nenhuma regra mora aqui: tudo vem do domínio. O C-Shield de cada local vem das instalações
 * (instalar, remover e sincronizar), não de um botão que protege tudo. A cidade fica numa ref (fonte da verdade) e
 * também no estado, para a tela redesenhar.
 *
 * Cuidados: o passo de tempo é limitado a 250 ms reais (uma aba que dormiu não dá salto); o
 * relógio para com a aba oculta; o intervalo é limpo ao sair da página.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ataqueEmMassa as ataqueEmMassaNaCidade,
  atacar as atacarNaCidade,
  criarCidade,
  liberar as liberarNaCidade,
  passo,
  recomecar as recomecarCidade,
} from '../domain/cidade.js'
import {
  instalarCShield as instalarNaCidade,
  removerCShield as removerNaCidade,
  sincronizarProtecao,
} from '../domain/cidade-protecao.js'
import { eventosDoPasso, resultadoDaLiberacao } from '../domain/cidade-eventos.js'
import { placar as placarDaCidade } from '../domain/cidade-placar.js'

const INTERVALO_MS = 100
const DT_MAX_MS = 250
const SEM_EVENTOS = { id: 0, novosBloqueios: [], liberados: [] }

export function useCidadeSimulada() {
  const [cidade, setCidade] = useState(criarCidade)
  const [eventos, setEventos] = useState(SEM_EVENTOS)
  const cidadeRef = useRef(cidade)
  const ultimoRef = useRef(0)
  const contadorEventos = useRef(0)
  const idsInstaladosRef = useRef([]) // últimas instalações cadastradas (para o recomeçar)

  // Troca a cidade (ref + estado) por uma nova.
  const aplicar = useCallback((nova) => {
    cidadeRef.current = nova
    setCidade(nova)
  }, [])

  useEffect(() => {
    ultimoRef.current = Date.now()
    const id = setInterval(() => {
      const agora = Date.now()
      const dt = Math.min(agora - ultimoRef.current, DT_MAX_MS)
      ultimoRef.current = agora
      if (document.hidden) return
      const antes = cidadeRef.current
      const depois = passo(antes, dt)
      aplicar(depois)
      const ev = eventosDoPasso(antes, depois)
      if (ev.novosBloqueios.length > 0 || ev.liberados.length > 0) {
        contadorEventos.current += 1
        setEventos({ id: contadorEventos.current, ...ev })
      }
    }, INTERVALO_MS)
    return () => clearInterval(id)
  }, [aplicar])

  const atacar = useCallback(
    (localId, tipo) => aplicar(atacarNaCidade(cidadeRef.current, localId, tipo, Date.now())),
    [aplicar],
  )
  const ataqueEmMassa = useCallback(
    (tipo) => aplicar(ataqueEmMassaNaCidade(cidadeRef.current, tipo, Date.now())),
    [aplicar],
  )
  // Instalações cadastradas: o jogo só espelha o que a API diz quem tem o C-Shield.
  const instalar = useCallback((localId) => aplicar(instalarNaCidade(cidadeRef.current, localId)), [aplicar])
  const remover = useCallback((localId) => aplicar(removerNaCidade(cidadeRef.current, localId)), [aplicar])
  const sincronizar = useCallback(
    (ids) => {
      idsInstaladosRef.current = ids
      aplicar(sincronizarProtecao(cidadeRef.current, ids))
    },
    [aplicar],
  )
  // Devolve 'SEM_BLOQUEIO' | 'RECUSADA' | 'ACEITA' para a tela avisar no LCD.
  const liberar = useCallback(
    (localId) => {
      const nova = liberarNaCidade(cidadeRef.current, localId)
      aplicar(nova)
      return resultadoDaLiberacao(nova, localId)
    },
    [aplicar],
  )
  // Recomeçar zera o jogo, não o cadastro: as instalações continuam protegidas.
  const recomecar = useCallback(() => {
    aplicar(sincronizarProtecao(recomecarCidade(), idsInstaladosRef.current))
    setEventos(SEM_EVENTOS)
    contadorEventos.current = 0
  }, [aplicar])

  const placar = useMemo(() => placarDaCidade(cidade), [cidade])

  return { cidade, placar, eventos, atacar, ataqueEmMassa, instalar, remover, sincronizar, liberar, recomecar }
}
