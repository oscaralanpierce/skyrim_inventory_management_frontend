import { type CSSProperties } from 'react'
import { PulseLoader } from 'react-spinners'
import { DONE, LOADING } from '../../utils/loadingStates'
import { YELLOW } from '../../utils/colorSchemes'
import { useWishListsContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout/dashboardLayout'
import WishListGrouping from '../../components/wishListGrouping/wishListGrouping'
import WishListCreateForm from '../../components/wishListCreateForm/wishListCreateForm'

const loaderStyles: CSSProperties = {
  textAlign: 'center',
}

const WishListsPage = () => {
  const { wishListsLoadingState } = useWishListsContext()

  return (
    <DashboardLayout title="Your Wish Lists" includePlaythroughSelector>
      <>
        <WishListCreateForm />
        {wishListsLoadingState === LOADING && (
          <PulseLoader
            color={YELLOW.schemeColorDark}
            cssOverride={loaderStyles}
            data-testid="pulseLoader"
          />
        )}
        {wishListsLoadingState === DONE && <WishListGrouping />}
      </>
    </DashboardLayout>
  )
}

export default WishListsPage
