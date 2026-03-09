import { ReactElement } from 'react'
import { describe, test, expect, vitest } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderAuthenticated } from '../../support/testUtils'
import {
  gamesContextValue,
  wishListsContextValue,
} from '../../support/data/contextValues'
import { GREEN } from '../../utils/colorSchemes'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { WishListsContext } from '../../contexts/wishListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import WishListItem from '../wishListItem/wishListItem'
import WishList from './wishList'

let listContextValue = wishListsContextValue

const renderWithContexts = (ui: ReactElement) =>
  renderAuthenticated(
    <PageProvider>
      <GamesContext value={gamesContextValue}>
        <WishListsContext value={listContextValue}>
          <ColorProvider colorScheme={GREEN}>{ui}</ColorProvider>
        </WishListsContext>
      </GamesContext>
    </PageProvider>
  )

describe('WishList', () => {
  describe('displaying a list', () => {
    describe('when there are no list items', () => {
      test('displays the name of the wish list', () => {
        const wrapper = renderWithContexts(
          <WishList listId={4} title="My Wish List" editable />
        )

        expect(wrapper.getByText('My Wish List')).toBeTruthy()

        // An editable list should have the list item creation form and
        // no message that there are no list items.
        expect(wrapper.getByText('Add item to list...')).toBeTruthy()
        expect(
          wrapper.queryByText('This wish list has no list items.')
        ).toBeFalsy()
      })

      test('has a destroy icon', () => {
        const wrapper = renderWithContexts(
          <WishList listId={4} title="My Wish List" editable />
        )

        expect(wrapper.getByTestId('destroyWishList4')).toBeTruthy()
      })

      test('has an edit icon', () => {
        const wrapper = renderWithContexts(
          <WishList listId={4} title="My Wish List" editable />
        )

        expect(wrapper.getByTestId('editWishList4')).toBeTruthy()
      })

      test('matches snapshot', () => {
        const wrapper = renderWithContexts(
          <WishList listId={4} title="My Wish List" editable />
        )
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when there are list items', () => {
      test("doesn't display the message about no list items", () => {
        const wrapper = renderWithContexts(
          <WishList listId={4} title="My Wish List" editable>
            <WishListItem
              key="unique-key-1"
              itemId={1}
              listTitle="My Wish List"
              description="List Item 1"
              quantity={4}
              editable
            />
            <WishListItem
              key="unique-key-2"
              itemId={2}
              listTitle="My Wish List"
              description="List Item 2"
              quantity={1}
              editable
            />
          </WishList>
        )

        expect(wrapper.getByText('Add item to list...')).toBeTruthy()
        expect(
          wrapper.queryByText('This wish list has no list items.')
        ).toBeFalsy()
      })

      test('has a destroy icon', () => {
        const wrapper = renderWithContexts(
          <WishList listId={4} title="My Wish List" editable>
            <WishListItem
              key="unique-key-1"
              itemId={1}
              listTitle="My Wish List"
              description="List Item 1"
              quantity={4}
              editable
            />
            <WishListItem
              key="unique-key-2"
              itemId={2}
              listTitle="My Wish List"
              description="List Item 2"
              quantity={1}
              editable
            />
          </WishList>
        )

        expect(wrapper.getByTestId('destroyWishList4')).toBeTruthy()
      })

      test('has an edit icon', () => {
        const wrapper = renderWithContexts(
          <WishList listId={4} title="My Wish List" editable>
            <WishListItem
              key="unique-key-1"
              itemId={1}
              listTitle="My Wish List"
              description="List Item 1"
              quantity={4}
              editable
            />
            <WishListItem
              key="unique-key-2"
              itemId={2}
              listTitle="My Wish List"
              description="List Item 2"
              quantity={1}
              editable
            />
          </WishList>
        )

        expect(wrapper.getByTestId('editWishList4')).toBeTruthy()
      })

      test('matches snapshot', () => {
        const wrapper = renderWithContexts(
          <WishList listId={4} title="My Wish List" editable>
            <WishListItem
              key="unique-key-1"
              itemId={1}
              listTitle="My Wish List"
              description="List Item 1"
              quantity={4}
              editable
            />
            <WishListItem
              key="unique-key-2"
              itemId={2}
              listTitle="My Wish List"
              description="List Item 2"
              quantity={1}
              editable
            />
          </WishList>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when the list is not editable', () => {
      test("doesn't have a destroy icon", () => {
        const wrapper = renderWithContexts(
          <WishList listId={3} title="My Wish List" />
        )

        expect(wrapper.queryByTestId('destroyWishList3')).toBeFalsy()
      })

      test("doesn't have an edit icon", () => {
        const wrapper = renderWithContexts(
          <WishList listId={3} title="My Wish List" />
        )

        expect(wrapper.queryByTestId('editWishList3')).toBeFalsy()
      })

      test("doesn't have a list item creation form", () => {
        const wrapper = renderWithContexts(
          <WishList listId={3} title="My Wish List" />
        )

        expect(wrapper.queryByText('Add item to list...')).toBeFalsy()
      })

      test('matches snapshot', () => {
        const wrapper = renderWithContexts(
          <WishList listId={3} title="My Wish List" editable />
        )

        expect(wrapper).toMatchSnapshot()
      })
    })
  })

  describe('destroying the list', () => {
    describe('when the user confirms deletion', () => {
      afterEach(() => {
        listContextValue = wishListsContextValue
      })

      test("calls the context's destroyWishList function with its listId", async () => {
        const destroyWishList = vitest.fn()
        listContextValue = { ...wishListsContextValue, destroyWishList }

        const wrapper = renderWithContexts(
          <WishList listId={4} title="My Wish List" editable />
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const destroyIcon = wrapper.getByTestId('destroyWishList4')

        await act(() => fireEvent.click(destroyIcon))

        expect(window.confirm).toHaveBeenCalledWith(
          'Are you sure you want to delete the list "My Wish List"? You will also lose any list items on the list. This action cannot be undone.'
        )
        expect(destroyWishList).toHaveBeenCalledWith(4)
      })
    })

    describe('when the user cancels deletion', () => {
      afterEach(() => {
        listContextValue = wishListsContextValue
      })

      test("doesn't call the destroyWishList function", async () => {
        const destroyWishList = vitest.fn()
        listContextValue = { ...wishListsContextValue, destroyWishList }

        const wrapper = renderWithContexts(
          <WishList listId={4} title="My Wish List" editable />
        )

        window.confirm = vitest.fn().mockImplementation(() => false)

        const destroyIcon = wrapper.getByTestId('destroyWishList4')

        await act(() => fireEvent.click(destroyIcon))

        expect(window.confirm).toHaveBeenCalledWith(
          'Are you sure you want to delete the list "My Wish List"? You will also lose any list items on the list. This action cannot be undone.'
        )
        expect(destroyWishList).not.toHaveBeenCalled()
      })
    })
  })

  describe('displaying the edit form', () => {
    test('displays the form', () => {
      const wrapper = renderWithContexts(
        <WishList listId={3} title="My Wish List" editable />
      )

      const editButton = wrapper.getByTestId('editWishList3')

      act(() => {
        fireEvent.click(editButton)
      })

      expect(wrapper.queryByText('My Wish List')).toBeFalsy()
      expect(wrapper.getByRole('form')).toBeTruthy()
    })

    test('hides the form when you click the edit button again', () => {
      const wrapper = renderWithContexts(
        <WishList listId={3} title="My Wish List" editable />
      )

      const editButton = wrapper.getByTestId('editWishList3')

      act(() => {
        fireEvent.click(editButton)
      })

      expect(wrapper.queryByText('My Wish List')).toBeFalsy()
      expect(wrapper.getByRole('form')).toBeTruthy()

      act(() => {
        fireEvent.click(editButton)
      })

      expect(wrapper.getByText('My Wish List')).toBeTruthy()
      expect(wrapper.queryByRole('form')).toBeFalsy()
    })

    test('hides the form when you click outside the input', () => {
      const wrapper = renderWithContexts(
        <WishList listId={3} title="My Wish List" editable />
      )

      const editButton = wrapper.getByTestId('editWishList3')

      act(() => {
        fireEvent.click(editButton)
      })

      expect(wrapper.queryByText('My Wish List')).toBeFalsy()
      expect(wrapper.getByRole('form')).toBeTruthy()

      act(() => {
        // Only easily identifiable element outside the edit form, thanks
        // testing library
        fireEvent.click(wrapper.getByTestId('destroyWishList3'))
      })

      expect(wrapper.getByText('My Wish List')).toBeTruthy()
      expect(wrapper.queryByRole('form')).toBeFalsy()
    })

    test('hides the form when you press Escape', () => {
      const wrapper = renderWithContexts(
        <WishList listId={3} title="My Wish List" editable />
      )

      const editButton = wrapper.getByTestId('editWishList3')

      act(() => {
        fireEvent.click(editButton)
      })

      act(() => {
        fireEvent(
          document,
          new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' })
        )
      })

      expect(wrapper.getByText('My Wish List')).toBeTruthy()
      expect(wrapper.queryByRole('form')).toBeFalsy()
    })

    test("doesn't hide the form when you press a key other than escape", () => {
      const wrapper = renderWithContexts(
        <WishList listId={3} title="My Wish List" editable />
      )

      const editButton = wrapper.getByTestId('editWishList3')

      act(() => {
        fireEvent.click(editButton)
      })

      act(() => {
        fireEvent(
          document,
          new KeyboardEvent('keydown', { bubbles: true, key: ' ' })
        )
      })

      expect(wrapper.queryByText('My Wish List')).toBeFalsy()
      expect(wrapper.getByRole('form')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderWithContexts(
        <WishList listId={3} title="My Wish List" editable />
      )

      const editButton = wrapper.getByTestId('editWishList3')

      act(() => {
        fireEvent.click(editButton)
      })

      expect(wrapper).toMatchSnapshot()
    })
  })
})
