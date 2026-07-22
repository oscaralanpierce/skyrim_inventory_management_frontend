export default {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@chromatic-com/storybook',
    '@storybook/addon-docs'
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  docs: {},

  staticDirs: ['../public'],

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },

  async viteFinal(config) {
    config.resolve = config.resolve || {}
    config.resolve.dedupe = [...(config.resolve.dedupe || []), 'msw']
    return config
  }
}
