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

export default { title: 'ListEditForm' }

export const Default = () => (
  <ColorProvider colorScheme={PINK}>
    <WrapperComponent />
  </ColorProvider>
)
