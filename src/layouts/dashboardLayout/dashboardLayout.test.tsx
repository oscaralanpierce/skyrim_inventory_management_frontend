import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { waitFor } from '@testing-library/react'
import { BASE_APP_URI, renderAuthenticated } from '../../support/testUtils'
import { playthroughsContextValue } from '../../support/data/contextValues'
import {
  getPlaythroughsAllSuccess,
  getPlaythroughsEmptySuccess,
} from '../../support/msw/playthroughs'
import { PlaythroughsContext, PlaythroughsProvider } from '../../contexts/playthroughsContext'
import { PageProvider } from '../../contexts/pageContext'
import DashboardLayout from './dashboardLayout'
import paths from '../../routing/paths'

describe('<DashboardLayout>', () => {
  describe('when a title is given', () => {
    test('renders the title and content', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <DashboardLayout title="Page Title">Hello World</DashboardLayout>
          </PlaythroughsContext>
        </PageProvider>
      )

      const h2 = wrapper.container.querySelector('h2')
      expect(h2?.textContent).toBe('Page Title')

      expect(wrapper.getByText('Hello World')).toBeTruthy()
    })

    test('renders the DashboardHeader', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <DashboardLayout title="Page Title">Hello World</DashboardLayout>
          </PlaythroughsContext>
        </PageProvider>
      )

      const a = wrapper.container.querySelector('a')
      expect(a?.textContent).toBe('Skyrim Inventory Management')
      expect(a?.href).toBe(`${BASE_APP_URI}${paths.dashboard.main}`)

      expect(wrapper.getByText('Edna St. Vincent Millay')).toBeTruthy()
      expect(wrapper.getByText('edna@gmail.com')).toBeTruthy()
    })

    test("doesn't display the StyledSelect", () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <DashboardLayout title="Page Title">Hello World</DashboardLayout>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper.queryByTestId('styledSelect')).toBeFalsy()
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <DashboardLayout title="Page Title">Hello World</DashboardLayout>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when no title is given', () => {
    test('displays content but not an h2 or hr', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <DashboardLayout>Hello World</DashboardLayout>
          </PlaythroughsContext>
        </PageProvider>
      )

      const h2 = wrapper.container.querySelector('h2')
      expect(h2).toBeFalsy()

      const hr = wrapper.container.querySelector('hr')
      expect(hr).toBeFalsy()

      expect(wrapper.getByText('Hello World')).toBeTruthy()
    })

    test('renders the DashboardHeader', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <DashboardLayout>Hello World</DashboardLayout>
          </PlaythroughsContext>
        </PageProvider>
      )

      const a = wrapper.container.querySelector('a')
      expect(a?.textContent).toBe('Skyrim Inventory Management')
      expect(a?.href).toBe(`${BASE_APP_URI}${paths.dashboard.main}`)

      expect(wrapper.getByText('Edna St. Vincent Millay')).toBeTruthy()
      expect(wrapper.getByText('edna@gmail.com')).toBeTruthy()
    })

    test("doesn't render the StyledSelect", () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <DashboardLayout>Hello World</DashboardLayout>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper.queryByTestId('styledSelect')).toBeFalsy()
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <DashboardLayout>Hello World</DashboardLayout>
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when includePlaythroughSelector is set to true', () => {
    describe('when playthroughs are returned from the API', () => {
      const mockServer = setupServer(getPlaythroughsAllSuccess)

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('renders the select box', () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <DashboardLayout title="Your Playthroughs" includePlaythroughSelector>
                Hello World
              </DashboardLayout>
            </PlaythroughsProvider>
          </PageProvider>
        )

        expect(wrapper.getByTestId('styledSelect')).toBeTruthy()
      })

      test.skip('includes all the playthroughs on the list', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <DashboardLayout title="Your Playthroughs" includePlaythroughSelector>
                Hello World
              </DashboardLayout>
            </PlaythroughsProvider>
          </PageProvider>
        )

        const selectedOption = wrapper.getByTestId('selectedOption')

        // Initial loading value
        expect(selectedOption.textContent).toEqual('Playthroughs loading...')

        await waitFor(() => {
          expect(selectedOption.textContent).toEqual('My Playthrough 1')
          expect(wrapper.getAllByText('My Playthrough 1').length).toEqual(2)
          expect(wrapper.getByText('My Playthrough 2')).toBeTruthy()
          expect(wrapper.getByText('Playthrough with a really real...')).toBeTruthy()
        })
      })

      test('matches snapshot', () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <DashboardLayout title="Your Playthroughs" includePlaythroughSelector>
                Hello World
              </DashboardLayout>
            </PlaythroughsProvider>
          </PageProvider>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when there are no playthroughs available', () => {
      const mockServer = setupServer(getPlaythroughsEmptySuccess)

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test.skip('displays a placeholder', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <DashboardLayout includePlaythroughSelector>Hello World</DashboardLayout>
            </PlaythroughsProvider>
          </PageProvider>
        )

        const selectedOption = wrapper.getByTestId('selectedOption')
        expect(selectedOption.textContent).toEqual('Playthroughs loading...')

        await waitFor(() => {
          expect(selectedOption.textContent).toEqual('No playthroughs available')
        })
      })

      test('matches snapshot', () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <PlaythroughsProvider>
              <DashboardLayout includePlaythroughSelector>Hello World</DashboardLayout>
            </PlaythroughsProvider>
          </PageProvider>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when a playthrough is selected in the query string', () => {
      describe('when the selected playthrough corresponds to a playthrough in the playthroughs array', () => {
        const mockServer = setupServer(getPlaythroughsAllSuccess)

        beforeAll(() => mockServer.listen())
        beforeEach(() => mockServer.resetHandlers())
        afterAll(() => mockServer.close())

        test.skip('sets the selected playthrough as the default option', async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <PlaythroughsProvider>
                <DashboardLayout includePlaythroughSelector>
                  Hello World
                </DashboardLayout>
              </PlaythroughsProvider>
            </PageProvider>,
            'http://localhost:5173/wish_lists?playthroughId=51'
          )

          const selectedOption = wrapper.getByTestId('selectedOption')
          expect(selectedOption.textContent).toEqual('Playthroughs loading...')

          await waitFor(() => {
            expect(selectedOption.textContent).toEqual('My Playthrough 2')
          })
        })

        test('matches snapshot', () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <PlaythroughsContext value={playthroughsContextValue}>
                <DashboardLayout includePlaythroughSelector>
                  Hello World
                </DashboardLayout>
              </PlaythroughsContext>
            </PageProvider>,
            'http://localhost:5173/wish_lists?playthroughId=51'
          )

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('when the selected playthrough does not correspond to a playthrough in the playthroughs array', () => {
        const mockServer = setupServer(getPlaythroughsAllSuccess)

        beforeAll(() => mockServer.listen())
        beforeEach(() => mockServer.resetHandlers())
        afterAll(() => mockServer.close())

        test.skip('sets the selected playthrough as the default option', async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <PlaythroughsProvider>
                <DashboardLayout includePlaythroughSelector>
                  Hello World
                </DashboardLayout>
              </PlaythroughsProvider>
            </PageProvider>,
            'http://localhost:5173/wish_lists?playthroughId=67'
          )

          const selectedOption = wrapper.getByTestId('selectedOption')
          expect(selectedOption.textContent).toEqual('Playthroughs loading...')

          await waitFor(() => {
            expect(selectedOption.textContent).toEqual('')
          })
        })

        test('matches snapshot', () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <PlaythroughsContext value={playthroughsContextValue}>
                <DashboardLayout includePlaythroughSelector>
                  Hello World
                </DashboardLayout>
              </PlaythroughsContext>
            </PageProvider>,
            'http://localhost:5173/wish_lists?playthroughId=67'
          )

          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})
