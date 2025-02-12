import React from 'react'
import DishCard from '@/app/(public)/_components/dish-card'
import dishApiRequest from '@/apiRequests/dish.api'
import { IDish } from '@/types/backend.type'
import { ShoppingCart } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import QuantitySelect from '@/components/quantity-select'
import { Badge } from '@/components/ui/badge'
import { formatNumberToVnCurrency } from '@/lib/utils'

export default async function Page() {
  let dishList: IDish[] = []
  try {
    const res = await dishApiRequest.sGetList()
    dishList = res.data
  } catch (error) {
    console.log(error)
  }
  console.log('homepage render')
  return (
    <div className='mt-12'>
      <h2 className='mb-3 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>Món ăn tại cửa hàng</h2>
      <div className='grid grid-cols-12 gap-x-8'>
        {dishList.map((dish) => (
          <DishCard key={dish._id} dish={dish} />
        ))}
      </div>
      <div className='fixed bottom-10 right-5'>
        <Sheet>
          <SheetTrigger>
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white'>
              <ShoppingCart size={18} />
            </div>
          </SheetTrigger>
          <SheetContent className='sm:w-[400px] sm:max-w-[540px] xl:w-[400px] xl:max-w-none' side={'right'}>
            <SheetHeader>
              <SheetTitle>Đơn hàng đã đặt</SheetTitle>
            </SheetHeader>
            <div className='mt-4 flex flex-col gap-5'>
              <div className='grid grid-cols-5 items-center gap-x-2'>
                <div className='col-span-1'>
                  <Image
                    src={'http://localhost:8000/public/dishes/cach-lam-mi-cay-6cd0.webp'}
                    alt='KKKK'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='aspect-square w-full rounded-md object-cover'
                  />
                </div>
                <div className='col-span-2'>
                  <h5 className='line-clamp-2 h-[45px] text-[15px]'>
                    Lorem ipsum dolor sit amet consectetur, adipisicing eli
                  </h5>
                  <span className='block text-sm font-medium italic'>x2</span>
                </div>
                <div className='col-span-2'>
                  <QuantitySelect />
                </div>
              </div>

              <div className='grid grid-cols-5 items-center gap-x-2'>
                <div className='col-span-1'>
                  <Image
                    src={'http://localhost:8000/public/dishes/cach-lam-mi-cay-6cd0.webp'}
                    alt='KKKK'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='aspect-square w-full rounded-md object-cover'
                  />
                </div>
                <div className='col-span-2'>
                  <h5 className='line-clamp-2 h-[45px] text-[15px]'>
                    Lorem ipsum dolor sit amet consectetur, adipisicing eli
                  </h5>
                  <span className='block text-sm font-medium italic'>x2</span>
                </div>
                <div className='col-span-2'>
                  <QuantitySelect />
                </div>
              </div>

              <div className='grid grid-cols-5 items-center gap-x-2'>
                <div className='col-span-1'>
                  <Image
                    src={'http://localhost:8000/public/dishes/cach-lam-mi-cay-6cd0.webp'}
                    alt='KKKK'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='aspect-square w-full rounded-md object-cover'
                  />
                </div>
                <div className='col-span-2'>
                  <h5 className='line-clamp-2 h-[45px] text-[15px]'>
                    Lorem ipsum dolor sit amet consectetur, adipisicing eli
                  </h5>
                  <span className='block text-sm font-medium italic'>x2</span>
                </div>
                <div className='col-span-2'>
                  <QuantitySelect />
                </div>
              </div>
            </div>
            <div className='absolute bottom-3 left-0 right-0 px-3'>
              <div className='flex items-center justify-between border-t py-7 shadow-inner'>
                <div className='flex items-center gap-x-2'>
                  <span className='font-semibold uppercase'>Tổng</span>
                  <Badge>3 món</Badge>
                </div>
                <span className='font-bold'>{formatNumberToVnCurrency(690000000)}</span>
              </div>
              <SheetFooter>
                <SheetClose className='shrink-0 grow'>
                  <Button className='w-full' type='submit' variant={'outline'}>
                    Thêm món
                  </Button>
                </SheetClose>
                <SheetClose className='shrink-0 grow'>
                  <Button className='w-full' type='submit'>
                    Xác nhận
                  </Button>
                </SheetClose>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
