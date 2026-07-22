# Inventory Lists Context

The `InventoryListsContext` keeps track of the active playthrough and its inventory lists. The `InventoryListsProvider` makes the following values available to consumers:

- `inventoryLists`: array of [`ResponseInventoryList`](/src/types/apiData.d.ts), the inventory lists returned from the API for the current active playthrough
- `inventoryListsLoadingStatus`: string of either `'LOADING'`, `'ERROR'`, or `'DONE'`, indicating whether inventory lists have loaded successfully from the API, initialised as `'LOADING'`
- `createInventoryList`: a function that creates an inventory list for the current active playthrough at the API, taking the following arguments:
  - `attributes`: an object containing an optional `title` key with a string value, the attributes of the inventory list to create
  - `onSuccess` (optional): a callback called on a successful response; no arguments are passed in and its return value, if any, is not used
  - `onError` (optional): a callback called on an unsuccessful response; no arguments are passed in and its return value, if any, is not used
- `updateInventoryList`: a function that creates an inventory list for the current active playthrough at the API, taking the following arguments:
  - `listId`: the ID of the inventory list to be updated
  - `attributes`: an object containing an optional `title` key with a string value, the attributes of the inventory list to create
  - `onSuccess` (optional): a callback called on a successful response; no arguments are passed in and its return value, if any, is not used
  - `onError` (optional): a callback called on an unsuccessful response; no arguments are passed in and its return value, if any, is not used
- `destroyInventoryList`: a function that destroys the selected inventory list at the API, taking the following arguments:
  - `listId`: the `id` of the inventory list to be destroyed
  - `onSuccess` (optional): a callback called on a successful response; no arguments are passed in and its return value, if any, is not used
  - `onError` (optional): a callback called on an unsuccessful response; no arguments are passed in and its return value, if any, is not used
- `createInventoryItem`: a function that creates an inventory item on the selected inventory list at the API, taking the following arguments:
  - `listId`: the `id` of the list on which to create the inventory item
  - `attributes`: the attributes of the item to be created (required attributes are `description` (string) and `quantity` (number))
  - `onSuccess` (optional): a callback called on a successful response; no arguments are passed in and its return value, if any, is not used
  - `onError` (optional): a callback called on an unsuccessful response; no arguments are passed in and its return value, if any, is not used
- `updateInventoryItem`: a function that updates an inventory item at the API, taking the following arguments:
  - `itemId`: the `id` of the inventory item to be updated
  - `attributes`: the attributes of the item to be updated (`description` is not allowed as a value)
  - `onSuccess` (optional): a callback called on a successful response; no arguments are passed in and its return value, if any, is not used
  - `onError` (optional): a callback called on an unsuccessful response; no arguments are passed in and its return value, if any, is not used
- `destroyInventoryItem`: a function that destroys the selected inventory list at the API, taking the following arguments:
  - `itemId`: the `id` of the inventory item to be destroyed
  - `onSuccess` (optional): a callback called on a successful response; no arguments are passed in and its return value, if any, is not used
  - `onError` (optional): a callback called on an unsuccessful response; no arguments are passed in and its return value, if any, is not used

Note that, while the context tracks the active playthrough, this information is internal to the context. The active playthrough is identified using the `playthroughId` query string parameter, which is typically set using the playthroughs dropdown component found on the `DashboardLayout`.

The `InventoryListsContext` is a consumer of the `PlaythroughsContext` and, as such, must be nested inside a `PlaythroughsProvider` and the other context providers it requires, namely the `LoginProvider` and the `PageProvider`.

## Example

```tsx
/**
 *
 * /src/components/parent/parent.tsx
 *
 */

import { LoginProvider } from '../../contexts/loginContext'
import { PageProvider } from '../../contexts/pageContext'
import { PlaythroughsProvider } from '../../contexts/playthroughsContext'
import { InventoryListsProvider } from '../../contexts/inventoryListsContext'
import Child from '../child/child'

const Parent = () => (
  <LoginProvider>
    <PageProvider>
      <PlaythroughsProvider>
        <InventoryListsProvider>
          <Child />
        </InventoryListsProvider>
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

import { type ResponseInventoryList as InventoryList } from '../../types/apiData'
import { useInventoryListsContext } from '../../hooks/contexts'
import { PulseLoader } from 'react-spinners'
import styles from './child.module.css'

const Child = () => {
  const { inventoryLists, inventoryListsLoadingState } = useInventoryListsContext()

  return (
    {inventoryListsLoadingState === 'LOADING' ? <PulseLoader /> : (
      <div className={styles.root}>
        {inventoryLists.map(({ id, title }: InventoryList) => (
          <div className={styles.inventoryList} key={id}>
            <h3 className={styles.title}>{title}</h3>
          </div>
        ))}
      </div>
    )}
  )
}

export default Child
```
