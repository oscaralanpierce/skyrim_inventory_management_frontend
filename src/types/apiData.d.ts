/**
 *
 * Generic type for the JSON body of any error response
 * that has a JSON body
 *
 */

export interface ErrorObject {
  errors: string[]
}

/**
 *
 * Games
 *
 */

export interface RequestGame {
  name?: string | null
  description?: string | null
}

export interface ResponseGame {
  id: number
  user_id: number
  name: string
  description: string | null
  created_at: Date
  updated_at: Date
}

/**
 *
 * Shopping Lists
 *
 */

export interface ResponseShoppingList {
  id: number
  game_id: number
  aggregate_list_id: number | null
  aggregate: boolean
  title: string
  list_items: ResponseShoppingListItem[]
  created_at: Date
  updated_at: Date
}

/**
 *
 * Shopping List Items
 *
 */

export interface ResponseShoppingListItem {
  id: number
  list_id: number
  description: string
  quantity: number
  unit_weight: number
  notes: string | null
  created_at: Date
  updated_at: Date
}
