import projectData from '../../../mock/experiences.json'
import { MacOSWindowTemplate } from '../MacOSWindowTemplate'
import { ProjectDetailsCard } from '../ProjectDetailsCard'
import { WhatsAppChat } from './WhatsAppChat'

export function TradingPlataform() {
  const tradingData = projectData.find(project => project.type === 'trading')
  if (!tradingData) {
    return null
  }
  return (
    <MacOSWindowTemplate title="Plataforma de trading de commodities e insumos agrícolas com IA">
      <div className="w-full h-[50rem] flex items-center gap-2 bg-white rounded-b-xl">
        <div className="w-[50%] ml-5 h-[95%] min-h-0">
          <WhatsAppChat />
        </div>
        <ProjectDetailsCard
          title={tradingData.title}
          description={tradingData.description}
          achievements={tradingData.achievements}
          techStack={tradingData.techStack}
        />
      </div>
    </MacOSWindowTemplate>
  )
}
