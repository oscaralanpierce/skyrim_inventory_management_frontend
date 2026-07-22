import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BLUE } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import { type RequestInventoryItem, type RequestWishListItem } from '../../types/apiData'
import { type CallbackFunction } from '../../types/functions'
import ListItemCreateForm from './listItemCreateForm'

type CreateFormStory = StoryObj<typeof ListItemCreateForm>

const meta: Meta<typeof ListItemCreateForm> = {
  title: 'ListItemCreateForm',
  component: ListItemCreateForm,
  decorators: [
    (Story) => (
      <ColorProvider colorScheme={BLUE}>
        <Story />
      </ColorProvider>
    ),
  ],
}

export default meta

/**
 * 
 * The difference between these two stories is exclusively in Aria labels
 * and will not be visible in the GUI.
 * 
 */

export const InventoryItemCreateForm: CreateFormStory = {
  args: {
    listId: 4,
    resource: 'Inventory',
    onSubmit:(_attributes: RequestInventoryItem, _onSuccess: CallbackFunction, _onError: CallbackFunction) => {}
  }
}

export const WishListItemCreateForm: CreateFormStory = {
  args: {
    listId: 4,
    resource: 'Wish list',
    onSubmit: (_attributes: RequestWishListItem, _onSuccess: CallbackFunction, _onError: CallbackFunction) => {}
  }
}