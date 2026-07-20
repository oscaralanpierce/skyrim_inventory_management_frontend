import { type ReactElement } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { type RelativePath } from '../types/navigation'
import { LoginProvider } from '../contexts/loginContext'
import { PlaythroughsProvider } from '../contexts/playthroughsContext'
import { PageProvider } from '../contexts/pageContext'
import { WishListsProvider } from '../contexts/wishListsContext'
import HomePage from '../pages/homePage/homePage'
import NotFoundPage from '../pages/notFoundPage/notFoundPage'
import DashboardPage from '../pages/dashboardPage/dashboardPage'
import PlaythroughsPage from '../pages/playthroughsPage/playthroughsPage'
import WishListsPage from '../pages/wishListsPage/wishListsPage'
import paths from './paths'

const siteTitle = 'Skyrim Inventory Management |'

interface BasePage {
  title: string
  description: string
  jsx: ReactElement
}

interface Page extends BasePage {
  pageId: string
  path: RelativePath
}

const notFoundPage: BasePage = {
  title: '404 Not Found',
  description: 'Page Not Found',
  jsx: <NotFoundPage />,
}

const pages: Page[] = [
  {
    pageId: 'home',
    title: `${siteTitle} Home`,
    description: 'Manage your inventory across multiple properties in Skyrim',
    jsx: <HomePage />,
    path: paths.home,
  },
  {
    pageId: 'dashboard-main',
    title: `${siteTitle} Dashboard`,
    description: 'Skyrim Inventory Management User Dashboard',
    jsx: (
      <PageProvider>
        <PlaythroughsProvider>
          <DashboardPage />
        </PlaythroughsProvider>
      </PageProvider>
    ),
    path: paths.dashboard.main,
  },
  {
    pageId: 'dashboard-playthroughs',
    title: `${siteTitle} Your Playthroughs`,
    description: 'Manage Skyrim Playthroughs',
    jsx: (
      <PageProvider>
        <PlaythroughsProvider>
          <PlaythroughsPage />
        </PlaythroughsProvider>
      </PageProvider>
    ),
    path: paths.dashboard.playthroughs,
  },
  {
    pageId: 'dashboard-wish-lists',
    title: `${siteTitle} Wish Lists`,
    description: 'Manage your wish lists',
    jsx: (
      <PageProvider>
        <PlaythroughsProvider>
          <WishListsProvider>
            <WishListsPage />
          </WishListsProvider>
        </PlaythroughsProvider>
      </PageProvider>
    ),
    path: paths.dashboard.wishLists,
  },
]

const RouteContent = ({ title, description, jsx }: BasePage) => (
  <>
    <Helmet>
      <html lang="en" />

      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    {jsx}
  </>
)

const PageRoutes = () => (
  <LoginProvider>
    <Routes>
      <Route
        path="*"
        key="notFound"
        element={<RouteContent {...notFoundPage} />}
      />
      {pages.map(({ pageId, title, description, jsx, path }: Page) => {
        return (
          <Route
            path={path}
            key={pageId}
            element={
              <RouteContent title={title} description={description} jsx={jsx} />
            }
          />
        )
      })}
    </Routes>
  </LoginProvider>
)

export default PageRoutes
