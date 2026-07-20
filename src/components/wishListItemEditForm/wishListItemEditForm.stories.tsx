import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  playthroughsContextValue,
  wishListsContextValue,
} from '../../support/data/contextValues'
import { GREEN, YELLOW } from '../../utils/colorSchemes'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext } from '../../contexts/playthroughsContext'
import { WishListsContext } from '../../contexts/wishListsContext'
import WishListItemEditForm from './wishListItemEditForm'

type EditFormStory = StoryObj<typeof WishListItemEditForm>

const meta: Meta<typeof WishListItemEditForm> = {
  title: 'WishListItemEditForm',
  component: WishListItemEditForm,
  decorators: [
    (Story) => (
      <PageProvider>
        <PlaythroughsContext value={playthroughsContextValue}>
          <WishListsContext value={wishListsContextValue}>
            <Story />
          </WishListsContext>
        </PlaythroughsContext>
      </PageProvider>
    ),
  ],
}

export default meta

export const Default: EditFormStory = {
  args: {
    itemId: 6,
    listTitle: 'Alchemy Ingredients',
    description: 'Health potion ingredients',
    quantity: 5,
    unitWeight: 0.1,
    notes: null,
    buttonColor: GREEN,
  },
}

export const LongValues: EditFormStory = {
  args: {
    ...Default.args,
    listTitle:
      'List with a Really Really Really Really Really Long Title for Testing Purposes',
    description:
      'This item has a really really really really really long description for testing purposes',
    notes:
      'The notes on this item are really really really really really really long for testing purposes',
    buttonColor: YELLOW,
  },
}
