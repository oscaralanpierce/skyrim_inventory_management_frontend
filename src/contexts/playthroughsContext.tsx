import { createContext, useCallback, useEffect, useState, useRef } from 'react'
import { type RequestPlaythrough, type ResponsePlaythrough as Playthrough } from '../types/apiData'
import { type ProviderProps } from '../types/contexts'
import { type CallbackFunction } from '../types/functions'
import { useGoogleLogin, usePageContext } from '../hooks/contexts'
import { ApiError } from '../types/errors'
import { LOADING, DONE, ERROR, type LoadingState } from '../utils/loadingStates'
import { postPlaythroughs, getPlaythroughs, deletePlaythrough, patchPlaythrough } from '../utils/api/simApi'

const NOT_FOUND_MESSAGE =
  "Oops! We couldn't find the playthrough you're looking for. Please refresh and try again."
const UNEXPECTED_ERROR_MESSAGE =
  "Oops! Something unexpected went wrong. We're sorry! Please try again later."

export interface PlaythroughsContextType {
  playthroughs: Playthrough[]
  playthroughsLoadingState: LoadingState
  createPlaythrough: (
    playthrough: RequestPlaythrough,
    onSuccess?: (playthrough: Playthrough) => void,
    onError?: CallbackFunction,
    idToken?: string | null,
    retries?: number
  ) => void
  updatePlaythrough: (
    playthroughId: number,
    attributes: RequestPlaythrough,
    onSuccess?: CallbackFunction,
    onError?: CallbackFunction,
    idToken?: string | null,
    retries?: number
  ) => void
  destroyPlaythrough: (
    playthroughId: number,
    onSuccess?: CallbackFunction,
    onError?: CallbackFunction,
    idToken?: string | null,
    retries?: number
  ) => void
}

export const PlaythroughsContext = createContext<PlaythroughsContextType>({
  playthroughs: [],
  playthroughsLoadingState: LOADING,
  createPlaythrough: () => {},
  updatePlaythrough: () => {},
  destroyPlaythrough: () => {},
})

export const PlaythroughsProvider = ({ children }: ProviderProps) => {
  const { token, authLoading, requireLogin, withTokenRefresh, signOut } =
    useGoogleLogin()
  const [playthroughsLoadingState, setPlaythroughsLoadingState] = useState(LOADING)
  const [playthroughs, setPlaythroughs] = useState<Playthrough[]>([])
  const { setFlashProps, setModalProps, addApiCall, removeApiCall } =
    usePageContext()
  const previousTokenRef = useRef(token)

  /**
   *
   * General handler for any ApiError
   *
   */

  const handleApiError = (e: ApiError) => {
    if (import.meta.env.DEV) console.error(e.message)

    if (e.code === 401) signOut()

    if (Array.isArray(e.errors)) {
      setFlashProps({
        hidden: false,
        type: 'error',
        header: `${e.errors.length} error(s) prevented your playthrough from being saved:`,
        message: e.errors,
      })
    } else {
      const message =
        e.code === 404 ? NOT_FOUND_MESSAGE : UNEXPECTED_ERROR_MESSAGE
      setFlashProps({
        hidden: false,
        type: 'error',
        message,
      })
    }
  }

  /**
   *
   * Create a new playthrough at the API and update the `playthroughs` array
   *
   */

  const createPlaythrough = useCallback(
    (
      body: RequestPlaythrough,
      onSuccess?: (playthrough: Playthrough) => void,
      onError?: CallbackFunction,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('playthroughs', 'post')
        postPlaythroughs(body, idToken)
          .then(({ json }) => {
            if ('name' in json) {
              setPlaythroughs([json, ...playthroughs])
              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your playthrough has been created.',
              })
              removeApiCall('playthroughs', 'post')
              if (onSuccess) onSuccess(json)
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                createPlaythrough(
                  body,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            }

            removeApiCall('playthroughs', 'post')
            handleApiError(e)
            if (onError) onError()
          })
      }
    },
    [token, playthroughs]
  )

  /**
   *
   * Retrieve all the current user's playthroughs from the API
   * and set them as the playthroughs array
   *
   */

  const setPlaythroughsFromApi = (idToken: string, retries: number = 1) => {
    addApiCall('playthroughs', 'get')
    return getPlaythroughs(idToken)
      .then(({ json }) => {
        if (Array.isArray(json)) {
          setPlaythroughs(json)
          setPlaythroughsLoadingState(DONE)
          removeApiCall('playthroughs', 'get')
        }
      })
      .catch((e: ApiError) => {
        if (e.code === 401 && retries > 0) {
          return withTokenRefresh((newToken) => {
            void setPlaythroughsFromApi(newToken, retries - 1)
          })
        } else {
          removeApiCall('playthroughs', 'get')
          throw e
        }
      })
  }

  const fetchPlaythroughs = useCallback(() => {
    if (token) {
      setPlaythroughsLoadingState(LOADING)

      setPlaythroughsFromApi(token).catch((e: ApiError) => {
        handleApiError(e)
        setPlaythroughs([])
        setPlaythroughsLoadingState(ERROR)
      })
    }
  }, [token])

  /**
   *
   * Update the requested playthrough at the API and in the `playthroughs` array
   *
   */

  const updatePlaythrough = useCallback(
    (
      playthroughId: number,
      attributes: RequestPlaythrough,
      onSuccess?: CallbackFunction,
      onError?: CallbackFunction,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('playthroughs', 'patch')
        patchPlaythrough(playthroughId, attributes, idToken)
          .then(({ status, json }) => {
            if (status === 200) {
              const newPlaythroughs = playthroughs
              const index = newPlaythroughs.findIndex((el) => el.id === playthroughId)
              newPlaythroughs[index] = json
              setPlaythroughs(newPlaythroughs)
              removeApiCall('playthroughs', 'patch')
              setModalProps({
                hidden: true,
                children: <></>,
              })
              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your playthrough has been updated.',
              })
              if (onSuccess) onSuccess()
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                updatePlaythrough(
                  playthroughId,
                  attributes,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            }

            removeApiCall('playthroughs', 'patch')
            handleApiError(e)

            if (onError) onError()
          })
      }
    },
    [token, playthroughs]
  )

  /**
   *
   * Destroy the requested playthrough and update the `playthroughs` array
   *
   */

  const destroyPlaythrough = useCallback(
    (
      playthroughId: number,
      onSuccess?: CallbackFunction,
      onError?: CallbackFunction,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('playthroughs', 'delete')
        deletePlaythrough(playthroughId, idToken)
          .then(({ status }) => {
            if (status === 204) {
              const newPlaythroughs = playthroughs.filter(({ id }) => id !== playthroughId)
              setPlaythroughs(newPlaythroughs)
              removeApiCall('playthroughs', 'delete')
              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your playthrough has been deleted.',
              })

              if (onSuccess) onSuccess()
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                destroyPlaythrough(
                  playthroughId,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            }

            removeApiCall('playthroughs', 'delete')
            handleApiError(e)

            if (onError) onError()
          })
      }
    },
    [token, playthroughs]
  )

  const value = {
    playthroughs,
    playthroughsLoadingState,
    createPlaythrough,
    updatePlaythrough,
    destroyPlaythrough,
  }

  useEffect(() => {
    requireLogin()
  }, [requireLogin])

  useEffect(() => {
    if (authLoading) return

    // Only fetch playthroughs if token is present and
    // (a) the token just changed from null to a string value or
    // (b) the token is already set and it is the initial render
    if (
      token &&
      (!previousTokenRef.current || previousTokenRef.current === token)
    )
      fetchPlaythroughs()

    previousTokenRef.current = token
  }, [authLoading, token])

  return <PlaythroughsContext value={value}>{children}</PlaythroughsContext>
}
