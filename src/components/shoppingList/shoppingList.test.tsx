import { describe, test, expect } from 'vitest'
import { renderWithRouter } from '../../support/testUtils'
import { GREEN } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingList from './shoppingList'

describe('ShoppingList', () => {
  test('displays the name of the shopping list', () => {
    const wrapper = renderWithRouter(
      <ColorProvider colorScheme={GREEN}>
        <ShoppingList listId={32} title="My Shopping List" />
      </ColorProvider>
    )

    expect(wrapper).toBeTruthy()
    expect(wrapper.getByText('My Shopping List')).toBeTruthy()
    expect(
      wrapper.getByText('This shopping list has no list items.')
    ).toBeTruthy()
  })

  test('matches snapshot', () => {
    const wrapper = renderWithRouter(
      <ColorProvider colorScheme={GREEN}>
        <ShoppingList listId={32} title="My Shopping List" />
      </ColorProvider>
    )
    expect(wrapper).toMatchSnapshot()
  })
})
