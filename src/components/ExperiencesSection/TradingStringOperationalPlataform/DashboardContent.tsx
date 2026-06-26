import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const kpiCards = [
  { label: 'Volume de Entrada', value: '98.432 ton', sub: null },
  { label: 'Volume de Saída', value: '97.891 ton', sub: null },
  { label: 'Valor Entrada', value: 'R$ 174.520.000', sub: null },
  { label: 'Valor Saída', value: 'R$ 198.340.000', sub: null },
  { label: 'Margem Bruta', value: 'R$ 23.820.000', sub: '(13,62%)' },
  { label: 'Margem Líquida', value: 'R$ 1.540.000', sub: '(0,88%)' },
]

const supplierData = [
  { name: 'CERRAMAX AGRO', value: 380 },
  { name: 'COOPGRÃO VALE', value: 210 },
  { name: 'TRÊS RIOS SA', value: 185 },
  { name: 'GRÃOTEX LTDA', value: 140 },
  { name: 'PALMITAL AGRO', value: 95 },
]

const clientData = [
  { name: 'ALIMENTAR SA', value: 540 },
  { name: 'VITALFEED', value: 310 },
  { name: 'GREXPORT SA', value: 180 },
  { name: 'PREMIX NUTRI.', value: 120 },
  { name: 'PAMPAFEED SA', value: 85 },
]

const carrierData = [
  { name: 'VELOZ CARGAS', value: 0.29 },
  { name: 'TRANSNORTE', value: 0.27 },
  { name: 'RAPIDFRET SA', value: 0.26 },
  { name: 'LOGICENTER', value: 0.25 },
  { name: 'VALEMAX LOG.', value: 0.23 },
]

const brokerData = [
  { broker: 'AGROPRIME ASSESS.', value: 'R$ 245.320,50' },
  { broker: 'CERRADO TRADERS', value: 'R$ 198.740,00' },
  { broker: 'GRAOPRIME NEG.', value: 'R$ 87.550,00' },
  { broker: 'TERRAMAX CORRET.', value: 'R$ 56.800,00' },
  { broker: 'FIELDBROKER AGRO', value: 'R$ 34.200,00' },
]

const marginData = [
  { date: '03/02', bruta: 420, liquida: 35 },
  { date: '11/02', bruta: 380, liquida: 28 },
  { date: '17/02', bruta: 510, liquida: 48 },
  { date: '23/02', bruta: 445, liquida: 32 },
  { date: '03/03', bruta: 620, liquida: 75 },
  { date: '07/03', bruta: 580, liquida: 62 },
  { date: '14/03', bruta: 750, liquida: 95 },
  { date: '21/03', bruta: 690, liquida: 82 },
  { date: '25/03', bruta: 820, liquida: 110 },
  { date: '31/03', bruta: 760, liquida: 88 },
  { date: '07/04', bruta: 680, liquida: 72 },
  { date: '14/04', bruta: -320, liquida: -380 },
  { date: '20/04', bruta: 450, liquida: 42 },
  { date: '26/04', bruta: 530, liquida: 55 },
  { date: '05/05', bruta: 720, liquida: 88 },
  { date: '12/05', bruta: 650, liquida: 70 },
  { date: '19/05', bruta: 780, liquida: 98 },
  { date: '28/05', bruta: 710, liquida: 82 },
  { date: '04/06', bruta: 590, liquida: 65 },
  { date: '18/06', bruta: 480, liquida: 50 },
  { date: '25/06', bruta: 420, liquida: 38 },
]

const costData = [
  { name: 'Frete (10,13%)', value: 10.13, fill: '#0d9488' },
  { name: 'Impostos (-0,30%)', value: 0.3, fill: '#5eead4' },
  { name: 'Comissões (0,40%)', value: 0.4, fill: '#99f6e4' },
  { name: 'Financeiro (1,26%)', value: 1.26, fill: '#ccfbf1' },
]

const taxRows = [
  {
    imposto: 'ICMS',
    credito: 'R$ 185.240,00',
    debito: 'R$ 510.320,00',
    saldo: '-R$ 325.080,00',
    neg: true,
    cV: 185240,
    dV: 510320,
  },
  {
    imposto: 'PIS',
    credito: 'R$ 72.150,00',
    debito: 'R$ 148.600,00',
    saldo: '-R$ 76.450,00',
    neg: true,
    cV: 72150,
    dV: 148600,
  },
  {
    imposto: 'COFINS',
    credito: 'R$ 332.800,00',
    debito: 'R$ 687.400,00',
    saldo: '-R$ 354.600,00',
    neg: true,
    cV: 332800,
    dV: 687400,
  },
  {
    imposto: 'PIS/COFINS FRETE',
    credito: 'R$ 0,00',
    debito: 'R$ 0,00',
    saldo: 'R$ 0,00',
    neg: false,
    cV: 0,
    dV: 0,
  },
  {
    imposto: 'FUNRURAL',
    credito: 'R$ 365.420,00',
    debito: 'R$ 0,00',
    saldo: 'R$ 365.420,00',
    neg: false,
    cV: 365420,
    dV: 0,
  },
  {
    imposto: 'SENAR',
    credito: 'R$ 172.380,00',
    debito: 'R$ 0,00',
    saldo: 'R$ 172.380,00',
    neg: false,
    cV: 172380,
    dV: 0,
  },
  {
    imposto: 'IPI',
    credito: 'R$ 0,00',
    debito: 'R$ 0,00',
    saldo: 'R$ 0,00',
    neg: false,
    cV: 0,
    dV: 0,
  },
  {
    imposto: 'RAT',
    credito: 'R$ 28.750,00',
    debito: 'R$ 0,00',
    saldo: 'R$ 28.750,00',
    neg: false,
    cV: 28750,
    dV: 0,
  },
]

const taxChartData = taxRows
  .filter(r => r.cV > 0 || r.dV > 0)
  .map(r => ({ name: r.imposto, credito: r.cV, debito: r.dV }))

const productData = [
  { name: 'SOJA GRÃO', value: 1150 },
  { name: 'MILHO', value: 280 },
  { name: 'SORGO', value: 190 },
  { name: 'FAR. SOJA', value: 95 },
  { name: 'C. SOJA', value: 75 },
  { name: 'ALGODÃO', value: 45 },
  { name: 'TRIGO', value: 30 },
  { name: 'M. PIPOCA', value: 15 },
]

const notasFiscais = [
  {
    estab: 1,
    produto: 'SOJA GRÃO',
    fornecedor: 'CERRAMAX AGRO',
    cliente: 'ALIMENTAR SA',
    qtdEnt: '38,04 t',
    qtdSai: '38,04 t',
    vlrEnt: 'R$ 26.180,00',
    vlrSai: 'R$ 42.020,00',
  },
  {
    estab: 1,
    produto: 'SOJA GRÃO',
    fornecedor: 'CERRAMAX AGRO',
    cliente: 'VITALFEED',
    qtdEnt: '34,82 t',
    qtdSai: '34,82 t',
    vlrEnt: 'R$ 23.960,00',
    vlrSai: 'R$ 38.480,00',
  },
  {
    estab: 2,
    produto: 'MILHO EM GRÃO',
    fornecedor: 'COOPGRÃO VALE',
    cliente: 'PREMIX NUTRI.',
    qtdEnt: '37,10 t',
    qtdSai: '37,10 t',
    vlrEnt: 'R$ 19.380,00',
    vlrSai: 'R$ 28.660,00',
  },
  {
    estab: 2,
    produto: 'SORGO EM GRÃO',
    fornecedor: 'TRÊS RIOS SA',
    cliente: 'GREXPORT SA',
    qtdEnt: '37,26 t',
    qtdSai: '37,26 t',
    vlrEnt: 'R$ 15.420,00',
    vlrSai: 'R$ 22.180,00',
  },
  {
    estab: 1,
    produto: 'FARELO SOJA',
    fornecedor: 'GRÃOTEX LTDA',
    cliente: 'PAMPAFEED SA',
    qtdEnt: '46,82 t',
    qtdSai: '46,82 t',
    vlrEnt: 'R$ 32.580,00',
    vlrSai: 'R$ 47.340,00',
  },
  {
    estab: 2,
    produto: 'CASCA SOJA',
    fornecedor: 'PALMITAL AGRO',
    cliente: 'ALIMENTAR SA',
    qtdEnt: '34,08 t',
    qtdSai: '34,08 t',
    vlrEnt: 'R$ 11.240,00',
    vlrSai: 'R$ 18.540,00',
  },
]

const TEAL = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4']

function Top10Chart({
  title,
  data,
  unit,
}: {
  title: string
  data: { name: string; value: number }[]
  unit?: string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-1.5 border-b border-gray-100">
        <p className="text-[8px] font-semibold text-gray-700">{title}</p>
        <span className="text-[7px] text-teal-600 font-semibold bg-teal-50 rounded px-1">
          Maior margem
        </span>
      </div>
      <div className="flex gap-0.5 px-1.5 py-1">
        {['Por margem', 'Por volume'].map(t => (
          <button
            key={t}
            className="text-[6px] px-1 py-0.5 rounded bg-gray-100 text-gray-500"
          >
            {t}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={85}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, left: -28, bottom: 20 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 5.5, fill: '#6b7280' }}
            tickLine={false}
            interval={0}
            angle={-35}
            textAnchor="end"
          />
          <YAxis
            tick={{ fontSize: 5.5, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(v: unknown) => [
              `${unit ?? ''}${Number(v).toFixed(unit ? 2 : 0)}k`,
              '',
            ]}
            contentStyle={{ fontSize: '7px' }}
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={TEAL[i] ?? '#ccfbf1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DashboardContent() {
  return (
    <div className="p-3 space-y-3 bg-gray-50 min-w-0">
      {/* 1. Header */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-teal-100 rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-teal-600 rounded-sm" />
          </div>
          <span className="text-[11px] font-bold text-teal-700">
            String da Operação
          </span>
        </div>
        <div className="flex gap-1">
          {['Resetar layout', 'Sincronizar relatório', 'Exportar Excel'].map(
            btn => (
              <button
                key={btn}
                className="text-[6px] px-1.5 py-0.5 rounded bg-teal-600 text-white font-medium"
              >
                {btn}
              </button>
            )
          )}
        </div>
      </div>

      {/* 2. KPI cards */}
      <div className="grid grid-cols-3 gap-2">
        {kpiCards.map(card => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
          >
            <p className="text-[7px] text-teal-600 uppercase font-semibold tracking-wide leading-tight mb-0.5">
              {card.label}
            </p>
            <p className="text-[11px] font-bold text-gray-800 leading-tight">
              {card.value}
            </p>
            {card.sub && (
              <p className="text-[8px] text-gray-500 mt-0.5">{card.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* 3. Top 10 bar charts */}
      <div className="grid grid-cols-3 gap-2">
        <Top10Chart title="Top 10 Fornecedores" data={supplierData} />
        <Top10Chart title="Top 10 Clientes" data={clientData} />
        <Top10Chart
          title="Top 10 Transportadoras"
          data={carrierData}
          unit="R$/t/km "
        />
      </div>

      {/* 4. Commissions + Margin evolution */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <p className="text-[8px] font-semibold text-gray-700 p-2 border-b border-gray-100">
            Comissões por Corretor
          </p>
          <table className="w-full text-[7px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-1 text-left font-semibold text-teal-700 uppercase tracking-wide border-b border-gray-200">
                  Corretor
                </th>
                <th className="px-2 py-1 text-right font-semibold text-teal-700 uppercase tracking-wide border-b border-gray-200">
                  Comissão
                </th>
              </tr>
            </thead>
            <tbody>
              {brokerData.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-2 py-1 text-gray-700">{row.broker}</td>
                  <td className="px-2 py-1 text-right text-gray-700">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
          <p className="text-[8px] font-semibold text-gray-700 mb-1">
            Evolução Margem Bruta x Margem Líquida
          </p>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart
              data={marginData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 5.5, fill: '#6b7280' }}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tickFormatter={(v: number) => `${v}k`}
                tick={{ fontSize: 5.5, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                domain={[-450, 1300]}
              />
              <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
              <Tooltip
                formatter={(v: unknown) => [`${Number(v)}k`, '']}
                contentStyle={{ fontSize: '7px' }}
              />
              <Legend
                iconType="circle"
                iconSize={5}
                wrapperStyle={{ fontSize: '7px' }}
              />
              <Line
                type="monotone"
                dataKey="bruta"
                name="Margem Bruta"
                stroke="#0d9488"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="liquida"
                name="Margem Líquida"
                stroke="#5eead4"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Cost donut + Brazil heat map */}
      <div className="col-span-2 w-full flex flex-col items-start gap-2">
        <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
          <p className="text-[8px] font-semibold text-gray-700 mb-1">
            Composição de Custos
            <span className="ml-1 text-gray-400 font-normal">
              Total: R$ 28.488.000 (11,49% s/ venda)
            </span>
          </p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie
                data={costData}
                cx="40%"
                cy="50%"
                innerRadius={28}
                outerRadius={48}
                dataKey="value"
                paddingAngle={2}
              >
                {costData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={5}
                wrapperStyle={{ fontSize: '6.5px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. Tax table + bar chart */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <p className="text-[8px] font-semibold text-gray-700 p-2 border-b border-gray-100">
          Impostos — Crédito x Débito
          <span className="ml-2 text-[7px] text-gray-400 font-normal">
            01/02/2026 — 25/06/2026
          </span>
        </p>
        <table className="w-full text-[7px]">
          <thead>
            <tr className="bg-gray-50">
              {['Imposto', 'Crédito', 'Débito', 'Saldo'].map((h, i) => (
                <th
                  key={h}
                  className={`px-2 py-1 font-semibold border-b border-gray-200 ${
                    i === 0
                      ? 'text-left text-gray-600'
                      : i === 1
                        ? 'text-right text-teal-600'
                        : i === 2
                          ? 'text-right text-red-600'
                          : 'text-right text-gray-600'
                  }`}
                >
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {taxRows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-0.5 text-gray-700">{row.imposto}</td>
                <td className="px-2 py-0.5 text-right text-teal-700">
                  {row.credito}
                </td>
                <td className="px-2 py-0.5 text-right text-red-600">
                  {row.debito}
                </td>
                <td
                  className={`px-2 py-0.5 text-right font-medium ${
                    row.neg ? 'text-red-600' : 'text-teal-700'
                  }`}
                >
                  {row.saldo}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="px-2 py-1 text-gray-800">Total</td>
              <td className="px-2 py-1 text-right text-teal-700">
                R$ 1.156.740,00
              </td>
              <td className="px-2 py-1 text-right text-red-600">
                R$ 1.346.320,00
              </td>
              <td className="px-2 py-1 text-right text-red-600">
                -R$ 189.580,00
              </td>
            </tr>
          </tbody>
        </table>
        <div className="p-2">
          <ResponsiveContainer width="100%" height={100}>
            <BarChart
              data={taxChartData}
              margin={{ top: 4, right: 4, left: -20, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 5.5, fill: '#6b7280' }}
                tickLine={false}
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 5.5, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={{ fontSize: '7px' }} />
              <Legend
                iconType="circle"
                iconSize={5}
                wrapperStyle={{ fontSize: '6.5px' }}
              />
              <Bar
                dataKey="credito"
                name="Crédito"
                fill="#0d9488"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="debito"
                name="Débito"
                fill="#dc2626"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7. Top 10 products */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[8px] font-semibold text-gray-700">
            Top 10 Produtos
          </p>
          <span className="text-[7px] text-teal-600 font-semibold bg-teal-50 rounded px-1">
            Maior margem
          </span>
        </div>
        <div className="flex gap-0.5 mb-1">
          {['Por margem', 'Por volume'].map(t => (
            <button
              key={t}
              className="text-[6px] px-1 py-0.5 rounded bg-gray-100 text-gray-500"
            >
              {t}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart
            data={productData}
            margin={{ top: 4, right: 4, left: -20, bottom: 20 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 5.5, fill: '#6b7280' }}
              tickLine={false}
              angle={-30}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 5.5, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v: unknown) => [`${Number(v)}k`, 'Receita Líquida']}
              contentStyle={{ fontSize: '7px' }}
            />
            <Bar dataKey="value" name="Receita Líquida" radius={[2, 2, 0, 0]}>
              {productData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === 0 ? '#0d9488' : i < 3 ? '#14b8a6' : '#5eead4'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 8. Notas fiscais */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-2 border-b border-gray-100">
          <p className="text-[8px] font-semibold text-gray-700">
            Notas fiscais
            <span className="ml-1 text-[7px] text-gray-400 font-normal">
              Totais: todas as páginas
            </span>
          </p>
          <div className="flex items-center gap-1 text-[7px] text-gray-500">
            <button className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-gray-400">
              ‹
            </button>
            <span className="font-medium bg-teal-600 text-white rounded px-1">
              1
            </span>
            <span>2 ... 29</span>
            <button className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-gray-400">
              ›
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[7px]">
            <thead>
              <tr className="bg-gray-50">
                {[
                  'ESTAB',
                  'PRODUTO',
                  'FORNECEDOR',
                  'CLIENTE',
                  'QTD ENT',
                  'QTD SAÍ',
                  'VLR ENT',
                  'VLR SAÍ',
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
              {notasFiscais.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-teal-50/30'}
                >
                  <td className="px-1.5 py-0.5 text-center text-gray-600">
                    {row.estab}
                  </td>
                  <td className="px-1.5 py-0.5 text-left text-gray-700 whitespace-nowrap">
                    {row.produto}
                  </td>
                  <td className="px-1.5 py-0.5 text-left text-gray-700 whitespace-nowrap">
                    {row.fornecedor}
                  </td>
                  <td className="px-1.5 py-0.5 text-left text-gray-700 whitespace-nowrap">
                    {row.cliente}
                  </td>
                  <td className="px-1.5 py-0.5 text-right text-gray-700 whitespace-nowrap">
                    {row.qtdEnt}
                  </td>
                  <td className="px-1.5 py-0.5 text-right text-gray-700 whitespace-nowrap">
                    {row.qtdSai}
                  </td>
                  <td className="px-1.5 py-0.5 text-right text-gray-700 whitespace-nowrap">
                    {row.vlrEnt}
                  </td>
                  <td className="px-1.5 py-0.5 text-right text-gray-700 whitespace-nowrap">
                    {row.vlrSai}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
