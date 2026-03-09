# Login Context

The `LoginContext` keeps track of the logged in user, manages their tokens, signs out in the event of authentication errors, and provides a `requireLogin` function that can be used in the `useEffect` hook of any component using the context to sign out and redirect to the homepage if login is unsuccessful or no user is logged in.

The `LoginProvider`'s value makes the following values available:

- `user`: User (type defined in Firebase)
- `token`: string
- `authLoading`: boolean
- `requireLogin`: function
- `signOut`: function
- `withTokenRefresh`: function
  - Takes a single argument: a function taking the new ID token as a parameter

## Refreshing Tokens on Failed API Call

### Potential Issues

Each time the front end makes an API call to the back end, it includes the access token provided by Google. The token is then validated on the back end using the front end's credentials. This can pose a problem if the token expires between the time the user refreshes the page and the time the back end validates the token with Google, resulting in a user being logged out and having to log in again even if their token could've been refreshed. Refreshing tokens on the back end is infeasible, since it would entail one of two things:

1. Sending the refresh token to the back end over the network
2. Authenticating the back end separately with Google, giving it its own tokens, and authenticating the front end with `devise_token_auth` or the like

Of these options, the first is unacceptable for security reasons - sending the long-lived refresh token over the network would open SIM up to man-in-the-middle attacks, which are less likely since we are using HTTPS, but still possible. The second option is infeasible because it would involve an overhaul of our entire auth architecture and could entail months of work given how difficult it has been to work with Google Identity prior to the introduction of Firebase on the front end. Additionally, it would further complicate our auth system, making security vulnerabilities more likely.

### Required Solutions

In order to solve the issue of unnecessary logouts, the front end needs to refresh tokens and retry API calls that have returned a 401 response. Ideally, this would be taken care of within the API wrapper itself, however, it is not for the reasons described below. Consequently, when writing functions that call the API, developers should be sure to handle 401 responses from the API by retrying once using the `withTokenRefresh` function from the `LoginProvider`. A second 401 response should result in logout and redirection to the home/login page.

Why not rewrite the API wrapper as a context provider? There are a few reasons. Firstly, we need to be mindful of adding too many context providers, since it's easy for React components to become very deeply nested in context providers. These providers can also potentially interfere with one another, leading to subtle bugs that can be difficult to troubleshoot. Secondly, the API provider would be extremely bloated. There are already numerous functions corresponding to different endpoints (11 at this writing, before implementing the inventory lists feature). The current API wrapper is made more manageable by breaking it up into multiple files from which it imports and then exports these functions, but in a context provider that wouldn't be possible since all the functions would rely on the `LoginProvider`'s `withTokenRefresh` function. This would result in a provider that could easily balloon into thousands of lines of code. For that reason, it makes more sense to keep token refresh functionality in the existing, resource-specific context providers.

The existing pattern for retries is to create functions taking an `idToken` and `retries` as arguments that call themselves recursively from a catch function appended to a promise returned by the API wrapper function, as follows:

```ts
import { type ApiError } from '../../types/errors'
import { getResource } from '../../utils/simApi'
import { useGoogleLogin } from '../../hooks/contexts'

// Define context here

const MyProvider = ({ children }: MyProviderProps) => {
  const { token, withTokenRefresh } = useGoogleLogin()

  // Note that the type of the idToken is `string | null`, because
  // the `token` might be `null`.
  const fetchResource = (
    idToken?: string | null = token,
    retries?: number = 1
  ) => {
    if (idToken) {
      getResource(idToken)
        .then(({ json }) => {
          /* do something */
        })
        .catch((e: ApiError) => {
          if (e.code === 401 && retries > 0) {
            return withTokenRefresh((newToken) => {
              fetchResource(newToken, retries - 1)
            })
          } else {
            /* handle error */
          }
        })
    }
  }

  return (
    <MyContext value={{ fetchResource }}>
      {children}
    </MyContext>
  )
}
```

## Example

```tsx
/**
 *
 * /src/components/parent/parent.tsx
 *
 */

import { LoginProvider } from '../../contexts/loginContext'
import Child from '../child/child'

const Parent = () => (
  <LoginProvider>
    <Child />
  </LoginProvider>
)

export default Parent

/**
 *
 * /src/components/child/child.tsx
 *
 */

import { useEffect } from 'react'
import { useGoogleLogin } from '../../hooks/contexts'
import { PulseLoader } from 'react-spinners'
import styles from './child/module.css'

const Child = () => {
  const { user, authLoading, requireLogin } = useGoogleLogin()

  useEffect(() => {
    requireLogin()
  }, [requireLogin])

  if (authLoading) {
    return <PulseLoader />
  } else {
    return (
      <div className={styles.root}>
        <img src={user.photoURL} />
        <span className={styles.info}>
          <h3 className={styles.name}>{user.displayName}</h3>
          <p className={styles.email}>{user.email}</h3>
        </span>
      </div>
    )
  }
}

export default Child
```

In this example, the login context identifies the signed-in user, if any, and provides that value and the `requireLogin` function to the child component. The component displays a loading component if the auth state hasn't fully loaded and, when it has, displays the user's information and profile photo. If there turns out not to be a user signed in, the page redirects to the homepage using the `requireLogin` function in the `useEffect` hook.

## Types

The `LoginProvider` takes no props other than `children`, which can be React (TSX) elements or string types.

## signOut vs. signOutWithGoogle

The [firebase.ts](/src/firebase.ts) file exports a function called `signOutWithGoogle`. This should not be used to sign out users. Instead, the `LoginProvider`'s `signOut` function should be used. The `signOutWithGoogle` function signs out the user but doesn't nullify the user's token in memory, meaning that it could still be used for other back-end requests after that user has logged out, even if another user has subsequently logged in, as long as the token hasn't expired and the second user doesn't refresh the page.
