import React, { useMemo, useState } from 'react'
import { DATE_RANGE_SELECT } from '@/constants/constants'

interface Props {
  initialFromDate: Date
  initialToDate: Date
  onChange?: ({ from, to }: { from: Date; to: Date }) => void
}

export default function InputDateRange({ initialFromDate, initialToDate, onChange }: Props) {
  const [from, to] = useMemo(
    () => [
      {
        day: initialFromDate.getDate(),
        month: initialFromDate.getMonth() + 1,
        year: initialFromDate.getFullYear()
      },
      {
        day: initialToDate.getDate(),
        month: initialToDate.getMonth() + 1,
        year: initialToDate.getFullYear()
      }
    ],
    [initialFromDate, initialToDate]
  )

  const [isValid, setIsValid] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState({
    from,
    to
  })

  React.useEffect(() => {
    setDateRange({
      from,
      to
    })
    setIsValid(false)
  }, [from, to])

  React.useEffect(() => {
    if (isValid) {
      const { from, to } = dateRange
      const fromDate = new Date(from.year, from.month - 1, from.day)
      const toDate = new Date(to.year, to.month - 1, to.day)
      if (onChange) {
        onChange({ from: fromDate, to: toDate })
      }
    }
  }, [dateRange, isValid, onChange])

  const handleInputChange =
    (type: 'from' | 'to', name: 'day' | 'month' | 'year') => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      const numValue = Number(value)

      // Ngăn chặn nhập kí tự chữ và số ngày tháng năm không hợp lệ
      if (
        Number.isNaN(numValue) ||
        ((name === 'day' || name === 'month') && value.length > 2) ||
        (name === 'year' && value.length > 4)
      ) {
        return
      }

      const updatedDate = { ...dateRange[type], [name]: value }
      setIsValid(false)
      setDateRange((prev) => ({ ...prev, [type]: updatedDate }))
    }

  const validateInputRange = (type: 'from' | 'to', name: 'day' | 'month' | 'year') => () => {
    const initialDate = type === 'from' ? initialFromDate : initialToDate
    const { day, month, year } = dateRange[type]

    setDateRange((prev) => {
      if (name === 'day' && (day < 1 || day > 32)) {
        return { ...prev, [type]: { day: initialDate.getDate(), month, year } }
      }
      if (name === 'month' && (month < 1 || month > 12)) {
        return { ...prev, [type]: { day, month: initialDate.getMonth() + 1, year } }
      }
      if (name === 'year' && (year < DATE_RANGE_SELECT.MIN_YEAR || year > DATE_RANGE_SELECT.MAX_YEAR)) {
        return { ...prev, [type]: { day, month, year: initialDate.getFullYear() } }
      }
      setIsValid(true)
      return prev
    })
  }

  return (
    <div className='flex items-center gap-x-3'>
      <div className='flex items-center rounded-md border border-gray-200 pl-2 pr-3 text-sm font-normal text-gray-800'>
        <input
          className='w-5 py-1 outline-none'
          placeholder='D'
          value={dateRange['from'].day}
          onChange={handleInputChange('from', 'day')}
          onBlur={validateInputRange('from', 'day')}
        />
        <span className='mr-2 block text-xs'>/</span>
        <input
          className='w-5 py-1 outline-none'
          placeholder='M'
          value={dateRange['from'].month}
          onChange={handleInputChange('from', 'month')}
          onBlur={validateInputRange('from', 'month')}
        />
        <span className='mr-1 block text-xs'>/</span>
        <input
          className='w-9 py-1 outline-none'
          placeholder='Y'
          value={dateRange['from'].year}
          onChange={handleInputChange('from', 'year')}
          onBlur={validateInputRange('from', 'year')}
        />
      </div>
      <span> - </span>
      <div className='flex items-center rounded-md border border-gray-200 pl-2 pr-3 text-sm font-normal text-gray-800'>
        <input
          className='w-5 py-1 outline-none'
          placeholder='D'
          value={dateRange['to'].day}
          onChange={handleInputChange('to', 'day')}
          onBlur={validateInputRange('to', 'day')}
        />
        <span className='mr-2 block text-xs'>/</span>
        <input
          className='w-5 py-1 outline-none'
          placeholder='M'
          value={dateRange['to'].month}
          onChange={handleInputChange('to', 'month')}
          onBlur={validateInputRange('to', 'month')}
        />
        <span className='mr-1 block text-xs'>/</span>
        <input
          className='w-9 py-1 outline-none'
          placeholder='Y'
          value={dateRange['to'].year}
          onChange={handleInputChange('to', 'year')}
          onBlur={validateInputRange('to', 'year')}
        />
      </div>
    </div>
  )
}
