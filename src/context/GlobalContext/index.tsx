'use client'

import { GlobalContextProps } from './types'
import React, { createContext, useContext, useEffect } from 'react'

const GlobalContext = createContext<GlobalContextProps>(
  {} as GlobalContextProps
)

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  useEffect(() => {
    console.log(
      `%c
 ██████╗  █████╗ ██████╗ ██████╗ ██╗███████╗██╗        
██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██║██╔════╝██║         
██║  ███╗███████║██████╔╝██████╔╝██║█████╗  ██║         
██║   ██║██╔══██║██╔══██╗██╔══██╗██║██╔══╝  ██║         
╚██████╔╝██║  ██║██████╔╝██║  ██║██║███████╗███████╗    
 ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝    
%c
███████╗██████╗ ███████╗██╗████████╗ █████╗ ███████╗
██╔════╝██╔══██╗██╔════╝██║╚══██╔══╝██╔══██╗██╔════╝
█████╗  ██████╔╝█████╗  ██║   ██║   ███████║███████╗
██╔══╝  ██╔══██╗██╔══╝  ██║   ██║   ██╔══██║╚════██║
██║     ██║  ██║███████╗██║   ██║   ██║  ██║███████║
╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
        %c%c`,
      'color: #7e22ce; font: 400 1em monospace;',
      '',
      'background-color: #d2ff00; color: black; font: 400 1em monospace; padding: 0.5em 0; font-weight: bold;',
      ''
    )
  }, [])

  return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>
}

export default function useGlobalContext(): GlobalContextProps {
  const context = React.useContext(GlobalContext)
  if (!context) {
    throw new Error(
      'useGlobalContext must be used within a GlobalContextProvider'
    )
  }
  return context
}
