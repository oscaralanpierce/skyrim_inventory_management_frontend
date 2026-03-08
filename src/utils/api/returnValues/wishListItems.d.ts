import { ApiResponse, type HTTPBody, type HTTPHeaders } from '../http'
import {
  type ErrorObject,
  type ResponseWishList,
  type ResponseWishListItem,
} from '../../../types/apiData'
import { UnauthorizedResponse } from './shared'

/**
 *
 * Types used for POST /wish_lists/:list_id/list_items endpoint
 *
 */

class PostWishListItemsSuccessResponse extends ApiResponse {
  status: 200 | 201

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200 | 201; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostWishListItemsNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostWishListItemsErrorResponse extends ApiResponse {
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

export type PostWishListItemsResponse =
  | UnauthorizedResponse
  | PostWishListItemsSuccessResponse
  | PostWishListItemsNotFoundResponse
  | PostWishListItemsErrorResponse

export type PostWishListItemsReturnValue =
  | { status: 200 | 201; json: ResponseWishList[] }
  | { status: 405 | 422 | 500; json: ErrorObject }

/**
 *
 * Types used for PATCH /wish_list_items/:id endpoint
 *
 */

class PatchWishListItemSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchWishListItemNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchWishListItemErrorResponse extends ApiResponse {
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

export type PatchWishListItemResponse =
  | UnauthorizedResponse
  | PatchWishListItemSuccessResponse
  | PatchWishListItemNotFoundResponse
  | PatchWishListItemErrorResponse

export type PatchWishListItemReturnValue =
  | { status: 200; json: ResponseWishListItem[] }
  | { status: 405 | 422 | 500; json: ErrorObject }

/**
 *
 * Types used for DELETE /wish_list_items/:id endpoint
 *
 */

class DeleteWishListItemSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeleteWishListItemNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeleteWishListItemErrorResponse extends ApiResponse {
  status: 405 | 500

  constructor(
    body: HTTPBody | undefined,
    options: { status: 405 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type DeleteWishListItemResponse =
  | UnauthorizedResponse
  | DeleteWishListItemSuccessResponse
  | DeleteWishListItemNotFoundResponse
  | DeleteWishListItemErrorResponse

export type DeleteWishListItemReturnValue =
  | { status: 200; json: ResponseWishList[] }
  | { status: 405 | 500; json: ErrorObject }
