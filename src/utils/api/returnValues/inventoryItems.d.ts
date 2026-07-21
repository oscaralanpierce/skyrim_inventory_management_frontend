import { ApiResponse, type HTTPBody, type HTTPHeaders } from '../http'
import {
  type ErrorObject,
  type ResponseInventoryList,
  type ResponseInventoryItem,
} from '../../../types/apiData'
import { UnauthorizedResponse } from './shared'

/**
 * 
 * Types used for POST /inventory_lists/:list_id/list_items endpoint
 * 
 */

class PostInventoryItemsSuccessResponse extends ApiResponse {
  status: 200 | 201

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200 | 201; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostInventoryItemsNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostInventoryItemsErrorResponse extends ApiResponse {
  status: 405 | 422 | 500

  construtor(
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

export type PostInventoryItemsResponse =
  | UnauthorizedResponse
  | PostInventoryItemsSuccessResponse
  | PostInventoryItemsNotFoundResponse
  | PostInventoryItemsErrorResponse

export type PostInventoryItemsReturnValue =
  | { status: 200 | 201; json: ResponseInventoryList[] }
  | { status: 405 | 422 | 500; json: ErrorObject }