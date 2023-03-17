# Shopping Lists Context

The `ShoppingListsContext` keeps track of the active game and its shopping lists. The `ShoppingListsProvider` makes the following values available to consumers:

- `shoppingLists`: array of [`ResponseShoppingList`](/src/types/apiData.d.ts), the shopping lists returned from the API for the current active game
- `shoppingListsLoadingStatus`: string of either `'LOADING'`, `'ERROR'`, or `'DONE'`, indicating whether shopping lists have loaded successfully from the API initialised as `'LOADING'`

Note that, while the context tracks the active game, this information is internal to the context. The active game is identified using the `gameId` query string parameter, which is typically set using the games dropdown component found on the `DashboardLayout`.

The `ShoppingListContext` is a consumer of the `GamesContext` and, as such, must be nested inside a `GamesProvider` and the other context providers it requires, namely the `LoginProvider` and the `PageProvider`.

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
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import Child from '../child/child'

const Parent = () => (
  <LoginProvider>
    <PageProvider>
      <GamesProvider>
        <ShoppingListsProvider>
          <Child />
        </ShoppingListsProvider>
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

import { type ResponseShoppingList as ShoppingList } from '../../types/apiData'
import { useShoppingListsContext } from '../../hooks/contexts'
import { PulseLoader } from 'react-spinners'
import styles from './child.module.css'

const Child = () => {
  const { shoppingLists, shoppingListsLoadingState } = useShoppingListsContext()

  return (
    {shoppingListsLoadingState === 'LOADING' ? <PulseLoader /> : (
      <div className={styles.root}>
        {shoppingLists.map(({ id, title }: ShoppingList) => (
          <div className={styles.shoppingList} key={id}>
            <h3 className={styles.title}>{title}</h3>
          </div>
        ))}
      </div>
    )}
  )
}

export default Child
```
