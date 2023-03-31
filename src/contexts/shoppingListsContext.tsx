import { createContext, useEffect, useState, useCallback } from 'react'
import { signOutWithGoogle } from '../firebase'
import { type CallbackFunction } from '../types/functions'
import {
  type RequestShoppingListItem,
  type RequestShoppingList,
  type ResponseShoppingList,
} from '../types/apiData'
import { type ProviderProps } from '../types/contexts'
import { type ApiError } from '../types/errors'
import { LOADING, DONE, ERROR, type LoadingState } from '../utils/loadingStates'
import {
  postShoppingLists,
  getShoppingLists,
  patchShoppingList,
  deleteShoppingList,
  postShoppingListItems,
  deleteShoppingListItem,
} from '../utils/api/simApi'
import { useQueryString } from '../hooks/useQueryString'
import {
  useGoogleLogin,
  usePageContext,
  useGamesContext,
} from '../hooks/contexts'

const UNEXPECTED_ERROR_MESSAGE =
  "Oops! Something unexpected went wrong. We're sorry! Please try again later."

export interface ShoppingListsContextType {
  shoppingLists: ResponseShoppingList[]
  shoppingListsLoadingState: LoadingState
  createShoppingList: (
    attributes: RequestShoppingList,
    onSuccess?: CallbackFunction,
    onError?: CallbackFunction
  ) => void
  updateShoppingList: (
    listId: number,
    attributes: RequestShoppingList,
    onSuccess?: CallbackFunction,
    onError?: CallbackFunction
  ) => void
  destroyShoppingList: (
    listId: number,
    onSuccess?: CallbackFunction,
    onError?: CallbackFunction
  ) => void
  createShoppingListItem: (
    listId: number,
    attributes: RequestShoppingListItem,
    onSuccess?: CallbackFunction,
    onError?: CallbackFunction
  ) => void
  destroyShoppingListItem: (
    itemId: number,
    onSuccess?: CallbackFunction,
    onError?: CallbackFunction
  ) => void
}

export const ShoppingListsContext = createContext<ShoppingListsContextType>({
  shoppingLists: [] as ResponseShoppingList[],
  shoppingListsLoadingState: LOADING,
  createShoppingList: () => {},
  updateShoppingList: () => {},
  destroyShoppingList: () => {},
  createShoppingListItem: () => {},
  destroyShoppingListItem: () => {},
})

export const ShoppingListsProvider = ({ children }: ProviderProps) => {
  const { user, token, authLoading, requireLogin } = useGoogleLogin()
  const { setFlashProps } = usePageContext()
  const { gamesLoadingState, games } = useGamesContext()
  const queryString = useQueryString()
  const [activeGame, setActiveGame] = useState<number | null>(null)
  const [shoppingListsLoadingState, setShoppingListsLoadingState] =
    useState(LOADING)
  const [shoppingLists, setShoppingLists] = useState<ResponseShoppingList[]>([])

  /**
   *
   * General handler for any ApiError
   *
   */

  const handleApiError = (e: ApiError, resource?: 'list' | 'list item') => {
    if (import.meta.env.DEV) console.error(e.message)

    if (e.code === 401) {
      signOutWithGoogle()
    } else if (e.code === 422) {
      setFlashProps({
        hidden: false,
        type: 'error',
        header: `${e.message.length} error(s) prevented your shopping ${
          resource || 'list'
        } from being saved:`,
        message: e.message,
      })
    } else {
      const message =
        e.code === 405
          ? "You can't manually manage an aggregate list."
          : UNEXPECTED_ERROR_MESSAGE

      setFlashProps({
        hidden: false,
        type: 'error',
        message,
      })
    }
  }

  /**
   *
   * Create shopping list for the active game
   *
   */

  const createShoppingList = useCallback(
    (
      attributes: RequestShoppingList,
      onSuccess?: CallbackFunction,
      onError?: CallbackFunction
    ) => {
      if (!activeGame) {
        setFlashProps({
          hidden: false,
          type: 'warning',
          message:
            'You must select a game from the dropdown before creating a shopping list.',
        })

        return
      }

      if (user && token) {
        postShoppingLists(activeGame, attributes, token)
          .then(({ json }) => {
            if (Array.isArray(json)) {
              if (json.length == 2) {
                setShoppingLists(json)
              } else {
                const newShoppingLists = shoppingLists
                newShoppingLists.splice(1, 0, json[0])
                setShoppingLists(newShoppingLists)
              }

              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your shopping list has been created.',
              })

              onSuccess && onSuccess()
            }
          })
          .catch((e: ApiError) => {
            if (e.code === 404) {
              setFlashProps({
                hidden: false,
                type: 'error',
                message:
                  "The game you've selected doesn't exist, or doesn't belong to you. Please select another game and try again.",
              })
            } else {
              handleApiError(e)
            }

            onError && onError()
          })
      }
    },
    [user, token, activeGame, shoppingLists]
  )

  /**
   *
   * Fetch shopping lists for the active game
   *
   */

  const fetchShoppingLists = useCallback(() => {
    if (!activeGame) return

    if (user && token && activeGame) {
      setShoppingListsLoadingState(LOADING)

      getShoppingLists(activeGame, token)
        .then(({ json }) => {
          if (Array.isArray(json)) {
            setShoppingLists(json)
            setShoppingListsLoadingState(DONE)
          }
        })
        .catch((e: ApiError) => {
          if (e.code === 404) {
            setFlashProps({
              hidden: false,
              type: 'error',
              message:
                "The game you've selected doesn't exist, or doesn't belong to you. Please select another game and try again.",
            })
          } else {
            handleApiError(e)
          }

          setShoppingLists([])
          setShoppingListsLoadingState(ERROR)
        })
    }
  }, [user, token, activeGame])

  /**
   *
   * Update specified shopping list
   *
   */

  const updateShoppingList = useCallback(
    (
      listId: number,
      attributes: RequestShoppingList,
      onSuccess?: CallbackFunction,
      onError?: CallbackFunction
    ) => {
      if (user && token) {
        patchShoppingList(listId, attributes, token)
          .then(({ status, json }) => {
            if (status === 200) {
              const newShoppingLists = [...shoppingLists]
              const index = newShoppingLists.findIndex(
                ({ id }) => id === listId
              )
              newShoppingLists[index] = json

              setShoppingLists(newShoppingLists)

              onSuccess && onSuccess()
            } else {
              // This won't happen but TypeScript doesn't know that
              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE,
              })

              onError && onError()
            }
          })
          .catch((e: ApiError) => {
            if (e.code === 404) {
              setFlashProps({
                hidden: false,
                type: 'error',
                message:
                  "The shopping list you tried to update doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e)
            }

            onError && onError()
          })
      }
    },
    [user, token, shoppingLists]
  )

  /**
   *
   * Destroy specified shopping list
   *
   */

  const destroyShoppingList = useCallback(
    (
      listId: number,
      onSuccess?: CallbackFunction,
      onError?: CallbackFunction
    ) => {
      if (user && token) {
        deleteShoppingList(listId, token)
          .then(({ json }) => {
            if ('errors' in json) {
              // This case should never happen because normally an ApiError
              // will be thrown for any response that includes this key, but
              // TypeScript doesn't know that.
              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE,
              })

              onError && onError()
            } else {
              const newShoppingLists = shoppingLists

              if (json.aggregate) newShoppingLists[0] = json.aggregate

              for (const deletedId of json.deleted) {
                const index = newShoppingLists.findIndex(
                  (list) => list?.id === deletedId
                )
                delete newShoppingLists[index]
              }

              setShoppingLists(newShoppingLists.filter((list) => !!list))
              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your shopping list has been deleted.',
              })

              onSuccess && onSuccess()
            }
          })
          .catch((e: ApiError) => {
            if (e.code === 404) {
              setFlashProps({
                hidden: false,
                type: 'error',
                message:
                  "The shopping list you tried to delete doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e)
            }

            onError && onError()
          })
      }
    },
    [user, token, shoppingLists]
  )

  /**
   *
   * Create a new shopping list item
   *
   */

  const createShoppingListItem = useCallback(
    (
      listId: number,
      attributes: RequestShoppingListItem,
      onSuccess?: CallbackFunction,
      onError?: CallbackFunction
    ) => {
      if (user && token) {
        postShoppingListItems(listId, attributes, token)
          .then(({ status, json }) => {
            if (status === 200 || status === 201) {
              const newShoppingLists = [...shoppingLists]

              for (let list of json) {
                const index = newShoppingLists.findIndex(
                  ({ id }) => id === list.id
                )
                newShoppingLists[index] = list
              }

              setShoppingLists(newShoppingLists)

              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your shopping list item has been created.',
              })

              onSuccess && onSuccess()
            } else {
              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE,
              })

              onError && onError()
            }
          })
          .catch((e: ApiError) => {
            if (e.code === 404) {
              setFlashProps({
                hidden: false,
                type: 'error',
                message:
                  "The shopping list you tried to add an item to doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e, 'list item')
            }

            onError && onError()
          })
      }
    },
    [user, token, shoppingLists]
  )

  /**
   *
   * Destroy a shopping list item
   *
   */

  const destroyShoppingListItem = useCallback(
    (
      itemId: number,
      onSuccess?: CallbackFunction,
      onError?: CallbackFunction
    ) => {
      if (user && token) {
        deleteShoppingListItem(itemId, token)
          .then(({ status, json }) => {
            if (status === 200) {
              const newShoppingLists = [...shoppingLists]

              newShoppingLists[0] = json[0]

              const index = newShoppingLists.findIndex(
                ({ id }) => id === json[1].id
              )
              newShoppingLists[index] = json[1]

              setShoppingLists(newShoppingLists)
              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your shopping list item was deleted.',
              })

              onSuccess && onSuccess()
            } else {
              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE,
              })

              onError && onError()
            }
          })
          .catch((e: ApiError) => {
            if (e.code === 404) {
              setFlashProps({
                hidden: false,
                type: 'error',
                message:
                  "You have tried to delete a list item that doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e, 'list item')
            }

            onError && onError()
          })
      }
    },
    [user, token, shoppingLists]
  )

  /**
   *
   * Set the context provider value
   *
   */

  const value = {
    shoppingLists,
    shoppingListsLoadingState,
    createShoppingList,
    updateShoppingList,
    destroyShoppingList,
    createShoppingListItem,
    destroyShoppingListItem,
  }

  /**
   *
   * Set the active game automatically from the query string
   * or, failing that, from the games themselves when they load
   *
   */

  useEffect(() => {
    const gameId: number = Number(queryString.get('gameId'))

    if (gameId > 0) {
      setActiveGame(gameId)
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
