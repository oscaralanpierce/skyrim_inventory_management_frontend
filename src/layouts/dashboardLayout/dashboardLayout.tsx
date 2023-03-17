import {
  useState,
  useEffect,
  type KeyboardEventHandler,
  type ReactElement,
} from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { usePageContext, useGamesContext } from '../../hooks/contexts'
import { useQueryString } from '../../hooks/useQueryString'
import DashboardHeader from '../../components/dashboardHeader/dashboardHeader'
import FlashMessage from '../../components/flashMessage/flashMessage'
import StyledSelect, {
  type SelectOption,
} from '../../components/styledSelect/styledSelect'
import Modal from '../../components/modal/modal'
import styles from './dashboardLayout.module.css'
import { DONE } from '../../utils/loadingStates'

interface DashboardLayoutProps {
  title?: string
  includeGameSelector?: boolean
  children: ReactElement | string
}

const DashboardLayout = ({
  title,
  includeGameSelector,
  children,
}: DashboardLayoutProps) => {
  const { flashProps, modalProps, setModalProps } = usePageContext()
  const { games, gamesLoadingState } = useGamesContext()

  const queryString = useQueryString()
  const navigate = useNavigate()

  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([])
  const [defaultOption, setDefaultOption] = useState<SelectOption | null>(null)
  const [selectPlaceholder, setSelectPlaceholder] = useState('Games loading...')

  const onOptionSelected = (optionValue: number | string) => {
    queryString.set('gameId', String(optionValue))
    navigate(`?${queryString.toString()}`)
  }

  const hideModalIfEsc: KeyboardEventHandler = (e) => {
    if (e.key !== 'Escape') return

    setModalProps({ hidden: true, children: <></> })
  }

  useEffect(() => {
    if (includeGameSelector && gamesLoadingState === DONE) {
      const options: SelectOption[] = games.map(({ name, id }) => ({
        optionName: name,
        optionValue: id,
      }))
      setSelectOptions(options)
      setSelectPlaceholder(options.length ? '' : 'No games available')

      const gameId = Number(queryString.get('gameId'))

      if (gameId) {
        const defOption = options.find(
          ({ optionValue }) => optionValue === gameId
        )
        setDefaultOption(defOption || null)
      } else {
        setDefaultOption(options[0])
      }
    }
  }, [includeGameSelector, gamesLoadingState, games, queryString])

  return (
    <main className={styles.root} onKeyUp={hideModalIfEsc}>
      <section className={styles.container}>
        {title || includeGameSelector ? (
          <>
            <div className={styles.titleContainer}>
              {title && <h2 className={styles.title}>{title}</h2>}
              {includeGameSelector && (
                <StyledSelect
                  options={selectOptions}
                  placeholder={selectPlaceholder}
                  onOptionSelected={onOptionSelected}
                  defaultOption={defaultOption}
                  className={styles.select}
                />
              )}
            </div>
            <hr
              className={classNames(styles.hr, {
                [styles.hiddenDivider]: includeGameSelector && !title,
              })}
            />
          </>
        ) : null}
        {children}
      </section>
      <DashboardHeader />
      <FlashMessage {...flashProps} />
      <Modal {...modalProps} />
    </main>
  )
}

export default DashboardLayout
