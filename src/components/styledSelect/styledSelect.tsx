import {
  useState,
  useEffect,
  useRef,
  type KeyboardEventHandler,
  type CSSProperties,
} from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { BLUE } from '../../utils/colorSchemes'
import { measureText } from '../../utils/measureText'
import useSize from '../../hooks/useSize'
import useComponentVisible from '../../hooks/useComponentVisible'
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
  onSubmitInput: (value: string) => void
  disabled?: boolean
  defaultOption?: SelectOption | null
  className?: string
}

const truncatedText = (text: string, width?: number) => {
  if (!width) return

  // 48px is the width of the button (32px) + side margins (16px)
  const maxWidth = width - 48
  const font = '16px Quattrocento Sans'
  const textWidth = measureText(text, font)

  if (textWidth < maxWidth) return text

  // Subtract ~3 since we will be adding ellipses to any truncated
  // option names
  let maxLength = text.length - 3
  text = text.substring(0, maxLength - 1)

  while (measureText(`${text.trim()}...`, font) >= maxWidth) {
    maxLength--
    text = text.substring(0, maxLength - 1)
  }

  return `${text.trim()}...`
}

const isEqual = (option1: SelectOption, option2: SelectOption) =>
  option1.optionName === option2.optionName &&
  option1.optionValue === option2.optionValue

const StyledSelect = ({
  options,
  placeholder,
  onOptionSelected,
  onSubmitInput,
  defaultOption,
  disabled,
  className,
}: StyledSelectProps) => {
  const [activeOption, setActiveOption] = useState<SelectOption | null>(null)
  const [headerText, setHeaderText] = useState(defaultOption?.optionName || '')
  const {
    isComponentVisible,
    setIsComponentVisible,
    componentRef,
    triggerRef,
  } = useComponentVisible<HTMLDivElement, HTMLDivElement>()
  const size = useSize(triggerRef)
  const inputRef = useRef<HTMLInputElement>(null)

  const colorVars = {
    '--button-background-color': BLUE.schemeColorDarkest,
    '--button-hover-color': BLUE.hoverColorDark,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
  } as CSSProperties

  const selectOption = (value: string | number) => {
    const opt = options.find(({ optionValue }) => optionValue === value)

    if (opt) {
      setActiveOption(opt)
      setHeaderText(opt.optionName)
      setIsComponentVisible(false)
      onOptionSelected(value)
    }
  }

  const onKeyDown: KeyboardEventHandler = (e) => {
    if (!inputRef.current || e.key !== 'Enter') return

    const value = inputRef.current.value.trim()

    if (value.toLowerCase() === activeOption?.optionName.toLowerCase()) return

    const existingOption = options.find(
      ({ optionName }) => optionName.toLowerCase() === value.toLowerCase()
    )

    if (existingOption) {
      selectOption(existingOption.optionValue)
    } else {
      setHeaderText(inputRef.current.value)
      onSubmitInput(value)
    }

    inputRef.current?.blur()
  }

  useEffect(() => {
    const hideDropdown = (e: FocusEvent) => {
      if (
        componentRef.current &&
        componentRef.current !== e.relatedTarget &&
        !componentRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsComponentVisible(false)
      }
    }

    document.addEventListener('focusout', hideDropdown)

    return () => document.removeEventListener('focusout', hideDropdown)
  })

  useEffect(() => {
    if (defaultOption) {
      setHeaderText(defaultOption.optionName)
      setActiveOption(defaultOption)
    }
  }, [defaultOption])

  useEffect(() => {
    const text = truncatedText(headerText, size?.width)

    if (inputRef.current && text) inputRef.current.value = text
  }, [headerText, inputRef.current])

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
        ref={triggerRef}
        role="combobox"
        aria-haspopup="listbox"
        aria-owns="selectListbox"
        aria-controls="selectListbox"
        aria-expanded={isComponentVisible}
      >
        <input
          className={styles.headerText}
          ref={inputRef}
          placeholder={truncatedText(placeholder, size?.width)}
          aria-label="Add or Select Option"
          onKeyDown={onKeyDown}
        />
        <button className={styles.trigger} disabled={disabled}>
          <FontAwesomeIcon className={styles.fa} icon={faAngleDown} />
        </button>
      </div>
      <ul
        id="selectListbox"
        className={classNames(styles.dropdown, {
          [styles.hidden]: !isComponentVisible || !options.length,
        })}
        role="listbox"
      >
        {options.map((option, index) => {
          return (
            <StyledSelectOption
              key={index}
              onSelected={selectOption}
              ariaSelected={!!activeOption && isEqual(option, activeOption)}
              {...option}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default StyledSelect
