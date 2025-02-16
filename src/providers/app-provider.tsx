'use client'
import { getAccountFromLS, getCustomerFromLS } from '@/lib/utils'
import { useAppStore } from '@/providers/zustand-provider'
import { IAccount, ICustomer } from '@/types/auth.type'
import React, { createContext, useContext, useEffect } from 'react'

type AppContextType = {
  user: IAccount | ICustomer | null
}

const AppContext = createContext<AppContextType>({
  user: null
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ user: null }}>{children}</AppContext.Provider>
}
