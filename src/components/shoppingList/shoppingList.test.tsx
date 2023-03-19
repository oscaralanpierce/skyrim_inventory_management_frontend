import { ReactElement } from 'react'
import { describe, test, expect } from 'vitest'
import { act, fireEvent, waitFor } from '@testing-library/react'
import { renderAuthenticated } from '../../support/testUtils'
import {
  gamesContextValue,
  shoppingListsContextValue,
} from '../../support/data/contextValues'
import { GREEN } from '../../utils/colorSchemes'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListItem from '../shoppingListItem/shoppingListItem'
import ShoppingList from './shoppingList'

let listContextValue = shoppingListsContextValue

const renderWithContexts = (ui: ReactElement) =>
  renderAuthenticated(
    <PageProvider>
      <GamesContext.Provider value={gamesContextValue}>
        <ShoppingListsContext.Provider value={listContextValue}>
          <ColorProvider colorScheme={GREEN}>{ui}</ColorProvider>
        </ShoppingListsContext.Provider>
      </GamesContext.Provider>
    </PageProvider>
  )

describe('ShoppingList', () => {
  describe('displaying a list', () => {
    describe('when there are no list items', () => {
      test('displays the name of the shopping list', () => {
        const wrapper = renderWithContexts(
          <ShoppingList listId={4} title="My Shopping List" canEdit />
        )

        expect(wrapper).toBeTruthy()
        expect(wrapper.getByText('My Shopping List')).toBeTruthy()
        expect(
          wrapper.getByText('This shopping list has no list items.')
        ).toBeTruthy()
      })

      test('has a destroy icon', () => {
        const wrapper = renderWithContexts(
          <ShoppingList listId={4} title="My Shopping List" canEdit />
        )

        expect(wrapper.getByTestId('destroyShoppingList4')).toBeTruthy()
      })

      test('matches snapshot', () => {
        const wrapper = renderWithContexts(
          <ShoppingList listId={4} title="My Shopping List" canEdit />
        )
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when there are list items', () => {
      test("doesn't display the message about no list items", () => {
        const wrapper = renderWithContexts(
          <ShoppingList listId={4} title="My Shopping List" canEdit>
            <ShoppingListItem
              key="unique-key-1"
              itemId={1}
              description="List Item 1"
              quantity={4}
            />
            <ShoppingListItem
              key="unique-key-2"
              itemId={2}
              description="List Item 2"
              quantity={1}
            />
          </ShoppingList>
        )

        expect(
          wrapper.queryByText('This shopping list has no list items.')
        ).toBeFalsy()
      })

      test('has a destroy icon', () => {
        const wrapper = renderWithContexts(
          <ShoppingList listId={4} title="My Shopping List" canEdit>
            <ShoppingListItem
              key="unique-key-1"
              itemId={1}
              description="List Item 1"
              quantity={4}
            />
            <ShoppingListItem
              key="unique-key-2"
              itemId={2}
              description="List Item 2"
              quantity={1}
            />
          </ShoppingList>
        )

        expect(wrapper.getByTestId('destroyShoppingList4')).toBeTruthy()
      })

      test('matches snapshot', () => {
        const wrapper = renderWithContexts(
          <ShoppingList listId={4} title="My Shopping List" canEdit>
            <ShoppingListItem
              key="unique-key-1"
              itemId={1}
              description="List Item 1"
              quantity={4}
            />
            <ShoppingListItem
              key="unique-key-2"
              itemId={2}
              description="List Item 2"
              quantity={1}
            />
          </ShoppingList>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when the list is not editable', () => {
      test("doesn't have a destroy icon", () => {
        const wrapper = renderWithContexts(
          <ShoppingList listId={3} title="My Shopping List" />
        )

        expect(wrapper.queryByTestId('destroyShoppingList3')).toBeFalsy()
      })

      test('matches snapshot', () => {
        const wrapper = renderWithContexts(
          <ShoppingList listId={3} title="My Shopping List" canEdit />
        )

        expect(wrapper).toMatchSnapshot()
      })
    })
  })

  describe('destroying the list', () => {
    describe('when the user confirms deletion', () => {
      test("calls the context's destroyShoppingList function with its listId", () => {
        const destroyShoppingList = vitest.fn()
        listContextValue = { ...shoppingListsContextValue, destroyShoppingList }

        const wrapper = renderWithContexts(
          <ShoppingList listId={4} title="My Shopping List" canEdit />
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const destroyIcon = wrapper.getByTestId('destroyShoppingList4')

        act(() => fireEvent.click(destroyIcon))

        expect(window.confirm).toHaveBeenCalledWith(
          'Are you sure you want to delete the list "My Shopping List"? You will also lose any list items on the list. This action cannot be undone.'
        )
        expect(destroyShoppingList).toHaveBeenCalledWith(4)
      })
    })

    describe('when the user cancels deletion', () => {
      test("calls the context's destroyShoppingList function with its listId", () => {
        const destroyShoppingList = vitest.fn()
        listContextValue = { ...shoppingListsContextValue, destroyShoppingList }

        const wrapper = renderWithContexts(
          <ShoppingList listId={4} title="My Shopping List" canEdit />
        )

        window.confirm = vitest.fn().mockImplementation(() => false)

        const destroyIcon = wrapper.getByTestId('destroyShoppingList4')

        act(() => fireEvent.click(destroyIcon))

        expect(window.confirm).toHaveBeenCalledWith(
          'Are you sure you want to delete the list "My Shopping List"? You will also lose any list items on the list. This action cannot be undone.'
        )
        expect(destroyShoppingList).not.toHaveBeenCalled()
      })
    })
  })
})
