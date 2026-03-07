import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import NotFoundPage from './notFoundPage'

type NotFoundStory = StoryObj<typeof NotFoundPage>

const meta: Meta<typeof NotFoundPage> = {
  title: 'NotFoundPage',
  component: NotFoundPage,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta

export const Default: NotFoundStory = {}
