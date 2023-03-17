import { ReactElement } from 'react'
import { describe, test, expect } from 'vitest'
import { renderAuthenticated } from '../../support/testUtils'
import {
  gamesContextValue,
  shoppingListsContextValue,
} from '../../support/data/contextValues'
import { GREEN } from '../../utils/colorSchemes'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListItem from './shoppingListItem'

const renderInContexts = (ui: ReactElement) =>
  renderAuthenticated(
    <PageProvider>
      <GamesContext.Provider value={gamesContextValue}>
        <ShoppingListsContext.Provider value={shoppingListsContextValue}>
          <ColorProvider colorScheme={GREEN}>{ui}</ColorProvider>
        </ShoppingListsContext.Provider>
      </GamesContext.Provider>
    </PageProvider>
  )

describe('ShoppingListItem', () => {
  test('displays the attributes', () => {
    const wrapper = renderInContexts(
      <ShoppingListItem
        itemId={33}
        description="Silver Necklace"
        quantity={2}
        unitWeight={0.3}
        notes="To enchant"
      />
    )

    expect(wrapper).toBeTruthy()

    expect(wrapper.getByText('Silver Necklace')).toBeTruthy()
    expect(wrapper.getByText('2')).toBeTruthy()
    expect(wrapper.getByText('0.3')).toBeTruthy()
  })

  test('truncates unit weight values appropriately', () => {
    const wrapper = renderInContexts(
      <ShoppingListItem
        itemId={20}
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

  test('matches snapshot', () => {
    const wrapper = renderInContexts(
      <ShoppingListItem
        itemId={2}
        description="Silver Necklace"
        quantity={2}
        unitWeight={0.3}
        notes="To enchant"
      />
    )

    expect(wrapper).toMatchSnapshot()
  })
})
