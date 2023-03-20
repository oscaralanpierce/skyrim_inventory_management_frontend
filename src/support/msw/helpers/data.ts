import {
  type RequestShoppingList,
  type ResponseShoppingList,
} from '../../../types/apiData'
import { allGames } from '../../data/games'
import { shoppingListsForGame } from '../../data/shoppingLists'

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
