import { describe, test, expect, vitest } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { RequestPlaythrough } from '../../types/apiData'
import { renderAuthenticated } from '../../support/testUtils'
import { playthroughsContextValue } from '../../support/data/contextValues'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsContext } from '../../contexts/playthroughsContext'
import PlaythroughCreateForm from './playthroughCreateForm'

describe('<PlaythroughCreateForm />', () => {
  describe('when enabled', () => {
    test('displays the correct fields', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <PlaythroughCreateForm />
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper).toBeTruthy()

      expect(wrapper.getByText('Create Playthrough...')).toBeTruthy()
      expect(wrapper.getByTestId('playthroughCreateFormForm')).toBeTruthy()
    })

    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <PlaythroughCreateForm />
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })

    describe('creating a playthrough', () => {
      describe('when the form has no values', () => {
        test('calls the createPlaythrough function on the Playthroughs provider', () => {
          const createPlaythrough = vitest
            .fn()
            .mockImplementation((_playthrough: RequestPlaythrough) => {})

          const wrapper = renderAuthenticated(
            <PageProvider>
              <PlaythroughsContext
                value={{ ...playthroughsContextValue, createPlaythrough }}
              >
                <PlaythroughCreateForm />
              </PlaythroughsContext>
            </PageProvider>
          )

          const form = wrapper.getByTestId('playthroughCreateFormForm')

          act(() => {
            fireEvent.submit(form)
          })

          expect(createPlaythrough).toHaveBeenCalledWith(
            { name: null, description: null },
            expect.any(Function)
          )
        })
      })

      describe('when the form has been filled out', () => {
        test('calls the createPlaythrough function on the Playthroughs provider', () => {
          const createPlaythrough = vitest
            .fn()
            .mockImplementation((_playthrough: RequestPlaythrough) => {})

          const wrapper = renderAuthenticated(
            <PageProvider>
              <PlaythroughsContext
                value={{ ...playthroughsContextValue, createPlaythrough }}
              >
                <PlaythroughCreateForm />
              </PlaythroughsContext>
            </PageProvider>
          )

          const nameInput = wrapper.getByTestId('createNameField')
          const descInput = wrapper.getByTestId('createDescriptionField')
          const form = wrapper.getByTestId('playthroughCreateFormForm')

          act(() => {
            fireEvent.change(nameInput, { target: { value: 'Skyrim' } })
            fireEvent.change(descInput, {
              target: { value: 'Custom description' },
            })
            fireEvent.submit(form)
          })

          expect(createPlaythrough).toHaveBeenCalledWith(
            { name: 'Skyrim', description: 'Custom description' },
            expect.any(Function)
          )
        })

        test('trims strings', () => {
          const createPlaythrough = vitest
            .fn()
            .mockImplementation((_playthrough: RequestPlaythrough) => {})

          const wrapper = renderAuthenticated(
            <PageProvider>
              <PlaythroughsContext
                value={{ ...playthroughsContextValue, createPlaythrough }}
              >
                <PlaythroughCreateForm />
              </PlaythroughsContext>
            </PageProvider>
          )

          const nameInput = wrapper.getByTestId('createNameField')
          const descInput = wrapper.getByTestId('createDescriptionField')
          const form = wrapper.getByTestId('playthroughCreateFormForm')

          act(() => {
            fireEvent.change(nameInput, { target: { value: '   Skyrim  ' } })
            fireEvent.change(descInput, {
              target: { value: ' Custom description   ' },
            })
            fireEvent.submit(form)
          })

          expect(createPlaythrough).toHaveBeenCalledWith(
            { name: 'Skyrim', description: 'Custom description' },
            expect.any(Function)
          )
        })
      })
    })
  })

  // Again, because of limitations on DOM testing with Vitest, we are limited to
  // snapshot testing for this component state. There is a promising package,
  // https://github.com/chaance/vitest-dom, that forks testing-library/js-dom and
  // introduces its matches for Vitest. However, this package is only available on
  // version 0.0.4 and has a peer dependency for Vitest "^0.16.0", when we are
  // on 0.29.2, so it's too new a package to really rely on.
  describe('when disabled', () => {
    test('matches snapshot', () => {
      const wrapper = renderAuthenticated(
        <PageProvider>
          <PlaythroughsContext value={playthroughsContextValue}>
            <PlaythroughCreateForm disabled />
          </PlaythroughsContext>
        </PageProvider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})
