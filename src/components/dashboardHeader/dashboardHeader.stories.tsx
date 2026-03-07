import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import { testUser } from '../../support/data/users'
import {
  loadingLoginContextValue,
  loginContextValue,
} from '../../support/data/contextValues'
import { LoginContext } from '../../contexts/loginContext'
import DashboardHeader from './dashboardHeader'

type HeaderStory = StoryObj<typeof DashboardHeader>

const meta: Meta<typeof DashboardHeader> = {
  title: 'DashboardHeader',
  component: DashboardHeader,
  decorators: [
    (Story, { parameters }) => (
      <BrowserRouter>
        <LoginContext.Provider value={parameters.loginContextValue}>
          <Story />
        </LoginContext.Provider>
      </BrowserRouter>
    ),
  ],
}

export default meta

export const Default: HeaderStory = {
  parameters: {
    loginContextValue,
  },
}

const userWithAnonymousAvatar = {
  ...testUser,
  photoURL: null,
}

export const WithAnonymousAvatar: HeaderStory = {
  parameters: {
    loginContextValue: { ...loginContextValue, user: userWithAnonymousAvatar },
  },
}

export const AuthLoading: HeaderStory = {
  parameters: {
    loginContextValue: loadingLoginContextValue,
  },
}
