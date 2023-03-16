import { BASE_URI, combinedHeaders } from './shared'
import {
  type GetShoppingListsResponse,
  type GetShoppingListsReturnValue,
} from '../returnValues/shoppingLists'
import {
  AuthorizationError,
  InternalServerError,
  NotFoundError,
} from '../apiErrors'

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
