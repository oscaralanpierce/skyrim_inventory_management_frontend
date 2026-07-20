# Contexts in SIM

SIM uses [React contexts](https://reactjs.org/docs/context.html) for state management. This prevents "smart" components that fetch data or control state from having to pass through props to their children, their children's children, and so on. There are currently four contexts:

- [`ColorContext`](/docs/contexts/color-context.md)
- [`PlaythroughsContext`](/docs/contexts/playthroughs-context.md)
- [`LoginContext`](/docs/contexts/login-context.md)
- [`PageContext`](/docs/contexts/page-context.md)
- [`WishListsContext`](/docs/contexts/wish-lists-context.md)

For each context, there is a [custom hook](/src/hooks/contexts.js) that can be used to invoke it in consumers. The custom hooks, in order of the contexts above, are:

- `useColorScheme()`
- `usePlaythroughsContext()`
- `useGoogleLogin()`
- `usePageContext()`
- `useWishListsContext()`

You can learn more about these hooks by reading the docs linked above.
