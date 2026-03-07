import { type Meta, type StoryObj } from '@storybook/react-vite'
import StyledSelectOption from './styledSelectOption'

type OptionStory = StoryObj<typeof StyledSelectOption>

const meta: Meta<typeof StyledSelectOption> = {
  title: 'StyledSelectOption',
  component: StyledSelectOption,
  decorators: [
    (Story, { parameters }) => {
      const { withStyledParent } = parameters
      const styles = {
        listStyleType: 'none',
        paddingLeft: '12px',
        width: '256px',
      }

      return withStyledParent ? (
        <ul style={styles}>
          <Story />
        </ul>
      ) : (
        <Story />
      )
    },
  ],
}

export default meta

/**
 *
 * As a rule, we don't want these options to have bullet points, however,
 * the presence or absence of bullet points on a <li> element (which the
 * StyledSelectOption is) is determined by the `list-style-type` CSS
 * property on the parent <ul>. The WithStyledParent story gives an
 * imperfect example of what this component looks like when the parent
 * <ul> is styled appropriately.
 *
 */

const onSelected = () => {}

export const WithShortName: OptionStory = {
  args: {
    optionName: 'Option 1',
    optionValue: 12,
    onSelected,
    ariaSelected: false,
  },
}

// Ugly name but this name caused it to wrap weirdly in the past so
// this name will be used to ensure that isn't happening.
export const WithLongName: OptionStory = {
  args: {
    optionName: 'This Name Has 50 Characters Exactly 1234 Wwwwwwwww',
    optionValue: 'De finibus bonorum et malorum',
    onSelected,
    ariaSelected: false,
  },
}

export const WithStyledParent: OptionStory = {
  args: WithShortName.args,
  parameters: {
    withStyledParent: true,
  },
}

export const WithLongNameAndStyledParent: OptionStory = {
  args: WithLongName.args,
  parameters: {
    withStyledParent: true,
  },
}

/**
 *
 * This has no special appearance, but inspecting the element
 * will reveal that its `aria-selected` attribute is set to "true".
 *
 */

export const Selected: OptionStory = {
  args: {
    ...WithShortName.args,
    ariaSelected: true,
  },
}
