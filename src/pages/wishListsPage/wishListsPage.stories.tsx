import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import {
  playthroughsContextValue,
  playthroughsContextValueLoading,
  wishListsContextValue,
  wishListsContextValueLoading,
  wishListsContextValueEmpty,
  loginContextValue,
  playthroughsContextValueEmpty,
} from '../../support/data/contextValues'
import { WishListsContext, type WishListsContextType } from '../../contexts/wishListsContext'
import { LoginContext } from '../../contexts/loginContext'
import { PlaythroughsContext, type PlaythroughsContextType } from '../../contexts/playthroughsContext'
import { PageProvider } from '../../contexts/pageContext'
import WishListsPage from './wishListsPage'

type WishListsPageStory = StoryObj<typeof WishListsPage>

const meta: Meta<typeof WishListsPage> = {
  title: 'WishListsPage',
  component: WishListsPage,
  decorators: [
    (Story, { parameters }) => (
      <BrowserRouter>
        <LoginContext value={loginContextValue}>
          <PageProvider>
            <PlaythroughsContext value={parameters['playthroughsContextValue'] as PlaythroughsContextType}>
              <WishListsContext
                value={parameters['wishListsContextValue'] as WishListsContextType}
              >
                <Story />
              </WishListsContext>
            </PlaythroughsContext>
          </PageProvider>
        </LoginContext>
      </BrowserRouter>
    ),
  ],
}

export default meta

export const PlaythroughsLoading: WishListsPageStory = {
  parameters: {
    playthroughsContextValue: playthroughsContextValueLoading,
    wishListsContextValue,
  },
}

export const NoPlaythroughs: WishListsPageStory = {
  parameters: {
    playthroughsContextValue: playthroughsContextValueEmpty,
    wishListsContextValue: wishListsContextValueEmpty,
  },
}

export const WishListsLoading: WishListsPageStory = {
  parameters: {
    playthroughsContextValue,
    wishListsContextValue: wishListsContextValueLoading,
  },
}

export const WithWishLists: WishListsPageStory = {
  parameters: {
    playthroughsContextValue,
    wishListsContextValue,
  },
}

export const NoWishLists: WishListsPageStory = {
  parameters: {
    playthroughsContextValue,
    wishListsContextValue: wishListsContextValueEmpty,
  },
}
