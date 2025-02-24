import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import React from 'react'

interface Props {
  rows?: number
  columns: number
}

export default function TableSkeleton({ columns, rows = 5 }: Props) {
  return (
    <TableBody>
      {Array(rows)
        .fill(0)
        .map((_, index) => (
          <TableRow key={index}>
            {Array(columns)
              .fill(0)
              .map((_, index) => (
                <TableCell key={index} className=''>
                  <Skeleton className='h-[20px] rounded-full' />
                </TableCell>
              ))}
          </TableRow>
        ))}
    </TableBody>
  )
}
