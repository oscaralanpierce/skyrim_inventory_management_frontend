import { describe, test, expect, vitest } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { render } from '../../support/testUtils'
import { YELLOW } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import { type RequestWishListItem, type RequestInventoryItem } from '../../types/apiData'
import { CallbackFunction } from '../../types/functions'
import ListItemCreateForm from './listItemCreateForm'

describe('ListItemCreateForm', () => {
  describe('for wish list item', () => {
    test('displays correct fields and ARIA label', () => {
      const onSubmit = (_attributes: RequestWishListItem, _onSuccess: CallbackFunction, _onError: CallbackFunction) => {}
      const wrapper = render(
        <ColorProvider colorScheme={YELLOW}>
          <ListItemCreateForm
            listId={4}
            resource='Wish list'
            onSubmit={onSubmit}
          />
        </ColorProvider>
      )
  
      // Test presence of trigger element
      expect(wrapper.getByText('Add item to list...')).toBeTruthy()
      
      // Test ARIA label on form element
      expect(wrapper.getByLabelText('Wish list item creation form')).toBeTruthy()
  
      // Test presence of form fields
      expect(wrapper.getByLabelText('Description')).toBeTruthy()
      expect(wrapper.getByLabelText('Quantity')).toBeTruthy()
      expect(wrapper.getByLabelText('Unit Weight')).toBeTruthy()
      expect(wrapper.getByLabelText('Notes')).toBeTruthy()
      expect(wrapper.getByText('Add to List')).toBeTruthy()
    })

    test('expands when trigger is clicked', async () => {
      const onSubmit = vitest.fn()
      const wrapper = render(
        <ColorProvider colorScheme={YELLOW}>
          <ListItemCreateForm listId={2} resource='Wish list' onSubmit={onSubmit} />
        </ColorProvider>
      )

      const trigger = wrapper.getByRole('button', { name: 'Add item to list...', expanded: false })

      await act(() => fireEvent.click(trigger))

      expect(trigger.getAttribute('aria-expanded')).toEqual('true')
    })

    test('matches snapshot', () => {
      const onSubmit = vitest.fn()
      const wrapper = render(
        <ColorProvider colorScheme={YELLOW}>
          <ListItemCreateForm listId={4} resource='Inventory' onSubmit={onSubmit} />
        </ColorProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })

    describe('submitting the form', () => {
      test('submits the form when required attributes are valid', async () => {
        const onSubmit = vitest.fn()
        const wrapper = render(
          <ColorProvider colorScheme={YELLOW}>
            <ListItemCreateForm listId={4} resource='Wish list' onSubmit={onSubmit} />
          </ColorProvider>
        )

        const descField = wrapper.getByLabelText('Description')
        const quantityField = wrapper.getByLabelText('Quantity')
        const form = wrapper.getByLabelText('Wish list item creation form')

        fireEvent.change(descField, { target: { value: '  Iron ingot  ' } })
        fireEvent.change(quantityField, { target: { value: '2' } })

        await act(() => fireEvent.submit(form))

        expect(onSubmit).toHaveBeenCalledExactlyOnceWith(
          {
            description: 'Iron ingot',
            quantity: 2
          },
          expect.any(Function),
          expect.any(Function),
        )
      })

      test('submits the form when all attributes are valid', async () => {
        const onSubmit = vitest.fn()
        const wrapper = render(
          <ColorProvider colorScheme={YELLOW}>
            <ListItemCreateForm listId={4} resource='Wish list' onSubmit={onSubmit} />
          </ColorProvider>
        )

        const descField = wrapper.getByLabelText('Description')
        const quantityField = wrapper.getByLabelText('Quantity')
        const unitWeightField = wrapper.getByLabelText('Unit Weight')
        const notesField = wrapper.getByLabelText('Notes')
        const form = wrapper.getByLabelText('Wish list item creation form')

        fireEvent.change(descField, { target: { value: ' Iron Mace of Sapping  '} })
        fireEvent.change(quantityField, { target: { value: '3' } })
        fireEvent.change(unitWeightField, { target: { value: '7.5' } })
        fireEvent.change(notesField, { target: { value: '  Notes on wish list item  ' } })

        await act(() => fireEvent.submit(form))

        expect(onSubmit).toHaveBeenCalledExactlyOnceWith(
          {
            description: 'Iron Mace of Sapping',
            quantity: 3,
            unit_weight: 7.5,
            notes: 'Notes on wish list item'
          },
          expect.any(Function),
          expect.any(Function),
        )
      })

      test("doesn't submit the form if there are invalid values", () => {
        const onSubmit = vitest.fn()
        const wrapper = render(
          <ColorProvider colorScheme={YELLOW}>
            <ListItemCreateForm listId={4} resource='Wish list' onSubmit={onSubmit} />
          </ColorProvider>
        )

        const descField = wrapper.getByLabelText('Description')
        const quantityField = wrapper.getByLabelText('Quantity')
        const button = wrapper.getByText('Add to List')

        // In this test, we have to click the button to simulate the form being
        // submitted by a user. Firing the `submit` event directly on the form
        // effectively takes as a foregone conclusion that the form has submitted
        // successfully - validations will be skipped.
        act(() => {
          fireEvent.change(descField, { target: { value: '' } })
          fireEvent.change(quantityField, { target: { value: '-1' } })
          fireEvent.click(button)
        })

        expect(onSubmit).not.toHaveBeenCalled()
      })
    })
  })

  describe('for inventory item', () => {
    test('displays correct fields and ARIA label', () => {
      const onSubmit = (_attributes: RequestInventoryItem, _onSuccess: CallbackFunction, _onError: CallbackFunction) => {}
      const wrapper = render(
        <ColorProvider colorScheme={YELLOW}>
          <ListItemCreateForm
            listId={4}
            resource='Inventory'
            onSubmit={onSubmit}
          />
        </ColorProvider>
      )
  
      // Test presence of trigger element
      expect(wrapper.getByText('Add item to list...')).toBeTruthy()
      
      // Test ARIA label on form element
      expect(wrapper.getByLabelText('Inventory item creation form')).toBeTruthy()
  
      // Test presence of form fields
      expect(wrapper.getByLabelText('Description')).toBeTruthy()
      expect(wrapper.getByLabelText('Quantity')).toBeTruthy()
      expect(wrapper.getByLabelText('Unit Weight')).toBeTruthy()
      expect(wrapper.getByLabelText('Notes')).toBeTruthy()
      expect(wrapper.getByText('Add to List')).toBeTruthy()
    })

    test('expands when trigger is clicked', async () => {
      const onSubmit = vitest.fn()
      const wrapper = render(
        <ColorProvider colorScheme={YELLOW}>
          <ListItemCreateForm listId={2} resource='Inventory' onSubmit={onSubmit} />
        </ColorProvider>
      )

      const trigger = wrapper.getByRole('button', { name: 'Add item to list...', expanded: false })

      await act(() => fireEvent.click(trigger))

      expect(trigger.getAttribute('aria-expanded')).toEqual('true')
    })

    test('matches snapshot', () => {
      const onSubmit = vitest.fn()
      const wrapper = render(
        <ColorProvider colorScheme={YELLOW}>
          <ListItemCreateForm listId={4} resource='Inventory' onSubmit={onSubmit} />
        </ColorProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })

    describe('submitting the form', () => {
      test('submits the form when required attributes are valid', async () => {
        const onSubmit = vitest.fn()
        const wrapper = render(
          <ColorProvider colorScheme={YELLOW}>
            <ListItemCreateForm listId={4} resource='Inventory' onSubmit={onSubmit} />
          </ColorProvider>
        )

        const descField = wrapper.getByLabelText('Description')
        const quantityField = wrapper.getByLabelText('Quantity')
        const form = wrapper.getByLabelText('Inventory item creation form')

        fireEvent.change(descField, { target: { value: '  Iron ingot  ' } })
        fireEvent.change(quantityField, { target: { value: '2' } })

        await act(() => fireEvent.submit(form))

        expect(onSubmit).toHaveBeenCalledExactlyOnceWith(
          {
            description: 'Iron ingot',
            quantity: 2
          },
          expect.any(Function),
          expect.any(Function),
        )
      })

      test('submits the form when all attributes are valid', async () => {
        const onSubmit = vitest.fn()
        const wrapper = render(
          <ColorProvider colorScheme={YELLOW}>
            <ListItemCreateForm listId={4} resource='Inventory' onSubmit={onSubmit} />
          </ColorProvider>
        )

        const descField = wrapper.getByLabelText('Description')
        const quantityField = wrapper.getByLabelText('Quantity')
        const unitWeightField = wrapper.getByLabelText('Unit Weight')
        const notesField = wrapper.getByLabelText('Notes')
        const form = wrapper.getByLabelText('Inventory item creation form')

        fireEvent.change(descField, { target: { value: ' Iron Mace of Sapping  '} })
        fireEvent.change(quantityField, { target: { value: '3' } })
        fireEvent.change(unitWeightField, { target: { value: '7.5' } })
        fireEvent.change(notesField, { target: { value: '  Notes on inventory item  ' } })

        await act(() => fireEvent.submit(form))

        expect(onSubmit).toHaveBeenCalledExactlyOnceWith(
          {
            description: 'Iron Mace of Sapping',
            quantity: 3,
            unit_weight: 7.5,
            notes: 'Notes on inventory item'
          },
          expect.any(Function),
          expect.any(Function),
        )
      })

      test("doesn't submit the form if there are invalid values", () => {
        const onSubmit = vitest.fn()
        const wrapper = render(
          <ColorProvider colorScheme={YELLOW}>
            <ListItemCreateForm listId={4} resource='Inventory' onSubmit={onSubmit} />
          </ColorProvider>
        )

        const descField = wrapper.getByLabelText('Description')
        const quantityField = wrapper.getByLabelText('Quantity')
        const button = wrapper.getByText('Add to List')

        // In this test, we have to click the button to simulate the form being
        // submitted by a user. Firing the `submit` event directly on the form
        // effectively takes as a foregone conclusion that the form has submitted
        // successfully - validations will be skipped.
        act(() => {
          fireEvent.change(descField, { target: { value: '' } })
          fireEvent.change(quantityField, { target: { value: '-1' } })
          fireEvent.click(button)
        })

        expect(onSubmit).not.toHaveBeenCalled()
      })
    })
  })
})