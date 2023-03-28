import { rest } from 'msw'
import { allGames } from '../data/games'
import { allShoppingLists } from '../data/shoppingLists'
import { shoppingListsForGame } from '../data/shoppingLists'
import { newShoppingList, newShoppingListWithAggregate } from './helpers/data'

const BASE_URI = 'http://localhost:3000'
const gameIds = allGames.map(({ id }) => id)
const listIds = allShoppingLists.map(({ id }) => id)

/**
 *
 * POST /games/:game_id/shopping_lists
 *
 */

// Handles both 201 and 404 responses
export const postShoppingLists = rest.post(
  `${BASE_URI}/games/:gameId/shopping_lists`,
  async (req, res, ctx) => {
    const gameId: number = Number(req.params.gameId)

    if (gameIds.indexOf(gameId) < 0) return res(ctx.status(404))

    const attributes = await req.json()

    const responseBody = shoppingListsForGame(gameId).length
      ? newShoppingList(attributes, gameId)
      : newShoppingListWithAggregate(attributes, gameId)

    return res(ctx.status(201), ctx.json(responseBody))
  }
)

// Returns the same validation errors regardless of request body
// submitted
export const postShoppingListsUnprocessable = rest.post(
  `${BASE_URI}/games/:gameId/shopping_lists`,
  (_req, res, ctx) => {
    return res(
      ctx.status(422),
      ctx.json({
        errors: [
          'Title must be unique per game',
          "Title can only contain alphanumeric characters, spaces, commas (,), hyphens (-), and apostrophes (')",
        ],
      })
    )
  }
)

export const postShoppingListsServerError = rest.post(
  `${BASE_URI}/games/:gameId/shopping_lists`,
  (_req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        errors: ['Something went horribly wrong'],
      })
    )
  }
)

/**
 *
 * GET /games/:game_id/shopping_lists
 *
 */

// Covers both success and 404 cases
export const getShoppingLists = rest.get(
  `${BASE_URI}/games/:gameId/shopping_lists`,
  (req, res, ctx) => {
    const gameId: number = Number(req.params.gameId)
    if (gameIds.indexOf(gameId) < 0) return res(ctx.status(404))

    return res(
      ctx.status(200),
      ctx.json(shoppingListsForGame(Number(req.params.gameId)))
    )
  }
)

/**
 *
 * PATCH /shopping_lists/:id
 *
 */

// Covers both success and 404 cases
export const patchShoppingList = rest.patch(
  `${BASE_URI}/shopping_lists/:id`,
  async (req, res, ctx) => {
    const listId: number = Number(req.params.id)
    if (listIds.indexOf(listId) < 0) return res(ctx.status(404))

    const list = allShoppingLists.find(({ id }) => id === listId)
    const { title } = await req.json()

    return res(ctx.status(200), ctx.json({ ...list, title }))
  }
)

// Returns the same validation errors regardless of request
// body submitted
export const patchShoppingListUnprocessable = rest.patch(
  `${BASE_URI}/shopping_lists/:id`,
  (_req, res, ctx) => {
    return res(
      ctx.status(422),
      ctx.json({
        errors: [
          'Title must be unique per game',
          "Title can only contain alphanumeric characters, spaces, commas (,), hyphens (-), and apostrophes (')",
        ],
      })
    )
  }
)

export const patchShoppingListServerError = rest.patch(
  `${BASE_URI}/shopping_lists/:id`,
  (_req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        errors: ['Something went horribly wrong'],
      })
    )
  }
)

/**
 *
 * DELETE /shopping_lists/:id
 *
 */

// Covers both success and 404 cases
export const deleteShoppingList = rest.delete(
  `${BASE_URI}/shopping_lists/:listId`,
  (req, res, ctx) => {
    const listId = Number(req.params.listId)
    const list = allShoppingLists.find(({ id }) => id === listId)

    if (!list) return res(ctx.status(404))

    const lists = shoppingListsForGame(list.game_id)

    let json
    if (lists.length === 2) {
      json = {
        deleted: lists.map(({ id }) => id),
      }
    } else {
      json = {
        deleted: [list.id],
        aggregate: lists[0],
      }
    }

    return res(ctx.status(200), ctx.json(json))
  }
)

export const deleteShoppingListServerError = rest.delete(
  `${BASE_URI}/shopping_lists/:listId`,
  (_req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        errors: ['Something went horribly wrong'],
      })
    )
  }
)
