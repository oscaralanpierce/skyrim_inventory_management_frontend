import {
  useState,
  useEffect,
  useRef,
  type MouseEventHandler,
  type CSSProperties,
} from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { BLUE } from '../../utils/colorSchemes'
import StyledSelectOption from '../styledSelectOption/styledSelectOption'
import styles from './styledSelect.module.css'

interface Option {
  optionName: string
  optionValue: string | number
}

interface StyledSelectProps {
  options: Option[]
  placeholder: string
  onOptionSelected: (optionValue: string | number) => void
  defaultOption?: Option
}

const truncatedText = (text: string) => {
  return text.length > 24 ? `${text.substring(0, 23).trim()}...` : text
}

const StyledSelect = ({
  options,
  placeholder,
  onOptionSelected,
  defaultOption,
}: StyledSelectProps) => {
  const [activeOption, setActiveOption] = useState<Option | null>(
    defaultOption || null
  )
  const [headerText, setHeaderText] = useState(defaultOption?.optionName || '')
  const [expanded, setExpanded] = useState(false)
  const componentRef = useRef<HTMLDivElement>(null)

  const colorVars = {
    '--button-background-color': BLUE.schemeColorDarkest,
    '--button-hover-color': BLUE.hoverColorDark,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
  } as CSSProperties

  const toggleDropdown: MouseEventHandler = (e) => {
    e.preventDefault()

    setExpanded(!expanded)
  }

  const selectOption = (value: string | number) => {
    const opt = options.find(({ optionValue }) => optionValue === value)

    if (opt) {
      setActiveOption(opt)
      setHeaderText(opt.optionName)
      setExpanded(false)
      onOptionSelected(value)
    }
  }

  useEffect(() => {
    const hideDropdown = (e: FocusEvent) => {
      if (
        componentRef.current &&
        componentRef.current !== e.relatedTarget &&
        !componentRef.current.contains(e.relatedTarget as Node)
      ) {
        setExpanded(false)
      }
    }

    document.addEventListener('focusout', hideDropdown)

    return () => document.removeEventListener('focusout', hideDropdown)
  })

  return (
    <div
      className={styles.root}
      style={colorVars}
      ref={componentRef}
      data-testid="styledSelect"
    >
      <div
        className={styles.header}
        role="combobox"
        aria-haspopup="listbox"
        aria-owns="selectListbox"
        aria-controls="selectListbox"
        aria-expanded={expanded}
        onClick={toggleDropdown}
      >
        <p className={styles.headerText} data-testid="selectedOption">
          {truncatedText(options.length ? headerText : placeholder)}
        </p>
        <button className={styles.trigger} data-testid="selectTrigger">
          <FontAwesomeIcon className={styles.fa} icon={faAngleDown} />
        </button>
      </div>
      <ul
        id="selectListbox"
        className={classNames(styles.dropdown, {
          [styles.hidden]: !expanded || !options.length,
        })}
        role="listbox"
      >
        {options.map((option, index) => {
          return (
            <StyledSelectOption
              key={index}
              onSelected={selectOption}
              ariaSelected={option === activeOption}
              {...option}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default StyledSelect
