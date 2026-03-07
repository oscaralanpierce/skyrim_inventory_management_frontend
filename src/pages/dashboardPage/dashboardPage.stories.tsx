import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import { LoginContext } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import {
  loadingLoginContextValue,
  loginContextValue,
} from '../../support/data/contextValues'
import DashboardPage from './dashboardPage'

type DashboardStory = StoryObj<typeof DashboardPage>

const meta: Meta<typeof DashboardPage> = {
  title: 'DashboardPage',
  component: DashboardPage,
  decorators: [
    (Story, { parameters }) => (
      <BrowserRouter>
        <LoginContext.Provider value={parameters.loginContextValue}>
          <PageProvider>
            <Story />
          </PageProvider>
        </LoginContext.Provider>
      </BrowserRouter>
    ),
  ],
}

export default meta

export const Default: DashboardStory = {
  parameters: {
    loginContextValue,
  },
}

export const AuthLoading: DashboardStory = {
  parameters: {
    loginContextValue: loadingLoginContextValue,
  },
}
