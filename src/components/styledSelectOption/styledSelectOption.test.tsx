import { type KeyboardEventHandler, type MouseEventHandler } from 'react'
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
              onClick={() => {}}
              onKeyDown={() => {}}
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
              onClick={() => {}}
              onKeyDown={() => {}}
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
              onClick={() => {}}
              onKeyDown={() => {}}
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
              onClick={() => {}}
              onKeyDown={() => {}}
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
            onClick={() => {}}
            onKeyDown={() => {}}
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
            onClick={() => {}}
            onKeyDown={() => {}}
            ariaSelected={true}
          />
        )

        expect(wrapper).toMatchSnapshot()
      })
    })
  })

  describe('event handling', () => {
    test('calls the onClick function when clicked', () => {
      const onClick = vitest.fn() as MouseEventHandler

      const wrapper = render(
        <StyledSelectOption
          optionName="Option 1"
          optionValue="foo"
          onClick={onClick}
          onKeyDown={() => {}}
          ariaSelected={false}
        />
      )

      const option = wrapper.getByRole('option')

      act(() => option.click())

      expect(onClick).toHaveBeenCalledOnce()
    })

    test('calls the onKeyDown function when a key is pressed over it', () => {
      const onKeyDown = vitest.fn() as KeyboardEventHandler

      const wrapper = render(
        <StyledSelectOption
          optionName="Option 1"
          optionValue={1}
          onClick={() => {}}
          onKeyDown={onKeyDown}
          ariaSelected={false}
        />
      )

      const option = wrapper.getByRole('option')

      act(() => fireEvent.keyDown(option))

      expect(onKeyDown).toHaveBeenCalledOnce()
    })
  })
})
