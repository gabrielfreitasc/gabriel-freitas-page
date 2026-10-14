'use client'

import { ExperienceCard } from '@/components/ExperienceCard'
import projectData from '../../../mock/experiences.json'
import { ProjectDetailsCard } from '../ProjectDetailsCard'
import { DashboardContent } from './DashboardContent'
import { GithubLogoIcon } from '@phosphor-icons/react'
import { useRef } from 'react'
import { BeeFlight } from '../BeeFlight'

export function FlyWireOnMinecraft() {
  const flyWireData = projectData.find(project => project.type === 'flyWire')
  const cardRef = useRef<HTMLDivElement>(null)

  if (!flyWireData) return null

  return (
    <div className="w-full h-auto flex flex-col-reverse sm:flex-row items-center sm:items-start gap-6 sm:gap-2">
      <ProjectDetailsCard
        className="!pt-0"
        title={flyWireData.title}
        description={flyWireData.description}
        achievements={flyWireData.achievements}
        techStack={flyWireData.techStack}
      />
      <ExperienceCard direction="right" cardRef={cardRef}>
        <div className="absolute inset-0 overflow-hidden bg-black">
                <a href="https://github.com/gabrielfreitasc/flywire-minecraft" target='__blank' className="flex items-center gap-2 z-50 absolute top-2 left-2 px-2 py-1 rounded-lg border border-zinc-700 bg-zinc-700/50 text-zinc-200 cursor-pointer"><GithubLogoIcon /> Open-source</a>

          <DashboardContent />
        </div>
      </ExperienceCard>
      <BeeFlight targetRef={cardRef} />
    </div>
  )
}
