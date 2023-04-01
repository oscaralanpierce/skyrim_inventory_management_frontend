# Shopping Lists Context

The `ShoppingListsContext` keeps track of the active game and its shopping lists. The `ShoppingListsProvider` makes the following values available to consumers:

- `shoppingLists`: array of [`ResponseShoppingList`](/src/types/apiData.d.ts), the shopping lists returned from the API for the current active game
- `shoppingListsLoadingStatus`: string of either `'LOADING'`, `'ERROR'`, or `'DONE'`, indicating whether shopping lists have loaded successfully from the API initialised as `'LOADING'`
- `createShoppingList`: a function that creates a shopping list for the current active game at the API, taking the following arguments:
  - `attributes`: an object containing an optional `title` key with a string value, the attributes of the shopping list to create
  - `onSuccess` (optional): a callback called on a successful response; no arguments are passed in and its return value, if any, is not used
  - `onError` (optional): a callback called on an unsuccessful response; no arguments are passed in and its return value, if any, is not used
- `updateShoppingList`: a function that creates a shopping list for the current active game at the API, taking the following arguments:
  - `listId`: the ID of the shopping list to be updated
  - `attributes`: an object containing an optional `title` key with a string value, the attributes of the shopping list to create
  - `onSuccess` (optional): a callback called on a successful response; no arguments are passed in and its return value, if any, is not used
  - `onError` (optional): a callback called on an unsuccessful response; no arguments are passed in and its return value, if any, is not used
- `destroyShoppingList`: a function that destroys the selected shopping list at the API, taking the following arguments:
  - `listId`: the `id` of the shopping list to be destroyed
  - `onSuccess` (optional): a callback called on a successful response; no arguments are passed in and its return value, if any, is not used
  - `onError` (optional): a callback called on an unsuccessful response; no arguments are passed in and its return value, if any, is not used
- `createShoppingListItem`: a function that creates a shopping list item on the selected shopping list at the API, taking the following arguments:
  - `listId`: the `id` of the list on which to create the shopping list item
  - `attributes`: the attributes of the item to be created (required attributes are `description` (string) and `quantity` (number))
  - `onSuccess` (optional): a callback called on a successful response; no arguments are passed in and its return value, if any, is not used
  - `onError` (optional): a callback called on an unsuccessful response; no arguments are passed in and its return value, if any, is not used
- `destroyShoppingListItem`: a function that destroys the selected shopping list at the API, taking the following arguments:
  - `itemId`: the `id` of the shopping list item to be destroyed
  - `onSuccess` (optional): a callback called on a successful response; no arguments are passed in and its return value, if any, is not used
  - `onError` (optional): a callback called on an unsuccessful response; no arguments are passed in and its return value, if any, is not used

Note that, while the context tracks the active game, this information is internal to the context. The active game is identified using the `gameId` query string parameter, which is typically set using the games dropdown component found on the `DashboardLayout`.

The `ShoppingListsContext` is a consumer of the `GamesContext` and, as such, must be nested inside a `GamesProvider` and the other context providers it requires, namely the `LoginProvider` and the `PageProvider`.

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
