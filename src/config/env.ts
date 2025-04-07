import { z } from 'zod'

const envConfigSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.string({ message: 'Hãy bổ sung NEXT_PUBLIC_BACKEND_URL trong file .env' }),
  NEXT_PUBLIC_NEXT_API_URL: z.string({ message: 'Hãy bổ sung NEXT_PUBLIC_NEXT_API_URL trong file .env' }),
  NEXT_PUBLIC_WEBSOCKET_URL: z.string({ message: 'Hãy bổ sung NEXT_PUBLIC_WEBSOCKET_URL trong file .env' }),
  NEXT_PUBLIC_API_KEY: z.string({ message: 'Hãy bổ sung API_KEY trong file .env' })
})

const { success, data, error } = envConfigSchema.safeParse({
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_NEXT_API_URL: process.env.NEXT_PUBLIC_NEXT_API_URL,
  NEXT_PUBLIC_WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
  NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY
})

if (!success) {
  console.log(error)
  throw new Error('Các giá trị trong file .env không hợp lệ')
}
const envConfig = data

export default envConfig
