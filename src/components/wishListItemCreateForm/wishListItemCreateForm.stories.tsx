import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  playthroughsContextValue,
  loginContextValue,
  wishListsContextValue,
} from '../../support/data/contextValues'
import { BLUE } from '../../utils/colorSchemes'
import { LoginContext } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext } from '../../contexts/playthroughsContext'
import { WishListsContext } from '../../contexts/wishListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import WishListItemCreateForm from './wishListItemCreateForm'

type CreateFormStory = StoryObj<typeof WishListItemCreateForm>

const meta: Meta<typeof WishListItemCreateForm> = {
  title: 'WishListItemCreateForm',
  component: WishListItemCreateForm,
  decorators: [
    (Story) => (
      <LoginContext value={loginContextValue}>
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext value={wishListsContextValue}>
              <ColorProvider colorScheme={BLUE}>
                <Story />
              </ColorProvider>
            </WishListsContext>
          </PlaythroughsContext>
        </PageProvider>
      </LoginContext>
    ),
  ],
}

export default meta

export const Default: CreateFormStory = {
  args: {
    listId: 4,
  },
}
