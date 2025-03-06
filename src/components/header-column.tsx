'use client'

import { Button } from '@/components/ui/button'
import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import qs from 'qs'

export default function HeaderColumn<TData, TValue>({
  column,
  searchParams,
  children
}: {
  column: Column<TData, TValue>
  children: React.ReactNode
  searchParams?: Record<string, string | number>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const sortDirection = column.getIsSorted()
  const isDescending = sortDirection === 'desc'
  const sortQueryParams = isDescending ? `${column.id}.asc` : `${column.id}.desc`
  return (
    <Button
      type='button'
      variant='ghost'
      onClick={() => {
        if (sortDirection === 'asc') {
          // Clear sorting trước khi nó chuyển sang false - Chu kì là: desc - asc - false
          column.clearSorting()
          if (searchParams) {
            delete searchParams.sort
            router.replace(`${pathname}?${qs.stringify(searchParams)}`)
          }
        } else {
          column.toggleSorting(!isDescending)
          if (searchParams) {
            router.replace(`${pathname}?${qs.stringify({ ...searchParams, sort: sortQueryParams })}`)
          }
        }
      }}
    >
      {children}
      {typeof sortDirection === 'string' ? (
        <>
          {isDescending && <ArrowDown />}
          {!isDescending && <ArrowUp />}
        </>
      ) : (
        <ChevronsUpDown />
      )}
    </Button>
  )
}
