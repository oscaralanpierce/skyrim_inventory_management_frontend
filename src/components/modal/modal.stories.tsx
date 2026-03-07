import { type Meta, type StoryObj } from '@storybook/react-vite'
import GameForm from '../gameForm/gameForm'
import Modal from './modal'

type Story = StoryObj<typeof Modal>

const meta: Meta<typeof Modal> = {
  title: 'Modal',
  component: Modal,
}

export default meta

export const Default: Story = {
  render: () => (
    <Modal hidden={false}>
      <GameForm submitForm={() => {}} type="edit" />
    </Modal>
  ),
}
