import { type Meta, type StoryObj } from '@storybook/react-vite'
import FlashMessage from './flashMessage'

type Story = StoryObj<typeof FlashMessage>

const meta: Meta<typeof FlashMessage> = {
  title: 'FlashMessage',
  component: FlashMessage,
}

export default meta

const messageString = 'You will be assimilated.'

const messageArray = [
  'You will be assimilated.',
  'Your biological and technological distinctiveness will be added to our own.',
  'Resistance is futile.',
]

/**
 *
 * Success messages
 *
 */

export const SuccessWithStringMessage: Story = {
  args: {
    type: 'success',
    message: messageString,
    hidden: false,
  },
}

export const SuccessWithStringMessageAndHeader: Story = {
  args: {
    ...SuccessWithStringMessage.args,
    header: 'We are the Borg.',
  },
}

export const SuccessWithArrayMessage: Story = {
  args: {
    ...SuccessWithStringMessage.args,
    message: messageArray,
  },
}

export const SuccessWithArrayMessageAndHeader: Story = {
  args: {
    ...SuccessWithArrayMessage.args,
    header: 'We are the Borg.',
  },
}

/**
 *
 * Info messages
 *
 */

export const InfoWithStringMessage: Story = {
  args: {
    ...SuccessWithStringMessage.args,
    type: 'info',
  },
}

export const InfoWithStringMessageAndHeader: Story = {
  args: {
    ...InfoWithStringMessage.args,
    header: 'We are the Borg.',
  },
}

export const InfoWithArrayMessage: Story = {
  args: {
    ...InfoWithStringMessage.args,
    message: messageArray,
  },
}

export const InfoWithArrayMessageAndHeader: Story = {
  args: {
    ...InfoWithArrayMessage.args,
    header: 'We are the Borg.',
  },
}

/**
 *
 * Warning messages
 *
 */

export const WarningWithStringMessage: Story = {
  args: {
    ...SuccessWithStringMessage.args,
    type: 'warning',
  },
}

export const WarningWithStringMessageAndHeader: Story = {
  args: {
    ...WarningWithStringMessage.args,
    header: 'We are the Borg.',
  },
}

export const WarningWithArrayMessage: Story = {
  args: {
    ...WarningWithStringMessage.args,
    message: messageArray,
  },
}

export const WarningWithArrayMessageAndHeader: Story = {
  args: {
    ...WarningWithArrayMessage.args,
    header: 'We are the Borg.',
  },
}

/**
 *
 * Error messages
 *
 */

export const ErrorWithStringMessage: Story = {
  args: {
    ...SuccessWithStringMessage.args,
    type: 'error',
  },
}

export const ErrorWithStringMessageAndHeader: Story = {
  args: {
    ...ErrorWithStringMessage.args,
    header: 'We are the Borg.',
  },
}

export const ErrorWithArrayMessage: Story = {
  args: {
    ...ErrorWithStringMessage.args,
    message: messageArray,
  },
}

export const ErrorWithArrayMessageAndHeader: Story = {
  args: {
    ...ErrorWithArrayMessage.args,
    header: 'We are the Borg.',
  },
}
