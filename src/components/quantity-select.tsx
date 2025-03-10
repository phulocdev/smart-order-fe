'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CircleMinus, CirclePlus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface Props {
  initialValue?: number
  max?: number
  min?: number
  className?: string
  onChange?: (quantity: number) => void
}

export default function QuantitySelect({ initialValue = 1, max, min = 1, onChange, className = '' }: Props) {
  const [quantity, setQuantity] = useState<number>(initialValue)

  useEffect(() => {
    setQuantity(initialValue)
  }, [initialValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = Number(e.target.value)
    if (isNaN(numberValue)) return

    if (max && numberValue > max) {
      setQuantity(max)
      if (onChange) onChange(max)
      toast(`🔴 Số lượng món ăn phải <= ${max}`)
      return
    }

    if (numberValue < min) {
      setQuantity(min)
      if (onChange) onChange(min)
      toast('🔴 Số lượng món ăn không hợp lệ')
      return
    }

    setQuantity(numberValue)
    if (onChange) onChange(numberValue)
  }

  const handleIncrease = () => {
    const newQuantity = quantity + 1
    if (max && newQuantity > max) {
      toast(`🔴 Số lượng món ăn phải <= ${max}`)
      return
    }
    setQuantity(newQuantity)
    if (onChange) onChange(newQuantity)
  }

  const handleDecrease = () => {
    const newQuantity = quantity - 1
    if (newQuantity < min) {
      toast('🔴 Số lượng món ăn không hợp lệ')
      return
    }
    setQuantity(newQuantity)
    if (onChange) onChange(newQuantity)
  }

  return (
    <div className={cn('inline-flex items-center gap-x-2', className)}>
      <Button type='button' variant={'outline'} size={'icon'} className='shrink-0' onClick={handleDecrease}>
        <CircleMinus />
      </Button>
      <Input
        value={quantity}
        className='bg-white text-center placeholder:text-center'
        pattern='[0-9]'
        onChange={handleInputChange}
      />
      <Button type='button' variant={'outline'} size={'icon'} className='shrink-0' onClick={handleIncrease}>
        <CirclePlus />
      </Button>
    </div>
  )
}
