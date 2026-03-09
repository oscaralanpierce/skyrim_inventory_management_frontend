import { ReactElement } from 'react'
import { describe, expect, test, afterEach, vitest } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderAuthenticated } from '../../support/testUtils'
import { BLUE } from '../../utils/colorSchemes'
import {
  gamesContextValue,
  wishListsContextValue,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { WishListsContext } from '../../contexts/wishListsContext'
import WishListItemEditForm from './wishListItemEditForm'

let contextValue = wishListsContextValue

const renderWithContexts = (ui: ReactElement) =>
  renderAuthenticated(
    <PageProvider>
      <GamesContext value={gamesContextValue}>
        <WishListsContext value={contextValue}>
          {ui}
        </WishListsContext>
      </GamesContext>
    </PageProvider>
  )

describe('WishListItemEditForm', () => {
  describe('displaying the form', () => {
    test('has the correct fields', () => {
      const wrapper = renderWithContexts(
        <WishListItemEditForm
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
        <WishListItemEditForm
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
      contextValue = wishListsContextValue
    })

    describe('with valid attributes', () => {
      test('updates the wish list item', async () => {
        const updateWishListItem = vitest.fn()
        contextValue = { ...wishListsContextValue, updateWishListItem }

        const wrapper = renderWithContexts(
          <WishListItemEditForm
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
        const notesInput = wrapper.getByLabelText('Notes')
        const form = wrapper.getByTestId('editWishListItem6Form')

        fireEvent.change(qtyInput, { target: { value: '4' } })
        fireEvent.change(weightInput, { target: { value: '0.1' } })
        fireEvent.change(notesInput, { target: { value: '  New notes    ' } })

        await act(() => fireEvent.submit(form))

        expect(updateWishListItem).toHaveBeenCalledWith(
          6,
          { quantity: 4, unit_weight: 0.1, notes: 'New notes' },
          expect.any(Function)
        )
      })
    })

    describe('with invalid attributes', () => {
      test("doesn't update the item", () => {
        const updateWishListItem = vitest.fn()
        contextValue = { ...wishListsContextValue, updateWishListItem }

        const wrapper = renderWithContexts(
          <WishListItemEditForm
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

        expect(updateWishListItem).not.toHaveBeenCalled()
      })
    })

    describe('with identical attributes', () => {
      test("doesn't update the item", async () => {
        const updateWishListItem = vitest.fn()
        contextValue = { ...wishListsContextValue, updateWishListItem }

        const wrapper = renderWithContexts(
          <WishListItemEditForm
            itemId={6}
            description="Health potion ingredients"
            listTitle="Alchemy Ingredients"
            buttonColor={BLUE}
            quantity={2}
            unitWeight={3}
            notes={null}
          />
        )

        const form = wrapper.getByTestId('editWishListItem6Form')

        // Submit the form without updating any fields
        await act(() => fireEvent.submit(form))

        expect(updateWishListItem).not.toHaveBeenCalled()
      })
    })
  })
})
