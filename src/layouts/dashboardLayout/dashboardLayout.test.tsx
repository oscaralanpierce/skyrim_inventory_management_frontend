import { describe, test, expect } from 'vitest'
import { setupServer } from 'msw/node'
import { BASE_APP_URI, renderAuthenticated } from '../../support/testUtils'
import { gamesContextValue } from '../../support/data/contextValues'
import { getGamesAllSuccess } from '../../support/msw/games'
import { GamesContext, GamesProvider } from '../../contexts/gamesContext'
import DashboardLayout from './dashboardLayout'
import paths from '../../routing/paths'

describe('<DashboardLayout>', () => {
  describe('when a title is given', () => {
    test('DashboardLayout renders the title and content', () => {
      const wrapper = renderAuthenticated(
        <GamesContext.Provider value={gamesContextValue}>
          <DashboardLayout title="Page Title">Hello World</DashboardLayout>
        </GamesContext.Provider>
      )
      expect(wrapper).toBeTruthy()

      const h2 = wrapper.container.querySelector('h2')
      expect(h2?.textContent).toBe('Page Title')

      expect(wrapper.getByText('Hello World')).toBeTruthy()
    })

    test('DashboardLayout renders the DashboardHeader', () => {
      const wrapper = renderAuthenticated(
        <GamesContext.Provider value={gamesContextValue}>
          <DashboardLayout title="Page Title">Hello World</DashboardLayout>
        </GamesContext.Provider>
      )

      const a = wrapper.container.querySelector('a')
      expect(a?.textContent).toBe('Skyrim Inventory Management')
      expect(a?.href).toBe(`${BASE_APP_URI}${paths.dashboard.main}`)

      expect(wrapper.getByText('Edna St. Vincent Millay')).toBeTruthy()
      expect(wrapper.getByText('edna@gmail.com')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <GamesContext.Provider value={gamesContextValue}>
          <DashboardLayout title="Page Title">Hello World</DashboardLayout>
        </GamesContext.Provider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when no title is given', () => {
    test('DashboardLayout displays content but not an h2 or hr', () => {
      const wrapper = renderAuthenticated(
        <GamesContext.Provider value={gamesContextValue}>
          <DashboardLayout>Hello World</DashboardLayout>
        </GamesContext.Provider>
      )
      expect(wrapper).toBeTruthy()

      const h2 = wrapper.container.querySelector('h2')
      expect(h2).toBeFalsy()

      const hr = wrapper.container.querySelector('hr')
      expect(hr).toBeFalsy()

      expect(wrapper.getByText('Hello World')).toBeTruthy()
    })

    test('DashboardLayout renders the DashboardHeader', () => {
      const wrapper = renderAuthenticated(
        <GamesContext.Provider value={gamesContextValue}>
          <DashboardLayout>Hello World</DashboardLayout>
        </GamesContext.Provider>
      )

      const a = wrapper.container.querySelector('a')
      expect(a?.textContent).toBe('Skyrim Inventory Management')
      expect(a?.href).toBe(`${BASE_APP_URI}${paths.dashboard.main}`)

      expect(wrapper.getByText('Edna St. Vincent Millay')).toBeTruthy()
      expect(wrapper.getByText('edna@gmail.com')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <GamesContext.Provider value={gamesContextValue}>
          <DashboardLayout>Hello World</DashboardLayout>
        </GamesContext.Provider>
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
          <GamesProvider>
            <DashboardLayout title="Your Games" includeGameSelector>
              Hello World
            </DashboardLayout>
          </GamesProvider>
        )

        expect(wrapper).toBeTruthy()
        expect(wrapper.getByTestId('styledSelect')).toBeTruthy()
      })

      test('includes all the games on the list')

      test('selects the first game by default')

      test('matches snapshot')
    })

    describe('when there are no games available')

    describe('when a game is selected in the query string', () => {
      test('sets the selected game as the default option')

      test('matches snapshot')
    })
  })
})
