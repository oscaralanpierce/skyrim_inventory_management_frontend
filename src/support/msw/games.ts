import { rest } from 'msw'
import { type ResponseGame } from '../../types/apiData'
import { emptyGames, allGames } from '../data/games'

const BASE_URI = 'http://localhost:3000'

/**
 *
 * POST /games
 *
 */

export const postGamesSuccess = rest.post(
  `${BASE_URI}/games`,
  (req, res, ctx) => {
    const body = {
      id: 102,
      user_id: 412,
      name: req.params.name || 'My Game 3',
      description:
        req.params.description || 'This description is just for illustration.',
      created_at: new Date(),
      updated_at: new Date(),
    }

    return res(ctx.status(201), ctx.json(body))
  }
)

export const postGamesUnprocessable = rest.post(
  `${BASE_URI}/games`,
  (req, res, ctx) => {
    const body = {
      errors: [
        "Name can only contain alphanumeric characters, spaces, commas (,), hyphens (-), and apostrophes (')",
      ],
    }

    return res(ctx.status(422), ctx.json(body))
  }
)

export const postGamesServerError = rest.post(
  `${BASE_URI}/games`,
  (req, res, ctx) => {
    const body = { errors: ['oh noes'] }

    return res(ctx.status(500), ctx.json(body))
  }
)

/**
 *
 * GET /games
 *
 */

export const getGamesEmptySuccess = rest.get(
  `${BASE_URI}/games`,
  (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(emptyGames))
  }
)

export const getGamesAllSuccess = rest.get(
  `${BASE_URI}/games`,
  (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(allGames))
  }
)

export const getGamesServerError = rest.get(
  `${BASE_URI}/games`,
  (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ errors: ['Something went wrong'] }))
  }
)

/**
 *
 * PATCH /games/:id
 *
 */

const newOrExistingGame = (id: number): ResponseGame => {
  const existingGame = allGames.find((game) => game.id === id)

  if (existingGame) return existingGame

  return {
    id,
    user_id: 412,
    name: 'Skyrim Game',
    description: null,
    created_at: new Date(),
    updated_at: new Date(),
  }
}

export const patchGameSuccess = rest.patch(
  `${BASE_URI}/games/:id`,
  async (req, res, ctx) => {
    const id = Number(req.params.id)
    const body = await req.json()
    const game = newOrExistingGame(id)

    return res(ctx.status(200), ctx.json({ ...game, ...body }))
  }
)

export const patchGameUnprocessableEntity = rest.patch(
  `${BASE_URI}/games/:id`,
  (req, res, ctx) => {
    return res(ctx.status(422), ctx.json({ errors: ['Name must be unique'] }))
  }
)

export const patchGameNotFound = rest.patch(
  `${BASE_URI}/games/:id`,
  (req, res, ctx) => {
    return res(ctx.status(404))
  }
)

export const patchGameServerError = rest.patch(
  `${BASE_URI}/games/:id`,
  (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ errors: ['oh noes'] }))
  }
)

/**
 *
 * DELETE /games/:id
 *
 */

export const deleteGameSuccess = rest.delete(
  `${BASE_URI}/games/:id`,
  (req, res, ctx) => {
    return res(ctx.status(204))
  }
)

export const deleteGameNotFound = rest.delete(
  `${BASE_URI}/games/:id`,
  (req, res, ctx) => {
    return res(ctx.status(404))
  }
)

export const deleteGameServerError = rest.delete(
  `${BASE_URI}/games/:id`,
  (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ errors: ['oh noes'] }))
  }
)
