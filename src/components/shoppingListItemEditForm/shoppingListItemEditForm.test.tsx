import { ReactElement } from 'react'
import { describe, expect, test, afterEach, vitest } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderAuthenticated } from '../../support/testUtils'
import { BLUE } from '../../utils/colorSchemes'
import {
  gamesContextValue,
  shoppingListsContextValue,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import ShoppingListItemEditForm from './shoppingListItemEditForm'

let contextValue = shoppingListsContextValue

const renderWithContexts = (ui: ReactElement) =>
  renderAuthenticated(
    <PageProvider>
      <GamesContext.Provider value={gamesContextValue}>
        <ShoppingListsContext.Provider value={contextValue}>
          {ui}
        </ShoppingListsContext.Provider>
      </GamesContext.Provider>
    </PageProvider>
  )

describe('ShoppingListItemEditForm', () => {
  describe('displaying the form', () => {
    test('has the correct fields', () => {
      const wrapper = renderWithContexts(
        <ShoppingListItemEditForm
          itemId={6}
          description="Health potion ingredients"
          listTitle="Alchemy Ingredients"
          buttonColor={BLUE}
          quantity={2}
          unitWeight={3}
          notes={null}
        />
      )

      expect(wrapper.getByText('Health potion ingredients')).toBeTruthy()
      expect(wrapper.getByText('On list "Alchemy Ingredients"')).toBeTruthy()
      expect(wrapper.getByLabelText('Quantity').getAttribute('value')).toEqual(
        '2'
      )
      expect(
        wrapper.getByLabelText('Unit Weight').getAttribute('value')
      ).toEqual('3')
      expect(wrapper.getByLabelText('Notes')).toBeTruthy()
      expect(wrapper.getByText('Update Item')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderWithContexts(
        <ShoppingListItemEditForm
          itemId={6}
          description="Health potion ingredients"
          listTitle="Alchemy Ingredients"
          buttonColor={BLUE}
          quantity={2}
          unitWeight={3}
          notes={null}
        />
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('submitting the form', () => {
    afterEach(() => {
      contextValue = shoppingListsContextValue
    })

    describe('with valid attributes', () => {
      test('updates the shopping list item', () => {
        const updateShoppingListItem = vitest.fn()
        contextValue = { ...shoppingListsContextValue, updateShoppingListItem }

        const wrapper = renderWithContexts(
          <ShoppingListItemEditForm
            itemId={6}
            description="Health potion ingredients"
            listTitle="Alchemy Ingredients"
            buttonColor={BLUE}
            quantity={2}
            unitWeight={3}
            notes={null}
          />
        )

        const qtyInput = wrapper.getByLabelText('Quantity')
        const weightInput = wrapper.getByLabelText('Unit Weight')
        const form = wrapper.getByTestId('editShoppingListItem6Form')

        act(() => {
          fireEvent.change(qtyInput, { target: { value: '4' } })
          fireEvent.change(weightInput, { target: { value: '0.1' } })
          fireEvent.submit(form)
        })

        expect(updateShoppingListItem).toHaveBeenCalledWith(
          6,
          { quantity: 4, unit_weight: 0.1 },
          expect.any(Function)
        )
      })
    })

    describe('with invalid attributes', () => {
      test("doesn't update the item", () => {
        const updateShoppingListItem = vitest.fn()
        contextValue = { ...shoppingListsContextValue, updateShoppingListItem }

        const wrapper = renderWithContexts(
          <ShoppingListItemEditForm
            itemId={6}
            description="Health potion ingredients"
            listTitle="Alchemy Ingredients"
            buttonColor={BLUE}
            quantity={2}
            unitWeight={3}
            notes={null}
          />
        )

        const qtyInput = wrapper.getByLabelText('Quantity')
        const button = wrapper.getByText('Update Item')

        act(() => {
          fireEvent.change(qtyInput, { target: { value: '-4' } })
          fireEvent.click(button)
        })

        expect(updateShoppingListItem).not.toHaveBeenCalled()
      })
    })

    describe('with identical attributes', () => {
      test("doesn't update the item", () => {
        const updateShoppingListItem = vitest.fn()
        contextValue = { ...shoppingListsContextValue, updateShoppingListItem }

        const wrapper = renderWithContexts(
          <ShoppingListItemEditForm
            itemId={6}
            description="Health potion ingredients"
            listTitle="Alchemy Ingredients"
            buttonColor={BLUE}
            quantity={2}
            unitWeight={3}
            notes={null}
          />
        )

        const form = wrapper.getByTestId('editShoppingListItem6Form')

        // Submit the form without updating any fields
        act(() => fireEvent.submit(form))

        expect(updateShoppingListItem).not.toHaveBeenCalled()
      })
    })
  })
})
