import {
  useState,
  useRef,
  useEffect,
  type MouseEventHandler,
  type ReactElement,
  type CSSProperties,
} from 'react'
import AnimateHeight from 'react-animate-height'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import {
  useColorScheme,
  usePageContext,
  useShoppingListsContext,
} from '../../hooks/contexts'
import useComponentVisible from '../../hooks/useComponentVisible'
import useSize from '../../hooks/useSize'
import ListEditForm from '../listEditForm/listEditForm'
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
  const { setFlashProps } = usePageContext()
  const [expanded, setExpanded] = useState(false)
  const [maxEditFormWidth, setMaxEditFormWidth] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLSpanElement>(null)
  const deleteRef = useRef<HTMLButtonElement>(null)

  const size = useSize(containerRef)

  const {
    componentRef,
    triggerRef,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible()

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
    '--max-title-width': `${maxEditFormWidth - 32}px`,
  } as CSSProperties

  const toggleDetails: MouseEventHandler = (e) => {
    if (
      !iconsRef.current ||
      (iconsRef.current !== e.target &&
        !iconsRef.current.contains(e.target as Node))
    ) {
      setExpanded(!expanded)
    }
  }

  const destroy: MouseEventHandler = (e) => {
    e.preventDefault()

    const shouldDestroy = window.confirm(DELETE_CONFIRMATION)

    if (shouldDestroy) {
      destroyShoppingList(listId)
    } else {
      setFlashProps({
        hidden: false,
        type: 'info',
        message: 'OK, your shopping list will not be destroyed.',
      })
    }
  }

  useEffect(() => {
    if (!canEdit || !size || !iconsRef.current) return

    setMaxEditFormWidth(size.width - iconsRef.current.offsetWidth - 16)
  }, [canEdit, size])

  return (
    <div className={styles.root} style={styleVars}>
      <div
        role="button"
        ref={containerRef}
        className={styles.trigger}
        onClick={toggleDetails}
        aria-expanded={expanded}
        aria-controls={`list${listId}Details`}
      >
        {canEdit && (
          <span className={styles.icons} ref={iconsRef}>
            <button
              ref={deleteRef}
              className={styles.icon}
              onClick={destroy}
              data-testid={`destroyShoppingList${listId}`}
            >
              <FontAwesomeIcon className={styles.fa} icon={faXmark} />
            </button>
            <button
              ref={triggerRef}
              className={styles.icon}
              data-testid={`editShoppingList${listId}`}
            >
              <FontAwesomeIcon className={styles.fa} icon={faPenToSquare} />
            </button>
          </span>
        )}
        {canEdit && isComponentVisible ? (
          <ListEditForm
            formRef={componentRef}
            className={styles.form}
            title={title}
            maxTotalWidth={maxEditFormWidth}
            onSubmit={(e) => e.preventDefault()}
          />
        ) : (
          <h3 className={styles.title}>{title}</h3>
        )}
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
