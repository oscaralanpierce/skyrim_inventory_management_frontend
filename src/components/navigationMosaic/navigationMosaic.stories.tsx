import { type Meta, type StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import NavigationMosaic from './navigationMosaic'
import cards from './testCards'

type NavigationMosaicStory = StoryObj<typeof NavigationMosaic>

const meta: Meta<typeof NavigationMosaic> = {
  title: 'NavigationMosaic',
  component: NavigationMosaic,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta

export const Default: NavigationMosaicStory = {
  args: {
    cardArray: cards,
  },
}
