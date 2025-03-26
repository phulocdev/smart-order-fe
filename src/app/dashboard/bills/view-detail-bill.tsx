import { exportBillToPDF } from '@/app/dashboard/bills/_lib/export'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { useMediaQuery } from '@/hooks/use-media-query'
import { formatNumberToVnCurrency, translateBillKey } from '@/lib/utils'
import { IBill } from '@/types/backend.type'
import type { Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Printer } from 'lucide-react'
import * as React from 'react'

interface ViewDetailInvoiceDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  bill?: Row<IBill>['original']
  showTrigger?: boolean
  onSuccess?: () => void
}

export default function ViewDetailInvoiceDialog({
  bill,
  showTrigger = true,
  onSuccess,
  ...props
}: ViewDetailInvoiceDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const [isPrinting, setIsPrinting] = React.useState(false)

  const handleExportPDF = async () => {
    if (!bill) return
    setIsPrinting(true)
    await exportBillToPDF(bill)
    setIsPrinting(false)
  }

  if (!bill) return
  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant='outline' size='sm'>
              Xem phiếu tính tiền
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='max-w-[600px]'>
          <DialogHeader>
            <DialogTitle className='max-w-[90%] leading-6'>Chi tiết phiếu tính tiền</DialogTitle>
            <DialogDescription asChild className='text-black'>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className='w-[200px]'>{translateBillKey('billCode')}</TableHead>
                    <TableCell className='font-medium'>{bill.billCode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>{translateBillKey('customerCode')}</TableHead>
                    <TableCell>{bill.customerCode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>{translateBillKey('orderItems')}</TableHead>
                    <TableCell>
                      <div className='flex flex-col gap-y-3'>
                        {bill.orderItems.map((item, index) => (
                          <div className='flex justify-between gap-x-1' key={item._id}>
                            <div className='font-medium'>{index + 1}.</div>
                            <div className='line-clamp-2 grow'>{item.dish?.title}</div>
                            <div>x{item.quantity}</div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>{translateBillKey('createdAt')}</TableHead>
                    <TableCell>{format(bill.createdAt, 'dd/MM/yyyy hh:mm:ss a')}</TableCell>
                  </TableRow>
                  {/* Last Row */}
                  <TableRow>
                    <TableHead className='w-[200px]'>Tổng tiền:</TableHead>
                    <TableCell className='text-right text-base font-semibold'>
                      {formatNumberToVnCurrency(bill.totalPrice)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline'>Hủy</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleExportPDF} disabled={isPrinting}>
                <Printer />
                <span>In phiếu tính tiền</span>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant='outline' size='sm'>
            Xem phiếu tính tiền
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Chi tiết phiếu tính tiền</DrawerTitle>
          <DrawerDescription>
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead className='w-[200px]'>{translateBillKey('billCode')}</TableHead>
                  <TableCell className='font-medium'>{bill.billCode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>{translateBillKey('customerCode')}</TableHead>
                  <TableCell>{bill.customerCode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>{translateBillKey('orderItems')}</TableHead>
                  <TableCell>
                    <div className='flex flex-col gap-y-3'>
                      {bill.orderItems.map((item, index) => (
                        <div className='flex justify-between gap-x-1' key={item._id}>
                          <div className='font-medium'>{index + 1}.</div>
                          <div className='line-clamp-2 grow'>{item.dish?.title}</div>
                          <div>x{item.quantity}</div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
                {/* Last Row */}
                <TableRow>
                  <TableHead className='w-[200px]'>Tổng tiền:</TableHead>
                  <TableCell className='text-right text-base font-semibold'>
                    {formatNumberToVnCurrency(bill.totalPrice)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Hủy</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button onClick={handleExportPDF} disabled={isPrinting}>
              <Printer />
              <span>In phiếu tính tiền</span>
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
