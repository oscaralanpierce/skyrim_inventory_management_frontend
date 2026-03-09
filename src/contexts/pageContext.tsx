import { createContext, useState, useEffect, useRef } from 'react'
import { type ApiCalls, type Resource, type HttpVerb } from '../types/apiCalls'
import { ProviderProps } from '../types/contexts'
import { type FlashProps, type ModalProps } from '../types/pageContext'

interface PageContextType {
  flashProps: FlashProps
  setFlashProps: (props: FlashProps) => void
  modalProps: ModalProps
  setModalProps: (props: ModalProps) => void
  apiCallsInProgress: ApiCalls
  addApiCall: (key: Resource, value: HttpVerb) => void
  removeApiCall: (key: Resource, value: HttpVerb) => void
}

const defaultFlashProps: FlashProps = {
  type: 'info',
  message: '',
  hidden: true,
}

const defaultModalProps: ModalProps = {
  hidden: true,
  children: <></>,
}

const defaultApiCallStatus: ApiCalls = {
  games: [],
  wishLists: [],
  wishListItems: [],
}

const PageContext = createContext<PageContextType>({
  flashProps: defaultFlashProps,
  modalProps: defaultModalProps,
  apiCallsInProgress: defaultApiCallStatus,
  setFlashProps: () => {},
  setModalProps: () => {},
  addApiCall: () => {},
  removeApiCall: () => {},
})

const PageProvider = ({ children }: ProviderProps) => {
  const [flashProps, setFlashProps] = useState<FlashProps>(defaultFlashProps)
  const [modalProps, setModalProps] = useState<ModalProps>(defaultModalProps)
  const [apiCallsInProgress, setApiCallsInProgress] =
    useState<ApiCalls>(defaultApiCallStatus)

  const flashVisibleSince = useRef(0)

  const addApiCall = (key: Resource, value: HttpVerb) => {
    setApiCallsInProgress({
      ...apiCallsInProgress,
      [key]: [...apiCallsInProgress[key], value],
    })
  }

  const removeApiCall = (key: Resource, value: HttpVerb) => {
    setApiCallsInProgress({
      ...apiCallsInProgress,
      [key]: apiCallsInProgress[key].filter((verb) => verb !== value),
    })
  }

  const value = {
    flashProps,
    modalProps,
    apiCallsInProgress,
    setFlashProps,
    setModalProps,
    addApiCall,
    removeApiCall,
  }

  useEffect(() => {
    if (flashProps.hidden === true) return

    flashVisibleSince.current = Number(new Date())

    setTimeout(() => {
      if (Number(new Date()) - flashVisibleSince.current >= 4000) {
        setFlashProps({ ...flashProps, hidden: true })
        flashVisibleSince.current = 0
      }
    }, 4000)
  }, [flashProps])

  return <PageContext value={value}>{children}</PageContext>
}

export { PageContext, PageProvider }
