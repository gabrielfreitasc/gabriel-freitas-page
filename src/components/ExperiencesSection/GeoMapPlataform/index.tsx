'use client'

import dynamic from 'next/dynamic'
import projectData from '../../../mock/experiences.json'
import { MacOSWindowTemplate } from '../MacOSWindowTemplate'
import { ProjectDetailsCard } from '../ProjectDetailsCard'
import { CROP_COLORS } from './FarmMap'

const FarmMap = dynamic(
  () => import('./FarmMap').then(m => ({ default: m.FarmMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full rounded-xl bg-zinc-200 animate-pulse flex items-center justify-center text-zinc-500 text-sm">
        Carregando mapa...
      </div>
    ),
  }
)

const LEGEND_ITEMS: { label: string; crop: keyof typeof CROP_COLORS }[] = [
  { label: 'Milho', crop: 'milho' },
  { label: 'Soja', crop: 'soja' },
  { label: 'Algodão', crop: 'algodao' },
]

export function GeoMapPlataform() {
  const geoMapData = projectData.find(project => project.type === 'geoMap')
  if (!geoMapData) {
    return null
  }
  return (
    <MacOSWindowTemplate title="Mapeamento de talhões de fazendas via satélite">
      <div className="w-full h-[40rem] flex items-center gap-2 bg-white rounded-b-xl">
        <div className="w-[50%] ml-5 h-[95%] flex flex-col gap-3">
          <div className="flex-1 min-h-0 relative rounded-xl border border-zinc-200 overflow-hidden bg-zinc-100">
            <FarmMap />
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-zinc-200">
              <p className="text-xs font-semibold text-zinc-700 mb-2">
                Culturas
              </p>
              <div className="flex flex-col gap-1.5">
                {LEGEND_ITEMS.map(({ label, crop }) => (
                  <div key={crop} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{
                        backgroundColor: CROP_COLORS[crop].fill,
                        borderColor: CROP_COLORS[crop].stroke,
                      }}
                    />
                    <span className="text-xs text-zinc-800">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ProjectDetailsCard
          className="!w-[50%]"
          title={geoMapData.title}
          description={geoMapData.description}
          achievements={geoMapData.achievements}
          techStack={geoMapData.techStack}
        />
      </div>
    </MacOSWindowTemplate>
  )
}
