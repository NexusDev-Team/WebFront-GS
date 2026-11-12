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
 * cidade-placar.js — leituras da cidade para a tela: situação de cada local (W17) e placar
 * comparando a UBS com C-Shield e a sem (W19). Só lê a cidade; quem a altera é o cidade.js.
 */

import { LOCAIS } from './cidade.js'

// Acima desta exposição (°C·min acima do máximo) o lote precisa de análise mesmo depois de
// o local voltar ao normal. Abaixo disso a perda é desprezível e o local fica só "seguro".
export const EXPOSICAO_MAX_SEGURA = 1

// Situação de um local, em uma palavra para a tela:
//   NORMAL                  nada aconteceu
//   SOB_ATAQUE              atacado e sem proteção: a temperatura sobe (ou cai) sem ninguém reagir
//   ATAQUE_BLOQUEADO        o C-Shield barrou o ataque e segura o bloqueio até alguém liberar
//   SEGURO                  liberado depois do ataque, sem estrago
//   SEGURO_LOTE_EM_ANALISE  liberado, mas o lote ficou exposto e precisa ser conferido
export function situacao(local) {
  const bloqueado = local.decisao?.bloqueado === true
  if (bloqueado) return 'ATAQUE_BLOQUEADO'
  if (local.ordem !== 'NORMAL') return 'SOB_ATAQUE'
  if (!local.houveAtaque) return 'NORMAL'
  return local.exposicao > EXPOSICAO_MAX_SEGURA ? 'SEGURO_LOTE_EM_ANALISE' : 'SEGURO'
}

// Há algum local sob ataque, sem C-Shield para barrar? É o que faz o título do emulador ficar
// vermelho: o vermelho vale só enquanto um ataque está de fato acontecendo.
export function algumSobAtaque(cidade) {
  return Object.values(cidade.locais).some((local) => situacao(local) === 'SOB_ATAQUE')
}

// Quanto tempo uma câmara sem C-Shield leva para alguém perceber o problema: 3 h 30 min, do caso
// real que inspirou o projeto (ICA). É um dado do caso, não uma simulação.
export const PERCEPCAO_SEM_CSHIELD_MIN = 210

// As duas UBS comparadas no placar (W19): a que nasce com C-Shield e a que nasce sem.
const IDS_PLACAR = ['ubs-vila-mariana', 'ubs-brasilandia']

// Placar: para cada UBS, temperatura, quanto tempo levou para reagir, exposição e situação.
// reacaoSimMs é null enquanto não houve ataque (ou o C-Shield ainda não reagiu). Com C-Shield é a
// reação medida na simulação (alguns segundos); sem ele, a constante do caso ICA.
export function placar(cidade) {
  return IDS_PLACAR.map((id) => {
    const def = LOCAIS.find((l) => l.id === id)
    const local = cidade.locais[id]
    let reacaoSimMs = null
    if (local.houveAtaque) {
      reacaoSimMs = local.protegido ? local.reacaoSimMs : PERCEPCAO_SEM_CSHIELD_MIN * 60000
    }
    return {
      id,
      nome: def.nome,
      bairro: def.bairro,
      protegido: local.protegido,
      temperatura: local.temperatura,
      reacaoSimMs,
      exposicao: local.exposicao,
      situacao: situacao(local),
    }
  })
}

// Texto do "tempo até reagir" de uma linha do placar. Com C-Shield: segundos simulados ("2 s").
// Sem C-Shield: o tempo do caso real, escrito como "3h30 até alguém perceber". null = ainda não
// houve ataque.
export function formatarReacao({ protegido, reacaoSimMs }) {
  if (reacaoSimMs === null || reacaoSimMs === undefined) return null
  if (protegido) return `${Math.round(reacaoSimMs / 1000)} s`
  const minutos = Math.round(reacaoSimMs / 60000)
  const horas = Math.floor(minutos / 60)
  return `${horas}h${String(minutos % 60).padStart(2, '0')} até alguém perceber`
}
