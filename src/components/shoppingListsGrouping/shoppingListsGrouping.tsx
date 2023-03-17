import colorSchemes from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import { useShoppingListsContext } from '../../hooks/contexts'
import ShoppingList from '../shoppingList/shoppingList'
import styles from './shoppingListsGrouping.module.css'

const ShoppingListsGrouping = () => {
  const { shoppingLists } = useShoppingListsContext()

  if (!shoppingLists.length)
    return <p className={styles.noLists}>This game has no shopping lists.</p>

  return (
    <div className={styles.root}>
      {shoppingLists.map(({ id, title }, index) => {
        const colorIndex =
          index < colorSchemes.length ? index : index % colorSchemes.length
        const itemKey = title.toLowerCase().replace(' ', '-')

        return (
          <ColorProvider key={itemKey} colorScheme={colorSchemes[colorIndex]}>
            <div className={styles.shoppingList}>
              <ShoppingList listId={id} title={title} />
            </div>
          </ColorProvider>
        )
      })}
    </div>
  )
}

export default ShoppingListsGrouping
