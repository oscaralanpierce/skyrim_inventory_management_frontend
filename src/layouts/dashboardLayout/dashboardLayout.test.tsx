import { describe, test, expect } from 'vitest'
import { setupServer } from 'msw/node'
import { waitFor } from '@testing-library/react'
import { BASE_APP_URI, renderAuthenticated } from '../../support/testUtils'
import { gamesContextValue } from '../../support/data/contextValues'
import {
  getGamesAllSuccess,
  getGamesEmptySuccess,
} from '../../support/msw/games'
import { GamesContext, GamesProvider } from '../../contexts/gamesContext'
import { PageProvider } from '../../contexts/pageContext'
import DashboardLayout from './dashboardLayout'
import paths from '../../routing/paths'

describe('<DashboardLayout>', () => {
  describe('when a title is given', () => {
    test('renders the title and content', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <DashboardLayout title="Page Title">Hello World</DashboardLayout>
          </GamesContext.Provider>
        </PageProvider>
      )
      expect(wrapper).toBeTruthy()

      const h2 = wrapper.container.querySelector('h2')
      expect(h2?.textContent).toBe('Page Title')

      expect(wrapper.getByText('Hello World')).toBeTruthy()
    })

    test('renders the DashboardHeader', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <DashboardLayout title="Page Title">Hello World</DashboardLayout>
          </GamesContext.Provider>
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
          <GamesContext.Provider value={gamesContextValue}>
            <DashboardLayout title="Page Title">Hello World</DashboardLayout>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(wrapper.queryByTestId('styledSelect')).toBeFalsy()
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <DashboardLayout title="Page Title">Hello World</DashboardLayout>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when no title is given', () => {
    test('displays content but not an h2 or hr', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <DashboardLayout>Hello World</DashboardLayout>
          </GamesContext.Provider>
        </PageProvider>
      )
      expect(wrapper).toBeTruthy()

      const h2 = wrapper.container.querySelector('h2')
      expect(h2).toBeFalsy()

      const hr = wrapper.container.querySelector('hr')
      expect(hr).toBeFalsy()

      expect(wrapper.getByText('Hello World')).toBeTruthy()
    })

    test('renders the DashboardHeader', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <DashboardLayout>Hello World</DashboardLayout>
          </GamesContext.Provider>
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
          <GamesContext.Provider value={gamesContextValue}>
            <DashboardLayout>Hello World</DashboardLayout>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(wrapper.queryByTestId('styledSelect')).toBeFalsy()
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext.Provider value={gamesContextValue}>
            <DashboardLayout>Hello World</DashboardLayout>
          </GamesContext.Provider>
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when includeGameSelector is set to true', () => {
    describe('when games are returned from the API', () => {
      const mockServer = setupServer(getGamesAllSuccess)

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('renders the select box', () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <DashboardLayout title="Your Games" includeGameSelector>
                Hello World
              </DashboardLayout>
            </GamesProvider>
          </PageProvider>
        )

        expect(wrapper).toBeTruthy()
        expect(wrapper.getByTestId('styledSelect')).toBeTruthy()
      })

      test('includes all the games on the list', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <DashboardLayout title="Your Games" includeGameSelector>
                Hello World
              </DashboardLayout>
            </GamesProvider>
          </PageProvider>
        )

        const selectedOption = wrapper.getByTestId('selectedOption')

        // Initial loading value
        expect(selectedOption.textContent).toEqual('Games loading...')

        await waitFor(() => {
          expect(selectedOption.textContent).toEqual('')
          expect(wrapper.getByText('My Game 1')).toBeTruthy()
          expect(wrapper.getByText('My Game 2')).toBeTruthy()
          expect(wrapper.getByText('Game with a really real...')).toBeTruthy()
        })
      })

      test('matches snapshot', () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <DashboardLayout title="Your Games" includeGameSelector>
                Hello World
              </DashboardLayout>
            </GamesProvider>
          </PageProvider>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when there are no games available', () => {
      const mockServer = setupServer(getGamesEmptySuccess)

      beforeAll(() => mockServer.listen())
      beforeEach(() => mockServer.resetHandlers())
      afterAll(() => mockServer.close())

      test('displays a placeholder', async () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <DashboardLayout includeGameSelector>Hello World</DashboardLayout>
            </GamesProvider>
          </PageProvider>
        )

        const selectedOption = wrapper.getByTestId('selectedOption')
        expect(selectedOption.textContent).toEqual('Games loading...')

        await waitFor(() => {
          expect(selectedOption.textContent).toEqual('No games available')
        })
      })

      test('matches snapshot', () => {
        const wrapper = renderAuthenticated(
          <PageProvider>
            <GamesProvider>
              <DashboardLayout includeGameSelector>Hello World</DashboardLayout>
            </GamesProvider>
          </PageProvider>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when a game is selected in the query string', () => {
      describe('when the selected game corresponds to a game in the games array', () => {
        const mockServer = setupServer(getGamesAllSuccess)

        beforeAll(() => mockServer.listen())
        beforeEach(() => mockServer.resetHandlers())
        afterAll(() => mockServer.close())

        test('sets the selected game as the default option', async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesProvider>
                <DashboardLayout includeGameSelector>
                  Hello World
                </DashboardLayout>
              </GamesProvider>
            </PageProvider>,
            'http://localhost:5173/shoppingLists?gameId=51'
          )

          const selectedOption = wrapper.getByTestId('selectedOption')
          expect(selectedOption.textContent).toEqual('Games loading...')

          await waitFor(() => {
            expect(selectedOption.textContent).toEqual('My Game 2')
          })
        })

        test('matches snapshot', () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesContext.Provider value={gamesContextValue}>
                <DashboardLayout includeGameSelector>
                  Hello World
                </DashboardLayout>
              </GamesContext.Provider>
            </PageProvider>,
            'http://localhost:5173/shoppingLists?gameId=51'
          )

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('when the selected game does not correspond to a game in the games array', () => {
        const mockServer = setupServer(getGamesAllSuccess)

        beforeAll(() => mockServer.listen())
        beforeEach(() => mockServer.resetHandlers())
        afterAll(() => mockServer.close())

        test('sets the selected game as the default option', async () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesProvider>
                <DashboardLayout includeGameSelector>
                  Hello World
                </DashboardLayout>
              </GamesProvider>
            </PageProvider>,
            'http://localhost:5173/shoppingLists?gameId=67'
          )

          const selectedOption = wrapper.getByTestId('selectedOption')
          expect(selectedOption.textContent).toEqual('Games loading...')

          await waitFor(() => {
            expect(selectedOption.textContent).toEqual('')
          })
        })

        test('matches snapshot', () => {
          const wrapper = renderAuthenticated(
            <PageProvider>
              <GamesContext.Provider value={gamesContextValue}>
                <DashboardLayout includeGameSelector>
                  Hello World
                </DashboardLayout>
              </GamesContext.Provider>
            </PageProvider>,
            'http://localhost:5173/shoppingLists?gameId=67'
          )

          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})
