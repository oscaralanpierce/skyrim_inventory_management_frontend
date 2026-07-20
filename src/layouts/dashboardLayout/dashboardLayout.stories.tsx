import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import {
  playthroughsContextValue,
  playthroughsContextValueError,
  playthroughsContextValueLoading,
  loginContextValue,
} from '../../support/data/contextValues'
import { LoginContext } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext, type PlaythroughsContextType } from '../../contexts/playthroughsContext'
import DashboardLayout from './dashboardLayout'

type LayoutStory = StoryObj<typeof DashboardLayout>

const meta: Meta<typeof DashboardLayout> = {
  title: 'DashboardLayout',
  component: DashboardLayout,
  decorators: [
    (Story, { parameters }) => (
      <BrowserRouter>
        <LoginContext value={loginContextValue}>
          <PageProvider>
            <PlaythroughsContext value={parameters['playthroughsContextValue'] as PlaythroughsContextType}>
              <Story />
            </PlaythroughsContext>
          </PageProvider>
        </LoginContext>
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
    playthroughsContextValue,
  },
}

export const WithoutTitle: LayoutStory = {
  args: {},
  parameters: {
    playthroughsContextValue,
  },
}

export const WithTitleAndDropdown: LayoutStory = {
  args: {
    title: 'Page Title',
    includePlaythroughSelector: true,
  },
  parameters: {
    playthroughsContextValue,
  },
}

export const WithTitleAndDisabledDropdown: LayoutStory = {
  args: {
    title: 'Page Title',
    includePlaythroughSelector: true,
  },
  parameters: {
    playthroughsContextValue: playthroughsContextValueLoading,
  },
}

export const WithDropownOnly: LayoutStory = {
  args: {
    includePlaythroughSelector: true,
  },
  parameters: {
    playthroughsContextValue,
  },
}

export const WithDisabledDropdownOnly: LayoutStory = {
  args: {
    includePlaythroughSelector: true,
  },
  parameters: {
    playthroughsContextValue: playthroughsContextValueError,
  },
}
