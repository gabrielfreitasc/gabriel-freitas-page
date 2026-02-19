'use client'

import { useGSAP } from '@gsap/react'
import {
  ClipboardText,
  DownloadSimple,
  FilePdf,
  MagnifyingGlass,
  MapPin,
  Package,
  Phone,
  Warning,
} from '@phosphor-icons/react'
import gsap from 'gsap'
import { useRef } from 'react'

const CHAT_BG_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-2 0-4 2-4 4v2c0 2 2 4 4 4s4-2 4-4V9c0-2-2-4-4-4zm0 38c-2 0-4 2-4 4v2c0 2 2 4 4 4s4-2 4-4v-2c0-2-2-4-4-4zm-20-20v4c0 2 2 4 4 4h2c2 0 4-2 4-4v-4c0-2-2-4-4-4h-2c-2 0-4 2-4 4zm38 0v4c0 2 2 4 4 4h2c2 0 4-2 4-4v-4c0-2-2-4-4-4h-2c-2 0-4 2-4 4z' fill='%2337415110' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`

function MessageBubble({
  children,
  time,
}: {
  children: React.ReactNode
  time: string
}) {
  return (
    <div className="flex flex-col items-start w-[85%]">
      <div className="bg-[#2a2f38] rounded-lg rounded-tl-none px-3 py-2 shadow-md">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-white">IA</span>
          </div>
          <span className="text-emerald-500 text-xs font-medium">
            IA Assistente
          </span>
        </div>
        {children}
        <span className="text-[10px] text-zinc-500 mt-1 block text-right">
          {time}
        </span>
      </div>
    </div>
  )
}

function MessagesBlock() {
  return (
    <div className="flex flex-col gap-3 w-full min-h-0 shrink-0">
      {/* PDF attachment */}
      <MessageBubble time="11:12">
        <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg">
          <div className="w-10 h-12 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
            <FilePdf size={20} weight="fill" className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate">
              OC - ABC1234 - CARLOS EDUARDO LIMA.pdf
            </p>
            <p className="text-zinc-500 text-xs">PDF • 98 KB</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
            <DownloadSimple size={14} className="text-zinc-400" />
          </div>
        </div>
      </MessageBubble>

      {/* Order approval */}
      <MessageBubble time="11:12">
        <div className="flex items-start gap-2">
          <Package size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white text-sm mb-2">
              Ordem de Carregamento Aprovada
            </p>
            <p className="text-zinc-300 text-xs mb-2">
              O agendamento foi realizado com sucesso no local de carregamento
              FAZ OLIMPO para a data de 22/03/2026.
            </p>
            <div className="space-y-1 text-xs">
              <p className="flex items-center gap-2 text-zinc-400">
                <Phone size={14} />
                Contato(s) para Embarque: (11) xxxxx-xxxx
              </p>
              <p className="flex items-center gap-2 text-zinc-400">
                <MapPin size={14} className="text-red-500" />
                Contato(s) para Descarga: Ana Silva (xx) xxxxx-xxxx
              </p>
              <span className="text-emerald-500">(xx) xxxxx-xxxx</span>
            </div>
          </div>
        </div>
      </MessageBubble>

      {/* Freight closing */}
      <MessageBubble time="11:13">
        <div className="flex items-start gap-2">
          <div>
            <p className="font-bold text-white text-sm mb-2">
              Fechamento de frete realizado via Plataforma
            </p>
            <p className="text-zinc-400 text-xs font-medium mb-1">
              Detalhes do Frete:
            </p>
            <ul className="text-xs text-zinc-300 space-y-0.5">
              <li>ID: SP2842</li>
              <li>Fechado por: João Pedro Santos</li>
              <li>Motorista: CARLOS EDUARDO LIMA</li>
              <li>Placa: CBA1234</li>
              <li>Veículo: Bitrem 9 eixos</li>
              <li>Produto: SOJA EM GRÃOS</li>
              <li>Origem: FAZ NODEJS</li>
              <li>Destino: ARM. REACT</li>
              <li>Frete Total: R$ 4.280,00</li>
            </ul>
          </div>
        </div>
      </MessageBubble>

      {/* Classification confirmation */}
      <MessageBubble time="19:08">
        <div className="flex items-start gap-2">
          <span className="text-amber-400 text-base">🔔</span>
          <div>
            <p className="font-bold text-white text-sm mb-2">
              Confirmação de Classificação
            </p>
            <p className="text-zinc-300 text-xs mb-2">
              Segue abaixo a classificação para os seguintes locais de
              carregamento e seus respectivos veículos:
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <p className="flex items-center gap-1.5 font-semibold text-white mb-1">
                  <MapPin size={14} className="text-red-500" /> ARM. REACT
                </p>
                <ul className="text-zinc-300 space-y-0.5 ml-4">
                  <li>
                    ABC1234 | João Pedro Santos |{' '}
                    <span className="text-emerald-500">+5511xxxxx-xxxx</span>
                  </li>
                  <li>
                    BCA1234 | Mariana Costa |{' '}
                    <span className="text-emerald-500">+5511xxxxx-xxxx</span>
                  </li>
                  <li>
                    AAA1234 | Roberto Almeida |{' '}
                    <span className="text-emerald-500">+5511xxxxx-xxxx</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="flex items-center gap-1.5 font-semibold text-white mb-1">
                  <MapPin size={14} className="text-red-500" /> FAZ NODEJS
                </p>
                <ul className="text-zinc-300 space-y-0.5 ml-4">
                  <li>
                    N8N1234 | Fernanda Souza |{' '}
                    <span className="text-emerald-500">+5511xxxxx-xxxx</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </MessageBubble>

      {/* Map messages */}
      <MessageBubble time="11:15">
        <div className="space-y-2">
          <div className="bg-zinc-800/60 rounded-lg overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
              <MapPin size={32} weight="fill" className="text-red-500" />
            </div>
            <p className="text-emerald-500 text-xs p-2">
              -20.200880, -45.025109 — FAZ NODEJS
            </p>
          </div>
        </div>
      </MessageBubble>

      <MessageBubble time="11:15">
        <div className="space-y-2">
          <div className="bg-zinc-800/60 rounded-lg overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
              <MapPin size={32} weight="fill" className="text-red-500" />
            </div>
            <p className="text-emerald-500 text-xs p-2">
              -20.200880, -45.025109 — ARM. REACT
            </p>
          </div>
        </div>
      </MessageBubble>

      {/* Incident */}
      <MessageBubble time="13:46">
        <div className="flex items-start gap-2">
          <Warning size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-400 text-sm mb-2">
              ▲ OCORRÊNCIA REGISTRADA
            </p>
            <ul className="text-xs text-zinc-300 space-y-1 mb-2">
              <li className="flex items-center gap-2">
                <ClipboardText size={14} /> Código do Frete: SP2842
              </li>
              <li className="flex items-center gap-2">
                <MagnifyingGlass size={14} /> Tipo: Redirecionamento de Frete
              </li>
              <li className="flex items-center gap-2">
                <Package size={14} /> Placa: CBA1234
              </li>
              <li className="flex items-center gap-2">
                <Package size={14} /> Produto: SOJA EM GRÃOS
              </li>
            </ul>
            <p className="text-zinc-400 text-xs mb-1 font-medium">
              Observações:
            </p>
            <p className="text-zinc-300 text-xs mb-2">
              A descarga em ARM. REACT foi remarcada. O veículo foi direcionado
              para armazém alternativo com o mesmo valor de frete.
            </p>
            <p className="text-zinc-400 text-xs">
              Por favor, acesse a plataforma para mais detalhes.
            </p>
          </div>
        </div>
      </MessageBubble>
    </div>
  )
}

export function WhatsAppChat() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return

      const blockHeight = track.scrollHeight / 2
      const duration = 28

      const tl = gsap.timeline({ repeat: -1 })
      tl.to(track, { y: -blockHeight, duration, ease: 'none' })
      tl.set(track, { y: 0 })
    },
    { dependencies: [], scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col overflow-hidden rounded-xl border border-zinc-700/50"
      style={{
        backgroundColor: '#E2E2E2',
        backgroundImage: CHAT_BG_PATTERN,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-zinc-700 border-b border-zinc-700/50 shrink-0">
        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-white">BT</span>
        </div>
        <div>
          <p className="text-emerald-500 font-medium text-sm">IA Assistente</p>
          <p className="text-zinc-500 text-xs">online</p>
        </div>
      </div>

      {/* Messages area - scroll container */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div
          ref={trackRef}
          className="flex flex-col gap-3 px-3 py-4 will-change-transform"
        >
          <MessagesBlock />
          <MessagesBlock />
        </div>
      </div>
    </div>
  )
}
