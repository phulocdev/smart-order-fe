'use client'

import React from 'react'
import { CustomerLoginBodyType, customerLoginSchema } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCustomerLoginMutation } from '@/hooks/api/useAuth'
import { handleApiError } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppStore } from '@/providers/zustand-provider'

export default function CustomerLoginForm() {
  const setCustomer = useAppStore((state) => state.setCustomer)
  const router = useRouter()
  const searchParams = useSearchParams()
  const customerLoginMutation = useCustomerLoginMutation()

  const tableToken = searchParams.get('token') || ''
  const form = useForm<CustomerLoginBodyType>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      name: '',
      tableToken
    }
  })

  async function onSubmit(values: CustomerLoginBodyType) {
    try {
      const response = await customerLoginMutation.mutateAsync({ name: values.name, tableToken })
      setCustomer(response.data.customer)
      router.push('/')
    } catch (error) {
      handleApiError({ error, setError: form.setError })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))} className='space-y-5'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên khách hàng</FormLabel>
              <FormControl>
                <Input placeholder='Hãy nhập tên của bạn' {...field} />
              </FormControl>
              <FormMessage />
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
