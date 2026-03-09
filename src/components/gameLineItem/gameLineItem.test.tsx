import { describe, test, expect, vitest } from 'vitest'
import { act } from '@testing-library/react'
import { renderAuthenticated } from '../../support/testUtils'
import { gamesContextValue } from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import GameLineItem from './gameLineItem'

// This component can't really be tested because Vitest fucking sucks.
// It won't get the style off the element, even if the style is computed
// with JavaScript, and because react-animate-height uses a CSS-based
// approach rather than adding and removing an element, there's just no
// way to test whether the user can see the description or not.
describe('GameLineItem', () => {
  test('matches snapshot', () => {
    const wrapper = renderAuthenticated(
      <PageProvider>
        <GamesContext value={gamesContextValue}>
          <GameLineItem
            gameId={4}
            name="De finibus bonorum et malorum"
            description="This is my game"
          />
        </GamesContext>
      </PageProvider>
    )
    expect(wrapper).toBeTruthy()
    expect(wrapper).toMatchSnapshot()
  })

  describe('destroying the game', () => {
    test('destroys the game when the button is clicked', () => {
      const contextValue = {
        ...gamesContextValue,
        destroyGame: vitest.fn().mockImplementation((_gameId: number) => {}),
      }

      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext value={contextValue}>
            <GameLineItem
              gameId={4}
              name="De finibus bonorum et malorum"
              description="This is my game"
            />
          </GamesContext>
        </PageProvider>
      )

      window.confirm = vitest.fn().mockImplementation(() => true)

      const xIcon = wrapper.getByTestId('destroyGame4')
      act(() => xIcon.click())

      expect(contextValue.destroyGame).toHaveBeenCalledWith(4)
    })

    test("doesn't destroy the game when the user cancels", () => {
      const contextValue = {
        ...gamesContextValue,
        destroyGame: vitest.fn().mockImplementation((_gameId: number) => {}),
      }

      const wrapper = renderAuthenticated(
        <PageProvider>
          <GamesContext value={contextValue}>
            <GameLineItem
              gameId={4}
              name="De finibus bonorum et malorum"
              description="This is my game"
            />
          </GamesContext>
        </PageProvider>
      )

      window.confirm = vitest.fn().mockImplementation(() => false)

      const xIcon = wrapper.getByTestId('destroyGame4')
      act(() => xIcon.click())

      expect(contextValue.destroyGame).not.toHaveBeenCalled()
    })
  })
})
