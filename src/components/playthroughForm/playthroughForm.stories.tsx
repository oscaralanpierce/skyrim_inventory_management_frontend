import { Meta, StoryObj } from '@storybook/react-vite'
import PlaythroughForm from './playthroughForm'

type Story = StoryObj<typeof PlaythroughForm>

const meta: Meta<typeof PlaythroughForm> = {
  title: 'PlaythroughForm',
  component: PlaythroughForm,
}

export default meta

export const CreateForm: Story = {
  args: {
    submitForm: () => {},
    type: 'create',
  },
}

export const EditForm: Story = {
  args: {
    submitForm: () => {},
    type: 'edit',
    defaultName: 'My Playthrough 1',
    defaultDescription: 'This playthrough has a description',
  },
}
