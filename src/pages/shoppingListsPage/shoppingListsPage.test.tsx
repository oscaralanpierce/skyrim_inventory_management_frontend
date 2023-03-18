import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { waitFor, act, fireEvent } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { renderAuthenticated, renderAuthLoading } from '../../support/testUtils'
import {
  getGamesAllSuccess,
  getShoppingListsSuccess,
  postShoppingLists,
} from '../../support/msw/handlers'
import { PageProvider } from '../../contexts/pageContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import ShoppingListsPage from './shoppingListsPage'

describe('<ShoppingListsPage />', () => {
  describe('viewing shopping lists', () => {
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
      const mockServer = setupServer(
        getGamesAllSuccess,
        getShoppingListsSuccess
      )
      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      describe('when the game has shopping lists', () => {
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

            // The list items should be there too
            expect(wrapper.getAllByText('Dwarven Cog').length).toEqual(3)
            expect(
              wrapper.getAllByText(
                'This item has a really really really really really long description for testing purposes'
              ).length
            ).toEqual(2)
          })
        })

        test('matches snapshot', async () => {
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

          // Wait for games/shopping lists to load
          await waitFor(() => {
            expect(wrapper.getByText('Honeyside')).toBeTruthy()
            expect(wrapper).toMatchSnapshot()
          })
        })
      })

      describe('when the game has no shopping lists', () => {
        test('renders a message that the game has no shopping lists', async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesProvider>
                <ShoppingListsProvider>
                  <ShoppingListsPage />
                </ShoppingListsProvider>
              </GamesProvider>
            </PageProvider>,
            'http://localhost:5173/shopping_lists?gameId=51'
          )

          await waitFor(() => {
            expect(
              wrapper.getByText('This game has no shopping lists.')
            ).toBeTruthy()
          })
        })

        test('matches snapshot', async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesProvider>
                <ShoppingListsProvider>
                  <ShoppingListsPage />
                </ShoppingListsProvider>
              </GamesProvider>
            </PageProvider>,
            'http://localhost:5173/shopping_lists?gameId=51'
          )

          await waitFor(() => {
            expect(
              wrapper.getByText('This game has no shopping lists.')
            ).toBeTruthy()
            expect(wrapper).toMatchSnapshot()
          })
        })
      })
    })

    describe('when no game is set in the query string', () => {
      const mockServer = setupServer(
        getGamesAllSuccess,
        getShoppingListsSuccess
      )
      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('uses the first game by default', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesProvider>
          </PageProvider>
        )

        await waitFor(() => {
          expect(wrapper.getByText('All Items')).toBeTruthy()
          expect(wrapper.getByText('My Shopping List 1')).toBeTruthy()
          expect(wrapper.getByTestId('selectedOption').textContent).toEqual(
            'My Game 1'
          )
        })
      })
    })
  })

  describe('changing games', () => {
    const mockServer = setupServer(getGamesAllSuccess, getShoppingListsSuccess)
    beforeAll(() => mockServer.listen())
    beforeEach(() => mockServer.resetHandlers())
    afterAll(() => mockServer.close())

    test("displays the new game's shopping lists", async () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesProvider>
            <ShoppingListsProvider>
              <ShoppingListsPage />
            </ShoppingListsProvider>
          </GamesProvider>
        </PageProvider>
      )

      const option = await wrapper.findByText('Game with a really real...')

      act(() => option.click())

      await waitFor(() => {
        expect(wrapper.getByTestId('selectedOption').textContent).toEqual(
          'Game with a really real...'
        )
        expect(wrapper.getByText('All Items')).toBeTruthy()
        expect(wrapper.getByText('Honeyside')).toBeTruthy()
        expect(wrapper.getByText('Breezehome')).toBeTruthy()
      })
    })
  })

  describe('creating a shopping list', () => {
    describe('when successful', () => {
      const mockServer = setupServer(
        getGamesAllSuccess,
        getShoppingListsSuccess,
        postShoppingLists
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      describe('when there is an existing aggregate list', () => {
        test('adds the new list to the page', async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesProvider>
                <ShoppingListsProvider>
                  <ShoppingListsPage />
                </ShoppingListsProvider>
              </GamesProvider>
            </PageProvider>
          )

          const input = wrapper.getByPlaceholderText('Title')
          const button = wrapper.getByText('Create')

          await waitFor(() => {
            expect(input.attributes.getNamedItem('disabled')).toBeFalsy()

            fireEvent.change(input, { target: { value: 'Smithing Materials' } })
          })

          act(() => fireEvent.click(button))

          await waitFor(() => {
            expect(wrapper.getByText('Smithing Materials')).toBeTruthy()
            expect(input.attributes.getNamedItem('value')).toBeFalsy()
          })
        })
      })

      describe('when there is no existing aggregate list', () => {
        test('adds the new list and aggregate list to the page', async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesProvider>
                <ShoppingListsProvider>
                  <ShoppingListsPage />
                </ShoppingListsProvider>
              </GamesProvider>
            </PageProvider>,
            'http://localhost:5173/shopping_lists?gameId=51'
          )

          const input = wrapper.getByPlaceholderText('Title')
          const button = wrapper.getByText('Create')

          await waitFor(() => {
            expect(input.attributes.getNamedItem('disabled')).toBeFalsy()

            fireEvent.change(input, { target: { value: 'Smithing Materials' } })
          })

          act(() => fireEvent.click(button))

          await waitFor(() => {
            expect(wrapper.getByText('All Items')).toBeTruthy()
            expect(wrapper.getByText('Smithing Materials')).toBeTruthy()
            expect(
              wrapper.queryByText('This game has no shopping lists.')
            ).toBeFalsy()
            expect(input.attributes.getNamedItem('value')).toBeFalsy()
          })
        })
      })
    })
  })
})
