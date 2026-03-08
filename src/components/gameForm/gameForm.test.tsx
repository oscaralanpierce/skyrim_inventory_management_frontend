import { describe, test, expect, vitest } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { render } from '../../support/testUtils'
import { GREEN } from '../../utils/colorSchemes'
import GameForm from './gameForm'

describe('GameForm', () => {
  test('is a create form by default', () => {
    const wrapper = render(
      <GameForm submitForm={() => {}} buttonColor={GREEN} />
    )

    // Both the header and submit button should have text 'Create Game'
    expect(wrapper.getAllByText('Create Game').length).toEqual(2)
  })

  test('is an edit form if the type prop is set to "edit"', () => {
    const wrapper = render(<GameForm submitForm={() => {}} type="edit" />)

    // Both the header and submit button should have the text 'Update Game'
    expect(wrapper.getAllByText('Update Game').length).toEqual(2)
  })

  test('displays the inputs and submit button', () => {
    const wrapper = render(
      <GameForm submitForm={() => {}} buttonColor={GREEN} />
    )

    expect(wrapper.getByLabelText('Name')).toBeTruthy()
    expect(wrapper.getByLabelText('Description')).toBeTruthy()
    expect(wrapper.getByTestId('gameFormSubmit')).toBeTruthy()
  })

  // TODO: Re-enable when we start using testing-library/jest-dom
  test.skip('uses the default values if given', () => {
    const wrapper = render(
      <GameForm
        submitForm={() => {}}
        type="edit"
        defaultName="My Game 1"
        defaultDescription="This game has a description"
        buttonColor={GREEN}
      />
    )

    const nameField = wrapper.getByLabelText('Name')
    const descField = wrapper.getByLabelText('Description')

    expect(nameField.attributes.getNamedItem('default-value')).toEqual(
      'My Game 1'
    )
    expect(descField.attributes.getNamedItem('default-value')).toEqual(
      'This game has a description'
    )
  })

  test('create form matches snapshot', () => {
    const wrapper = render(
      <GameForm submitForm={() => {}} type="create" buttonColor={GREEN} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  test('edit form matches snapshot', () => {
    const wrapper = render(
      <GameForm
        submitForm={() => {}}
        type="edit"
        defaultName="My Game 1"
        defaultDescription="This game has a description"
        buttonColor={GREEN}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  describe('submitting the form', () => {
    test('calls the submit function with the given attributes', async () => {
      const submit = vitest.fn()

      const wrapper = render(
        <GameForm submitForm={submit} buttonColor={GREEN} />
      )

      const form = wrapper.getByTestId('gameForm')
      const nameField = wrapper.getByLabelText('Name')
      const descField = wrapper.getByLabelText('Description')

      fireEvent.change(nameField, { target: { value: 'Game Name' } })
      fireEvent.change(descField, { target: { value: 'New game description' } })

      await act(() => fireEvent.submit(form))

      expect(submit).toHaveBeenCalledWith({
        name: 'Game Name',
        description: 'New game description',
      })
    })

    test('trims strings', async () => {
      const submit = vitest.fn()

      const wrapper = render(
        <GameForm submitForm={submit} buttonColor={GREEN} />
      )

      const form = wrapper.getByTestId('gameForm')
      const nameField = wrapper.getByLabelText('Name')
      const descField = wrapper.getByLabelText('Description')

      fireEvent.change(nameField, { target: { value: '  Game Name ' } })
      fireEvent.change(descField, {
        target: { value: ' New game description   ' },
      })

      await act(() => fireEvent.submit(form))

      expect(submit).toHaveBeenCalledWith({
        name: 'Game Name',
        description: 'New game description',
      })
    })
  })
})
