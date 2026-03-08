import { createContext, useEffect, useState, useRef, useCallback } from 'react'
import { type CallbackFunction } from '../types/functions'
import {
  type RequestWishListItem,
  type RequestWishList,
  type ResponseWishList,
} from '../types/apiData'
import { type ProviderProps } from '../types/contexts'
import { type ApiError } from '../types/errors'
import { LOADING, DONE, ERROR, type LoadingState } from '../utils/loadingStates'
import {
  postWishLists,
  getWishLists,
  patchWishList,
  deleteWishList,
  postWishListItems,
  patchWishListItem,
  deleteWishListItem,
} from '../utils/api/simApi'
import { useQueryString } from '../hooks/useQueryString'
import {
  useGoogleLogin,
  usePageContext,
  useGamesContext,
} from '../hooks/contexts'

const UNEXPECTED_ERROR_MESSAGE =
  "Oops! Something unexpected went wrong. We're sorry! Please try again later."

export interface WishListsContextType {
  wishLists: ResponseWishList[]
  wishListsLoadingState: LoadingState
  createWishList: (
    attributes: RequestWishList,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
  updateWishList: (
    listId: number,
    attributes: RequestWishList,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
  destroyWishList: (
    listId: number,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
  createWishListItem: (
    listId: number,
    attributes: RequestWishListItem,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
  updateWishListItem: (
    itemId: number,
    attributes: RequestWishListItem,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
  destroyWishListItem: (
    itemId: number,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
}

export const WishListsContext = createContext<WishListsContextType>({
  wishLists: [] as ResponseWishList[],
  wishListsLoadingState: LOADING,
  createWishList: () => {},
  updateWishList: () => {},
  destroyWishList: () => {},
  createWishListItem: () => {},
  updateWishListItem: () => {},
  destroyWishListItem: () => {},
})

export const WishListsProvider = ({ children }: ProviderProps) => {
  const { token, authLoading, requireLogin, withTokenRefresh, signOut } =
    useGoogleLogin()
  const { setFlashProps, addApiCall, removeApiCall } = usePageContext()
  const { gamesLoadingState, games } = useGamesContext()
  const queryString = useQueryString()
  const [activeGame, setActiveGame] = useState<number | null>(null)
  const [wishListsLoadingState, setWishListsLoadingState] =
    useState(LOADING)
  const [wishLists, setWishLists] = useState<ResponseWishList[]>([])
  const previousTokenRef = useRef(token)

  /**
   *
   * General handler for any ApiError
   *
   */

  const handleApiError = (e: ApiError, resource?: 'list' | 'list item') => {
    if (import.meta.env.DEV) console.error(e.message)

    if (e.code === 401) {
      signOut()
    } else if (e.code === 422) {
      setFlashProps({
        hidden: false,
        type: 'error',
        header: `${e.message.length} error(s) prevented your wish ${
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
   * Create wish list for the active game
   *
   */

  const createWishList = useCallback(
    (
      attributes: RequestWishList,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      if (!activeGame) {
        setFlashProps({
          hidden: false,
          type: 'warning',
          message:
            'You must select a game from the dropdown before creating a wish list.',
        })

        return
      }

      idToken ??= token

      if (idToken) {
        addApiCall('wishLists', 'post')
        postWishLists(activeGame, attributes, idToken)
          .then(({ json }) => {
            if (Array.isArray(json)) {
              if (json.length == 2) {
                setWishLists(json)
              } else {
                const newWishLists = [...wishLists]
                newWishLists.splice(1, 0, json[0])
                setWishLists(newWishLists)
              }

              removeApiCall('wishLists', 'post')

              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your wish list has been created.',
              })

              if (onSuccess) onSuccess()
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                createWishList(
                  attributes,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            } else if (e.code === 404) {
              setFlashProps({
                hidden: false,
                type: 'error',
                message:
                  "The game you've selected doesn't exist, or doesn't belong to you. Please select another game and try again.",
              })
            } else {
              handleApiError(e)
            }

            removeApiCall('wishLists', 'post')
            if (onError) onError()
          })
      }
    },
    [token, activeGame, wishLists]
  )

  /**
   *
   * Fetch wish lists for the active game and set
   * them as the wishLists array
   *
   */

  const setWishListsFromApi = (
    idToken: string | null = token,
    retries: number = 1
  ) => {
    if (!activeGame || !idToken) return

    addApiCall('wishLists', 'get')
    getWishLists(activeGame, idToken)
      .then(({ json }) => {
        if (Array.isArray(json)) {
          setWishLists(json)
          setWishListsLoadingState(DONE)
          removeApiCall('wishLists', 'get')
        }
      })
      .catch((e: ApiError) => {
        if (e.code === 401 && retries > 0) {
          return withTokenRefresh((newToken) => {
            setWishListsFromApi(newToken, retries - 1)
          })
        } else if (e.code === 404) {
          setFlashProps({
            hidden: false,
            type: 'error',
            message:
              "The game you've selected doesn't exist, or doesn't belong to you. Please select another game and try again.",
          })
        } else {
          handleApiError(e)
        }

        removeApiCall('wishLists', 'get')
        setWishLists([])
        setWishListsLoadingState(ERROR)
      })
  }

  const fetchWishLists = useCallback(() => {
    if (token && activeGame) {
      setWishListsLoadingState(LOADING)
      setWishListsFromApi()
    }
  }, [token, activeGame])

  /**
   *
   * Update specified wish list
   *
   */

  const updateWishList = useCallback(
    (
      listId: number,
      attributes: RequestWishList,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('wishLists', 'patch')
        patchWishList(listId, attributes, idToken)
          .then(({ status, json }) => {
            if (status === 200) {
              const newWishLists = [...wishLists]
              const index = newWishLists.findIndex(
                ({ id }) => id === listId
              )
              newWishLists[index] = json

              setWishLists(newWishLists)
              removeApiCall('wishLists', 'patch')
              if (onSuccess) onSuccess()
            } else {
              // This won't happen but TypeScript doesn't know that
              removeApiCall('wishLists', 'patch')

              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE,
              })

              if (onError) onError()
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                updateWishList(
                  listId,
                  attributes,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            } else if (e.code === 404) {
              setFlashProps({
                hidden: false,
                type: 'error',
                message:
                  "The wish list you tried to update doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e)
            }

            removeApiCall('wishLists', 'patch')
            if (onError) onError()
          })
      }
    },
    [token, wishLists]
  )

  /**
   *
   * Destroy specified wish list
   *
   */

  const destroyWishList = useCallback(
    (
      listId: number,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('wishLists', 'delete')
        deleteWishList(listId, idToken)
          .then(({ json }) => {
            if ('errors' in json) {
              // This case should never happen because normally an ApiError
              // will be thrown for any response that includes this key, but
              // TypeScript doesn't know that.
              removeApiCall('wishLists', 'delete')

              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE,
              })

              if (onError) onError()
            } else {
              const newWishLists = wishLists

              if (json.aggregate) newWishLists[0] = json.aggregate

              for (const deletedId of json.deleted) {
                const index = newWishLists.findIndex(
                  (list) => list.id === deletedId
                )
                newWishLists.splice(index, 1)
              }

              setWishLists(newWishLists)
              removeApiCall('wishLists', 'delete')

              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your wish list has been deleted.',
              })

              if (onSuccess) onSuccess()
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                destroyWishList(
                  listId,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            } else if (e.code === 404) {
              setFlashProps({
                hidden: false,
                type: 'error',
                message:
                  "The wish list you tried to delete doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e)
            }

            removeApiCall('wishLists', 'delete')
            if (onError) onError()
          })
      }
    },
    [token, wishLists]
  )

  /**
   *
   * Create a new wish list item
   *
   */

  const createWishListItem = useCallback(
    (
      listId: number,
      attributes: RequestWishListItem,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('wishListItems', 'post')
        postWishListItems(listId, attributes, idToken)
          .then(({ status, json }) => {
            if (status === 200 || status === 201) {
              const newWishLists = [...wishLists]

              for (const list of json) {
                const index = newWishLists.findIndex(
                  ({ id }) => id === list.id
                )
                newWishLists[index] = list
              }

              setWishLists(newWishLists)

              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your wish list item has been created.',
              })

              if (onSuccess) onSuccess()
            } else {
              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE,
              })

              if (onError) onError()
            }

            removeApiCall('wishListItems', 'post')
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                createWishListItem(
                  listId,
                  attributes,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            } else if (e.code === 404) {
              setFlashProps({
                hidden: false,
                type: 'error',
                message:
                  "The wish list you tried to add an item to doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e, 'list item')
            }

            removeApiCall('wishListItems', 'post')
            if (onError) onError()
          })
      }
    },
    [token, wishLists]
  )

  /**
   *
   * Update a wish list item
   *
   */

  const updateWishListItem = useCallback(
    (
      itemId: number,
      attributes: RequestWishListItem,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('wishListItems', 'patch')

        patchWishListItem(itemId, attributes, idToken)
          .then(({ status, json }) => {
            if (status === 200) {
              const newWishLists = [...wishLists]

              for (const item of json) {
                const list = newWishLists.find(
                  ({ id }) => id === item.list_id
                )
                const index = list?.list_items?.findIndex(
                  ({ id }) => id === item.id
                )

                if (list && typeof index === 'number')
                  list.list_items[index] = item
              }

              setWishLists(newWishLists)
              if (onSuccess) onSuccess()
            } else {
              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE,
              })

              if (onError) onError()
            }

            removeApiCall('wishListItems', 'patch')
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                updateWishListItem(
                  itemId,
                  attributes,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            } else if (e.code === 404) {
              setFlashProps({
                hidden: false,
                type: 'error',
                message:
                  "You have attempted to update a wish list item that doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e, 'list item')
            }

            removeApiCall('wishListItems', 'patch')
            if (onError) onError()
          })
      }
    },
    [token, wishLists]
  )

  /**
   *
   * Destroy a wish list item
   *
   */

  const destroyWishListItem = useCallback(
    (
      itemId: number,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('wishListItems', 'delete')

        deleteWishListItem(itemId, idToken)
          .then(({ status, json }) => {
            if (status === 200) {
              const newWishLists = [...wishLists]

              newWishLists[0] = json[0]

              const index = newWishLists.findIndex(
                ({ id }) => id === json[1].id
              )
              newWishLists[index] = json[1]

              setWishLists(newWishLists)
              removeApiCall('wishListItems', 'delete')

              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your wish list item has been deleted.',
              })

              if (onSuccess) onSuccess()
            } else {
              removeApiCall('wishListItems', 'delete')

              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE,
              })

              if (onError) onError()
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                destroyWishListItem(
                  itemId,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            } else if (e.code === 404) {
              setFlashProps({
                hidden: false,
                type: 'error',
                message:
                  "You have tried to delete a list item that doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e, 'list item')
            }

            removeApiCall('wishListItems', 'delete')
            if (onError) onError()
          })
      }
    },
    [token, wishLists]
  )

  /**
   *
   * Set the context provider value
   *
   */

  const value = {
    wishLists,
    wishListsLoadingState,
    createWishList,
    updateWishList,
    destroyWishList,
    createWishListItem,
    updateWishListItem,
    destroyWishListItem,
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

    // Only fetch wish lists if token is present and
    // (a) the token just changed from null to a string value or
    // (b) the token is already set and it is the initial render
    if (
      token &&
      (!previousTokenRef.current || previousTokenRef.current === token)
    )
      fetchWishLists()

    previousTokenRef.current = token
  }, [authLoading, activeGame, token])

  useEffect(() => {
    if (gamesLoadingState === DONE && !games.length)
      setWishListsLoadingState(DONE)
  }, [gamesLoadingState, games])

  useEffect(() => {
    requireLogin()
  }, [requireLogin])

  return (
    <WishListsContext.Provider value={value}>
      {children}
    </WishListsContext.Provider>
  )
}
