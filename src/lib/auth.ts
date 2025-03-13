interface CookieOptions {
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  partitioned?: boolean
  path?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  type?: string
}

export function createAuthCookieString(name: string, value: string, options: CookieOptions = {}): string {
  let cookieString = `${name}=${value}`

  if (options.domain) {
    cookieString += `; Domain=${options.domain}`
  }
  if (options.expires) {
    cookieString += `; Expires=${options.expires.toUTCString()}`
  }
  if (options.httpOnly) {
    cookieString += `; HttpOnly`
  }
  if (options.maxAge) {
    cookieString += `; Max-Age=${options.maxAge}`
  }
  if (options.partitioned) {
    cookieString += `; Partitioned`
  }
  if (options.path) {
    cookieString += `; Path=${options.path}`
  }
  if (options.secure) {
    cookieString += `; Secure`
  }
  if (options.sameSite) {
    const validSameSiteValues: ('Strict' | 'Lax' | 'None')[] = ['Strict', 'Lax', 'None']
    if (validSameSiteValues.includes(options.sameSite)) {
      cookieString += `; SameSite=${options.sameSite}`
      if (options.sameSite === 'None' && !options.secure) {
        throw new Error('SameSite=None requires Secure attribute')
      }
    }
  }
  if (options.type) {
    cookieString += `; ${options.type}`
  }

  return cookieString
}
