import { type ApiError } from '../../types/errors'

export class AuthorizationError implements ApiError {
  readonly code: 401
  readonly message: string
  readonly name: 'AuthorizationError'

  constructor(message: string = '401 Unauthorized') {
    this.code = 401
    this.name = 'AuthorizationError'
    this.message = message

    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }
}

export class NotFoundError implements ApiError {
  readonly code: 404
  readonly message: string
  readonly name: 'NotFoundError'

  constructor(message: string = '404 Not Found') {
    this.code = 404
    this.name = 'NotFoundError'
    this.message = message

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class MethodNotAllowedError implements ApiError {
  readonly code: 405
  readonly message: string
  readonly name: 'MethodNotAllowedError'

  constructor(message: string = '405 Method Not Allowed') {
    this.code = 405
    this.name = 'MethodNotAllowedError'
    this.message = message

    Object.setPrototypeOf(this, MethodNotAllowedError.prototype)
  }
}

export class UnprocessableEntityError implements ApiError {
  readonly code: 422
  readonly message: string | string[]
  readonly name: 'UnprocessableEntityError'

  constructor(message: string | string[] = '422 Unprocessable Entity') {
    this.code = 422
    this.name = 'UnprocessableEntityError'
    this.message = message

    Object.setPrototypeOf(this, UnprocessableEntityError.prototype)
  }
}

export class InternalServerError implements ApiError {
  readonly code: 500
  readonly message: string
  readonly name: 'InternalServerError'

  constructor(message: string = '500 Internal Server Error') {
    this.code = 500
    this.name = 'InternalServerError'
    this.message = message

    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}
