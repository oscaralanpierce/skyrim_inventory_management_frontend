import { rest } from 'msw'
import {
  type RequestShoppingList,
  type ResponseShoppingList,
} from '../../types/apiData'
import { allGames } from '../data/games'
import { shoppingListsForGame } from '../data/shoppingLists'
import { newShoppingList, newShoppingListWithAggregate } from './helpers/data'

const BASE_URI = 'http://localhost:3000'
const gameIds = allGames.map(({ id }) => id)

/**
 *
 * POST /games/:game_id/shopping_lists
 *
 */

// Handles both 201 and 404 responses
export const postShoppingList = rest.post(
  `${BASE_URI}/games/:gameId/shopping_lists`,
  async (req, res, ctx) => {
    const gameId = Number(req.params.gameId)

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
export const postShoppingListUnprocessable = rest.post(
  `${BASE_URI}/games/:gameId/shopping_lists`,
  (_req, res, ctx) => {
    return res(
      ctx.status(422),
      ctx.json({
        errors: [
          'Title must be unique',
          "Title can only contain alphanumeric characters, spaces, commas (,), hyphens (-), and apostrophes (')",
        ],
      })
    )
  }
)

export const postShoppingListServerError = rest.post(
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

export const getShoppingListsSuccess = rest.get(
  `${BASE_URI}/games/:gameId/shopping_lists`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(shoppingListsForGame(Number(req.params.gameId)))
    )
  }
)
