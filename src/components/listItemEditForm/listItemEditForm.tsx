import {
  useEffect,
  useRef,
  type CSSProperties,
  type SubmitEventHandler,
  type SubmitEvent,
} from 'react'
import { type RequestWishListItem, type RequestInventoryItem } from '../../types/apiData'
import { type ColorScheme } from '../../utils/colorSchemes'
import styles from './listItemEditForm.module.css'

export type SubmitHandlerType =
  | ((attributes: RequestWishListItem | null) => void)
  | ((attributes: RequestInventoryItem | null) => void)

interface ListItemEditFormProps {
  listTitle: string
  buttonColor: ColorScheme
  itemAttributes: {
    itemId: number,
    description: string,
    quantity: number,
    unitWeight?: number | null,
    notes?: string | null,
  }
  onSubmit: SubmitHandlerType
}

const ListItemEditForm = ({
  listTitle,
  buttonColor,
  itemAttributes,
  onSubmit,
}: ListItemEditFormProps) => {
  const { itemId, description, quantity, unitWeight, notes } = itemAttributes
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const colorVars = {
    '--button-background-color': buttonColor.schemeColorDarkest,
    '--button-text-color': buttonColor.textColorPrimary,
    '--button-hover-color': buttonColor.hoverColorDark,
    '--button-border-color': buttonColor.borderColor,
  } as CSSProperties

  const extractAttributes = (
    formData: FormData
  ): RequestWishListItem | RequestInventoryItem | null => {
    const values = Object.fromEntries(Array.from(formData.entries())) as Record<string, string>
    const attributes: RequestWishListItem | RequestInventoryItem = {}

    // For some reason, on line 64, unitWeight was being evaluated as
    // a string, resulting in the value never being equal and an API
    // call being made when unit weight was actually unchanged. We have
    // to cast the unitWeight as a number before making the comparison.
    const currentUnitWeight = unitWeight === null ? null : Number(unitWeight)

    const newQuantity = values.quantity ? Number(values.quantity) : null
    const newWeight = values.unitWeight ? Number(values.unitWeight) : null
    const newNotes = values.notes?.trim() || null

    if (typeof newQuantity === 'number' && newQuantity !== quantity)
      attributes.quantity = newQuantity
    if (newWeight !== currentUnitWeight) attributes.unit_weight = newWeight
    if (newNotes !== notes) attributes.notes = newNotes

    if (!Object.keys(attributes).length) return null

    return attributes
  }

  const updateItem: SubmitEventHandler = (e: SubmitEvent) => {
    e.preventDefault()
    
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const attributes = extractAttributes(formData)

    onSubmit(attributes)
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
        data-testid={`editListItem${itemId}Form`}
        onSubmit={updateItem}
      >
        <fieldset className={styles.fieldset}>
          <label className={styles.label}>
            Quantity
            <input
              className={styles.input}
              name='quantity'
              ref={inputRef}
              type='number'
              inputMode='numeric'
              min={1}
              placeholder='Quantity'
              defaultValue={quantity || undefined}
              pattern='^[0-9]*$'
              title='Quantity must be an integer greater than 0'
              required
            />
          </label>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <label className={styles.label}>
            Unit Weight
            <input
              className={styles.input}
              name='unitWeight'
              type='number'
              inputMode='decimal'
              min={0}
              step={0.1}
              placeholder='Unit Weight'
              defaultValue={unitWeight || undefined}
            />
          </label>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <label className={styles.label}>
            Notes
            <input
              className={styles.input}
              name='notes'
              type='text'
              placeholder='Notes'
              defaultValue={notes || undefined}
            />
          </label>
        </fieldset>
        <button className={styles.submit} type='submit'>
          Update Item
        </button>
      </form>
    </div>
  )
}

export default ListItemEditForm