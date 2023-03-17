import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import ShoppingListsGrouping from './shoppingListsGrouping'
import {
  gamesContextValue,
  shoppingListsContextValue,
  shoppingListsContextValueEmpty,
} from '../../support/data/contextValues'

export default { title: 'ShoppingListsGrouping' }

export const WithShoppingLists = () => (
  <PageProvider>
    <GamesContext.Provider value={gamesContextValue}>
      <ShoppingListsContext.Provider value={shoppingListsContextValue}>
        <ShoppingListsGrouping />
      </ShoppingListsContext.Provider>
    </GamesContext.Provider>
  </PageProvider>
)

export const WithoutShoppingLists = () => (
  <PageProvider>
    <GamesContext.Provider value={gamesContextValue}>
      <ShoppingListsContext.Provider value={shoppingListsContextValueEmpty}>
        <ShoppingListsGrouping />
      </ShoppingListsContext.Provider>
    </GamesContext.Provider>
  </PageProvider>
)
