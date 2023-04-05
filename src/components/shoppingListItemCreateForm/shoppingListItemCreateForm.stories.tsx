import {
  gamesContextValue,
  loginContextValue,
  shoppingListsContextValue,
} from '../../support/data/contextValues'
import { BLUE } from '../../utils/colorSchemes'
import { LoginContext } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListItemCreateForm from './shoppingListItemCreateForm'

export default { title: 'ShoppingListItemCreateForm' }

export const Default = () => (
  <LoginContext.Provider value={loginContextValue}>
    <PageProvider>
      <GamesContext.Provider value={gamesContextValue}>
        <ShoppingListsContext.Provider value={shoppingListsContextValue}>
          <ColorProvider colorScheme={BLUE}>
            <ShoppingListItemCreateForm listId={4} />
          </ColorProvider>
        </ShoppingListsContext.Provider>
      </GamesContext.Provider>
    </PageProvider>
  </LoginContext.Provider>
)
