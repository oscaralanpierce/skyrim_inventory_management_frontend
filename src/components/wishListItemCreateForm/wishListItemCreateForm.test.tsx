import { describe, test, expect, vitest } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderAuthenticated } from '../../support/testUtils'
import {
  playthroughsContextValue,
  wishListsContextValue,
} from '../../support/data/contextValues'
import { YELLOW } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext } from '../../contexts/playthroughsContext'
import { WishListsContext } from '../../contexts/wishListsContext'
import WishListItemCreateForm from './wishListItemCreateForm'

describe('WishListItemCreateForm', () => {
  test('displays correct fields', () => {
    const wrapper = renderAuthenticated(
      <PageProvider>
        <PlaythroughsContext value={playthroughsContextValue}>
          <WishListsContext value={wishListsContextValue}>
            <ColorProvider colorScheme={YELLOW}>
              <WishListItemCreateForm listId={4} />
            </ColorProvider>
          </WishListsContext>
        </PlaythroughsContext>
      </PageProvider>
    )

    expect(wrapper.getByText('Add item to list...')).toBeTruthy()
    expect(wrapper.getByLabelText('Wish list item creation form')).toBeTruthy() // ARIA label on form element
    expect(wrapper.getByLabelText('Description')).toBeTruthy()
    expect(wrapper.getByLabelText('Quantity')).toBeTruthy()
    expect(wrapper.getByLabelText('Unit Weight')).toBeTruthy()
    expect(wrapper.getByLabelText('Notes')).toBeTruthy()
    expect(wrapper.getByText('Add to List')).toBeTruthy()
  })

  test('matches snapshot', () => {
    const wrapper = renderAuthenticated(
      <PageProvider>
        <PlaythroughsContext value={playthroughsContextValue}>
          <WishListsContext value={wishListsContextValue}>
            <ColorProvider colorScheme={YELLOW}>
              <WishListItemCreateForm listId={4} />
            </ColorProvider>
          </WishListsContext>
        </PlaythroughsContext>
      </PageProvider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  describe('submitting the form', () => {
    test('calls the callback function when attributes are valid', async () => {
      const createWishListItem = vitest.fn()

      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext
              value={{ ...wishListsContextValue, createWishListItem }}
            >
              <ColorProvider colorScheme={YELLOW}>
                <WishListItemCreateForm listId={4} />
              </ColorProvider>
            </WishListsContext>
          </PlaythroughsContext>
        </PageProvider>
      )

      const descField = wrapper.getByLabelText('Description')
      const quantityField = wrapper.getByLabelText('Quantity')
      const form = wrapper.getByLabelText('Wish list item creation form')

      fireEvent.change(descField, { target: { value: '  Iron ingot    ' } })
      fireEvent.change(quantityField, { target: { value: '2' } })

      await act(() => fireEvent.submit(form))

      expect(createWishListItem).toHaveBeenCalledWith(
        4,
        {
          description: 'Iron ingot',
          quantity: 2,
        },
        expect.any(Function),
        expect.any(Function)
      )
    })

    test("doesn't call the callback if there are invalid values", () => {
      const createWishListItem = vitest.fn()

      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext
              value={{ ...wishListsContextValue, createWishListItem }}
            >
              <ColorProvider colorScheme={YELLOW}>
                <WishListItemCreateForm listId={4} />
              </ColorProvider>
            </WishListsContext>
          </PlaythroughsContext>
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

      expect(createWishListItem).not.toHaveBeenCalled()
    })
  })
})
