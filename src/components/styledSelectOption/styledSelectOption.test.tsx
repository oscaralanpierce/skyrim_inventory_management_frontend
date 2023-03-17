import { describe, test, expect } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { render } from '../../support/testUtils'
import StyledSelectOption from './styledSelectOption'

describe('StyledSelectOption', () => {
  describe('displaying the option', () => {
    describe('when not selected', () => {
      describe('when the option name is shorter than 24 characters', () => {
        test('displays the option name and has aria-selected set to "false"', () => {
          const wrapper = render(
            <StyledSelectOption
              optionName="Option 1"
              optionValue={22}
              onSelected={() => {}}
              ariaSelected={false}
            />
          )

          expect(wrapper).toBeTruthy()

          const option = wrapper.getByRole('option', { selected: false })

          expect(option).toBeTruthy()
          expect(option.textContent).toEqual('Option 1')
        })

        test('matches snapshot', () => {
          const wrapper = render(
            <StyledSelectOption
              optionName="Option 1"
              optionValue={22}
              onSelected={() => {}}
              ariaSelected={false}
            />
          )

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('when the option name is longer than 24 characters', () => {
        test('truncates the name to 24 characters', () => {
          const wrapper = render(
            <StyledSelectOption
              optionName="Neque porro quisquam est quis dolorem ipsum quia dolor sit amet"
              optionValue="De Finibus"
              onSelected={() => {}}
              ariaSelected={false}
            />
          )

          const option = wrapper.getByRole('option', { selected: false })

          expect(option).toBeTruthy()
          expect(option.textContent).toEqual('Neque porro quisquam es...')
        })

        test('matches snapshot', () => {
          const wrapper = render(
            <StyledSelectOption
              optionName="Neque porro quisquam est quis dolorem ipsum quia dolor sit amet"
              optionValue="De Finibus"
              onSelected={() => {}}
              ariaSelected={false}
            />
          )

          expect(wrapper).toMatchSnapshot()
        })
      })
    })

    describe('when selected', () => {
      test('displays the option name and has aria-selected set to "false"', () => {
        const wrapper = render(
          <StyledSelectOption
            optionName="Option 1"
            optionValue={1}
            onSelected={() => {}}
            ariaSelected={true}
          />
        )

        expect(wrapper).toBeTruthy()

        const option = wrapper.getByRole('option', { selected: true })

        expect(option).toBeTruthy()
        expect(option.textContent).toEqual('Option 1')
      })

      test('matches snapshot', () => {
        const wrapper = render(
          <StyledSelectOption
            optionName="Option 1"
            optionValue={1}
            onSelected={() => {}}
            ariaSelected={true}
          />
        )

        expect(wrapper).toMatchSnapshot()
      })
    })
  })

  describe('event handling', () => {
    test('calls the onSelected function when clicked', () => {
      const onSelected = vitest.fn()

      const wrapper = render(
        <StyledSelectOption
          optionName="Option 1"
          optionValue="foo"
          onSelected={onSelected}
          ariaSelected={false}
        />
      )

      const option = wrapper.getByRole('option')

      act(() => option.click())

      expect(onSelected).toHaveBeenCalledWith('foo')
    })

    test('calls the onSelected function when the Enter key is pressed', () => {
      const onSelected = vitest.fn()

      const wrapper = render(
        <StyledSelectOption
          optionName="Option 1"
          optionValue={1}
          onSelected={onSelected}
          ariaSelected={false}
        />
      )

      const option = wrapper.getByRole('option')

      act(() => fireEvent.keyDown(option, { key: 'Enter' }))

      expect(onSelected).toHaveBeenCalledWith(1)
    })

    test('calls the onSelected function when the space bar is pressed', () => {
      const onSelected = vitest.fn()

      const wrapper = render(
        <StyledSelectOption
          optionName="Option 1"
          optionValue={1}
          onSelected={onSelected}
          ariaSelected={false}
        />
      )

      const option = wrapper.getByRole('option')

      act(() => fireEvent.keyDown(option, { key: ' ' }))

      expect(onSelected).toHaveBeenCalledWith(1)
    })

    test("doesn't call the onSelected function when a key other than Enter is pressed", () => {
      const onSelected = vitest.fn()

      const wrapper = render(
        <StyledSelectOption
          optionName="Option 1"
          optionValue={1}
          onSelected={onSelected}
          ariaSelected={false}
        />
      )

      const option = wrapper.getByRole('option')

      act(() => fireEvent.keyDown(option))

      expect(onSelected).not.toHaveBeenCalled()
    })
  })
})
