import {
  useState,
  useRef,
  type MouseEventHandler,
  type ReactElement,
  type CSSProperties,
} from 'react'
import AnimateHeight from 'react-animate-height'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useColorScheme, useShoppingListsContext } from '../../hooks/contexts'
import styles from './shoppingList.module.css'

interface ShoppingListProps {
  listId: number
  title: string
  canEdit?: boolean
  children?: ReactElement | ReactElement[] | null
}

const ShoppingList = ({
  listId,
  title,
  canEdit = false,
  children,
}: ShoppingListProps) => {
  const DELETE_CONFIRMATION = `Are you sure you want to delete the list "${title}"? You will also lose any list items on the list. This action cannot be undone.`

  const { destroyShoppingList } = useShoppingListsContext()
  const [expanded, setExpanded] = useState(false)

  const deleteRef = useRef<HTMLButtonElement>(null)

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

  const toggleDetails: MouseEventHandler = (e) => {
    if (
      deleteRef.current &&
      deleteRef.current !== e.target &&
      !deleteRef.current.contains(e.target as Node)
    ) {
      setExpanded(!expanded)
    }
  }

  const destroy: MouseEventHandler = (e) => {
    e.preventDefault()

    const shouldDestroy = window.confirm(DELETE_CONFIRMATION)

    if (shouldDestroy) destroyShoppingList(listId)
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
        {canEdit && (
          <span className={styles.icons}>
            <button
              ref={deleteRef}
              className={styles.icon}
              onClick={destroy}
              data-testid={`destroyShoppingList${listId}`}
            >
              <FontAwesomeIcon className={styles.fa} icon={faXmark} />
            </button>
          </span>
        )}
        <h3 className={styles.title}>{title}</h3>
      </div>
      <AnimateHeight
        id={`list${listId}Details`}
        duration={200}
        height={expanded ? 'auto' : 0}
      >
        <div className={styles.details}>
          {children || (
            <p className={styles.emptyList}>
              This shopping list has no list items.
            </p>
          )}
        </div>
      </AnimateHeight>
    </div>
  )
}

export default ShoppingList
