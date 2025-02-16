import { columns } from './columns'
import { DataTable } from './data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DemoPage() {
  return (
    <div className='mx-auto px-20 py-8'>
      <Card>
        <CardHeader>
          <CardTitle>Quản lý đơn hàng</CardTitle>
          <CardDescription>Theo dõi và quản lý đơn hàng ABC Restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} />
        </CardContent>
      </Card>
    </div>
  )
}
