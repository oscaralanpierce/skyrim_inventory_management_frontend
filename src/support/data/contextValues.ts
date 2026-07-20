import { type PlaythroughsContextType } from '../../contexts/playthroughsContext'
import { type LoginContextType } from '../../contexts/loginContext'
import { type WishListsContextType } from '../../contexts/wishListsContext'
import { DONE, ERROR, LOADING } from '../../utils/loadingStates'
import { testUser } from './users'
import { allPlaythroughs, emptyPlaythroughs } from './playthroughs'
import { emptyWishLists, wishListsForPlaythrough } from './wishLists'

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
  signOut: noop,
  withTokenRefresh: (fn) => fn('xxxxxxx'),
  authLoading: false,
}

export const loadingLoginContextValue: LoginContextType = {
  user: null,
  token: null,
  requireLogin: noop,
  signOut: noop,
  withTokenRefresh: noop,
  authLoading: true,
}

export const unauthenticatedLoginContextValue: LoginContextType = {
  user: null,
  token: null,
  requireLogin: noop,
  signOut: noop,
  withTokenRefresh: noop,
  authLoading: false,
}

/**
 *
 * Default value for Playthroughs context
 *
 */

export const playthroughsContextValueEmpty: PlaythroughsContextType = {
  playthroughs: emptyPlaythroughs,
  playthroughsLoadingState: DONE,
  createPlaythrough: noop,
  updatePlaythrough: noop,
  destroyPlaythrough: noop,
}

export const playthroughsContextValue: PlaythroughsContextType = {
  playthroughs: allPlaythroughs,
  playthroughsLoadingState: DONE,
  createPlaythrough: noop,
  updatePlaythrough: noop,
  destroyPlaythrough: noop,
}

export const playthroughsContextValueLoading: PlaythroughsContextType = {
  playthroughs: [],
  playthroughsLoadingState: LOADING,
  createPlaythrough: noop,
  updatePlaythrough: noop,
  destroyPlaythrough: noop,
}

export const playthroughsContextValueError: PlaythroughsContextType = {
  playthroughs: [],
  playthroughsLoadingState: ERROR,
  createPlaythrough: noop,
  updatePlaythrough: noop,
  destroyPlaythrough: noop,
}

/**
 *
 * Default values for Wish Lists context
 *
 */

export const wishListsContextValueEmpty: WishListsContextType = {
  wishLists: emptyWishLists,
  wishListsLoadingState: DONE,
  createWishList: noop,
  updateWishList: noop,
  destroyWishList: noop,
  createWishListItem: noop,
  updateWishListItem: noop,
  destroyWishListItem: noop,
}

export const wishListsContextValue: WishListsContextType = {
  wishLists: wishListsForPlaythrough(77),
  wishListsLoadingState: DONE,
  createWishList: noop,
  updateWishList: noop,
  destroyWishList: noop,
  createWishListItem: noop,
  updateWishListItem: noop,
  destroyWishListItem: noop,
}

export const wishListsContextValueLoading: WishListsContextType = {
  wishLists: emptyWishLists,
  wishListsLoadingState: LOADING,
  createWishList: noop,
  updateWishList: noop,
  destroyWishList: noop,
  createWishListItem: noop,
  updateWishListItem: noop,
  destroyWishListItem: noop,
}

export const wishListsContextValueError: WishListsContextType = {
  wishLists: emptyWishLists,
  wishListsLoadingState: ERROR,
  createWishList: noop,
  updateWishList: noop,
  destroyWishList: noop,
  createWishListItem: noop,
  updateWishListItem: noop,
  destroyWishListItem: noop,
}
