import { initialize, mswLoader } from 'msw-storybook-addon'

// Initialize MSW
initialize()

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const loaders = [mswLoader]

export const tags = ['autodocs']
