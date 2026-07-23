import { type Meta, type StoryObj } from '@storybook/react-vite'
import { GREEN, YELLOW } from '../../utils/colorSchemes'
import { type RequestWishListItem, type RequestInventoryItem } from '../../types/apiData';
import ListItemEditForm from './listItemEditForm'

type ListItemEditFormStory = StoryObj<typeof ListItemEditForm>

const meta: Meta<typeof ListItemEditForm> = {
  title: 'ListItemEditForm',
  component: ListItemEditForm,
}

export default meta

export const WishListItemEditForm: ListItemEditFormStory = {
  args: {
    listTitle: 'Vlindrel Hall',
    buttonColor: GREEN,
    itemAttributes: {
      itemId: 6,
      description: 'Health potion ingredients',
      quantity: 5,
      unitWeight: 0.1,
      notes: null,
    },
    onSubmit: (_attributes: RequestWishListItem | null) => {}
  }
}

export const InventoryItemEditForm: ListItemEditFormStory = {
  args: {
    listTitle: 'Carried',
    buttonColor: YELLOW,
    itemAttributes: {
      itemId: 2,
      description: 'Blue Mountain Flower',
      quantity: 12,
      unitWeight: 0.1,
      notes: 'For Restore Health and Fortify Health potions',
    },
    onSubmit: (_attributes: RequestInventoryItem | null) => {}
  }
}

  export const LongValues: ListItemEditFormStory = {
    args: {
      ...WishListItemEditForm.args,
    listTitle:
      'List with a Really Really Really Really Really Long Title for Testing Purposes',
    itemAttributes: {
      itemId: 6,
      description:
        'This item has a really really really really really long description for testing purposes',
      quantity: 12,
      unitWeight: 1000000000001,
      notes:
        'The notes on this item are really really really really really really long for testing purposes',
    }
  }
}