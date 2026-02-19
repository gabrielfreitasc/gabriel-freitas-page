import type { IconType } from 'react-icons'
import { getIcon } from '../iconMap'

interface Achievement {
  title: string
  description: string
}

interface TechStack {
  name: string
  icon: string | IconType
}

interface ProjectDetailsCardProps {
  title: string
  description: string
  achievements: Achievement[]
  techStack: TechStack[]
  className?: string
}

export function ProjectDetailsCard({
  title,
  description,
  achievements,
  techStack,
  className = '',
}: ProjectDetailsCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-[60%] h-full p-8 flex flex-col gap-6 rounded-l-2xl border border-gray-700/50 shadow-2xl ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-1 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full"></div>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {title}
          </h3>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed pl-4 border-l-2 border-gray-700">
          {description}
        </p>
      </div>

      <div className="space-y-4 mt-2">
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="group bg-gray-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 hover:border-gray-500/70 hover:bg-gray-800/60 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 group-hover:from-gray-500 group-hover:to-gray-600 transition-all">
                  <span className="text-white text-sm font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-gray-200 mb-1.5">
                    {achievement.title}
                  </h5>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer com Stacks */}
      <div className="">
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {techStack.map(({ name, icon }) => {
            const Icon = getIcon(icon)
            if (!Icon) return null
            return (
              <span
                key={name}
                className="px-3 py-1.5 bg-gradient-to-tr from-gray-800/60 to-gray-700/60 text-gray-300 text-xs font-medium rounded-lg border border-gray-700/50 hover:border-gray-500 hover:bg-gray-800/80 transition-all duration-200 flex items-center gap-2"
              >
                <Icon className="text-sm" />
                {name}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
