import { type CSSProperties } from 'react'
import { PulseLoader } from 'react-spinners'
import { LOADING } from '../../utils/loadingStates'
import { useShoppingListsContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout/dashboardLayout'
import { YELLOW } from '../../utils/colorSchemes'

const loaderStyles: CSSProperties = {
  textAlign: 'center',
}

const ShoppingListsPage = () => {
  const { shoppingListsLoadingState } = useShoppingListsContext()

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
      </div>
    </DashboardLayout>
  )
}

export default ShoppingListsPage
