import { type Meta, type StoryObj } from '@storybook/react-vite'
import { allGames } from '../../support/data/games'
import StyledSelect from './styledSelect'

type Story = StoryObj<typeof StyledSelect>

const meta: Meta<typeof StyledSelect> = {
  title: 'StyledSelect',
  component: StyledSelect,
}

export default meta

const options = allGames.map(({ name, id }) => ({
  optionName: name,
  optionValue: id,
}))

/**
 *
 * Just double it up - we just want to see what the component
 * looks like with more items on the list to where you have to
 * scroll.
 *
 */
const longOptions = [...options, ...options]

const onOptionSelected = () => {}

export const WithOptions: Story = {
  args: {
    options,
    onOptionSelected,
    defaultOption: options[0],
    placeholder: "Doesn't matter",
    disabled: false,
  },
}

export const WithLongOptions: Story = {
  args: {
    ...WithOptions.args,
    options: longOptions,
  },
}

options.push({
  optionName: 'This Name Has 50 Characters Exactly 1234 Wwwwwwwww',
  optionValue: 27,
})

export const WithLongDefaultOption: Story = {
  args: {
    options,
    onOptionSelected,
    defaultOption: options[options.length - 1],
    placeholder: "Doesn't matter",
  },
}

export const NoOptions: Story = {
  args: {
    options: [],
    onOptionSelected,
    placeholder: 'No options available',
  },
}
