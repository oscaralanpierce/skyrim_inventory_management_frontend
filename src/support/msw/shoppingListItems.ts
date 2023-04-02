import { rest } from 'msw'
import { allShoppingLists, shoppingListsForGame } from '../data/shoppingLists'
import { allShoppingListItems } from '../data/shoppingListItems'
import { newShoppingListItem } from './helpers/data'

const BASE_URI = 'http://localhost:3000'
const listIds = allShoppingLists.map(({ id }) => id)

/**
 *
 * POST /shopping_lists/:list_id/list_items
 *
 */

// Handles 201 and 404 responses
export const postShoppingListItemsSuccess = rest.post(
  `${BASE_URI}/shopping_lists/:listId/shopping_list_items`,
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
  `${BASE_URI}/shopping_lists/:listId/shopping_list_items`,
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
  `${BASE_URI}/shopping_lists/:listId/shopping_list_items`,
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
 * PATCH /shopping_list_items/:id
 *
 */

export const incrementShoppingListItemSuccess = rest.patch(
  `${BASE_URI}/shopping_list_items/:id`,
  async (req, res, ctx) => {
    const itemId: number = Number(req.params.id)
    const item = allShoppingListItems.find(({ id }) => id === itemId)
    const list = allShoppingLists.find(({ id }) => id === item?.list_id)

    if (!item || !list) return res(ctx.status(404))

    const allItems = shoppingListsForGame(list.game_id).flatMap(
      ({ list_items }) =>
        list_items.filter(({ description }) => description === item.description)
    )

    const aggListItem = { ...allItems[0], quantity: allItems[0].quantity + 1 }
    const regItem = { ...item, quantity: item.quantity + 1 }

    return res(ctx.status(200), ctx.json([aggListItem, regItem]))
  }
)

export const decrementShoppingListItemSuccess = rest.patch(
  `${BASE_URI}/shopping_list_items/:id`,
  async (req, res, ctx) => {
    const itemId: number = Number(req.params.id)
    const item = allShoppingListItems.find(({ id }) => id === itemId)
    const list = allShoppingLists.find(({ id }) => id === item?.list_id)

    if (!item || !list) return res(ctx.status(404))

    const allItems = shoppingListsForGame(list.game_id).flatMap(
      ({ list_items }) =>
        list_items.filter(({ description }) => description === item.description)
    )
    const aggListItem = { ...allItems[0], quantity: allItems[0].quantity - 1 }
    const regItem = { ...item, quantity: item.quantity - 1 }

    return res(ctx.status(200), ctx.json([aggListItem, regItem]))
  }
)

// Returns the same validation errors regardless of request body
export const updateShoppingListItemUnprocessable = rest.patch(
  `${BASE_URI}/shopping_list_items/:id`,
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

export const updateShoppingListItemServerError = rest.patch(
  `${BASE_URI}/shopping_list_items/:id`,
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
 * DELETE /shopping_list_items/:id
 *
 */

// Note: If the list item, list, and aggregate list are all
//       found in the test data, this will delete the item
//       from the regular list AND the aggregate list regardless
//       of whether there are other matching items. This function
//       does not match the complexity of back-end behaviour.
export const deleteShoppingListItemSuccess = rest.delete(
  `${BASE_URI}/shopping_list_items/:id`,
  (req, res, ctx) => {
    const itemId: number = Number(req.params.id)
    const item = allShoppingListItems.find(({ id }) => id === itemId)

    if (!item) return res(ctx.status(404))

    const listId = item.list_id
    const regList = allShoppingLists.find(({ id }) => id === listId)

    if (!regList) return res(ctx.status(404))

    const aggListId = regList.aggregate_list_id
    const aggList = allShoppingLists.find(({ id }) => id === aggListId)

    if (!aggList) return res(ctx.status(404))

    const list = { ...regList }
    const aggregate = { ...aggList }

    list.list_items = list.list_items.filter(({ id }) => id !== itemId)
    aggregate.list_items = aggregate.list_items.filter(
      ({ description }) => description !== item.description
    )

    return res(ctx.status(200), ctx.json([aggregate, list]))
  }
)

export const deleteShoppingListItemServerError = rest.delete(
  `${BASE_URI}/shopping_list_items/:id`,
  (_req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ errors: ['Something went horribly wrong'] })
    )
  }
)
