import authApiRequest from '@/apiRequests/auth.api'
import customerApiRequest from '@/apiRequests/customer.api'
import envServerConfig from '@/config/env.server'
import { HttpError } from '@/lib/errors'
import { AuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'

const authOptions: AuthOptions = {
  secret: envServerConfig.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: 'employee-credentials',
      name: 'Employee',
      credentials: {
        username: { label: 'Tên đăng nhập', type: 'text', placeholder: 'abc@gmail.com' },
        password: { label: 'Mật khẩu', type: 'password' }
      },
      async authorize(credentials) {
        if (credentials?.username && credentials.password) {
          const { username: email, password } = credentials
          try {
            const res = await authApiRequest.login({ email, password })
            return res.data as any
          } catch (error) {
            // Lỗi trả về từ http.ts file luôn là 1 HttpError (có thg con là EntityError)
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
            const loginError = new HttpError({ message: 'Đăng nhập thất bại', statusCode: 400 })
            throw new Error(JSON.stringify({ ...loginError, message: loginError.message })) // Lỗi trả về từ NextServer
          }
        }
      }
    }),
    CredentialsProvider({
      id: 'customer-credentials',
      name: 'Customer',
      credentials: {
        tableToken: { label: 'Table Token', type: 'text' }
      },
      async authorize(credentials) {
        if (credentials?.tableToken) {
          const { tableToken } = credentials
          try {
            const res = await customerApiRequest.login({ tableToken: tableToken })
            return res.data as any
          } catch (error) {
            if (error instanceof HttpError) {
              throw new Error(JSON.stringify({ ...error, message: error.message }))
            }
            const loginError = new HttpError({ message: 'Đăng nhập thất bại', statusCode: 400 })
            throw new Error(JSON.stringify({ ...loginError, message: loginError.message })) // Lỗi trả về từ NextServer
          }
        } else {
          const loginError = new HttpError({ message: 'Vui lòng quét mã để đặt bàn', statusCode: 400 })
          throw new Error(JSON.stringify({ ...loginError, message: loginError.message }))
        }
      }
    }),
    GitHubProvider({
      clientId: envServerConfig.GITHUB_ID,
      clientSecret: envServerConfig.GITHUB_SECRET
    })
  ],
  pages: { signIn: '/login' },
  session: {
    strategy: 'jwt'
  },
  // jwt: {
  //   async encode({ secret, token }) {
  //     return jwt.sign(token, secret)
  //   },
  //   async decode({ secret, token }) {
  //     return jwt.verify(token, secret)
  //   }
  // },
  callbacks: {
    // user là biến có thể nhận từ hàm authorize() trong Credentials hoặc từ Providers(Github, Google) trả về
    async jwt({ token, user, account, trigger }) {
      // Chỉnh sửa JWT Token được lưu trong cookie Browser (NextServer tạo)
      // Persist the OAuth access_token to the token right after signin
      if (trigger === 'signIn' && account?.provider !== 'credentials' && user.email) {
        const res = await authApiRequest.loginOAuth({ email: user.email })
        const { accessToken, refreshToken, account } = res.data
        token.accessToken = accessToken
        token.refreshToken = refreshToken
        token.account = account
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
    async session({ session, token }) {
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
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }
