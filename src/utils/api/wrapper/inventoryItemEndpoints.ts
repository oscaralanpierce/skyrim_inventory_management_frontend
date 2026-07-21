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