import { ResponsePlaythrough as Playthrough } from '../../types/apiData'

/**
 *
 * Playthroughs, in Skyrim Inventory Management's data schema, are the objects
 * under which all other objects are organised. Every resource in the app
 * corresponds to a specific playthrough, which belongs to a particular user.
 *
 * The IDs seen in this file are used in other test data to simulate
 * relationships between models in the back-end database.
 *
 */

export const emptyPlaythroughs: Playthrough[] = []

export const allPlaythroughs: Playthrough[] = [
  {
    id: 32,
    user_id: 412,
    name: 'My Playthrough 1',
    description: 'This is a playthrough with a description',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 51,
    user_id: 412,
    name: 'My Playthrough 2',
    description: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 77,
    user_id: 412,
    name: 'Playthrough with a really really really really really long name',
    description:
      'Cum audissem Antiochum, Brute, ut solebam, cum M. Pisone in eo gymnasio, quod Ptolomaeum vocatur, unaque nobiscum Q. frater et T. Pomponius postmeridianam conficeremus in Academia',
    created_at: new Date(),
    updated_at: new Date(),
  },
]
