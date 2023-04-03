import { ReactElement } from 'react'
import { describe, expect, test, vitest } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderAuthenticated } from '../../support/testUtils'
import { BLUE } from '../../utils/colorSchemes'
import {
  gamesContextValue,
  shoppingListsContextValue,
} from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { GamesContext } from '../../contexts/gamesContext'
import { ShoppingListsContext } from '../../contexts/shoppingListsContext'
import ShoppingListItemEditForm from './shoppingListItemEditForm'

let contextValue = shoppingListsContextValue

const renderWithContexts = (ui: ReactElement) =>
  renderAuthenticated(
    <PageProvider>
      <GamesContext.Provider value={gamesContextValue}>
        <ShoppingListsContext.Provider value={contextValue}>
          {ui}
        </ShoppingListsContext.Provider>
      </GamesContext.Provider>
    </PageProvider>
  )

describe('ShoppingListItemEditForm', () => {
  describe('displaying the form', () => {
    test('has the correct fields', () => {
      const wrapper = renderWithContexts(
        <ShoppingListItemEditForm
          itemId={6}
          description="Health potion ingredients"
          listTitle="Alchemy Ingredients"
          buttonColor={BLUE}
          quantity={2}
          unitWeight={3}
          notes={null}
        />
      )

      expect(wrapper.getByText('Health potion ingredients')).toBeTruthy()
      expect(wrapper.getByText('On list "Alchemy Ingredients"')).toBeTruthy()
      expect(wrapper.getByLabelText('Quantity').getAttribute('value')).toEqual(
        '2'
      )
      expect(
        wrapper.getByLabelText('Unit Weight').getAttribute('value')
      ).toEqual('3')
      expect(wrapper.getByLabelText('Notes')).toBeTruthy()
      expect(wrapper.getByText('Update Item')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderWithContexts(
        <ShoppingListItemEditForm
          itemId={6}
          description="Health potion ingredients"
          listTitle="Alchemy Ingredients"
          buttonColor={BLUE}
          quantity={2}
          unitWeight={3}
          notes={null}
        />
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})
