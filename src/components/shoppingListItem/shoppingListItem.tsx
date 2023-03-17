import { useState, type CSSProperties } from 'react'
import classNames from 'classnames'
import AnimateHeight from 'react-animate-height'
import { useColorScheme } from '../../hooks/contexts'
import styles from './shoppingListItem.module.css'

interface ShoppingListItemProps {
  itemId: number
  description: string
  quantity: number
  unitWeight?: number | null
  notes?: string | null
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

  return weight % 1 === 0 ? weight.toFixed(0) : weight.toFixed(1)
}

const ShoppingListItem = ({
  itemId,
  description,
  quantity,
  unitWeight,
  notes,
}: ShoppingListItemProps) => {
  const [expanded, setExpanded] = useState(false)

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

  const toggleDetails = () => {
    setExpanded(!expanded)
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
        <span className={styles.descriptionContainer}>
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
