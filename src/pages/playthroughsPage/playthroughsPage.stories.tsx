import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import {
  loadingLoginContextValue,
  loginContextValue,
} from '../../support/data/contextValues'
import {
  getPlaythroughsEmptySuccess,
  getPlaythroughsAllSuccess,
  getPlaythroughsServerError,
} from '../../support/msw/handlers'
import { LoginContext, type LoginContextType } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsProvider } from '../../contexts/playthroughsContext'
import PlaythroughsPage from './playthroughsPage'

type PlaythroughsPageStory = StoryObj<typeof PlaythroughsPage>

const PLAYTHROUGHS_URI = '/api/playthroughs'

const meta: Meta<typeof PlaythroughsPage> = {
  title: 'PlaythroughsPage',
  component: PlaythroughsPage,
  decorators: [
    (Story, { parameters }) => (
      <BrowserRouter>
        <LoginContext value={parameters['loginContextValue'] as LoginContextType}>
          <PageProvider>
            <PlaythroughsProvider>
              <Story />
            </PlaythroughsProvider>
          </PageProvider>
        </LoginContext>
      </BrowserRouter>
    ),
  ],
}

export default meta

export const NoPlaythroughs: PlaythroughsPageStory = {
  parameters: {
    loginContextValue,
    msw: {
      handlers: [getPlaythroughsEmptySuccess]
    }
  },
}

export const WithPlaythroughsHappy: PlaythroughsPageStory = {
  parameters: {
    loginContextValue,
    msw: {
      handlers: [getPlaythroughsAllSuccess]
    }
  },
}

export const AuthLoading: PlaythroughsPageStory = {
  parameters: {
    loginContextValue: loadingLoginContextValue,
  },
}

export const ServerError: PlaythroughsPageStory = {
  parameters: {
    loginContextValue,
    msw: {
      handlers: [getPlaythroughsServerError]
    }
  },
}
