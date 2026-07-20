import { type ResponseWishListItem as ListItem } from '../../types/apiData'

/**
 *
 * Wish list items are related to individual wish lists. They are also
 * transitively related to playthroughs, belonging to the playthrough that owns
 * the wish list they are on. The `list_id` attribute found on wish list items
 * in this file corresponds to the `id` attributes of the wish lists under
 * /src/support/data/wishLists.ts.
 *
 */

export const emptyWishListItems: ListItem[] = []

export const allWishListItems: ListItem[] = [
  {
    id: 4,
    list_id: 1,
    description: 'Iron ingot',
    quantity: 1,
    unit_weight: 1.0,
    notes: null,
    created_at: new Date('2023-01-03T01:02:38'),
    updated_at: new Date('2023-01-03T01:02:38'),
  },
  {
    id: 2,
    list_id: 1,
    description: 'Necklace',
    quantity: 3,
    unit_weight: 0.3,
    notes: null,
    created_at: new Date('2023-01-02T11:13:04'),
    updated_at: new Date('2023-01-02T11:13:04'),
  },
  {
    id: 3,
    list_id: 2,
    description: 'Iron ingot',
    quantity: 1,
    unit_weight: 1.0,
    notes: 'To make 2 hinges',
    created_at: new Date('2023-01-03T01:02:37'),
    updated_at: new Date('2023-01-03T01:02:37'),
  },
  {
    id: 1,
    list_id: 2,
    description: 'Necklace',
    quantity: 3,
    unit_weight: 0.3,
    notes: 'To enchant with fire, frost, and lightning resistance',
    created_at: new Date('2023-01-02T11:13:03'),
    updated_at: new Date('2023-01-02T11:13:03'),
  },
  {
    id: 6,
    list_id: 3,
    description: 'Dwarven Cog',
    quantity: 11,
    unit_weight: 10.0,
    notes: null,
    created_at: new Date('2023-02-12T15:20:04'),
    updated_at: new Date('2023-02-12T15:30:16'),
  },
  {
    id: 9,
    list_id: 3,
    description:
      'This item has a really really really really really long description for testing purposes',
    quantity: 200000000000,
    unit_weight: 400000000000.0,
    notes: null,
    created_at: new Date('2023-02-12T15:18:12'),
    updated_at: new Date('2023-02-12T15:18:12'),
  },
  {
    id: 7,
    list_id: 5,
    description: 'Dwarven Cog',
    quantity: 10,
    unit_weight: 10.0,
    notes: 'For Arniel Gane',
    created_at: new Date('2023-02-12T15:30:15'),
    updated_at: new Date('2023-02-12T15:30:15'),
  },
  {
    id: 8,
    list_id: 4,
    description:
      'This item has a really really really really really long description for testing purposes',
    quantity: 200000000000,
    unit_weight: 400000000000.0,
    notes: null,
    created_at: new Date('2023-02-12T15:18:11'),
    updated_at: new Date('2023-02-12T15:18:11'),
  },
  {
    id: 5,
    list_id: 4,
    description: 'Dwarven Cog',
    quantity: 1,
    unit_weight: 10.0,
    notes: 'For trophy room',
    created_at: new Date('2023-02-12T15:20:03'),
    updated_at: new Date('2023-02-12T15:20:03'),
  },
]

export const wishListItemsOnList = (listId: number) =>
  allWishListItems.filter(({ list_id }) => list_id === listId)
