import { type RequestShoppingListItem } from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from '../sharedUtils'
import {
  type DeleteShoppingListItemResponse,
  type DeleteShoppingListItemReturnValue,
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
  const uri = `${BASE_URI}/shopping_lists/${listId}/shopping_list_items`
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

/**
 *
 * DELETE /shopping_list_items/:id endpoint
 *
 */

export const deleteShoppingListItem = (
  itemId: number,
  token: string
): Promise<DeleteShoppingListItemReturnValue> | never => {
  const uri = `${BASE_URI}/shopping_list_items/${itemId}`
  const headers = combinedHeaders(token)

  return fetch(uri, { method: 'DELETE', headers }).then((res) => {
    const response = res as DeleteShoppingListItemResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 405)
        throw new MethodNotAllowedError(json.errors.join(', '))
      if (returnValue.status === 500)
        throw new InternalServerError(json.errors.join(', '))

      return returnValue
    })
  })
}
