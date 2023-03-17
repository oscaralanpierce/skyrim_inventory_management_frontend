import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import ShoppingListGrouping from './shoppingListGrouping'
import {
  gamesContextValue,
  shoppingListsContextValue,
  shoppingListsContextValueEmpty,
} from '../../support/data/contextValues'

export default { title: 'ShoppingListGrouping' }

export const WithShoppingLists = () => (
  <PageProvider>
    <GamesContext.Provider value={gamesContextValue}>
      <ShoppingListsContext.Provider value={shoppingListsContextValue}>
        <ShoppingListGrouping />
      </ShoppingListsContext.Provider>
    </GamesContext.Provider>
  </PageProvider>
)

export const WithoutShoppingLists = () => (
  <PageProvider>
    <GamesContext.Provider value={gamesContextValue}>
      <ShoppingListsContext.Provider value={shoppingListsContextValueEmpty}>
        <ShoppingListGrouping />
      </ShoppingListsContext.Provider>
    </GamesContext.Provider>
  </PageProvider>
)
