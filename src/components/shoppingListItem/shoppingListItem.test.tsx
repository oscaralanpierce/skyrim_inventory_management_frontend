import { ReactElement } from 'react'
import { describe, test, expect, vitest } from 'vitest'
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
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
            canEdit
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
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
            canEdit
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
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
            canEdit
          />
        )

        expect(wrapper.getByTestId('destroyShoppingListItem20')).toBeTruthy()
      })

      test('matches snapshot', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={2}
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
            canEdit
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
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
          />
        )

        expect(wrapper.queryByTestId('destroyShoppingListItem20')).toBeFalsy()
      })

      test('matches snapshot', () => {
        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={2}
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
      test("calls the context's destroyShoppingListItem function with its itemId", () => {
        const destroyShoppingListItem = vitest.fn()
        listsContextValue = {
          ...shoppingListsContextValue,
          destroyShoppingListItem,
        }

        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={33}
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
            canEdit
          />
        )

        window.confirm = vitest.fn().mockImplementation(() => true)

        const destroyIcon = wrapper.getByTestId('destroyShoppingListItem33')

        act(() => fireEvent.click(destroyIcon))

        expect(destroyShoppingListItem).toHaveBeenCalledWith(33)
      })
    })

    describe('when the user cancels deletion', () => {
      test("doesn't call the destroyShoppingListItem function", () => {
        const destroyShoppingListItem = vitest.fn()
        listsContextValue = {
          ...shoppingListsContextValue,
          destroyShoppingListItem,
        }

        const wrapper = renderInContexts(
          <ShoppingListItem
            itemId={33}
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
            canEdit
          />
        )

        window.confirm = vitest.fn().mockImplementation(() => false)

        const destroyIcon = wrapper.getByTestId('destroyShoppingListItem33')

        act(() => fireEvent.click(destroyIcon))

        expect(destroyShoppingListItem).not.toHaveBeenCalled()
      })
    })
  })
})
