'use client'

import DishRow from '@/app/(public)/_components/dish-row'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ICategory, IDish } from '@/types/backend.type'
import { Session } from 'next-auth'
import { Element } from 'react-scroll'

interface Props {
  categoryListData: ICategory[]
  dishListData: IDish[]
  session: Session | null
}

export default function DishList({ categoryListData, dishListData, session }: Props) {
  return (
    <>
      {categoryListData.map((category, index) => {
        return (
          <Element className='mt-8 first:mt-0' name={`section-${index}`} key={category._id}>
            <Card>
              <CardHeader className='border-b border-b-gray-300'>
                <CardTitle className='lg:ext-center text-left text-xl font-medium md:text-center lg:text-2xl'>
                  <h2 className='font-heading capitalize tracking-wide'>{category.title}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col'>
                  {dishListData.map((dish) => {
                    if (dish.category?._id === category._id) {
                      return <DishRow key={dish._id} dish={dish} session={session} />
                    }
                  })}
                </div>
              </CardContent>
            </Card>
          </Element>
        )
      })}
    </>
  )
}
