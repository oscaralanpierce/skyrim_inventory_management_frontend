import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type MouseEventHandler } from 'react'
import GoogleSignInButton from './googleSignInButton'

type Story = StoryObj<typeof GoogleSignInButton>

const onClick: MouseEventHandler = (e) => e.preventDefault()

const meta: Meta<typeof GoogleSignInButton> = {
  title: 'GoogleSignInButton',
  component: GoogleSignInButton,
}

export default meta

export const Default: Story = {
  args: {
    onClick,
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
}
