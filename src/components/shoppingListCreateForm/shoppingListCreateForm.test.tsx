import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { type ReactElement } from 'react'
import { setupServer } from 'msw/node'
import { renderAuthenticated } from '../../support/testUtils'
import { getShoppingListsSuccess } from '../../support/msw/shoppingLists'
import { gamesContextValue } from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
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
    test('is disabled when the shopping lists are loading')

    test('is disabled when there is a shopping list loading error')

    test('is disabled when games are loading')

    test('is disabled when there is a game loading error')

    test('is disabled when both games and shopping lists have loaded')
  })
})
