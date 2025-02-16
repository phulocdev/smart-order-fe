import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CustomerLoginForm from '@/app/(public)/_components/customer-login-form'

// http://localhost:3000/tables/1?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZU51bWJlciI6MSwiaWF0IjoxNzM4NTg3ODI4fQ.jWvcbW58_3ytB4kvPwfsreS189y0Q-DdjfjBVwLi6Po

export default function CustomerLoginPage() {
  return (
    <div className='max-w-[400px] shrink-0 grow'>
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Đăng nhập dành cho khách hàng</CardTitle>
          <CardDescription>Vui lòng nhập tên của bạn để có thể gọi món</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerLoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
