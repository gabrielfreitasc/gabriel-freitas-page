import Image from 'next/image'
import { IoPerson } from 'react-icons/io5'

interface ImageOrIconI extends React.HTMLAttributes<HTMLDivElement> {
  image?: string
  dimensions?: string
  photoStyle?: string
  iconSize?: number
  iconStyle?: string
}

export default function ImageOrIcon({
  image,
  dimensions,
  photoStyle,
  iconStyle,
  iconSize,
  ...props
}: ImageOrIconI) {
  return (
    <div
      className={`${dimensions} relative overflow-hidden rounded-base border-base flex-center-center min-w-[2rem]`}
      {...props}
    >
      {image ? (
        <Image
          src={image}
          width={100}
          height={100}
          alt="Avatar"
          className={`absolute w-full h-auto top-1 ${photoStyle} bg-cover`}
        />
      ) : (
        <IoPerson
          size={iconSize || 25}
          className={`absolute -bottom-[2px] ${iconStyle}`}
        />
      )}
    </div>
  )
}
