import { type Meta, type StoryObj } from '@storybook/react-vite'
import { playthroughsContextValue } from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext } from '../../contexts/playthroughsContext'
import PlaythroughCreateForm from './playthroughCreateForm'

type CreateFormStory = StoryObj<typeof PlaythroughCreateForm>

const meta: Meta<typeof PlaythroughCreateForm> = {
  title: 'PlaythroughCreateForm',
  component: PlaythroughCreateForm,
  decorators: [
    (Story) => (
      <PageProvider>
        <PlaythroughsContext value={playthroughsContextValue}>
          <Story />
        </PlaythroughsContext>
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
