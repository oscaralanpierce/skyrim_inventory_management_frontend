import { type GamesContextType } from '../../contexts/gamesContext'
import { type LoginContextType } from '../../contexts/loginContext'
import { type ShoppingListsContextType } from '../../contexts/shoppingListsContext'
import { DONE, ERROR, LOADING } from '../../utils/loadingStates'
import { testUser } from './users'
import { allGames, emptyGames } from './games'
import { emptyShoppingLists, shoppingListsForGame } from './shoppingLists'

const noop = () => {}

/**
 *
 * Default values for Login context
 *
 */

export const loginContextValue: LoginContextType = {
  user: testUser,
  token: 'xxxxxxx',
  requireLogin: noop,
  authLoading: false,
}

export const loadingLoginContextValue: LoginContextType = {
  user: null,
  token: null,
  requireLogin: noop,
  authLoading: true,
}

export const unauthenticatedLoginContextValue: LoginContextType = {
  user: null,
  token: null,
  requireLogin: noop,
  authLoading: false,
}

/**
 *
 * Default value for Games context
 *
 */

export const gamesContextValueEmpty: GamesContextType = {
  games: emptyGames,
  gamesLoadingState: DONE,
  createGame: noop,
  updateGame: noop,
  destroyGame: noop,
}

export const gamesContextValue: GamesContextType = {
  games: allGames,
  gamesLoadingState: DONE,
  createGame: noop,
  updateGame: noop,
  destroyGame: noop,
}

export const gamesContextValueLoading: GamesContextType = {
  games: [],
  gamesLoadingState: LOADING,
  createGame: noop,
  updateGame: noop,
  destroyGame: noop,
}

export const gamesContextValueError: GamesContextType = {
  games: [],
  gamesLoadingState: ERROR,
  createGame: noop,
  updateGame: noop,
  destroyGame: noop,
}

/**
 *
 * Default values for Shopping Lists context
 *
 */

export const shoppingListsContextValueEmpty: ShoppingListsContextType = {
  shoppingLists: emptyShoppingLists,
  shoppingListsLoadingState: DONE,
  createShoppingList: noop,
  updateShoppingList: noop,
  destroyShoppingList: noop,
  createShoppingListItem: noop,
}

export const shoppingListsContextValue: ShoppingListsContextType = {
  shoppingLists: shoppingListsForGame(77),
  shoppingListsLoadingState: DONE,
  createShoppingList: noop,
  updateShoppingList: noop,
  destroyShoppingList: noop,
  createShoppingListItem: noop,
}

export const shoppingListsContextValueLoading: ShoppingListsContextType = {
  shoppingLists: emptyShoppingLists,
  shoppingListsLoadingState: LOADING,
  createShoppingList: noop,
  updateShoppingList: noop,
  destroyShoppingList: noop,
  createShoppingListItem: noop,
}

export const shoppingListsContextValueError: ShoppingListsContextType = {
  shoppingLists: emptyShoppingLists,
  shoppingListsLoadingState: ERROR,
  createShoppingList: noop,
  updateShoppingList: noop,
  destroyShoppingList: noop,
  createShoppingListItem: noop,
}
