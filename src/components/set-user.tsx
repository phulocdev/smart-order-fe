'use client'

import { getAccountFromLS, getCustomerFromLS } from '@/lib/utils'
import { useAppStore } from '@/providers/zustand-provider'
import React from 'react'

export default function SetUser() {
  const setAccount = useAppStore((state) => state.setAccount)
  const setCustomer = useAppStore((state) => state.setCustomer)

  React.useEffect(() => {
    setAccount(getAccountFromLS())
    setCustomer(getCustomerFromLS())
  }, [setAccount, setCustomer])
  return null
}
