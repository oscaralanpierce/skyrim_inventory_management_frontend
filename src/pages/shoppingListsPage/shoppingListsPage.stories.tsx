import { BrowserRouter } from 'react-router-dom'
import { shoppingListContextValueLoading } from '../../support/data/contextValues'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import ShoppingListsPage from './shoppingListsPage'

export default { title: 'ShoppingListsPage' }

export const Loading = () => (
  <BrowserRouter>
    <ShoppingListsContext.Provider value={shoppingListContextValueLoading}>
      <ShoppingListsPage />
    </ShoppingListsContext.Provider>
  </BrowserRouter>
)
