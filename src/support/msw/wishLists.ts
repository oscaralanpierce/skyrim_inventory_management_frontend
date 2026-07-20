import { http } from 'msw'
import { allPlaythroughs } from '../data/playthroughs'
import { allWishLists } from '../data/wishLists'
import { wishListsForPlaythrough } from '../data/wishLists'
import { newWishList, newWishListWithAggregate } from './helpers/data'
import { type RequestWishList } from '../../types/apiData'

const BASE_URI = 'http://localhost:3000'
const playthroughIds = allPlaythroughs.map(({ id }) => id)
const listIds = allWishLists.map(({ id }) => id)

/**
 *
 * POST /playthroughs/:playthrough_id/wish_lists
 *
 */

// Handles both 201 and 404 responses
export const postWishListsSuccess = http.post(
  `${BASE_URI}/playthroughs/:playthroughId/wish_lists`,
  async ({ request, params }) => {
    const playthroughId = Number(params.playthroughId)

    if (playthroughIds.indexOf(playthroughId) < 0) return new Response(null, { status: 404 })

    const attributes = await request.json() as RequestWishList

    const responseBody = wishListsForPlaythrough(playthroughId).length
      ? newWishList(attributes, playthroughId)
      : newWishListWithAggregate(attributes, playthroughId)

    return new Response(JSON.stringify(responseBody), { status: 201 })
  }
)

// Returns the same validation errors regardless of request body
// submitted
export const postWishListsUnprocessable = http.post(
  `${BASE_URI}/playthroughs/:playthroughId/wish_lists`,
  (_) => {
    return new Response(
      JSON.stringify({
        errors: [
          'Title must be unique per playthrough',
          "Title can only contain alphanumeric characters, spaces, commas (,), hyphens (-), and apostrophes (')",
        ],
      }),
      { status: 422 }
    )
  }
)

export const postWishListsServerError = http.post(
  `${BASE_URI}/playthroughs/:playthroughId/wish_lists`,
  (_) => {
    return new Response(
      JSON.stringify({
        errors: ['Something went horribly wrong'],
      }),
      { status: 500 }
    )
  }
)

/**
 *
 * GET /wish_lists/:id
 *
 */

// Covers both success and 404 cases
export const getWishListsSuccess = http.get(
  `${BASE_URI}/playthroughs/:playthroughId/wish_lists`,
  ({ params }) => {
    const playthroughId = Number(params.playthroughId)

    if (playthroughIds.indexOf(playthroughId) < 0) return new Response(null, { status: 404 })

    return new Response(JSON.stringify(wishListsForPlaythrough(playthroughId)), { status: 200 })
  }
)

export const getWishListsEmptySuccess = http.get(
  `${BASE_URI}/playthroughs/:playthroughId/wish_lists`,
  (_) => {
    return new Response(JSON.stringify([]), { status: 200 })
  }
)

/**
 *
 * PATCH /wish_lists/:id
 *
 */

// Covers both success and 404 cases
export const patchWishListSuccess = http.patch(
  `${BASE_URI}/wish_lists/:id`,
  async ({ request, params }) => {
    const listId = Number(params.id)

    if (listIds.indexOf(listId) < 0) return new Response(null, { status: 404 })

    const list = allWishLists.find(({ id }) => id === listId)
    const { title } = await request.json() as RequestWishList

    return new Response(JSON.stringify({ ...list, title }), { status: 200 })
  }
)

// Returns the same validation errors regardless of request
// body submitted
export const patchWishListUnprocessable = http.patch(
  `${BASE_URI}/wish_lists/:id`,
  (_) => {
    return new Response(
      JSON.stringify({
        errors: [
          'Title must be unique per playthrough',
          "Title can only contain alphanumeric characters, spaces, commas (,), hyphens (-), and apostrophes (')",
        ],
      }),
      { status: 422 }
    )
  }
)

export const patchWishListServerError = http.patch(
  `${BASE_URI}/wish_lists/:id`,
  (_) => {
    return new Response(
      JSON.stringify({
        errors: ['Something went horribly wrong'],
      }),
      { status: 500 }
    )
  }
)

/**
 *
 * DELETE /wish_lists/:id
 *
 */

// Covers both success and 404 cases
export const deleteWishListSuccess = http.delete(
  `${BASE_URI}/wish_lists/:listId`,
  ({ params }) => {
    const listId = Number(params.listId)
    const list = allWishLists.find(({ id }) => id === listId)

    if (!list) return new Response(null, { status: 404 })

    const lists = wishListsForPlaythrough(list.playthrough_id)

    let json
    if (lists.length === 2) {
      json = {
        deleted: lists.map(({ id }) => id),
      }
    } else {
      json = {
        deleted: [list.id],
        aggregate: lists[0],
      }
    }

    return new Response(JSON.stringify(json), { status: 200 })
  }
)

export const deleteWishListServerError = http.delete(
  `${BASE_URI}/wish_lists/:listId`,
  (_) => {
    return new Response(
      JSON.stringify({
        errors: ['Something went horribly wrong'],
      }),
      { status: 500 }
    )
  }
)
