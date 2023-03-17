import { describe, test, expect } from 'vitest'
import { renderWithRouter } from '../../support/testUtils'
import { GREEN } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListItem from '../shoppingListItem/shoppingListItem'
import ShoppingList from './shoppingList'

describe('ShoppingList', () => {
  describe('when there are no list items', () => {
    test('displays the name of the shopping list', () => {
      const wrapper = renderWithRouter(
        <ColorProvider colorScheme={GREEN}>
          <ShoppingList listId={32} title="My Shopping List" />
        </ColorProvider>
      )

      expect(wrapper).toBeTruthy()
      expect(wrapper.getByText('My Shopping List')).toBeTruthy()
      expect(
        wrapper.getByText('This shopping list has no list items.')
      ).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderWithRouter(
        <ColorProvider colorScheme={GREEN}>
          <ShoppingList listId={32} title="My Shopping List" />
        </ColorProvider>
      )
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when there are list items', () => {
    test("doesn't display the message about no list items", () => {
      const wrapper = renderWithRouter(
        <ColorProvider colorScheme={GREEN}>
          <ShoppingList listId={32} title="My Shopping List">
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
        </ColorProvider>
      )

      expect(
        wrapper.queryByText('This shopping list has no list items.')
      ).toBeFalsy()
    })

    test('matches snapshot', () => {
      const wrapper = renderWithRouter(
        <ColorProvider colorScheme={GREEN}>
          <ShoppingList listId={32} title="My Shopping List">
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
        </ColorProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})
