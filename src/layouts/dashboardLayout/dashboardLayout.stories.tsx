import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import {
  gamesContextValue,
  gamesContextValueError,
  gamesContextValueLoading,
  loginContextValue,
} from '../../support/data/contextValues'
import { LoginContext } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext, type GamesContextType } from '../../contexts/gamesContext'
import DashboardLayout from './dashboardLayout'

type LayoutStory = StoryObj<typeof DashboardLayout>

const meta: Meta<typeof DashboardLayout> = {
  title: 'DashboardLayout',
  component: DashboardLayout,
  decorators: [
    (Story, { parameters }) => (
      <BrowserRouter>
        <LoginContext.Provider value={loginContextValue}>
          <PageProvider>
            <GamesContext.Provider value={parameters['gamesContextValue'] as GamesContextType}>
              <Story />
            </GamesContext.Provider>
          </PageProvider>
        </LoginContext.Provider>
      </BrowserRouter>
    ),
  ],
}

export default meta

export const WithTitle: LayoutStory = {
  args: {
    title: 'Page Title',
  },
  parameters: {
    gamesContextValue,
  },
}

export const WithoutTitle: LayoutStory = {
  args: {},
  parameters: {
    gamesContextValue,
  },
}

export const WithTitleAndDropdown: LayoutStory = {
  args: {
    title: 'Page Title',
    includeGameSelector: true,
  },
  parameters: {
    gamesContextValue,
  },
}

export const WithTitleAndDisabledDropdown: LayoutStory = {
  args: {
    title: 'Page Title',
    includeGameSelector: true,
  },
  parameters: {
    gamesContextValue: gamesContextValueLoading,
  },
}

export const WithDropownOnly: LayoutStory = {
  args: {
    includeGameSelector: true,
  },
  parameters: {
    gamesContextValue,
  },
}

export const WithDisabledDropdownOnly: LayoutStory = {
  args: {
    includeGameSelector: true,
  },
  parameters: {
    gamesContextValue: gamesContextValueError,
  },
}
