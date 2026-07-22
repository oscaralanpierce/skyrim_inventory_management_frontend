import { type Meta, type StoryObj } from '@storybook/react-vite'
import ListCreateForm, { type SubmitHandlerType } from './listCreateForm'
import { type RequestWishList } from '../../types/apiData'
import { type CallbackFunction } from '../../types/functions'

type ListCreateFormStory = StoryObj<typeof ListCreateForm>

const meta: Meta<typeof ListCreateForm> = {
  title: 'ListCreateForm',
  component: ListCreateForm,
}

export default meta

const onSubmit: SubmitHandlerType = (
  _attributes: RequestWishList,
  _onSuccess?: CallbackFunction | null,
  _onError?: CallbackFunction | null,
) => {}

export const Enabled: ListCreateFormStory = {
  args: {
    onSubmit,
    disabled: false,
  }
}

export const Disabled: ListCreateFormStory = {
  args: {
    onSubmit,
    disabled: true
  }
}