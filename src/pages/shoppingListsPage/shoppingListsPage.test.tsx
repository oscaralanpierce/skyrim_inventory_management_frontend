import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
} from 'vitest'
import {
  waitFor,
  act,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { setupServer } from 'msw/node'
import { renderAuthenticated, renderAuthLoading } from '../../support/testUtils'
import {
  postShoppingListsSuccess,
  postShoppingListsServerError,
  postShoppingListsUnprocessable,
  getGamesAllSuccess,
  getShoppingListsSuccess,
  patchShoppingListSuccess,
  patchShoppingListUnprocessable,
  patchShoppingListServerError,
  deleteShoppingListSuccess,
  deleteShoppingListServerError,
  incrementShoppingListItemSuccess,
  decrementShoppingListItemSuccess,
  updateShoppingListItemSuccess,
  updateShoppingListItemUnprocessable,
  updateShoppingListItemServerError,
  postShoppingListItemsSuccess,
  postShoppingListItemsUnprocessable,
  postShoppingListItemsServerError,
  deleteShoppingListItemSuccess,
  deleteShoppingListItemServerError,
} from '../../support/msw/handlers'
import { gamesContextValue } from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesProvider, GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import ShoppingListsPage from './shoppingListsPage'

/**
 *
 * Not able to be tested:
 * - 404 responses when creating a shopping list
 *   - This would be a difficult state to arrive at. You would have to have multiple tabs open
 *     and delete a game from the games page in one tab and then create a shopping list in
 *     another tab while it is set to that game without refreshing. In the test environment, these
 *     conditions are hard to create since there would first be a 404 error when fetching the
 *     shopping lists in the first place.
 * - 404 response when editing/destroying a shopping list or managing its items
 * - 405 response when editing/destroying a shopping list or managing its items
 *   - This response from the API occurs when the client makes a PUT, PATCH, or DELETE request
 *     on an aggregate list. In the UI, aggregate lists are always uneditable and won't have a
 *     way to update them or manage items, so the only way to get this response would be to
 *     intercept the request, change the list ID, and send it on to the server.
 * - That the create form input is cleared after request completion or not
 * - Flash warning being shown and no request made if, somehow, the user submits the create form
 *   before an active game has been set
 * - New list items get added to the correct list
 * -
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

    describe('when an invalid value is set in the query string', () => {
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
          </PageProvider>,
          'http://localhost:5173/shopping_lists?gameId=uhoh'
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
      const mockServer = setupServer(
        getGamesAllSuccess,
        getShoppingListsSuccess
      )

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
        postShoppingListsSuccess
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

        test("doesn't remove existing lists", async () => {
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
            expect(wrapper.getByText('All Items')).toBeTruthy()
            expect(wrapper.getByText('My Shopping List 1')).toBeTruthy()
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
        getShoppingListsSuccess,
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
        getShoppingListsSuccess,
        postShoppingListsServerError
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays a user-friendly message', async () => {
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

  describe('destroying a shopping list', () => {
    describe('when successful', () => {
      const mockServer = setupServer(
        getGamesAllSuccess,
        getShoppingListsSuccess,
        deleteShoppingListSuccess
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      describe('when the user confirms deletion', () => {
        describe('when the game has no other regular shopping lists', () => {
          const ogConfirm = window.confirm

          afterEach(() => {
            window.confirm = ogConfirm
          })

          test('removes the aggregate list too', async () => {
            const wrapper = renderAuthenticated(
              <PageProvider>
                <GamesProvider>
                  <ShoppingListsProvider>
                    <ShoppingListsPage />
                  </ShoppingListsProvider>
                </GamesProvider>
              </PageProvider>,
              'http://localhost:5173/shopping_lists?gameId=32'
            )

            window.confirm = vitest.fn().mockImplementation(() => true)

            const destroyIcon = await wrapper.findByTestId(
              'destroyShoppingList2'
            )

            act(() => {
              fireEvent.click(destroyIcon)
            })

            expect(window.confirm).toHaveBeenCalledWith(
              'Are you sure you want to delete the list "My Shopping List 1"? You will also lose any list items on the list. This action cannot be undone.'
            )

            await waitFor(() => {
              expect(wrapper.queryByText('All Items')).toBeFalsy()
              expect(wrapper.queryByText('My Shopping List 1')).toBeFalsy()
              expect(
                wrapper.getByText('This game has no shopping lists.')
              ).toBeTruthy()
            })
          })

          test('displays a flash success message', async () => {
            const wrapper = renderAuthenticated(
              <PageProvider>
                <GamesProvider>
                  <ShoppingListsProvider>
                    <ShoppingListsPage />
                  </ShoppingListsProvider>
                </GamesProvider>
              </PageProvider>,
              'http://localhost:5173/shopping_lists?gameId=32'
            )

            window.confirm = vitest.fn().mockImplementation(() => true)

            const destroyIcon = await wrapper.findByTestId(
              'destroyShoppingList2'
            )

            act(() => {
              fireEvent.click(destroyIcon)
            })

            expect(window.confirm).toHaveBeenCalledWith(
              'Are you sure you want to delete the list "My Shopping List 1"? You will also lose any list items on the list. This action cannot be undone.'
            )

            await waitFor(() => {
              expect(
                wrapper.getByText(
                  'Success! Your shopping list has been deleted.'
                )
              ).toBeTruthy()
            })
          })
        })

        describe('when the game has other regular shopping lists', () => {
          const ogConfirm = window.confirm

          afterEach(() => {
            window.confirm = ogConfirm
          })

          test('removes the deleted list', async () => {
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

            window.confirm = vitest.fn().mockImplementation(() => true)

            const destroyIcon = await wrapper.findByTestId(
              'destroyShoppingList6'
            )

            act(() => {
              fireEvent.click(destroyIcon)
            })

            expect(window.confirm).toHaveBeenCalledWith(
              'Are you sure you want to delete the list "Hjerim"? You will also lose any list items on the list. This action cannot be undone.'
            )

            await waitFor(() => {
              expect(wrapper.getByText('All Items')).toBeTruthy()
              expect(wrapper.getByText('Honeyside')).toBeTruthy()
              expect(wrapper.getByText('Breezehome')).toBeTruthy()
              expect(wrapper.queryByText('Hjerim')).toBeFalsy()
            })
          })

          test('displays a flash success message', async () => {
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

            window.confirm = vitest.fn().mockImplementation(() => true)

            const destroyIcon = await wrapper.findByTestId(
              'destroyShoppingList6'
            )

            act(() => {
              fireEvent.click(destroyIcon)
            })

            expect(window.confirm).toHaveBeenCalledWith(
              'Are you sure you want to delete the list "Hjerim"? You will also lose any list items on the list. This action cannot be undone.'
            )

            await waitFor(() => {
              expect(
                wrapper.getByText(
                  'Success! Your shopping list has been deleted.'
                )
              ).toBeTruthy()
            })
          })
        })
      })

      describe('when the user cancels deletion', () => {
        const ogConfirm = window.confirm

        afterEach(() => {
          window.confirm = ogConfirm
        })

        test("doesn't remove the lists", async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesProvider>
                <ShoppingListsProvider>
                  <ShoppingListsPage />
                </ShoppingListsProvider>
              </GamesProvider>
            </PageProvider>,
            'http://localhost:5173/shopping_lists?gameId=32'
          )

          window.confirm = vitest.fn().mockImplementation(() => false)

          const destroyIcon = await wrapper.findByTestId('destroyShoppingList2')

          act(() => fireEvent.click(destroyIcon))

          expect(window.confirm).toHaveBeenCalled()

          await waitFor(() => {
            expect(wrapper.getByText('My Shopping List 1')).toBeTruthy()
          })
        })

        test('displays a flash info message', async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesProvider>
                <ShoppingListsProvider>
                  <ShoppingListsPage />
                </ShoppingListsProvider>
              </GamesProvider>
            </PageProvider>,
            'http://localhost:5173/shopping_lists?gameId=32'
          )

          window.confirm = vitest.fn().mockImplementation(() => false)

          const destroyIcon = await wrapper.findByTestId('destroyShoppingList2')

          act(() => fireEvent.click(destroyIcon))

          expect(window.confirm).toHaveBeenCalled()

          await waitFor(() => {
            expect(
              wrapper.getByText('OK, your shopping list will not be destroyed.')
            ).toBeTruthy()
          })
        })
      })
    })

    describe('when unsuccessful', () => {
      const ogConfirm = window.confirm
      const mockServer = setupServer(
        getGamesAllSuccess,
        getShoppingListsSuccess,
        deleteShoppingListServerError
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())

      afterEach(() => {
        window.confirm = ogConfirm
      })

      afterAll(() => mockServer.close())

      test("doesn't remove the list and displays a flash error", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesProvider>
          </PageProvider>,
          'http://localhost:5173/shopping_lists?gameId=32'
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const destroyIcon = await wrapper.findByTestId('destroyShoppingList2')

        act(() => fireEvent.click(destroyIcon))

        expect(window.confirm).toHaveBeenCalledWith(
          'Are you sure you want to delete the list "My Shopping List 1"? You will also lose any list items on the list. This action cannot be undone.'
        )

        await waitFor(() => {
          expect(wrapper.getByText('All Items')).toBeTruthy()
          expect(wrapper.getByText('My Shopping List 1')).toBeTruthy()
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
        })
      })
    })
  })

  describe('editing a shopping list', () => {
    describe('when successful', () => {
      const mockServer = setupServer(
        getGamesAllSuccess,
        getShoppingListsSuccess,
        patchShoppingListSuccess
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('updates the title', async () => {
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

        const editIcon = await wrapper.findByTestId('editShoppingList6')

        act(() => fireEvent.click(editIcon))

        const titleInput = wrapper.getByTestId('editListTitle')
        const editForm = wrapper.getByLabelText('List title edit form')

        fireEvent.change(titleInput, {
          target: { value: 'Alchemy Ingredients' },
        })

        act(() => fireEvent.submit(editForm))

        await waitFor(() => {
          // Name should be changed and form hidden
          expect(wrapper.queryByLabelText('List title edit form')).toBeFalsy()
          expect(wrapper.getByText('Alchemy Ingredients')).toBeTruthy()
          expect(wrapper.queryByText('Hjerim')).toBeFalsy()

          // The other list titles should be unchanged
          expect(wrapper.getByText('All Items')).toBeTruthy()
          expect(wrapper.getByText('Breezehome')).toBeTruthy()
          expect(wrapper.getByText('Honeyside')).toBeTruthy()
        })
      })
    })

    describe('when there is an Unprocessable Entity response', () => {
      const mockServer = setupServer(
        getGamesAllSuccess,
        getShoppingListsSuccess,
        patchShoppingListUnprocessable
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays the flash message', async () => {
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

        const editIcon = await wrapper.findByTestId('editShoppingList6')

        act(() => fireEvent.click(editIcon))

        const titleInput = wrapper.getByTestId('editListTitle')
        const editForm = wrapper.getByLabelText('List title edit form')

        fireEvent.change(titleInput, {
          target: { value: 'Alchemy Ingredients' },
        })

        act(() => fireEvent.submit(editForm))

        await waitFor(() => {
          // The form should not be hidden nor the name changed
          expect(wrapper.getByLabelText('List title edit form')).toBeTruthy()
          expect(wrapper.queryByText('Alchemy Ingredients')).toBeFalsy()
          expect(wrapper.queryByText('Hjerim')).toBeFalsy()

          // The flash component should be shown
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
        })
      })
    })

    describe('when there is an internal server error response', () => {
      const mockServer = setupServer(
        getGamesAllSuccess,
        getShoppingListsSuccess,
        patchShoppingListServerError
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays the flash message', async () => {
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

        const editIcon = await wrapper.findByTestId('editShoppingList6')

        act(() => fireEvent.click(editIcon))

        const titleInput = wrapper.getByTestId('editListTitle')
        const editForm = wrapper.getByLabelText('List title edit form')

        fireEvent.change(titleInput, {
          target: { value: 'Alchemy Ingredients' },
        })

        act(() => fireEvent.submit(editForm))

        await waitFor(() => {
          // The form should not be hidden nor the name changed
          expect(wrapper.getByLabelText('List title edit form')).toBeTruthy()
          expect(wrapper.queryByText('Alchemy Ingredients')).toBeFalsy()
          expect(wrapper.queryByText('Hjerim')).toBeFalsy()

          // The flash component should be shown
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
        })
      })
    })
  })

  describe('adding a list item', () => {
    describe('when successful', () => {
      const mockServer = setupServer(
        getShoppingListsSuccess,
        postShoppingListItemsSuccess
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('adds the new item to the list and aggregate list', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        const form = (
          await wrapper.findAllByLabelText('Shopping list item creation form')
        )[0]
        const descField = (await wrapper.findAllByLabelText('Description'))[0]
        const quantityField = (await wrapper.findAllByLabelText('Quantity'))[0]

        fireEvent.change(descField, {
          target: { value: 'Dwarven metal ingots' },
        })
        fireEvent.change(quantityField, { target: { value: '3' } })

        act(() => fireEvent.submit(form))

        await waitFor(() => {
          expect(wrapper.getAllByText('Dwarven metal ingots').length).toEqual(2)
          expect(
            wrapper.getByText(
              'Success! Your shopping list item has been created.'
            )
          ).toBeTruthy()
        })
      })
    })

    describe('when there is an unprocessable entity error', () => {
      const mockServer = setupServer(
        getShoppingListsSuccess,
        postShoppingListItemsUnprocessable
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays a flash error message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        const form = (
          await wrapper.findAllByLabelText('Shopping list item creation form')
        )[0]
        const descField = (await wrapper.findAllByLabelText('Description'))[0]
        const quantityField = (await wrapper.findAllByLabelText('Quantity'))[0]

        fireEvent.change(descField, {
          target: { value: 'Dwarven metal ingots' },
        })
        fireEvent.change(quantityField, { target: { value: '3' } })

        act(() => fireEvent.submit(form))

        await waitFor(() => {
          expect(
            wrapper.queryAllByText('Dwarven metal ingots')?.length
          ).toBeFalsy()
          expect(
            wrapper.getByText(
              '2 error(s) prevented your shopping list item from being saved:'
            )
          ).toBeTruthy()
          expect(
            wrapper.getByText('Quantity must be greater than 0')
          ).toBeTruthy()
          expect(
            wrapper.getByText('Unit weight must be greater than or equal to 0')
          ).toBeTruthy()
        })
      })
    })

    describe('when there is an internal server error', async () => {
      const mockServer = setupServer(
        getShoppingListsSuccess,
        postShoppingListItemsServerError
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays a flash error message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        const form = (
          await wrapper.findAllByLabelText('Shopping list item creation form')
        )[0]
        const descField = (await wrapper.findAllByLabelText('Description'))[0]
        const quantityField = (await wrapper.findAllByLabelText('Quantity'))[0]

        fireEvent.change(descField, {
          target: { value: 'Dwarven metal ingots' },
        })
        fireEvent.change(quantityField, { target: { value: '3' } })

        act(() => fireEvent.submit(form))

        await waitFor(() => {
          expect(
            wrapper.queryAllByText('Dwarven metal ingots').length
          ).toBeFalsy()
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
        })
      })
    })
  })

  describe('destroying a list item', () => {
    describe('when the user cancels', () => {
      const ogConfirm = window.confirm
      const mockServer = setupServer(getShoppingListsSuccess)

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())

      afterEach(() => {
        window.confirm = ogConfirm
      })

      afterAll(() => mockServer.close())

      test("doesn't remove the item", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        window.confirm = vitest.fn().mockImplementation(() => false)

        const destroyIcon = await wrapper.findByTestId(
          'destroyShoppingListItem3'
        )

        act(() => fireEvent.click(destroyIcon))

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalled()
          expect(wrapper.getAllByText('Iron ingot').length).toEqual(2)
          expect(
            wrapper.getByText(
              'OK, your shopping list item will not be deleted.'
            )
          ).toBeTruthy()
        })
      })
    })

    describe('when successful', () => {
      const ogConfirm = window.confirm
      const mockServer = setupServer(
        getShoppingListsSuccess,
        deleteShoppingListItemSuccess
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())

      afterEach(() => {
        window.confirm = ogConfirm
      })

      afterAll(() => mockServer.close())

      test('removes the item from the regular and aggregate list', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const destroyIcon = await wrapper.findByTestId(
          'destroyShoppingListItem3'
        )

        act(() => fireEvent.click(destroyIcon))

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalled()

          // Should destroy both list items
          expect(wrapper.queryByText('Iron ingot')).toBeFalsy()

          // Should not remove any other list items
          expect(wrapper.getAllByText('Necklace').length).toEqual(2)

          // Should show a flash success message
          expect(
            wrapper.getByText(
              'Success! Your shopping list item has been deleted.'
            )
          ).toBeTruthy()
        })
      })
    })

    describe('when there is an internal server error', async () => {
      const ogConfirm = window.confirm
      const mockServer = setupServer(
        getShoppingListsSuccess,
        deleteShoppingListItemServerError
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())

      afterEach(() => {
        window.confirm = ogConfirm
      })

      afterAll(() => mockServer.close())

      test('displays a flash error message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const destroyIcon = await wrapper.findByTestId(
          'destroyShoppingListItem3'
        )

        act(() => fireEvent.click(destroyIcon))

        await waitFor(() => {
          expect(wrapper.getAllByText('Necklace').length).toEqual(2)
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
        })
      })
    })
  })

  describe('incrementing list item quantity', () => {
    describe('when successful', () => {
      const mockServer = setupServer(
        getShoppingListsSuccess,
        incrementShoppingListItemSuccess
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('increments quantity of affected items', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        const incrementIcon = await wrapper.findByTestId(
          'incrementShoppingListItem3'
        )

        act(() => fireEvent.click(incrementIcon))

        await waitFor(() => {
          expect(wrapper.getAllByText('2').length).toEqual(2)
        })
      })
    })

    describe('when there is a server error', () => {
      const mockServer = setupServer(
        getShoppingListsSuccess,
        updateShoppingListItemServerError
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays a flash error', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        const incrementIcon = await wrapper.findByTestId(
          'incrementShoppingListItem3'
        )

        act(() => fireEvent.click(incrementIcon))

        await waitFor(() => {
          expect(wrapper.queryAllByText('2').length).toBeFalsy()
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
        })
      })
    })
  })

  describe('decrementing list item quantity', () => {
    describe('when successful', () => {
      describe('when decrementing a quantity greater than 1', () => {
        const mockServer = setupServer(
          getShoppingListsSuccess,
          decrementShoppingListItemSuccess
        )

        beforeAll(() => mockServer.listen())
        beforeEach(() => mockServer.resetHandlers())
        afterAll(() => mockServer.close())

        test('decrements quantity of affected items', async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesContext.Provider value={gamesContextValue}>
                <ShoppingListsProvider>
                  <ShoppingListsPage />
                </ShoppingListsProvider>
              </GamesContext.Provider>
            </PageProvider>
          )

          const decrementIcon = await wrapper.findByTestId(
            'decrementShoppingListItem1'
          )

          act(() => fireEvent.click(decrementIcon))

          await waitFor(() => {
            expect(wrapper.getAllByText('2').length).toEqual(2)
          })
        })
      })

      describe('when decrementing the quantity to zero', () => {
        describe('when the user confirms deletion', () => {
          const ogConfirm = window.confirm
          const mockServer = setupServer(
            getShoppingListsSuccess,
            deleteShoppingListItemSuccess
          )

          beforeAll(() => mockServer.listen())
          beforeEach(() => mockServer.resetHandlers())

          afterEach(() => {
            window.confirm = ogConfirm
          })

          afterAll(() => mockServer.close())

          test('deletes the item', async () => {
            const wrapper = renderAuthenticated(
              <PageProvider>
                <GamesContext.Provider value={gamesContextValue}>
                  <ShoppingListsProvider>
                    <ShoppingListsPage />
                  </ShoppingListsProvider>
                </GamesContext.Provider>
              </PageProvider>
            )

            window.confirm = vitest.fn().mockImplementation(() => true)
            const decrementIcon = await wrapper.findByTestId(
              'decrementShoppingListItem3'
            )

            act(() => fireEvent.click(decrementIcon))

            await waitFor(() => {
              expect(window.confirm).toHaveBeenCalled()
              expect(wrapper.queryAllByText('Iron ingot').length).toBeFalsy()
              expect(
                wrapper.getByText(
                  'Success! Your shopping list item has been deleted.'
                )
              ).toBeTruthy()
            })
          })
        })

        describe('when the user cancels deletion', () => {
          const ogConfirm = window.confirm
          const mockServer = setupServer(getShoppingListsSuccess)

          beforeAll(() => mockServer.listen())
          beforeEach(() => mockServer.resetHandlers())

          afterEach(() => {
            window.confirm = ogConfirm
          })

          afterAll(() => mockServer.close())

          test("doesn't delete the item", async () => {
            const wrapper = renderAuthenticated(
              <PageProvider>
                <GamesContext.Provider value={gamesContextValue}>
                  <ShoppingListsProvider>
                    <ShoppingListsPage />
                  </ShoppingListsProvider>
                </GamesContext.Provider>
              </PageProvider>
            )

            window.confirm = vitest.fn().mockImplementation(() => false)
            const decrementIcon = await wrapper.findByTestId(
              'decrementShoppingListItem3'
            )

            act(() => fireEvent.click(decrementIcon))

            await waitFor(() => {
              expect(window.confirm).toHaveBeenCalled()
              expect(wrapper.getAllByText('Iron ingot').length).toEqual(2)
              expect(
                wrapper.getByText(
                  'OK, your shopping list item will not be deleted.'
                )
              ).toBeTruthy()
            })
          })
        })
      })
    })

    describe('when there is a server error', () => {
      const mockServer = setupServer(
        getShoppingListsSuccess,
        updateShoppingListItemServerError
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays a flash error', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        const decrementIcon = await wrapper.findByTestId(
          'decrementShoppingListItem1'
        )

        act(() => fireEvent.click(decrementIcon))

        await waitFor(() => {
          expect(wrapper.queryAllByText('2').length).toBeFalsy()
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
        })
      })
    })
  })

  describe('editing a list item', () => {
    describe('when successful', () => {
      const mockServer = setupServer(
        getShoppingListsSuccess,
        updateShoppingListItemSuccess
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('hides the form, shows the flash message and updates the items', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        const editIcon = await wrapper.findByTestId('editShoppingListItem3')

        act(() => fireEvent.click(editIcon))

        const notesFields = wrapper.getAllByLabelText('Notes')
        const editNotesField = notesFields[notesFields.length - 1] // the modal is below all the new item forms
        const form = wrapper.getByTestId('editShoppingListItem3Form')

        fireEvent.change(editNotesField, { target: { value: 'Hello world' } })

        act(() => fireEvent.submit(form))

        await waitForElementToBeRemoved(form)

        expect(
          wrapper.getByText(
            'Success! Your shopping list item has been updated.'
          )
        ).toBeTruthy()
        expect(wrapper.getAllByText('Hello world').length).toEqual(2)
        expect(wrapper.queryAllByText(/hinges/).length).toEqual(0)
      })
    })

    describe('when there is a 422 response', () => {
      const mockServer = setupServer(
        getShoppingListsSuccess,
        updateShoppingListItemUnprocessable
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test("shows the validation errors and doesn't hide the form", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        const editIcon = await wrapper.findByTestId('editShoppingListItem3')

        act(() => fireEvent.click(editIcon))

        const notesFields = wrapper.getAllByLabelText('Notes')
        const editNotesField = notesFields[notesFields.length - 1] // the modal is below all the new item forms
        const form = wrapper.getByTestId('editShoppingListItem3Form')

        fireEvent.change(editNotesField, { target: { value: 'Hello world' } })

        act(() => fireEvent.submit(form))

        await waitFor(() => {
          expect(
            wrapper.getByText(
              '2 error(s) prevented your shopping list item from being saved:'
            )
          ).toBeTruthy()
          expect(
            wrapper.getByText('Quantity must be greater than 0')
          ).toBeTruthy()
          expect(
            wrapper.getByText('Unit weight must be greater than or equal to 0')
          ).toBeTruthy()
          expect(form).toBeTruthy()
          expect(wrapper.getAllByText(/hinges/).length).toEqual(2)
          expect(wrapper.queryAllByText('Hello world').length).toEqual(0)
        })
      })
    })

    describe('when there is a server error', () => {
      const mockServer = setupServer(
        getShoppingListsSuccess,
        updateShoppingListItemServerError
      )

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test("shows an error message and doesn't hide the form", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesContext.Provider>
          </PageProvider>
        )

        const editIcon = await wrapper.findByTestId('editShoppingListItem3')

        act(() => fireEvent.click(editIcon))

        const notesFields = wrapper.getAllByLabelText('Notes')
        const editNotesField = notesFields[notesFields.length - 1] // the modal is below all the new item forms
        const form = wrapper.getByTestId('editShoppingListItem3Form')

        fireEvent.change(editNotesField, { target: { value: 'Hello world' } })

        act(() => fireEvent.submit(form))

        await waitFor(() => {
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
          expect(form).toBeTruthy()
          expect(wrapper.getAllByText(/hinges/).length).toEqual(2)
          expect(wrapper.queryAllByText('Hello world').length).toEqual(0)
        })
      })
    })
  })
})
