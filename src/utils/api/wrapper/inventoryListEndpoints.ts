import {
  type RequestInventoryList,
  type ResponseInventoryList,
  type ErrorObject,
} from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from '../sharedUtils'
import {
  type PostInventoryListsResponse,
  type PostInventoryListsReturnValue,
  type GetInventoryListsResponse,
  type GetInventoryListsReturnValue,
  type PatchInventoryListResponse,
  type PatchInventoryListReturnValue,
  type DeleteInventoryListResponse,
  type DeleteInventoryListReturnValue,
  type DeleteInventoryListSuccessResponseBody,
} from '../returnValues/inventoryLists'
import {
  AuthorizationError,
  NotFoundError,
  UnprocessableEntityError,
  InternalServerError,
  MethodNotAllowedError
} from '../apiErrors'

/**
 * 
 * POST /playthroughs/:playthrough_id/inventory_lists endpoint
 * 
 */

export const postInventoryLists = (
  playthroughId: number,
  attributes: RequestInventoryList,
  token: string
): Promise<PostInventoryListsReturnValue> | never => {
  const uri = `${BASE_URI}/playthroughs/${playthroughId}/inventory_lists`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'POST',
    body: JSON.stringify(attributes),
    headers
  }).then((res) => {
    const response = res as PostInventoryListsResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json: ResponseInventoryList[] | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 422)
        throw new UnprocessableEntityError((json as ErrorObject).errors)
      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )
      
      return returnValue as PostInventoryListsReturnValue
    })
  })
}

/**
 * 
 * GET /playthroughs/:playthrough_id/inventory_lists endpoint
 * 
 */

export const getInventoryLists = (
  playthroughId: number,
  token: string
): Promise<GetInventoryListsReturnValue> | never => {
  const uri = `${BASE_URI}/playthroughs/${playthroughId}/inventory_lists`
  const headers = combinedHeaders(token)

  return fetch(uri, { headers }).then((res) => {
    const response = res as GetInventoryListsResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()
    
    return response.json().then((json: ResponseInventoryList[] | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )
      
      return returnValue as GetInventoryListsReturnValue
    })
  })
}

/**
 * 
 * PATCH /inventory_lists/:id endpoint
 * 
 */

export const patchInventoryList = (
  listId: number,
  attributes: RequestInventoryList,
  token: string
): Promise<PatchInventoryListReturnValue> | never => {
  const uri = `${BASE_URI}/inventory_lists/${listId}`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'PATCH',
    body: JSON.stringify(attributes),
    headers,
  }).then((res) => {
    const response = res as PatchInventoryListResponse
    
    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()
    
    return response.json().then((json: ResponseInventoryList | ErrorObject) => {
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
      
      return returnValue as PatchInventoryListReturnValue
    })
  })
}

/**
 * 
 * DELETE /inventory_lists/:id endpoint
 * 
 */

export const deleteInventoryList = (
  listId: number,
  token: string
): Promise<DeleteInventoryListReturnValue> | never => {
  const uri = `${BASE_URI}/inventory_lists/${listId}`
  const headers = combinedHeaders(token)
  
  return fetch(uri, { method: 'DELETE', headers }).then((res) => {
    const response = res as DeleteInventoryListResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()
    
    return response
      .json()
      .then((json: DeleteInventoryListSuccessResponseBody | ErrorObject) => {
        const returnValue = { status: response.status, json }

        if (returnValue.status === 405)
          throw new MethodNotAllowedError(
            (json as ErrorObject).errors.join(', ')
          )
        if (returnValue.status === 500)
          throw new InternalServerError(
            (json as ErrorObject).errors.join(', ')
          )
        
        return returnValue as DeleteInventoryListReturnValue
      })
  })
}