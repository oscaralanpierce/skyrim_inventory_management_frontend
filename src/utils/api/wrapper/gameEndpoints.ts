import { type RequestGame } from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from './shared'
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

    return response.json().then((json) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 500)
        throw new InternalServerError(json.errors.join(', '))
      if (returnValue.status === 422)
        throw new UnprocessableEntityError(json.errors)

      return returnValue
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

    return response.json().then((json) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 500)
        throw new InternalServerError(json.errors.join(', '))
      if (returnValue.status === 422)
        throw new UnprocessableEntityError(json.errors)

      return returnValue
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

    return res.json().then((json) => {
      throw new InternalServerError(json.errors.join(', '))
    })
  })
}
