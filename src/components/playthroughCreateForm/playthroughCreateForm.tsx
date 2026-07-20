import {
  useState,
  useRef,
  type CSSProperties,
  type FormEventHandler,
} from 'react'
import AnimateHeight from 'react-animate-height'
import { type RequestPlaythrough as Playthrough } from '../../types/apiData'
import { BLUE } from '../../utils/colorSchemes'
import { usePlaythroughsContext } from '../../hooks/contexts'
import styles from './playthroughCreateForm.module.css'

interface PlaythroughCreateFormProps {
  disabled?: boolean
}

const PlaythroughCreateForm = ({ disabled }: PlaythroughCreateFormProps) => {
  const { createPlaythrough } = usePlaythroughsContext()
  const [formExpanded, setFormExpanded] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const colorVars = {
    '--button-color': BLUE.schemeColorDark,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
    '--button-hover-color': BLUE.hoverColorLight,
  } as CSSProperties

  const focusInputIfExpanded = () => {
    if (formExpanded) {
      inputRef.current?.focus()
    } else {
      inputRef.current?.blur()
    }
  }

  const extractPlaythrough = (formData: FormData): Playthrough => {
    const values = Object.fromEntries(Array.from(formData.entries())) as Record<
      string,
      string
    >
    return {
      name: values.name?.trim() || null,
      description: values.description?.trim() || null,
    }
  }

  const submitForm: FormEventHandler = (e) => {
    e.preventDefault()

    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const playthrough = extractPlaythrough(formData)

    createPlaythrough(playthrough, () => {
      formRef.current?.reset()
      formRef.current?.blur()
      setFormExpanded(false)
    })
  }

  return (
    <div className={styles.root} style={colorVars}>
      <h3
        role="button"
        aria-expanded={formExpanded}
        aria-controls="playthroughCreateForm"
        className={styles.toggle}
        onClick={() => setFormExpanded(!formExpanded)}
      >
        Create Playthrough...
      </h3>
      <AnimateHeight
        id="playthroughCreateForm"
        duration={200}
        height={formExpanded ? 'auto' : 0}
        onHeightAnimationEnd={focusInputIfExpanded}
      >
        <form
          ref={formRef}
          className={styles.form}
          data-testid="playthroughCreateFormForm"
          onSubmit={submitForm}
        >
          <fieldset className={styles.fieldset}>
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              name="name"
              placeholder="Name"
              aria-label="Name"
              data-testid="createNameField"
              pattern="^\s*[A-Za-z0-9 \-',]*\s*$"
              title="Name can contain only alphanumeric characters, spaces, commas, hyphens, and apostrophes"
              disabled={disabled}
            />
          </fieldset>
          <fieldset className={styles.fieldset}>
            <input
              className={styles.input}
              type="text"
              name="description"
              placeholder="Description"
              aria-label="Description"
              data-testid="createDescriptionField"
              disabled={disabled}
            />
          </fieldset>
          <button
            className={styles.button}
            type="submit"
            data-testid="createPlaythroughSubmit"
            disabled={disabled}
          >
            Create
          </button>
        </form>
      </AnimateHeight>
    </div>
  )
}

export default PlaythroughCreateForm
