import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import { allGames, emptyGames } from '../../support/data/games'
import {
  loadingLoginContextValue,
  loginContextValue,
} from '../../support/data/contextValues'
import { internalServerErrorResponse } from '../../support/data/errors'
import { LoginContext } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { GamesProvider } from '../../contexts/gamesContext'
import GamesPage from './gamesPage'

type GamesPageStory = StoryObj<typeof GamesPage>

const GAMES_URI = '/api/games'

const meta: Meta<typeof GamesPage> = {
  title: 'GamesPage',
  component: GamesPage,
  decorators: [
    (Story, { parameters }) => (
      <BrowserRouter>
        <LoginContext.Provider value={parameters.loginContextValue}>
          <PageProvider>
            <GamesProvider>
              <Story />
            </GamesProvider>
          </PageProvider>
        </LoginContext.Provider>
      </BrowserRouter>
    ),
  ],
}

export default meta

export const NoGames: GamesPageStory = {
  parameters: {
    loginContextValue,
    mockData: [
      {
        url: GAMES_URI,
        method: 'GET',
        status: 200,
        response: emptyGames,
      },
    ],
  },
}

export const WithGamesHappy: GamesPageStory = {
  parameters: {
    loginContextValue,
    mockData: [
      {
        url: GAMES_URI,
        method: 'GET',
        status: 200,
        response: allGames,
      },
      {
        url: '/api/games/32',
        method: 'DELETE',
        status: 204,
        response: {},
      },
      {
        url: '/api/games/51',
        method: 'DELETE',
        status: 204,
        response: {},
      },
      {
        url: '/api/games/77',
        method: 'DELETE',
        status: 204,
        response: {},
      },
    ],
  },
}

export const AuthLoading: GamesPageStory = {
  parameters: {
    loginContextValue: loadingLoginContextValue,
  },
}

export const ServerError: GamesPageStory = {
  parameters: {
    loginContextValue,
    mockData: [
      {
        url: GAMES_URI,
        method: 'GET',
        status: 500,
        response: internalServerErrorResponse,
      },
    ],
  },
}
