import { rest } from 'msw'
import { type ResponseShoppingList } from '../../types/apiData'
import { allGames } from '../data/games'
import { allShoppingLists, shoppingListsForGame } from '../data/shoppingLists'

const BASE_URI = 'http://localhost:3000'

/**
 *
 * GET /games/:game_id/shopping_lists
 *
 */

export const getShoppingListsSuccess = rest.post(
  `${BASE_URI}/games/:gameId/shopping_lists`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(shoppingListsForGame(Number(req.params.gameId)))
    )
  }
)
