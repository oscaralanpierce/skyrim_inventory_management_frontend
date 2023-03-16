import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { renderAuthenticated, renderAuthLoading } from '../../support/testUtils'
import { shoppingListsForGame } from '../../support/data/shoppingLists'
import {
  gamesContextValue,
  shoppingListsContextValue,
} from '../../support/data/contextValues'
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

    describe('when the game is set in the query string', () => {
      describe('when the game has shopping lists', () => {
        const mockServer = setupServer(
          getGamesAllSuccess,
          getShoppingListsSuccess
        )
        beforeAll(() => mockServer.listen())
        beforeEach(() => mockServer.resetHandlers())
        afterAll(() => mockServer.close())

        test('displays the shopping lists', async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesProvider>
                <ShoppingListsProvider>
                  <ShoppingListsPage />
                </ShoppingListsProvider>
              </GamesProvider>
            </PageProvider>,
            'http://localhost:5173/shopping_lists?gameId=77'
          )
          expect(wrapper).toBeTruthy()

          await waitFor(() => {
            // All the lists should be there
            expect(wrapper.getByText('All Items')).toBeTruthy()
            expect(wrapper.getByText('Honeyside')).toBeTruthy()
            expect(wrapper.getByText('Breezehome')).toBeTruthy()

            expect(
              wrapper.getAllByText('This shopping list has no list items.')
                .length
            ).toEqual(3)
          })
        })

        test('matches snapshot', () => {
          test('displays the shopping lists', async () => {
            const wrapper = renderAuthenticated(
              <PageProvider>
                <GamesContext.Provider value={gamesContextValue}>
                  <ShoppingListsContext.Provider
                    value={shoppingListsContextValue}
                  >
                    <ShoppingListsPage />
                  </ShoppingListsContext.Provider>
                </GamesContext.Provider>
              </PageProvider>,
              'http://localhost:5173/shopping_lists?gameId=51'
            )
            expect(wrapper).toMatchSnapshot()
          })
        })
      })
    })
  })
})
