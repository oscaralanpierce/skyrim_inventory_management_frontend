import {
  type RequestShoppingListItem,
  type RequestShoppingList,
  type ResponseShoppingListItem,
  type ResponseShoppingList,
} from '../../../types/apiData'
import { allGames } from '../../data/games'
import {
  allShoppingLists,
  shoppingListsForGame,
} from '../../data/shoppingLists'

const gameIds = allGames.map(({ id }) => id)

/**
 *
 * Shopping List Creation
 *
 */

export const newShoppingList = (
  attributes: RequestShoppingList,
  gameId: number
): ResponseShoppingList[] => {
  if (gameIds.indexOf(gameId) < 0)
    throw new Error(
      'Cannot generate shopping list for game that does not exist in test data'
    )

  const existingLists = shoppingListsForGame(gameId)

  if (!existingLists.length)
    throw new Error(
      'Cannot generate single list for game without existing aggregate'
    )

  return [
    {
      id: 93,
      game_id: gameId,
      aggregate: false,
      aggregate_list_id: existingLists[0].id,
      title: attributes.title || 'New Shopping List',
      list_items: [],
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]
}

export const newShoppingListWithAggregate = (
  attributes: RequestShoppingList,
  gameId: number
): ResponseShoppingList[] => {
  if (gameIds.indexOf(gameId) < 0)
    throw new Error(
      'Cannot generate shopping list for game that does not exist in test data'
    )

  const existingLists = shoppingListsForGame(gameId)

  if (existingLists.length)
    throw new Error(
      'Cannot generate new aggregate list for game that already has one'
    )

  return [
    {
      id: 93,
      game_id: gameId,
      aggregate: true,
      aggregate_list_id: null,
      title: 'All Items',
      list_items: [],
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 94,
      game_id: gameId,
      aggregate: false,
      aggregate_list_id: 93,
      title: attributes.title || 'My Shopping List 1',
      list_items: [],
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]
}

/**
 *
 * Shopping list item creation
 *
 */

export const newShoppingListItem = (
  attributes: RequestShoppingListItem,
  listId: number
) => {
  const shoppingList = allShoppingLists.find(({ id }) => id === listId)

  if (!shoppingList)
    throw new Error(`No shopping list with ID ${listId} in the test data`)

  const allLists = shoppingListsForGame(shoppingList.game_id)
  const aggregateList = allLists[0]

  const newItem: ResponseShoppingListItem = {
    id: 42,
    list_id: listId,
    unit_weight: null,
    notes: null,
    created_at: new Date(),
    updated_at: new Date(),
    ...attributes,
  }

  const newAggregateListItem: ResponseShoppingListItem = {
    ...newItem,
    id: 43,
    list_id: aggregateList.id,
  }

  aggregateList.list_items = [newAggregateListItem, ...aggregateList.list_items]
  shoppingList.list_items = [newItem, ...shoppingList.list_items]

  return [aggregateList, shoppingList]
}
