import type { IconType } from 'react-icons'
import { FaAws, FaChartArea, FaJava, FaNodeJs } from 'react-icons/fa'
import {
  SiClaude,
  SiFastapi,
  SiJavascript,
  SiMapbox,
  SiMongodb,
  SiN8N,
  SiNextdotjs,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiRabbitmq,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si'

const iconMap: Record<string, IconType> = {
  SiReact,
  SiTailwindcss,
  SiNextdotjs,
  FaJava,
  SiTypescript,
  SiJavascript,
  SiOpenai,
  SiMapbox,
  SiN8N,
  SiClaude,
  SiMongodb,
  FaNodeJs,
  FaAws,
  FaChartArea,
  SiFastapi,
  SiPython,
  SiPostgresql,
  SiRabbitmq,
}

export function getIcon(icon: string | IconType): IconType | null {
  if (typeof icon === 'string') {
    return iconMap[icon] ?? null
  }
  return icon
}
