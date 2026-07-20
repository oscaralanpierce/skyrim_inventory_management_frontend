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
 * Playthrough
 *
 */

export interface RequestPlaythrough {
  name?: string | null
  description?: string | null
}

export interface ResponsePlaythrough {
  id: number
  user_id: number
  name: string
  description: string | null
  created_at: Date
  updated_at: Date
}

/**
 *
 * Wish Lists
 *
 */

export interface RequestWishList {
  title?: string
}

export interface ResponseWishList {
  id: number
  playthrough_id: number
  aggregate_list_id: number | null
  aggregate: boolean
  title: string
  list_items: ResponseWishListItem[]
  created_at: Date
  updated_at: Date
}

/**
 *
 * Wish List Items
 *
 */

export interface RequestWishListItem {
  quantity?: number
  description?: string
  unit_weight?: number | null
  notes?: string | null
}

export interface ResponseWishListItem {
  id: number
  list_id: number
  description: string
  quantity: number
  unit_weight: number | null
  notes: string | null
  created_at: Date
  updated_at: Date
}
