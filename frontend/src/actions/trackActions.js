import backend from '../lib/backend'

export const TRACK_ADD_NEW = 'TRACK_ADD_NEW'
export const TRACK_UPVOTE = 'TRACK_UPVOTE'
export const TRACK_DOWNVOTE = 'TRACK_DOWNVOTE'
export const TRACK_UPDATE = 'TRACK_UPDATE'
export const TRACK_REMOVE = 'TRACK_REMOVE'
export const TRACK_REQUEST_REMOVE = 'TRACK_REQUEST_REMOVE'
export const TRACKS_REQUEST = 'TRACKS_REQUEST'
export const TRACK_RECEIVE = 'TRACK_RECEIVE'
export const TRACK_RECEIVE_SUCCESS = 'TRACK_RECEIVE_SUCCESS'
export const TRACKS_RECEIVE_SUCCESS = 'TRACKS_RECEIVE_SUCCESS'
export const TRACKS_RECEIVE_ERROR = 'TRACKS_RECEIVE_ERROR'
export const TRACKS_FEED_NAVIGATE = 'TRACKS_FEED_NAVIGATE'
export const TRACKS_FEED_NAVIGATE_SET = 'TRACKS_FEED_NAVIGATE_SET'
export const TRACKS_FEED_NAVIGATE_TOP = 'TRACKS_FEED_NAVIGATE_TOP'
export const TRACKS_FEED_NAVIGATE_BOTTOM = 'TRACKS_FEED_NAVIGATE_BOTTOM'

export const addNewItem = (item) => ({
  type: TRACK_ADD_NEW,
  item
})

export const receiveItem = (item) => ({
  type: TRACK_RECEIVE,
  item
})

export const upvoteItem = (item) => ({
  type: TRACK_UPVOTE,
  user_vote: 1,
  item
})

export const downvoteItem = (item) => ({
  type: TRACK_DOWNVOTE,
  user_vote: -1,
  item
})

export const updateItem = (item) => ({
  type: TRACK_UPDATE,
  item
})

export const removeItem = (item) => ({
  type: TRACK_REMOVE,
  item
})

export const requestRemoveItem = (item) => ({
  type: TRACK_REQUEST_REMOVE,
  item
})

export const requestItems = () => ({
  type: TRACKS_REQUEST
})

export const receiveItemsSuccess = (items) => ({
  type: TRACKS_RECEIVE_SUCCESS,
  items
})

export const receiveItemSuccess = (item) => ({
  type: TRACK_RECEIVE_SUCCESS,
  item
})

export const receiveItemsError = (error) => ({
  type: TRACKS_RECEIVE_ERROR,
  error
})

export const feedNavigate = (direction) => ({
  type: TRACKS_FEED_NAVIGATE,
  direction
})

export const setFeedNavigate = (id) => ({
  type: TRACKS_FEED_NAVIGATE_SET,
  id
})

export const feedNavigateTop = () => ({
  type: TRACKS_FEED_NAVIGATE_TOP
})

export const feedNavigateBottom = () => ({
  type: TRACKS_FEED_NAVIGATE_BOTTOM
})
