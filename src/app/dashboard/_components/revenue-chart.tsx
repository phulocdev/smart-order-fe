'use client'

import * as React from 'react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { format } from 'date-fns'

const chartConfig = {
  views: {
    label: 'Doanh thu'
  },
  totalPrice: {
    label: 'totalPrice',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig

interface RevenueChartProps {
  from: Date
  to: Date
  chartData: { date: string; totalPrice: number }[]
}

export function RevenueChart({ from, to, chartData }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>Biểu đồ doanh thu</CardTitle>
          <CardDescription>
            Được hiển thị từ ngày {format(from, 'dd/MM/yyyy')} đến ngày {format(to, 'dd/MM/yyyy')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                console.log({ value })
                const date = new Date(value)
                return `${date.getDate()}/${date.getMonth() + 1}`
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='views'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('vi-VN', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric'
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={'totalPrice'}
              type='monotone'
              stroke={`var(--color-totalPrice)`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
