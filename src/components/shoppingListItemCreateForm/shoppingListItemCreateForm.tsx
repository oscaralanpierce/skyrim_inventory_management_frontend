import {
  useRef,
  useState,
  useEffect,
  type FormEventHandler,
  type CSSProperties,
} from 'react'
import classNames from 'classnames'
import AnimateHeight from 'react-animate-height'
import { RequestShoppingListItem } from '../../types/apiData'
import { useShoppingListsContext, useColorScheme } from '../../hooks/contexts'
import styles from './shoppingListItemCreateForm.module.css'

interface CreateFormProps {
  listId: number
}

const ShoppingListItemCreateForm = ({ listId }: CreateFormProps) => {
  const { createShoppingListItem } = useShoppingListsContext()
  const [expanded, setExpanded] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    schemeColorDark,
    hoverColorLight,
    schemeColorLightest,
    borderColor,
    textColorSecondary,
    textColorTertiary,
  } = useColorScheme()

  const colorVars = {
    '--base-color': schemeColorDark,
    '--hover-color': hoverColorLight,
    '--body-color': schemeColorLightest,
    '--border-color': borderColor,
    '--text-color-main': textColorSecondary,
    '--text-color-secondary': textColorTertiary,
  } as CSSProperties

  const toggleForm = () => {
    setExpanded(!expanded)
  }

  const extractItem = (formData: FormData): RequestShoppingListItem => {
    const attributes = Object.fromEntries(
      Array.from(formData.entries()).filter(([_, value]) => !!value)
    ) as Record<string, string>

    const returnValue: RequestShoppingListItem = {
      description: attributes.description,
      quantity: Number(attributes.quantity),
    }

    if (attributes.unit_weight)
      returnValue.unit_weight = Number(attributes.unit_weight)
    if (attributes.notes) returnValue.notes = attributes.notes

    return returnValue
  }

  const createItem: FormEventHandler = (e) => {
    e.preventDefault()

    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const attributes = extractItem(formData)

    const collapseForm = () => setExpanded(false)

    createShoppingListItem(listId, attributes, collapseForm, collapseForm)
  }

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus()
    } else {
      formRef.current?.reset()
      inputRef.current?.blur()
    }
  }, [expanded])

  return (
    <div
      className={classNames(styles.root, { [styles.collapsed]: !expanded })}
      style={colorVars}
    >
      <div className={styles.triggerContainer}>
        <button
          className={styles.trigger}
          aria-expanded={expanded}
          aria-controls={`addItemToShoppingList${listId}`}
          onClick={toggleForm}
        >
          Add item to list...
        </button>
      </div>
      <AnimateHeight
        id={`addItemToShoppingList${listId}`}
        duration={200}
        height={expanded ? 'auto' : 0}
      >
        <form
          className={styles.form}
          ref={formRef}
          onSubmit={createItem}
          aria-label="Shopping list item creation form"
        >
          <label className={styles.label}>
            Description
            <input
              className={styles.input}
              ref={inputRef}
              type="text"
              name="description"
              placeholder="Description"
              required
            />
          </label>

          <label className={styles.label}>
            Quantity
            <input
              className={styles.input}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              pattern="^[0-9]*$"
              name="quantity"
              placeholder="Quantity"
              defaultValue={1}
              required
            />
          </label>

          <label className={styles.label}>
            Unit Weight
            <input
              className={styles.input}
              type="number"
              inputMode="numeric"
              name="unit_weight"
              min={0}
              step={0.1}
              placeholder="Unit Weight"
            />
          </label>

          <label className={styles.label}>
            Notes
            <input
              className={styles.input}
              type="text"
              name="notes"
              placeholder="Notes"
            />
          </label>

          <button className={styles.submit} type="submit">
            Add to List
          </button>
        </form>
      </AnimateHeight>
    </div>
  )
}

export default ShoppingListItemCreateForm
