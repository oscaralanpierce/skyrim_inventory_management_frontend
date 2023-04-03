import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import {
  waitFor,
  act,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react'
import { setupServer } from 'msw/node'
import { renderAuthenticated, renderAuthLoading } from '../../support/testUtils'
import {
  postGamesSuccess,
  postGamesUnprocessable,
  postGamesServerError,
  getGamesEmptySuccess,
  getGamesAllSuccess,
  getGamesServerError,
  patchGameSuccess,
  patchGameUnprocessableEntity,
  patchGameNotFound,
  patchGameServerError,
  deleteGameSuccess,
  deleteGameNotFound,
  deleteGameServerError,
} from '../../support/msw/handlers'
import { gamesContextValue } from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext, GamesProvider } from '../../contexts/gamesContext'
import GamesPage from './gamesPage'

describe('<GamesPage />', () => {
  describe('viewing games', () => {
    describe('when loading', () => {
      test('displays the loader', () => {
        const wrapper = renderAuthLoading(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
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
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when there are no games', () => {
      const mockServer = setupServer(getGamesEmptySuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('games page displays a message that there are no games', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )
        expect(wrapper).toBeTruthy()

        await waitFor(() => {
          expect(wrapper.getByText('Create Game...')).toBeTruthy()
          expect(wrapper.getByTestId('gameCreateFormForm')).toBeTruthy()
        })
      })

      test('matches snapshot', () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when there are multiple games', () => {
      const mockServer = setupServer(getGamesAllSuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      // Descriptions should be hidden by default but Vitest has no way of knowing
      // that, as noted in the test file for the GameLineItem component.
      test('displays the title and description of each game', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        await waitFor(() => {
          expect(wrapper.getByText('My Game 1')).toBeTruthy()
          expect(
            wrapper.getByText('This is a game with a description')
          ).toBeTruthy()

          expect(wrapper.getByText('My Game 2')).toBeTruthy()
          expect(
            wrapper.getByText('This game has no description.')
          ).toBeTruthy()

          expect(
            wrapper.getByText(
              'Game with a really really really really really long name'
            )
          ).toBeTruthy()
          expect(
            wrapper.getByText(
              /Cum audissem Antiochum, Brute, ut solebam, cum M\. Pisone/
            )
          ).toBeTruthy()

          expect(wrapper.queryByTestId('pulseLoader')).toBeFalsy()
        })
      })

      test('matches snapshot', () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when the server returns an error', () => {
      const mockServer = setupServer(getGamesServerError)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays error content', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        await waitFor(() => {
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
        })
      })

      test("doesn't break the dashboard", () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        expect(wrapper.getByText('Your Games')).toBeTruthy()
      })

      test('matches snapshot', () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })
  })

  describe('destroying a game', () => {
    describe('when the user confirms deletion', () => {
      const mockServer = setupServer(getGamesAllSuccess, deleteGameSuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('destroys the game and removes it from the DOM', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const game51 = await wrapper.findByText('My Game 2')
        const deleteButton = await wrapper.findByTestId('destroyGame51')

        act(() => deleteButton.click())

        await waitForElementToBeRemoved(game51)
        const flash = await wrapper.findByText(/game has been deleted/)

        expect(wrapper.queryByText('My Game 2')).toBeFalsy()
        expect(flash).toBeTruthy()
      })
    })

    describe('when the back end returns a 404 error', () => {
      const mockServer = setupServer(getGamesAllSuccess, deleteGameNotFound)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('leaves the game in the DOM and displays error message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const deleteButton = await wrapper.findByTestId('destroyGame51')

        act(() => deleteButton.click())

        await waitFor(() => {
          expect(wrapper.getByText('My Game 2')).toBeTruthy()
          expect(
            wrapper.getByText(
              "Oops! We couldn't find the game you're looking for. Please refresh and try again."
            )
          ).toBeTruthy()
        })
      })
    })

    describe('when the back end returns a 500 error', () => {
      const mockServer = setupServer(getGamesAllSuccess, deleteGameServerError)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('leaves the game in the DOM and displays error message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const deleteButton = await wrapper.findByTestId('destroyGame51')

        act(() => deleteButton.click())

        await waitFor(() => {
          expect(wrapper.getByText('My Game 2')).toBeTruthy()
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
        })
      })
    })

    describe('when the user cancels deletion', () => {
      test("doesn't destroy the game", async () => {
        const contextValue = {
          ...gamesContextValue,
          destroyGame: vitest.fn().mockImplementation((_gameId: number) => {}),
        }

        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={contextValue}>
              <GamesPage />
            </GamesContext.Provider>
          </PageProvider>
        )

        window.confirm = vitest.fn().mockImplementation(() => false)

        const button = wrapper.getByTestId('destroyGame51')

        act(() => button.click())

        expect(contextValue.destroyGame).not.toHaveBeenCalled()
        expect(wrapper.getByText('My Game 2')).toBeTruthy()

        // The flash info message should be displayed
        expect(
          wrapper.getByText('OK, your game will not be destroyed.')
        ).toBeTruthy()
      })
    })
  })

  describe('creating a game', () => {
    describe('when successful', () => {
      const mockServer = setupServer(getGamesAllSuccess, postGamesSuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('adds the game to the list', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        await waitFor(() => {
          expect(wrapper.getByText('My Game 1')).toBeTruthy()
        })

        const button = (await wrapper.findByTestId(
          'createGameSubmit'
        )) as HTMLButtonElement

        act(() => button.click())

        await waitFor(() => {
          // There should be a success message
          expect(
            wrapper.getByText('Success! Your game has been created.')
          ).toBeTruthy()

          // The new game should be present in the DOM
          expect(wrapper.getByText('My Game 3')).toBeTruthy()
          expect(
            wrapper.getByText('This description is just for illustration.')
          ).toBeTruthy()

          // All the other games should still be there too
          expect(wrapper.getByText('My Game 1')).toBeTruthy()
          expect(wrapper.getByText('My Game 2')).toBeTruthy()
          expect(
            wrapper.getByText(
              'Game with a really really really really really long name'
            )
          ).toBeTruthy()
        })
      })
    })

    describe('when the server returns an Unprocessable Entity response', () => {
      const mockServer = setupServer(getGamesAllSuccess, postGamesUnprocessable)

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays an error message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        await waitFor(() => {
          expect(wrapper.getByText('My Game 1')).toBeTruthy()
        })

        const button = (await wrapper.findByTestId(
          'createGameSubmit'
        )) as HTMLButtonElement

        act(() => button.click())

        await waitFor(() => {
          // There should be an error message
          expect(
            wrapper.getByText(/Name can only contain alphanumeric characters/)
          ).toBeTruthy()

          // All the other games should still be there
          expect(wrapper.getByText('My Game 1')).toBeTruthy()
          expect(wrapper.getByText('My Game 2')).toBeTruthy()
          expect(
            wrapper.getByText(
              'Game with a really really really really really long name'
            )
          ).toBeTruthy()
        })
      })
    })

    describe('when the server returns a 500 error response', () => {
      const mockServer = setupServer(getGamesAllSuccess, postGamesServerError)

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays an error message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        await waitFor(() => {
          expect(wrapper.getByText('My Game 1')).toBeTruthy()
        })

        const button = (await wrapper.findByTestId(
          'createGameSubmit'
        )) as HTMLButtonElement

        act(() => button.click())

        await waitFor(() => {
          // There should be an error message
          expect(
            wrapper.getByText(/Something unexpected went wrong/)
          ).toBeTruthy()

          // All the other games should still be there
          expect(wrapper.getByText('My Game 1')).toBeTruthy()
          expect(wrapper.getByText('My Game 2')).toBeTruthy()
          expect(
            wrapper.getByText(
              'Game with a really really really really really long name'
            )
          ).toBeTruthy()
        })
      })
    })
  })

  describe('editing a game', () => {
    describe('when successful', () => {
      const mockServer = setupServer(getGamesAllSuccess, patchGameSuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays the edit form', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        expect(wrapper.getAllByText('Update Game').length).toEqual(2)
      })

      test('hides the modal and form when clicking outside the form', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const form = wrapper.getAllByText('Update Game')[0]
        expect(form).toBeTruthy()

        const modal = wrapper.getByTestId('modal') as HTMLDivElement

        act(() => {
          fireEvent.mouseDown(modal)
        })

        expect(wrapper.queryByText('Update Game')).toBeFalsy()
      })

      test("doesn't hide the modal and form when clicking inside the form", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        expect(wrapper.getAllByText('Update Game').length).toEqual(2)

        const form = wrapper.getByTestId('editGame32Form') as HTMLFormElement

        act(() => {
          fireEvent.mouseDown(form)
        })

        expect(wrapper.getAllByText('Update Game').length).toEqual(2)
      })

      test('hides the modal and form when pressing the Escape key', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        expect(wrapper.getAllByText('Update Game').length).toEqual(2)

        const modal = wrapper.getByTestId('modal') as HTMLDivElement

        act(() => {
          fireEvent.keyUp(modal, { key: 'Escape' })
        })

        expect(wrapper.queryByText('Update Game')).toBeFalsy()
      })

      test('updates the item on the list and hides the modal', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getByTestId(
          'editNameField'
        ) as HTMLInputElement
        const button = wrapper.getByTestId(
          'submitGameEditForm'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, {
          target: { value: 'Distinctive New Name' },
        })

        act(() => button.click())

        await waitFor(() => {
          expect(wrapper.queryByText('My Game 1')).toBeFalsy()
          expect(wrapper.getByText('Distinctive New Name')).toBeTruthy()
          expect(
            wrapper.getByText('This is a game with a description')
          ).toBeTruthy()
          expect(wrapper.queryByTestId('editGame32Form')).toBeFalsy()
        })
      })
    })

    describe('when setting a field to null', () => {
      const mockServer = setupServer(getGamesAllSuccess, patchGameSuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('updates the game on the list and hides the modal', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getByTestId(
          'editNameField'
        ) as HTMLInputElement
        const descInput = wrapper.getByTestId(
          'editDescriptionField'
        ) as HTMLInputElement
        const button = wrapper.getByTestId(
          'submitGameEditForm'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, {
          target: { value: 'Distinctive New Name' },
        })

        fireEvent.change(descInput, {
          target: { value: '' },
        })

        act(() => button.click())

        await waitFor(() => {
          expect(wrapper.queryByText('My Game 1')).toBeFalsy()
          expect(wrapper.getByText('Distinctive New Name')).toBeTruthy()
          expect(
            wrapper.getAllByText('This game has no description.').length
          ).toEqual(2)
          expect(wrapper.queryByTestId('editGame32Form')).toBeFalsy()
        })
      })
    })

    describe('when the server returns an Unprocessable Entity response', () => {
      const mockServer = setupServer(
        getGamesAllSuccess,
        patchGameUnprocessableEntity
      )

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test("doesn't hide the modal form", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getByTestId(
          'editNameField'
        ) as HTMLInputElement
        const button = wrapper.getByTestId(
          'submitGameEditForm'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'My Game 2' } })

        act(() => button.click())

        await waitFor(() => {
          // The modal should not be hidden
          expect(wrapper.getByTestId('editGame32Form')).toBeTruthy()
        })
      })

      test('shows the flash message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getByTestId(
          'editNameField'
        ) as HTMLInputElement
        const button = wrapper.getByTestId(
          'submitGameEditForm'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'My Game 2' } })

        act(() => button.click())

        await waitFor(() => {
          // The flash error message should be displayed
          expect(
            wrapper.getByText(
              '1 error(s) prevented your game from being saved:'
            )
          ).toBeTruthy()
          expect(wrapper.getByText('Name must be unique')).toBeTruthy()
        })
      })

      test("doesn't update the game name on the list", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getByTestId(
          'editNameField'
        ) as HTMLInputElement
        const button = wrapper.getByTestId(
          'submitGameEditForm'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'My Game 2' } })

        act(() => button.click())

        await waitFor(() => {
          // The name should not be changed
          expect(wrapper.getByText('My Game 1')).toBeTruthy()
          expect(wrapper.getAllByText('My Game 2').length).toEqual(1)
        })
      })
    })

    describe('when the server returns a 404 response', () => {
      const mockServer = setupServer(getGamesAllSuccess, patchGameNotFound)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test("doesn't hide the modal form", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getByTestId(
          'editNameField'
        ) as HTMLInputElement
        const button = wrapper.getByTestId(
          'submitGameEditForm'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'New Name' } })

        act(() => button.click())

        await waitFor(() => {
          // The modal should not be hidden
          expect(wrapper.getByTestId('editGame32Form')).toBeTruthy()
        })
      })

      test('displays the flash error', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getByTestId(
          'editNameField'
        ) as HTMLInputElement
        const button = wrapper.getByTestId(
          'submitGameEditForm'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'New Name' } })

        act(() => button.click())

        await waitFor(() => {
          // The flash error message should be displayed
          expect(
            wrapper.getByText(
              "Oops! We couldn't find the game you're looking for. Please refresh and try again."
            )
          ).toBeTruthy()
        })
      })

      test("doesn't update the name on the list", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getByTestId(
          'editNameField'
        ) as HTMLInputElement
        const button = wrapper.getByTestId(
          'submitGameEditForm'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'New Name' } })

        act(() => button.click())

        await waitFor(() => {
          // The name should not be changed
          expect(wrapper.getByText('My Game 1')).toBeTruthy()
          expect(wrapper.queryByText('New Name')).toBeFalsy()
        })
      })
    })

    describe('when the server returns a 500 response', () => {
      const mockServer = setupServer(getGamesAllSuccess, patchGameServerError)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test("doesn't hide the modal form", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getByTestId(
          'editNameField'
        ) as HTMLInputElement
        const button = wrapper.getByTestId(
          'submitGameEditForm'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'New Name' } })

        act(() => button.click())

        await waitFor(() => {
          // The modal should not be hidden
          expect(wrapper.getByTestId('editGame32Form')).toBeTruthy()
        })
      })

      test('displays the flash error', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getByTestId(
          'editNameField'
        ) as HTMLInputElement
        const button = wrapper.getByTestId(
          'submitGameEditForm'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'New Name' } })

        act(() => button.click())

        await waitFor(() => {
          // The flash error message should be displayed
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
        })
      })

      test("doesn't update the name on the list", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <GamesPage />
            </GamesProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editGame32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getByTestId(
          'editNameField'
        ) as HTMLInputElement
        const button = wrapper.getByTestId(
          'submitGameEditForm'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'New Name' } })

        act(() => button.click())

        await waitFor(() => {
          // The name should not be changed
          expect(wrapper.getByText('My Game 1')).toBeTruthy()
          expect(wrapper.queryByText('New Name')).toBeFalsy()
        })
      })
    })
  })
})
