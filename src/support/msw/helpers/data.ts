import {
  type RequestWishListItem,
  type RequestWishList,
  type ResponseWishListItem,
  type ResponseWishList,
} from '../../../types/apiData'
import { allPlaythroughs } from '../../data/playthroughs'
import {
  allWishLists,
  wishListsForPlaythrough,
} from '../../data/wishLists'

const playthroughIds = allPlaythroughs.map(({ id }) => id)

/**
 *
 * Wish List Creation
 *
 */

export const newWishList = (
  attributes: RequestWishList,
  playthroughId: number
): ResponseWishList[] => {
  if (playthroughIds.indexOf(playthroughId) < 0)
    throw new Error(
      'Cannot generate wish list for playthrough that does not exist in test data'
    )

  const existingLists = wishListsForPlaythrough(playthroughId)

  if (!existingLists.length)
    throw new Error(
      'Cannot generate single list for playthrough without existing aggregate'
    )

  return [
    {
      id: 93,
      playthrough_id: playthroughId,
      aggregate: false,
      aggregate_list_id: existingLists[0].id,
      title: attributes.title || 'New Wish List',
      list_items: [],
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]
}

export const newWishListWithAggregate = (
  attributes: RequestWishList,
  playthroughId: number
): ResponseWishList[] => {
  if (playthroughIds.indexOf(playthroughId) < 0)
    throw new Error(
      'Cannot generate wish list for playthrough that does not exist in test data'
    )

  const existingLists = wishListsForPlaythrough(playthroughId)

  if (existingLists.length)
    throw new Error(
      'Cannot generate new aggregate list for playthrough that already has one'
    )

  return [
    {
      id: 93,
      playthrough_id: playthroughId,
      aggregate: true,
      aggregate_list_id: null,
      title: 'All Items',
      list_items: [],
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 94,
      playthrough_id: playthroughId,
      aggregate: false,
      aggregate_list_id: 93,
      title: attributes.title || 'My Wish List 1',
      list_items: [],
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]
}

/**
 *
 * Wish list item creation
 *
 */

export const newWishListItem = (
  attributes: RequestWishListItem,
  listId: number
) => {
  const list = allWishLists.find(({ id }) => id === listId)

  if (!list)
    throw new Error(`No wish list with ID ${listId} in the test data`)

  const wishList = { ...list }
  const allLists = wishListsForPlaythrough(wishList.playthrough_id)
  const aggregateList = { ...allLists[0] }

  const newItem: ResponseWishListItem = {
    id: 42,
    list_id: listId,
    description: 'Dummy description for TypeScript',
    quantity: 1,
    unit_weight: null,
    notes: null,
    created_at: new Date(),
    updated_at: new Date(),
    ...attributes,
  }

  const newAggregateListItem: ResponseWishListItem = {
    ...newItem,
    id: 43,
    list_id: aggregateList.id,
  }

  aggregateList.list_items = [newAggregateListItem, ...aggregateList.list_items]
  wishList.list_items = [newItem, ...wishList.list_items]

  return [aggregateList, wishList]
}
