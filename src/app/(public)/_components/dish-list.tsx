'use client'

import DishRow from '@/app/(public)/_components/dish-row'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ICategory, IDish } from '@/types/backend.type'
import { ArrowUp } from 'lucide-react'
import { Session } from 'next-auth'
import * as React from 'react'
import { Element, animateScroll as scroll, scrollSpy } from 'react-scroll'

interface Props {
  categoryListData: ICategory[]
  dishListData: IDish[]
  session: Session | null
}

export default function DishList({ categoryListData, dishListData, session }: Props) {
  const [showScrollButton, setShowScrollButton] = React.useState(false)

  React.useEffect(() => {
    scrollSpy.update()

    const handleScroll = () => {
      const scrollTop = window.scrollY
      setShowScrollButton(scrollTop > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    scroll.scrollToTop()
  }

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

      {/* Scroll to top button */}
      <button
        className={cn(
          'fixed bottom-16 right-8 flex aspect-square w-12 items-center justify-center rounded-full bg-red-600 font-semibold text-third-foreground transition-opacity duration-200 ease-in-out lg:bottom-4',
          { 'pointer-events-none opacity-0': !showScrollButton, 'opacity-100': showScrollButton }
        )}
        onClick={scrollToTop}
      >
        <ArrowUp size={19} />
      </button>
    </>
  )
}
