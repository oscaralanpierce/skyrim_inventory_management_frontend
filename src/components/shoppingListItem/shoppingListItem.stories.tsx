import { ReactElement } from 'react'
import {
  loginContextValue,
  gamesContextValue,
  shoppingListsContextValue,
} from '../../support/data/contextValues'
import { AQUA, BLUE, GREEN, PINK, YELLOW } from '../../utils/colorSchemes'
import { LoginContext } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListItem from './shoppingListItem'

interface ProviderProps {
  children: ReactElement
}

const ContextProviders = ({ children }: ProviderProps) => (
  <LoginContext.Provider value={loginContextValue}>
    <PageProvider>
      <GamesContext.Provider value={gamesContextValue}>
        <ShoppingListsContext.Provider value={shoppingListsContextValue}>
          {children}
        </ShoppingListsContext.Provider>
      </GamesContext.Provider>
    </PageProvider>
  </LoginContext.Provider>
)

export default { title: 'ShoppingListItem' }

export const Editable = () => (
  <ContextProviders>
    <ColorProvider colorScheme={AQUA}>
      <ShoppingListItem
        itemId={1}
        listTitle="Lakeview Manor"
        description="Dwarven metal ingot"
        quantity={5}
        unitWeight={1.0}
        notes="To make bolts"
        editable
      />
    </ColorProvider>
  </ContextProviders>
)

export const NotEditable = () => (
  <ContextProviders>
    <ColorProvider colorScheme={YELLOW}>
      <ShoppingListItem
        itemId={1}
        listTitle="All Items"
        description="Dwarven metal ingot"
        quantity={5}
        unitWeight={1.0}
        notes="To make bolts"
      />
    </ColorProvider>
  </ContextProviders>
)

export const LongValuesEditable = () => (
  <ContextProviders>
    <ColorProvider colorScheme={BLUE}>
      <ShoppingListItem
        itemId={1}
        listTitle="Building Materials"
        description="This item has a really really really really really long description for testing purposes"
        quantity={200000000000000000}
        unitWeight={4000000000000000.0}
        notes="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
        editable
      />
    </ColorProvider>
  </ContextProviders>
)

export const LongValuesNotEditable = () => (
  <ContextProviders>
    <ColorProvider colorScheme={AQUA}>
      <ShoppingListItem
        itemId={1}
        listTitle="All Items"
        description="This item has a really really really really really long description for testing purposes"
        quantity={200000000000000000}
        unitWeight={4000000000000000.0}
        notes="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
      />
    </ColorProvider>
  </ContextProviders>
)

export const EmptyFields = () => (
  <ContextProviders>
    <ColorProvider colorScheme={GREEN}>
      <ShoppingListItem
        itemId={1}
        listTitle="All Items"
        description="Dwarven metal ingot"
        quantity={5}
      />
    </ColorProvider>
  </ContextProviders>
)

export const UnitWeightWithDecimal = () => (
  <ContextProviders>
    <ColorProvider colorScheme={PINK}>
      <ShoppingListItem
        itemId={1}
        listTitle="All Items"
        description="Necklace"
        quantity={1}
        unitWeight={0.3}
        notes="To enchant with fire resistance"
      />
    </ColorProvider>
  </ContextProviders>
)
