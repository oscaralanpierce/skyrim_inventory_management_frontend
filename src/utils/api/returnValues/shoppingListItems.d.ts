import { ApiResponse, type HTTPHeaders } from '../http'
import {
  type ErrorObject,
  type ResponseShoppingList,
  type ResponseShoppingListItem,
} from '../../../types/apiData'
import { UnauthorizedResponse } from './shared'

/**
 *
 * Types used for POST /shopping_lists/:list_id/list_items endpoint
 *
 */

class PostShoppingListItemsSuccessResponse extends ApiResponse {
  status: 200 | 201

  constructor(
    body,
    options: { status: 200 | 201; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostShoppingListItemsNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostShoppingListItemsErrorResponse extends ApiResponse {
  status: 405 | 422 | 500

  constructor(
    body,
    options: {
      status: 405 | 422 | 500
      statusText?: string
      headers?: HTTPHeaders
    }
  ) {
    super(body, options)
  }
}

export type PostShoppingListItemsResponse =
  | UnauthorizedResponse
  | PostShoppingListItemsSuccessResponse
  | PostShoppingListItemsNotFoundResponse
  | PostShoppingListItemsErrorResponse

export type PostShoppingListItemsReturnValue =
  | { status: 200 | 201; json: ResponseShoppingList[] }
  | { status: 405 | 422 | 500; json: ErrorObject }

/**
 *
 * Types used for PATCH /shopping_list_items/:id endpoint
 *
 */

class PatchShoppingListItemSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchShoppingListItemNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchShoppingListItemErrorResponse extends ApiResponse {
  status: 405 | 422 | 500

  constructor(
    body,
    options: {
      status: 405 | 422 | 500
      statusText?: string
      headers?: HTTPHeaders
    }
  ) {
    super(body, options)
  }
}

export type PatchShoppingListItemResponse =
  | UnauthorizedResponse
  | PatchShoppingListItemSuccessResponse
  | PatchShoppingListItemNotFoundResponse
  | PatchShoppingListItemErrorResponse

export type PatchShoppingListItemReturnValue =
  | { status: 200; json: ResponseShoppingListItem[] }
  | { status: 405 | 422 | 500; json: ErrorObject }

/**
 *
 * Types used for DELETE /shopping_list_items/:id endpoint
 *
 */

class DeleteShoppingListItemSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeleteShoppingListItemNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeleteShoppingListItemErrorResponse extends ApiResponse {
  status: 405 | 500

  constructor(
    body,
    options: { status: 405 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type DeleteShoppingListItemResponse =
  | UnauthorizedResponse
  | DeleteShoppingListItemSuccessResponse
  | DeleteShoppingListItemNotFoundResponse
  | DeleteShoppingListItemErrorResponse

export type DeleteShoppingListItemReturnValue =
  | { status: 200; json: ResponseShoppingList[] }
  | { status: 405 | 500; json: ErrorObject }
