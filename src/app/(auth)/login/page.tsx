import LoginForm from '@/app/(auth)/login/login-form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Page() {
  return (
    <div className='max-w-[400px] shrink-0 grow'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Đăng nhập</CardTitle>
          <CardDescription>Chỉ có nhân viên của quán ăn mới có thể sử đăng nhập vào hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter>
          <Link href={'/register'} className='w-full text-center text-sm text-red-500 dark:text-red-800'>
            Bạn chưa có tài khoản?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
