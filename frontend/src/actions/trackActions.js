export const TRACK_ADD_NEW = 'TRACK_ADD_NEW'
export const TRACK_UPVOTE = 'TRACK_UPVOTE'
export const TRACK_DOWNVOTE = 'TRACK_DOWNVOTE'
export const TRACK_UPDATE = 'TRACK_UPDATE'
export const TRACK_REMOVE = 'TRACK_REMOVE'
export const TRACKS_REQUEST = 'TRACKS_REQUEST'
export const TRACKS_RECEIVE_SUCCESS = 'TRACKS_RECEIVE_SUCCESS'
export const TRACKS_RECEIVE_ERROR = 'TRACKS_RECEIVE_ERROR'


export const addNewTrack = (track) => ({
    type: TRACK_ADD_NEW,
    track
})

export const upvoteTrack = (track) => ({
    type: TRACK_UPVOTE,
    track
})

export const downvoteTrack = (track) => ({
    type: TRACK_DOWNVOTE,
    track
})

export const updateTrack = (track) => ({
    type: TRACK_UPDATE,
    track
})

export const removeTrack = (track) => ({
    type: TRACK_REMOVE,
    track
})

export const requestTracks = () => ({
    type: TRACKS_REQUEST
})

export const receiveTracksSuccess = (tracks) => ({
    type: TRACKS_RECEIVE_SUCCESS,
    tracks
})

export const receiveTracksError = (error) => ({
    type: TRACKS_RECEIVE_ERROR,
    error
})