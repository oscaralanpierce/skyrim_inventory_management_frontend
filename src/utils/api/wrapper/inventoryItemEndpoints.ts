import {
  type RequestInventoryItem,
  type ResponseInventoryList,
  type ResponseInventoryItem,
  type ErrorObject,
} from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from '../sharedUtils'
import {
  type PostInventoryItemsResponse,
  type PostInventoryItemsReturnValue,
  type PatchInventoryItemResponse,
  type PatchInventoryItemReturnValue,
  type DeleteInventoryItemResponse,
  type DeleteInventoryItemReturnValue,
} from '../returnValues/inventoryItems'
import {
  AuthorizationError,
  NotFoundError,
  MethodNotAllowedError,
  UnprocessableEntityError,
  InternalServerError,
} from '../apiErrors'

/**
 * 
 * POST /inventory_lists/:list_id/inventory_items endpoint
 * 
 */

export const postInventoryItems = (
  listId: number,
  attributes: RequestInventoryItem,
  token: string
): Promise<PostInventoryItemsReturnValue> | never => {
  const uri = `${BASE_URI}/inventory_lists/${listId}/inventory_items`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'POST',
    body: JSON.stringify(attributes),
    headers
  }).then((res) => {
    const response = res as PostInventoryItemsResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()
    
    return response.json().then((json: ResponseInventoryList[] | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 405)
        throw new MethodNotAllowedError(
          (json as ErrorObject).errors.join(', ')
        )
      if (returnValue.status === 422)
        throw new UnprocessableEntityError((json as ErrorObject).errors)
      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )
      
      return returnValue as PostInventoryItemsReturnValue
    })
  })
}

/**
 * 
 * PATCH /inventory_items/:id endpoint
 * 
 */

export const patchInventoryItem = (
  itemId: number,
  attributes: RequestInventoryItem,
  token: string
): Promise<PatchInventoryItemReturnValue> | never => {
  const uri = `${BASE_URI}/inventory_items/${itemId}`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'PATCH',
    body: JSON.stringify(attributes),
    headers,
  }).then((res) => {
    const response = res as PatchInventoryItemResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()
    
    return response
      .json()
      .then((json: ResponseInventoryItem[] | ErrorObject) => {
        const returnValue = { status: response.status, json }

        if (returnValue.status === 405)
          throw new MethodNotAllowedError(
            (json as ErrorObject).errors.join(', ')
          )
        if (returnValue.status === 422)
          throw new UnprocessableEntityError((json as ErrorObject).errors)
        if (returnValue.status === 500)
          throw new InternalServerError(
            (json as ErrorObject).errors.join(', ')
          )
        
        return returnValue as PatchInventoryItemReturnValue
      })
  })
}

/**
 * 
 * DELETE /inventory_items/:id endpoint
 * 
 */

export const deleteInventoryItem = (
  itemId: number,
  token: string
): Promise<DeleteInventoryItemReturnValue> | never => {
  const uri = `${BASE_URI}/inventory_items/${itemId}`
  const headers = combinedHeaders(token)

  return fetch(uri, { method: 'DELETE', headers }).then((res) => {
    const response = res as DeleteInventoryItemResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()
    
    return response.json().then((json: ResponseInventoryList[] | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 405)
        throw new MethodNotAllowedError(
          (json as ErrorObject).errors.join(', ')
        )
      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )
      
      return returnValue as DeleteInventoryItemReturnValue
    })
  })
}