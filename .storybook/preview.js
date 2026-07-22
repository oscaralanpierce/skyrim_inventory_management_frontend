export const parameters = {
  actions: {
    argTypes: {
      onClick: { action: 'clicked' }
    }
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
export const tags = ['autodocs'];
