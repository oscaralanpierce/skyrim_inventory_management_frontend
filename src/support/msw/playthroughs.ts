import { http } from 'msw'
import { type RequestPlaythrough, type ResponsePlaythrough } from '../../types/apiData'
import { emptyPlaythroughs, allPlaythroughs } from '../data/playthroughs'

const BASE_URI = 'http://localhost:3000'

/**
 *
 * POST /playthroughs
 *
 */

export const postPlaythroughsSuccess = http.post(
  `${BASE_URI}/playthroughs`,
  async ({ request }) => {
    const json = await request.json() as RequestPlaythrough

    const body = {
      id: 102,
      user_id: 412,
      name: json.name || 'My Playthrough 3',
      description:
        json.description || 'This description is just for illustration.',
      created_at: new Date(),
      updated_at: new Date(),
    }

    return new Response(JSON.stringify(body), { status: 201 })
  }
)

export const postPlaythroughsUnprocessable = http.post(
  `${BASE_URI}/playthroughs`,
  (_) => {
    const body = {
      errors: [
        "Name can only contain alphanumeric characters, spaces, commas (,), hyphens (-), and apostrophes (')",
      ],
    }

    return new Response(JSON.stringify(body), { status: 422 })
  }
)

export const postPlaythroughsServerError = http.post(
  `${BASE_URI}/playthroughs`,
  (_) => {
    const body = { errors: ['oh noes'] }

    return new Response(JSON.stringify(body), { status: 500 })
  }
)

/**
 *
 * GET /playthroughs
 *
 */

export const getPlaythroughsEmptySuccess = http.get(
  `${BASE_URI}/playthroughs`,
  (_) => {
    return new Response(JSON.stringify(emptyPlaythroughs), { status: 200 })
  }
)

export const getPlaythroughsAllSuccess = http.get(
  `${BASE_URI}/playthroughs`,
  (_) => {
    return new Response(JSON.stringify(allPlaythroughs), { status: 200 })
  }
)

export const getPlaythroughsServerError = http.get(
  `${BASE_URI}/playthroughs`,
  (_) => {
    return new Response(JSON.stringify({ errors: ['Something went wrong'] }), { status: 500 })
  }
)

/**
 *
 * PATCH /playthroughs/:id
 *
 */

const newOrExistingPlaythrough = (id: number): ResponsePlaythrough => {
  const existingPlaythrough = allPlaythroughs.find((playthrough) => playthrough.id === id)

  if (existingPlaythrough) return existingPlaythrough

  return {
    id,
    user_id: 412,
    name: 'Skyrim Playthrough',
    description: null,
    created_at: new Date(),
    updated_at: new Date(),
  }
}

export const patchPlaythroughSuccess = http.patch(
  `${BASE_URI}/playthroughs/:id`,
  async ({ request, params }) => {
    const { id } = params
    const body = await request.json() as RequestPlaythrough
    const playthrough = newOrExistingPlaythrough(Number(id))
    const respBody = JSON.stringify({ ...playthrough, ...body })

    return new Response(respBody, { status: 200 })
  }
)

export const patchPlaythroughUnprocessableEntity = http.patch(
  `${BASE_URI}/playthroughs/:id`,
  (_) => {
    return new Response(JSON.stringify({ errors: ['Name must be unique'] }), { status: 422 })
  }
)

export const patchPlaythroughNotFound = http.patch(
  `${BASE_URI}/playthroughs/:id`,
  (_) => {
    return new Response(null, { status: 404 })
  }
)

export const patchPlaythroughServerError = http.patch(
  `${BASE_URI}/playthroughs/:id`,
  (_) => {
    return new Response(JSON.stringify({ errors: ['oh noes'] }), { status: 500 })
  }
)

/**
 *
 * DELETE /playthroughs/:id
 *
 */

export const deletePlaythroughSuccess = http.delete(
  `${BASE_URI}/playthroughs/:id`,
  (_) => {
    return new Response(null, { status: 204 })
  }
)

export const deletePlaythroughNotFound = http.delete(
  `${BASE_URI}/playthroughs/:id`,
  (_) => {
    return new Response(null, { status: 404 })
  }
)

export const deletePlaythroughServerError = http.delete(
  `${BASE_URI}/playthroughs/:id`,
  (_) => {
    return new Response(JSON.stringify({ errors: ['oh noes'] }), { status: 500 })
  }
)
