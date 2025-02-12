'use client'
import React, { createContext, useContext, useState } from 'react'

type AppContextType = {
  number: number
  setNumber: React.Dispatch<React.SetStateAction<number>>
}

const AppContext = createContext<AppContextType>({
  number: 0,
  setNumber: () => null
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [number, setNumber] = useState(1)

  return <AppContext.Provider value={{ number, setNumber }}>{children}</AppContext.Provider>
}
