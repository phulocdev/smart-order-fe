'use client'

import { Button } from '@/components/ui/button'
import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import queryString from 'query-string'
import React from 'react'

export default function HeaderTable<T>({
  column,
  searchParams,
  children
}: {
  column: Column<T, unknown>
  searchParams: Record<string, string>
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const sortDirection = column.getIsSorted()
  const isDescending = sortDirection === 'desc'
  const sortParamValue = isDescending ? `${column.id}.asc` : `${column.id}.desc`
  return (
    <Button
      variant='ghost'
      onClick={() => {
        if (sortDirection === 'asc') {
          column.clearSorting()
          delete searchParams.sort
          router.push(`${pathname}?${queryString.stringify(searchParams)}`)
        } else {
          column.toggleSorting(!isDescending)
          router.push(`${pathname}?${queryString.stringify({ ...searchParams, sort: sortParamValue })}`)
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
