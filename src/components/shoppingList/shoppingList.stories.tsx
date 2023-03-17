import { PINK, YELLOW } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListItem from '../shoppingListItem/shoppingListItem'
import ShoppingList from './shoppingList'

export default { title: 'ShoppingList' }

export const NoListItems = () => (
  <ColorProvider colorScheme={PINK}>
    <ShoppingList listId={32} title="Proudspire Manor" />
  </ColorProvider>
)

export const WithListItems = () => (
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
)
