# Skyrim Inventory Management Frontend

This is the rewritten frontend to Skyrim Inventory Management. The original frontend, which has been decommissioned, can be found at https://github.com/oscaralanpierce/sim_legacy_frontend.

## Table of Contents

- [Production Site](#production-site)
- [Overview](#overview)
- [Developer Information](#developer-information)
  - [Running Locally](#running-locally)
    - [Running the Back End](#running-the-back-end)
    - [Running the Front End](#running-the-front-end)
  - [Development Workflows](#development-workflows)
  - [Testing](#testing)
    - [Testing with Vitest](#testing-with-vitest)
      - [Writing Tests](#writing-tests)
    - [Testing with Storybook](#testing-with-storybook)
      - [Writing Stories](#writing-stories)
  - [Deploying from a Local Environment](#deploying-from-a-local-environment)
  - [GitHub Actions](#github-actions)
    - [Tests](#tests)
    - [Deploys](#deploys)

## Production Site

https://sim.oscaralanpierce.com

## Overview

Skyrim Inventory Management is a split-stack app enabling users to manage inventory and tasks in Skyrim. This app is primarily intended for my personal use and anybody else should use at their own risk. The back end is available in [this repo](https://github.com/oscaralanpierce/skyrim_inventory_management) and runs in production at https://sim-api.oscaralanpierce.com. The SIM front end is the only authorised client at this time.

The front-end rewrite uses [Vite](https://vitejs.dev) (replacing the now-defunct `create-react-app`) with [React](https://reactjs.org) and [TypeScript](https://typescriptlang.org).

## Developer Information

### Running Locally

#### Running the Back End

In order to run the front end locally, you will need to run the backend on `http://localhost:3000`. Additional instructions are available in the README of the [backend repo](https://github.com/oscaralanpierce/skyrim_inventory_management).

#### Running the Front End

Before you can run the front end, you will need to install dependencies. Clone this repository, `cd` into it, and run:

```
yarn
```

You can run the front-end server using:

```
yarn dev
```

In keeping with Vite defaults, the SIM front end is configured to run on `http://localhost:5173` when you run this command. The API's [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) policy dictates that the front end must run on port 5173 in development.

### Development Workflows

We use [this Trello board](https://trello.com/b/Jo7Z3oUh/sim-project-board) to track work for both this app and the SIM API. When picking up a card, check out a development branch on your local to make the changes you need to make.

When you have finished the work, push to GitHub and make a pull request. Link the Trello card in the PR description. The PR description should also include:

- **Context:** Any information a reader will need to understand why you've made the changes you have
- **Summary of Changes:** A bulleted list summarising the changes you have made
- **Explanation:** A detailed explanation of any technical or design choices you made, tradeoffs you faced, and alternatives you considered, including enough detail to make sense to a reviewer or a future developer investigating Git history

All pull requests are expected to include updates to Storybook stories and developer and/or user documentation as appropriate. Storybook stories should cover any possible component states, such as loading states or states resulting from API error responses. API docs for the SIM API are available [in the docs directory](https://github.com/oscaralanpierce/skyrim_inventory_management/blob/main/docs/api/README.md) of that repo.

After creating your pull requests, attach them to the Trello card and move it into the "Reviewing" column. When your PRs have been reviewed, you are free to merge them.

### Testing

#### Testing with Vitest

[Vitest](https://vitest.dev/) has been set up with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) to handle testing of components.

It is recommended, per the docs, to take a behaviour-based approach to testing, using the React Testing Library tooling to interact with elements like a user would. It's important that we write these tests with an eye to ensuring complete coverage of underlying logic, however. Not all of this logic will be in the components themselves, so we will need to simulate state that may not be directly testable.

To run the tests, you'll need to first run `yarn install` to make sure your dependencies are installed and up-to-date. To run the tests, run:

```
yarn test
```

This will run the tests in watch mode, running tests every time you save a file. You can press `q` to exit watch mode and go back to your terminal.

To get test coverage metrics, run:

```
yarn coverage
```

##### Writing Tests

In general, all components should have tests. These live in a file in the component's directory called `componentName.test.tsx`. Tests should cover any relevant component state, such as verifying that a dropdown menu is hidden when a component renders and appears when a link is clicked. Tests should also cover component behaviour varying based on API call results. For example, if a component renders normally on a success response and displays an error on an error response, both the success case and error case should have tests. Snapshot tests are also recommended for most components and component states.

The details of how to use Vitest and React Testing Library are too detailed to cover in this README. You are encouraged to visit the docs for these tools and read existing test files to learn how to use these tools if you don't already know.

#### Testing with Storybook

[Storybook](https://storybook.js.org/) is a critical component of SIM's testing strategy in that it allows us to view and develop components in isolation from one another. Storybook runs on a server on port 6006, and can be started by running:

```
yarn storybook
```

You can now view stories in your browser at `http://localhost:6006`.

Storybook plays an especially critical role for SIM, because for accessibility reasons, we do as much as possible with HTML and CSS instead of JavaScript, and CSS rules aren't applied in Vitest tests. It's also not possible to specify a viewport width in Vitest tests. These two factors combine to mean that, for example, if an element is set to `display: none` at a certain viewport width, Vitest will treat it as though its `display` property is the default for that element type (e.g., `inline` for `span` elements, `block` for `h1`, etc.)

##### Writing Stories

Storybook stories for each component, including page and layout components, are stored in the component's directory in a file called `componentName.stories.tsx`. The basic structure of a Story file looks like this:

```tsx
import ComponentName from './componentName'

export default { title: 'ComponentName' }

export const Default = () => <ComponentName />
```

This will create a group of stories called "ComponentName" with an individual story called "Default". If there is only one story for a component, it should be named Default, however, this is a convention we are using and it is possible to name the named export anything. If a component has multiple distinct states, such as if it appears differently depending on whether a user is signed in, there should be a story for each of these states. These stories should be descriptively named, so in this example you might have two named exports called `SignedIn` and `SignedOut`.

If the component needs to be nested inside a context provider or router, you will also need to import these components and wrap it:

```tsx
export const Default = () => (
  <BrowserRouter>
    <ColorProvider colorScheme={PINK}>
      <ComponentName />
    </ColorProvider>
  </BrowserRouter>
)
```

Sometimes you'll also want to wrap a component in an additional HTML tag, for example, to constrain the size of a component that has `width: 100%` but is intended to be used inside a narrow parent. This prevents the component from stretching to fill the entire Storybook window:

```tsx
export const Default = () => (
  <div style={{ width: '340px' }}>
    <ComponentName />
  </div>
)
```

You do not need separate stories for component states that can be effected by interacting with the component, such as an element that appears or disappears when another element is clicked. However, enabling these states to function properly may involve usmocking API calls. For components that make API calls, separate stories are often required for different API call results, such as one story that illustrates component behaviour when the API returns a successful response and another for each relevant error type.

### Deploying from a Local Environment

To deploy from a local environment, you will need to have the following environment variables set to the correct values:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

In order to avoid committing secrets to Git, you should use a `.env` file (see [dotenv docs](https://www.npmjs.com/package/dotenv) for details) to define these variables.

Once these variables have been set, you can run:

```
firebase login
```

This will take you to a login page in your browser where you pick your authorized Google account. Once you've authenticated, you can return to your terminal and run:

```
firebase deploy
```

That's it!

### GitHub Actions

#### Tests

Vitest has been configured to run in CI with GitHub actions. It runs against all pull requests against `main`, as well as when `main` is merged. After merging new code, make sure the build has passed before deploying to Heroku.

When working on an epic on a feature branch, you may want to configure GitHub Actions to run against PRs against the feature branch (or merges to that branch) and not just `main`. This can be done in the [pipeline definition file](/.github/workflows/ci.yml) by changing the following block:

```yml
on:
  push:
    branches: [main, your-feature-branch]
  pull_request:
    branches: [main, your-feature-branch]
```

#### Deploys

On merge to `main`, GitHub actions will build and deploy to Firebase. This is handled by the automatically generated `.github/workflows/firebase-hosting-merge.yml` file.

**Note:** We do not have a staging environment in Firebase. So, when creating a feature branch, it is critical that you not update `.github/workflows/firebase-hosting-merge.yml` to include your feature branch like you can with the `ci.yml` file. Doing so will deploy anything merged to your feature branch directly to production.
