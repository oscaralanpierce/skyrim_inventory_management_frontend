import {
  postGames,
  getGames,
  patchGame,
  deleteGame,
} from './wrapper/gameEndpoints'
import {
  postShoppingLists,
  getShoppingLists,
  patchShoppingList,
  deleteShoppingList,
} from './wrapper/shoppingListEndpoints'
import {
  postShoppingListItems,
  deleteShoppingListItem,
} from './wrapper/shoppinglistItemEndpoints'

export {
  postGames,
  getGames,
  patchGame,
  deleteGame,
  postShoppingLists,
  getShoppingLists,
  patchShoppingList,
  deleteShoppingList,
  postShoppingListItems,
  deleteShoppingListItem,
}
