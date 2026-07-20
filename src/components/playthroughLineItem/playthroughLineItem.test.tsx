import { describe, test, expect, vitest } from 'vitest'
import { act } from '@testing-library/react'
import { renderAuthenticated } from '../../support/testUtils'
import { playthroughsContextValue } from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext } from '../../contexts/playthroughsContext'
import PlaythroughLineItem from './playthroughLineItem'

// This component can't really be tested because Vitest fucking sucks.
// It won't get the style off the element, even if the style is computed
// with JavaScript, and because react-animate-height uses a CSS-based
// approach rather than adding and removing an element, there's just no
// way to test whether the user can see the description or not.
describe('PlaythroughLineItem', () => {
  test('matches snapshot', () => {
    const wrapper = renderAuthenticated(
      <PageProvider>
        <PlaythroughsContext value={playthroughsContextValue}>
          <PlaythroughLineItem
            playthroughId={4}
            name="De finibus bonorum et malorum"
            description="This is my playthrough"
          />
        </PlaythroughsContext>
      </PageProvider>
    )
    expect(wrapper).toBeTruthy()
    expect(wrapper).toMatchSnapshot()
  })

  describe('destroying the playthrough', () => {
    test('destroys the playthrough when the button is clicked', () => {
      const contextValue = {
        ...playthroughsContextValue,
        destroyPlaythrough: vitest.fn().mockImplementation((_playthroughId: number) => {}),
      }

      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={contextValue}>
            <PlaythroughLineItem
              playthroughId={4}
              name="De finibus bonorum et malorum"
              description="This is my playthrough"
            />
          </PlaythroughsContext>
        </PageProvider>
      )

      window.confirm = vitest.fn().mockImplementation(() => true)

      const xIcon = wrapper.getByTestId('destroyPlaythrough4')
      act(() => xIcon.click())

      expect(contextValue.destroyPlaythrough).toHaveBeenCalledWith(4)
    })

    test("doesn't destroy the playthrough when the user cancels", () => {
      const contextValue = {
        ...playthroughsContextValue,
        destroyPlaythrough: vitest.fn().mockImplementation((_playthroughId: number) => {}),
      }

      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={contextValue}>
            <PlaythroughLineItem
              playthroughId={4}
              name="De finibus bonorum et malorum"
              description="This is my playthrough"
            />
          </PlaythroughsContext>
        </PageProvider>
      )

      window.confirm = vitest.fn().mockImplementation(() => false)

      const xIcon = wrapper.getByTestId('destroyPlaythrough4')
      act(() => xIcon.click())

      expect(contextValue.destroyPlaythrough).not.toHaveBeenCalled()
    })
  })
})
