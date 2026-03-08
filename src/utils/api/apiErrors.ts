import { type ApiError } from '../../types/errors'

export class AuthorizationError extends Error implements ApiError {
  readonly code: 401
  override readonly message: string
  override readonly name: 'AuthorizationError'

  constructor(message: string = '401 Unauthorized') {
    super(message)
    this.code = 401
    this.name = 'AuthorizationError'
    this.message = message

    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }
}

export class NotFoundError extends Error implements ApiError {
  readonly code: 404
  override readonly message: string
  override readonly name: 'NotFoundError'

  constructor(message: string = '404 Not Found') {
    super(message)
    this.code = 404
    this.name = 'NotFoundError'
    this.message = message

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class MethodNotAllowedError extends Error implements ApiError {
  readonly code: 405
  override readonly message: string
  override readonly name: 'MethodNotAllowedError'

  constructor(message: string = '405 Method Not Allowed') {
    super(message)
    this.code = 405
    this.name = 'MethodNotAllowedError'
    this.message = message

    Object.setPrototypeOf(this, MethodNotAllowedError.prototype)
  }
}

export class UnprocessableEntityError extends Error implements ApiError {
  readonly code: 422
  override readonly message: string | string[]
  override readonly name: 'UnprocessableEntityError'

  constructor(message: string | string[] = '422 Unprocessable Entity') {
    super(Array.isArray(message) ? message.join(', ') : message)
    this.code = 422
    this.name = 'UnprocessableEntityError'
    this.message = message

    Object.setPrototypeOf(this, UnprocessableEntityError.prototype)
  }
}

export class InternalServerError extends Error implements ApiError {
  readonly code: 500
  override readonly message: string
  override readonly name: 'InternalServerError'

  constructor(message: string = '500 Internal Server Error') {
    super(message)
    this.code = 500
    this.name = 'InternalServerError'
    this.message = message

    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}
