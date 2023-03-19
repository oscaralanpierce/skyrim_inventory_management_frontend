import {
  type ResponseShoppingList as ShoppingList,
  type ResponseShoppingListItem as ListItem,
} from '../../types/apiData'
import { shoppingListItemsOnList } from './shoppingListItems'

/**
 *
 * Shopping lists are related to games in that each shopping list belongs to a
 * particular game. Shopping lists in this file have a `game_id` corresponding
 * to one of the games in the `allGames` array exported from /src/support/data/games.ts.
 * The empty shopping lists array could hypothetically belong to any of the games.
 *
 */

const emptyListItems: ListItem[] = []

export const emptyShoppingLists: ShoppingList[] = []

export const allShoppingLists: ShoppingList[] = [
  {
    id: 1,
    game_id: 32,
    aggregate_list_id: null,
    aggregate: true,
    title: 'All Items',
    list_items: shoppingListItemsOnList(1),
    created_at: new Date('2023-01-02T03:54:02'),
    updated_at: new Date('2023-01-02T03:54:02'),
  },
  {
    id: 2,
    game_id: 32,
    aggregate_list_id: 1,
    aggregate: false,
    title: 'My Shopping List 1',
    list_items: shoppingListItemsOnList(2),
    created_at: new Date('2023-01-02T03:54:02'),
    updated_at: new Date('2023-01-02T03:54:02'),
  },
  {
    id: 3,
    game_id: 77,
    aggregate_list_id: null,
    aggregate: true,
    title: 'All Items',
    list_items: shoppingListItemsOnList(3),
    created_at: new Date('2023-02-12T15:17:33'),
    updated_at: new Date('2023-02-12T15:17:33'),
  },
  {
    id: 4,
    game_id: 77,
    aggregate_list_id: 3,
    aggregate: false,
    title: 'Honeyside',
    list_items: shoppingListItemsOnList(4),
    created_at: new Date('2023-02-21T11:13:27'),
    updated_at: new Date('2023-02-21T11:13:27'),
  },
  {
    id: 5,
    game_id: 77,
    aggregate_list_id: 3,
    aggregate: false,
    title: 'Breezehome',
    list_items: shoppingListItemsOnList(5),
    created_at: new Date('2023-02-12T15:17:33'),
    updated_at: new Date('2023-02-12T15:17:33'),
  },
  {
    id: 6,
    game_id: 77,
    aggregate_list_id: 3,
    aggregate: false,
    title: 'Hjerim',
    list_items: emptyListItems,
    created_at: new Date('2023-01-03T12:47:55'),
    updated_at: new Date('2023-01-03T12:47:55'),
  },
]

export const shoppingListsForGame = (gameId: number) =>
  allShoppingLists.filter(({ game_id }) => game_id === gameId)
