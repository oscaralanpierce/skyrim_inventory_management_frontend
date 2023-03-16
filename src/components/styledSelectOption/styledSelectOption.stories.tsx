import StyledSelectOption from './styledSelectOption'

export default { title: 'StyledSelectOption' }


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

export const WithShortName = () => (
  <StyledSelectOption
    optionName="Option 1"
    onClick={() => {}}
    onKeyDown={() => {}}
    ariaSelected={false}
  />
)

export const WithLongName = () => (
  <StyledSelectOption
    optionName="Neque porro quisquam est quis dolorem ipsum quia dolor sit amet"
    onClick={() => {}}
    onKeyDown={() => {}}
    ariaSelected={false}
  />
)

export const WithStyledParent = () => (
  <ul style={{ listStyleType: 'none', paddingLeft: '12px' }}>
    <StyledSelectOption
      optionName="Option 1"
      onClick={() => {}}
      onKeyDown={() => {}}
      ariaSelected={false}
    />
  </ul>
)

export const Selected = () => (
  <StyledSelectOption
    optionName="Option 1"
    onClick={() => {}}
    onKeyDown={() => {}}
    ariaSelected={true}
  />
)
