'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ENTITY_ERROR_STATUS_CODE, EntityError, HttpError } from '@/lib/errors'
import { cn, getAccessTokenFromLS, handleApiError, setAccessTokenToLS } from '@/lib/utils'
import { LoginBodyType, loginSchema } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'

export default function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  React.useEffect(() => {
    debugger
    if (session && !getAccessTokenFromLS()) {
      setAccessTokenToLS(session.accessToken)
    }
  }, [session])

  async function onSubmit(values: LoginBodyType) {
    try {
      setIsLoading(true)
      const { email, password } = values
      const response = await signIn('employee-credentials', {
        redirect: false,
        username: email,
        password
      }).finally(() => {
        setIsLoading(false)
      })

      if (response?.error) {
        const error = JSON.parse(response.error) as HttpError
        if (error.statusCode === ENTITY_ERROR_STATUS_CODE) {
          const { message, errors } = error as EntityError
          // Reformat lại objError - được parse từ chuỗi JSON sang obj EntityError để có thể xử lý đúng dạng lỗi ở hàm handleApiError()
          // Chỉ riêng với EntityError thì mới cần làm vậy | Những error còn lại toast lên là ok rồi
          throw new EntityError({ message, errors })
        }
        throw error
      }
      router.replace('/')
    } catch (error) {
      handleApiError({ error, setError: form.setError })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Hãy nhập email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type='password' placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link href={'/forgot-password'} className='mt-1 block text-sm text-red-500 dark:text-red-800'>
                Quên mật khẩu?
              </Link>
            </FormItem>
          )}
        />
        <Button
          className={cn('w-full', {
            'cursor-not-allowed opacity-80': isLoading
          })}
          type='submit'
        >
          {isLoading && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
          Đăng nhập
        </Button>
        <Button
          type='button'
          variant={'outline'}
          className='w-full'
          onClick={() => signIn('github', { callbackUrl: '/' })}
        >
          Đăng nhập với Github
        </Button>
      </form>
    </Form>
  )
}
