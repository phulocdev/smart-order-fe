import React, { useEffect, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { NotebookPen } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Prop {
  initialValue?: string
  dishTitle?: string
  onSubmit?: (noteContent: string) => void
  className?: string
  resetAfterSubmit?: boolean
}

export default function OrderNote({
  initialValue = '',
  dishTitle = 'Default order note title',
  onSubmit,
  className = ''
}: Prop) {
  const [note, setNote] = useState<string>(initialValue)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setNote(initialValue)
  }, [initialValue])

  const confirmNote = () => {
    if (textAreaRef.current) {
      const noteContent = textAreaRef.current.value.trim()
      setNote(noteContent)
      if (onSubmit) {
        onSubmit(noteContent)
      }
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className={cn('relative rounded-md p-2 hover:bg-gray-200', className)}>
          {Boolean(note) && <div className='absolute right-0 top-[2px] h-[10px] w-[10px] rounded-full bg-red-500' />}
          <NotebookPen size={15} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ghi chú món: {dishTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            <Textarea
              ref={textAreaRef}
              defaultValue={note}
              placeholder='Hãy nhập ghi chú'
              rows={4}
              className='text-black'
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={confirmNote}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
