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
  description: string
  listTitle: string
  buttonColor: ColorScheme
  quantity: number
  unitWeight?: number | null
  notes?: string | null
}

const ShoppingListItemEditForm = ({
  itemId,
  description,
  listTitle,
  buttonColor,
  quantity,
  unitWeight,
  notes,
}: EditFormProps) => {
  const { setFlashProps } = usePageContext()
  const { updateShoppingListItem } = useShoppingListsContext()
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const colorVars = {
    '--button-background-color': buttonColor.schemeColorDarkest,
    '--button-text-color': buttonColor.textColorPrimary,
    '--button-hover-color': buttonColor.hoverColorDark,
    '--button-border-color': buttonColor.borderColor,
  } as CSSProperties

  useEffect(() => {
    inputRef.current?.focus()
  })

  return (
    <div className={styles.root} style={colorVars}>
      <h3 className={styles.header}>{description}</h3>
      <p className={styles.subheader}>{`On list "${listTitle}"`}</p>
      <form ref={formRef} data-testid={`editShoppingListItem${itemId}Form`}>
        <fieldset className={styles.fieldset}>
          <label className={styles.label}>
            Quantity
            <input
              className={styles.input}
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
