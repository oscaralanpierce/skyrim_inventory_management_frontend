import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  gamesContextValue,
  loginContextValue,
  wishListsContextValue,
} from '../../support/data/contextValues'
import { BLUE } from '../../utils/colorSchemes'
import { LoginContext } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
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
          <GamesContext value={gamesContextValue}>
            <WishListsContext value={wishListsContextValue}>
              <ColorProvider colorScheme={BLUE}>
                <Story />
              </ColorProvider>
            </WishListsContext>
          </GamesContext>
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
