import { useEffect, CSSProperties } from 'react'
import { PulseLoader } from 'react-spinners'
import { type RelativePath } from '../../types/navigation'
import { YELLOW, PINK, BLUE, GREEN, AQUA } from '../../utils/colorSchemes'
import { useGoogleLogin } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout/dashboardLayout'
import NavigationMosaic from '../../components/navigationMosaic/navigationMosaic'
import paths from '../../routing/paths'
import styles from './dashboardPage.module.css'

const PLACEHOLDER_HREF: RelativePath = '#'

const navigationCards = [
  {
    colorScheme: YELLOW,
    href: paths.dashboard.playthroughs,
    children: 'Your Playthroughs',
    key: 'playthroughs',
  },
  {
    colorScheme: PINK,
    href: paths.dashboard.wishLists,
    children: 'Your Wish Lists',
    key: 'wish-lists',
  },
  {
    colorScheme: BLUE,
    href: paths.dashboard.inventory,
    children: 'Your Inventory',
    key: 'inventory',
  },
  {
    colorScheme: GREEN,
    href: PLACEHOLDER_HREF,
    children: 'Nav Link 4',
    key: 'nav-link-4',
  },
  {
    colorScheme: AQUA,
    href: PLACEHOLDER_HREF,
    children: 'Nav Link 5',
    key: 'nav-link-5',
  },
]

const loaderStyles: CSSProperties = {
  textAlign: 'center',
}

const DashboardPage = () => {
  const { authLoading, requireLogin } = useGoogleLogin()

  useEffect(() => {
    requireLogin()
  }, [requireLogin])

  return (
    <DashboardLayout>
      <div className={styles.root}>
        {authLoading ? (
          <PulseLoader
            color={YELLOW.schemeColorDark}
            cssOverride={loaderStyles}
            data-testid="pulseLoader"
          />
        ) : (
          <NavigationMosaic cardArray={navigationCards} />
        )}
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
