import { ApiResponse, type HTTPBody, type HTTPHeaders } from '../http'
import {
  type ErrorObject,
  type ResponseWishList,
} from '../../../types/apiData'
import { UnauthorizedResponse } from './shared'

/**
 *
 * Types used for POST /games/:game_id/wish_lists endpoint
 *
 */

class PostWishListsSuccessResponse extends ApiResponse {
  status: 201

  constructor(
    body: HTTPBody | undefined,
    options: { status: 201; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostWishListsNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostWishListsErrorResponse extends ApiResponse {
  status: 422 | 500

  constructor(
    body: HTTPBody | undefined,
    options: { status: 422 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type PostWishListsResponse =
  | UnauthorizedResponse
  | PostWishListsSuccessResponse
  | PostWishListsNotFoundResponse
  | PostWishListsErrorResponse

export type PostWishListsReturnValue =
  | { status: 201; json: ResponseWishList[] }
  | { status: 422 | 500; json: ErrorObject }

/**
 *
 * Types used for GET /games/:game_id/wish_lists endpoint
 *
 */

class GetWishListsSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class GetWishListsNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class GetWishListsServerErrorResponse extends ApiResponse {
  status: 500

  constructor(
    body: HTTPBody | undefined,
    options: { status: 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type GetWishListsResponse =
  | UnauthorizedResponse
  | GetWishListsSuccessResponse
  | GetWishListsNotFoundResponse
  | GetWishListsServerErrorResponse

export type GetWishListsReturnValue =
  | { status: 200; json: ResponseWishList[] }
  | { status: 500; json: ErrorObject }

/**
 *
 * Types used for PATCH /wish_lists/:id endpoint
 *
 */

class PatchWishListSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchWishListNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchWishListErrorResponse extends ApiResponse {
  status: 405 | 422 | 500

  constructor(
    body: HTTPBody | undefined,
    options: {
      status: 405 | 422 | 500
      statusText?: string
      headers?: HTTPHeaders
    }
  ) {
    super(body, options)
  }
}

export type PatchWishListResponse =
  | UnauthorizedResponse
  | PatchWishListSuccessResponse
  | PatchWishListNotFoundResponse
  | PatchWishListErrorResponse

export type PatchWishListReturnValue =
  | { status: 200; json: ResponseWishList }
  | { status: 405 | 422 | 500; json: ErrorObject }

/**
 *
 * Types used for DELETE /wish_lists/:id endpoint
 *
 */

class DeleteWishListSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeleteWishListNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeleteWishListErrorResponse extends ApiResponse {
  status: 405 | 500

  constructor(
    body: HTTPBody | undefined,
    options: { status: 405 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

interface DeleteWishListSuccessResponseBody {
  deleted: number[]
  aggregate?: ResponseWishList
}

export type DeleteWishListResponse =
  | UnauthorizedResponse
  | DeleteWishListSuccessResponse
  | DeleteWishListNotFoundResponse
  | DeleteWishListErrorResponse

export type DeleteWishListReturnValue =
  | { status: 200; json: DeleteWishListSuccessResponseBody }
  | { status: 405 | 500; json: ErrorObject }
