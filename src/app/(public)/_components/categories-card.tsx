'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ICategory } from '@/types/backend.type'
import { Link } from 'react-scroll'
import * as React from 'react'
import { HEADER_HEIGHT } from '@/config/internal-data'

interface Props {
  categoryListData: ICategory[]
}

export default function CategoriesCard({ categoryListData }: Props) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  if (isDesktop) {
    return (
      <Card className={`sticky`} style={{ top: `calc(${HEADER_HEIGHT}px + 2rem)` }}>
        <CardContent>
          <div className='flex flex-col py-3'>
            {categoryListData.map((category, index) => (
              <Link
                key={category._id}
                to={`section-${index}`}
                offset={-(HEADER_HEIGHT + 80)}
                activeClass='border-red-600 text-red-600'
                spy
                smooth
                duration={800}
                className={
                  'cursor-pointer border-b border-gray-200 py-3 text-[15px] font-bold text-black last:border-b-0 last:pb-0'
                }
              >
                {category.title}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      className='sticky top-0 z-30 mb-3 flex w-full flex-wrap items-center bg-background px-3 dark:border-b dark:border-gray-700'
      // style={{ top: `calc(${HEADER_HEIGHT}px + 0.5rem)` }}
    >
      {categoryListData.map((category, index) => (
        <Link
          key={category._id}
          to={`section-${index}`}
          offset={-(HEADER_HEIGHT + 80)}
          activeClass='border-red-600 text-red-600'
          spy
          smooth
          duration={800}
          className='cursor-pointer px-2.5 py-3 text-sm font-semibold md:text-[15px]'
        >
          {category.title}
        </Link>
      ))}
    </div>
  )
}
