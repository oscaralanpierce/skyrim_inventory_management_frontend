import { type RequestShoppingList } from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from '../sharedUtils'
import {
  type PostShoppingListsResponse,
  type PostShoppingListsReturnValue,
  type GetShoppingListsResponse,
  type GetShoppingListsReturnValue,
  type PatchShoppingListResponse,
  type PatchShoppingListReturnValue,
  type DeleteShoppingListResponse,
  type DeleteShoppingListReturnValue,
} from '../returnValues/shoppingLists'
import {
  AuthorizationError,
  NotFoundError,
  MethodNotAllowedError,
  UnprocessableEntityError,
  InternalServerError,
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

/**
 *
 * PATCH /shopping_lists/:id endpoint
 *
 */

export const patchShoppingList = (
  listId: number,
  body: RequestShoppingList,
  token: string
): Promise<PatchShoppingListReturnValue> | never => {
  const uri = `${BASE_URI}/shopping_lists/${listId}`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers,
  }).then((res) => {
    const response = res as PatchShoppingListResponse

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
 * DELETE /shopping_lists/:id endpoint
 *
 */

export const deleteShoppingList = (
  listId: number,
  token: string
): Promise<DeleteShoppingListReturnValue> | never => {
  const uri = `${BASE_URI}/shopping_lists/${listId}`
  const headers = combinedHeaders(token)

  return fetch(uri, { method: 'DELETE', headers }).then((res) => {
    const response = res as DeleteShoppingListResponse

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
