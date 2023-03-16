import { ApiResponse, SuccessStatusCode, HTTPHeaders } from '../http'
import { ErrorObject, ResponseGame } from '../../../types/apiData'

class UnauthorizedResponse extends ApiResponse {
  status: 401

  constructor(
    body,
    options: { status: 401; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

/**
 *
 * Types used for POST /games endpoint
 *
 */

class PostGamesSuccessResponse extends ApiResponse {
  status: 201

  constructor(
    body,
    options: { status: 201; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostGamesErrorResponse extends ApiResponse {
  status: 422 | 500

  constructor(
    body,
    options: { status: 422 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type PostGamesResponse =
  | UnauthorizedResponse
  | PostGamesSuccessResponse
  | PostGamesErrorResponse
export type PostGamesReturnValue =
  | { status: 422 | 500; json: ErrorObject }
  | { status: 201; json: ResponseGame }

/**
 *
 * Types used for GET /games endpoint
 *
 */

class GetGamesSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class GetGamesErrorResponse extends ApiResponse {
  status: 500

  constructor(
    body,
    options: { status: 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type GetGamesResponse =
  | UnauthorizedResponse
  | GetGamesErrorResponse
  | GetGamesSuccessResponse

export type GetGamesReturnValue =
  | { status: 200; json: ResponseGame[] }
  | { status: 500; json: ErrorObject }

/**
 *
 * Types used for PUT|PATCH /games/:id endpoint
 *
 */

class PatchGameSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchGameErrorResponse extends ApiResponse {
  status: 422 | 500

  constructor(
    body,
    options: {
      status: 422 | 500
      statusText?: string
      headers?: HTTPHeaders
    }
  ) {
    super(body, options)
  }
}

class PatchGameNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type PatchGameResponse =
  | UnauthorizedResponse
  | PatchGameSuccessResponse
  | PatchGameErrorResponse
  | PatchGameNotFoundResponse

export type PatchGameReturnValue =
  | { status: 200; json: ResponseGame }
  | { status: 422 | 500; json: ErrorObject }

/**
 *
 * Types used for DELETE /games/:id endpoint
 *
 */

class DeleteGameSuccessResponse extends ApiResponse {
  status: 204

  constructor(
    body,
    options: { status: 204; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeleteGameErrorResponse extends ApiResponse {
  status: 404 | 500

  constructor(
    body,
    options: { status: 404 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type DeleteGameResponse =
  | UnauthorizedResponse
  | DeleteGameSuccessResponse
  | DeleteGameErrorResponse

export type DeleteGameReturnValue =
  | { status: 204 }
  | { status: 500; json: ErrorObject }
