import { BrowserRouter } from 'react-router-dom'
import {
  gamesContextValue,
  shoppingListsContextValueLoading,
  loginContextValue,
  shoppingListsContextValueEmpty,
} from '../../support/data/contextValues'
import { shoppingListsForGame } from '../../support/data/shoppingLists'
import {
  ShoppingListsContext,
  ShoppingListsProvider,
} from '../../contexts/shoppingListsContext'
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
          <ShoppingListsProvider>
            <ShoppingListsPage />
          </ShoppingListsProvider>
        </GamesContext.Provider>
      </PageProvider>
    </LoginContext.Provider>
  </BrowserRouter>
)

WithShoppingLists.parameters = {
  mockData: [
    {
      url: '/api/games/32/shopping_lists',
      method: 'GET',
      status: 200,
      response: shoppingListsForGame(32),
    },
  ],
}

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
