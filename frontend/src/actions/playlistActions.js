export const PLAYLIST_ADD_NEW = 'PLAYLIST_ADD_NEW'
export const PLAYLIST_UPVOTE = 'PLAYLIST_UPVOTE'
export const PLAYLIST_DOWNVOTE = 'PLAYLIST_DOWNVOTE'
export const PLAYLIST_UPDATE = 'PLAYLIST_UPDATE'
export const PLAYLIST_REMOVE = 'PLAYLIST_REMOVE'
export const PLAYLISTS_REQUEST = 'PLAYLISTS_REQUEST'
export const PLAYLIST_RECEIVE = 'PLAYLIST_RECEIVE'
export const PLAYLISTS_RECEIVE_SUCCESS = 'PLAYLISTS_RECEIVE_SUCCESS'
export const PLAYLISTS_RECEIVE_ERROR = 'PLAYLISTS_RECEIVE_ERROR'
export const PLAYLISTS_FEED_NAVIGATE = 'PLAYLISTS_FEED_NAVIGATE'
export const PLAYLISTS_FEED_NAVIGATE_SET = 'PLAYLISTS_FEED_NAVIGATE_SET'
export const PLAYLISTS_FEED_NAVIGATE_TOP = 'PLAYLISTS_FEED_NAVIGATE_TOP'
export const PLAYLISTS_FEED_NAVIGATE_BOTTOM = 'PLAYLISTS_FEED_NAVIGATE_BOTTOM'

export const addNewItem = (playlist) => ({
    type: PLAYLIST_ADD_NEW,
    playlist
})

export const receiveItem = (playlist) => {
  return {
    type: PLAYLIST_RECEIVE,
    playlist
  }
}

export const upvoteItem = (playlist) => ({
    type: PLAYLIST_UPVOTE,
    playlist
})

export const downvoteItem = (playlist) => ({
    type: PLAYLIST_DOWNVOTE,
    playlist
})

export const updateItem = (playlist) => ({
    type: PLAYLIST_UPDATE,
    playlist
})

export const removeItem = (playlist) => ({
    type: PLAYLIST_REMOVE,
    playlist
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
    type: TRACKS_FEED_NAVIGATE_SET,
    playlistId
})

export const feedNavigateTop = () => ({
    type: PLAYLISTS_FEED_NAVIGATE_TOP
})

export const feedNavigateBottom = () => ({
    type: PLAYLISTS_FEED_NAVIGATE_BOTTOM
})
