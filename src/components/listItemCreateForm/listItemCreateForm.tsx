import {
  type CSSProperties,
  type SubmitEvent,
  type SubmitEventHandler,
  useEffect,
  useRef,
  useState
} from 'react'
import { type RequestWishListItem, type RequestInventoryItem } from '../../types/apiData'
import { type CallbackFunction } from '../../types/functions'
import { useColorScheme } from '../../hooks/contexts'
import classNames from 'classnames'
import AnimateHeight from 'react-animate-height'
import styles from './listItemCreateForm.module.css'

export type SubmitHandlerType =
  | ((attributes: RequestWishListItem, onSuccess: CallbackFunction, onError: CallbackFunction) => void)
  | ((attributes: RequestInventoryItem, onSuccess: CallbackFunction, onError: CallbackFunction) => void)

interface ListItemCreateFormProps {
  listId: number
  resource: 'Wish list' | 'Inventory'
  onSubmit: SubmitHandlerType
}

const ListItemCreateForm = ({ listId, resource, onSubmit }: ListItemCreateFormProps) => {
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

  const extractItem = (formData: FormData): RequestWishListItem | RequestInventoryItem => {
    const attributes = Object.fromEntries(
      Array.from(formData.entries()).filter(([__dirname, value]) => !!value)
    ) as Record<string, string>

    const returnValue: RequestWishListItem | RequestInventoryItem = {
      description: attributes.description?.trim(),
      quantity: Number(attributes.quantity),
    }

    if (attributes.unitWeight)
      returnValue.unit_weight = Number(attributes.unitWeight)
    if (attributes.notes) returnValue.notes = attributes.notes.trim()

    return returnValue
  }

  const createItem: SubmitEventHandler = (e: SubmitEvent) => {
    e.preventDefault()

    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const attributes = extractItem(formData)

    const collapseForm = () => setExpanded(false)

    onSubmit(attributes, collapseForm, collapseForm)
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
      className = {classNames(styles.root, { [styles.collapsed]: !expanded })}
      style={colorVars}
    >
      <div className={styles.triggerContainer}>
        <button
          className={styles.trigger}
          aria-expanded={expanded}
          aria-controls={`addItemToList${listId}`}
          onClick={toggleForm}
        >
          Add item to list...
        </button>
      </div>
      <AnimateHeight
        id={`addItemToList${listId}`}
        duration={200}
        height={expanded ? 'auto' : 0}
      >
        <form
          className={styles.form}
          ref={formRef}
          onSubmit={createItem}
          aria-label={`${resource} item creation form`}
        >
          <label className={styles.label}>
            Description
            <input
              className={styles.input}
              ref={inputRef}
              type='text'
              name='description'
              placeholder='Description'
              required
            />
          </label>

          <label className={styles.label}>
            Quantity
            <input
              className={styles.input}
              type='number'
              inputMode='numeric'
              min={1}
              step={1}
              pattern='^[0-9]*$'
              name='quantity'
              placeholder='Quantity'
              defaultValue={1}
              required
            />
          </label>

          <label className={styles.label}>
            Unit Weight
            <input
              className={styles.input}
              type='number'
              inputMode='decimal'
              name='unitWeight'
              min={0}
              step={0.1}
              placeholder='Unit Weight'
            />
          </label>

          <label className={styles.label}>
            Notes
            <input
              className={styles.input}
              type='text'
              name='notes'
              placeholder='Notes'
            />
          </label>

          <button className={styles.submit} type='submit'>
            Add to List
          </button>
        </form>
      </AnimateHeight>
    </div>
  )
}

export default ListItemCreateForm