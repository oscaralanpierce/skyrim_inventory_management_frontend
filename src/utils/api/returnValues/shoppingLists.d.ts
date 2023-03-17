import { ApiResponse, HTTPHeaders } from '../http'
import { ErrorObject, ResponseShoppingList } from '../../../types/apiData'
import { UnauthorizedResponse } from './shared'

/**
 *
 * Types used for POST /games/:game_id/shopping_lists endpoint
 *
 */

class PostShoppingListsSuccessResponse extends ApiResponse {
  status: 201

  constructor(
    body,
    options: { status: 201; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostShoppingListsNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostShoppingListsErrorResponse extends ApiResponse {
  status: 422 | 500

  constructor(
    body,
    options: { status: 422 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type PostShoppingListsResponse =
  | UnauthorizedResponse
  | PostShoppingListsSuccessResponse
  | PostShoppingListsNotFoundResponse
  | PostShoppingListsErrorResponse

export type PostShoppingListsReturnValue =
  | { status: 201; json: ResponseShoppingList[] }
  | { status: 422 | 500; json: ErrorObject }

/**
 *
 * Types used for GET /games/:game_id/shopping_lists endpoint
 *
 */

class GetShoppingListsSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class GetShoppingListsNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class GetShoppingListsServerErrorResponse extends ApiResponse {
  status: 500

  constructor(
    body,
    options: { status: 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type GetShoppingListsResponse =
  | UnauthorizedResponse
  | GetShoppingListsSuccessResponse
  | GetShoppingListsNotFoundResponse
  | GetShoppingListsServerErrorResponse

export type GetShoppingListsReturnValue =
  | { status: 200; json: ResponseShoppingList[] }
  | { status: 500; json: ErrorObject }
