import { type RequestWishListItem } from '../../types/apiData'
import { useWishListsContext } from '../../hooks/contexts'
import ListItemCreateForm, { type SubmitHandlerType } from '../listItemCreateForm/listItemCreateForm';
import { type CallbackFunction } from '../../types/functions'

interface CreateFormProps {
  listId: number
}

const WishListItemCreateForm = ({ listId }: CreateFormProps) => {
  const { createWishListItem } = useWishListsContext()

  const onSubmit: SubmitHandlerType = (
    attributes: RequestWishListItem,
    onSuccess: CallbackFunction,
    onError: CallbackFunction
  ) => {
    createWishListItem(listId, attributes, onSuccess, onError)
  }

  return <ListItemCreateForm listId={listId} resource='Wish list' onSubmit={onSubmit} />
}

export default WishListItemCreateForm
