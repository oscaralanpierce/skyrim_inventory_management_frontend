import {
  useState,
  useRef,
  type CSSProperties,
  type RefObject,
  type MouseEventHandler,
} from 'react'
import classNames from 'classnames'
import AnimateHeight from 'react-animate-height'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import {
  useColorScheme,
  usePageContext,
  useShoppingListsContext,
} from '../../hooks/contexts'
import styles from './shoppingListItem.module.css'

interface ShoppingListItemProps {
  itemId: number
  description: string
  quantity: number
  unitWeight?: number | null
  notes?: string | null
  canEdit?: boolean
}

/**
 *
 * If the unit weight has an integer value, we want to display it
 * as an integer. Only if it has a non-zero value in the decimal
 * place should it be displayed as a decimal.
 *
 */

const formatWeight = (weight?: number | null) => {
  if (!weight) return '-'

  weight = Number(weight)
  return weight % 1 === 0 ? weight.toFixed(0) : weight.toFixed(1)
}

const ShoppingListItem = ({
  itemId,
  description,
  quantity,
  unitWeight,
  notes,
  canEdit = false,
}: ShoppingListItemProps) => {
  const [expanded, setExpanded] = useState(false)
  const iconsRef = useRef<HTMLSpanElement>(null)

  const { setFlashProps } = usePageContext()
  const { destroyShoppingListItem } = useShoppingListsContext()

  const {
    schemeColorDark,
    hoverColorLight,
    textColorSecondary,
    borderColor,
    schemeColorLightest,
    textColorTertiary,
  } = useColorScheme()

  const styleVars = {
    '--main-color': schemeColorDark,
    '--title-text-color': textColorSecondary,
    '--border-color': borderColor,
    '--body-background-color': schemeColorLightest,
    '--body-text-color': textColorTertiary,
    '--hover-color': hoverColorLight,
  } as CSSProperties

  const refContains = (ref: RefObject<HTMLElement>, el: Node) =>
    ref.current && (ref.current === el || ref.current.contains(el))

  const toggleDetails: MouseEventHandler = (e) => {
    const target = e.target as Node

    if (!refContains(iconsRef, target)) setExpanded(!expanded)
  }

  const destroyItem: MouseEventHandler = (e) => {
    e.preventDefault()

    const confirmed = window.confirm(
      'Destroy shopping list item? Your aggregate list will be updated to reflect the change. This action cannot be undone.'
    )

    if (confirmed) {
      destroyShoppingListItem(itemId)
    } else {
      setFlashProps({
        hidden: false,
        type: 'info',
        message: 'OK, your shopping list item will not be deleted.',
      })
    }
  }

  return (
    <div
      className={classNames(styles.root, { [styles.expanded]: expanded })}
      style={styleVars}
    >
      <div
        role="button"
        className={styles.trigger}
        onClick={toggleDetails}
        aria-expanded={expanded}
        aria-controls={`shoppingListItem${itemId}Details`}
      >
        <span
          className={classNames(styles.descriptionContainer, {
            [styles.descriptionContainerEditable]: canEdit,
          })}
        >
          {canEdit && (
            <span className={styles.editIcons} ref={iconsRef}>
              <button
                className={styles.icon}
                onClick={destroyItem}
                data-testid={`destroyShoppingListItem${itemId}`}
              >
                <FontAwesomeIcon className={styles.fa} icon={faXmark} />
              </button>
            </span>
          )}
          <h3 className={styles.description}>{description}</h3>
        </span>
        <span className={styles.quantity}>{quantity}</span>
      </div>
      <AnimateHeight
        id={`shoppingListItem${itemId}Details`}
        duration={200}
        height={expanded ? 'auto' : 0}
      >
        <div className={styles.details}>
          <h4 className={styles.label}>Unit Weight:</h4>
          <p className={styles.value}>{formatWeight(unitWeight)}</p>

          <h4 className={styles.label}>Notes:</h4>
          <p className={styles.value}>{notes || '-'}</p>
        </div>
      </AnimateHeight>
    </div>
  )
}

export default ShoppingListItem
