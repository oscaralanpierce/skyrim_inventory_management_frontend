import { BrowserRouter } from 'react-router-dom'
import {
  gamesContextValue,
  loginContextValue,
} from '../../support/data/contextValues'
import { LoginContext } from '../../contexts/loginContext'
import DashboardLayout from './dashboardLayout'
import { GamesContext } from '../../contexts/gamesContext'

export default { title: 'DashboardLayout' }

export const WithTitle = () => (
  <BrowserRouter>
    <LoginContext.Provider value={loginContextValue}>
      <GamesContext.Provider value={gamesContextValue}>
        <DashboardLayout title="Page Title">Hello World</DashboardLayout>
      </GamesContext.Provider>
    </LoginContext.Provider>
  </BrowserRouter>
)

export const WithoutTitle = () => (
  <BrowserRouter>
    <LoginContext.Provider value={loginContextValue}>
      <GamesContext.Provider value={gamesContextValue}>
        <DashboardLayout>Hello World</DashboardLayout>
      </GamesContext.Provider>
    </LoginContext.Provider>
  </BrowserRouter>
)

export const WithTitleAndDropdown = () => (
  <BrowserRouter>
    <LoginContext.Provider value={loginContextValue}>
      <GamesContext.Provider value={gamesContextValue}>
        <DashboardLayout title="Page Title" includeGameSelector>
          Hello World
        </DashboardLayout>
      </GamesContext.Provider>
    </LoginContext.Provider>
  </BrowserRouter>
)

export const WithDropdownOnly = () => (
  <BrowserRouter>
    <LoginContext.Provider value={loginContextValue}>
      <GamesContext.Provider value={gamesContextValue}>
        <DashboardLayout includeGameSelector>Hello World</DashboardLayout>
      </GamesContext.Provider>
    </LoginContext.Provider>
  </BrowserRouter>
)
