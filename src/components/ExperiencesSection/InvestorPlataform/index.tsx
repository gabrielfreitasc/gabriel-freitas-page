'use client'

import { ExperienceCard } from '@/components/ExperienceCard'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import {
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import projectData from '../../../mock/experiences.json'
import { ProjectDetailsCard } from '../ProjectDetailsCard'

const chartData = [
  { month: '2025-07', rentBioma: 1.32, cdi: 0.17 },
  { month: '2025-08', rentBioma: 1.25, cdi: 0.8 },
  { month: '2025-09', rentBioma: 1.35, cdi: 0.79 },
  { month: '2025-10', rentBioma: 1.45, cdi: 1.22 },
  { month: '2025-11', rentBioma: 1.26, cdi: 1.0 },
  { month: '2025-12', rentBioma: 1.28, cdi: 0.22 },
  { month: '2026-01', rentBioma: 1.35, cdi: 1.11 },
  { month: '2026-02', rentBioma: 1.15, cdi: 0.44 },
  { month: '2026-03', rentBioma: 1.44, cdi: 1.16 },
  { month: '2026-04', rentBioma: 1.29, cdi: 1.04 },
  { month: '2026-05', rentBioma: 1.25, cdi: 1.02 },
  { month: '2026-06', rentBioma: 1.0, cdi: 0.75 },
]

const activeDebentures = [
  {
    date: '18/05/2026',
    serie: '2ª Emissão',
    indexer: '100% DI + X%',
    type: 'Pnz',
    puCompra: 'R$ 5.000,00',
    qtdeCompra: 9,
    valorCompra: 'R$ 45.000,00',
    puAtual: 'R$ 7.279,94',
    qtdeAtual: 7,
    valorAtual: 'R$ 65.519,50',
  },
  {
    date: '11/03/2026',
    serie: '2ª Emissão',
    indexer: '100% DI + X%',
    type: 'Pnz',
    puCompra: 'R$ 5.000,00',
    qtdeCompra: 5,
    valorCompra: 'R$ 25.000,00',
    puAtual: 'R$ 7.385,94',
    qtdeAtual: 4,
    valorAtual: 'R$ 36.929,72',
  },
  {
    date: '03/01/2026',
    serie: '2ª Emissão',
    indexer: '100% DI + X%',
    type: 'Pnz',
    puCompra: 'R$ 5.000,00',
    qtdeCompra: 3,
    valorCompra: 'R$ 15.000,00',
    puAtual: 'R$ 6.735,24',
    qtdeAtual: 2,
    valorAtual: 'R$ 20.205,71',
  },
]

const redeemedDebentures = [
  {
    date: '12/06/2026',
    valorCompra: 'R$ 5.000,00',
    valorBruto: 'R$ 6.571,21',
    ir: '22,5%',
    iof: 'R$ 0,00',
    valorLiquido: 'R$ 6.296,25',
  },
  {
    date: '12/05/2026',
    valorCompra: 'R$ 5.000,00',
    valorBruto: 'R$ 5.292,93',
    ir: '22,5%',
    iof: 'R$ 0,00',
    valorLiquido: 'R$ 5.227,02',
  },
]

const portfolioHistory = [
  {
    month: '2026-04',
    saldoInicial: 'R$ 286.376,34',
    investimento: 'R$ 30.000,00',
    resgate: 'R$ 0,00',
    saldoFinal: 'R$ 320.565,49',
    rendimento: 'R$ 4.189,15',
  },
  {
    month: '2026-03',
    saldoInicial: 'R$ 320.565,49',
    investimento: 'R$ 0,00',
    resgate: 'R$ 5.539,18',
    saldoFinal: 'R$ 319.433,18',
    rendimento: 'R$ 4.406,87',
  },
  {
    month: '2026-02',
    saldoInicial: 'R$ 319.433,18',
    investimento: 'R$ 15.000,00',
    resgate: 'R$ 0,00',
    saldoFinal: 'R$ 339.167,99',
    rendimento: 'R$ 4.734,81',
  },
  {
    month: '2026-01',
    saldoInicial: 'R$ 339.167,99',
    investimento: 'R$ 0,00',
    resgate: 'R$ 11.226,71',
    saldoFinal: 'R$ 333.006,37',
    rendimento: 'R$ 5.065,09',
  },
]

const summaryCards = [
  { label: 'Investimento Inicial', value: 'R$ 345.000,00' },
  { label: 'Tempo do Investimento', value: '57 meses' },
  { label: 'Vr. Bruto Atual', value: 'R$ 430.701,09' },
  { label: 'Juros Ac.', value: 'R$ 85.701,09' },
  { label: 'CDI Período', value: '74,96%' },
  { label: '%CDI', value: '33,14%' },
  { label: 'Rent. Bruta', value: '24,84%' },
  { label: 'Rent. Anualizada', value: '4,78%' },
]

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  const bioma = payload.find(p => p.name === 'Rent. Bioma (%a.m)')?.value ?? 0
  const cdi = payload.find(p => p.name === 'CDI Período')?.value ?? 0
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-gray-600">
        <span className="font-bold">Rentabilidade Bioma:</span>{' '}
        {bioma.toFixed(2)}%
      </p>
      <p className="text-gray-600">
        <span className="font-bold">Rentabilidade CDI:</span> {cdi.toFixed(2)}%
      </p>
      <p className="text-teal-600 font-bold">
        Diferença: {(bioma - cdi).toFixed(4)}%
      </p>
    </div>
  )
}

function DashboardContent() {
  return (
    <div className="p-4 space-y-5 bg-gray-50 min-w-0">
      {/* Header */}
      <h2 className="text-center text-sm font-bold text-teal-700 leading-tight">
        Relatório - Jose da Silva
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-2">
        {summaryCards.map(card => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-lg p-2 text-center shadow-sm"
          >
            <p className="text-[9px] text-gray-500 leading-tight mb-1">
              {card.label}
            </p>
            <p className="text-[11px] font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Footnotes */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-[8px] text-gray-600 space-y-0.5">
        <p>
          1. VALORES BRUTOS, SUJEITOS À TABELA REGRESSIVA DE IMPOSTO DE RENDA NO
          MOMENTO DO RESGATE
        </p>
        <p>
          2. <span className="font-bold">Rentabilidade bruta:</span> retorno no
          período total dos investimentos
        </p>
        <p>
          3. <span className="font-bold">Rentabilidade Anualizada:</span>{' '}
          cálculo equivalente ao período de um ano em relação ao prazo médio
          transcorrido dos investimentos
        </p>
      </div>

      {/* Line chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <p className="text-[9px] font-semibold text-gray-700 mb-2">
          Rentabilidade ao mês comparada ao CDI (últimos 12 meses)
        </p>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart
            data={chartData}
            margin={{ top: 12, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 7, fill: '#6b7280' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => `${(v as number).toFixed(2)}%`}
              tick={{ fontSize: 7, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ fontSize: '8px', paddingTop: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="cdi"
              name="CDI Período"
              stroke="#f59e0b"
              strokeWidth={1.5}
              dot={{ r: 3, fill: '#f59e0b' }}
              activeDot={{ r: 4 }}
            >
              <LabelList
                dataKey="cdi"
                position="top"
                formatter={(v: unknown) => `${Number(v).toFixed(2)}%`}
                style={{ fontSize: '6px', fill: '#f59e0b' }}
              />
            </Line>
            <Line
              type="monotone"
              dataKey="rentBioma"
              name="Rent. Bioma (%a.m)"
              stroke="#0d9488"
              strokeWidth={1.5}
              dot={{ r: 3, fill: '#0d9488' }}
              activeDot={{ r: 4 }}
            >
              <LabelList
                dataKey="rentBioma"
                position="top"
                formatter={(v: unknown) => `${Number(v).toFixed(2)}%`}
                style={{ fontSize: '6px', fill: '#0d9488' }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Active debentures table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <p className="text-[9px] font-semibold text-gray-700 p-2 border-b border-gray-100">
          Portfólio de Debêntures Ativas
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-gray-50">
                {[
                  'Data de Compra',
                  'Série',
                  'Indexador',
                  'Tipo',
                  'PU Compra',
                  'Qtde Compra',
                  'Valor de Compra',
                  'PU Atual',
                  'Qtde Atual',
                  'Valor Atual',
                ].map(h => (
                  <th
                    key={h}
                    className="px-1.5 py-1 text-center font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeDebentures.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-1.5 py-1 text-center text-gray-700 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="px-1.5 py-1 text-center text-gray-700">
                    {row.serie}
                  </td>
                  <td className="px-1.5 py-1 text-center text-gray-700 whitespace-nowrap">
                    {row.indexer}
                  </td>
                  <td className="px-1.5 py-1 text-center text-gray-700">
                    {row.type}
                  </td>
                  <td className="px-1.5 py-1 text-center text-gray-700 whitespace-nowrap">
                    {row.puCompra}
                  </td>
                  <td className="px-1.5 py-1 text-center text-gray-700">
                    {row.qtdeCompra}
                  </td>
                  <td className="px-1.5 py-1 text-center text-gray-700 whitespace-nowrap">
                    {row.valorCompra}
                  </td>
                  <td className="px-1.5 py-1 text-center text-gray-700 whitespace-nowrap">
                    {row.puAtual}
                  </td>
                  <td className="px-1.5 py-1 text-center text-gray-700">
                    {row.qtdeAtual}
                  </td>
                  <td className="px-1.5 py-1 text-center text-gray-700 whitespace-nowrap">
                    {row.valorAtual}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Redeemed debentures table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-2 border-b border-gray-100">
          <p className="text-[9px] font-semibold text-gray-700">
            Debêntures Resgatadas
          </p>
          <div className="flex items-center gap-1 text-[8px] text-gray-500">
            <button className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-gray-400">
              ‹
            </button>
            <span>1 - 10 de 25</span>
            <button className="w-4 h-4 rounded bg-teal-600 flex items-center justify-center text-white">
              ›
            </button>
          </div>
        </div>
        <table className="w-full text-[8px]">
          <thead>
            <tr className="bg-gray-50">
              {[
                'Data Resgate',
                'Valor Compra',
                'Valor Bruto Resgatado',
                'IR (%)',
                'IOF (R$)',
                'Valor Líquido',
              ].map(h => (
                <th
                  key={h}
                  className="px-2 py-1 text-center font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {redeemedDebentures.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.date}
                </td>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.valorCompra}
                </td>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.valorBruto}
                </td>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.ir}
                </td>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.iof}
                </td>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.valorLiquido}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Portfolio history table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <p className="text-[9px] font-semibold text-gray-700 p-2 border-b border-gray-100">
          Histórico da carteira nos últimos 12 meses
        </p>
        <table className="w-full text-[8px]">
          <thead>
            <tr className="bg-gray-50">
              {[
                'Mês',
                'Saldo Inicial (R$)',
                'Investimento (R$)',
                'Resgate (R$)',
                'Saldo Final Bruto (R$)',
                'Rend. Bruto Mensal (R$)',
              ].map(h => (
                <th
                  key={h}
                  className="px-2 py-1 text-center font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {portfolioHistory.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.month}
                </td>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.saldoInicial}
                </td>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.investimento}
                </td>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.resgate}
                </td>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.saldoFinal}
                </td>
                <td className="px-2 py-1 text-center text-gray-700">
                  {row.rendimento}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function InvestorPlataform() {
  const investorData = projectData.find(project => project.type === 'investor')
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    if (!container || !inner) return

    const distance = inner.scrollHeight - container.clientHeight
    if (distance <= 0) return

    tweenRef.current = gsap.to(inner, {
      y: -distance,
      duration: 18,
      ease: 'none',
      repeat: -1,
      yoyo: true,
      repeatDelay: 1,
    })

    const pause = () => tweenRef.current?.pause()
    const resume = () => tweenRef.current?.resume()
    container.addEventListener('mouseenter', pause)
    container.addEventListener('mouseleave', resume)

    return () => {
      tweenRef.current?.kill()
      container.removeEventListener('mouseenter', pause)
      container.removeEventListener('mouseleave', resume)
    }
  }, [])

  if (!investorData) return null

  return (
    <div className="w-full h-auto flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-2">
      <ProjectDetailsCard
        className="!pt-0"
        title={investorData.title}
        description={investorData.description}
        achievements={investorData.achievements}
        techStack={investorData.techStack}
      />
      <ExperienceCard direction="right">
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-hidden bg-gray-50"
        >
          <div ref={innerRef}>
            <DashboardContent />
          </div>
        </div>
      </ExperienceCard>
    </div>
  )
}
