import { AQUA, BLUE, GREEN, PINK } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListItem from './shoppingListItem'

export default { title: 'ShoppingListItem' }

export const Default = () => (
  <ColorProvider colorScheme={AQUA}>
    <ShoppingListItem
      itemId={1}
      description="Dwarven metal ingot"
      quantity={5}
      unitWeight={1.0}
      notes="To make bolts"
    />
  </ColorProvider>
)

export const LongValues = () => (
  <ColorProvider colorScheme={BLUE}>
    <ShoppingListItem
      itemId={1}
      description="This item has a really really really really really long description for testing purposes"
      quantity={200000000000000000}
      unitWeight={4000000000000000.0}
      notes="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
    />
  </ColorProvider>
)

export const EmptyFields = () => (
  <ColorProvider colorScheme={GREEN}>
    <ShoppingListItem
      itemId={1}
      description="Dwarven metal ingot"
      quantity={5}
    />
  </ColorProvider>
)

export const UnitWeightWithDecimal = () => (
  <ColorProvider colorScheme={PINK}>
    <ShoppingListItem
      itemId={1}
      description="Necklace"
      quantity={1}
      unitWeight={0.3}
      notes="To enchant with fire resistance"
    />
  </ColorProvider>
)
