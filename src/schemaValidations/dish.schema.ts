import { DishStatus } from '@/constants/enum'
import { z } from 'zod'

export const createDishSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Tên món ăn không được  bỏ trống' })
    .max(40, 'Tên món ăn chỉ được tối đa 40 kí tự'),
  description: z.string().trim().max(300, 'Mô tả chỉ được tối đa 300 kí tự'),
  price: z.coerce
    .string({ required_error: 'Giá tiền không được bỏ trống' })
    .trim()
    .transform((val) => parseInt(val))
    .pipe(z.number({ message: 'Giá tiền phải là định dạng số' }).min(1, { message: 'Giá tiền phải > 0' })),
  status: z.nativeEnum(DishStatus, {
    message: 'Trạng thái món ăn không hợp lệ',
    required_error: 'Trạng thái món ăn không được bỏ trống'
  }),
  category: z.string().trim().min(1, { message: 'Danh mục không được  bỏ trống' }),
  imageUrl: z
    .string({ required_error: 'Hình ảnh không được  bỏ trống' })
    .trim()
    .min(1, { message: 'Hình ảnh không được  bỏ trống' })
    .url({ message: 'Hình ảnh không đúng dịnh dạng url' })
})

export type CreateDishBodyType = z.infer<typeof createDishSchema>

export const updateDishSchema = createDishSchema.partial()

export type UpdateDishBodyType = z.infer<typeof updateDishSchema>
