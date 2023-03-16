import { describe, test, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { renderAuthenticated, renderAuthLoading } from '../../support/testUtils'
import { shoppingListsForGame } from '../../support/data/shoppingLists'
import {
  getGamesAllSuccess,
  getShoppingListsSuccess,
} from '../../support/msw/handlers'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext, GamesProvider } from '../../contexts/gamesContext'
import {
  ShoppingListsContext,
  ShoppingListsProvider,
} from '../../contexts/shoppingListsContext'
import ShoppingListsPage from './shoppingListsPage'

describe('<ShoppingListsPage />', () => {
  describe('viewing shopping lists for a single game', () => {
    describe('when loading', () => {
      test('displays the loading component', () => {
        const wrapper = renderAuthLoading(
          <PageProvider>
            <GamesProvider>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesProvider>
          </PageProvider>
        )

        expect(wrapper).toBeTruthy()

        expect(wrapper.getByTestId('pulseLoader')).toBeTruthy()
      })

      test('matches snapshot', () => {
        const wrapper = renderAuthLoading(
          <PageProvider>
            <GamesProvider>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesProvider>
          </PageProvider>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when the game is set in the query string')
  })
})
