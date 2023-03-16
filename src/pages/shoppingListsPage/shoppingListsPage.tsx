import { type CSSProperties } from 'react'
import { PulseLoader } from 'react-spinners'
import { DONE, LOADING } from '../../utils/loadingStates'
import colorSchemes, { YELLOW } from '../../utils/colorSchemes'
import { useShoppingListsContext } from '../../hooks/contexts'
import { ColorProvider } from '../../contexts/colorContext'
import DashboardLayout from '../../layouts/dashboardLayout/dashboardLayout'
import ShoppingList from '../../components/shoppingList/shoppingList'
import styles from './shoppingListsPage.module.css'

const loaderStyles: CSSProperties = {
  textAlign: 'center',
}

const ShoppingListsPage = () => {
  const { shoppingListsLoadingState, shoppingLists } = useShoppingListsContext()

  return (
    <DashboardLayout title="Your Shopping Lists">
      <div>
        {shoppingListsLoadingState === LOADING && (
          <PulseLoader
            color={YELLOW.schemeColorDark}
            cssOverride={loaderStyles}
            data-testid="pulseLoader"
          />
        )}
        {shoppingListsLoadingState === DONE &&
          shoppingLists.length &&
          shoppingLists.map(({ id, title }, index) => {
            const colorsSchemesIndex =
              index < colorSchemes.length ? index : index % colorSchemes.length
            const colorScheme = colorSchemes[colorsSchemesIndex]
            const listKey = title.toLowerCase().replace(' ', '-')

            return (
              <ColorProvider key={listKey} colorScheme={colorScheme}>
                <div className={styles.shoppingList}>
                  <ShoppingList listId={id} title={title} />
                </div>
              </ColorProvider>
            )
          })}
      </div>
    </DashboardLayout>
  )
}

export default ShoppingListsPage
