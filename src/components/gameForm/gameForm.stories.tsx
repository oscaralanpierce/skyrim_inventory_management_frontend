import { Meta, StoryObj } from '@storybook/react-vite'
import GameForm from './gameForm'

type Story = StoryObj<typeof GameForm>

const meta: Meta<typeof GameForm> = {
  title: 'GameForm',
  component: GameForm,
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
    defaultName: 'My Game 1',
    defaultDescription: 'This game has a description',
  },
}
