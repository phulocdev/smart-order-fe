import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import qs from 'qs'
import { usePathname } from 'next/navigation'

interface Props<T> {
  currentPage: number
  totalPages: number
  offset?: number
  searchParams: T
}

const ellipsisCharacter = '...'

export default function AutoPagination<SearchParams>({
  currentPage,
  totalPages,
  offset = 2,
  searchParams
}: Props<SearchParams>) {
  const pathname = usePathname()

  const offsetNumber = currentPage <= offset || currentPage > totalPages - offset ? offset : offset - 1
  const numbersList = []
  const numbersListWithDots: string[] = []

  if (totalPages <= 1 || totalPages === undefined) {
    return (
      <Pagination className='w-fit'>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href={'#'} size='default' className='pointer-events-none gap-1 pl-2.5'>
              <ChevronLeft className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#' className={'border border-primary dark:border-white'}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={'#'} size='default' className='pointer-events-none gap-1 pr-2.5'>
              <ChevronRight className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  numbersList.push(1)
  for (let i = currentPage - offsetNumber; i <= currentPage + offsetNumber; i++) {
    if (i < totalPages && i > 1) {
      numbersList.push(i)
    }
  }
  numbersList.push(totalPages)

  numbersList.reduce((accumulator, currentValue) => {
    if (accumulator === 1) {
      numbersListWithDots.push(String(accumulator))
    }
    if (currentValue - accumulator !== 1) {
      numbersListWithDots.push(ellipsisCharacter)
    }
    numbersListWithDots.push(String(currentValue))

    return currentValue
  })

  return (
    <Pagination className='w-fit'>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            href={`${pathname}?${qs.stringify({ ...searchParams, page: currentPage - 1 })}`}
            size='icon'
            className={cn({ 'pointer-events-none': currentPage === 1 })}
          >
            <ChevronLeft className='h-4 w-4' />
          </PaginationLink>
        </PaginationItem>
        {numbersListWithDots.map((page, index) =>
          page !== ellipsisCharacter ? (
            <PaginationItem key={index}>
              <PaginationLink
                href={`${pathname}?${qs.stringify({ ...searchParams, page })}`}
                size='icon'
                className={cn({ 'border border-primary dark:border-white': currentPage === Number(page) })}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationLink
            href={`${pathname}?${qs.stringify({ ...searchParams, page: currentPage + 1 })}`}
            size='icon'
            className={cn({ 'pointer-events-none': currentPage === totalPages })}
          >
            <ChevronRight className='h-4 w-4' />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
