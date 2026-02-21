import { SealCheckIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { forwardRef } from 'react'
import backImage from '../../../../public/assets/back_card.png'
import logo from '../../../../public/assets/logo_freitas_black.png'
import ImageOrIcon from '../ImageOrIcon'

interface TweetCardProps {
  containerStyle?: string
  title: string
  description: string
  image: string
  emissionDate: string
  index: number
  disableFloat?: boolean
}

export const TweetCard = forwardRef<HTMLDivElement, TweetCardProps>(
  function TweetCard(
    {
      containerStyle,
      title,
      description,
      image,
      emissionDate,
      index,
      disableFloat,
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        style={{ animationDelay: `${index * 0.1}s` }}
        className={`group/card w-[320px] h-[500px] absolute top-1/2 left-1/2 -translate-x-1/2 ${!disableFloat ? 'floating-animation' : ''}`}
      >
        <div
          style={{ perspective: 1000 }}
          className="w-full h-full rounded-xl overflow-hidden"
        >
          <div
            style={{ transformStyle: 'preserve-3d' }}
            className="flip-card-inner relative w-full h-full rounded-xl transition-transform duration-500 ease-in-out group-hover/card:rotate-y-180"
          >
            {/* Frente: verso ornamentado (visão inicial) */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
              }}
              className="flip-card-front absolute inset-0 rounded-3xl overflow-hidden"
            >
              <Image
                src={backImage}
                alt={title}
                width={500}
                height={500}
                className="w-full h-full overflow-hidden rounded-xl object-cover"
              />
            </div>
            {/* Verso: conteúdo com Image (mostra no hover) */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className={`flip-card-back ${containerStyle} flex flex-col items-start gap-5 p-3 border border-gray-200 rounded-3xl transition-all absolute inset-0 overflow-hidden`}
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
                  <p className="text-xs !font-normal text-zinc-500">
                    @gabrielfreitasc
                  </p>
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
              <div className="text-xs h-full w-full text-zinc-700">
                {description}
              </div>
              <p className="text-xs text-zinc-500">
                Emitido em: {emissionDate}
              </p>
              <Image
                src={image}
                alt="Tweet Image"
                width={500}
                height={500}
                className="w-full h-full rounded-lg border border-gray-200 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
)
