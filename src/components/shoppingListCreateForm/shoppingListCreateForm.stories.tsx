import {
  gamesContextValue,
  shoppingListsContextValue,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import ShoppingListCreateForm from './shoppingListCreateForm'

export default { title: 'ShoppingListCreateForm' }

export const Enabled = () => (
  <PageProvider>
    <GamesContext.Provider value={gamesContextValue}>
      <ShoppingListsContext.Provider value={shoppingListsContextValue}>
        <ShoppingListCreateForm />
      </ShoppingListsContext.Provider>
    </GamesContext.Provider>
  </PageProvider>
)
