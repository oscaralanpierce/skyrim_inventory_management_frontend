import {
  useState,
  useRef,
  useEffect,
  type MouseEventHandler,
  type FormEventHandler,
  type ReactElement,
  type CSSProperties,
} from 'react'
import AnimateHeight from 'react-animate-height'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { type RequestWishList } from '../../types/apiData'
import {
  useColorScheme,
  usePageContext,
  useWishListsContext,
} from '../../hooks/contexts'
import useComponentVisible from '../../hooks/useComponentVisible'
import useSize from '../../hooks/useSize'
import WishListItemCreateForm from '../wishListItemCreateForm/wishListItemCreateForm'
import ListEditForm from '../listEditForm/listEditForm'
import styles from './wishList.module.css'

interface WishListProps {
  listId: number
  title: string
  editable?: boolean
  children?: ReactElement | ReactElement[] | null
}

const WishList = ({
  listId,
  title,
  editable = false,
  children,
}: WishListProps) => {
  const { updateWishList, destroyWishList } = useWishListsContext()
  const { setFlashProps } = usePageContext()
  const [expanded, setExpanded] = useState(false)
  const [maxEditFormWidth, setMaxEditFormWidth] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLSpanElement>(null)

  const size = useSize(containerRef)

  const {
    componentRef,
    triggerRef,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible<HTMLFormElement, HTMLButtonElement>()

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

  const shouldToggleDetails = (target: Node) => {
    if (
      iconsRef.current &&
      (iconsRef.current === target || iconsRef.current.contains(target))
    )
      return false

    if (
      componentRef.current &&
      (componentRef.current === target || componentRef.current.contains(target))
    )
      return false

    return true
  }

  const toggleDetails: MouseEventHandler = (e) => {
    const target = e.target as Node

    if (shouldToggleDetails(target)) {
      setExpanded(!expanded)
    }
  }

  const destroy: MouseEventHandler = (e) => {
    e.preventDefault()

    const confirmation = `Are you sure you want to delete the list "${title}"? You will also lose any list items on the list. This action cannot be undone.`
    const confirmed = window.confirm(confirmation)

    if (confirmed) {
      destroyWishList(listId)
    } else {
      setFlashProps({
        hidden: false,
        type: 'info',
        message: 'OK, your wish list will not be destroyed.',
      })
    }
  }

  const extractAttributes = (
    formData: FormData
  ): RequestWishList | null => {
    const attributes = Object.fromEntries(
      Array.from(formData.entries())
    ) as Record<string, string>

    attributes.title = attributes.title?.trim()

    if (attributes.title === title) return null

    return { title: attributes.title }
  }

  const submitAndHideForm: FormEventHandler = (e) => {
    e.preventDefault()

    if (!componentRef.current) return

    const formData = new FormData(componentRef.current)
    const attributes = extractAttributes(formData)

    const onSuccess = () => setIsComponentVisible(false)

    if (attributes) {
      updateWishList(listId, attributes, onSuccess)
    } else {
      setIsComponentVisible(false)
    }
  }

  useEffect(() => {
    if (!editable || !size || !iconsRef.current) return

    const width = size.width - iconsRef.current.offsetWidth + 16

    setMaxEditFormWidth(width)
  }, [editable, size])

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
        {editable && (
          <span className={styles.icons} ref={iconsRef}>
            <button
              className={styles.icon}
              onClick={destroy}
              data-testid={`destroyWishList${listId}`}
            >
              <FontAwesomeIcon className={styles.fa} icon={faXmark} />
            </button>
            <button
              ref={triggerRef}
              className={styles.icon}
              data-testid={`editWishList${listId}`}
            >
              <FontAwesomeIcon className={styles.fa} icon={faPenToSquare} />
            </button>
          </span>
        )}
        {editable && isComponentVisible ? (
          <ListEditForm
            formRef={componentRef}
            className={styles.form}
            title={title}
            maxTotalWidth={maxEditFormWidth}
            onSubmit={submitAndHideForm}
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
          {editable && <WishListItemCreateForm listId={listId} />}
          {/* We only want to display the "This wish list has no list items"
          message if there is no list item creation form */}
          {children || editable ? (
            children
          ) : (
            <p className={styles.emptyList}>
              This wish list has no list items.
            </p>
          )}
        </div>
      </AnimateHeight>
    </div>
  )
}

export default WishList
