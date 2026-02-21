export function MacOSWindowTemplate({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <div className="w-full flex flex-col items-center h-full p-5 rounded-xl">
      <span className="bg-zinc-100 p-3 w-full h-12 shrink-0 rounded-t-xl flex items-center gap-5">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="w-2 h-2 bg-yellow-500 rounded-full" />
          <span className="w-2 h-2 bg-green-500 rounded-full" />
        </div>
        <p className="text-sm text-zinc-800 font-semibold">{title}</p>
      </span>
      {/* flex-1 min-h-0: fills remaining height after the title bar */}
      <div className="flex-1 min-h-0 w-full">{children}</div>
    </div>
  )
}
