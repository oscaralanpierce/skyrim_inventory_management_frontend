import {
  useState,
  useEffect,
  useRef,
  type FormEventHandler,
  type CSSProperties,
} from 'react'
import { type RequestWishList } from '../../types/apiData'
import { DONE } from '../../utils/loadingStates'
import { BLUE } from '../../utils/colorSchemes'
import {
  usePageContext,
  usePlaythroughsContext,
  useWishListsContext,
} from '../../hooks/contexts'
import styles from './wishListCreateForm.module.css'

const WishListCreateForm = () => {
  const { apiCallsInProgress } = usePageContext()
  const { playthroughsLoadingState } = usePlaythroughsContext()
  const { wishListsLoadingState, createWishList } =
    useWishListsContext()

  const [disabled, setDisabled] = useState(
    playthroughsLoadingState !== DONE ||
      wishListsLoadingState !== DONE ||
      !!apiCallsInProgress.wishLists.length
  )

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const colorVars = {
    '--button-color': BLUE.schemeColorDark,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
    '--button-hover-color': BLUE.hoverColorLight,
  } as CSSProperties

  const extractAttributes = (formData: FormData): RequestWishList => {
    const values = Object.fromEntries(Array.from(formData.entries())) as Record<
      string,
      string
    >
    const attributes: RequestWishList = {}

    if (values.title) attributes.title = values.title.trim()

    return attributes
  }

  const create: FormEventHandler = (e) => {
    e.preventDefault()

    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const attributes = extractAttributes(formData)

    const clearForm = () => {
      formRef.current?.reset()
    }

    const focusInput = () => {
      formRef.current?.reset()
      inputRef.current?.focus()
    }

    createWishList(attributes, clearForm, focusInput)
  }

  useEffect(() => {
    if (
      playthroughsLoadingState === DONE &&
      wishListsLoadingState === DONE &&
      !apiCallsInProgress.wishLists.length
    ) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [playthroughsLoadingState, wishListsLoadingState, apiCallsInProgress])

  return (
    <form
      className={styles.root}
      style={colorVars}
      ref={formRef}
      onSubmit={create}
    >
      <fieldset className={styles.fieldset}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          name="title"
          placeholder="Title"
          aria-label="Title"
          pattern="\s*[A-Za-z0-9 \-',]*\s*"
          title="Title can only contain alphanumeric characters, spaces, commas, hyphens, and apostrophes"
          disabled={disabled}
        />
        <button className={styles.button} type="submit" disabled={disabled}>
          Create
        </button>
      </fieldset>
    </form>
  )
}

export default WishListCreateForm
