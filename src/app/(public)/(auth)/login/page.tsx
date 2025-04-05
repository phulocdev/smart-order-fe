import LoginForm from '@/app/(public)/(auth)/login/login-form'
import { getAuthSession } from '@/auth'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
          <CardTitle className='text-xl font-semibold'>Đăng nhập</CardTitle>
          <CardDescription>Chỉ có nhân viên mới có thể đăng nhập vào hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter>
          {/* <Link href={'/register'} className='w-full text-center text-sm text-red-500 dark:text-red-800'>
            Bạn chưa có tài khoản?
          </Link> */}
          <div className='w-full text-center text-xs italic'>CS504070 - Spring, 2025</div>
        </CardFooter>
      </Card>
    </div>
  )
}
