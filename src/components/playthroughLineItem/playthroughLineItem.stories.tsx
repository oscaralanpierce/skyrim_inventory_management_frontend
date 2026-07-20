import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  loginContextValue,
  playthroughsContextValue,
} from '../../support/data/contextValues'
import { PlaythroughsContext } from '../../contexts/playthroughsContext'
import { PageProvider } from '../../contexts/pageContext'
import { LoginContext } from '../../contexts/loginContext'
import PlaythroughLineItem from './playthroughLineItem'

type LineItemStory = StoryObj<typeof PlaythroughLineItem>

const meta: Meta<typeof PlaythroughLineItem> = {
  title: 'PlaythroughLineItem',
  component: PlaythroughLineItem,
  decorators: [
    (Story) => (
      <LoginContext value={loginContextValue}>
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <Story />
          </PlaythroughsContext>
        </PageProvider>
      </LoginContext>
    ),
  ],
}

export default meta

export const WithDescription: LineItemStory = {
  args: {
    playthroughId: 4,
    name: 'My Playthrough 1',
    description: 'This is a custom description created by the user.',
  },
}

export const WithLongDescription: LineItemStory = {
  args: {
    playthroughId: 4,
    name: 'De finibus bonorum et malorum',
    description:
      'Cum audissem Antiochum, Brute, ut solebam, cum M. Pisone in eo gymnasio, quod Ptolomaeum vocatur, unaque nobiscum Q. frater et T. Pomponius postmeridianam conficeremus in Academia',
  },
}

export const NoDescription: LineItemStory = {
  args: {
    playthroughId: 4,
    name: 'This playthrough has a really really really really really long name for testing purposes',
    description: null,
  },
}
