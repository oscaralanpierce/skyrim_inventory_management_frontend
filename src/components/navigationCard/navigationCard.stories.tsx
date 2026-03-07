import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import { GREEN } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import NavigationCard from './navigationCard'

type NavigationCardStory = StoryObj<typeof NavigationCard>

const meta: Meta<typeof NavigationCard> = {
  title: 'NavigationCard',
  component: NavigationCard,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ColorProvider colorScheme={GREEN}>
          <Story />
        </ColorProvider>
      </BrowserRouter>
    ),
  ],
}

export default meta

export const Default: NavigationCardStory = {
  args: {
    href: '#',
    children: 'Your Wish Lists',
  },
}
