import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ITable } from '@/types/backend.type'
import Image from 'next/image'

interface Props {
  table: ITable
  onSelectTable: (tableNumber: number) => void
  className?: string | undefined
  classNameTitle?: string | undefined
  isSelected: boolean
  isServing: boolean
}

export default function TableCard({
  table,
  onSelectTable,
  className = '',
  classNameTitle = '',
  isSelected,
  isServing
}: Props) {
  return (
    <div
      className={cn(
        'relative flex aspect-square flex-col items-center justify-center rounded-md border border-blue-200 bg-blue-50 transition-colors duration-300',
        className,
        {
          'bg-blue-800': isSelected
        }
      )}
      onClick={() => {
        onSelectTable(table.number)
      }}
    >
      <Image
        sizes='100vw'
        width={0}
        height={0}
        src={isSelected ? '/table-select.png' : '/table-unselect.png'}
        alt='table'
        className='aspect-square w-20 object-cover'
      />
      <div
        className={cn('mt-1 text-[15px] font-semibold text-blue-800', classNameTitle, {
          'text-white': isSelected
        })}
      >
        Bàn {table.number}
      </div>
      {isSelected && (
        <Badge className='absolute right-1 top-1' variant={'ghost'}>
          {isServing ? 'Đang phục vụ' : 'Chưa hoàn tất'}
        </Badge>
      )}
    </div>
  )
}
