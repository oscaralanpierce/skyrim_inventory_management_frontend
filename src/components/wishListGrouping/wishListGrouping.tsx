import { type MouseEventHandler } from 'react'
import { type RequestPlaythrough as Playthrough } from '../../types/apiData'
import colorSchemes from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import { DONE } from '../../utils/loadingStates'
import {
  usePageContext,
  usePlaythroughsContext,
  useWishListsContext,
} from '../../hooks/contexts'
import PlaythroughForm from '../playthroughForm/playthroughForm'
import WishListItem from '../wishListItem/wishListItem'
import WishList from '../wishList/wishList'
import styles from './wishListGrouping.module.css'

const WishListGrouping = () => {
  const { setModalProps } = usePageContext()
  const { playthroughs, playthroughsLoadingState, createPlaythrough } = usePlaythroughsContext()
  const { wishLists } = useWishListsContext()

  const showPlaythroughForm: MouseEventHandler = (e) => {
    e.preventDefault()

    const submit = (attributes: Playthrough) => {
      createPlaythrough(attributes, () => {
        setModalProps({ hidden: true, children: <></> })
      })
    }

    setModalProps({
      hidden: false,
      children: <PlaythroughForm submitForm={submit} type="create" />,
    })
  }

  if (playthroughsLoadingState === DONE && !playthroughs.length)
    return (
      <p className={styles.noLists}>
        You need a playthrough to use the wish lists feature.{' '}
        <button className={styles.link} onClick={showPlaythroughForm}>
          Create a playthrough
        </button>{' '}
        to get started.
      </p>
    )

  if (!wishLists.length)
    return <p className={styles.noLists}>This playthrough has no wish lists.</p>

  return (
    <div className={styles.root}>
      {wishLists.map(({ id, title, aggregate, list_items }, index) => {
        const colorIndex =
          index < colorSchemes.length ? index : index % colorSchemes.length
        const itemKey = title.toLowerCase().replace(' ', '-')

        return (
          <ColorProvider key={itemKey} colorScheme={colorSchemes[colorIndex]}>
            <div className={styles.wishList}>
              <WishList listId={id} title={title} editable={!aggregate}>
                {(list_items.length &&
                  list_items.map(
                    ({ id, description, quantity, unit_weight, notes }) => {
                      return (
                        <WishListItem
                          key={`${description
                            .toLowerCase()
                            .replace(' ', '-')}-${id}`}
                          itemId={id}
                          listTitle={title}
                          description={description}
                          quantity={quantity}
                          unitWeight={unit_weight}
                          notes={notes}
                          editable={!aggregate}
                        />
                      )
                    }
                  )) ||
                  null}
              </WishList>
            </div>
          </ColorProvider>
        )
      })}
    </div>
  )
}

export default WishListGrouping
