# Playthroughs Context

The `PlaythroughsContext` enables us to keep track of all of a user's playthroughs as well as creating, editing, and destroying them. The `PlaythroughsProvider` makes the following values available to consumers:

- `playthroughs`: array of [`ResponsePlaythrough`](/src/types/apiData.d.ts) objects, the playthroughs returned from the API for the signed-in user, initialized as an empty array (i.e., this object will never be `null` or `undefined`)
- `playthroughsLoadingStatus`: string of either `'LOADING'`, `'ERROR'`, or `'DONE'`, indicating whether playthroughs have loaded successfully from the API, initialized as `'LOADING'`
- `createPlaythrough`: function that takes a `RequestPlaythrough` object as an argument and creates a playthrough with those attributes at the API, adding it to the `playthroughs` array if successful
- `updatePlaythrough`: function that takes a `playthroughId` and `RequestPlaythrough` object as arguments and updates the playthrough with that playthrough ID using those attributes at the API, updating the `playthroughs` array if successful
- `destroyPlaythrough`: function that takes a playthrough ID as an argument and destroys the playthrough with that ID at the API, updating the `playthroughs` array accordingly

Each of the provided functions can optionally take `onSuccess` and `onError` callbacks, in that order. These callbacks are of the `CallbackFunction` type; they take no arguments and have a `void` return type. The only exception is `createPlaythrough`, which passes the newly created `ResponsePlaythrough` object to the `onSuccess` callback. These functions are useful for things like hiding a form after it has been successfully submitted.

Accessing playthroughs requires a user to be authenticated, so the `PlaythroughsProvider` can only be rendered inside a [`LoginProvider`](/docs/contexts/login-context.md). Note that the `PlaythroughsProvider` itself calls the `requireLogin` function provided by the login context, so this function should not be called in any `PlaythroughsContext` consumers. The `PlaythroughsProvider` must also also nested in a [`PageProvider`](/docs/contexts/page-context.md), which allows it to control flash messages and modal forms.

## Example

```tsx
/**
 *
 * /src/components/parent/parent.tsx
 *
 */

import { LoginProvider } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsProvider } from '../../contexts/PlaythroughsContext'
import Child from '../child/child'

const Parent = () => (
  <LoginProvider>
    <PageProvider>
      <PlaythroughsProvider>
        <Child />
      </PlaythroughsProvider>
    </PageProvider>
  </LoginProvider>
)

export default Parent

/**
 *
 * /src/components/child/child.tsx
 *
 */

import { type ResponsePlaythrough as Playthrough } from '../../types/apiData'
import { usePlaythroughsContext } from '../../hooks/contexts'
import { PulseLoader } from 'react-spinners'
import styles from './child.module.css'

const Child = () => {
  const { playthroughs, playthroughsLoadingState } = usePlaythroughsContext()

  return (
    {playthroughsLoadingState === 'LOADING' ? <PulseLoader /> : (
      <div className={styles.root}>
        {playthroughs.map(({ id, description, name }: Playthrough) => (
          <div className={styles.playthrough} key={id}>
            <h3 className={styles.title}>{name}</h3>
            <p className={styles.description}>{description || 'This playthrough has no description.'}</p>
          </div>
        ))}
      </div>
    )}
  )
}

export default Child
```

In this example, the child component takes the playthroughs retrieved from the context, displaying a loading component if the playthroughs are loading and information about each playthrough if the playthroughs have loaded. (Note that this minimal example does not handle the case where the `playthroughsLoadingState` is `'ERROR'`.)
