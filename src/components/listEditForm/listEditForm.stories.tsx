import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useRef, type FormEvent } from 'react'
import { PINK } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ListEditForm from './listEditForm'

const WrapperComponent = () => {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div>
      <ListEditForm
        className="foo"
        formRef={formRef}
        maxTotalWidth={256}
        title="Severin Manor"
        onSubmit={(e: FormEvent) => e.preventDefault()}
      />
    </div>
  )
}

type EditFormStory = StoryObj<typeof WrapperComponent>

const meta: Meta<typeof WrapperComponent> = {
  title: 'ListEditForm',
  component: WrapperComponent,
  decorators: [
    (Story) => (
      <ColorProvider colorScheme={PINK}>
        <Story />
      </ColorProvider>
    ),
  ],
}

export default meta

export const Default: EditFormStory = {}
