import { z } from 'zod'

export const customerSchema = z.object({
  tableNumber: z.number({ required_error: 'Số bàn không được bỏ trống' })
})

export type CreateCustomerBodyType = z.infer<typeof customerSchema>
