import { useRef, type FormEventHandler, type CSSProperties } from 'react'
import { type RequestShoppingList } from '../../types/apiData'
import { DONE } from '../../utils/loadingStates'
import { BLUE } from '../../utils/colorSchemes'
import { useGamesContext, useShoppingListsContext } from '../../hooks/contexts'
import styles from './shoppingListCreateForm.module.css'

const ShoppingListCreateForm = () => {
  const { gamesLoadingState } = useGamesContext()
  const { shoppingListsLoadingState, createShoppingList } =
    useShoppingListsContext()

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled =
    gamesLoadingState !== DONE || shoppingListsLoadingState !== DONE

  const colorVars = {
    '--button-color': BLUE.schemeColorDark,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
    '--button-hover-color': BLUE.hoverColorLight,
  } as CSSProperties

  const extractAttributes = (formData: FormData): RequestShoppingList => {
    const values = Object.fromEntries(Array.from(formData.entries())) as Record<
      string,
      string
    >
    const attributes: RequestShoppingList = {}

    if (values.title) attributes.title = values.title

    return attributes
  }

  const createList: FormEventHandler = (e) => {
    e.preventDefault()

    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const attributes = extractAttributes(formData)

    const clearForm = () => {
      formRef.current?.reset()
    }

    const focusInput = () => {
      inputRef.current?.focus()
    }

    createShoppingList(attributes, clearForm, focusInput)
  }

  return (
    <form
      className={styles.root}
      style={colorVars}
      ref={formRef}
      onSubmit={createList}
    >
      <fieldset className={styles.fieldset}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          name="title"
          placeholder="Title"
          aria-label="Title"
          pattern="\s*[A-Za-z0-9 \-',]*\s*"
          title="Title can only contain alphanumeric characters, spaces, commas, hyphens, and apostrophes"
          disabled={disabled}
        />
        <button className={styles.button} type="submit" disabled={disabled}>
          Create
        </button>
      </fieldset>
    </form>
  )
}

export default ShoppingListCreateForm
