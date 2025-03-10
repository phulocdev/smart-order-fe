import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email không được bỏ trống' })
    .email({ message: 'Email không đúng định dạng' }),
  password: z.coerce
    .string()
    .trim()
    .min(1, { message: 'Mật khẩu không được bỏ trống' })
    .min(8, { message: 'Yêu cầu tối thiểu 8 kí tự' })
    .max(40, { message: 'Yêu cầu tối đa 40 kí tự' })
})

export type LoginBodyType = z.infer<typeof loginSchema>

export type LoginOAuthBodyType = Pick<LoginBodyType, 'email'>

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { message: 'Họ tên không được bỏ trống' })
    .min(8, { message: 'Yêu cầu tối thiểu 8 kí tự' })
    .max(40, { message: 'Yêu cầu tối đa 40 kí tự' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email không được bỏ trống' })
    .email({ message: 'Email không đúng định dạng' }),
  password: z.coerce
    .string()
    .trim()
    .min(1, { message: 'Mật khẩu không được bỏ trống' })
    .min(8, { message: 'Yêu cầu tối thiểu 8 kí tự' })
    .max(40, { message: 'Yêu cầu tối đa 40 kí tự' })
})

export type RegisterBodyType = z.infer<typeof registerSchema>

export const customerLoginSchema = z.object({
  tableToken: z.string().trim()
})

export type CustomerLoginBodyType = z.infer<typeof customerLoginSchema>
