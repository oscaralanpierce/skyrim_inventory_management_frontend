import { type ReactElement } from 'react'
import { PINK, YELLOW, AQUA, GREEN } from '../../utils/colorSchemes'
import { BrowserRouter } from 'react-router-dom'
import {
  gamesContextValue,
  loginContextValue,
  shoppingListsContextValue,
} from '../../support/data/contextValues'
import { LoginContext } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListItem from '../shoppingListItem/shoppingListItem'
import ShoppingList from './shoppingList'

interface Props {
  children: ReactElement | ReactElement[]
}

const Providers = ({ children }: Props) => (
  <BrowserRouter>
    <LoginContext.Provider value={loginContextValue}>
      <PageProvider>
        <GamesContext.Provider value={gamesContextValue}>
          <ShoppingListsContext.Provider value={shoppingListsContextValue}>
            {children}
          </ShoppingListsContext.Provider>
        </GamesContext.Provider>
      </PageProvider>
    </LoginContext.Provider>
  </BrowserRouter>
)

export default { title: 'ShoppingList' }

export const EditableNoListItems = () => (
  <Providers>
    <ColorProvider colorScheme={AQUA}>
      <ShoppingList listId={32} title="Proudspire Manor" canEdit />
    </ColorProvider>
  </Providers>
)

export const EditableWithListItems = () => (
  <Providers>
    <ColorProvider colorScheme={GREEN}>
      <ShoppingList listId={32} title="Proudspire Manor" canEdit>
        <ShoppingListItem
          itemId={1}
          description="Steel Ingot"
          quantity={5}
          unitWeight={1.0}
        />
        <ShoppingListItem
          itemId={2}
          description="This item has a really really really really really long description for testing purposes"
          quantity={200000000000}
          unitWeight={400000000000}
          notes="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet velit adipsci"
        />
      </ShoppingList>
    </ColorProvider>
  </Providers>
)

export const NotEditableNoListItems = () => (
  <Providers>
    <ColorProvider colorScheme={PINK}>
      <ShoppingList listId={32} title="Proudspire Manor" />
    </ColorProvider>
  </Providers>
)

export const NotEditableWithListItems = () => (
  <Providers>
    <ColorProvider colorScheme={YELLOW}>
      <ShoppingList listId={32} title="Proudspire Manor">
        <ShoppingListItem
          itemId={1}
          description="Steel Ingot"
          quantity={5}
          unitWeight={1.0}
        />
        <ShoppingListItem
          itemId={2}
          description="This item has a really really really really really long description for testing purposes"
          quantity={200000000000}
          unitWeight={400000000000}
          notes="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet velit adipsci"
        />
      </ShoppingList>
    </ColorProvider>
  </Providers>
)
