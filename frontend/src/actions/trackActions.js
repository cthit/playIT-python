export const TRACK_ADD_NEW = Symbol()
export const TRACK_UPVOTE = Symbol()
export const TRACK_DOWNVOTE = Symbol()
export const TRACK_UPDATE = Symbol()
export const TRACK_REMOVE = Symbol()


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