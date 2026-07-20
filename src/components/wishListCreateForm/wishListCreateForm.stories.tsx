import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  playthroughsContextValue,
  playthroughsContextValueLoading,
  wishListsContextValue,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext, type PlaythroughsContextType } from '../../contexts/playthroughsContext'
import { WishListsContext } from '../../contexts/wishListsContext'
import WishListCreateForm from './wishListCreateForm'

type CreateFormStory = StoryObj<typeof WishListCreateForm>

const meta: Meta<typeof WishListCreateForm> = {
  title: 'WishListCreateForm',
  component: WishListCreateForm,
  decorators: [
    (Story, { parameters }) => (
      <PageProvider>
        <PlaythroughsContext value={parameters['playthroughsContextValue'] as PlaythroughsContextType}>
          <WishListsContext value={wishListsContextValue}>
            <Story />
          </WishListsContext>
        </PlaythroughsContext>
      </PageProvider>
    ),
  ],
}

export default meta

export const Enabled: CreateFormStory = {
  parameters: {
    playthroughsContextValue,
  },
}

export const Disabled: CreateFormStory = {
  parameters: {
    playthroughsContextValue: playthroughsContextValueLoading,
  },
}
