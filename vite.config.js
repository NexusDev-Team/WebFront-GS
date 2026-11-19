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

// Configuração do Vite: React, Tailwind v4 e Vitest (testes da lógica pura em tests/).
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    // Os pools padrão (forks/threads) quebram com 'reading config' neste Node 24; vmThreads roda tudo.
    pool: 'vmThreads',
    include: ['tests/**/*.test.{js,jsx}'],
  },
})
