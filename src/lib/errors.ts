export const ENTITY_ERROR_STATUS_CODE = 422
export const UNAUTHORIZED_ERROR_STATUS_CODE = 401

export class HttpError extends Error {
  message: string
  statusCode: number
  constructor({ message, statusCode }: { message: string; statusCode: number }) {
    super(message)
    this.message = message
    this.statusCode = statusCode
  }
}

// export class EntityError extends HttpError {
//   message: string
//   errors: { field: string; message: string }[]
//   statusCode: number = ENTITY_ERROR_STATUS_CODE
//   constructor({ message, errors }: { message: string; errors?: { field: string; message: string }[] }) {
//     super({ message, statusCode: ENTITY_ERROR_STATUS_CODE })
//     this.errors = errors || []
//     this.message = message
//   }
// }

export class EntityError extends HttpError {
  errors: { field: string; message: string }[]

  constructor({ message, errors = [] }: { message: string; errors?: { field: string; message: string }[] }) {
    super({ message, statusCode: ENTITY_ERROR_STATUS_CODE })
    this.errors = errors
  }
}
