'use client'
import React from 'react'
import { LoginBodyType, loginSchema } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useLoginMutation } from '@/hooks/api/useAuth'
import { handleApiError } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/providers/zustand-provider'

export default function LoginForm() {
  const setAccount = useAppStore((state) => state.setAccount)
  const router = useRouter()
  const loginMutation = useLoginMutation()

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: LoginBodyType) {
    try {
      const response = await loginMutation.mutateAsync(values)
      setAccount(response.data.account)
      router.push('/dashboard')
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
        <Button className='w-full' type='submit'>
          Đăng nhập
        </Button>
      </form>
    </Form>
  )
}
