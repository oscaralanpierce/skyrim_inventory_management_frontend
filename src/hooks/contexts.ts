import { useContext } from 'react'
import { ColorContext } from '../contexts/colorContext'
import { PlaythroughsContext } from '../contexts/playthroughsContext'
import { LoginContext } from '../contexts/loginContext'
import { PageContext } from '../contexts/pageContext'
import { WishListsContext } from '../contexts/wishListsContext'

const useCustomContext = <T>(cxt: React.Context<T>, msg: string) => {
  const context = useContext(cxt)

  if (!context) throw new Error(msg)

  return context
}

export const useColorScheme = () =>
  useCustomContext(
    ColorContext,
    'useColorScheme must be used within a ColorProvider'
  )

export const useGoogleLogin = () =>
  useCustomContext(
    LoginContext,
    'useGoogleLogin must be used within a LoginProvider'
  )

export const usePlaythroughsContext = () =>
  useCustomContext(
    PlaythroughsContext,
    'usePlaythroughsContext must be used within a PlaythroughsProvider'
  )

export const useWishListsContext = () =>
  useCustomContext(
    WishListsContext,
    'useWishListsContext must be used within a WishListsProvider'
  )

export const usePageContext = () =>
  useCustomContext(
    PageContext,
    'usePageContext must be used within a PageProvider'
  )
