import backend from '../lib/backend'

export const TRACK_ADD_NEW = 'TRACK_ADD_NEW'
export const TRACK_UPVOTE = 'TRACK_UPVOTE'
export const TRACK_DOWNVOTE = 'TRACK_DOWNVOTE'
export const TRACK_UPDATE = 'TRACK_UPDATE'
export const TRACK_REMOVE = 'TRACK_REMOVE'
export const TRACKS_REQUEST = 'TRACKS_REQUEST'
export const TRACK_RECEIVE = 'TRACK_RECEIVE'
export const TRACKS_RECEIVE_SUCCESS = 'TRACKS_RECEIVE_SUCCESS'
export const TRACKS_RECEIVE_ERROR = 'TRACKS_RECEIVE_ERROR'
export const TRACKS_FEED_NAVIGATE = 'TRACKS_FEED_NAVIGATE'
export const TRACKS_FEED_NAVIGATE_SET = 'TRACKS_FEED_NAVIGATE_SET'
export const TRACKS_FEED_NAVIGATE_TOP = 'TRACKS_FEED_NAVIGATE_TOP'
export const TRACKS_FEED_NAVIGATE_BOTTOM = 'TRACKS_FEED_NAVIGATE_BOTTOM'

function addVote(track, vote) {
  backend.call('add_vote', {
    vote,
    id: track.id,
    type: track.type
  })
}

export const addNewItem = (track) => {
  backend.call('add_item', {
    ...track
  });
  return {
    type: TRACK_ADD_NEW,
    track
  }
}

export const receiveItem = (track) => {
  return {
    type: TRACK_RECEIVE,
    track
  }
}

export const upvoteItem = (track) => {
    addVote(track, 1)
    return {
      type: TRACK_UPVOTE,
      track
    }
}

export const downvoteItem = (track) => {
    addVote(track, -1)
    return {
      type: TRACK_DOWNVOTE,
      track
    }
}

export const updateItem = (track) => ({
    type: TRACK_UPDATE,
    track
})

export const removeItem = (track) => {
  backend.call('remove_item', {
    ...track
  });
  return {
    type: TRACK_REMOVE,
    track
  }
}

export const requestItems = () => ({
    type: TRACKS_REQUEST
})

export const receiveItemsSuccess = (tracks) => ({
    type: TRACKS_RECEIVE_SUCCESS,
    tracks
})

export const receiveItemsError = (error) => ({
    type: TRACKS_RECEIVE_ERROR,
    error
})

export const feedNavigate = (direction) => ({
    type: TRACKS_FEED_NAVIGATE,
    direction
})

export const setFeedNavigate = (trackId) => ({
    type: TRACKS_FEED_NAVIGATE_SET,
    trackId
})

export const feedNavigateTop = () => ({
    type: TRACKS_FEED_NAVIGATE_TOP
})

export const feedNavigateBottom = () => ({
    type: TRACKS_FEED_NAVIGATE_BOTTOM
})
