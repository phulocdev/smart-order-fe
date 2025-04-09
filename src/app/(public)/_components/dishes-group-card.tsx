'use client'

import DishRow from '@/app/(public)/_components/dish-row'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ICategory, IDish } from '@/types/backend.type'
import { Element } from 'react-scroll'
import * as React from 'react'
import { useSession } from 'next-auth/react'

export const MAX_DISH_EACH_CATEGORY = 5

interface Props {
  catIdx: number
  category: ICategory
  dishList: IDish[]
  totalDishRow: number
}

export default function DishesGroupCard({ catIdx, category, dishList, totalDishRow }: Props) {
  const { data: session } = useSession()
  const [isWatchMore, setIsWatchMore] = React.useState(false)

  function toggleWatchMore() {
    setIsWatchMore(!isWatchMore)
  }

  return (
    <Element className='mt-8 first:mt-0' name={`section-${catIdx}`} key={category._id}>
      <Card>
        <CardHeader className='border-b border-b-gray-300'>
          <CardTitle className='lg:ext-center text-left text-xl font-medium md:text-center lg:text-2xl'>
            <h2 className='font-heading capitalize tracking-wide'>{category.title}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col'>
            {dishList.map((dish) => {
              if (isWatchMore) {
                return <DishRow key={dish._id} dish={dish} session={session} />
              }
              if (totalDishRow < MAX_DISH_EACH_CATEGORY) {
                totalDishRow++
                return <DishRow key={dish._id} dish={dish} session={session} />
              }
            })}
          </div>
        </CardContent>
        <CardFooter className='justify-center'>
          {dishList.length > MAX_DISH_EACH_CATEGORY && [catIdx] && (
            <Button
              onClick={() => {
                toggleWatchMore()
              }}
              variant={isWatchMore ? 'outline' : 'red'}
              className='font-heading font-medium capitalize'
            >
              {isWatchMore ? 'Ẩn bớt' : 'Xem thêm'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </Element>
  )
}
