'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { CircleMinus, CirclePlus } from 'lucide-react'
import React, { useState } from 'react'

interface Props {
  initialValue?: number
  max?: number
  onChange?: (quantity: number) => void
  className?: string
}

export default function QuantitySelect({ initialValue = 1, max, onChange, className = '' }: Props) {
  const [quantity, setQuantity] = useState<number>(initialValue)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = Number(e.target.value)
    if (isNaN(numberValue)) return

    if (max && numberValue > max) {
      setQuantity(max)
      if (onChange) onChange(max)
      toast({ title: `🔴 Số lượng món ăn phải < ${max}` })
      return
    }

    if (numberValue < 1) {
      setQuantity(1)
      if (onChange) onChange(1)
      toast({ title: '🔴 Số lượng món ăn phải > 0' })
      return
    }

    setQuantity(numberValue)
    if (onChange) onChange(numberValue)
  }

  const handleIncrease = () => {
    const newQuantity = quantity + 1
    if (max && newQuantity > max) {
      toast({ title: `🔴 Số lượng món ăn phải < ${max}` })
      return
    }
    setQuantity(newQuantity)
    if (onChange) onChange(newQuantity)
  }

  const handleDecrease = () => {
    const newQuantity = quantity - 1
    if (newQuantity < 1) {
      toast({ title: '🔴 Số lượng món ăn phải > 0' })
      return
    }
    setQuantity(newQuantity)
    if (onChange) onChange(newQuantity)
  }

  return (
    <div className={cn('inline-flex items-center gap-x-2', className)}>
      <Button variant={'outline'} size={'icon'} className='shrink-0' onClick={handleDecrease}>
        <CircleMinus />
      </Button>
      <Input
        value={quantity}
        className='text-center placeholder:text-center'
        pattern='[0-9]'
        onChange={handleInputChange}
      />
      <Button variant={'outline'} size={'icon'} className='shrink-0' onClick={handleIncrease}>
        <CirclePlus />
      </Button>
    </div>
  )
}
