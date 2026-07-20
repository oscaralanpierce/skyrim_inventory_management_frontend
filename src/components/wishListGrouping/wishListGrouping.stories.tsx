import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  playthroughsContextValue,
  playthroughsContextValueEmpty,
  wishListsContextValue,
  wishListsContextValueEmpty,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext, type PlaythroughsContextType } from '../../contexts/playthroughsContext'
import { WishListsContext, type WishListsContextType } from '../../contexts/wishListsContext'
import WishListGrouping from './wishListGrouping'

type GroupingStory = StoryObj<typeof WishListGrouping>

const meta: Meta<typeof WishListGrouping> = {
  title: 'WishListGrouping',
  component: WishListGrouping,
  decorators: [
    (Story, { parameters }) => (
      <PageProvider>
        <PlaythroughsContext value={parameters['playthroughsContextValue'] as PlaythroughsContextType}>
          <WishListsContext
            value={parameters['wishListsContextValue'] as WishListsContextType}
          >
            <Story />
          </WishListsContext>
        </PlaythroughsContext>
      </PageProvider>
    ),
  ],
}

export default meta

export const WithWishLists: GroupingStory = {
  parameters: {
    playthroughsContextValue,
    wishListsContextValue,
  },
}

export const WithoutWishLists: GroupingStory = {
  parameters: {
    playthroughsContextValue,
    wishListsContextValue: wishListsContextValueEmpty,
  },
}

export const NoPlaythroughs: GroupingStory = {
  parameters: {
    playthroughsContextValue: playthroughsContextValueEmpty,
    wishListsContextValue,
  },
}
