import { type GamesContextType } from '../../contexts/gamesContext'
import { type LoginContextType } from '../../contexts/loginContext'
import { type ShoppingListsContextType } from '../../contexts/shoppingListsContext'
import { DONE, LOADING } from '../../utils/loadingStates'
import { testUser } from './users'
import { allGames } from './games'
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

export const gamesContextValue: GamesContextType = {
  games: allGames,
  gamesLoadingState: DONE,
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
}

export const shoppingListContextValue: ShoppingListsContextType = {
  shoppingLists: shoppingListsForGame(51),
  shoppingListsLoadingState: DONE,
}

export const shoppingListContextValueLoading: ShoppingListsContextType = {
  shoppingLists: emptyShoppingLists,
  shoppingListsLoadingState: LOADING,
}
