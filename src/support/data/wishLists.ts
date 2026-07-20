import {
  type ResponseWishList as WishList,
  type ResponseWishListItem as ListItem,
} from '../../types/apiData'
import { wishListItemsOnList } from './wishListItems'

/**
 *
 * Wish lists are related to playthroughs in that each wish list belongs to a
 * particular playthrough. Wish lists in this file have a `playthrough_id`
 * corresponding to one of the playthroughs in the `allPlaythroughs` array exported
 * from /src/support/data/playthroughs.ts. The empty wish lists array could
 * hypothetically belong to any of the playthroughs.
 *
 */

const emptyListItems: ListItem[] = []

export const emptyWishLists: WishList[] = []

export const allWishLists: WishList[] = [
  {
    id: 1,
    playthrough_id: 32,
    aggregate_list_id: null,
    aggregate: true,
    title: 'All Items',
    list_items: wishListItemsOnList(1),
    created_at: new Date('2023-01-02T03:54:02'),
    updated_at: new Date('2023-01-02T03:54:02'),
  },
  {
    id: 2,
    playthrough_id: 32,
    aggregate_list_id: 1,
    aggregate: false,
    title: 'My Wish List 1',
    list_items: wishListItemsOnList(2),
    created_at: new Date('2023-01-02T03:54:02'),
    updated_at: new Date('2023-01-02T03:54:02'),
  },
  {
    id: 3,
    playthrough_id: 77,
    aggregate_list_id: null,
    aggregate: true,
    title: 'All Items',
    list_items: wishListItemsOnList(3),
    created_at: new Date('2023-02-12T15:17:33'),
    updated_at: new Date('2023-02-12T15:17:33'),
  },
  {
    id: 4,
    playthrough_id: 77,
    aggregate_list_id: 3,
    aggregate: false,
    title: 'Honeyside',
    list_items: wishListItemsOnList(4),
    created_at: new Date('2023-02-21T11:13:27'),
    updated_at: new Date('2023-02-21T11:13:27'),
  },
  {
    id: 5,
    playthrough_id: 77,
    aggregate_list_id: 3,
    aggregate: false,
    title: 'Breezehome',
    list_items: wishListItemsOnList(5),
    created_at: new Date('2023-02-12T15:17:33'),
    updated_at: new Date('2023-02-12T15:17:33'),
  },
  {
    id: 6,
    playthrough_id: 77,
    aggregate_list_id: 3,
    aggregate: false,
    title: 'Hjerim',
    list_items: emptyListItems,
    created_at: new Date('2023-01-03T12:47:55'),
    updated_at: new Date('2023-01-03T12:47:55'),
  },
]

export const wishListsForPlaythrough = (playthroughId: number) =>
  allWishLists.filter(({ playthrough_id }) => playthrough_id === playthroughId)
