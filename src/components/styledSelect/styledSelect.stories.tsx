import { allGames } from '../../support/data/games'
import StyledSelect from './styledSelect'

export default { title: 'StyledSelect' }

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

export const WithOptions = () => (
  <StyledSelect
    options={options}
    onOptionSelected={() => {}}
    placeholder="Doesn't matter"
  />
)

export const WithLongOptions = () => (
  <StyledSelect
    options={longOptions}
    onOptionSelected={() => {}}
    placeholder="Select an option..."
  />
)

export const WithDefaultOption = () => (
  <StyledSelect
    options={options}
    onOptionSelected={() => {}}
    defaultOption={options[1]}
    placeholder="Select an option..."
  />
)

export const NoOptions = () => (
  <StyledSelect
    options={[]}
    onOptionSelected={() => {}}
    placeholder="No options available"
  />
)

export const NoOptionsLongPlaceholder = () => (
  <StyledSelect
    options={[]}
    onOptionSelected={() => {}}
    placeholder="This placeholder is way too long."
  />
)

export const Disabled = () => (
  <StyledSelect
    options={options}
    onOptionSelected={() => {}}
    placeholder="Doesn't matter"
    disabled
  />
)
