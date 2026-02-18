import Image from 'next/image'
import { forwardRef, useRef } from 'react'
import stacks from '../../mock/stacks.json'
import ScrollFloat from '../ui/ScrollFloat'

export function StacksSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const divCenterRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>([])

  if (itemRefs.current.length !== stacks.length) {
    itemRefs.current = stacks.map(
      () => ({ current: null }) as React.RefObject<HTMLDivElement | null>
    )
  }

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start bg-neutral-950 py-20 px-8">
      <div className="w-full mb-16">
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="top bottom"
          scrollEnd="center top"
          stagger={0.03}
          textClassName="!text-7xl uppercase font-bold text-white"
        >
          Stacks
        </ScrollFloat>
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="top bottom"
          scrollEnd="center"
          stagger={0.03}
          textClassName="!text-sm"
          containerClassName="!mt-0"
        >
          Tecnologias e ferramentas que possuo experiência.
        </ScrollFloat>

        <div ref={containerRef} className="w-full gap-2 grid grid-cols-6">
          {stacks.map(item => (
            <svg
              width="167"
              height="169"
              viewBox="0 0 167 169"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              key={item.id}
              className="relative mt-2"
            >
              <path
                d="M1 166.041V3.69355V3.20381L1.24481 2.46921L1.73442 1.97947L2.22404 1.48974L2.71365 1.24487L3.20326 1H157.187H164.042L164.776 1.48974L165.51 2.22434L166 2.95894V3.69355V149.88V150.859L165.51 151.594L164.776 152.084L163.552 152.573H107.491H106.022L104.553 153.063L103.085 153.798L101.616 154.777L100.392 156.001L95.7404 161.878L93.5371 164.572L91.5786 166.531L90.3546 167.265L88.8858 167.755L87.6617 168H10.3027H2.95846L2.22404 167.51L1.48961 166.776L1 166.041Z"
                stroke="#E3E2E2"
                stroke-width="2"
              />
              <Circle key={item.id} name={item.name} src={item.src} />
            </svg>
          ))}

          {/* Coluna esquerda */}
          {/* <div className="w-96 items-start justify-start flex flex-col gap-6">
            {stacks.slice(0, 6).map((item, index) => (
              <Circle
                key={item.id}
                name={item.name}
                ref={itemRefs.current[index]}
                src={item.src}
              />
            ))}
          </div>

          <Circle
            ref={divCenterRef}
            className="!size-20"
            name="Gabriel Freitas"
            src="https://avatars.githubusercontent.com/u/69334324?v=4"
          />

          <div className="w-96 items-end justify-end flex flex-col gap-6">
            {stacks.slice(6, 12).map((item, index) => (
              <Circle
                key={item.id}
                ref={itemRefs.current[index + 6]}
                src={item.src}
                name={item.name}
              />
            ))}
          </div> */}

          {/* {stacks.map((_, index) => {
            const isLeft = index < 6
            const curvature = isLeft ? 65 - (index + 1) * 10 : -75 + index * 10

            return (
              <AnimatedBeam
                key={`beam-${index}`}
                containerRef={containerRef}
                fromRef={itemRefs.current[index]}
                toRef={divCenterRef}
                curvature={curvature}
                startXOffset={isLeft ? -25 : 25}
                reverse={!isLeft}
              />
            )
          })} */}
        </div>
      </div>
    </section>
  )
}

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; src: string; name: string }
>(({ className, children, src, name }, ref) => {
  return (
    <div
      ref={ref}
      data-tip={name}
      className={` ${className} hover:scale-110 ease-in-out duration-300 tooltip tooltip-left z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-1.5 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]`}
    >
      <Image
        src={src}
        alt={name}
        width={60}
        height={60}
        className="rounded-full w-full h-full"
      />
    </div>
  )
})
Circle.displayName = 'Circle'
