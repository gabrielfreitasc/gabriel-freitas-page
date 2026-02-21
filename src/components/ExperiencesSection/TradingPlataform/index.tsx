import { ExperienceCard } from '@/components/ExperienceCard'
import projectData from '../../../mock/experiences.json'
import { ProjectDetailsCard } from '../ProjectDetailsCard'
import { WhatsAppChat } from './WhatsAppChat'

export function TradingPlataform() {
  const tradingData = projectData.find(project => project.type === 'trading')
  if (!tradingData) {
    return null
  }
  return (
    <div className="w-full h-auto flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-2">
      <ExperienceCard direction="left">
        <WhatsAppChat />
      </ExperienceCard>
      <ProjectDetailsCard
        className="!pt-0"
        title={tradingData.title}
        description={tradingData.description}
        achievements={tradingData.achievements}
        techStack={tradingData.techStack}
      />
    </div>
  )
}
