export type HttpVerb = 'get' | 'post' | 'patch' | 'delete'

export type Resource = 'playthroughs' | 'wishLists' | 'wishListItems'

export interface ApiCalls {
  playthroughs: HttpVerb[]
  wishLists: HttpVerb[]
  wishListItems: HttpVerb[]
}
