import LoginForm from '@/app/(public)/(auth)/login/login-form'
import { getAuthSession } from '@/auth'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getAuthSession()
  if (session) {
    redirect('/')
  }
  return (
    <div className='max-w-[25rem] shrink-0 grow'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Đăng nhập</CardTitle>
          <CardDescription>Chỉ có nhân viên mới có thể đăng nhập vào hệ thống</CardDescription>
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
