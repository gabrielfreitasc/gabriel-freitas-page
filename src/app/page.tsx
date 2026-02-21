'use client'

import dynamic from 'next/dynamic'

const HomeContent = dynamic(
  () => import('@/components/HomeContent').then(mod => mod.default),
  { ssr: false }
)

export default function Home() {
  return <HomeContent />
}
