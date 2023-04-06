import {
  useEffect,
  useRef,
  type CSSProperties,
  type FormEventHandler,
} from 'react'
import { RequestShoppingListItem as ListItem } from '../../types/apiData'
import { ColorScheme } from '../../utils/colorSchemes'
import { usePageContext, useShoppingListsContext } from '../../hooks/contexts'
import styles from './shoppingListItemEditForm.module.css'

interface EditFormProps {
  itemId: number
  listTitle: string
  description: string
  buttonColor: ColorScheme
  quantity: number
  unitWeight?: number | null
  notes?: string | null
}

const ShoppingListItemEditForm = ({
  itemId,
  listTitle,
  description,
  buttonColor,
  quantity,
  unitWeight,
  notes,
}: EditFormProps) => {
  const { setFlashProps, setModalProps } = usePageContext()
  const { updateShoppingListItem } = useShoppingListsContext()
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const colorVars = {
    '--button-background-color': buttonColor.schemeColorDarkest,
    '--button-text-color': buttonColor.textColorPrimary,
    '--button-hover-color': buttonColor.hoverColorDark,
    '--button-border-color': buttonColor.borderColor,
  } as CSSProperties

  const extractAttributes = (formData: FormData): ListItem | null => {
    const values = Object.fromEntries(Array.from(formData.entries())) as Record<
      string,
      string
    >
    const attributes: ListItem = {}

    const newQty = values.quantity ? Number(values.quantity) : null
    const newWeight = values.unit_weight ? Number(values.unit_weight) : null
    const newNotes = values.notes || null

    if (typeof newQty === 'number' && newQty !== quantity)
      attributes.quantity = newQty
    if (newWeight !== unitWeight) attributes.unit_weight = newWeight
    if (newNotes !== notes) attributes.notes = newNotes

    if (!Object.keys(attributes).length) return null

    return attributes
  }

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    const onSuccess = () => {
      setModalProps({ hidden: true, children: <></> })
      setFlashProps({
        hidden: false,
        type: 'success',
        message: 'Success! Your shopping list item has been updated.',
      })
    }

    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const attributes = extractAttributes(formData)

    if (attributes) updateShoppingListItem(itemId, attributes, onSuccess)
  }

  useEffect(() => {
    inputRef.current?.focus()
  })

  return (
    <div className={styles.root} style={colorVars}>
      <h3 className={styles.header}>{description}</h3>
      <p className={styles.subheader}>{`On list "${listTitle}"`}</p>
      <form
        ref={formRef}
        data-testid={`editShoppingListItem${itemId}Form`}
        onSubmit={onSubmit}
      >
        <fieldset className={styles.fieldset}>
          <label className={styles.label}>
            Quantity
            <input
              className={styles.input}
              name="quantity"
              ref={inputRef}
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="Quantity"
              defaultValue={quantity || undefined}
              pattern="^[0-9]*$"
              title="Quantity must be an integer greater than 0"
              required
            />
          </label>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <label className={styles.label}>
            Unit Weight
            <input
              className={styles.input}
              name="unit_weight"
              type="number"
              inputMode="numeric"
              min={0}
              step={0.1}
              placeholder="Unit Weight"
              defaultValue={unitWeight || undefined}
            />
          </label>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <label className={styles.label}>
            Notes
            <input
              className={styles.input}
              name="notes"
              type="text"
              placeholder="Notes"
              defaultValue={notes || undefined}
            />
          </label>
        </fieldset>
        <button className={styles.submit} type="submit">
          Update Item
        </button>
      </form>
    </div>
  )
}

export default ShoppingListItemEditForm
