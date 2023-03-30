import { ApiResponse, HTTPHeaders } from '../http'
import { ErrorObject, ResponseShoppingList } from '../../../types/apiData'
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
