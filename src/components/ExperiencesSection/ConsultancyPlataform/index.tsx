'use client'

import { ExperienceCard } from '@/components/ExperienceCard'
import {
  CaretLeftIcon,
  CaretRightIcon,
  PencilSimpleIcon,
} from '@phosphor-icons/react'
import moment from 'moment'
import { IoPerson } from 'react-icons/io5'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import projectData from '../../../mock/experiences.json'
import { ProjectDetailsCard } from '../ProjectDetailsCard'

const radarData = [
  { subject: 'Manejo Nutricional', value: 4, fullMark: 5 },
  { subject: 'Manejo Reprodutivo', value: 4, fullMark: 5 },
  { subject: 'Criação de Bezerras', value: 4, fullMark: 5 },
  { subject: 'Qualidade de Leite', value: 5, fullMark: 5 },
  { subject: 'Sanidade', value: 4, fullMark: 5 },
  { subject: 'Produção de Silagem', value: 4, fullMark: 5 },
  { subject: 'Podologia Bovina', value: 4, fullMark: 5 },
  { subject: 'Exames e Cirurgia', value: 5, fullMark: 5 },
]

export function ConsultancyPlataform() {
  const consultancyData = projectData.find(
    project => project.type === 'consultancy'
  )
  if (!consultancyData) {
    return null
  }
  return (
    <div className="w-full h-auto flex flex-col sm:flex-row items-center gap-6 sm:gap-2">
      <ExperienceCard direction="left">
        <div className="w-full h-full flex flex-col items-start p-4 sm:p-6 pt-2 bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200">
          <div className="w-full flex items-center gap-2 p-3 sm:p-6">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-zinc-500 shadow-xl">
              <IoPerson
                size={90}
                className="text-zinc-500 mt-1 hidden sm:block"
              />
              <IoPerson
                size={60}
                className="text-zinc-500 mt-1 block sm:hidden"
              />
            </div>
            <div className="text-center flex flex-col items-start">
              <h3 className="text-lg font-bold text-zinc-900">João da Silva</h3>
              <p className="text-sm text-zinc-700">Consultor Veterinário</p>
              <div className="mt-2 px-3 py-1 bg-zinc-500 text-white text-xs rounded-full inline-block">
                Especialista em Produção Leiteira
              </div>
            </div>
          </div>

          <div className="w-full p-3 h-44 sm:h-80 flex flex-col items-start">
            <p className="font-semibold text-black/70">Habilidades Técnicas</p>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 5]}
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                />
                <Radar
                  name="Competências"
                  dataKey="value"
                  stroke="#6b7280"
                  fill="#6b7280"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="hidden sm:block w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-3 mb-3">
            {/* Header do calendário */}
            <div className="flex items-center mb-4">
              <CaretLeftIcon
                size={16}
                weight="bold"
                className="text-gray-800 mr-2"
              />

              <h3 className="text-sm font-semibold text-gray-800">
                Visitas técnicas -{' '}
                <span className="text-gray-900 bg-gray-100 rounded-lg px-2 p-1">
                  {moment().format('MMMM, YYYY')}
                </span>
              </h3>

              <CaretRightIcon
                size={16}
                weight="bold"
                className="text-gray-800 ml-2"
              />

              <button className="px-3 py-1.5 bg-zinc-700 ml-auto text-white rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors flex items-center gap-1.5">
                <PencilSimpleIcon size={12} weight="bold" />
                Editar Agenda
              </button>
            </div>

            {/* Dias da semana */}
            {/* <div className="grid grid-cols-7 gap-1">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-700 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div> */}

            {/* Dias do mês */}
            <div className="grid grid-cols-7 sm:grid-cols-12 gap-1">
              {Array.from(
                { length: moment().daysInMonth() },
                (_, day) => day + 1
              ).map(day => (
                <button
                  key={day}
                  className={`mx-auto w-8 h-8 p-2 rounded-xl transition-colors flex items-center justify-center text-gray-800 font-medium text-xs ${![5, 27, 12, 9, 11, 17, 22].includes(day) ? 'bg-gray-100 hover:bg-gray-200' : 'bg-orange-100 hover:bg-orange-200 text-orange-800 font-semibold'}`}
                >
                  {String(day).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ExperienceCard>
      <ProjectDetailsCard
        title={consultancyData.title}
        description={consultancyData.description}
        achievements={consultancyData.achievements}
        techStack={consultancyData.techStack}
      />
    </div>
  )
}
