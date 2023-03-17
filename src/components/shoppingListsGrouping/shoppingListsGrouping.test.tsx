import { describe, test, expect } from 'vitest'
import { renderAuthenticated } from '../../support/testUtils'
import { gamesContextValue } from '../../support/data/contextValues'
import { shoppingListsContextValue } from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import ShoppingListsGrouping from './shoppingListsGrouping'

describe('ShoppingListsGrouping', () => {
  describe('when there are shopping lists', () => {
    test('displays each list', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <ShoppingListsContext.Provider value={shoppingListsContextValue}>
              <ShoppingListsGrouping />
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(wrapper).toBeTruthy()

      expect(wrapper.getByText('All Items')).toBeTruthy()
      expect(wrapper.getByText('Honeyside')).toBeTruthy()
      expect(wrapper.getByText('Breezehome')).toBeTruthy()
      expect(
        wrapper.getAllByText('This shopping list has no list items.').length
      ).toEqual(3)
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <ShoppingListsContext.Provider value={shoppingListsContextValue}>
              <ShoppingListsGrouping />
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})
