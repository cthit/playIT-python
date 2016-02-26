export const PLAYLIST_ADD_NEW = Symbol()
export const PLAYLIST_UPVOTE = Symbol()
export const PLAYLIST_DOWNVOTE = Symbol()
export const PLAYLIST_UPDATE = Symbol()
export const PLAYLIST_REMOVE = Symbol()


export const addNewPlaylist = (playlist) => ({
    type: PLAYLIST_ADD_NEW,
    playlist
})

export const upvotePlaylist = (playlist) => ({
    type: PLAYLIST_UPVOTE,
    playlist
})

export const downvotePlaylist = (playlist) => ({
    type: PLAYLIST_DOWNVOTE,
    playlist
})

export const updatePlaylist = (playlist) => ({
    type: PLAYLIST_UPDATE,
    playlist
})

export const removePlaylist = (playlist) => ({
    type: PLAYLIST_REMOVE,
    playlist
})