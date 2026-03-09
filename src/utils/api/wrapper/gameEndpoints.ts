import {
  type RequestGame,
  type ResponseGame,
  type ErrorObject,
} from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from '../sharedUtils'
import {
  type PostGamesResponse,
  type PostGamesReturnValue,
  type GetGamesResponse,
  type GetGamesReturnValue,
  type PatchGameResponse,
  type PatchGameReturnValue,
  type DeleteGameResponse,
  type DeleteGameReturnValue,
} from '../returnValues/games'
import {
  AuthorizationError,
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from '../apiErrors'

/**
 *
 * POST /games endpoint
 *
 */

export const postGames = (
  body: RequestGame,
  token: string
): Promise<PostGamesReturnValue> | never => {
  const uri = `${BASE_URI}/games`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  }).then((res) => {
    const response = res as PostGamesResponse

    if (response.status === 401) throw new AuthorizationError()

    return response.json().then((json: ResponseGame | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )
      if (returnValue.status === 422)
        throw new UnprocessableEntityError((json as ErrorObject).errors)

      return returnValue as PostGamesReturnValue
    })
  })
}

/**
 *
 * GET /games endpoint
 *
 */

export const getGames = (
  token: string
): Promise<GetGamesReturnValue> | never => {
  const uri = `${BASE_URI}/games`
  const headers = combinedHeaders(token)

  return fetch(uri, { headers }).then((res) => {
    const response = res as GetGamesResponse

    if (response.status === 401) throw new AuthorizationError()

    return response.json().then((json: ResponseGame[] | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )

      return returnValue as GetGamesReturnValue
    })
  })
}

/**
 *
 * PATCH /games/:id endpoint
 *
 */

export const patchGame = (
  gameId: number,
  body: RequestGame,
  token: string
): Promise<PatchGameReturnValue> | never => {
  const uri = `${BASE_URI}/games/${gameId}`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers,
  }).then((res) => {
    const response = res as PatchGameResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json: ResponseGame | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )
      if (returnValue.status === 422)
        throw new UnprocessableEntityError((json as ErrorObject).errors)

      return returnValue as PatchGameReturnValue
    })
  })
}

/**
 *
 * DELETE /games/:id endpoint
 *
 */

export const deleteGame = (
  gameId: number,
  token: string
): Promise<DeleteGameReturnValue> | never => {
  const uri = `${BASE_URI}/games/${gameId}`
  const headers = combinedHeaders(token)

  return fetch(uri, { method: 'DELETE', headers }).then((res) => {
    const response = res as DeleteGameResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()
    if (response.status === 204) return { status: response.status }

    return res.json().then((json: ErrorObject) => {
      throw new InternalServerError(json.errors.join(', '))
    })
  })
}
