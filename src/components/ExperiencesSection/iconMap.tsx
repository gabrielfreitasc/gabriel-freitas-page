import type { IconType } from 'react-icons'
import { FaJava, FaNodeJs } from 'react-icons/fa'
import {
  SiClaude,
  SiJavascript,
  SiMapbox,
  SiMongodb,
  SiN8N,
  SiNextdotjs,
  SiOpenai,
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
}

export function getIcon(icon: string | IconType): IconType | null {
  if (typeof icon === 'string') {
    return iconMap[icon] ?? null
  }
  return icon
}
