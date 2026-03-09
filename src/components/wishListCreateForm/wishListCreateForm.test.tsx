import { type ReactElement } from 'react'
import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  vitest,
} from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { renderAuthenticated } from '../../support/testUtils'
import { getWishListsSuccess } from '../../support/msw/handlers'
import {
  gamesContextValue,
  gamesContextValueError,
  gamesContextValueLoading,
  wishListsContextValue,
  wishListsContextValueError,
  wishListsContextValueLoading,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import {
  WishListsContext,
  WishListsProvider,
} from '../../contexts/wishListsContext'
import WishListCreateForm from './wishListCreateForm'

const renderWithContexts = (ui: ReactElement) => {
  return renderAuthenticated(
    <PageProvider>
      <GamesContext value={gamesContextValue}>
        <WishListsProvider>{ui}</WishListsProvider>
      </GamesContext>
    </PageProvider>
  )
}

describe('WishListCreateForm', () => {
  describe('displaying the form', () => {
    const mockServer = setupServer(getWishListsSuccess)

    beforeAll(() => mockServer.listen())
    beforeEach(() => mockServer.resetHandlers())
    afterAll(() => mockServer.close())

    test('has the correct form fields', () => {
      const wrapper = renderWithContexts(<WishListCreateForm />)

      expect(wrapper.getByPlaceholderText('Title')).toBeTruthy()
      expect(wrapper.getByText('Create')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderWithContexts(<WishListCreateForm />)

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('disabling behaviour', () => {
    test('is disabled when the wish lists are loading', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext value={gamesContextValue}>
            <WishListsContext
              value={wishListsContextValueLoading}
            >
              <WishListCreateForm />
            </WishListsContext>
          </GamesContext>
        </PageProvider>
      )

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes.getNamedItem('disabled')
      ).toBeTruthy()
      expect(
        wrapper.getByText('Create').attributes.getNamedItem('disabled')
      ).toBeTruthy()
    })

    test('is disabled when there is a wish list loading error', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext value={gamesContextValue}>
            <WishListsContext
              value={wishListsContextValueError}
            >
              <WishListCreateForm />
            </WishListsContext>
          </GamesContext>
        </PageProvider>
      )

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes.getNamedItem('disabled')
      ).toBeTruthy()
      expect(
        wrapper.getByText('Create').attributes.getNamedItem('disabled')
      ).toBeTruthy()
    })

    test('is disabled when games are loading', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext value={gamesContextValueLoading}>
            <WishListsContext value={wishListsContextValue}>
              <WishListCreateForm />
            </WishListsContext>
          </GamesContext>
        </PageProvider>
      )

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes.getNamedItem('disabled')
      ).toBeTruthy()
      expect(
        wrapper.getByText('Create').attributes.getNamedItem('disabled')
      ).toBeTruthy()
    })

    test('is disabled when there is a game loading error', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext value={gamesContextValueError}>
            <WishListsContext value={wishListsContextValue}>
              <WishListCreateForm />
            </WishListsContext>
          </GamesContext>
        </PageProvider>
      )

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes.getNamedItem('disabled')
      ).toBeTruthy()
      expect(
        wrapper.getByText('Create').attributes.getNamedItem('disabled')
      ).toBeTruthy()
    })

    test('is enabled when both games and wish lists have loaded', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext value={gamesContextValue}>
            <WishListsContext value={wishListsContextValue}>
              <WishListCreateForm />
            </WishListsContext>
          </GamesContext>
        </PageProvider>
      )

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes.getNamedItem('disabled')
      ).toBeFalsy()
      expect(
        wrapper.getByText('Create').attributes.getNamedItem('disabled')
      ).toBeFalsy()
    })
  })

  describe('submitting the form', () => {
    describe('when the form is enabled', () => {
      test('trims the title and calls the createWishList function', async () => {
        const createWishList = vitest.fn()
        const contextValue = {
          ...wishListsContextValue,
          createWishList,
        }

        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext value={gamesContextValue}>
              <WishListsContext value={contextValue}>
                <WishListCreateForm />
              </WishListsContext>
            </GamesContext>
          </PageProvider>
        )

        const input = wrapper.getByPlaceholderText('Title')
        const button = wrapper.getByText('Create')

        fireEvent.change(input, { target: { value: '   New Wish List  ' } })

        await act(() => fireEvent.click(button))

        expect(createWishList).toHaveBeenCalledWith(
          { title: 'New Wish List' },
          expect.any(Function),
          expect.any(Function)
        )
      })
    })

    describe('when the form is disabled', () => {
      test("doesn't call the createWishList function", () => {
        const createWishList = vitest.fn()
        const contextValue = {
          ...wishListsContextValueLoading,
          createWishList,
        }

        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesContext value={gamesContextValue}>
              <WishListsContext value={contextValue}>
                <WishListCreateForm />
              </WishListsContext>
            </GamesContext>
          </PageProvider>
        )

        const button = wrapper.getByText('Create')

        act(() => {
          fireEvent.click(button)
        })

        expect(createWishList).not.toHaveBeenCalled()
      })
    })
  })
})
