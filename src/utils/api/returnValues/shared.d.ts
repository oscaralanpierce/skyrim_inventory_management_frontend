import { ApiResponse, type HTTPBody, type HTTPHeaders } from '../http'

export class UnauthorizedResponse extends ApiResponse {
  status: 401

  constructor(
    body: HTTPBody | undefined,
    options: { status: 401; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}
