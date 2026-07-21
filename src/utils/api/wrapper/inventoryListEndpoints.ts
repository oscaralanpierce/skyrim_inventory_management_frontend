import {
  type RequestInventoryList,
  type ResponseInventoryList,
  type ErrorObject,
} from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from '../sharedUtils'
import {
  type PostInventoryListsResponse,
  type PostInventoryListsReturnValue
} from '../returnValues/inventoryLists'
import {
  AuthorizationError,
  NotFoundError,
  UnprocessableEntityError,
  InternalServerError
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