import { ApiResponse, type HTTPBody, type HTTPHeaders } from '../http'
import {
  type ErrorObject,
  type ResponseInventoryList
} from '../../../types/apiData'
import { UnauthorizedResponse } from './shared'

/**
 * 
 * Types used for POST /playthroughs/:playthrough_id/inventory_lists endpoint
 * 
 */

class PostInventoryListsSuccessResponse extends ApiResponse {
  status: 201

  constructor(
    body: HTTPBody | undefined,
    options: { status: 201; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostInventoryListsNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class PostInventoryListsErrorResponse extends ApiResponse {
  status: 422 | 500

  constructor(
    body: HTTPBody | undefined,
    options: { status: 422 | 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type PostInventoryListsResponse =
  | UnauthorizedResponse
  | PostInventoryListsSuccessResponse
  | PostInventoryListsNotFoundResponse
  | PostInventoryListsErrorResponse

export type PostInventoryListsReturnValue =
  | { status: 201; json: ResponseInventoryList[] }
  | { status: 422 | 500; json: ErrorObject }

/**
 * 
 * Types used for GET /playthroughs/:playthrough_id/inventory_lists endpoint
 * 
 */

class GetInventoryListsSuccessResponse extends ApiResponse {
  status: 200

  constructor(
    body: HTTPBody | undefined,
    options: { status: 200; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class GetInventoryListsNotFoundResponse extends ApiResponse {
  status: 404

  constructor(
    body?: null,
    options: { status: 404; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

class GetInventoryListsServerErrorResponse extends ApiResponse {
  status: 500

  constructor(
    body: HTTPBody | undefined,
    options: { status: 500; statusText?: string; headers?: HTTPHeaders }
  ) {
    super(body, options)
  }
}

export type GetInventoryListsResponse =
  | UnauthorizedResponse
  | GetInventoryListsSuccessResponse
  | GetInventoryListsNotFoundResponse
  | GetInventoryListsServerErrorResponse

export type GetInventoryListsReturnValue =
  | { status: 200; json: ResponseInventoryList[] }
  | { status: 500; json: ErrorObject }