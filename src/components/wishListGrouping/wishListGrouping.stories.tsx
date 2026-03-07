import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  gamesContextValue,
  gamesContextValueEmpty,
  wishListsContextValue,
  wishListsContextValueEmpty,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { WishListsContext } from '../../contexts/wishListsContext'
import WishListGrouping from './wishListGrouping'

type GroupingStory = StoryObj<typeof WishListGrouping>

const meta: Meta<typeof WishListGrouping> = {
  title: 'WishListGrouping',
  component: WishListGrouping,
  decorators: [
    (Story, { parameters }) => (
      <PageProvider>
        <GamesContext.Provider value={parameters.gamesContextValue}>
          <WishListsContext.Provider
            value={parameters.wishListsContextValue}
          >
            <Story />
          </WishListsContext.Provider>
        </GamesContext.Provider>
      </PageProvider>
    ),
  ],
}

export default meta

export const WithWishLists: GroupingStory = {
  parameters: {
    gamesContextValue,
    wishListsContextValue,
  },
}

export const WithoutWishLists: GroupingStory = {
  parameters: {
    gamesContextValue,
    wishListsContextValue: wishListsContextValueEmpty,
  },
}

export const NoGames: GroupingStory = {
  parameters: {
    gamesContextValue: gamesContextValueEmpty,
    wishListsContextValue,
  },
}
