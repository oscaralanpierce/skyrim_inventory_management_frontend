import { type FormEventHandler, type CSSProperties } from 'react'
import { BLUE } from '../../utils/colorSchemes'
import { useGamesContext, useShoppingListsContext } from '../../hooks/contexts'
import styles from './shoppingListCreateForm.module.css'
import { DONE } from '../../utils/loadingStates'

const ShoppingListCreateForm = () => {
  const { gamesLoadingState } = useGamesContext()
  const { shoppingListsLoadingState } = useShoppingListsContext()

  const disabled =
    gamesLoadingState !== DONE || shoppingListsLoadingState !== DONE

  const colorVars = {
    '--button-color': BLUE.schemeColorDark,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
    '--button-hover-color': BLUE.hoverColorLight,
  } as CSSProperties

  const createList: FormEventHandler = (e) => {
    e.preventDefault()
  }

  return (
    <div className={styles.root} style={colorVars}>
      <form onSubmit={createList}>
        <fieldset className={styles.fieldset}>
          <input
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
    </div>
  )
}

export default ShoppingListCreateForm
