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
    body?: null,
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

/**
 *
 * Types used for PATCH /shopping_lists/:id endpoint
 *
 */

class PatchShoppingListSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchShoppingListNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchShoppingListErrorResponse extends ApiResponse {
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

export type PatchShoppingListResponse =
  | UnauthorizedResponse
  | PatchShoppingListSuccessResponse
  | PatchShoppingListNotFoundResponse
  | PatchShoppingListErrorResponse

export type PatchShoppingListReturnValue =
  | { status: 200; json: ResponseShoppingList }
  | { status: 405 | 422 | 500; json: ErrorObject }

/**
 *
 * Types used for DELETE /shopping_lists/:id endpoint
 *
 */

class DeleteShoppingListSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeleteShoppingListNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeleteShoppingListErrorResponse extends ApiResponse {
  status: 405 | 500

  constructor(
    body,
    options: { status: 405 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

interface DeleteShoppingListSuccessResponseBody {
  deleted: number[]
  aggregate?: ResponseShoppingList
}

export type DeleteShoppingListResponse =
  | UnauthorizedResponse
  | DeleteShoppingListSuccessResponse
  | DeleteShoppingListNotFoundResponse
  | DeleteShoppingListErrorResponse

export type DeleteShoppingListReturnValue =
  | { status: 200; json: DeleteShoppingListSuccessResponseBody }
  | { status: 405 | 500; json: ErrorObject }
