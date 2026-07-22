import {
  describe
} from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { render } from '../../support/testUtils'
import { RequestInventoryList, RequestWishList } from '../../types/apiData'
import { CallbackFunction } from '../../types/functions'
import ListCreateForm, { SubmitHandlerType } from './listCreateForm'

describe('ListCreateForm', () => {
  describe('displaying the form for wish lists', () => {
    const onSubmit: SubmitHandlerType = (
      _attributes: RequestWishList,
      _onSuccess?: CallbackFunction | null,
      _onError?: CallbackFunction | null,
    ) => {}

    test('has the correct form fields', () => {
      const wrapper = render(<ListCreateForm onSubmit={onSubmit} disabled={false} />)

      expect(wrapper.getByPlaceholderText('Title')).toBeTruthy()
      expect(wrapper.getByText('Create')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = render(<ListCreateForm onSubmit={onSubmit} disabled={false} />)

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('displaying the form for inventory lists', () => {
    const onSubmit: SubmitHandlerType = (
      _attributes: RequestInventoryList,
      _onSuccess?: CallbackFunction | null,
      _onError?: CallbackFunction | null,
    ) => {}
    
    test('has the correct form fields', () => {
      const wrapper = render(<ListCreateForm onSubmit={onSubmit} disabled={false} />)

      expect(wrapper.getByPlaceholderText('Title')).toBeTruthy()
      expect(wrapper.getByText('Create')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = render(<ListCreateForm onSubmit={onSubmit} disabled={false} />)

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('disabling behaviour', () => {
    const onSubmit: SubmitHandlerType = (
      _attributes: RequestWishList,
      _onSuccess?: CallbackFunction | null,
      _onError?: CallbackFunction | null,
    ) => {}

    test('is disabled when disabled is true', () => {
      const wrapper = render(<ListCreateForm onSubmit={onSubmit} disabled />)

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes
          .getNamedItem('disabled')
      ).toBeTruthy()
      expect(
        wrapper
          .getByText('Create')
          .attributes
          .getNamedItem('disabled')
      ).toBeTruthy()
    })

    test('matches snapshot when disabled', () => {
      const wrapper = render(<ListCreateForm onSubmit={onSubmit} disabled />)
      
      expect(wrapper).toMatchSnapshot()
    })

    test('is enabled when disabled is false', () => {
      const wrapper = render(<ListCreateForm onSubmit={onSubmit} disabled={false} />)

      expect(
        wrapper
          .getByPlaceholderText('Title')
          .attributes
          .getNamedItem('disabled')
      ).toBeFalsy()

      expect(
        wrapper
          .getByText('Create')
          .attributes
          .getNamedItem('disabled')
      ).toBeFalsy()
    })
  })

  describe('submitting the form', () => {
    describe('when the form is enabled', () => {
      test('trims the title and calls the callback', async () => {
        const onSubmit = vitest.fn()
        const wrapper = render(<ListCreateForm onSubmit={onSubmit} disabled={false} />)

        const input = wrapper.getByPlaceholderText('Title')
        const button = wrapper.getByText('Create')

        fireEvent.change(input, { target: { value: '    New List  '} })

        await act(() => fireEvent.click(button))

        expect(onSubmit).toHaveBeenCalledWith(
          { title: 'New List' },
          expect.any(Function),
          expect.any(Function)
        )
      })
    })

    describe('when the form is disabled', () => {
      test("doesn't call the callback", () => {
        const onSubmit = vitest.fn()
        const wrapper = render(<ListCreateForm onSubmit={onSubmit} disabled />)

        const button = wrapper.getByText('Create')

        act(() => {
          fireEvent.click(button)
        })

        expect(onSubmit).not.toHaveBeenCalled()
      })
    })
  })
})