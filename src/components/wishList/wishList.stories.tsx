import { type Meta, type StoryObj } from '@storybook/react-vite'
import colorSchemes from '../../utils/colorSchemes'
import { BrowserRouter } from 'react-router-dom'
import {
  gamesContextValue,
  loginContextValue,
  wishListsContextValue,
} from '../../support/data/contextValues'
import { LoginContext } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { WishListsContext } from '../../contexts/wishListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import WishListItem from '../wishListItem/wishListItem'
import WishList from './wishList'

type WishListStory = StoryObj<typeof WishList>

const meta: Meta<typeof WishList> = {
  title: 'WishList',
  component: WishList,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <LoginContext.Provider value={loginContextValue}>
          <PageProvider>
            <GamesContext.Provider value={gamesContextValue}>
              <WishListsContext.Provider value={wishListsContextValue}>
                <ColorProvider
                  colorScheme={
                    colorSchemes[
                      Math.floor(Math.random() * colorSchemes.length)
                    ]
                  }
                >
                  <Story />
                </ColorProvider>
              </WishListsContext.Provider>
            </GamesContext.Provider>
          </PageProvider>
        </LoginContext.Provider>
      </BrowserRouter>
    ),
  ],
}

export default meta

export const EditableNoListItems: WishListStory = {
  args: {
    listId: 32,
    title: 'Proudspire Manor',
    editable: true,
  },
}

export const EditableWithListItems: WishListStory = {
  args: {
    ...EditableNoListItems.args,
    children: (
      <>
        <WishListItem
          itemId={1}
          listTitle="Proudspire Manor"
          description="Steel Ingot"
          quantity={5}
          unitWeight={1.0}
          editable
        />
        <WishListItem
          itemId={2}
          listTitle="Proudspire Manor"
          description="This item has a really really really really really long description for testing purposes"
          quantity={200000000000}
          unitWeight={400000000000}
          notes="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet velit adipsci"
          editable
        />
      </>
    ),
  },
}

export const NotEditableNoListItems: WishListStory = {
  args: {
    listId: 32,
    title: 'All Items',
  },
}

export const NotEditableWithListItems: WishListStory = {
  args: {
    ...NotEditableNoListItems.args,
    children: (
      <>
        <WishListItem
          itemId={1}
          listTitle="All Items"
          description="Steel Ingot"
          quantity={5}
          unitWeight={1.0}
        />
        <WishListItem
          itemId={2}
          listTitle="All Items"
          description="This item has a really really really really really long description for testing purposes"
          quantity={200000000000}
          unitWeight={400000000000}
          notes="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet velit adipsci"
        />
      </>
    ),
  },
}
