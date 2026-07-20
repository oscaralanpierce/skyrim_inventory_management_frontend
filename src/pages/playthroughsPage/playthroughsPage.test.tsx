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
  postPlaythroughsSuccess,
  postPlaythroughsUnprocessable,
  postPlaythroughsServerError,
  getPlaythroughsEmptySuccess,
  getPlaythroughsAllSuccess,
  getPlaythroughsServerError,
  patchPlaythroughSuccess,
  patchPlaythroughUnprocessableEntity,
  patchPlaythroughNotFound,
  patchPlaythroughServerError,
  deletePlaythroughSuccess,
  deletePlaythroughNotFound,
  deletePlaythroughServerError,
} from '../../support/msw/handlers'
import { playthroughsContextValue } from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext, PlaythroughsProvider } from '../../contexts/playthroughsContext'
import PlaythroughsPage from './playthroughsPage'

describe('<PlaythroughsPage />', () => {
  describe('viewing playthroughs', () => {
    describe('when loading', () => {
      test('displays the loader', () => {
        const wrapper = renderAuthLoading(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )
        expect(wrapper).toBeTruthy()

        expect(wrapper.getByTestId('pulseLoader')).toBeTruthy()
      })

      test('matches snapshot', () => {
        const wrapper = renderAuthLoading(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when there are no playthroughs', () => {
      const mockServer = setupServer(getPlaythroughsEmptySuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('playthroughs page displays a message that there are no playthroughs', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )
        expect(wrapper).toBeTruthy()

        await waitFor(() => {
          expect(wrapper.getByText('Create Playthrough...')).toBeTruthy()
          expect(wrapper.getByTestId('playthroughCreateFormForm')).toBeTruthy()
        })
      })

      test('matches snapshot', () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when there are multiple playthroughs', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      // Descriptions should be hidden by default but Vitest has no way of knowing
      // that, as noted in the test file for the PlaythroughLineItem component.
      test('displays the title and description of each playthrough', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        await waitFor(() => {
          expect(wrapper.getByText('My Playthrough 1')).toBeTruthy()
          expect(
            wrapper.getByText('This is a playthrough with a description')
          ).toBeTruthy()

          expect(wrapper.getByText('My Playthrough 2')).toBeTruthy()
          expect(
            wrapper.getByText('This playthrough has no description.')
          ).toBeTruthy()

          expect(
            wrapper.getByText(
              'Playthrough with a really really really really really long name'
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
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when the server returns an error', () => {
      const mockServer = setupServer(getPlaythroughsServerError)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays error content', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
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
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        expect(wrapper.getByText('Your Playthroughs')).toBeTruthy()
      })

      test('matches snapshot', () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })
  })

  describe('destroying a playthrough', () => {
    describe('when the user confirms deletion', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess, deletePlaythroughSuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('destroys the playthrough and removes it from the DOM', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const playthrough51 = await wrapper.findByText('My Playthrough 2')
        const deleteButton = await wrapper.findByTestId('destroyPlaythrough51')

        act(() => deleteButton.click())

        await waitForElementToBeRemoved(playthrough51)
        const flash = await wrapper.findByText(/playthrough has been deleted/)

        expect(wrapper.queryByText('My Playthrough 2')).toBeFalsy()
        expect(flash).toBeTruthy()
      })
    })

    describe('when the back end returns a 404 error', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess, deletePlaythroughNotFound)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('leaves the playthrough in the DOM and displays error message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const deleteButton = await wrapper.findByTestId('destroyPlaythrough51')

        act(() => deleteButton.click())

        await waitFor(() => {
          expect(wrapper.getByText('My Playthrough 2')).toBeTruthy()
          expect(
            wrapper.getByText(
              "Oops! We couldn't find the playthrough you're looking for. Please refresh and try again."
            )
          ).toBeTruthy()
        })
      })
    })

    describe('when the back end returns a 500 error', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess, deletePlaythroughServerError)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('leaves the playthrough in the DOM and displays error message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const deleteButton = await wrapper.findByTestId('destroyPlaythrough51')

        act(() => deleteButton.click())

        await waitFor(() => {
          expect(wrapper.getByText('My Playthrough 2')).toBeTruthy()
          expect(
            wrapper.getByText(
              "Oops! Something unexpected went wrong. We're sorry! Please try again later."
            )
          ).toBeTruthy()
        })
      })
    })

    describe('when the user cancels deletion', () => {
      test("doesn't destroy the playthrough", () => {
        const contextValue = {
          ...playthroughsContextValue,
          destroyPlaythrough: vitest.fn().mockImplementation((_playthroughId: number) => {}),
        }

        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsContext value={contextValue}>
              <PlaythroughsPage />
            </PlaythroughsContext>
          </PageProvider>
        )

        window.confirm = vitest.fn().mockImplementation(() => false)

        const button = wrapper.getByTestId('destroyPlaythrough51')

        act(() => button.click())

        expect(contextValue.destroyPlaythrough).not.toHaveBeenCalled()
        expect(wrapper.getByText('My Playthrough 2')).toBeTruthy()

        // The flash info message should be displayed
        expect(
          wrapper.getByText('OK, your playthrough will not be destroyed.')
        ).toBeTruthy()
      })
    })
  })

  describe('creating a playthrough', () => {
    describe('when successful', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess, postPlaythroughsSuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('adds the playthrough to the list', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        await waitFor(() => {
          expect(wrapper.getByText('My Playthrough 1')).toBeTruthy()
        })

        const button = (await wrapper.findByTestId(
          'createPlaythroughSubmit'
        )) as HTMLButtonElement

        act(() => button.click())

        await waitFor(() => {
          // There should be a success message
          expect(
            wrapper.getByText('Success! Your playthrough has been created.')
          ).toBeTruthy()

          // The new playthrough should be present in the DOM
          expect(wrapper.getByText('My Playthrough 3')).toBeTruthy()
          expect(
            wrapper.getByText('This description is just for illustration.')
          ).toBeTruthy()

          // All the other playthroughs should still be there too
          expect(wrapper.getByText('My Playthrough 1')).toBeTruthy()
          expect(wrapper.getByText('My Playthrough 2')).toBeTruthy()
          expect(
            wrapper.getByText(
              'Playthrough with a really really really really really long name'
            )
          ).toBeTruthy()
        })
      })
    })

    describe('when the server returns an Unprocessable Entity response', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess, postPlaythroughsUnprocessable)

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays an error message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        await waitFor(() => {
          expect(wrapper.getByText('My Playthrough 1')).toBeTruthy()
        })

        const button = (await wrapper.findByTestId(
          'createPlaythroughSubmit'
        )) as HTMLButtonElement

        act(() => button.click())

        await waitFor(() => {
          // There should be an error message
          expect(
            wrapper.getByText(/Name can only contain alphanumeric characters/)
          ).toBeTruthy()

          // All the other playthroughs should still be there
          expect(wrapper.getByText('My Playthrough 1')).toBeTruthy()
          expect(wrapper.getByText('My Playthrough 2')).toBeTruthy()
          expect(
            wrapper.getByText(
              'Playthrough with a really really really really really long name'
            )
          ).toBeTruthy()
        })
      })
    })

    describe('when the server returns a 500 error response', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess, postPlaythroughsServerError)

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays an error message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        await waitFor(() => {
          expect(wrapper.getByText('My Playthrough 1')).toBeTruthy()
        })

        const button = (await wrapper.findByTestId(
          'createPlaythroughSubmit'
        )) as HTMLButtonElement

        act(() => button.click())

        await waitFor(() => {
          // There should be an error message
          expect(
            wrapper.getByText(/Something unexpected went wrong/)
          ).toBeTruthy()

          // All the other playthroughs should still be there
          expect(wrapper.getByText('My Playthrough 1')).toBeTruthy()
          expect(wrapper.getByText('My Playthrough 2')).toBeTruthy()
          expect(
            wrapper.getByText(
              'Playthrough with a really really really really really long name'
            )
          ).toBeTruthy()
        })
      })
    })
  })

  describe('editing a playthrough', () => {
    describe('when successful', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess, patchPlaythroughSuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays the edit form', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        expect(wrapper.getAllByText('Update Playthrough').length).toEqual(2)
      })

      test('hides the modal and form when clicking outside the form', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const form = wrapper.getAllByText('Update Playthrough')[0]
        expect(form).toBeTruthy()

        const modal = wrapper.getByTestId('modal') as HTMLDivElement

        act(() => {
          fireEvent.mouseDown(modal)
        })

        expect(wrapper.queryByText('Update Playthrough')).toBeFalsy()
      })

      test("doesn't hide the modal and form when clicking inside the form", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        expect(wrapper.getAllByText('Update Playthrough').length).toEqual(2)

        const form = wrapper.getByTestId('playthroughForm') as HTMLFormElement

        act(() => {
          fireEvent.mouseDown(form)
        })

        expect(wrapper.getAllByText('Update Playthrough').length).toEqual(2)
      })

      test('hides the modal and form when pressing the Escape key', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        expect(wrapper.getAllByText('Update Playthrough').length).toEqual(2)

        const modal = wrapper.getByTestId('modal') as HTMLDivElement

        act(() => {
          fireEvent.keyUp(modal, { key: 'Escape' })
        })

        expect(wrapper.queryByText('Update Playthrough')).toBeFalsy()
      })

      test('updates the item on the list and hides the modal', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getAllByLabelText('Name')[0]
        const button = wrapper.getByTestId(
          'playthroughFormSubmit'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, {
          target: { value: 'Distinctive New Name' },
        })

        act(() => button.click())

        await waitFor(() => {
          expect(wrapper.queryByText('My Playthrough 1')).toBeFalsy()
          expect(wrapper.getByText('Distinctive New Name')).toBeTruthy()
          expect(
            wrapper.getByText('This is a playthrough with a description')
          ).toBeTruthy()
          expect(wrapper.queryByTestId('playthroughForm')).toBeFalsy()
        })
      })
    })

    describe('when setting a field to null', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess, patchPlaythroughSuccess)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('updates the playthrough on the list and hides the modal', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getAllByLabelText('Name')[0]
        const descInput = wrapper.getAllByLabelText('Description')[0]
        const button = wrapper.getByTestId(
          'playthroughFormSubmit'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, {
          target: { value: 'Distinctive New Name' },
        })

        fireEvent.change(descInput, {
          target: { value: '' },
        })

        act(() => button.click())

        await waitFor(() => {
          expect(wrapper.queryByText('My Playthrough 1')).toBeFalsy()
          expect(wrapper.getByText('Distinctive New Name')).toBeTruthy()
          expect(
            wrapper.getAllByText('This playthrough has no description.').length
          ).toEqual(2)
          expect(wrapper.queryByTestId('playthroughForm')).toBeFalsy()
        })
      })
    })

    describe('when the server returns an Unprocessable Entity response', () => {
      const mockServer = setupServer(
        getPlaythroughsAllSuccess,
        patchPlaythroughUnprocessableEntity
      )

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test("doesn't hide the modal form", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getAllByLabelText('Name')[0]
        const button = wrapper.getByTestId(
          'playthroughFormSubmit'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'My Playthrough 2' } })

        act(() => button.click())

        await waitFor(() => {
          // The modal should not be hidden
          expect(wrapper.getByTestId('playthroughForm')).toBeTruthy()
        })
      })

      test('shows the flash message', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getAllByLabelText('Name')[0]
        const button = wrapper.getByTestId(
          'playthroughFormSubmit'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'My Playthrough 2' } })

        act(() => button.click())

        await waitFor(() => {
          // The flash error message should be displayed
          expect(
            wrapper.getByText(
              '1 error(s) prevented your playthrough from being saved:'
            )
          ).toBeTruthy()
          expect(wrapper.getByText('Name must be unique')).toBeTruthy()
        })
      })

      test("doesn't update the playthrough name on the list", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getAllByLabelText('Name')[0]
        const button = wrapper.getByTestId(
          'playthroughFormSubmit'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'My Playthrough 2' } })

        act(() => button.click())

        await waitFor(() => {
          // The name should not be changed
          expect(wrapper.getByText('My Playthrough 1')).toBeTruthy()
          expect(wrapper.getAllByText('My Playthrough 2').length).toEqual(1)
        })
      })
    })

    describe('when the server returns a 404 response', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess, patchPlaythroughNotFound)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test("doesn't hide the modal form", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getAllByLabelText('Name')[0]
        const button = wrapper.getByTestId(
          'playthroughFormSubmit'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'New Name' } })

        act(() => button.click())

        await waitFor(() => {
          // The modal should not be hidden
          expect(wrapper.getByTestId('playthroughForm')).toBeTruthy()
        })
      })

      test('displays the flash error', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getAllByLabelText('Name')[0]
        const button = wrapper.getByTestId(
          'playthroughFormSubmit'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'New Name' } })

        act(() => button.click())

        await waitFor(() => {
          // The flash error message should be displayed
          expect(
            wrapper.getByText(
              "Oops! We couldn't find the playthrough you're looking for. Please refresh and try again."
            )
          ).toBeTruthy()
        })
      })

      test("doesn't update the name on the list", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getAllByLabelText('Name')[0]
        const button = wrapper.getByTestId(
          'playthroughFormSubmit'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'New Name' } })

        act(() => button.click())

        await waitFor(() => {
          // The name should not be changed
          expect(wrapper.getByText('My Playthrough 1')).toBeTruthy()
          expect(wrapper.queryByText('New Name')).toBeFalsy()
        })
      })
    })

    describe('when the server returns a 500 response', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess, patchPlaythroughServerError)

      beforeAll(() => mockServer.listen())
      afterEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test("doesn't hide the modal form", async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getAllByLabelText('Name')[0]
        const button = wrapper.getByTestId(
          'playthroughFormSubmit'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'New Name' } })

        act(() => button.click())

        await waitFor(() => {
          // The modal should not be hidden
          expect(wrapper.getByTestId('playthroughForm')).toBeTruthy()
        })
      })

      test('displays the flash error', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getAllByLabelText('Name')[0]
        const button = wrapper.getByTestId(
          'playthroughFormSubmit'
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
            <PlaythroughsProvider>
              <PlaythroughsPage />
            </PlaythroughsProvider>
          </PageProvider>
        )

        const editButton = (await wrapper.findByTestId(
          'editPlaythrough32'
        )) as HTMLButtonElement

        act(() => editButton.click())

        const nameInput = wrapper.getAllByLabelText('Name')[0]
        const button = wrapper.getByTestId(
          'playthroughFormSubmit'
        ) as HTMLButtonElement

        fireEvent.change(nameInput, { target: { value: 'New Name' } })

        act(() => button.click())

        await waitFor(() => {
          // The name should not be changed
          expect(wrapper.getByText('My Playthrough 1')).toBeTruthy()
          expect(wrapper.queryByText('New Name')).toBeFalsy()
        })
      })
    })
  })
})
