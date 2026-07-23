import { describe, expect, test, afterEach, vitest } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { render } from '../../support/testUtils'
import { PINK } from '../../utils/colorSchemes'
import { RequestInventoryItem } from '../../types/apiData'
import ListItemEditForm, { type SubmitHandlerType } from './listItemEditForm'

const itemAttributes = {
  itemId: 2,
  description: 'Blue Mountain Flower',
  quantity: 12,
  unitWeight: 0.1,
  notes: 'For Restore Health and Fortify Health potions',
}

describe('ListItemEditForm', () => {
  describe('displaying the form', () => {
    test('has the correct fields', () => {
      const onSubmit: SubmitHandlerType = (attributes: RequestInventoryItem | null) => {}
      const wrapper = render(
        <ListItemEditForm
          listTitle='Alchemy Ingredients'
          buttonColor={PINK}
          itemAttributes={itemAttributes}
          onSubmit={onSubmit}
        />
      )

      expect(wrapper.getByText('Blue Mountain Flower')).toBeTruthy()
      expect(wrapper.getByText('On list "Alchemy Ingredients"')).toBeTruthy()
      expect(wrapper.getByLabelText('Quantity').getAttribute('value')).toEqual('12')
      expect(wrapper.getByLabelText('Unit Weight').getAttribute('value')).toEqual('0.1')
      expect(wrapper.getByLabelText('Notes').getAttribute('value'))
        .toEqual('For Restore Health and Fortify Health potions')
    })

    test('matches snapshot', () => {
      const onSubmit = vitest.fn()
      const wrapper = render(
        <ListItemEditForm
          listTitle='Alchemy Ingredients'
          buttonColor={PINK}
          itemAttributes={itemAttributes}
          onSubmit={onSubmit}
        />
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('submitting the form', () => {
    describe('with valid, changed attributes', () => {
      test('calls the callback with the new attributes', async () => {
        const onSubmit = vitest.fn()
        const wrapper = render(
          <ListItemEditForm
            listTitle='Alchemy Ingredients'
            buttonColor={PINK}
            itemAttributes={itemAttributes}
            onSubmit={onSubmit}
          />
        )

        const quantityInput = wrapper.getByLabelText('Quantity')
        const weightInput = wrapper.getByLabelText('Unit Weight')
        const notesInput = wrapper.getByLabelText('Notes')
        const form = wrapper.getByTestId(`editListItem${itemAttributes.itemId}Form`)

        fireEvent.change(quantityInput, { target: { value: '4' } })
        fireEvent.change(weightInput, { target: { value: '0.2' } })
        fireEvent.change(notesInput, { target: { value: '   New notes  \n  '} })

        await act(() => fireEvent.submit(form))

        expect(onSubmit).toHaveBeenCalledExactlyOnceWith(
          { quantity: 4, unit_weight: 0.2, notes: 'New notes' }
        )
      })
    })

    describe('with no changed attributes', () => {
      test('calls the callback with null', async () => {
        const onSubmit = vitest.fn()
        const wrapper = render(
          <ListItemEditForm
            listTitle='Alchemy Ingredients'
            buttonColor={PINK}
            itemAttributes={itemAttributes}
            onSubmit={onSubmit}
          />
        )
  
        const quantityInput = wrapper.getByLabelText('Quantity')
        const weightInput = wrapper.getByLabelText('Unit Weight')
        const notesInput = wrapper.getByLabelText('Notes')
        const form = wrapper.getByTestId(`editListItem${itemAttributes.itemId}Form`)

        // The notes should be considered unchanged if there is only leading/trailing
        // whitespace added
        fireEvent.change(notesInput, { target: { value: `  ${itemAttributes.notes}\n`} })

        await act(() => fireEvent.submit(form))

        expect(onSubmit).toHaveBeenCalledExactlyOnceWith(null)
      })
    })

    describe('with invalid attributes', () => {
      test("doesn't call the callback", () => {
        const onSubmit = vitest.fn()
        const wrapper = render(
          <ListItemEditForm
            listTitle='Alchemy Ingredients'
            buttonColor={PINK}
            itemAttributes={itemAttributes}
            onSubmit={onSubmit}
          />
        )

        const quantityInput = wrapper.getByLabelText('Quantity')
        const button = wrapper.getByText('Update Item')

        fireEvent.change(quantityInput, { target: { value: '-2' } })
        fireEvent.click(button)

        expect(onSubmit).not.toHaveBeenCalled()
      })
    })
  })
})