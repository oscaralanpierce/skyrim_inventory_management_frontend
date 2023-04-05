import { describe, test, expect } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { render } from '../../support/testUtils'
import { allGames } from '../../support/data/games'
import StyledSelect from './styledSelect'

/**
 *
 * Not able to be tested: disabled state
 *
 */

describe('StyledSelect', () => {
  describe('when there are options', () => {
    const options = allGames.map(({ name, id }) => ({
      optionName: name,
      optionValue: id,
    }))

    test('renders the options', () => {
      const wrapper = render(
        <StyledSelect
          options={options}
          onOptionSelected={() => {}}
          placeholder="Doesn't matter"
        />
      )

      // Doesn't display placeholder text since options exist
      expect(wrapper.queryByText("Doesn't matter")).toBeFalsy()

      // Main, initially visible box is empty by default
      expect(wrapper.getByTestId('selectedOption').textContent).toBeFalsy()

      // Initially, no option is selected
      expect(wrapper.queryByRole('option', { selected: true })).toBeFalsy()

      // All the option names should be present in the DOM
      expect(wrapper.getByText('My Game 1')).toBeTruthy()
      expect(wrapper.getByText('My Game 2')).toBeTruthy()
      expect(wrapper.getByText('Game with a really real...')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = render(
        <StyledSelect
          options={options}
          onOptionSelected={() => {}}
          placeholder="Doesn't matter"
        />
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when there are no options', () => {
    test('displays the placeholder text', () => {
      const wrapper = render(
        <StyledSelect
          options={[]}
          onOptionSelected={() => {}}
          placeholder="No options available"
        />
      )

      expect(wrapper.getByText('No options available')).toBeTruthy()
    })

    test('truncates the placeholder text if it is too long', () => {
      const wrapper = render(
        <StyledSelect
          options={[]}
          onOptionSelected={() => {}}
          placeholder="This placeholder is way too long."
        />
      )

      expect(wrapper.getByTestId('selectedOption').textContent).toEqual(
        'This placeholder is way...'
      )
    })

    test('matches snapshot', () => {
      const wrapper = render(
        <StyledSelect
          options={[]}
          onOptionSelected={() => {}}
          placeholder="No options available"
        />
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when a default option is given', () => {
    const options = allGames.map(({ name, id }) => ({
      optionName: name,
      optionValue: id,
    }))

    test('selects the option and displays the selected option text', () => {
      const wrapper = render(
        <StyledSelect
          options={options}
          defaultOption={options[1]}
          onOptionSelected={() => {}}
          placeholder="Doesn't matter"
        />
      )

      // The placeholder text shouldn't be shown
      expect(wrapper.queryByText("Doesn't matter")).toBeFalsy()

      // The default option should have aria-selected set to "true"
      expect(
        wrapper.getByRole('option', { selected: true }).textContent
      ).toEqual(options[1].optionName)

      // The header text should be the option name
      expect(wrapper.getByTestId('selectedOption').textContent).toEqual(
        options[1].optionName
      )
    })

    test('truncates the title if it is too long', () => {
      const wrapper = render(
        <StyledSelect
          options={options}
          defaultOption={options[2]}
          onOptionSelected={() => {}}
          placeholder="Doesn't matter"
        />
      )

      // The header text should be the option name
      expect(wrapper.getByTestId('selectedOption').textContent).toEqual(
        'Game with a really real...'
      )
    })

    test('matches snapshot', () => {
      const wrapper = render(
        <StyledSelect
          options={options}
          defaultOption={options[1]}
          onOptionSelected={() => {}}
          placeholder="Doesn't matter"
        />
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('selecting an option', () => {
    const options = allGames.map(({ name, id }) => ({
      optionName: name,
      optionValue: id,
    }))

    test('sets the aria-selected attribute', () => {
      const wrapper = render(
        <StyledSelect
          options={options}
          defaultOption={options[1]}
          onOptionSelected={() => {}}
          placeholder="Doesn't matter"
        />
      )

      const option = wrapper.getByText(options[0].optionName)

      act(() => fireEvent.click(option))

      expect(
        wrapper.getByRole('option', { selected: true }).textContent
      ).toEqual(options[0].optionName)
    })
  })
})
