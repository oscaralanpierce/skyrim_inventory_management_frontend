import { PINK } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingList from './shoppingList'

export default { title: 'ShoppingList' }

export const Default = () => (
  <ColorProvider colorScheme={PINK}>
    <ShoppingList listId={32} title="Proudspire Manor" />
  </ColorProvider>
)
