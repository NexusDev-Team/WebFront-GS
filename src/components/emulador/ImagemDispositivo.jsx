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

// Imagem de como o C-Shield seria fisicamente: a caixa com display, LED de estado e botão de
// liberação. É uma ilustração; o arquivo fica em src/assets e é empacotado pelo Vite.
import imagemDispositivo from '../../assets/dispositivo.png'

export default function ImagemDispositivo() {
  return (
    <figure className="flex flex-col items-center gap-3">
      <img
        src={imagemDispositivo}
        alt="O C-Shield: caixa escura com display mostrando o estado e a temperatura, LED verde de estado e leitor de cartão NFC para a liberação"
        loading="lazy"
        className="w-full max-w-md"
      />
      <figcaption className="max-w-prose text-center text-gelo-300">
        Como o aparelho seria, junto da câmara fria. No simulador, os LEDs e a chave extras
        representam o aquecedor, a ventoinha e a ordem do atacante.
      </figcaption>
    </figure>
  )
}
