import { ApiResponse, type HTTPBody, type HTTPHeaders } from '../http'
import { type ErrorObject, type ResponsePlaythrough } from '../../../types/apiData'
import { UnauthorizedResponse } from './shared'

/**
 *
 * Types used for POST /playthroughs endpoint
 *
 */

class PostPlaythroughsSuccessResponse extends ApiResponse {
  status: 201

  constructor(
    body: HTTPBody | undefined,
    options: { status: 201; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostPlaythroughsErrorResponse extends ApiResponse {
  status: 422 | 500

  constructor(
    body: HTTPBody | undefined,
    options: { status: 422 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type PostPlaythroughsResponse =
  | UnauthorizedResponse
  | PostPlaythroughsSuccessResponse
  | PostPlaythroughsErrorResponse
export type PostPlaythroughsReturnValue =
  | { status: 422 | 500; json: ErrorObject }
  | { status: 201; json: ResponsePlaythrough }

/**
 *
 * Types used for GET /playthroughs endpoint
 *
 */

class GetPlaythroughsSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class GetPlaythroughsErrorResponse extends ApiResponse {
  status: 500

  constructor(
    body: HTTPBody | undefined,
    options: { status: 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type GetPlaythroughsResponse =
  | UnauthorizedResponse
  | GetPlaythroughsErrorResponse
  | GetPlaythroughsSuccessResponse

export type GetPlaythroughsReturnValue =
  | { status: 200; json: ResponsePlaythrough[] }
  | { status: 500; json: ErrorObject }

/**
 *
 * Types used for PUT|PATCH /playthroughs/:id endpoint
 *
 */

class PatchPlaythroughSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchPlaythroughErrorResponse extends ApiResponse {
  status: 422 | 500

  constructor(
    body: HTTPBody | undefined,
    options: {
      status: 422 | 500
      statusText?: string
      headers?: HTTPHeaders
    }
  ) {
    super(body, options)
  }
}

class PatchPlaythroughNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type PatchPlaythroughResponse =
  | UnauthorizedResponse
  | PatchPlaythroughSuccessResponse
  | PatchPlaythroughErrorResponse
  | PatchPlaythroughNotFoundResponse

export type PatchPlaythroughReturnValue =
  | { status: 200; json: ResponsePlaythrough }
  | { status: 422 | 500; json: ErrorObject }

/**
 *
 * Types used for DELETE /playthroughs/:id endpoint
 *
 */

class DeletePlaythroughSuccessResponse extends ApiResponse {
  status: 204

  constructor(
    body: HTTPBody | undefined,
    options: { status: 204; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeletePlaythroughErrorResponse extends ApiResponse {
  status: 404 | 500

  constructor(
    body: HTTPBody | undefined,
    options: { status: 404 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type DeletePlaythroughResponse =
  | UnauthorizedResponse
  | DeletePlaythroughSuccessResponse
  | DeletePlaythroughErrorResponse

export type DeletePlaythroughReturnValue =
  | { status: 204 }
  | { status: 500; json: ErrorObject }
