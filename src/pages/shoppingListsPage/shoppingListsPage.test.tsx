import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { waitFor, act, fireEvent } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { renderAuthenticated, renderAuthLoading } from '../../support/testUtils'
import {
  getGamesAllSuccess,
  getShoppingLists,
  postShoppingLists,
  postShoppingListsServerError,
  postShoppingListsUnprocessable,
} from '../../support/msw/handlers'
import { PageProvider } from '../../contexts/pageContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import ShoppingListsPage from './shoppingListsPage'

/**
 *
 * Not able to be tested:
 * - 404 response when creating a shopping list
 *   - This would be a difficult state to arrive at. You would have to have multiple tabs open
 *     and delete a game from the games page in one tab and then create a shopping list in
 *     another tab while it is set to that game without refreshing. In the test environment, these
 *     conditions are hard to create since there would first be a 404 error when fetching the
 *     shopping lists in the first place.
 * - Whether the create form input is cleared after request completion or not
 *
 */

describe('ShoppingListsPage', () => {
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
      const mockServer = setupServer(getGamesAllSuccess, getShoppingLists)

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
      })
    })

    describe('when no game is set in the query string', () => {
      const mockServer = setupServer(getGamesAllSuccess, getShoppingLists)

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

    describe('when the game does not exist', () => {
      const mockServer = setupServer(getGamesAllSuccess, getShoppingLists)

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays a 404 error', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesProvider>
          </PageProvider>,
          'http://localhost:5173/shopping_lists?gameId=23'
        )

        await waitFor(() => {
          expect(
            wrapper.getByText(
              "The game you've selected doesn't exist, or doesn't belong to you. Please select another game and try again."
            )
          ).toBeTruthy()
        })
      })
    })
  })

  describe('changing games', () => {
    const mockServer = setupServer(getGamesAllSuccess, getShoppingLists)
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
        getShoppingLists,
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
            expect(
              wrapper.getByText('Success! Your shopping list has been created.')
            ).toBeTruthy()
            expect(wrapper.getByText('Smithing Materials')).toBeTruthy()
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
            expect(
              wrapper.getByText('Success! Your shopping list has been created.')
            ).toBeTruthy()
            expect(wrapper.getByText('All Items')).toBeTruthy()
            expect(wrapper.getByText('Smithing Materials')).toBeTruthy()
            expect(
              wrapper.queryByText('This game has no shopping lists.')
            ).toBeFalsy()
          })
        })
      })
    })

    describe('when the response is a 422', () => {
      const mockServer = setupServer(
        getGamesAllSuccess,
        getShoppingLists,
        postShoppingListsUnprocessable
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays the validation errors', async () => {
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
          expect(
            wrapper.getByText(
              '2 error(s) prevented your shopping list from being saved:'
            )
          ).toBeTruthy()
          expect(
            wrapper.getByText('Title must be unique per game')
          ).toBeTruthy()
          expect(
            wrapper.getByText(
              "Title can only contain alphanumeric characters, spaces, commas (,), hyphens (-), and apostrophes (')"
            )
          ).toBeTruthy()
          expect(wrapper.queryByText('Smithing Materials')).toBeFalsy()
        })
      })
    })

    describe('when the response is a 500 error', () => {
      const mockServer = setupServer(
        getGamesAllSuccess,
        getShoppingLists,
        postShoppingListsServerError
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays the validation errors', async () => {
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
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
          expect(wrapper.queryByText('Smithing Materials')).toBeFalsy()
        })
      })
    })
  })
})
