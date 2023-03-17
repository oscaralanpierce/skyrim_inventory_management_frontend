# Contexts in SIM

SIM uses [React contexts](https://reactjs.org/docs/context.html) for state management. This prevents "smart" components that fetch data or control state from having to pass through props to their children, their children's children, and so on. There are currently four contexts:

- [`ColorContext`](/docs/contexts/color-context.md)
- [`GamesContext`](/docs/contexts/games-context.md)
- [`LoginContext`](/docs/contexts/login-context.md)
- [`PageContext`](/docs/contexts/page-context.md)
- [`ShoppingListsContext`](/docs/contexts/shopping-lists-context.md)

For each context, there is a [custom hook](/src/hooks/contexts.js) that can be used to invoke it in consumers. The custom hooks, in order of the contexts above, are:

- `useColorScheme()`
- `useGamesContext()`
- `useGoogleLogin()`
- `usePageContext()`
- `useShoppingListsContext()`

You can learn more about these hooks by reading the docs linked above.
