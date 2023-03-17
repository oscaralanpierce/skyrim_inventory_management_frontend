import { describe, test, expect } from 'vitest'
import { renderAuthenticated } from '../../support/testUtils'
import {
  gamesContextValue,
  shoppingListsContextValueEmpty,
} from '../../support/data/contextValues'
import { shoppingListsContextValue } from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import ShoppingListGrouping from './shoppingListGrouping'

describe('ShoppingListGrouping', () => {
  describe('when there are shopping lists', () => {
    test('displays each list', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <ShoppingListsContext.Provider value={shoppingListsContextValue}>
              <ShoppingListGrouping />
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(wrapper).toBeTruthy()

      expect(wrapper.getByText('All Items')).toBeTruthy()
      expect(wrapper.getByText('Honeyside')).toBeTruthy()
      expect(wrapper.getByText('Breezehome')).toBeTruthy()

      // There should be list items on each list
      expect(wrapper.getAllByText('Dwarven Cog').length).toEqual(3)
      expect(
        wrapper.getAllByText(
          'This item has a really really really really really long description for testing purposes'
        ).length
      ).toEqual(2)
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <ShoppingListsContext.Provider value={shoppingListsContextValue}>
              <ShoppingListGrouping />
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when there are no shopping lists', () => {
    test('displays a message that there are no lists for this game', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <ShoppingListsContext.Provider
              value={shoppingListsContextValueEmpty}
            >
              <ShoppingListGrouping />
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(wrapper.getByText('This game has no shopping lists.')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <ShoppingListsContext.Provider
              value={shoppingListsContextValueEmpty}
            >
              <ShoppingListGrouping />
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})
