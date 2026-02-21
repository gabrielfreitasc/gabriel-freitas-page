const PATH_RIGHT =
  'M430.5 28.5H713L712 663.5H17H13.5L11.5 663L10 662L8.5 661L7 660L5.5 658.5L4 657L2.5 655L1 651.5L0.5 648.5V462V458.5L1 457L1.5 455.5L2.5 453L3.5 451L5.5 448L7.5 445L9.5 442.5L11.5 440L14.5 436.5L16 434.5L18 432L19.5 430L21 428L23.5 425L25 422.5L26 421L27 418.5L27.5 416.5L28 414.5L28.5 412.5V410V274V260.5L28 258.5L27.5 256.5L27 254.5L26.5 253L25 250.5L23.5 248L21 244.5L19 241.5L15 236.5L11.5 232.5L8.5 228.5L5.5 224.5L4 222L3 220L2 218L1.5 216L1 214L0.5 212V209.5V18V15.5L1 13.5L1.5 11.5L3 9L4.5 7L6.5 5L9 3L10.5 2L12.5 1L14.5 0.5H17H214H288H358H381L383.5 1L385.5 1.5L387.5 2.5L389 3.5L393 6.5L403.5 14.5L415 23.5L419.5 26.5L422.5 28L425 28.5H430.5Z'

const PATH_LEFT =
  'M283.001 635.5L0.500793 635.5L1.50079 0.5L696.501 0.5H700.001L702.001 1L703.501 2L705.001 3L706.501 4L708.001 5.5L709.501 7L711.001 9L712.501 12.5L713.001 15.5L713.001 202V205.5L712.501 207L712.001 208.5L711.001 211L710.001 213L708.001 216L706.001 219L704.001 221.5L702.001 224L699.001 227.5L697.501 229.5L695.501 232L694.001 234L692.501 236L690.001 239L688.501 241.5L687.501 243L686.501 245.5L686.001 247.5L685.501 249.5L685.001 251.5V254V390V403.5L685.501 405.5L686.001 407.5L686.501 409.5L687.001 411L688.501 413.5L690.001 416L692.501 419.5L694.501 422.5L698.501 427.5L702.001 431.5L705.001 435.5L708.001 439.5L709.501 442L710.501 444L711.501 446L712.001 448L712.501 450L713.001 452V454.5V646V648.5L712.501 650.5L712.001 652.5L710.501 655L709.001 657L707.001 659L704.501 661L703.001 662L701.001 663L699.001 663.5H696.501H499.501H425.501H355.501H332.501L330.001 663L328.001 662.5L326.001 661.5L324.501 660.5L320.501 657.5L310.001 649.5L298.501 640.5L294.001 637.5L291.001 636L288.501 635.5H283.001Z'

export function ExperienceCard({
  children,
  direction = 'right',
}: {
  children: React.ReactNode
  direction?: 'left' | 'right'
}) {
  const d = direction === 'left' ? PATH_LEFT : PATH_RIGHT

  return (
    <div className="relative w-[900px] max-w-[95vw] aspect-[714/800]">
      {/* SVG que define o clip-path */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath
            id={`experience-clip-${direction}`}
            clipPathUnits="objectBoundingBox"
          >
            <path
              d={d}
              transform="scale(0.00140056022408964, 0.00150602409638554)"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Conteúdo (modal) RECORTADO pelo path */}
      <div
        className="absolute inset-0 inset-x-1 overflow-hidden"
        style={{
          clipPath: `url(#experience-clip-${direction})`,
          WebkitClipPath: `url(#experience-clip-${direction})`,
        }}
      >
        {children}
      </div>

      {/* Moldura (SVG por cima) */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox="0 0 714 664"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={d} fill="none" stroke="none" />
      </svg>
    </div>
  )
}
