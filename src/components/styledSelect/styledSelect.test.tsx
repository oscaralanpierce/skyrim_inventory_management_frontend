import { describe, test, expect, vitest } from 'vitest'
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

    test.skip('renders the options', () => {
      const wrapper = render(
        <StyledSelect
          options={options}
          onOptionSelected={() => {}}
          onSubmitInput={() => {}}
          placeholder="Doesn't matter"
        />
      )

      // Doesn't display placeholder text since options exist
      expect(wrapper.queryByText("Doesn't matter")).toBeFalsy()

      // Main, initially visible box is empty by default
      expect(
        wrapper.getByLabelText('Add or Select Option').textContent
      ).toBeFalsy()

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
          onSubmitInput={() => {}}
          placeholder="Doesn't matter"
        />
      )

      expect(wrapper).toMatchSnapshot()
    })

    describe('submitting the input', () => {
      describe('when not pressing enter', () => {
        test("doesn't call the onSubmitInput function", async () => {
          const onSubmitInput = vitest.fn()

          const wrapper = render(
            <StyledSelect
              options={options}
              onOptionSelected={() => {}}
              onSubmitInput={onSubmitInput}
              placeholder="Doesn't matter"
            />
          )

          const input = wrapper.getByLabelText('Add or Select Option')

          await act(() => fireEvent.keyDown(input, { target: { key: ' ' } }))

          expect(onSubmitInput).not.toHaveBeenCalled()
        })
      })

      describe('when the input value matches an option name', () => {
        test.skip('selects the option', async () => {
          const onOptionSelected = vitest.fn()
          const onSubmitInput = vitest.fn()

          const wrapper = render(
            <StyledSelect
              options={options}
              onOptionSelected={onOptionSelected}
              onSubmitInput={onSubmitInput}
              placeholder="Doesn't matter"
            />
          )

          const input = wrapper.getByLabelText('Add or Select Option')

          fireEvent.change(input, { target: { value: 'my game 2' } })

          await act(() => fireEvent.keyDown(input, { target: { key: 'Enter' } }))

          expect(onOptionSelected).toHaveBeenCalledWith(51)
          expect(onSubmitInput).not.toHaveBeenCalled()
        })
      })

      describe('when the input value does not match an option name', () => {
        test.skip('calls the onSubmitInput function with the input value', async () => {
          const onSubmitInput = vitest.fn()

          const wrapper = render(
            <StyledSelect
              options={options}
              onOptionSelected={() => {}}
              onSubmitInput={onSubmitInput}
              placeholder="Doesn't matter"
            />
          )

          const input = wrapper.getByLabelText('Add or Select Option')

          fireEvent.change(input, { target: { value: 'New Game New Name' } })

          await act(() => fireEvent.keyDown(input, { target: { key: 'Enter' } }))

          expect(onSubmitInput).toHaveBeenCalledWith('New Game New Name')
        })
      })
    })
  })

  describe('when there are no options', () => {
    test.skip('displays the placeholder text', () => {
      const wrapper = render(
        <StyledSelect
          options={[]}
          onOptionSelected={() => {}}
          onSubmitInput={() => {}}
          placeholder="No options available"
        />
      )

      expect(wrapper.getByText('No options available')).toBeTruthy()
    })

    test.skip('truncates the placeholder text if it is too long', () => {
      const wrapper = render(
        <StyledSelect
          options={[]}
          onOptionSelected={() => {}}
          onSubmitInput={() => {}}
          placeholder="This placeholder is way too long."
        />
      )

      expect(
        wrapper.getByLabelText('Add or Select Option').textContent
      ).toEqual('This placeholder is way...')
    })

    test('matches snapshot', () => {
      const wrapper = render(
        <StyledSelect
          options={[]}
          onOptionSelected={() => {}}
          onSubmitInput={() => {}}
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

    test.skip('selects the option and displays the selected option text', () => {
      const wrapper = render(
        <StyledSelect
          options={options}
          defaultOption={options[1]}
          onOptionSelected={() => {}}
          onSubmitInput={() => {}}
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
      expect(
        wrapper.getByLabelText('Add or Select Option').textContent
      ).toEqual(options[1].optionName)
    })

    test.skip('truncates the title if it is too long', () => {
      const wrapper = render(
        <StyledSelect
          options={options}
          defaultOption={options[2]}
          onOptionSelected={() => {}}
          onSubmitInput={() => {}}
          placeholder="Doesn't matter"
        />
      )

      // The header text should be the option name
      expect(
        wrapper.getByLabelText('Add or Select Option').textContent
      ).toEqual('Game with a really real...')
    })

    test('matches snapshot', () => {
      const wrapper = render(
        <StyledSelect
          options={options}
          defaultOption={options[1]}
          onOptionSelected={() => {}}
          onSubmitInput={() => {}}
          placeholder="Doesn't matter"
        />
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})
