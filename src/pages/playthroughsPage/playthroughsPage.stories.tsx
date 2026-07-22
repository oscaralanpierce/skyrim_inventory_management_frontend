import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import {
  loadingLoginContextValue,
  loginContextValue,
  playthroughsContextValue,
  playthroughsContextValueEmpty,
  playthroughsContextValueError,
  playthroughsContextValueLoading,
} from '../../support/data/contextValues'
import { LoginContext, type LoginContextType } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContextType, PlaythroughsContext } from '../../contexts/playthroughsContext'
import PlaythroughsPage from './playthroughsPage'

type PlaythroughsPageStory = StoryObj<typeof PlaythroughsPage>

const meta: Meta<typeof PlaythroughsPage> = {
  title: 'PlaythroughsPage',
  component: PlaythroughsPage,
  decorators: [
    (Story, { parameters }) => (
      <BrowserRouter>
        <LoginContext value={parameters['loginContextValue'] as LoginContextType}>
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

export const NoPlaythroughs: PlaythroughsPageStory = {
  parameters: {
    loginContextValue,
    playthroughsContextValue: playthroughsContextValueEmpty,
  },
}

export const WithPlaythroughsHappy: PlaythroughsPageStory = {
  parameters: {
    loginContextValue,
    playthroughsContextValue,
  },
}

export const AuthLoading: PlaythroughsPageStory = {
  parameters: {
    loginContextValue: loadingLoginContextValue,
    playthroughsContextValue: playthroughsContextValueLoading,
  },
}

export const ServerError: PlaythroughsPageStory = {
  parameters: {
    loginContextValue,
    playthroughsContextValue: playthroughsContextValueError,
  },
}
