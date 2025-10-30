interface CardProps {
  children: React.ReactNode
  directionBorder: 'left' | 'right' | 'top' | 'bottom'
  containerStyle?: string
}
export function Card({ children, directionBorder, containerStyle }: CardProps) {
  return (
    <div
      className={`${containerStyle} relative border-br-0 border border-white rounded-lg transition-all`}
    >
      <span className="absolute -bottom-5 right-0 w-40 h-20 rounded-bl-lg border-l-0 border-b-0 border border-white bg-black" />
      {children}
    </div>
  )
}
