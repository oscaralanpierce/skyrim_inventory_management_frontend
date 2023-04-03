import {
  gamesContextValue,
  shoppingListsContextValue,
} from '../../support/data/contextValues'
import { GREEN } from '../../utils/colorSchemes'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import ShoppingListItemEditForm from './shoppingListItemEditForm'

export default { title: 'ShoppingListItemEditForm' }

export const Default = () => (
  <PageProvider>
    <GamesContext.Provider value={gamesContextValue}>
      <ShoppingListsContext.Provider value={shoppingListsContextValue}>
        <ShoppingListItemEditForm
          itemId={6}
          description="Health potion ingredients"
          listTitle="Alchemy Ingredients"
          quantity={5}
          unitWeight={0.1}
          notes={null}
          buttonColor={GREEN}
        />
      </ShoppingListsContext.Provider>
    </GamesContext.Provider>
  </PageProvider>
)
