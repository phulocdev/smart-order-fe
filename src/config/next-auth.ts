export const SIGNIN_SUB_URL = '/api/auth/signin'
export const SESSION_TIMEOUT = 60 * 60 * 24 * 7 // 7 days
export const TOKEN_REFRESH_BUFFER_SECONDS = 60 * 5 // 5 minutes
export const SESSION_SECURE = process.env.NEXTAUTH_URL?.startsWith('https://')
export const SESSION_COOKIE = SESSION_SECURE ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
