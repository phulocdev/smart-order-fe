import { useEffect, useState } from 'react'

export default function useDebounce<T>(initialValue: T, delay: number) {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    const timerId = setTimeout(() => {
      setValue(initialValue)
    }, delay)
    return () => {
      clearTimeout(timerId)
    }
  }, [initialValue, delay])
  return value
}
