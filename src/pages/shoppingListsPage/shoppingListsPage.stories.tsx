import { BrowserRouter } from 'react-router-dom'
import {
  gamesContextValue,
  shoppingListsContextValueLoading,
  shoppingListsContextValue,
  loginContextValue,
  shoppingListsContextValueEmpty,
} from '../../support/data/contextValues'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import { LoginContext } from '../../contexts/loginContext'
import { GamesContext } from '../../contexts/gamesContext'
import { PageProvider } from '../../contexts/pageContext'
import ShoppingListsPage from './shoppingListsPage'

export default { title: 'ShoppingListsPage' }

export const Loading = () => (
  <BrowserRouter>
    <PageProvider>
      <GamesContext.Provider value={gamesContextValue}>
        <ShoppingListsContext.Provider value={shoppingListsContextValueLoading}>
          <ShoppingListsPage />
        </ShoppingListsContext.Provider>
      </GamesContext.Provider>
    </PageProvider>
  </BrowserRouter>
)

export const WithShoppingLists = () => (
  <BrowserRouter>
    <LoginContext.Provider value={loginContextValue}>
      <PageProvider>
        <GamesContext.Provider value={gamesContextValue}>
          <ShoppingListsContext.Provider value={shoppingListsContextValue}>
            <ShoppingListsPage />
          </ShoppingListsContext.Provider>
        </GamesContext.Provider>
      </PageProvider>
    </LoginContext.Provider>
  </BrowserRouter>
)

export const NoShoppingLists = () => (
  <BrowserRouter>
    <LoginContext.Provider value={loginContextValue}>
      <PageProvider>
        <GamesContext.Provider value={gamesContextValue}>
          <ShoppingListsContext.Provider value={shoppingListsContextValueEmpty}>
            <ShoppingListsPage />
          </ShoppingListsContext.Provider>
        </GamesContext.Provider>
      </PageProvider>
    </LoginContext.Provider>
  </BrowserRouter>
)
