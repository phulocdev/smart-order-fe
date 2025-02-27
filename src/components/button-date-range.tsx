import { Button } from '@/components/ui/button'
import { isSameDay } from 'date-fns'
import { Check } from 'lucide-react'
import React from 'react'
import { DateRange } from 'react-day-picker'

interface Props {
  dateRange: DateRange | undefined
  setDateRange: (value: React.SetStateAction<DateRange | undefined>) => void
  from: Date
  to: Date
  content: string
}

export default function ButtonDateRange({ dateRange, setDateRange, from, to, content }: Props) {
  return (
    <Button
      variant={'ghost'}
      className='justify-end'
      onClick={() => {
        setDateRange({ from, to })
      }}
    >
      <div className='h-4 w-4'>
        {dateRange?.from && dateRange.to && isSameDay(dateRange.from, from) && isSameDay(dateRange.to, to) && <Check />}
      </div>
      {content}
    </Button>
  )
}
