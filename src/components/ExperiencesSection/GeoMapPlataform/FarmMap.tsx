'use client'

import { Flower, Grains, Plant } from '@phosphor-icons/react'
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import {
  MapContainer,
  Polygon,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'

// Fix Leaflet default icon in Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function DrawControl() {
  const map = useMap()
  useEffect(() => {
    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)
    const ControlDraw = (
      L.Control as unknown as { Draw: new (opts: object) => L.Control }
    ).Draw
    const drawControl = new ControlDraw({
      position: 'topright',
      draw: {
        polyline: true,
        circle: false,
        circlemarker: false,
        marker: false,
        rectangle: false,
        polygon: { shapeOptions: { color: '#22c55e' } },
      },
      edit: { featureGroup: drawnItems },
    })
    map.addControl(drawControl)
    return () => {
      map.removeControl(drawControl)
      map.removeLayer(drawnItems)
    }
  }, [map])
  return null
}

// Centro da fazenda (região do cerrado, comum para soja/milho/algodão)
const FARM_CENTER: [number, number] = [-18.241825699759968, -54.758066846475806]
const ZOOM = 12

export type CropType = 'milho' | 'soja' | 'algodao'

export const CROP_COLORS: Record<CropType, { fill: string; stroke: string }> = {
  milho: { fill: '#eab308', stroke: '#ca8a04' }, // Amarelo
  soja: { fill: '#22c55e', stroke: '#16a34a' }, // Verde
  algodao: { fill: '#fafafa', stroke: '#a3a3a3' }, // Branco
}

const CROP_ICONS = {
  milho: Grains,
  soja: Plant,
  algodao: Flower,
} as const

// 5 talhões com coordenadas simulando áreas de plantio
const TALHOES: { crop: CropType; positions: [number, number][] }[] = [
  {
    crop: 'milho',
    positions: [
      [-18.22714669141292, -54.74796416001956],
      [-18.261078104238262, -54.75097489439394],
      [-18.262475885502287, -54.75813375168413],
      [-18.241825699759968, -54.758066846475806],
    ],
  },
  {
    crop: 'soja',
    positions: [
      [-18.238205480701655, -54.776100235245],
      [-18.241941573461517, -54.75809832690029],
      [-18.262393674823304, -54.75823167436952],
      [-18.265306162090084, -54.7734332858606],
    ],
  },
  {
    crop: 'algodao',
    positions: [
      [-18.23789031539673, -54.77609149699457],
      [-18.22306879523866, -54.77412145703358],
      [-18.225530929234147, -54.76328623724812],
      [-18.217454999483454, -54.75737611736513],
      [-18.2321785169935, -54.75146599748216],
      [-18.241730901933586, -54.75799823524755],
    ],
  },
  {
    crop: 'milho',
    positions: [
      [-18.21932628477045, -54.75670215478864],
      [-18.209181707276475, -54.74607430763064],
      [-18.21410633327553, -54.741512109826246],
      [-18.221000575680446, -54.743896895042184],
      [-18.231981555000083, -54.75131046647435],
    ],
  },
  {
    crop: 'soja',
    positions: [
      [-18.26574936251627, -54.77363330846593],
      [-18.277525413002675, -54.77249985498617],
      [-18.273093659828294, -54.78323432617685],
      [-18.26752215239019, -54.783834389783785],
    ],
  },
]

export function FarmMap() {
  return (
    <MapContainer
      center={FARM_CENTER}
      zoom={ZOOM}
      className="h-full w-full rounded-xl z-0"
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      {TALHOES.map((talhao, i) => {
        const Icon = CROP_ICONS[talhao.crop]
        const label = `Talhão ${String(i + 1).padStart(2, '0')}`
        return (
          <Polygon
            key={i}
            positions={talhao.positions}
            pathOptions={{
              color: CROP_COLORS[talhao.crop].stroke,
              fillColor: CROP_COLORS[talhao.crop].fill,
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Tooltip
              permanent
              direction="center"
              className="talhao-tooltip !bg-white/95 !border !border-zinc-200 !shadow-md !rounded-lg !px-2 !py-1.5 !text-xs"
            >
              <div className="flex items-center gap-2 font-medium text-zinc-800">
                <Icon size={16} weight="fill" className="flex-shrink-0" />
                <span>{label}</span>
              </div>
            </Tooltip>
          </Polygon>
        )
      })}
    </MapContainer>
  )
}
