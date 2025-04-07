'use client'

import DishRow from '@/app/(public)/_components/dish-row'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ICategory, IDish } from '@/types/backend.type'
import { Session } from 'next-auth'
import { Element } from 'react-scroll'
import * as React from 'react'

interface Props {
  categoryListData: ICategory[]
  dishListData: IDish[]
  session: Session | null
}

export const MAX_DISH_EACH_CATEGORY = 5

export default function DishList({ categoryListData, dishListData, session }: Props) {
  const [isWatchMoreList, setIsWatchMoreList] = React.useState(() => Array(categoryListData.length).map(() => false))

  const toggleWatchMore = (catIdx: number) => {
    isWatchMoreList[catIdx] = !isWatchMoreList[catIdx]
    setIsWatchMoreList([...isWatchMoreList])
  }

  return (
    <>
      {categoryListData.map((category, catIdx) => {
        let totalDishRow = 0
        const dishList = dishListData.filter((dish) => dish.category?._id === category._id)
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
                    if (isWatchMoreList[catIdx]) {
                      return <DishRow key={dish._id} dish={dish} session={session} />
                    }

                    // Hiển thị MAX_DISH_EACH_CATEGORY món đầu tiền trong danh sách món ăn theo từng loại danh mục
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
                      toggleWatchMore(catIdx)
                    }}
                    variant={isWatchMoreList[catIdx] ? 'outline' : 'red'}
                    className='font-heading font-medium capitalize'
                  >
                    {isWatchMoreList[catIdx] ? 'Ẩn bớt' : 'Xem thêm'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </Element>
        )
      })}
    </>
  )
}
