'use client'

import type { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>
  }

  const sortDirection = column.getIsSorted()
  const isDescending = sortDirection === 'desc'

  return (
    <Button
      type='button'
      variant='ghost'
      onClick={() => {
        if (sortDirection === 'asc') {
          // Clear sorting trước khi nó chuyển sang false - Chu kì là: desc - asc - false
          column.clearSorting()
        } else {
          column.toggleSorting(!isDescending)
        }
      }}
    >
      {title}
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
