import { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { type User } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, signOutWithGoogle } from '../firebase'
import { ProviderProps } from '../types/contexts'
import paths from '../routing/paths'

type ApiCall = (idToken: string) => void

export interface LoginContextType {
  authLoading: boolean
  token: string | null
  requireLogin: () => void
  withTokenRefresh: (fn: ApiCall) => void
  user?: User | null
}

export const LoginContext = createContext<LoginContextType>({
  user: null,
  token: null,
  authLoading: true,
  requireLogin: () => {}, // noop
  withTokenRefresh: (_fn: ApiCall) => {}, // noop
})

export const LoginProvider = ({ children }: ProviderProps) => {
  const [user, authLoading, authError] = useAuthState(auth)
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()

  const requireLogin = useCallback(() => {
    if (!user && !authLoading) {
      navigate(paths.home)
    }
  }, [user, authLoading])

  const withTokenRefresh = (fn: ApiCall) => {
    if (!user || !token) return

    // Set currentToken inside the closure because when this
    // is called inside a callback, the token won't update while
    // the function runs.
    let currentToken = token
    let retryAttempt = 0

    while (retryAttempt < 2) {
      retryAttempt += 1

      try {
        fn(currentToken)
        break
      } catch (e: any) {
        if (retryAttempt < 2) {
          if (import.meta.env.DEV)
            console.log('Server returned status 401, retrying...')

          user?.getIdToken(true).then((idToken) => {
            setToken(idToken)
            currentToken = idToken
          })
        } else {
          signOutWithGoogle()
        }
      }
    }
  }

  const value = {
    user,
    token,
    authLoading,
    requireLogin,
    withTokenRefresh,
  }

  useEffect(() => {
    if (authError) signOutWithGoogle()

    if (user) {
      user.getIdToken(true).then((idToken) => setToken(idToken))
    }
  }, [user, authError])

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
}
