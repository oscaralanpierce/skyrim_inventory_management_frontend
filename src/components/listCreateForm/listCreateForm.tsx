import { CSSProperties, SubmitEvent, useRef, type SubmitEventHandler } from 'react'
import { type RequestInventoryList, type RequestWishList } from '../../types/apiData'
import { CallbackFunction } from '../../types/functions'
import { BLUE } from '../../utils/colorSchemes'
import styles from './listCreateForm.module.css'

export type SubmitHandlerType =
  | ((attributes: RequestWishList, onSuccess?: CallbackFunction | null, onError?: CallbackFunction | null) => void)
  | ((attributes: RequestInventoryList, onSuccess?: CallbackFunction | null, onError?: CallbackFunction | null) => void)

interface ListCreateFormProps {
  onSubmit: SubmitHandlerType
  disabled: boolean
}

const ListCreateForm = ({ onSubmit, disabled }: ListCreateFormProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const colorVars = {
    '--button-color': BLUE.schemeColorDark,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
    '--button-hover-color': BLUE.hoverColorLight,
  } as CSSProperties

  const extractAttributes = (formData: FormData): RequestInventoryList | RequestWishList => {
    const values = Object.fromEntries(Array.from(formData.entries())) as Record<
      string,
      string
    >
    const attributes: RequestInventoryList | RequestWishList = {}

    if (values.title) attributes.title = values.title.trim()

    return attributes
  }

  const create: SubmitEventHandler = (e: SubmitEvent) => {
    e.preventDefault()

    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const attributes = extractAttributes(formData)

    const clearForm = () => {
      formRef.current?.reset()
    }

    const focusInput = () => {
      formRef.current?.reset()
      inputRef.current?.focus()
    }

    onSubmit(attributes, clearForm, focusInput)
  }

  return (
    <form
      className={styles.root}
      style={colorVars}
      ref={formRef}
      onSubmit={create}
    >
      <fieldset className={styles.fieldset}>
        <input
          ref={inputRef}
          className={styles.input}
          type='text'
          name='title'
          placeholder='Title'
          aria-label='Title'
          pattern="\s*[A-Za-z0-9 \-',]*\s*"
          title='Title can only contain alphanumeric characters, spaces, commas, hyphens, and apostrophes'
          disabled={disabled}
        />
        <button className={styles.button} type='submit' disabled={disabled}>
          Create
        </button>
      </fieldset>
    </form>
  )
}

export default ListCreateForm