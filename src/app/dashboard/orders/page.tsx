import { DataTable } from './data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Page() {
  return (
    <div className='mx-auto px-20 py-8'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-medium'>Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable />
        </CardContent>
      </Card>
    </div>
  )
}
