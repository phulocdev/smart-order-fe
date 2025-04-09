'use client'
import QuantitySelect from '@/components/quantity-select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { DishStatus } from '@/constants/enum'
import { NOTE_MAX_LENGTH, QUANTITY_SELECT_MAX } from '@/constants/internal-data'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn, formatNumberToVnCurrency } from '@/lib/utils'
import { useAppStore } from '@/providers/zustand-provider'
import { IDish } from '@/types/backend.type'
import { DialogClose } from '@radix-ui/react-dialog'
import { Pencil, Plus, X } from 'lucide-react'
import { Session } from 'next-auth'
import Image from 'next/image'
import * as React from 'react'
import { toast } from 'sonner'

interface Props {
  dish: IDish
  session: Session | null
}

export default function DishRow({ dish, session }: Props) {
  const orderItems = useAppStore((state) => state.orderItems)
  const addOrderItem = useAppStore((state) => state.addOrderItem)
  const updateOrderItem = useAppStore((state) => state.updateOrderItem)

  const [quantity, setQuantity] = React.useState<number>(1)
  const [note, setNote] = React.useState<string>('')
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  const handleSelectDish = () => {
    debugger
    const isExist = orderItems.some((order) => order.dish._id === dish._id)
    if (isExist) {
      updateOrderItem(dish._id, { quantity, note })
    } else {
      addOrderItem({ dish, note, quantity, price: dish.price })
    }
    setQuantity(1)
    setNote('')
    toast(`🟢 Đã thêm món ăn vào giỏ hàng`, { position: isDesktop ? 'bottom-right' : 'top-right' })
  }

  if (isDesktop) {
    return (
      <Dialog open={!session?.customer || dish.status === DishStatus.Unavailable ? false : undefined}>
        <DialogTrigger
          asChild
          onClick={() => {
            if (dish.status === DishStatus.Unavailable || !session?.customer) {
              return
            }

            if (!session?.customer) {
              toast.error('Vui lòng quét mã QR để có thể đặt món!', { icon: <span>❌</span> })
            }
          }}
        >
          <div className='group flex cursor-pointer gap-x-4 border-b border-b-gray-200 py-5 last:border-b-0 last:pb-0'>
            <div className='aspect-square w-28 shrink-0 rounded-sm'>
              <Image
                width={0}
                height={0}
                sizes='100vw'
                className='h-full w-full rounded-sm object-cover'
                src={dish.imageUrl}
                alt={dish.title}
              />
            </div>
            <div className='grow'>
              <h3 className='font-heading text-[15px] font-normal capitalize tracking-wide text-third group-hover:text-red-600'>
                {dish.title}
              </h3>
              <div className={cn('line-clamp-2 text-sm leading-5 text-gray-700', { 'py-1': !!dish.description })}>
                {dish.description}
              </div>
              <div className='flex items-center gap-x-2 pt-4'>
                <div className='font-heading font-semibold text-red-600'>{formatNumberToVnCurrency(dish.price)}</div>
                <div className='ml-auto inline-flex gap-x-3'>
                  {dish.status === DishStatus.Unavailable && <Badge variant={'ghost'}>Hết hàng</Badge>}
                  <button
                    className={cn(
                      'flex aspect-square w-9 items-center justify-center rounded-full bg-third text-third-foreground',
                      {
                        'cursor-not-allowed opacity-70': dish.status === DishStatus.Unavailable
                      }
                    )}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className='mx-8 md:max-w-[800px]'>
          <DialogHeader>
            <DialogTitle>
              <div className='flex items-start gap-x-3 border-b border-b-gray-200 py-4'>
                <Image
                  width={80}
                  height={80}
                  className='h-20 w-20 rounded-sm object-cover'
                  src={dish.imageUrl}
                  alt={dish.title}
                />
                <h3 className='font-heading font-medium text-third'>{dish.title}</h3>
              </div>
            </DialogTitle>
          </DialogHeader>
          <p className='line-clamp-4 font-normal leading-5 text-gray-600'>{dish.description}</p>
          <div className='border-b border-b-gray-200 pb-6 pt-1'>
            <div className='relative'>
              <input
                value={note}
                className='w-full rounded-sm border border-gray-300 px-10 py-2 pl-10 pr-3 text-sm text-gray-600 transition-colors duration-100 placeholder:text-sm placeholder:text-gray-600 focus:border-third focus:outline-none'
                placeholder='Thêm ghi chú...'
                onChange={(event) => {
                  const { value } = event.target
                  if (value.length > 40) return
                  setNote(value)
                }}
              />
              <div className='absolute left-2 top-[50%] -translate-y-[50%]'>
                <Pencil size={16} color='gray' />
              </div>
            </div>
            <div className='py-0.5 text-right text-[13px] text-gray-700'>
              {note.length}/{NOTE_MAX_LENGTH}
            </div>
          </div>

          {/* Actions */}
          <DialogFooter>
            <QuantitySelect className='mr-auto' onChange={handleQuantityChange} max={QUANTITY_SELECT_MAX} />
            <DialogClose asChild>
              <button
                className='flex w-52 justify-between bg-third px-6 py-2.5 text-sm text-third-foreground'
                onClick={handleSelectDish}
              >
                <span className='uppercase'>Đặt món</span>
                <span>{formatNumberToVnCurrency(quantity * dish.price)}</span>
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={!session?.customer || dish.status === DishStatus.Unavailable ? false : open} onOpenChange={setOpen}>
      <DrawerTrigger
        asChild
        onClick={() => {
          if (dish.status === DishStatus.Unavailable || !session?.customer) {
            return
          }

          if (!session?.customer) {
            toast.error('Vui lòng quét mã QR để có thể đặt món!', { icon: <span>❌</span> })
          }
        }}
      >
        <div className='group flex cursor-pointer gap-x-4 border-b border-b-gray-200 py-5 last:border-b-0 last:pb-0'>
          <div className='aspect-square w-28 shrink-0 rounded-sm'>
            <Image
              width={0}
              height={0}
              sizes='100vw'
              className='h-full w-full rounded-sm object-cover'
              src={dish.imageUrl}
              alt={dish.title}
            />
          </div>
          <div className='grow'>
            <h3 className='font-heading text-[15px] font-normal capitalize tracking-wide text-third group-hover:text-red-600'>
              {dish.title}
            </h3>
            <div className={cn('line-clamp-2 text-sm leading-5 text-gray-700', { 'py-1': !!dish.description })}>
              {dish.description}
            </div>
            <div className='flex items-center gap-x-2 pt-4'>
              <div className='font-heading font-semibold text-red-600'>{formatNumberToVnCurrency(dish.price)}</div>
              <div className='ml-auto inline-flex gap-x-3'>
                {dish.status === DishStatus.Unavailable && <Badge variant={'ghost'}>Hết hàng</Badge>}
                <button
                  className={cn(
                    'flex aspect-square w-9 items-center justify-center rounded-full bg-third text-third-foreground',
                    {
                      'cursor-not-allowed opacity-70': dish.status === DishStatus.Unavailable
                    }
                  )}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className='h-screen'>
        <DrawerHeader className=''>
          <DrawerTitle className='flex justify-between border-b border-b-gray-200 py-4'>
            <DrawerClose className='shrink-0'>
              <X size={30} />
            </DrawerClose>
            <div className='h-10 grow'>
              <h3 className='mb-1.5 text-center font-heading text-lg font-light capitalize tracking-wider text-third'>
                {dish.title}
              </h3>
            </div>
          </DrawerTitle>
        </DrawerHeader>

        <div className='custom-scrollbar h-full overflow-y-scroll'>
          <div className='mx-auto aspect-square w-[75%] rounded-sm py-2 md:w-[45%]'>
            <Image
              src={dish.imageUrl}
              alt={dish.title}
              width={0}
              height={0}
              sizes='100vw'
              className='aspect-square w-full rounded-sm object-cover'
            />
          </div>
          <div className='mx-auto w-[75%]'>
            <h2 className='mb-5 font-heading text-xl capitalize tracking-wider text-third'>{dish.title}</h2>
            <div className='border-t border-b-gray-200 pb-1 pt-6'>
              <div className='relative'>
                <input
                  value={note}
                  className='w-full rounded-sm border border-gray-300 px-10 py-1.5 pl-10 pr-3 text-sm text-gray-600 transition-colors duration-100 placeholder:text-sm placeholder:text-gray-600 focus:border-third focus:outline-none'
                  onChange={(event) => {
                    const { value } = event.target
                    if (value.length > 40) return
                    setNote(value)
                  }}
                  placeholder='Thêm ghi chú...'
                />
                <div className='absolute left-2 top-[50%] -translate-y-[50%]'>
                  <Pencil size={16} color='gray' />
                </div>
              </div>
              <div className='py-0.5 text-right text-[13px] text-gray-700'>
                {note.length}/{NOTE_MAX_LENGTH}
              </div>
            </div>
            <p className='custom-scrollbar my-3 max-h-[40vh] overflow-y-scroll py-2 text-sm font-normal leading-5 text-gray-600'>
              {dish.description}
            </p>
          </div>
        </div>

        <DrawerFooter className='flex-row justify-between border-t border-t-gray-200 pt-4'>
          <QuantitySelect className='mr-auto' onChange={handleQuantityChange} max={QUANTITY_SELECT_MAX} />
          <DrawerClose asChild>
            <button
              className='flex w-52 justify-between bg-third px-6 py-2.5 text-sm text-third-foreground'
              onClick={handleSelectDish}
            >
              <span className='uppercase'>Đặt món</span>
              <span>{formatNumberToVnCurrency(quantity * dish.price)}</span>
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
