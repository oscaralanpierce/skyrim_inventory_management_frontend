import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import { allPlaythroughs, emptyPlaythroughs } from '../../support/data/playthroughs'
import {
  loadingLoginContextValue,
  loginContextValue,
} from '../../support/data/contextValues'
import { internalServerErrorResponse } from '../../support/data/errors'
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
    mockData: [
      {
        url: PLAYTHROUGHS_URI,
        method: 'GET',
        status: 200,
        response: emptyPlaythroughs,
      },
    ],
  },
}

export const WithPlaythroughsHappy: PlaythroughsPageStory = {
  parameters: {
    loginContextValue,
    mockData: [
      {
        url: PLAYTHROUGHS_URI,
        method: 'GET',
        status: 200,
        response: allPlaythroughs,
      },
      {
        url: '/api/playthroughs/32',
        method: 'DELETE',
        status: 204,
        response: {},
      },
      {
        url: '/api/playthroughs/51',
        method: 'DELETE',
        status: 204,
        response: {},
      },
      {
        url: '/api/playthroughs/77',
        method: 'DELETE',
        status: 204,
        response: {},
      },
    ],
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
    mockData: [
      {
        url: PLAYTHROUGHS_URI,
        method: 'GET',
        status: 500,
        response: internalServerErrorResponse,
      },
    ],
  },
}
