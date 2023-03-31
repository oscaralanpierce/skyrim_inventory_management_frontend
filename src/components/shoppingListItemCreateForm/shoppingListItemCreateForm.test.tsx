import { describe, test, expect, vitest } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderAuthenticated } from '../../support/testUtils'
import { YELLOW } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import ShoppingListItemCreateForm from './shoppingListItemCreateForm'
import {
  gamesContextValue,
  shoppingListsContextValue,
} from '../../support/data/contextValues'

describe('ShoppingListItemCreateForm', () => {
  test('displays correct fields', () => {
    const wrapper = renderAuthenticated(
      <PageProvider>
        <GamesContext.Provider value={gamesContextValue}>
          <ShoppingListsContext.Provider value={shoppingListsContextValue}>
            <ColorProvider colorScheme={YELLOW}>
              <ShoppingListItemCreateForm listId={4} />
            </ColorProvider>
          </ShoppingListsContext.Provider>
        </GamesContext.Provider>
      </PageProvider>
    )

    expect(wrapper.getByText('Add item to list...')).toBeTruthy()
    expect(wrapper.getByLabelText('Description')).toBeTruthy()
    expect(wrapper.getByLabelText('Quantity')).toBeTruthy()
    expect(wrapper.getByLabelText('Unit Weight')).toBeTruthy()
    expect(wrapper.getByLabelText('Notes')).toBeTruthy()
    expect(wrapper.getByText('Add to List')).toBeTruthy()
  })

  test('matches snapshot', () => {
    const wrapper = renderAuthenticated(
      <PageProvider>
        <GamesContext.Provider value={gamesContextValue}>
          <ShoppingListsContext.Provider value={shoppingListsContextValue}>
            <ColorProvider colorScheme={YELLOW}>
              <ShoppingListItemCreateForm listId={4} />
            </ColorProvider>
          </ShoppingListsContext.Provider>
        </GamesContext.Provider>
      </PageProvider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  describe('submitting the form', () => {
    test('submits the form when attributes are valid', () => {
      const createShoppingListItem = vitest.fn()

      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <ShoppingListsContext.Provider
              value={{ ...shoppingListsContextValue, createShoppingListItem }}
            >
              <ColorProvider colorScheme={YELLOW}>
                <ShoppingListItemCreateForm listId={4} />
              </ColorProvider>
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      const descField = wrapper.getByLabelText('Description')
      const quantityField = wrapper.getByLabelText('Quantity')
      const form = wrapper.getByLabelText('Shopping list item creation form')

      act(() => {
        fireEvent.change(descField, { target: { value: 'Iron ingot' } })
        fireEvent.change(quantityField, { target: { value: '2' } })
        fireEvent.submit(form)
      })

      expect(createShoppingListItem).toHaveBeenCalledWith(
        4,
        {
          description: 'Iron ingot',
          quantity: 2,
        },
        expect.any(Function),
        expect.any(Function)
      )
    })

    test("doesn't submit the form if there are invalid values", () => {
      const createShoppingListItem = vitest.fn()

      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <ShoppingListsContext.Provider
              value={{ ...shoppingListsContextValue, createShoppingListItem }}
            >
              <ColorProvider colorScheme={YELLOW}>
                <ShoppingListItemCreateForm listId={4} />
              </ColorProvider>
            </ShoppingListsContext.Provider>
          </GamesContext.Provider>
        </PageProvider>
      )

      const descField = wrapper.getByLabelText('Description')
      const quantityField = wrapper.getByLabelText('Quantity')

      // In this test, we have to click the button to simulate the form being
      // submitted by a user. Firing the `submit` event directly on the form
      // effectively takes as a foregone conclusion that the form has submitted
      // successfully - validations will be skipped.
      const button = wrapper.getByText('Add to List')

      act(() => {
        fireEvent.change(descField, { target: { value: '' } })
        fireEvent.change(quantityField, { target: { value: '2' } })
        fireEvent.click(button)
      })

      expect(createShoppingListItem).not.toHaveBeenCalled()
    })
  })
})
