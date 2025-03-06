import { OrderTable } from '@/app/dashboard/orders/order-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page() {
  return (
    <div className='mx-auto px-20 py-8'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-medium'>Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <DataTable useDataQuery={useGetOrderListQuery} columns={columns} /> */}
          <OrderTable />
        </CardContent>
      </Card>
    </div>
  )
}
