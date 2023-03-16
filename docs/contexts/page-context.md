# Page Context

The `PageContext` controls the display of global (dashboard) elements like flash messages and modals. It makes sense to control the appearance and disappearance of these components centrally in a context since they can be used by multiple elements on the page concurrently, allowing for problems if each individual element controls its own flash message or modal. Eventually, this context may be used to control other aspects of the global UI, although we are trying to keep its scope relatively limited so it doesn't become a "God context".

## Global Components

Currently, the SIM front end has two globally-controlled components: The `FlashMessage` and the `Modal`. Both of these components have been added to the `DashboardLayout` - this way, there's no chance of duplicate modal or flash elements rendering at the same time or competing with each other. **These components should only be present in the `DashboardLayout` component and should exclusively be controlled through the values provided by the `PageContext`.**

### The `FlashMessage` Component

One of the two global elements is the `FlashMessage` component. This component displays messages relevant to the user, such as error messages or success messages. It has four `types`, passed in as props, which affect the colour of the element presented to the user:

- `success` (green)
- `info` (blue)
- `warning` (yellow)
- `error` (red)

The other props of the component are:

- `message`: a string or array of strings to be displayed to the user
- `heading` (optional): a string that will be displayed in bold type above the message
- `hidden`: a boolean indicating whether the flash message should be hidden

If the message passed is an array, each string in the array will be displayed as a bullet point on a list.'

### The `Modal` Component

The second global component is the `Modal`. This component fills the screen with a transparent dark overlay, with an arbitrary child element displayed in the centre. When the modal is visible, clicking on the overlay will cause it to be hidden. Clicking inside the child element will not hide the modal (as long as the entire click event - `mouseDown` and `mouseUp` - occurs within the child element). Additionally, pressing the `Escape` key when the modal is visible will cause it to be hidden.

The modal component has just two props:

- `hidden` (boolean): whether the modal should be hidden
- `children` (`ReactElement`): the element that should be displayed in the modal

Note that the `children` prop is not optional, but may be set to an empty fragment (`<></>`), and is by default.

## The `PageContext`

The `PageProvider` exposes four values to the user:

- `flashProps` (an object of type `FlashMessageProps`)
- `setFlashProps` (a function taking a `FlashMessageProps` object as an argument)
- `modalProps` (an object of type `ModalProps`)
- `setModalProps` (a function taking a `ModalProps` object as an argument)

All of these are implemented as state variables within the context provider. Because of required values in the `FlashMessageProps` type, there is a default value of `flashProps` that includes an empty string as the message, a type of `'info'`, and, most importantly, `hidden: true`. Likewise, the default value of `modalProps` has `hidden` set to `true` and `children` set to an empty fragment, `<></>`.

When an individual component needs to display a flash message or modal, it can access these values using the `usePageContext()` hook. To display a message, it should call `setFlashProps` with the desired type, message, and (optionally) header. The `hidden` value should also be set to `false`. To display a modal, it should call `setModalProps`, setting `hidden` to `false` and `children` to the React (TSX) element that should appear inside the modal. When hiding the modal, best practice is to set the `children` value back to an empty fragment, `<></>`.

With the flash message, the `PageProvider` ensures that it is hidden after a period of time, so there is no need for a user to manually dismiss it or for a component using it to ensure it disappears.

## Examples

### Flash Message

```tsx
/**
 *
 * /src/components/parent/parent.tsx
 *
 */

import { PageProvider } from '../../contexts/pageContext'
import { LoginProvider } from '../../contexts/loginContext'
import Child from '../child/child'

const Parent = () => (
  <LoginProvider>
    <PageProvider>
      <Child />
    </PageProvider>
  </LoginProvider>
)

export default Parent

/**
 *
 * /src/components/child/child.tsx
 *
 */

import { useState, useEffect } from 'react'
import { signOutWithGoogle } from '../../firebase'
import { type ResponseGame as Game } from '../../types/apiData'
import { type ApiError } from '../../types/errors'
import { useGoogleLogin, usePageContext } from '../../hooks/contexts'
import { getGames } from '../../utils/api/simApi'
import DashboardLayout from '../../layouts/dashboardLayout/dashboardLayout'
import styles from './child.module.css'

const Child = () => {
  const { user, token, authLoading } = useGoogleLogin()
  const { setFlashProps } = usePageContext()
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    if (authLoading) return

    if (user && token) {
      getGames(token)
        .then(({ json }) => {
          setGames(json)
        })
        .catch((e: ApiError) => {
          if (e.status === 401) signOutWithGoogle()

          setFlashProps({
            type: 'error',
            message: e.message,
            hidden: false,
          })
        })
    }
  }, [user, token, authLoading])

  return (
    <DashboardLayout title="Games">
      /* TSX to display retrieved games */
    </DashboardLayout>
  )
}

export default Child
```

Notice the use of the `DashboardLayout` in the `Child` component. It is essential that any component that makes use of flash messages be nested, at any level of nesting, inside a layout component that includes a `FlashMessage`. Currently, `DashboardLayout` is the only such component.

### Modal

```tsx
/**
 *
 * /src/components/parent/parent.tsx
 *
 */

import { PageProvider } from '../../contexts/pageContext'
import { LoginProvider } from '../../contexts/loginContext'
import DashboardLayout from '../../layouts/dashboardLayout/dashboardLayout'
import Child from '../child/child'

const Parent = () => (
  <LoginProvider>
    <PageProvider>
      <DashboardLayout>
        <Child gameId={4} />
      </DashboardLayout>
    </PageProvider>
  </LoginProvider>
)

export default Parent

/**
 *
 * /src/components/child/child.tsx
 *
 */

import { type MouseEventHandler } from 'react'
import { usePageContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout/dashboardLayout'
import GameEditForm from '../../components/gameEditForm/gameEditForm'
import styles from './child.module.css'

interface ChildProps {
  gameId: number
}

const Child = ({ gameId }: ChildProps) => {
  const { setModalProps } = usePageContext()

  const showForm: MouseEventHandler = (e) => {
    setModalProps({
      hidden: false,
      children: <GameEditForm gameId={gameId} name="foo" description="bar" />,
    })
  }

  return (
    <button
      className={styles.button}
      onClick={showForm}
    >{`Edit Game ${gameId}`}</button>
  )
}
```

In this case, note that the component does not render the `DashboardLayout` component. Nevertheless, it will need to be rendered within a `DashboardLayout` (or at least, within the same `PageProvider` as one) in order for the modal form to appear.
