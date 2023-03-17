# Games Context

The `GamesContext` enables us to keep track of all of a user's games as well as creating, editing, and destroying them. The `GamesProvider` makes the following values available to consumers:

- `games`: array of [`ResponseGame`](/src/types/apiData.d.ts) objects, the games returned from the API for the signed-in user, initialized as an empty array (i.e., this object will never be `null` or `undefined`)
- `gamesLoadingStatus`: string of either `'LOADING'`, `'ERROR'`, or `'DONE'`, indicating whether games have loaded successfully from the API, initialized as `'LOADING'`
- `createGame`: function that takes a `RequestGame` object as an argument and creates a game with those attributes at the API, adding it to the `games` array if successful
- `updateGame`: function that takes a `gameId` and `RequestGame` object as arguments and updates the game with that game ID using those attributes at the API, updating the `games` array if successful
- `destroyGame`: function that takes a game ID as an argument and destroys the game with that ID at the API, updating the `games` array accordingly

Each of the provided function can optionally take `onSuccess` and `onError` callbacks, in that order. These callbacks are of the `CallbackFunction` type; they take no arguments and have a `void` return type. They are useful for things like hiding a form after it has been successfully submitted.

Accessing games requires a user to be authenticated, so the `GamesProvider` can only be rendered inside a [`LoginProvider`](/docs/contexts/login-context.md). Note that the `GamesProvider` itself calls the `requireLogin` function provided by the login context, so this function should not be called in any `GamesContext` consumers. The `GamesProvider` must also also nested in a [`PageProvider`](/docs/contexts/page-context.md), which allows it to control flash messages and modal forms.

## Example

```tsx
/**
 *
 * /src/components/parent/parent.tsx
 *
 */

import { LoginProvider } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { GamesProvider } from '../../contexts/gamesContext'
import Child from '../child/child'

const Parent = () => (
  <LoginProvider>
    <PageProvider>
      <GamesProvider>
        <Child />
      </GamesProvider>
    </PageProvider>
  </LoginProvider>
)

export default Parent

/**
 *
 * /src/components/child/child.tsx
 *
 */

import { type ResponseGame as Game } from '../../types/apiData'
import { useGamesContext } from '../../hooks/contexts'
import { PulseLoader } from 'react-spinners'
import styles from './child.module.css'

const Child = () => {
  const { games, gamesLoadingState } = useGamesContext()

  return (
    {gamesLoadingState === 'LOADING' ? <PulseLoader /> : (
      <div className={styles.root}>
        {games.map(({ id, description, name }: Game) => (
          <div className={styles.game} key={id}>
            <h3 className={styles.title}>{name}</h3>
            <p className={styles.description}>{description || 'This game has no description.'}</p>
          </div>
        ))}
      </div>
    )}
  )
}

export default Child
```

In this example, the child component takes the games retrieved from the context, displaying a loading component if the games are loading and information about each game if the games have loaded. (Note that this minimal example does not handle the case where the `gamesLoadingState` is `'ERROR'`.)
