/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Vision. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 */

import BotaoLed from './BotaoLed.jsx'

// Mensagem de erro que diz o que houve e como seguir. role="alert" anuncia na hora.
// Só o ícone e a borda usam a cor de ataque; o texto fica em gelo-50.
export default function ErroMensagem({ mensagem, aoTentarDeNovo }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-lg border border-ataque bg-noite-900 p-4"
    >
      <p className="text-gelo-50">
        <span aria-hidden="true" className="mr-2 font-mono text-ataque">
          [erro]
        </span>
        {mensagem}
      </p>
      {aoTentarDeNovo && (
        <BotaoLed variante="fantasma" onClick={aoTentarDeNovo}>
          Tentar de novo
        </BotaoLed>
      )}
    </div>
  )
}
