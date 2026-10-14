import type { IconType } from 'react-icons'
import { FaAws, FaChartArea, FaCube, FaJava, FaNodeJs } from 'react-icons/fa'
import {
  SiApacheparquet,
  SiClaude,
  SiDocker,
  SiDuckdb,
  SiFastapi,
  SiGradle,
  SiJavascript,
  SiMapbox,
  SiMongodb,
  SiN8N,
  SiNextdotjs,
  SiNumpy,
  SiOpenai,
  SiPandas,
  SiPostgresql,
  SiPytest,
  SiPython,
  SiRabbitmq,
  SiReact,
  SiRuff,
  SiScipy,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si'
import { TbPlugConnected } from 'react-icons/tb'

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
  SiNumpy,
  SiScipy,
  SiPandas,
  SiApacheparquet,
  SiDuckdb,
  SiGradle,
  SiDocker,
  SiPytest,
  SiRuff,
  FaCube,
  TbPlugConnected,
}

export function getIcon(icon: string | IconType): IconType | null {
  if (typeof icon === 'string') {
    return iconMap[icon] ?? null
  }
  return icon
}
