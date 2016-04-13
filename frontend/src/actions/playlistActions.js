export const PLAYLIST_ADD_NEW = 'PLAYLIST_ADD_NEW'
export const PLAYLIST_UPVOTE = 'PLAYLIST_UPVOTE'
export const PLAYLIST_DOWNVOTE = 'PLAYLIST_DOWNVOTE'
export const PLAYLIST_UPDATE = 'PLAYLIST_UPDATE'
export const PLAYLIST_REMOVE = 'PLAYLIST_REMOVE'
export const PLAYLIST_REQUEST_REMOVE = 'PLAYLIST_REQUEST_REMOVE'
export const PLAYLISTS_REQUEST = 'PLAYLISTS_REQUEST'
export const PLAYLIST_RECEIVE = 'PLAYLIST_RECEIVE'
export const PLAYLIST_RECEIVE_SUCCESS = 'PLAYLIST_RECEIVE_SUCCESS'
export const PLAYLISTS_RECEIVE_SUCCESS = 'PLAYLISTS_RECEIVE_SUCCESS'
export const PLAYLISTS_RECEIVE_ERROR = 'PLAYLISTS_RECEIVE_ERROR'
export const PLAYLISTS_FEED_NAVIGATE = 'PLAYLISTS_FEED_NAVIGATE'
export const PLAYLISTS_FEED_NAVIGATE_SET = 'PLAYLISTS_FEED_NAVIGATE_SET'
export const PLAYLISTS_FEED_NAVIGATE_TOP = 'PLAYLISTS_FEED_NAVIGATE_TOP'
export const PLAYLISTS_FEED_NAVIGATE_BOTTOM = 'PLAYLISTS_FEED_NAVIGATE_BOTTOM'

export const addNewItem = (item) => ({
  type: PLAYLIST_ADD_NEW,
  item
})

export const receiveItem = (item) => ({
  type: PLAYLIST_RECEIVE,
  item
})

export const receiveItemSuccess = (item) => ({
  type: PLAYLIST_RECEIVE_SUCCESS,
  item
})

export const upvoteItem = (item) => ({
  type: PLAYLIST_UPVOTE,
  user_vote: 1,
  item
})

export const downvoteItem = (item) => ({
  type: PLAYLIST_DOWNVOTE,
  user_vote: -1,
  item
})

export const updateItem = (item) => ({
  type: PLAYLIST_UPDATE,
  item
})

export const removeItem = (item) => ({
  type: PLAYLIST_REMOVE,
  item
})

export const requestRemoveItem = (item) => ({
  type: PLAYLIST_REQUEST_REMOVE,
  item
})

export const requestItem = () => ({
  type: PLAYLISTS_REQUEST
})

export const receiveItemsSuccess = (playlists) => ({
  type: PLAYLISTS_RECEIVE_SUCCESS,
  playlists
})

export const receiveItemsError = (error) => ({
  type: PLAYLISTS_RECEIVE_ERROR,
  error
})

export const feedNavigate = (direction) => ({
  type: PLAYLISTS_FEED_NAVIGATE,
  direction
})

export const setFeedNavigate = (playlistId) => ({
  type: PLAYLISTS_FEED_NAVIGATE_SET,
  playlistId
})

export const feedNavigateTop = () => ({
  type: PLAYLISTS_FEED_NAVIGATE_TOP
})

export const feedNavigateBottom = () => ({
  type: PLAYLISTS_FEED_NAVIGATE_BOTTOM
})
