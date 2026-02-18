import { SealCheckIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import logo from '../../../../public/assets/logo_freitas_black.png'
import ImageOrIcon from '../ImageOrIcon'

interface TweetCardProps {
  containerStyle?: string
  title: string
  description: string
  image: string
  emissionDate: string
}
export function TweetCard({
  containerStyle,
  title,
  description,
  image,
  emissionDate,
}: TweetCardProps) {
  return (
    <div
      style={{ boxShadow: '0 3px 10px 0px rgba(255, 255, 255, 0.8)' }}
      className={`${containerStyle} flex flex-col items-start gap-5 h-auto p-3 relative border border-gray-200 rounded-xl transition-all`}
    >
      <div className="w-full flex items-center gap-2">
        <ImageOrIcon
          image="https://avatars.githubusercontent.com/u/69334324?v=4"
          dimensions="w-10 h-10 rounded-full"
          photoStyle="!top-0"
        />
        <div className="flex flex-col items-start">
          <h3 className="text-sm text-black flex items-center gap-1">
            Gabriel Freitas
            <SealCheckIcon
              className="text-blue-500 hover:rotate-6 ease-in-out duration-300"
              weight="fill"
            />
          </h3>
          <p className="text-xs !font-normal text-zinc-500">@gabrielfreitasc</p>
        </div>
        <Image
          src={logo}
          alt="Logo"
          width={30}
          height={30}
          className="absolute right-2 top-2 opacity-80 hover:rotate-6 ease-in-out duration-300"
        />
      </div>
      <p className="text-sm text-black">{title}</p>
      <div className="text-xs h-full w-full text-zinc-700">{description}</div>
      <p className="text-xs text-zinc-500">Emitido em: {emissionDate}</p>
      <Image
        src={image}
        alt="Tweet Image"
        width={500}
        height={500}
        className="w-full h-full rounded-lg border border-gray-200 object-cover"
      />
    </div>
  )
}
