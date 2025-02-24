'use client'

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
import queryString from 'query-string'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'

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
  const router = useRouter()
  // By doing this, when we are close to the beginning or end of the pagination, two numbers are generated after/before the current page,
  // but when we are far from these points (in the middle of the pagination), we generate only one number after/before the current page.
  const offsetNumber = currentPage <= offset || currentPage > totalPages - offset ? offset : offset - 1
  const numbersList = []
  const numbersListWithDots: string[] = []

  // If itemsPerPage is less than what the user selected with the Select component or if there is no page or only one page:
  if (totalPages <= 1 || totalPages === undefined) {
    return (
      <Pagination className='w-fit'>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              href={'#'}
              aria-label='Go to previous page'
              size='default'
              className='pointer-events-none gap-1 pl-2.5'
            >
              <ChevronLeft className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#' className={'border border-primary dark:border-white'}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href={'#'}
              aria-label='Go to next page'
              size='default'
              className='pointer-events-none gap-1 pr-2.5'
            >
              <ChevronRight className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  // Create list of numbers:
  numbersList.push(1)
  for (let i = currentPage - offsetNumber; i <= currentPage + offsetNumber; i++) {
    if (i < totalPages && i > 1) {
      numbersList.push(i)
    }
  }
  numbersList.push(totalPages)

  // Add three dots to the list of numbers:
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
          <Button
            onClick={() =>
              router.push(`${pathname}?${queryString.stringify({ ...searchParams, page: currentPage - 1 })}`)
            }
            size='icon'
            variant={'ghost'}
            className={cn({ 'pointer-events-none': currentPage === 1 })}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
        </PaginationItem>
        {numbersListWithDots.map((page, index) =>
          page !== ellipsisCharacter ? (
            <PaginationItem key={index}>
              <Button
                onClick={() => router.push(`${pathname}?${queryString.stringify({ ...searchParams, page })}`)}
                size='icon'
                variant={'ghost'}
                className={cn({ 'border border-primary dark:border-white': currentPage === Number(page) })}
              >
                {page}
              </Button>
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <Button
            onClick={() =>
              router.push(`${pathname}?${queryString.stringify({ ...searchParams, page: currentPage + 1 })}`)
            }
            size='icon'
            variant={'ghost'}
            className={cn({ 'pointer-events-none': currentPage === totalPages })}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
