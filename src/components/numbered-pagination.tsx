import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import qs from 'qs'

interface Props<T> {
  currentPage: number
  totalPages: number
  onChange?: (pageIndex: number) => void
  offset?: number
  searchParams?: T // Nếu mà truyền searchParams thì đồng nghĩa với việc syncStateToUrl
}

const ellipsisCharacter = '...'

export default function NumberedPagination<SearchParams>({
  currentPage,
  totalPages,
  offset = 2,
  onChange,
  searchParams
}: Props<SearchParams>) {
  const router = useRouter()
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
              <ChevronLeft size={4} />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#' className={'border border-primary dark:border-white'}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={'#'} size='default' className='pointer-events-none gap-1 pr-2.5'>
              <ChevronRight size={4} />
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
          <Button
            size='icon'
            className={cn({ 'pointer-events-none': currentPage === 1 })}
            variant={'outline'}
            onClick={() => {
              const previousPage = currentPage - 1
              if (onChange) onChange(previousPage - 1)
              if (searchParams) {
                router.replace(`${pathname}?${qs.stringify({ ...searchParams, page: previousPage })}`)
              }
            }}
          >
            <ChevronLeft size={4} />
          </Button>
        </PaginationItem>
        {numbersListWithDots.map((page, index) =>
          page !== ellipsisCharacter ? (
            <PaginationItem key={index}>
              <Button
                size='icon'
                variant={'outline'}
                className={cn({ 'border-primary': currentPage.toString() === page })}
                onClick={() => {
                  if (onChange) onChange(+page - 1)
                  if (searchParams) {
                    router.replace(`${pathname}?${qs.stringify({ ...searchParams, page })}`)
                  }
                }}
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
            size='icon'
            className={cn({ 'pointer-events-none': currentPage === totalPages })}
            variant={'outline'}
            onClick={() => {
              const nextPage = currentPage + 1
              if (onChange) onChange(nextPage - 1)
              if (searchParams) {
                router.replace(`${pathname}?${qs.stringify({ ...searchParams, page: nextPage })}`)
              }
            }}
          >
            <ChevronRight size={4} />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
