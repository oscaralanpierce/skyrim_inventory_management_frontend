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

export interface SelectOption {
  optionName: string
  optionValue: string | number
}

interface StyledSelectProps {
  options: SelectOption[]
  placeholder: string
  onOptionSelected: (optionValue: string | number) => void
  disabled?: boolean
  defaultOption?: SelectOption | null
  className?: string
}

const truncatedText = (text: string) => {
  return text.length > 24 ? `${text.substring(0, 23).trim()}...` : text
}

const isEqual = (option1: SelectOption, option2: SelectOption) =>
  option1.optionName === option2.optionName &&
  option1.optionValue === option2.optionValue

const StyledSelect = ({
  options,
  placeholder,
  onOptionSelected,
  defaultOption,
  disabled,
  className,
}: StyledSelectProps) => {
  const [activeOption, setActiveOption] = useState<SelectOption | null>(
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

    if (disabled) return

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

  useEffect(() => {
    if (defaultOption && !activeOption) {
      setHeaderText(defaultOption.optionName)
    }
  }, [defaultOption, activeOption])

  return (
    <div
      className={classNames(styles.root, className, {
        [styles.disabled]: disabled,
      })}
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
        <button className={styles.trigger} disabled={disabled}>
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
              ariaSelected={!!activeOption && isEqual(option, activeOption)}
              optionName={option.optionName}
              optionValue={option.optionValue}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default StyledSelect
