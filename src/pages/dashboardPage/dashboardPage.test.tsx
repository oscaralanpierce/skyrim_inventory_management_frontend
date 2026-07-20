import { describe, test, expect } from 'vitest'
import {
  BASE_APP_URI,
  renderAuthenticated,
  renderAuthLoading,
} from '../../support/testUtils'
import { PageProvider } from '../../contexts/pageContext'
import DashboardPage from './dashboardPage'

describe('<DashboardPage />', () => {
  test('DashboardPage displays the header', () => {
    const wrapper = renderAuthenticated(
      <PageProvider>
        <DashboardPage />
      </PageProvider>
    )
    expect(wrapper).toBeTruthy()

    const h1 = wrapper.container.querySelector('h1')
    // This is because 'Skyrim Inventory 'Management' and 'S. I. M.' are
    // both in the DOM but visible at different viewport sizes. Since
    // vitest and testing-library don't give us the ability to set a viewport
    // size for tests, both will show up here.
    expect(h1?.textContent).toBe('Skyrim Inventory ManagementS. I. M.')
  })

  test('DashboardPage displays user info', () => {
    const wrapper = renderAuthenticated(
      <PageProvider>
        <DashboardPage />
      </PageProvider>
    )

    expect(wrapper.getByText('Edna St. Vincent Millay')).toBeTruthy()
    expect(wrapper.getByText('edna@gmail.com')).toBeTruthy()

    const img = wrapper.container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img?.src).toEqual(`${BASE_APP_URI}/src/support/testProfileImg.png`)
  })

  test('DashboardPage displays the navigation mosaic', () => {
    const wrapper = renderAuthenticated(
      <PageProvider>
        <DashboardPage />
      </PageProvider>
    )

    expect(wrapper.getByText('Your Playthroughs')).toBeTruthy()
    expect(wrapper.getByText('Your Wish Lists')).toBeTruthy()
    expect(wrapper.getByText('Your Inventory')).toBeTruthy()
    expect(wrapper.getByText('Nav Link 4')).toBeTruthy()
    expect(wrapper.getByText('Nav Link 5')).toBeTruthy()
  })

  test('matches snapshot', () => {
    const wrapper = renderAuthenticated(
      <PageProvider>
        <DashboardPage />
      </PageProvider>
    )
    expect(wrapper).toMatchSnapshot()
  })

  describe('when auth is loading', () => {
    test('DashboardPage displays the pulse loader', () => {
      const wrapper = renderAuthLoading(
        <PageProvider>
          <DashboardPage />
        </PageProvider>
      )

      expect(wrapper.getByTestId('pulseLoader')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthLoading(
        <PageProvider>
          <DashboardPage />
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})
