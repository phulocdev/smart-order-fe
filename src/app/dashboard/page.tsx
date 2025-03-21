import FirstChart from '@/app/dashboard/_components/chart'
import { dashboardSearchParamsCache } from '@/app/dashboard/_lib/validation'
import AdvanceDateRange from '@/components/advance-date-range'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatNumberToVnCurrency, getVietnameseDayOfWeek } from '@/lib/utils'
import type { SearchParams } from '@/types/data-table.type'
import { getDate, getMonth, getYear } from 'date-fns'
import { DollarSignIcon } from 'lucide-react'

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function DashboardPage(props: Props) {
  const searchParams = await props.searchParams
  const search = dashboardSearchParamsCache.parse(searchParams)
  const now = new Date()
  const day = getVietnameseDayOfWeek(now)
  const date = getDate(now)
  const month = getMonth(now) + 1
  const year = getYear(now)

  return (
    <div className='px-2 py-5 md:px-4 lg:px-9'>
      <section>
        <div>
          <div className='text-2xl font-medium capitalize'>Xin chào!</div>
          <p className='mt-2 text-sm'>
            {day}, {date} tháng {month}, {year}
          </p>
        </div>
        <div className='pt-8'>
          <p className='pb-3 text-sm text-gray-600'>Chọn khoảng thời gian</p>
          <AdvanceDateRange from={search.from} to={search.to} />
        </div>
      </section>
      <section className='grid grid-cols-1 gap-x-7 py-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <div className='col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className='flex justify-between text-[15px] font-normal'>
                  <span>Hôm nay</span>
                  <span>
                    <DollarSignIcon size={18} />
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-extrabold'>{formatNumberToVnCurrency(10000000)}</p>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
        <div className='col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className='flex justify-between text-[15px] font-normal'>
                  <span>Tuần trước</span>
                  <span>
                    <DollarSignIcon size={18} />
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-extrabold'>{formatNumberToVnCurrency(20000000)}</p>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
        <div className='col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className='flex justify-between text-[15px] font-normal'>
                  <span>Tháng trước</span>
                  <span>
                    <DollarSignIcon size={18} />
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-extrabold'>{formatNumberToVnCurrency(40000000)}</p>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
      </section>

      {/* Charts */}
      <section className='grid grid-cols-2'>
        <div className='col-span-1'>
          {' '}
          <FirstChart />
        </div>
      </section>
    </div>
  )
}
