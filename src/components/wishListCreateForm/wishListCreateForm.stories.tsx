import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  gamesContextValue,
  gamesContextValueLoading,
  wishListsContextValue,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { WishListsContext } from '../../contexts/wishListsContext'
import WishListCreateForm from './wishListCreateForm'

type CreateFormStory = StoryObj<typeof WishListCreateForm>

const meta: Meta<typeof WishListCreateForm> = {
  title: 'WishListCreateForm',
  component: WishListCreateForm,
  decorators: [
    (Story, { parameters }) => (
      <PageProvider>
        <GamesContext.Provider value={parameters.gamesContextValue}>
          <WishListsContext.Provider value={wishListsContextValue}>
            <Story />
          </WishListsContext.Provider>
        </GamesContext.Provider>
      </PageProvider>
    ),
  ],
}

export default meta

export const Enabled: CreateFormStory = {
  parameters: {
    gamesContextValue,
  },
}

export const Disabled: CreateFormStory = {
  parameters: {
    gamesContextValue: gamesContextValueLoading,
  },
}
