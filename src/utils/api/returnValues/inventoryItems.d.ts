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

export type PostInventoryItemsResponse =
  | UnauthorizedResponse
  | PostInventoryItemsSuccessResponse
  | PostInventoryItemsNotFoundResponse
  | PostInventoryItemsErrorResponse

export type PostInventoryItemsReturnValue =
  | { status: 200 | 201; json: ResponseInventoryList[] }
  | { status: 405 | 422 | 500; json: ErrorObject }

/**
 * 
 * Types used for PATCH /inventory_items/:id endpoint
 * 
 */

class PatchInventoryItemSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200; statusText?; string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchInventoryItemNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PatchInventoryItemErrorResponse extends ApiResponse {
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

export type PatchInventoryItemResponse =
  | UnauthorizedResponse
  | PatchInventoryItemSuccessResponse
  | PatchInventoryItemNotFoundResponse
  | PatchInventoryItemErrorResponse

export type PatchInventoryItemReturnValue =
  | { status: 200; json: ResponseInventoryItem[] }
  | { status: 405 | 422 | 500; json: ErrorObject }

/**
 * 
 * Types used for DELETE /inventory_items/:id endpoint
 * 
 */

class DeleteInventoryItemSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeleteInventoryItemNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class DeleteInventoryItemErrorResponse extends ApiResponse {
  status: 405 | 500

  constructor(
    body: HTTPBody | undefined,
    options: { status: 405 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type DeleteInventoryItemResponse =
  | UnauthorizedResponse
  | DeleteInventoryItemSuccessResponse
  | DeleteInventoryItemNotFoundResponse
  | DeleteInventoryItemErrorResponse

export type DeleteInventoryItemReturnValue =
  | { status: 200; json: ResponseInventoryList[] }
  | { status: 405 | 500; json: ErrorObject }