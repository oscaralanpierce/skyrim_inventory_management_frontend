import { rest } from 'msw'
import { allShoppingListItems } from '../data/shoppingListItems'
import { newShoppingListItem } from './helpers/data'

const BASE_URI = 'http://localhost:3000'
const listIds = allShoppingListItems.map(({ id }) => id)

/**
 *
 * POST /shopping_lists/:list_id/list_items
 *
 */

// Handles 201 and 404 responses
export const postShoppingListItemsSuccess = rest.post(
  `${BASE_URI}/shopping_lists/:listId/list_items`,
  async (req, res, ctx) => {
    const listId: number = Number(req.params.listId)

    if (listIds.indexOf(listId) < 0) return res(ctx.status(404))

    const attributes = await req.json()

    return res(
      ctx.status(201),
      ctx.json(newShoppingListItem(attributes, listId))
    )
  }
)

// Returns the same validation errors regardless of request body
// submitted
export const postShoppingListItemsUnprocessable = rest.post(
  `${BASE_URI}/shopping_lists/:listId/list_items`,
  (_req, res, ctx) => {
    return res(
      ctx.status(422),
      ctx.json({
        errors: [
          'Quantity must be greater than 0',
          'Unit weight must be greater than or equal to 0',
        ],
      })
    )
  }
)

export const postShoppingListItemsServerError = rest.post(
  `${BASE_URI}/shoppingLists/:listId/list_items`,
  (_req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        errors: ['Something went horribly wrong'],
      })
    )
  }
)
