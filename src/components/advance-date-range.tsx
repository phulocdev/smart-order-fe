import ButtonDateRange from '@/components/button-date-range'
import InputDateRange from '@/components/input-date-range'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYesterday,
  format,
  isAfter,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYesterday,
  subDays
} from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarRange } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import qs from 'qs'
import { DateRange } from 'react-day-picker'

const buttonDateRanges = [
  { from: startOfToday(), to: endOfToday(), content: 'Hôm nay' },
  { from: startOfYesterday(), to: endOfYesterday(), content: 'Hôm qua' },
  { from: subDays(startOfYesterday(), 6), to: endOfYesterday(), content: '7 ngày trước' },
  { from: subDays(startOfYesterday(), 13), to: endOfYesterday(), content: '14 ngày trước' },
  { from: subDays(startOfYesterday(), 29), to: endOfYesterday(), content: '30 ngày trước' },
  {
    from: startOfWeek(startOfToday(), { locale: vi }),
    to: endOfWeek(startOfToday(), { locale: vi }),
    content: 'Tuần này'
  },
  {
    from: startOfWeek(addDays(startOfToday(), -7), { locale: vi }),
    to: endOfWeek(addDays(startOfToday(), -7), { locale: vi }),
    content: 'Tuần trước'
  },
  { from: startOfMonth(startOfToday()), to: endOfMonth(startOfToday()), content: 'Tháng này' },
  {
    from: startOfMonth(addDays(startOfToday(), -30)),
    to: endOfMonth(addDays(startOfToday(), -30)),
    content: 'Tháng trước'
  }
]

interface Props<T> {
  fromDate: string
  toDate: string
  searchParams: T
}

export default function AdvanceDateRange<T>({ fromDate, toDate, searchParams }: Props<T>) {
  const pathname = usePathname()
  const router = useRouter()
  const [calendarOpen, setCalendarOpen] = useState(false)
  if (fromDate && toDate && isAfter(fromDate, toDate)) {
    ;[toDate, fromDate] = [fromDate, toDate]
  }
  const initialFromDate = startOfDay(fromDate)
  const initialToDate = endOfDay(toDate)

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: initialFromDate,
    to: initialToDate
  })

  const onInputDateRangeChange = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to })
  }

  const handleConfirm = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({ title: '🙅 Vui lòng chọn ngày bắt đầu và ngày kết thúc' })
      return
    }

    router.replace(
      `${pathname}?${qs.stringify({ ...searchParams, from: format(dateRange.from, 'yyyy-M-dd'), to: format(dateRange.to, 'yyyy-M-dd') })}`
    )
    setCalendarOpen(false)
  }

  return (
    <Popover open={calendarOpen}>
      <PopoverTrigger asChild>
        <Button
          id='date'
          variant={'outline'}
          className={cn('w-[250px] justify-start text-left font-medium', !dateRange && 'text-muted-foreground')}
          onClick={() => setCalendarOpen(true)}
        >
          <CalendarRange />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'dd/MM/yyyy', { locale: vi })} -{'  '}
                {format(dateRange.to, 'dd/MM/yyyy', { locale: vi })}
              </>
            ) : (
              format(dateRange.from, 'dd/MM/yyyy', { locale: vi })
            )
          ) : (
            <span className='text-sm'>Chọn ngày</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <div className='flex items-stretch gap-x-6 px-8 py-5'>
          <div className='flex flex-col items-end py-2'>
            <InputDateRange
              initialFromDate={dateRange?.from ?? initialFromDate}
              initialToDate={dateRange?.to ?? initialToDate}
              onChange={onInputDateRangeChange}
            />
            <Calendar
              initialFocus
              mode='range'
              defaultMonth={dateRange?.from}
              locale={vi}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </div>
          <div className='flex flex-col gap-y-3'>
            {buttonDateRanges.map((range, index) => (
              <ButtonDateRange
                key={index}
                dateRange={dateRange}
                setDateRange={setDateRange}
                from={range.from}
                to={range.to}
                content={range.content}
              />
            ))}
          </div>
        </div>
        <div className='flex justify-end gap-x-4 px-8 pb-6 pt-4'>
          <Button variant={'ghost'} onClick={() => setCalendarOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirm}>Xác nhận</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
