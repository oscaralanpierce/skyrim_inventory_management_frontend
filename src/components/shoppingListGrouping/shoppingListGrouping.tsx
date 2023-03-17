import colorSchemes from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import { useShoppingListsContext } from '../../hooks/contexts'
import ShoppingListItem from '../shoppingListItem/shoppingListItem'
import ShoppingList from '../shoppingList/shoppingList'
import styles from './shoppingListGrouping.module.css'

const ShoppingListGrouping = () => {
  const { shoppingLists } = useShoppingListsContext()

  if (!shoppingLists.length)
    return <p className={styles.noLists}>This game has no shopping lists.</p>

  return (
    <div className={styles.root}>
      {shoppingLists.map(({ id, title, list_items }, index) => {
        const colorIndex =
          index < colorSchemes.length ? index : index % colorSchemes.length
        const itemKey = title.toLowerCase().replace(' ', '-')

        return (
          <ColorProvider key={itemKey} colorScheme={colorSchemes[colorIndex]}>
            <div className={styles.shoppingList}>
              <ShoppingList listId={id} title={title}>
                {list_items.map(
                  ({ id, description, quantity, unit_weight, notes }) => {
                    return (
                      <ShoppingListItem
                        key={`${description
                          .toLowerCase()
                          .replace(' ', '-')}-${id}`}
                        itemId={id}
                        description={description}
                        quantity={quantity}
                        unitWeight={unit_weight}
                        notes={notes}
                      />
                    )
                  }
                )}
              </ShoppingList>
            </div>
          </ColorProvider>
        )
      })}
    </div>
  )
}

export default ShoppingListGrouping
