import { createContext, useEffect, useState, useRef, useCallback } from 'react'
import { type CallbackFunction } from '../types/functions'
import {
  type RequestInventoryItem,
  type RequestInventoryList,
  type ResponseInventoryList,
} from '../types/apiData'
import { type ProviderProps } from '../types/contexts'
import { type ApiError } from '../types/errors'
import { LOADING, DONE, ERROR, type LoadingState } from '../utils/loadingStates'
import {
  postInventoryLists,
  getInventoryLists,
  patchInventoryList,
  deleteInventoryList,
  postInventoryItems,
  patchInventoryItem,
  deleteInventoryItem,
} from '../utils/api/simApi'
import { useQueryString} from '../hooks/useQueryString'
import {
  useGoogleLogin,
  usePageContext,
  usePlaythroughsContext
} from '../hooks/contexts'

const UNEXPECTED_ERROR_MESSAGE =
  "Oops! Something unexpected went wrong. We're sorry! Please try again later."

export interface InventoryListsContextType {
  inventoryLists: ResponseInventoryList[]
  inventoryListsLoadingState: LoadingState
  createInventoryList: (
    attributes: RequestInventoryList,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
  updateInventoryList: (
    listId: number,
    attributes: RequestInventoryList,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
  destroyInventoryList: (
    listId: number,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
  createInventoryItem: (
    listId: number,
    attributes: RequestInventoryItem,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
  updateInventoryItem: (
    itemId: number,
    attributes: RequestInventoryItem,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
  destroyInventoryItem: (
    itemId: number,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
    idToken?: string | null,
    retries?: number
  ) => void
}

export const InventoryListsContext = createContext<InventoryListsContextType>({
  inventoryLists: [] as ResponseInventoryList[],
  inventoryListsLoadingState: LOADING,
  createInventoryList: () => {},
  updateInventoryList: () => {},
  destroyInventoryList: () => {},
  createInventoryItem: () => {},
  updateInventoryItem: () => {},
  destroyInventoryItem: () => {},
})

export const InventoryListsProvider = ({ children }: ProviderProps) => {
  const { token, authLoading, requireLogin, withTokenRefresh, signOut } =
    useGoogleLogin()
  const { setFlashProps, addApiCall, removeApiCall } = usePageContext()
  const { playthroughsLoadingState, playthroughs } = usePlaythroughsContext()
  const queryString = useQueryString()
  const [activePlaythrough, setActivePlaythrough] = useState<number | null>(null)
  const [inventoryListsLoadingState, setInventoryListsLoadingState] = useState(LOADING)
  const [inventoryLists, setInventoryLists] = useState<ResponseInventoryList[]>([])
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
          header: `${e.errors.length} error(s) prevented your inventory ${
            resource || 'list'
          } from being saved:`,
          message: e.errors,
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
   * Create inventory list for the active playthrough
   * 
   */

  const createInventoryList = useCallback(
    (
      attributes: RequestInventoryList,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      if (!activePlaythrough) {
        setFlashProps({
          hidden: false,
          type: 'warning',
          message:
            'You must select a playthrough from the dropdown before creating an inventory list.',
        })

        return
      }

      idToken ??= token

      if (idToken) {
        addApiCall('inventoryLists', 'post')
        postInventoryLists(activePlaythrough, attributes, idToken)
          .then(({ json }) => {
            if (Array.isArray(json)) {
              if (json.length == 2) {
                setInventoryLists(json)
              } else {
                const newInventoryLists = [...inventoryLists]
                newInventoryLists.splice(1, 0, json[0])
                setInventoryLists(newInventoryLists)
              }
            }

            removeApiCall('inventoryLists', 'post')

            setFlashProps({
              hidden: false,
              type: 'success',
              message: 'Success! Your inventory list has been created.'
            })

            if (onSuccess) onSuccess()
          })
        .catch((e: ApiError) => {
          retries ??= 1

          if (e.code === 401 && retries > 0) {
            return withTokenRefresh((newToken) => {
              createInventoryList(
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
                "The playthrough you've selected doesn't exist, or doesn't belong to you. Please select another playthrough and try again.",
            })
          } else {
            handleApiError(e)
          }

          removeApiCall('inventoryLists', 'post')
          if (onError) onError()
        })
      }
    },
    [token, activePlaythrough, inventoryLists]
  )

  /**
   * 
   * Fetch inventory lists for the active playthrough and set them as the
   * inventoryLists array
   * 
   */

  const setInventoryListsFromApi = (
    idToken: string | null = token,
    retries: number = 1
  ) => {
    if (!activePlaythrough || !idToken) return

    addApiCall('inventoryLists', 'get')
    getInventoryLists(activePlaythrough, idToken)
      .then(({ json }) => {
        if (Array.isArray(json)) {
          setInventoryLists(json)
          setInventoryListsLoadingState(DONE)
          removeApiCall('inventoryLists', 'get')
        }
      })
      .catch((e: ApiError) => {
        if (e.code === 401 && retries > 0) {
          return withTokenRefresh((newToken) => {
            setInventoryListsFromApi(newToken, retries - 1)
          })
        } else if (e.code === 404) {
          setFlashProps({
            hidden: false,
            type: 'error',
            message:
              "The playthrough you've selected doesn't exist, or doesn't belong to you. Please select another playthrough and try again.",
          })
        } else {
          handleApiError(e)
        }

        removeApiCall('inventoryLists', 'get')
        setInventoryLists([])
        setInventoryListsLoadingState(ERROR)
      })
  }

  const fetchInventoryLists = useCallback(() => {
    if (token && activePlaythrough) {
      setInventoryListsLoadingState(LOADING)
      setInventoryListsFromApi()
    }
  }, [token, activePlaythrough])

  /**
   * 
   * Update specified inventory list
   * 
   */

  const updateInventoryList = useCallback(
    (
      listId: number,
      attributes: RequestInventoryList,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('inventoryLists', 'patch')
        patchInventoryList(listId, attributes, idToken)
          .then(({ status, json}) => {
            if (status === 200) {
              const newInventoryLists = [...inventoryLists]
              const index = newInventoryLists.findIndex(
                ({ id }) => id === listId
              )
              newInventoryLists[index] = json

              setInventoryLists(newInventoryLists)
              removeApiCall('inventoryLists', 'patch')
              if (onSuccess) onSuccess()
            } else {
              // This won't happen but TypeScript doesn't know that
              removeApiCall('inventoryLists', 'patch')

              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE
              })

              if (onError) onError()
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                updateInventoryList(
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
                  "The inventory list you tried to update doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e)
            }

            removeApiCall('inventoryLists', 'patch')
            if (onError) onError()
          })
      }
    },
    [token, inventoryLists]
  )

  /**
   * 
   * Destroy specified inventory list
   *
   */

  const destroyInventoryList = useCallback(
    (
      listId: number,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('inventoryLists', 'delete')
        deleteInventoryList(listId, idToken)
          .then(({ json }) => {
            if ('errors' in json) {
              // This case should never happen because normally an ApiError
              // will be thrown for any response that includes this key, but
              // TypeScript doesn't know that.
              removeApiCall('inventoryLists', 'delete')

              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE,
              })

              if (onError) onError()
            } else {
              const newInventoryLists = inventoryLists

              if (json.aggregate) newInventoryLists[0] = json.aggregate

              for (const deletedId of json.deleted) {
                const index = newInventoryLists.findIndex(
                  (list) => list.id === deletedId
                )
                newInventoryLists.splice(index, 1)
              }

              setInventoryLists(newInventoryLists)
              removeApiCall('inventoryLists', 'delete')

              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your inventory list has been deleted.'
              })

              if (onSuccess) onSuccess()
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                destroyInventoryList(
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
                  "The inventory list you tried to delete doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e)
            }

            removeApiCall('inventoryLists', 'delete')
            if (onError) onError()
          })
      }
    },
    [token, inventoryLists]
  )

  /**
   * 
   * Create a new inventory list item
   * 
   */

  const createInventoryItem = useCallback(
    (
      listId: number,
      attributes: RequestInventoryItem,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('inventoryItems', 'post')
        postInventoryItems(listId, attributes, idToken)
          .then(({ status, json }) => {
            if (status === 200 || status === 201) {
              const newInventoryLists = [...inventoryLists]

              for (const list of json) {
                const index = newInventoryLists.findIndex(
                  ({ id }) => id === list.id
                )
                newInventoryLists[index] = list
              }

              setInventoryLists(newInventoryLists)

              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your inventory item has been created.',
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

            removeApiCall('inventoryItems', 'post')
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                createInventoryItem(
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
                  "The inventory list you tried to add an item to doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e, 'list item')
            }

            removeApiCall('inventoryItems', 'post')
            if (onError) onError()
          })
      }
    },
    [token, inventoryLists]
  )

  /**
   * 
   * Update an inventory item
   * 
   */

  const updateInventoryItem = useCallback(
    (
      itemId: number,
      attributes: RequestInventoryItem,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('inventoryItems', 'patch')

        patchInventoryItem(itemId, attributes, idToken)
          .then(({ status, json }) => {
            if (status === 200) {
              const newInventoryLists = [...inventoryLists]

              for (const item of json) {
                const list = newInventoryLists.find(
                  ({ id }) => id === item.list_id
                )
                const index = list?.list_items?.findIndex(
                  ({ id }) => id === item.id
                )

                if (list && typeof index === 'number')
                  list.list_items[index] = item
              }

              setInventoryLists(newInventoryLists)
              if (onSuccess) onSuccess()
            } else {
              setFlashProps({
                hidden: false,
                type: 'error',
                message: UNEXPECTED_ERROR_MESSAGE,
              })

              if (onError) onError()
            }

            removeApiCall('inventoryItems', 'patch')
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                updateInventoryItem(
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
                  "You have attempted to update an inventory item that doesn't exist, or doesn't belong to you. Please refresh and try again.",
              })
            } else {
              handleApiError(e, 'list item')
            }

            removeApiCall('inventoryItems', 'patch')
            if (onError) onError()
          })
      }
    },
    [token, inventoryLists]
  )

  /**
   * 
   * Destroy an inventory item
   * 
   */

  const destroyInventoryItem = useCallback(
    (
      itemId: number,
      onSuccess?: CallbackFunction | null,
      onError?: CallbackFunction | null,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('inventoryItems', 'delete')

        deleteInventoryItem(itemId, idToken)
        .then(({ status, json }) => {
          if (status === 200) {
            const newInventoryLists = [...inventoryLists]

            newInventoryLists[0] = json[0]

            const index = newInventoryLists.findIndex(
              ({ id }) => id === json[1].id
            )
            newInventoryLists[index] = json[1]

            setInventoryLists(newInventoryLists)
            removeApiCall('inventoryItems', 'delete')

            setFlashProps({
              hidden: false,
              type: 'success',
              message: 'Success! Your inventory item has been deleted.',
            })

            if (onSuccess) onSuccess()
          } else {
            removeApiCall('inventoryItems', 'delete')

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
              destroyInventoryItem(
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
                "You have tried to delete an inventory item that doesn't exist, or doesn't belong to you. Please refresh and try again.",
            })
          } else {
            handleApiError(e, 'list item')
          }

          removeApiCall('inventoryItems', 'delete')
          if (onError) onError()
        })
      }
    },
    [token, inventoryLists]
  )

  /**
   * 
   * Set the context provider value
   * 
   */

  const value = {
    inventoryLists,
    inventoryListsLoadingState,
    createInventoryList,
    updateInventoryList,
    destroyInventoryList,
    createInventoryItem,
    updateInventoryItem,
    destroyInventoryItem,
  }

  /**
   * 
   * Set the active playthrough automatically from the query string
   * or, failing that, from the playthroughs themselves when they load.
   * 
   */

  useEffect(() => {
    const playthroughId: number = Number(queryString.get('playthroughId'))

    if (playthroughId > 0) {
      setActivePlaythrough(playthroughId)
    } else if (playthroughsLoadingState === DONE && playthroughs.length) {
      setActivePlaythrough(playthroughs[0].id)
    }
  }, [queryString, playthroughsLoadingState, playthroughs])

  useEffect(() => {
    if (authLoading) return

    // Only fetch inventory lists if token is present and
    // (a) the token just changed from null to a string value or
    // (b) the token is already set and it is the initial render
    if (
      token &&
      (!previousTokenRef.current || previousTokenRef.current === token)
    )
      fetchInventoryLists()
    
    previousTokenRef.current = token
  }, [authLoading, activePlaythrough, token])

  useEffect(() => {
    if (playthroughsLoadingState === DONE && !playthroughs.length)
      setInventoryListsLoadingState(DONE)
  }, [playthroughsLoadingState, playthroughs])

  useEffect(() => {
    requireLogin()
  }, [requireLogin])

  return (
    <InventoryListsContext value={value}>
      {children}
    </InventoryListsContext>
  )
}