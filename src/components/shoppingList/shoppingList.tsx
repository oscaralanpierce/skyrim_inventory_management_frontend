import { useState, type CSSProperties } from 'react'
import AnimateHeight from 'react-animate-height'
import { useColorScheme } from '../../hooks/contexts'
import styles from './shoppingList.module.css'

interface ShoppingListProps {
  listId: number
  title: string
}

const ShoppingList = ({ listId, title }: ShoppingListProps) => {
  const [expanded, setExpanded] = useState(false)

  const {
    schemeColorDarkest,
    borderColor,
    textColorPrimary,
    textColorSecondary,
    hoverColorDark,
    schemeColorDark,
    schemeColorLightest,
  } = useColorScheme()

  const styleVars = {
    '--scheme-color': schemeColorDarkest,
    '--border-color': borderColor,
    '--text-color-primary': textColorPrimary,
    '--text-color-secondary': textColorSecondary,
    '--hover-color': hoverColorDark,
    '--scheme-color-lighter': schemeColorDark,
    '--scheme-color-lightest': schemeColorLightest,
  } as CSSProperties

  const toggleDetails = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={styles.root} style={styleVars}>
      <div
        role="button"
        className={styles.trigger}
        onClick={toggleDetails}
        aria-expanded={expanded}
        aria-controls={`list${listId}Details`}
      >
        <h3 className={styles.title}>{title}</h3>
      </div>
      <AnimateHeight
        id={`list${listId}Details`}
        duration={200}
        height={expanded ? 'auto' : 0}
      >
        <div className={styles.details}>
          <p className={styles.emptyList}>
            This shopping list has no list items.
          </p>
        </div>
      </AnimateHeight>
    </div>
  )
}

export default ShoppingList
