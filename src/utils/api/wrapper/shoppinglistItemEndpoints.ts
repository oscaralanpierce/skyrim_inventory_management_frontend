import { type RequestShoppingListItem } from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from '../sharedUtils'
import {
  type PostShoppingListItemsResponse,
  type PostShoppingListItemsReturnValue,
} from '../returnValues/shoppingListItems'
import {
  AuthorizationError,
  NotFoundError,
  MethodNotAllowedError,
  UnprocessableEntityError,
  InternalServerError,
} from '../apiErrors'

/**
 *
 * POST /shopping_lists/:list_id/list_items endpoint
 *
 */

export const postShoppingListItems = (
  listId: number,
  attributes: RequestShoppingListItem,
  token: string
): Promise<PostShoppingListItemsReturnValue> | never => {
  const uri = `${BASE_URI}/shopping_lists/${listId}/list_items`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'POST',
    body: JSON.stringify(attributes),
    headers,
  }).then((res) => {
    const response = res as PostShoppingListItemsResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 405)
        throw new MethodNotAllowedError(json.errors.join(', '))
      if (returnValue.status === 422)
        throw new UnprocessableEntityError(json.errors)
      if (returnValue.status === 500)
        throw new InternalServerError(json.errors.join(', '))

      return returnValue
    })
  })
}
