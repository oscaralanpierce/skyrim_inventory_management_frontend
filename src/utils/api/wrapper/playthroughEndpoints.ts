import {
  type RequestPlaythrough,
  type ResponsePlaythrough,
  type ErrorObject,
} from '../../../types/apiData'
import { BASE_URI, combinedHeaders } from '../sharedUtils'
import {
  type PostPlaythroughsResponse,
  type PostPlaythroughsReturnValue,
  type GetPlaythroughsResponse,
  type GetPlaythroughsReturnValue,
  type PatchPlaythroughResponse,
  type PatchPlaythroughReturnValue,
  type DeletePlaythroughResponse,
  type DeletePlaythroughReturnValue,
} from '../returnValues/playthroughs'
import {
  AuthorizationError,
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from '../apiErrors'

/**
 *
 * POST /playthroughs endpoint
 *
 */

export const postPlaythroughs = (
  body: RequestPlaythrough,
  token: string
): Promise<PostPlaythroughsReturnValue> | never => {
  const uri = `${BASE_URI}/playthroughs`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  }).then((res) => {
    const response = res as PostPlaythroughsResponse

    if (response.status === 401) throw new AuthorizationError()

    return response.json().then((json: ResponsePlaythrough | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )
      if (returnValue.status === 422)
        throw new UnprocessableEntityError((json as ErrorObject).errors)

      return returnValue as PostPlaythroughsReturnValue
    })
  })
}

/**
 *
 * GET /playthroughs endpoint
 *
 */

export const getPlaythroughs = (
  token: string
): Promise<GetPlaythroughsReturnValue> | never => {
  const uri = `${BASE_URI}/playthroughs`
  const headers = combinedHeaders(token)

  return fetch(uri, { headers }).then((res) => {
    const response = res as GetPlaythroughsResponse

    if (response.status === 401) throw new AuthorizationError()

    return response.json().then((json: ResponsePlaythrough[] | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )

      return returnValue as GetPlaythroughsReturnValue
    })
  })
}

/**
 *
 * PATCH /playthroughs/:id endpoint
 *
 */

export const patchPlaythrough = (
  playthroughId: number,
  body: RequestPlaythrough,
  token: string
): Promise<PatchPlaythroughReturnValue> | never => {
  const uri = `${BASE_URI}/playthroughs/${playthroughId}`
  const headers = combinedHeaders(token)

  return fetch(uri, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers,
  }).then((res) => {
    const response = res as PatchPlaythroughResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()

    return response.json().then((json: ResponsePlaythrough | ErrorObject) => {
      const returnValue = { status: response.status, json }

      if (returnValue.status === 500)
        throw new InternalServerError(
          (json as ErrorObject).errors.join(', ')
        )
      if (returnValue.status === 422)
        throw new UnprocessableEntityError((json as ErrorObject).errors)

      return returnValue as PatchPlaythroughReturnValue
    })
  })
}

/**
 *
 * DELETE /playthroughs/:id endpoint
 *
 */

export const deletePlaythrough = (
  playthroughId: number,
  token: string
): Promise<DeletePlaythroughReturnValue> | never => {
  const uri = `${BASE_URI}/playthroughs/${playthroughId}`
  const headers = combinedHeaders(token)

  return fetch(uri, { method: 'DELETE', headers }).then((res) => {
    const response = res as DeletePlaythroughResponse

    if (response.status === 401) throw new AuthorizationError()
    if (response.status === 404) throw new NotFoundError()
    if (response.status === 204) return { status: response.status }

    return res.json().then((json: ErrorObject) => {
      throw new InternalServerError(json.errors.join(', '))
    })
  })
}
