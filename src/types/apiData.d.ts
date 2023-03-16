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
  aggregate: boolean
  aggregate_list_id: number
  title: string
  created_at: Date
  updated_at: Date
  list_items: ResponseShoppingListItem[]
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
  notes: string
  created_at: Date
  updated_at: Date
}
