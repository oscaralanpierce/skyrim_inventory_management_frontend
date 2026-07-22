import {
  useState,
  useEffect,
} from 'react'
import { type RequestWishList } from '../../types/apiData'
import { DONE } from '../../utils/loadingStates'
import {
  usePageContext,
  usePlaythroughsContext,
  useWishListsContext,
} from '../../hooks/contexts'
import ListCreateForm, { SubmitHandlerType } from '../listCreateForm/listCreateForm'
import { CallbackFunction } from '../../types/functions';

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

  const onSubmit: SubmitHandlerType = (
    attributes: RequestWishList,
    onSuccess?: CallbackFunction | null,
    onError?: CallbackFunction | null,
  ) => {
    createWishList(attributes, onSuccess, onError)
  }

  useEffect(() => {
    setDisabled(
      playthroughsLoadingState !== DONE ||
      wishListsLoadingState !== DONE ||
      !!apiCallsInProgress.wishLists.length
    )
  }, [playthroughsLoadingState, wishListsLoadingState, apiCallsInProgress])

  return <ListCreateForm onSubmit={onSubmit} disabled={disabled} />
}

export default WishListCreateForm
