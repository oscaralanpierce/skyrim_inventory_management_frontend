import { useState, type MouseEventHandler } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import AnimateHeight from 'react-animate-height'
import { RequestPlaythrough as Playthrough } from '../../types/apiData'
import { usePlaythroughsContext, usePageContext } from '../../hooks/contexts'
import PlaythroughForm from '../playthroughForm/playthroughForm'
import styles from './playthroughLineItem.module.css'

const DEFAULT_DESCRIPTION = 'This playthrough has no description.'
const DESTROY_CONFIRMATION =
  'Are you sure you want to delete this playthrough? This cannot be undone. You will lose all data associated with the playthrough you delete.'

interface PlaythroughLineItemProps {
  playthroughId: number
  name: string
  description: string | null
}

const PlaythroughLineItem = ({ playthroughId, name, description }: PlaythroughLineItemProps) => {
  const { updatePlaythrough, destroyPlaythrough } = usePlaythroughsContext()
  const { setFlashProps, setModalProps } = usePageContext()
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  const toggleDescription: MouseEventHandler = (e) => {
    e.preventDefault()

    setDescriptionExpanded(!descriptionExpanded)
  }

  const destroy: MouseEventHandler = (e) => {
    e.preventDefault()

    const confirm = window.confirm(DESTROY_CONFIRMATION)

    if (confirm) {
      destroyPlaythrough(playthroughId)
    } else {
      setFlashProps({
        hidden: false,
        type: 'info',
        message: 'OK, your playthrough will not be destroyed.',
      })
    }
  }

  const showEditForm: MouseEventHandler = (e) => {
    e.preventDefault()

    const submit = (attributes: Playthrough) => {
      if (attributes.name === name && attributes.description === description) {
        setModalProps({
          hidden: true,
          children: <></>,
        })
      } else {
        updatePlaythrough(playthroughId, attributes)
      }
    }

    setModalProps({
      hidden: false,
      children: (
        <PlaythroughForm
          submitForm={submit}
          type="edit"
          defaultName={name}
          defaultDescription={description}
        />
      ),
    })
  }

  return (
    <div className={styles.root}>
      <div className={styles.summary}>
        <span>
          <button
            className={styles.icon}
            onClick={destroy}
            data-testid={`destroyPlaythrough${playthroughId}`}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <button
            className={styles.icon}
            onClick={showEditForm}
            data-testid={`editPlaythrough${playthroughId}`}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </span>
        <h3
          role="button"
          aria-expanded={descriptionExpanded}
          aria-controls={`playthrough${playthroughId}Details`}
          className={styles.header}
          onClick={toggleDescription}
        >
          {name}
        </h3>
      </div>
      <AnimateHeight
        id={`playthrough${playthroughId}Details`}
        duration={200}
        height={descriptionExpanded ? 'auto' : 0}
      >
        <p className={styles.description}>
          {description || DEFAULT_DESCRIPTION}
        </p>
      </AnimateHeight>
    </div>
  )
}

export default PlaythroughLineItem
