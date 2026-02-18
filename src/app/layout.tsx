import Preloader from '@/components/Preloader'
import { GlobalContextProvider } from '@/context/GlobalContext'
import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gabriel Freitas',
  description: 'Portfolio de Gabriel Freitas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=mona-sans@1&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          type="image/svg"
          sizes="96x96"
          href="/assets/logo_freitas_completed.png"
        />
      </head>
      <body>
        <>
          <GlobalContextProvider>
            <Preloader />
            {children}
            <ToastContainer />
          </GlobalContextProvider>
        </>
      </body>
    </html>
  )
}
