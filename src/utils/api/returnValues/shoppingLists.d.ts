import { ApiResponse, HTTPHeaders } from '../http'
import { ErrorObject, ResponseShoppingList } from '../../../types/apiData'
import { UnauthorizedResponse } from './shared'

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
