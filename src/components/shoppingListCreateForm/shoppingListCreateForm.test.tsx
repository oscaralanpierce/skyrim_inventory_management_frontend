import { type ReactElement } from 'react'
import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { renderAuthenticated } from '../../support/testUtils'
import { getShoppingListsSuccess } from '../../support/msw/shoppingLists'
import {
  gamesContextValue,
  gamesContextValueError,
  gamesContextValueLoading,
  shoppingListsContextValue,
  shoppingListsContextValueError,
  shoppingListsContextValueLoading,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import {
  ShoppingListsContext,
  ShoppingListsProvider,
} from '../../contexts/shoppingListsContext'
import ShoppingListCreateForm from './shoppingListCreateForm'

const renderWithContexts = (ui: ReactElement, url?: string) => {
  return renderAuthenticated(
    <PageProvider>
      <GamesContext.Provider value={gamesContextValue}>
        <ShoppingListsProvider>{ui}</ShoppingListsProvider>
      </GamesContext.Provider>
    </PageProvider>,
    url
  )
}

describe('ShoppingListCreateForm', () => {
  describe('displaying the form', () => {
    const mockServer = setupServer(getShoppingListsSuccess)

    beforeAll(() => mockServer.listen())
    beforeEach(() => mockServer.resetHandlers())
    afterAll(() => mockServer.close())

    test('has the correct form fields', () => {
      const wrapper = renderWithContexts(<ShoppingListCreateForm />)

      expect(wrapper).toBeTruthy()

      expect(wrapper.getByPlaceholderText('Title')).toBeTruthy()
      expect(wrapper.getByText('Create')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderWithContexts(<ShoppingListCreateForm />)

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('disabling behaviour', () => {
    test('is disabled when the shopping lists are loading', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <ShoppingListsContext.Provider
              value={shoppingListsContextValueLoading}
            >
              <ShoppingListCreateForm />
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes.getNamedItem('disabled')
      ).toBeTruthy()
      expect(
        wrapper.getByText('Create').attributes.getNamedItem('disabled')
      ).toBeTruthy()
    })

    test('is disabled when there is a shopping list loading error', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <ShoppingListsContext.Provider
              value={shoppingListsContextValueError}
            >
              <ShoppingListCreateForm />
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes.getNamedItem('disabled')
      ).toBeTruthy()
      expect(
        wrapper.getByText('Create').attributes.getNamedItem('disabled')
      ).toBeTruthy()
    })

    test('is disabled when games are loading', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValueLoading}>
            <ShoppingListsContext.Provider value={shoppingListsContextValue}>
              <ShoppingListCreateForm />
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes.getNamedItem('disabled')
      ).toBeTruthy()
      expect(
        wrapper.getByText('Create').attributes.getNamedItem('disabled')
      ).toBeTruthy()
    })

    test('is disabled when there is a game loading error', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValueError}>
            <ShoppingListsContext.Provider value={shoppingListsContextValue}>
              <ShoppingListCreateForm />
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes.getNamedItem('disabled')
      ).toBeTruthy()
      expect(
        wrapper.getByText('Create').attributes.getNamedItem('disabled')
      ).toBeTruthy()
    })

    test('is enabled when both games and shopping lists have loaded', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <ShoppingListsContext.Provider value={shoppingListsContextValue}>
              <ShoppingListCreateForm />
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes.getNamedItem('disabled')
      ).toBeFalsy()
      expect(
        wrapper.getByText('Create').attributes.getNamedItem('disabled')
      ).toBeFalsy()
    })
  })

  describe('submitting the form', () => {
    describe('when the form is enabled', () => {
      test('calls the createShoppingList function', () => {
        const createShoppingList = vitest.fn()
        const contextValue = {
          ...shoppingListsContextValue,
          createShoppingList,
        }

        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsContext.Provider value={contextValue}>
                <ShoppingListCreateForm />
              </ShoppingListsContext.Provider>
            </GamesContext.Provider>
          </PageProvider>
        )

        const input = wrapper.getByPlaceholderText('Title')
        const button = wrapper.getByText('Create')

        act(() => {
          fireEvent.change(input, { target: { value: 'New Shopping List' } })
          fireEvent.click(button)
        })

        expect(createShoppingList).toHaveBeenCalledWith(
          { title: 'New Shopping List' },
          expect.any(Function)
        )
      })
    })

    describe('when the form is disabled', () => {
      test("doesn't call the createShoppingList function", () => {
        const createShoppingList = vitest.fn()
        const contextValue = {
          ...shoppingListsContextValueLoading,
          createShoppingList,
        }

        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <ShoppingListsContext.Provider value={contextValue}>
                <ShoppingListCreateForm />
              </ShoppingListsContext.Provider>
            </GamesContext.Provider>
          </PageProvider>
        )

        const button = wrapper.getByText('Create')

        act(() => {
          fireEvent.click(button)
        })

        expect(createShoppingList).not.toHaveBeenCalled()
      })
    })
  })
})
