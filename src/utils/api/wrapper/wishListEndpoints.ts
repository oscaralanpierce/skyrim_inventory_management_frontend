import {
  type RequestWishList,
  type ResponseWishList,
  type ErrorObject,
} from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from '../sharedUtils'
import {
  type PostWishListsResponse,
  type PostWishListsReturnValue,
  type GetWishListsResponse,
  type GetWishListsReturnValue,
  type PatchWishListResponse,
  type PatchWishListReturnValue,
  type DeleteWishListResponse,
  type DeleteWishListReturnValue,
  type DeleteWishListSuccessResponseBody
} from '../returnValues/wishLists'
import {
  AuthorizationError,
  NotFoundError,
  MethodNotAllowedError,
  UnprocessableEntityError,
  InternalServerError,
} from '../apiErrors'

/**
 *
 * POST /playthroughs/:playthrough_id/wish_lists endpoint
 *
 */

export const postWishLists = (
  playthroughId: number,
  attributes: RequestWishList,
  token: string
): Promise<PostWishListsReturnValue> | never => {
  const uri = `${BASE_URI}/playthroughs/${playthroughId}/wish_lists`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'POST',
    body: JSON.stringify(attributes),
    headers,
  }).then((res) => {
    const response = res as PostWishListsResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json: ResponseWishList[] | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 422)
        throw new UnprocessableEntityError((json as ErrorObject).errors)
      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )

      return returnValue as PostWishListsReturnValue
    })
  })
}

/**
 *
 * GET /playthroughs/:playthrough_id/wish_lists endpoint
 *
 */

export const getWishLists = (
  playthroughId: number,
  token: string
): Promise<GetWishListsReturnValue> | never => {
  const uri = `${BASE_URI}/playthroughs/${playthroughId}/wish_lists`
  const headers = combinedHeaders(token)

  return fetch(uri, { headers }).then((res) => {
    const response = res as GetWishListsResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json: ResponseWishList[] | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )

      return returnValue as GetWishListsReturnValue
    })
  })
}

/**
 *
 * PATCH /wish_lists/:id endpoint
 *
 */

export const patchWishList = (
  listId: number,
  attributes: RequestWishList,
  token: string
): Promise<PatchWishListReturnValue> | never => {
  const uri = `${BASE_URI}/wish_lists/${listId}`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'PATCH',
    body: JSON.stringify(attributes),
    headers,
  }).then((res) => {
    const response = res as PatchWishListResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json: ResponseWishList | ErrorObject) => {
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

      return returnValue as PatchWishListReturnValue
    })
  })
}

/**
 *
 * DELETE /wish_lists/:id endpoint
 *
 */

export const deleteWishList = (
  listId: number,
  token: string
): Promise<DeleteWishListReturnValue> | never => {
  const uri = `${BASE_URI}/wish_lists/${listId}`
  const headers = combinedHeaders(token)

  return fetch(uri, { method: 'DELETE', headers }).then((res) => {
    const response = res as DeleteWishListResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response
      .json()
      .then((json: DeleteWishListSuccessResponseBody | ErrorObject) => {
        const returnValue = { status: response.status, json }

        if (returnValue.status === 405)
          throw new MethodNotAllowedError(
            (json as ErrorObject).errors.join(', ')
          )
        if (returnValue.status === 500)
          throw new InternalServerError(
            (json as ErrorObject).errors.join(', ')
          )

        return returnValue as DeleteWishListReturnValue
      })
  })
}
