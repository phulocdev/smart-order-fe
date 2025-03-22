import authApiRequest from '@/apiRequests/auth.api'
import customerApiRequest from '@/apiRequests/customer.api'
import envServerConfig from '@/config/env.server'
import { SocialProvider } from '@/constants/enum'
import { HttpError } from '@/lib/errors'
import { SESSION_TIMEOUT } from '@/middleware'
import { AuthOptions, getServerSession, Session } from 'next-auth'
import { type JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

const authOptions: AuthOptions = {
  secret: envServerConfig.NEXTAUTH_SECRET,
  pages: { signIn: '/login' },
  session: {
    strategy: 'jwt',
    maxAge: SESSION_TIMEOUT
  },
  jwt: {
    maxAge: SESSION_TIMEOUT
  },
  providers: [
    CredentialsProvider({
      id: 'employee-credentials',
      name: 'Employee',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'loc01@gmail.com' },
        password: { label: 'Password', type: 'password', placeholder: '123123123' }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials.password) {
          const body = {
            email: credentials.email,
            password: credentials.password
          }
          try {
            const res = await authApiRequest.login(body)
            const user = res.data as any
            return user
          } catch (error) {
            // Lỗi trả về từ http.ts file luôn là 1 HttpError (có thg con là EntityError) - Lỗi từ Backend Server
            // Bad Request / Unauthorzied / ERRORCONNECT thì tương tự vs Http Error
            if (error instanceof HttpError) {
              // Phải chủ động thêm field message trong Error Obj bởi vì nếu ta JSON.stringify() error của NextAuth
              // thì sẽ không có  message field

              // NextServer sẽ gọi API đến Backend API -> dùng file http 1 lần
              // Còn việc NextClient gọi đến NextServer để login thông qua hàm signIn (NextAuth) thì ta không sử dụng file Http
              // Cho nên Error ở dạng JSON sau không thể nào là 1 instance of Entity Error được
              // -> không thể nhảy vào case setError lên form trong hàm handleApiError
              // throw new EntityError({ message, errors })

              // throw new Error(JSON.stringify(error)) -> Thiếu messsage field trong chuỗi JSON trả về - Không rõ lý do tại sao

              // Đảm bảo việc luôn có message trong object error trả về
              throw new Error(JSON.stringify({ ...error, message: error.message }))
            }
            // Lỗi trả về từ NextServer
            const loginError = new HttpError({ message: 'Đăng nhập thất bại', statusCode: 400 })
            throw new Error(JSON.stringify({ ...loginError, message: loginError.message }))
          }
        } else {
          const loginError = new HttpError({ message: 'Vui lòng nhập email và password', statusCode: 400 })
          throw new Error(JSON.stringify({ ...loginError, message: loginError.message }))
        }
      }
    }),
    CredentialsProvider({
      id: 'customer-credentials',
      name: 'Customer',
      credentials: {
        tableToken: { label: 'Table token', type: 'text' }
      },
      async authorize(credentials) {
        if (credentials?.tableToken) {
          const { tableToken } = credentials
          try {
            const res = await customerApiRequest.login({ tableToken: tableToken })
            const user = res.data as any
            return user
          } catch (error) {
            if (error instanceof HttpError) {
              throw new Error(JSON.stringify({ ...error, message: error.message }))
            }
            const loginError = new HttpError({ message: 'Đăng nhập thất bại', statusCode: 400 })
            throw new Error(JSON.stringify({ ...loginError, message: loginError.message })) // Lỗi trả về từ NextServer
          }
        } else {
          const loginError = new HttpError({ message: 'Vui lòng quét mã QR để đặt bàn', statusCode: 400 })
          throw new Error(JSON.stringify({ ...loginError, message: loginError.message }))
        }
      }
    }),
    GitHubProvider({
      clientId: envServerConfig.GITHUB_ID,
      clientSecret: envServerConfig.GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: envServerConfig.GOOGLE_CLIENT_ID,
      clientSecret: envServerConfig.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider && !['employee-credentials', 'customer-credentials'].includes(account.provider)) {
        try {
          await authApiRequest.loginOAuth({
            email: user.email ?? '',
            accessToken: account?.access_token ?? '',
            provider: account.provider as SocialProvider,
            avatarUrl: user.image ?? ''
          })
          return true
        } catch (error: any) {
          return `/login?error=${error.message}`
        }
      }
      return true
    },
    // user là biến có thể nhận từ hàm authorize() trong Credentials hoặc từ Providers(Github, Google) trả về
    async jwt({ token, user, account, trigger }): Promise<JWT> {
      // Chỉnh sửa JWT Token được lưu trong cookie Browser (NextServer tạo)
      // Persist the OAuth access_token to the token right after signin - OAuth
      if (trigger === 'signIn' && account?.provider !== 'credentials' && user.email) {
        const res = await authApiRequest.loginOAuth({
          email: user.email ?? '',
          accessToken: account?.access_token ?? '',
          provider: SocialProvider.Google,
          avatarUrl: user.image ?? ''
        })
        const { accessToken, refreshToken, account: accountData } = res.data
        token.accessToken = accessToken
        token.refreshToken = refreshToken
        token.account = accountData
      }
      // Nhân viên đăng nhập
      if (trigger === 'signIn' && account?.provider === 'employee-credentials' && user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.account = user.account
      }

      // Khách hàng đăng nhập
      if (trigger === 'signIn' && account?.provider === 'customer-credentials' && user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.customer = user.customer
      }

      return token
    },
    async session({ session, token }): Promise<Session> {
      if (!token) return session
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      if (token.customer) session.customer = token.customer
      else if (token.account) session.account = token.account
      return session
    }
  }
}

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getAuthSession = async (): Promise<Session | null> => await getServerSession(authOptions)

export { authOptions, getAuthSession }
