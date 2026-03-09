import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  loginContextValue,
  gamesContextValue,
  wishListsContextValue,
} from '../../support/data/contextValues'
import colorSchemes from '../../utils/colorSchemes'
import { LoginContext } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { WishListsContext } from '../../contexts/wishListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import WishListItem from './wishListItem'

type ListItemStory = StoryObj<typeof WishListItem>

const meta: Meta<typeof WishListItem> = {
  title: 'WishListItem',
  component: WishListItem,
  decorators: [
    (Story) => (
      <LoginContext value={loginContextValue}>
        <PageProvider>
          <GamesContext value={gamesContextValue}>
            <WishListsContext value={wishListsContextValue}>
              <ColorProvider
                colorScheme={
                  colorSchemes[Math.floor(Math.random() * colorSchemes.length)]
                }
              >
                <Story />
              </ColorProvider>
            </WishListsContext>
          </GamesContext>
        </PageProvider>
      </LoginContext>
    ),
  ],
}

export default meta

export const NotEditable: ListItemStory = {
  args: {
    itemId: 1,
    listTitle: 'All Items',
    description: 'Dwarven metal ingot',
    quantity: 5,
    unitWeight: 1.0,
  },
}

export const Editable: ListItemStory = {
  args: {
    ...NotEditable.args,
    listTitle: 'Lakeview Manor',
    notes: 'To make bolts',
    editable: true,
  },
}

export const LongValuesNotEditable: ListItemStory = {
  args: {
    ...NotEditable.args,
    description:
      'This item has a really really really really really long description for testing purposes',
    quantity: 200000000000000000,
    unitWeight: 4000000000000000.0,
  },
}

export const LongValuesEditable: ListItemStory = {
  args: {
    ...LongValuesNotEditable.args,
    listTitle:
      'List with a Really Really Really Really Really Really Really Long Title for Testing Purposes',
    notes:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
    editable: true,
  },
}

export const EmptyFields: ListItemStory = {
  args: {
    ...Editable.args,
    unitWeight: null,
    notes: null,
  },
}

export const UnitWeightWithDecimal: ListItemStory = {
  args: {
    ...Editable.args,
    unitWeight: 0.3,
  },
}
