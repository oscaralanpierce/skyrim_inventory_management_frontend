import { ReactElement } from 'react'
import { describe, test, expect, vitest, afterEach } from 'vitest'
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
import WishListItem from './wishListItem'

let listsContextValue = wishListsContextValue

const renderInContexts = (ui: ReactElement) =>
  renderAuthenticated(
    <PageProvider>
      <GamesContext value={gamesContextValue}>
        <WishListsContext value={listsContextValue}>
          <ColorProvider colorScheme={GREEN}>{ui}</ColorProvider>
        </WishListsContext>
      </GamesContext>
    </PageProvider>
  )

describe('WishListItem', () => {
  describe('displaying the list item', () => {
    describe('when the list item is editable', () => {
      test('displays the attributes', () => {
        const wrapper = renderInContexts(
          <WishListItem
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
          <WishListItem
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
        expect(wrapper.getByText('To enchant')).toBeTruthy()
        expect(wrapper.queryByText('1.0')).toBeFalsy()
      })

      test('has a destroy icon', () => {
        const wrapper = renderInContexts(
          <WishListItem
            itemId={20}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
            editable
          />
        )

        expect(wrapper.getByTestId('destroyWishListItem20')).toBeTruthy()
      })

      test('has an edit icon', () => {
        const wrapper = renderInContexts(
          <WishListItem
            itemId={20}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
            editable
          />
        )

        expect(wrapper.getByTestId('editWishListItem20')).toBeTruthy()
      })

      test('has increment and decrement icons', () => {
        const wrapper = renderInContexts(
          <WishListItem
            itemId={20}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
            editable
          />
        )

        expect(wrapper.getByTestId('incrementWishListItem20')).toBeTruthy()
        expect(wrapper.getByTestId('decrementWishListItem20')).toBeTruthy()
      })

      test('matches snapshot', () => {
        const wrapper = renderInContexts(
          <WishListItem
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
          <WishListItem
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
        expect(wrapper.queryByText(/To enchant/)).toBeFalsy()
      })

      test('truncates unit weight values appropriately', () => {
        const wrapper = renderInContexts(
          <WishListItem
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
          <WishListItem
            itemId={20}
            listTitle="All Items"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
          />
        )

        expect(wrapper.queryByTestId('destroyWishListItem20')).toBeFalsy()
      })

      test('has no edit icon', () => {
        const wrapper = renderInContexts(
          <WishListItem
            itemId={20}
            listTitle="All Items"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
          />
        )

        expect(wrapper.queryByTestId('editWishListItem20')).toBeFalsy()
      })

      test('has no increment or decrement icons', () => {
        const wrapper = renderInContexts(
          <WishListItem
            itemId={20}
            listTitle="All Items"
            description="Silver Necklace"
            quantity={2}
            unitWeight={1.0}
            notes="To enchant"
          />
        )

        expect(wrapper.queryByTestId('incrementWishListItem20')).toBeFalsy()
        expect(wrapper.queryByTestId('decrementWishListItem20')).toBeFalsy()
      })

      test('matches snapshot', () => {
        const wrapper = renderInContexts(
          <WishListItem
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
        listsContextValue = wishListsContextValue
        window.confirm = ogConfirm
      })

      test("calls the context's destroyWishListItem function with its itemId", async () => {
        const destroyWishListItem = vitest.fn()
        listsContextValue = {
          ...wishListsContextValue,
          destroyWishListItem,
        }

        const wrapper = renderInContexts(
          <WishListItem
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

        const destroyIcon = wrapper.getByTestId('destroyWishListItem33')

        await act(() => fireEvent.click(destroyIcon))

        expect(window.confirm).toHaveBeenCalled()
        expect(destroyWishListItem).toHaveBeenCalledWith(33)
      })
    })

    describe('when the user cancels deletion', () => {
      const ogConfirm = window.confirm

      afterEach(() => {
        listsContextValue = wishListsContextValue
        window.confirm = ogConfirm
      })

      test("doesn't call the destroyWishListItem function", async () => {
        const destroyWishListItem = vitest.fn()
        listsContextValue = {
          ...wishListsContextValue,
          destroyWishListItem,
        }

        const wrapper = renderInContexts(
          <WishListItem
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

        const destroyIcon = wrapper.getByTestId('destroyWishListItem33')

        await act(() => fireEvent.click(destroyIcon))

        expect(window.confirm).toHaveBeenCalledOnce()
        expect(destroyWishListItem).not.toHaveBeenCalled()
      })
    })
  })

  describe('incrementing the list item quantity', () => {
    afterEach(() => {
      listsContextValue = wishListsContextValue
    })

    test('increments the quantity at the API', () => {
      const updateWishListItem = vitest.fn()
      listsContextValue = { ...listsContextValue, updateWishListItem }

      const wrapper = renderInContexts(
        <WishListItem
          itemId={33}
          listTitle="Clothing"
          description="Silver Necklace"
          quantity={2}
          unitWeight={0.3}
          notes="To enchant"
          editable
        />
      )

      const incrementIcon = wrapper.getByTestId('incrementWishListItem33')

      act(() => {
        fireEvent.click(incrementIcon)
      })

      expect(updateWishListItem).toHaveBeenCalledWith(
        33,
        { quantity: 3 },
        expect.any(Function),
        expect.any(Function)
      )
    })
  })

  describe('decrementing the list item quantity', () => {
    afterEach(() => {
      listsContextValue = wishListsContextValue
    })

    describe('when the quantity is greater than 1', () => {
      test('decrements the quantity at the API', async () => {
        const updateWishListItem = vitest.fn()
        listsContextValue = { ...listsContextValue, updateWishListItem }

        const wrapper = renderInContexts(
          <WishListItem
            itemId={33}
            listTitle="Clothing"
            description="Silver Necklace"
            quantity={2}
            unitWeight={0.3}
            notes="To enchant"
            editable
          />
        )

        const decrementIcon = wrapper.getByTestId('decrementWishListItem33')

        await act(() => fireEvent.click(decrementIcon))

        expect(updateWishListItem).toHaveBeenCalledWith(
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
        listsContextValue = wishListsContextValue
        window.confirm = ogConfirm
      })

      test('prompts the user to destroy the item', async () => {
        const wrapper = renderInContexts(
          <WishListItem
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

        const decrementIcon = wrapper.getByTestId('decrementWishListItem33')

        await act(() => fireEvent.click(decrementIcon))

        expect(window.confirm).toHaveBeenCalledOnce()
      })

      test('destroys the item if the user confirms', async () => {
        const destroyWishListItem = vitest.fn()
        listsContextValue = {
          ...wishListsContextValue,
          destroyWishListItem,
        }

        const wrapper = renderInContexts(
          <WishListItem
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

        const decrementIcon = wrapper.getByTestId('decrementWishListItem33')

        await act(() => fireEvent.click(decrementIcon))

        expect(window.confirm).toHaveBeenCalledOnce()
        expect(destroyWishListItem).toHaveBeenCalledWith(
          33,
          null,
          expect.any(Function)
        )
      })
    })
  })
})
