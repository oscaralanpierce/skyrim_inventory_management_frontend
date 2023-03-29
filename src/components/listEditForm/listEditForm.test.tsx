import { useRef, type FormEvent, type FormEventHandler } from 'react'
import { describe, test, expect, vitest } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { render } from '../../support/testUtils'
import { BLUE } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ListEditForm from './listEditForm'

interface WrapperProps {
  onSubmit: FormEventHandler
}

const WrapperComponent = ({ onSubmit }: WrapperProps) => {
  const formRef = useRef(null)

  return (
    <div>
      <ListEditForm
        className="foo"
        formRef={formRef}
        maxTotalWidth={256}
        title="Alchemy Ingredients"
        onSubmit={onSubmit}
      />
    </div>
  )
}

describe('ListEditForm', () => {
  test.skip('displays the title and submit button', () => {
    const wrapper = render(
      <ColorProvider colorScheme={BLUE}>
        <WrapperComponent onSubmit={(e: FormEvent) => e.preventDefault()} />
      </ColorProvider>
    )

    expect(wrapper).toBeTruthy()
    expect(
      wrapper.getByRole('textbox').attributes.getNamedItem('name')
    ).toEqual('title')
    expect(wrapper.getByRole('button').attributes.getNamedItem('name')).toEqual(
      'submit'
    )
  })

  describe('submitting the form', () => {
    test('calls the onSubmit function passed in when button is clicked', () => {
      const onSubmit = vitest.fn()
      const wrapper = render(
        <ColorProvider colorScheme={BLUE}>
          <WrapperComponent onSubmit={onSubmit} />
        </ColorProvider>
      )

      const input = wrapper.getByRole('textbox')
      const button = wrapper.getByRole('button')

      act(() => {
        fireEvent.change(input, { target: { value: 'Smithing Materials' } })
        fireEvent.click(button)
      })

      expect(onSubmit).toHaveBeenCalledOnce()
    })

    test('calls the onSubmit function any time the form is submitted', () => {
      const onSubmit = vitest.fn()
      const wrapper = render(
        <ColorProvider colorScheme={BLUE}>
          <WrapperComponent onSubmit={onSubmit} />
        </ColorProvider>
      )

      const input = wrapper.getByRole('textbox')
      const form = wrapper.getByRole('form')

      act(() => {
        fireEvent.change(input, { target: { value: 'Smithing Materials' } })
        fireEvent.submit(form)
      })

      expect(onSubmit).toHaveBeenCalledOnce()
    })
  })
})
