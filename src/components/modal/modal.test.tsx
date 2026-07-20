import { describe, expect, test } from 'vitest'
import { renderWithRouter } from '../../support/testUtils'
import { YELLOW } from '../../utils/colorSchemes'
import PlaythroughForm from '../playthroughForm/playthroughForm'
import Modal from './modal'

describe('Modal', () => {
  test('displays the child', () => {
    const wrapper = renderWithRouter(
      <Modal hidden={false}>
        <PlaythroughForm submitForm={() => {}} type="create" buttonColor={YELLOW} />
      </Modal>
    )

    expect(wrapper).toBeTruthy()
    expect(wrapper.getByTestId('playthroughForm')).toBeTruthy()
  })

  test('matches snapshot', () => {
    const wrapper = renderWithRouter(
      <Modal hidden={false}>
        <PlaythroughForm submitForm={() => {}} type="create" buttonColor={YELLOW} />
      </Modal>
    )

    expect(wrapper).toMatchSnapshot()
  })
})
