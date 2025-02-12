'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CircleMinus, CirclePlus } from 'lucide-react'
import React, { useState } from 'react'

interface Props {
  initialValue?: number
}

export default function QuantitySelect({ initialValue = 0 }: Props) {
  const [value, setValue] = useState<number>(initialValue)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = Number(e.target.value)
    if (!isNaN(numberValue)) {
      setValue(numberValue)
    }
  }

  return (
    <div className='flex items-center gap-x-2'>
      <Button variant={'outline'} size={'icon'} className='shrink-0 grow'>
        <CircleMinus />
      </Button>
      <Input
        value={value}
        className='grow text-center placeholder:text-center'
        pattern='[0-9]'
        onChange={handleInputChange}
      />
      <Button variant={'outline'} size={'icon'} className='shrink-0 grow'>
        <CirclePlus />
      </Button>
    </div>
  )
}
