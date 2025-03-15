import { z } from 'zod'

// Dùng riêng cho môi trường server
const envServerConfigSchema = z.object({
  GITHUB_ID: z.string({ message: 'Hãy bổ sung GITHUB_ID trong file .env' }),
  GITHUB_SECRET: z.string({ message: 'Hãy bổ sung GITHUB_SECRET trong file .env' }),
  GOOGLE_CLIENT_ID: z.string({ message: 'Hãy bổ sung GOOGLE_CLIENT_ID trong file .env' }),
  GOOGLE_CLIENT_SECRET: z.string({ message: 'Hãy bổ sung GOOGLE_CLIENT_SECRET trong file .env' }),
  NEXTAUTH_SECRET: z.string({ message: 'Hãy bổ sung NEXTAUTH_SECRET trong file .env' }),
  NEXTAUTH_URL: z.string({ message: 'Hãy bổ sung NEXTAUTH_URL trong file .env' })
})

const { success, data, error } = envServerConfigSchema.safeParse({
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL
})

if (!success) {
  console.log(error)
  throw new Error('Các giá trị trong file .env.server không hợp lệ')
}
const envServerConfig = data

export default envServerConfig
