import { type RequestShoppingList } from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from '../sharedUtils'
import {
  type PostShoppingListsResponse,
  type PostShoppingListsReturnValue,
  type GetShoppingListsResponse,
  type GetShoppingListsReturnValue,
} from '../returnValues/shoppingLists'
import {
  AuthorizationError,
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from '../apiErrors'

/**
 *
 * POST /games/:game_id/shopping_lists endpoint
 *
 */

export const postShoppingLists = (
  gameId: number,
  attributes: RequestShoppingList,
  token: string
): Promise<PostShoppingListsReturnValue> | never => {
  const uri = `${BASE_URI}/games/${gameId}/shopping_lists`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'POST',
    body: JSON.stringify(attributes),
    headers,
  }).then((res) => {
    const response = res as PostShoppingListsResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json) => {
      const returnValue = { status: response.status, json }

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
 * GET /games/:game_id/shopping_lists endpoint
 *
 */

export const getShoppingLists = (
  gameId: number,
  token: string
): Promise<GetShoppingListsReturnValue> | never => {
  const uri = `${BASE_URI}/games/${gameId}/shopping_lists`
  const headers = combinedHeaders(token)

  return fetch(uri, { headers }).then((res) => {
    const response = res as GetShoppingListsResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 500)
        throw new InternalServerError(json.errors.join(', '))

      return returnValue
    })
  })
}
