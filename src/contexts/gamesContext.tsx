import { createContext, useCallback, useEffect, useState, useRef } from 'react'
import { type RequestGame, type ResponseGame as Game } from '../types/apiData'
import { type ProviderProps } from '../types/contexts'
import { type CallbackFunction } from '../types/functions'
import { useGoogleLogin, usePageContext } from '../hooks/contexts'
import { ApiError } from '../types/errors'
import { LOADING, DONE, ERROR, type LoadingState } from '../utils/loadingStates'
import { postGames, getGames, deleteGame, patchGame } from '../utils/api/simApi'

const NOT_FOUND_MESSAGE =
  "Oops! We couldn't find the game you're looking for. Please refresh and try again."
const UNEXPECTED_ERROR_MESSAGE =
  "Oops! Something unexpected went wrong. We're sorry! Please try again later."

export interface GamesContextType {
  games: Game[]
  gamesLoadingState: LoadingState
  createGame: (
    game: RequestGame,
    onSuccess?: (game: Game) => void,
    onError?: CallbackFunction,
    idToken?: string | null,
    retries?: number
  ) => void
  updateGame: (
    gameId: number,
    attributes: RequestGame,
    onSuccess?: CallbackFunction,
    onError?: CallbackFunction,
    idToken?: string | null,
    retries?: number
  ) => void
  destroyGame: (
    gameId: number,
    onSuccess?: CallbackFunction,
    onError?: CallbackFunction,
    idToken?: string | null,
    retries?: number
  ) => void
}

export const GamesContext = createContext<GamesContextType>({
  games: [],
  gamesLoadingState: LOADING,
  createGame: () => {},
  updateGame: () => {},
  destroyGame: () => {},
})

export const GamesProvider = ({ children }: ProviderProps) => {
  const { token, authLoading, requireLogin, withTokenRefresh, signOut } =
    useGoogleLogin()
  const [gamesLoadingState, setGamesLoadingState] = useState(LOADING)
  const [games, setGames] = useState<Game[]>([])
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

    if (Array.isArray(e.message)) {
      setFlashProps({
        hidden: false,
        type: 'error',
        header: `${e.message.length} error(s) prevented your game from being saved:`,
        message: e.message,
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
   * Create a new game at the API and update the `games` array
   *
   */

  const createGame = useCallback(
    (
      body: RequestGame,
      onSuccess?: (game: Game) => void,
      onError?: CallbackFunction,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('games', 'post')
        postGames(body, idToken)
          .then(({ json }) => {
            if ('name' in json) {
              setGames([json, ...games])
              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your game has been created.',
              })
              removeApiCall('games', 'post')
              if (onSuccess) onSuccess(json)
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                createGame(
                  body,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            }

            removeApiCall('games', 'post')
            handleApiError(e)
            if (onError) onError()
          })
      }
    },
    [token, games]
  )

  /**
   *
   * Retrieve all the current user's games from the API
   * and set them as the games array
   *
   */

  const setGamesFromApi = (idToken: string, retries: number = 1) => {
    addApiCall('games', 'get')
    return getGames(idToken)
      .then(({ json }) => {
        if (Array.isArray(json)) {
          setGames(json)
          setGamesLoadingState(DONE)
          removeApiCall('games', 'get')
        }
      })
      .catch((e: ApiError) => {
        if (e.code === 401 && retries > 0) {
          return withTokenRefresh((newToken) => {
            void setGamesFromApi(newToken, retries - 1)
          })
        } else {
          removeApiCall('games', 'get')
          throw e
        }
      })
  }

  const fetchGames = useCallback(() => {
    if (token) {
      setGamesLoadingState(LOADING)

      setGamesFromApi(token).catch((e: ApiError) => {
        handleApiError(e)
        setGames([])
        setGamesLoadingState(ERROR)
      })
    }
  }, [token])

  /**
   *
   * Update the requested game at the API and in the `games` array
   *
   */

  const updateGame = useCallback(
    (
      gameId: number,
      attributes: RequestGame,
      onSuccess?: CallbackFunction,
      onError?: CallbackFunction,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('games', 'patch')
        patchGame(gameId, attributes, idToken)
          .then(({ status, json }) => {
            if (status === 200) {
              const newGames = games
              const index = newGames.findIndex((el) => el.id === gameId)
              newGames[index] = json
              setGames(newGames)
              removeApiCall('games', 'patch')
              setModalProps({
                hidden: true,
                children: <></>,
              })
              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your game has been updated.',
              })
              if (onSuccess) onSuccess()
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                updateGame(
                  gameId,
                  attributes,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            }

            removeApiCall('games', 'patch')
            handleApiError(e)

            if (onError) onError()
          })
      }
    },
    [token, games]
  )

  /**
   *
   * Destroy the requested game and update the `games` array
   *
   */

  const destroyGame = useCallback(
    (
      gameId: number,
      onSuccess?: CallbackFunction,
      onError?: CallbackFunction,
      idToken?: string | null,
      retries?: number
    ) => {
      idToken ??= token

      if (idToken) {
        addApiCall('games', 'delete')
        deleteGame(gameId, idToken)
          .then(({ status }) => {
            if (status === 204) {
              const newGames = games.filter(({ id }) => id !== gameId)
              setGames(newGames)
              removeApiCall('games', 'delete')
              setFlashProps({
                hidden: false,
                type: 'success',
                message: 'Success! Your game has been deleted.',
              })

              if (onSuccess) onSuccess()
            }
          })
          .catch((e: ApiError) => {
            retries ??= 1

            if (e.code === 401 && retries > 0) {
              return withTokenRefresh((newToken) => {
                destroyGame(
                  gameId,
                  onSuccess,
                  onError,
                  newToken,
                  (retries as number) - 1
                )
              })
            }

            removeApiCall('games', 'delete')
            handleApiError(e)

            if (onError) onError()
          })
      }
    },
    [token, games]
  )

  const value = {
    games,
    gamesLoadingState,
    createGame,
    updateGame,
    destroyGame,
  }

  useEffect(() => {
    requireLogin()
  }, [requireLogin])

  useEffect(() => {
    if (authLoading) return

    // Only fetch games if token is present and
    // (a) the token just changed from null to a string value or
    // (b) the token is already set and it is the initial render
    if (
      token &&
      (!previousTokenRef.current || previousTokenRef.current === token)
    )
      fetchGames()

    previousTokenRef.current = token
  }, [authLoading, token])

  return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
}
