import { ReactElement } from 'react'
import { describe, test, expect, vitest, afterEach } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
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
import ShoppingListItem from './shoppingListItem'

let listsContextValue = shoppingListsContextValue

const renderInContexts = (ui: ReactElement) =>
  renderAuthenticated(
    <PageProvider>
      <GamesContext.Provider value={gamesContextValue}>
        <ShoppingListsContext.Provider value={listsContextValue}>
          <ColorProvider colorScheme={GREEN}>{ui}</ColorProvider>
        </ShoppingListsContext.Provider>
      </GamesContext.Provider>
    </PageProvider>
  )

describe('ShoppingListItem', () => {
  describe('displaying the list item', () => {
    describe('when the list item is editable', () => {
      test('displays the attributes', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={33}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
            editable
          />
        )

        expect(wrapper.getByText('Silver Necklace')).toBeTruthy()
        expect(wrapper.getByText('2')).toBeTruthy()
        expect(wrapper.getByText('0.3')).toBeTruthy()
      })

      test('truncates unit weight values appropriately', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={20}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
            editable
          />
        )

        expect(wrapper.getByText('Silver Necklace')).toBeTruthy()
        expect(wrapper.getByText('2')).toBeTruthy()
        expect(wrapper.getByText('1')).toBeTruthy()
        expect(wrapper.queryByText('1.0')).toBeFalsy()
      })

      test('has a destroy icon', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={20}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
            editable
          />
        )

        expect(wrapper.getByTestId('destroyShoppingListItem20')).toBeTruthy()
      })

      test('has an edit icon', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={20}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
            editable
          />
        )

        expect(wrapper.getByTestId('editShoppingListItem20')).toBeTruthy()
      })

      test('has increment and decrement icons', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={20}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
            editable
          />
        )

        expect(wrapper.getByTestId('incrementShoppingListItem20')).toBeTruthy()
        expect(wrapper.getByTestId('decrementShoppingListItem20')).toBeTruthy()
      })

      test('matches snapshot', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={2}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
            editable
          />
        )

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when the list item is not editable', () => {
      test('displays the attributes', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={33}
            listTitle="All Items"
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
          />
        )

        expect(wrapper.getByText('Silver Necklace')).toBeTruthy()
        expect(wrapper.getByText('2')).toBeTruthy()
        expect(wrapper.getByText('0.3')).toBeTruthy()
      })

      test('truncates unit weight values appropriately', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={20}
            listTitle="All Items"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
          />
        )

        expect(wrapper.getByText('Silver Necklace')).toBeTruthy()
        expect(wrapper.getByText('2')).toBeTruthy()
        expect(wrapper.getByText('1')).toBeTruthy()
        expect(wrapper.queryByText('1.0')).toBeFalsy()
      })

      test('has no destroy icon', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={20}
            listTitle="All Items"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
          />
        )

        expect(wrapper.queryByTestId('destroyShoppingListItem20')).toBeFalsy()
      })

      test('has no edit icon', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={20}
            listTitle="All Items"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
          />
        )

        expect(wrapper.queryByTestId('editShoppingListItem20')).toBeFalsy()
      })

      test('has no increment or decrement icons', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={20}
            listTitle="All Items"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
          />
        )

        expect(wrapper.queryByTestId('incrementShoppingListItem20')).toBeFalsy()
        expect(wrapper.queryByTestId('decrementShoppingListItem20')).toBeFalsy()
      })

      test('matches snapshot', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={2}
            listTitle="All Items"
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
          />
        )

        expect(wrapper).toMatchSnapshot()
      })
    })
  })

  describe('destroying the list item', () => {
    describe('when the user confirms deletion', () => {
      const ogConfirm = window.confirm

      afterEach(() => {
        listsContextValue = shoppingListsContextValue
        window.confirm = ogConfirm
      })

      test("calls the context's destroyShoppingListItem function with its itemId", () => {
        const destroyShoppingListItem = vitest.fn()
        listsContextValue = {
          ...shoppingListsContextValue,
          destroyShoppingListItem,
        }

        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={33}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
            editable
          />
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const destroyIcon = wrapper.getByTestId('destroyShoppingListItem33')

        act(() => fireEvent.click(destroyIcon))

        expect(window.confirm).toHaveBeenCalled
        expect(destroyShoppingListItem).toHaveBeenCalledWith(33)
      })
    })

    describe('when the user cancels deletion', () => {
      const ogConfirm = window.confirm

      afterEach(() => {
        listsContextValue = shoppingListsContextValue
        window.confirm = ogConfirm
      })

      test("doesn't call the destroyShoppingListItem function", () => {
        const destroyShoppingListItem = vitest.fn()
        listsContextValue = {
          ...shoppingListsContextValue,
          destroyShoppingListItem,
        }

        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={33}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
            editable
          />
        )

        window.confirm = vitest.fn().mockImplementation(() => false)

        const destroyIcon = wrapper.getByTestId('destroyShoppingListItem33')

        act(() => fireEvent.click(destroyIcon))

        expect(window.confirm).toHaveBeenCalledOnce()
        expect(destroyShoppingListItem).not.toHaveBeenCalled()
      })
    })
  })

  describe('incrementing the list item quantity', () => {
    afterEach(() => {
      listsContextValue = shoppingListsContextValue
    })

    test('increments the quantity at the API', () => {
      const updateShoppingListItem = vitest.fn()
      listsContextValue = { ...listsContextValue, updateShoppingListItem }

      const wrapper = renderInContexts(
        <ShoppingListItem
          itemId={33}
          listTitle="Clothing"
          description="Silver Necklace"
          quantity={2}
          unitWeight={0.3}
          notes="To enchant"
          editable
        />
      )

      const incrementIcon = wrapper.getByTestId('incrementShoppingListItem33')

      act(() => {
        fireEvent.click(incrementIcon)
      })

      expect(updateShoppingListItem).toHaveBeenCalledWith(
        33,
        { quantity: 3 },
        expect.any(Function),
        expect.any(Function)
      )
    })
  })

  describe('decrementing the list item quantity', () => {
    afterEach(() => {
      listsContextValue = shoppingListsContextValue
    })

    describe('when the quantity is greater than 1', () => {
      test('decrements the quantity at the API', () => {
        const updateShoppingListItem = vitest.fn()
        listsContextValue = { ...listsContextValue, updateShoppingListItem }

        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={33}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
            editable
          />
        )

        const decrementIcon = wrapper.getByTestId('decrementShoppingListItem33')

        act(() => fireEvent.click(decrementIcon))

        expect(updateShoppingListItem).toHaveBeenCalledWith(
          33,
          { quantity: 1 },
          expect.any(Function),
          expect.any(Function)
        )
      })
    })

    describe('when the quantity is 1', () => {
      const ogConfirm = window.confirm

      afterEach(() => {
        listsContextValue = shoppingListsContextValue
        window.confirm = ogConfirm
      })

      test('prompts the user to destroy the item', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={33}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={1}
            unitWeight={0.3}
            notes="To enchant"
            editable
          />
        )

        window.confirm = vitest.fn().mockImplementation(() => false)

        const decrementIcon = wrapper.getByTestId('decrementShoppingListItem33')

        act(() => fireEvent.click(decrementIcon))

        expect(window.confirm).toHaveBeenCalledOnce()
      })

      test('destroys the item if the user confirms', () => {
        const destroyShoppingListItem = vitest.fn()
        listsContextValue = {
          ...shoppingListsContextValue,
          destroyShoppingListItem,
        }

        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={33}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={1}
            unitWeight={0.3}
            notes="To enchant"
            editable
          />
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const decrementIcon = wrapper.getByTestId('decrementShoppingListItem33')

        act(() => fireEvent.click(decrementIcon))

        expect(window.confirm).toHaveBeenCalledOnce()
        expect(destroyShoppingListItem).toHaveBeenCalledWith(
          33,
          null,
          expect.any(Function)
        )
      })
    })
  })
})
