import {
  type RequestWishListItem,
  type ResponseWishList,
  type ResponseWishListItem,
  type ErrorObject,
} from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from '../sharedUtils'
import {
  type PostWishListItemsResponse,
  type PostWishListItemsReturnValue,
  type PatchWishListItemResponse,
  type PatchWishListItemReturnValue,
  type DeleteWishListItemResponse,
  type DeleteWishListItemReturnValue,
} from '../returnValues/wishListItems'
import {
  AuthorizationError,
  NotFoundError,
  MethodNotAllowedError,
  UnprocessableEntityError,
  InternalServerError,
} from '../apiErrors'

/**
 *
 * POST /wish_lists/:list_id/list_items endpoint
 *
 */

export const postWishListItems = (
  listId: number,
  attributes: RequestWishListItem,
  token: string
): Promise<PostWishListItemsReturnValue> | never => {
  const uri = `${BASE_URI}/wish_lists/${listId}/wish_list_items`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'POST',
    body: JSON.stringify(attributes),
    headers,
  }).then((res) => {
    const response = res as PostWishListItemsResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json: ResponseWishList[] | ErrorObject) => {
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

      return returnValue as PostWishListItemsReturnValue
    })
  })
}

/**
 *
 * PATCH /wish_list_items/:id endpoint
 *
 */

export const patchWishListItem = (
  itemId: number,
  attributes: RequestWishListItem,
  token: string
): Promise<PatchWishListItemReturnValue> | never => {
  const uri = `${BASE_URI}/wish_list_items/${itemId}`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'PATCH',
    body: JSON.stringify(attributes),
    headers,
  }).then((res) => {
    const response = res as PatchWishListItemResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response
      .json()
      .then((json: ResponseWishListItem[] | ErrorObject) => {
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

        return returnValue as PatchWishListItemReturnValue
      })
  })
}

/**
 *
 * DELETE /wish_list_items/:id endpoint
 *
 */

export const deleteWishListItem = (
  itemId: number,
  token: string
): Promise<DeleteWishListItemReturnValue> | never => {
  const uri = `${BASE_URI}/wish_list_items/${itemId}`
  const headers = combinedHeaders(token)

  return fetch(uri, { method: 'DELETE', headers }).then((res) => {
    const response = res as DeleteWishListItemResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json: ResponseWishList[] | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 405)
        throw new MethodNotAllowedError(
          (json as ErrorObject).errors.join(', ')
        )
      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )

      return returnValue as DeleteWishListItemReturnValue
    })
  })
}
