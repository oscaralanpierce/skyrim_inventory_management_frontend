import {
  useState,
  useEffect,
  type KeyboardEventHandler,
  type ReactElement,
} from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { ResponsePlaythrough } from '../../types/apiData'
import { DONE } from '../../utils/loadingStates'
import { usePageContext, usePlaythroughsContext } from '../../hooks/contexts'
import { useQueryString } from '../../hooks/useQueryString'
import DashboardHeader from '../../components/dashboardHeader/dashboardHeader'
import FlashMessage from '../../components/flashMessage/flashMessage'
import StyledSelect, {
  type SelectOption,
} from '../../components/styledSelect/styledSelect'
import Modal from '../../components/modal/modal'
import styles from './dashboardLayout.module.css'

interface DashboardLayoutProps {
  title?: string
  includePlaythroughSelector?: boolean
  children: ReactElement | string
}

const DashboardLayout = ({
  title,
  includePlaythroughSelector,
  children,
}: DashboardLayoutProps) => {
  const { flashProps, modalProps, setModalProps } = usePageContext()
  const { playthroughs, createPlaythrough, playthroughsLoadingState } = usePlaythroughsContext()

  const queryString = useQueryString()
  const navigate = useNavigate()

  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([])
  const [defaultOption, setDefaultOption] = useState<SelectOption | null>(null)
  const [selectPlaceholder, setSelectPlaceholder] = useState('Playthroughs loading...')

  const onOptionSelected = (optionValue: number | string) => {
    setQueryString(optionValue)
  }

  const setQueryString = (id: number | string) => {
    queryString.set('playthroughId', String(id))
    void navigate(`?${queryString.toString()}`)
  }

  const onSubmitInput = (name: string) => {
    createPlaythrough(
      { name },
      ({ id }: ResponsePlaythrough) => setQueryString(id),
      () =>
        setDefaultOption({
          optionName: playthroughs[0].name,
          optionValue: playthroughs[0].id,
        })
    )
  }

  const hideModalIfEsc: KeyboardEventHandler = (e) => {
    if (e.key !== 'Escape') return

    setModalProps({ hidden: true, children: <></> })
  }

  useEffect(() => {
    if (includePlaythroughSelector && playthroughsLoadingState === DONE) {
      const options: SelectOption[] = playthroughs.map(({ name, id }) => ({
        optionName: name,
        optionValue: id,
      }))
      setSelectOptions(options)
      setSelectPlaceholder(options.length ? '' : 'No playthroughs available')

      const playthroughId = Number(queryString.get('playthroughId'))

      if (playthroughId) {
        const defOption = options.find(
          ({ optionValue }) => optionValue === playthroughId
        )
        setDefaultOption(defOption || null)
      } else {
        setDefaultOption(options[0])
      }
    }
  }, [includePlaythroughSelector, playthroughsLoadingState, playthroughs, queryString])

  return (
    <main className={styles.root} onKeyUp={hideModalIfEsc}>
      <section className={styles.container}>
        {title || includePlaythroughSelector ? (
          <>
            <div className={styles.titleContainer}>
              {title && <h2 className={styles.title}>{title}</h2>}
              {includePlaythroughSelector && (
                <StyledSelect
                  options={selectOptions}
                  placeholder={selectPlaceholder}
                  onOptionSelected={onOptionSelected}
                  onSubmitInput={onSubmitInput}
                  defaultOption={defaultOption}
                  className={styles.select}
                  disabled={playthroughsLoadingState !== DONE}
                />
              )}
            </div>
            <hr
              className={classNames(styles.hr, {
                [styles.hiddenDivider]: includePlaythroughSelector && !title,
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
