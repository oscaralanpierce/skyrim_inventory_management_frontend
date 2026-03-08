import { describe, test, expect } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { render } from '../../support/testUtils'
import StyledSelectOption from './styledSelectOption'

describe('StyledSelectOption', () => {
  describe('displaying the option', () => {
    describe('when not selected', () => {
      describe('when the option name is shorter than the width of the element', () => {
        test.skip('displays the option name and has aria-selected set to "false"', () => {
          const wrapper = render(
            <StyledSelectOption
              optionName="Option 1"
              optionValue={22}
              onSelected={() => {}}
              ariaSelected={false}
            />
          )

          const option = wrapper.getByRole('option', { selected: false })

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

      describe('when the option name is longer than the width of the element', () => {
        test.skip('truncates the name', () => {
          const wrapper = render(
            <StyledSelectOption
              optionName="Neque porro quisquam est quis dolorem ipsum quia dolor sit amet"
              optionValue="De Finibus"
              onSelected={() => {}}
              ariaSelected={false}
            />
          )

          const option = wrapper.getByRole('option', { selected: false })

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
      test.skip('displays the option name and has aria-selected set to "true"', () => {
        const wrapper = render(
          <StyledSelectOption
            optionName="Option 1"
            optionValue={1}
            onSelected={() => {}}
            ariaSelected={true}
          />
        )

        const option = wrapper.getByRole('option', { selected: true })

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

    test('calls the onSelected function when the Enter key is pressed', async () => {
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

      await act(() => fireEvent.keyDown(option, { key: 'Enter' }))

      expect(onSelected).toHaveBeenCalledWith(1)
    })

    test('calls the onSelected function when the space bar is pressed', async () => {
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

      await act(() => fireEvent.keyDown(option, { key: ' ' }))

      expect(onSelected).toHaveBeenCalledWith(1)
    })

    test("doesn't call the onSelected function when a key other than Enter or the space bar is pressed", async () => {
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

      await act(() => fireEvent.keyDown(option))

      expect(onSelected).not.toHaveBeenCalled()
    })
  })
})
