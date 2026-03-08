/**
 *
 * Define possible response values for the SIM API.
 *
 * By default, the `status` of a Response object is a `number` type, but
 * we want to be able to narrow the range of possible responses to values
 * that might conceivably be returned by the SIM API. The reason for this
 * is that we want to be able to define specific return values of wrapper
 * functions that will indicate to TypeScript if the JSON body, if any,
 * represents a resource or an error based on the response status. When we
 * use a generic Response object whose status type is `number`, we lose the
 * guarantee that certain codes will correspond to certain body types.
 *
 */

export type SuccessStatusCode = 200 | 201 | 204

export type RedirectStatusCode = 300 | 301 | 302 | 303 | 304 | 307 | 308

export type ClientErrorStatusCode = 400 | 404 | 405 | 422

export type ServerErrorStatusCode =
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511

type HTTPStatusCode =
  | SuccessStatusCode
  | RedirectStatusCode
  | ClientErrorStatusCode
  | ServerErrorStatusCode

export type HTTPBody = BodyInit | null

export type HTTPHeaders = Headers | { [i: string]: string }

interface ApiResponseOptions {
  status?: HTTPStatusCode
  statusText?: string
  headers?: HTTPHeaders
}

export class ApiResponse extends Response {
  status: HTTPStatusCode

  constructor(body?: HTTPBody, options?: ApiResponseOptions) {
    super(body, options)
    this.status ??= 200
  }
}
