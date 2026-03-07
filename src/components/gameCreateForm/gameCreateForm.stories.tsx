import { type Meta, type StoryObj } from '@storybook/react-vite'
import { gamesContextValue } from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import GameCreateForm from './gameCreateForm'

type CreateFormStory = StoryObj<typeof GameCreateForm>

const meta: Meta<typeof GameCreateForm> = {
  title: 'GameCreateForm',
  component: GameCreateForm,
  decorators: [
    (Story) => (
      <PageProvider>
        <GamesContext.Provider value={gamesContextValue}>
          <Story />
        </GamesContext.Provider>
      </PageProvider>
    ),
  ],
}

export default meta

export const Default: CreateFormStory = {}

export const Disabled: CreateFormStory = {
  args: {
    disabled: true,
  },
}
