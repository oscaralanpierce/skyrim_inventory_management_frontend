import { describe, test, expect } from 'vitest'
import { renderAuthenticated } from '../../support/testUtils'
import {
  playthroughsContextValue,
  wishListsContextValue,
  wishListsContextValueEmpty,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext } from '../../contexts/playthroughsContext'
import { WishListsContext } from '../../contexts/wishListsContext'
import WishListGrouping from './wishListGrouping'

describe('WishListGrouping', () => {
  describe('when there are wish lists', () => {
    test('displays each list', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext value={wishListsContextValue}>
              <WishListGrouping />
            </WishListsContext>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper).toBeTruthy()

      expect(wrapper.getByText('All Items')).toBeTruthy()
      expect(wrapper.getByText('Honeyside')).toBeTruthy()
      expect(wrapper.getByText('Breezehome')).toBeTruthy()
      expect(wrapper.getByText('Hjerim')).toBeTruthy()

      // There should be list items on each list
      expect(wrapper.getAllByText('Dwarven Cog').length).toEqual(3)
      expect(
        wrapper.getAllByText(
          'This item has a really really really really really long description for testing purposes'
        ).length
      ).toEqual(2)
    })

    test('displays the destroy icon for editable lists only', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext value={wishListsContextValue}>
              <WishListGrouping />
            </WishListsContext>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper.getByTestId('destroyWishList4')).toBeTruthy()
      expect(wrapper.getByTestId('destroyWishList5')).toBeTruthy()
      expect(wrapper.getByTestId('destroyWishList6')).toBeTruthy()

      // The aggregate list should not be editable
      expect(wrapper.queryByTestId('destroyWishList3')).toBeFalsy()
    })

    test('displays the destroy icon for editable list items only', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext value={wishListsContextValue}>
              <WishListGrouping />
            </WishListsContext>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper.queryByTestId('destroyWishListItem6')).toBeFalsy()
      expect(wrapper.queryByTestId('destroyWishListItem9')).toBeFalsy()
      expect(wrapper.getByTestId('destroyWishListItem7')).toBeTruthy()
      expect(wrapper.getByTestId('destroyWishListItem8')).toBeTruthy()
      expect(wrapper.getByTestId('destroyWishListItem5')).toBeTruthy()
    })

    test('displays the edit icon for editable lists only', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext value={wishListsContextValue}>
              <WishListGrouping />
            </WishListsContext>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper.getByTestId('editWishList4')).toBeTruthy()
      expect(wrapper.getByTestId('editWishList5')).toBeTruthy()
      expect(wrapper.getByTestId('editWishList6')).toBeTruthy()

      // The aggregate list should not be editable
      expect(wrapper.queryByTestId('editWishList3')).toBeFalsy()
    })

    test('displays the edit icon for editable list items only', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext value={wishListsContextValue}>
              <WishListGrouping />
            </WishListsContext>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper.queryByTestId('editWishListItem6')).toBeFalsy()
      expect(wrapper.queryByTestId('editWishListItem9')).toBeFalsy()
      expect(wrapper.getByTestId('editWishListItem7')).toBeTruthy()
      expect(wrapper.getByTestId('editWishListItem8')).toBeTruthy()
      expect(wrapper.getByTestId('editWishListItem5')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext value={wishListsContextValue}>
              <WishListGrouping />
            </WishListsContext>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when there are no wish lists', () => {
    test('displays a message that there are no lists for this playthrough', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext
              value={wishListsContextValueEmpty}
            >
              <WishListGrouping />
            </WishListsContext>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper.getByText('This playthrough has no wish lists.')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext
              value={wishListsContextValueEmpty}
            >
              <WishListGrouping />
            </WishListsContext>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})
