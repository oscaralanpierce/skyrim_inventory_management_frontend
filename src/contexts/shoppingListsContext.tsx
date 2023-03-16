import { createContext, useEffect, useState, useCallback } from 'react'
import { signOutWithGoogle } from '../firebase'
import { type ResponseShoppingList as ShoppingList } from '../types/apiData'
import { type ProviderProps } from '../types/contexts'
import { getShoppingLists } from '../utils/api/simApi'
import {
  useGoogleLogin,
  usePageContext,
  useGamesContext,
} from '../hooks/contexts'
import { useQueryString } from '../hooks/useQueryString'
import { ApiError } from '../types/errors'
import { LOADING, DONE, ERROR, type LoadingState } from '../utils/loadingStates'

const NOT_FOUND_MESSAGE =
  "You have requested shopping lists for a game that doesn't exist, or doesn't belong to you. Please select another game and try again."
const UNEXPECTED_ERROR_MESSAGE =
  "Oops! Something unexpected went wrong. We're sorry! Please try again later."

export interface ShoppingListsContextType {
  shoppingLists: ShoppingList[]
  shoppingListsLoadingState: LoadingState
}

export const ShoppingListsContext = createContext<ShoppingListsContextType>({
  shoppingLists: [] as ShoppingList[],
  shoppingListsLoadingState: LOADING,
})

export const ShoppingListsProvider = ({ children }: ProviderProps) => {
  const { user, token, authLoading, requireLogin } = useGoogleLogin()
  const { setFlashProps } = usePageContext()
  const { gamesLoadingState, games } = useGamesContext()
  const queryString = useQueryString()
  const [activeGame, setActiveGame] = useState<number | null>(null)
  const [shoppingListsLoadingState, setShoppingListsLoadingState] =
    useState(LOADING)
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])

  /**
   *
   * General handler for any ApiError
   *
   */

  const handleApiError = (e: ApiError) => {
    if (import.meta.env.DEV) console.error(e.message)

    if (e.code === 401) signOutWithGoogle()

    const message =
      e.code === 404 ? NOT_FOUND_MESSAGE : UNEXPECTED_ERROR_MESSAGE

    setFlashProps({
      hidden: false,
      type: 'error',
      message,
    })
  }

  /**
   *
   * Fetch shopping lists for the active game
   *
   */

  const fetchShoppingLists = useCallback(() => {
    if (!activeGame) return

    if (user && token && activeGame) {
      getShoppingLists(activeGame, token)
        .then(({ json }) => {
          if (Array.isArray(json)) {
            setShoppingLists(json)
            setShoppingListsLoadingState(DONE)
          }
        })
        .catch((e: ApiError) => {
          handleApiError(e)
          setShoppingLists([])
          setShoppingListsLoadingState(ERROR)
        })
    }
  }, [user, token, activeGame])

  /**
   *
   * Set the context provider value
   *
   */

  const value = {
    shoppingLists,
    shoppingListsLoadingState,
  }

  /**
   *
   * Set the active game automatically from the query string
   * or, failing that, from the games themselves when they load
   *
   */

  useEffect(() => {
    if (queryString.get('gameId')) {
      setActiveGame(Number(queryString.get('gameId')))
    } else if (gamesLoadingState === DONE && games.length) {
      setActiveGame(games[0].id)
    }
  }, [queryString, gamesLoadingState, games])

  useEffect(() => {
    if (authLoading) return

    fetchShoppingLists()
  }, [authLoading, fetchShoppingLists])

  useEffect(() => {
    requireLogin()
  }, [requireLogin])

  return (
    <ShoppingListsContext.Provider value={value}>
      {children}
    </ShoppingListsContext.Provider>
  )
}
