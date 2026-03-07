import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  loginContextValue,
  gamesContextValue,
} from '../../support/data/contextValues'
import { GamesContext } from '../../contexts/gamesContext'
import { PageProvider } from '../../contexts/pageContext'
import { LoginContext } from '../../contexts/loginContext'
import GameLineItem from './gameLineItem'

type LineItemStory = StoryObj<typeof GameLineItem>

const meta: Meta<typeof GameLineItem> = {
  title: 'GameLineItem',
  component: GameLineItem,
  decorators: [
    (Story) => (
      <LoginContext.Provider value={loginContextValue}>
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <Story />
          </GamesContext.Provider>
        </PageProvider>
      </LoginContext.Provider>
    ),
  ],
}

export default meta

export const WithDescription: LineItemStory = {
  args: {
    gameId: 4,
    name: 'My Game 1',
    description: 'This is a custom description created by the user.',
  },
}

export const WithLongDescription: LineItemStory = {
  args: {
    gameId: 4,
    name: 'De finibus bonorum et malorum',
    description:
      'Cum audissem Antiochum, Brute, ut solebam, cum M. Pisone in eo gymnasio, quod Ptolomaeum vocatur, unaque nobiscum Q. frater et T. Pomponius postmeridianam conficeremus in Academia',
  },
}

export const NoDescription: LineItemStory = {
  args: {
    gameId: 4,
    name: 'This game has a really really really really really long name for testing purposes',
    description: null,
  },
}
