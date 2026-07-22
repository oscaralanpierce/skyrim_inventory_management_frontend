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
  playthroughsContextValue,
  playthroughsContextValueError,
  playthroughsContextValueLoading,
  wishListsContextValue,
  wishListsContextValueError,
  wishListsContextValueLoading,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext } from '../../contexts/playthroughsContext'
import {
  WishListsContext,
  WishListsProvider,
} from '../../contexts/wishListsContext'
import WishListCreateForm from './wishListCreateForm'

const renderWithContexts = (ui: ReactElement) => {
  return renderAuthenticated(
    <PageProvider>
      <PlaythroughsContext value={playthroughsContextValue}>
        <WishListsProvider>{ui}</WishListsProvider>
      </PlaythroughsContext>
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
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext
              value={wishListsContextValueLoading}
            >
              <WishListCreateForm />
            </WishListsContext>
          </PlaythroughsContext>
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
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext
              value={wishListsContextValueError}
            >
              <WishListCreateForm />
            </WishListsContext>
          </PlaythroughsContext>
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

    test('is disabled when playthroughs are loading', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValueLoading}>
            <WishListsContext value={wishListsContextValue}>
              <WishListCreateForm />
            </WishListsContext>
          </PlaythroughsContext>
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

    test('is disabled when there is a playthrough loading error', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValueError}>
            <WishListsContext value={wishListsContextValue}>
              <WishListCreateForm />
            </WishListsContext>
          </PlaythroughsContext>
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

    test('is enabled when both playthroughs and wish lists have loaded', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <WishListsContext value={wishListsContextValue}>
              <WishListCreateForm />
            </WishListsContext>
          </PlaythroughsContext>
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
      test('calls the createWishList function', async () => {
        const createWishList = vitest.fn()
        const contextValue = {
          ...wishListsContextValue,
          createWishList,
        }

        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsContext value={playthroughsContextValue}>
              <WishListsContext value={contextValue}>
                <WishListCreateForm />
              </WishListsContext>
            </PlaythroughsContext>
          </PageProvider>
        )

        const input = wrapper.getByPlaceholderText('Title')
        const button = wrapper.getByText('Create')

        fireEvent.change(input, { target: { value: 'New Wish List' } })

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
            <PlaythroughsContext value={playthroughsContextValue}>
              <WishListsContext value={contextValue}>
                <WishListCreateForm />
              </WishListsContext>
            </PlaythroughsContext>
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
