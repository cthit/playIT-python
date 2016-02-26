export const SET_NOW_PLAYING = Symbol()
export const SHOW_TRACKS = Symbol()
export const SHOW_PLAYLISTS = Symbol()

export const setNowPlaying = (item) => ({
    type: SET_NOW_PLAYING,
    item
})

export const showTracks = () => ({
    type: SHOW_TRACKS
})

export const showPlaylists = () => ({
    type: SHOW_PLAYLISTS
})