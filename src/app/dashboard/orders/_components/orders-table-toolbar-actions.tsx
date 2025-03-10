'use client'

import type { Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { exportTableToCSV } from '@/lib/export'

import { DeleteOrdersDialog } from '@/app/dashboard/orders/_components/delete-order-dialog'
import { IOrder } from '@/types/backend.type'

interface OrdersTableToolbarActionsProps {
  table: Table<IOrder>
}

export function OrdersTableToolbarActions({ table }: OrdersTableToolbarActionsProps) {
  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteOrdersDialog
          orders={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'tasks',
            excludeColumns: ['select', 'actions']
          })
        }
        className='gap-2'
      >
        <Download className='size-4' aria-hidden='true' />
        Export to CSV
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  )
}
