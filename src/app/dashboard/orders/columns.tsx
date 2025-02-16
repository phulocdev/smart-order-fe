'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IOrderItem } from '@/types/backend.type'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// {
//   accessorKey: 'email',
//   header: ({ column }) => {
//     return (
//       <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//         Email
//         <ArrowUpDown />
//       </Button>
//     )
//   },
//   cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>
// },
// {
//   id: 'select',
//   header: ({ table }) => (
//     <Checkbox
//       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
//       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//       aria-label='Select all'
//     />
//   ),
//   cell: ({ row }) => (
//     <Checkbox
//       checked={row.getIsSelected()}
//       onCheckedChange={(value) => row.toggleSelected(!!value)}
//       aria-label='Select row'
//     />
//   ),
//   enableSorting: false,
//   enableHiding: false
// },

export const columns: ColumnDef<IOrderItem>[] = [
  // {
  //   accessorKey: 'code',
  //   header: 'Mã đơn',
  //   cell: ({ row }) => <div className='font-semibold'>{row.original.code}</div>
  // },
  {
    accessorKey: 'dish',
    header: 'Món ăn',
    cell: ({ row }) => <div>{row.original.dish.title}</div>
  },
  {
    accessorKey: 'status',
    header: () => 'Trạng thái',
    cell: ({ row }) => (
      <Select>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder={row.original.status} defaultValue={row.original.status} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='light'>Proccessing</SelectItem>
          <SelectItem value='dark'>Cooked</SelectItem>
          <SelectItem value='system'>Paid</SelectItem>
        </SelectContent>
      </Select>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const orderItem = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(orderItem._id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
